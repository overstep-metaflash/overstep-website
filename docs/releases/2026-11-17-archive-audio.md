# Archive and article audio release

The owner explicitly requested publication of the reviewed changes, followed by
preparation of the remaining 911-file catalogue batch. The first operation was
completed before starting the local catalogue extension.

- Published commit: `660afd3a985f52d48b59cdfb7f0189a5e9abdf89`, including the
  preceding independent-catalogue commit `26c4f88`.
- [GitHub Actions run](https://github.com/overstep-metaflash/overstep-website/actions/runs/44087393368):
  build and deployment succeeded, including all 121 Python and 25 JavaScript
  tests, secret scanning, path preparation and all four output validators.
- [Published catalogue](https://overstep-metaflash.github.io/overstep-website/archives/metaflash/):
  54 notices covering 62 existing media paths, after removal of Dewplayer.
- Live catalogue HTML and the original personal remix `alkadynamic.MP3` matched
  their reviewed SHA-256 values. The released *Jour 33: Sophia* page contains
  its exact reviewed Spotify track embed.
- Both existing release gates were retained. No repository visibility, DNS or
  custom-domain change was made.

The subsequently prepared FTP expansion is **not part of this deployment**.
See `docs/audits/2026-11-17-ftp-catalogue.md` for that local preparation and its
private-material exclusions.
