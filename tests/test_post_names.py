import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from rename_posts import rename_posts


class PostNameTests(unittest.TestCase):
    def test_names_use_local_date_and_url_slug_preserving_file_bytes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            original = root / 'old-title.md'
            content = '---\nwordpress_display_date: "2016-06-29"\ndate: "2016-06-28T23:37:16Z"\nurl: /2016/06/29/original-slug/\npost_id: "42"\n---\nAccents: élève\n'
            original.write_text(content)
            self.assertEqual(rename_posts(root), 1)
            self.assertEqual((root / '2016-06-29-original-slug.md').read_bytes(), content.encode())
            self.assertFalse(original.exists())
            self.assertEqual(rename_posts(root), 0)

    def test_collision_is_rejected_before_any_file_moves(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            content = '---\nwordpress_display_date: "2005-12-16"\nurl: /2005/12/16/same/\n---\n'
            for name in ('a.md', 'b.md'):
                (root / name).write_text(content)
            with self.assertRaises(ValueError):
                rename_posts(root)
            self.assertEqual(sorted(p.name for p in root.iterdir()), ['a.md', 'b.md'])

    def test_invalid_calendar_date_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'post.md'
            path.write_text('---\nwordpress_display_date: "2005-02-31"\nurl: /post/\n---\n')
            with self.assertRaises(ValueError):
                rename_posts(Path(tmp))
            self.assertTrue(path.exists())
