"""Replace links to backed-up Flash wrappers with in-article Ruffle players."""

import argparse
import json
import re
import zlib
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

from recover_media import copy_media

LINK = re.compile(r'\[(?:!\[[^\]]*\]\([^)]*\)|[^\]]*)\]\(([^\s)]+\.html(?:[?#][^)]*)?)\)', re.I)


def parse_wrapper(source):
    class Movies(HTMLParser):
        def __init__(self):
            super().__init__()
            self.movies = set()
            self.dimensions = None

        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            if tag in {'object', 'embed'}:
                w, h = attrs.get('width', ''), attrs.get('height', '')
                if w.isdigit() and h.isdigit():
                    self.dimensions = (int(w), int(h))
                url = attrs.get('data') or attrs.get('src')
            elif tag == 'param' and attrs.get('name', '').lower() == 'movie':
                url = attrs.get('value')
            else:
                return
            if url and urlsplit(url).path.lower().endswith('.swf'):
                self.movies.add((url, *(self.dimensions or (0, 0))))

    parser = Movies()
    parser.feed(source)
    if len(parser.movies) != 1:
        raise ValueError('Expected exactly one movie with numeric dimensions')
    movie = parser.movies.pop()
    if not all(0 <= d <= 10000 for d in movie[1:]):
        raise ValueError('Invalid wrapper dimensions')
    return movie


def swf_dimensions(source):
    raw = source.read_bytes()
    body = zlib.decompress(raw[8:]) if raw[:3] == b'CWS' else raw[8:]
    if raw[:3] not in {b'CWS', b'FWS'}:
        raise ValueError('Cannot read dimensions from this SWF compression format')
    bits = ''.join(f'{byte:08b}' for byte in body[:20])
    size = int(bits[:5], 2)
    values = []
    for index in range(4):
        part = bits[5 + index * size:5 + (index + 1) * size]
        number = int(part, 2)
        values.append(number - (1 << size) if part[0] == '1' else number)
    return round((values[1] - values[0]) / 20), round((values[3] - values[2]) / 20)


def resolve_wrapper(url, backup):
    parsed = urlsplit(url)
    if parsed.hostname not in {None, 'blog.overstep.fr', 'metaflash.fr', 'www.metaflash.fr'}:
        return None
    path = unquote(parsed.path).lstrip('/')
    path = path.removeprefix('blog-content/')
    if '..' in Path(path).parts:
        return None
    roots = [backup / 'metaflash'] if parsed.hostname in {'metaflash.fr', 'www.metaflash.fr'} else [backup / 'blog/wordpress', backup / 'blog', backup / 'metaflash']
    for root in roots:
        candidate = root / path
        if candidate.resolve().is_relative_to(backup.resolve()) and candidate.is_file():
            return candidate
    return None


def replace_links(text, movies):
    count = 0

    def replace(match):
        nonlocal count
        if match[1] not in movies:
            return match[0]
        src, width, height = movies[match[1]]
        count += 1
        return '\n\n{{< ruffle src=' + json.dumps(src, ensure_ascii=False) + f' width="{width}" height="{height}" >}}}}\n\n'

    return LINK.sub(replace, text), count


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, required=True)
    args = parser.parse_args()
    blog = Path(__file__).resolve().parents[1]
    site = args.site.resolve()
    if not site.is_relative_to(blog) or not (site / 'hugo.yaml').exists():
        raise SystemExit('Expected a generated site inside blog/')
    backup = blog.parent / 'backup_ftp'
    movies, errors, copied, changes = {}, {}, {}, []
    posts = sorted((site / 'content/posts').glob('*.md'))
    for post in posts:
        parts = post.read_text().split('---', 2)
        if re.search(r'^draft: "?true"?$', parts[1], re.M):
            continue
        for url in LINK.findall(parts[2]):
            if url in movies or url in errors:
                continue
            wrapper = resolve_wrapper(url, backup)
            if not wrapper:
                errors[url] = 'Wrapper not found in the scoped backup paths'
                continue
            try:
                movie, width, height = parse_wrapper(wrapper.read_text(encoding='utf-8-sig', errors='replace'))
                parsed = urlsplit(movie)
                if parsed.netloc:
                    raise ValueError('External movie requires explicit mapping')
                source = (wrapper.parent / unquote(parsed.path)).resolve()
                if not source.is_relative_to(backup.resolve()) or not source.is_file():
                    raise ValueError('SWF not found inside backup')
                if not width or not height:
                    width, height = swf_dimensions(source)
                destination_url = urlsplit(urljoin(url, movie)).path
                if urlsplit(url).hostname in {'metaflash.fr', 'www.metaflash.fr'}:
                    destination_url = '/legacy/metaflash/' + destination_url.lstrip('/')
                digest = copy_media(source, site / 'static', unquote(destination_url).lstrip('/'))
                copied[destination_url] = {'source': str(source.relative_to(backup)), 'sha256': digest}
                movies[url] = (destination_url, width, height)
            except ValueError as exc:
                errors[url] = str(exc)
        body, count = replace_links(parts[2], movies)
        if count:
            post.write_text('---'.join(parts[:2]) + '---' + body)
            changes.append({'post': post.name, 'count': count})
    report = {'changed_posts': changes, 'wrapper_mappings': movies, 'copied_swfs': copied, 'unresolved': errors}
    report_path = blog / 'migration/reports/flash-pages.json'
    if report_path.exists():
        prior = json.loads(report_path.read_text())
        report['changed_posts'] = prior['changed_posts'] + changes
        report['wrapper_mappings'] = prior['wrapper_mappings'] | movies
        report['copied_swfs'] = prior['copied_swfs'] | copied
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'changed_posts': len(changes), 'embedded_players': sum(c['count'] for c in changes), 'unresolved': errors}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
