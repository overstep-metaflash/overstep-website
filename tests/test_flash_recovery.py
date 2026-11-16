import hashlib
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from recover_article_flash import extract_movies, restore_movies
from flash_manifest import reconcile_article, reconcile_audio, validate_coverage


def movie(src='/first.swf', **extra):
    return dict(src=src, width=550, height=690, fullscreen=False,
                sha256=hashlib.sha256(b'movie').hexdigest(), insert_before='', **extra)


class FlashRecoveryTests(unittest.TestCase):
    def test_nested_alternative_markup_is_one_movie_with_source_settings(self):
        source = '''<object data="/first.swf" width="550" height="690">
        <param name="allowFullScreen" value="true">
        <param name="movie" value="/first.swf">
        <embed src="/first.swf" width="550" height="690" allowfullscreen="true">
        </object><p>Music credit</p>'''
        movies = extract_movies(source, '/2006/article/')
        self.assertEqual(len(movies), 1)
        self.assertEqual({k: movies[0][k] for k in ('src', 'width', 'height', 'fullscreen')},
                         dict(src='/first.swf', width=550, height=690, fullscreen=True))
        self.assertLess(movies[0]['end'], source.index('Music credit'))

    def test_distinct_object_data_and_movie_parameter_are_both_preserved(self):
        movies = extract_movies('''<object data="/first.swf" width="550" height="690">
            <param name="movie" value="/second.swf"></object>''', '/post/')
        self.assertEqual([m['src'] for m in movies], ['/first.swf', '/second.swf'])
        self.assertEqual([m['height'] for m in movies], [690, 690])

    def test_relative_snapshot_path_and_standalone_embed(self):
        movies = extract_movies('''<embed src="../../../../wp-content/a.swf"
            width="420" height="300" allowfullscreen="false">''', '/2006/01/02/post/')
        self.assertEqual(movies[0]['src'], '/wp-content/a.swf')
        self.assertFalse(movies[0]['fullscreen'])
        self.assertEqual(extract_movies('<embed src="https://other.test/a.swf" width="1" height="2">', '/'), [])

    def test_missing_dimensions_fail_without_guessing(self):
        with self.assertRaisesRegex(ValueError, 'dimensions'):
            extract_movies('<object data="/first.swf"></object>', '/')

    def test_snapshot_missing_object_end_stops_before_table_caption(self):
        source = '<table><tr><td><object data="/first.swf" width="550" height="690"></td></tr></table><p>Caption</p>'
        movies = extract_movies(source, '/')
        self.assertEqual(len(movies), 1)
        self.assertLess(movies[0]['end'], source.index('Caption'))

    def test_snapshot_unclosed_object_does_not_consume_following_credit(self):
        source = '<p><object data="/first.swf" width="550" height="690"><param name="movie" value="/first.swf"><br>Artist credit</p>'
        movies = extract_movies(source, '/')
        self.assertLess(movies[0]['end'], source.index('Artist credit'))

    def test_empty_body_and_multiple_movies_are_restored_in_source_order(self):
        movies = [movie(), movie('/second.swf')]
        body = restore_movies('', movies)
        self.assertLess(body.index('/first.swf'), body.index('/second.swf'))
        self.assertIn('width="550" height="690" fullscreen="false"', body)
        self.assertEqual(restore_movies(body, movies), body)

    def test_companion_audio_precedes_the_movie_and_existing_music_credit(self):
        audio = dict(kind='audio', src='/approved.mp3', position='start', insert_before='')
        body = restore_movies('(sample: Artist)', [dict(movie(), insert_before='(sample: Artist)')])
        body = restore_movies(body, [audio])
        self.assertLess(body.index('local-audio'), body.index('ruffle'))
        self.assertLess(body.index('ruffle'), body.index('(sample: Artist)'))
        self.assertEqual(restore_movies(body, [audio]), body)

    def test_reviewed_anchor_preserves_prose_captions_and_other_media(self):
        body = 'Introduction\n\n![](/existing.jpg) (sample: Artist)\n\nCleaned text.'
        item = movie()
        item['insert_before'] = '(sample: Artist)'
        restored = restore_movies(body, [item])
        self.assertLess(restored.index('/existing.jpg'), restored.index('/first.swf'))
        self.assertLess(restored.index('/first.swf'), restored.index('(sample: Artist)'))
        self.assertIn('Cleaned text.', restored)
        self.assertEqual(restore_movies(restored, [item]), restored)

    def test_missing_or_ambiguous_anchor_fails(self):
        item = movie()
        item['insert_before'] = 'caption'
        for body in ('other prose', 'caption and caption'):
            with self.assertRaisesRegex(ValueError, 'anchor'):
                restore_movies(body, [item])


