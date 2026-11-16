import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from reviewed_links import load_reviewed_links, reviewed_payloads_present
from prepare_release import read_markdown
import validate_site

BLOG = Path(__file__).resolve().parents[1]


class ReviewedLinkTests(unittest.TestCase):
    def setUp(self):
        self.review = [{'url': 'https://example.test/reviewed',
                        'anchor': 'unrelated promotional text'}]

    def test_rejects_standalone_and_inline_reviewed_links(self):
        for body in (
            '[unrelated promotional text](https://example.test/reviewed)\n\n![Art](/art.jpg)',
            'Original sentence [unrelated promotional text](https://example.test/reviewed) continues.',
        ):
            with self.subTest(body=body):
                self.assertTrue(reviewed_payloads_present(body, self.review))

    def test_rejects_formatted_links_and_unlinked_anchor_residue(self):
        for body in (
            '_Original **[unrelated promotional text](https://example.test/reviewed)** sentence._',
            '<p>Original <a href="https://example.test/reviewed"><em>unrelated</em> promotional text</a>.</p>',
            'Original **unrelated promotional text** remains.',
            '<span>unrelated</span> <strong>promotional text</strong>',
        ):
            with self.subTest(body=body):
                self.assertTrue(reviewed_payloads_present(body, self.review))

    def test_normalizes_escaped_anchors_entities_and_line_breaks(self):
        review = [{'url': 'https://example.test/reviewed?x=1&y=2',
                   'anchor': 'unrelated_name & text'}]
        for body in (
            r'unrelated\_name & text',
            'unrelated_name &amp;\n<strong>text</strong>',
            '<a href="https://example.test/reviewed?x=1&amp;y=2">Changed anchor</a>',
        ):
            with self.subTest(body=body):
                self.assertTrue(reviewed_payloads_present(body, review))

    def test_preserves_legitimate_art_titles_credits_and_other_links(self):
        body = '''[Syphie](http://syphie.com/blog/), [Mobidic](https://mobidicmobidic.blogspot.com/)
[Maliki](https://maliki.com/), [Porn industry](/2006/07/19/porn-industry/)
[Another citation on the same host](https://example.test/original)
Musique : Massive Attack "Heat miser"
![Art](/art.jpg) {{< ruffle src="/art.swf" >}}'''
        self.assertFalse(reviewed_payloads_present(body, self.review))
        root_review = [{'url': 'https://example.test/', 'anchor': 'unrelated promotional text'}]
        self.assertFalse(reviewed_payloads_present(
            '[Original citation](https://example.test/original)', root_review))

    def test_public_articles_cannot_reimport_reviewed_payloads(self):
        reviews = load_reviewed_links(BLOG / 'docs/audits/2026-11-16-links.csv')
        self.assertEqual(sum(map(len, reviews.values())), 78)
        posts = list((BLOG / 'content/posts').glob('*.md'))
        self.assertEqual(len(posts), 470)
        for source in posts:
            metadata, body = read_markdown(source)
            with self.subTest(source=source.name):
                self.assertFalse(reviewed_payloads_present(
                    body, reviews.get(str(metadata['post_id']), [])))

    def test_release_validation_checks_both_source_and_rendered_output(self):
        injection = '[unrelated promotional text](https://example.test/reviewed)'
        for body, page in ((injection, '<p>Clean</p>'),
                           ('Clean', '<p>unrelated promotional text</p>')):
            with self.subTest(body=body, page=page), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                (root / 'content/posts').mkdir(parents=True)
                (root / 'content/posts/example.md').write_text(
                    '---\npost_id: "42"\nurl: /example/\n---\n' + body)
                (root / 'data').mkdir()
                (root / 'data/comments.json').write_text('[]')
                (root / 'docs/audits').mkdir(parents=True)
                (root / 'docs/audits/2026-11-16-links.csv').write_text(
                    'post_id,url,anchor\n42,https://example.test/reviewed,unrelated promotional text\n')
                output = root / 'public'
                (output / 'example').mkdir(parents=True)
                (output / 'example/index.html').write_text(page)
                with patch.object(validate_site, 'BLOG', root), patch.object(
                    sys, 'argv', ['validate_site.py', '--directory', str(output)]
                ), self.assertRaisesRegex(SystemExit, 'Reviewed article injection reintroduced'):
                    validate_site.main()
