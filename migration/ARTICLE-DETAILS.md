# Legacy objects, original tag URLs, and single-article details

## Virtual Tangka

The converter removed two legacy Flash object/embed blocks from source post 1857.
The reviewed restoration now inserts an HTML audio player for
`/wp-content/uploads/2011/dotclear/son/shadows.mp3` before the existing music credit,
and an inline Ruffle player for `/wp-content/uploads/2011/dotclear/intentions.swf`
after it. The original SWF dimensions are 550 by 690. Both assets were copied from
the WordPress FTP uploads backup and verified by SHA-256.

The audio uses native browser controls instead of restoring the obsolete
`dewplayer.swf?son=...` player. It does not autoplay. The animation retains the
existing Ruffle autoplay behavior. The source's already garbled music credit is
preserved as content; no speculative encoding repair was applied.

`recover_legacy_objects.py` is deliberately scoped to the reviewed Virtual Tangka
post. Its parser recognizes local Flash objects and legacy `son=` audio URLs,
deduplicates nested object/embed fallbacks, and leaves external embeds alone.
Placement before/after the music credit is reviewed for this specific article,
not assumed appropriate for every legacy post. Re-running adds no duplicate player.

## Tags and article details

`refresh_metadata.py` now separates the original WordPress tag slug from its
display label, just as it already does for categories. Source post IDs determine
the assignments. All 71 declared tag term pages use `/tag/<original-slug>/`;
69 tags have published article assignments. For example, the label `méditation`
links to `/tag/meditation/`, rather than a converter-generated accented URL.

Single-article footers now display the original category/tag/permalink sentence.
The compact category and comment-count footer remains on list pages. Navigation
to adjacent articles appears both above and below the single article, before
the comments, matching the reference structure.

The maintained comment templates use a 40px avatar, a serif author/body layout,
orange names or blue author links, the original `dit :` label, a gray date and
time, blue comment text, and separators. Date and time use the imported source
local wall-clock values without introducing another timezone shift. Recursive
replies are selected within the current article's comment collection. Original
`comment-ID` anchors and parent IDs are preserved.

There are no WordPress administration or nonfunctional reply links. New commenting
and editing are separate features; the migrated comments remain readable archives.

## Reproduce and verify

From the workspace root after the preceding transformations:

```sh
rtk proxy python3 blog/scripts/refresh_metadata.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 blog/scripts/integrate_ruffle.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 blog/scripts/recover_legacy_objects.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 -m unittest discover -s blog/tests -v
rtk proxy node --test blog/tests/test_player.cjs
rtk proxy sh blog/scripts/mise-local.sh exec -- hugo build --source migration/raw/generated-2026-11-15-16-45-14 --destination public-details-validation --environment production --buildDrafts=false --buildFuture=false --buildExpired=false --panicOnWarning
```

Install the new audio shortcode before updating content in a running preview.
If Hugo has cached a missing-shortcode error, restart the preview. The agent-owned
preview on port 1314 was restarted with `--disableFastRender` and verified to serve
the updated article and assets successfully.

25 Python and three JavaScript tests pass. The production build passes with
warnings treated as errors. All 470 public article paths, all 2,638 public comment
anchors and parent IDs, all 69 active original tag paths, and 87 article-to-tag
footer links were verified in generated HTML. The example comment timestamps
match `8 février 2006 à 20 h 04 min` and `27 juin 2006 à 20 h 53 min`.
The Virtual Tangka page, MP3, SWF, and its three tag URLs return HTTP 200 locally.
See `reports/details-validation.json` and `reports/legacy-objects.json`.

Original backups remain untouched. Browser playback and screenshot comparison
remain manual checks; HTML, media availability, and build verification do not
claim visual or audio playback equivalence.
