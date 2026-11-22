// Before and after an action (src/js/defect-source.js; docs/plan-sot-2026-11-11/PLANI.md, step 7), through the real
// pages: the action is made on the built Damage Control page, arrives on the built Action Tracker, is marked done
// there by the list's own code on a given day, and its source is then opened in the log some days later.
process.env.TZ = 'Europe/Berlin';
const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { openTool, keep, click, submit, settle, scriptsOf, builtPage, handedOver, carry } = require('./helpers/tool-page.cjs');

const hasSite = fs.existsSync('_site/tools/damage-control/index.html');
const LANGS = ['en', 'de', 'sq'];
const KEY = { en: 'sc-damage-control', de: 'sc-damage-control-de', sq: 'sc-damage-control-sq' };
const HANDOVER = { en: 'sc-shift-handover', de: 'sc-shift-handover-de', sq: 'sc-shift-handover-sq' };
const SHIFTS = { en: ['Early', 'Late', 'Night'], de: ['Früh', 'Spät', 'Nacht'], sq: ['Mëngjes', 'Pasdite', 'Natë'] };
const ui = { de: JSON.parse(fs.readFileSync('src/_data/de/ui.json', 'utf8')), sq: JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8')) };
const word = (lang, text) => (lang === 'en' ? text : ui[lang][text]);
const cfg = (lang) => JSON.parse(fs.readFileSync(`src/_data/${lang === 'en' ? '' : `${lang}/`}damageControl.json`, 'utf8'));
const fieldsOf = (lang) => Object.fromEntries(cfg(lang).fields.map((f) => [f.name, f]));
const at = (day, time = '12:00') => `2026-11-${String(day).padStart(2, '0')}T${time}:00Z`;
const iso = (day) => `2026-11-${String(day).padStart(2, '0')}`;
// A day as the page of any of the three languages writes it.
const shownDay = (day) => `(?:2026-11-${String(day).padStart(2, '0')}|${String(day).padStart(2, '0')}\\.11\\.2026)`;
const span = (from, to, days) => new RegExp(`^${shownDay(from)} – ${shownDay(to)} · ${days} `);
const row = (lang, day, units, extra = {}) => { const f = fieldsOf(lang); return { date: iso(day), shift: f.shift.options[1], stage: f.stage.options[4], type: f.type.options[0], cause: f.cause.options[0], units, cost: null, note: '', ...extra }; };
const volumes = (days, volume = 1000) => days.map((day) => ({ date: iso(day), volume }));
const sheet = (lang) => ({ template: 'warehouse', date: iso(9), shift: SHIFTS[lang][1], area: 'Dock A', from: '', to: '', metrics: [], issues: [], headsUp: '', safety: '', checks: [], ackAt: '', shared: [], ack: null, received: null });
const device = (lang, rows) => ({ 'sc-shift-close-ui': { v: 1, on: true, set: 1 }, 'sc-shift-ui': { v: 1, date: iso(9), index: 1, of: 3, label: SHIFTS[lang][1], list: lang, set: 1 }, [HANDOVER[lang]]: { current: sheet(lang), idle: false, history: [], received: [], waiting: [] }, [KEY[lang]]: { rows } });
// The week the problem was seen in: 3 to 9 November, 14 damaged units.
const week = (lang) => [row(lang, 3, 4), row(lang, 5, 6), row(lang, 9, 4)];

const opened = [];
after(() => opened.forEach((w) => w.close()));
const open = (slug, { lang = 'en', storage = {}, now, ...options } = {}) => {
  const scripts = slug === 'damage-control' ? [...scriptsOf(builtPage(slug, lang)), { dir: 'js', name: 'shift-context' }] : null;
  const w = openTool(slug, { lang, storage, now, scripts, ...options });
  w.lang = lang;
  opened.push(w);
  return w;
};
const $ = (w, selector) => w.document.querySelector(selector);
const $$ = (w, selector) => [...w.document.querySelectorAll(selector)];
const actionsOf = (w) => JSON.parse(w.localStorage.getItem('sc-actions') || '{"rows":[]}').rows;
// The action for the period (or the filter chosen first), made on the 9th and stored by the tracker; then marked
// done by the list on `doneOn`. Returns what the browser holds after that.
const actionDone = async (lang, { doneOn, pick = null, rows = week(lang) } = {}) => {
  const w = open('damage-control', { lang, storage: device(lang, rows), now: at(9) });
  if (pick) click(w, $$(w, '.dw-focus [data-focus-key]').find((node) => node.dataset.focusKey === `pick:${pick.field}:${pick.value}`));
  const link = $(w, '[data-work-exit="action"]');
  link.dispatchEvent(new w.MouseEvent('mousedown', { bubbles: true }));
  handedOver(w, link.href);
  const tracker = open('action-tracker', { lang, storage: keep(w), now: at(9), search: new URL(link.href).hash, before: (next) => carry(w, next) });
  await settle(tracker, 60);
  if (!actionsOf(tracker).length) { submit(tracker, tracker.document.querySelector('form')); await settle(tracker, 60); }
  const [action] = actionsOf(tracker);
  if (doneOn === undefined) return { storage: keep(tracker), id: action.id, tracker };
  const later = open('action-tracker', { lang, storage: keep(tracker), now: at(doneOn) });
  later.ActionsStore.update(action.id, { status: 'done', result: 'Stacking rule shown at the briefing' });
  assert.equal(actionsOf(later)[0].closed, iso(doneOn), 'the list keeps the day the action was marked done');
  // The list as the visitor sees it after that.
  return { storage: keep(later), id: action.id, tracker: open('action-tracker', { lang, storage: keep(later), now: at(doneOn) }) };
};
// The source of the action, opened on `today` with the log as it is then.
// Nothing is compared before the visitor confirms the day: `day` is the day they give (the proposal when left out),
// `confirm: false` leaves the question unanswered.
const confirmDay = (w, day) => {
  const form = $(w, '[data-source-day]');
  if (day !== undefined) form.elements.day.value = iso(day);
  submit(w, form);
  return w;
};
const source = (lang, done, { today = 18, log, day, confirm = true }) => {
  const w = open('damage-control', { lang, storage: { ...done.storage, [KEY[lang]]: log }, now: at(today), search: `?source=${done.id}` });
  return confirm && $(w, '[data-source-day]') ? confirmDay(w, day) : w;
};
const compareBox = (w) => $(w, '[data-source-compare]');
const cells = (w, name) => $$(w, `[data-source-period="${name}"] td`).map((node) => node.textContent);
const notes = (w) => $$(w, '[data-source-compare] p').map((node) => node.textContent);
const measured = (w) => $(w, '[data-source-measured]');

test('a valid comparison: both periods with their dates, their damage, their volume and their rate; the day the action was done is in neither', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    const done = await actionDone(lang, { doneOn: 10 });
    // (The list's own link, and what it says once the action is done, is followed in the browser test.)
    // The log a week later: the week before, the day of the action with a heavy entry, and the week after.
    const log = { rows: [...week(lang), row(lang, 10, 50), row(lang, 12, 2), row(lang, 15, 4)], volumes: [...volumes([3, 5, 9], 2000), ...volumes([10], 2000), ...volumes([11, 12, 15, 17], 1500)] };
    const w = source(lang, done, { log });
    assert.equal(compareBox(w).dataset.sourceCompare, 'ok', lang);
    const t = cfg(lang).text;
    assert.deepEqual($$(w, '.dw-compare-table thead th').map((node) => node.textContent), ['', word(lang, 'Period'), t.many.charAt(0).toUpperCase() + t.many.slice(1), t.volumeLabel, t.rateLabel], `${lang}: the columns in its language`);
    assert.deepEqual([$(w, '[data-source-period="before"] th').textContent, $(w, '[data-source-period="after"] th').textContent], [word(lang, 'Before'), word(lang, 'After')]);
    const [before, afterCells] = [cells(w, 'before'), cells(w, 'after')];
    assert.match(before[0], span(3, 9, 7), `${lang}: the stored period`);
    assert.match(afterCells[0], span(11, 17, 7), `${lang}: the same number of days from the day after`);
    assert.deepEqual([before[1], afterCells[1]], ['14', '6'], `${lang}: the damage of each, without the 50 of the day in between`);
    assert.deepEqual([before[2].replace(/\D/g, ''), afterCells[2].replace(/\D/g, '')], ['6000', '6000'], `${lang}: the volume recorded for each`);
    assert.deepEqual([before[3].replace(/\s/g, ''), afterCells[3].replace(/\s/g, '')].map((text) => text.replace(',', '.')), ['0.23%', '0.10%'], `${lang}: the rates`);
    assert.equal(measured(w).dataset.sourceMeasured, 'rate');
    assert.ok(measured(w).textContent.includes(word(lang, 'That is {n} percentage points lower.').split('{n}')[1].trim()), `${lang}: lower, in its language`);
    assert.ok(new RegExp(shownDay(10)).test(notes(w)[0]) && notes(w)[0].includes(word(lang, 'That day is in neither period: the log is kept by day, and that day is partly before the action and partly after it.')), `${lang}: the day in between is said`);
    assert.equal(notes(w).at(-1), word(lang, 'This is what was measured, with the same filter in both periods. It does not show that the action caused it: other things may have changed in the same days.'), `${lang}: nothing is attributed`);
    // Nothing is decided for the visitor: the action is as it was, and nothing the browser holds was written.
    w.dispatchEvent(new w.Event('pagehide'));
    assert.equal(w.localStorage.getItem('sc-actions'), JSON.stringify(done.storage['sc-actions']), `${lang}: the action is not touched`);
    assert.equal(actionsOf(w)[0].status, 'done');
    assert.equal(w.localStorage.getItem(KEY[lang]), JSON.stringify(log), `${lang}: the log is not written`);
  }
});