class FlashReconciliationTests(unittest.TestCase):
    def test_companion_audio_requires_a_rendered_player_and_exact_payload(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            (output / 'approved.mp3').write_bytes(b'movie')
            audio = [dict(src='/approved.mp3', sha256=movie()['sha256'])]
            page = '<div class="entry-content"><audio controls src="/preview/approved.mp3"></audio></div>'
            self.assertEqual(reconcile_audio(page, audio, output, '/preview/'), [])
            self.assertTrue(reconcile_audio('<a href="/preview/approved.mp3">Download</a>', audio, output, '/preview/'))
            (output / 'approved.mp3').write_bytes(b'wrong')
            self.assertTrue(reconcile_audio(page, audio, output, '/preview/'))

    def test_manifest_covers_every_audited_association_exactly_once(self):
        audit = [{'post_id': '1', 'resolved_path': '/first.swf'}]
        articles = [{'post_id': '1', 'movies': [movie()]}]
        self.assertEqual(validate_coverage(articles, audit), [])
        for broken in ([], articles + articles,
                       [{'post_id': '2', 'movies': [movie()]}]):
            self.assertTrue(validate_coverage(broken, audit))

    def test_public_manifest_covers_the_complete_audit(self):
        root = Path(__file__).resolve().parents[1]
        manifest = json.loads((root / 'docs/flash-recovery.json').read_text())
        audit = json.loads((root / 'docs/audits/2026-11-16-content.json').read_text())
        self.assertEqual(validate_coverage(manifest['articles'], audit['missing_embedded_flash']), [])
        companions = {(a['post_id'], item['src']) for a in manifest['articles'] for item in a.get('audio', [])}
        self.assertEqual(companions, {
            ('1845', '/wp-content/uploads/2011/dotclear/son/oneshot.mp3'),
            ('2071', '/wp-content/uploads/2011/dotclear/son/everyoneintheworld.mp3'),
        })

    def test_checks_article_association_order_dimensions_fullscreen_and_payload(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            for name in ('first.swf', 'second.swf'):
                (output / name).write_bytes(b'movie')
            items = [movie(), movie('/second.swf')]
            def player(src, width=550, fullscreen='false'):
                return (f'<span class="flash-animation" data-swf="/preview{src}" '
                        f'data-fullscreen="{fullscreen}" style="max-width: {width}px;">'
                        '<span class="flash-player" style="aspect-ratio: 550 / 690;"></span></span>')
            page = '<aside>' + player('/menu.swf') + '</aside><div class="entry-content">'
            page += player('/first.swf') + player('/second.swf') + '</div>'
            self.assertEqual(reconcile_article(page, items, output, '/preview/'), [])
            for broken in (page.replace(player('/first.swf'), ''),
                           page.replace('/first.swf', '/other.swf'),
                           page.replace('550px', '551px'),
                           page.replace('false', 'true'),
                           page.replace(player('/first.swf') + player('/second.swf'),
                                        player('/second.swf') + player('/first.swf'))):
                self.assertTrue(reconcile_article(broken, items, output, '/preview/'))
            (output / 'first.swf').write_bytes(b'wrong variant')
            self.assertTrue(reconcile_article(page, items, output, '/preview/'))


if __name__ == '__main__':
    unittest.main()
