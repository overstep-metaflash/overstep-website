"""Install maintained overrides, or verify that installed files match them."""

import argparse
import shutil
from pathlib import Path

BLOG = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    mismatches = []
    for source in sorted((BLOG / 'theme-overrides').rglob('*')):
        if not source.is_file():
            continue
        target = BLOG / source.relative_to(BLOG / 'theme-overrides')
        if not target.exists() or target.read_bytes() != source.read_bytes():
            if args.check:
                mismatches.append(str(source.relative_to(BLOG / 'theme-overrides')))
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, target)
    if mismatches:
        raise SystemExit('Theme drift: ' + ', '.join(mismatches))
    print('Maintained theme overrides are synchronized.')


if __name__ == '__main__':
    main()
