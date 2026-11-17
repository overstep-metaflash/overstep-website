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
- `docs/audits/2026-11-16-image-recovery.md`: four restored article images from
  issue #3, source evidence, regression coverage and root/project-prefix HTTP
  verification. Browser decoding and visual acceptance remain pending.
- `docs/audits/2026-11-16-external-image-recovery.md` and
  `docs/external-image-recovery.json`: both original linked artwork files from
  issue #5, recovered from exact archived URLs with matching archive checksums.
  Keep their article links, local bytes and attribution; both base paths passed
  HTTP and Chrome link/decoding checks. This does not complete issue #3's separate
  inline-image visual acceptance.
- `docs/audits/2026-11-16-radio.md`: Spotify replacement, historical track
  comparison, accepted unavailable-track omission, embedded player and dark theme.
  The route is restored; version and browser acceptance remain pending in #4.
- GitHub issues #1–#7: cleanup, original media, radio and URL follow-up tasks.
  Issues #2 and #4 explicitly require every Flash totem menu button to work.
- `docs/audits/2026-11-16-historical-links.md`: source-reviewed replacements for
  issue #6, including three distinct Dotclear queries and the unavailable game ZIP.
  The missing-local-link inventory is now empty; hosting redirects remain pending.
- `docs/preproduction-review.md`: build, release gates and known limitations.
- `docs/audits/2026-11-16-metaflash-coverage.md`: read-only audit of all 1,868
  Metaflash FTP files, exact Git/public coverage, reviewed page adaptations and
  Wayback evidence. The full portfolio has not been imported; 198 source paths
  have exact public copies, plus one additional adapted page. Raw per-file
  evidence remains ignored under `migration/cache/metaflash-audit/`.
- `docs/audits/2026-11-17-metaflash-restoration.md` and
  `docs/metaflash-recovery.json`: selected homepage/gallery restoration, 277 output
  files, 55 internal-viewer destinations, reviewed substitutions and root/prefix
  verification. Consult this follow-up before treating selected files from the
  original coverage baseline as still missing.
- `docs/audits/2026-11-17-metaflash-follow-up.md`: subsequent viewport-filling
  homepage, gallery header return link, ordinary Anterak gallery entry and recovered
  guestbook. The section now has 278 reviewed files. Keep the 19 safe guestbook
  messages in `data/metaflash_guestbook.json`, pinned review/cleanup evidence in
  `docs/metaflash-guestbook-*.json`, and the raw owner-supplied capture outside Git.
  Never restore IP headers or copy the unsanitized capture into static output.
  The follow-up also covers image dialogs: 16 sets and 36 complete images,
  including all three Sirius and MC1 cover views. Preserve ordered image
  associations in the recovery manifest, avoid navigation thumbnails as substitutes,
  and keep hidden menu hotspots out of the restored image pages. Two reviewed
  injected spans were removed from legacy movie wrappers; there are now 57 simple
  Flash destinations as well as the image sets.
- `docs/audits/2026-11-17-media-usage.md` and
  `docs/media-usage-2026-11-17.json`: post-release source/public media inventory.
  Against content commit `7e2ad35`, 296 source SWFs and 615 source images have no
  imported payload; six public SWFs and 53 public images have no detected
  reference. Four additional unreferenced SWF URLs duplicate used payloads.
  Treat these as review candidates, not deletion instructions. Full raw source
  inventories remain ignored; the published report includes only reviewed evidence.
- `docs/audits/2026-11-17-media-archive.md`, `data/media_archive.json` and
  `docs/media-archive.json`: independent catalogue of the 63 already-public
  candidate paths, grouped into 55 notices with verified original downloads.
  Preserve the dated usage baseline, original media bytes and historical gallery
  order. Generate with `scripts/generate_media_archive.py --apply`; the full
  private preservation master remains outside Git and static output.
