"""Recover reviewed guestbook text without publishing private address metadata."""
import argparse
from datetime import datetime
import hashlib
import html
from html.parser import HTMLParser
import ipaddress
import json
from pathlib import Path
import re

ADDRESS = re.compile(r'(?<![\w.])(?:\d{1,3}\.){3}\d{1,3}(?![\d.])|'
                     r'(?<![\w:])(?:[0-9a-fA-F]{0,4}:){2,}[0-9a-fA-F:.]*(?:%[\w]+)?')
STAMP = re.compile(r'^(\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2})(?:\s|$)')
ENTRY_KEYS = {'source_index', 'author', 'date', 'display_date', 'body'}


def redact_addresses(text):
    def replace(match):
        value = match[0]
        # A prose full stop can follow an IPv6 address.
        address = value.rstrip('.') if ':' in value else value
        try:
            ipaddress.ip_address(address)
        except ValueError:
            return value
        return '[adresse IP retirée]' + value[len(address):]
    return ADDRESS.sub(replace, text)


def decode_guestbook(raw):
    """Preserve valid UTF-8 spans while decoding the few legacy CP1252 bytes."""
    text = raw.decode('utf-8-sig', errors='surrogateescape')
    return ''.join(bytes([ord(char) - 0xdc00]).decode('cp1252')
                   if 0xdc80 <= ord(char) <= 0xdcff else char for char in text)


def parse_entries(source):
    """Read only author, timestamp and body; never retain the address header."""
    class Entries(HTMLParser):
        def __init__(self):
            super().__init__()
            self.entries, self.parts, self.phase, self.blocked = [], None, 0, []

        def handle_starttag(self, tag, attrs):
            if tag in {'script', 'style', 'template', 'noscript'}:
                self.blocked.append(tag)
            if self.blocked:
                return
            if tag == 'p':
                if self.parts is not None:
                    raise ValueError('Nested guestbook entry requires review')
                self.parts, self.phase = [[], [], []], 0
            elif tag == 'br' and self.parts is not None:
                if self.phase < 2:
                    self.phase += 1
                else:
                    self.parts[2].append('\n')

        def handle_endtag(self, tag):
            if self.blocked:
                if tag == self.blocked[-1]:
                    self.blocked.pop()
                return
            if tag != 'p' or self.parts is None:
                return
            author, header, body = (''.join(parts).strip() for parts in self.parts)
            self.parts = None
            if re.fullmatch(r'© Free \d{4} - Tous droits réservés', author) and not header and not body:
                return
            match = STAMP.match(header)
            if not match:
                raise ValueError('Unrecognized guestbook timestamp; no entry was discarded')
            stamp = datetime.strptime(match[1], '%d-%m-%Y %H:%M:%S')
            self.entries.append({
                'source_index': len(self.entries) + 1,
                'author': redact_addresses(' '.join(author.split()) or 'Anonyme'),
                'date': stamp.isoformat(), 'display_date': match[1],
                'body': redact_addresses(re.sub(r'\n\s*\n+', '\n\n', body.replace('\r\n', '\n'))),
            })

        def handle_data(self, data):
            if self.parts is not None and not self.blocked:
                self.parts[self.phase].append(data)

    parser = Entries()
    parser.feed(source)
    parser.close()
    if parser.parts is not None or parser.blocked:
        raise ValueError('Incomplete guestbook markup requires review')
    return parser.entries


def is_empty(text):
    return not re.sub(r'[\s\u200b\u200c\u200d\ufeff]', '', text)


