// Template packs (src/js/template-pack.js): the file format, what read() refuses and why, the size limit, and for each
// of the five tools that use it (5S Audit, Gemba Walk, Standard Work, Skills Matrix, FMEA) that a file saved from its
// example opens again in a fresh page with the same content.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { 'five-s-audit': 'fiveSAudit', 'gemba-walk': 'gembaWalk', 'standard-work': 'standardWork', 'skills-matrix': 'skillsMatrix', fmea: 'fmea' };
const KEYS = { 'five-s-audit': 'sc-five-s-audit', 'gemba-walk': 'sc-gemba-walk', 'standard-work': 'sc-standard-work', 'skills-matrix': 'sc-skills-matrix', fmea: 'sc-fmea' };
const dataOf = (slug, lang = 'en') => read(`src/_data/${lang === 'en' ? '' : `${lang}/`}${DATA[slug]}.json`);
const keyOf = (slug, lang = 'en') => (lang === 'en' ? KEYS[slug] : `${KEYS[slug]}-${lang}`);

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));

// A tool's page in jsdom, the way its own test loads it, with template-pack.js before the tool's script. Downloads
// are caught in w.files instead of being saved.
const load = (slug, { lang = 'en', page = true, storage = {}, now = '2026-10-23T10:00:00Z' } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const body = page ? env.render(`partials/${slug}.njk`, { cfg: dataOf(slug, lang), lang: lang === 'en' ? undefined : lang }).replace(/<script src=[^>]*><\/script>/g, '') : '';
  const dom = new JSDOM(`<html lang="${lang}"><body><main id="main">${body}</main></body></html>`, { url: `https://example.test${base}/tools/${slug}/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.TextEncoder = TextEncoder;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  const scripts = ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'docx-kit', 'template-pack'];
  for (const file of page ? [...scripts, slug] : scripts) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  w.files = [];
  w.TemplatePack.download = (packed) => w.files.push(packed);
  return w;
};
const saved = (w, slug, lang = 'en') => JSON.parse(w.localStorage.getItem(keyOf(slug, lang)));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const type = (w, node, value) => { node.value = value; node.dispatchEvent(new w.Event('input', { bubbles: true })); };
// Chooses a file for an <input type=file> and waits for the FileReader: until the page has written what it read, or
// said something, up to three seconds. (A fixed 30 ms wait failed now and then when the whole suite ran at once.)
const snapshot = (w) => JSON.stringify(Object.entries({ ...w.localStorage })) + w.document.body.textContent.length;
const openFile = async (w, input, text, name = 'pack.json') => {
  const before = snapshot(w);
  Object.defineProperty(input, 'files', { value: [new w.File([text], name, { type: 'application/json' })], configurable: true });
  input.dispatchEvent(new w.Event('change', { bubbles: true }));
  for (let waited = 0; waited < 3000 && snapshot(w) === before; waited += 10) await new Promise((resolve) => setTimeout(resolve, 10));
  await new Promise((resolve) => setTimeout(resolve, 20));
};
const lastFile = (w) => {
  assert.ok(w.files.length, 'a file was downloaded');
  return JSON.parse(w.files.at(-1).text);
};

test('pack and read: the file format, the name of the file and a round trip', () => {
  const w = load('five-s-audit', { page: false });
  const P = w.TemplatePack;
  const packed = P.pack({ tool: 'five-s-audit', kind: 'five-s-questions', name: 'Lager Süd: Wareneingang', lang: 'de', data: { questions: { sort: ['Nur, was heute gebraucht wird.'] } } });
  assert.equal(packed.fileName, 'five-s-audit-lager-sud-wareneingang.json');
  const file = JSON.parse(packed.text);
  assert.deepEqual(Object.keys(file), ['format', 'version', 'tool', 'kind', 'name', 'lang', 'created', 'data']);
  assert.equal(file.format, 'stiven-catalyst-template');
  assert.equal(file.version, 1);
  assert.equal(file.lang, 'de');
  assert.match(file.created, /^\d{4}-\d{2}-\d{2}T/);
  const back = P.read(packed.text, { tool: 'five-s-audit', kind: 'five-s-questions' });
  assert.equal(back.ok, true);
  assert.deepEqual(plain(back.data), { questions: { sort: ['Nur, was heute gebraucht wird.'] } });
  assert.equal(back.name, 'Lager Süd: Wareneingang');
  // validate() cleans on the way in; what it returns is the data.
  const cleaned = P.read(packed.text, { tool: 'five-s-audit', kind: 'five-s-questions', validate: (data) => ({ n: data.questions.sort.length }) });
  assert.deepEqual(plain(cleaned.data), { n: 1 });
  assert.equal(P.fileNameOf('fmea', '', 'fmea-sheet'), 'fmea-fmea-sheet.json', 'no name: the kind');
  // A byte order mark from an editor does not break the file.
  assert.equal(P.read(`﻿${packed.text}`, { tool: 'five-s-audit' }).ok, true);
});

test('read refuses another tool, another kind, a damaged, a foreign, a newer and an empty file, each with its reason', () => {
  const w = load('five-s-audit', { page: false });
  const P = w.TemplatePack;
  const text = P.pack({ tool: 'gemba-walk', kind: 'lpa-questions', name: 'LPA', data: { questions: {} } }).text;
  const wrongTool = P.read(text, { tool: 'five-s-audit', kind: 'five-s-questions' });
  assert.equal(wrongTool.ok, false);
  assert.equal(wrongTool.error, 'tool');
  assert.match(wrongTool.message, /another tool \(gemba-walk\)/);
  assert.equal(P.read(text, { tool: 'gemba-walk', kind: 'something-else' }).error, 'kind');
  assert.equal(P.read(text.slice(0, -20), { tool: 'gemba-walk' }).error, 'damaged', 'cut off');
  assert.equal(P.read('', { tool: 'gemba-walk' }).error, 'damaged');
  assert.equal(P.read('{"rows":[]}', { tool: 'gemba-walk' }).error, 'format', 'plain JSON is not a pack');
  assert.equal(P.read('[1,2]', { tool: 'gemba-walk' }).error, 'format');
  assert.equal(P.read(text.replace('"version": 1', '"version": 2'), { tool: 'gemba-walk' }).error, 'version');
  assert.equal(P.read(text.replace('"version": 1', '"version": "1"'), { tool: 'gemba-walk' }).error, 'damaged');
  assert.equal(P.read(text, { tool: 'gemba-walk', validate: () => null }).error, 'content');
  assert.equal(P.read(text, { tool: 'gemba-walk', validate: () => { throw new Error('bad'); } }).error, 'content', 'a throwing validate is a refusal');
  for (const result of [wrongTool, P.read('', {})]) assert.ok(result.message.length > 20, 'a sentence, not a code');
  // An older file without the pack around it opens only through legacy().
  const legacy = P.read('{"tool":"fmea","rows":[1]}', { tool: 'fmea', legacy: (raw) => (Array.isArray(raw.rows) ? raw : null) });
  assert.equal(legacy.ok, true);
  assert.equal(legacy.legacy, true);
});

test('a file over 2 MB is refused, as text and as a chosen file, before it is read', async () => {
  const w = load('five-s-audit', { page: false });
  const P = w.TemplatePack;
  assert.equal(P.MAX_BYTES, 2 * 1024 * 1024);
  const big = P.pack({ tool: 'five-s-audit', kind: 'five-s-questions', name: 'big', data: { pad: 'x'.repeat(P.MAX_BYTES) } }).text;
  assert.equal(P.read(big, { tool: 'five-s-audit' }).error, 'large');
  // Umlauts count as two bytes: just under the limit in characters is over it in bytes.
  assert.equal(P.read(`"${'ü'.repeat(P.MAX_BYTES / 2 + 10)}"`, { tool: 'five-s-audit' }).error, 'large');
  const result = await new Promise((resolve) => P.readFile(new w.File([big], 'big.json'), { tool: 'five-s-audit' }, resolve));
  assert.equal(result.error, 'large');
  assert.match(result.message, /2 MB/);
});

test('5S Audit: the example checklist as a file opens again as an own template with the same questions', async () => {
  const cfg = dataOf('five-s-audit');
  const w = load('five-s-audit');
  const host = w.document.querySelector('[data-template-pack]');
  assert.ok(host.querySelector('[data-pack-save]') && host.querySelector('[data-pack-choose]') && host.querySelector('[data-pack-copy]'));
  assert.ok(host.querySelector('[data-pack-editor]').hidden, 'no editor for a built-in template');
  click(w, host.querySelector('[data-pack-save]'));
  const file = lastFile(w);
  assert.equal(w.files.at(-1).fileName, 'five-s-audit-warehouse.json');
  assert.deepEqual([file.tool, file.kind, file.lang, file.name], ['five-s-audit', 'five-s-questions', 'en', cfg.templates[cfg.example.template].name]);
  assert.deepEqual(file.data.questions, cfg.templates[cfg.example.template].questions);

  // Another site (here the German page, nothing saved) opens it: an own template, chosen, its questions on the walk.
  const other = load('five-s-audit', { lang: 'de' });
  const otherHost = other.document.querySelector('[data-template-pack]');
  await openFile(other, otherHost.querySelector('[data-pack-open]'), w.files.at(-1).text);
  const state = saved(other, 'five-s-audit', 'de');
  const [key] = Object.keys(state.custom);
  assert.match(key, /^custom-/);
  assert.equal(state.template, key);
  assert.deepEqual(state.custom[key].questions, cfg.templates[cfg.example.template].questions);
  assert.equal(other.document.querySelector('#fs-template').value, key);
  assert.equal(other.document.querySelector('#fs-template option[data-own]').textContent, file.name);
  assert.equal(other.document.querySelector('[data-pillar="sort"] .fs-q-text').textContent, `1${cfg.templates[cfg.example.template].questions.sort[0]}`);
  assert.match(otherHost.querySelector('[data-pack-status]').textContent, /Opened/);
  // A Gemba Walk file is refused with its reason, and nothing changes.
  const gemba = other.TemplatePack.pack({ tool: 'gemba-walk', kind: 'lpa-questions', name: 'x', data: {} }).text;
  await openFile(other, otherHost.querySelector('[data-pack-open]'), gemba);
  assert.match(otherHost.querySelector('[data-pack-status]').textContent, /another tool/);
  assert.equal(Object.keys(saved(other, 'five-s-audit', 'de').custom).length, 1);
});

test('5S Audit: copy a template, then edit, add, reorder and remove its questions; a used template stays', () => {
  const cfg = dataOf('five-s-audit');
  const w = load('five-s-audit');
  const doc = w.document;
  const host = doc.querySelector('[data-template-pack]');
  click(w, host.querySelector('[data-pack-copy]'));
  let state = saved(w, 'five-s-audit');
  const key = state.template;
  assert.match(key, /^custom-/);
  assert.match(state.custom[key].name, /own copy/);
  assert.deepEqual(state.custom[key].questions, cfg.templates.warehouse.questions);
  const editor = host.querySelector('[data-pack-editor]');
  assert.ok(!editor.hidden && editor.open, 'the editor opens on the copy');
  assert.equal(editor.querySelectorAll('fieldset').length, cfg.scopes[cfg.example.scope].length, 'one group per S of the scope');

  type(w, editor.querySelector('input[data-name]'), 'Hall 3');
  assert.equal(doc.querySelector('#fs-template option[data-own]').textContent, 'Hall 3');
  type(w, editor.querySelector('input[data-group="sort"][data-index="0"]'), 'Nothing parked in the aisle.');
  state = saved(w, 'five-s-audit');
  assert.equal(state.custom[key].name, 'Hall 3');
  assert.equal(state.custom[key].questions.sort[0], 'Nothing parked in the aisle.');
  assert.match(doc.querySelector('[data-pillar="sort"] .fs-q-text').textContent, /Nothing parked in the aisle\./, 'the walk asks the edited question');

  const n = cfg.templates.warehouse.questions.sort.length;
  click(w, editor.querySelector('[data-add="sort"]'));
  assert.equal(doc.activeElement, editor.querySelector(`input[data-group="sort"][data-index="${n}"]`), 'the new question has the focus');
  type(w, doc.activeElement, 'Pallet wrap goes in the blue bin.');
  click(w, editor.querySelector('[data-move="up"][data-group="sort"][data-index="1"]'));
  click(w, editor.querySelector('[data-move="remove"][data-group="sort"][data-index="2"]'));
  state = saved(w, 'five-s-audit');
  assert.deepEqual(state.custom[key].questions.sort, [cfg.templates.warehouse.questions.sort[1], 'Nothing parked in the aisle.', ...cfg.templates.warehouse.questions.sort.slice(3), 'Pallet wrap goes in the blue bin.']);
  assert.equal(doc.querySelectorAll('[data-pillar="sort"] .fs-q').length, n);

  // Saving an audit on the own template keeps it: delete is refused while an audit uses it.
  doc.querySelector('[data-pillar="sort"] input[type=radio][value="3"]').checked = true;
  doc.querySelector('[data-pillar="sort"] input[type=radio][value="3"]').dispatchEvent(new w.Event('change', { bubbles: true }));
  click(w, doc.querySelector('[data-save]'));
  click(w, editor.querySelector('[data-delete-template]'));
  assert.ok(saved(w, 'five-s-audit').custom[key], 'still there');
  assert.match(host.querySelector('[data-pack-status]').textContent, /stays/);

  // A reload keeps the own template, chosen, and the audit made with it.
  const stored = saved(w, 'five-s-audit');
  assert.equal(stored.rows.at(-1).template, key);
  const again = load('five-s-audit', { storage: { 'sc-five-s-audit': stored } });
  assert.equal(again.document.querySelector('#fs-template').value, key);
  assert.equal(again.document.querySelector('#fs-template option[data-own]').textContent, 'Hall 3');
});

test('Gemba Walk: the example LPA questions as a file open again with the same questions per layer', async () => {
  const cfg = dataOf('gemba-walk');
  const w = load('gemba-walk');
  click(w, w.document.querySelector('[data-template-pack] [data-pack-save]'));
  const file = lastFile(w);
  assert.deepEqual([file.tool, file.kind], ['gemba-walk', 'lpa-questions']);
  const questions = cfg.templates[cfg.example.template].questions;
  assert.deepEqual(file.data.questions, questions);

  const other = load('gemba-walk', { lang: 'sq' });
  const host = other.document.querySelector('[data-template-pack]');
  await openFile(other, host.querySelector('[data-pack-open]'), w.files.at(-1).text);
  const state = saved(other, 'gemba-walk', 'sq');
  const key = state.template;
  assert.match(key, /^custom-/);
  assert.deepEqual(state.custom[key].questions, questions);
  assert.equal(other.document.querySelectorAll('[data-questions] .gw-q').length, questions[state.draft.layer].length);

  // The editor shows text and standard of each question, per layer; an edit reaches the walk.
  const editor = host.querySelector('[data-pack-editor]');
  assert.equal(editor.querySelectorAll('fieldset').length, cfg.layers.length);
  type(other, editor.querySelector(`input[data-group="${state.draft.layer}"][data-index="0"][data-field="standard"]`), 'S3 shoes at the gate.');
  const after = saved(other, 'gemba-walk', 'sq').custom[key].questions[state.draft.layer][0];
  assert.deepEqual(after, { ...questions[state.draft.layer][0], standard: 'S3 shoes at the gate.' }, 'text and topic stay');
  assert.match(other.document.querySelector('[data-questions] .gw-q-standard').textContent, /S3 shoes at the gate\./);
});

test('Standard Work: the example standard as a file opens as a new standard with its version history', async () => {
  const w = load('standard-work');
  const first = saved(w, 'standard-work');
  const example = first.docs.find((d) => d.id === first.example);
  click(w, w.document.querySelector('[data-template-pack] [data-pack-save]'));
  const file = lastFile(w);
  assert.deepEqual([file.tool, file.kind], ['standard-work', 'standard']);
  assert.equal(file.data.id, undefined, 'the id stays here');
  const { id, ...content } = example;
  assert.deepEqual(file.data, content);
  assert.ok(file.data.history.length > 0, 'the example has earlier versions');

  const other = load('standard-work', { lang: 'de' });
  const host = other.document.querySelector('[data-template-pack]');
  await openFile(other, host.querySelector('[data-pack-open]'), w.files.at(-1).text);
  const state = saved(other, 'standard-work', 'de');
  assert.equal(state.docs.length, 2, 'next to the German example');
  const opened = state.docs[0];
  assert.equal(state.current, opened.id);
  assert.notEqual(opened.id, id);
  const { id: newId, updated, ...openedContent } = opened;
  const { updated: oldUpdated, ...expected } = content;
  assert.deepEqual(openedContent, expected, 'steps, version and history as saved');
  assert.equal(other.document.querySelector('#sw-title').value, example.title);
  // A standard that is empty is nothing to save.
  const blank = load('standard-work', { storage: { 'sc-standard-work': { docs: [], current: '' } } });
  click(blank, blank.document.querySelector('[data-template-pack] [data-pack-save]'));
  assert.equal(blank.files.length, 0);
  assert.match(blank.document.querySelector('[data-template-pack] [data-pack-status]').textContent, /Nothing to save/);
});

test('Skills Matrix: the example task list as a file opens again with the same tasks and without any person', async () => {
  const cfg = dataOf('skills-matrix');
  const w = load('skills-matrix');
  click(w, w.document.querySelector('[data-template-pack] [data-pack-save]'));
  const file = lastFile(w);
  assert.deepEqual([file.tool, file.kind], ['skills-matrix', 'skills-tasks']);
  const tasks = cfg.templates[cfg.example.template].tasks.map(({ name, crit, min, target }) => ({ name, crit, min, target }));
  assert.deepEqual(file.data, { tasks });
  // Privacy: no name, role or level of a person travels in the file.
  const text = w.files.at(-1).text;
  for (const person of cfg.example.people) assert.ok(!text.includes(person.name), `${person.name} is not in the file`);
  assert.ok(!/"levels"|"people"|"plan"/.test(text));

  const other = load('skills-matrix', { lang: 'de' });
  const host = other.document.querySelector('[data-template-pack]');
  await openFile(other, host.querySelector('[data-pack-open]'), text);
  const state = saved(other, 'skills-matrix', 'de');
  assert.deepEqual(state.tasks.map(({ name, crit, min, target }) => ({ name, crit, min, target })), tasks);
  assert.equal(state.people.length, 0, 'the German example team left with the first own task list');
  assert.match(host.querySelector('[data-pack-status]').textContent, /tasks loaded from the file/);
});

test('FMEA: the sheet saves as a template file and opens again; the plain files of before still open', async () => {
  const w = load('fmea');
  click(w, w.document.querySelector('[data-json]'));
  const file = lastFile(w);
  assert.deepEqual([file.format, file.tool, file.kind], ['stiven-catalyst-template', 'fmea', 'fmea-sheet']);
  assert.match(w.files.at(-1).fileName, /^fmea-[a-z0-9-]+\.json$/);
  const sheet = plain(w.FmeaMath.fromExample(dataOf('fmea').example, '2026-10-23'));
  assert.equal(file.data.rows.length, sheet.rows.length);
  assert.deepEqual(file.data.rows.map(({ id, ...row }) => row), sheet.rows.map(({ id, ...row }) => row));

  const other = load('fmea', { lang: 'sq' });
  const input = other.document.querySelector('[data-open]');
  await openFile(other, input, w.files.at(-1).text);
  const state = saved(other, 'fmea', 'sq');
  assert.deepEqual(state.rows, file.data.rows, 'the same rows, ids and all');
  assert.deepEqual([state.process, state.owner, state.date, state.revision], [file.data.process, file.data.owner, file.data.date, file.data.revision]);
  assert.equal(state.example, false);

  // A file saved before template packs: { tool, version, ...sheet }.
  const old = load('fmea');
  await openFile(old, old.document.querySelector('[data-open]'), JSON.stringify({ tool: 'fmea', version: 1, process: 'Old sheet', rows: [{ step: 'Pick', mode: 'Wrong item', s: 7, o: 4, d: 6 }] }));
  assert.equal(saved(old, 'fmea').process, 'Old sheet');
  assert.equal(saved(old, 'fmea').rows.length, 1);
  // Another tool's file says so; a file that is not a sheet keeps the FMEA's own message.
  const status = old.document.querySelector('[data-file-status]');
  await openFile(old, old.document.querySelector('[data-open]'), old.TemplatePack.pack({ tool: 'five-s-audit', kind: 'five-s-questions', data: {} }).text);
  assert.match(status.textContent, /another tool \(five-s-audit\)/);
  await openFile(old, old.document.querySelector('[data-open]'), '{"hello":1}');
  assert.match(status.textContent, /not an FMEA sheet/);
  assert.equal(saved(old, 'fmea').process, 'Old sheet', 'refused files change nothing');
});

test('every text of template-pack.js has a German and an Albanian translation, placeholders kept', () => {
  const parts = read('src/_data/i18n-parts/template-pack.json');
  const ui = { de: read('src/_data/de/ui.json'), sq: read('src/_data/sq/ui.json') };
  const script = fs.readFileSync('src/js/template-pack.js', 'utf8');
  const texts = new Set();
  for (const match of script.matchAll(/\btx\(\s*(["'])((?:\\.|(?!\1).)+)\1/g)) texts.add(match[2]);
  for (const match of script.match(/const MESSAGES = \{([\s\S]*?)\};/)[1].matchAll(/: "([^"]+)"/g)) texts.add(match[1]);
  for (const file of ['five-s-audit', 'gemba-walk', 'standard-work', 'skills-matrix']) {
    for (const text of ['Own template', 'A new standard from the file: {text}', '{n} tasks loaded from the file.']) if (fs.readFileSync(`src/js/${file}.js`, 'utf8').includes(`"${text}"`)) texts.add(text);
  }
  assert.ok(texts.size > 20, `${texts.size} texts`);
  for (const lang of ['de', 'sq']) {
    for (const text of texts) assert.ok(parts[lang][text] || ui[lang][text], `${lang}: ${text}`);
    for (const [text, translation] of Object.entries(parts[lang])) {
      assert.ok(translation && translation !== text, `${lang}: "${text}" is not translated`);
      for (const name of text.match(/\{\w+\}/g) || []) assert.ok(translation.includes(name), `${lang}: "${text}" loses ${name}`);
    }
  }
  assert.deepEqual(Object.keys(parts.de).sort(), Object.keys(parts.sq).sort());
  assert.match(JSON.stringify(parts.sq), /[ëç]/);
});

test('each of the five partials loads template-pack.js after tool-kit.js and before its own script', () => {
  for (const slug of Object.keys(DATA)) {
    const partial = fs.readFileSync(`src/_includes/partials/${slug}.njk`, 'utf8');
    const kit = partial.indexOf('/js/tool-kit.js');
    const pack = partial.indexOf('/js/template-pack.js');
    const own = partial.indexOf(`/js/${slug}.js`);
    assert.ok(kit >= 0 && kit < pack && pack < own, slug);
  }
});