test('no volume: the counts and the dates are shown, no rate is given, and the page says what is missing', { skip: !hasSite }, async () => {
  const done = await actionDone('en', { doneOn: 10 });
  // No volume at all.
  let w = source('en', done, { log: { rows: [...week('en'), row('en', 12, 2)] } });
  assert.deepEqual([cells(w, 'before').slice(1), cells(w, 'after').slice(1)], [['14', 'not recorded', '–'], ['2', 'not recorded', '–']]);
  assert.equal(measured(w).textContent, 'No measured change in the rate can be given.');
  assert.ok(notes(w).some((text) => text.startsWith('A rate needs the volume of each period, recorded day by day')));
  // A volume for one period only: still no rate for either.
  w = source('en', done, { log: { rows: [...week('en'), row('en', 12, 2)], volumes: volumes([3, 5, 9], 2000) } });
  assert.deepEqual([cells(w, 'before').slice(1), cells(w, 'after').slice(1)], [['14', '6,000', '–'], ['2', 'not recorded', '–']]);
  assert.equal(measured(w).dataset.sourceMeasured, 'none');
  // A volume for some of the days with entries is not a volume of the period.
  w = source('en', done, { log: { rows: [...week('en'), row('en', 12, 2), row('en', 13, 1)], volumes: [...volumes([3, 5, 9], 2000), ...volumes([12], 1500)] } });
  assert.deepEqual(cells(w, 'after').slice(1), ['3', 'not for every day', '–']);
  // More damage than volume is not a rate either.
  w = source('en', done, { log: { rows: [...week('en'), row('en', 12, 2)], volumes: [...volumes([3, 5, 9], 2), ...volumes([12], 1500)] } });
  assert.equal(measured(w).dataset.sourceMeasured, 'none');
  assert.ok(notes(w).includes('A period holds more damage than its recorded volume: check the volume.'));
});

