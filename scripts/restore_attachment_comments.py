"""Recover referenced media pages and approved comments of public articles."""

import html
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import unquote, urlsplit

from inventory import NS
from recover_media import resolve_media, copy_media
from sanitize_comments import sanitize_comment


def select_attachments(items, public_bodies):
    public_ids = {i.findtext('wp:post_id', '', NS) for i in items
                  if i.findtext('wp:post_type', '', NS) == 'post' and i.findtext('wp:status', '', NS) == 'publish'}
    bodies = unquote(public_bodies)
    selected = []
    for item in items:
        if item.findtext('wp:post_type', '', NS) != 'attachment' or item.findtext('wp:post_parent', '', NS) not in public_ids:
            continue
        path = unquote(urlsplit(item.findtext('link', '')).path)
        approved = any(c.findtext('wp:comment_approved', '', NS) == '1' for c in item.findall('wp:comment', NS))
        if approved or (path and path in bodies):
            selected.append(item)
    return selected


def main():
    blog = Path(__file__).resolve().parents[1]
    items = ET.parse(blog.parent / 'step.WordPress.2026-11-15.xml').findall('./channel/item')
    public = {i.findtext('wp:post_id', '', NS): i for i in items
              if i.findtext('wp:post_type', '', NS) == 'post' and i.findtext('wp:status', '', NS) == 'publish'}
    path = blog / 'data/comments.json'
    comments = json.loads(path.read_text())
    ids = {c['id'] for c in comments}
    restored = []
    bodies = '\n'.join(p.read_text() for p in (blog / 'content/posts').glob('*.md'))
    selected = select_attachments(items, bodies)
    for item in selected:
        parent = item.findtext('wp:post_parent', '', NS)
        if item.findtext('wp:post_type', '', NS) != 'attachment' or parent not in public:
            continue
        approved = [c for c in item.findall('wp:comment', NS) if c.findtext('wp:comment_approved', '', NS) == '1']
        post_id = item.findtext('wp:post_id', '', NS)
        url = unquote(urlsplit(item.findtext('link')).path)
        media_url = item.findtext('wp:attachment_url', '', NS)
        asset = resolve_media(media_url, 'https://blog.overstep.fr', blog.parent)
        if not asset:
            raise ValueError('Attachment media is missing')
        copy_media(asset[0], blog / 'static', asset[1])
        title = html.unescape(item.findtext('title', ''))
        fields = {'title': title, 'url': url, 'post_id': post_id, 'author': 'Step',
                  'wordpress_display_date': item.findtext('wp:post_date', '', NS)[:10]}
        parent_url = urlsplit(public[parent].findtext('link')).path
        body = f'[← Retour à l’article]({parent_url})\n\n![{title}]({urlsplit(media_url).path})\n'
        content = '---\n' + ''.join(k + ': ' + json.dumps(v, ensure_ascii=False) + '\n' for k, v in fields.items()) + '---\n' + body
        target = blog / 'content/attachments' / (post_id + '.md')
        target.parent.mkdir(exist_ok=True)
        target.write_text(content)
        for source in approved:
            id = source.findtext('wp:comment_id', '', NS)
            if id in ids:
                continue
            record = {'id': id, 'post_id': post_id, 'post_url': url,
                      'parent_id': source.findtext('wp:comment_parent', '0', NS),
                      'author_name': source.findtext('wp:comment_author', '', NS),
                      'author_url': source.findtext('wp:comment_author_url', '', NS),
                      'published': source.findtext('wp:comment_date', '', NS).replace(' ', 'T') + 'Z',
                      'content': source.findtext('wp:comment_content', '', NS)}
            comments.append(sanitize_comment(record))
            ids.add(id)
            restored.append(id)
    path.write_text(json.dumps(comments, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'attachment_pages': len(selected), 'restored_comment_ids': restored, 'total_comments': len(comments)}))


if __name__ == '__main__':
    main()
