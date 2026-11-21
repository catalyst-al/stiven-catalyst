// "Open the source" of an action (src/js/defect-source.js, src/js/action-tracker.js; docs/plan-sot-2026-11-11/PLANI.md,
// step 5), from the click to what the log shows, through the real pages: the action is made on the built Damage
// Control page, arrives on the built Action Tracker by the real hand-off, and its link there is followed back to the
// log. Nothing is modelled.
process.env.TZ = 'Europe/Berlin';
const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { openTool, keep, click, type, submit, settle, scriptsOf, builtPage, handedOver, carry } = require('./helpers/tool-page.cjs');

const hasSite = fs.existsSync('_site/tools/damage-control/index.html');
const NOW = '2026-11-11T15:00:00Z';
const LANGS = ['en', 'de', 'sq'];
const KEY = { en: 'sc-damage-control', de: 'sc-damage-control-de', sq: 'sc-damage-control-sq' };
const HANDOVER = { en: 'sc-shift-handover', de: 'sc-shift-handover-de', sq: 'sc-shift-handover-sq' };
const SHIFTS = { en: ['Early', 'Late', 'Night'], de: ['Früh', 'Spät', 'Nacht'], sq: ['Mëngjes', 'Pasdite', 'Natë'] };
const PILOT = { 'sc-shift-close-ui': { v: 1, on: true, set: 1 } };
const ui = { de: JSON.parse(fs.readFileSync('src/_data/de/ui.json', 'utf8')), sq: JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8')) };
const word = (lang, text) => (lang === 'en' ? text : ui[lang][text]);
const fieldsOf = (lang) => Object.fromEntries(JSON.parse(fs.readFileSync(`src/_data/${lang === 'en' ? '' : `${lang}/`}damageControl.json`, 'utf8')).fields.map((f) => [f.name, f]));
const prefix = (lang) => (lang === 'en' ? '' : `/${lang}`);
const row = (lang, extra = {}) => { const f = fieldsOf(lang); return { date: '2026-11-10', shift: f.shift.options[1], stage: f.stage.options[4], type: f.type.options[0], cause: f.cause.options[0], units: 2, cost: null, note: '', ...extra }; };
// A log with a week of its own: an early day, two entries exactly alike, and one that has an id.
const logRows = (lang) => [row(lang, { date: '2026-11-03' }), row(lang, { note: 'twin' }), row(lang, { note: 'twin' }), row(lang, { date: '2026-11-09', cause: fieldsOf(lang).cause.options[1], stage: fieldsOf(lang).stage.options[2], id: 'r-8f3k2' })];
const sheet = (lang) => ({ template: 'warehouse', date: '2026-11-11', shift: SHIFTS[lang][1], area: 'Dock A', from: '', to: '', metrics: [], issues: [], headsUp: '', safety: '', checks: [], ackAt: '', shared: [], ack: null, received: null });
// The shift lead's device: the pilot on, a shift started, the log, and a period of their own chosen (today only).
const device = (lang, rows = logRows(lang)) => ({ ...PILOT, 'sc-shift-ui': { v: 1, date: '2026-11-11', index: 1, of: 3, label: SHIFTS[lang][1], list: lang, set: 1 }, [HANDOVER[lang]]: { current: sheet(lang), idle: false, history: [], received: [], waiting: [] }, [KEY[lang]]: { rows } });

const opened = [];
after(() => opened.forEach((w) => w.close()));
const open = (slug, { lang = 'en', storage = {}, ...options } = {}) => {
  const scripts = slug === 'damage-control' ? [...scriptsOf(builtPage(slug, lang)), { dir: 'js', name: 'shift-context' }] : null;
  const w = openTool(slug, { lang, storage, now: NOW, scripts, ...options });
  w.lang = lang;
  opened.push(w);
  return w;
};
const $ = (w, selector) => w.document.querySelector(selector);
const $$ = (w, selector) => [...w.document.querySelectorAll(selector)];
const actionsOf = (w) => (JSON.parse(w.localStorage.getItem('sc-actions') || '{"rows":[]}').rows);
// The action as the Action Tracker stores it, made by following a link of the log; returns the tracker's page.
const toTracker = async (w, link) => {
  link.dispatchEvent(new w.MouseEvent('mousedown', { bubbles: true }));
  handedOver(w, link.href);
  const tracker = open('action-tracker', { lang: w.lang, storage: keep(w), search: new URL(link.href).hash, before: (next) => carry(w, next) });
  await settle(tracker, 60);
  if (!actionsOf(tracker).length) { submit(tracker, tracker.document.querySelector('form')); await settle(tracker, 60); }
  return tracker;
};
// Following "Open the source" on the tracker: the page its address names, with what the browser holds.
const follow = (tracker, link, storage = keep(tracker)) => {
  const url = new URL(link.href);
  const lang = (/^\/(de|sq)\//.exec(url.pathname) || [])[1] || 'en';
  assert.match(url.pathname, /\/tools\/damage-control\/$/);
  return open('damage-control', { lang, storage, search: url.search });
};
const sourceLink = (tracker) => $(tracker, '[data-open-source]');
const note = (w) => $(w, '[data-source-note]');
const noteText = (w) => $$(w, '[data-source-note] p').map((node) => node.textContent);
const range = (w) => [$(w, '[data-range] [name="from"]').value, $(w, '[data-range] [name="to"]').value];
const logCount = (w) => $$(w, '[data-log] tr').length;
const stored = (w) => { w.dispatchEvent(new w.Event('pagehide')); return Object.fromEntries(Array.from({ length: w.localStorage.length }, (_, i) => w.localStorage.key(i)).sort().map((key) => [key, w.localStorage.getItem(key)])); };
const pickCause = (w, value) => click(w, $$(w, '.dw-focus [data-focus-key]').find((node) => node.dataset.focusKey === `pick:cause:${value}`));
// The damage page with the visitor's own period set to today, as a shift lead would have it.
const damagePage = (lang, storage = device(lang)) => {
  const w = open('damage-control', { lang, storage });
  click(w, $(w, '[data-preset="today"]'));
  click(w, $(w, '[data-preset="all"]'));
  return w;
};

test('the period: the link carries the id of the action and nothing else, and the log opens in its language on the stored days', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    const w = damagePage(lang);
    const tracker = await toTracker(w, $(w, '[data-work-exit="action"]'));
    const [action] = actionsOf(tracker);
    assert.deepEqual([action.origin.kind, action.origin.from, action.origin.to, action.origin.lang], ['period', '2026-11-03', '2026-11-10', lang]);
    const link = sourceLink(tracker);
    assert.equal(link.textContent, word(lang, 'Open the source'));
    const url = new URL(link.href);
    assert.equal(url.pathname, `${prefix(lang)}/tools/damage-control/`, `${lang}: the log of the action's language`);
    assert.equal(url.search, `?source=${action.id}`, `${lang}: the id of the action and nothing else`);
    assert.equal(url.hash, '');
    // The visitor has since chosen a period of their own: today.
    const own = open('damage-control', { lang, storage: keep(tracker) });
    click(own, $(own, '[data-preset="today"]'));
    const before = stored(own);
    const page = follow(tracker, link, keep(own));
    assert.equal(note(page).hidden, false);
    assert.equal(noteText(page)[0], word(lang, 'Opened from an action'));
    assert.equal(noteText(page)[1], action.title);
    assert.deepEqual(range(page), ['2026-11-03', '2026-11-10'], `${lang}: the stored days`);
    assert.match($(page, '[data-range] [data-span]').textContent, /4/, `${lang}: the result is of the four entries of those days`);
    assert.equal($(page, '.ci-log-filter .ci-chip'), null, `${lang}: a period picks out no row`);
    assert.equal($$(page, '[data-source-note] .dl-warning').length, 0, `${lang}: found, nothing to warn of`);
    // Only read: everything the browser holds is as it was, the own period included.
    assert.deepEqual(stored(page), before, `${lang}: nothing was written`);
    assert.deepEqual([JSON.parse(before[KEY[lang]]).from, JSON.parse(before[KEY[lang]]).to], ['2026-11-11', '2026-11-11']);
    // Leaving: the own period is back and the address is clean.
    click(page, $(page, '[data-source-leave]'));
    assert.deepEqual(range(page), ['2026-11-11', '2026-11-11']);
    assert.equal(page.location.search, '');
    assert.equal(note(page).hidden, true);
    assert.deepEqual(stored(page), before);
  }
});

