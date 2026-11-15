# Step website

This is the Hugo target site for the WordPress migration. Discuss work in French;
write code, comments, technical documentation, and commit messages in English.
Use Conventional Commits and human-oriented changelog entries.

Use mise tool versions from `mise.toml`. Run local tools through
`sh scripts/mise-local.sh exec -- <command>` if the default mise directories are
not writable. Commands in the original workspace are prefixed with `rtk proxy`.

Production build: `sh scripts/mise-local.sh exec -- hugo build --destination public
--environment production --buildDrafts=false --buildFuture=false
--buildExpired=false --panicOnWarning` (one command).

Run Python tests with the dependencies in `requirements-migration.txt` and
`python -m unittest discover -s tests -v`; run player tests with
`node --test tests/test_player.cjs`.

Preserve public article URLs, category/tag/date archive paths, comment IDs,
local publication dates, and threaded chronological comment ordering. Author
display name is Step. Keep maintained `theme-overrides/` synchronized with root
`layouts/` and the corresponding assets under `static/`.

Keep raw WordPress XML/SQL/FTP backups immutable and outside Git. Drafts, private
comment fields, tool installations, reports, logs, and raw converter output must
never be staged. Only `public/` is generated website output. No production deploy
or DNS changes are implied by edits or pushes to this repository.

Migration scripts may depend on the private parent workspace, while the tracked
site must build independently from those inputs. Use representative synthetic
fixtures for custom migration behavior. Consult version-matched Context7 docs
before introducing external tool or library APIs. See `migration/FIRST-VERSION.md`.
