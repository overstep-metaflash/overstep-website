"""Generate only public WordPress post-ID destinations for static redirects."""

import json
from pathlib import Path
from prepare_release import read_markdown

blog = Path(__file__).resolve().parents[1]
mapping = {}
for section in ('posts', 'attachments'):
    for path in (blog / 'content' / section).glob('*.md'):
        metadata, _ = read_markdown(path)
        if not metadata.get('draft'):
            mapping[str(metadata['post_id'])] = metadata['url']
(blog / 'static/legacy-posts.json').write_text(json.dumps(mapping, ensure_ascii=False, sort_keys=True, indent=2) + '\n')
print(f'Generated {len(mapping)} public post-ID destinations.')
