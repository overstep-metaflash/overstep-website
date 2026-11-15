import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from sanitize_comments import sanitize_comment


class CommentSecurityTests(unittest.TestCase):
    def test_malformed_author_urls_are_rejected_without_losing_the_comment(self):
        for url in ['https://[invalid', 'https://user:password@example.test', 'file:///private', 'https://example.test/\npath']:
            with self.subTest(url=url):
                result = sanitize_comment({'content': 'Preserved', 'author_url': url})
                self.assertEqual(result['author_url'], '')
                self.assertIn('Preserved', result['content_html'])

    def test_scripts_handlers_and_obfuscated_links_are_removed_after_markdown(self):
        comment = {'author_name': 'Example Reader', 'author_url': 'javascript:alert(1)',
                   'avatar_url': 'https://gravatar.com/avatar/private-hash', 'author_email': 'private@example.test',
                   'content': '<script>alert(1)</script><p onclick="bad()">Hello <b>world</b></p><a href="java&#x73;cript:bad()">bad</a>\n\n[markdown](javascript:alert(1))\n<img src=x onerror=bad()><iframe src="https://bad.test"></iframe>'}
        result = sanitize_comment(comment)
        output = result['content_html']
        for dangerous in ['<script', 'onclick=', 'onerror=', 'href="javascript:', '<img', '<iframe']:
            self.assertNotIn(dangerous, output)
        self.assertIn('<b>world</b>', output)
        self.assertNotIn('author_email', result)
        self.assertNotIn('avatar_url', result)
        self.assertEqual(result['author_url'], '')
        self.assertEqual(result['initials'], 'ER')

    def test_public_text_links_thread_ids_and_dates_are_preserved(self):
        original = {'id': '123', 'parent_id': '42', 'published': '2020-08-15T19:34:00Z',
                    'author_name': 'Luechan', 'author_url': 'https://example.test/',
                    'content': '<p>Accents : éèà</p>\n\n**bold** [link](https://example.test/)'}
        result = sanitize_comment(original)
        self.assertEqual(result['id'], '123')
        self.assertEqual(result['parent_id'], '42')
        self.assertEqual(result['published'], original['published'])
        self.assertIn('Accents : éèà', result['content_html'])
        self.assertIn('<strong>bold</strong>', result['content_html'])
        self.assertIn('href="https://example.test/"', result['content_html'])
        self.assertEqual(sanitize_comment(result), result)