- `docs/audits/2026-11-16-legacy-urls.md`: issue #7's Pages-only hosting decision,
  query/feed regressions, local HTTP and Chrome evidence, and unresolved HTTP
  redirect/RSS-reader acceptance. A hosting choice does not waive release gates.
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
rtk proxy python3 scripts/validate_metaflash.py --directory public
rtk proxy python3 scripts/validate_media_archive.py --directory public
```

Use the virtual environment's Python path if dependencies are not available to
`python3`. CI sets `HUGO_BIN` for Hugo fixture tests; local tests can use the
workspace's mise launcher. Scan staged changes with pinned Gitleaks before commits.
The build and CI must work without the private parent backups or ignored caches.
Use TDD for behavior changes; documentation-only edits do not need new tests.
When adding required audit fields to the validator, update the synthetic audit
inventories in its integration tests. Do not silently treat missing evidence as
an empty inventory to make an older fixture pass. Hugo fixtures must provide
layouts for every enabled page kind so `--panicOnWarning` failures identify the
intended regression rather than a missing test layout.

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
- Eros (`/eros/`), Galerie (`/gallery/`) and Radio (`/radio/`) are navigation collections,
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
`_blank` targets internally. The owner now requires same-tab navigation: the
maintained player adapter translates only exact reviewed legacy/resolved menu
URLs into `window.location.assign`, delegating other window requests unchanged.
Do not remove this adapter or enable script access to change tabs. See
`docs/audits/2026-11-16-menu-navigation.md` for the completed local hotspot matrix.
Changing URLs alone does not repair blocked current-tab targets.
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

On 2026-11-16 the initial Chrome installation attempt failed under `/opt/homebrew`.
Chrome was subsequently found at `/Applications/Google Chrome.app`, and DevTools
could list a blank page. Opening Spotify was refused with `MCP tool call requires
approval, but approval policy is never`. Browser installation and browser-control
permission are separate checks. The owner requested `on-request` for future
sessions; the local Codex config was updated while retaining `workspace-write`.
This does not change an active session's effective policy. Recheck active tool
permissions before retrying, respect denials, and do not bypass them through
another browser mechanism or change Homebrew ownership/permissions.

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
- The four audited missing article images are restored. Use angle-bracket
  destinations for Markdown image paths containing spaces without renaming the
  files; cover spaces and accents with a real Hugo rendering regression.
  `scripts/article_images.py` derives four associations from the seven confirmed
  missing-image findings in the original audit, deduplicating XML/snapshot aliases
  by article and SHA-256. `scripts/validate_site.py` requires one real `img` inside
  `.entry-content`, the correct prefix and exact output bytes for each association.
  Sidebar images, download links and broken Markdown text do not satisfy coverage.
  Keep the 29 intentional thumbnail-to-Ruffle changes and ten valid byte-identical
  aliases unchanged; do not restore all 46 original image differences.
- Preserve reviewed image placement, title, alt text, display dimensions,
  full-size links and surrounding captions. Post 2496's image retains the title
  `Les yeux de la ruche`, an empty alt, 640 × 360 display dimensions and a link to
  the full-size original. Its source has no separate caption to restore.
- Verify article image delivery over HTTP in root-domain and project-prefix
  output: actual article `img`, HTTP status, image content type, payload signature
  and expected SHA-256. Check browser decoding/appearance separately; successful
  HTTP checks do not complete visual acceptance.
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
  `migration/` is not ignored as a whole. Store retrieved Spotify HTML/JSON under
  `migration/cache/radio/` and verify ignored status before writing raw evidence.

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

The owner supplied the Spotify playlist on 2026-11-16:
`https://open.spotify.com/playlist/6AH0ucKZlI1gOCzLEjqDjx`.
`/radio/` embeds its official Spotify player, retains a fallback link and lists
its 16 tracks. The owner accepted the missing, unavailable track; see
`docs/audits/2026-11-16-radio.md` for comparison with the 17 historical identifiers
and remaining version/browser review. The absent identifier is Another World — End;
the omission approval does not establish recording equivalence for the other
tracks. Retain the menu
mapping to `/radio/`; do not claim browser acceptance without actual hotspot tests.

Keep the player on Spotify's neutral dark theme (`?theme=0`); the owner rejected
the default artwork-derived green against the site's blue/black design. Preserve
the accessible iframe title, `width="100%"`, `height="352"`, fullscreen and Spotify
playback permissions, especially `encrypted-media`. No additional SDK, credentials
or parent-page script is needed. Keep the fallback playlist link and ordered
track list, without the sharing URL's tracking query parameter.

`tests/test_radio.py` renders the actual radio Markdown and collection layout at
root and project-prefix base URLs, requiring the exact dark-theme iframe URL,
playback permissions and all 16 linked tracks. Its synthetic Hugo configuration
enables the same reviewed raw HTML rendering as the site. A successful build or
HTTP response does not prove Spotify playback. The owner's screenshot confirms
that the initial green player rendered; dark-theme visual acceptance, audio and
the full totem matrix remain pending. The current verification baseline is 76
Python tests and seven JavaScript tests. The subsequent historical-link repair
raised the Python total to 78 and resolved all four missing local path families;
see `docs/audits/2026-11-16-historical-links.md` for HTTP evidence and hosting limits.

The selected Pages target is
`https://overstep-metaflash.github.io/overstep-website/`, without a custom domain
or DNS cutover. Site-artifact upload and deployment require both the repository
variable `PAGES_RELEASE_APPROVED=true` and `docs/media-rights.json` publication
approval. The owner explicitly requested the first Pages deployment on 2026-11-16;
`docs/releases/2026-11-16-pages.md` and the manifest record that authorization.
Both controls remain required. Audio clearance, edits, pushes and ticket
maintenance alone do not authorize deployment or changes to repository visibility.

For a project-prefix preview, build with the preview base URL, then run
`scripts/prepare_pages.py` and `scripts/validate_site.py` with the matching
`--base-url`; see `docs/preproduction-review.md`. Preserve original bytes when
prefixing non-UTF-8 legacy HTML. Re-run `prepare_pages.py` after every prefix build
before validation or HTTP/browser review; a rebuild can overwrite prepared paths.
Do not enable production DNS while testing paths.

`?p=ID` is currently a JavaScript redirect preserving comment hashes. `/feed/` is
an HTML browser fallback to `feed.xml`. Neither is an HTTP permanent redirect or
a guarantee of RSS-client compatibility. The owner selected GitHub Pages only in
issue #7's review; retain these static fallbacks and direct `/feed.xml` links.
Repository files cannot supply query-dependent HTTP redirects on Pages. Keep #7
open until the static-host limitations are explicitly accepted or the hosting
constraint is revised, and actual RSS-reader/released-origin checks are recorded.
The latest local baseline is 80 Python tests and 19 JavaScript tests. Do not claim
production SEO redirect coverage from local browser navigation. Keep unresolved paths
explicit in `docs/remaining-local-links.json`; resolve them instead of extending
the allowlist to hide new failures.
