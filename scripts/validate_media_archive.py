"""Validate the separate catalogue, original bytes and internal-viewer associations."""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import posixpath
from urllib.parse import unquote, urljoin, urlsplit

from media_archive import ROOT, safe_path, sha256


def validate(directory, data, evidence, base_url='https://preview.test/'):
    directory = Path(directory).resolve()
    errors = []
    archive = directory / ROOT.lstrip('/')
    expected = {item['path'].lstrip('/') for item in evidence['files']}
    actual = {file.relative_to(directory).as_posix() for file in archive.rglob('*') if file.is_file()}
    errors.extend('Unreviewed archive file: ' + path for path in sorted(actual - expected))
    if evidence['data_sha256'] != sha256(json.dumps(data, ensure_ascii=False, sort_keys=True).encode()):
        errors.append('Catalogue input differs from the reviewed evidence')
    paths = [asset['path'] for entry in data['entries'] for asset in entry['assets']]
    if sorted(paths) != evidence['source_paths'] or sorted(paths) != sorted(data['reviewed_paths']) or \
            len(paths) != len(set(paths)) or evidence['notices'] != len(data['entries']):
        errors.append('Catalogue coverage differs from the reviewed batch')
    sources = [asset for entry in data['entries'] for asset in entry['assets']]
    for item in evidence['files'] + sources:
        try:
            path = directory / safe_path(item['path']).lstrip('/')
            valid = path.resolve().is_relative_to(directory) and path.is_file() and \
                sha256(path.read_bytes()) == item['sha256'] and path.stat().st_size == item['bytes']
        except (ValueError, OSError):
            valid = False
        if not valid:
            errors.append(('Source payload' if item in sources else 'Archive file') + ' mismatch: ' + item['path'])
    manifest_path = archive / 'manifest.json'
    if not manifest_path.is_file():
        return errors + ['Missing archive viewer manifest']
    manifest = json.loads(manifest_path.read_text())
    images, movies = {}, {}
    for entry in data['entries']:
        identifier = entry['id']
        if entry['kind'] == 'image':
            images[identifier] = [posixpath.relpath(asset['path'].lstrip('/'), ROOT.lstrip('/')) for asset in entry['assets']]
        elif entry.get('playable', True):
            for index, asset in enumerate(entry['assets']):
                movies[identifier + '-' + str(index)] = {
                    'src': posixpath.relpath(asset['path'].lstrip('/'), ROOT.lstrip('/')),
                    'width': asset['width'], 'height': asset['height'],
                    'title': entry['title'] if len(entry['assets']) == 1 else asset['label']}
    if images != {identifier: [image['src'] for image in group['images']]
                  for identifier, group in manifest['galleries'].items()}:
        errors.append('Image associations differ from the reviewed archive')
    if movies != manifest['movies']:
        errors.append('Movie associations differ from the reviewed archive')
    base = urlsplit(base_url)
    prefix = base.path.rstrip('/') + '/'

    class Page(HTMLParser):
        def __init__(self, name):
            super().__init__()
            self.name, self.downloads, self.notices = name, [], set()
            self.viewer, self.dialog = False, False

        def handle_starttag(self, tag, attributes):
            attrs = dict(attributes)
            if tag in {'object', 'embed', 'iframe'} or any(key.startswith('on') for key in attrs) or \
                    'data-metaflash-inline' in attrs or tag == 'script' and not attrs.get('src'):
                errors.append('Unsafe or automatic media markup: ' + self.name)
            if tag == 'dialog' and attrs.get('id') == 'metaflash-dialog':
                self.dialog = True
            if tag == 'script' and attrs.get('data-media-root') == ROOT.lstrip('/') and \
                    attrs.get('data-rewrite-map') == ROOT.lstrip('/') + 'navigation.json':
                self.viewer = True
            if 'data-metaflash-movie' in attrs and attrs['data-metaflash-movie'] not in movies:
                errors.append('Unknown movie link: ' + self.name)
            if 'data-metaflash-gallery' in attrs:
                identifier = attrs['data-metaflash-gallery']
                try:
                    valid = identifier in images and 0 <= int(attrs.get('data-metaflash-index', '0')) < len(images[identifier])
                except ValueError:
                    valid = False
                if not valid:
                    errors.append('Unknown image link: ' + self.name)
            for key in ('href', 'src'):
                if not attrs.get(key) or attrs[key].startswith('#'):
                    continue
                target = urlsplit(urljoin(base_url.rstrip('/') + '/' + self.name, attrs[key]))
                if target.scheme not in {'http', 'https'} or target.netloc != base.netloc:
                    errors.append('Nonlocal catalogue resource: ' + self.name)
                    continue
                decoded = unquote(target.path)
                if not decoded.startswith(prefix):
                    errors.append('Link escapes project prefix: ' + self.name)
                    continue
                local = decoded[len(prefix):]
                path = directory / local
                if decoded.endswith('/'):
                    path /= 'index.html'
                if not path.resolve().is_relative_to(directory) or not path.is_file():
                    errors.append('Missing local target: ' + self.name + ' -> ' + attrs[key])
                if tag == 'a' and 'download' in attrs:
                    self.downloads.append('/' + local)
                if tag == 'a' and local.startswith(ROOT.lstrip('/')):
                    self.notices.add('/' + local)

    for path in sorted(archive.rglob('*.html')):
        name = path.relative_to(directory).as_posix()
        page = Page(name)
        page.feed(path.read_text())
        if not page.viewer or not page.dialog:
            errors.append('Missing internal archive viewer: ' + name)
        if path == archive / 'index.html':
            if not all(ROOT + entry['id'] + '/' in page.notices for entry in data['entries']):
                errors.append('Missing catalogue notice links')
        else:
            entry = next((entry for entry in data['entries'] if path.parent.name == entry['id']), None)
            if entry is None or page.downloads != [asset['path'] for asset in entry['assets']]:
                errors.append('Incomplete original downloads: ' + name)
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', type=Path, required=True)
    parser.add_argument('--base-url', default='https://blog.overstep.fr/')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    data = json.loads((root / 'data/media_archive.json').read_text())
    evidence = json.loads((root / 'docs/media-archive.json').read_text())
    errors = validate(args.directory, data, evidence, args.base_url)
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f"Validated {evidence['notices']} archive notices and {len(evidence['source_paths'])} preserved media paths.")


if __name__ == '__main__':
    main()
