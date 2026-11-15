# FTP media recovery

This records the initial FTP recovery. Three external images have since been
recovered; two remain missing. See `../docs/recovered-media.json` for provenance
and `../docs/preproduction-review.md` for current release blockers.

Completed on 2026-11-15 against the existing staging site.

## Results

- Recovered 616 files (385,391,471 bytes) into the generated site's `static/`.
- Preserved original URL paths, including `/wp-content/uploads/...`.
- Recovered `/souvenir_de_vacances.jpg` from the specifically identified
  `backup_ftp/metaflash/souvenir_de_vacances.jpg` file.
- Included six reviewed Flash HTML wrappers and their local SWF dependencies.
  Preserving these files does not establish playback compatibility; Flash
  shortcode rendering and browser playback remain separate migration work.
- No unresolved local URLs remained within the source media recovery selection.
- Hugo production-mode build passed with 616 static files. All 616 files in
  `public-media-validation/` match the source SHA-256 hashes.
- Five tests passed, covering draft exclusion, published-parent attachments,
  shortcode URLs, path containment, overwrite protection, and wrapper dependencies.

Source backups were read only. No external media was downloaded. The site remains
in `migration/raw/generated-2026-11-15-16-45-14/`; there was no deployment.

## Reproduce

From the workspace root:

```sh
rtk proxy python3 -m unittest discover -s blog/tests -v
rtk proxy python3 blog/scripts/recover_media.py --site blog/migration/raw/generated-2026-11-15-16-45-14
rtk proxy sh blog/scripts/mise-local.sh exec -- hugo build --source migration/raw/generated-2026-11-15-16-45-14 --destination public-media-validation --environment production --buildDrafts=false --buildFuture=false --buildExpired=false
```

The script copies supported media referenced in published post HTML, explicit
HTTP(S) URLs in published content (including legacy shortcode URLs), and
attachments whose parent is a published post. It excludes draft-only content
and does not copy the entire uploads directory. It uses exact host/path mappings,
with one explicitly reviewed legacy path mapping. Arbitrary HTML and PHP are not
copied. Existing identical destination files are verified; differing files cause
an error instead of being overwritten. The XML and destination are local inputs;
no network requests occur.

Local audit files:

- `reports/media-recovery.json`: every copied file, source path, size, SHA-256,
  unresolved local URLs, and external URLs.
- `reports/media-validation.json`: output hash verification and missing local
  media references from generated HTML.
- `logs/media-build.json` and `logs/media-build.log`: build command and result.

## Remaining gaps

Five externally hosted source images were not found by filename anywhere in the
FTP backup. Their URLs remain unchanged; no live availability check was performed:

- `http://ciremya.perenna.free.fr/bible/dick/invisibles.jpg`
- `http://maliki.com/strips/strip_lapeurduvide.jpg`
- `http://runesoup.com/wp-content/uploads/2012/04/Tarot-Of.jpg`
- `http://www.anotherworld.fr/images/fondecran/AnotherWorld_960.jpg`
- `http://www.towhomitmayconcern.cc/site/assets/files/1099/vista500px.gif`

Generated HTML references five theme icons absent from the backup: `/favicon.ico`,
`/favicon-16x16.png`, `/favicon-32x32.png`, `/apple-touch-icon.png`, and
`/safari-pinned-tab.svg`. These are theme assets, not missing article media.
Choose/create the final site icons or adjust the theme configuration later.

The audit checks common HTML URL attributes and supported media extensions; it
does not execute JavaScript, interpret SWF internals, resolve every CSS URL, or
guarantee visual fidelity. Shortcode ID-only associations and detached featured
media require the broader content review. Complete link and privacy validation,
the omitted attachment comment, and suspected source spam remain open as recorded
in `CONVERSION.md`.
