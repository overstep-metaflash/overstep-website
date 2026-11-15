import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from prepare_release import public_front_matter, public_comments


class ReleaseTests(unittest.TestCase):
    def test_drafts_are_excluded_and_internal_metadata_is_removed(self):
        self.assertIsNone(public_front_matter({'post_id': '1', 'draft': 'true', 'title': 'Private'}))
        source = {'post_id': '2', 'title': 'Public', 'url': '/original/', 'guid': 'https://example.test/?p=2',
                  '_linker_sigs': ['private-token'], '_edit_last': '1', 'categories': ['son'],
                  'wordpress_display_date': '2005-12-16'}
        result = public_front_matter(source)
        self.assertNotIn('_linker_sigs', result)
        self.assertNotIn('_edit_last', result)
        self.assertEqual(result['url'], '/original/')
        self.assertEqual(result['guid'], source['guid'])

    def test_only_public_comments_and_public_fields_are_retained(self):
        source = [{'id': '10', 'post_id': '2', 'parent_id': '0', 'published': '2005-12-16T10:00:00Z',
                   'author_name': 'Reader', 'author_email': 'private@example.test', 'author_ip': '192.0.2.1',
                   'author_url': 'https://example.test/', 'content': 'Original comment'},
                  {'id': '11', 'post_id': '1', 'author_email': 'draft@example.test'}]
        result = public_comments(source, {'2'})
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['content'], 'Original comment')
        self.assertEqual(result[0]['parent_id'], '0')
        self.assertNotIn('author_email', result[0])
        self.assertNotIn('author_ip', result[0])
        self.assertNotIn('private@example.test', str(result))
        self.assertTrue(result[0]['avatar_url'].startswith('https://gravatar.com/avatar/'))
