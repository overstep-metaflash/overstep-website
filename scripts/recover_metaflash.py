"""Recover the reviewed homepage/gallery closure into an isolated static section."""

import argparse
from collections import deque
import hashlib
import html
import json
from pathlib import Path
import re
import unicodedata
from urllib.parse import urlsplit

from embed_flash_pages import swf_dimensions
from metaflash import (classify_wrapper, decode_text, embedded_movies, local_reference,
                       page_references, render_legacy_body, render_shell, relative_site_url,
                       swf_literals, strip_reviewed_injections)
from repair_flash_menu import repair_menu
from metaflash_guestbook import render_guestbook
from metaflash_images import build_image_galleries, render_image_page

INDEX_URLS = {'liens.html', 'menu2.html', 'mailto:overstep@ifrance.com',
              'http://perso0.free.fr/cgi-bin/guestbook.pl?login=overstep'}
ALIASES = {'sphere.html': 'spheres.html', 'menu.htm': 'menu2.html', 'menu.html': 'menu2.html'}
UNAVAILABLE_IMAGES = {'gif/sphères.jpg', 'gif/sphèresx.jpg', 'gif/background1.jpg'}
MEDIA = {'.jpg', '.jpeg', '.gif', '.png', '.swf'}


def sha256(raw):
    return hashlib.sha256(raw).hexdigest()


