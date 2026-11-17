const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

class Element extends EventTarget {
  constructor(attrs = {}) {super(); this.attrs = attrs; this.dataset = {}; this.hidden = true; this.textContent = '';}
  getAttribute(name) {return this.attrs[name] ?? null;}
  setAttribute(name, value) {this.attrs[name] = value;}
  matches() {return false;}
}

function fixture(desktop = true) {
  const controls = [19,46,52,68,79,93,103,150,213].map(id => {
    const control = new Element(id === 213 ? {role: 'button'} : {});
    control.dataset.totemButton = String(id); return control;
  });
  const sound = new Element({'aria-pressed': 'false'}), status = new Element(), canvas = {};
  const container = new Element(); container.dataset.audioManifest = '/preview/audio.json';
  container.querySelector = selector => selector === 'canvas' ? canvas : selector === '.totem-sound' ? sound : status;
  container.querySelectorAll = () => controls;
  const document = new Element(); document.hidden = false; document.querySelectorAll = () => [container];
  const media = new Element(); media.matches = desktop;
  const window = new Element(), renderers = [], audioCalls = [];
  window.matchMedia = () => media; window.devicePixelRatio = 2; window.AudioContext = function() {};
  window.StepTotemRenderer = () => {
    const calls = []; const renderer = {calls, setButton: (...args) => calls.push(['set', ...args]),
      clearButton: id => calls.push(['clear', id]), setPaused: value => calls.push(['pause', value]),
      setSoundHandler(callback) {this.sound = callback;}, destroy: () => calls.push(['destroy'])};
    renderers.push(renderer); return renderer;
  };
  const audio = {trigger: async (...args) => audioCalls.push(args), triggerSound: async id => audioCalls.push(['sprite', id]),
    stopAll: () => audioCalls.push(['stop']), dispose: async () => audioCalls.push(['dispose']),
    enable: async () => audioCalls.push(['enable']), setMuted: value => audioCalls.push(['mute', value])};
  window.StepTotemAudio = {create: async () => audio};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../theme-overrides/static/js/native-totem.js'), 'utf8'),
    {window, document, AbortController, console});
  return {window, document, media, controls, sound, status, renderers, audioCalls};
}

test('desktop starts at device resolution; pointer press survives native focus', () => {
  const f = fixture(); const control = f.controls[0];
  control.dispatchEvent(new Event('pointerenter'));
  control.dispatchEvent(new Event('pointerdown'));
  control.dispatchEvent(new Event('focus'));
  assert.deepEqual(f.renderers[0].calls.filter(c => c[0] === 'set'), [['set','19',1],['set','19',2]]);
  control.dispatchEvent(new Event('pointerup'));
  assert.deepEqual(f.renderers[0].calls.at(-1), ['set','19',1]);
});

test('hidden mobile navigation creates no animation until desktop becomes visible', () => {
  const f = fixture(false); assert.equal(f.renderers.length, 0);
  f.media.matches = true; f.media.dispatchEvent(new Event('change'));
  assert.equal(f.renderers.length, 1);
  f.media.matches = false; f.media.dispatchEvent(new Event('change'));
  assert.deepEqual(f.renderers[0].calls.at(-1), ['pause', true]);
});

test('page restoration creates one renderer and removes stale input listeners', async () => {
  const f = fixture(); await Promise.resolve();
  f.window.dispatchEvent(new Event('pagehide'));
  assert.deepEqual(f.renderers[0].calls.at(-1), ['destroy']);
  const previous = f.renderers[0].calls.length;
  f.window.dispatchEvent(new Event('pageshow'));
  f.controls[0].dispatchEvent(new Event('pointerenter'));
  assert.equal(f.renderers.length, 2);
  assert.equal(f.renderers[0].calls.length, previous);
  assert.deepEqual(f.renderers[1].calls.at(-1), ['set','19',1]);
});

test('audio remains silent until enabled and stops when the page is hidden', async () => {
  const f = fixture(); await Promise.resolve();
  assert.deepEqual(f.audioCalls, []);
  f.sound.dispatchEvent(new Event('click')); await Promise.resolve();
  assert.deepEqual(f.audioCalls, [['enable']]);
  f.document.hidden = true; f.document.dispatchEvent(new Event('visibilitychange'));
  assert.deepEqual(f.renderers[0].calls.at(-1), ['pause', true]);
  assert.deepEqual(f.audioCalls.at(-1), ['stop']);
});

test('sound control waits for its manifest before accepting the first gesture', async () => {
  const f = fixture();
  assert.equal(f.sound.hidden, true);
  await Promise.resolve();
  assert.equal(f.sound.hidden, false);
  f.sound.dispatchEvent(new Event('click'));
  await Promise.resolve();
  assert.deepEqual(f.audioCalls, [['enable']]);
});
