import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from prepare_pages import prefix_file

BLOG = Path(__file__).resolve().parents[1]
PLAYLIST = 'https://open.spotify.com/playlist/6AH0ucKZlI1gOCzLEjqDjx'


class RadioContent(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.links = []
        self.tracks = 0
        self.media = []
        self.players = []
        self.feed(page)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a':
            self.links.append(attrs.get('href', ''))
        if tag == 'li':
            self.tracks += 1
        if tag in {'audio', 'iframe', 'embed', 'object', 'script'}:
            self.media.append(tag)
        if tag == 'iframe':
            self.players.append(attrs)


class RadioTests(unittest.TestCase):
    def test_radio_renders_playlist_and_accessible_tracks_at_both_prefixes(self):
        with tempfile.TemporaryDirectory(prefix='step-radio-') as directory:
            site = Path(directory)
            (site / 'content').mkdir()
            shutil.copyfile(BLOG / 'content/radio.md', site / 'content/radio.md')
            (site / 'layouts').mkdir()
            shutil.copyfile(BLOG / 'theme-overrides/layouts/collection.html', site / 'layouts/collection.html')
            (site / 'layouts/baseof.html').write_text('{{ block "main" . }}{{ end }}')
            (site / 'layouts/home.html').write_text('Synthetic home')
            (site / 'hugo.toml').write_text('disableKinds = ["taxonomy", "term", "RSS", "sitemap"]\n'
                                          '[markup.goldmark.renderer]\nunsafe = true\n')
            command = ([os.environ['HUGO_BIN']] if os.environ.get('HUGO_BIN') else
                       ['rtk', 'proxy', 'sh', str(BLOG / 'scripts/mise-local.sh'), 'exec', '--', 'hugo'])
            for prefix in ('/', '/overstep-website/'):
                with self.subTest(prefix=prefix):
                    result = subprocess.run(command + ['build', '--source', str(site), '--baseURL',
                                            'https://example.test' + prefix, '--panicOnWarning'],
                                            capture_output=True, text=True)
                    self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                    page = site / 'public/radio/index.html'
                    prefix_file(page, prefix)
                    html = page.read_text()
                    content = RadioContent(html)
                    self.assertIn(PLAYLIST, content.links)
                    tracks = [link for link in content.links if link.startswith('https://open.spotify.com/track/')]
                    self.assertEqual(len(set(tracks)), 16)
                    self.assertEqual(content.tracks, 16)
                    self.assertEqual(content.media, ['iframe'])
                    player, = content.players
                    self.assertEqual(player['src'],
                                     'https://open.spotify.com/embed/playlist/6AH0ucKZlI1gOCzLEjqDjx?theme=0')
                    self.assertEqual(player['width'], '100%')
                    self.assertEqual(player['height'], '352')
                    self.assertTrue(player['title'].strip())
                    self.assertIn('encrypted-media', player['allow'].split('; '))
                    self.assertIn('fullscreen', player['allow'].split('; '))
                    self.assertNotIn('.mp3', html)
                    self.assertIn('Super Mario Bros 3', html)
                    self.assertIn('Another World', html)
                    self.assertIn('indisponible', html)

    def test_radio_destination_is_required_and_release_approval_stays_disabled(self):
        missing = json.loads((BLOG / 'docs/remaining-local-links.json').read_text())
        self.assertNotIn('/radio/', missing)
        mappings = json.loads((BLOG / 'theme-overrides/static/theme/step/menu-links.json').read_text())
        self.assertEqual(next(m['destination'] for m in mappings if m['label'] == 'Radio'), '/radio/')
        rights = json.loads((BLOG / 'docs/media-rights.json').read_text())
        self.assertFalse(rights['publication_approved'])
