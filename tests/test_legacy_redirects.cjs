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

const publicPosts = JSON.parse(fs.readFileSync(path.join(__dirname, '../static/legacy-posts.json'), 'utf8'));

for (const prefix of ['/', '/overstep-website/']) {
  for (const [id, hash] of [['1724', ''], ['4044', '#comment-51953'], ['3357', '#comment-20443'], ['3384', '']]) {
    test(`public post ${id} resolves under ${prefix} with its fragment`, async () => {
      let destination;
      const origin = 'https://example.test';
      const context = {
        URL, console,
        document: { currentScript: { dataset: { siteRoot: prefix, postMap: prefix + 'legacy-posts.json' } } },
        location: { href: `${origin}${prefix}?p=${id}${hash}`, origin, hash,
          replace: (url) => { destination = url; } },
        fetch: async (url) => {
          assert.equal(url, prefix + 'legacy-posts.json');
          return { ok: true, json: async () => publicPosts };
        },
      };
      vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../theme-overrides/static/js/legacy-redirects.js'), 'utf8'), context);
      await new Promise(setImmediate);
      assert.equal(destination, new URL(prefix + publicPosts[id].slice(1) + hash, origin).href);
    });
  }
}

for (const [label, posts, ok] of [
  ['unknown numeric ID', {}, true],
  ['external destination', { '42': '//other.test/article/' }, true],
  ['backslash destination', { '42': '/\\other.test/article/' }, true],
  ['unavailable mapping', {}, false],
]) {
  test(`${label} keeps the visitor on the original page`, async () => {
    let destination;
    const context = {
      URL, console: { error: () => {} },
      document: { currentScript: { dataset: { siteRoot: '/', postMap: '/legacy-posts.json' } } },
      location: { href: 'https://example.test/?p=42', origin: 'https://example.test', hash: '',
        replace: (url) => { destination = url; } },
      fetch: async () => ({ ok, json: async () => posts }),
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../theme-overrides/static/js/legacy-redirects.js'), 'utf8'), context);
    await new Promise(setImmediate);
    assert.equal(destination, undefined);
  });
}
