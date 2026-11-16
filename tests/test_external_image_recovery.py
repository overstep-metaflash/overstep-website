"""Keep recovered external artwork linked locally without changing article layout."""

import base64
import hashlib
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


class ArticleLinks(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.links = []
        self.images = []
        self.feed(page)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a':
            self.links.append(attrs)
        if tag == 'img':
            self.images.append(attrs)


class ExternalImageRecoveryTests(unittest.TestCase):
    def test_original_artwork_payloads_match_reviewed_archive_hashes(self):
        manifest = json.loads((BLOG / 'docs/external-image-recovery.json').read_text())
        self.assertEqual({item['post_id'] for item in manifest}, {'1910', '3247'})
        for item in manifest:
            with self.subTest(article=item['post_id']):
                payload = (BLOG / 'static' / item['local_url'].lstrip('/')).read_bytes()
                self.assertEqual(len(payload), item['bytes'])
                self.assertEqual(hashlib.sha256(payload).hexdigest(), item['sha256'])
                self.assertEqual(base64.b32encode(hashlib.sha1(payload).digest()).decode().rstrip('='),
                                 item['archive_sha1_base32'])
                if item['content_type'] == 'image/jpeg':
                    self.assertTrue(payload.startswith(b'\xff\xd8\xff'))
                    self.assertTrue(payload.endswith(b'\xff\xd9'))
                else:
                    self.assertEqual(item['content_type'], 'image/gif')
                    self.assertEqual(payload[:6], b'GIF89a')
                    self.assertEqual(payload[-1:], b';')

    def test_real_articles_link_artwork_at_both_base_paths(self):
        manifest = json.loads((BLOG / 'docs/external-image-recovery.json').read_text())
        with tempfile.TemporaryDirectory(prefix='step-external-images-') as directory:
            site = Path(directory)
            (site / 'content/posts').mkdir(parents=True)
            (site / 'layouts/shortcodes').mkdir(parents=True)
            (site / 'layouts/single.html').write_text('<div class="entry-content">{{ .Content }}</div>')
            (site / 'layouts/home.html').write_text('Synthetic home')
            (site / 'layouts/list.html').write_text('Synthetic section')
            (site / 'layouts/shortcodes/ruffle.html').write_text('<span>Existing Flash player</span>')
            (site / 'hugo.toml').write_text('disableKinds = ["taxonomy", "term", "RSS", "sitemap"]\n'
                                          '[markup.goldmark.renderer]\nunsafe = true\n')
            for item in manifest:
                shutil.copyfile(BLOG / item['source_file'], site / item['source_file'])
                destination = site / 'static' / item['local_url'].lstrip('/')
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(BLOG / 'static' / item['local_url'].lstrip('/'), destination)
            command = ([os.environ['HUGO_BIN']] if os.environ.get('HUGO_BIN') else
                       ['rtk', 'proxy', 'sh', str(BLOG / 'scripts/mise-local.sh'), 'exec', '--', 'hugo'])
            for prefix in ('/', '/overstep-website/'):
                result = subprocess.run(command + ['build', '--source', str(site), '--baseURL',
                                        'https://example.test' + prefix, '--panicOnWarning'],
                                        capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                for item in manifest:
                    with self.subTest(prefix=prefix, article=item['post_id']):
                        page = site / 'public' / item['article_url'].lstrip('/') / 'index.html'
                        prefix_file(page, prefix)
                        html = page.read_text()
                        article = ArticleLinks(html)
                        links = [link for link in article.links
                                 if link.get('href') == prefix.rstrip('/') + item['local_url']]
                        self.assertEqual(len(links), 1)
                        self.assertEqual(article.images, [])
                        self.assertNotIn(item['original_url'], html)
                        if item['post_id'] == '1910':
                            self.assertIn('BD-strip</a> de <a href="http://maliki.com/index.php">Maliki</a>', html)
                            self.assertIn('vraie taille', html)
                        else:
                            self.assertEqual(links[0].get('title'), 'Vista')
                            self.assertIn('Musique : Iamamiwhoami', html)
                        payload = (site / 'public' / item['local_url'].lstrip('/')).read_bytes()
                        self.assertEqual(hashlib.sha256(payload).hexdigest(), item['sha256'])


if __name__ == '__main__':
    unittest.main()
