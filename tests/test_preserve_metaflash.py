"""Verify private preservation packages without using real backup data."""
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from preserve_metaflash import preserve, verify_package


class PreservationTests(unittest.TestCase):
    def test_complete_snapshot_preserves_bytes_and_detects_damage(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            source = root / 'source'
            source.mkdir()
            (source / 'nested').mkdir()
            (source / 'index.php').write_bytes(b'Never execute archived PHP')
            (source / 'nested/art with spaces.swf').write_bytes(b'Original movie fixture')
            before = {p.relative_to(source): (p.read_bytes(), p.stat().st_mtime_ns)
                      for p in source.rglob('*') if p.is_file()}
            result = preserve(source, root / 'private')
            self.assertEqual(result['files'], 2)
            self.assertEqual(verify_package(root / 'private')['files'], 2)
            self.assertEqual(preserve(source, root / 'private')['archive_sha256'], result['archive_sha256'])
            self.assertEqual(before, {p.relative_to(source): (p.read_bytes(), p.stat().st_mtime_ns)
                                     for p in source.rglob('*') if p.is_file()})
            archive = root / 'private' / result['archive']
            archive.write_bytes(archive.read_bytes()[:-10] + b'CORRUPTION')
            with self.assertRaises(ValueError):
                verify_package(root / 'private')

    def test_source_changes_and_symlink_inputs_require_a_new_snapshot(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            source = root / 'source'
            source.mkdir()
            (source / 'art.jpg').write_bytes(b'Original')
            preserve(source, root / 'private')
            (source / 'art.jpg').write_bytes(b'Changed')
            with self.assertRaises(ValueError):
                preserve(source, root / 'private')
            (source / 'link').symlink_to(root / 'outside')
            with self.assertRaises(ValueError):
                preserve(source, root / 'another-private')
            with self.assertRaises(ValueError):
                preserve(source, source / 'nested-destination')
