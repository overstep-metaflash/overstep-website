import json
import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


class CommentOrderTests(unittest.TestCase):
    def test_hugo_sorts_roots_and_replies_by_date_not_input_order_or_id(self):
        blog = Path(__file__).resolve().parents[1]
        with tempfile.TemporaryDirectory(prefix='step-comment-order-') as tmp:
            site = Path(tmp)
            (site / 'hugo.toml').write_text('baseURL = "https://example.test/"\nlocale = "fr-FR"\n')
            (site / 'layouts/_partials').mkdir(parents=True)
            for name, original in (
                ('comments.html', 'layouts/partials/comments.html'),
                ('comment.html', 'layouts/_partials/comment.html'),
            ):
                shutil.copyfile(blog / 'theme-overrides' / original, site / 'layouts/_partials' / name)
            (site / 'layouts/home.html').write_text('{{ partial "comments.html" (dict "Params" (dict "post_id" "42")) }}')
            (site / 'layouts/list.html').write_text('Synthetic taxonomy fixture')
            (site / 'data').mkdir()

            def comment(id, parent, date, post='42'):
                return dict(id=id, parent_id=parent, published=date, post_id=post,
                            author_name='Example', author_email='', author_url='', content='Synthetic comment')

            comments = [comment('10', '0', '2023-02-05T22:25:00Z'),
                        comment('21', '10', '2025-01-01T10:00:00Z'),
                        comment('50', '0', '2020-01-31T21:18:00Z'),
                        comment('20', '10', '2024-01-01T10:00:00Z'),
                        comment('99', '0', '2010-01-01T10:00:00Z', '99')]
            (site / 'data/comments.json').write_text(json.dumps(comments))
            result = subprocess.run(
                ['rtk', 'proxy', 'sh', str(blog / 'scripts/mise-local.sh'), 'exec', '--',
                 'hugo', 'build', '--source', str(site), '--panicOnWarning'],
                capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            page = (site / 'public/index.html').read_text()
            self.assertEqual(re.findall(r'id="comment-(\d+)"', page), ['50', '10', '20', '21'])
            self.assertIn('id="comment-20" data-reply-to="comment-10"', page)
            self.assertIn('id="comment-21" data-reply-to="comment-10"', page)
