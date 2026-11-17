const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function fixture(prefix) {
  const listeners = {}, dialogEvents = {}, loaded = [], unloaded = [], assigned = [], delegated = [];
  const viewer = { children: [], appendChild(node) { this.children.push(node); }, replaceChildren() { this.children = []; } };
  const dialog = { open: false, addEventListener: (event, fn) => { dialogEvents[event] = fn; },
    showModal() { this.open = true; }, close() { this.open = false; dialogEvents.close(); } };
  const title = {};
  const controls = {};
  const previous = { addEventListener: (_, fn) => { controls.previous = fn; } };
  const next = { addEventListener: (_, fn) => { controls.next = fn; } };
  const navigation = { hidden: true };
  const position = {};
  const make = tag => ({ tagName: tag, dataset: {}, style: {}, children: [],
    appendChild(node) { this.children.push(node); }, setAttribute() {},
    querySelector: () => null });
  const movie = { src: 'art.swf', width: 640, height: 480, title: 'Original artwork' };
  const manifest = { movies: { 'art.html': movie }, galleries: { covers: { title: 'Cover set', images: [
    { src: 'photoshop/front.jpg', caption: 'Face', alt: '' },
    { src: 'photoshop/inside.jpg', caption: 'Intérieur', alt: '' },
    { src: 'photoshop/back.jpg', caption: 'Verso', alt: '' },
  ] } }, pages: {
    'art.html': { url: '/metaflash/art.html', kind: 'movie', movie_id: 'art.html' },
    'menu2.html': { url: '/metaflash/menu2.html', kind: 'page' } } };
  const document = { currentScript: { src: `https://preview.test${prefix}js/metaflash.js` },
    activeElement: null, createElement: make, querySelectorAll: () => [],
    querySelector: selector => ({ '#metaflash-dialog': dialog, '#metaflash-dialog-title': title,
      '.metaflash-viewer': viewer, '[data-metaflash-close]': { addEventListener() {} },
      '.metaflash-image-controls': navigation, '[data-metaflash-previous]': previous,
      '[data-metaflash-next]': next, '[data-metaflash-position]': position })[selector],
    addEventListener: (event, fn) => { listeners[event] = fn; } };
  const window = { location: { assign: url => assigned.push(url) },
    open: (...args) => delegated.push(args),
    StepFlash: { load: container => loaded.push(container), unload: container => unloaded.push(container) } };
  const context = { URL, console, document, window,
    fetch: async url => ({ ok: true, json: async () => url.pathname.endsWith('manifest.json') ? manifest : [
      { legacy: 'mailto:overstep@ifrance.com', destination: 'mailto:lastep.fr@gmail.com' },
      { legacy: 'http://perso0.free.fr/cgi-bin/guestbook.pl?login=overstep', destination: '/metaflash/guestbook.html' },
    ] }) };
  vm.runInNewContext(fs.readFileSync('theme-overrides/static/js/metaflash.js', 'utf8'), context);
  return { window, listeners, dialog, title, loaded, unloaded, assigned, delegated, viewer,
    controls, navigation, position, previous, next,
    click: (id, overrides = {}, index = null) => {
      let prevented = false;
      const link = { dataset: index === null ? { metaflashMovie: id } :
        { metaflashGallery: id, metaflashIndex: String(index) }, focus() {} };
      listeners.click({ target: { closest: () => link }, button: 0,
        preventDefault: () => { prevented = true; }, ...overrides });
      return prevented;
    } };
}

test('gallery opens a movie internally at either prefix and closing destroys its player', async () => {
  for (const prefix of ['/', '/overstep-website/']) {
    const f = fixture(prefix);
    await new Promise(setImmediate);
    assert.equal(f.click('art.html'), true);
    assert.equal(f.dialog.open, true);
    assert.equal(f.title.textContent, 'Original artwork');
    assert.equal(f.loaded[0].dataset.swf, `https://preview.test${prefix}metaflash/art.swf`);
    assert.equal(f.assigned.length, 0);
    assert.equal(f.delegated.length, 0);
    f.dialog.close();
    assert.equal(f.unloaded[0], f.loaded[0]);
    assert.equal(f.viewer.children.length, 0);
    assert.equal(f.click('art.html', { ctrlKey: true }), false, 'Modified clicks retain the fallback page');
    assert.equal(f.click('unreviewed.html'), false);
  }
});

test('image dialogs retain all cover views at both prefixes and never create a Flash player', async () => {
  for (const prefix of ['/', '/overstep-website/']) {
    const f = fixture(prefix);
    await new Promise(setImmediate);
    assert.equal(f.click('covers', {}, 0), true);
    assert.equal(f.dialog.open, true);
    assert.equal(f.loaded.length, 0);
    const findImage = () => f.viewer.children[0].children.find(node => node.tagName === 'img');
    const first = findImage();
    assert.equal(first.src, `https://preview.test${prefix}metaflash/photoshop/front.jpg`);
    assert.equal(f.position.textContent, '1 / 3');
    assert.equal(f.previous.disabled, true);
    assert.equal(f.next.disabled, false);
    f.controls.next();
    assert.equal(findImage().src, `https://preview.test${prefix}metaflash/photoshop/inside.jpg`);
    assert.equal(f.position.textContent, '2 / 3');
    f.listeners.keydown({ key: 'ArrowRight', preventDefault() {} });
    assert.equal(findImage().src, `https://preview.test${prefix}metaflash/photoshop/back.jpg`);
    assert.equal(f.next.disabled, true);
    f.dialog.close();
    first.onload();
    assert.equal(f.viewer.children.length, 0, 'A stale image response must not recreate closed content');
    assert.equal(f.navigation.hidden, true);
    assert.equal(f.assigned.length, 0);
    assert.equal(f.delegated.length, 0);
    assert.equal(f.click('covers', { ctrlKey: true }, 1), false);
    assert.equal(f.click('covers', {}, 99), false);
    f.click('art.html');
    const movie = f.loaded.at(-1);
    f.click('covers', {}, 1);
    assert.equal(f.unloaded.at(-1), movie, 'Switching to an image must stop the previous movie');
    assert.equal(f.loaded.length, 1, 'Image navigation must not start another movie');
  }
});

test('Flash destinations use the dialog or same tab and unrelated requests remain untouched', async () => {
  const f = fixture('/overstep-website/');
  await new Promise(setImmediate);
  f.window.open('https://metaflash.fr/art.html', '_blank');
  assert.equal(f.dialog.open, true);
  f.window.open('https://metaflash.fr/menu2.html', '_blank');
  assert.equal(f.assigned[0], 'https://preview.test/overstep-website/metaflash/menu2.html');
  f.window.open('mailto:lastep.fr@gmail.com', '_blank');
  assert.equal(f.assigned.at(-1), 'mailto:lastep.fr@gmail.com');
  f.window.open('http://perso0.free.fr/cgi-bin/guestbook.pl?login=overstep', '_blank');
  assert.equal(f.assigned.at(-1), 'https://preview.test/overstep-website/metaflash/guestbook.html');
  f.window.open('https://unrelated.test/', '_blank');
  assert.equal(f.delegated.length, 1);
});
