"""Validate release invariants against the built site without private backups."""

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

from prepare_release import read_markdown
from sanitize_comments import sanitize_comment
from reviewed_links import load_reviewed_links, reviewed_payloads_present
from flash_manifest import reconcile_article, reconcile_audio, validate_coverage
from article_images import reviewed_image_articles, reconcile_images

BLOG = Path(__file__).resolve().parents[1]


def missing_local_paths(output, base_url):
    output = output.resolve()
    base = urlsplit(base_url)
    prefix = base.path.rstrip('/') + '/'
    checked, missing = set(), set()

    class Links(HTMLParser):
        def handle_starttag(self, tag, attrs):
            for key, value in attrs:
                if key not in {'href', 'src', 'poster', 'data-swf'} or not value or value.startswith('#'):
                    continue
                target = urlsplit(urljoin(self.page_url, value))
                if target.netloc != base.netloc or not target.path.startswith(prefix):
                    continue
                relative = unquote(target.path.removeprefix(prefix))
                if relative in checked:
                    continue
                checked.add(relative)
                file = (output / relative).resolve()
                if not file.is_relative_to(output) or not (file.is_file() or (file / 'index.html').is_file()):
                    missing.add('/' + relative)

    for page in output.rglob('*.html'):
        parser = Links()
        parser.page_url = base_url.rstrip('/') + '/' + page.relative_to(output).as_posix()
        parser.feed(page.read_bytes().decode('utf-8', errors='replace'))
    menu_map = output / 'theme/step/menu-links.json'
    if menu_map.is_file():
        for item in json.loads(menu_map.read_text()):
            destination = item['destination']
            if destination.startswith('/'):
                relative = unquote(urlsplit(destination).path).lstrip('/')
                path = (output / relative).resolve()
                if not path.is_relative_to(output) or not (path.is_file() or (path / 'index.html').is_file()):
                    missing.add('/' + relative)
    return missing


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', type=Path, default=Path('public'))
    parser.add_argument('--base-url', default='https://blog.overstep.fr/')
    args = parser.parse_args()
    output = args.directory.resolve()
    comments = json.loads((BLOG / 'data/comments.json').read_text())
    reviewed_links = load_reviewed_links(BLOG / 'docs/audits/2026-11-16-links.csv')
    flash = json.loads((BLOG / 'docs/flash-recovery.json').read_text())['articles']
    audit = json.loads((BLOG / 'docs/audits/2026-11-16-content.json').read_text())
    audited_movies = audit['missing_embedded_flash']
    images = reviewed_image_articles(audit['image_differences_requiring_review'])
    images_by_source = {a['source_file']: a for a in images}
    images_checked = set()
    errors = validate_coverage(flash, audited_movies)
    if errors:
        raise SystemExit('; '.join(errors))
    flash_by_source = {a['source_file']: a for a in flash}
    flash_checked = set()
    by_post = {}
    for comment in comments:
        if sanitize_comment(comment) != comment:
            raise SystemExit('Comment data is not sanitized: ' + comment['id'])
        by_post.setdefault(comment['post_id'], []).append(comment)
    seen = set()
    checked = 0
    for section in ('posts', 'attachments'):
        for source in (BLOG / 'content' / section).glob('*.md'):
            metadata, body = read_markdown(source)
            if metadata.get('draft'):
                raise SystemExit('Draft content cannot enter the public repository')
            # Historical article HTML is reviewed separately from sanitized comments.
            if re.search(r'<\s*(script|iframe|object|embed)\b|\bon\w+\s*=|(?:javascript|vbscript)\s*:', body, re.I):
                raise SystemExit('Unreviewed executable article HTML: ' + source.name)
            target = output / unquote(urlsplit(metadata['url']).path).lstrip('/') / 'index.html'
            if not target.is_file():
                raise SystemExit('Missing public path: ' + metadata['url'])
            page = target.read_text()
            image_article = images_by_source.get(source.relative_to(BLOG).as_posix())
            if image_article:
                if (str(metadata['post_id']) != image_article['post_id']
                        or metadata['url'] != image_article['article_url']):
                    raise SystemExit('Image article identity differs: ' + source.name)
                errors = reconcile_images(page, image_article['images'], output, urlsplit(args.base_url).path)
                if errors:
                    raise SystemExit(metadata['url'] + ': ' + '; '.join(errors))
                images_checked.add(image_article['source_file'])
            flash_article = flash_by_source.get(source.relative_to(BLOG).as_posix())
            if flash_article:
                if (str(metadata['post_id']) != flash_article['post_id']
                        or metadata['url'] != flash_article['article_url']):
                    raise SystemExit('Flash article identity differs: ' + source.name)
                errors = reconcile_article(page, flash_article['movies'], output, urlsplit(args.base_url).path)
                errors += reconcile_audio(page, flash_article.get('audio', []), output, urlsplit(args.base_url).path)
                if errors:
                    raise SystemExit(metadata['url'] + ': ' + '; '.join(errors))
                flash_checked.add(flash_article['post_id'])
            reviews = reviewed_links.get(str(metadata['post_id']), [])
            if any(reviewed_payloads_present(text, reviews) for text in (body, page)):
                raise SystemExit('Reviewed article injection reintroduced: ' + source.name)
            expected = {c['id'] for c in by_post.get(metadata['post_id'], [])}
            found = set(re.findall(r'id="comment-(\d+)"', page))
            if found != expected:
                raise SystemExit('Comment coverage differs: ' + metadata['url'])
            if 'gravatar.com/avatar/' in page:
                raise SystemExit('External avatar request in public HTML')
            seen.update(found)
            checked += 1
    if seen != {c['id'] for c in comments}:
        raise SystemExit('Some comment records have no rendered public page')
    if flash_checked != {a['post_id'] for a in flash}:
        raise SystemExit('Some reviewed Flash articles have no rendered public page')
    if images_checked != set(images_by_source):
        raise SystemExit('Some audited image articles have no rendered public page')
    prefix = urlsplit(args.base_url).path.rstrip('/') + '/'
    if prefix != '/':
        for path in output.rglob('*.html'):
            source = path.read_bytes().decode('utf-8', errors='surrogateescape')
            for url in re.findall(r'\b(?:href|src|poster|data-swf)=[\'"](/[^\'"]*)', source):
                if not url.startswith('//') and not url.startswith(prefix):
                    raise SystemExit('Unprefixed preview URL: ' + url)
    if not (output / 'feed.xml').is_file():
        raise SystemExit('RSS feed is missing')
    known = set(json.loads((BLOG / 'docs/remaining-local-links.json').read_text()))
    missing = missing_local_paths(output, args.base_url)
    if missing - known:
        raise SystemExit('New missing local destinations: ' + ', '.join(sorted(missing - known)))
    print(f'Known legacy destinations still requiring review: {len(missing)}.')
    print(f'Validated {checked} public content pages and {len(seen)} sanitized comments.')
    print(f'Reconciled {len(audited_movies)} recovered Flash associations in {len(flash_checked)} articles.')
    print(f'Reconciled {sum(len(a["images"]) for a in images)} audited images in {len(images_checked)} articles.')


if __name__ == '__main__':
    main()
