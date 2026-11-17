"""Generate the reviewed public catalogue without private backups or caches."""
import argparse
import json
from pathlib import Path

from media_archive import build_archive, sha256


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    static = root / 'static'
    data = json.loads((root / 'data/media_archive.json').read_text())
    audit = root / data['source_audit']['path']
    if not audit.resolve().is_relative_to(root / 'docs') or sha256(audit.read_bytes()) != data['source_audit']['sha256']:
        raise SystemExit('Source audit differs from the reviewed catalogue input')

    def read_bytes(path):
        source = (static / path.lstrip('/')).resolve()
        if not source.is_relative_to(static):
            raise ValueError('Public source escapes the static directory')
        return source.read_bytes()

    navigation = json.loads((static / 'metaflash/navigation.json').read_text())
    navigation += json.loads((static / 'theme/step/menu-links.json').read_text())
    output, evidence = build_archive(data, read_bytes, navigation)
    changes = 0
    for name, raw in output.items():
        path = static / 'archives/metaflash' / name
        if not path.is_file() or path.read_bytes() != raw:
            changes += 1
            if args.apply:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(raw)
    report = root / 'docs/media-archive.json'
    raw = (json.dumps(evidence, ensure_ascii=False, indent=2) + '\n').encode()
    if not report.is_file() or report.read_bytes() != raw:
        changes += 1
        if args.apply:
            report.write_bytes(raw)
    print(f"{'Wrote' if args.apply else 'Planned'} {changes} changes for {evidence['notices']} notices and {len(evidence['source_paths'])} existing media paths.")


if __name__ == '__main__':
    main()
