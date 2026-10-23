// The Night Audit Log: the hotel log on the same partial and script as Damage Control (src/_data/nightAudit.json
// in the three languages), its place on the Shift Lead planet, in the backup file and in the handover's
// "Fill in from the logs" (No-shows of the hotel template).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const data = { en: read('src/_data/nightAudit.json'), de: read('src/_data/de/nightAudit.json'), sq: read('src/_data/sq/nightAudit.json') };
const hasSite = fs.existsSync('_site/tools/night-audit/index.html');

test('the three languages share one shape: fields, options, advice, checklist and example', () => {
  for (const [lang, cfg] of Object.entries(data)) {
    assert.equal(cfg.storageKey, `sc-night-audit${lang === 'en' ? '' : `-${lang}`}`);
    assert.equal(cfg.paretoTemplate, 'billing-errors');
    assert.deepEqual(cfg.fields.map((f) => f.name), ['shift', 'stage', 'type', 'cause'], lang);
    const field = Object.fromEntries(cfg.fields.map((f) => [f.name, f.options]));
    assert.deepEqual(Object.keys(cfg.stages), field.stage, `${lang}: every stage has its advice`);
    assert.deepEqual(Object.keys(cfg.causes), field.cause, `${lang}: every cause has its line`);
    for (const stage of Object.values(cfg.stages)) { assert.equal(stage.moves.length, 3); assert.ok(stage.meaning && stage.question); }
    assert.equal(cfg.checklist.length, 10, lang);
    assert.equal(cfg.text.tips.length, 3, lang);
    assert.ok(cfg.text.complement.label && cfg.text.complement.note, lang);
    // The shifts are the handover's, so a handover finds the rows of its own shift; the unknown cause is named.
    const handover = read(`src/_data/${lang === 'en' ? '' : `${lang}/`}shiftHandover.json`);
    assert.deepEqual(field.shift, handover.shifts, lang);
    assert.equal(field.cause.at(-1), cfg.unknownCause || 'Unknown', lang);
    assert.ok(field.type.some((type) => /no[- ]?show/i.test(type)), `${lang}: a no-show type for the handover`);
    // The example: every row names known options, every day with entries has a volume, and the rates add up.
    const counts = {};
    for (const row of cfg.example.rows) {
      const [date, shift, stage, type, cause, units] = row.split('|');
      assert.match(date, /^2026-09-\d{2}$/);
      for (const [name, value] of [['shift', shift], ['stage', stage], ['type', type], ['cause', cause]]) assert.ok(field[name].includes(value), `${lang}: ${name} ${value}`);
      counts[date] = (counts[date] || 0) + Number(units);
    }
    const volumes = Object.fromEntries(cfg.example.volumes.map((row) => row.split('|')));
    assert.deepEqual(Object.keys(counts).sort(), Object.keys(volumes).sort(), lang);
    assert.equal(Object.values(volumes).reduce((sum, v) => sum + Number(v), 0), cfg.example.volume, lang);
    assert.equal(Object.values(counts).reduce((sum, v) => sum + v, 0), 46, lang);
  }
  assert.deepEqual(data.de.example.rows.map((row) => row.split('|').slice(5).join('|')), data.en.example.rows.map((row) => row.split('|').slice(5).join('|')), 'the German example has the English counts');
  assert.deepEqual(data.sq.example.rows.map((row) => row.split('|').slice(5).join('|')), data.en.example.rows.map((row) => row.split('|').slice(5).join('|')), 'the Albanian example has the English counts');
});

