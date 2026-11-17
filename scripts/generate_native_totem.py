"""Promote reviewed JPEXS menu exports to self-contained native web assets."""
import argparse
import copy
import hashlib
import json
import re
import shutil
from pathlib import Path
import xml.etree.ElementTree as ET

BLOG = Path(__file__).resolve().parents[1]
SVG = 'http://www.w3.org/2000/svg'
XLINK = 'http://www.w3.org/1999/xlink'
FFDEC = 'https://www.free-decompiler.com/flash'
SOURCE_HASH = 'eb3fb39dbec9e956f2a0e6b294c1d2a0aeacbfb594da07c9e41e11607c0f3735'
BUTTONS = [19, 46, 52, 68, 79, 93, 103, 150, 213]
ET.register_namespace('', SVG)
ET.register_namespace('xlink', XLINK)


def references(element):
    found = set()
    for node in element.iter():
        for key, value in node.attrib.items():
            if key.rsplit('}', 1)[-1] == 'href' and value.startswith('#'):
                found.add(value[1:])
            found.update(re.findall(r'url\(#([^)]*)\)', value))
    return found


def reachable_definitions(definitions, initial):
    """Retain only the source geometry used by the nine hit regions."""
    by_id = {node.get('id'): node for node in definitions if node.get('id')}
    found, pending = set(), list(initial)
    while pending:
        key = pending.pop()
        if key in found:
            continue
        if key not in by_id:
            raise ValueError('Missing SVG definition: ' + key)
        found.add(key)
        pending.extend(references(by_id[key]) - found)
    return found


def navigation_partial(source, routes):
    original = ET.fromstring(source)
    definitions = original.find(f'{{{SVG}}}defs')
    by_id = {node.get('id'): node for node in definitions if node.get('id')}
    stage = original.find(f'{{{SVG}}}g')
    root = ET.Element(f'{{{SVG}}}svg', {'viewBox': '0 0 303 2280', 'width': '303', 'height': '2280',
        'class': 'totem-hitareas', 'role': 'group', 'aria-label': 'Navigation du totem'})
    for index, character_id in enumerate(BUTTONS):
        placed = next(node for node in stage if node.get(f'{{{FFDEC}}}characterId') == str(character_id))
        definition = by_id[placed.get(f'{{{XLINK}}}href')[1:]]
        hit = next(node for node in definition.iter() if 'button-frame-hittest' in node.get('class', '').split())
        route = routes[index] if index < len(routes) else None
        attrs = {'data-totem-button': str(character_id), 'tabindex': '0',
                 'aria-label': route['label'] if route else 'Animer le personnage'}
        if route:
            attrs['href'] = 'TOTEM_URL_' + str(character_id)
        else:
            attrs['role'] = 'button'
        control = ET.SubElement(root, f'{{{SVG}}}' + ('a' if route else 'g'), attrs)
        ET.SubElement(control, f'{{{SVG}}}title').text = attrs['aria-label']
        geometry = ET.SubElement(control, f'{{{SVG}}}g', {'transform': placed.get('transform')})
        for node in hit:
            geometry.append(copy.deepcopy(node))
    needed = reachable_definitions(definitions, references(root))
    retained = ET.SubElement(root, f'{{{SVG}}}defs')
    for key in sorted(needed):
        retained.append(copy.deepcopy(by_id[key]))
    for node in root.iter():
        for key in list(node.attrib):
            if key.startswith('{' + FFDEC + '}'):
                del node.attrib[key]
            elif key == 'id':
                node.set(key, 'totem-' + node.get(key))
            elif key.rsplit('}', 1)[-1] == 'href' and node.get(key).startswith('#'):
                node.set(key, '#totem-' + node.get(key)[1:])
            elif 'url(#' in node.get(key):
                node.set(key, node.get(key).replace('url(#', 'url(#totem-'))
    art = ET.tostring(root, encoding='unicode')
    for character_id, route in zip(BUTTONS, routes):
        destination = route['destination']
        target = '{{ "' + destination.lstrip('/') + '" | relURL }}' if destination.startswith('/') else destination
        art = art.replace('TOTEM_URL_' + str(character_id), target)
    return '''<nav class="sidebar-totem native-totem" aria-label="Menu artistique Step" data-totem
  data-audio-manifest="{{ "theme/step/totem/audio.json" | relURL }}">
  <div class="totem-art">
    <img class="totem-fallback" src="{{ "theme/step/menu.png" | relURL }}" alt="" width="303" height="2280">
    <canvas width="303" height="2280" aria-hidden="true"></canvas>
''' + art + '''
  </div>
  <button class="totem-sound" type="button" aria-pressed="false" aria-label="Activer les sons du totem" title="Activer les sons du totem" hidden>Son</button>
  <span class="visually-hidden" role="status" data-totem-status></span>
</nav>
'''


