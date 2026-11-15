import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from embed_flash_pages import parse_wrapper, replace_links, resolve_wrapper, swf_dimensions


class FlashPageTests(unittest.TestCase):
    def test_nested_objects_produce_one_movie_with_dimensions(self):
        source = '<object width="1200" height="675"><param name="movie" value="elevation.swf"><object data="elevation.swf" width="1200" height="675"></object></object>'
        self.assertEqual(parse_wrapper(source), ('elevation.swf', 1200, 675))

    def test_thumbnail_link_becomes_player_and_preserves_caption(self):
        text = '[![preview](/image.jpg)](/elevation.html)(Musique : Air)'
        movies = {'/elevation.html': ('/elevation.swf', 1200, 675)}
        result, count = replace_links(text, movies)
        self.assertEqual(count, 1)
        self.assertIn('{{< ruffle src="/elevation.swf" width="1200" height="675" >}}', result)
        self.assertIn('(Musique : Air)', result)
        self.assertNotIn('/image.jpg', result)
        self.assertEqual(replace_links(result, movies), (result, 0))

    def test_unrelated_links_and_ambiguous_wrappers_are_preserved(self):
        text = '[Reference](https://example.test/page.html)'
        self.assertEqual(replace_links(text, {}), (text, 0))
        with self.assertRaises(ValueError):
            parse_wrapper('<object data="a.swf" width="10" height="20"></object><object data="b.swf" width="10" height="20"></object>')

    def test_resolution_is_limited_to_backup_and_known_hosts(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            f = root / 'blog/wordpress/wp-content/uploads/a.html'
            f.parent.mkdir(parents=True)
            f.write_text('wrapper')
            self.assertEqual(resolve_wrapper('/wp-content/uploads/a.html', root), f)
            self.assertIsNone(resolve_wrapper('https://unrelated.test/wp-content/uploads/a.html', root))
            self.assertIsNone(resolve_wrapper('/../../secret.html', root))

    def test_percentage_wrapper_uses_compressed_movie_stage_dimensions(self):
        import zlib
        self.assertEqual(parse_wrapper('<embed src="a.swf" width="100%" height="100%">'), ('a.swf', 0, 0))
        values = [0, 1200 * 20, 0, 675 * 20]
        bits = f'{16:05b}' + ''.join(f'{v:016b}' for v in values)
        bits += '0' * (-len(bits) % 8)
        rect = bytes(int(bits[i:i+8], 2) for i in range(0, len(bits), 8))
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / 'a.swf'
            p.write_bytes(b'CWS\x09' + (8 + len(rect)).to_bytes(4, 'little') + zlib.compress(rect))
            self.assertEqual(swf_dimensions(p), (1200, 675))
