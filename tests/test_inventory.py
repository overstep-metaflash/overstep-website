import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from inventory import analyze, local_asset


class InventoryTests(unittest.TestCase):
    def test_inventory_separates_drafts_and_omits_personal_data(self):
        xml = '''<rss xmlns:wp="http://wordpress.org/export/1.2/"
          xmlns:content="http://purl.org/rss/1.0/modules/content/">
          <channel><link>https://example.test</link><item>
          <wp:post_id>1</wp:post_id><wp:post_type>post</wp:post_type>
          <wp:status>publish</wp:status><link>https://example.test/old/</link>
          <content:encoded><![CDATA[<img src="/wp-content/uploads/a.jpg"
          srcset="/wp-content/uploads/b.jpg 2x"><iframe src="https://video.test/v"></iframe>
          [gallery ids="2"]<pre>code</pre>]]></content:encoded>
          <wp:comment><wp:comment_approved>1</wp:comment_approved>
          <wp:comment_author_email>secret@example.test</wp:comment_author_email></wp:comment>
          </item><item><wp:post_id>2</wp:post_id><wp:post_type>post</wp:post_type>
          <wp:status>draft</wp:status><link>https://example.test/private/</link>
          <content:encoded>Private text</content:encoded></item></channel></rss>'''
        result = analyze(xml)
        self.assertEqual(result['counts']['post:publish'], 1)
        self.assertEqual(result['counts']['post:draft'], 1)
        self.assertEqual(result['public_urls'], ['https://example.test/old/'])
        self.assertNotIn('private', str(result))
        self.assertNotIn('secret@', str(result))
        self.assertEqual(result['comments'], {'1': 1})
        self.assertEqual(len(result['references']), 3)
        self.assertEqual(result['features']['gallery'], [1])
        self.assertEqual(result['features']['code'], [1])

    def test_local_asset_resolution_is_host_aware_and_contained(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'a b.jpg').write_bytes(b'image')
            self.assertEqual(local_asset('https://example.test/wp-content/uploads/a%20b.jpg?x=1', 'example.test', root), 'a b.jpg')
            self.assertIsNone(local_asset('https://other.test/wp-content/uploads/a%20b.jpg', 'example.test', root))
            self.assertIsNone(local_asset('/wp-content/uploads/%2e%2e/secret', 'example.test', root))
            self.assertIsNone(local_asset('/wp-content/uploads/missing.jpg', 'example.test', root))


if __name__ == '__main__':
    unittest.main()
