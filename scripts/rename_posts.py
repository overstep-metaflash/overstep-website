"""Name public articles YYYY-MM-DD-slug.md without changing their contents."""

import argparse
import unicodedata
from datetime import date
from pathlib import Path
from urllib.parse import unquote, urlsplit

from prepare_release import read_markdown


def rename_posts(directory):
    plan, names = [], set()
    for source in sorted(directory.glob('*.md')):
        metadata, _ = read_markdown(source)
        day = date.fromisoformat(str(metadata['wordpress_display_date'])).isoformat()
        slug = unquote(urlsplit(metadata['url']).path.rstrip('/').rsplit('/', 1)[-1])
        if not slug or slug in {'.', '..'} or any(c in slug for c in '/\\\0'):
            raise ValueError('Invalid original URL slug: ' + source.name)
        name = day + '-' + slug + '.md'
        key = unicodedata.normalize('NFC', name).casefold()
        if key in names:
            raise ValueError('Duplicate destination filename: ' + name)
        names.add(key)
        destination = directory / name
        if destination.exists() and not destination.samefile(source):
            raise ValueError('Destination already exists: ' + name)
        if source.name != name:
            plan.append((source, destination))
    for source, destination in plan:
        source.rename(destination)
    return len(plan)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--posts', type=Path, default=Path(__file__).resolve().parents[1] / 'content/posts')
    args = parser.parse_args()
    print(f'Renamed {rename_posts(args.posts)} article files.')
