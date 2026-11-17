# Metaflash FTP preservation and usage audit

Reviewed on 2026-11-16 against deployed commit
`69ab7efb79d6e725ff54a5a378c9caa4fb571f33`.

Follow-up: the [2026-11-17 homepage/gallery restoration](2026-11-17-metaflash-restoration.md)
adds a selected local Metaflash section and recovers Anterak. The counts below
describe the original deployed baseline and are intentionally preserved; they
do not include that subsequent, not-yet-pushed restoration.

## Result

**The complete `backup_ftp/metaflash` directory has not been migrated into Git or
the published Hugo site.** The current project preserves the WordPress blog and
selected references into the older portfolio, rather than the entire Metaflash
website.

- The local FTP directory contains **1,868 files**, totaling **221,711,713 bytes
  (211.44 MiB)**, with **1,845 distinct SHA-256 payloads**.
- **198 source file paths (10.60%)** have byte-identical copies in the current Git
  tree and generated public output. They represent **197 distinct payloads/URLs**:
  `day15.swf` and `40jours/day15.swf` are identical source copies of one movie.
- **One additional source page**, `charbonnerie.html`, has a verified adapted
  version. Thus **199 source files** have either exact copies or this reviewed
  page adaptation. `40jours/reglement.htm` is also reviewed, but its output already
  matches its source bytes and is included in the 198 exact matches.
- **1,669 files** have neither an exact standalone Git copy nor a verified page
  adaptation. This does not mean 1,669 works were lost: many are wrappers,
  thumbnails, variants, authoring files or supporting materials.
- **197 source files** have exact copies reached through the generated site's
  static reference graph. One more exact copy is deployed without a detected
  incoming reference. Dynamic Flash behavior remains a separate question.

All 1,868 source files were still present at the end. Their sizes, modification
times and SHA-256 values were unchanged. No independent/off-device backup was
verified; the existence of this local directory does not establish one.

## Coverage by file type

Counts below refer to physical source paths, including duplicate payloads.
“Usage found” means a byte-identical destination reached through literal
HTML/CSS/SWF references and the reviewed menu configuration; it does not mean
browser rendering or playback was tested for every file.

| Source type | Source files | Exact copies in Git/output | Usage found | No exact copy |
| --- | ---: | ---: | ---: | ---: |
| JPEG | 812 | 97 | 96 | 715 |
| HTML/HTM | 550 | 1 | 1 | 549 |
| SWF | 454 | 100 | 100 | 354 |
| GIF | 35 | 0 | 0 | 35 |
| FLA authoring files | 3 | 0 | 0 | 3 |
| MP3 filenames | 3 | 0 | 0 | 3 |
| MPEG videos | 2 | 0 | 0 | 2 |
| ZIP filenames | 2 | 0 | 0 | 2 |
| PDF | 1 | 0 | 0 | 1 |
| PNG | 1 | 0 | 0 | 1 |
| RAR | 1 | 0 | 0 | 1 |
| WAV | 1 | 0 | 0 | 1 |
| XML | 1 | 0 | 0 | 1 |
| Server/OS metadata without an extension | 2 | 0 | 0 | 2 |
| **Total** | **1,868** | **198** | **197** | **1,670** |

The extra adapted Charbonnerie page is not counted as an exact HTML match.
Filename suffixes are not reliable payload identification: `master.zip` is an
MP3 payload, byte-identical to `master.mp3`, rather than a ZIP archive. The three
FLA files have OLE/Flash authoring-file signatures.

## Coverage by source directory

The root row excludes subdirectories; the other rows include their descendants.

| Directory | Files | Exact copies | Usage found |
| --- | ---: | ---: | ---: |
| Root files | 643 | 11 | 11 |
| `40jours/` | 622 | 177 | 176 |
| `gif/` | 148 | 0 | 0 |
| `flash/` | 124 | 1 | 1 |
| `images/` | 96 | 0 | 0 |
| `photoshop/` | 58 | 0 | 0 |
| `illustrations/` | 39 | 0 | 0 |
| `photocats/` | 39 | 9 | 9 |
| `thumb/` | 31 | 0 | 0 |
| `eros/` | 28 | 0 | 0 |
| `cadre/` | 24 | 0 | 0 |
| `transfert/` | 8 | 0 | 0 |
| `_notes/` | 8 | 0 | 0 |

