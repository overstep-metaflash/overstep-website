const test = require('node:test');
const assert = require('node:assert/strict');
const { create, playbackPlan } = require('../theme-overrides/static/js/totem-audio.js');

function fixture() {
  const sources = [], params = [];
  let created = 0;
  const context = {
    currentTime: 10, state: 'suspended', destination: {},
    resume: async function () { this.state = 'running'; }, close: async function () { this.state = 'closed'; },
    decodeAudioData: async () => ({ duration: 2 }),
    createGain() {
      const calls = []; params.push(calls);
      return { gain: { value: 1, setValueAtTime: (...x) => calls.push(['set', ...x]),
        linearRampToValueAtTime: (...x) => calls.push(['ramp', ...x]),
        cancelAndHoldAtTime: (...x) => calls.push(['hold', ...x]) },
        connect() {}, disconnect() {} };
    },
    createBufferSource() {
      const s = { connect() {}, disconnect() {}, starts: [], stops: [],
        start(...x) { this.starts.push(x); }, stop(...x) { this.stops.push(x); } };
      sources.push(s); return s;
    }
  };
  const manifest = { sounds: [{ sound_id: 18, sample_rate: 1000, sample_count: 1000,
    seek_samples: 100, file: 'mp3/18.mp3' }], buttons: { 19: { sound_events: {
      pointerenter: { sound_id: 18, event: 'start', loops: 3,
        envelope: [{ sample: 0, left_volume: 0, right_volume: 0 },
          { sample: 22050, left_volume: 1, right_volume: 1 }] },
      pointerleave: { sound_id: 18, event: 'stop' },
      pointerdown: { sound_id: 18, event: 'start', loops: 1 }
    } } } };
  return { context, manifest, sources, params,
    options: { manifestUrl: 'https://example.test/audio/audio-manifest.json', manifest,
      contextFactory: () => { created++; return context; },
      fetch: async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(4) }) },
    created: () => created };
}

test('silence before explicit enable; source MP3 seek and finite loop duration', async () => {
  const f = fixture(), audio = await create(f.options);
  assert.equal(f.created(), 0);
  assert.equal(await audio.trigger(19, 'pointerenter'), false);
  await audio.enable();
  assert.equal(await audio.trigger(19, 'pointerenter'), true);
  assert.equal(f.sources[0].loop, true);
  assert.equal(f.sources[0].loopStart, 0.1);
  assert.equal(f.sources[0].loopEnd, 1.1);
  assert.deepEqual(f.sources[0].starts, [[10, 0.1]]);
  assert.deepEqual(f.sources[0].stops, [[13]]);
});

test('pointer exit stops all matching voices with a short anti-click fade', async () => {
  const f = fixture(), audio = await create(f.options); await audio.enable();
  await audio.trigger(19, 'pointerenter'); await audio.trigger(19, 'pointerdown');
  assert.equal(audio.getState().voices, 2);
  await audio.trigger(19, 'pointerleave');
  assert.equal(audio.getState().voices, 0);
  for (const source of f.sources) assert.equal(source.stops.at(-1)[0], 10.005);
  assert.ok(f.params.some(calls => calls.some(c => c[0] === 'ramp' && c[1] === 0)));
});

test('envelope automation repeats for finite loops, mute cancels active voices', async () => {
  const f = fixture(), audio = await create(f.options); await audio.enable();
  await audio.trigger(19, 'pointerenter');
  assert.ok(f.params[0].some(c => c[0] === 'ramp' && c[1] === 1 && c[2] === 12.5));
  audio.setMuted(true);
  assert.equal(await audio.trigger(19, 'pointerdown'), false);
  assert.equal(audio.getState().voices, 0);
  await audio.dispose(); assert.equal(f.context.state, 'closed');
});

test('pending decode cannot revive a sound after pointer exit', async () => {
  const f = fixture(); let finish;
  f.context.decodeAudioData = () => new Promise(resolve => { finish = resolve; });
  const audio = await create(f.options); await audio.enable();
  const pending = audio.trigger(19, 'pointerenter');
  while (!finish) await Promise.resolve();
  await audio.trigger(19, 'pointerleave'); finish({ duration: 2 });
  assert.equal(await pending, false); assert.equal(f.sources.length, 0);
});

test('short MP3 buffers are clamped and reported without fabricated samples', () => {
  const p = playbackPlan({ sample_rate: 1000, sample_count: 2000, seek_samples: 100 }, { loops: 2 }, 1.6);
  assert.equal(p.duration, 1.5); assert.equal(p.shortfallSeconds, 0.5); assert.equal(p.totalDuration, 3);
});

test('no-multiple events remain unique when two triggers share a pending decode', async () => {
  const f = fixture();
  f.manifest.buttons[19].sound_events.pointerenter.event = 'start_if_not_playing';
  const audio = await create(f.options); await audio.enable();
  const results = await Promise.all([audio.trigger(19, 'pointerenter'), audio.trigger(19, 'pointerenter')]);
  assert.deepEqual(results, [true, false]); assert.equal(f.sources.length, 1);
});

test('unknown events and navigation-only regions do not generate audio', async () => {
  const f = fixture(), audio = await create(f.options); await audio.enable();
  assert.equal(await audio.trigger(19, 'pointerup'), false);
  assert.equal(await audio.trigger(999, 'pointerenter'), false);
  assert.equal(f.sources.length, 0);
});

test('sprite-frame sound dispatch reuses the independent playback engine', async () => {
  const f = fixture(), audio = await create(f.options);
  assert.equal(await audio.triggerSound(18), false);
  await audio.enable();
  assert.equal(await audio.triggerSound(18, { event: 'start', loops: 2 }), true);
  assert.equal(f.sources[0].loop, true);
  assert.deepEqual(f.sources[0].stops, [[12]]);
  await audio.trigger(19, 'pointerenter');
  assert.equal(audio.getState().voices, 2);
  await audio.triggerSound(18, { event: 'stop' });
  assert.equal(audio.getState().voices, 0);
});

test('optional prefetch waits until an explicit enable and loads each MP3 once', async () => {
  const f = fixture(); let fetched = 0;
  f.options.prefetchOnEnable = true;
  f.options.fetch = async () => { fetched++; return { ok: true, arrayBuffer: async () => new ArrayBuffer(4) }; };
  const audio = await create(f.options);
  assert.equal(fetched, 0);
  await audio.enable(); assert.equal(fetched, 1);
  await audio.triggerSound(18); assert.equal(fetched, 1);
});
