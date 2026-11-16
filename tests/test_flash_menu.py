import json
import os
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import unittest
import zlib
from pathlib import Path

BLOG = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BLOG / 'scripts'))
from repair_flash_menu import repair_menu, swf_tags
from validate_site import missing_local_paths


class FlashMenuTests(unittest.TestCase):
    def test_output_validation_checks_destinations_inside_the_menu_map(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            menu = output / 'theme/step/menu-links.json'
            menu.parent.mkdir(parents=True)
            menu.write_text(json.dumps([
                {'destination': '/missing-menu-page/'},
                {'destination': '/existing/'},
                {'destination': 'mailto:public@example.test'},
            ]))
            (output / 'existing').mkdir()
            (output / 'existing/index.html').write_text('Existing destination')
            self.assertEqual(missing_local_paths(output, 'https://example.test/preview/'),
                             {'/missing-menu-page/'})

    def test_navigation_target_repair_preserves_artwork_and_is_idempotent(self):
        url = 'https://example.test/collection/'
        action = url.encode() + b'\0_parent\0'
        actions = b'\x83' + struct.pack('<H', len(action)) + action + b'\0'
        button = b'\x01\0\0\x03\0\0' + b'\0\0\x08\0' + actions
        def tag(code, data):
            return struct.pack('<HI', (code << 6) | 63, len(data)) + data
        # A zero-size synthetic RECT, frame rate/count, graphic tag and button.
        payload = b'\0\0\x0c\x01\0' + tag(2, b'unchanged artwork') + tag(34, button) + b'\0\0'
        original = b'FWS\x05' + struct.pack('<I', len(payload) + 8) + payload
        repaired, links = repair_menu(original, {url})
        self.assertEqual(links, [(url, '_blank')])
        self.assertNotIn(b'_parent', repaired)
        self.assertIn(b'_blank', repaired)
        before = swf_tags(original)[1]
        after = swf_tags(repaired)[1]
        self.assertEqual(before[0], after[0])
        self.assertEqual(before[1][1][:6], after[1][1][:6])
        self.assertEqual(repair_menu(repaired, {url})[0], repaired)
        compressed = b'CWS' + original[3:8] + zlib.compress(original[8:])
        compressed_result, _ = repair_menu(compressed, {url})
        self.assertEqual(swf_tags(compressed_result), swf_tags(repaired))
        with self.assertRaisesRegex(ValueError, 'Unreviewed'):
            repair_menu(original, set())

    def test_every_embedded_legacy_destination_has_an_explicit_mapping(self):
        movie = (BLOG / 'theme-overrides/static/theme/step/menu.swf').read_bytes()
        payload = zlib.decompress(movie[8:]) if movie[:3] == b'CWS' else movie[8:]
        urls = {u.decode() for u in re.findall(rb'(?:https?://|mailto:)[^\x00\s<>]+', payload)}
        links = json.loads((BLOG / 'theme-overrides/static/theme/step/menu-links.json').read_text())
        self.assertEqual({link['legacy'] for link in links}, urls)
        self.assertEqual(len(links), len(urls))
        self.assertTrue(all(link['destination'] != '/' for link in links))
        self.assertEqual(repair_menu(movie, urls)[0], movie,
                         'Current-tab targets would be blocked with script access disabled')

    def test_collection_pages_have_no_invented_article_date_or_comment_identity(self):
        with tempfile.TemporaryDirectory() as directory:
            site = Path(directory)
            (site / 'hugo.toml').write_text('baseURL = "https://example.test/"\nlocale = "fr-FR"\n')
            (site / 'content').mkdir()
            (site / 'content/collection.md').write_text(
                '---\ntitle: Collection\nlayout: collection\nurl: /collection/\n---\nReviewed article links.')
            (site / 'layouts').mkdir()
            (site / 'layouts/baseof.html').write_text('{{ block "main" . }}{{ end }}')
            (site / 'layouts/home.html').write_text('Fixture home')
            (site / 'layouts/list.html').write_text('Fixture list')
            layout = BLOG / 'theme-overrides/layouts/collection.html'
            self.assertTrue(layout.is_file(), 'Collection pages need their own non-article layout')
            shutil.copyfile(layout, site / 'layouts/collection.html')
            command = [os.environ['HUGO_BIN']] if os.environ.get('HUGO_BIN') else [
                'rtk', 'proxy', 'sh', str(BLOG / 'scripts/mise-local.sh'), 'exec', '--', 'hugo']
            result = subprocess.run(command + ['build', '--source', str(site), '--panicOnWarning'],
                                    capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            page = (site / 'public/collection/index.html').read_text()
            self.assertIn('<h1', page)
            self.assertIn('Reviewed article links.', page)
            for invented in ('post-', 'Publié le', 'comment-'):
                self.assertNotIn(invented, page)