In particular, none of the **39 JPEGs in `illustrations/`** or **28 JPEGs in
`eros/`** has an exact copy in Git/output. The current Illustrations category,
Eros selection and Galerie page provide navigation into migrated blog material;
they are not a complete reconstruction of the original portfolio collections.

Directory names do not determine editorial value or privacy. `_notes/` contains
seven JPEGs as well as tool metadata; `transfert/` contains six JPEGs, a WAV and
a FLA. They were inventoried without publishing their contents.

## Wrappers, adaptations and variants

Of the 550 HTML/HTM source files, **380 reference at least one local SWF** through
object/embed markup. For **98 of these wrappers**, all referenced movie payloads
are already present in Git and statically reached in the Hugo output. Their HTML
wrappers need not be copied unchanged to preserve those movie payloads. This is
not proof that every original wrapper URL, layout or interaction was retained.

Exact copying and source provenance are distinct: matching bytes establish that
the payload is preserved, even if the migration actually recovered it from the
WordPress FTP tree rather than this Metaflash directory.

The two explicitly reviewed legacy-page recoveries are:

- `40jours/reglement.htm` → `/40jours/reglement.htm`, byte-identical.
- `charbonnerie.html` → `/charbonnerie.html`, adapted by the reviewed page helper;
  its nine referenced gallery images are preserved.

The original Metaflash `index.swf`, `index3.swf`, `thedance.swf` and portfolio
indexes are not recovered as complete portfolio experiences. Their presence in
the FTP backup must not be confused with availability in the published site.

**48 unmatched source files have a basename also found in the output, with
different bytes**: 34 JPEGs, 12 SWFs and two HTML files. A basename-only comparison
would therefore overstate coverage. These are collision/variant candidates, not
evidence that the current WordPress recovery selected the wrong version.

The 12 SWF candidates are `40jours/J24.swf`, `J25.swf`, `J27.swf`, `J28.swf`,
`day6.swf`, `day9.swf`, `derniere.swf`, `jour-2.swf`, `jour-26.swf`, `jour-37.swf`,
`jour-38.swf` (all under `40jours/`), and root `totem.swf`. Keep the exact variants;
do not overwrite the reviewed current assets by filename.

## Concrete follow-up findings

1. **A source-backed animation remains linked through the offline historical
   host.** `/2006/05/08/choc-technologique/` still links to
   `http://metaflash.fr/anterak.html`. The FTP wrapper embeds `anterak.swf`, a
   479,093-byte movie absent from Git/output. Its SHA-256 is
   `d3f7a3d8e39ffce9a6005d051c3f9e0feaa1bee236940c7939ddf620628503ef`.
   This is a concrete recovery candidate for an existing article, outside the
   earlier inventory of 124 dropped object/embed associations.
2. **The old season catalog remains an external dependency.**
   `/2011/07/06/jour-40-la-force-collective/` still links to
   `http://metaflash.fr/40jours.html`. The totem mapping now opens the migrated
   category, but this prose link still points to the historical host. The backup
   contains the catalog and its referenced files; the full original catalog has
   not been recreated locally.
3. **Editable originals and standalone assets remain outside Git.** These include
   `flash/dje.fla`, `flash/warning.fla`, `transfert/day15.fla`, the three MP3-named
   files, the WAV, both MPEG videos and the 27,046,053-byte PDF. Preserve a complete
   independent archive before choosing what belongs on the public site. A missing
   Markdown reference is not grounds to discard audio or authoring material.
4. **One exact deployed image has no detected usage.**
   `40jours/20_40days.jpg` matches
   `/wp-content/uploads/2011/dotclear/20_40days.jpg` (237,334 bytes), but no incoming
   literal reference was found. It remains available over HTTP. The audit does
   not recommend deleting it: dynamic loading and earlier thumbnail substitutions
   are separate considerations.

## Wayback evidence supplied by the owner

