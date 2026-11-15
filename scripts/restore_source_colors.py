"""Restore simple source text colors that survived conversion as matching text."""

import argparse
import html
import json
import re
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

from inventory import NS


class ColoredText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.runs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        color = self.stack[-1][1] if self.stack else None
        match = re.search(r'(?:^|;)\s*color\s*:\s*(#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?)\s*(?:;|$)', attrs.get('style', ''))
        if match:
            color = match[1].lower()
        if tag not in {'img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'wbr', 'param', 'embed'}:
            self.stack.append((tag, color))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def handle_data(self, text):
        if self.stack and self.stack[-1][1] and not any(t in {'a', 'code', 'pre', 'script', 'style'} for t, _ in self.stack):
            text = text.strip()
            if len(text) >= 8:
                self.runs.append((text, self.stack[-1][1]))


def restore_colors(source, body):
    if 'class="source-color"' in body:
        return body, 0
    parser = ColoredText()
    parser.feed(source)
    cursor, count = 0, 0
    for text, color in parser.runs:
        pattern = r'\s+'.join(re.escape(word) for word in text.split())
        match = re.search(pattern, body[cursor:])
        if not match:
            continue
        start, end = cursor + match.start(), cursor + match.end()
        fragment = body[start:end]
        if '{{' in fragment or '}}' in fragment:
            continue
        replacement = '<span class="source-color" style="color: ' + color + ';">' + html.escape(fragment, quote=False) + '</span>'
        body = body[:start] + replacement + body[end:]
        cursor = start + len(replacement)
        count += 1
    return body, count


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, required=True)
    args = parser.parse_args()
    blog = Path(__file__).resolve().parents[1]
    site = args.site.resolve()
    if not site.is_relative_to(blog) or not (site / 'hugo.yaml').exists():
        raise SystemExit('Expected a generated site inside blog/')
    source = ET.parse(blog.parent / 'step.WordPress.2026-11-15.xml')
    posts = {p.findtext('wp:post_id', '', NS): p.findtext('content:encoded', '', NS)
             for p in source.findall('./channel/item') if p.findtext('wp:post_type', '', NS) == 'post'}
    changes = []
    for path in (site / 'content/posts').glob('*.md'):
        parts = path.read_text().split('---', 2)
        post_id = re.search(r'^post_id: "(\d+)"$', parts[1], re.M)[1]
        body, count = restore_colors(posts[post_id], parts[2])
        if count:
            path.write_text('---'.join(parts[:2]) + '---' + body)
            changes.append({'post_id': post_id, 'colored_runs': count})
    report = {'changed_posts': len(changes), 'colored_runs': sum(c['colored_runs'] for c in changes), 'changes': changes}
    if changes:
        (blog / 'migration/reports/source-colors.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({k: v for k, v in report.items() if k != 'changes'}))


if __name__ == '__main__':
    main()
