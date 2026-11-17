"""Exercise the public archive without accessing private migration inputs."""
import copy
import hashlib
from io import BytesIO
from pathlib import Path
import sys
import unittest

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from media_archive import build_archive, make_thumbnail


class ArchiveCatalogueTests(unittest.TestCase):
    def fixture(self):
        image = Image.new('RGB', (800, 400), '#123456')
        stream = BytesIO()
        exif = Image.Exif()
        exif[270] = 'private fixture metadata'
        image.save(stream, 'JPEG', exif=exif)
        raw = stream.getvalue()
        path = '/wp-content/uploads/art original.jpg'
        data = {'version': 1, 'batch': 'synthetic', 'reviewed_paths': [path],
                'entries': [{'id': '0123456789abcdef', 'title': 'Original artwork', 'kind': 'image',
                    'collection': 'blog', 'note': '', 'related_articles': [{'url': '/2006/art/',
                    'title': 'Published article', 'display_date': '2006-01-01'}],
                    'assets': [{'path': path, 'sha256': hashlib.sha256(raw).hexdigest(),
                    'bytes': len(raw), 'label': 'Original', 'aliases': [path]}]}]}
        return data, {path: raw}

    def test_preview_is_small_preserves_aspect_and_strips_metadata(self):
        _, files = self.fixture()
        raw = next(iter(files.values()))
        preview = make_thumbnail(raw)
        with Image.open(BytesIO(preview)) as image:
            self.assertEqual(image.size, (320, 160))
            self.assertNotIn('exif', image.info)
        self.assertEqual(hashlib.sha256(raw).hexdigest(), hashlib.sha256(next(iter(files.values()))).hexdigest())

    def test_catalogue_has_notices_filters_downloads_and_prefix_independent_viewer(self):
        data, files = self.fixture()
        output, evidence = build_archive(data, files.__getitem__)
        root = output['index.html'].decode()
        self.assertIn('Rechercher', root)
        self.assertIn('data-archive-kind', root)
        self.assertIn('data-media-root="archives/metaflash/"', root)
        self.assertIn('data-metaflash-gallery=', root)
        self.assertNotIn('<iframe', root)
        notice = output['0123456789abcdef/index.html'].decode()
        self.assertIn('Télécharger l’original', notice)
        self.assertIn('../../../wp-content/uploads/art%20original.jpg', notice)
        self.assertIn('../../../2006/art/', notice)
        self.assertIn('download', notice)
        self.assertEqual(evidence['notices'], 1)
        self.assertEqual(evidence['source_paths'], data['reviewed_paths'])
        renamed = copy.deepcopy(data)
        renamed['entries'][0]['title'] = 'Corrected title'
        self.assertIn('0123456789abcdef/index.html', build_archive(renamed, files.__getitem__)[0])

    def test_wrong_bytes_unsafe_urls_or_unreviewed_files_are_rejected(self):
        data, files = self.fixture()
        with self.assertRaises(ValueError):
            build_archive(data, lambda _: b'Wrong file variant')
        data['entries'][0]['assets'][0]['path'] = 'https://unreviewed.test/private.jpg'
        with self.assertRaises(ValueError):
            build_archive(data, files.__getitem__)
        data, files = self.fixture()
        data['reviewed_paths'].append('/unexpected.jpg')
        with self.assertRaises(ValueError):
            build_archive(data, files.__getitem__)

    def test_title_and_article_text_are_escaped(self):
        data, files = self.fixture()
        data['entries'][0]['title'] = '<script>not executable</script>'
        page = build_archive(data, files.__getitem__)[0]['index.html'].decode()
        self.assertNotIn('<script>not executable', page)
        self.assertIn('&lt;script&gt;not executable&lt;/script&gt;', page)

    def test_ftp_notice_retains_source_provenance_and_labels_metadata_safe_download(self):
        data, files = self.fixture()
        old = data['reviewed_paths'][0]
        new = '/archives/metaflash/media/fixture.jpg'
        files[new] = files.pop(old)
        data['reviewed_paths'] = [new]
        entry = data['entries'][0]
        entry['collection'] = 'illustrations'
        asset = entry['assets'][0]
        asset.update(path=new, aliases=[new], metadata_removed=True,
                     download_label='Télécharger la version sans métadonnées',
                     source_files=[{'path':'images/original.jpg','sha256':asset['sha256'],'bytes':asset['bytes']}])
        output, _ = build_archive(data, files.__getitem__)
        notice = output['0123456789abcdef/index.html'].decode()
        self.assertIn('images/original.jpg', notice)
        self.assertIn('Télécharger la version sans métadonnées', notice)
        self.assertIn('archive privée', notice)
