# Categories, public author, comment counts, and Ruffle diagnostics

## Changes

- Restored source category slugs from XML post IDs rather than converter-generated
  label strings. WordPress labels are decoded for display; original category paths
  are preserved under `/category/<source-slug>/` through term front matter.
- Added category navigation with published article counts to the sidebar.
  The export defines 13 categories; 12 have published articles and appear there.
- Added a shared article footer with linked categories and the comment count.
  Counts include replies and match the comments imported for that article ID.
  Articles with no comments have a valid `#comments` target as well.
- Set the public article author to `Step` in generated post metadata and site
  configuration. Article bodies, comment authors, dates, IDs, and URLs are preserved.
- Ruffle now starts loading all animation containers on page opening, sharing one
  runtime. IntersectionObserver no longer delays offscreen players. Autoplay stays
  on with a visible unmute overlay when browser audio policy requires interaction.
- The pinned Ruffle installation now includes its three original `.js.map` files,
  resolving the missing source map requests reported by Firefox developer tools.

## Reproduce

From the workspace root after the preceding migration transformations:

```sh
rtk proxy python3 blog/scripts/refresh_metadata.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 blog/scripts/integrate_ruffle.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy python3 -m unittest discover -s blog/tests -v
rtk proxy node --test blog/tests/test_player.cjs
rtk proxy sh blog/scripts/mise-local.sh exec -- hugo build --source migration/raw/generated-2026-11-15-16-45-14 --destination public-metadata-validation --environment production --buildDrafts=false --buildFuture=false --buildExpired=false --panicOnWarning
```

Source backups remain untouched. The metadata transformation is idempotent. Term
content is generated inside staging; `refresh_metadata.py` preserves the procedure
needed to recreate it after a fresh conversion.

## Validation

19 Python tests and three JavaScript tests pass, including an eager-loading test
first run failing while IntersectionObserver still delayed players. Production
build passes with warnings treated as errors. All 470 public article paths exist,
all 2,638 public comment anchors reconcile, and every article footer has the correct
comment count and source category links. All 470 rendered articles display `Step`.
All 12 active original category paths exist. Each source map returns HTTP 200 from
the local preview. See `reports/metadata-validation.json`.

## Remaining Firefox diagnostics

- The Ruffle initialization and SWF loading messages are informational.
- AudioContext autoplay messages reflect browser audio policy. Ruffle requests
  playback, but sound may require a user gesture or a browser site permission.
- The deprecated `WEBGL_debug_renderer_info` call is inside the pinned upstream
  Ruffle renderer, not the Hugo templates. No renderer downgrade or console
  suppression was introduced to hide it.
- The microtask message is a browser scheduling diagnostic, not a failed Hugo
  build. No workaround is claimed without browser reproduction.
- The `file:///` security message remains unconfirmed: no such URL was found in
  site content, templates, custom JavaScript/CSS, or the four reported SWFs
  (menu, elevation, bibop, terrain). The original JS source maps also contain
  no file URLs. Browser reproduction is unavailable in this session. If it
  persists after reloading with source maps present, capture its initiating
  request or stack and the affected animation. Browser file-access protections
  have not been relaxed.

The runtime binary includes generic file-scheme handling, so finding that string
inside WASM does not identify a request or justify patching the distributed binary.
Upstream source maps and runtime remain version 0.7.1.

Documentation consulted through Context7: `/gohugoio/hugodocs/v0.165.0` for term
pages and taxonomies; `/ruffle-rs/ruffle` for autoplay and rendering behavior.
Audio reference: https://github.com/ruffle-rs/ruffle/wiki/Frequently-Asked-Questions-For-Users
