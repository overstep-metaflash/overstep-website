"""Check the reviewed portfolio files, player associations and safe local links."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from metaflash_guestbook import validate_guestbook_html
from metaflash_images import render_image_page


def validate(directory, evidence, base_url='https://preview.test/', guestbook=None):
    directory = Path(directory).resolve()
    errors = []
    files = evidence['output_files']
    expected = {item['path'].lstrip('/') for item in files}
    actual = {p.relative_to(directory).as_posix() for p in (directory / 'metaflash').rglob('*') if p.is_file()}
    for path in sorted(actual - expected):
        errors.append('Unreviewed portfolio file: ' + path)
    for item in files:
        path = directory / item['path'].lstrip('/')
        if not path.resolve().is_relative_to(directory):
            errors.append('Unsafe evidence path: ' + item['path'])
        elif not path.is_file():
            errors.append('Missing portfolio file: ' + item['path'])
        elif hashlib.sha256(path.read_bytes()).hexdigest() != item['sha256']:
            errors.append('Portfolio hash mismatch: ' + item['path'])
    client_path = directory / 'metaflash/manifest.json'
    if not client_path.is_file():
        return errors + ['Missing portfolio client manifest']
    client = json.loads(client_path.read_text())
    movies = client['movies']
    galleries = client.get('galleries', {})
    associations = {identifier: [image['src'] for image in gallery['images']]
                    for identifier, gallery in galleries.items()}
    if associations != evidence.get('image_associations', {}):
        errors.append('Image gallery associations differ from the reviewed evidence')
    for identifier, gallery in galleries.items():
        if not gallery['images']:
            errors.append('Empty image gallery: ' + identifier)
        for image in gallery['images']:
            asset = directory / 'metaflash' / image['src']
            if 'metaflash/' + image['src'] not in expected or not asset.is_file():
                errors.append('Missing image gallery asset: ' + identifier + ' -> ' + image['src'])
    for identifier, movie in movies.items():
        if 'metaflash/' + movie['src'] not in expected:
            errors.append('Missing movie asset: ' + identifier)
        if not all(0 < movie[key] <= 10000 for key in ('width', 'height')):
            errors.append('Invalid movie dimensions: ' + identifier)
    base = urlsplit(base_url)
    prefix = base.path.rstrip('/') + '/'

    class Page(HTMLParser):
        def __init__(self, path):
            super().__init__()
            self.path, self.inline, self.dialog = path, [], False

        def handle_starttag(self, tag, attributes):
            attrs = dict(attributes)
            if tag in {'object', 'embed', 'iframe'} or any(key.startswith('on') for key in attrs):
                errors.append('Unsafe historical markup: ' + self.path)
            if tag == 'script' and not attrs.get('src'):
                errors.append('Unsafe inline script: ' + self.path)
            if tag == 'dialog' and attrs.get('id') == 'metaflash-dialog':
                self.dialog = True
            for key in ('data-metaflash-inline', 'data-metaflash-movie'):
                if key in attrs and attrs[key] not in movies:
                    errors.append('Unknown movie association: ' + self.path + ' -> ' + attrs[key])
            if 'data-metaflash-gallery' in attrs:
                identifier = attrs['data-metaflash-gallery']
                try:
                    index = int(attrs.get('data-metaflash-index', '0'))
                    valid = identifier in galleries and 0 <= index < len(galleries[identifier]['images'])
                except ValueError:
                    valid = False
                if not valid:
                    errors.append('Unknown image association: ' + self.path + ' -> ' + identifier)
            if 'data-metaflash-inline' in attrs:
                self.inline.append(attrs['data-metaflash-inline'])
            for key in ('href', 'src'):
                if not attrs.get(key) or attrs[key].startswith('#'):
                    continue
                url = urlsplit(urljoin(base_url.rstrip('/') + '/' + self.path, attrs[key]))
                if url.scheme in {'javascript', 'data', 'file'}:
                    errors.append('Unsafe link: ' + self.path)
                if url.scheme not in {'http', 'https'}:
                    continue
                if url.netloc != base.netloc:
                    if tag in {'script', 'img'}:
                        errors.append('Unsafe external resource: ' + self.path)
                    continue
                decoded = unquote(url.path)
                if not decoded.startswith(prefix):
                    errors.append('Link escapes project prefix: ' + self.path)
                    continue
                target = directory / decoded[len(prefix):]
                if url.path.endswith('/'):
                    target = target / 'index.html'
                if not target.resolve().is_relative_to(directory) or not target.is_file():
                    errors.append('Missing local target: ' + self.path + ' -> ' + attrs[key])

    for file in sorted((directory / 'metaflash').rglob('*.html')):
        path = file.relative_to(directory).as_posix()
        parser = Page(path)
        parser.feed(file.read_text())
        if not parser.dialog:
            errors.append('Missing internal viewer: ' + path)
        page = client['pages'].get(file.relative_to(directory / 'metaflash').as_posix())
        if page and page['kind'] in {'home', 'movie'} and parser.inline != [page['movie_id']]:
            errors.append('Missing page player: ' + path)
        if page and page['kind'] == 'image':
            group = galleries.get(page['gallery_id'])
            if not group or render_image_page(group, page['gallery_id'], file.relative_to(directory / 'metaflash').as_posix()) not in file.read_text():
                errors.append('Incomplete image page: ' + path)
    if 'guestbook' in evidence:
        if guestbook is None:
            errors.append('Missing reviewed guestbook archive')
        else:
            book_evidence = evidence['guestbook']
            digest = hashlib.sha256(json.dumps(guestbook, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
            if digest != book_evidence['data_sha256'] or len(guestbook['entries']) != book_evidence['retained'] or \
                    guestbook['source_sha256'] != book_evidence['source_sha256']:
                errors.append('Guestbook archive differs from the reviewed evidence')
            book_path = directory / 'metaflash/guestbook.html'
            if book_path.is_file():
                errors.extend(validate_guestbook_html(book_path.read_text(), guestbook))
            else:
                errors.append('Missing restored guestbook page')
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', type=Path, required=True)
    parser.add_argument('--base-url', default='https://blog.overstep.fr/')
    args = parser.parse_args()
    evidence = json.loads((Path(__file__).resolve().parents[1] / 'docs/metaflash-recovery.json').read_text())
    guestbook = json.loads((Path(__file__).resolve().parents[1] / 'data/metaflash_guestbook.json').read_text())
    errors = validate(args.directory, evidence, args.base_url, guestbook)
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f"Validated {len(evidence['output_files'])} reviewed Metaflash files and their player/link associations.")


if __name__ == '__main__':
    main()
