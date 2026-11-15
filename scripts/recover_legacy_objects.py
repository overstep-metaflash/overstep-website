"""Recover the reviewed legacy object sequence in Virtual Tangka."""

import argparse
import json
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, parse_qs

from inventory import NS
from recover_media import copy_media, resolve_media


def extract_objects(source):
    class Objects(HTMLParser):
        def __init__(self):
            super().__init__()
            self.dimensions = (0, 0)
            self.objects = []

        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            if tag in {'object', 'embed'}:
                if attrs.get('width', '').isdigit() and attrs.get('height', '').isdigit():
                    self.dimensions = (int(attrs['width']), int(attrs['height']))
                url = attrs.get('src') or attrs.get('data')
            elif tag == 'param' and attrs.get('name', '').lower() in {'src', 'movie'}:
                url = attrs.get('value')
            else:
                return
            if not url or not url.startswith('/') or url.startswith('//'):
                return
            parsed = urlsplit(url)
            audio = parse_qs(parsed.query).get('son', [None])[0]
            if audio and audio.startswith('/') and not audio.startswith('//') and urlsplit(audio).path.endswith('.mp3'):
                item = ('audio', audio, *self.dimensions)
            elif parsed.path.endswith('.swf') and not parsed.query:
                item = ('ruffle', parsed.path, *self.dimensions)
            else:
                return
            if item not in self.objects:
                self.objects.append(item)

    parser = Objects()
    parser.feed(source)
    return parser.objects


def restore_objects(source, body):
    count = 0
    for kind, src, width, height in extract_objects(source):
        if src in body:
            continue
        if kind == 'audio':
            body = '{{< local-audio src=' + json.dumps(src) + ' >}}\n\n' + body
        else:
            if not width or not height:
                raise ValueError('Missing movie dimensions')
            body += '\n\n{{< ruffle src=' + json.dumps(src) + f' width="{width}" height="{height}" >}}}}\n'
        count += 1
    return body, count


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, required=True)
    args = parser.parse_args()
    blog = Path(__file__).resolve().parents[1]
    site = args.site.resolve()
    if not site.is_relative_to(blog) or not (site / 'hugo.yaml').exists():
        raise SystemExit('Expected a generated site inside blog/')
    item = next(i for i in ET.parse(blog.parent / 'step.WordPress.2026-11-15.xml').findall('./channel/item')
                if i.findtext('wp:post_id', '', NS) == '1857')
    source = item.findtext('content:encoded', '', NS)
    path = site / 'content/posts/virtual-tangka.md'
    parts = path.read_text().split('---', 2)
    parts[2], count = restore_objects(source, parts[2])
    parts[2] = '\n' + parts[2].lstrip('\n')
    recovered = []
    for _, src, _, _ in extract_objects(source):
        asset = resolve_media('https://blog.overstep.fr' + src, 'https://blog.overstep.fr', blog.parent)
        if not asset:
            raise ValueError('Missing backed-up media: ' + src)
        origin, relative = asset
        digest = copy_media(origin, site / 'static', relative)
        recovered.append({'path': relative, 'sha256': digest})
    path.write_text('---'.join(parts))
    report = {'post_id': '1857', 'added_players': count, 'media': recovered}
    (blog / 'migration/reports/legacy-objects.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
