"""Protect guestbook privacy and preserve reviewed historical messages."""
import hashlib
import json
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from metaflash_guestbook import (build_archive, decode_guestbook, parse_entries,
                                 redact_addresses, render_guestbook, validate_archive,
                                 validate_guestbook_html)


def entry(author, body, stamp='01-09-2006 12:34:56', address='192.0.2.42'):
    return f'<p><font><b>{author}</b></font><br><font><b>{stamp} [{address}]</b></font><br>{body}</p>'


def review(raw, count, spam=None):
    return {'source': {'file': 'Synthetic guestbook.html',
                       'sha256': hashlib.sha256(raw).hexdigest(), 'entries': count},
            'spam': spam or {}}


class GuestbookTests(unittest.TestCase):
    def test_committed_safe_archive_accounts_for_every_reviewed_entry(self):
        blog = Path(__file__).resolve().parents[1]
        archive = json.loads((blog / 'data/metaflash_guestbook.json').read_text())
        decisions = json.loads((blog / 'docs/metaflash-guestbook-review.json').read_text())
        report = json.loads((blog / 'docs/metaflash-guestbook-cleanup.json').read_text())
        self.assertFalse(validate_archive(archive))
        self.assertEqual(archive['source_sha256'], decisions['source']['sha256'])
        self.assertEqual(report['source_sha256'], archive['source_sha256'])
        retained = {entry['source_index'] for entry in archive['entries']}
        empty = set(report['removed_indices']['empty'])
        spam = set(report['removed_indices']['spam'])
        self.assertFalse(retained & (empty | spam))
        self.assertFalse(empty & spam)
        self.assertEqual(spam, {int(key) for key in decisions['spam']})
        self.assertEqual(retained | empty | spam, set(range(1, decisions['source']['entries'] + 1)))
        self.assertEqual(len(retained), report['retained'])
        self.assertEqual(len(empty), report['removed_empty'])
        self.assertEqual(len(spam), report['removed_spam'])

    def test_mixed_encoding_and_entry_parsing_never_keep_address_metadata(self):
        raw = entry('Loïc', 'Merci, superbe !').encode() + entry('Zoé', 'Très réussi !').encode('cp1252')
        text = decode_guestbook(raw)
        self.assertIn('Loïc', text)
        self.assertIn('Très réussi', text)
        entries = parse_entries(text + '<p>© Free 2010 - Tous droits réservés</p><protonpass-root></protonpass-root>')
        self.assertEqual(len(entries), 2)
        self.assertEqual(entries[0]['date'], '2006-09-01T12:34:56')
        self.assertEqual(entries[0]['source_index'], 1)
        self.assertNotIn('192.0.2.42', json.dumps(entries))
        self.assertEqual(set(entries[0]), {'source_index', 'author', 'date', 'display_date', 'body'})

    def test_empty_entries_and_reviewed_spam_are_removed_without_filtering_legitimate_anonymous_art(self):
        raw = (entry('Anonyme', '&nbsp;\n') + entry('Unknown', '') + entry('Named visitor', '') +
               entry('Advertiser', 'Buy unrelated products') +
               entry('Anonyme', 'Superbes dessins, même les nus !') +
               entry('Painter', 'My gallery mentions spam, not advertising.')).encode()
        archive, result = build_archive(raw, review(raw, 6, {'4': 'unrelated_promotion'}))
        self.assertEqual([e['source_index'] for e in archive['entries']], [5, 6])
        self.assertEqual(result['removed_empty'], 3)
        self.assertEqual(result['removed_empty_anonymous'], 1)
        self.assertEqual(result['removed_spam'], 1)
        self.assertEqual(result['retained'], 2)
        self.assertEqual(result['removed_indices']['empty'], [1, 2, 3])
        self.assertFalse(validate_archive(archive))
        with self.assertRaises(ValueError):
            build_archive(raw + b'changed', review(raw, 6))
        with self.assertRaises(ValueError):
            build_archive(raw, review(raw, 7))
        with self.assertRaises(ValueError):
            build_archive(raw, review(raw, 6, {'99': 'spam'}))

    def test_body_author_and_html_attributes_cannot_reintroduce_addresses_or_executable_markup(self):
        raw = entry('&lt;img src=x onerror=bad()&gt;',
                    'Merci ! 192.0.2.5 et 2001:db8::42<br>'
                    '<script>secret()</script>&lt;script&gt;literal&lt;/script&gt;',
                    address='2001:db8::1').encode()
        archive, _ = build_archive(raw, review(raw, 1))
        rendered = render_guestbook(archive)
        for value in ('192.0.2.5', '2001:db8::42', '2001:db8::1', '<img', '<script>', 'secret()'):
            self.assertNotIn(value, rendered)
        self.assertIn('&lt;script&gt;literal&lt;/script&gt;', rendered)
        self.assertFalse(validate_guestbook_html(rendered, archive))
        self.assertTrue(validate_guestbook_html(rendered + '<!-- 192.0.2.7 -->', archive))
        self.assertTrue(validate_guestbook_html('<main>Missing entries</main>', archive))
        self.assertEqual(redact_addresses('Version 1.2 and date 01-09-2006'), 'Version 1.2 and date 01-09-2006')

    def test_unrecognized_posts_fail_instead_of_silently_disappearing(self):
        with self.assertRaises(ValueError):
            parse_entries(entry('Visitor', 'Message', stamp='invalid date'))


if __name__ == '__main__':
    unittest.main()
