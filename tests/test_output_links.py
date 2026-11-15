import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from validate_site import missing_local_paths


class OutputLinkTests(unittest.TestCase):
    def test_links_resolve_under_preview_prefix_with_queries_accents_and_relative_assets(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            (output / 'é.jpg').write_bytes(b'image')
            (output / 'page').mkdir()
            (output / 'page/index.html').write_text('<img src="../%C3%A9.jpg"><a href="?p=1#comment-2">self</a><a href="https://other.test/missing">other</a><span data-swf="/preview/missing.swf"></span>')
            self.assertEqual(missing_local_paths(output, 'https://example.test/preview/'), {'/missing.swf'})
