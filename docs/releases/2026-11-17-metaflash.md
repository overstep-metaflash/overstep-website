# Metaflash restoration release

On 2026-11-17 the owner explicitly requested publication of the completed local
changes, followed by a fresh report of SWF/image files not used by the site.
The authorized destination remains:

`https://overstep-metaflash.github.io/overstep-website/`

This release includes the restored Metaflash homepage and gallery, the shared
internal Flash/image viewer, all Sirius/MC1 cover views, the compact gallery
header, current public contact address, reduced section spacing and the cleaned
guestbook. It adds 278 reviewed static files; the selected section contains 57
simple Flash destinations and 16 image sets with 36 full-size images. The 19
retained guestbook entries contain no original IP headers. Raw backups and the
unsanitized guestbook capture are excluded.

Local verification passed 104 Python tests and 23 JavaScript tests. Root and
project-prefix production builds and both site/portfolio validators passed;
Pages preparation followed the final prefix build. The prepared Pages output is
516,169,634 bytes. All 556 selected-section HTTP payload checks matched the final
file hashes. The theme is synchronized and all 2,639 blog comments remain
sanitized. Browser evidence and known limits are recorded in
`docs/audits/2026-11-17-metaflash-follow-up.md`.

Both existing release controls remain active: the repository variable
`PAGES_RELEASE_APPROVED=true` and the media manifest's publication approval.
This instruction authorizes publishing the reviewed changes through the existing
workflow. It does not authorize DNS/custom-domain changes, repository visibility
changes, importing excluded radio MP3s, or publishing the entire FTP archive.

The subsequent media-usage report must distinguish exact source payload coverage,
reviewed movie adaptations, files present without detected references, and files
not imported. Dynamic loading and browser playback remain separate questions.
