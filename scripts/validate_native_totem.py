"""Check native sidebar navigation and preserved source/media in built output."""
import argparse
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

BLOG = Path(__file__).resolve().parents[1]
BUTTONS = ['19', '46', '52', '68', '79', '93', '103', '150', '213']


def navigation_errors(html, routes, prefix='/'):
    class Navigation(HTMLParser):
        def __init__(self):
            super().__init__()
            self.inside = False
            self.controls = []
            self.manifests = []
        def handle_starttag(self, tag, attrs):
            data = dict(attrs)
            if 'data-totem' in data:
                self.inside = True
                self.manifests.append(data.get('data-audio-manifest'))
            if self.inside and 'data-totem-button' in data:
                self.controls.append(data)
        def handle_endtag(self, tag):
            if tag == 'nav':
                self.inside = False
    parsed = Navigation()
    parsed.feed(html)
    errors = []
    if [c['data-totem-button'] for c in parsed.controls] != BUTTONS:
        errors.append('Expected eight ordered links and one decorative interaction')
    if parsed.manifests != [prefix + 'theme/step/totem/audio.json']:
        errors.append('Missing or incorrectly prefixed native sound manifest')
    for control, route in zip(parsed.controls, routes):
        destination = route['destination']
        expected = prefix + destination.lstrip('/') if destination.startswith('/') else destination
        if control.get('href') != expected or control.get('aria-label') != route['label']:
            errors.append('Incorrect native destination: ' + route['label'])
        if control.get('target'):
            errors.append('Native menu must retain current-tab links')
    if parsed.controls and parsed.controls[-1].get('role') != 'button':
        errors.append('Decorative interaction must remain keyboard accessible')
    if 'data-kind="navigation"' in html or 'data-swf="' + prefix + 'theme/step/menu.swf' in html:
        errors.append('Sidebar must not instantiate the original SWF')
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', type=Path, default=Path('public'))
    parser.add_argument('--base-url', default='https://blog.overstep.fr/')
    args = parser.parse_args()
    output = args.directory.resolve()
    prefix = urlsplit(args.base_url).path.rstrip('/') + '/'
    manifest = json.loads((BLOG / 'docs/native-totem.json').read_text())
    for name, expected in manifest['files'].items():
        if not name.startswith('static/'):
            continue
        file = output / name.removeprefix('static/')
        if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest() != expected:
            raise SystemExit('Native totem asset hash differs: ' + name)
    movie = output / manifest['source'].lstrip('/')
    if not movie.is_file() or hashlib.sha256(movie.read_bytes()).hexdigest() != manifest['source_sha256']:
        raise SystemExit('The preserved original menu movie differs')
    routes = json.loads((BLOG / 'theme-overrides/static/theme/step/menu-links.json').read_text())
    checked = 0
    for page in output.rglob('*.html'):
        html = page.read_bytes().decode('utf-8', errors='replace')
        if 'data-totem' not in html:
            continue
        errors = navigation_errors(html, routes, prefix)
        if errors:
            raise SystemExit(str(page.relative_to(output)) + ': ' + '; '.join(errors))
        checked += 1
    for name in ('index.html', '2006/02/11/sauvons-la-princesse/index.html', 'category/anim-flash/index.html'):
        file = output / name
        if not file.is_file() or 'data-totem' not in file.read_text():
            raise SystemExit('Missing native navigation in ' + name)
    print(f'Validated native totem in {checked} pages; original SWF and extracted asset hashes match.')


if __name__ == '__main__':
    main()
