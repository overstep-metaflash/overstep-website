# Complete review and local preparation of the remaining FTP media

The owner requested preparation of the 911 source media paths absent from the
previous public site after the archive/audio release. The original inventory in
`2026-11-17-media-usage.md` remains a dated baseline; it has not been overwritten.
This batch is prepared locally and has not been published.

## Complete accounting

All 911 input paths were SHA-256/size checked against their exact immutable source
variants. No archived PHP, JavaScript or other source program was executed.
All 604 distinct source image payloads were reviewed using ten private contact
sheets. Stage dimensions were read from the SWF bytes. Decisions are pinned in
`data/metaflash_ftp_review.json`; public-safe coverage is recorded in
`docs/metaflash-ftp-catalogue.json`.

| Source kind | Total paths | Included paths | Held privately | Distinct included payloads |
| --- | ---: | ---: | ---: | ---: |
| Images | 615 | 594 | 21 | 583 |
| SWF | 296 | 292 | 4 | 286 |
| Total | **911** | **886** | **25** | **869** |

The 17 byte-identical duplicate paths share assets with complete provenance.
Reviewed image families and variants are grouped, yielding **751 new notices**.
Together with the existing 54 notices, the local catalogue has **805 notices**
and **931 consultation payload paths**. Every included source path is associated
with its exact asset and notice; none is satisfied merely by a manifest entry.

The 25 held items include personal/family photographs, an administrative document,
screenshots and related private photo movies. Six source photographs carry GPS
metadata. Their payloads, filenames and raw metadata remain outside public Git
and static output. Public evidence records anonymous decision identifiers, type
and private status, not the withheld filenames or payload hashes. Exact private
aliases are suppressed even if another source path requests inclusion.

The owner-review index outside Git accounts for **all 911 paths**, including the
25 private items. It contains a searchable HTML table, CSV inventory, private
previews and exact original private downloads under the workspace's
`preservation/metaflash/2026-11-17/catalogue-review/` directory. It must not be
copied into the public repository or deployed site. The other 886 paths link to
their locally prepared public notices.

## Preservation and consultation copies

New media URLs below `/archives/metaflash/media/` use the immutable source SHA-256
as a stable identifier. Notices preserve source names/hashes and separately record
the actual consultation-copy hash. Original article,
gallery and homepage URLs remain unchanged. Only reviewed media are copied;
legacy HTML wrappers, scripts, WordPress data, PHP and executable ZIPs are absent.

Forty-five public JPEG consultation copies have EXIF/XMP/IPTC/comment metadata
removed. The JPEG transform preserves compressed image scan data and color
profiles; a non-default orientation is normalized before stripping if required.
The tests verify unchanged decoded pixels for the lossless path. Adapted download
labels explicitly describe a metadata-free consultation copy, with the original
retained privately. Other media retain exact original bytes. The 869 new payloads
total 77,897,568 bytes; generated catalogue files total 6,438,024 bytes.

The full preservation archive still contains all 1,868 original FTP files. An
idempotent preservation run rechecked the full source inventory and every archive
member; its archive and inventory checksums remain unchanged:

- Archive: `38af312b5621a1906db485549746cded4a9ce5178577f5b0d4b0cc2833570b82`.
- Inventory: `be942854030ef1ee0173fe3a0f5d736219b5bd7d85403fa87642b4ac7f8b9ab4`.

The new local views are not an independent second preservation copy. That
separately deferred destination decision remains unchanged.

## Catalogue behavior

The collection filter includes 40 jours, Illustrations, Animations, Eros,
Pochettes and site elements, in addition to the earlier blog collection. Names
come from source filenames or reviewed families; no artwork dates or article
associations were invented. Source-image variants remain in the catalogue while
the original articles retain their chosen Flash players.

Search covers all 805 notices, including notices outside the current page. The
JavaScript display uses 48 cards per page and resets pagination when filters
change. Without JavaScript, every static notice and download remains linked.
Thumbnails load lazily and movies start only when their internal viewer opens.
Ordered image sets retain every variant. The viewer is destroyed on closing and
returns focus to its originating link.

## Reproduction and verification

In the original workspace, with the immutable source tree and ignored inventory:

```sh
rtk proxy .venv/bin/python scripts/prepare_ftp_catalogue.py --inventory migration/cache/metaflash-audit/2026-11-17-not-imported.csv --source-root ../backup_ftp/metaflash
rtk proxy .venv/bin/python scripts/prepare_ftp_catalogue.py --inventory migration/cache/metaflash-audit/2026-11-17-not-imported.csv --source-root ../backup_ftp/metaflash --apply
rtk proxy .venv/bin/python scripts/generate_media_archive.py --apply
rtk proxy .venv/bin/python scripts/sync_theme.py
```

Both preparation and generation report zero planned changes after applying.
Normal builds, regression tests and output validation use only committed
public-safe evidence, media and synthetic fixtures; they require no private
backup, source export, contact sheet or owner-review index.

- **129 Python and 26 JavaScript tests pass**, including exact duplicate grouping,
  complete source accounting, private-alias suppression, metadata removal,
  source-variant rejection and pagination across filtered results.
- Cold root and project-prefix builds and all four output validators pass.
  Historical coverage remains 491 content pages, 2,639 comments, 124 recovered
  Flash associations and four audited article images. The 278 historical
  Metaflash file hashes and the 15 reviewed article audio associations still pass.
- All **4,752 HTTP payload checks** match exact hashes at both base paths, with
  real JPEG/SWF signatures and appropriate response types.
- Chrome loads **all 286 new unique public SWFs** to the player's ready state,
  closing and destroying each viewer. No movie starts on catalogue browsing.
  This is loading acceptance, not exhaustive sound/animation or legacy-hotspot
  acceptance; obsolete embedded links are not claimed to have been restored.
- Browser checks cover 48-card pagination, collection filtering and a 390-pixel
  mobile viewport without horizontal overflow. All four Entity image variants
  decode at their recorded dimensions; closing clears the viewer and restores
  focus. An earlier isolated browser tab was closed during review; subsequent
  checks completed in a fresh background context.

The [archive/audio release](../releases/2026-11-17-archive-audio.md) remains live.
The 805-notice catalogue described here is local preparation for a later release.
