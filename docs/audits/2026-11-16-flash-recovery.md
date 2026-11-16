# Flash recovery review — issue #2

## Result and remaining acceptance gates

Restored **124 audited movie/article associations in 123 articles**, including the
twelve affected empty articles. [`../flash-recovery.json`](../flash-recovery.json)
records each article ID/URL, source provenance/hash, exact backup path/hash,
dimensions, fullscreen setting and reviewed insertion anchor. The original audit
remains the record of the pre-recovery findings.

Issue #2 remains open for:

- The radio acceptance dependency in #4. The owner subsequently supplied the
  Spotify playlist; `/radio/` now resolves. See the [radio review](2026-11-16-radio.md)
  for the track comparison and remaining version/browser acceptance.
- Representative playback and actual activation of every menu hotspot in the six
  contexts below. Successful builds and configuration tests establish neither
  animated visual fidelity nor audio/ActionScript compatibility.

No deployment, artifact upload, DNS, visibility or release-gate change was made.

## Source review

117 associations come from published XML bodies; seven require saved HTML article
content. Existing cleaned Markdown was retained, avoiding reimport of injected
links, detection scripts and ActiveX markup. All 123 original front matters remain
byte-identical. Existing non-whitespace body characters, image references and
credits remain intact. Only paragraph-ending whitespace was normalized; Markdown
hard breaks within paragraphs remain.

Players retain source dimensions, order and positions relative to prose, images
and music/artist credits. All 124 source objects have no enabled fullscreen
setting; their shortcodes explicitly use `fullscreen="false"`.

`/2006/12/08/battement-de-crane/` has inconsistent source markup: object `data`
names `tribu.swf` and its `movie` parameter names `electropanik.swf`. Both audited
associations are retained in source attribute order at 458 × 685. Nested fallback
markup naming the same movie produces one player.

The eight missing SWFs were copied from `backup_ftp/blog/wordpress` plus their
exact public paths. The other 116 existing files also match those exact-path
backups. Ten basenames have conflicting backup hashes; the selected paths and
full hashes are recorded in the manifest. No selection used basename alone.

Two separate source soundtrack players were also restored: `oneshot.mp3` for
post 1845 and `everyoneintheworld.mp3` for post 2071. Exact backup paths and hashes
are recorded in the recovery manifest. Both use the existing `local-audio`
shortcode before their movie/credit content. Under the owner’s non-radio audio
approval, `media-rights.json` now inventories 47 files; publication approval stays
false. Neither file matches any of the 17 excluded radio-track hashes. Read-only
string inspection of the 124 SWF payloads found no additional
SWF/MP3/XML/image file references. This does not establish complete runtime
dependency coverage.

## Menu navigation

`theme-overrides/static/theme/step/menu-links.json` inventories all eight embedded
destinations. A test compares it with the actual menu bytes.

| Button | Historical destination | Reviewed destination |
| --- | --- | --- |
| Illustrations | `http://metaflash.fr/illustrations.html` | `/category/illustrations/` |
| Animations Flash | `http://metaflash.fr/flash.html` | `/category/anim-flash/` |
| Eros | `http://metaflash.fr/eros.html` | `/eros/` |
| 40 jours | `http://metaflash.fr/40jours.html` | `/category/40-jours/` |
| Photos | `http://overstep.free.fr/photos.html` | `/category/photos/` |
| Galerie | `http://metaflash.fr/menu2.html` | `/gallery/` |
| Radio | `http://www.overstep.fr/radio/` | `/radio/` — Spotify playlist; browser acceptance pending #4 |
| Contact | Original public `mailto:` action | Same action; no message sent |

The Eros collection retains 23 migrated article selections in source order.
Galerie provides a collection index. These pages provide access to migrated work;
they do not reproduce the complete old portfolio HTML. Its standalone
`thedance.html` entry is outside the 124 audited article associations and remains
outside the restored Eros selection.

