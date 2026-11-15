# Step — Les semelles de vent

Hugo migration of https://blog.overstep.fr/ with the original Step artwork,
local media, archived comments, and self-hosted Ruffle animations.

## Preview locally

Install mise, then run from this repository root:

```sh
rtk proxy sh scripts/mise-local.sh trust mise.toml
rtk proxy sh scripts/mise-local.sh install
rtk proxy sh scripts/mise-local.sh exec -- hugo server --bind 127.0.0.1 --port 1314 --disableFastRender
```

Open http://localhost:1314/. Without RTK, run the same commands beginning with `sh`.
The launcher keeps mise installations and caches in ignored `migration/mise/`.
`mise.toml` pins Hugo 0.165.0, wp2hugo 1.39.0, and Gitleaks 8.30.1. Ordinary mise
commands also work when the default mise directories are writable.

## Production build

```sh
rtk proxy sh scripts/mise-local.sh exec -- hugo build --destination public --environment production --buildDrafts=false --buildFuture=false --buildExpired=false --panicOnWarning
```

Only `public/` is generated website output. GitHub Actions prepares a Pages
preview; publication is explicitly blocked pending media-rights approval.
DNS cutover is not configured. Do not serve the repository itself as static files.
Building and previewing the committed site requires no backups or conversion.

## Content and preservation

- 470 published articles with original public paths and local publication dates.
- 2,638 public article comments with original IDs, reply hierarchy, and dates.
  Each thread is chronological; raw email and IP fields are excluded.
- 21 linked media pages, including one recovered attachment comment: 2,639
  archived comments in total.
- Original category/tag paths, year/month/day archives, and pagination.
- Recovered FTP media, native audio for Virtual Tangka, and self-hosted Ruffle.
- Original Step design adapted to narrow screens, with its animated sidebar.

Ten drafts remain in the private local migration inputs and ignored staging;
they are not included in Git or the production site. XML, SQL, and FTP backups,
logs/reports, and local tool installations are excluded. Internal WordPress
metadata is stripped from tracked article front matter. Comment avatars use local
initials; Gravatar URLs and email hashes are removed from comment records.
Rendered comment HTML is sanitized with a restricted allowlist before Hugo uses it.

## Layout

- `content/`, `layouts/`, `static/`, `data/`, `themes/`, `hugo.yaml`: buildable site.
- Article filenames use `content/posts/YYYY-MM-DD-original-url-slug.md`, based on
  the local WordPress publication date. Keep `url` and `post_id` unchanged.
- `theme-overrides/`: maintained Step templates/assets used by migration scripts.
  Run `python scripts/sync_theme.py` after editing; CI rejects unsynchronized copies.
- `scripts/`, `tests/`: migration helpers and regression tests.
- `migration/`: migration history and review notes. Older notes describe the
  parent workspace, so some commands there begin with `blog/`.

Re-running migration helpers requires the private source backups beside this
repository in the original workspace; those inputs are not distributed here.

## Tests

Python 3.12 and a Node.js installation with its built-in test runner are used.
Migration/release tests require the pinned Python dependencies:

```sh
rtk proxy python3 -m venv .venv
rtk proxy .venv/bin/python -m pip install -r requirements-migration.txt
rtk proxy .venv/bin/python -m unittest discover -s tests -v
rtk proxy node --test tests/test_*.cjs
rtk proxy .venv/bin/python scripts/sync_theme.py --check
rtk proxy .venv/bin/python scripts/sanitize_comments.py --check
rtk proxy .venv/bin/python scripts/validate_site.py --directory public
```

Tests use synthetic fixtures. Inventories and source reconciliation remain
local migration checks rather than tests requiring private backups.

## GitHub Pages preview

The CI runs Python/JavaScript regression tests, comment and theme checks, Gitleaks,
and Hugo with `--panicOnWarning`. It then prepares legacy paths for
`https://overstep-metaflash.github.io/overstep-website/` and validates the output.
Preview HTML is marked `noindex, nofollow`; the original domain and DNS are unchanged.

Both the site-artifact upload and deployment require **both**
`docs/media-rights.json` → `publication_approved: true` and the repository variable
`PAGES_RELEASE_APPROVED=true`. Both remain disabled. The build can run without
activating Pages or publishing an archive of the website. The repository itself
is public and already contains audio files from the initial version.

See [the release review](docs/preproduction-review.md) for local preview-build
commands, recovery details, remaining blockers, and eventual release steps.

## Remaining review

This initial version supports continued review; production cutover is pending.
Known gaps include two externally hosted images, several legacy links, unconfirmed
audio redistribution rights, and source spam links requiring editorial cleanup.
Browser playback and visual fidelity still need manual checks.
Firefox may warn about WebGL diagnostics and block audio autoplay; Ruffle cannot
override browser audio policy.

See `migration/FIRST-VERSION.md` and the migration notes for validation details.
Third-party runtime/theme licenses are retained with their respective files.
