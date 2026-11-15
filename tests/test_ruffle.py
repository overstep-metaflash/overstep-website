import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from integrate_ruffle import convert_swf


class RuffleConversionTests(unittest.TestCase):
    def test_escaped_and_smart_quotes_preserve_dimensions(self):
        text = r'Before \[swf:"/wp-content/uploads/2016/06/totem.swf" width=“604” height=“1200”\] after'
        result, count = convert_swf(text)
        self.assertEqual(count, 1)
        self.assertEqual(result, 'Before {{< ruffle src="/wp-content/uploads/2016/06/totem.swf" width="604" height="1200" >}} after')

    def test_positional_and_accented_paths(self):
        result, count = convert_swf('[swf:/wp-content/uploads/matière.swf 540 729]')
        self.assertEqual(count, 1)
        self.assertIn('src="/wp-content/uploads/matière.swf" width="540" height="729"', result)
        self.assertEqual(convert_swf(result), (result, 0))

    def test_fullscreen_and_unrelated_text(self):
        result, _ = convert_swf('[gallery] [swf:"/a.swf" width="600" height="847" allowfullscreen="false"]')
        self.assertTrue(result.startswith('[gallery] '))
        self.assertIn('fullscreen="false"', result)

    def test_invalid_input_fails_instead_of_losing_content(self):
        for text in ['[swf:"javascript:bad.swf" width="1" height="2"]',
                     '[swf:"/a.swf" width="0" height="10"]',
                     '[swf:"/a.swf" width="x" height="10"]']:
            with self.assertRaises(ValueError):
                convert_swf(text)


if __name__ == '__main__':
    unittest.main()
