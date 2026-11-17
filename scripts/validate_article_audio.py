"""Reconcile reviewed replacements for historical Dewplayer article associations."""
import argparse
from collections import defaultdict
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import unquote, urlsplit


class ArticleAudio(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.stack, self.audio, self.spotify, self.links = [], [], [], []
        self.feed(source)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag not in {'img', 'source', 'br', 'hr', 'meta', 'link', 'input', 'param', 'embed', 'wbr'}:
            self.stack.append((tag, 'entry-content' in attrs.get('class', '').split()))
        if not any(active for _, active in self.stack):
            return
        if tag == 'audio':
            self.audio.append(unquote(attrs.get('src', '')))
        if tag == 'iframe':
            self.spotify.append(attrs)
        if tag == 'a':
            self.links.append(attrs.get('href', ''))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break


def validate(directory, records, base_url='https://preview.test/'):
    directory = Path(directory).resolve()
    prefix = urlsplit(base_url).path.rstrip('/')
    errors, articles = [], defaultdict(list)
    if (directory / 'wp-content/uploads/2011/dotclear/son/dewplayer.swf').exists():
        errors.append('Obsolete Dewplayer file remains in public output')
    for record in records:
        articles[record['article_url']].append(record['replacement'])
    for article, replacements in articles.items():
        path = directory / article.lstrip('/') / 'index.html'
        if not path.resolve().is_relative_to(directory) or not path.is_file():
            errors.append('Missing audio article: ' + article)
            continue
        source = path.read_text()
        media = ArticleAudio(source)
        local = [item for item in replacements if item['kind'] == 'local']
        spotify = [item for item in replacements if item['kind'] == 'spotify']
        if any(item['kind'] not in {'local', 'spotify', 'unavailable'} for item in replacements):
            errors.append('Unresolved audio replacement: ' + article)
        if 'dewplayer' in source.lower():
            errors.append('Legacy Dewplayer remains in article: ' + article)
        if media.audio != [prefix + item['src'] for item in local]:
            errors.append('Local audio associations differ: ' + article)
        for item in local:
            target = directory / item['src'].lstrip('/')
            if not target.resolve().is_relative_to(directory) or not target.is_file() or \
                    hashlib.sha256(target.read_bytes()).hexdigest() != item['sha256'] or target.stat().st_size != item['bytes']:
                errors.append('Local audio payload differs: ' + article)
        expected = ['https://open.spotify.com/embed/track/' + item['track_id'] + '?theme=0' for item in spotify]
        if [player.get('src') for player in media.spotify] != expected:
            errors.append('Spotify associations differ: ' + article)
        for item, player in zip(spotify, media.spotify):
            if player.get('width') != '100%' or player.get('height') != '152' or \
                    player.get('title') != item['title'] + ' — Spotify' or \
                    not {'encrypted-media', 'fullscreen'}.issubset(player.get('allow', '').split('; ')) or \
                    'https://open.spotify.com/track/' + item['track_id'] not in media.links:
                errors.append('Incomplete Spotify player or fallback: ' + article)
        for item in replacements:
            if item['kind'] == 'unavailable' and item['message'] not in source:
                errors.append('Missing unavailable-audio notice: ' + article)
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', type=Path, required=True)
    parser.add_argument('--base-url', default='https://blog.overstep.fr/')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    evidence = json.loads((root / 'docs/article-audio-recovery.json').read_text())
    if len(evidence['associations']) != evidence['expected_associations']:
        raise SystemExit('Incomplete reviewed Dewplayer association inventory')
    errors = validate(args.directory, evidence['associations'], args.base_url)
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f"Validated {len(evidence['associations'])} reviewed article audio associations.")


if __name__ == '__main__':
    main()