test('zero damage with a volume recorded is a measured zero; nothing recorded at all is no data, and the page says which', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    const done = await actionDone(lang, { doneOn: 10 });
    // After the action: the volume of four days, and not one damage entry.
    const zero = source(lang, done, { log: { rows: week(lang), volumes: [...volumes([3, 5, 9], 2000), ...volumes([11, 12, 13, 14], 1500)] } });
    assert.deepEqual(cells(zero, 'after').slice(1).map((text) => text.replace(/[^\d%,.]/g, '').replace(',', '.')), ['0', '6.000'.replace('.', lang === 'en' ? '.' : '.'), '0.00%'].map((text, index) => (index === 1 ? cells(zero, 'after')[2].replace(/[^\d%,.]/g, '').replace(',', '.') : text)), `${lang}: 0 of 6000 is 0.00 %`);
    assert.equal(cells(zero, 'after')[1], '0');
    assert.equal(cells(zero, 'after')[2].replace(/\D/g, ''), '6000');
    assert.equal(measured(zero).dataset.sourceMeasured, 'rate');
    assert.ok(notes(zero).some((text) => text.startsWith(`${word(lang, 'After')}:`) && text.endsWith(word(lang, '{period}: no damage with {volume} recorded as handled. That is a measured zero.').split('. ').at(-1))), `${lang}: a measured zero`);
    // After the action: nothing recorded, neither damage nor volume.
    const none = source(lang, done, { log: { rows: week(lang), volumes: volumes([3, 5, 9], 2000) } });
    assert.deepEqual(cells(none, 'after').slice(1, 2), ['–'], `${lang}: no count is claimed`);
    assert.equal(cells(none, 'after')[2], word(lang, 'not recorded'));
    assert.equal(measured(none).dataset.sourceMeasured, 'none');
    assert.ok(notes(none).some((text) => text.startsWith(`${word(lang, 'After')}:`) && text.endsWith(word(lang, '{period}: nothing is recorded for these days, neither damage nor volume. That is no data, not zero damage.').split('. ').at(-1))), `${lang}: no data, not zero`);
    assert.ok(!notes(none).some((text) => text.includes(word(lang, '{period}: no damage with {volume} recorded as handled. That is a measured zero.').split('. ').at(-1))), `${lang}: and not called a zero`);
  }
});

