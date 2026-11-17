"""Pure transformations for the reviewed Metaflash portfolio recovery."""

import html
from html.parser import HTMLParser
import posixpath
import re
import unicodedata
import zlib
from urllib.parse import quote, unquote_to_bytes, urlsplit

import nh3

from embed_flash_pages import parse_wrapper

HOSTS = {'metaflash.fr', 'www.metaflash.fr'}
REVIEWED_INJECTIONS = {'dragonhunter.html': 'y34d41ca28473534443c0027d0',
                       'rainbow.html': 'j84d41ca4a473534443c00285e'}
VOID = {'area', 'base', 'br', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'wbr'}
BLOCKED = {'script', 'style', 'noscript', 'iframe'}
TAGS = {'a', 'img', 'p', 'div', 'span', 'table', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th',
        'b', 'i', 'em', 'strong', 'font', 'br', 'hr', 'center', 'h1', 'h2', 'h3', 'h4',
        'ul', 'ol', 'li', 'small', 'big', 'sup', 'sub', 'blockquote'}
ATTRIBUTES = {
    'a': {'href', 'title', 'aria-label', 'data-metaflash-movie', 'data-metaflash-gallery', 'data-metaflash-index', 'class'},
    'img': {'src', 'alt', 'width', 'height', 'title', 'border', 'align'},
    'table': {'width', 'height', 'border', 'cellspacing', 'cellpadding', 'bgcolor', 'bordercolor', 'align'},
    'td': {'width', 'height', 'colspan', 'rowspan', 'bgcolor', 'bordercolor', 'align', 'valign', 'nowrap', 'class'},
    'th': {'width', 'height', 'colspan', 'rowspan', 'bgcolor', 'align', 'valign'},
    'tr': {'bgcolor', 'bordercolor', 'align', 'valign'},
    'div': {'align', 'class', 'data-metaflash-inline', 'role'},
    'span': {'class', 'role', 'aria-hidden'},
    'font': {'face', 'size', 'color'},
}


def decode_text(raw):
    try:
        return raw.decode('utf-8-sig')
    except UnicodeDecodeError:
        return raw.decode('cp1252', errors='replace')


def local_reference(reference, source_path):
    """Resolve historical UTF-8/Latin-1 paths without escaping the portfolio."""
    parsed = urlsplit(html.unescape(reference))
    if parsed.scheme not in {'', 'http', 'https'} or (parsed.hostname and parsed.hostname not in HOSTS):
        return None
    encoded = unquote_to_bytes(parsed.path)
    try:
        decoded = encoded.decode('utf-8')
    except UnicodeDecodeError:
        decoded = encoded.decode('latin1')
    if '\\' in decoded or '\0' in decoded:
        raise ValueError('Invalid portfolio path')
    if parsed.hostname or decoded.startswith('/'):
        path = posixpath.normpath(decoded.lstrip('/'))
    else:
        path = posixpath.normpath(posixpath.join(posixpath.dirname(source_path), decoded))
    if path == '..' or path.startswith('../'):
        raise ValueError('Portfolio path escapes its source directory')
    return 'index.html' if path in {'', '.'} else unicodedata.normalize('NFC', path)


def body_fragment(source):
    match = re.search(r'<body\b[^>]*>(.*?)(?:</body\s*>|$)', source, re.I | re.S)
    return match[1] if match else source


def strip_reviewed_injections(source, source_path):
    """Drop only the two individually reviewed hidden advertising spans."""
    identifier = REVIEWED_INJECTIONS.get(source_path)
    if identifier is None:
        return source
    pattern = r'<span\b[^>]*\bid="' + re.escape(identifier) + r'"[^>]*>.*?</span>'
    matches = list(re.finditer(pattern, source, re.I | re.S))
    if len(matches) != 1 or 'http://www.wcvi.org/' not in matches[0][0]:
        raise ValueError('Reviewed injected span differs; inspect the source before recovery')
    return source[:matches[0].start()] + source[matches[0].end():]