def renderer_source(proof, helper):
    """Scope exported drawing code and replace eval dispatch with a fixed registry."""
    body = re.search(r'<script>(var canvas=.*?)</script>', proof, re.S)[1]
    drawing = body[:body.index('var paused = false;')]
    drawing = re.sub(r'^var canvas=document.getElementById\("myCanvas"\);\s*', '', drawing)
    drawing = drawing.replace('window.setInterval(function(){if(!paused)nextFrame(ctx,ctrans);},1000/30);', '')
    names = re.findall(r'^function ((?:shape|morphshape|sprite|button|font|text)\d+)\(', drawing, re.M)
    registry = 'const characters = {' + ','.join(name + ':' + name for name in names) + '};\n'
    custom = body[body.index('var paused = false;'):body.index("document.getElementById('preview')")]
    custom = custom.replace("window['sprite' + id]", "characters['sprite' + id]")
    custom = custom.replace("window['button' + id]", "characters['button' + id]")
    custom = custom.replace('window.StepTotemPreview = {', 'const api = {')
    helper = helper.replace('Filters = {};', 'var Filters = {};')
    helper = re.sub(r"window\.addEventListener\('load'.*?(?=function drawMorphPath)", '', helper, flags=re.S)
    helper = helper.replace('eval(obj + "(ctx,new cxform(0,0,0,0,255,255,255,255),frame,ratio,time);");',
                            'characters[obj](ctx,new cxform(0,0,0,0,255,255,255,255),frame,ratio,time);')
    helper = helper.replace('eval(obj + "(ctx,ctrans,frame,ratio,time);");', 'characters[obj](ctx,ctrans,frame,ratio,time);')
    if 'eval(' in helper or 'window[' in custom or 'document.getElementById' in drawing + helper:
        raise ValueError('Unexpected exporter dependency; review the input before promotion')
    return '''/* Original Step artwork, recovered from menu.swf with JPEXS 26.5.0.
 * Drawing helper derived from JPEXS; see theme/step/totem/NOTICE.txt and COPYING.
 * Adapted to a scoped native renderer with reviewed timeline controls. */
window.StepTotemRenderer = function(canvas) {
var defaultFill;
''' + helper + '\n' + drawing + '\n' + registry + '\n/* Native timeline controller. */\n' + custom + '''
/* Native scheduler and lifecycle. */
nextFrame(ctx,ctrans);
const timer = window.setInterval(function(){if(!paused)nextFrame(ctx,ctrans);},1000/30);
api.destroy = function(){paused=true;window.clearInterval(timer);soundHandler=null;};
return api;
};
'''


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--extraction', type=Path, required=True)
    args = parser.parse_args()
    source = BLOG / 'theme-overrides/static/theme/step/menu.swf'
    if hashlib.sha256(source.read_bytes()).hexdigest() != SOURCE_HASH:
        raise SystemExit('Unreviewed source movie')
    inputs = args.extraction.resolve()
    assets = BLOG / 'theme-overrides/static/theme/step/totem'
    assets.mkdir(parents=True, exist_ok=True)
    js = BLOG / 'theme-overrides/static/js'
    routes = json.loads((BLOG / 'theme-overrides/static/theme/step/menu-links.json').read_text())
    partial = navigation_partial((inputs / 'vectors/transparent-frames/2.svg').read_text(), routes)
    (BLOG / 'theme-overrides/layouts/partials/native-totem.html').write_text(partial)
    renderer = renderer_source((inputs / 'vectors/canvas/proof.html').read_text(), (inputs / 'vectors/canvas/canvas.js').read_text())
    (js / 'totem-renderer.js').write_text(renderer)
    audio = json.loads((inputs / 'audio/audio-manifest.json').read_text())
    fields = ('sound_id', 'codec', 'sample_rate', 'channels', 'sample_count', 'seek_samples', 'mp3_sha256', 'file')
    public = {'source_sha256': SOURCE_HASH, 'sounds': [], 'buttons': audio['buttons']}
    rights_path = BLOG / 'docs/media-rights.json'
    rights = json.loads(rights_path.read_text())
    rights['audio_files'] = [entry for entry in rights['audio_files'] if not entry['path'].startswith('/theme/step/totem/')]
    for sound in audio['sounds']:
        entry = {key: sound[key] for key in fields}
        payload = (inputs / 'audio' / entry['file']).read_bytes()
        if hashlib.sha256(payload).hexdigest() != entry['mp3_sha256']:
            raise ValueError('Extracted sound hash differs')
        entry['file'] = 'audio/' + str(entry['sound_id']) + '.mp3'
        target = assets / entry['file']
        target.parent.mkdir(exist_ok=True)
        target.write_bytes(payload)
        public['sounds'].append(entry)
        rights['audio_files'].append({'path': '/theme/step/totem/' + entry['file'], 'bytes': len(payload),
            'sha256': entry['mp3_sha256'], 'referencing_articles': [], 'redistribution_rights': 'confirmed_by_owner',
            'source': 'Original embedded sidebar menu effect; native replacement explicitly approved on 2026-11-17.'})
    (assets / 'audio.json').write_text(json.dumps(public, indent=2) + '\n')
    controller = (inputs / 'audio/totem-audio.js').read_text().replace('Native audio proof of concept', 'Native totem audio controller').replace('root.TotemAudio = api;', 'root.StepTotemAudio = api;')
    (js / 'totem-audio.js').write_text(controller)
    rights_path.write_text(json.dumps(rights, ensure_ascii=False, indent=2) + '\n')
    license_text = (inputs / 'vectors/ffdec/license.txt').read_text()
    (assets / 'COPYING').write_text('\n'.join(line.rstrip() for line in license_text.splitlines()) + '\n')
    (assets / 'NOTICE.txt').write_text('Native Step totem\n\nOriginal artwork and sound: Step / Overstep.\nSource movie retained at ../menu.swf.\n\nCanvas drawing helper derived from JPEXS Free Flash Decompiler 26.5.0.\nUpstream: https://github.com/jindrapetrik/jpexs-decompiler\nThe helper is distributed with its GNU GPL version 3 license in COPYING.\nModifications: scoped dispatch without eval, reviewed timeline controls and lifecycle.\nThis directory and the public repository contain the unminified corresponding code.\n')
    files = [BLOG / 'theme-overrides/layouts/partials/native-totem.html', js / 'totem-renderer.js', js / 'totem-audio.js', js / 'native-totem.js'] + sorted(p for p in assets.rglob('*') if p.is_file())
    manifest = {'source': '/theme/step/menu.swf', 'source_sha256': SOURCE_HASH, 'generator': 'JPEXS 26.5.0 and scripts/generate_native_totem.py',
                'buttons': BUTTONS, 'files': {p.relative_to(BLOG / 'theme-overrides').as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in files}}
    (BLOG / 'docs/native-totem.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Generated native totem: {len(partial)} bytes of navigation, {len(public["sounds"])} original effects.')


if __name__ == '__main__':
    main()
