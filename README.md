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

Only `public/` is generated website output. Deployment and DNS cutover are not
configured by this repository. Do not serve the repository itself as static files.
Building and previewing the committed site requires no backups or conversion.

## Content and preservation

- 470 published articles with original public paths and local publication dates.
- 2,638 public article comments with original IDs, reply hierarchy, and dates.
  Each thread is chronological; raw email and IP fields are excluded.
- Original category/tag paths, year/month/day archives, and pagination.
- Recovered FTP media, native audio for Virtual Tangka, and self-hosted Ruffle.
- Original Step design adapted to narrow screens, with its animated sidebar.

Ten drafts remain in the private local migration inputs and ignored staging;
they are not included in Git or the production site. XML, SQL, and FTP backups,
logs/reports, and local tool installations are excluded. Internal WordPress
metadata is stripped from tracked article front matter. Comment avatar URLs
retain only the hashes needed for existing public avatars.

## Layout

- `content/`, `layouts/`, `static/`, `data/`, `themes/`, `hugo.yaml`: buildable site.
- `theme-overrides/`: maintained Step templates/assets used by migration scripts.
  Keep these synchronized with the installed root templates/assets when editing.
- `scripts/`, `tests/`: migration helpers and regression tests.
- `migration/`: migration history and review notes. Older notes describe the
  parent workspace, so some commands there begin with `blog/`.

Re-running migration helpers requires the private source backups beside this
repository in the original workspace; those inputs are not distributed here.

## Tests

Python 3.12 and a Node.js installation with its built-in test runner are used.
Migration/release tests additionally require PyYAML:

```sh
rtk proxy python3 -m venv .venv
rtk proxy .venv/bin/python -m pip install -r requirements-migration.txt
rtk proxy .venv/bin/python -m unittest discover -s tests -v
rtk proxy node --test tests/test_player.cjs
```

Tests use synthetic fixtures. Inventories and source reconciliation remain
local migration checks rather than tests requiring private backups.

## Remaining review

This initial version supports continued review; production cutover is pending.
Known gaps include five externally hosted images, legacy non-Flash HTML links,
one comment on a media page omitted by wp2hugo, and source spam links requiring
editorial cleanup. Browser playback and visual fidelity still need manual checks.
Firefox may warn about WebGL diagnostics and block audio autoplay; Ruffle cannot
override browser audio policy.

See `migration/FIRST-VERSION.md` and the migration notes for validation details.
Third-party runtime/theme licenses are retained with their respective files.
