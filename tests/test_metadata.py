import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from refresh_metadata import rewrite_post, source_metadata, source_tags


class MetadataTests(unittest.TestCase):
    def test_tag_slugs_and_display_names_remain_separate(self):
        xml = '''<rss xmlns:wp="http://wordpress.org/export/1.2/"><channel><wp:tag><wp:tag_slug>meditation</wp:tag_slug><wp:tag_name>méditation</wp:tag_name></wp:tag><item><wp:post_type>post</wp:post_type><wp:post_id>42</wp:post_id><category domain="post_tag" nicename="meditation">méditation</category></item></channel></rss>'''
        self.assertEqual(source_tags(xml), ({'meditation': 'méditation'}, {'42': ['meditation']}))
        text = '---\nauthor: ladje\ntags:\n  - méditation\nurl: /old/\n---\nOriginal body'
        result = rewrite_post(text, [], tags=['meditation'])
        self.assertIn('tags:\n  - "meditation"', result)
        self.assertIn('url: /old/', result)
        self.assertEqual(rewrite_post(result, [], tags=['meditation']), result)

    def test_category_slug_and_name_are_preserved_separately(self):
        xml = '''<rss xmlns:wp="http://wordpress.org/export/1.2/"><channel>
        <wp:category><wp:category_nicename>son</wp:category_nicename><wp:cat_name>&amp;quot;Let ze music play&amp;quot;</wp:cat_name></wp:category>
        <item><wp:post_type>post</wp:post_type><wp:post_id>42</wp:post_id><category domain="category" nicename="son">&amp;quot;Let ze music play&amp;quot;</category></item>
        </channel></rss>'''
        categories, posts = source_metadata(xml)
        self.assertEqual(categories, {'son': '"Let ze music play"'})
        self.assertEqual(posts, {'42': ['son']})

    def test_metadata_changes_preserve_body_url_and_date(self):
        original = '---\nauthor: ladje\ncategories:\n  - bad-name\ndate: "2017-04-07"\npost_id: "42"\nurl: /original/\n---\nBody mentioning ladje remains unchanged.\n'
        result = rewrite_post(original, ['son'])
        self.assertIn('author: Step\ncategories:\n  - "son"\n', result)
        self.assertIn('date: "2017-04-07"', result)
        self.assertIn('url: /original/', result)
        self.assertEqual(result.split('---', 2)[2], original.split('---', 2)[2])
        self.assertEqual(rewrite_post(result, ['son']), result)

    def test_wordpress_calendar_date_is_preserved_without_rewriting_the_instant(self):
        source = '---\nauthor: Step\ndate: "2016-06-28T23:37:16Z"\n---\nBody\n'
        result = rewrite_post(source, [], '2016-06-29')
        self.assertIn('wordpress_display_date: "2016-06-29"', result)
        self.assertIn('date: "2016-06-28T23:37:16Z"', result)
        self.assertEqual(rewrite_post(result, [], '2016-06-29'), result)
