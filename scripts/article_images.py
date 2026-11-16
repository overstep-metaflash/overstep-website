"""Reconcile audited missing images with real article images and exact file bytes."""

import hashlib
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote


def reviewed_image_articles(findings):
    """Collapse byte-identical XML/snapshot aliases, excluding intentional changes."""
    articles = {}
    for finding in findings:
        if finding['classification'] not in {
                'broken_markdown_image_url_with_spaces', 'missing_original_image_in_article'}:
            continue
        matches = finding['public_files_with_matching_backup_hash']
        if not matches or any(not paths for paths in matches.values()):
            raise ValueError('Missing audited image hash evidence: ' + finding['source_file'])
        source = finding['source_file']
        article = articles.setdefault(source, dict(source_file=source, post_id=str(finding['post_id']),
                                      article_url=finding['article_url'], images=[]))
        if (article['post_id'], article['article_url']) != (str(finding['post_id']), finding['article_url']):
            raise ValueError('Conflicting audited image article identity: ' + source)
        for sha256, paths in matches.items():
            if any(not path.startswith('static/') for path in paths):
                raise ValueError('Expected public static image paths: ' + source)
            image = next((i for i in article['images'] if i['sha256'] == sha256), None)
            if image is None:
                image = dict(sha256=sha256, paths=[])
                article['images'].append(image)
            image['paths'] = sorted(set(image['paths']) | {'/' + p.removeprefix('static/') for p in paths})
    return list(articles.values())


class ArticleImages(HTMLParser):
    """Collect img sources only inside entry-content, excluding sidebar artwork."""

    def __init__(self, page):
        super().__init__()
        self.images = []
        self.stack = []
        self.feed(page)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
                       'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.stack.append((tag, 'entry-content' in attrs.get('class', '').split()))
        if tag == 'img' and attrs.get('src') and any(active for _, active in self.stack):
            self.images.append(unquote(attrs['src']))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break


def reconcile_images(page, images, output, prefix='/'):
    """Require one rendered image per reviewed association and verify its payload."""
    prefix = '/' + prefix.strip('/') if prefix.strip('/') else ''
    rendered = ArticleImages(page).images
    output = Path(output).resolve()
    errors = []
    for image in images:
        selected = [src for src in rendered if src in {prefix + path for path in image['paths']}]
        if len(selected) != 1:
            errors.append('Missing or duplicated article image: ' + image['paths'][0])
            continue
        path = (output / selected[0].removeprefix(prefix).lstrip('/')).resolve()
        if not path.is_relative_to(output) or not path.is_file():
            errors.append('Missing image file: ' + selected[0])
        elif hashlib.sha256(path.read_bytes()).hexdigest() != image['sha256']:
            errors.append('Image hash differs: ' + selected[0])
    return errors
