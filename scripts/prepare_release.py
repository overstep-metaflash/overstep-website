"""Promote reviewed staging content without raw backups or private metadata."""

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

BLOG = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BLOG / 'migration/vendor/python'))
import yaml
from sanitize_comments import sanitize_comment

PUBLIC_FIELDS = {'title', 'date', 'lastmod', 'publishDate', 'url', 'slug', 'categories',
                 'tags', 'author', 'wordpress_display_date', 'post_id', 'guid',
                 'description', 'summary', 'image', 'cover', 'aliases', 'enclosure'}
COMMENT_FIELDS = {'id', 'post_id', 'parent_id', 'post_url', 'published',
                  'author_name', 'author_url', 'content'}


def public_front_matter(metadata):
    if str(metadata.get('draft', False)).lower() in {'true', '1', 'yes'}:
        return None
    return {k: v for k, v in metadata.items() if k in PUBLIC_FIELDS}


def public_comments(comments, post_ids):
    result = []
    for comment in comments:
        if str(comment['post_id']) not in post_ids:
            continue
        public = {k: v for k, v in comment.items() if k in COMMENT_FIELDS}
        if hasattr(public.get('published'), 'isoformat'):
            public['published'] = public['published'].isoformat()
        result.append(sanitize_comment(public))
    return result


def read_markdown(path):
    match = re.match(r'\A\s*---\r?\n(.*?)\r?\n---(?:\r?\n)?(.*)\Z', path.read_text(), re.S)
    if not match:
        raise ValueError('Expected YAML front matter: ' + path.name)
    return yaml.safe_load(match[1]), match[2]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    args = parser.parse_args()
    source = args.source.resolve()
    if not source.is_relative_to(BLOG / 'migration/raw'):
        raise SystemExit('Expected staging source inside migration/raw/')
    for name in ('content', 'layouts', 'static', 'data', 'themes', 'hugo.yaml'):
        if (BLOG / name).exists():
            raise SystemExit('Refusing to replace an existing promoted site: ' + name)
    posts, public_ids, draft_count = [], set(), 0
    for path in sorted((source / 'content/posts').glob('*.md')):
        metadata, body = read_markdown(path)
        public = public_front_matter(metadata)
        if public is None:
            draft_count += 1
            continue
        public_ids.add(str(public['post_id']))
        posts.append((path.name, public, body))
    if len(posts) != 470 or draft_count != 10:
        raise SystemExit('Unexpected source reconciliation; promotion stopped.')
    comments = public_comments(yaml.safe_load((source / 'data/comments.yaml').read_text()), public_ids)
    if len(comments) != 2638:
        raise SystemExit('Unexpected public comment count; promotion stopped.')
    target = BLOG / 'content/posts'
    target.mkdir(parents=True)
    for name, metadata, body in posts:
        (target / name).write_text('---\n' + yaml.safe_dump(metadata, allow_unicode=True, sort_keys=False) + '---\n' + body)
    for taxonomy in ('categories', 'tags'):
        active = {term for _, meta, _ in posts for term in meta.get(taxonomy, [])}
        for path in (source / 'content' / taxonomy).rglob('*.md'):
            if path.parent.name not in active:
                continue
            destination = BLOG / path.relative_to(source)
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(path, destination)
    shutil.copytree(source / 'content/date-archives', BLOG / 'content/date-archives')
    for name in ('layouts', 'themes', 'static', 'archetypes'):
        shutil.copytree(source / name, BLOG / name, ignore=shutil.ignore_patterns('.git', '.github', '.DS_Store'))
    (BLOG / 'data').mkdir()
    (BLOG / 'data/comments.json').write_text(json.dumps(comments, ensure_ascii=False, indent=2) + '\n')
    for name in ('blogroll.json', 'date_archives.json'):
        shutil.copyfile(source / 'data' / name, BLOG / 'data' / name)
    shutil.copyfile(source / 'hugo.yaml', BLOG / 'hugo.yaml')
    shutil.copytree(BLOG / 'theme-overrides', BLOG, dirs_exist_ok=True)
    report = {'public_posts': len(posts), 'drafts_excluded': draft_count, 'public_comments': len(comments),
              'private_comment_fields_removed': True, 'internal_post_fields_removed': True,
              'raw_backups_included': False}
    (BLOG / 'migration/reports/first-release.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