def page_references(source):
    """Collect resource/link attributes without executing historical scripts."""
    class References(HTMLParser):
        def __init__(self):
            super().__init__()
            self.urls = set()

        def handle_starttag(self, tag, attributes):
            attrs = dict(attributes)
            for key in ('href', 'src', 'data', 'background'):
                if attrs.get(key) and tag not in {'script', 'iframe'}:
                    self.urls.add(attrs[key])
            if tag == 'param' and attrs.get('name', '').lower() == 'movie':
                self.urls.add(attrs.get('value', ''))
    parser = References()
    parser.feed(source)
    parser.urls.update(re.findall(r'background-image:\s*url\([\'"]?([^\)\'\"]+)', source, re.I))
    return parser.urls


def embedded_movies(source):
    """Deduplicate ordinary object/embed fallbacks and retain declared dimensions."""
    class Movies(HTMLParser):
        def __init__(self):
            super().__init__()
            self.movies = set()
            self.dimensions = (0, 0)

        def handle_starttag(self, tag, attributes):
            attrs = dict(attributes)
            if tag in {'object', 'embed'}:
                width, height = attrs.get('width', ''), attrs.get('height', '')
                if width.isdigit() and height.isdigit():
                    self.dimensions = int(width), int(height)
                url = attrs.get('data') or attrs.get('src')
            elif tag == 'param' and attrs.get('name', '').lower() == 'movie':
                url = attrs.get('value')
            else:
                return
            if url and urlsplit(url).path.lower().endswith('.swf'):
                self.movies.add((url, *self.dimensions))
    parser = Movies()
    parser.feed(source)
    return parser.movies


def swf_literals(raw):
    """Inspect literal resource strings; dynamically constructed URLs remain unproven."""
    if raw[:3] == b'CWS':
        payload = zlib.decompress(raw[8:])
    elif raw[:3] == b'FWS':
        payload = raw[8:]
    else:
        raise ValueError('Unsupported SWF signature')
    values = {part.decode('ascii').strip() for part in re.findall(rb'[\x20-\x7e]{4,}', payload)}
    return {value for value in values if re.fullmatch(
        r'[\w./% -]+\.(?:html?|swf|jpe?g|gif|png|mp3|wav|xml)(?:\?[^<>]*)?', value, re.I)
        or value.startswith(('http://', 'https://'))}


def classify_wrapper(source):
    """Return a single movie only when no separate page content would be lost."""
    try:
        movie = parse_wrapper(source)
    except ValueError:
        return None

    class Content(HTMLParser):
        def __init__(self):
            super().__init__()
            self.ignored = []
            self.extra = False

        def handle_starttag(self, tag, attrs):
            if tag in BLOCKED | {'object', 'head'} or (tag == 'a' and 'phpmyvisites.net' in dict(attrs).get('href', '')):
                self.ignored.append(tag)
            elif not self.ignored and tag in {'img', 'audio', 'video'}:
                self.extra = True

        def handle_endtag(self, tag):
            if self.ignored and tag == self.ignored[-1]:
                self.ignored.pop()

        def handle_data(self, value):
            if not self.ignored and value.strip():
                self.extra = True

    content = Content()
    content.feed(body_fragment(source))
    return None if content.extra else movie


def relative_site_url(destination, source_path):
    parsed = urlsplit(destination)
    if parsed.scheme or parsed.netloc:
        return destination
    start = 'metaflash/' + posixpath.dirname(source_path)
    result = posixpath.relpath(parsed.path.lstrip('/') or '.', start)
    if parsed.path.endswith('/'):
        result = result.rstrip('/') + '/'
    return quote(result, safe='/') + ('?' + parsed.query if parsed.query else '') + \
        ('#' + parsed.fragment if parsed.fragment else '')


def tag_html(tag, attributes):
    return '<' + tag + ''.join(' ' + key + '="' + html.escape(str(value or ''), quote=True) + '"'
                              for key, value in attributes.items()) + '>'