test('the filter: the stored days and the stored filter come back together', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    const f = fieldsOf(lang);
    const w = damagePage(lang);
    pickCause(w, f.cause.options[0]);
    const tracker = await toTracker(w, $(w, '[data-work-exit="action"]'));
    assert.deepEqual(actionsOf(tracker)[0].origin.filter, { field: 'cause', value: f.cause.options[0] });
    const page = follow(tracker, sourceLink(tracker));
    assert.deepEqual(range(page), ['2026-11-03', '2026-11-10']);
    assert.ok($(page, '[data-work-filter]').textContent.includes(`${f.cause.label} = ${f.cause.options[0]}`), `${lang}: the filter is on`);
    assert.equal(logCount(page), 3, `${lang}: the log shows the entries of that cause`);
    assert.ok(noteText(page).some((text) => text.includes(`${f.cause.label} = ${f.cause.options[0]}`)), `${lang}: the note names it`);
    // The filter value is gone from the log: the period is shown, and the page says so.
    const without = follow(tracker, sourceLink(tracker), { ...keep(tracker), [KEY[lang]]: { rows: [row(lang, { cause: f.cause.options[2] })] } });
    assert.equal($(without, '[data-source-note] .dl-warning').textContent.startsWith(word(lang, 'The source is not found on this device.')), true, `${lang}: said when no entry has it`);
    assert.deepEqual(range(without), ['2026-11-03', '2026-11-10']);
  }
});

