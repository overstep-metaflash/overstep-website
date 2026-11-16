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
    fetch: async () => ({ ok: true, json: async () => [] }),
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
  const navigation = options.find(option => option.url === '/theme/step/menu.swf');
  assert.equal(navigation.wmode, 'transparent');
  assert.equal(navigation.unmuteOverlay, 'visible');
  assert.equal(navigation.autoplay, 'on');
  assert.equal(containers[0].dataset.ready, 'true');
  assert.equal(containers[1].dataset.ready, undefined);
  assert.equal(containers[1].status.hidden, false);
});

test('every reviewed menu URL is rewritten for root and project-prefix pages', async () => {
  const links = JSON.parse(fs.readFileSync(path.join(__dirname, '../theme-overrides/static/theme/step/menu-links.json'), 'utf8'));
  assert.equal(links.length, 8);
  assert.equal(new Set(links.map(link => link.legacy)).size, 8);
  for (const prefix of ['/', '/overstep-website/']) {
    for (const route of ['', '2006/02/11/sauvons-la-princesse/', 'category/anim-flash/']) {
      let loaded, fetched;
      const navigation = {
        dataset: { kind: 'navigation', swf: prefix + 'theme/step/menu.swf' },
        querySelector: s => s === '.flash-status' ? {} : { appendChild() {} },
      };
      const context = {
        URL, console,
        fetch: async url => { fetched = url.href; return { ok: true, json: async () => links }; },
        document: {
          currentScript: { src: 'https://preview.test' + prefix + 'js/ruffle-player.js' },
          location: { href: 'https://preview.test' + prefix + route },
          createElement: () => ({}),
          head: { appendChild: script => script.onload() },
          querySelectorAll: () => [navigation],
        },
        window: { RufflePlayer: { newest: () => ({ createPlayer: () => ({
          ruffle: () => ({ load: async options => { loaded = options; } }),
        }) }) } },
      };
      vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../theme-overrides/static/js/ruffle-player.js'), 'utf8'), context);
      await new Promise(setImmediate);
      assert.equal(fetched, 'https://preview.test' + prefix + 'theme/step/menu-links.json');
      assert.equal(loaded.allowScriptAccess, false);
      for (const link of links) {
        const target = link.destination.startsWith('/')
          ? 'https://preview.test' + prefix + link.destination.slice(1) : link.destination;
        for (const legacy of new Set([link.legacy, link.legacy.replace(/^http:/, 'https:')])) {
          assert.equal(loaded.urlRewriteRules.find(rule => rule[0] === legacy)?.[1], target);
        }
      }
      assert.equal(loaded.urlRewriteRules.find(rule => rule[0] === 'http://www.overstep.fr/radio/')[1],
        'https://preview.test' + prefix + 'radio/');
    }
  }
});

test('a missing menu map leaves the fallback visible instead of claiming readiness', async () => {
  const status = { hidden: false };
  const container = {
    dataset: { kind: 'navigation', swf: '/theme/step/menu.swf' },
    querySelector: selector => selector === '.flash-status' ? status : { appendChild() {} },
  };
  let loads = 0;
  const context = {
    URL, console: { error() {} },
    fetch: async () => ({ ok: false }),
    document: {
      currentScript: { src: 'https://example.test/js/ruffle-player.js' },
      createElement: () => ({}),
      head: { appendChild: script => script.onload() },
      querySelectorAll: () => [container],
    },
    window: { RufflePlayer: { newest: () => ({ createPlayer: () => ({
      ruffle: () => ({ load: async () => { loads++; } }),
    }) }) } },
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../theme-overrides/static/js/ruffle-player.js'), 'utf8'), context);
  await new Promise(setImmediate);
  assert.equal(loads, 0);
  assert.equal(container.dataset.ready, undefined);
  assert.equal(status.hidden, false);
});
