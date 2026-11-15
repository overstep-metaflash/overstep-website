# Migration procedure and acceptance criteria

The initial staging conversion and production-mode validation build completed on
2026-11-15. See `CONVERSION.md` for results and remaining acceptance gaps. The
commands below document the workflow; do not rerun conversion into existing staging.

## 1. Establish the toolchain

Use the versions in `toolchain.json`: wp2hugo 1.39.0 and Hugo 0.165.0.
Both tools are installed via `blog/mise.toml` using mise 2026.11.8. Hugo uses
the aqua backend; wp2hugo uses GitHub releases because it is not in the registry.
Binary SHA-256 hashes are recorded in `toolchain.json`; these record installed
artifact identity, not an independent upstream signature verification.
Use `rtk proxy sh blog/scripts/mise-local.sh install` from the workspace root
to reproduce the installation. The launcher isolates mise storage in the ignored
`blog/migration/mise/` directory and runs commands from `blog/`.
`hugo version` and `wp2hugo --help` were successfully checked.

Review wp2hugo's license for the intended use; its README distinguishes personal
and commercial usage. Its generated theme is a provisional conversion preview,
not an approved final design.

## 2. Recheck the source

Run the tests and inventory commands from `../README.md`. Confirm the source hash
and counts match the recorded baseline. Preserve all inputs. Do not import SQL or
execute archived PHP for the normal conversion workflow.

The detailed reports are local working data. Keep reports, raw generated metadata,
logs, cached downloads, and draft source content outside the eventual public output.

## 3. Convert into staging

Run the following from the workspace root with a previously unused
`blog/migration/raw` destination (the launcher changes directory to `blog/`):

```sh
rtk proxy sh blog/scripts/mise-local.sh exec -- wp2hugo --source ../step.WordPress.2026-11-15.xml --output migration/raw
```

This first pass deliberately omits `--download-media` and `--download-all`: local
recovery should precede network fetching. Capture stdout, stderr, exact command,
binary hashes, timestamp, exit code, and generated directory structure in local
`migration/logs/`. This command completed successfully against these inputs.
Inspect the actual generated site root before moving files;
do not assume the converter output has a particular nesting structure.

Use a fresh staging directory for each retry. Preserve failed output and logs for
diagnosis. Record every correction in a reproducible transformation or explicit
review log; custom transformations require synthetic failing tests first.

## 4. Review and recover content

- Reconcile 470 public posts and 10 drafts by WordPress post ID. Check dates,
  time zones, accented text, slugs, categories, tags, excerpts, featured images,
  and original URLs. Preserve draft status explicitly.
- Inspect metadata before promoting files. Remove private author/contact fields,
  comment email/IP data, and unneeded custom fields from anything publicly served.
- Review all 2,653 comment records and their parent post status. Preserve approved
  public comment text, public display name, and dates only after reviewing the
  generated representation. Do not automatically introduce an external comment
  service. New commenting is a separate decision.
- Comment preservation is mandatory. Reconcile comment IDs and counts per parent
  post, body text, dates, public display names, reply hierarchy, and legacy
  `#comment-ID` anchors. Investigate attachment comments and any comments attached
  to non-public posts separately; never silently drop them or publish private posts.
  Render public comments into article HTML, not only a client-side widget.
  wp2hugo 1.39.0 documents `data/comments.yaml`, which includes author email, and
  `layouts/partials/comments.html`. Integrate that partial into the chosen article
  template, keeping string `post_id` values consistent. Remove emails from reviewed
  comment data and inspect the partial output before publication. Verify preservation
  in the built HTML rather than assuming data import makes comments visible.
  Source: https://github.com/ashishb/wp2hugo/blob/1.39.0/doc/comments.md
- Recover needed local assets using `uploads[].local_file` and public references
  in the inventory. Preserve original `/wp-content/uploads/...` paths under the
  future site's `static/` directory where appropriate. Check generated references
  first. Copy only reviewed files needed by public content; attachment membership
  alone is not permission to publish a file. Draft-only assets remain private.
- Investigate the external image for post `2941`, the legacy root-level image,
  and legacy `.html` links listed in the reference inventory. Extend recovery to
  other FTP folders only for a specific unresolved reference. Log failed downloads
  and unresolved media rather than dropping them silently.
- Inspect representative oldest/newest posts, all detected feature families,
  shortcode false positives, galleries, code examples, plain-text embeds, and
  legacy HTML. Inventory feature IDs provide starting points, not full coverage.

## 5. Preserve URLs and promote the reviewed site

The source uses dated paths such as `/2005/12/02/a-n-en-pas-douter/`.
Compare every entry in `reports/public-urls.txt` with the generated page URL.
Preserving original public article paths is mandatory, including trailing slashes
and legacy spelling. Do not infer paths from current titles. A changed article
URL is a failed acceptance check unless an exception is explicitly approved.
For any approved exception, create an explicit old-to-new mapping and validate a
permanent redirect against the eventual hosting platform. Query-based
WordPress URLs, legacy `.html` paths, feeds, categories, and attachment URLs need
separate checks. Inspect any converter-generated redirect configuration.
Check canonical URLs, HTTP-to-HTTPS and hostname redirects, RSS URLs and GUIDs,
sitemap entries, indexing directives, and existing archive URLs. Preserve relevant
page titles and descriptions. Ensure canonical links point to the original production
URLs and that no preview hostname or unintended `noindex` reaches production.
These measures reduce SEO migration risk; they cannot guarantee unchanged rankings.

After review, promote only the Hugo site files to `blog/`. Keep migration tooling
and reports in place, outside content/static directories. Verify baseURL is
`https://blog.overstep.fr/`, language is appropriate, and draft rendering is off.
Select a theme separately; first ensure the converter's preview can build.

## 6. Validate locally before deployment

Once the reviewed site and its configuration exist in `blog/`, build with the
pinned Hugo binary from the workspace root:

```sh
rtk proxy sh blog/scripts/mise-local.sh exec -- hugo build --destination public --environment production --buildDrafts=false --buildFuture=false --buildExpired=false
```

Use a fresh public output directory to prevent stale draft output. Never point
cleanup or destination flags at the source backups. The command above is a future
validation step, not a claim that a build currently works.

Acceptance gates:

1. Account for all 480 posts; explain exclusions or conversion differences.
2. Confirm all 470 expected public article URLs resolve at their original paths.
   Require explicit approval for redirect exceptions. Detect duplicate paths and
   check canonicals, sitemap, robots/indexing directives, feeds, and archive URLs.
3. Confirm no draft pages, draft-only assets, comment email/IP data, source exports,
   raw logs, or private metadata are present in production output, feeds, indexes,
   sitemaps, or search data. Hugo's draft flag alone does not exclude static files.
4. Crawl generated internal links and media references; verify target files and
   relevant fragments, accounting for query URLs and percent-encoded paths.
5. Reconcile all public comments by ID and parent article against rendered HTML;
   verify text, dates, reply structure, and legacy anchors. Review rendered text,
   code, embeds, galleries, and old/recent articles.
6. Record the production build result and every unresolved issue. Missing media
   and broken links must be explicitly resolved or accepted before cutover.

The initial staging production build passed; the final-root command above awaits
review and promotion. Media recovery, comprehensive content/privacy validation,
and theme review remain pending. Hosting, DNS, publishing, and production cutover
remain separate steps.