test('a row with an id is found by its id; when the row is not here the period opens and the page says the row is not on this device', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    const w = damagePage(lang);
    // The log shows the last entered first: the row with an id, then the twins, then the oldest.
    const tracker = await toTracker(w, $$(w, '[data-log] .dw-row-action')[0]);
    const [action] = actionsOf(tracker);
    assert.deepEqual([action.origin.kind, action.origin.row.id, action.ref], ['row', 'r-8f3k2', 'r-8f3k2']);
    const page = follow(tracker, sourceLink(tracker));
    assert.equal(logCount(page), 1, `${lang}: the one row`);
    assert.ok($(page, '[data-log] tr').textContent.includes(fieldsOf(lang).cause.options[1]));
    assert.ok(noteText(page).includes(word(lang, 'The entry is in the log below.')));
    // Another row with the very same fields but another id is not the source.
    const other = follow(tracker, sourceLink(tracker), { ...keep(tracker), [KEY[lang]]: { rows: logRows(lang).map((item) => (item.id ? { ...item, id: 'r-other' } : item)) } });
    assert.ok($(other, '[data-source-note] .dl-warning').textContent.includes(word(lang, 'The entry is not on this device: the period it belongs to is shown instead.')), `${lang}: not found by its id`);
    assert.deepEqual(range(other), ['2026-11-09', '2026-11-09'], `${lang}: the period is shown`);
    assert.equal($(other, '.ci-log-filter .ci-chip'), null, `${lang}: no row is picked out as the source`);
    assert.equal(logCount(other), 4, `${lang}: the log is shown whole`);
  }
});