def render_legacy_body(source, source_path, pages, assets, inline_movies, image_links=None):
    """Preserve reviewed gallery markup while replacing links and active embeds."""
    class Rewrite(HTMLParser):
        def __init__(self):
            super().__init__()
            self.output, self.ignored, self.object_parts = [], [], []
            self.object_depth = 0
            self.gallery_header = False
            self.gallery_heading = False
            self.gallery_entry = False
            self.header_depth = 0

        def movie_placeholder(self, markup):
            movie, _, _ = parse_wrapper(markup)
            path = local_reference(movie, source_path)
            if path not in inline_movies:
                raise ValueError('Unreviewed inline movie: ' + str(path))
            spec = inline_movies[path]
            self.output.append(tag_html('div', {'class': 'metaflash-inline',
                                               'data-metaflash-inline': spec['id']}))
            self.output.append('</div>')

        def handle_starttag(self, tag, attributes):
            attrs = dict(attributes)
            if self.header_depth:
                if tag == 'td':
                    self.header_depth += 1
                return
            if self.ignored:
                if tag == self.ignored[-1]:
                    self.ignored.append(tag)
                return
            if tag in BLOCKED or (tag == 'a' and 'phpmyvisites.net' in attrs.get('href', '')):
                self.ignored.append(tag)
                return
            if tag == 'object':
                self.object_depth += 1
            if self.object_depth:
                self.object_parts.append(self.get_starttag_text())
                return
            if tag == 'embed':
                self.movie_placeholder(self.get_starttag_text())
                return
            if tag not in TAGS:
                return
            safe = {k: v for k, v in attrs.items() if k in ATTRIBUTES.get(tag, set())
                    and k not in {'class', 'data-metaflash-movie', 'data-metaflash-inline',
                                  'data-metaflash-gallery', 'data-metaflash-index'}}
            if source_path == 'menu2.html' and tag in {'table', 'td', 'th'}:
                safe.pop('height', None)
            header = source_path == 'menu2.html' and tag == 'td' and attrs.get('height') == '837' and \
                attrs.get('bgcolor', '').lower() == '#003366' and not self.gallery_header
            if header:
                safe['class'] = 'metaflash-gallery-header'
                self.gallery_header = True
            if source_path == 'menu2.html' and tag == 'tr' and attrs.get('bordercolor', '').lower() == '#ff6600' and \
                    not self.gallery_entry and 'anterak.html' in pages:
                self.gallery_heading = True
            if tag == 'a' and attrs.get('href'):
                ref = attrs['href']
                if ref.startswith('#'):
                    safe['href'] = ref
                elif ref.rstrip('/') in {'http://overstep.free.fr/blog', 'https://overstep.free.fr/blog'}:
                    safe['href'] = relative_site_url('/', source_path)
                else:
                    path = local_reference(ref, source_path)
                    if path is not None:
                        if path in pages:
                            page = pages[path]
                            safe['href'] = relative_site_url(page['url'], source_path)
                            if page['kind'] == 'movie':
                                safe['data-metaflash-movie'] = page['movie_id']
                                safe['aria-label'] = 'Ouvrir ' + page.get('title', path)
                        elif path in assets and assets[path]:
                            safe['href'] = relative_site_url(assets[path], source_path)
                        else:
                            raise ValueError('Unreviewed local link: ' + path)
                        if image_links and path in image_links:
                            info = image_links[path]
                            safe['data-metaflash-gallery'] = info['gallery_id']
                            safe['data-metaflash-index'] = str(info['index'])
            if tag == 'img':
                ref = attrs.get('src', '')
                path = local_reference(ref, source_path)
                if path is None and 'phpmyvisites' in ref:
                    return
                if path not in assets:
                    raise ValueError('Unreviewed image: ' + ref)
                if assets[path] is None:
                    self.output.append('<span class="metaflash-unavailable" role="note">Illustration indisponible</span>')
                    return
                safe['src'] = relative_site_url(assets[path], source_path)
                safe.setdefault('alt', '')
            self.output.append(tag_html(tag, safe))
            if header:
                if not assets.get('gif/blog2.jpg') or 'cadre/Animation1.swf' not in inline_movies:
                    raise ValueError('Missing reviewed gallery header artwork')
                self.output.append('<div class="metaflash-gallery-intro">'
                                   '<a class="metaflash-gallery-home" href="./">← Accueil Metaflash</a>'
                                   '<div class="metaflash-gallery-brand">')
                self.output.append(tag_html('div', {'class': 'metaflash-inline',
                    'data-metaflash-inline': inline_movies['cadre/Animation1.swf']['id']}) + '</div></div>')
                self.output.append(tag_html('a', {'class': 'metaflash-blog-link',
                    'href': relative_site_url('/', source_path), 'aria-label': 'Blog'}))
                self.output.append(tag_html('img', {
                    'src': relative_site_url(assets['gif/blog2.jpg'], source_path),
                    'alt': 'Les Semelles de Vent', 'width': '433', 'height': '169'}))
                self.output.append('<span class="metaflash-blog-label" aria-hidden="true">Blog</span>'
                                   '</a></div>')
                self.header_depth = 1

        def handle_endtag(self, tag):
            if self.header_depth:
                if tag == 'td':
                    self.header_depth -= 1
                    if not self.header_depth:
                        self.output.append('</td>')
                return
            if self.ignored:
                if tag == self.ignored[-1]:
                    self.ignored.pop()
                return
            if self.object_depth:
                self.object_parts.append('</' + tag + '>')
                if tag == 'object':
                    self.object_depth -= 1
                    if not self.object_depth:
                        self.movie_placeholder(''.join(self.object_parts))
                        self.object_parts.clear()
                return
            if tag in TAGS and tag not in VOID:
                self.output.append('</' + tag + '>')
            if tag == 'tr' and self.gallery_heading:
                self.gallery_heading = False
                self.gallery_entry = True
                page = pages['anterak.html']
                link = tag_html('a', {'href': relative_site_url(page['url'], source_path),
                                     'data-metaflash-movie': page['movie_id'], 'aria-label': 'Ouvrir Anterak'})
                self.output.append('<tr bgcolor="#000033"><td width="140" align="center">' + link +
                                   '<img src="gif/anterak.jpg" alt="Anterak" width="140" height="98"></a>'
                                   '</td><td align="center"><strong>ANTERAK</strong></td></tr>')

        def handle_data(self, value):
            if self.header_depth:
                return
            if self.object_depth:
                self.object_parts.append(html.escape(value))
            elif not self.ignored:
                self.output.append(html.escape(value))

    parser = Rewrite()
    parser.feed(body_fragment(source))
    if parser.header_depth:
        raise ValueError('Unclosed gallery header')
    if parser.object_depth:
        raise ValueError('Unclosed legacy object')
    result = nh3.clean(''.join(parser.output), tags=TAGS, attributes=ATTRIBUTES,
                     clean_content_tags=BLOCKED | {'object', 'embed'},
                     url_schemes={'http', 'https', 'mailto'}, strip_comments=True)
    if source_path == 'menu2.html':
        result = re.sub(r'(?:<br>\s*){3,}', '', result)
    return result


