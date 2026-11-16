# Reviewed article link cleanup

Date: 2026-11-16. Scope: [issue #1](https://github.com/overstep-metaflash/overstep-website/issues/1).
The [original audit](2026-11-16-content.md) and its CSV/JSON inventories remain
historical evidence; their 78 findings describe the pre-cleanup baseline.

All 78 recorded link instances and their injected anchors have been removed
from the 78 matching article bodies. Each instance was reviewed in its article
context. This change removes the recorded payloads, not whole destination domains
or words associated with legitimate adult-themed artwork.

Only supported editorial repairs accompany removal:

- Join the surviving words around inline injections with normal spacing.
- Close the bold quotation in article 2052 without leaving a literal `**` line.
- Remove the isolated period paragraphs in articles 1820 and 1824, which are
  absent from their corresponding saved article bodies.
- Restore the label `version Flash` in article 2564: the saved body explicitly
  retains `Flash` immediately after the injection and before the legacy player link.
- Retain the saved line breaks between colored spans in articles 3216, 3299 and
  3973 using `<br>`.

No prose was reconstructed from an assumed clean snapshot. Some saved copies
contain different injected payloads even when the exact audited link is absent;
none of that HTML was copied into the active site. Articles 1865, 1807 and 2035
now have empty bodies because their only surviving migrated text was the
injection. Their original missing media remain part of issue #2; this cleanup
does not invent replacement descriptions or remove the articles.

## Reimport protection

`scripts/reviewed_links.py` loads the public CSV by post ID. Regression tests and
`scripts/validate_site.py` reject a recorded URL or residual injected anchor in
the matching article's Markdown or rendered HTML. Comparison handles Markdown
escaping/emphasis, HTML formatting, entities and whitespace. Other paths on the
same host remain allowed; the check is scoped to reviewed instances.

The synthetic fixtures cover standalone and inline links, formatted links,
unlinked anchor residue, and legitimate artwork/credits/citations. An integration
fixture verifies release rejection for both source and rendered reintroductions.
The public-content regression check failed for exactly 78 articles before the
cleanup and passes after it. Tests and release validation use no private backups.

## Reconciliation and validation

Compared with the pre-cleanup Git content:

- All 470 article front-matter blocks are byte-for-byte unchanged, including
  public URLs, IDs, local dates and taxonomy.
- All Markdown image expressions, HTML image tags and Ruffle shortcodes are
  unchanged. All 31 Markdown images and 21 Ruffle players referenced by the cleaned
  articles were confirmed as real elements in their generated pages. The repaired
  quotation renders as bold text. All other Markdown link destinations survive.
- `data/comments.json` is byte-for-byte unchanged: 2,639 records, including their
  IDs and reply relationships. Both rendered builds reconcile all 491 public
  content pages (470 articles and 21 attachment pages) and all 2,639 comments.
- The original `porn-industry` article is byte-for-byte unchanged. Syphie,
  Mobidic, Maliki and existing music credits are retained.
- The source XML still matches the SHA-256 recorded in the original audit.
  Source backups were read only; no PHP was executed.

Validation passed: 49 Python tests (including the Hugo fixtures), five JavaScript
tests, theme synchronization, comment sanitization, and Hugo production builds
with warnings treated as errors. Output validation passed at the root URL and
under `/overstep-website/` after preview path preparation. The five previously
known legacy destinations remain explicit; no missing path was allowlisted.

This is content and HTML validation, not a new browser playback or visual-fidelity
review. No media files, release gates, deployment settings or DNS were changed.
