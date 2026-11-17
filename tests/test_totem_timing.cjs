const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

function runtime() {
  const html = fs.readFileSync(path.join(__dirname, '../theme-overrides/static/js/totem-renderer.js'), 'utf8');
  const custom = html.slice(html.indexOf('var paused = false;'), html.indexOf('/* Native scheduler and lifecycle. */'));
  const calls = [];
  const context = {console, canvas: {}, time: 0, drawFrame() {},
    document: {getElementById() {return {addEventListener() {}};}},
    cxform: class {merge() {return this;}},
    place(name, canvas, ctx, matrix, tint, blend, frame, ratio, time) {
      calls.push({name, time});
      context[name]?.(ctx, tint, frame, ratio, time);
    },
    setInterval() {},
  };
  context.window = context;
  context.characters = context;
  for (const id of [5,10,12,17,21,44,48,50,57,58,66,71,77,81,83,86,91,97,101,125,132,141,142,148,158,163,166,168,172,204,211,215]) {
    context['sprite' + id] = function(ctx, tint, frame, ratio, time) {
      calls.push({id, frame, time});
    };
  }
  context.sprite58 = function(ctx, tint, frame, ratio, time) {
    calls.push({id: 58, frame, time});
    if (frame >= 6) context.place('sprite57', {}, ctx, [], tint, 1, 0, 0, time);
  };
  vm.createContext(context);
  vm.runInContext(custom + ';this.StepTotemPreview=api;', context);
  return {context, api: context.StepTotemPreview, calls};
}

test('fade clips stop while the two intro clips repeat only their ending segments', () => {
  const {api} = runtime();
  assert.equal(api.resolveTimeline('12', 60), 19);
  assert.equal(api.resolveTimeline('57', 100), 49);
  assert.equal(api.resolveTimeline('44', 26), 26);
  assert.equal(api.resolveTimeline('44', 27), 19);
  assert.equal(api.resolveTimeline('44', 35), 19);
  assert.equal(api.resolveTimeline('77', 11), 7);
});

test('the delayed child keeps advancing after its parent has stopped', () => {
  const {context, calls} = runtime();
  context.sprite58(null, new context.cxform(), 0, 0, 40);
  const parent = calls.find(call => call.id === 58);
  const child = calls.find(call => call.id === 57);
  assert.equal(parent.frame, 19);
  assert.equal(child.frame, 34);
  assert.equal(child.time, 34);
});

test('hover/down preserve shared clip identity; leaving and reentering restarts it', () => {
  const {context, api, calls} = runtime();
  const tint = new context.cxform();
  api.setButton(19, 1);
  context.button19(null, tint, 0, 0, 100);
  context.time = 110;
  api.setButton(19, 2);
  context.button19(null, tint, 0, 0, 110);
  assert.equal(calls.filter(call => call.id === 12).at(-1).time, 10);
  api.clearButton(19);
  context.button19(null, tint, 0, 0, 111);
  context.time = 120;
  api.setButton(19, 1);
  context.button19(null, tint, 0, 0, 120);
  assert.equal(calls.filter(call => call.id === 12).at(-1).time, 0);
});

test('contact hover preserves the preexisting face and starts only the new overlay', () => {
  const {context, api, calls} = runtime();
  const tint = new context.cxform();
  context.button150(null, tint, 0, 0, 0);
  context.time = 100;
  api.setButton(150, 1);
  context.button150(null, tint, 0, 0, 100);
  assert.equal(calls.filter(call => call.id === 142).at(-1).time, 100);
  assert.equal(calls.filter(call => call.id === 148).at(-1).time, 0);
});

test('embedded start sounds fire once per clip creation, preserve on Down, and replay after leave', () => {
  const {context, api} = runtime();
  const events = [];
  const tint = new context.cxform();
  api.setSoundHandler(event => events.push(event));
  api.setButton(68, 1);
  context.button68(null, tint, 0, 0, 100);
  context.button68(null, tint, 0, 0, 100);
  context.time = 110;
  api.setButton(68, 2);
  context.button68(null, tint, 0, 0, 110);
  assert.equal(events.length, 1);
  assert.equal(events[0].soundId, 54);
  assert.equal(events[0].spriteId, 58);
  api.clearButton(68);
  context.button68(null, tint, 0, 0, 111);
  api.setButton(68, 1);
  context.button68(null, tint, 0, 0, 120);
  assert.equal(events.length, 2);
  assert.notEqual(events[0].instance, events[1].instance);
  api.setButton(79, 1);
  context.button79(null, tint, 0, 0, 121);
  assert.equal(events.at(-1).soundId, 70);
  api.setButton(103, 1);
  context.button103(null, tint, 0, 0, 122);
  assert.equal(events.at(-1).soundId, 96);
});