Ruffle 0.7.1's
[navigation implementation](https://github.com/ruffle-rs/ruffle/blob/89a7049965f3090e706265670df309a5128233ac/web/src/navigator.rs#L210)
blocks `_parent`, `_self`, `_top` and empty targets with script access disabled.
`repair_flash_menu.py` changes the reviewed GetURL targets to `_blank` and updates
the affected action/block/tag/file lengths. It rejects unreviewed URLs and other
action opcodes, avoiding unsafe branch-offset changes. Links open in another tab;
`allowScriptAccess` remains false. The sidebar recovery helper applies this repair
on reimport.

Six button action tags changed. Their character records, the frame header and
the other 250 tags remain byte-identical, preserving all artwork data:

- Original SHA-256: `22b24f52b88db6c2e612c5e4082577e8f45f589295803813c03600a9fa1ecfcd`.
- Repaired SHA-256: `eb3fb39dbec9e956f2a0e6b294c1d2a0aeacbfb594da07c9e41e11607c0f3735`.

[URL rewrite rules](https://ruffle.rs/js-docs/master/interfaces/Config.BaseLoadOptions.html#urlRewriteRules)
map obsolete HTTP/HTTPS URLs to reviewed routes. The option was retrieved through
Context7 and confirmed in the vendored 0.7.1 source map. The prefix comes from the
player script URL, independently of the current home/article/archive route.
Article players receive no menu rules. A missing menu map retains the fallback
and reports failure instead of claiming readiness.

## Automated verification

- 67 Python tests and seven JavaScript tests pass without private backups.
- Theme synchronization and all 2,639 sanitized comments pass.
- Hugo 0.165.0 root and project-prefix production builds pass `--panicOnWarning`.
- Both output validations reconcile 470 articles, 21 attachment pages, 2,639
  comment anchors and all 124 recovered Flash associations.
- Reconciliation checks actual per-article players, order, dimensions, fullscreen
  settings and exact file hashes. Missing/duplicate/reordered players, wrong
  variants and an incomplete manifest fail validation. Fixtures include empty
  bodies, multiple movies and malformed snapshot markup.
- Menu configuration tests cover eight URLs × home/article/archive × root/prefix.
  Output validation also checks destinations inside the menu JSON. The two
  additional collection pages are outside the 491 historical-content-page count.
- Reapplying article recovery plans zero changes. The five existing unresolved
  local destinations remain visible; the allowlist was not expanded.

Chrome DevTools could not start because Chrome is absent. Native access to Zen
was denied. An isolated Playwright 1.58.2/Brave test process aborted at startup in
this environment. No browser playback or real hotspot activation was observed.

## Pending manual verification

| Context | Root | `/overstep-website/` |
| --- | --- | --- |
| Home: activate every menu button | Pending | Pending |
| `/2006/02/11/sauvons-la-princesse/`: every button | Pending | Pending |
| `/category/anim-flash/`: every button | Pending | Pending |

Inspect animated pixels over time, interaction and sound after a gesture,
dimensions and caption placement. Additional representative articles:

- `/2006/01/31/i-live-in-amazonie/`: snapshot-only recovery.
- `/2006/12/08/battement-de-crane/`: two movies and an originally empty body.
- `/2005/12/07/raconter/`: two preceding images and following credit.
- `/2010/03/01/jour-6-apocryphe/`: snapshot-only and conflicting backup variants.

Inspect each menu destination in its opened tab. Radio acceptance awaits the
playlist page. Inspect contact without sending a message. Firefox audio and
WebGL diagnostics remain browser/upstream limitations.

## Reproduction

In the original private workspace, reviewed article recovery can be reapplied:

```sh
rtk proxy .venv/bin/python scripts/recover_article_flash.py --backup-root .. --apply
```

Reproduce the menu repair from its immutable source:

```sh
rtk proxy .venv/bin/python scripts/repair_flash_menu.py --source ../backup_ftp/blog/wordpress/wp-content/themes/steptheme/images/menu.swf --destination theme-overrides/static/theme/step/menu.swf
rtk proxy .venv/bin/python scripts/sync_theme.py
```

Normal CI requires no private backups. Build and output-validation commands are
in [the preproduction review](../preproduction-review.md#reproduce-the-checks).
