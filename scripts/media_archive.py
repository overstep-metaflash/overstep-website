"""Generate an independent catalogue from reviewed, already-public media."""
import hashlib
import html
from io import BytesIO
import json
import posixpath
import re
from urllib.parse import quote, unquote, urlsplit

from PIL import Image, ImageOps

from metaflash import render_media_dialog

ROOT = '/archives/metaflash/'
COLLECTIONS = {'blog':'Blog Step','quarante_jours':'40 jours','illustrations':'Illustrations',
               'animations':'Animations','eros':'Eros','dotclear':'Ancien blog','pochettes':'Pochettes','habillage':'Éléments du site'}


def sha256(raw):
    return hashlib.sha256(raw).hexdigest()


def safe_path(value):
    parsed = urlsplit(value)
    decoded = unquote(parsed.path)
    if parsed.scheme or parsed.netloc or parsed.query or parsed.fragment or not decoded.startswith('/') or '\\' in decoded or '\0' in decoded or \
            any(part in {'.', '..'} for part in decoded.split('/')):
        raise ValueError('Expected a reviewed local public path')
    return decoded


def url(target, page):
    target = safe_path(target)
    result = posixpath.relpath(target.lstrip('/') or '.', posixpath.dirname(page))
    if target.endswith('/'):
        result = result.rstrip('/') + '/'
    return html.escape(quote(result, safe='/'), quote=True)


def make_thumbnail(raw):
    with Image.open(BytesIO(raw)) as source:
        image = ImageOps.exif_transpose(source).convert('RGBA')
        image.thumbnail((320, 240), Image.Resampling.LANCZOS)
        clean = Image.new('RGB', image.size, '#000033')
        clean.paste(image, mask=image.getchannel('A'))
        output = BytesIO()
        clean.save(output, 'JPEG', quality=82, optimize=True, progressive=True)
        return output.getvalue()


def text(value):
    return html.escape(html.unescape(str(value)), quote=True)


def shell(page, title, body):
    def link(path):
        return url(path, page)
    return f'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>{text(title)} | Archives Metaflash</title>
