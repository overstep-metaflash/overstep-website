"""Preserve complete artwork sets when opening legacy images in a dialog."""
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from metaflash_images import build_image_galleries, render_image_page
from metaflash import render_legacy_body, strip_reviewed_injections


class ImageGalleryTests(unittest.TestCase):
    def test_cover_albums_use_every_full_size_image_instead_of_navigation_thumbnails(self):
        originals, pages, assets = {}, {}, {}
        for base, children, images in [
            ('sirius', ('sirius2', 'sirius3'), ('sirius_front.jpg', 'interior.jpg', 'back.jpg')),
            ('mc1', ('mc1b', 'mc1c'), ('mc.jpg', 'interieur.jpg', 'backmc.jpg')),
        ]:
            names = (base, *children)
            for index, name in enumerate(names):
                path = f'photoshop/{name}.html'
                originals[path] = '<body><a href="' + names[(index + 1) % 3] + '.html">' \
                    '<img src="thumb.jpg" width="60"></a><img src="' + images[index] + '"></body>'
                pages[path] = {'kind': 'page', 'title': name, 'url': '/metaflash/' + path}
                assets['photoshop/' + images[index]] = '/metaflash/photoshop/' + images[index]
        galleries, links = build_image_galleries(originals, pages, assets)
        self.assertEqual([image['src'] for image in galleries['photoshop/sirius.html']['images']],
                         ['photoshop/sirius_front.jpg', 'photoshop/interior.jpg', 'photoshop/back.jpg'])
        self.assertEqual([image['src'] for image in galleries['photoshop/mc1.html']['images']],
                         ['photoshop/mc.jpg', 'photoshop/interieur.jpg', 'photoshop/backmc.jpg'])
        self.assertEqual(links['photoshop/sirius2.html'], {'gallery_id': 'photoshop/sirius.html', 'index': 1})
        self.assertEqual(links['photoshop/mc1c.html'], {'gallery_id': 'photoshop/mc1.html', 'index': 2})
        body = render_image_page(galleries['photoshop/sirius.html'], 'photoshop/sirius.html', 'photoshop/sirius.html')
        self.assertEqual(body.count('<img '), 3)
        self.assertNotIn('thumb.jpg', body)
        self.assertNotIn('menu2.html', body)

    def test_direct_cat_images_retain_click_order_and_image_pages_have_no_hidden_menu_links(self):
        originals = {'menu2.html': '<a href="photocats/3.jpg"><img src="thumb3.jpg"></a>'
                     '<a href="photocats/1.jpg"><img src="thumb1.jpg"></a>',
                     'art.html': '<body><a href="menu2.html"><img src="art.jpg"></a></body>'}
        pages = {'menu2.html': {'kind': 'page', 'title': 'Gallery'},
                 'art.html': {'kind': 'page', 'title': 'Artwork', 'url': '/metaflash/art.html'}}
        assets = {name: '/metaflash/' + name for name in ('photocats/3.jpg', 'photocats/1.jpg', 'art.jpg')}
        galleries, links = build_image_galleries(originals, pages, assets)
        self.assertEqual([item['src'] for item in galleries['photocats']['images']], ['photocats/3.jpg', 'photocats/1.jpg'])
        self.assertEqual(links['photocats/1.jpg']['index'], 1)
        body = render_image_page(galleries['art.html'], 'art.html', 'art.html')
        self.assertNotIn('menu2.html', body)
        result = render_legacy_body('<a href="art.html">Art</a><a href="photocats/1.jpg">Cat</a>',
                                    'menu2.html', pages, assets, {}, image_links=links)
        self.assertIn('data-metaflash-gallery="art.html"', result)
        self.assertIn('data-metaflash-gallery="photocats"', result)
        self.assertIn('data-metaflash-index="1"', result)

    def test_multiple_main_images_are_kept_and_missing_album_parts_fail(self):
        originals = {'art.html': '<img src="one.jpg"><img src="two.jpg">'}
        pages = {'art.html': {'kind': 'page', 'title': 'Two artworks'}}
        assets = {'one.jpg': '/metaflash/one.jpg', 'two.jpg': '/metaflash/two.jpg'}
        galleries, _ = build_image_galleries(originals, pages, assets)
        self.assertEqual([image['src'] for image in galleries['art.html']['images']], ['one.jpg', 'two.jpg'])
        originals = {'photoshop/sirius.html': '<img src="front.jpg">'}
        pages = {'photoshop/sirius.html': {'kind': 'page', 'title': 'Sirius'}}
        with self.assertRaises(ValueError):
            build_image_galleries(originals, pages, {'photoshop/front.jpg': '/metaflash/photoshop/front.jpg'})

    def test_gallery_spacer_run_is_reduced_without_removing_the_next_section(self):
        result = render_legacy_body('<table><tr><td>Last animation credit</td></tr></table>' +
                                   '<br>\n' * 21 + '<table><tr><td>Mes chats</td></tr></table>',
                                   'menu2.html', {}, {}, {})
        self.assertNotIn('<br>\n' * 3, result)
        self.assertIn('Last animation credit', result)
        self.assertIn('Mes chats', result)

    def test_only_two_reviewed_injected_spans_are_removed_and_credits_are_kept(self):
        source = '<body>Music credit<span id="y34d41ca28473534443c0027d0" style="visibility:hidden">' \
                 '<a href="http://www.wcvi.org/unrelated">Injected advertising</a></span>' \
                 '<span>Original artwork title</span></body>'
        result = strip_reviewed_injections(source, 'dragonhunter.html')
        self.assertNotIn('Injected advertising', result)
        self.assertIn('Music credit', result)
        self.assertIn('Original artwork title', result)


if __name__ == '__main__':
    unittest.main()
