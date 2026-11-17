"""Reject catalogue regressions in actual generated static pages at both base paths."""
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from media_archive import build_archive
import test_media_archive
from validate_media_archive import validate


class ArchiveOutputTests(unittest.TestCase):
    def fixture(self, directory):
        data, sources = test_media_archive.ArchiveCatalogueTests().fixture()
        output, evidence = build_archive(data, sources.__getitem__)
        for name, raw in output.items():
            path = directory / 'archives/metaflash' / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(raw)
        for name, raw in sources.items():
            path = directory / name.lstrip('/')
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(raw)
        for name in ('index.html', 'metaflash/index.html', '2006/art/index.html',
                     'css/metaflash.css', 'css/ruffle-player.css', 'css/media-archive.css',
                     'js/metaflash.js', 'js/ruffle-player.js', 'js/media-archive.js'):
            path = directory / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text('Synthetic target')
        return data, evidence

    def refresh(self, directory, evidence, name):
        raw = (directory / name.lstrip('/')).read_bytes()
        item = next(row for row in evidence['files'] if row['path'] == name)
        item.update(sha256=hashlib.sha256(raw).hexdigest(), bytes=len(raw))

    def test_both_base_paths_have_complete_working_notices(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            data, evidence = self.fixture(root)
            for base in ('https://preview.test/', 'https://preview.test/overstep-website/'):
                self.assertEqual(validate(root, data, evidence, base), [])

    def test_wrong_source_and_unreviewed_output_are_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            data, evidence = self.fixture(root)
            (root / data['reviewed_paths'][0].lstrip('/')).write_bytes(b'Wrong payload')
            (root / 'archives/metaflash/private.txt').write_text('Unreviewed')
            errors = validate(root, data, evidence)
            self.assertTrue(any('Source payload' in error for error in errors), errors)
            self.assertTrue(any('Unreviewed archive file' in error for error in errors), errors)

    def test_prefix_escape_and_missing_original_download_are_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            data, evidence = self.fixture(root)
            name = '/archives/metaflash/0123456789abcdef/index.html'
            page = root / name.lstrip('/')
            page.write_text(page.read_text().replace(' download>', '>').replace('../../../2006/art/', '/2006/art/'))
            self.refresh(root, evidence, name)
            errors = validate(root, data, evidence, 'https://preview.test/overstep-website/')
            self.assertTrue(any('project prefix' in error for error in errors), errors)
            self.assertTrue(any('original downloads' in error for error in errors), errors)

    def test_missing_gallery_frame_is_rejected_even_with_updated_file_hash(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            data, evidence = self.fixture(root)
            name = '/archives/metaflash/manifest.json'
            path = root / name.lstrip('/')
            manifest = json.loads(path.read_text())
            manifest['galleries']['0123456789abcdef']['images'] = []
            path.write_text(json.dumps(manifest))
            self.refresh(root, evidence, name)
            self.assertTrue(any('Image associations' in error for error in validate(root, data, evidence)))