test('volumes that were not counted the same way are shown, and no rate is made of them', { skip: !hasSite }, async () => {
  const done = await actionDone('en', { doneOn: 10 });
  // Before: a total the visitor typed for exactly those days. After: the sum of the daily volumes.
  const log = { rows: [...week('en'), row('en', 12, 2)], volume: '7000', totalsFor: { volume: '2026-11-03|2026-11-09' }, from: '2026-11-03', to: '2026-11-09', volumes: volumes([11, 12, 15], 2000) };
  const w = source('en', done, { log });
  assert.deepEqual([cells(w, 'before').slice(1), cells(w, 'after').slice(1)], [['14', '7,000', '–'], ['2', '6,000', '–']]);
  assert.equal(measured(w).textContent, 'No measured change in the rate can be given.');
  assert.ok(notes(w).includes('The two volumes were not counted the same way: one is a total typed for its period, the other the sum of the daily volumes. Rates from them are not compared.'));
  // A typed total of other days is not the volume of this period at all.
  const other = source('en', done, { log: { ...log, totalsFor: { volume: '2026-11-01|2026-11-09' } } });
  assert.deepEqual(cells(other, 'before').slice(1), ['14', 'not recorded', '–']);
});

test('an action done in the middle of its period: "before" ends the day before it, the day itself is left out, and "after" has the same length', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    // Seen over 3 to 9 November, done on the 6th.
    const done = await actionDone(lang, { doneOn: 6, rows: [row(lang, 3, 4), row(lang, 5, 6), row(lang, 6, 30), row(lang, 9, 4)] });
    const log = { rows: [row(lang, 3, 4), row(lang, 5, 6), row(lang, 6, 30), row(lang, 8, 1), row(lang, 9, 4), row(lang, 10, 9)], volumes: volumes([3, 4, 5, 6, 7, 8, 9, 10], 1000) };
    const w = source(lang, done, { log });
    assert.match(cells(w, 'before')[0], span(3, 5, 3), `${lang}: before ends on the 5th`);
    assert.match(cells(w, 'after')[0], span(7, 9, 3), `${lang}: after is the three days from the 7th`);
    assert.deepEqual([cells(w, 'before')[1], cells(w, 'after')[1]], ['10', '5'], `${lang}: the 30 of the 6th and the 9 of the 10th are in neither`);
    assert.deepEqual([cells(w, 'before')[2].replace(/\D/g, ''), cells(w, 'after')[2].replace(/\D/g, '')], ['3000', '3000']);
    assert.ok(notes(w).includes(word(lang, 'The action was done inside its stored period, so “before” ends the day before it.')), `${lang}: said`);
    assert.equal(measured(w).dataset.sourceMeasured, 'rate');
  }
  // Done on the first day of the period, or before it: there is no "before".
  const first = await actionDone('en', { doneOn: 9, rows: [row('en', 9, 4)] });
  const w = source('en', first, { log: { rows: [row('en', 9, 4), row('en', 12, 1)] } });
  assert.equal(compareBox(w).dataset.sourceCompare, 'before-empty');
  assert.equal($$(w, '.dw-compare-table').length, 0);
  // Opened on the day it was done: no day after has passed.
  const done = await actionDone('en', { doneOn: 10 });
  assert.equal(compareBox(source('en', done, { today: 10, log: { rows: week('en') } })).dataset.sourceCompare, 'after-not-started');
});

