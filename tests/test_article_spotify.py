"""Render real article audio shortcodes with Hugo at both deployment base paths."""
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from html.parser import HTMLParser

BLOG = Path(__file__).resolve().parents[1]


class Media(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.players, self.links = [], []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'iframe':
            self.players.append(attrs)
        if tag == 'a':
            self.links.append(attrs.get('href'))


class ArticleSpotifyTests(unittest.TestCase):
    def build(self, directory, body, prefix):
        root = Path(directory)
        (root / 'layouts/shortcodes').mkdir(parents=True, exist_ok=True)
        template = BLOG / 'theme-overrides/layouts/shortcodes/spotify-track.html'
        self.assertTrue(template.is_file(), 'Missing maintained Spotify shortcode')
        shutil.copyfile(template, root / 'layouts/shortcodes/spotify-track.html')
        (root / 'layouts/page.html').write_text('<main class="entry-content">{{ .Content }}</main>')
        (root / 'layouts/home.html').write_text('Fixture home')
        (root / 'content').mkdir(exist_ok=True)
        (root / 'content/art.md').write_text('---\ntitle: Artwork\n---\n' + body)
        (root / 'hugo.toml').write_text('disableKinds = ["taxonomy", "term", "RSS", "sitemap"]\n')
        command = ([os.environ['HUGO_BIN']] if os.environ.get('HUGO_BIN') else
                   ['rtk', 'proxy', 'sh', str(BLOG / 'scripts/mise-local.sh'), 'exec', '--', 'hugo'])
        result = subprocess.run(command + ['build', '--source', str(root), '--baseURL',
                                'https://example.test' + prefix, '--panicOnWarning'], capture_output=True, text=True)
        return result, root / 'public/art/index.html'

    def test_compact_dark_player_has_accessible_title_permissions_and_direct_fallback(self):
        for prefix in ('/', '/overstep-website/'):
            with self.subTest(prefix=prefix), tempfile.TemporaryDirectory() as directory:
                result, path = self.build(directory,
                    '{{< spotify-track id="3BKKB440Xqlb2eDYzOl1bS" title="The Dø — Dust It Off" >}}', prefix)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                media = Media(path.read_text())
                player, = media.players
                self.assertEqual(player['src'], 'https://open.spotify.com/embed/track/3BKKB440Xqlb2eDYzOl1bS?theme=0')
                self.assertEqual(player['height'], '152')
                self.assertEqual(player['width'], '100%')
                self.assertEqual(player['title'], 'The Dø — Dust It Off — Spotify')
                self.assertIn('encrypted-media', player['allow'].split('; '))
                self.assertIn('fullscreen', player['allow'].split('; '))
                self.assertIn('https://open.spotify.com/track/3BKKB440Xqlb2eDYzOl1bS', media.links)
                self.assertNotIn('dewplayer', path.read_text())

    def test_unreviewed_track_identifiers_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            result, _ = self.build(directory, '{{< spotify-track id="../unreviewed" title="Fixture" >}}', '/')
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('Invalid Spotify track ID', result.stderr + result.stdout)