<link rel="stylesheet" href="{link('/css/ruffle-player.css')}">
<link rel="stylesheet" href="{link('/css/metaflash.css')}?v=3">
<link rel="stylesheet" href="{link('/css/media-archive.css')}?v=2">
<script defer src="{link('/js/ruffle-player.js')}?v=3"></script>
<script defer src="{link('/js/metaflash.js')}?v=4" data-media-root="archives/metaflash/" data-rewrite-map="archives/metaflash/navigation.json"></script>
<script defer src="{link('/js/media-archive.js')}?v=2"></script>
</head><body class="metaflash-page media-archive">
<a class="metaflash-skip" href="#metaflash-content">Aller au contenu</a>
<header class="archive-header"><nav aria-label="Navigation"><a href="{link(ROOT)}">Catalogue</a>
<a href="{link('/metaflash/')}">Metaflash</a><a href="{link('/')}">Le blog</a></nav></header>
<main id="metaflash-content" class="archive-content">{body}</main>
{render_media_dialog()}
</body></html>
'''.encode()


def build_archive(data, read_bytes, navigation=None):
    output, sources, manifest = {}, {}, {'pages': {}, 'movies': {}, 'galleries': {}}
    identifiers, covered = set(), []
    for entry in data['entries']:
        if not re.fullmatch(r'[0-9a-f]{16}', entry['id']) or entry['id'] in identifiers:
            raise ValueError('Archive notice IDs must be unique and stable')
        identifiers.add(entry['id'])
        if entry['kind'] not in {'image', 'swf'} or entry['collection'] not in COLLECTIONS or not entry['assets']:
            raise ValueError('Invalid archive type, collection or empty notice')
        for asset in entry['assets']:
            path = safe_path(asset['path'])
            if not path.startswith(('/wp-content/uploads/', '/metaflash/', '/theme/step/', '/archives/metaflash/media/')):
                raise ValueError('Asset is outside the reviewed public media roots')
            raw = read_bytes(path)
            if sha256(raw) != asset['sha256'] or len(raw) != asset['bytes']:
                raise ValueError('Archive source payload differs from reviewed bytes')
            sources[path] = {'path': path, 'sha256': asset['sha256'], 'bytes': asset['bytes']}
            covered.append(path)
            for alias in asset.get('aliases', []):
                alias = safe_path(alias)
                if sha256(read_bytes(alias)) != asset['sha256']:
                    raise ValueError('Archive alias differs from the preserved payload')
            if entry['kind'] == 'image':
                preview = 'previews/' + asset['sha256'][:16] + '.jpg'
                output[preview] = make_thumbnail(raw)
        for article in entry['related_articles']:
            safe_path(article['url'])
    if sorted(covered) != sorted(data['reviewed_paths']) or len(covered) != len(set(covered)):
        raise ValueError('Archive notice coverage differs from the reviewed batch')

    output['previews/flash.svg'] = b'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240"><rect width="320" height="240" fill="#000033"/><rect x="80" y="48" width="160" height="112" rx="4" fill="#003366" stroke="#3399ff"/><path d="M146 76v58l44-29z" fill="#ff9900"/><text x="160" y="198" text-anchor="middle" fill="#fff" font-family="monospace" font-size="22">Flash</text></svg>'
    root_page = 'archives/metaflash/index.html'
    cards = []
    for entry in data['entries']:
        identifier = entry['id']
        page = 'archives/metaflash/' + identifier + '/index.html'
        notice_url = ROOT + identifier + '/'
        kind_label = 'Image' if entry['kind'] == 'image' else 'Flash'
        preview = ROOT + 'previews/' + (entry['assets'][0]['sha256'][:16] + '.jpg' if entry['kind'] == 'image' else 'flash.svg')
        if entry['kind'] == 'image':
            manifest['galleries'][identifier] = {'title': entry['title'], 'images': [
                {'src': posixpath.relpath(asset['path'].lstrip('/'), ROOT.lstrip('/')),
                 'caption': asset['label'] if len(entry['assets']) > 1 else '', 'alt': asset['label']}
                for asset in entry['assets']]}
            viewer_attrs = f'data-metaflash-gallery="{identifier}" data-metaflash-index="0"'
        elif entry.get('playable', True):
            for index, asset in enumerate(entry['assets']):
                movie_id = identifier + '-' + str(index)
                manifest['movies'][movie_id] = {'src': posixpath.relpath(asset['path'].lstrip('/'), ROOT.lstrip('/')),
                    'title': entry['title'] if len(entry['assets']) == 1 else asset['label'],
                    'width': asset['width'], 'height': asset['height']}
            viewer_attrs = f'data-metaflash-movie="{identifier}-0"'
        else:
            viewer_attrs = ''
        search = entry['title'] + ' ' + ' '.join(asset['label'] for asset in entry['assets'])
        cards.append(f'''<article class="archive-item" data-archive-kind="{entry['kind']}" data-archive-collection="{entry['collection']}" data-archive-search="{text(search)}">
