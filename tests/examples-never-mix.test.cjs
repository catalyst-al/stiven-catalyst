// A tool's example is there to show what the tool does. It must never become the visitor's data: not when one of its
// rows is removed and an own entry added (audit finding T-01), not when the period buttons are pressed on a first visit
// (T-02), not in the tools that read other tools' logs (Shift Pulse, Ops Report, Signals, Cost of Quality, T-02), not
// in the shared action list (T-03) and not as a workplace profile with targets nobody set (T-04). Every case runs the
// tools' real pages (tests/helpers/tool-page.cjs).
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool, keep, click, submit, settle } = require('./helpers/tool-page.cjs');

const NOW = '2026-10-25T11:00:00Z';
const SUFFIX = { en: '', de: '-de', sq: '-sq' };
const exampleShown = (w) => {
  const note = w.document.querySelector('.dl-example-note');
  return Boolean(note && !note.hidden);
};

// One own damaged unit typed into Damage Control's form.
const addDamage = (w, units = 3) => {
  const form = w.document.querySelector('[data-entry]');
  form.elements.units.value = String(units);
  form.elements.note.value = 'own entry';
  submit(w, form);
};

for (const lang of ['en', 'de', 'sq']) {
  test(`Damage Control (${lang}): removing one example row and adding an own entry leaves only the own entry`, async () => {
    const w = openTool('damage-control', { lang, now: NOW });
    assert.ok(exampleShown(w), 'a first visit opens on the example');
    const exampleRows = w.document.querySelectorAll('[data-log] tr').length;
    assert.ok(exampleRows > 1);
    click(w, w.document.querySelector('[data-log] [data-remove]'));
    await settle(w);
    addDamage(w, 3);
    await settle(w);
    const log = keep(w)[`sc-damage-control${SUFFIX[lang]}`];
    assert.equal(log.rows.length, 1, `only the own entry is kept (found ${log.rows.length} rows)`);
    assert.equal(log.rows[0].units, 3);
    assert.equal(log.rows[0].note, 'own entry');
    assert.ok(!exampleShown(w), 'the example note is gone');
  });
}

test('Damage Control: pressing the period buttons on a first visit writes no example into the browser', async () => {
  const w = openTool('damage-control', { now: NOW });
  for (const preset of ['week', 'all', 'month']) {
    click(w, w.document.querySelector(`[data-range] [data-preset="${preset}"]`));
    await settle(w);
  }
  const saved = keep(w)['sc-damage-control'];
  const rows = saved?.rows ?? [];
  assert.ok(rows.every((row) => row.example === true), `no example row is stored as the visitor's own (${rows.length} rows stored)`);
});

// The logs opened on their examples and their period buttons pressed, as a visitor looking around would.
const LOGS = ['damage-control', 'incomplete-control', 'delay-analyzer', 'waste-log'];
const browseExamples = async ({ onPurpose = false } = {}) => {
  let storage = {};
  for (const slug of LOGS) {
    const w = openTool(slug, { storage, now: NOW });
    if (onPurpose) click(w, w.document.querySelector('[data-example]'));
    for (const preset of ['week', 'all']) {
      click(w, w.document.querySelector(`[data-range] [data-preset="${preset}"]`));
      await settle(w);
    }
    storage = keep(w);
  }
  return storage;
};
// What a reading tool shows, as text, once it has drawn.
const shown = async (slug, storage) => {
  const w = openTool(slug, { storage, now: NOW });
  await settle(w, 60);
  return (w.document.querySelector('[data-results]') || w.document.querySelector('main')).textContent.replace(/\s+/g, ' ').trim();
};
const READERS = ['shift-pulse', 'ops-report', 'signals'];

for (const onPurpose of [false, true]) {
  test(`the tools that read other logs show for stored examples exactly what they show for an empty browser (${onPurpose ? 'examples loaded on purpose' : 'examples left on a first visit'})`, async () => {
    const storage = await browseExamples({ onPurpose });
    for (const slug of READERS) {
      assert.equal(await shown(slug, storage), await shown(slug, {}), `${slug} reads no example as data`);
    }
    // Cost of Quality brings in nothing from an example Waste Log.
    const w = openTool('cost-of-quality', { storage, now: NOW });
    click(w, w.document.querySelector('[data-import]'));
    assert.match(w.document.querySelector('[data-status]').textContent, /Nothing to bring in/);
  });
}

test('an example loaded on purpose is kept in the browser, and every stored row of it says it is an example', async () => {
  const w = openTool('damage-control', { now: NOW });
  click(w, w.document.querySelector('[data-example]'));
  await settle(w);
  const rows = keep(w)['sc-damage-control'].rows;
  assert.ok(rows.length > 1, 'loaded on purpose, the example is kept (tests/browser expects this)');
  assert.ok(rows.every((row) => row.example === true), 'every stored example row says it is one');
});

