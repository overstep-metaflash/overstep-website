"""Replace only source-reviewed links in the rendered archived comments."""

import html
import re


# Keys bind each exact source URL to its originating comment and article.
# The raw comment remains unchanged; see docs/audits/2026-11-16-historical-links.md.
COMMENT_LINKS = {
    ('6756', '1823'): {'/liens.html)': '/#blogroll'},
    ('7474', '1989'): {
        '/blog/index.php?2008/04/15/208-jour18-l-ouverture-d-esprit#co':
        '/2008/04/15/jour18-l-ouverture-d-esprit/#comments'},
    ('8250', '2047'): {
        '/blog/index.php?2008/09/08/245-les-remous-de-l-equilibre':
        '/2008/09/08/les-remous-de-l-equilibre/'},
    ('8258', '2048'): {
        '/blog/index.php?2008/08/22/242-mystigris)': '/2008/08/22/mystigris/'},
}


def rewrite_comment_links(source, comment):
    """Rewrite anchor attributes after sanitization, leaving text and IDs intact."""
    replacements = COMMENT_LINKS.get((str(comment.get('id')), str(comment.get('post_id'))), {})
    if not replacements:
        return source

    def anchor(match):
        def attribute(attr):
            target = replacements.get(html.unescape(attr[2]))
            return f'{attr[1]}="{html.escape(target, quote=True)}"' if target else attr[0]
        return re.sub(r'\b(href|title)="([^"]*)"', attribute, match[0])

    return re.sub(r'<a\b[^>]*>', anchor, source)
