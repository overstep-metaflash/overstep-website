# Metaflash homepage and internal Flash viewer

Implemented locally on 2026-11-17, following the owner's choice of the historical
homepage plus direct access to Anterak. No new push or deployment is recorded.

The subsequent [guestbook and layout follow-up](2026-11-17-metaflash-follow-up.md)
replaces the guestbook explanation with the recovered archive, removes the global
toolbar, fills the homepage viewport and adds Anterak to the gallery itself.
Counts and checks below describe the initial restoration before that follow-up.

## Delivered behavior

- `/metaflash/` restores the historical `index.swf` homepage. Its toolbar links
  to the blog, gallery and Anterak. The blog footer and `/gallery/` link to this
  section. Choc technologique now links to the local Anterak page.
- `/metaflash/menu2.html` retains the gallery tables, thumbnails, artwork titles,
  music credits and artist links. Simple Flash wrapper destinations open a
  native dialog in the current page. Anterak uses the same viewer. Standalone
  fallback pages remain available without JavaScript or through modified clicks.
- Pages with separate content remain pages. For example, `stretched.html` retains
  its Infected Mushroom credit alongside its animation. Image pages and direct
  full-size image links retain their destinations.
- The dialog supports its close button and Escape, restores focus, and removes
  the Ruffle element on close, destroying its runtime and audio. Closing during
  loading prevents a detached player from being created.
- Ruffle 0.7.1 is shared with the blog and retains disabled script access. Only
  reviewed homepage GetURL actions are retargeted to `_blank` internally, then
  intercepted for same-tab navigation. Artwork and internal frame/play/stop
  actions remain intact. The blog totem's existing navigation is unchanged.

## Selected scope and provenance

The importer follows HTML links from `index.html`, `menu2.html` and
`anterak.html`, plus selected media dependencies. It does not import other gallery
versions just because their names occur in a movie, or execute archived scripts.

The output contains **277 files, 34,634,623 bytes (33.03 MiB)**:

| Type | Count |
| --- | ---: |
| Adapted/generated HTML pages | 81 |
| SWF movies | 61 |
| JPEG images | 132 |
| GIF images | 1 |
| Client navigation/player manifests | 2 |

There are **55 simple movie destinations**, including Anterak. Original media
bytes are preserved except for the reviewed homepage navigation repair. Anterak
remains byte-identical to FTP, SHA-256
`d3f7a3d8e39ffce9a6005d051c3f9e0feaa1bee236940c7939ddf620628503ef`.
The homepage source matches the owner-supplied Wayback movie capture documented
in the [original coverage audit](2026-11-16-metaflash-coverage.md).

`docs/metaflash-recovery.json` records the 273 selected source hashes, all output
hashes/sizes, aliases and unavailable images. Rehashing all 273 selected sources
after generation confirmed unchanged bytes. FLA files, standalone audio, videos,
archives, PDFs and unrelated directories are excluded. This is a selected
restoration, not a complete migration or an independent backup of all 1,868 files.

## Explicit substitutions and missing material

- `sphere.html` is the gallery's typo for the existing `spheres.html` page.
- Old `menu.htm` and `menu.html` return routes map to the selected `menu2.html`
  gallery, without recreating those earlier gallery versions.
- `gif/sphères.jpg` and `gif/sphèresx.jpg` are absent from FTP; the tested Wayback
  image URLs returned 404. Their associations display “Illustration indisponible”
  instead of broken image requests.
- The `gif/background1.jpg` background named by Stretched is absent. A solid
  section background is used; a similarly named file in `photoshop/background/`
  was not substituted by basename.
- The missing `liens.html` uses an explicitly labeled list of the blog's friend
  links. It does not claim to recover the original list.
- The retired Free guestbook CGI opens a local explanation. No guestbook backend
  or submission form is provided.
- The homepage contact uses the public address already present in the gallery.
  Statistics, Flash detection and rollover scripts are removed; reviewed static
  thumbnails and links remain.

## Verification

- **89 Python and 22 JavaScript tests passed.** New synthetic fixtures cover
  wrapper classification without losing credits, legacy encoding, safe gallery
  rewriting, selected import scope, source immutability, menu action preservation,
  dialog routing, close/cancel behavior, both prefixes, and rejection of missing,
  modified or unreviewed output.
- Recovery produces identical bytes and evidence on reapplication. A synthetic
  regression also reverses embedded-movie enumeration to verify stable output.
- Cold production builds passed at root and project-prefix base URLs. Pages
  preparation ran after the final prefix build. Both existing validations passed:
  491 historical pages, 2,639 comments, 124 Flash associations, four audited
  images and no missing local destinations.
- `validate_metaflash.py` passed for both builds. CI runs it after Pages
  preparation without private backups. It checks exact file inventories/hashes,
  movie associations, safe markup and local link resolution.
- **554 local HTTP fetches passed**, covering every restored file at both base
  paths with exact SHA-256 payloads, image types/signatures and SWF signatures.
  Raw results remain ignored in
  `migration/cache/metaflash-audit/restoration-http.json`.
- Chrome rendered the original homepage artwork. A genuine gallery-hotspot click
  opened `menu2.html` in the same tab. Genuine clicks also opened the friend-links
  page and the guestbook explanation; the latter retained the project prefix.
- Chrome opened Oiseau and Anterak in the internal viewer at both base paths,
  retaining the gallery URL. All 91 gallery image elements decoded successfully.
  Closing removed the player and restored focus; Escape also closed the viewer.
  Clicking Stretched retained its credit and loaded its inline player. Homepage,
  Oiseau and Anterak metadata matched the original dimensions.
- Gitleaks found no secrets in the generated portfolio text. Maintained theme
  files are synchronized and `git diff --check` passed.

These checks establish representative navigation and loading, not exhaustive
interaction or audible playback acceptance for all 61 movies. Contact routing
is tested; no operating-system mail application was launched. The external
`/40jours.html` prose link and full FTP migration remain outside this selected
restoration. No publication or DNS change was performed.

## Maintenance

Edit the maintained `theme-overrides/static/js/metaflash.js` and CSS, then run
`scripts/sync_theme.py`. Generated HTML/media live in `static/metaflash/`.
`scripts/recover_metaflash.py` previews recovery; `--apply` regenerates it from
the workspace backup. Ordinary CI uses committed evidence and synthetic fixtures.
Never edit backups or substitute a source by basename alone.
