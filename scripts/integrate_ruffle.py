"""Apply repeatable Ruffle theme overrides and convert legacy SWF markers."""

import argparse
import base64
import hashlib
import io
import json
import re
import shlex
import shutil
import tarfile
import urllib.request
from pathlib import Path
from urllib.parse import unquote, urlsplit

RUFFLE_URL = 'https://registry.npmjs.org/@ruffle-rs/ruffle/-/ruffle-0.7.1.tgz'
RUFFLE_INTEGRITY = '6ZWxx/cfX3RoNyQ1AVimECSae4gKqMxdPimOD+chiIcOFiJS0ATGKcjkretxNT03lqNUpiSyJjF55AuvvZ+QeA=='


def install_runtime(target):
    with urllib.request.urlopen(RUFFLE_URL, timeout=60) as response:
        archive = response.read()
    if base64.b64encode(hashlib.sha512(archive).digest()).decode() != RUFFLE_INTEGRITY:
        raise ValueError('Ruffle package integrity mismatch')
    target.mkdir(parents=True, exist_ok=True)
    with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as package:
        for member in package.getmembers():
            if not member.isfile():
                continue
            relative = Path(member.name).relative_to('package')
            destination = target / relative
            if not destination.resolve().is_relative_to(target.resolve()):
                raise ValueError('Unsafe archive path')
            if destination.suffix in {'.js', '.wasm', '.map'} or destination.name.startswith('LICENSE'):
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_bytes(package.extractfile(member).read())


def convert_swf(text):
    def replace(match):
        raw = match[1].translate(str.maketrans({'“': '"', '”': '"', '‘': "'", '’': "'"}))
        tokens = shlex.split(raw)
        if not tokens:
            raise ValueError('Empty SWF marker')
        src = tokens.pop(0)
        parsed = urlsplit(src)
        if (not src.startswith('/') or src.startswith('//') or parsed.scheme
                or '..' in Path(unquote(parsed.path)).parts or not parsed.path.lower().endswith('.swf')):
            raise ValueError('Expected a local SWF path: ' + src)
        if len(tokens) == 2 and all(token.isdigit() for token in tokens):
            attrs = dict(zip(('width', 'height'), tokens))
        else:
            attrs = dict(token.split('=', 1) for token in tokens)
        if any(not attrs.get(k, '').isdigit() or not 0 < int(attrs[k]) <= 10000 for k in ('width', 'height')):
            raise ValueError('Invalid SWF dimensions')
        if set(attrs) - {'width', 'height', 'allowfullscreen'}:
            raise ValueError('Unknown SWF attributes')
        fields = {'src': src, 'width': attrs['width'], 'height': attrs['height']}
        if 'allowfullscreen' in attrs:
            if attrs['allowfullscreen'] not in {'true', 'false'}:
                raise ValueError('Invalid fullscreen setting')
            fields['fullscreen'] = attrs['allowfullscreen']
        return '{{< ruffle ' + ' '.join(k + '=' + json.dumps(v, ensure_ascii=False) for k, v in fields.items()) + ' >}}'
    return re.subn(r'\\?\[swf:(.*?)\\?\]', replace, text, flags=re.I | re.S)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, required=True)
    args = parser.parse_args()
    blog = Path(__file__).resolve().parents[1]
    site = args.site.resolve()
    if not site.is_relative_to(blog) or not (site / 'hugo.yaml').is_file():
        raise SystemExit('Expected a generated Hugo site inside blog/')
    install_runtime(site / 'static/vendor/ruffle/0.7.1')
    changes = []
    for path in sorted((site / 'content').rglob('*.md')):
        original = path.read_text()
        parts = original.split('---', 2)
        if len(parts) != 3:
            raise ValueError('Unexpected front matter: ' + str(path))
        body, count = convert_swf(parts[2])
        if count:
            changes.append((path, '---'.join(parts[:2]) + '---' + body, count))
    for path, content, count in changes:
        path.write_text(content)
    overlay = blog / 'theme-overrides'
    shutil.copytree(overlay, site, dirs_exist_ok=True)
    config = site / 'hugo.yaml'
    settings = config.read_text().replace('languageCode: fr-FR', 'locale: fr-FR')
    if 'defaultContentLanguage:' not in settings:
        settings += '\ndefaultContentLanguage: fr\n'
    config.write_text(settings)
    comments = site / 'layouts/partials/comments.html'
    comments.write_text(comments.read_text().replace('.Site.Data.comments', 'hugo.Data.comments'))
    report = {'ruffle_version': '0.7.1', 'converted_blocks': sum(c for _, _, c in changes),
              'changed_files': [str(p.relative_to(site)) for p, _, _ in changes]}
    if changes:
        (blog / 'migration/reports/ruffle-conversion.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
