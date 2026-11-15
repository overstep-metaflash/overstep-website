"""Generate year, month, and day archives from published WordPress local dates."""

import argparse
import json
import xml.etree.ElementTree as ET
from collections import defaultdict
from datetime import date
from pathlib import Path

from inventory import NS

MONTHS = ('janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août',
          'septembre', 'octobre', 'novembre', 'décembre')


def archive_records(xml):
    groups = defaultdict(list)
    for item in ET.fromstring(xml).findall('./channel/item'):
        if item.findtext('wp:post_type', '', NS) != 'post' or item.findtext('wp:status', '', NS) != 'publish':
            continue
        day = date.fromisoformat(item.findtext('wp:post_date', '', NS)[:10])
        post_id = item.findtext('wp:post_id', '', NS)
        groups[f'/{day.year:04d}/'].append(post_id)
        groups[f'/{day.year:04d}/{day.month:02d}/'].append(post_id)
        groups[f'/{day.year:04d}/{day.month:02d}/{day.day:02d}/'].append(post_id)
    records = {}
    for url, ids in sorted(groups.items()):
        parts = url.strip('/').split('/')
        label = parts[0]
        parent = '/archives/'
        if len(parts) >= 2:
            label = MONTHS[int(parts[1]) - 1] + ' ' + parts[0]
            parent = '/' + parts[0] + '/'
        if len(parts) == 3:
            label = str(int(parts[2])) + ' ' + label
            parent = '/' + '/'.join(parts[:2]) + '/'
        records[url] = {'title': 'Archives de ' + label, 'ids': ids, 'parent': parent,
                        'label': label, 'url': url}
    return records


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, required=True)
    args = parser.parse_args()
    blog = Path(__file__).resolve().parents[1]
    site = args.site.resolve()
    if not site.is_relative_to(blog) or not (site / 'hugo.yaml').exists():
        raise SystemExit('Expected a generated site inside blog/')
    records = archive_records((blog.parent / 'step.WordPress.2026-11-15.xml').read_bytes())
    all_ids = sorted({id for record in records.values() for id in record['ids']}, key=int)
    records['/archives/'] = {'title': 'Archives', 'ids': all_ids, 'parent': '/', 'label': 'Archives', 'url': '/archives/'}
    for url, record in records.items():
        key = url.strip('/').replace('/', '-')
        destination = site / 'content/date-archives'
        if url != '/archives/':
            destination /= key
        destination /= '_index.md'
        if destination.exists() and 'migration_date_archive: true' not in destination.read_text():
            raise FileExistsError('Refusing to overwrite non-generated archive: ' + str(destination))
        children = [{'url': child_url, 'label': child['label'], 'count': len(child['ids'])}
                    for child_url, child in sorted(records.items(), reverse=True)
                    if child['parent'] == url]
        fields = {'title': record['title'], 'url': url, 'archive_post_ids': record['ids'],
                  'archive_parent': record['parent'], 'archive_children': children,
                  'migration_date_archive': True}
        text = '---\n' + ''.join(k + ': ' + json.dumps(v, ensure_ascii=False) + '\n' for k, v in fields.items()) + '---\n'
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(text)
    years = [{'url': url, 'label': record['label'], 'count': len(record['ids']),
              'months': [{'url': m_url, 'label': m['label'], 'count': len(m['ids'])}
                         for m_url, m in sorted(records.items(), reverse=True) if m['parent'] == url]}
             for url, record in sorted(records.items(), reverse=True)
             if len(url.strip('/').split('/')) == 1 and url != '/archives/']
    (site / 'data/date_archives.json').write_text(json.dumps({'years': years}, ensure_ascii=False, indent=2) + '\n')
    report = {'archive_pages': len(records), 'public_post_ids': len(all_ids),
              'years': len(years), 'months': sum(len(y['months']) for y in years),
              'archives': {url: r['ids'] for url, r in records.items()}}
    (blog / 'migration/reports/date-archives.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({k: v for k, v in report.items() if k != 'archives'}))


if __name__ == '__main__':
    main()
