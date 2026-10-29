// The Action Tracker (src/js/action-tracker.js) and the store behind it (src/js/actions-store.js): what every tool
// hands over, how it is kept, and the week's arithmetic.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const load = (url = 'https://example.test/sq/tools/action-tracker/', { page = false, now = '2026-10-23T10:00:00Z' } = {}) => {
  const html = page
    ? `<html lang="sq"><body>${fs.readFileSync('src/_includes/partials/action-tracker.njk', 'utf8')
      .replace(/\{%-?[\s\S]*?-?%\}/g, '').replace(/\{\{ *"([^"]+)" *\| *t\(lang\)[^}]*\}\}/g, '$1').replace(/\{\{ *'([^']+)' *\| *t\(lang\)[^}]*\}\}/g, '$1')
      .replace(/\{\{ *cfg *\| *scriptJson *\| *safe *\}\}/, JSON.stringify(read('src/_data/sq/actionTracker.json'))).replace(/\{\{[^}]*\}\}/g, '').replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`
    : '<html lang="sq"><body></body></html>';
  const dom = new JSDOM(html, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  if (page) w.eval(fs.readFileSync('src/js/action-tracker.js', 'utf8'));
  return w;
};

test('the three data files share their shape and the one storage key', () => {
  const en = read('src/_data/actionTracker.json');
  for (const lang of ['de', 'sq']) {
    const other = read(`src/_data/${lang}/actionTracker.json`);
    assert.deepEqual(Object.keys(other).sort(), Object.keys(en).sort(), lang);
    assert.equal(other.storageKey, 'sc-actions', 'one list in every language');
    assert.deepEqual(Object.keys(other.sources).sort(), Object.keys(en.sources).sort(), `${lang} sources`);
    assert.equal(other.example.length, en.example.length, `${lang} example`);
    other.example.forEach((row, i) => assert.equal(row.status, en.example[i].status, `${lang} example ${i}`));
  }
});

test('an action is cleaned: a title is required, dates are ISO, unknown statuses fall back', () => {
  const { ActionsStore } = load();
  assert.equal(ActionsStore.clean({ title: '   ' }), null);
  const a = plain(ActionsStore.clean({ title: ' Post the rule ', due: '23.10.2026', status: 'weird', priority: 'Urgent', source: 'five whys!' }));
  assert.equal(a.title, 'Post the rule');
  assert.equal(a.due, '', 'a date that is not ISO is dropped');
  assert.equal(a.status, 'open');
  assert.equal(a.priority, 'Medium');
  assert.equal(a.source, 'fivewhys');
  assert.equal(a.created, '2026-10-23', 'created on the device clock');
});

test('the store adds, updates, closes with a date, removes with restore, and counts', () => {
  const w = load();
  const S = w.ActionsStore;
  const a = S.add({ title: 'Mark the floor', owner: 'Besnik', due: '2026-10-20', source: 'five-s-audit' });
  const b = S.add({ title: 'Toolbox talk', due: '2026-10-25' });
  S.add({ title: 'Undated' });
  assert.equal(S.list().length, 3);
  assert.ok(S.isOverdue(a, '2026-10-23'));
  assert.ok(!S.isOverdue(b, '2026-10-23'));
  assert.deepEqual(plain(S.counts('2026-10-23')), { total: 3, open: 3, overdue: 1, done: 0, verified: 0, bySource: { 'five-s-audit': 1, manual: 2 } });
  const closed = S.update(a.id, { status: 'done' });
  assert.equal(closed.closed, '2026-10-23', 'done gets the day it closed');
  assert.equal(S.update(a.id, { status: 'open' }).closed, '', 'reopened, the day goes');
  const gone = S.remove(b.id);
  assert.equal(gone.index, 1);
  assert.equal(S.list().length, 2);
  S.restore(gone.removed, gone.index);
  assert.deepEqual(plain(S.list().map((x) => x.title)), ['Mark the floor', 'Toolbox talk', 'Undated']);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-actions')).rows.length, 3, 'kept as { rows } like the other logs');
});

test('a tool hands an action over in the address, once, in the page\'s language', () => {
  const w = load('https://example.test/de/tools/five-whys/');
  const href = w.ActionsStore.link({ title: 'Stacking rule as one picture', owner: 'Anna', due: '2026-10-30', source: 'five-whys', check: 'Below 10 a week' });
  const url = new w.URL(href);
  assert.equal(url.pathname, '/de/tools/action-tracker/');
  assert.equal(url.searchParams.get('action'), 'Stacking rule as one picture');
  assert.equal(url.searchParams.get('owner'), 'Anna');
  // The tracker reads it.
  const t = load(`https://example.test/de/tools/action-tracker/${url.search}&coaching=p1`);
  const first = t.ActionsStore.fromParams(t.location);
  assert.equal(first.added.title, 'Stacking rule as one picture');
  assert.equal(first.added.source, 'five-whys');
  assert.equal(first.added.check, 'Below 10 a week');
  assert.equal(t.location.search, '?coaching=p1', 'the other parameters stay');
  // The same open action again: not twice.
  const again = load(`https://example.test/de/tools/action-tracker/${url.search}`);
  again.localStorage.setItem('sc-actions', t.localStorage.getItem('sc-actions'));
  const second = again.ActionsStore.fromParams(again.location);
  assert.equal(second.added, null);
  assert.ok(second.duplicate);
  assert.equal(again.ActionsStore.list().length, 1);
});

