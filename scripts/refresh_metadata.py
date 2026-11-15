"""Restore source category identities and the public author display name."""

import argparse
import html
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

from inventory import NS


def source_metadata(xml):
    channel = ET.fromstring(xml).find('channel')
    categories = {c.findtext('wp:category_nicename', '', NS):
                  html.unescape(c.findtext('wp:cat_name', '', NS))
                  for c in channel.findall('wp:category', NS)}
    posts = {p.findtext('wp:post_id', '', NS):
             [c.get('nicename') for c in p.findall('category') if c.get('domain') == 'category']
             for p in channel.findall('item') if p.findtext('wp:post_type', '', NS) == 'post'}
    return categories, posts


def source_tags(xml):
    channel = ET.fromstring(xml).find('channel')
    names = {t.findtext('wp:tag_slug', '', NS): html.unescape(t.findtext('wp:tag_name', '', NS))
             for t in channel.findall('wp:tag', NS)}
    posts = {p.findtext('wp:post_id', '', NS): [t.get('nicename') for t in p.findall('category') if t.get('domain') == 'post_tag']
             for p in channel.findall('item') if p.findtext('wp:post_type', '', NS) == 'post'}
    return names, posts


def rewrite_post(text, categories, display_date=None, tags=None):
    parts = text.split('---', 2)
    if len(parts) != 3:
        raise ValueError('Expected YAML front matter')
    front = re.sub(r'^author:.*$', 'author: Step', parts[1], flags=re.M)
    block = 'categories:\n' + ''.join('  - ' + json.dumps(c, ensure_ascii=False) + '\n' for c in categories)
    front, changed = re.subn(r'^categories:\n(?:[ \t]+[^\n]*\n)*', lambda _: block, front, flags=re.M)
    if not changed and categories:
        front = '\n' + block + front.lstrip('\n')
    if tags is not None:
        block = 'tags:\n' + ''.join('  - ' + json.dumps(t, ensure_ascii=False) + '\n' for t in tags) if tags else 'tags: []\n'
        front, changed = re.subn(r'^tags:(?:[^\n]*)\n(?:[ \t]+[^\n]*\n)*', lambda _: block, front, flags=re.M)
        if not changed and tags:
            front = '\n' + block + front.lstrip('\n')
    if display_date:
        from datetime import date
        date.fromisoformat(display_date)
        field = 'wordpress_display_date: ' + json.dumps(display_date)
        if re.search(r'^wordpress_display_date:', front, re.M):
            front = re.sub(r'^wordpress_display_date:.*$', field, front, flags=re.M)
        else:
            front = '\n' + field + '\n' + front.lstrip('\n')
    return '---'.join((parts[0], front, parts[2]))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, required=True)
    args = parser.parse_args()
    blog = Path(__file__).resolve().parents[1]
    site = args.site.resolve()
    if not site.is_relative_to(blog) or not (site / 'hugo.yaml').exists():
        raise SystemExit('Expected a generated site inside blog/')
    categories, posts = source_metadata((blog.parent / 'step.WordPress.2026-11-15.xml').read_bytes())
    tags, post_tags = source_tags((blog.parent / 'step.WordPress.2026-11-15.xml').read_bytes())
    dates = {p.findtext('wp:post_id', '', NS): p.findtext('wp:post_date', '', NS)[:10]
             for p in ET.parse(blog.parent / 'step.WordPress.2026-11-15.xml').findall('./channel/item')
             if p.findtext('wp:post_type', '', NS) == 'post'}
    updated = 0
    for path in (site / 'content/posts').glob('*.md'):
        original = path.read_text()
        match = re.search(r'^post_id: "(\d+)"$', original.split('---', 2)[1], re.M)
        if not match or match[1] not in posts:
            raise ValueError('Cannot reconcile post ID: ' + path.name)
        local_date = dates[match[1]]
        result = rewrite_post(original, posts[match[1]], local_date if local_date != '0000-00-00' else None, post_tags[match[1]])
        if result != original:
            path.write_text(result)
            updated += 1
    for slug, name in categories.items():
        if not re.fullmatch(r'[a-z0-9-]+', slug):
            raise ValueError('Unexpected category slug')
        path = site / 'content/categories' / slug / '_index.md'
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text('---\ntitle: ' + json.dumps(name, ensure_ascii=False) + '\nurl: /category/' + slug + '/\n---\n')
    for slug, name in tags.items():
        if not slug or '/' in slug or slug in {'.', '..'}:
            raise ValueError('Unexpected tag slug')
        path = site / 'content/tags' / slug / '_index.md'
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text('---\ntitle: ' + json.dumps(name, ensure_ascii=False) + '\nurl: /tag/' + slug + '/\n---\n')
    config = site / 'hugo.yaml'
    config.write_text(config.read_text().replace('    name: ladje', '    name: Step'))
    print(json.dumps({'updated_posts': updated, 'source_categories': len(categories), 'public_author': 'Step'}))


if __name__ == '__main__':
    main()
