const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('catalogue combines accent-insensitive search, type and collection, then resets', () => {
  const listeners = {};
  const fields = { query: { value: '' }, kind: { value: '' }, collection: { value: '' } };
  const form = { elements: fields, addEventListener: (event, fn) => { listeners[event] = fn; } };
  const cards = [
    { dataset: { archiveSearch: 'Été', archiveKind: 'image', archiveCollection: 'blog' } },
    { dataset: { archiveSearch: 'Été version Flash', archiveKind: 'swf', archiveCollection: 'dotclear' } },
    { dataset: { archiveSearch: 'Hiver', archiveKind: 'image', archiveCollection: 'blog' } },
  ];
  const count = {}, empty = {};
  const document = { querySelectorAll: () => cards, querySelector: selector => ({
    '.archive-filters': form, '[data-archive-count]': count, '[data-archive-empty]': empty,
  })[selector] };
  vm.runInNewContext(fs.readFileSync('theme-overrides/static/js/media-archive.js', 'utf8'), { document, queueMicrotask: fn => fn() });
  fields.query.value = ' ete ';
  listeners.input();
  let prevented = false;
  listeners.submit({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true, 'Enter must keep the current filters without reloading');
  assert.deepEqual(cards.map(card => card.hidden), [false, false, true]);
  fields.kind.value = 'image';
  listeners.change();
  assert.deepEqual(cards.map(card => card.hidden), [false, true, true]);
  assert.equal(count.textContent, '1 notice sur 3');
  fields.collection.value = 'dotclear';
  listeners.change();
  assert.equal(empty.hidden, false);
  assert.equal(count.textContent, '0 notices sur 3');
  for (const field of Object.values(fields)) field.value = '';
  listeners.reset();
  assert.deepEqual(cards.map(card => card.hidden), [false, false, false]);
  assert.equal(empty.hidden, true);
});

test('large catalogues paginate filtered results and searching returns to the first page', () => {
  const listeners = {}, actions = {};
  const fields = { query:{value:''}, kind:{value:''}, collection:{value:''} };
  const form = { elements:fields, addEventListener:(event,fn)=>{listeners[event]=fn;} };
  const cards = Array.from({length:90},(_,index)=>({dataset:{archiveSearch:'Artwork '+index,archiveKind:'image',archiveCollection:'blog'}}));
  const count = {}, empty = {}, pager = {}, position = {};
  const previous = {addEventListener:(_,fn)=>{actions.previous=fn;}}, next = {addEventListener:(_,fn)=>{actions.next=fn;}};
  const elements = {'.archive-filters':form,'[data-archive-count]':count,'[data-archive-empty]':empty,
    '.archive-pagination':pager,'[data-archive-page]':position,'[data-archive-previous]':previous,'[data-archive-next]':next};
  vm.runInNewContext(fs.readFileSync('theme-overrides/static/js/media-archive.js','utf8'),{
    document:{querySelectorAll:()=>cards,querySelector:selector=>elements[selector]},queueMicrotask:fn=>fn()});
  assert.equal(cards.filter(card=>!card.hidden).length,48);
  actions.next();
  assert.equal(cards.filter(card=>!card.hidden).length,42);
  assert.equal(position.textContent,'Page 2 sur 2');
  assert.equal(next.disabled,true);
  fields.query.value='Artwork 89';
  listeners.input();
  assert.equal(cards.filter(card=>!card.hidden).length,1);
  assert.equal(position.textContent,'Page 1 sur 1');
  assert.equal(count.textContent,'1 notice sur 90');
});
