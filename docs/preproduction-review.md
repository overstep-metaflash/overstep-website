# Preproduction review

Reviewed on 2026-11-16. This document supersedes the historical migration notes
where their loading policy, privacy choices, or remaining counts differ.

## Publication decision

The requested first hosting target is
`https://overstep-metaflash.github.io/overstep-website/`, without DNS changes.
The user initially withheld publication pending audio review. On 2026-11-16 the
owner confirmed use of non-radio MP3 files; the legacy radio must instead become
a Spotify or Deezer playlist. The subsequent content audit is documented in
`audits/2026-11-16-content.md`. Pages remains disabled. No site artifact is uploaded while approval
is withheld. The repository is already public and contains audio committed in the
initial version; blocking Pages does not remove those files from GitHub.

The workflow in `.github/workflows/pages.yml` runs checks on pushes and pull
requests. Site-artifact upload and deployment each require both:

- `docs/media-rights.json` has `publication_approved: true`.
- The repository variable `PAGES_RELEASE_APPROVED` equals `true`.

The manifest currently records 47 MP3 files, hashes, sizes, and direct article
references. An empty reference list does not establish that a file is unused:
Flash movies may load dependencies internally. The 47 tracked MP3 files are now
recorded as `confirmed_by_owner`. None is byte-identical to the 17 radio MP3s,
which remain outside the public inventory. This records the owner's instruction,
not an independent licensing assessment. Publication approval remains false.

After explicit release approval, review the manifest, enable Pages with GitHub
Actions as its source, and enable both gates. Re-run the workflow on the reviewed
main commit. This is a future release procedure, not authorization to execute it.
Do not add a CNAME or change the production domain as part of this preview.

## Comment security and privacy

`scripts/sanitize_comments.py` first renders Markdown and historical HTML, then
sanitizes the resulting HTML with nh3 0.3.7. Its allowlist admits simple text,
lists, quotations, code, and links. Scripts, event handlers, active embeds, images,
styles, and unsafe link schemes are removed. Author URLs accept HTTP(S) only.
Hugo trusts only the resulting `content_html`; the original `content` remains
preserved as data and the fallback is escaped text. CI rejects stale or modified
sanitized output.

Gravatar URLs and email hashes have been removed from comment records. Local
initials replace network avatar requests. Raw email/IP fields remain excluded.

Goldmark's `unsafe` setting remains necessary for reviewed historical article
formatting. Comments no longer pass through `markdownify`. The output validator
rejects executable article HTML and checks every expected comment anchor. This is
a constrained legacy-content pipeline, not an arbitrary public HTML submission
endpoint.

## Recovered content

- All 470 article URLs remain unchanged. Source filenames use local dates and
  original URL slugs; comment associations still use the unchanged `post_id`.
- 2,638 article comments plus attachment comment 20443 are rendered: 2,639 total.
  The attachment retains `/2014/05/13/dans-cette-foret/rdv/#comment-20443`.
- 21 referenced attachment pages have been restored. Greek paths are stored as
  Unicode paths so percent-encoded requests resolve correctly.
- Three external JPEGs are recovered locally. Original/retrieval URLs and hashes
  are recorded in `recovered-media.json`.
- Three obsolete image links now open their existing local images. A titled
  Flash-wrapper link in the Yaldabaoth article now embeds Ruffle directly.
- The rules page, Charbonnerie gallery, and Morning image page were recovered
  from specifically reviewed backup paths, with their image dependencies.
  Obsolete background references were removed. No archived script is executed.

The two previously unavailable external artwork files are now recovered from
archived captures of their original URLs: Maliki's `strip_lapeurduvide.jpg` and
iamamiwhoami's animated `vista500px.gif`. Their article links now open local
copies, preserving the original presentation and attribution. Archive checksums,
local SHA-256 hashes, regression tests, both base-path HTTP checks and Chrome
link/decoding verification are recorded in the
[external artwork recovery review](audits/2026-11-16-external-image-recovery.md)
and [manifest](external-image-recovery.json).

The four originally unresolved local path families now have reviewed internal
replacements: Semelles opens its original full-size image; three distinct Dotclear
comment links open their migrated articles and preserve the comments-section
intent; the malformed links-page target opens the current friend-links list;
and the Fifth Axis game/emulator download has an explicit archival-unavailability
notice. The ZIP remains excluded. See the [historical link review](audits/2026-11-16-historical-links.md)
for exact source evidence, comment preservation and pending hosting-level redirects.
`remaining-local-links.json` is empty; CI fails for any missing local destination.
The 78 audited article spam links and their injected anchor text have been
removed. See [cleanup evidence and reimport protection](audits/2026-11-16-link-cleanup.md).
The four missing article images are now restored and reconciled against the
original audit in both root-domain and project-prefix output. See the
[image recovery review](audits/2026-11-16-image-recovery.md) for source evidence,
regression coverage, HTTP checks and the pending browser visual acceptance.
The other content and media audit follow-ups remain open.

The 124 missing Flash associations in 123 articles have now been restored from
reviewed XML/snapshot evidence and exact-path, hash-verified backups. Eight missing
SWFs were copied. `flash-recovery.json` and the output validator reconcile actual
article players, source dimensions, order and file bytes. See the
[Flash recovery review](audits/2026-11-16-flash-recovery.md) for provenance and the
pending manual acceptance matrix. Issue #2 remains open for browser verification
and the remaining radio/version acceptance in #4. The owner subsequently supplied
the Spotify playlist, now embedded on `/radio/` with a fallback link and its
16-track list. The owner accepted omitting the unavailable track. See the
[radio review](audits/2026-11-16-radio.md)
for the historical comparison and outstanding version/browser checks.

