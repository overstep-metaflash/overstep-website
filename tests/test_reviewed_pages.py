import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from recover_reviewed_pages import review_page


class ReviewedPageTests(unittest.TestCase):
    def test_static_image_page_keeps_legacy_bytes_and_lists_only_relative_assets(self):
        source = b'<html><body background="missing.png"><p>caf\xe9</p><img src="photos/a.jpg"></body></html>'
        output, assets = review_page(source)
        self.assertIn(b'caf\xe9', output)
        self.assertNotIn(b'background=', output)
        self.assertEqual(assets, {'photos/a.jpg'})

    def test_unreviewed_code_or_dependencies_are_rejected(self):
        for source in [b'<script>bad()</script>', b'<img onerror="bad()" src="x.jpg">',
                       b'<img src="https://other.test/a.jpg">', b'<img src="../../private.jpg">',
                       b'<img src="audio.mp3">', b'<iframe src="page.html">']:
            with self.subTest(source=source), self.assertRaises(ValueError):
                review_page(source)
