import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from recover_legacy_objects import extract_objects, restore_objects


class LegacyObjectTests(unittest.TestCase):
    def test_audio_and_nested_flash_are_recovered_without_duplicates(self):
        source = '''<object width="200" height="20"><param name="src" value="/dewplayer.swf?son=/shadows.mp3"><embed width="200" height="20" src="/dewplayer.swf?son=/shadows.mp3"></object>
        <em>Music credit</em><object width="550" height="690"><param name="src" value="/intentions.swf"><embed width="550" height="690" src="/intentions.swf"></object>'''
        self.assertEqual(extract_objects(source), [('audio', '/shadows.mp3', 200, 20), ('ruffle', '/intentions.swf', 550, 690)])
        body, count = restore_objects(source, '_Music credit_')
        self.assertEqual(count, 2)
        self.assertLess(body.index('local-audio'), body.index('Music credit'))
        self.assertLess(body.index('Music credit'), body.index('ruffle'))
        self.assertEqual(restore_objects(source, body), (body, 0))

    def test_unrelated_external_embeds_are_not_converted(self):
        self.assertEqual(extract_objects('<embed src="https://video.example/movie.swf" width="10" height="20">'), [])
