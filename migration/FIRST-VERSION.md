# Initial repository version

This records the initial push. The subsequent hardening and recovery work is
documented in `../docs/preproduction-review.md`; it replaces Gravatar with initials,
restores attachment pages/comments, and prepares a gated Pages workflow.

The reviewed staging site has been promoted into the repository root. A clone
builds directly with Hugo; it does not need the WordPress XML, SQL, FTP backup,
raw converter output, or the old absolute staging path.

## Included

- 470 published posts with original public URLs, GUIDs, categories, tags, and
  source local display dates.
- 2,638 public article comments with original IDs, timestamps, text, and reply
  relationships. Avatar URLs preserve the existing hashes.
- Populated date archives, original category/tag URLs, pagination, local media,
  maintained Step theme overrides, bundled PaperMod support templates, and Ruffle.
- Versioned tool configuration, synthetic tests, and migration history.

## Excluded

- All 10 drafts, including their titles, URLs, bodies, and comment records.
- Raw WordPress XML/SQL/FTP backups, raw output, local reports/logs, and tools.
- Raw comment email/IP/contact fields and internal WordPress plugin/edit metadata.
- Unused taxonomy terms that have no public post assignments and raw media-library
  metadata. Only the assets already selected for public content were promoted.

`scripts/prepare_release.py` applies a front-matter allowlist, excludes drafts,
filters comments by public post IDs, and replaces email fields with avatar URLs.
It uses PyYAML 6.0.3 with safe loading. It refuses to overwrite a site that has
already been promoted. The source reconciliation and the promotion report are
kept locally under the ignored reports directory. Raw staging remains available
locally for continued investigation.

The root templates and maintained overrides are synchronized. Future changes
should update both, or deliberately reapply the maintained overrides. Migration
helpers still expect the original parent workspace; they are not needed to edit,
build, or preview the committed site.

## Validation before the initial push

Run the production build from the repository root with warnings treated as errors:

```sh
rtk proxy sh scripts/mise-local.sh exec -- hugo build --destination public --environment production --buildDrafts=false --buildFuture=false --buildExpired=false --panicOnWarning
```

The initial repository preparation runs the complete synthetic Python suite and
JavaScript player tests, reconciles the public articles/comments against the
original XML locally, checks excluded files and private fields, and scans staged
files for credentials with pinned Gitleaks. Generated output is not committed.

Verified for the initial commit: 30 Python tests and three player tests passed;
the promoted production build passed; all 470 public article paths and 2,638
comment anchors reconciled; all 2,022 staged files were checked for excluded
inputs and oversized files; Gitleaks found no credentials in the staged diff.

Known migration gaps remain described in the root README. This is the first
reviewable repository version, not a production deployment or completed cutover.
In particular, one attachment-page comment remains omitted by the converter;
the 2,638 public article comments are preserved in full. Some source posts contain
previously injected spam links, retained pending explicit editorial cleanup.
