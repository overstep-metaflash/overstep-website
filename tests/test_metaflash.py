"""Exercise historical portfolio transformations using synthetic public fixtures."""

import struct
import sys
import tempfile
import unittest
from unittest.mock import patch
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from metaflash import classify_wrapper, embedded_movies, local_reference, render_legacy_body, render_shell
from repair_flash_menu import repair_menu, swf_tags
from recover_metaflash import build_portfolio, INDEX_URLS


class MetaflashTransformTests(unittest.TestCase):
    def test_recovery_imports_only_the_selected_public_closure_and_keeps_source_bytes(self):
        def tag(code, data):
            return struct.pack('<HI', code << 6 | 63, len(data)) + data
        buttons = b''
        for identifier, url in enumerate(sorted(INDEX_URLS), 1):
            value = url.encode() + b'\0_self\0'
            actions = b'\x83' + struct.pack('<H', len(value)) + value + b'\0'
            buttons += tag(34, struct.pack('<H', identifier) + b'\0\x03\0\0\0\0\x08\0' + actions)
        payload = b'\0\0\x0c\x01\0' + buttons + b'\0\0'
        movie = b'FWS\x05' + struct.pack('<I', len(payload) + 8) + payload
        wrapper = '<body><object data="%s.swf" width="640" height="480"></object></body>'
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for name in ('index', 'anterak', 'art'):
                (root / (name + '.html')).write_text(wrapper % name)
                (root / (name + '.swf')).write_bytes(movie)
            for name in ('aheader', 'zheader'):
                (root / (name + '.swf')).write_bytes(movie)
            (root / 'gif').mkdir()
            (root / 'gif/anterak.jpg').write_bytes(b'\xff\xd8synthetic public image')
            (root / 'menu2.html').write_text('<body><a href="art.html">Art</a><p>Music credit</p>'
                '<object data="zheader.swf" width="640" height="480"></object>'
                '<object data="aheader.swf" width="640" height="480"></object></body>')
            (root / 'unrelated.fla').write_text('Do not publish')
            before = {str(p.relative_to(root)): p.read_bytes() for p in root.rglob('*') if p.is_file()}
            output, manifest = build_portfolio(root, [])
            self.assertEqual(before, {str(p.relative_to(root)): p.read_bytes() for p in root.rglob('*') if p.is_file()})
            self.assertNotIn('unrelated.fla', output)
            self.assertEqual(output['art.swf'], movie)
            self.assertIn(b'data-metaflash-movie="art.html"', output['menu2.html'])
            self.assertEqual(manifest['modal_movies'], 2)
            self.assertEqual(len(manifest['output_files']), len(output))
            with patch('recover_metaflash.embedded_movies',
                       side_effect=lambda source: list(reversed(sorted(embedded_movies(source))))):
                self.assertEqual(build_portfolio(root, []), (output, manifest))
            archive = {'source_sha256': 'a' * 64, 'entries': [{
                'source_index': 1, 'author': 'Historical visitor', 'date': '2006-09-01T12:34:56',
                'display_date': '01-09-2006 12:34:56', 'body': 'Original visitor message'}]}
            restored, evidence = build_portfolio(root, [], archive)
            self.assertIn(b'Original visitor message', restored['guestbook.html'])
            self.assertEqual(evidence['guestbook']['retained'], 1)

    def test_local_paths_decode_legacy_accents_and_stay_inside_the_portfolio(self):
        self.assertEqual(local_reference('gif/sph%E8res.jpg', 'menu2.html'), 'gif/sphères.jpg')
        self.assertEqual(local_reference('gif/sph%C3%A8res.jpg', 'menu2.html'), 'gif/sphères.jpg')
        self.assertEqual(local_reference('../menu2.html', 'photoshop/art.html'), 'menu2.html')
        self.assertEqual(local_reference('https://metaflash.fr/paint.swf', 'menu2.html'), 'paint.swf')
        self.assertIsNone(local_reference('https://artist.example/credits', 'menu2.html'))
        with self.assertRaises(ValueError):
            local_reference('../../private.jpg', 'menu2.html')

    def test_only_simple_movie_wrappers_become_modal_destinations(self):
        source = '<html><head><title>Piece</title></head><body><object width="640" height="480">' \
                 '<param name="movie" value="piece.swf"><embed src="piece.swf" width="640" height="480">' \
                 '</object></body></html>'
        self.assertEqual(classify_wrapper(source), ('piece.swf', 640, 480))
        self.assertIsNone(classify_wrapper(source.replace('</body>', '<p>Music credit</p></body>')))
        self.assertIsNone(classify_wrapper(source.replace('</body>', '<img src="art.jpg"></body>')))
        self.assertIsNone(classify_wrapper(source.replace('</body>', '<object data="other.swf"></object></body>')))
        self.assertEqual(classify_wrapper(source.replace('</body>', '<a href="menu.htm"></a>'
                         '<a href="http://www.phpmyvisites.net/"><noscript>Tracker</noscript></a></body>')),
                         ('piece.swf', 640, 480))

    def test_gallery_keeps_thumbnails_credits_and_layout_without_old_executable_markup(self):
        source = '<body onload="bad()"><table bgcolor="#003366"><tr><td>' \
                 '<a href="piece.html" target="_self"><img src="gif/thumb%20a.jpg" width="140" height="98"></a>' \
                 '<b>Original title</b><font color="#3399FF">Music credit</font>' \
                 '<a href="https://artist.example/">Artist</a><script>bad()</script>' \
                 '<img src="http://stats.phpmyvisites.net/pixel.gif">' \
                 '</td></tr></table></body>'
        pages = {'piece.html': {'url': '/metaflash/piece.html', 'kind': 'movie', 'movie_id': 'piece.html'}}
        assets = {'gif/thumb a.jpg': '/metaflash/gif/thumb a.jpg'}
        result = render_legacy_body(source, 'menu2.html', pages, assets, {})
        self.assertIn('data-metaflash-movie="piece.html"', result)
        self.assertIn('href="piece.html"', result)
        self.assertIn('src="gif/thumb%20a.jpg"', result)
        self.assertIn('width="140"', result)
        for expected in ('Original title', 'Music credit', 'Artist', '#003366', '#3399FF'):
            self.assertIn(expected, result)
        for rejected in ('onload', '<script', 'pixel.gif', 'target='):
            self.assertNotIn(rejected, result)

    def test_complex_pages_and_reviewed_unavailable_images_remain_explicit(self):
        pages = {'picture.html': {'url': '/metaflash/picture.html', 'kind': 'page'}}
        result = render_legacy_body('<body><a href="picture.html">Picture</a>'
                                    '<img src="missing.jpg"></body>', 'menu2.html', pages,
                                    {'missing.jpg': None}, {})
        self.assertNotIn('data-metaflash-movie', result)
        self.assertIn('Illustration indisponible', result)
        self.assertNotIn('<img', result)
        with self.assertRaises(ValueError):
            render_legacy_body('<img src="unreviewed.jpg">', 'menu2.html', {}, {}, {})

    def test_inline_objects_are_replaced_once_and_relative_shell_links_support_nested_pages(self):
        source = '<body><object width="740" height="120"><param name="movie" value="header.swf">' \
                 '<embed src="header.swf" width="740" height="120"></object></body>'
        result = render_legacy_body(source, 'menu2.html', {}, {'header.swf': '/metaflash/header.swf'},
                                    {'header.swf': {'id': 'asset:header.swf'}})
        self.assertEqual(result.count('data-metaflash-inline='), 1)
        self.assertNotIn('<object', result)
        self.assertNotIn('<embed', result)
        shell = render_shell('photoshop/art.html', 'Art', result)
        self.assertIn('../../js/ruffle-player.js', shell)
        self.assertIn('../menu2.html', shell)
        self.assertIn('<dialog', shell)

    def test_home_has_no_toolbar_and_gallery_places_home_and_anterak_in_its_original_body(self):
        shell = render_shell('index.html', 'Metaflash', '<div>Original homepage</div>')
        self.assertIn('metaflash-home', shell)
        self.assertNotIn('metaflash-toolbar', shell)
        self.assertNotIn('Le blog', shell)
        wrapped = render_shell('index.html', 'Metaflash', '<p>Original title  \ncontinues here.</p>\n  ')
        self.assertFalse(any(line.endswith((' ', '\t')) for line in wrapped.splitlines()))
        self.assertIn('Original title\ncontinues here.', wrapped)
        source = '<table><tr><td bgcolor="#003366" width="762" height="837">Header</td></tr>' \
                 '<tr bgcolor="#000033" bordercolor="#FF6600"><td>Flash gallery</td></tr></table>'
        pages = {'anterak.html': {'url': '/metaflash/anterak.html', 'kind': 'movie',
                                  'movie_id': 'anterak.html', 'title': 'Anterak'}}
        body = render_legacy_body(source, 'menu2.html', pages,
                                 {'gif/blog2.jpg': '/metaflash/gif/blog2.jpg'},
                                 {'cadre/Animation1.swf': {'id': 'asset:cadre/Animation1.swf'}})
        self.assertIn('class="metaflash-gallery-header"', body)
        self.assertIn('class="metaflash-gallery-home"', body)
        self.assertIn('href="./"', body)
        self.assertIn('data-metaflash-movie="anterak.html"', body)
        self.assertIn('gif/anterak.jpg', body)

    def test_gallery_header_is_compact_and_blog_image_has_an_accessible_hover_label(self):
        source = '<table width="790" height="10210"><tr><td height="837" bgcolor="#FFFFFF">&nbsp;</td>' \
                 '<td width="762" bgcolor="#003366" height="837"><table><tr><td>Old nested header</td></tr></table>' \
                 '<p>&nbsp;</p><p><br><br></p><font>blog ---&gt;</font>' \
                 '<a href="http://overstep.free.fr/blog"><img src="gif/blog2.jpg"></a></td>' \
                 '<td height="837" bgcolor="#FFFFFF">&nbsp;</td></tr>' \
                 '<tr><td>Original gallery and music credits</td></tr></table>'
        result = render_legacy_body(source, 'menu2.html', {},
                                   {'gif/blog2.jpg': '/metaflash/gif/blog2.jpg'},
                                   {'cadre/Animation1.swf': {'id': 'asset:cadre/Animation1.swf'}})
        self.assertNotIn('height="10210"', result)
        self.assertNotIn('height="837"', result)
        self.assertNotIn('Old nested header', result)
        self.assertNotIn('blog ---', result)
        self.assertIn('Original gallery and music credits', result)
        self.assertEqual(result.count('data-metaflash-inline="asset:cadre/Animation1.swf"'), 1)
        self.assertIn('class="metaflash-blog-link"', result)
        self.assertIn('aria-label="Blog"', result)
        self.assertIn('class="metaflash-blog-label"', result)
        self.assertIn('href="../"', result)

    def test_home_contact_url_is_replaced_in_the_movie_not_only_in_javascript(self):
        old = 'mailto:old@example.test'
        new = 'mailto:artist@example.test'
        action = old.encode() + b'\0_parent\0'
        actions = b'\x83' + struct.pack('<H', len(action)) + action + b'\0'
        button = b'\x01\0\0\x03\0\0\0\0\x08\0' + actions
        tag = struct.pack('<HI', 34 << 6 | 63, len(button)) + button
        payload = b'\0\0\x0c\x01\0' + tag + b'\0\0'
        movie = b'FWS\x05' + struct.pack('<I', len(payload) + 8) + payload
        repaired, _ = repair_menu(movie, {old}, url_replacements={old: new})
        self.assertIn(new.encode(), repaired)
        self.assertNotIn(old.encode(), repaired)
        self.assertEqual(repair_menu(repaired, {old}, url_replacements={old: new})[0], repaired)

    def test_home_navigation_repair_keeps_internal_animation_actions_and_artwork(self):
        url = 'menu2.html'
        action = url.encode() + b'\0_self\0'
        get_url = b'\x83' + struct.pack('<H', len(action)) + action + b'\0'
        internal = b'\x81\x02\0\x02\0\x06\0'
        def tag(code, data):
            return struct.pack('<HI', code << 6 | 63, len(data)) + data
        def button(identifier, actions):
            return struct.pack('<H', identifier) + b'\0\x03\0\0\0\0\x08\0' + actions
        payload = b'\0\0\x0c\x01\0' + tag(2, b'unchanged artwork') + \
                  tag(34, button(1, get_url)) + tag(34, button(2, internal)) + b'\0\0'
        movie = b'FWS\x05' + struct.pack('<I', len(payload) + 8) + payload
        repaired, links = repair_menu(movie, {url}, allow_non_navigation=True)
        self.assertEqual(links, [(url, '_blank')])
        self.assertIn(internal, repaired)
        self.assertEqual(swf_tags(movie)[1][0], swf_tags(repaired)[1][0])
        self.assertEqual(repair_menu(repaired, {url}, allow_non_navigation=True)[0], repaired)
        with self.assertRaises(ValueError):
            repair_menu(movie, {url})


if __name__ == '__main__':
    unittest.main()
