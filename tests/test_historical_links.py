"""Exercise reviewed historical navigation without private source backups."""

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
from urllib.parse import unquote, urlsplit

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from prepare_pages import prefix_file
from prepare_release import read_markdown
from sanitize_comments import sanitize_comment

BLOG = Path(__file__).resolve().parents[1]
CASES = [
    ('6756', '1823', '/liens.html)', '/#blogroll'),
    ('7474', '1989', '/blog/index.php?2008/04/15/208-jour18-l-ouverture-d-esprit#co',
     '/2008/04/15/jour18-l-ouverture-d-esprit/#comments'),
    ('8250', '2047', '/blog/index.php?2008/09/08/245-les-remous-de-l-equilibre',
     '/2008/09/08/les-remous-de-l-equilibre/'),
    ('8258', '2048', '/blog/index.php?2008/08/22/242-mystigris)', '/2008/08/22/mystigris/'),
]


class Links(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.links, self.ids = [], set()
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])


class HistoricalLinkTests(unittest.TestCase):
    def test_reviewed_links_are_scoped_and_raw_comment_metadata_is_preserved(self):
        for comment_id, post_id, old, new in CASES:
            with self.subTest(comment=comment_id):
                original = {'id': comment_id, 'post_id': post_id, 'parent_id': '42',
                            'published': '2008-04-18T12:00:00Z',
                            'content': f'<p>Context <a href="{old}" title="{old}">original label</a></p>'}
                clean = sanitize_comment(original)
                self.assertEqual(Links(clean['content_html']).links, [new])
                self.assertIn('original label', clean['content_html'])
                for key, value in original.items():
                    self.assertEqual(clean[key], value)
                self.assertEqual(sanitize_comment(clean), clean)
                for changed in ({'id': 'other'}, {'post_id': 'other'}):
                    unrelated = sanitize_comment(original | changed)
                    self.assertEqual(Links(unrelated['content_html']).links, [old])

    def test_real_content_navigation_resolves_at_both_base_paths(self):
        comments = {c['id']: c for c in json.loads((BLOG / 'data/comments.json').read_text())}
        post_ids = {'3058', '1846', '1988', '1870', '1880'} | {c[1] for c in CASES}
        with tempfile.TemporaryDirectory(prefix='step-historical-links-') as directory:
            site = Path(directory)
            (site / 'content/posts').mkdir(parents=True)
            (site / 'data').mkdir()
            (site / 'layouts/partials').mkdir(parents=True)
            (site / 'layouts/shortcodes').mkdir()
            for relative in ('layouts/baseof.html', 'layouts/partials/comments.html',
                             'layouts/_partials/comment.html', 'layouts/partials/native-totem.html'):
                target = site / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(BLOG / 'theme-overrides' / relative, target)
            (site / 'layouts/single.html').write_text(
                '{{ define "main" }}<div class="entry-content">{{ .Content }}</div>'
                '{{ partial "comments.html" . }}{{ end }}')
            (site / 'layouts/home.html').write_text('{{ define "main" }}Home{{ end }}')
            (site / 'layouts/list.html').write_text('{{ define "main" }}Section{{ end }}')
            for name in ('ruffle', 'local-audio'):
                (site / f'layouts/shortcodes/{name}.html').write_text('Existing player')
            (site / 'hugo.toml').write_text(
                'disableKinds = ["taxonomy", "term", "RSS", "sitemap"]\n'
                '[markup.goldmark.renderer]\nunsafe = true\n')
            (site / 'data/comments.json').write_text(json.dumps([comments[c[0]] for c in CASES]))
            shutil.copyfile(BLOG / 'data/blogroll.json', site / 'data/blogroll.json')
            articles = {}
            for source in (BLOG / 'content/posts').glob('*.md'):
                metadata, _ = read_markdown(source)
                if str(metadata['post_id']) in post_ids:
                    articles[str(metadata['post_id'])] = metadata['url']
                    shutil.copyfile(source, site / 'content/posts' / source.name)
            self.assertEqual(set(articles), post_ids)
            image = '/wp-content/uploads/2014/03/semelles.png'
            asset = site / 'static' / image.lstrip('/')
            asset.parent.mkdir(parents=True)
            shutil.copyfile(BLOG / 'static' / image.lstrip('/'), asset)
            command = ([os.environ['HUGO_BIN']] if os.environ.get('HUGO_BIN') else
                       ['rtk', 'proxy', 'sh', str(BLOG / 'scripts/mise-local.sh'), 'exec', '--', 'hugo'])
            for prefix in ('/', '/overstep-website/'):
                result = subprocess.run(command + ['build', '--source', str(site), '--baseURL',
                                        'https://example.test' + prefix, '--panicOnWarning'],
                                        capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                for page in (site / 'public').rglob('*.html'):
                    prefix_file(page, prefix)
                for comment_id, post_id, old, new in CASES:
                    with self.subTest(prefix=prefix, comment=comment_id):
                        page = site / 'public' / articles[post_id].lstrip('/') / 'index.html'
                        parsed = Links(page.read_text())
                        self.assertIn('comment-' + comment_id, parsed.ids)
                        self.assertNotIn(old, parsed.links)
                        href = prefix.rstrip('/') + new
                        self.assertIn(href, parsed.links)
                        target = urlsplit(new)
                        destination = site / 'public' / unquote(target.path).lstrip('/') / 'index.html'
                        self.assertTrue(destination.is_file(), str(destination))
                        if target.fragment:
                            self.assertIn(target.fragment, Links(destination.read_text()).ids)
                semelles = site / 'public' / articles['3058'].lstrip('/') / 'index.html'
                self.assertIn(prefix.rstrip('/') + image, Links(semelles.read_text()).links)
                self.assertEqual(hashlib.sha256((site / 'public' / image.lstrip('/')).read_bytes()).hexdigest(),
                                 'fa13a92b7bdb39a732208f5c19eb1d13687ab5aadb00ef8f5a809e162de8045a')
                game = site / 'public' / articles['1846'].lstrip('/') / 'index.html'
                parsed = Links(game.read_text())
                self.assertIn('#archival-download', parsed.links)
                self.assertIn('archival-download', parsed.ids)
                self.assertIn('redistribution', game.read_text())
                self.assertFalse(any('.zip' in href for href in parsed.links))
        self.assertEqual(json.loads((BLOG / 'docs/remaining-local-links.json').read_text()), [])
        self.assertFalse(list((BLOG / 'static').rglob('5emeaxe_and_emulator.zip')))


if __name__ == '__main__':
    unittest.main()
