# Same-tab Flash menu navigation

Reviewed on 2026-11-16 after the owner reported silent menu clicks on
`http://localhost:1313/` and requested navigation without opening another tab.

## Change

The existing SWF issues `_blank` GetURL actions because Ruffle 0.7.1 blocks
current-tab targets with script access disabled. Its reviewed binary and artwork
remain unchanged. The maintained player script now adapts exact menu destinations
to `window.location.assign`. This removes the new-window request for those links.

The adapter is installed once after loading the reviewed menu map. It accepts
the eight exact legacy URLs, their HTTPS variants, and the corresponding resolved
destinations. Only `_blank` requests to those addresses change behavior. Other
`window.open` calls retain their arguments and original return value. This is a
page-level adapter: any caller requesting one of these exact menu destinations
with `_blank` receives the same-tab behavior. Article players receive no menu
rewrite rules, and `allowScriptAccess` remains false for every player.

Both the script and menu references use `?v=2` to invalidate older cached copies
while preserving the public asset paths. The map and destinations are unchanged.
Contact retains its original mailto action; no email is sent.

## Evidence and validation

Before the change, Chrome could open a reviewed menu destination in a new tab.
The owner's silent-click symptom was not reproduced in that test browser, so a
popup blocker is a possible explanation rather than a confirmed root cause.
The implemented change directly satisfies the subsequent same-tab requirement.

Ruffle documentation was retrieved through Context7 and checked against the
vendored 0.7.1 source maps and pinned
[navigation implementation](https://github.com/ruffle-rs/ruffle/blob/89a7049965f3090e706265670df309a5128233ac/web/src/navigator.rs).
Regression coverage checks all eight destinations in six contexts, preserving
script-access restrictions and delegation of unrelated window requests.

Chrome used real pointer clicks through transparent, non-intercepting diagnostic
markers at the actual SWF hit regions. No navigation function was called to
simulate a button action. Each page-navigation result was checked against the
actual final URL and title; the same browser tab remained in use.

| Starting page | Root | `/overstep-website/` |
| --- | --- | --- |
| Home | All 7 page destinations passed | All 7 passed |
| `/2006/02/11/sauvons-la-princesse/` | All 7 passed | All 7 passed |
| `/category/anim-flash/` | All 7 passed | All 7 passed |

The seven destinations are Illustrations, Animations Flash, Eros, 40 jours,
Photos, Galerie and Radio: **42 successful same-tab navigations**. Contact was
also activated in each of the six contexts and emitted the expected mailto URL.
That dispatch was intercepted only for this diagnostic check to avoid launching
a native mail client. Actual mail-client handling remains untested.

The root check used the Hugo preview on port 1313. The project-prefix check used
the complete production build, processed with `prepare_pages.py`, served only
from generated output on loopback port 1327. Diagnostic data is ignored under
`migration/cache/totem-debug/`. No production publication or DNS change occurred.

All 80 Python tests and 19 JavaScript tests passed. The same-tab assertions extend
the existing player tests; the original SWF repair/idempotence tests still pass.
This review does not establish Spotify audio playback, recording/version approval,
other browsers' behavior, or completion of the separate article-media checks.
