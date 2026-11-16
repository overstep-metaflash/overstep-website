# External artwork recovery

Reviewed on 2026-11-16 for [issue #5](https://github.com/overstep-metaflash/overstep-website/issues/5).
Both original files are recovered locally. The original
[content audit](2026-11-16-content.md) and its JSON inventory remain unchanged.
Public provenance, dimensions, byte counts and checksums are recorded in
[the recovery manifest](../external-image-recovery.json).

## Source review and identity

Both references are **links to artwork**, not embedded images. The published XML,
saved article HTML and current Markdown agree on this distinction. Keep the
`BD-strip` and `[O]` links, their surrounding attribution and the `Vista` title;
do not add new inline artwork or replace the existing Flash players.

### Maliki — La peur du vide

- Article: `/2006/03/25/jour-20-cadavre-exquis/`, post 1910.
- Original link: `http://maliki.com/strips/strip_lapeurduvide.jpg`.
- Current requests were repeated: HTTPS returns 404 HTML; HTTP returns 200 HTML.
  Neither response was accepted as artwork.
- The [official artist page](https://maliki.com/strips/la-peur-du-vide/)
  identifies strip 75, dated March 20, 2006. Its current artwork is split into
  three differently named JPEGs (`060320_lapeurduvide_1.jpg` through `_3.jpg`).
  The first is 769 × 1060. These were not substituted or stitched together.
- The backup contains `strip_lapeurduvide.psd` in the old Dotclear images and
  WordPress Dotclear uploads: 744 × 1720, not the full original linked JPEG.
  The differently named `maliki.jpg` (78 × 78) and `maliki_step.jpg` (536 × 501)
  also do not establish identity with that file. None was substituted.
- The [April 11, 2006 archive capture](https://web.archive.org/web/20060411124056id_/http://www.maliki.com:80/strips/strip_lapeurduvide.jpg)
  returns the original JPEG: 744 × 3452, 782,305 bytes. Visual inspection confirms
  the complete 72-panel strip and the Maliki signature.
- The archive CDX SHA-1 is `ZJOZ73R7TADYEL3IZD2OBTKQVRAY2L5U`, exactly matching
  the retrieved payload. SHA-256:
  `866cd1e9ef685284f3ed59cfbf465a5e627fe945fbcf8872639499b58e136616`.
- Local link: `/recovered/maliki/strip_lapeurduvide.jpg`.

### iamamiwhoami — Vista

- Article: `/2014/04/29/vie-deracinee/`, post 3247.
- Original link:
  `http://www.towhomitmayconcern.cc/site/assets/files/1099/vista500px.gif`.
- The current HTTPS request returns 404 plain text; it was not accepted as an image.
- An exact-filename web search found contemporary music discussions linking the
  same artist-hosted path, including [this 2014 music thread](https://www.mediavida.com/foro/musica/novedades-2014-500497/3).
  These references support the context; they were not used as image substitutes.
- The [June 27, 2014 archive capture](https://web.archive.org/web/20140627103702id_/http://towhomitmayconcern.cc/site/assets/files/1099/vista500px.gif)
  returns the original GIF89a: 500 × 500, 944,082 bytes. It shows the `Vista`
  artwork with the animated flag, retaining all 24 frames.
- The archived host omits `www`, but the asset path is identical. The CDX SHA-1
  `QJK2WPSTPZ7AZB6EWTOGXDT77FQPQWI5` exactly matches the retrieved payload.
  SHA-256: `318dee99fafb6084e56f855bf6a32a12ddf39f3daa066458dd058af4577c10dc`.
- Local link: `/recovered/iamamiwhoami/vista500px.gif`.

SHA-256 comparison across all 4,791 backup files with JPEG, GIF, PNG, WebP, PSD
or BMP extensions found no byte-identical copy of either recovered payload,
including files with different names. This does not rule out edited or
recompressed versions; neither is needed because the original bytes are available.
Raw search results, CDX data, rejected responses and recovery candidates remain
under ignored `migration/cache/external-images/`. No backup was modified.

## Verification

- Two regression tests first failed without the recovered files, then passed.
  They verify archive SHA-1, SHA-256, byte counts and JPEG/GIF signatures, and
  render both actual articles using pinned Hugo 0.165.0 at both base paths.
  They require one local artwork link, preserve attribution and the `Vista`
  title, and reject accidental inline images or the original dead link.
  Tests run without network access or private backups.
- All 76 Python tests and seven JavaScript tests passed. Theme synchronization
  and all 2,639 sanitized comments passed their checks.
- Root and `/overstep-website/` production builds passed `--panicOnWarning`.
  Both output validations reconciled 491 historical pages, 2,639 comments,
  124 recovered Flash associations and the four previously restored inline images.
  The four unrelated unresolved local destinations remain recorded separately.
- Both generated outputs were served locally. All four article requests returned
  200 with the intended local link. Each linked file returned 200, its expected
  image content type, signature, byte count and SHA-256.
- Chrome successfully followed each of the four article links. Both files decoded
  at their expected intrinsic dimensions in root and project-prefix contexts.
  Screenshots confirmed the complete Maliki strip and the Vista artwork; the GIF's
  changing flag was visible. Chrome also decoded its first and last frames and
  reported 24 frames with animation enabled.

Only the two affected article destinations changed. Article URLs, front matter,
dates, taxonomies, comments, prose, credits and existing Flash players are intact.
This browser review covers the two artwork links; it does not complete the
separate Flash totem, audio, radio or earlier inline-image acceptance checks.
No editorial replacement is required. No deployment or DNS change was performed;
publication gates remain disabled.