test('the day is asked first: the day the action was marked done is a proposal, nothing is compared before it is confirmed, and a corrected day moves both periods', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    // Put in place on the 6th; marked done on the list four days later, on the 10th.
    const done = await actionDone(lang, { doneOn: 10, rows: [row(lang, 3, 4), row(lang, 5, 6), row(lang, 6, 30), row(lang, 9, 4)] });
    const listBefore = JSON.stringify(done.storage['sc-actions']);
    const log = { rows: [row(lang, 3, 4), row(lang, 5, 6), row(lang, 6, 30), row(lang, 8, 1), row(lang, 9, 4), row(lang, 10, 9), row(lang, 12, 2)], volumes: volumes([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 1000) };
    const w = source(lang, done, { log, confirm: false });
    // Asked, with the proposal; nothing is compared yet.
    const form = $(w, '[data-source-day]');
    assert.ok(form, `${lang}: the day is asked`);
    assert.equal(form.elements.day.value, iso(10), `${lang}: the day it was marked done is the proposal`);
    assert.equal(form.elements.day.max, iso(18));
    assert.equal(compareBox(w), null, `${lang}: nothing is compared before the day is confirmed`);
    assert.equal($$(w, '.dw-compare-table').length, 0);
    assert.equal($(w, 'label[for="dw-source-day"]').textContent, word(lang, 'The day the countermeasure was really in place'));
    // A day after today is refused.
    form.elements.day.value = iso(19);
    submit(w, form);
    assert.equal(compareBox(w), null);
    assert.equal(form.querySelector('[role="status"]').textContent, word(lang, 'Give a day, today at the latest.'));
    // Confirmed as proposed: the 10th is left out, the heavy 6th counts as "before".
    confirmDay(w, 10);
    assert.equal(compareBox(w).dataset.sourceImplemented, iso(10));
    assert.match(cells(w, 'before')[0], span(3, 9, 7));
    assert.match(cells(w, 'after')[0], span(11, 17, 7));
    assert.deepEqual([cells(w, 'before')[1], cells(w, 'after')[1]], ['45', '2'], `${lang}: with the day it was marked done, the 30 of the 6th is "before"`);
    // Corrected to the real day: the 6th is left out, and both periods move.
    click(w, $(w, '[data-source-change-day]'));
    assert.equal(compareBox(w), null, `${lang}: asked again`);
    confirmDay(w, 6);
    assert.equal(compareBox(w).dataset.sourceImplemented, iso(6));
    assert.match(cells(w, 'before')[0], span(3, 5, 3));
    assert.match(cells(w, 'after')[0], span(7, 9, 3));
    assert.deepEqual([cells(w, 'before')[1], cells(w, 'after')[1]], ['10', '5'], `${lang}: the 30 of the 6th is in neither, the 9 of the 10th is outside`);
    assert.ok(notes(w)[0].startsWith(word(lang, 'Compared from {date}, the day you gave (the list has the action marked done on {done}).').split('{date}')[0]) && new RegExp(shownDay(6)).test(notes(w)[0]) && new RegExp(shownDay(10)).test(notes(w)[0]), `${lang}: both days are named`);
    assert.equal(measured(w).dataset.sourceMeasured, 'rate');
    // The day stays with the view: the same tab, opened again, compares from it. The list is as it was.
    const again = open('damage-control', { lang, storage: keep(w), now: at(18), search: `?source=${done.id}`, before: (next) => next.sessionStorage.setItem('sc-source-day', w.sessionStorage.getItem('sc-source-day')) });
    assert.equal(compareBox(again).dataset.sourceImplemented, iso(6), `${lang}: kept for the tab`);
    assert.equal(w.localStorage.getItem('sc-actions'), listBefore, `${lang}: the list is not written`);
    assert.equal(actionsOf(w)[0].closed, iso(10), `${lang}: the day it was marked done is still that day`);
    assert.ok(Object.keys(actionsOf(w)[0]).every((name) => !/implement/i.test(name)), `${lang}: and the action has no new field`);
    // Another tab, or another device, is asked again.
    assert.ok($(open('damage-control', { lang, storage: keep(w), now: at(18), search: `?source=${done.id}` }), '[data-source-day]'), `${lang}: not kept anywhere that is shared`);
  }
});

