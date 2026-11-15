import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from restore_sidebar import extract_blogroll


class SidebarTests(unittest.TestCase):
    def test_only_public_blogroll_links_are_extracted(self):
        source = '''<a href="/private">Ignored</a><li id="linkcat-2"><h3>Liens</h3>
        <ul><li><a href="https://example.test" target="_blank">Nancy &amp; Step</a></li>
        <li><a href="javascript:alert(1)">Unsafe</a></li></ul></li>
        <li id="meta"><a href="/wp-login.php">Ignored too</a></li>'''
        self.assertEqual(extract_blogroll(source), [
            {'name': 'Nancy & Step', 'url': 'https://example.test'}])

    def test_missing_blogroll_fails_explicitly(self):
        with self.assertRaises(ValueError):
            extract_blogroll('<div>No links here</div>')