test('the calendar file holds every open action with a date, escaped', () => {
  const { ActionsStore } = load();
  ActionsStore.add({ title: 'Talk; forklift, lanes', due: '2026-10-25', owner: 'Emir', detail: 'Line one\nLine two' });
  ActionsStore.add({ title: 'No date' });
  const done = ActionsStore.add({ title: 'Closed', due: '2026-10-26' });
  ActionsStore.update(done.id, { status: 'done' });
  const ics = ActionsStore.ics(ActionsStore.list(), new Date('2026-10-23T10:00:00Z'));
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.match(ics, /SUMMARY:Talk\\; forklift\\, lanes \(Emir\)/);
  assert.match(ics, /DTSTART;VALUE=DATE:20261025/);
  assert.match(ics, /DTEND;VALUE=DATE:20261026/);
  assert.match(ics, /DESCRIPTION:Line one\\nLine two/);
});

test('the page: the example opens on a first visit, the week is summed, the list is ordered overdue first', () => {
  const w = load('https://example.test/sq/tools/action-tracker/', { page: true });
  const M = w.ActionTrackerMath;
  // The example is marked in the list: all() has it, list() (what every other tool reads) does not.
  const rows = w.ActionsStore.all();
  assert.equal(rows.length, 12, 'the example list');
  assert.ok(rows.every((a) => a.example === true));
  assert.equal(w.ActionsStore.list().length, 0, 'no other tool counts the example');
  assert.ok(!w.document.querySelector('[data-results]').hidden);
  assert.ok(!w.document.querySelector('.dl-example-note').hidden);
  const sum = M.summarize(rows, '2026-10-23');
  assert.equal(sum.open, 8);
  assert.equal(sum.overdue, 3);
  assert.equal(sum.verified, 2);
  assert.equal(sum.dueWeek, 4);
  assert.match(M.verdict(0), /under control|nën kontroll/);
  assert.match(M.verdict(3), /3/);
  assert.match(M.verdict(5), /5/);
  const ordered = [...rows].sort((a, b) => M.order(a, b, '2026-10-23'));
  assert.ok(w.ActionsStore.isOverdue(ordered[0], '2026-10-23'), 'overdue first');
  assert.ok(!w.ActionsStore.isOpen(ordered.at(-1)), 'closed last');
  const weeks = M.closedPerWeek(rows, '2026-10-23', 8);
  assert.equal(weeks.length, 8);
  assert.equal(weeks.reduce((s, x) => s + x.done + x.verified, 0), 4, 'all four closed within eight weeks');
  // Typing an action of one's own replaces the example.
  const form = w.document.querySelector('[data-entry]');
  form.elements.title.value = 'Our own action';
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  assert.deepEqual(plain(w.ActionsStore.list().map((a) => a.title)), ['Our own action']);
  assert.ok(w.document.querySelector('.dl-example-note').hidden);
  // The filters: the overdue view shows nothing now; "all" shows the one.
  w.document.querySelector('[data-status="overdue"]').click();
  assert.equal(w.document.querySelectorAll('.at-item').length, 0);
  w.document.querySelector('[data-status="all"]').click();
  assert.equal(w.document.querySelectorAll('.at-item').length, 1);
  // "Verified" without a result is refused: the action stays open, the form opens on the result; with a result saved,
  // it is verified and the day is stamped. "Done" closes at once.
  const select = w.document.querySelector('.at-item select');
  select.value = 'verified';
  select.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(w.ActionsStore.list()[0].status, 'open', 'not verified without a result');
  assert.equal(w.ActionsStore.lastUpdate, 'needs-result');
  assert.ok(w.document.querySelector('.at-item.is-editing .at-pending'), 'the form says why');
  const result = w.document.querySelector('.at-item.is-editing [name=result], .at-item.is-editing input[id$="-result"], .at-item.is-editing textarea[id$="-result"]');
  result.value = 'Zero late check-outs in the week after';
  [...w.document.querySelectorAll('.at-item.is-editing button')].find((b) => b.textContent === 'Ruaj ndryshimet' || b.textContent === 'Save changes').click();
  assert.deepEqual([w.ActionsStore.list()[0].status, w.ActionsStore.list()[0].closed, w.ActionsStore.list()[0].result], ['verified', '2026-10-23', 'Zero late check-outs in the week after']);
});
