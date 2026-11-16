"""Detect the exact article payloads reviewed in the public link audit."""

import csv
import html
import re
from html.parser import HTMLParser


def load_reviewed_links(path):
    by_post = {}
    with path.open(newline='') as source:
        for row in csv.DictReader(source):
            by_post.setdefault(row['post_id'], []).append(row)
    return by_post


def normalized_text(source):
    class Text(HTMLParser):
        def __init__(self):
            super().__init__()
            self.parts = []

        def handle_data(self, data):
            self.parts.append(data)

        def handle_starttag(self, tag, attrs):
            if tag in {'br', 'p', 'div', 'h1', 'h2', 'h3', 'li'}:
                self.parts.append(' ')

        def handle_endtag(self, tag):
            self.handle_starttag(tag, [])

    parser = Text()
    parser.feed(source)
    # Ignore Markdown emphasis and escaping only for comparison, never for edits.
    text = re.sub(r'[\\*_`~]', '', ''.join(parser.parts))
    return ' '.join(html.unescape(text).split())


def reviewed_payloads_present(source, reviews):
    """Reject a reviewed URL or its anchor residue within the matching article.

    Callers select reviews by post ID. This is neither a domain blacklist nor a
    keyword filter: unrelated links and legitimate adult-themed art stay intact.
    """
    if not reviews:
        return False
    decoded = html.unescape(source)
    urls = set(re.findall(r'https?://[^\s<>"\'\])]+', decoded))
    text = normalized_text(source)
    return any(row['url'] in urls or normalized_text(row['anchor']) in text
               for row in reviews)
