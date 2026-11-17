"""Verify complete FTP batch coverage without real private backup files."""
import hashlib
from io import BytesIO
from pathlib import Path
import sys
import unittest

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from ftp_catalogue import compile_batch, source_id, strip_jpeg_metadata, verify_coverage


class FtpCatalogueTests(unittest.TestCase):
    def fixture(self):
        image = Image.new('RGB', (80, 40), '#123456')
        exif = Image.Exif()
        exif[270] = 'Private fixture metadata'
        stream = BytesIO()
        image.save(stream, 'JPEG', exif=exif)
        raw = stream.getvalue()
        files = {'art.jpg': raw, 'copy.jpg': raw}
        records = [{'source': name, 'kind': 'image', 'bytes':len(value),
                    'sha256':hashlib.sha256(value).hexdigest()} for name,value in files.items()]
        review = {source_id(name): {'decision':'include', 'collection':'illustrations', 'group':'art', 'title':'Art'} for name in files}
        return files, records, review

    def test_metadata_removal_preserves_compressed_pixels_and_private_original(self):
        files, _, _ = self.fixture()
        original = files['art.jpg']
        clean = strip_jpeg_metadata(original)
        with Image.open(BytesIO(original)) as before, Image.open(BytesIO(clean)) as after:
            self.assertEqual(before.tobytes(), after.tobytes())
            self.assertEqual(before.size, after.size)
            self.assertEqual(dict(after.getexif()), {})
        self.assertNotIn(b'Private fixture metadata', clean)
        self.assertEqual(files['art.jpg'], original)

    def test_duplicate_paths_share_one_asset_and_all_sources_remain_accounted_for(self):
        files, records, review = self.fixture()
        entries, output, coverage = compile_batch(records, files.__getitem__, review)
        self.assertEqual(len(entries), 1)
        self.assertEqual(len(entries[0]['assets']), 1)
        self.assertEqual(len(entries[0]['assets'][0]['source_files']), 2)
        self.assertEqual(len(output), 1)
        self.assertEqual(len(coverage), 2)
        self.assertTrue(all(row['status']=='included' for row in coverage))
        self.assertTrue(entries[0]['assets'][0]['metadata_removed'])

    def test_private_payload_cannot_leak_through_a_second_source_alias(self):
        files, records, review = self.fixture()
        review[source_id('copy.jpg')]['decision'] = 'private'
        entries, output, coverage = compile_batch(records, files.__getitem__, review)
        self.assertEqual(entries, [])
        self.assertEqual(output, {})
        self.assertEqual({row['status'] for row in coverage}, {'private'})
        self.assertTrue(all('source' not in row for row in coverage))

    def test_missing_review_wrong_variant_and_traversal_are_rejected(self):
        files, records, review = self.fixture()
        with self.assertRaises(ValueError):
            compile_batch(records, files.__getitem__, {})
        with self.assertRaises(ValueError):
            compile_batch(records, lambda _:b'Another file', review)
        records[0]['source'] = '../outside.jpg'
        with self.assertRaises(ValueError):
            compile_batch(records, files.__getitem__, review)

    def test_notice_identity_survives_title_changes(self):
        files, records, review = self.fixture()
        first = compile_batch(records, files.__getitem__, review)[0][0]['id']
        for item in review.values():
            item['title'] = 'Corrected title'
        self.assertEqual(compile_batch(records, files.__getitem__, review)[0][0]['id'], first)

    def test_public_evidence_cannot_drop_a_source_path_or_invent_an_association(self):
        files, records, review = self.fixture()
        entries, _, coverage = compile_batch(records, files.__getitem__, review)
        evidence = {'source_paths':2,'coverage':coverage}
        self.assertEqual(verify_coverage(entries,evidence,review),[])
        evidence['coverage'] = coverage[:1]
        self.assertTrue(verify_coverage(entries,evidence,review))
        evidence['coverage'] = coverage
        coverage[0]['notice_id'] = '0000000000000000'
        self.assertTrue(verify_coverage(entries,evidence,review))

    def test_private_evidence_cannot_publish_a_private_filename(self):
        files, records, review = self.fixture()
        review[source_id('copy.jpg')]['decision']='private'
        entries, _, coverage = compile_batch(records,files.__getitem__,review)
        evidence = {'source_paths':2,'coverage':coverage}
        self.assertEqual(verify_coverage(entries,evidence,review),[])
        coverage[0]['source']='private-photo.jpg'
        self.assertTrue(verify_coverage(entries,evidence,review))
