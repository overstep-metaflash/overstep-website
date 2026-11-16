# Step Hugo website

## Scope and authoritative references

This directory is the active Hugo site and public Git repository for
https://github.com/overstep-metaflash/overstep-website.git, branch `main`.
Raw converter output under `migration/raw/` is historical input, not the site to edit.

Discuss work in French; write code, code comments, technical documentation,
commits, branches, PR descriptions and changelogs in English. Use Conventional
Commits. Follow the parent workspace's immutable-backup and tooling rules when
working in the original migration workspace.

Current references:

- `docs/audits/2026-11-16-content.md`, JSON and CSV files: verified content findings.
- `docs/audits/2026-11-16-flash-recovery.md` and `docs/flash-recovery.json`:
  subsequent recovery evidence for 124 Flash associations in 123 articles, eight
  copied SWFs and two companion audio players. The original audit records the
  pre-recovery gaps; do not rewrite it to erase those findings.
- GitHub issues #1–#7: cleanup, original media, radio and URL follow-up tasks.
  Issues #2 and #4 explicitly require every Flash totem menu button to work.
- `docs/preproduction-review.md`: build, release gates and known limitations.
- `docs/media-rights.json`: audio inventory and the owner's current instruction.
- `migration/FIRST-VERSION.md` and other migration notes: historical milestones;
  prefer the current audit when older behavior/counts conflict.

## Toolchain and checks

Use mise and the versions in `mise.toml`: Hugo 0.165.0, wp2hugo 1.39.0 and Gitleaks
8.30.1. Install missing tools through mise. The local launcher keeps tool storage
under ignored `migration/mise/`. Python dependencies are pinned in
`requirements-migration.txt`; install them in a virtual environment, not in Git.
Prefix shell commands with `rtk` (`rtk proxy` for unfiltered commands).

Run from this directory, with Python dependencies installed:

```sh
rtk proxy python3 -m unittest discover -s tests -v
rtk proxy node --test tests/test_*.cjs
rtk proxy python3 scripts/sync_theme.py --check
rtk proxy python3 scripts/sanitize_comments.py --check
rtk proxy sh scripts/mise-local.sh exec -- hugo build --destination public --environment production --buildDrafts=false --buildFuture=false --buildExpired=false --panicOnWarning
rtk proxy python3 scripts/validate_site.py --directory public
```

Use the virtual environment's Python path if dependencies are not available to
`python3`. CI sets `HUGO_BIN` for Hugo fixture tests; local tests can use the
workspace's mise launcher. Scan staged changes with pinned Gitleaks before commits.
The build and CI must work without the private parent backups or ignored caches.
Use TDD for behavior changes; documentation-only edits do not need new tests.

Only `public/` or an explicitly selected generated build directory is website
output. Never serve the repository root. Preview locally with:

```sh
rtk proxy sh scripts/mise-local.sh exec -- hugo server --bind 127.0.0.1 --port 1314 --buildDrafts=false --buildFuture=false --buildExpired=false --disableFastRender
```

### Live-reload troubleshooting

A long-running Hugo 0.165.0 preview returned `.Content` / `slice bounds out of
range` after content changed during a hot rebuild. An unchanged cold production
build succeeded, and restarting that preview restored HTTP 200 on the home page,
Détournements category and representative articles.

If this pattern returns, compare a cold build with the running server before
changing templates or deleting content. Restart only a preview process whose
ownership is known, then verify the reported page and adjacent routes over HTTP.
`--disableFastRender` was already enabled and did not prevent this incident.
A successful restart is an operational recovery, not proof of an upstream fix.

## Content and SEO invariants

- Preserve article `url` and `post_id`, taxonomy paths, date archives, comment IDs
  and parent relationships. The baseline is 470 published articles, 10 excluded
  drafts, 21 restored attachment pages and 2,639 rendered archived comments.
- Eros (`/eros/`) and Galerie (`/gallery/`) are additional navigation collections,
  outside the 491 historical article/attachment pages. Use `layout: collection`
  for these pages; do not invent article dates, post IDs or comment associations.
