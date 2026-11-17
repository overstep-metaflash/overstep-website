"""Validate generated portfolio output without archived inputs."""
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from validate_metaflash import validate


class MetaflashValidationTests(unittest.TestCase):
    def fixture(self, root):
        portfolio = root / 'metaflash'
        portfolio.mkdir()
        (portfolio / 'art.swf').write_bytes(b'FWS synthetic public fixture')
        (portfolio / 'index.html').write_text('<main><div data-metaflash-inline="home"></div></main>'
                                             '<dialog id="metaflash-dialog"></dialog>')
        (portfolio / 'manifest.json').write_text(json.dumps({'pages': {
            'index.html': {'url': '/metaflash/', 'kind': 'home', 'movie_id': 'home'}},
            'movies': {'home': {'src': 'art.swf', 'width': 640, 'height': 480}}}))
        return {'output_files': [{'path': '/metaflash/' + p.name,
                                 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'bytes': p.stat().st_size}
                                for p in portfolio.iterdir()]}

    def test_hash_missing_file_and_unreviewed_output_fail(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            evidence = self.fixture(root)
            self.assertEqual(validate(root, evidence), [])
            (root / 'metaflash/art.swf').write_bytes(b'Wrong variant')
            self.assertTrue(any('hash' in error for error in validate(root, evidence)))
            (root / 'metaflash/art.swf').unlink()
            self.assertTrue(any('Missing' in error for error in validate(root, evidence)))
            (root / 'metaflash/private.fla').write_text('Not reviewed')
            self.assertTrue(any('Unreviewed' in error for error in validate(root, evidence)))

    def test_unknown_player_and_unsafe_markup_fail_even_with_matching_hash(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            evidence = self.fixture(root)
            page = root / 'metaflash/index.html'
            page.write_text('<div data-metaflash-inline="unknown"></div><script>alert(1)</script>')
            for item in evidence['output_files']:
                if item['path'].endswith('.html'):
                    item['sha256'] = hashlib.sha256(page.read_bytes()).hexdigest()
                    item['bytes'] = page.stat().st_size
            errors = validate(root, evidence)
            self.assertTrue(any('Unknown movie' in error for error in errors))
            self.assertTrue(any('Unsafe' in error for error in errors))

    def test_restored_guestbook_requires_its_reviewed_safe_archive(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            evidence = self.fixture(root)
            evidence['guestbook'] = {'retained': 1, 'source_sha256': 'a' * 64, 'data_sha256': 'b' * 64}
            self.assertTrue(any('guestbook' in error.lower() for error in validate(root, evidence)))

    def test_image_sets_cannot_drop_views_or_point_to_missing_files(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            evidence = self.fixture(root)
            image = root / 'metaflash/front.jpg'
            image.write_bytes(b'\xff\xd8synthetic public fixture')
            evidence['output_files'].append({'path': '/metaflash/front.jpg', 'bytes': image.stat().st_size,
                'sha256': hashlib.sha256(image.read_bytes()).hexdigest()})
            manifest = root / 'metaflash/manifest.json'
            client = json.loads(manifest.read_text())
            client['galleries'] = {'covers': {'title': 'Covers', 'images': [{'src': 'front.jpg', 'alt': '', 'caption': ''}]}}
            manifest.write_text(json.dumps(client))
            for item in evidence['output_files']:
                if item['path'].endswith('manifest.json'):
                    item['sha256'] = hashlib.sha256(manifest.read_bytes()).hexdigest()
            evidence['image_associations'] = {'covers': ['front.jpg', 'missing-back.jpg']}
            self.assertTrue(any('image' in error.lower() for error in validate(root, evidence)))
            evidence['image_associations'] = {'covers': ['front.jpg']}
            self.assertFalse(validate(root, evidence))
            image.unlink()
            self.assertTrue(any('image' in error.lower() for error in validate(root, evidence)))
