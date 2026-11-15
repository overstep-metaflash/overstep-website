"""Read-only WordPress migration inventory; no third-party dependencies."""

import hashlib
import json
import re
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

NS = {'wp': 'http://wordpress.org/export/1.2/',
      'content': 'http://purl.org/rss/1.0/modules/content/'}


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = set()

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if not value:
                continue
            if key in {'src', 'href', 'poster', 'data-src', 'data'}:
                self.urls.add(value)
            elif key == 'srcset' and not value.startswith('data:'):
                self.urls.update(part.strip().split()[0] for part in value.split(',') if part.strip())


def analyze(xml):
    channel = ET.fromstring(xml).find('channel')
    base = channel.findtext('link', '')
    counts, comments = Counter(), Counter()
    features, references = defaultdict(list), defaultdict(set)
    public_urls = []
    attachment_urls = set()
    for item in channel.findall('item'):
        kind = item.findtext('wp:post_type', '', NS)
        status = item.findtext('wp:status', '', NS)
        counts[f'{kind}:{status}'] += 1
        for comment in item.findall('wp:comment', NS):
            comments[comment.findtext('wp:comment_approved', '', NS)] += 1
        if kind == 'attachment':
            url = item.findtext('wp:attachment_url', '', NS)
            if url:
                attachment_urls.add(url)
        if kind != 'post' or status != 'publish':
            continue
        post_id = int(item.findtext('wp:post_id', '0', NS))
        url = item.findtext('link', '')
        public_urls.append(url)
        body = item.findtext('content:encoded', '', NS)
        parser = References()
        parser.feed(body)
        for ref in parser.urls:
            absolute = urljoin(url or base, ref)
            if urlsplit(absolute).scheme in {'http', 'https'}:
                references[absolute].add(post_id)
        patterns = {'gallery': r'\[gallery\b', 'shortcode': r'\[/?[a-zA-Z][\w-]*(?:\s|\])',
                    'embed': r'<(?:iframe|object|embed)\b', 'code': r'<(?:pre|code)\b',
                    'legacy_html': r'<(?:font|table|center)\b'}
        for feature, pattern in patterns.items():
            if re.search(pattern, body, re.I):
                features[feature].append(post_id)
    return {'site_url': base, 'counts': dict(counts), 'comments': dict(comments),
            'public_urls': sorted(public_urls), 'attachment_urls': sorted(attachment_urls),
            'features': dict(features),
            'references': {url: sorted(ids) for url, ids in sorted(references.items())}}


def local_asset(url, hostname, uploads):
    parsed = urlsplit(url)
    if parsed.hostname and parsed.hostname != hostname:
        return None
    marker = '/wp-content/uploads/'
    path = unquote(parsed.path)
    if marker not in path:
        return None
    relative = path.split(marker, 1)[1]
    root = uploads.resolve()
    candidate = (root / relative).resolve()
    if not candidate.is_relative_to(root) or not candidate.is_file():
        return None
    return candidate.relative_to(root).as_posix()


def main():
    blog = Path(__file__).resolve().parents[1]
    workspace = blog.parent
    source = workspace / 'step.WordPress.2026-11-15.xml'
    uploads = workspace / 'backup_ftp/blog/wordpress/wp-content/uploads'
    raw = source.read_bytes()
    result = analyze(raw)
    hostname = urlsplit(result['site_url']).hostname
    all_urls = set(result['references']) | set(result['attachment_urls'])
    media = []
    for url in sorted(all_urls):
        parsed = urlsplit(url)
        if '/wp-content/uploads/' in unquote(parsed.path):
            local = local_asset(url, hostname, uploads)
            media.append({'url': url, 'local_file': local,
                          'status': 'available' if local else 'unresolved',
                          'public_post_ids': result['references'].get(url, [])})
    result['uploads'] = media
    result['source_sha256'] = hashlib.sha256(raw).hexdigest()
    result['ftp_upload_file_count'] = sum(p.is_file() for p in uploads.rglob('*'))
    reports = blog / 'migration/reports'
    reports.mkdir(parents=True, exist_ok=True)
    (reports / 'inventory.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    (reports / 'public-urls.txt').write_text('\n'.join(result['public_urls']) + '\n')
    summary = {key: result[key] for key in ('counts', 'comments', 'source_sha256', 'ftp_upload_file_count')}
    summary['upload_url_count'] = len(media)
    summary['available_upload_urls'] = sum(m['status'] == 'available' for m in media)
    summary['unresolved_upload_urls'] = sum(m['status'] == 'unresolved' for m in media)
    summary['feature_post_counts'] = {key: len(ids) for key, ids in result['features'].items()}
    (reports / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
    print(json.dumps(summary, indent=2))
    expected = {'post:publish': 470, 'post:draft': 10, 'attachment:inherit': 292}
    if result['counts'] != expected:
        raise SystemExit('Source counts differ from the reviewed baseline; inspect the report.')


if __name__ == '__main__':
    main()