- Article source filenames use `YYYY-MM-DD-original-url-slug.md`, based on
  `wordpress_display_date`. Use `scripts/rename_posts.py`; do not change public
  paths or identifiers merely to rename a file.
- Display author Step and the original local date as “Publié le … par Step”.
  Historic local/GMT pairs are inconsistent; do not apply a blanket timezone fix.
- Comments remain article-scoped and sorted by date ascending at every thread
  level, preserving nested replies and `#comment-ID` anchors.
- Preserve `/category/<slug>/`, `/tag/<slug>/` and year/month/day archives.
  Keep older-article pagination on the right, including when it is the only link.
- Store decoded Unicode paths in attachment front matter. Percent-encoded Greek
  requests must resolve to the intended page, not a directory containing literal
  percent escapes. Encode or delimit image URLs with spaces correctly in Markdown;
  verify real `img` elements in Hugo output rather than merely file existence.

## Maintained theme and Flash behavior

Edit `theme-overrides/` first and run `python3 scripts/sync_theme.py` to install
matching root templates/assets. CI checks for drift. Keep custom Step changes
outside the vendored PaperMod theme.

Preserve the restored original Step design, the exact `step_et_semelles.jpg`
artwork/crop, the animated sidebar, blogroll and article details. Do not reintroduce
the generic Posts heading, discarded navigation panels or SWF download link.

Ruffle 0.7.1 is self-hosted. Immediate loading and visual autoplay are intentional
user requirements; do not revert to lazy/click-to-load behavior to match old notes.
Share one runtime between players. Keep script access disabled and preserve the
original movie dimensions, captions and order when restoring legacy objects.

Every Flash totem menu button/hotspot must open its intended destination. An
animated menu with dead buttons is incomplete. Inventory the embedded legacy
URLs, use valid migrated or reviewed external destinations, and test every button
from the home page, an article and an archive, both at the root site and under
`/overstep-website/`. The radio button must open the replacement playlist page;
do not silently redirect unrelated buttons to the homepage.

Ruffle 0.7.1 blocks `_parent`, `_self`, `_top` and empty GetURL targets when
`allowScriptAccess` is false. Keep script access disabled. The reviewed menu uses
`_blank` targets; changing URLs alone does not repair blocked current-tab targets.
Use `scripts/repair_flash_menu.py` for menu target changes, then synchronize the
theme. It preserves artwork/character records, updates binary lengths and rejects
unreviewed URLs or other action opcodes. Do not replace the repaired movie with
the original backup or use ad hoc binary string replacement. The sidebar recovery
helper already reapplies this repair on reimport.

Maintain all eight destination mappings in
`theme-overrides/static/theme/step/menu-links.json`. HTTP and HTTPS legacy URLs
are rewritten through Ruffle's `urlRewriteRules`. Derive the project prefix from
the player script URL, not the current article/archive URL, and keep menu rules
out of article players. The output validator checks local destinations inside
this JSON as well as HTML links. A missing map must retain the fallback and report
failure instead of marking the menu ready.

Browser audio policies may require a gesture. Firefox AudioContext and
WEBGL_debug_renderer_info diagnostics remain browser/upstream limitations; do not
suppress the warnings or claim they are fixed without evidence. HTTP/build checks
do not establish visual fidelity or ActionScript compatibility; record manual
browser verification separately.

If browser access is unavailable or denied, or the test browser aborts at startup,
record the concrete limitation and keep the manual matrix pending. Configuration
tests for all six page/prefix contexts are not evidence of real hotspot activation.
Issue #2 must not be marked complete until that matrix and its radio dependency
are satisfied; consult the recovery review for the outstanding checks.

## Security and original-media recovery

- Re-sanitize comment edits with `python3 scripts/sanitize_comments.py`. Only the
  allowlisted `content_html` may be rendered as trusted HTML. Preserve raw comment
  text as data, and keep an escaped fallback. Do not restore Gravatar identifiers,
  raw email/IP fields or external avatar requests.
- Goldmark's `unsafe` mode serves reviewed historical article formatting; it is
  not permission to render unsanitized comments or copy executable archived HTML.
- The XML and saved HTML can already contain injected links. The current audit
  records 78 link instances, 49 also present in older snapshots. Review exact
  instances and context; preserve legitimate titles, artist credits and prose.