test('a row without an id is looked for by the fields the action kept: one, several candidates, the one that is left, or none', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    const w = damagePage(lang);
    const links = $$(w, '[data-log] .dw-row-action');
    // The oldest row: alone of its kind.
    let tracker = await toTracker(w, links[3]);
    assert.deepEqual([actionsOf(tracker)[0].origin.row.id, actionsOf(tracker)[0].origin.row.twins], ['', 1]);
    let page = follow(tracker, sourceLink(tracker));
    assert.equal(logCount(page), 1);
    assert.ok(noteText(page).includes(word(lang, 'The entry is in the log below.')), `${lang}: one row, the source`);
    // One of the two twins.
    const again = damagePage(lang);
    tracker = await toTracker(again, $$(again, '[data-log] .dw-row-action')[1]);
    const [action] = actionsOf(tracker);
    assert.equal(action.origin.row.twins, 2);
    page = follow(tracker, sourceLink(tracker));
    assert.equal(logCount(page), 2, `${lang}: both candidates are shown`);
    assert.ok($(page, '[data-source-note] .dl-warning').textContent.includes(word(lang, '{n} entries of the log are exactly like this one. All of them are shown as candidates; none is chosen as the source.').replace('{n}', '2')), `${lang}: and none is chosen`);
    // One of the twins was removed since: the other is the candidate that is left.
    const one = logRows(lang).filter((item, index) => index !== 1);
    page = follow(tracker, sourceLink(tracker), { ...keep(tracker), [KEY[lang]]: { rows: one } });
    assert.equal(logCount(page), 1);
    assert.ok($(page, '[data-source-note] .dl-warning').textContent.includes(word(lang, 'When the action was made the log had {n} entries exactly like this one; one is left. It is shown as the candidate that is left: it may or may not be the very one.').replace('{n}', '2')), `${lang}: the candidate that is left`);
    // Both are gone: the period, with the words that the row is no longer found.
    page = follow(tracker, sourceLink(tracker), { ...keep(tracker), [KEY[lang]]: { rows: logRows(lang).filter((item) => item.note !== 'twin') } });
    assert.ok($(page, '[data-source-note] .dl-warning').textContent.includes(word(lang, 'The entry is no longer found in the log: it was changed or removed. The period it belonged to is shown instead.')), `${lang}: no longer found`);
    assert.deepEqual(range(page), ['2026-11-10', '2026-11-10']);
    assert.equal($(page, '.ci-log-filter .ci-chip'), null, `${lang}: no row is picked out`);
    // A row that only looks alike but has an id is not a candidate for a row that had none.
    page = follow(tracker, sourceLink(tracker), { ...keep(tracker), [KEY[lang]]: { rows: [row(lang, { note: 'twin', id: 'r-new' })] } });
    assert.ok($(page, '[data-source-note] .dl-warning').textContent.includes(word(lang, 'The entry is no longer found in the log: it was changed or removed. The period it belonged to is shown instead.')));
  }
});

test('an old action without an origin has no link; opened by hand it says so and shows nothing as its source', { skip: !hasSite }, () => {
  const old = { rows: [{ id: 'a-old1', title: 'Fix the dock door', source: 'damage-control', status: 'open', priority: 'High', created: '2026-10-01' }, { id: 'a-manual', title: 'Typed by hand', source: 'manual', status: 'open', created: '2026-10-01' }] };
  for (const lang of LANGS) {
    const tracker = open('action-tracker', { lang, storage: { ...device(lang), 'sc-actions': old } });
    assert.equal($$(tracker, '[data-open-source]').length, 0, `${lang}: no link without an origin`);
    assert.ok(tracker.document.body.textContent.includes('Fix the dock door'), `${lang}: the action is listed as before`);
    const before = keep(tracker);
    const page = open('damage-control', { lang, storage: before, search: '?source=a-old1' });
    assert.ok($(page, '[data-source-note] .dl-warning').textContent.startsWith(word(lang, 'This action does not say where in the log it came from: it was made before sources were kept, or it did not come from an entry, a filter or a period of this log.')), lang);
    assert.deepEqual(range(page), ['', ''], `${lang}: no period is lent`);
    assert.equal(logCount(page), 4, `${lang}: the log is as it is`);
    assert.deepEqual(stored(page), Object.fromEntries(Object.entries(before).sort().map(([key, value]) => [key, typeof value === 'string' ? value : JSON.stringify(value)])), `${lang}: nothing written`);
    // An id the list does not have.
    const unknown = open('damage-control', { lang, storage: before, search: '?source=a-nowhere' });
    assert.ok($(unknown, '[data-source-note] .dl-warning').textContent.startsWith(word(lang, 'This action is not on the action list of this device, so its source cannot be opened here. The list may have been cleared, or the action is on another device.')), lang);
    // Not an id at all: the page is the page.
    assert.equal(note(open('damage-control', { lang, storage: before, search: '?source=%3Cscript%3E' })).hidden, true);
  }
});

