"""Prefix legacy root-relative media URLs for a GitHub Pages project preview."""

import argparse
import re
from pathlib import Path
from urllib.parse import urlsplit


def prefix_html(source, prefix):
    prefix = '/' + prefix.strip('/') + '/' if prefix.strip('/') else '/'
    if prefix == '/':
        return source

    def replace(match):
        url = match[3]
        if url.startswith('//') or url.startswith(prefix):
            return match[0]
        return match[1] + match[2] + prefix.rstrip('/') + url + match[2]

    return re.sub(r'\b(href=|src=|poster=|data-swf=)([\'"])(/[^\'"]*)\2', replace, source)


def prefix_file(path, prefix):
    # Round-trip legacy HTML bytes without changing its declared character set.
    source = path.read_bytes().decode('utf-8', errors='surrogateescape')
    path.write_bytes(prefix_html(source, prefix).encode('utf-8', errors='surrogateescape'))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', type=Path, default=Path('public'))
    parser.add_argument('--base-url', required=True)
    args = parser.parse_args()
    prefix = urlsplit(args.base_url).path
    for path in args.directory.rglob('*.html'):
        prefix_file(path, prefix)
    print('Legacy HTML paths prepared for ' + args.base_url)


if __name__ == '__main__':
    main()
