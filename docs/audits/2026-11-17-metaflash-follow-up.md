# Metaflash guestbook recovery and layout follow-up

Implemented locally on 2026-11-17 after the initial homepage/gallery restoration.
This follow-up supersedes its placeholder guestbook and toolbar layout. No push,
deployment, DNS change or modification of the original backups was performed.

## Guestbook cleanup

The owner supplied `Mon Livre d'Or.html`, 51,095 bytes, SHA-256
`439f3083b8d65f7339f44b2aa88b7f0cb6f15013a89acbc781c8a9b6eac3ec0b`.
It contains 290 dated guestbook entries plus a copyright footer. The original
file remains outside the repository and was verified unchanged after recovery.

| Outcome | Entries |
| --- | ---: |
| Retained | 19 |
| Removed empty messages | 223 |
| Of those empty messages, authored “Anonyme” | 108 |
| Removed reviewed spam | 48 |
| Total original entries | 290 |

Empty entries include Unknown and named accounts as well as Anonyme. No visible
message content is lost by removing them. Spam decisions were reviewed per entry:
pharmacy and pornographic advertisements, unrelated commercial/financial
promotion, automated link dumps and guestbook form probes. Generic greetings
without identifiable advertising remain. Artist names, adult-themed artwork,
French prose and legitimate discussion of spam are not keyword-filtered away.

Public review decisions contain source positions and reason categories, without
spam bodies, IP addresses or private headers. They are pinned to the complete
source hash; importing changed input fails until it is reviewed again. Source
positions are stable archival anchors, not invented original database IDs.

- `docs/metaflash-guestbook-review.json`: reviewed source identity and spam IDs.
- `docs/metaflash-guestbook-cleanup.json`: counts and removed-position inventory.
- `data/metaflash_guestbook.json`: retained names, dates and message text only.
- `scripts/metaflash_guestbook.py`: pure parsing/moderation/rendering functions
  and an optional workspace recovery command. The default mode previews counts;
  `--apply` writes only the reviewed safe data and cleanup report.

Only the timestamp is extracted from each original date/IP header. Address data
is never retained in the safe record schema. IPv4/IPv6 literals in names or bodies
are also redacted. Verification found no original source IP value in the public
data, rendered page or review evidence. Raw HTML, browser-extension markup and
scripts are not copied. Author/body text is escaped during rendering; URLs stay
plain text as in the supplied source. No form or guestbook backend is restored.

Mixed UTF-8 and legacy CP1252 bytes are decoded without turning valid UTF-8 names
into mojibake. Names, original displayed dates, source order and meaningful
message paragraphs remain. `/metaflash/guestbook.html` now displays all 19 retained
entries and is reached through the original homepage's guestbook button. These
entries are separate from the blog's 2,639 archived comments.

## Owner-requested layout changes

- The homepage player fills the browser viewport, without a toolbar or page
  margins. Chrome measured a 1,200 × 806 player at position 0,0 in a viewport of
  exactly those dimensions, without document overflow. Movie proportions remain
  controlled by Ruffle; this does not invoke the browser's operating-system
  fullscreen mode.
- The global toolbar and redundant blog link are removed. The gallery retains
  the blog link already present in its original body. Other standalone pages
  provide simple home/gallery return links within the body.
- “Accueil Metaflash” is placed inside the gallery's original blue header cell.
- Anterak is a normal first gallery row with the exact FTP `gif/anterak.jpg`
  thumbnail and the same internal viewer as other simple movie destinations.
- The homepage SWF's GetURL contact value itself is changed to
  `mailto:lastep.fr@gmail.com`, in addition to the reviewed JavaScript routing.
  The old contact value is absent from the repaired movie payload. Artwork,
  internal frame actions and the backup movie are unchanged.

The selected section now comprises 278 files, 34,634,618 bytes, including 81 HTML
pages, 61 SWFs, 133 JPEGs, one GIF and two client manifests. The FTP source
inventory covers 274 selected paths; guestbook provenance is recorded separately.
`docs/metaflash-recovery.json` records the current output hashes and safe
guestbook data digest.

## Validation

- 97 Python tests and 22 JavaScript tests passed. New regressions cover mixed
  encoding, IPv4/IPv6 removal, empty anonymous/named messages, conservative spam
  review, immutable source hashes, a complete partition of all 290 entries,
  escaped rendering, missing output/evidence, full-screen homepage markup,
  gallery navigation and idempotent compiled contact replacement.
- Both root and project-prefix production builds and original site validations
  passed. Pages preparation ran again after the final prefix build. Blog page,
  comment, Flash-association and image invariants remained intact.
- `validate_metaflash.py` passed on both outputs, checking all 278 exact files,
  local links, player associations and the actual guestbook HTML against its
  reviewed safe archive. CI needs neither the private backup nor the raw
  guestbook capture. Re-running both recovery transformations produced zero
  changes.