test('a log that was cleared, and a device that never had the log: the page opens and says the source is not found here', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    const w = damagePage(lang);
    const tracker = await toTracker(w, $(w, '[data-work-exit="action"]'));
    const link = sourceLink(tracker);
    const empty = word(lang, 'The log is empty here: it was cleared, or the action came from another device.');
    // Cleared: the log's key is there, without rows.
    const cleared = follow(tracker, link, { ...keep(tracker), [KEY[lang]]: { rows: [] } });
    assert.equal($(cleared, '[data-source-note] .dl-warning').textContent, `${word(lang, 'The source is not found on this device.')} ${empty}`, `${lang}: cleared`);
    assert.deepEqual(range(cleared), ['2026-11-03', '2026-11-10'], `${lang}: the period is still named`);
    // Another device: the action list came by team sync or a file, the log never did. The page loads its example there.
    const elsewhere = follow(tracker, link, { 'sc-actions': tracker.localStorage.getItem('sc-actions') });
    assert.equal($(elsewhere, '[data-source-note] .dl-warning').textContent, `${word(lang, 'The source is not found on this device.')} ${empty}`, `${lang}: another device`);
    assert.ok(noteText(elsewhere).includes(word(lang, 'What the page shows below is its example, not your log.')), `${lang}: the example is not taken for the log`);
    // A row source there: the same, and no row is picked out.
    const again = damagePage(lang);
    const rowTracker = await toTracker(again, $$(again, '[data-log] .dw-row-action')[1]);
    const rowElsewhere = follow(rowTracker, sourceLink(rowTracker), { 'sc-actions': rowTracker.localStorage.getItem('sc-actions') });
    assert.ok($(rowElsewhere, '[data-source-note] .dl-warning').textContent.includes(empty), `${lang}: a row on another device`);
    assert.equal($(rowElsewhere, '.ci-log-filter .ci-chip'), null);
  }
});

test('the source of an action is the log of its language; another language\'s page points there', { skip: !hasSite }, async () => {
  const w = damagePage('sq');
  const tracker = await toTracker(w, $(w, '[data-work-exit="action"]'));
  const id = actionsOf(tracker)[0].id;
  // The list is one for the three languages: the English tracker links to the Albanian log too.
  const english = open('action-tracker', { lang: 'en', storage: keep(tracker) });
  assert.equal(new URL(sourceLink(english).href).pathname, '/sq/tools/damage-control/');
  const page = open('damage-control', { lang: 'en', storage: keep(tracker), search: `?source=${id}` });
  assert.match($(page, '[data-source-note] .dl-warning').textContent, /^The source of this action is the log in Shqip: each language keeps its own log\./);
  assert.equal($(page, '[data-source-note] .dl-warning a').getAttribute('href'), `/sq/tools/damage-control/?source=${id}`);
  assert.deepEqual(range(page), ['', ''], 'nothing is lent on the wrong page');
});

