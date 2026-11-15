"""Recover public media from immutable FTP backups without network requests."""

import argparse
import hashlib
import html
import json
import re
import shutil
import xml.etree.ElementTree as ET
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urljoin, urlsplit

from inventory import NS, References

EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.ico', '.svg',
              '.mp3', '.ogg', '.wav', '.m4a', '.mp4', '.webm', '.mov', '.pdf', '.swf'}
# Exact public attachment wrappers inspected during recovery; never copy arbitrary HTML/PHP.
REVIEWED_WRAPPERS = {'wp-content/uploads/' + path for path in (
    '2014/05/golgoth.html', '2016/08/aldousmoke.html', '2016/09/reminiscence.html',
    '2016/11/parade.html', '2017/02/bibop.html', '2017/04/elevation.html')}


def collect_urls(xml):
    channel = ET.fromstring(xml).find('channel')
    base = channel.findtext('link', '')
    items = channel.findall('item')
    public_ids = {i.findtext('wp:post_id', '', NS) for i in items
                  if i.findtext('wp:post_type', '', NS) == 'post'
                  and i.findtext('wp:status', '', NS) == 'publish'}
    urls = set()
    for item in items:
        if item.findtext('wp:post_id', '', NS) in public_ids:
            body = item.findtext('content:encoded', '', NS)
            parser = References()
            parser.feed(body)
            refs = parser.urls | set(re.findall(r'https?://[^\s<>"\[\]]+', html.unescape(body)))
            refs.update(re.findall(r'\[swf:["“\s]*(/[^\s"”\]]+\.swf)', body, re.I))
            for ref in refs:
                url = urljoin(item.findtext('link') or base, ref.rstrip("')"))
                if Path(unquote(urlsplit(url).path)).suffix.lower() in EXTENSIONS:
                    urls.add(url)
        elif (item.findtext('wp:post_type', '', NS) == 'attachment'
              and item.findtext('wp:post_parent', '', NS) in public_ids):
            url = item.findtext('wp:attachment_url', '', NS)
            if url:
                urls.add(url)
    return base, sorted(urls)


def resolve_media(url, base, workspace):
    parsed = urlsplit(url)
    if parsed.scheme not in {'http', 'https'} or parsed.hostname != urlsplit(base).hostname:
        return None
    path = unquote(parsed.path).lstrip('/')
    if '..' in PurePosixPath(path).parts:
        return None
    if Path(path).suffix.lower() not in EXTENSIONS and path not in REVIEWED_WRAPPERS:
        return None
    backup = workspace / 'backup_ftp'
    candidates = [backup / 'blog/wordpress' / path, backup / 'blog' / path]
    # This legacy root URL was traced to this exact FTP file during inventory.
    if path == 'souvenir_de_vacances.jpg':
        candidates.append(backup / 'metaflash/souvenir_de_vacances.jpg')
    for candidate in candidates:
        if candidate.resolve().is_relative_to(backup.resolve()) and candidate.is_file():
            return candidate, path
    return None


def wrapper_dependencies(source, url):
    parser = References()
    parser.feed(source.read_text(encoding='utf-8-sig', errors='replace'))
    return sorted(urljoin(url, ref) for ref in parser.urls
                  if not urlsplit(ref).netloc and Path(urlsplit(ref).path).suffix.lower() in EXTENSIONS)


def digest(path):
    checksum = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            checksum.update(chunk)
    return checksum.hexdigest()


def copy_media(source, static, relative):
    destination = static / relative
    if not destination.resolve().is_relative_to(static.resolve()):
        raise ValueError('Destination escapes the static directory')
    if destination.exists():
        if digest(source) != digest(destination):
            raise FileExistsError('Refusing to replace different media: ' + relative)
    else:
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, destination)
    if digest(source) != digest(destination):
        raise IOError('Copied media checksum differs: ' + relative)
    return digest(destination)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, required=True)
    args = parser.parse_args()
    workspace = Path(__file__).resolve().parents[2]
    site = args.site.resolve()
    if not site.is_relative_to(workspace / 'blog') or not (site / 'hugo.yaml').is_file():
        raise SystemExit('Choose an existing generated Hugo site inside blog/')
    base, urls = collect_urls((workspace / 'step.WordPress.2026-11-15.xml').read_bytes())
    report = {'site': str(site.relative_to(workspace)), 'copied': [], 'unresolved_local': [], 'external': []}
    copied = set()
    pending = list(urls)
    visited = set()
    while pending:
        url = pending.pop(0)
        if url in visited:
            continue
        visited.add(url)
        resolved = resolve_media(url, base, workspace)
        if not resolved:
            key = 'unresolved_local' if urlsplit(url).hostname == urlsplit(base).hostname else 'external'
            report[key].append(url)
            continue
        source, relative = resolved
        if relative in copied:
            continue
        checksum = copy_media(source, site / 'static', relative)
        report['copied'].append({'source': str(source.relative_to(workspace)), 'path': relative,
                                 'sha256': checksum, 'bytes': source.stat().st_size})
        copied.add(relative)
        if relative in REVIEWED_WRAPPERS:
            pending.extend(wrapper_dependencies(source, url))
    report['summary'] = {'copied_files': len(copied),
                         'copied_bytes': sum(f['bytes'] for f in report['copied']),
                         'unresolved_local_urls': len(report['unresolved_local']),
                         'external_urls': len(report['external'])}
    output = workspace / 'blog/migration/reports/media-recovery.json'
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report['summary'], indent=2))


if __name__ == '__main__':
    main()
