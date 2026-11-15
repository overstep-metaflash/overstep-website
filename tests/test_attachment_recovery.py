import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from restore_attachment_comments import select_attachments


class AttachmentRecoveryTests(unittest.TestCase):
    def test_only_referenced_or_commented_attachments_of_public_posts_are_selected(self):
        def item(id, kind, status='inherit', parent='1', comment=False):
            element = ET.fromstring(f'''<item xmlns:wp="http://wordpress.org/export/1.2/">
              <wp:post_id>{id}</wp:post_id><wp:post_type>{kind}</wp:post_type>
              <wp:status>{status}</wp:status><wp:post_parent>{parent}</wp:post_parent>
              <link>https://example.test/media/{id}/</link></item>''')
            if comment:
                node = ET.SubElement(element, '{http://wordpress.org/export/1.2/}comment')
                ET.SubElement(node, '{http://wordpress.org/export/1.2/}comment_approved').text = '1'
            return element
        items = [item('1', 'post', 'publish'), item('2', 'post', 'draft'),
                 item('3', 'attachment'), item('4', 'attachment', comment=True),
                 item('5', 'attachment'), item('6', 'attachment', parent='2', comment=True)]
        selected = select_attachments(items, '[Image](/media/3/) [Private](/media/6/)')
        self.assertEqual([record.findtext('{http://wordpress.org/export/1.2/}post_id') for record in selected], ['3', '4'])
