# Historical local-link resolution

Reviewed on 2026-11-16 for issue #6. This follows the original content audit;
its four unresolved-path findings remain unchanged as historical evidence.
All four path families now have reviewed internal replacements. There are no
remaining exceptions in `docs/remaining-local-links.json`.

## Source evidence and decisions

Only published XML article/attachment fields, approved comment text, the old
Dotclear theme and the specifically identified ZIP were inspected for this work.
No archived PHP or executable was run, and no backup was modified.

### Semelles image link

Article 3058, `/2014/02/27/dofus-objet-de-quete-special/`, contains the malformed
attachment destination `/2014/03/08/dofus-objet-de-quete-special/semelles/` in
its exported article body. The export's attachment 3059 instead declares
`/2014/02/27/dofus-objet-de-quete-special/semelles/`, with upload date
2014-03-08 and the exact media URL `/wp-content/uploads/2014/03/semelles.png`.
The article body uses the upload date where the attachment's own link uses the
article date; neither path is a reason to rename the public article.

Replace the broken article link with the original full-size image directly,
preserving the inline image, alt text and surrounding colored prose. Do not
invent another attachment page or change the 21 existing attachment pages.
Both the FTP upload and the existing public PNG have SHA-256
`fa13a92b7bdb39a732208f5c19eb1d13687ab5aadb00ef8f5a809e162de8045a`.
The delivered PNG is 600 × 420 pixels.

### Dotclear comment links

The single unresolved `/blog/index.php` path hides three distinct query URLs.
The originating comments and target article links are present in
`step.WordPress.2026-11-15.xml`; the old numeric identifiers are Dotclear IDs,
not WordPress post IDs. Compare the complete date/slug against the exported
published target, rather than sending every query to one article.

| Source comment | Source article | Original query after `/blog/index.php?` | Reviewed target |
| --- | --- | --- | --- |
| 7474 | 1989, `/2008/04/18/jour19-petits-dans-l-immense/` | `2008/04/15/208-jour18-l-ouverture-d-esprit#co` | `/2008/04/15/jour18-l-ouverture-d-esprit/#comments` (post 1988) |
| 8250 | 2047, `/2009/05/27/jour-35-vegetal-les-racines-du-renouveau/` | `2008/09/08/245-les-remous-de-l-equilibre` | `/2008/09/08/les-remous-de-l-equilibre/` (post 1870) |
| 8258 | 2048, `/2009/05/28/jour-36-animal-insectes/` | `2008/08/22/242-mystigris)` | `/2008/08/22/mystigris/` (post 1880) |

The old theme at `backup_ftp/old_dc_blog/themes/overstep/post.php` declares
`<h3 id="co">` inside its comments section. Thus comment 7474's `#co` denotes
the beginning of the thread, not an individual comment. Map it to the existing
`#comments` section; do not guess an individual `#comment-ID`.
The trailing parenthesis in comment 8258 is malformed punctuation in the link.

### Historical links page

Approved comment 6756 on post 1823, `/2006/07/19/porn-industry/`, explicitly
reports that the links page reached from the homepage does not work. Its source
anchor destination and title both contain `/liens.html)`.
No matching HTML page was found in the FTP file inventory. Removing the final
parenthesis alone would leave another missing page.

Explicitly replace this destination with `/#blogroll`, the restored site's
existing friend-links list. Give its maintained navigation element the stable
`blogroll` ID. This is a replacement with the current public links collection,
not a claim that its 22 entries reconstruct the missing 2006 page exactly.

### Game/emulator download

Article 1846, `/2006/03/02/la-toccata-du-chip-cpc/`, links to
`/wp-content/uploads/2011/dotclear/5emeaxe_and_emulator.zip` in the XML and current
Markdown. The exact FTP upload exists (342,058 bytes), with SHA-256
`70cd5d564372e4dea03e90ce54dbae133f6f7787ffad6737f9e337bf7b894e30`.
Reading the ZIP directory confirms `arnold.exe`, `zlib.dll` and
`5eme Axe, Le (F) (1985) [a1].dsk`, alongside emulator documentation and extras.
No member was executed or installed.

Choose the issue's archival-unavailability option: keep this ZIP out of the
public site and replace its download link with an article-local
`#archival-download` explanation. The visible notice identifies the original game
and Windows emulator, and states that redistribution has not been validated.
Keep the music credit, existing image and surrounding article text.
This decision does not add the executable, game image or ZIP to Git or output.

## Implementation and preservation

`scripts/historical_links.py` scopes the four comment replacements by comment ID,
post ID and complete original URL. `scripts/sanitize_comments.py` applies them
only to anchor attributes after HTML sanitization. Regenerating sanitized comments
therefore retains the repair without changing raw source text or trusting raw HTML.

Only four `content_html` values change in `data/comments.json`. Original `content`,
comment IDs, parent relationships, article associations, authors and timestamps
remain unchanged. All 470 article URLs and metadata remain unchanged. The total
remains 491 historical article/attachment pages and 2,639 archived comments.
Maintained and installed theme files are synchronized.

## Verification

- TDD: the new navigation and scoped-comment tests failed against the old content,
  then passed after the replacements.
- All 78 Python tests and seven JavaScript tests passed. The new Hugo fixture
  renders the actual nine relevant articles and actual maintained comment/sidebar
  templates at both base paths. It checks source comment anchors, each replacement,
  destination fragments, the exact PNG bytes and the download-unavailability notice.
- Theme synchronization and comment sanitization checks passed.
- Both full production builds passed with `--panicOnWarning`. The Pages build was
  prepared again with `prepare_pages.py` before validation and HTTP checks.
- Both output validations passed: zero missing local destinations, all 491 historical
  pages, 2,639 comments, 124 recovered Flash associations and four audited images.
- Twelve HTTP navigation checks passed against the full generated outputs served
  locally: six source-to-target flows each at `/` and `/overstep-website/`.
  Each check finds the rendered link, fetches its actual destination and checks any
  fragment against an element ID. The Semelles response is `image/png`, has the
  PNG signature, 600 × 420 dimensions and the reviewed SHA-256. Other targets return
  HTML. Raw local check results remain under ignored `migration/cache/historical-links/`.

These are rendered-output and HTTP checks. No interactive browser clicking or
visual acceptance is claimed for this issue. The separate Flash hotspot, image
appearance and Spotify playback acceptance gates remain pending.

## Hosting follow-up

Internal navigation no longer requests the four missing paths. This does not
provide HTTP redirects for bookmarks or inbound links to those original URLs.
No rewrite/deployment rules, artifact upload, publication gates or DNS were changed.

At the later hosting decision, implement and test exact redirects for the old
Semelles path to its image, `/liens.html)` to `/#blogroll`, and the three reviewed
Dotclear queries to their distinct targets above. The `208` query should include
the new comments fragment in its redirect location; fragments are not sent in
HTTP requests. Do not treat an unknown Dotclear query as one of these matches.
The unavailable ZIP should receive an explicit archival response, such as HTTP
410 with the explanation and a link back to the article, rather than serving HTML
with a ZIP success response. The eventual host must also review the export's
alternative Semelles attachment URL when deciding inbound-link coverage.

The selected static preview does not implement those proposed query-aware server
responses. Existing `?p=ID` JavaScript redirects and `/feed/` browser fallback
limitations remain documented separately in `docs/preproduction-review.md`.
