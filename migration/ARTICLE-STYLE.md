# Article metadata and source styling

The shared article metadata partial now displays `Publié le <localized date> par
Step` in both list and single views. `wordpress_display_date` is taken directly
from the XML's local `wp:post_date`, preserving the original publication calendar
day. The original Hugo UTC date, article URL, and sorting data are unchanged.
Blindly applying Europe/Paris to all converted dates was rejected after comparison:
some older source GMT/local pairs are inconsistent. The original local date is
the reliable display baseline for this migration.

The Zero article therefore displays `Publié le 29 juin 2016 par Step` and Parade
displays `Publié le 22 novembre 2016 par Step`. Newly authored content without the
WordPress field falls back to the Hugo date displayed in Europe/Paris.

The screenshot supplied by the user was used to refine metadata strip alignment,
underlined gray metadata links, the gray sans-serif footer, pipe separators, and
the `Un commentaire` label. Article headings use normal weight. Body links are
blue and underlined. The original date-strip image remains in use. The screenshot's
WordPress `Modifier` administration link is omitted because no WordPress editor
exists in the Hugo site.

The converter dropped inline text colors. A tested transformation restores simple
hexadecimal colors to matching source text runs, with 132 runs recovered across
42 generated posts. Parade's red text (`#c94e38`) and violet music credit
(`#333399`) are present in generated HTML again. Link labels, code, scripts, SWF
shortcodes, and unmatched text are excluded from this transformation. Arbitrary
CSS is not imported. Only matching source text is wrapped; this does not claim
complete recovery of every original style or color. Re-running makes no changes.

## Reproduce

From the workspace root:

```sh
rtk proxy python3 blog/scripts/refresh_metadata.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 blog/scripts/restore_source_colors.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 blog/scripts/integrate_ruffle.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 -m unittest discover -s blog/tests -v
rtk proxy node --test blog/tests/test_player.cjs
rtk proxy sh blog/scripts/mise-local.sh exec -- hugo build --source migration/raw/generated-2026-11-15-16-45-14 --destination public-article-style-validation --environment production --buildDrafts=false --buildFuture=false --buildExpired=false --panicOnWarning
```

22 Python and three JavaScript tests pass. The build passes with warnings treated
as errors. All 470 public article paths exist and their displayed dates match
the original WordPress local dates. All 2,638 public comment anchors still match.
Reports: `reports/source-colors.json` and `reports/article-style-validation.json`.
Original backups remain untouched. No browser screenshot comparison is claimed;
the generated HTML was checked against the source and supplied visual reference.
