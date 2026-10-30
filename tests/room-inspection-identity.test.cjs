// Phase 4A (Room Inspection → Action Tracker): one defect is one inspection and one checklist item. Its action in the
// tracker carries that identity (ref "<inspection id>|<item id>", id "ri-<inspection id>-<item id>"), so the same
// defect sent again is never a second action in any status, two defects with the same words are two actions, a
// browser that cannot save never marks a fault as sent, and the link is found again after a failed save, a reload or a
// team sync. Fictional rooms and faults throughout. The tests that name a fix failed on the code before it.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/roomInspection.json', de: 'src/_data/de/roomInspection.json', sq: 'src/_data/sq/roomInspection.json' };
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/room-inspection.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang }).replace(/<script src=[^>]*><\/script>/g, '');

// The page in jsdom; `storage` seeds localStorage (a reload), `before(w)` runs before the scripts (a storage that fails).
const load = ({ lang = 'en', now = '2026-10-24T09:30:00Z', storage = {}, before = null } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const dom = new JSDOM(`<html lang="${lang}"><body><main id="main">${partial(lang)}</main></body></html>`, { url: `https://example.test${base}/tools/room-inspection/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)));
  if (lang !== 'en' && fs.existsSync(`_site/js/ui-${lang}.js`)) w.eval(fs.readFileSync(`_site/js/ui-${lang}.js`, 'utf8'));
  if (before) before(w);
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'template-pack', 'room-inspection']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key = 'sc-room-inspection') => JSON.parse(w.localStorage.getItem(key));
const actions = (w) => (JSON.parse(w.localStorage.getItem('sc-actions')) || { rows: [] }).rows;
const all = (w) => { const out = {}; for (let i = 0; i < w.localStorage.length; i++) { const key = w.localStorage.key(i); out[key] = w.localStorage.getItem(key); } return out; };
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const choose = (w, input) => { input.checked = true; input.dispatchEvent(new w.Event('change', { bubbles: true })); };
const type = (w, input, value) => { input.value = value; input.dispatchEvent(new w.Event('input', { bubbles: true })); input.dispatchEvent(new w.Event('change', { bubbles: true })); };
// A storage that refuses a key: every write, or only the writes whose value `when` picks out.
const refusing = (w, key, { when = () => true } = {}) => {
  const real = w.Storage.prototype.setItem;
  w.Storage.prototype.setItem = function (k, value) {
    if (String(k) === key && this === w.localStorage && when(String(value))) throw new w.DOMException('full', 'QuotaExceededError');
    return real.call(this, k, value);
  };
  return () => { w.Storage.prototype.setItem = real; };
};
const SETUP = { rooms: [{ number: '412', floor: '4', type: 'suite' }, { number: '413', floor: '4', type: 'double' }], attendants: [{ name: 'Jonas', floors: ['4'] }], inspectors: ['Elena'] };
// An inspection of room `room` with the shower tap (bathroom-5, maintenance) failed and a note, saved.
const inspect = (w, room, note = 'Shower tap drips', date = null) => {
  const d = w.document;
  type(w, d.querySelector('#ri-room'), room);
  if (date) type(w, d.querySelector('#ri-date'), date);
  const tap = d.querySelector('input[name="ri-bathroom-5"][value="fail"]');
  choose(w, tap);
  type(w, tap.closest('.ri-item').querySelector('.ri-note'), note);
  click(w, d.querySelector('[data-rest-pass]'));
  click(w, d.querySelector('[data-save]'));
  return d.querySelector('[data-walk-status]')?.textContent || d.querySelector('.ri-walk-status, [data-status]')?.textContent || '';
};
const status = (w) => w.document.querySelector('[data-walk-status]')?.textContent || '';
const sendButton = (w) => [...w.document.querySelectorAll('button')].find((b) => /maintenance items to actions/.test(b.textContent));

test('two defects with the same words are two actions, each named after its own inspection; the action id is the same on every device', () => {
  const w = load({ storage: { 'sc-room-inspection': SETUP } });
  inspect(w, '412', 'Shower tap drips', '2026-10-20');
  inspect(w, '412', 'Shower tap drips again', '2026-10-24');
  const rows = saved(w).rows;
  assert.equal(rows.length, 2);
  const list = actions(w);
  assert.equal(list.length, 2, 'one action per defect, the same title twice');
  assert.equal(list[0].title, list[1].title);
  rows.forEach((row) => {
    const action = list.find((a) => a.id === `ri-${row.id}-bathroom-5`);
    assert.ok(action, `the action of inspection ${row.id} is found by its id`);
    assert.equal(action.ref, `${row.id}|bathroom-5`);
    assert.equal(action.source, 'room-inspection');
    assert.equal(row.sent['bathroom-5'], true, 'sent stays a boolean, as the saved format has it');
  });
  assert.ok(w.ActionsStore.byRef('room-inspection', `${rows[0].id}|bathroom-5`));
  assert.equal(w.ActionsStore.byRef('room-inspection', 'nothing|bathroom-5'), null);
  // The log names where each row's maintenance stands.
  const tags = [...w.document.querySelectorAll('.ri-maint')];
  assert.equal(tags.length, 2);
  tags.forEach((tag) => assert.equal(tag.dataset.maintenance, '1/0/0/0/0'));
});

test('the same defect sent again is never a second action: not while open, not after done, not after verified', () => {
  const w = load({ storage: { 'sc-room-inspection': SETUP } });
  inspect(w, '412');
  const row = saved(w).rows[0];
  const id = `ri-${row.id}-bathroom-5`;
  // The link is lost (an older page, a failed second save): the fault shows as not sent, and sending it again finds the action.
  const lost = saved(w);
  lost.rows[0].sent = {};
  const w2 = load({ storage: { ...all(w), 'sc-room-inspection': lost } });
  assert.equal(w2.document.querySelector('.ri-maint').dataset.maintenance, '0/0/0/0/1', 'shown as not sent');
  const send = [...w2.document.querySelectorAll('button')].find((b) => /maintenance items to actions/.test(b.textContent));
  assert.ok(send, 'the results offer to send it');
  click(w2, send);
  assert.equal(actions(w2).length, 1, 'no second action');
  assert.equal(saved(w2).rows[0].sent['bathroom-5'], true, 'linked again');
  assert.match(w2.document.querySelector('[data-log-status]').textContent, /already in the Action Tracker/);
  assert.equal(w2.document.querySelector('.ri-maint').dataset.maintenance, '1/0/0/0/0');
  // Done, then verified: the link lost each time, the resend finds the action in its status and adds nothing.
  for (const patch of [{ status: 'done', result: 'Cartridge replaced' }, { status: 'verified', result: 'Re-inspected: passes' }]) {
    assert.ok(w2.ActionsStore.update(id, patch));
    const again = saved(w2);
    again.rows[0].sent = {};
    const w3 = load({ storage: { ...all(w2), 'sc-room-inspection': again } });
    click(w3, [...w3.document.querySelectorAll('button')].find((b) => /maintenance items to actions/.test(b.textContent)));
    assert.equal(actions(w3).length, 1, `no copy after ${patch.status}`);
    assert.equal(actions(w3)[0].status, patch.status, 'the status is untouched');
    assert.equal(saved(w3).rows[0].sent['bathroom-5'], true);
    assert.equal(w3.document.querySelector('.ri-maint').dataset.maintenance, patch.status === 'done' ? '0/1/0/0/0' : '0/0/1/0/0');
    Object.assign(w2.localStorage, {});
    w2.localStorage.setItem('sc-room-inspection', w3.localStorage.getItem('sc-room-inspection'));
  }
  // The store itself: with a ref the rule is source + ref in any status; without a ref the old rule stays exactly.
  const S = w2.ActionsStore;
  assert.equal(S.add({ title: 'Other words', source: 'room-inspection', ref: `${row.id}|bathroom-5` }), null, 'same ref, other words: the same defect');
  assert.equal(S.lastAdd, 'duplicate');
  assert.ok(S.add({ title: actions(w2)[0].title, source: 'room-inspection', ref: `${row.id}|bathroom-2` }), 'same words, other ref: another defect');
  const a = S.add({ title: 'Toolbox talk', source: 'manual' });
  assert.equal(S.add({ title: 'Toolbox talk', source: 'manual' }), null, 'without a ref: the same open title is a duplicate');
  S.update(a.id, { status: 'done', result: 'held' });
  assert.ok(S.add({ title: 'Toolbox talk', source: 'manual' }), 'without a ref: after done it is a new action, as before');
});

test('a browser that cannot save the tracker marks nothing as sent: the fault stays under Open maintenance, the message says so, and a retry sends it once', () => {
  const w = load({ storage: { 'sc-room-inspection': SETUP } });
  let restore = refusing(w, 'sc-actions');
  inspect(w, '412');
  const row = saved(w).rows[0];
  assert.ok(row, 'the inspection is saved');
  assert.deepEqual(plain(row.sent), {}, 'nothing marked sent');
  assert.equal(actions(w).length, 0);
  assert.match(status(w), /could not be added: this browser could not save the Action Tracker/);
  assert.doesNotMatch(status(w), /added to actions/, 'no false success');
  assert.match(w.document.querySelector('[data-results]').textContent, /1 not in the Action Tracker yet/);
  // Again, still failing: the same honest message, still nothing.
  click(w, [...w.document.querySelectorAll('button')].find((b) => /maintenance items to actions/.test(b.textContent)));
  assert.equal(actions(w).length, 0);
  assert.deepEqual(plain(saved(w).rows[0].sent), {});
  assert.match(w.document.querySelector('[data-log-status]').textContent, /could not be added/);
  // The storage is back: one action, linked once.
  restore();
  click(w, [...w.document.querySelectorAll('button')].find((b) => /maintenance items to actions/.test(b.textContent)));
  assert.equal(actions(w).length, 1);
  assert.equal(actions(w)[0].id, `ri-${row.id}-bathroom-5`);
  assert.equal(saved(w).rows[0].sent['bathroom-5'], true);
  assert.match(w.document.querySelector('[data-log-status]').textContent, /1 maintenance items added to actions/);
});

test('a browser that cannot save the inspection sends nothing and keeps the draft; an action saved without its link is found again on the next send', () => {
  // (a) sc-room-inspection refuses: no row, no action, the draft stays, the message says so.
  const w = load({ storage: { 'sc-room-inspection': SETUP } });
  const restore = refusing(w, 'sc-room-inspection');
  inspect(w, '412');
  assert.equal(actions(w).length, 0, 'nothing sent');
  assert.equal(w.document.querySelector('#ri-room').value, '412', 'the draft stays');
  assert.equal(w.document.querySelector('input[name="ri-bathroom-5"][value="fail"]').checked, true);
  assert.match(status(w), /could not save the inspection: nothing was sent to actions/);
  restore();
  assert.equal((saved(w).rows || []).length, 0, 'the row was not kept in storage');
  // Saved again once the storage is back: one row, one action.
  click(w, w.document.querySelector('[data-save]'));
  assert.equal(saved(w).rows.length, 1);
  assert.equal(actions(w).length, 1);
  // (b) the row is saved, the action is saved, the write that carries the link (sent) fails: after a reload the fault
  // reads as not sent, and sending it again finds the action by its id.
  const w2 = load({ storage: { 'sc-room-inspection': SETUP } });
  const restore2 = refusing(w2, 'sc-room-inspection', { when: (value) => value.includes('"bathroom-5":true') });
  inspect(w2, '413');
  restore2();
  const kept = saved(w2);
  assert.equal(kept.rows.length, 1);
  assert.deepEqual(plain(kept.rows[0].sent), {}, 'the link did not reach storage');
  assert.equal(actions(w2).length, 1, 'the action did');
  const w3 = load({ storage: all(w2) });
  assert.equal(w3.document.querySelector('.ri-maint').dataset.maintenance, '0/0/0/0/1');
  click(w3, [...w3.document.querySelectorAll('button')].find((b) => /maintenance items to actions/.test(b.textContent)));
  assert.equal(actions(w3).length, 1, 'no duplicate');
  assert.equal(saved(w3).rows[0].sent['bathroom-5'], true);
});

test('old data reads as before: sent flags of an older page, and an action without ref or deterministic id', () => {
  const row = { id: 'rold1', date: '2026-10-20', time: '09:00', room: '412', floor: '4', roomType: 'suite', attendant: 'Jonas', inspector: 'Elena', kind: 'checkout', template: 'suite', answers: { 'bathroom-5': 'fail', 'bathroom-0': 'pass' }, notes: {}, flags: { 'bathroom-5': 'maintenance' }, sent: { 'bathroom-5': true } };
  const oldAction = { id: 'a1k2j3', title: 'Room 412: Tap, drain and flush work', source: 'room-inspection', status: 'open', created: '2026-10-20' };
  const w = load({ storage: { 'sc-room-inspection': { ...SETUP, rows: [row] }, 'sc-actions': { rows: [oldAction] } } });
  assert.equal(saved(w).rows[0].sent['bathroom-5'], true, 'a true stays true');
  assert.equal(w.document.querySelector('.ri-maint').dataset.maintenance, '0/0/0/1/0', 'sent, action not found by id or ref: counted as sent, never as not sent');
  assert.equal([...w.document.querySelectorAll('button')].find((b) => /maintenance items to actions/.test(b.textContent)), undefined, 'nothing to send');
  assert.deepEqual(plain(w.ActionsStore.list()), [plain(w.ActionsStore.clean(oldAction))], 'the old action is left as it is');
});

test('two devices with team sync: the same defect from both is one action; a status or a sent flag can still go the other way, and the page recovers without a copy', () => {
  const dom = new JSDOM('<html lang="en"><body></body></html>', { url: 'https://example.test/tools.html', runScripts: 'outside-only' });
  const w = dom.window;
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  Object.assign(w, { TextEncoder, TextDecoder, CompressionStream, DecompressionStream });
  for (const file of ['storage-guard', 'work-backup', 'team-sync']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const M = w.TeamSyncMath;
  const id = 'ri-r1abc-bathroom-5';
  const base = { id, title: 'Room 412: Tap, drain and flush work', source: 'room-inspection', ref: 'r1abc|bathroom-5', owner: 'Maintenance', due: '2026-10-21', priority: 'Medium', status: 'open', created: '2026-10-20', closed: '', result: '' };
  // (a) both devices sent the same defect, one of them marked it done since: one row, the done one (it is the newer).
  const a = { rows: [{ ...base }] };
  const b = { rows: [{ ...base, status: 'done', closed: '2026-10-21', result: 'Cartridge replaced' }] };
  const merged = M.mergeRows(a.rows, b.rows);
  assert.equal(merged.length, 1, 'one action for one defect');
  assert.equal(merged[0].status, 'done');
  // (b) both still open, one with a note the other lacks and no stamp to tell them apart: one side's row is chosen whole.
  const c = M.mergeRows([{ ...base, result: 'Looked at it' }], [{ ...base }]);
  assert.equal(c.length, 1);
  assert.ok(['Looked at it', ''].includes(c[0].result), 'a concurrent change can be lost: pickRow keeps one version');
  // (c) the inspection rows: the same inspection on both devices, one with the sent flag, the other without.
  const row = { id: 'r1abc', date: '2026-10-20', time: '09:00', room: '412', floor: '4', roomType: 'suite', attendant: 'Jonas', inspector: 'Elena', kind: 'checkout', template: 'suite', answers: { 'bathroom-5': 'fail' }, notes: {}, flags: { 'bathroom-5': 'maintenance' }, sent: { 'bathroom-5': true } };
  const rows = M.mergeRows([{ ...row, sent: {} }], [row]);
  assert.equal(rows.length, 1);
  const lostFlag = !rows[0].sent['bathroom-5'];
  // Whichever version wins, the page recovers: a lost flag reads as not sent, the resend finds the action by its id.
  const page = load({ storage: { 'sc-room-inspection': { ...SETUP, rows }, 'sc-actions': { rows: merged } } });
  if (lostFlag) {
    assert.equal(page.document.querySelector('.ri-maint').dataset.maintenance, '0/0/0/0/1');
    click(page, [...page.document.querySelectorAll('button')].find((bt) => /maintenance items to actions/.test(bt.textContent)));
  }
  assert.equal(actions(page).length, 1, 'never a second action');
  assert.equal(saved(page).rows[0].sent['bathroom-5'], true);
  assert.equal(page.document.querySelector('.ri-maint').dataset.maintenance, '0/1/0/0/0');
});

test('German and Albanian: the action, the messages and the log tag in the page\'s language', { skip: !fs.existsSync('_site/js/ui-de.js') && 'run npm run build first' }, () => {
  for (const [lang, room, words] of [['de', /^Zimmer 412: /, /Maßnahmen|aufgenommen/], ['sq', /^Dhoma 412: /, /veprime|u shtuan/]]) {
    const key = read(DATA[lang]).storageKey;
    const w = load({ lang, storage: { [key]: SETUP } });
    inspect(w, '412');
    const list = actions(w);
    assert.equal(list.length, 1);
    assert.match(list[0].title, room, `${lang}: the title`);
    assert.equal(list[0].ref, `${saved(w, key).rows[0].id}|bathroom-5`);
    assert.match(status(w), words, `${lang}: ${status(w)}`);
    assert.doesNotMatch(w.document.querySelector('.ri-maint').textContent, /Maintenance: /, `${lang}: the tag is translated`);
    assert.equal(w.document.querySelector('.ri-maint').dataset.maintenance, '1/0/0/0/0');
  }
});
