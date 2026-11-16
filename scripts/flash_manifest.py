"""Reconcile reviewed article/player associations without private source backups."""

import hashlib
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


def validate_coverage(articles, audited_movies):
    expected = {(str(m['post_id']), unquote(m['resolved_path'])) for m in audited_movies}
    actual = [(str(a['post_id']), m['src']) for a in articles for m in a['movies']]
    if set(actual) != expected or len(actual) != len(expected):
        return ['Flash recovery manifest differs from the audited article/movie associations']
    return []


def article_media(page):
    class Players(HTMLParser):
        def __init__(self):
            super().__init__()
            self.players = []
            self.audio = []
            self.stack = []

        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            classes = attrs.get('class', '').split()
            if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
                           'link', 'meta', 'param', 'source', 'track', 'wbr'}:
                self.stack.append((tag, 'entry-content' in classes))
            if not any(active for _, active in self.stack):
                return
            if tag == 'audio' and attrs.get('src'):
                self.audio.append(attrs['src'])
            if 'flash-animation' in classes:
                self.players.append(dict(src=attrs.get('data-swf'),
                                         fullscreen=attrs.get('data-fullscreen'),
                                         width=re.search(r'max-width:\s*(\d+)px', attrs.get('style', ''))))
            elif 'flash-player' in classes and self.players:
                self.players[-1]['ratio'] = re.search(r'aspect-ratio:\s*(\d+)\s*/\s*(\d+)', attrs.get('style', ''))

        def handle_endtag(self, tag):
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]
                    break

    parser = Players()
    parser.feed(page)
    return parser


def reconcile_article(page, movies, output, prefix='/'):
    """Check ordered players, their settings and exact bytes in this article."""
    prefix = '/' + prefix.strip('/') if prefix.strip('/') else ''
    players = article_media(page).players
    errors = []
    expected = [prefix + m['src'] for m in movies]
    # Existing reviewed players may coexist with the recovered sequence.
    selected = [p for p in players if p['src'] in expected]
    if [p['src'] for p in selected] != expected:
        errors.append('Missing, duplicated or reordered article players')
    for movie, src in zip(movies, expected):
        for player in (p for p in selected if p['src'] == src):
            width = player['width']
            ratio = player.get('ratio')
            if (not width or int(width[1]) != movie['width'] or not ratio
                    or tuple(map(int, ratio.groups())) != (movie['width'], movie['height'])
                    or player['fullscreen'] != str(movie['fullscreen']).lower()):
                errors.append('Player settings differ: ' + movie['src'])
        relative = unquote(urlsplit(movie['src']).path).lstrip('/')
        path = (Path(output) / relative).resolve()
        if not path.is_relative_to(Path(output).resolve()) or not path.is_file():
            errors.append('Missing movie file: ' + movie['src'])
        elif hashlib.sha256(path.read_bytes()).hexdigest() != movie['sha256']:
            errors.append('Movie hash differs: ' + movie['src'])
    return errors


def reconcile_audio(page, audio, output, prefix='/'):
    prefix = '/' + prefix.strip('/') if prefix.strip('/') else ''
    rendered = article_media(page).audio
    errors = []
    for item in audio:
        if rendered.count(prefix + item['src']) != 1:
            errors.append('Missing or duplicated companion audio player: ' + item['src'])
        path = (Path(output) / item['src'].lstrip('/')).resolve()
        if (not path.is_relative_to(Path(output).resolve()) or not path.is_file()
                or hashlib.sha256(path.read_bytes()).hexdigest() != item['sha256']):
            errors.append('Companion audio payload differs: ' + item['src'])
    return errors
