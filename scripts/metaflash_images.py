"""Build complete image sets from reviewed legacy image pages and gallery links."""
import html
from html.parser import HTMLParser
from pathlib import PurePosixPath

from metaflash import body_fragment, embedded_movies, local_reference, relative_site_url, tag_html

IMAGE_TYPES = {'.jpg', '.jpeg', '.gif', '.png'}
COVER_SETS = {
    'photoshop/sirius.html': [('photoshop/sirius.html', 'Face'),
                            ('photoshop/sirius2.html', 'Intérieur'),
                            ('photoshop/sirius3.html', 'Verso')],
    'photoshop/mc1.html': [('photoshop/mc1.html', 'Face'),
                         ('photoshop/mc1b.html', 'Intérieur'),
                         ('photoshop/mc1c.html', 'Verso')],
}


def image_references(source, source_path):
    """Keep image/link order and distinguish artwork from linked navigation thumbs."""
    class References(HTMLParser):
        def __init__(self):
            super().__init__()
            self.link = None
            self.images, self.links = [], []

        def handle_starttag(self, tag, attributes):
            attrs = dict(attributes)
            if tag == 'a':
                self.link = attrs.get('href')
                if self.link:
                    self.links.append(self.link)
            elif tag == 'img' and attrs.get('src'):
                src = local_reference(attrs['src'], source_path)
                target = local_reference(self.link, source_path) if self.link else None
                navigation = target and PurePosixPath(target).suffix.lower() in {'.html', '.htm'} and \
                    target not in {'menu2.html', 'menu.html', 'menu.htm', 'index.html'}
                if src and not navigation:
                    self.images.append({'src': src, 'alt': attrs.get('alt', ''),
                                        'caption': attrs.get('title', '')})

        def handle_endtag(self, tag):
            if tag == 'a':
                self.link = None

    parser = References()
    parser.feed(body_fragment(source))
    return parser.images, parser.links


def build_image_galleries(originals, pages, assets):
    galleries, links = {}, {}
    grouped_pages = {name for group in COVER_SETS.values() for name, _ in group}

    def main_images(name):
        images, _ = image_references(originals[name], name)
        return [image for image in images if assets.get(image['src'])]

    def bind(name, identifier, index):
        links[name] = {'gallery_id': identifier, 'index': index}
        if name in pages:
            pages[name].update(kind='image', gallery_id=identifier, image_index=index)

    for identifier, members in COVER_SETS.items():
        if identifier not in originals:
            continue
        images = []
        for index, (name, caption) in enumerate(members):
            if name not in originals:
                raise ValueError('Missing reviewed cover page: ' + name)
            full = main_images(name)
            if len(full) != 1:
                raise ValueError('Expected one full-size cover image: ' + name)
            images.append({**full[0], 'caption': caption})
            bind(name, identifier, index)
        galleries[identifier] = {'title': pages[identifier]['title'], 'images': images}

    for name, source in originals.items():
        if name in grouped_pages or name == 'menu2.html' or embedded_movies(source):
            continue
        images = main_images(name)
        if not images:
            continue
        galleries[name] = {'title': pages[name]['title'], 'images': images}
        bind(name, name, 0)

    if 'menu2.html' in originals:
        _, destinations = image_references(originals['menu2.html'], 'menu2.html')
        for reference in destinations:
            path = local_reference(reference, 'menu2.html')
            if not path or PurePosixPath(path).suffix.lower() not in IMAGE_TYPES or not assets.get(path):
                continue
            identifier = 'photocats' if path.startswith('photocats/') else 'illustrations'
            group = galleries.setdefault(identifier, {'title': 'Mes chats' if identifier == 'photocats' else 'Illustrations', 'images': []})
            if path not in links:
                links[path] = {'gallery_id': identifier, 'index': len(group['images'])}
                group['images'].append({'src': path, 'alt': group['title'], 'caption': ''})
    return galleries, links


def render_image_page(gallery, identifier, source_path):
    """Offer every full-size image without the original invisible menu hotspots."""
    output = ['<section class="metaflash-image-page"><h1>' + html.escape(gallery['title']) + '</h1>']
    for index, image in enumerate(gallery['images']):
        output.append('<figure>')
        output.append(tag_html('a', {'href': relative_site_url('/metaflash/' + image['src'], source_path),
                                     'data-metaflash-gallery': identifier, 'data-metaflash-index': str(index)}))
        output.append(tag_html('img', {'src': relative_site_url('/metaflash/' + image['src'], source_path),
                                       'alt': image['alt'] or image['caption'] or gallery['title']}))
        output.append('</a>')
        if image['caption']:
            output.append('<figcaption>' + html.escape(image['caption']) + '</figcaption>')
        output.append('</figure>')
    output.append('</section>')
    return '\n'.join(output)