- All 556 local root/project-prefix HTTP payloads matched their final recorded
  SHA-256 values. Raw HTTP evidence remains ignored under
  `migration/cache/metaflash-audit/restoration-http.json`.
- Chrome verified the viewport-filling homepage, absent toolbar, home link inside
  the gallery header, current gallery contact, and Anterak's ordinary gallery-row
  modal. A genuine click on the full-screen homepage's guestbook hotspot opened
  the recovered page, which displayed 19 messages and no IP literal. Header
  navigation also retained the project prefix.
- Theme synchronization and whitespace checks passed. Gitleaks reported no
  secrets in the public data or generated portfolio text. This does not claim
  exhaustive audio/interaction acceptance for every historical movie, and no
  external mail application was launched during tests.

## Compact gallery header refinement

The owner subsequently approved a single compact blue header and requested
“Blog” on image hover. The gallery recovery now replaces only the old header
cell's nested tables and spacer paragraphs with the original animated logo,
an unobtrusive home link and the centered blog image. Obsolete table/cell heights
are removed from this gallery, while image and movie dimensions remain intact.
The intermediate white stripe and the redundant “blog --->” text are removed.

The blog image is 280 pixels wide and retains its exact original payload. A
“Blog” label appears on hover or focus; touch devices display it persistently.
The link has the accessible name “Blog” and keeps its prefix-aware blog-root
destination. Other gallery artwork, captions, credits and movie destinations
remain unchanged.

Chrome measured the new header at approximately 307 pixels high, with the first
two animation rows visible in the initial 806-pixel viewport. Hover and focus
both displayed the label. All images loaded successfully. The regression suite
now contains 98 Python tests; both production builds and all root/project-prefix
site and portfolio validations passed. The two updated gallery HTTP responses
matched the regenerated manifest hashes. Earlier byte totals above describe
the version before this refinement; `docs/metaflash-recovery.json` remains the
current exact inventory.

## Image dialogs and section spacing

The owner requested the same internal viewer for photographs and illustrations,
with particular care for multi-image Photoshop pages. There are now 16 image
sets containing 36 full-size images: the 15 cat photographs, three direct
illustrations, ten single-image works, two single-image Photoshop works, and
the two three-view cover sets.

The image viewer shares the native dialog with Flash, supports previous/next
buttons and arrow keys, displays captions and position, and closes with Escape
or the close button. It retains the gallery URL and restores focus to the
original thumbnail. Switching from a movie to an image destroys the movie first.
Image loading responses received after closing cannot recreate dialog content.
Only reviewed image URLs are assigned to DOM image elements; archived page HTML
is not inserted into the dialog.

The complete cover associations are:

| Set | Face | Interior | Back |
| --- | --- | --- | --- |
| Sirius | `photoshop/sirius_front.jpg` | `photoshop/interior.jpg` | `photoshop/back.jpg` |
| MC1 | `photoshop/mc.jpg` | `photoshop/interieur.jpg` | `photoshop/backmc.jpg` |

The old thumbnail files (`interior1.jpg`, `interieur1.jpg`, `back1.jpg`,
`backmc1.jpg`, etc.) are not substituted for those complete images. Each child
page opens the correct starting view within its complete set. Standalone image
pages retain all full-size works as an accessible fallback and can open the same
dialog. Invisible menu links/image-map hotspots have been removed from the
artwork; visible home/gallery return links remain on standalone pages.

`scripts/metaflash_images.py` derives direct image order from the gallery and
uses separately reviewed cover-page relationships. `docs/metaflash-recovery.json`
now records every set's exact ordered image paths. The output validator compares
these with the client manifest, checks all files and image-link indices, and
requires every fallback image page to retain its complete set.

The obsolete run of 21 line breaks after the final Flash row is removed. Chrome
measured approximately 59 pixels between that table and the cat table in the
final output, replacing the large blank region. Gallery artwork and credits are
preserved.

During this review, two individually identified hidden advertising spans were
found in `dragonhunter.html` and `rainbow.html`. Only those exact reviewed spans
are removed; their artwork and remaining content remain. Their now-clean simple
Flash wrappers correctly open internally, bringing the movie destination count
to 57. This is a source cleanup, not a change to the SWF payloads or original
backups.

104 Python and 23 JavaScript tests passed, including incomplete/missing image
sets, separate similarly named cover files, source order, captions, image
navigation, stale responses, movie shutdown, project prefixes and preservation
of artist/music text. Both cold production builds and their original site and
portfolio validators passed after Pages preparation. Chrome verified the cat
viewer and both complete cover sets, including Sirius's 400/793/503-pixel images
and MC1's 400/800/512-pixel images; the latter used the project prefix. These are
natural decoded widths, not thumbnail or viewport dimensions. Closing restored
focus and preserved the gallery URL. No new deployment was performed.
