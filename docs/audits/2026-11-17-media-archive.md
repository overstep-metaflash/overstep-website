# Independent media catalogue and private preservation master

The owner accepted an independent catalogue after reviewing the post-release
media inventory. This first batch makes the 63 already-public, unreferenced media
paths consultable without inserting them into historical articles or rearranging
the original Metaflash gallery. This report follows, rather than replaces,
`2026-11-17-media-usage.md` and its source inventory.

## Public first batch

`/archives/metaflash/` contains 55 stable notices: 46 image notices and nine Flash
notices. Related variants and cover thumbnails share a notice; the batch covers
53 image paths and ten SWF paths, including the four identical SWF aliases from
the original usage report. Dewplayer is retained as a downloadable historical
support file, without pretending that the empty audio player is an artwork.
The other nine SWF files can be opened in the shared Ruffle dialog.

The catalogue provides accent-insensitive search, type and collection filters,
lazy image previews, ordered image sets, internal Flash viewers, original-file
downloads and verified links into the historical site. A discreet “Archives
médias” link in the blog footer is the only addition to the historical blog
layout. The fullscreen Metaflash homepage and gallery ordering stay unchanged.
Titles come from published attachment/article metadata or preserved filenames.
Dates, when available, appear next to their associated published article and do
not claim to be artwork creation dates. The obsolete Sirius and Mindcontroller
thumbnails link to their complete three-view cover pages.

No original media payload is copied, renamed or edited. There are 112 generated
files totaling 802,956 bytes: 56 HTML pages, two JSON manifests and 54 previews.
Image previews preserve aspect ratios, fit within 320 × 240 pixels, and contain
no copied EXIF metadata. Flash cards use an explicitly generic Flash symbol;
they do not claim to show a verified movie frame. Animations load when opened
and are destroyed when the dialog closes. Original standalone article playback
continues to use its existing immediate-loading policy.

The reviewed input is `data/media_archive.json`; output and source hashes are
recorded in `docs/media-archive.json`. Generation uses only committed public
files and works without parent backups, WordPress exports or ignored caches:

```sh
rtk proxy .venv/bin/python scripts/generate_media_archive.py
rtk proxy .venv/bin/python scripts/generate_media_archive.py --apply
rtk proxy .venv/bin/python scripts/sync_theme.py
```

The preview command reports planned changes; `--apply` writes them. Repeating
generation after this batch reports zero changes. A pinned Pillow dependency
produces the committed previews. CI checks committed payload hashes and viewer
associations, rather than assuming JPEG encoders produce identical bytes on
every platform.

The source usage audit remains a dated baseline. These 63 paths now have catalogue
references. This batch does not import the 296 source SWFs or 615 source images
whose payloads were absent from that earlier public site. Further import batches
require individual content, duplicate/variant and dependency review. The complete
private master already preserves those files.

## Private preservation master

A complete snapshot of all 1,868 regular files in `backup_ftp/metaflash/` was
created outside the public Git repository, under the workspace's
`preservation/metaflash/2026-11-17/` directory. No archived code was executed.
The original tree was inventoried before and after preservation and remained
unchanged. The original guestbook capture remains separately retained outside
Git; it is not part of this FTP-tree snapshot.

The package contains a gzip-compressed PAX tar archive, an exact path/size/SHA-256
inventory with original modification times and modes, a receipt, and SHA256SUMS.
Verification reads every member without extracting or executing it and compares
its exact payload with the inventory.

| Item | Value |
| --- | --- |
| Preserved files | 1,868 |
| Source payload bytes | 221,711,713 |
| Archive bytes | 207,812,292 |
| Archive SHA-256 | `38af312b5621a1906db485549746cded4a9ce5178577f5b0d4b0cc2833570b82` |
| Inventory SHA-256 | `be942854030ef1ee0173fe3a0f5d736219b5bd7d85403fa87642b4ac7f8b9ab4` |

The raw inventory and archive are deliberately absent from Git and website
output. The second copy is pending an owner-selected destination; the owner
explicitly deferred that decision until the end of implementation. A verified
local package does not establish independent or off-site redundancy.

## Verification and release state

- All 114 Python and 25 JavaScript regression tests pass, including synthetic
  preservation, metadata stripping, wrong-variant rejection, combined filters,
  project-prefix links, complete ordered galleries and original downloads.
- Cold production builds pass at the domain root and `/overstep-website/`.
  Both generated sites retain 491 historical article/attachment pages, 2,639
  comments, 124 recovered Flash associations and four audited article images.
- Site, historical Metaflash and independent archive validators pass at both
  base paths. CI runs the archive validator after Pages path preparation.
- All 350 HTTP responses for the 112 generated files and 63 original media paths
  at both base paths have exact expected SHA-256 values. JPEG and SWF responses
  have appropriate types and real image/movie signatures.
- Chrome checks cover the desktop contact sheet, a 390 × 844 mobile viewport
  without horizontal overflow, search and collection filtering, detail notices,
  complete image-set navigation, Escape cleanup and focus restoration. All nine
  playable Flash files reach the shared player's ready state at both base paths.
  This checks loading, not an exhaustive visual, sound or ActionScript acceptance
  review of every animation and hotspot.
- No new article, comment identity, feed entry or historical gallery item was
  introduced. The 278 restored Metaflash file hashes remain unchanged.

This catalogue batch is local and has not been published. The previous Pages
release remains online. The private master has been fully verified; its second
copy remains the explicitly deferred follow-up.
