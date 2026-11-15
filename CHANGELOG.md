# Changelog

## Unreleased

### Changed

- Organize article source filenames by local publication date and original URL
  slug, preserving public URLs and comment associations.
- Enforce synchronization between maintained theme overrides and installed files.

### Fixed

- Restore 21 referenced media pages and the missing attachment comment, retaining
  its original page URL and comment anchor.
- Recover three external images and correct outdated image links. Convert titled
  Flash-wrapper links to embedded Ruffle players.
- Resolve numeric WordPress post queries in the browser while retaining comment
  anchors, and provide a legacy feed browser fallback.

### Security

- Sanitize rendered comments and author links with an explicit HTML allowlist.
- Replace Gravatar identifiers and requests with local initials.
- Prepare a Pages preview CI with regression tests, secret scanning, strict Hugo
  builds, and output validation. Keep artifact upload and deployment blocked by
  explicit media-rights and release approvals; leave DNS unchanged.

### Added

- Initial Hugo site with 470 public articles, preserved URLs, local dates,
  categories, tags, and paginated calendar archives.
- Archived public comments with original anchors, replies, and chronological order.
- Original Step artwork and responsive templates, recovered local media,
  self-hosted Ruffle playback, and Virtual Tangka audio.
- Versioned mise tooling, migration helpers, and regression tests.

### Privacy

- Excluded drafts, raw backups, private comment contact fields, and internal
  WordPress metadata from the initial repository contents.
