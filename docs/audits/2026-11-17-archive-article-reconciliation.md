# Catalogue scope and article audio reconciliation

This follow-up answers the owner's questions about catalogue scope and missing
article media. It records the subsequent instruction: prioritize Flash in the
article, keep its replacement image in archives, remove Dewplayer, use Spotify
for verified recordings and preserve personal compositions/remixes with native
audio.

## First-batch scope

The first catalogue grouped 63 already-public paths into 55 notices. It did not
import the separate 911 absent source paths: 296 SWFs and 615 images, representing
894 distinct byte payloads. The complete private master preserves those files,
but their consultable catalogue remains unfinished. Grouping explains 63 versus
55; it does not explain the difference from 911. No new media from that 911-file
inventory was imported in this follow-up.

Removing the obsolete Dewplayer notice and public payload leaves **54 notices for
62 original media paths**. The original dated usage/catalogue reports remain as
historical evidence.

## Review of all 63 initial candidate paths

The candidates were compared with all 470 published WordPress article bodies,
retained Simply Static captures, and current article-scoped rendered media.
Comparison used decoded full paths and SHA-256 aliases. Attachment ownership or
a shared basename alone does not prove a file was inserted into an article.
Reviewed results are in `docs/media-archive-article-review.json`.

| Group | Paths | Finding |
| --- | ---: | --- |
| Replacement image thumbnails | 29 | Source image references exist; current articles present Flash players instead, as intended and confirmed by the owner. |
| Other images | 24 | No embedded reference to these exact payloads in retained article sources; variants, different sizes, old site artwork and four former cover thumbnails. |
| Identical SWF aliases | 4 | Their exact payloads already render at other SWF paths. |
| Other SWFs | 5 | Four non-selected attachments/variants and the old links animation; no original article embedding established. |
| Dewplayer | 1 | Historical control software used by 14 articles; its MP3 associations needed separate review. |

No new missing artwork association was established in this first batch. This
does not establish coverage of every unimported FTP file. Examples:

- *Contre Violence* originally names `invocation1.swf` and still renders it;
  `invocation.swf` is a variant.
- *Les motifs de la légèreté* retains the original `farfaraway2.swf`, rather than
  the alternate `farfaraway.swf`.
- *Mais aussi dans les nuages* retains `dieuours_inthesky2.jpg`; its attachment
  `journey.swf` was not embedded in that article's retained sources.
- `alpha-1.swf` duplicates `alpha.swf` in *Dragon du Centaure*. The catalogue now
  links that actual use instead of attachment parent *Mythologie*, whose original
  and current player both use `saisons.swf`.

Catalogue notices now explicitly identify replacement images and variants.

## Real omission: separate article audio controls

Dewplayer had **15 MP3 associations in 14 articles**. Three already had native
audio from previous recovery. The other **12 explicit controls in 11 articles
were missing**, as were those MP3 payloads at their original public paths.
Preserving `dewplayer.swf` alone could not restore those associations.

`docs/article-audio-recovery.json` now records seven Spotify and eight native
players. The twelve missing controls are restored; the three earlier native
players remain. Credits, artwork, dates, IDs and surrounding prose are retained.

| Restored Spotify article | Verified composition/performer |
| --- | --- |
| Sur la route… | Joe Harnell — The Lonely Man Theme |
| Moon révérence… | Michael Jackson — Billie Jean |
| Mon époque la crise… | Portishead — Deep Water |
| Afrik | The Roots — Right On |
| Spleen & Idéal (2) | Sébastien Tellier — La ritournelle |
| L'aube des Métamorphoses | Infected Mushroom — Project 100 |
| Jour 33: Sophia | The Dø — Dust It Off |

Spotify's own track/embed metadata verified these titles and performers. Exact
equivalence to the historical recording/master or MP3 bytes is not asserted.
Personal `alkadynamic.MP3` and `intentions.mp3` use their original native audio.
The two Gilles Soulet *5e Axe* recordings and `makuiscoming.mp3` also use local
fallbacks because no verified Spotify recording was found; they can be replaced
when matching URLs are supplied. Existing local `oneshot.mp3`, `shadows.mp3` and
`everyoneintheworld.mp3` remain unchanged.

Five exact original MP3 payloads were restored with case-sensitive paths and
SHA-256 evidence. Their hashes differ from all 17 excluded radio tracks. The
approved public audio inventory is now 52 files in `docs/media-rights.json`;
publication approval was not changed.

The maintained `spotify-track` shortcode uses a dark, full-width, 152-pixel
player, accessible title, playback permissions and direct fallback link. Invalid
track identifiers fail the build. No SDK or credentials are introduced. See the
official [Embed sizing guide](https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed)
and [oEmbed reference](https://developer.spotify.com/documentation/embeds/reference/oembed).

## Verification and release state

All 121 Python and 25 JavaScript tests pass. Dedicated output validation checks
the 15 associations, exact Spotify IDs/settings, local hashes, project prefixes,
multiple controls and removal of the obsolete public Dewplayer file. CI runs
this alongside the site, Metaflash and catalogue validators.

Root and project-prefix cold builds retain 491 historical pages, 2,639 comments,
124 recovered Flash associations and four audited images. Chrome renders the
dark Spotify player in *Jour 33: Sophia*; a genuine Play click switches to Pause
for its preview. The personal remix decodes and advances playback through the
project-prefix URL. Full-track Spotify playback/login/region acceptance is not
claimed from a preview check.

These changes remain local and unpublished. The complete private master,
including original Dewplayer, is unchanged; its second copy remains pending.
