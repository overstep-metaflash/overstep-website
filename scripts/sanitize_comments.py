"""Render and sanitize archived comments before trusting their HTML in Hugo."""

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

BLOG = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BLOG / 'migration/vendor/python'))
import nh3
from markdown_it import MarkdownIt

MARKDOWN = MarkdownIt('commonmark', {'html': True})
TAGS = {'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'blockquote',
        'code', 'pre', 'ul', 'ol', 'li', 'span', 'a', 'hr'}


def sanitize_comment(comment):
    result = {k: v for k, v in comment.items() if k not in {
        'author_email', 'author_ip', 'author_IP', 'avatar_url', 'email_hash'}}
    result['content_html'] = nh3.clean(
        MARKDOWN.render(result.get('content', '')), tags=TAGS,
        attributes={'a': {'href', 'title'}}, url_schemes={'http', 'https', 'mailto'},
        clean_content_tags={'script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'template'},
        strip_comments=True, link_rel='nofollow noopener noreferrer')
    url = result.get('author_url', '').strip()
    try:
        parsed = urlsplit(url)
        valid = parsed.scheme in {'http', 'https'} and parsed.hostname and not parsed.username
    except ValueError:
        valid = False
    if not valid or any(ord(c) <= 32 for c in url):
        url = ''
    result['author_url'] = url
    words = re.findall(r'[^\W_]+', result.get('author_name', ''), re.UNICODE)
    result['initials'] = ''.join(word[0] for word in words[:2]).upper() or '?'
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    path = BLOG / 'data/comments.json'
    source = json.loads(path.read_text())
    clean = [sanitize_comment(c) for c in source]
    if args.check:
        if clean != source:
            raise SystemExit('Comments need sanitization: run python scripts/sanitize_comments.py')
    else:
        path.write_text(json.dumps(clean, ensure_ascii=False, indent=2) + '\n')
    print(f'Validated {len(clean)} sanitized comments with local initials.')


if __name__ == '__main__':
    main()
