const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('visible animation starts automatically and retains its SWF path', async () => {
  let loaded;
  const status = { hidden: false };
  const container = {
    dataset: { swf: '/wp-content/uploads/elevation.swf', fullscreen: 'false' },
    querySelector: (selector) => selector === '.flash-status' ? status : { appendChild() {} },
  };
  const context = {
    URL, console,
    document: {
      currentScript: { src: 'http://localhost/js/ruffle-player.js' },
      createElement: () => ({}),
      head: { appendChild: (script) => script.onload() },
      querySelectorAll: () => [container],
    },
    window: { RufflePlayer: { newest: () => ({ createPlayer: () => ({
      ruffle: () => ({ load: async (options) => { loaded = options; } }),
    }) }) } },
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../theme-overrides/static/js/ruffle-player.js'), 'utf8'), context);
  await new Promise(setImmediate);
  assert.equal(loaded.autoplay, 'on');
  assert.equal(loaded.url, container.dataset.swf);
  assert.equal(loaded.allowScriptAccess, false);
  assert.equal(status.hidden, true);
  assert.equal(container.dataset.ready, 'true');
});

test('animations are loaded on opening the page without waiting for intersection', async () => {
  let loads = 0;
  const observer = class { observe() {} };
  const container = {
    dataset: { swf: '/offscreen.swf' },
    querySelector: (s) => s === '.flash-status' ? {} : { appendChild() {} },
  };
  const context = {
    URL, console, IntersectionObserver: observer,
    document: {
      currentScript: { src: 'http://localhost/js/ruffle-player.js' },
      createElement: () => ({}),
      head: { appendChild: (s) => s.onload() },
      querySelectorAll: () => [container],
    },
    window: { IntersectionObserver: observer, RufflePlayer: { newest: () => ({
      createPlayer: () => ({ ruffle: () => ({ load: async () => { loads++; } }) }),
    }) } },
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../theme-overrides/static/js/ruffle-player.js'), 'utf8'), context);
  await new Promise(setImmediate);
  assert.equal(loads, 1);
});

test('the animated navigation uses transparency and retains its fallback on failure', async () => {
  const options = [];
  const containers = ['navigation', 'broken'].map((kind) => ({
    dataset: { kind, swf: kind === 'navigation' ? '/theme/step/menu.swf' : '/missing.swf' },
    status: { hidden: false },
    querySelector(selector) { return selector === '.flash-status' ? this.status : { appendChild() {} }; },
  }));
  let scripts = 0;
  const context = {
    URL, console: { error() {} },
    document: {
      currentScript: { src: 'http://localhost/js/ruffle-player.js' },
      createElement: () => ({}),
      head: { appendChild(script) { scripts++; script.onload(); } },
      querySelectorAll: () => containers,
    },
    window: { RufflePlayer: { newest: () => ({ createPlayer: () => ({
      ruffle: () => ({ load: async (config) => {
        options.push(config);
        if (config.url === '/missing.swf') throw new Error('Missing movie');
      } }),
    }) }) } },
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../theme-overrides/static/js/ruffle-player.js'), 'utf8'), context);
  await new Promise(setImmediate);
  assert.equal(scripts, 1);
  assert.equal(options[0].wmode, 'transparent');
  assert.equal(options[0].unmuteOverlay, 'visible');
  assert.equal(options[0].autoplay, 'on');
  assert.equal(containers[0].dataset.ready, 'true');
  assert.equal(containers[1].dataset.ready, undefined);
  assert.equal(containers[1].status.hidden, false);
});