- Restore original media from exact backup paths and verified hashes. Basenames
  alone can select the wrong SWF variant; accent/space aliases can be identical
  images. Do not duplicate already rendered media or restore intentionally
  replaced Flash thumbnails as if they were lost illustrations.
- A clean build, preserved article URL and available static file are insufficient
  acceptance checks. Verify each recovered source media/player association in
  rendered article HTML, including empty bodies and multiple-movie articles.
- Use `scripts/recover_article_flash.py --backup-root ..` to preview the reviewed
  recovery in the original workspace; add `--apply` to write it. It verifies exact
  backup paths/hashes, retains current front matter and prose, and inserts players
  at reviewed anchors. Reapplying it must plan zero changes. Normal CI uses the
  public manifest and synthetic fixtures without those private backups.
- Treat source dimensions, fullscreen settings, order and caption placement as
  independent invariants. A snapshot may omit object end tags; preserve following
  text. Deduplicate same-asset object/embed fallbacks, but review distinct `data`
  and `movie` paths. In Battement de crâne, retain both `tribu.swf` and
  `electropanik.swf` in their reviewed source order at 458 × 685.
- `scripts/flash_manifest.py` and `scripts/validate_site.py` enforce all 124 audited
  associations, actual article-scoped players, order/settings, file hashes and
  companion audio. Keep empty-body, multiple-movie, malformed-markup, wrong-variant
  and incomplete-manifest regression coverage; do not satisfy checks with a file
  or download link that has no rendered player.
- Reject HTML error/redirect responses masquerading as image downloads. Record
  provenance and hashes for recovered public assets; report unrecoverable gaps.
- Keep raw backups, drafts, private metadata, tool installations, caches, raw
  reports and logs out of Git. Reviewed public-safe audit evidence under `docs/`
  is allowed; never commit whole backups or private recovery inputs.

## Audio and publication

The owner confirmed non-radio MP3 use on 2026-11-16. The 47 tracked MP3 files are
recorded as `confirmed_by_owner`, including recovered `oneshot.mp3` (post 1845)
and `everyoneintheworld.mp3` (post 2071). Both use `local-audio` players with exact
paths/hashes in the recovery and audio manifests. The 17 old radio tracks have no
identical file in that inventory and must not be imported; replace the radio with a Spotify or
Deezer playlist. Reconstruct the original track list and review unavailable or
mismatched recordings. Do not assume an MP3 is unused because it has no direct
article reference: movies may load audio internally. Also inspect separate legacy
audio objects, including `dewplayer.swf?son=...`; movie-only string scans miss
these soundtracks. Verify actual audio payloads and compare their hashes with the
excluded radio inventory when recovering more assets. Update `docs/media-rights.json`
without changing its publication gate.

The owner has no replacement playlist URL yet. Keep `/radio/` explicitly pending
under issue #4 and retain its intended menu mapping. Do not substitute an unrelated
destination, claim radio acceptance, or invent a playlist URL.

The selected Pages target is
`https://overstep-metaflash.github.io/overstep-website/`, without a custom domain
or DNS cutover. Site-artifact upload and deployment require both the repository
variable `PAGES_RELEASE_APPROVED=true` and `docs/media-rights.json` publication
approval. Both stay disabled until a release instruction supersedes the current
review state. Audio clearance, edits, pushes and ticket maintenance alone do not
authorize deployment or changes to repository visibility.

For a project-prefix preview, build with the preview base URL, then run
`scripts/prepare_pages.py` and `scripts/validate_site.py` with the matching
`--base-url`; see `docs/preproduction-review.md`. Preserve original bytes when
prefixing non-UTF-8 legacy HTML. Do not enable production DNS while testing paths.

`?p=ID` is currently a JavaScript redirect preserving comment hashes. `/feed/` is
an HTML browser fallback to `feed.xml`. Neither is an HTTP permanent redirect or
a guarantee of RSS-client compatibility. Do not claim production SEO redirect
coverage until hosting behavior is implemented and tested. Keep unresolved paths
explicit in `docs/remaining-local-links.json`; resolve them instead of extending
the allowlist to hide new failures.
