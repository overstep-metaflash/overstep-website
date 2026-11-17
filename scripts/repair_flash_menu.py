"""Repair reviewed GetURL targets without changing the Flash menu artwork."""

import argparse
import json
import struct
import zlib
from pathlib import Path


def swf_tags(movie):
    if movie[:3] not in {b'FWS', b'CWS'}:
        raise ValueError('Expected an FWS or CWS movie')
    body = zlib.decompress(movie[8:]) if movie[:3] == b'CWS' else movie[8:]
    if len(body) + 8 != struct.unpack_from('<I', movie, 4)[0]:
        raise ValueError('SWF length differs')
    offset = (5 + (body[0] >> 3) * 4 + 7) // 8 + 4
    frame_header = body[:offset]
    tags = []
    while offset < len(body):
        start = offset
        value = struct.unpack_from('<H', body, offset)[0]
        offset += 2
        size = value & 63
        if size == 63:
            size = struct.unpack_from('<I', body, offset)[0]
            offset += 4
        data = body[offset:offset + size]
        if len(data) != size:
            raise ValueError('Truncated SWF tag')
        tags.append((value >> 6, data, body[start:offset]))
        offset += size
    return frame_header, tags


def repair_actions(actions, reviewed_urls, allow_non_navigation=False, url_replacements=None):
    """Repair GetURL/End lists; optionally retain reviewed frame/play/stop actions."""
    result = bytearray()
    links = []
    offset = 0
    while offset < len(actions):
        opcode = actions[offset]
        offset += 1
        if opcode == 0:
            if offset != len(actions):
                raise ValueError('Unexpected bytes after ActionEnd')
            result.append(0)
            break
        if allow_non_navigation and opcode in {0x06, 0x07}:
            result.append(opcode)
            continue
        if allow_non_navigation and opcode == 0x81:
            if actions[offset:offset + 2] != b'\x02\0' or offset + 4 > len(actions):
                raise ValueError('Malformed ActionGotoFrame')
            result.extend(bytes([opcode]) + actions[offset:offset + 4])
            offset += 4
            continue
        if opcode != 0x83:
            raise ValueError('Unexpected menu action; review before changing action offsets')
        size = struct.unpack_from('<H', actions, offset)[0]
        offset += 2
        data = actions[offset:offset + size]
        offset += size
        fields = data.split(b'\0')
        if len(fields) != 3 or fields[-1] or len(data) != size:
            raise ValueError('Malformed ActionGetURL')
        url, target = (field.decode('ascii') for field in fields[:2])
        replacements = url_replacements or {}
        original = next((source for source, destination in replacements.items() if destination == url), url)
        if original not in reviewed_urls:
            raise ValueError('Unreviewed menu URL: ' + url)
        if target not in {'_parent', '_self', '_top', '', '_blank'}:
            raise ValueError('Unreviewed menu target: ' + target)
        # Ruffle rejects current-tab targets when script access is disabled.
        destination = replacements.get(original, original)
        if '\0' in destination:
            raise ValueError('Invalid replacement menu URL')
        data = destination.encode('ascii') + b'\0_blank\0'
        result.extend(b'\x83' + struct.pack('<H', len(data)) + data)
        links.append((original, '_blank'))
    return bytes(result), links


def repair_menu(movie, reviewed_urls, allow_non_navigation=False, url_replacements=None):
    if not set(url_replacements or {}) <= set(reviewed_urls):
        raise ValueError('Unreviewed replacement menu URL')
    frame_header, tags = swf_tags(movie)
    result = bytearray(frame_header)
    links = []
    for code, data, header in tags:
        updated = data
        if code == 34:  # DefineButton2; character records end at ActionOffset.
            action_offset = struct.unpack_from('<H', data, 3)[0]
            if action_offset:
                offset = 3 + action_offset
                updated = bytearray(data[:offset])
                while offset < len(data):
                    size = struct.unpack_from('<H', data, offset)[0]
                    end = offset + size if size else len(data)
                    if (size and size < 4) or end > len(data):
                        raise ValueError('Malformed ButtonCondAction')
                    actions, found = repair_actions(data[offset + 4:end], reviewed_urls, allow_non_navigation, url_replacements)
                    links.extend(found)
                    updated.extend(struct.pack('<H', len(actions) + 4 if size else 0))
                    updated.extend(data[offset + 2:offset + 4])  # Original event flags.
                    updated.extend(actions)
                    offset = end
                updated = bytes(updated)
        if updated != data:
            if len(header) == 6 or len(updated) >= 63:
                header = struct.pack('<HI', (code << 6) | 63, len(updated))
            else:
                header = struct.pack('<H', (code << 6) | len(updated))
        result.extend(header + updated)
    if {url for url, _ in links} != set(reviewed_urls) or len(links) != len(reviewed_urls):
        raise ValueError('Menu action inventory differs from reviewed URLs')
    body = bytes(result)
    header = movie[:4] + struct.pack('<I', len(body) + 8)
    return header + (zlib.compress(body) if movie[:3] == b'CWS' else body), links


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--destination', type=Path, required=True)
    args = parser.parse_args()
    site = Path(__file__).resolve().parents[1]
    urls = {item['legacy'] for item in json.loads((site / 'theme-overrides/static/theme/step/menu-links.json').read_text())}
    movie, links = repair_menu(args.source.read_bytes(), urls)
    args.destination.write_bytes(movie)
    print(f'Repaired {len(links)} reviewed menu actions; artwork tags preserved.')


if __name__ == '__main__':
    main()