test('the tool is on the Shift Lead planet, in the backup, in the previews and in the handover', () => {
  const families = read('src/_data/families.json');
  const pulse = families.find((family) => family.id === 'pulse');
  assert.ok(pulse.tools.includes('/tools/night-audit/'));
  assert.ok(pulse.routine.some((step) => step.tool === '/tools/night-audit/'));
  for (const lang of ['en', 'de', 'sq']) {
    const tools = read(lang === 'en' ? 'src/_data/tools.json' : `src/_data/${lang}/tools.json`);
    const card = tools.find((tool) => tool.url.endsWith('/tools/night-audit/'));
    assert.ok(card && card.type === 'Hotel', lang);
    assert.ok(fs.existsSync(`src/media/tools/${lang}/night-audit.jpg`) && fs.existsSync(`src/media/social/${lang}/night-audit.jpg`), lang);
  }
  const backup = fs.readFileSync('src/js/work-backup.js', 'utf8');
  assert.match(backup, /const OBJECT = \/\^sc-\([^)]*night-audit[^)]*\)/);
  assert.match(backup, /const LOG = \/\^sc-\([^)]*night-audit[^)]*\)/);
  assert.match(fs.readFileSync('scripts/tool-previews.mjs', 'utf8'), /"night-audit": \{ act:/);
  for (const file of ['src/_data/shiftHandover.json', 'src/_data/de/shiftHandover.json', 'src/_data/sq/shiftHandover.json']) {
    const hotel = read(file).templates.hotel;
    assert.deepEqual(hotel.sources, [null, null, null, null, 'noShows', null], file);
    assert.match(hotel.metrics[4], /no[- ]?show/i, file);
  }
});

const page = (path, files, setup) => {
  const html = fs.readFileSync(`_site${path}index.html`, 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const { window } = new JSDOM(html, { url: `https://example.test${path}`, runScripts: 'outside-only', pretendToBeVisual: true });
  window.confirm = () => true;
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  setup?.(window);
  for (const file of files) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return window;
};

test('a first visit opens on the example week, with the hotel Pareto template and the no-show handed to the handover', { skip: !hasSite }, () => {
  const window = page('/tools/night-audit/', ['tool-kit', 'defect-log']);
  const { document } = window;
  assert.match(document.querySelector('[data-results] h2').textContent, /Exception rate\s*3\.65%/);
  assert.match(document.querySelector('[data-results]').textContent, /Clean reservations/);
  assert.match(document.querySelector('[data-results] .dl-focus').textContent, /Arrival/);
  assert.equal(window.localStorage.getItem('sc-night-audit'), null, 'the example is shown, not saved');
  const paretoLink = [...document.querySelectorAll('[data-results] a')].find((a) => /Pareto/.test(a.textContent));
  paretoLink.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  const handoff = JSON.parse(window.sessionStorage.getItem('sc-pareto-handoff'));
  assert.equal(handoff.template, 'billing-errors');
  assert.equal(handoff.source, 'Night Audit Log');
  assert.equal(handoff.rows.length, 28);

  // The hotel handover of the same night fills its No-shows from this log.
  const DAY = '2026-09-18';
  const handover = page('/tools/shift-handover/', ['tool-kit', 'shift-handover'], (w) => {
    w.localStorage.setItem('sc-night-audit', JSON.stringify({ rows: [
      { date: DAY, shift: 'Night', stage: 'Arrival', type: 'No-show', cause: 'No guarantee', units: 5, note: '' },
      { date: DAY, shift: 'Night', stage: 'Payment', type: 'Card declined', cause: 'No guarantee', units: 2, note: '' },
      { date: DAY, shift: 'Late', stage: 'Arrival', type: 'No-show', cause: 'Guest', units: 1, note: '' },
    ], volumes: [] }));
  });
  const form = handover.document.querySelector('[data-handover]');
  const set = (selector, value) => {
    const node = form.querySelector(selector);
    node.value = value;
    for (const type of ['input', 'change']) node.dispatchEvent(new handover.Event(type, { bubbles: true }));
  };
  set('[name=template]', 'hotel');
  set('[name=date]', DAY);
  set('[name=shift]', 'Night');
  form.querySelector('[data-fill-logs]').dispatchEvent(new handover.Event('click', { bubbles: true }));
  const rows = Object.fromEntries([...form.querySelectorAll('[data-metrics] > *')].map((row) => {
    const [name, value, note] = [...row.querySelectorAll('input')].map((input) => input.value);
    return [name, [value, note]];
  }));
  assert.deepEqual(rows['No-shows'], ['5', 'Night Audit Log · from the log'], 'the no-shows of this night, not the card or the late shift');
  assert.match(form.querySelector('[data-fill-status]').textContent, /Filled 1 number from the logs/);
});

test('the texts of the tool are translated in both languages', () => {
  for (const lang of ['de', 'sq']) {
    const ui = read(`src/_data/${lang}/ui.json`);
    for (const text of ['Night Audit Log', 'Every night', 'In a hotel, log every exception the night audit finds, with its stage and cause, before the audit closes.']) assert.ok(ui[text], `${lang}: ${text}`);
  }
});
