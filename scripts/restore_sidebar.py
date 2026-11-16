"""Extract the public blogroll and copy the archived navigation artwork."""

import json
import shutil
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

from repair_flash_menu import repair_menu


def extract_blogroll(source):
    class Blogroll(HTMLParser):
        def __init__(self):
            super().__init__()
            self.depth = 0
            self.url = None
            self.label = ''
            self.links = []

        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            if tag == 'li':
                if attrs.get('id') == 'linkcat-2' or self.depth:
                    self.depth += 1
            if self.depth and tag == 'a':
                self.url = attrs.get('href')
                self.label = ''

        def handle_data(self, data):
            if self.url:
                self.label += data

        def handle_endtag(self, tag):
            if tag == 'a' and self.url:
                if urlsplit(self.url).scheme in {'http', 'https'}:
                    self.links.append({'name': self.label.strip(), 'url': self.url})
                self.url = None
            if tag == 'li' and self.depth:
                self.depth -= 1

    parser = Blogroll()
    parser.feed(source)
    if not parser.links:
        raise ValueError('Public blogroll was not found')
    return parser.links


def main():
    blog = Path(__file__).resolve().parents[1]
    reference = blog / 'migration/reference/live.html'
    if not reference.exists():
        reference.parent.mkdir(parents=True, exist_ok=True)
        request = urllib.request.Request('https://blog.overstep.fr/', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=30) as response:
            reference.write_bytes(response.read())
    links = extract_blogroll(reference.read_text())
    overlay = blog / 'theme-overrides'
    (overlay / 'data').mkdir(exist_ok=True)
    (overlay / 'data/blogroll.json').write_text(json.dumps(links, ensure_ascii=False, indent=2) + '\n')
    source = blog.parent / 'backup_ftp/blog/wordpress/wp-content/themes/steptheme/images'
    for name in ('header.jpg', 'menu.swf', 'liens.swf'):
        destination = overlay / 'static/theme/step' / name
        if name == 'menu.swf':
            menu_links = json.loads((overlay / 'static/theme/step/menu-links.json').read_text())
            movie, _ = repair_menu((source / name).read_bytes(), {link['legacy'] for link in menu_links})
            destination.write_bytes(movie)
        else:
            shutil.copyfile(source / name, destination)
    print(f'Restored {len(links)} public blogroll links and three theme assets.')


if __name__ == '__main__':
    main()
