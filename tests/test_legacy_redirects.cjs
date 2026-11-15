const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('legacy post queries preserve comment anchors under the preview prefix', async () => {
  let destination;
  const context = {
    URL, console,
    document: { currentScript: { dataset: { siteRoot: '/overstep-website/', postMap: '/overstep-website/legacy-posts.json' } } },
    location: { href: 'https://example.test/overstep-website/?p=42#comment-12', origin: 'https://example.test', hash: '#comment-12', replace: (url) => { destination = url; } },
    fetch: async () => ({ ok: true, json: async () => ({ '42': '/2005/12/16/virtual-tangka/' }) }),
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../theme-overrides/static/js/legacy-redirects.js'), 'utf8'), context);
  await new Promise(setImmediate);
  assert.equal(destination, 'https://example.test/overstep-website/2005/12/16/virtual-tangka/#comment-12');
});

test('unknown or malicious post queries do not navigate', async () => {
  let navigated = false;
  const context = {
    URL, console,
    document: { currentScript: { dataset: { siteRoot: '/', postMap: '/legacy-posts.json' } } },
    location: { href: 'https://example.test/?p=unknown', origin: 'https://example.test', hash: '', replace: () => { navigated = true; } },
    fetch: async () => { throw new Error('Must not fetch for a non-numeric ID'); },
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../theme-overrides/static/js/legacy-redirects.js'), 'utf8'), context);
  await new Promise(setImmediate);
  assert.equal(navigated, false);
});