def build_portfolio(root, blogroll, guestbook=None):
    """Build a reviewed output plan without modifying the source or destination."""
    root = root.resolve()
    source_files = {unicodedata.normalize('NFC', str(p.relative_to(root))): p
                    for p in root.rglob('*') if p.is_file() and not p.is_symlink()}
    pages, assets, movies, originals, source_records = {}, {}, {}, {}, {}
    queue = deque(['index.html', 'menu2.html', 'anterak.html', 'gif/anterak.jpg'])
    seen, warnings = set(), []
    virtual = {'liens.html', 'guestbook.html'}

    def read(path):
        if path not in source_files:
            raise ValueError('Missing reviewed portfolio file: ' + path)
        file = source_files[path]
        if not file.resolve().is_relative_to(root):
            raise ValueError('Portfolio source escapes its root')
        raw = file.read_bytes()
        source_records[path] = {'source': path, 'sha256': sha256(raw), 'bytes': len(raw)}
        return raw

    def movie_spec(path, identifier, width=0, height=0, title=None):
        file = source_files[path]
        if not width or not height:
            width, height = swf_dimensions(file)
        if not (0 < width <= 10000 and 0 < height <= 10000):
            raise ValueError('Invalid movie dimensions: ' + path)
        movies[identifier] = {'src': path, 'width': width, 'height': height,
                              'title': title or Path(path).stem}

    while queue:
        name = queue.popleft()
        name = ALIASES.get(name, name)
        if name in seen or name in virtual:
            continue
        seen.add(name)
        if name in UNAVAILABLE_IMAGES:
            assets[name] = None
            continue
        raw = read(name)
        suffix = Path(name).suffix.lower()
        if suffix in {'.html', '.htm'}:
            source = strip_reviewed_injections(decode_text(raw), name)
            originals[name] = source
            title_match = re.search(r'<title[^>]*>(.*?)</title>', source, re.I | re.S)
            title = html.unescape(title_match[1]).strip() if title_match else Path(name).stem
            wrapper = classify_wrapper(source)
            kind = 'home' if name == 'index.html' else 'movie' if wrapper else 'page'
            pages[name] = {'url': '/metaflash/' + ('' if name == 'index.html' else name),
                           'kind': kind, 'title': title, 'movie_id': name if wrapper or kind == 'home' else None}
            refs = {ref for ref, _, _ in embedded_movies(source)} if wrapper or kind == 'home' else page_references(source)
            for ref in sorted(refs):
                if not ref or ref.startswith('#'):
                    continue
                resolved = local_reference(ref, name)
                if resolved:
                    queue.append(resolved)
            for ref, width, height in sorted(embedded_movies(source)):
                path = local_reference(ref, name)
                if path is None or path not in source_files:
                    raise ValueError('Unreviewed embedded movie: ' + ref)
                movie_spec(path, 'asset:' + path, width, height)
            if wrapper or kind == 'home':
                ref, width, height = wrapper or next(iter(embedded_movies(source)))
                path = local_reference(ref, name)
                movie_spec(path, name, width, height, title)
        elif suffix in MEDIA:
            if suffix == '.swf':
                for ref in sorted(swf_literals(raw)):
                    resolved = local_reference(ref, name)
                    if resolved and Path(resolved).suffix.lower() in {'.html', '.htm'}:
                        # Only the selected gallery defines the HTML import scope.
                        continue
                    if resolved and (resolved in source_files or resolved in ALIASES or resolved in virtual):
                        queue.append(resolved)
                    elif resolved:
                        warnings.append({'source': name, 'literal': ref, 'reason': 'Literal target absent from FTP'})
            elif not (raw.startswith(b'\xff\xd8') or raw.startswith(b'GIF8') or raw.startswith(b'\x89PNG\r\n\x1a\n')):
                raise ValueError('Unexpected image payload: ' + name)
            assets[name] = '/metaflash/' + name
        else:
            raise ValueError('Unreviewed resource type: ' + name)

    pages.update({'liens.html': {'url': '/metaflash/liens.html', 'kind': 'page', 'title': 'Liens'},
                  'guestbook.html': {'url': '/metaflash/guestbook.html', 'kind': 'page', 'title': 'Livre d’or'}})
    for alias, canonical in ALIASES.items():
        if canonical in pages:
            pages[alias] = pages[canonical]
    inline = {path: {'id': 'asset:' + path} for path in assets if path.endswith('.swf')}
    galleries, image_links = build_image_galleries(originals, pages, assets)
    output = {}
    for name, url in assets.items():
        if url is None:
            continue
        raw = read(name)
        if name == 'index.swf':
            raw, _ = repair_menu(raw, INDEX_URLS, allow_non_navigation=True,
                                 url_replacements={'mailto:overstep@ifrance.com': 'mailto:lastep.fr@gmail.com'})
        output[name] = raw
    for name, source in originals.items():
        page = pages[name]
        if page['kind'] in {'home', 'movie'}:
            body = '<div class="metaflash-inline" data-metaflash-inline="' + html.escape(name, quote=True) + '"></div>'
        elif page['kind'] == 'image':
            body = render_image_page(galleries[page['gallery_id']], page['gallery_id'], name)
        else:
            body = render_legacy_body(source, name, pages, assets, inline, image_links=image_links)
        background_match = re.search(r'background-image:\s*url\([\'"]?([^\)\'\"]+)', source, re.I)
        background = None
        if background_match:
            path = local_reference(background_match[1], name)
            background = assets.get(path)
        output[name] = render_shell(name, page['title'], body, background).encode('utf-8')
    friends = '<h1>Liens amis</h1><p>Les liens amis conservés sur le blog.</p><ul>'
    for link in blogroll:
        if urlsplit(link['url']).scheme in {'http', 'https'}:
            friends += '<li><a href="' + html.escape(link['url'], quote=True) + '">' + html.escape(link['name']) + '</a></li>'
    friends += '</ul>'
    output['liens.html'] = render_shell('liens.html', 'Liens', friends).encode('utf-8')
    guestbook_body = '<h1>Livre d’or</h1><p>Le livre d’or historique dépendait d’un service qui n’est plus disponible.</p>' \
                '<p>Les commentaires archivés du blog restent consultables avec les articles.</p>'
    if guestbook is not None:
        guestbook_body = render_guestbook(guestbook)
    output['guestbook.html'] = render_shell('guestbook.html', 'Livre d’or', guestbook_body).encode('utf-8')
    client = {'pages': pages, 'movies': movies, 'galleries': galleries, 'aliases': ALIASES}
    output['manifest.json'] = (json.dumps(client, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    navigation = []
    for path, page in pages.items():
        for origin in ['http://metaflash.fr/', 'https://metaflash.fr/',
                       'http://www.metaflash.fr/', 'https://www.metaflash.fr/']:
            navigation.append({'legacy': origin + path, 'destination': page['url']})
    navigation.extend([
        {'legacy': 'http://perso0.free.fr/cgi-bin/guestbook.pl?login=overstep', 'destination': '/metaflash/guestbook.html'},
        {'legacy': 'mailto:overstep@ifrance.com', 'destination': 'mailto:lastep.fr@gmail.com'},
    ])
    output['navigation.json'] = (json.dumps(navigation, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    manifest = {'source_root': 'backup_ftp/metaflash', 'entry': '/metaflash/',
                'sources': sorted(source_records.values(), key=lambda r: r['source']),
                'output_files': [{'path': '/metaflash/' + name, 'sha256': sha256(raw), 'bytes': len(raw)}
                                 for name, raw in sorted(output.items())],
                'unavailable_images': sorted(p for p,v in assets.items() if v is None),
                'reviewed_aliases': ALIASES, 'literal_scan_warnings': warnings,
                'page_count': sum(name.endswith(('.html', '.htm')) for name in output),
                'modal_movies': sum(page['kind'] == 'movie' for name,page in pages.items() if name not in ALIASES)}
    manifest['image_galleries'] = len(galleries)
    manifest['gallery_images'] = sum(len(group['images']) for group in galleries.values())
    manifest['image_associations'] = {identifier: [image['src'] for image in group['images']]
                                     for identifier, group in galleries.items()}
    if guestbook is not None:
        manifest['guestbook'] = {'source_sha256': guestbook['source_sha256'],
                                 'retained': len(guestbook['entries']),
                                 'data_sha256': sha256(json.dumps(guestbook, ensure_ascii=False, sort_keys=True).encode())}
    return output, manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    blog = Path(__file__).resolve().parents[1]
    source = args.source or blog.parent / 'backup_ftp/metaflash'
    blogroll = json.loads((blog / 'data/blogroll.json').read_text())
    guestbook = json.loads((blog / 'data/metaflash_guestbook.json').read_text())
    output, manifest = build_portfolio(source, blogroll, guestbook)
    if args.apply:
        for name, raw in output.items():
            destination = blog / 'static/metaflash' / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            if not destination.exists() or destination.read_bytes() != raw:
                destination.write_bytes(raw)
        (blog / 'docs/metaflash-recovery.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k:v for k,v in manifest.items() if k not in {'sources', 'output_files', 'literal_scan_warnings', 'image_associations'}}, ensure_ascii=False, indent=2))
    print(f"Literal scan warnings: {len(manifest['literal_scan_warnings'])}")
    print(f'Prepared {len(output)} reviewed output files; source backups remained read-only.')


if __name__ == '__main__':
    main()