## Ruffle and historical URLs

Ruffle 0.7.1 is self-hosted and loads every animation immediately when the page
opens, with visual autoplay enabled and one shared runtime. This implements the
user's explicit preference. The earlier deferred-loading documentation has been
corrected. Sound remains subject to the browser's user-gesture policy. Firefox's
AudioContext and WebGL diagnostics are upstream/browser messages; they have not
been hidden or patched locally. Browser playback still requires manual review.

The menu's eight historical destinations now have explicit mappings. Eros and
Galerie have local collection pages. Six button action tags have current-tab
targets changed to `_blank`, because Ruffle blocks those targets with script
access disabled; artwork data is preserved. URL rewrite rules retain the root or
Pages prefix. Script access remains disabled. The radio mapping opens the new
`/radio/` playlist page. The subsequent same-tab adapter and Chrome hotspot matrix
are documented in the [menu navigation review](audits/2026-11-16-menu-navigation.md):
all seven page destinations passed in all six contexts; Contact's mailto dispatch
was observed without launching a mail client. Spotify playback and the separate
Flash/media acceptance remain pending.

The public post-ID map supports numeric `?p=ID` links through a same-origin
JavaScript redirect, preserving `#comment-ID` and the preview path prefix. It is
not an HTTP 301 and requires JavaScript. Unknown IDs do not redirect.

`/feed/` is a browser fallback to `../feed.xml`; it is not a server redirect and
does not guarantee compatibility with existing RSS clients. The owner selected
GitHub Pages only during issue #7's review. Keep the static query/feed fallbacks
and use `/feed.xml` for direct subscriptions. Query-dependent HTTP permanent
redirects require capabilities beyond repository files on Pages. The hosting
choice does not itself accept degraded compatibility: issue #7 stays open for
explicit acceptance of those limitations or a revised hosting constraint, plus
actual RSS-reader/released-origin checks. See the
[legacy URL review](audits/2026-11-16-legacy-urls.md) for local HTTP evidence and
Chrome tests with scripts enabled and blocked by CSP. No production-domain
redirect or DNS change has been made.

Calibre 9.18.0's actual RSS ingestion engine accepted both `/feed.xml` and the
HTML `/feed/` fallback in both local builds, retaining 470 articles in each run.
This client-specific result does not establish other readers' compatibility,
saved-subscription refresh, or the future Pages origin's headers.

## Reproduce the checks

Install `requirements-migration.txt` into a Python 3.12 virtual environment. Use
the pinned Hugo/Gitleaks versions from mise. From the repository root:

```sh
rtk proxy .venv/bin/python scripts/sync_theme.py --check
rtk proxy .venv/bin/python scripts/sanitize_comments.py --check
rtk proxy .venv/bin/python -m unittest discover -s tests -v
rtk proxy node --test tests/test_*.cjs
rtk proxy sh scripts/mise-local.sh exec -- hugo build --destination public-pages-review --environment production --baseURL https://overstep-metaflash.github.io/overstep-website/ --buildDrafts=false --buildFuture=false --buildExpired=false --panicOnWarning
rtk proxy .venv/bin/python scripts/prepare_pages.py --directory public-pages-review --base-url https://overstep-metaflash.github.io/overstep-website/
rtk proxy .venv/bin/python scripts/validate_site.py --directory public-pages-review --base-url https://overstep-metaflash.github.io/overstep-website/
```

The preview postprocessor prefixes legacy root-relative HTML URLs and preserves
the original bytes of old non-UTF-8 HTML. It is idempotent. The generated preview
Hugo HTML has `noindex, nofollow` to avoid indexing a second copy of the site.

To inspect the exact prepared preview locally, serve its parent directory:

```sh
rtk proxy mkdir -p public-preview-container
rtk proxy ln -s ../public-pages-review public-preview-container/overstep-website
rtk proxy python3 -m http.server 1315 --bind 127.0.0.1 --directory public-preview-container
```

Open `http://localhost:1315/overstep-website/`. Create the symlink only once.
For ordinary editing, use the Hugo server instructions in the root README.

Local validation passed: 80 Python tests, 19 JavaScript tests, clean Hugo root
and project-prefix production builds with `--panicOnWarning`, and 491 historical
content pages with all 2,639 sanitized comment anchors and 124 restored Flash
associations and four audited image associations. Two additional collection pages
and the Radio playlist page support menu navigation. No missing local destinations
remain. Twelve HTTP checks confirmed the six repaired historical navigation flows
at both base paths, including destination fragments and the Semelles image payload.
The tests use synthetic fixtures and CI requires no private backups. Actual
Firefox audio/playback and visual inspection remain manual checks.

Edit maintained theme files in `theme-overrides/` and run
`python scripts/sync_theme.py`; CI's `--check` rejects installed-copy drift.
The recovery helpers still require the private parent XML/FTP backups; normal
builds and CI do not.

GitHub Actions permissions were checked against Context7
`/websites/github_en_actions`; action SHAs and inputs were checked against the
official action repositories. The deploy job alone receives `pages: write` and
`id-token: write`. Dependency APIs follow the versioned Python requirements,
Ruffle package, and Hugo toolchain recorded in the repository.