def build_archive(raw, review):
    digest = hashlib.sha256(raw).hexdigest()
    if digest != review['source']['sha256']:
        raise ValueError('Guestbook source changed; review the new source before importing')
    entries = parse_entries(decode_guestbook(raw))
    if len(entries) != review['source']['entries']:
        raise ValueError('Guestbook entry count differs from the reviewed inventory')
    spam = {int(identifier): reason for identifier, reason in review['spam'].items()}
    if not set(spam) <= {entry['source_index'] for entry in entries}:
        raise ValueError('Unknown reviewed spam entry')
    kept, empty, removed_spam = [], [], []
    anonymous = 0
    for entry in entries:
        identifier = entry['source_index']
        if is_empty(entry['body']):
            empty.append(identifier)
            anonymous += entry['author'].casefold() == 'anonyme'
        elif identifier in spam:
            removed_spam.append(identifier)
        else:
            kept.append(entry)
    if set(removed_spam) != set(spam):
        raise ValueError('Reviewed spam entry no longer contains its expected message')
    archive = {'source_sha256': digest, 'entries': kept}
    errors = validate_archive(archive)
    if errors:
        raise ValueError('; '.join(errors))
    report = {'source_sha256': digest, 'source_entries': len(entries), 'retained': len(kept),
              'removed_empty': len(empty), 'removed_empty_anonymous': anonymous,
              'removed_spam': len(removed_spam),
              'removed_indices': {'empty': empty, 'spam': removed_spam}}
    return archive, report


def validate_archive(archive):
    errors, seen = [], set()
    if set(archive) != {'source_sha256', 'entries'}:
        errors.append('Unexpected guestbook metadata')
    for entry in archive['entries']:
        if set(entry) != ENTRY_KEYS:
            errors.append('Unexpected guestbook entry metadata')
        if entry['source_index'] in seen or entry['source_index'] <= 0:
            errors.append('Invalid guestbook entry identifier')
        seen.add(entry['source_index'])
        if not entry['author'].strip() or is_empty(entry['body']):
            errors.append('Empty guestbook message')
        if redact_addresses(entry['author'] + '\n' + entry['body']) != entry['author'] + '\n' + entry['body']:
            errors.append('Guestbook address disclosure')
        try:
            stamp = datetime.strptime(entry['display_date'], '%d-%m-%Y %H:%M:%S')
            if stamp.isoformat() != entry['date']:
                errors.append('Guestbook date mismatch')
        except ValueError:
            errors.append('Invalid guestbook date')
    if [entry['source_index'] for entry in archive['entries']] != sorted(seen):
        errors.append('Guestbook source order changed')
    return errors


def render_guestbook(archive):
    errors = validate_archive(archive)
    if errors:
        raise ValueError('; '.join(errors))
    output = ['<section class="metaflash-guestbook"><h1>Livre d’or</h1>',
              '<p>Messages du livre d’or historique. Cette archive ne reçoit plus de nouveaux messages.</p>',
              f'<p>{len(archive["entries"])} messages conservés.</p>']
    for entry in archive['entries']:
        output.append(f'<article class="guestbook-entry" id="guestbook-entry-{entry["source_index"]}">')
        output.append('<header><h2>' + html.escape(entry['author']) + '</h2><time datetime="' +
                      entry['date'] + '">' + entry['display_date'] + '</time></header>')
        paragraphs = re.split(r'\n\s*\n', entry['body'])
        output.extend('<p>' + html.escape(paragraph).replace('\n', '<br>') + '</p>' for paragraph in paragraphs)
        output.append('</article>')
    output.append('</section>')
    return '\n'.join(output)


def validate_guestbook_html(source, archive):
    errors = validate_archive(archive)
    decoded = html.unescape(source)
    if redact_addresses(decoded) != decoded:
        errors.append('Guestbook HTML discloses an address')
    if render_guestbook(archive) not in source:
        errors.append('Guestbook rendered entries differ from the reviewed archive')
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    blog = Path(__file__).resolve().parents[1]
    review = json.loads((blog / 'docs/metaflash-guestbook-review.json').read_text())
    source = args.source or blog.parent / review['source']['file']
    archive, report = build_archive(source.read_bytes(), review)
    if args.apply:
        (blog / 'data/metaflash_guestbook.json').write_text(json.dumps(archive, ensure_ascii=False, indent=2) + '\n')
        (blog / 'docs/metaflash-guestbook-cleanup.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({key: value for key, value in report.items() if key != 'removed_indices'}, indent=2))


if __name__ == '__main__':
    main()