The owner reports that the historical host is offline and supplied the
[2023-02-04 homepage capture](https://web.archive.org/web/20230204150433/https://metaflash.fr/).
Both its replay and original archived HTML were retrieved successfully. The
captured homepage embeds `index.swf`.

Requesting that movie through the capture resolved to a
[2020-05-21 movie capture](https://web.archive.org/web/20200521220158id_/http://metaflash.fr/index.swf).
It returned a valid SWF payload of **343,724 bytes**, exactly matching FTP
`index.swf`, SHA-256
`b605d58cf0f005f080b1fd8eddb3bcef1a5a70c569ac74352e183c6b157148ad`.
That original homepage animation is locally preserved in FTP but absent from
Git and the deployed site.

The archived Anterak wrapper resolves to a
[2022-05-18 capture](https://web.archive.org/web/20220518172031id_/https://metaflash.fr/anterak.html)
and still names `anterak.swf`. Its HTML bytes differ from the FTP wrapper. A
request for the SWF at that capture returned HTTP 404; this was not an exhaustive
search of all archived asset URLs. The complete SWF payload is available locally.

The archived season catalog resolves to a
[2022-10-07 capture](https://web.archive.org/web/20221007032402id_/https://metaflash.fr/40jours.html).
Its HTML differs from the FTP copy, but **all 402 literal local attribute targets**
found in that archived catalog exist in the FTP inventory. This demonstrates
strong backup coverage for that catalog, not equivalence of all site versions.
The archived homepage also references `liens.html`, absent from this FTP inventory,
and Cloudflare-generated email-protection endpoints, which are not ordinary
standalone portfolio assets.

Wayback can therefore support further recovery and presentation checks. A
homepage capture does not establish that every dependent asset was captured, and
the actual timestamps above show that a replay can combine different dates.
No archived JavaScript or SWF was executed during this audit.

The attempted `liens.html` replay also returned HTTP 404, resolving to a
2021-03-10 capture. No exhaustive search of other captures was performed.

## Verification, method and deliverables

- Every source file was SHA-256 indexed, including duplicate paths. Git comparison
  covered all current tracked regular files and all locally reachable Git history.
  The historical check found no additional standalone exact copies beyond the
  current 198 matches. Archive members and unavailable Git objects were not audited.
- A fresh Hugo 0.165.0 production build used the deployed project base URL,
  followed by `prepare_pages.py`. Validation passed: 491 historical pages,
  2,639 comments, 124 recovered Flash associations, four audited inline images
  and zero missing local destinations. Those blog invariants do not establish
  complete Metaflash portfolio preservation.
- Literal reference analysis covered HTML attributes, CSS URLs, decompressed
  FWS/CWS movie strings and reviewed menu mappings. All source/output SWFs in the
  scan were readable. Synthetic checks covered Unicode/spaces, directory URLs,
  missing targets, scoped article references, graph cycles and compressed SWFs.
- **198 public URL fetches passed status/content-type and exact SHA-256 checks**:
  197 unique exact-copy destinations plus the adapted Charbonnerie page. Responses
  comprise 99 SWFs, 97 JPEGs and two HTML pages. No downloaded asset was substituted
  with an HTML error page. Browser rendering/audio playback was not tested here.
- Full per-file JSON/CSV evidence and read-only audit helpers remain ignored under
  `migration/cache/metaflash-audit/`. `coverage.csv` contains one row per source
  file, its SHA-256, current/historical Git destinations, generated paths, detected
  references, adaptations and same-basename candidates. `public-http.json` records
  every public payload check. Raw archived responses remain in the same cache.

For review in a spreadsheet, `files.csv` provides all 1,868 paths with a simpler
status column; `missing-movies.csv` isolates the 354 SWFs without exact Git copies.
These use UTF-8 with BOM and semicolon separators. The file-level status partition
is 197 exact referenced copies, one exact copy without detected usage, one adapted
page, 98 wrappers for already preserved movie payloads, and 1,571 remaining files
without an exact copy, reviewed adaptation or this wrapper/movie correspondence.
The wrapper status does not assert preservation of its original page presentation.

This report is the public-safe summary. The complete raw inventory is intentionally
not added to the public repository. No backup, site content, publication setting,
or historical audit finding was modified as part of this investigation.
