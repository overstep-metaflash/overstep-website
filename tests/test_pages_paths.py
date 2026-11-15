import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from prepare_pages import prefix_html, prefix_file


class PagesPathTests(unittest.TestCase):
    def test_legacy_html_encoding_is_preserved_when_prefixing_paths(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'legacy.html'
            path.write_bytes(b'<p>caf\xe9</p><img src="/image.jpg">')
            prefix_file(path, '/overstep-website/')
            self.assertEqual(path.read_bytes(), b'<p>caf\xe9</p><img src="/overstep-website/image.jpg">')

    def test_project_prefix_applies_to_media_but_not_other_sites_or_existing_prefixes(self):
        source = '<a href="/2005/post/">Post</a><img src="/wp-content/a.jpg"><span data-swf="/wp-content/a.swf"></span><img src="//other.test/a"><a href="https://example.test/">Other</a><script src="/overstep-website/js/player.js"></script>'
        result = prefix_html(source, '/overstep-website/')
        self.assertIn('href="/overstep-website/2005/post/"', result)
        self.assertIn('src="/overstep-website/wp-content/a.jpg"', result)
        self.assertIn('data-swf="/overstep-website/wp-content/a.swf"', result)
        self.assertIn('src="//other.test/a"', result)
        self.assertIn('src="/overstep-website/js/player.js"', result)
        self.assertEqual(prefix_html(result, '/overstep-website/'), result)
        self.assertEqual(prefix_html(source, '/'), source)
