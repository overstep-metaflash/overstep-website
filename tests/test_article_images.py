import hashlib
import io
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from prepare_pages import prefix_file

BLOG = Path(__file__).resolve().parents[1]
ARTICLES = {
    '2007-06-06-sens-interdit.md': '/wp-content/uploads/2011/dotclear/sens interdit.jpg',
    '2008-07-31-manque-de-ressources.md': '/wp-content/uploads/2011/dotclear/dofus_moustache mufafah.jpg',
    '2008-09-25-fanart.md': '/wp-content/uploads/2011/dotclear/ticado step.jpg',
    '2012-04-28-jour-13-les-yeux-de-la-ruche.md': '/wp-content/uploads/2012/04/saison6_131-1024x576.jpg',
}


class Images(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.images = []
        self.feed(page)

    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            self.images.append(dict(attrs))


class ArticleImageRenderingTests(unittest.TestCase):
    def test_hugo_renders_restored_articles_and_spaces_accents_at_both_prefixes(self):
        from prepare_release import read_markdown

        with tempfile.TemporaryDirectory(prefix='step-article-images-') as directory:
            site = Path(directory)
            (site / 'layouts').mkdir()
            (site / 'layouts/single.html').write_text('<div class="entry-content">{{ .Content }}</div>')
            (site / 'layouts/home.html').write_text('Synthetic home')
            (site / 'layouts/list.html').write_text('Synthetic section')
            (site / 'content/posts').mkdir(parents=True)
            for name in ARTICLES:
                shutil.copyfile(BLOG / 'content/posts' / name, site / 'content/posts' / name)
            (site / 'content/accent.md').write_text('---\ntitle: Fixture\nurl: /accent/\n---\n![Fixture](</images/été illustré.jpg>)\n')
            (site / 'hugo.toml').write_text('disableKinds = ["taxonomy", "term", "RSS", "sitemap"]\n[markup.goldmark.renderer]\nunsafe = true\n')
            command = ([os.environ['HUGO_BIN']] if os.environ.get('HUGO_BIN') else
                       ['rtk', 'proxy', 'sh', str(BLOG / 'scripts/mise-local.sh'), 'exec', '--', 'hugo'])
            for prefix in ('/', '/overstep-website/'):
                result = subprocess.run(command + ['build', '--source', str(site), '--baseURL',
                                        'https://example.test' + prefix, '--panicOnWarning'],
                                        capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                output = site / 'public'
                for page in output.rglob('*.html'):
                    prefix_file(page, prefix)
                for name, image in ARTICLES.items():
                    metadata, _ = read_markdown(site / 'content/posts' / name)
                    page = (output / metadata['url'].lstrip('/') / 'index.html').read_text()
                    with self.subTest(prefix=prefix, article=name):
                        images = Images(page).images
                        self.assertEqual([unquote(i['src']) for i in images], [prefix.rstrip('/') + image])
                        if name.startswith('2012-'):
                            self.assertEqual(images[0]['title'], 'Les yeux de la ruche')
                            self.assertEqual((images[0]['width'], images[0]['height']), ('640', '360'))
                            self.assertIn(prefix.rstrip('/') + '/wp-content/uploads/2012/04/saison6_131.jpg', page)
                        if name.startswith('2007-'):
                            self.assertIn('80X60 cm', page)
                accent = Images((output / 'accent/index.html').read_text()).images
                self.assertEqual([unquote(i['src']) for i in accent], [prefix + 'images/été illustré.jpg'])


class ImageCoverageTests(unittest.TestCase):
    def test_audit_selects_only_missing_images_and_deduplicates_snapshot_aliases(self):
        from article_images import reviewed_image_articles

        def finding(path, classification='broken_markdown_image_url_with_spaces'):
            return dict(post_id='42', source_file='content/posts/example.md', article_url='/example/',
                        resolved_path=path, classification=classification,
                        public_files_with_matching_backup_hash={'hash': ['static/images/été illustré.jpg']})

        findings = [finding('/images/été illustré.jpg'), finding('/images/ete-illustre.jpg'),
                    finding('/thumbnail.jpg', 'thumbnail_replaced_by_flash_player'),
                    finding('/alias.jpg', 'represented_by_identical_bytes')]
        articles = reviewed_image_articles(findings)
        self.assertEqual(len(articles), 1)
        self.assertEqual(articles[0]['images'], [{'sha256': 'hash', 'paths': ['/images/été illustré.jpg']}])
        findings[0]['public_files_with_matching_backup_hash'] = {}
        with self.assertRaisesRegex(ValueError, 'hash'):
            reviewed_image_articles(findings)

    def test_original_public_audit_requires_all_four_article_image_associations(self):
        from article_images import reviewed_image_articles

        audit = json.loads((BLOG / 'docs/audits/2026-11-16-content.json').read_text())
        articles = reviewed_image_articles(audit['image_differences_requiring_review'])
        self.assertEqual({a['source_file'] for a in articles}, {'content/posts/' + n for n in ARTICLES})
        self.assertEqual(sum(len(a['images']) for a in articles), 4)

    def test_real_article_images_require_correct_prefix_scope_count_and_payload(self):
        from article_images import reconcile_images

        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            (output / 'été illustré.jpg').write_bytes(b'image')
            expected = [dict(paths=['/été illustré.jpg'], sha256=hashlib.sha256(b'image').hexdigest())]
            image = '<img src="/preview/%C3%A9t%C3%A9%20illustr%C3%A9.jpg">'
            page = '<aside>' + image + '</aside><div class="entry-content"><p>' + image + '</p></div>'
            self.assertEqual(reconcile_images(page, expected, output, '/preview/'), [])
            for broken in ('<aside>' + image + '</aside><div class="entry-content"></div>',
                           '<div class="entry-content"><a href="/preview/été illustré.jpg">Image</a></div>',
                           page.replace('<p>' + image + '</p>', '<p>' + image * 2 + '</p>'),
                           page.replace('/preview/', '/'),
                           page.replace('<p>' + image + '</p>', '<p>![](/été illustré.jpg)</p>')):
                with self.subTest(page=broken):
                    self.assertTrue(reconcile_images(broken, expected, output, '/preview/'))
            (output / 'été illustré.jpg').write_bytes(b'wrong payload')
            self.assertTrue(reconcile_images(page, expected, output, '/preview/'))
            (output / 'été illustré.jpg').unlink()
            self.assertTrue(reconcile_images(page, expected, output, '/preview/'))

    def test_release_validator_rejects_missing_article_image_even_when_file_exists(self):
        import validate_site

        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'content/posts').mkdir(parents=True)
            (root / 'content/posts/example.md').write_text('---\npost_id: "42"\nurl: /example/\n---\n')
            (root / 'data').mkdir()
            (root / 'data/comments.json').write_text('[]')
            (root / 'docs/audits').mkdir(parents=True)
            (root / 'docs/audits/2026-11-16-links.csv').write_text('post_id,url,anchor\n')
            (root / 'docs/flash-recovery.json').write_text('{"articles": []}')
            (root / 'docs/remaining-local-links.json').write_text('[]')
            finding = dict(post_id='42', source_file='content/posts/example.md', article_url='/example/',
                           classification='missing_original_image_in_article',
                           public_files_with_matching_backup_hash={hashlib.sha256(b'image').hexdigest():
                                                                   ['static/image.jpg']})
            (root / 'docs/audits/2026-11-16-content.json').write_text(json.dumps({
                'missing_embedded_flash': [], 'image_differences_requiring_review': [finding]}))
            output = root / 'public'
            (output / 'example').mkdir(parents=True)
            (output / 'image.jpg').write_bytes(b'image')
            (output / 'feed.xml').write_text('Synthetic feed')
            page = output / 'example/index.html'
            with patch.object(validate_site, 'BLOG', root), patch.object(
                    sys, 'argv', ['validate_site.py', '--directory', str(output)]):
                page.write_text('<div class="entry-content"><a href="/image.jpg">Image</a></div>')
                with self.assertRaisesRegex(SystemExit, 'Missing or duplicated article image'):
                    validate_site.main()
                page.write_text('<div class="entry-content"><img src="/image.jpg"></div>')
                with redirect_stdout(io.StringIO()):
                    validate_site.main()
                (root / 'content/posts/example.md').unlink()
                with self.assertRaisesRegex(SystemExit, 'Some audited image articles'):
                    validate_site.main()


if __name__ == '__main__':
    unittest.main()
