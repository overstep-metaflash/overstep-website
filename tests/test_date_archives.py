import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from generate_date_archives import archive_records


class DateArchiveTests(unittest.TestCase):
    def test_year_month_day_use_local_wordpress_dates_and_exclude_drafts(self):
        xml = '''<rss xmlns:wp="http://wordpress.org/export/1.2/"><channel>
        <item><wp:post_id>1</wp:post_id><wp:post_type>post</wp:post_type><wp:status>publish</wp:status><wp:post_date>2007-07-16 00:30:00</wp:post_date><wp:post_date_gmt>2007-07-15 22:30:00</wp:post_date_gmt></item>
        <item><wp:post_id>2</wp:post_id><wp:post_type>post</wp:post_type><wp:status>publish</wp:status><wp:post_date>2007-07-17 12:00:00</wp:post_date></item>
        <item><wp:post_id>3</wp:post_id><wp:post_type>post</wp:post_type><wp:status>draft</wp:status><wp:post_date>2008-01-01 12:00:00</wp:post_date></item>
        </channel></rss>'''
        records = archive_records(xml)
        self.assertEqual(records['/2007/']['ids'], ['1', '2'])
        self.assertEqual(records['/2007/07/']['ids'], ['1', '2'])
        self.assertEqual(records['/2007/07/16/']['ids'], ['1'])
        self.assertEqual(records['/2007/07/']['title'], 'Archives de juillet 2007')
        self.assertEqual(records['/2007/07/16/']['parent'], '/2007/07/')
        self.assertNotIn('/2007/07/15/', records)
        self.assertNotIn('/2008/', records)

    def test_invalid_source_dates_are_rejected(self):
        xml = '''<rss xmlns:wp="http://wordpress.org/export/1.2/"><channel><item><wp:post_id>1</wp:post_id><wp:post_type>post</wp:post_type><wp:status>publish</wp:status><wp:post_date>0000-00-00 00:00:00</wp:post_date></item></channel></rss>'''
        with self.assertRaises(ValueError):
            archive_records(xml)
