# WordPress design restoration and inline Flash pages

The Hugo staging site now uses the archived Step design: the original left-hand
illustration, cropped blue header, date strip, black article column, gray page
background, orange titles, blue Courier content, and Rabiohead sidebar links.
At widths below 760px navigation moves above the content and media shrink to fit.
The 973px desktop layout preserves the original 303px / 670px proportions.

The visual assets come from the FTP theme `steptheme-3.3`; only three images,
one WOFF font, and the existing license were copied. Archived PHP is never run.
The public GitHub theme's `style.css` and `header.php` matched this backup exactly:
https://github.com/overstep-metaflash/overstep-wordpress-theme
The live WordPress HTML and CSS were subsequently retrieved and compared with the
archive; see `SIDEBAR.md` for the header, blogroll, and animated totem follow-up.
This is a source-based restoration; a pixel-level comparison with the live site
has not been performed.

## Flash article changes

32 links in 28 articles now display the movie inline with Ruffle instead of opening
a separate HTML wrapper. There are 69 inline Ruffle players in total, including
the previous 37 shortcode conversions. All referenced SWFs are local.
`11-la-fleur-qui-eleve` now displays `elevation.swf` at its original 1200:675 ratio.
Captions and music credits remain beside the player. Article metadata and URLs
are preserved. Repeated links in an article are converted individually.

The transformation identifies a single movie from archived `object`, `embed`,
or `param` markup. Numeric dimensions are preserved; percentage-size wrappers
use the SWF stage dimensions read from the FWS/CWS header. Nested object fallbacks
are deduplicated. Ambiguous and non-Flash wrappers are kept as links and reported.
The three remaining wrapper URLs are a photo gallery (`charbonnerie.html`), a
single image (`morning.html`), and an archive (`40jours.html`); no single SWF
can replace those pages.

Ruffle uses `autoplay: on` and disables the splash screen. Animations load when
near the viewport. Audio is subject to browser autoplay restrictions; Ruffle's
unmute overlay remains available when a user interaction is needed for sound.

## Reproduce

From the workspace root, after the initial conversion and media recovery:

```sh
rtk proxy python3 blog/scripts/embed_flash_pages.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 blog/scripts/integrate_ruffle.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 -m unittest discover -s blog/tests -v
rtk proxy node --test blog/tests/test_player.cjs
rtk proxy sh blog/scripts/mise-local.sh exec -- hugo build --source migration/raw/generated-2026-11-15-16-45-14 --destination public-step-validation --environment production --buildDrafts=false --buildFuture=false --buildExpired=false --panicOnWarning
```

`blog/theme-overrides/` holds the maintained Hugo templates, CSS, JavaScript, and
original visual assets; the integration script installs these into staging.
`embed_flash_pages.py` records exact wrapper/SWF mappings and copied hashes in
the ignored `migration/reports/flash-pages.json` report. Original backup inputs
remain untouched. French is the default content language without a URL prefix.

## Verification

The production build passes with warnings treated as errors. The Python suite
contains 15 tests, and the JavaScript player test confirms automatic loading with
the original SWF path and disabled script access. All 470 original public article
paths exist in the output, and all 2,638 public article comment anchors still
match their source parent article. All 69 shortcode SWF references resolve to
local static files.

An attempted headless Chromium visual check was blocked by macOS sandbox Mach
port permissions. Browser playback, audio, and mobile appearance therefore still
need a manual check in the local preview. Build/HTTP checks do not prove visual
or ActionScript fidelity. Existing migration gaps (one omitted attachment comment,
external images, source spam/privacy review) remain documented in the earlier
migration reports.