test('"after" that has not had all its days is pending: the page says from which day it can be compared, and gives no change in the rate, also when today already has a volume', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    const done = await actionDone(lang, { doneOn: 10 });
    const full = { rows: [...week(lang), row(lang, 12, 2), row(lang, 17, 1)], volumes: [...volumes([3, 5, 9], 2000), ...volumes([11, 12, 13, 14, 15, 16, 17], 1000)] };
    // Three days in.
    const early = source(lang, done, { today: 13, log: full });
    assert.match(cells(early, 'after')[0], span(11, 13, 3));
    assert.equal(measured(early).dataset.sourceMeasured, 'pending', `${lang}: pending`);
    assert.equal($(early, '[data-source-period="after"] th').textContent, `${word(lang, 'After')} · ${word(lang, 'pending')}`);
    assert.deepEqual([cells(early, 'before')[3], cells(early, 'after')[3]], ['–', '–'], `${lang}: no rate is set beside another`);
    // The last day itself, the 17th, with its volume already written and an entry made: still running, still pending.
    const last = source(lang, done, { today: 17, log: full });
    assert.match(cells(last, 'after')[0], span(11, 17, 7), `${lang}: every day is there`);
    assert.equal(cells(last, 'after')[2].replace(/\D/g, ''), '7000', `${lang}: and every day has a volume, the 17th too`);
    assert.equal(measured(last).dataset.sourceMeasured, 'pending', `${lang}: the 17th is not over`);
    assert.equal(measured(last).textContent, word(lang, 'Pending: “after” is not complete, so no change in the rate is given yet.'));
    assert.deepEqual([cells(last, 'before')[3], cells(last, 'after')[3]], ['–', '–']);
    const said = notes(last).find((text) => new RegExp(shownDay(18)).test(text));
    assert.ok(said && new RegExp(shownDay(17)).test(said), `${lang}: it runs until the 17th and can be compared from the 18th`);
    // The day after: complete, and compared.
    const complete = source(lang, done, { today: 18, log: full });
    assert.equal(measured(complete).dataset.sourceMeasured, 'rate', `${lang}: compared once the last day is over`);
    assert.equal($(complete, '[data-source-period="after"] th').textContent, word(lang, 'After'));
    assert.deepEqual([cells(complete, 'before')[3], cells(complete, 'after')[3]].map((text) => text.replace(/\s/g, '').replace(',', '.')), ['0.23%', '0.04%']);
  }
});