def render_media_dialog():
    """Share the accessible internal viewer with the independent archive."""
    return '''<dialog id="metaflash-dialog" aria-labelledby="metaflash-dialog-title">
<header class="metaflash-dialog-header"><h2 id="metaflash-dialog-title">Animation</h2>
<button type="button" data-metaflash-close autofocus>Fermer</button></header>
<div class="metaflash-viewer"></div>
<nav class="metaflash-image-controls" aria-label="Images" hidden>
<button type="button" data-metaflash-previous>← Précédente</button>
<span data-metaflash-position aria-live="polite"></span>
<button type="button" data-metaflash-next>Suivante →</button>
</nav>
</dialog>'''


def render_shell(source_path, title, body, background=None):
    """Generate a static, prefix-independent portfolio page with a native dialog."""
    body = '\n'.join(line.rstrip(' \t') for line in body.split('\n'))
    def url(path):
        return html.escape(relative_site_url(path, source_path), quote=True)
    title = html.escape(title)
    home_class = ' metaflash-home' if source_path == 'index.html' else ''
    back = '' if source_path in {'index.html', 'menu2.html'} else \
        f'<nav class="metaflash-return" aria-label="Metaflash"><a href="{url("/metaflash/")}">Accueil Metaflash</a> · <a href="{url("/metaflash/menu2.html")}">Galerie</a></nav>'
    backdrop = (' style="background-image:url(\'' + url(background) + '\')"') if background else ''
    return f'''<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{title} | Metaflash</title>
<link rel="stylesheet" href="{url('/css/ruffle-player.css')}">
<link rel="stylesheet" href="{url('/css/metaflash.css')}?v=3">
<script defer src="{url('/js/ruffle-player.js')}?v=3"></script>
<script defer src="{url('/js/metaflash.js')}?v=3"></script>
</head><body class="metaflash-page{home_class}">
<a class="metaflash-skip" href="#metaflash-content">Aller au contenu</a>
<main id="metaflash-content" class="metaflash-original"{backdrop}>{back}{body}</main>
{render_media_dialog()}
<noscript>Activez JavaScript pour lire les animations. Les liens de la galerie restent accessibles.</noscript>
</body></html>
'''
