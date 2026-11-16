# Legacy query URLs and RSS review

Reviewed on 2026-11-16 for issue #7. This review supplements the original content
audit; it does not replace its findings. The owner selected **GitHub Pages only**
for hosting during this review. No deployment, domain configuration, DNS change,
or release-gate change was performed.

## Hosting decision and limits

Keep the existing static compatibility mechanisms for the selected Pages target:

| Request | Handling on the static site | Limitation |
| --- | --- | --- |
| `/?p=ID#comment-ID` | Same-origin JavaScript lookup in `legacy-posts.json`, followed by `location.replace` | Requires page JavaScript; not an HTTP permanent redirect |
| Unknown numeric ID | Remain on the requested page | Does not establish a missing-post HTTP status |
| `/feed/` | HTML refresh and a visible link to `../feed.xml` | Browser fallback; existing RSS subscriptions may fail |
| `/feed.xml` | Generated RSS 2.0 XML; footer and feed-discovery links point here | Actual Pages response headers and reader subscription behavior await release testing |
| Historical article/attachment path | Serve the preserved path, including comment IDs | Keep the project prefix in the preview |
| Canonical-domain request | Retain the existing build-specific canonical link | No HTTP domain redirect is configured |

GitHub documents Pages as a [static hosting service](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
and explicitly excludes [server-side languages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#static-site-generators).
The resulting constraint for this migration is that repository files cannot
inspect `p` on the server and select an HTTP `Location` response. A static alias,
HTML refresh, JavaScript redirect, or canonical link does not supply that behavior.
Do not add Apache/Nginx configuration to the Pages artifact as a purported fix.

GitHub's [custom-domain support](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
includes specific apex/`www` redirects after domain/DNS configuration. This is
separate from WordPress query routing and does not authorize configuring the old
domain now. Keep `hugo.yaml`'s original root base URL and the workflow's selected
project-preview base URL. Do not add a CNAME during this review.

The Pages-only choice defines the implementation boundary; it is not approval
to declare the original HTTP-redirect/RSS acceptance criteria satisfied. Before
production cutover, the owner must either explicitly accept these static-host
limitations or revise the hosting constraint. Issue #7 remains open.

## Regression coverage

`tests/test_legacy_urls.py` verifies that all 491 map entries match the public
article/attachment front matter exactly, without adding drafts. A synthetic site
uses the actual Hugo configuration and RSS template with Hugo 0.165.0 at both
base paths. It checks RSS structure, self/item links, a stable synthetic GUID,
draft exclusion, and the browser fallback's relative destinations. This is XML
and output coverage, not an RSS application test.

`tests/test_legacy_redirects.cjs` covers real public IDs at both base paths:

| ID | Destination or anchor |
| --- | --- |
| 1724 | `/2005/12/02/a-n-en-pas-douter/` |
| 4044 | `/2017/04/07/11-la-fleur-qui-eleve/#comment-51953` |
| 3357 | `/2014/05/13/dans-cette-foret/rdv/#comment-20443` |
| 3384 | `/2014/04/18/σοφiα/magnamatter/` |

Additional cases retain the page for unknown numeric IDs, external/network-path
destinations, backslash destinations, and unavailable mappings. These tests do
not change the redirect implementation or public routes.

## HTTP and Chrome evidence

Both complete production builds passed with warnings treated as errors. The
project build was processed by `prepare_pages.py` before validation and serving.
Only generated output was served on loopback; no repository or backups were
exposed. The local server uses Python's static-file handler, not GitHub's serving
infrastructure. Its headers cannot establish the future Pages headers.

Sixteen HTTP checks covered IDs 1724, 4044, 3357, unknown ID 999999, `/feed/`,
`/feed.xml`, and both comment-bearing destination paths at each base path:

- Each query URL returned HTTP 200 `text/html`, identical to that build's home
  page, without `Location`. An HTTP client does not execute the JavaScript lookup.
- `/feed/` returned HTTP 200 `text/html` without `Location`.
- `/feed.xml` returned HTTP 200 `application/xml`. Its bytes matched the generated
  file; XML parsing found RSS 2.0 with 494 items and the expected build-specific
  self URL. This count includes navigation collections, outside the 491 historical
  article/attachment count. It does not establish reader compatibility.
- Both direct article/attachment routes returned HTTP 200 and contained the
  expected `comment-51953` or `comment-20443` anchor.

Chrome navigation covered the same four IDs at both base paths with page scripts
enabled, and again with all page scripts blocked by the response header
`Content-Security-Policy: script-src 'none'`:

| Mode | Known IDs | Comment anchors | Unknown ID |
| --- | --- | --- | --- |
| Scripts enabled | All three navigated to their expected preserved routes | Both existed at the final location | Remained on the home query URL |
| Scripts blocked by CSP | Remained on the home query URL | Fragments remained in the URL, but the home page had no matching anchor | Remained on the home query URL |

This establishes behavior when page scripts cannot execute. The browser-wide
JavaScript setting was not changed; do not describe this as a separate test of
that setting. Chrome also followed `/feed/` to the prefixed or root `feed.xml`
with page scripts blocked and recognized RSS 2.0. HTML refresh is browser behavior,
not an HTTP redirect or RSS reader acceptance.

## RSS application ingestion

The installed **Calibre 9.18.0** news/RSS engine was exercised through
`ebook-convert`, following its [official recipe workflow](https://manual.calibre-ebook.com/news.html).
The installed CLI help and recipe attributes were also checked. A small custom
recipe calls the application's inherited `BasicNewsRecipe.parse_feeds`, records
the resulting feed/articles, and stops before downloading article pages. No
feed was parsed by replacement test code, and no subscription/library was saved.

| Local subscription URL | Engine result |
| --- | --- |
| Root `/feed.xml` | Step feed, 470 retained articles |
| Root `/feed/` | Step feed, 470 retained articles |
| Project-prefix `/feed.xml` | Step feed, 470 retained articles |
| Project-prefix `/feed/` | Step feed, 470 retained articles |

The first retained article in all four runs was “11.La Fleur qui élève”. The
reader's retained count differs from the raw XML's 494 items; do not substitute
one count for the other. Calibre successfully resolves this HTML feed fallback;
that client-specific result does not turn it into an HTTP redirect or guarantee
other RSS clients' behavior. This test covers the installed application's feed
ingestion, not its GUI, persistent subscription refresh, or article rendering.

To repeat ingestion without downloading the historical article pages, save this
recipe under an ignored cache directory, set `STEP_RSS_TEST_URL` to the desired
loopback feed URL, and run `ebook-convert check.recipe ignored-output.epub`.
The intentional exit occurs before an EPUB is created:

```python
import json
import os
from calibre.web.feeds.news import BasicNewsRecipe


class FeedCheck(BasicNewsRecipe):
    title = 'Step local RSS acceptance'
    oldest_article = 10000
    max_articles_per_feed = 500
    feeds = [('Step', os.environ['STEP_RSS_TEST_URL'])]

    def parse_feeds(self):
        feeds = super().parse_feeds()
        print(json.dumps([{'title': f.title, 'items': len(f.articles),
                           'first_item': f.articles[0].title if f.articles else None}
                          for f in feeds], ensure_ascii=False))
        raise SystemExit(0)
```

## Reproduction and remaining acceptance

Run the normal checks from `AGENTS.md`, including the two production builds,
project-prefix preparation, and matching output validation. Targeted regressions:

```sh
rtk proxy .venv/bin/python -m unittest discover -s tests -p test_legacy_urls.py -v
rtk proxy node --test tests/test_legacy_redirects.cjs
```

The complete local baseline is **80 Python tests and 19 JavaScript tests**, both
passing. Theme synchronization, comment sanitization, and both output validations
also passed: 491 historical pages, 2,639 comments, 124 recovered Flash associations,
four audited inline-image associations, and zero missing local destinations.

Before release, test the actual selected origin without relying on local-server
headers. Request query URLs and `/feed/` without following redirects first;
record status, `Location`, content type and payload. Subscribe to `/feed.xml`
and separately to `/feed/` in an RSS reader, refresh the subscriptions,
and open an item. Record the application/version, final URL, parsed items and
any error. Calibre's local ingestion test does not establish saved-subscription
or released-origin behavior. Pages remains unpublished, so those checks remain
pending. Also repeat representative query
navigation with the browser's JavaScript setting disabled if that exact mode is
required for acceptance. Neither testing nor the hosting choice enables release.
