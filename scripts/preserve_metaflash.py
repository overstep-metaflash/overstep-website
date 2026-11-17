"""Create and verify a private, read-only snapshot of the complete FTP tree."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import stat
import tarfile


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def inventory(source):
    records = []
    for path in sorted(source.rglob('*')):
        if path.is_symlink():
            raise ValueError('Symlink inputs require an explicit preservation decision')
        if not path.is_file():
            continue
        before = path.stat()
        raw = path.read_bytes()
        after = path.stat()
        if (before.st_size, before.st_mtime_ns) != (after.st_size, after.st_mtime_ns):
            raise ValueError('Source changed during inventory')
        records.append({'path': path.relative_to(source).as_posix(), 'bytes': len(raw),
                        'sha256': digest(raw), 'mtime_ns': before.st_mtime_ns,
                        'mode': stat.S_IMODE(before.st_mode)})
    return records


def verify_package(directory):
    directory = Path(directory)
    receipt = json.loads((directory / 'receipt.json').read_text())
    archive = directory / receipt['archive']
    if digest(archive.read_bytes()) != receipt['archive_sha256']:
        raise ValueError('Preservation archive checksum mismatch')
    records = json.loads((directory / 'inventory.json').read_text())
    if digest((directory / 'inventory.json').read_bytes()) != receipt['inventory_sha256']:
        raise ValueError('Preservation inventory checksum mismatch')
    with tarfile.open(archive, 'r:gz') as stream:
        members = {member.name: member for member in stream.getmembers() if member.isfile()}
        if set(members) != {'metaflash/' + row['path'] for row in records}:
            raise ValueError('Preservation archive membership differs')
        for row in records:
            with stream.extractfile(members['metaflash/' + row['path']]) as item:
                if digest(item.read()) != row['sha256']:
                    raise ValueError('Preserved payload mismatch')
    return receipt


def preserve(source, destination):
    source, destination = Path(source).resolve(), Path(destination).resolve()
    if destination.is_relative_to(source):
        raise ValueError('The preservation destination must be outside the source tree')
    records = inventory(source)
    encoded = (json.dumps(records, ensure_ascii=False, indent=2) + '\n').encode()
    if (destination / 'receipt.json').exists():
        previous = verify_package(destination)
        if previous['inventory_sha256'] != digest(encoded):
            raise ValueError('Source changed; create a new dated snapshot instead of overwriting')
        return previous
    destination.mkdir(parents=True, exist_ok=True)
    archive = destination / 'metaflash-master.tar.gz'
    if archive.exists() or (destination / 'inventory.json').exists():
        raise ValueError('Destination contains an incomplete snapshot; use a new empty directory')
    with archive.open('xb') as output:
        with tarfile.open(fileobj=output, mode='w:gz', format=tarfile.PAX_FORMAT) as stream:
            for row in records:
                raw = (source / row['path']).read_bytes()
                if digest(raw) != row['sha256']:
                    raise ValueError('Source changed before preservation')
                member = tarfile.TarInfo('metaflash/' + row['path'])
                member.size, member.mode = len(raw), row['mode']
                member.mtime = row['mtime_ns'] / 1_000_000_000
                member.pax_headers['mtime'] = f"{row['mtime_ns'] // 1_000_000_000}.{row['mtime_ns'] % 1_000_000_000:09d}"
                stream.addfile(member, io.BytesIO(raw))
    if records != inventory(source):
        raise ValueError('Source changed during preservation')
    (destination / 'inventory.json').write_bytes(encoded)
    receipt = {'archive': archive.name, 'archive_sha256': digest(archive.read_bytes()),
               'inventory_sha256': digest(encoded), 'files': len(records),
               'source_bytes': sum(row['bytes'] for row in records),
               'archive_bytes': archive.stat().st_size}
    (destination / 'receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
    (destination / 'SHA256SUMS').write_text(receipt['archive_sha256'] + '  ' + archive.name + '\n' +
        receipt['inventory_sha256'] + '  inventory.json\n')
    return verify_package(destination)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--destination', type=Path, required=True)
    args = parser.parse_args()
    blog = Path(__file__).resolve().parents[1]
    if args.destination.resolve().is_relative_to(blog):
        raise SystemExit('Keep the private preservation package outside the public site repository')
    result = preserve(args.source, args.destination)
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