test('the filter of the action is the filter of both periods; an action not marked done has nothing to compare from', { skip: !hasSite }, async () => {
  const f = fieldsOf('en');
  const rows = [...week('en'), row('en', 4, 5, { cause: f.cause.options[1] })];
  const done = await actionDone('en', { doneOn: 10, rows, pick: { field: 'cause', value: f.cause.options[0] } });
  const log = { rows: [...rows, row('en', 12, 2), row('en', 13, 8, { cause: f.cause.options[1] })], volumes: [...volumes([3, 4, 5, 9], 1000), ...volumes([12, 13], 2000)] };
  const w = source('en', done, { log });
  assert.deepEqual([cells(w, 'before')[1], cells(w, 'after')[1]], ['14', '2'], 'only the damage of that cause, against the whole volume');
  assert.deepEqual([cells(w, 'before')[2], cells(w, 'after')[2]], ['4,000', '4,000']);
  assert.equal(measured(w).dataset.sourceMeasured, 'rate');
  // Not done: no comparison, and no date is made up.
  const open1 = await actionDone('en', {});
  const waiting = source('en', open1, { log: { rows: week('en') } });
  assert.equal(compareBox(waiting), null);
  assert.equal($(waiting, '[data-source-day]'), null, 'and no day is asked for');
  assert.ok($$(waiting, '[data-source-note] p').some((node) => node.textContent === 'The action is not marked done on the list, so there is no day to compare from.'));
  assert.ok(!$(open1.tracker, '.at-source').textContent.includes('with before and after'));
});

test('the arithmetic by itself: periods, the day left out, and when a rate may be compared', { skip: !hasSite }, () => {
  const w = open('damage-control', { storage: device('en', []), now: at(18) });
  const origin = { kind: 'period', from: iso(3), to: iso(9) };
  const rows = [{ date: iso(3), units: 4 }, { date: iso(10), units: 50 }, { date: iso(12), units: 2 }];
  const plain = (value) => JSON.parse(JSON.stringify(value));
  const result = plain(w.DefectSource.compare(origin, iso(10), { rows, volumes: [{ date: iso(3), volume: 1000 }, { date: iso(12), volume: 500 }], today: iso(18) }));
  assert.deepEqual([result.before.from, result.before.to, result.after.from, result.after.to, result.cut, result.running, result.sameLength], [iso(3), iso(9), iso(11), iso(17), false, false, true]);
  assert.deepEqual([result.before.units, result.after.units, result.before.rate, result.after.rate, result.comparable], [4, 2, 0.004, 0.004, true]);
  assert.equal(result.change, 0);
  assert.equal(plain(w.DefectSource.compare(origin, iso(3), { rows, volumes: [], today: iso(18) })).reason, 'before-empty');
  assert.equal(plain(w.DefectSource.compare(origin, iso(10), { rows, volumes: [], today: iso(10) })).reason, 'after-not-started');
  const lastDay = plain(w.DefectSource.compare(origin, iso(10), { rows, volumes: [{ date: iso(3), volume: 1000 }, { date: iso(12), volume: 500 }], today: iso(17) }));
  assert.deepEqual([lastDay.running, lastDay.until, lastDay.fullFrom, lastDay.comparable, lastDay.change], [true, iso(17), iso(18), false, null]);
  const typed = plain(w.DefectSource.compare(origin, iso(10), { rows, volumes: [{ date: iso(12), volume: 500 }], typed: { value: 1000, from: iso(3), to: iso(9) }, today: iso(18) }));
  assert.deepEqual([typed.before.volume.rule, typed.after.volume.rule, typed.comparable, typed.change], ['typed', 'days', false, null]);
});