// A log saved before 27 October 2026: its example carries only its shape ({ n, first, last }) and no row says it is an
// example. While it keeps that shape it is still read as the example, and marked on the next save.
test('an example saved in the old format is still recognised, by the page and by the readers', async () => {
  const fresh = openTool('damage-control', { now: NOW });
  click(fresh, fresh.document.querySelector('[data-example]'));
  await settle(fresh);
  const saved = keep(fresh)['sc-damage-control'];
  const old = { ...saved, rows: saved.rows.map(({ example, ...row }) => row), example: { n: saved.example.n, first: saved.example.first, last: saved.example.last } };
  assert.ok(old.rows.every((row) => !('example' in row)));
  const storage = { 'sc-damage-control': old };
  assert.equal(await shown('shift-pulse', storage), await shown('shift-pulse', {}), 'Shift Pulse leaves the old example out');
  const w = openTool('damage-control', { storage, now: NOW });
  assert.ok(exampleShown(w), 'the page still shows it as the example');
  click(w, w.document.querySelector('[data-log] [data-remove]'));
  await settle(w);
  addDamage(w, 2);
  await settle(w);
  const rows = keep(w)['sc-damage-control'].rows;
  assert.deepEqual(rows.map((row) => row.units), [2], 'removing one of its rows and adding an own entry leaves only the own entry');
});

test('a log whose own rows were added under the old rule stays the visitor\'s: nothing of it is dropped', async () => {
  const own = { rows: [{ date: '2026-10-20', shift: 'Early', stage: 'Loading', type: 'Crushed', cause: 'Handling', units: 4, cost: null, note: 'mine' }], example: {}, period: '', volume: '', target: '', volumes: [] };
  const storage = { 'sc-damage-control': own };
  const w = openTool('damage-control', { storage, now: NOW });
  assert.ok(!exampleShown(w));
  addDamage(w, 1);
  await settle(w);
  assert.deepEqual(keep(w)['sc-damage-control'].rows.map((row) => row.units), [4, 1]);
});

test('an own volume typed while the example is shown is kept: the example leaves first, the volume stays', async () => {
  const w = openTool('damage-control', { now: NOW });
  const form = w.document.querySelector('[data-volume-form]');
  form.elements.vdate.value = '2026-10-24';
  form.elements.vvolume.value = '1200';
  submit(w, form);
  await settle(w);
  addDamage(w, 2);
  await settle(w);
  const log = keep(w)['sc-damage-control'];
  assert.deepEqual(log.volumes, [{ date: '2026-10-24', volume: 1200 }], 'only the own volume');
  assert.deepEqual(log.rows.map((row) => row.units), [2]);
  assert.ok(!log.rows.some((row) => row.example));
});

// Damage Control with one own day: 4 damaged units of 1,000 on 24 October (0.40 %), typed into its real forms.
const ownDamageDay = async (storage = {}) => {
  const w = openTool('damage-control', { storage, now: NOW });
  const volume = w.document.querySelector('[data-volume-form]');
  volume.elements.vdate.value = '2026-10-24';
  volume.elements.vvolume.value = '1000';
  submit(w, volume);
  const form = w.document.querySelector('[data-entry]');
  form.elements.date.value = '2026-10-24';
  form.elements.units.value = '4';
  submit(w, form);
  await settle(w);
  return keep(w);
};

test('the Daily Board example writes no workplace profile: other tools never get its targets', async () => {
  const board = openTool('daily-board', { now: NOW });
  await settle(board);
  const storage = keep(board);
  const profile = storage['sc-workplace'];
  assert.ok(!profile || (!profile.site && !Object.keys(profile.targets || {}).length), `no demo profile stored (${JSON.stringify(profile)})`);
});

test('the Daily Board judges a day only against targets the visitor set', async () => {
  const storage = await ownDamageDay();
  const board = openTool('daily-board', { storage, now: NOW });
  await settle(board, 60);
  const text = board.document.querySelector('[data-results]').textContent;
  assert.match(text, /4 damaged units/, 'the board shows the own day, not its example');
  assert.doesNotMatch(text, /target 0[.,]30/, 'no hidden 0.30 % target');
  assert.doesNotMatch(text, /\(target/, 'no target the visitor did not set');
  // With a target set in the workplace profile, it is used.
  const withTarget = { ...storage, 'sc-workplace': { site: '', shifts: [], areas: [], teams: [], targets: { damage: 0.3 } } };
  const set = openTool('daily-board', { storage: withTarget, now: NOW });
  await settle(set, 60);
  assert.match(set.document.querySelector('[data-results]').textContent, /\(target 0[.,]30\s*%\)/);
});

test('a demo profile the old Daily Board left behind is removed when unchanged, and kept when the visitor changed it', async () => {
  const profile = JSON.parse(require('node:fs').readFileSync('src/_data/dailyBoard.json', 'utf8')).example.profile;
  const left = { 'sc-workplace': profile, 'sc-daily-board': { rows: [], example: {}, demoProfile: true } };
  const w = openTool('daily-board', { storage: left, now: NOW });
  await settle(w);
  const after = keep(w)['sc-workplace'];
  assert.ok(!after || !after.site, `the untouched demo profile is gone (${after?.site})`);
  const changed = { 'sc-workplace': { ...profile, targets: { ...profile.targets, damage: 0.2 } }, 'sc-daily-board': { rows: [], example: {}, demoProfile: true } };
  const v = openTool('daily-board', { storage: changed, now: NOW });
  await settle(v);
  assert.equal(keep(v)['sc-workplace'].targets.damage, 0.2, 'a profile the visitor changed stays');
});
