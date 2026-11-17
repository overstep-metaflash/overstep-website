"""Require reviewed Spotify/local replacements inside their original articles."""
import hashlib
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from validate_article_audio import validate


class AudioRecoveryTests(unittest.TestCase):
    def fixture(self, root, prefix='/'):
        raw = b'ID3 synthetic personal recording'
        audio = root / 'audio/personal.mp3'
        audio.parent.mkdir()
        audio.write_bytes(raw)
        page = root / '2006/art/index.html'
        page.parent.mkdir(parents=True)
        page.write_text('<main class="entry-content"><audio controls src="' + prefix + 'audio/personal.mp3"></audio>'
                        '<iframe title="Artist — Song — Spotify" width="100%" height="152" '
                        'allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" '
                        'src="https://open.spotify.com/embed/track/3BKKB440Xqlb2eDYzOl1bS?theme=0"></iframe>'
                        '<a href="https://open.spotify.com/track/3BKKB440Xqlb2eDYzOl1bS">Écouter sur Spotify</a></main>')
        records = [{'article_url': '/2006/art/', 'replacement': {'kind': 'local', 'src': '/audio/personal.mp3',
                    'sha256':hashlib.sha256(raw).hexdigest(), 'bytes':len(raw)}},
                   {'article_url': '/2006/art/', 'replacement': {'kind': 'spotify', 'track_id': '3BKKB440Xqlb2eDYzOl1bS',
                    'title':'Artist — Song'}}]
        return records, page, audio

    def test_reviewed_recordings_are_present_at_both_prefixes(self):
        for prefix in ('/', '/overstep-website/'):
            with self.subTest(prefix=prefix), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                records, _, _ = self.fixture(root, prefix)
                self.assertEqual(validate(root, records, 'https://preview.test' + prefix), [])

    def test_wrong_track_and_project_prefix_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            records, page, _ = self.fixture(root)
            page.write_text(page.read_text().replace('3BKKB440Xqlb2eDYzOl1bS', '0000000000000000000000'))
            errors = validate(root, records, 'https://preview.test/overstep-website/')
            self.assertTrue(any('Spotify associations' in error for error in errors), errors)
            self.assertTrue(any('Local audio associations' in error for error in errors), errors)

    def test_missing_player_is_not_satisfied_by_a_preserved_file_or_sidebar(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            records, page, _ = self.fixture(root)
            page.write_text(page.read_text().replace('entry-content', 'sidebar'))
            self.assertTrue(any('Local audio associations' in error for error in validate(root, records)))

    def test_original_recording_hash_is_required(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            records, _, audio = self.fixture(root)
            audio.write_bytes(b'Another recording')
            self.assertTrue(any('Local audio payload' in error for error in validate(root, records)))

    def test_obsolete_dewplayer_cannot_be_republished_as_an_unused_static_file(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            records, _, _ = self.fixture(root)
            obsolete = root / 'wp-content/uploads/2011/dotclear/son/dewplayer.swf'
            obsolete.parent.mkdir(parents=True)
            obsolete.write_bytes(b'Obsolete SWF fixture')
            self.assertTrue(any('Obsolete Dewplayer file' in error for error in validate(root, records)))
