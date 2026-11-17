"""Prepare reviewed FTP media while keeping private material outside public output."""
from collections import defaultdict
import hashlib
from io import BytesIO
from pathlib import PurePosixPath

from PIL import Image, ImageOps

from embed_flash_pages import movie_dimensions


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def source_id(path):
    return digest(path.encode())[:16]


def strip_jpeg_metadata(raw):
    """Remove EXIF/XMP/IPTC/comments, preserving JPEG scan data and color profiles."""
    if not raw.startswith(b'\xff\xd8'):
        raise ValueError('Expected a real JPEG payload')
    with Image.open(BytesIO(raw)) as image:
        if image.getexif().get(274, 1) != 1:
            output = BytesIO()
            ImageOps.exif_transpose(image).convert('RGB').save(output, 'JPEG', quality=95)
            return output.getvalue()
    clean, offset = bytearray(raw[:2]), 2
    while offset < len(raw):
        start = offset
        if raw[offset] != 255:
            raise ValueError('Invalid JPEG marker')
        while offset < len(raw) and raw[offset] == 255:
            offset += 1
        if offset >= len(raw):
            raise ValueError('Incomplete JPEG marker')
        marker = raw[offset]
        offset += 1
        if marker in {0xDA, 0xD9}:
            clean.extend(raw[start:])
            return bytes(clean)
        size = int.from_bytes(raw[offset:offset+2], 'big')
        if size < 2 or offset + size > len(raw):
            raise ValueError('Invalid JPEG segment length')
        if marker not in {0xE1, 0xED, 0xFE}:
            clean.extend(raw[start:offset+size])
        offset += size
    raise ValueError('JPEG scan data is missing')


def compile_batch(records, read_bytes, review):
    payloads, identifiers = defaultdict(list), set()
    for record in records:
        source = record['source']
        path = PurePosixPath(source)
        if path.is_absolute() or any(part in {'..', '.'} for part in source.split('/')) or '\\' in source or '\0' in source:
            raise ValueError('Unsafe source media path')
        identifier = source_id(source)
        if identifier in identifiers or identifier not in review or review[identifier]['decision'] not in {'include', 'private'}:
            raise ValueError('Every source path needs a unique explicit review decision')
        identifiers.add(identifier)
        raw = read_bytes(source)
        if len(raw) != int(record['bytes']) or digest(raw) != record['sha256']:
            raise ValueError('Source differs from the audited file variant')
        if record['kind'] not in {'image', 'swf'}:
            raise ValueError('Unsupported media kind')
        payloads[record['sha256']].append((record, review[identifier], raw))
    entries, output, coverage = {}, {}, []
    for source_hash, aliases in sorted(payloads.items()):
        if any(decision['decision'] == 'private' for _, decision, _ in aliases):
            coverage.extend({'source_id':source_id(record['source']), 'kind':record['kind'], 'status':'private'}
                            for record, _, _ in aliases)
            continue
        record, decision, raw = aliases[0]
        kind = record['kind']
        if any(item['kind'] != kind for item, _, _ in aliases):
            raise ValueError('A payload has conflicting media kinds')
        if kind == 'image':
            with Image.open(BytesIO(raw)) as image:
                width, height = image.size
                extension = {'JPEG':'.jpg', 'PNG':'.png', 'GIF':'.gif'}[image.format]
            public = strip_jpeg_metadata(raw) if extension == '.jpg' else raw
        else:
            width, height = movie_dimensions(raw)
            extension, public = '.swf', raw
            if not 0 < width <= 10000 or not 0 < height <= 10000:
                raise ValueError('Invalid original SWF dimensions')
        path = '/archives/metaflash/media/' + source_hash + extension
        output[path] = public
        key = ':'.join((kind, decision['collection'], decision['group']))
        identifier = digest(('ftp:' + key).encode())[:16]
        entry = entries.setdefault(key, {'id':identifier, 'title':decision['title'], 'kind':kind,
            'collection':decision['collection'], 'related_articles':[],
            'note':'Fichiers conservés de la collection Metaflash.', 'assets':[]})
        asset = {'path':path, 'sha256':digest(public), 'bytes':len(public), 'width':width, 'height':height,
                 'label':record['source'], 'aliases':[path], 'metadata_removed':public != raw,
                 'source_files':[{'path':item['source'], 'sha256':source_hash, 'bytes':int(item['bytes'])} for item, _, _ in aliases]}
        if public != raw:
            asset['download_label'] = 'Télécharger la version sans métadonnées'
        entry['assets'].append(asset)
        coverage.extend({'source_id':source_id(item['source']), 'source':item['source'], 'kind':kind,
                         'source_sha256':source_hash, 'source_bytes':int(item['bytes']),
                         'status':'included', 'asset_path':path, 'notice_id':identifier} for item, _, _ in aliases)
    for entry in entries.values():
        entry['assets'].sort(key=lambda asset:asset['label'].casefold())
    return sorted(entries.values(), key=lambda entry:(entry['collection'],entry['title'].casefold())), output, sorted(coverage,key=lambda row:row['source_id'])


def verify_coverage(entries, evidence, decisions):
    """Verify all source decisions using public-safe evidence, without backups."""
    errors = []
    records = evidence['coverage']
    ids = [row['source_id'] for row in records]
    if len(ids) != evidence['source_paths'] or len(set(ids)) != len(ids) or set(ids) != set(decisions):
        errors.append('FTP source coverage differs from the complete reviewed inventory')
    associations = {}
    for entry in entries:
        for asset in entry['assets']:
            for source in asset.get('source_files',[]):
                identifier = source_id(source['path'])
                if identifier in associations or decisions.get(identifier,{}).get('decision') != 'include':
                    errors.append('FTP source has an unreviewed or duplicate public association')
                associations[identifier] = (entry['id'],asset['path'],source['path'],source['sha256'],source['bytes'])
    for row in records:
        if row['status']=='private':
            if set(row) != {'source_id','kind','status'} or row['source_id'] in associations:
                errors.append('Private FTP source details leaked into public catalogue evidence')
        elif row['status']=='included':
            expected = (row['notice_id'],row['asset_path'],row['source'],row['source_sha256'],row['source_bytes'])
            if associations.get(row['source_id']) != expected:
                errors.append('FTP source-to-notice association differs from reviewed evidence')
        else:
            errors.append('Unresolved FTP source decision')
    if set(associations) != {row['source_id'] for row in records if row['status']=='included'}:
        errors.append('FTP source associations and inventory membership differ')
    return errors
