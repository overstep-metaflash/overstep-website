import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from restore_source_colors import restore_colors


class SourceColorTests(unittest.TestCase):
    def test_restores_colored_text_without_recoloring_links_or_players(self):
        source = '<h3><span style="color: #c94e38">A long original paragraph. <a href="https://example.test">Link text</a> More words.</span></h3><span style="color:#333399">(Music credit)</span>'
        body = '### A long original paragraph. [Link text](https://example.test) More words.\n\n{{< ruffle src="/a.swf" >}}\n\n(Music credit)'
        result, count = restore_colors(source, body)
        self.assertEqual(count, 3)
        self.assertIn('style="color: #c94e38;">A long original paragraph.</span>', result)
        self.assertIn('[Link text](https://example.test)', result)
        self.assertIn('style="color: #333399;">(Music credit)</span>', result)
        self.assertIn('{{< ruffle src="/a.swf" >}}', result)
        self.assertEqual(restore_colors(source, result), (result, 0))

    def test_only_simple_colors_and_present_text_are_restored(self):
        source = '<span style="color:expression(bad)">A dangerous color</span><code><span style="color:#fff">A code sample</span></code><span style="color:#c94e38">Missing original words</span>'
        body = 'A dangerous color and A code sample'
        self.assertEqual(restore_colors(source, body), (body, 0))
