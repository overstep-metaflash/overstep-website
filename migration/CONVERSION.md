# First conversion result

Follow-up: FTP media recovery has now added and verified 616 static files. The
updated production build is in `public-media-validation/`. See `MEDIA.md` for
the recovery report and remaining external/theme asset gaps. The zero-media
figures below describe the original conversion pass.

Completed on 2026-11-15 using wp2hugo 1.39.0 and Hugo 0.165.0 via mise.
The source XML hash still matches `toolchain.json`. Both preparation tests passed.
Original backups were not modified.

## Generated site

Site root: `blog/migration/raw/generated-2026-11-15-16-45-14/`.
The converter supplied a provisional PaperMod theme and Hugo configuration.
Conversion exited successfully. A separate production-mode build also passed,
with drafts, future posts, and expired posts disabled, into the generated site's
`public-validation/` directory. The site remains in staging; nothing was deployed
or promoted to the final `blog/` site root.

Exact commands and exit codes are recorded in local `logs/conversion.json` and
`logs/build.json`. Detailed output is in the corresponding `.log` files. Logs
contain source content and must remain private. Generated page classification is
in `reports/hugo-pages.csv`; audit results are in `reports/conversion-validation.json`.

## Reconciliation

| Check | Result |
| --- | --- |
| Post IDs | All 480 source posts found in generated Markdown |
| Public posts | 470, confirmed by Hugo |
| Draft posts | 10, confirmed by Hugo; generated draft flags recognized |
| Original public paths | All 470 map to generated HTML files |
| Article comment anchors | All 2,638 comments on public posts rendered on their original parent articles |
| Comments on drafts | 14 retained in imported comment data |
| Imported comments | 2,652 of 2,653 source records |
| Attachment comment | ID 20443 on attachment 3357 was not imported |
| Local static assets | None copied in this first pass |

Three posts (2259, 2743, 3233) use Unicode in generated URL metadata where the
export percent-encodes the same characters. Their paths are equivalent after
percent-decoding, and corresponding HTML files exist. Exact-string canonical
comparison flags these three cases. Verify actual HTTP routing and final canonical
serialization before deployment; no changed slug or redirect was introduced.

The comment check reconciles IDs and parent article placement in rendered HTML.
It does not yet prove text, date, author, and reply hierarchy fidelity for every
comment. Full semantic comparison remains required.

## Required follow-up before publication

1. Recover attachment comment 20443 without losing its relationship or original
   public URL/anchor. Its omission prevents complete comment preservation.
2. Recover reviewed local assets from the FTP backup and investigate external
   and legacy media. The initial pass intentionally disabled media downloads.
3. Remove private fields from reviewed metadata and comment data. The converter
   retains author emails in `data/comments.yaml`; its partial uses them for
   Gravatar hashes. Review that behavior before promotion. Draft exclusion does
   not replace a full private-data scan of all generated output.
4. Review suspected injected external links found in four public source posts.
   IDs are recorded in the local validation report. These links were preserved
   during conversion, not silently edited; the source may contain unwanted spam.
5. Verify all comment contents and reply hierarchies, unsupported legacy embeds
   (including Flash shortcodes), internal links, feed identity, sitemap, robots
   directives, and final URL/canonical behavior. Inspect representative rendering.
6. Review the provisional theme and locale. The converter sets `languageCode` to
   `fr-FR`, but the build table labels the site `EN`; verify date and UI localization.
   Hugo also warns that `languageCode` and `.Site.Data` are deprecated. These
   warnings did not prevent the pinned-version build.

This is a successful initial conversion, not approval for production publication.
