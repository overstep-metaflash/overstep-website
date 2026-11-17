"""Verify the native navigation, preserved movie and safe extracted assets."""
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

BLOG = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BLOG / 'scripts'))
from generate_native_totem import reachable_definitions, renderer_source
from validate_native_totem import navigation_errors


class NativeTotemTests(unittest.TestCase):
    def test_dependencies_are_complete_and_exclude_unused_drawings(self):
        import xml.etree.ElementTree as E
        defs = E.fromstring('<defs><g id="a"><use href="#b"/></g><path id="b" fill="url(#gradient)"/><linearGradient id="gradient"/><path id="unused"/></defs>')
        self.assertEqual(reachable_definitions(defs, {'a'}), {'a', 'b', 'gradient'})
        with self.assertRaisesRegex(ValueError, 'Missing SVG definition'):
            reachable_definitions(defs, {'missing'})

    def test_original_swf_and_every_extracted_audio_payload_are_pinned(self):
        manifest = json.loads((BLOG / 'docs/native-totem.json').read_text())
        self.assertEqual(manifest['source_sha256'], 'eb3fb39dbec9e956f2a0e6b294c1d2a0aeacbfb594da07c9e41e11607c0f3735')
        movie = BLOG / 'theme-overrides/static/theme/step/menu.swf'
        self.assertEqual(hashlib.sha256(movie.read_bytes()).hexdigest(), manifest['source_sha256'])
        rights = {a['path']: a for a in json.loads((BLOG / 'docs/media-rights.json').read_text())['audio_files']}
        sounds = json.loads((BLOG / 'theme-overrides/static/theme/step/totem/audio.json').read_text())['sounds']
        self.assertEqual(len(sounds), 12)
        for sound in sounds:
            path = '/theme/step/totem/' + sound['file']
            data = (BLOG / 'theme-overrides/static' / path.lstrip('/')).read_bytes()
            self.assertEqual(hashlib.sha256(data).hexdigest(), sound['mp3_sha256'])
            self.assertEqual(rights[path]['sha256'], sound['mp3_sha256'])
            self.assertEqual(rights[path]['redistribution_rights'], 'confirmed_by_owner')

    def test_renderer_has_no_exporter_ui_or_global_character_dispatch(self):
        source = (BLOG / 'theme-overrides/static/js/totem-renderer.js').read_text()
        for obsolete in ('document.getElementById', 'eval(', 'window[', 'width_size', 'height_size'):
            self.assertNotIn(obsolete, source)
        self.assertIn('window.StepTotemRenderer = function(canvas)', source)
        self.assertIn('window.clearInterval(timer)', source)

    def test_actual_partial_renders_all_destinations_at_both_base_paths(self):
        for prefix in ('/', '/overstep-website/'):
            with self.subTest(prefix=prefix), tempfile.TemporaryDirectory() as directory:
                site = Path(directory)
                (site / 'layouts/partials').mkdir(parents=True)
                (site / 'content').mkdir()
                (site / 'hugo.toml').write_text('baseURL = "https://example.test' + prefix + '"\ndisableKinds = ["taxonomy", "term", "RSS", "sitemap"]\n')
                shutil.copyfile(BLOG / 'theme-overrides/layouts/partials/native-totem.html', site / 'layouts/partials/native-totem.html')
                (site / 'layouts/home.html').write_text('{{ partial "native-totem.html" . }}')
                command = [os.environ['HUGO_BIN']] if os.environ.get('HUGO_BIN') else [
                    'rtk', 'proxy', 'sh', str(BLOG / 'scripts/mise-local.sh'), 'exec', '--', 'hugo']
                result = subprocess.run(command + ['build', '--source', str(site), '--panicOnWarning'], capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                html = (site / 'public/index.html').read_text()
                routes = json.loads((BLOG / 'theme-overrides/static/theme/step/menu-links.json').read_text())
                for route in routes:
                    href = prefix + route['destination'].lstrip('/') if route['destination'].startswith('/') else route['destination']
                    self.assertIn('href="' + href + '"', html)
                    self.assertIn('aria-label="' + route['label'] + '"', html)
                self.assertEqual(len(re.findall(r'data-totem-button="\d+"', html)), 9)
                self.assertIn(prefix + 'theme/step/totem/audio.json', html)
                self.assertNotIn('data-swf=', html)
                self.assertNotIn('localhost', html)
                self.assertNotIn('<iframe', html)
                self.assertNotIn('preview', html.lower())
                self.assertLess(len(html), 200_000)
                self.assertEqual(navigation_errors(html, routes, prefix), [])
                self.assertTrue(navigation_errors(html.replace('data-totem-button="103"', 'data-totem-button="999"'), routes, prefix))
                self.assertTrue(navigation_errors(html.replace('href="' + prefix + 'radio/"', 'href="/missing/"'), routes, prefix))


if __name__ == '__main__':
    unittest.main()
