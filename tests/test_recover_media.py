import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from recover_media import collect_urls, resolve_media, copy_media


class MediaTests(unittest.TestCase):
    def test_public_shortcodes_and_attachments_but_not_drafts(self):
        xml = '''<rss xmlns:wp="http://wordpress.org/export/1.2/" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel>
        <link>https://example.test</link><item><link>https://example.test/post/</link><wp:post_id>1</wp:post_id><wp:post_type>post</wp:post_type><wp:status>publish</wp:status><content:encoded><![CDATA[[swf:"https://example.test/a.swf"]<img src="/a.jpg">]]></content:encoded></item>
        <item><wp:post_id>2</wp:post_id><wp:post_type>post</wp:post_type><wp:status>draft</wp:status><content:encoded><![CDATA[<img src="/private.jpg">]]></content:encoded></item>
        <item><wp:post_type>attachment</wp:post_type><wp:post_parent>1</wp:post_parent><wp:attachment_url>https://example.test/attached.jpg</wp:attachment_url></item>
        <item><wp:post_type>attachment</wp:post_type><wp:post_parent>2</wp:post_parent><wp:attachment_url>https://example.test/private2.jpg</wp:attachment_url></item>
        </channel></rss>'''
        base, urls = collect_urls(xml)
        self.assertEqual(base, 'https://example.test')
        self.assertEqual(set(urls), {'https://example.test/a.swf', 'https://example.test/a.jpg', 'https://example.test/attached.jpg'})

    def test_resolution_and_copy_preserve_paths_and_reject_escape(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / 'backup_ftp/blog/wordpress/wp-content/uploads/a b.jpg'
            source.parent.mkdir(parents=True)
            source.write_bytes(b'image')
            url = 'https://example.test/wp-content/uploads/a%20b.jpg?x=1'
            resolved = resolve_media(url, 'https://example.test', root)
            self.assertEqual(resolved, (source, 'wp-content/uploads/a b.jpg'))
            self.assertIsNone(resolve_media('https://other.test/wp-content/uploads/a%20b.jpg', 'https://example.test', root))
            self.assertIsNone(resolve_media('https://example.test/%2e%2e/secret.jpg', 'https://example.test', root))
            self.assertIsNone(resolve_media('https://example.test/wp-config.php', 'https://example.test', root))
            static = root / 'static'
            copy_media(source, static, resolved[1])
            self.assertEqual((static / resolved[1]).read_bytes(), b'image')
            (static / resolved[1]).write_bytes(b'different')
            with self.assertRaises(FileExistsError):
                copy_media(source, static, resolved[1])

    def test_reviewed_flash_wrapper_and_dependency_are_recovered(self):
        from recover_media import wrapper_dependencies
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            relative = 'wp-content/uploads/2014/05/golgoth.html'
            wrapper = root / 'backup_ftp/blog/wordpress' / relative
            wrapper.parent.mkdir(parents=True)
            wrapper.write_text('<object data="golgoth.swf"></object>')
            url = 'https://example.test/' + relative
            self.assertEqual(resolve_media(url, 'https://example.test', root), (wrapper, relative))
            self.assertEqual(wrapper_dependencies(wrapper, url), ['https://example.test/wp-content/uploads/2014/05/golgoth.swf'])

    def test_relative_positional_swf_reference(self):
        xml = '''<rss xmlns:wp="http://wordpress.org/export/1.2/" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><link>https://example.test</link><item><wp:post_id>1</wp:post_id><wp:post_type>post</wp:post_type><wp:status>publish</wp:status><content:encoded>[swf:/wp-content/uploads/old.swf 540 729]</content:encoded></item></channel></rss>'''
        self.assertEqual(collect_urls(xml)[1], ['https://example.test/wp-content/uploads/old.swf'])


if __name__ == '__main__':
    unittest.main()
