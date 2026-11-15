# Header, blogroll, and animated navigation

The public WordPress HTML, theme CSS, and five theme images/movies were retrieved
on 2026-11-15 using a standard browser User-Agent. The live `header.jpg`,
`step_et_semelles.jpg`, `menu.png`, `menu.swf`, and `liens.swf` exactly match
the archived `steptheme` assets. Reference downloads remain local and ignored
under `migration/reference/`.

## Changes

- The header now displays the dedicated original `header.jpg` as a responsive
  image instead of cropping `step_et_semelles.jpg` with a CSS background offset.
  The full banner remains visible as the viewport width changes.
- All 22 public blogroll links were extracted from the live `linkcat-2` widget
  into `theme-overrides/data/blogroll.json`. Labels, order, and destinations are
  preserved. These are ordinary accessible links, independent of Flash support.
- The left totem now loads the original `menu.swf` with Ruffle at its 303:2280
  aspect ratio and transparent stage. The PNG stays visible while loading and
  remains a fallback if playback fails. Successful loading reveals the SWF.
  Original menu destinations remain embedded in the unmodified movie.
- The older `liens.swf` is also preserved locally. Its older link list differs
  from the live widget; the page displays the 22 current text links rather than
  duplicating them with that historical animation.
- The full-height totem is hidden on narrow screens; navigation and the blogroll
  remain available there.

Ruffle requests automatic playback, including sound when the browser permits it.
It cannot override browser autoplay policy. When audio is blocked, the visible
unmute overlay provides the necessary user interaction. No browser settings are
modified and no silent promise of audio without a gesture is made.

## Reproduce

From the workspace root:

```sh
rtk proxy python3 blog/scripts/restore_sidebar.py
rtk proxy python3 blog/scripts/integrate_ruffle.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 -m unittest discover -s blog/tests -v
rtk proxy node --test blog/tests/test_player.cjs
rtk proxy sh blog/scripts/mise-local.sh exec -- hugo build --source migration/raw/generated-2026-11-15-16-45-14 --destination public-sidebar-validation --environment production --buildDrafts=false --buildFuture=false --buildExpired=false --panicOnWarning
```

`restore_sidebar.py` reads the captured public HTML, downloading it first if the
snapshot is absent, and copies three explicitly selected archived assets into
the maintained overrides. `integrate_ruffle.py` installs the maintained overrides
into the staging site. No backup files are changed.

## Verification

17 Python tests and two JavaScript tests pass. The player tests cover autoplay,
the transparent navigation stage, sharing one runtime across players, and keeping
the fallback on failure. The production build passes with `--panicOnWarning`.
All 22 links appear in generated HTML; the three new static assets match the
backup byte for byte. The local preview serves the header, both SWFs, and player
script successfully. All 470 public article paths and 2,638 public article comment
anchors still reconcile with the XML source. See `reports/sidebar-validation.json`.

Visual playback remains a manual verification step. Computer-use browser access
was unavailable, and Chrome DevTools required approval unavailable under the
session policy. No screenshot comparison or audio playback check is claimed.

Sources:

- Live site and public widget: https://blog.overstep.fr/
- Live stylesheet: https://blog.overstep.fr/wp-content/themes/steptheme-3.3/style.css
- Ruffle autoplay documentation:
  https://github.com/ruffle-rs/ruffle/wiki/Frequently-Asked-Questions-For-Users
- Ruffle API documentation was consulted through Context7 `/ruffle-rs/ruffle`.
