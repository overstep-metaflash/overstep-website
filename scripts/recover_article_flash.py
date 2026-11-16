"""Restore only reviewed Flash players; never reimport archived article prose."""

import argparse
import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


def extract_movies(source, article_url):
    """Read legacy object/embed settings without executing detection scripts."""
    class Movies(HTMLParser):
        def __init__(self):
            super().__init__()
            self.stack = []
            self.movies = []
            self.lines = [0] + [m.end() for m in re.finditer('\n', source)]

        def source_offset(self):
            line, column = self.getpos()
            return self.lines[line - 1] + column

        def add(self, context, url):
            parsed = urlsplit(urljoin('https://blog.overstep.fr' + article_url, url))
            if parsed.netloc not in {'blog.overstep.fr', 'wp.overstep.fr'}:
                return
            if not parsed.path.lower().endswith('.swf') or parsed.query:
                return
            src = unquote(parsed.path)
            if src not in context['paths']:
                context['paths'].append(src)

        def finish(self, context, end):
            for src in context['paths']:
                if any(m['src'] == src for m in self.movies):
                    continue
                width, height = context['width'], context['height']
                if not width.isdigit() or not height.isdigit() or not 0 < int(width) <= 10000 or not 0 < int(height) <= 10000:
                    raise ValueError('Missing or invalid movie dimensions: ' + src)
                self.movies.append(dict(src=src, width=int(width), height=int(height),
                                        fullscreen=context['fullscreen'], start=context['start'], end=end))

        def handle_starttag(self, tag, attrs):
            attrs = {k.lower(): v or '' for k, v in attrs}
            if tag in {'object', 'embed'}:
                context = dict(width=attrs.get('width', ''), height=attrs.get('height', ''),
                               fullscreen=attrs.get('allowfullscreen', '').lower() == 'true',
                               start=self.source_offset(), paths=[])
                if self.stack:
                    context = self.stack[-1]
                context['last_markup'] = self.source_offset() + len(self.get_starttag_text())
                for key in ('data', 'src'):
                    if attrs.get(key):
                        self.add(context, attrs[key])
                if tag == 'object':
                    self.stack.append(context)
                elif not self.stack:
                    self.finish(context, self.source_offset() + len(self.get_starttag_text()))
                elif attrs.get('allowfullscreen'):
                    context['fullscreen'] = attrs['allowfullscreen'].lower() == 'true'
            elif tag == 'param' and self.stack:
                self.stack[-1]['last_markup'] = self.source_offset() + len(self.get_starttag_text())
                name, value = attrs.get('name', '').lower(), attrs.get('value', '')
                if name in {'src', 'movie'}:
                    self.add(self.stack[-1], value)
                elif name == 'allowfullscreen':
                    self.stack[-1]['fullscreen'] = value.lower() == 'true'

        def handle_endtag(self, tag):
            if tag in {'td', 'table'} and self.stack:
                context = self.stack[0]
                self.stack.clear()
                self.finish(context, self.source_offset())
            if tag == 'object' and self.stack:
                context = self.stack.pop()
                if not self.stack:
                    self.finish(context, self.source_offset() + len('</object>'))

    parser = Movies()
    parser.feed(source)
    if parser.stack:
        parser.finish(parser.stack[0], parser.stack[0]['last_markup'])
    return parser.movies


def shortcode(movie):
    if movie.get('kind') == 'audio':
        return '{{< local-audio src=' + json.dumps(movie['src'], ensure_ascii=False) + ' >}}'
    values = {k: str(movie[k]).lower() if isinstance(movie[k], bool) else str(movie[k])
              for k in ('src', 'width', 'height', 'fullscreen')}
    return '{{< ruffle ' + ' '.join(k + '=' + json.dumps(v, ensure_ascii=False) for k, v in values.items()) + ' >}}'


def restore_movies(body, movies):
    """Insert players at exact reviewed anchors, retaining all current body text."""
    for movie in movies:
        player = shortcode(movie)
        if player in body:
            continue
        if re.search(r'{{<\s*ruffle\b[^}]*\bsrc=' + re.escape(json.dumps(movie['src'])), body):
            raise ValueError('Existing player settings require review: ' + movie['src'])
        anchor = movie['insert_before']
        if movie.get('position') == 'start':
            index = 0
        elif anchor:
            if body.count(anchor) != 1:
                raise ValueError('Missing or ambiguous reviewed insertion anchor: ' + movie['src'])
            index = body.index(anchor)
        else:
            index = len(body)
        body = body[:index].rstrip() + '\n\n' + player + '\n\n' + body[index:].lstrip()
        body = body.lstrip('\n')
    # Spaces before a paragraph break have no Markdown hard-break meaning.
    body = re.sub(r'[ \t]+(?=\n(?:\n|$))', '', body)
    return body.rstrip() + '\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--backup-root', type=Path, required=True)
    parser.add_argument('--apply', action='store_true', help='Write reviewed players and missing movies')
    args = parser.parse_args()
    site = Path(__file__).resolve().parents[1]
    manifest = json.loads((site / 'docs/flash-recovery.json').read_text())
    changes = []
    for article in manifest['articles']:
        path = site / article['source_file']
        head, body = path.read_text().split('\n---\n', 1)
        updated = restore_movies(body, article['movies'])
        updated = restore_movies(updated, article.get('audio', []))
        for movie in article['movies'] + article.get('audio', []):
            origin = (args.backup_root / movie['backup_path']).resolve()
            if not origin.is_relative_to(args.backup_root.resolve()):
                raise ValueError('Unsafe backup path')
            payload = origin.read_bytes()
            if hashlib.sha256(payload).hexdigest() != movie['sha256']:
                raise ValueError('Exact backup hash differs: ' + movie['src'])
            target = site / 'static' / movie['src'].lstrip('/')
            if target.exists() and target.read_bytes() != payload:
                raise ValueError('Refusing to overwrite another movie variant: ' + movie['src'])
            if not target.exists():
                changes.append((target, payload))
        if body != updated:
            changes.append((path, (head + '\n---\n' + updated).encode()))
    if args.apply:
        for path, payload in changes:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(payload)
    print(f'{len(changes)} reviewed file changes' + (' applied.' if args.apply else ' planned; use --apply to write.'))


if __name__ == '__main__':
    main()