test('the view only reads: the active shift, an unfinished form and the pilot are as they were, and an entry made meanwhile keeps the visitor\'s own period', { skip: !hasSite }, async () => {
  const w = damagePage('en');
  const tracker = await toTracker(w, $(w, '[data-work-exit="action"]'));
  // The shift lead has an unfinished form and a period of their own.
  const own = open('damage-control', { storage: keep(tracker) });
  click(own, $(own, '[data-preset="today"]'));
  type(own, $(own, '[data-entry]').elements.note, 'Half typed');
  const before = stored(own);
  const page = follow(tracker, sourceLink(tracker), keep(own));
  assert.deepEqual(stored(page), before, 'opening the source wrote nothing');
  assert.equal($(page, '[data-entry]').elements.note.value, 'Half typed', 'the unfinished form is in the form');
  assert.equal(page.ShiftContext.active().label, 'Late');
  assert.equal(page.ShiftClose.enabled(), true);
  // An entry is made while the source is shown: the row is stored, the period stored is still the visitor's own.
  submit(page, $(page, '[data-entry]'));
  const log = JSON.parse(stored(page)[KEY.en]);
  assert.equal(log.rows.at(-1).note, 'Half typed');
  assert.deepEqual([log.from, log.to], ['2026-11-11', '2026-11-11'], 'the lent period was not stored');
  assert.deepEqual(range(page), ['2026-11-03', '2026-11-10'], 'and the view is still the source');
  // A period the visitor chooses now is their own: the view ends and that choice is what is stored.
  click(page, $(page, '[data-preset="week"]'));
  assert.equal(note(page).hidden, true);
  assert.equal(page.location.search, '');
  const chosen = JSON.parse(stored(page)[KEY.en]);
  assert.deepEqual([chosen.from, chosen.to], range(page));
  assert.notDeepEqual(range(page), ['2026-11-03', '2026-11-10']);
  // Where the pilot is off the source opens the same, on the page as it always was.
  const { 'sc-shift-close-ui': gone, ...plain } = keep(tracker);
  const off = follow(tracker, sourceLink(tracker), plain);
  assert.equal(off.document.body.classList.contains('dw-on'), false);
  assert.deepEqual(range(off), ['2026-11-03', '2026-11-10']);
  assert.equal(off.localStorage.getItem('sc-shift-close-ui'), null, 'and turns nothing on');
});

test('the log reads an origin by the rules of the store: what one refuses the other refuses', { skip: !hasSite }, () => {
  const w = open('damage-control', { storage: device('en') });
  w.eval(fs.readFileSync('src/js/actions-store.js', 'utf8'));
  const base = { v: 1, tool: 'damage-control', lang: 'en', kind: 'period', from: '2026-11-03', to: '2026-11-10' };
  const rowOf = (extra = {}) => ({ ...base, kind: 'row', row: { id: '', date: '2026-11-10', shift: 'Late', stage: 'Loading', cause: 'Stacking', units: 2, twins: 1, ...extra } });
  const cases = [base, { ...base, kind: 'filter', filter: { field: 'cause', value: 'Stacking' } }, rowOf(), rowOf({ id: 'r-1', twins: 3 }),
    null, 'x', { ...base, v: 2 }, { ...base, lang: 'fr' }, { ...base, kind: 'other' }, { ...base, from: '2026-11-11' }, { ...base, from: 'yesterday' }, { ...base, to: '' },
    { ...base, kind: 'filter' }, { ...base, kind: 'filter', filter: { field: 'type', value: 'Crushed' } }, { ...base, kind: 'filter', filter: { field: 'cause', value: '' } },
    { ...base, kind: 'row' }, rowOf({ date: 'x' }), rowOf({ units: 0 }), rowOf({ units: 1.5 })];
  for (const item of cases) {
    assert.equal(w.DefectSource.originOf(item) === null, w.ActionsStore.originOf(item) === null, JSON.stringify(item));
  }
  assert.equal(w.DefectSource.originOf({ ...base, tool: 'incomplete-control' }), null, 'another tool\'s origin is not this log\'s');
});
