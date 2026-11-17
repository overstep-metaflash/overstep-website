"""Prepare the reviewed FTP catalogue locally from an immutable source inventory."""
import argparse
import csv
import hashlib
import json
from pathlib import Path

from ftp_catalogue import compile_batch


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inventory',type=Path,required=True)
    parser.add_argument('--source-root',type=Path,required=True)
    parser.add_argument('--apply',action='store_true')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    review = json.loads((root / 'data/metaflash_ftp_review.json').read_text())
    if hashlib.sha256(args.inventory.read_bytes()).hexdigest() != review['source_inventory_sha256']:
        raise SystemExit('Source inventory differs from the reviewed 911-file batch')
    with args.inventory.open(encoding='utf-8-sig',newline='') as stream:
        records = list(csv.DictReader(stream,delimiter=';'))
    if len(records) != review['source_paths']:
        raise SystemExit('Incomplete FTP source inventory')
    source_root = args.source_root.resolve()
    before = {}

    def read_bytes(name):
        path = source_root / name
        if path.is_symlink() or not path.resolve().is_relative_to(source_root):
            raise ValueError('Source escapes the immutable media tree')
        stat = path.stat()
        raw = path.read_bytes()
        after = path.stat()
        if (stat.st_size,stat.st_mtime_ns) != (after.st_size,after.st_mtime_ns):
            raise ValueError('Source changed during catalogue preparation')
        before[name] = (stat.st_size,stat.st_mtime_ns)
        return raw

    entries, output, coverage = compile_batch(records,read_bytes,review['decisions'])
    catalogue_path = root / 'data/media_archive.json'
    catalogue = json.loads(catalogue_path.read_text())
    previous = set(catalogue.get('ftp_batch',{}).get('notice_ids',[]))
    catalogue['entries'] = [entry for entry in catalogue['entries'] if entry['id'] not in previous] + entries
    catalogue['reviewed_paths'] = sorted(asset['path'] for entry in catalogue['entries'] for asset in entry['assets'])
    catalogue['ftp_batch'] = {'source_paths':len(coverage),'included_paths':sum(row['status']=='included' for row in coverage),
        'private_paths':sum(row['status']=='private' for row in coverage),'public_payloads':len(output),
        'notice_ids':[entry['id'] for entry in entries]}
    evidence = {'date':'2026-11-17','source_inventory_sha256':review['source_inventory_sha256'],
        'review_sha256':hashlib.sha256((root/'data/metaflash_ftp_review.json').read_bytes()).hexdigest(),
        'source_paths':len(coverage),'public_payloads':len(output),'notices':len(entries),'coverage':coverage}
    changes = 0
    files = {root/'static'/name.lstrip('/'):raw for name,raw in output.items()}
    files[catalogue_path] = (json.dumps(catalogue,ensure_ascii=False,indent=2)+'\n').encode()
    files[root/'docs/metaflash-ftp-catalogue.json'] = (json.dumps(evidence,ensure_ascii=False,indent=2)+'\n').encode()
    for path, raw in files.items():
        if not path.is_file() or path.read_bytes() != raw:
            changes += 1
            if args.apply:
                path.parent.mkdir(parents=True,exist_ok=True)
                path.write_bytes(raw)
    for name, expected in before.items():
        stat = (source_root/name).stat()
        if (stat.st_size,stat.st_mtime_ns) != expected:
            raise ValueError('Source metadata changed during preparation')
    print(f"{'Wrote' if args.apply else 'Planned'} {changes} changes; {len(coverage)} source paths, "
          f"{len(entries)} new notices, {catalogue['ftp_batch']['private_paths']} paths held privately.")


if __name__=='__main__':
    main()
