"""Verify public query destinations and RSS output without private backups."""

import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

import yaml

BLOG = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BLOG / 'scripts'))
from prepare_release import read_markdown


class LegacyURLTests(unittest.TestCase):
    def test_post_map_matches_all_public_articles_and_attachments(self):
        expected = {}
        for section in ('posts', 'attachments'):
            for source in (BLOG / 'content' / section).glob('*.md'):
                metadata, _ = read_markdown(source)
                if metadata.get('draft'):
                    continue
                identifier = str(metadata['post_id'])
                self.assertNotIn(identifier, expected)
                expected[identifier] = metadata['url']
        self.assertEqual(len(expected), 491)
        self.assertEqual(json.loads((BLOG / 'static/legacy-posts.json').read_text()), expected)

    def test_rss_links_and_browser_fallback_preserve_both_base_paths(self):
        with tempfile.TemporaryDirectory(prefix='step-legacy-urls-') as directory:
            site = Path(directory)
            (site / 'content/posts').mkdir(parents=True)
            (site / 'layouts').mkdir()
            config = yaml.safe_load((BLOG / 'hugo.yaml').read_text())
            config.pop('theme')
            config['disableKinds'] = ['taxonomy', 'term', 'sitemap']
            (site / 'hugo.yaml').write_text(yaml.safe_dump(config))
            shutil.copyfile(BLOG / 'layouts/rss.xml', site / 'layouts/rss.xml')
            for kind in ('home', 'single', 'list'):
                (site / f'layouts/{kind}.html').write_text('Synthetic page')
            (site / 'layouts/home.json').write_text('{}')
            (site / 'content/posts/public.md').write_text(
                '---\ntitle: Public article\ndate: 2017-04-07\n'
                'url: /2017/04/07/public/\nguid: https://old.example.test/?p=84\n---\nPublic text\n')
            (site / 'content/posts/draft.md').write_text(
                '---\ntitle: Private draft\ndate: 2017-04-08\ndraft: true\n---\nExcluded\n')
            (site / 'static/feed').mkdir(parents=True)
            shutil.copyfile(BLOG / 'static/feed/index.html', site / 'static/feed/index.html')
            command = ([os.environ['HUGO_BIN']] if os.environ.get('HUGO_BIN') else
                       ['rtk', 'proxy', 'sh', str(BLOG / 'scripts/mise-local.sh'), 'exec', '--', 'hugo'])
            for prefix in ('/', '/overstep-website/'):
                with self.subTest(prefix=prefix):
                    base = 'https://example.test' + prefix
                    result = subprocess.run(command + ['build', '--source', str(site), '--baseURL', base,
                                            '--buildDrafts=false', '--panicOnWarning'],
                                            capture_output=True, text=True)
                    self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                    rss = ET.parse(site / 'public/feed.xml').getroot()
                    self.assertEqual(rss.tag, 'rss')
                    self.assertEqual(rss.attrib['version'], '2.0')
                    channel = rss.find('channel')
                    self.assertEqual(channel.findtext('link'), base)
                    self.assertEqual(channel.find('{http://www.w3.org/2005/Atom}link').attrib['href'],
                                     base + 'feed.xml')
                    item, = channel.findall('item')
                    self.assertEqual(item.findtext('link'), base + '2017/04/07/public/')
                    self.assertEqual(item.findtext('guid'), 'https://old.example.test/?p=84')
                    self.assertEqual(item.find('guid').attrib['isPermaLink'], 'false')
                    self.assertNotIn('Private draft', (site / 'public/feed.xml').read_text())
                    fallback = (site / 'public/feed/index.html').read_text()
                    self.assertIn('content="0;url=../feed.xml"', fallback)
                    self.assertIn('href="../feed.xml"', fallback)


if __name__ == '__main__':
    unittest.main()
