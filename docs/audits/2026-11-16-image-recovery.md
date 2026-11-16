# Article image recovery

Reviewed on 2026-11-16 for issue #3. The original
[content audit](2026-11-16-content.md) and its JSON inventory remain unchanged.

## Restored associations

| Article | Existing public image | Change |
| --- | --- | --- |
| `/2007/06/06/sens-interdit/` | `/wp-content/uploads/2011/dotclear/sens interdit.jpg` | Delimit the Markdown destination; retain the following `80X60 cm` caption and line break. |
| `/2008/07/31/manque-de-ressources/` | `/wp-content/uploads/2011/dotclear/dofus_moustache mufafah.jpg` | Delimit the Markdown destination. |
| `/2008/09/25/fanart/` | `/wp-content/uploads/2011/dotclear/ticado step.jpg` | Delimit the Markdown destination. |
| `/2012/04/28/jour-13-les-yeux-de-la-ruche/` | `/wp-content/uploads/2012/04/saison6_131-1024x576.jpg` | Restore the source image element and its link to `/wp-content/uploads/2012/04/saison6_131.jpg`. |

The last association was reviewed against published post 2496 in
`step.WordPress.2026-11-15.xml`. Its image has an empty alt attribute, the title
`Les yeux de la ruche`, displayed dimensions of 640 × 360, and a full-size link
opening a new tab. The source contains no separate image caption. The restored
element preserves these settings, uses local media URLs, and adds `rel="noopener"`.

All four JPEG payloads already existed in `static/` and match the SHA-256 evidence
in the original audit. No public media file was renamed, replaced or added.
Front matter and surrounding prose remain intact. The 29 deliberate
thumbnail-to-Ruffle changes and the ten already rendered byte-identical aliases
were not restored as additional images.

## Regression coverage

`scripts/article_images.py` derives the expected associations directly from the
audit's two confirmed missing-image classifications. XML and snapshot records
are deduplicated by article and SHA-256, using the audited public-file mappings.
The seven findings therefore require exactly four article/image associations.
Missing hash evidence is an error.

`scripts/validate_site.py` verifies each reviewed article's identity, exactly one
real image inside `.entry-content`, the build's path prefix, and the exact bytes
of the referenced output file. A sidebar image, download link, broken Markdown
text, duplicate image, missing file or incorrect payload cannot satisfy it.
Missing article sources are also rejected.

Five regression tests cover the real public article Markdown rendered by pinned
Hugo 0.165.0, a synthetic filename containing spaces and accents, both build
prefixes, audit alias deduplication, and validator failure when a file exists
without its article image. Tests require no private backups.

## Verification

- 72 Python tests and seven JavaScript tests passed.
- Theme synchronization and all 2,639 sanitized comments passed validation.
- Root-domain and `/overstep-website/` production builds passed with
  `--panicOnWarning`.
- Both output validations reconciled 491 historical pages, 2,639 comments,
  124 Flash associations and the four restored images. The five existing
  unresolved legacy destinations remain recorded separately.
- Both generated outputs were served from local-only HTTP servers. Each of the
  eight article requests returned HTTP 200 with the intended real `img` element.
  Each referenced image returned HTTP 200, `image/jpeg`, a JPEG signature and
  the audited SHA-256. The four payloads were also identified as JPEG images
  with their expected intrinsic dimensions (551 × 747, 487 × 545, 540 × 731,
  and 1024 × 576 respectively).

Browser decoding and visual acceptance remain pending. Chrome DevTools could not
start because Google Chrome was absent. The owner authorized installing Chrome
with Homebrew, but `brew install --cask google-chrome` could not create its lock
under `/opt/homebrew/var/homebrew/locks/` (operation not permitted). Browser
inventory access was unavailable and native Zen access was denied. HTTP and
build verification are not a claim of browser visual acceptance.

No deployment or DNS change was performed. The existing publication gates remain
disabled.
