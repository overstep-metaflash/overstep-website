# Native sidebar totem

The owner requested publishing the native replacement on 2026-11-17 while keeping
the original SWF in the public repository. The sidebar now uses Canvas 2D, SVG
links and Web Audio. Article and historical Metaflash animations retain Ruffle.

## Preservation and implementation

Both maintained and installed `theme/step/menu.swf` files are unchanged, SHA-256
`eb3fb39dbec9e956f2a0e6b294c1d2a0aeacbfb594da07c9e41e11607c0f3735`.
The existing public movie path is retained but is no longer requested by the
sidebar. JPEXS 26.5.0 recovered 125 shapes, 35 morphs, 32 clips and nine buttons.
The renderer preserves drawing order, transforms, 30 fps sampling, stops,
intro/ending loops, independent child ages and clip continuity across states.
Eight destinations remain real, keyboard-accessible same-tab links; the ninth
interaction animates the upper character. Static artwork and links remain when
JavaScript is unavailable.

Twelve original MP3 effects, 288,236 bytes in total, were extracted without
re-encoding. Public hashes, source sample/seek information and events are in
`theme/step/totem/audio.json`. The owner-approved public MP3 inventory increases
from 52 to 64; no excluded historical radio track was imported. A small `Son`
button enables audio after a gesture. Finite loops, stops, envelopes and the
three additional sprite-start sounds are preserved. Hidden mobile navigation is
not animated; hidden pages pause drawing and stop sound. Page exit cleans timers
and input handlers, including when browser history restores the document later.

Maintained files live under `theme-overrides/`: the `native-totem.html` partial,
`totem-renderer.js`, `totem-audio.js`, `native-totem.js`, and the public sound assets
under `theme/step/totem/`. Synchronize with `scripts/sync_theme.py`. The unminified
JPEXS helper and modifications are published with attribution and its GPL license.
No executable, private backup or ignored extraction cache is needed in CI.

For deliberate regeneration, `scripts/generate_native_totem.py --extraction PATH`
accepts the reviewed local extraction. It pins the source SWF and MP3 hashes,
removes exporter UI and dynamic eval, scopes drawing dispatch and prunes unused
SVG definitions. Gradient dependencies are retained: omitting them affected
browser hit testing. `docs/native-totem.json` pins generated asset hashes.

## Verification

All **133 Python and 44 JavaScript tests passed**. New fixtures cover real Hugo
rendering at root/project prefixes, source/audio hashes, SVG dependency closure,
clip timing and identity, audio races, pointer/focus transitions, mobile startup
and history cleanup. The native output validator checks all 1,415 pages with
the sidebar, every destination, prefix handling and original/generated hashes.

Both builds retain 491 historical content pages, 2,639 comments, 124 recovered
article Flash associations, four restored article images, 278 historical
Metaflash files and the 805-notice catalogue. Existing output validators pass.

After the MCP transport disconnected, isolated headless Google Chrome completed
**42 real same-tab navigations**: seven destinations from home, an article and a
category archive, at both base paths. Contact emitted the expected mailto in all
six contexts; it was intercepted without launching a mail client or sending mail.

All nine hover animations ran at both prefixes with native audio enabled and no
decoder diagnostics. Keyboard traversal, decorative Enter, browser history and
390-pixel mobile overflow/startup were checked. The Radio page has no Ruffle
player; article players remain intact. No sidebar `menu.swf` request or uncaught
JavaScript error occurred. Finer cross-browser frame equivalence and audible
MP3 padding/loop assessment remain separate acceptance topics.

## Publication scope

The owner explicitly authorized publication. Existing Pages/media release gates
remain unchanged. The SWF remains tracked and public. Personal/admin media stay
local. No DNS or repository visibility setting changed.
