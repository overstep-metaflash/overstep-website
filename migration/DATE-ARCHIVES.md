# Original WordPress date archives

The site now renders populated year, month, and day archives at the original
WordPress paths, for example `/2007/`, `/2007/07/`, and `/2007/07/16/`.
There are 597 archive sections: 13 years, 118 months, 465 days, and the overall
`/archives/` index. Empty periods are not generated.

`scripts/generate_date_archives.py` groups only published source post IDs using
the original local `wp:post_date`. UTC dates are not used to select a calendar
period. Generated section front matter contains the public article IDs, explicit
original URL, parent archive, and child periods. The shared list template selects
only those published articles and provides pagination using their existing dates.
The sidebar links to the year and month archive pages. Archive pages link to
parent and child periods. The older-page pagination link remains right-aligned.

Generated content lives in `content/date-archives/`, with sidebar metadata in
`data/date_archives.json`. No source backups or existing article URLs are modified.
The generator refuses to overwrite a section not marked as its generated output.
Re-run it after changing the source to refresh membership; it is deterministic.

From the workspace root:

```sh
rtk proxy python3 blog/scripts/generate_date_archives.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 blog/scripts/integrate_ruffle.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 -m unittest discover -s blog/tests -p test_date_archives.py -v
rtk proxy sh blog/scripts/mise-local.sh exec -- hugo build --source migration/raw/generated-2026-11-15-16-45-14 --destination public-date-archives-validation --environment production --buildDrafts=false --buildFuture=false --buildExpired=false --panicOnWarning
```

Both new tests pass, covering original local-date grouping and draft exclusion,
including a UTC/local midnight boundary, plus rejection of invalid source dates.
The build passes with warnings treated as errors. All 597 archive collections
were reconciled against their exact source post ID sets across 697 output pages
including pagination, with no duplicates or draft IDs. All 470 public article
paths and 2,638 public comment anchors remain present. The three reported URLs
and `/2007/page/2/` return HTTP 200 in the running preview.

Reports: `reports/date-archives.json` and `reports/date-archives-validation.json`.
The increase in Hugo page/alias counts reflects archives and pagination, not
additional converted articles.
