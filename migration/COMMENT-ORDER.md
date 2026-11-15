# Chronological comment ordering

Root comments and replies are now explicitly sorted by their imported `published`
timestamp, ascending. Input order and numerical comment ID do not determine display
order. Replies remain nested under their original parent, and each sibling group
is chronological. This is a threaded view, not a flat global date ordering.

The maintained templates are `theme-overrides/layouts/partials/comments.html` and
`theme-overrides/layouts/_partials/comment.html`. Install changes using the existing
`scripts/integrate_ruffle.py --site ...` procedure.

A regression test builds a synthetic Hugo site with deliberately shuffled roots,
replies, and IDs, plus a comment from another article. It first failed with the
old templates and passes with explicit date sorting:

```sh
rtk proxy python3 -m unittest discover -s blog/tests -p test_comment_order.py -v
```

The production build passes with `--panicOnWarning` into
`public-comment-order-validation/`. All 470 public article outputs were checked:
all 2,638 comments and their original parent IDs remain present, and every sibling
group is sorted by source publication time. The live example on port 1314 also
has chronological root comments. See `reports/comment-order-validation.json`.
No source comment data or backup was changed.