<a class="archive-preview" href="{url(notice_url, root_page)}" {viewer_attrs} aria-label="Ouvrir {text(entry['title'])}"><img src="{url(preview, root_page)}" width="320" height="240" loading="lazy" decoding="async" alt="{text(entry['title'])}"></a>
<h2><a href="{url(notice_url, root_page)}">{text(entry['title'])}</a></h2>
<p>{kind_label} · {COLLECTIONS[entry['collection']]}{f" · {len(entry['assets'])} fichiers" if len(entry['assets']) > 1 else ''}</p></article>''')
        body = f'<a class="archive-back" href="{url(ROOT, page)}">Retour au catalogue</a><h1>{text(entry["title"])}</h1>'
        if entry['note']:
            body += '<p class="archive-note">' + text(entry['note']) + '</p>'
        if viewer_attrs:
            body += f'<a class="archive-open" href="{url(entry["assets"][0]["path"], page)}" {viewer_attrs}>Ouvrir {"l’image" if entry["kind"] == "image" else "l’animation"}</a>'
        if entry['related_articles']:
            body += '<section class="archive-related"><h2>Dans le site historique</h2><ul>'
            for article in entry['related_articles']:
                body += f'<li><a href="{url(article["url"], page)}">{text(article["title"])}</a>'
                if article.get('display_date'):
                    body += ' <time datetime="' + text(article['display_date']) + '">' + text(article['display_date']) + '</time>'
                body += '</li>'
            body += '</ul></section>'
        body += '<section class="archive-originals"><h2>Fichiers conservés</h2>'
        for index, asset in enumerate(entry['assets']):
            body += '<div class="archive-original"><h3>' + text(asset['label']) + '</h3>'
            if entry['kind'] == 'image':
                body += f'<a href="{url(asset["path"], page)}" data-metaflash-gallery="{identifier}" data-metaflash-index="{index}"><img src="{url(ROOT + "previews/" + asset["sha256"][:16] + ".jpg", page)}" alt="{text(asset["label"])}" loading="lazy"></a>'
            elif entry.get('playable', True) and index:
                body += f'<a href="{url(asset["path"], page)}" data-metaflash-movie="{identifier}-{index}">Ouvrir cette version</a>'
            body += f'<p><a href="{url(asset["path"], page)}" download>{text(asset.get("download_label", "Télécharger l’original"))}</a></p>'
            if asset.get('metadata_removed'):
                body += '<p>Version de consultation sans métadonnées. L’original est conservé dans l’archive privée.</p>'
            body += '<details><summary>Informations du fichier</summary><dl><dt>Nom conservé</dt><dd>' + text(posixpath.basename(asset['path'])) + '</dd>'
            body += f'<dt>Taille</dt><dd>{asset["bytes"]:,} octets</dd><dt>SHA-256</dt><dd class="archive-hash">{asset["sha256"]}</dd></dl>'
            if asset.get('source_files'):
                body += '<p>Provenance dans la sauvegarde Metaflash :</p><ul>'
                body += ''.join('<li>' + text(source['path']) + ' <span class="archive-hash">(' + text(source['sha256']) + ')</span></li>' for source in asset['source_files'])
                body += '</ul>'
            if len(asset.get('aliases', [])) > 1:
                body += '<p>Copies identiques conservées :</p><ul>' + ''.join(
                    f'<li><a href="{url(alias, page)}">{text(alias)}</a></li>' for alias in asset['aliases']) + '</ul>'
            body += '</details></div>'
        body += '</section>'
        output[identifier + '/index.html'] = shell(page, entry['title'], body)
    used_collections = {entry['collection'] for entry in data['entries']}
    options = ''.join(f'<option value="{key}">{value}</option>' for key, value in COLLECTIONS.items() if key in used_collections)
    intro = 'Une première sélection d’images, d’animations et de variantes conservées autour de Metaflash et du blog Step.'
    if data.get('ftp_batch'):
        batch = data['ftp_batch']
        intro = f'Le fonds Metaflash : images, animations, variantes et éléments du site historique. Lot FTP : {batch["source_paths"]} fichiers inventoriés, {batch["included_paths"]} proposés ici et {batch["private_paths"]} conservés dans l’archive privée.'
    pager = '''<nav class="archive-pagination" aria-label="Pages du catalogue" hidden>
<button type="button" data-archive-previous>← Précédente</button><span data-archive-page aria-live="polite"></span>
<button type="button" data-archive-next>Suivante →</button></nav>''' if len(cards)>48 else ''
    body = f'''<h1>Archives Metaflash</h1>
<p class="archive-intro">{intro}</p>
<form class="archive-filters" role="search"><label>Rechercher<input type="search" name="query" autocomplete="off"></label>
<label>Type<select name="kind"><option value="">Tous</option><option value="image">Images</option><option value="swf">Flash</option></select></label>
<label>Collection<select name="collection"><option value="">Toutes</option>{options}</select></label><button type="reset">Tout afficher</button></form>
<p class="archive-count" role="status" data-archive-count>{len(cards)} notices</p>
{pager}
<div class="archive-grid">{''.join(cards)}</div><p data-archive-empty hidden>Aucun média ne correspond. Essayez un autre mot ou affichez toutes les collections.</p>'''
    output['index.html'] = shell(root_page, 'Catalogue', body)
    output['manifest.json'] = (json.dumps(manifest, ensure_ascii=False, indent=2) + '\n').encode()
    output['navigation.json'] = (json.dumps(navigation or [], ensure_ascii=False, indent=2) + '\n').encode()
    evidence = {'data_sha256': sha256(json.dumps(data, ensure_ascii=False, sort_keys=True).encode()),
                'notices': len(data['entries']), 'source_paths': sorted(covered),
                'sources': sorted(sources.values(), key=lambda row: row['path']),
                'files': [{'path': ROOT + name, 'sha256': sha256(raw), 'bytes': len(raw)}
                          for name, raw in sorted(output.items())]}
    return output, evidence
