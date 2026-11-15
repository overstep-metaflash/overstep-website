"""Recover three reviewed static legacy pages and their image dependencies."""

import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit

from recover_media import copy_media

PAGES = {
    '/40jours/reglement.htm': 'metaflash/40jours/reglement.htm',
    '/charbonnerie.html': 'metaflash/charbonnerie.html',
    '/wp-content/uploads/2011/dotclear/morning.html': 'blog/wordpress/wp-content/uploads/2011/dotclear/morning.html',
}


def review_page(raw):
    source = re.sub(r'\s+background="[^"]*"', '', raw.decode('latin1'), flags=re.I)
    assets = set()

    class Review(HTMLParser):
        def handle_starttag(self, tag, attrs):
            if tag not in {'html', 'head', 'title', 'meta', 'body', 'img', 'br', 'p', 'font', 'b', 'i', 'div', 'table', 'tr', 'td'}:
                raise ValueError('Unreviewed legacy tag: ' + tag)
            for key, value in attrs:
                if key not in {'http-equiv', 'content', 'bgcolor', 'text', 'src', 'width', 'height', 'color', 'face', 'size', 'align', 'border'}:
                    raise ValueError('Unreviewed legacy attribute: ' + key)
                if key == 'src':
                    parsed = urlsplit(value or '')
                    if parsed.scheme or parsed.netloc or parsed.path.startswith('/') or '..' in Path(parsed.path).parts or Path(parsed.path).suffix.lower() not in {'.jpg', '.jpeg', '.png', '.gif'}:
                        raise ValueError('Unreviewed legacy dependency')
                    assets.add(parsed.path)

    Review().feed(source)
    return source.encode('latin1'), assets


def main():
    blog = Path(__file__).resolve().parents[1]
    backup = blog.parent / 'backup_ftp'
    for url, relative in PAGES.items():
        original = backup / relative
        raw, assets = review_page(original.read_bytes())
        for asset in assets:
            source = (original.parent / asset).resolve()
            if not source.is_relative_to(backup.resolve()) or not source.is_file():
                raise ValueError('Legacy image is missing or outside the backup')
            destination = urlsplit(urljoin(url, asset)).path.lstrip('/')
            copy_media(source, blog / 'static', destination)
        target = blog / 'static' / url.lstrip('/')
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists() and target.read_bytes() != raw:
            raise ValueError('Refusing to overwrite changed legacy HTML')
        target.write_bytes(raw)
    print(f'Recovered {len(PAGES)} reviewed static pages without executable code.')


if __name__ == '__main__':
    main()
