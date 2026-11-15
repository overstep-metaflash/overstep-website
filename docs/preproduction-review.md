# Preproduction review

Reviewed on 2026-11-16. This document supersedes the historical migration notes
where their loading policy, privacy choices, or remaining counts differ.

## Publication decision

The requested first hosting target is
`https://overstep-metaflash.github.io/overstep-website/`, without DNS changes.
The user explicitly withheld publication because audio redistribution rights are
unconfirmed. Pages remains disabled. No site artifact is uploaded while approval
is withheld. The repository is already public and contains audio committed in the
initial version; blocking Pages does not remove those files from GitHub.

The workflow in `.github/workflows/pages.yml` runs checks on pushes and pull
requests. Site-artifact upload and deployment each require both:

- `docs/media-rights.json` has `publication_approved: true`.
- The repository variable `PAGES_RELEASE_APPROVED` equals `true`.

The manifest currently records 45 MP3 files, hashes, sizes, and direct article
references. An empty reference list does not establish that a file is unused:
Flash movies may load dependencies internally. Every rights status remains
`unconfirmed`; no licensing conclusion has been inferred from public availability.

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

The two unavailable external images remain referenced for review:

- `http://maliki.com/strips/strip_lapeurduvide.jpg`: HTTPS returns 404; HTTP returns
  HTML rather than an image, so it was not accepted as a recovered asset.
- `http://www.towhomitmayconcern.cc/site/assets/files/1099/vista500px.gif`: 404.

Five local destinations remain unresolved and explicitly listed in
`remaining-local-links.json`: a historical Semelles attachment route, an old
Dotclear `index.php` comment link, a malformed `liens.html)` link, `/radio/`, and
the Fifth Axis game/emulator ZIP. The ZIP exists in the backup but includes a
game disk image and executable; it is not added to this release without review.
CI fails for any newly missing local destination outside this recorded list.
Existing source spam links still require an editorial cleanup decision.

## Ruffle and historical URLs

Ruffle 0.7.1 is self-hosted and loads every animation immediately when the page
opens, with visual autoplay enabled and one shared runtime. This implements the
user's explicit preference. The earlier deferred-loading documentation has been
corrected. Sound remains subject to the browser's user-gesture policy. Firefox's
AudioContext and WebGL diagnostics are upstream/browser messages; they have not
been hidden or patched locally. Browser playback still requires manual review.

The public post-ID map supports numeric `?p=ID` links through a same-origin
JavaScript redirect, preserving `#comment-ID` and the preview path prefix. It is
not an HTTP 301 and requires JavaScript. Unknown IDs do not redirect.

`/feed/` is a browser fallback to `../feed.xml`; it is not a server redirect and
does not guarantee compatibility with existing RSS clients. A future production
host must provide actual redirects for query URLs/feeds and review domain
canonicalization. No production-domain redirect or DNS change has been made.

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

Local validation passed: 43 Python tests, five JavaScript tests, a clean Hugo
production build with `--panicOnWarning`, and 491 public content pages with all
2,639 sanitized comment anchors. Five known legacy destinations remain flagged.
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
