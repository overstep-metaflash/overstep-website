# Media usage after the Metaflash release

Reviewed on 2026-11-17 against content commit
`7e2ad35e44ca87aa49dc36112afe05aca6077654`.

## Publication verification

The owner-requested release was published successfully through
[GitHub Actions](https://github.com/overstep-metaflash/overstep-website/actions/runs/44055042969).
Both build and deployment jobs passed. The live homepage at
<https://overstep-metaflash.github.io/overstep-website/metaflash/>
rendered its viewport-filling movie without a toolbar. Twelve live payloads
matched their expected SHA-256 values: homepage, gallery, client manifest,
guestbook, repaired homepage SWF, Anterak and all six full-size Sirius/MC1 images.
A genuine gallery click opened Sirius in the live internal viewer without
leaving the gallery URL; its first image decoded at its original 400-pixel width.

## Files remaining in the Metaflash backup

The complete `backup_ftp/metaflash` media inventory contains **1,302 physical
SWF/image paths**, representing **1,282 distinct payloads**. This report does not
re-inventory the other FTP backup trees or the complete WordPress installation.

| Source files | Total | Used exact copies | Used reviewed adaptation | Present without detected use | Not imported |
| --- | ---: | ---: | ---: | ---: | ---: |
| SWF | 454 | 157 | 1 | 0 | **296** |
| Images | 848 | 228 | 0 | **5** | **615** |
| Total | 1,302 | 385 | 1 | 5 | **911** |

“Not imported” means no byte-identical payload exists in the generated site,
after accounting for the separately verified homepage movie repair. It does
not mean 911 distinct new works: the 296 missing SWF paths contain 290 distinct
payloads, and the 615 image paths contain 604. Alternate versions, thumbnails,
different encodings, resized copies and duplicate source paths can represent
artwork already shown in another form.

The remaining SWFs comprise 192 root files, 75 under `flash/`, 25 under
`40jours/`, two under `gif/` and two under `images/`. Examples include
`absynth.swf`, `alkemia.swf`, `away.swf`, `croquis.swf` and older movie variants.

Remaining images include 218 files under `40jours/`, all 39 under
`illustrations/`, all 28 under `eros/`, 92 under `images/`, 63 under `gif/`,
23 under `photoshop/`, and other thumbnails/supporting illustrations. Directory
names are not publication approval or evidence of editorial value. The existing
blog collections do not amount to a full reconstruction of those source trees.

The five source images already present without detected use are the four former
Sirius/MC1 navigation thumbnails (`back1.jpg`, `backmc1.jpg`, `interieur1.jpg`,
`interior1.jpg`) and `40jours/20_40days.jpg`. The cover thumbnails were replaced
in the viewer by the correct full-size face/interior/back sets; their original
files remain preserved.

## Files already published without a detected reference

Across the complete generated site, independently of source-folder provenance:

| Public media | Referenced paths | No detected reference | Extra unreferenced copies of a used payload |
| --- | ---: | ---: | ---: |
| SWF | 256 | **6** | 4 |
| Images | 498 | **53** | 0 |

The six SWFs are:

- `theme/step/liens.swf`
- `wp-content/uploads/2011/09/invocation.swf`
- `wp-content/uploads/2011/dotclear/son/dewplayer.swf`
- `wp-content/uploads/2014/03/nahmbird.swf`
- `wp-content/uploads/2014/05/journey.swf`
- `wp-content/uploads/2016/02/farfaraway.swf`

The four additional unreferenced SWF paths have exact payloads used at other
URLs, so they are duplicate copies rather than four absent works. The 53 images
include old theme artwork, former navigation thumbnails and article media that
can have been intentionally replaced by Flash. These are review candidates;
this audit does not recommend automatic deletion or blanket restoration.

`docs/media-usage-2026-11-17.json` lists every unreferenced public file with its
size, hash and classification. Detailed source paths and the complete read-only
inventory remain local under the ignored `migration/cache/metaflash-audit/`:

- `2026-11-17-usage.json`: full source/public reconciliation.
- `2026-11-17-not-imported.csv`: the 911 source media paths not imported.
- `2026-11-17-unused-public.csv`: 59 public files with no detected references,
  plus the four byte-identical SWF copies identified separately.
- `2026-11-17-release-http.json`: the twelve live deployment payload checks.

The CSV files use UTF-8 with BOM and semicolon separators.

## Method and limits

Every source/output media file was SHA-256 indexed. The homepage reference graph
covers HTML resource/link attributes and source sets, CSS URLs, decompressed
FWS/CWS literal strings, reviewed navigation rewrites and only those internal
Flash/image-viewer entries actually linked or embedded in rendered pages. A
manifest entry by itself does not count as use. All original selected media
bytes and timestamps remained unchanged during the audit.

Synthetic checks covered popup-only image paths, dynamic movie associations,
movie-local dependencies, unused manifest entries, exact payloads under different
names and the reviewed homepage adaptation. All scanned SWFs were readable.
Declared `menu.htm`/`menu.html` aliases were reconciled with their reviewed
gallery destination; no remaining reachable local SWF literal was unresolved.

This establishes detected references, not execution of every branch or audible
playback. Runtime-generated URLs can evade a static graph. Therefore “no detected
reference” is a candidate status, not proof that deleting a file is safe. Existing
browser/audio acceptance boundaries and deliberately retained variants remain in
the earlier restoration reports. No archive media was deleted or bulk-published
as a side effect of this audit.
