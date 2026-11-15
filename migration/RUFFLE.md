# Ruffle integration and Hugo compatibility

Implemented on 2026-11-15 in the existing staging site.

## Changes

- Converted 37 legacy `[swf:...]` markers into Hugo `ruffle` shortcodes, preserving
  source paths and width/height values. Escaped brackets, smart quotes, positional
  dimensions, accented paths, and explicit fullscreen settings are supported.
- Added responsive player containers with preserved aspect ratios, deferred loading
  near the viewport, click-to-play behavior, a download fallback, and visible errors.
- Self-hosted Ruffle 0.7.1 JavaScript and WebAssembly, including upstream licenses.
  There is no runtime CDN dependency. Script access from SWFs is disabled.
- Extended public-media recovery to recognize relative positional SWF syntax.
  This recovered `wp-content/uploads/2011/dotclear/jour-36.swf`, bringing FTP
  recovery to 617 files. All 37 shortcode SWFs are available locally.
- Replaced `languageCode: fr-FR` with `locale: fr-FR` and `.Site.Data.comments`
  with `hugo.Data.comments`. No comment data or article URL metadata was changed.

The theme modifications are maintained in `blog/theme-overrides/`, outside the
generated PaperMod theme. The footer hook is page-independent because PaperMod
caches its footer across articles. A small shared loader detects animation
containers and downloads Ruffle only when needed; it shares one runtime promise
between players. Do not condition this cached hook on `.HasShortcode`.

## Reproduce

From the workspace root, after conversion and media recovery:

```sh
rtk proxy python3 blog/scripts/integrate_ruffle.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 -m unittest discover -s blog/tests -v
rtk proxy sh blog/scripts/mise-local.sh exec -- hugo build --source migration/raw/generated-2026-11-15-16-45-14 --destination public-ruffle-validation --environment production --buildDrafts=false --buildFuture=false --buildExpired=false --panicOnWarning
```

The integration script re-downloads the exact pinned runtime, verifies its SHA-512
integrity, installs the overrides, converts remaining markers, and applies the two
Hugo compatibility fixes. Running it again changes zero already converted blocks.
Original XML/SQL/FTP backups remain untouched.

Pinned package:

- Package: `@ruffle-rs/ruffle@0.7.1`
- Archive: `https://registry.npmjs.org/@ruffle-rs/ruffle/-/ruffle-0.7.1.tgz`
- Integrity: `sha512-6ZWxx/cfX3RoNyQ1AVimECSae4gKqMxdPimOD+chiIcOFiJS0ATGKcjkretxNT03lqNUpiSyJjF55AuvvZ+QeA==`
- The shipped package README and Context7 `/ruffle-rs/ruffle` were consulted for
  the self-hosted `createPlayer()` and `player.ruffle().load()` APIs.
- Hugo compatibility documentation: Context7 `/gohugoio/hugodocs/v0.165.0`.

## Validation

- 10 Python tests passed; the new tests were run failing before implementation.
- JavaScript syntax check passed.
- Production build passed with `--panicOnWarning`: neither reported deprecation
  warning remains. Exact build output is in `logs/ruffle-build.log`.
- Every generated animation article includes the loader and stylesheet; no
  template escaping errors were found.
- All 37 SWF URLs returned HTTP 200 with valid Flash signatures from the local
  Hugo server. WASM files are served as `application/wasm`.
- Totem retains its 604 by 1200 aspect ratio, constrained to the article width.
- Comment anchors match the previous build across generated pages.
- Re-running conversion changes zero blocks. No raw `[swf:` markers remain in
  Markdown content.

Reports: `reports/ruffle-conversion.json` and `reports/ruffle-validation.json`.

Actual browser playback and mobile visual inspection remain unverified: the
Chrome DevTools tool requires approval unavailable under this session's policy.
HTTP and build checks do not establish ActionScript compatibility or visual
fidelity for every animation. Direct standalone Flash HTML wrappers and unrelated
legacy object embeds are outside this shortcode conversion.

For a manual test, open the existing local preview at
`/2016/06/29/zero-prelude-a-la-guerre-arme-de-construction/`, click the player to
start Totem, and check narrow-screen sizing, audio, and interactive behavior.
Restart the existing Hugo server if its watcher has not picked up new layouts.
