// The shared floor features: the import that remembers the columns (src/js/import-map.js), Scan and photos
// (src/js/floor-capture.js) and the photo store's arithmetic (src/js/media-store.js), plus the small scripts that put
// photos on the Safety Cross log and the 5S walk.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const script = (name) => fs.readFileSync(`src/js/${name}.js`, 'utf8');
const wait = (w, ms = 200) => new Promise((resolve) => w.setTimeout(resolve, ms));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const type = (w, node, value) => { node.value = value; node.dispatchEvent(new w.Event('input', { bubbles: true })); };

// A bare page with the scripts of the kit: tool-kit.js, then the given ones.
const bare = (html = '', { lang = 'en', path = '/tools/safety-cross/', files = ['import-map'] } = {}) => {
  const dom = new JSDOM(`<html lang="${lang}"><body>${html}</body></html>`, { url: `https://example.test${path}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  for (const file of ['tool-kit', ...files]) w.eval(script(file));
  return w;
};

// The columns the Safety Cross declares, with its English labels.
const SAFETY = ['date', 'shift', 'type', 'area', 'what', 'cause', 'severity', 'action', 'owner', 'done'];
const SAFETY_LABELS = ['date', 'shift', 'type', 'area', 'what happened', 'cause', 'severity 1–4', 'action', 'owner', 'done (yes or no)'];
const columns = (keys, labels = keys) => keys.map((key, j) => ({ key, label: labels[j] }));

test('the columns are guessed from English, German and Albanian headers', () => {
  const { ImportMap } = bare();
  const cols = columns(SAFETY, SAFETY_LABELS);
  // A German export of the Safety Cross with the area first.
  const de = ['Bereich', 'Datum', 'Art', 'Schicht', 'Was passiert ist', 'Ursache', 'Schweregrad', 'Maßnahme', 'Verantwortlich', 'Erledigt'];
  assert.deepEqual(plain(ImportMap.guess(de, cols)), [1, 3, 2, 0, 4, 5, 6, 7, 8, 9]);
  // An Albanian sheet with fewer columns: what it lacks stays "none".
  const sq = ['Data', 'Zona', 'Lloji', 'Çfarë ndodhi', 'Përgjegjësi'];
  assert.deepEqual(plain(ImportMap.guess(sq, cols)), [0, -1, 2, 1, 3, -1, -1, -1, 4, -1]);
  // An English WMS export with its own words.
  const en = ['Incident', 'Location', 'Day', 'Category', 'Root cause', 'Responsible', 'Status'];
  assert.deepEqual(plain(ImportMap.guess(en, cols)), [2, -1, 3, 1, 0, 4, -1, -1, 5, 6]);
  // The Delay Analyzer's own download has twelve columns: the reason and the note sit at the end.
  const delay = ['date', 'shift', 'route', 'planDep', 'actDep', 'planArr', 'actArr', 'reason', 'note'];
  const report = ['Date', 'Shift', 'Route', 'Planned departure', 'Actual departure', 'Planned arrival', 'Actual arrival', 'Departure delay (min)', 'Arrival delay (min)', 'Late', 'Reason', 'Note'];
  assert.deepEqual(plain(ImportMap.guess(report, columns(delay))), [0, 1, 2, 3, 4, 5, 6, 10, 11]);
  // A German route list: "Ist" and "Soll" words, a "Tour".
  const tours = ['Tour', 'Datum', 'Ankunft Soll', 'Ankunft Ist', 'Abfahrt Soll', 'Abfahrt Ist', 'Verspätungsgrund'];
  assert.deepEqual(plain(ImportMap.guess(tours, columns(delay))), [1, -1, 0, 4, 5, 2, 3, 6, -1]);
  // The hotel's own download: "Out of order" and "Out of order %" both match; the count is the one nearer its place.
  const hotel = ['date', 'available', 'sold', 'roomRev', 'otherRev', 'arrivals', 'departures', 'noShows', 'walkIns', 'ooo', 'complaints', 'covers', 'complaintCause'];
  const pms = ['Date', 'Rooms available', 'Rooms sold', 'Occupancy %', 'Room revenue €', 'Other revenue €', 'ADR €', 'RevPAR €', 'TRevPAR €', 'Arrivals', 'Departures', 'No-shows', 'No-show rate %', 'Walk-ins', 'Out of order', 'Out of order %', 'Complaints', 'Complaints per 100 rooms sold', 'Complaint cause', 'Breakfast covers'];
  assert.deepEqual(plain(ImportMap.guess(pms, columns(hotel))), [0, 1, 2, 4, 5, 9, 10, 11, 13, 14, 16, 19, 18]);
  // Albanian hotel words, without their accents in the sheet.
  const sqHotel = ['Data', 'Dhoma te shitura', 'Mberritje', 'Largime', 'Ankesa', 'Mengjese'];
  assert.deepEqual(plain(ImportMap.guess(sqHotel, columns(hotel))), [0, -1, 1, -1, -1, 2, 3, -1, -1, -1, 4, 5, -1]);
});

test('a header is a row of words; a row with a date or numbers is data', () => {
  const { ImportMap } = bare();
  assert.equal(ImportMap.isHeader(['Datum', 'Schicht', 'Art']), true);
  assert.equal(ImportMap.isHeader(['2026-10-01', 'Früh', 'Beinahe-Unfall']), false);
  assert.equal(ImportMap.isHeader(['Packing', '3', 'Cage']), false);
  assert.equal(ImportMap.isHeader(['Date']), false, 'one word is not enough to tell');
  assert.equal(ImportMap.fold('Tatsächliche Ankunft'), 'tatsachliche ankunft');
  assert.equal(ImportMap.fold('Çfarë ndodhi?'), 'cfare ndodhi');
  assert.equal(ImportMap.fold('Room revenue €'), 'room revenue');
});

test('the rows are rewritten into the order of the log, the header dropped, cells with tabs or quotes kept whole', () => {
  const w = bare('', { files: ['import-map', 'chart-kit', 'workplace', 'actions-store', 'safety-cross'] });
  const { ImportMap, ToolKit, SafetyMath } = w;
  const text = 'Bereich;Datum;Art;Schicht;Was passiert ist\nDock 2;01.10.2026;near miss;Früh;"Forklift; reversing"\nGoods-in;02.10.2026;first aid;Spät;"Cut, ""small"""';
  const headers = ToolKit.parseRows(text)[0];
  const cols = columns(SAFETY, SAFETY_LABELS);
  const mapping = ImportMap.guess(headers, cols);
  const out = ImportMap.rewrite(text, mapping);
  assert.equal(out.split('\n').length, 2);
  assert.deepEqual(plain(ToolKit.parseRows(out)), [
    ['01.10.2026', 'Früh', 'near miss', 'Dock 2', 'Forklift; reversing', '', '', '', '', ''],
    ['02.10.2026', 'Spät', 'first aid', 'Goods-in', 'Cut, "small"', '', '', '', '', ''],
  ]);
  // The page's own import reads it as typed in its order.
  const cfg = read('src/_data/safetyCross.json');
  const { added, skipped } = plain(SafetyMath.importRows(out, cfg));
  assert.equal(skipped, 0);
  assert.deepEqual(added.map((row) => [row.date, row.type, row.area, row.what]), [
    ['2026-10-01', 'near-miss', 'Dock 2', 'Forklift; reversing'],
    ['2026-10-02', 'first-aid', 'Goods-in', 'Cut, "small"'],
  ]);
  // A tab inside a cell is quoted, so the columns do not shift.
  const tabbed = ImportMap.rewrite('Note\tDate\n"a\tb"\t2026-10-01', [1, 0]);
  assert.deepEqual(plain(ToolKit.parseRows(tabbed)), [['2026-10-01', 'a\tb']]);
});

// A paste box as the logs have it: the page's own import listens on the button and keeps what it read.
const pasteBox = (keys, labels) => `<details class="dl-box dl-paste" open><div class="field"><label for="p">Rows</label>
  <textarea id="p" data-columns='${JSON.stringify(keys)}' data-column-labels='${JSON.stringify(labels)}'></textarea></div>
  <div class="tool-actions"><button type="button" data-import>Import rows</button></div></details>`;
const withPage = (w) => {
  const got = [];
  const area = w.document.querySelector('#p');
  w.document.querySelector('[data-import]').addEventListener('click', () => { got.push(area.value); area.value = ''; });
  return { got, area, panel: w.document.querySelector('.fc-map'), note: w.document.querySelector('.fc-map-note') };
};

test('a pasted header in another order shows the mapping; the import gets the rows in order, and the choice is remembered', async () => {
  const w = bare(pasteBox(SAFETY, SAFETY_LABELS), { lang: 'de', path: '/de/tools/safety-cross/' });
  // jsdom is still "loading" here: the module sets up on DOMContentLoaded, as on a page that is still parsing.
  await wait(w, 10);
  const { got, area, panel, note } = withPage(w);
  const doc = w.document;
  const text = 'Bereich\tDatum\tArt\tSchicht\nDock 2\t01.10.2026\tnear miss\tFrüh';
  type(w, area, text);
  await wait(w);
  assert.equal(panel.hidden, false, 'the panel shows');
  assert.equal(note.hidden, true);
  const selects = [...panel.querySelectorAll('.fc-map-grid:not(.fc-map-preset) select')];
  assert.equal(selects.length, SAFETY.length, 'one choice per column of the log');
  assert.equal(doc.querySelector(`label[for="${selects[3].id}"]`).textContent, 'area');
  assert.deepEqual(selects.slice(0, 4).map((s) => s.value), ['1', '3', '2', '0']);
  assert.equal(selects[5].value, '-1');
  assert.equal(selects[3].selectedOptions[0].textContent, 'A · Bereich');
  // The visitor corrects one: the shift is not known in this sheet.
  selects[1].value = '-1';
  selects[1].dispatchEvent(new w.Event('change', { bubbles: true }));
  click(w, doc.querySelector('[data-import]'));
  assert.deepEqual(got, ['01.10.2026\t\tnear miss\tDock 2\t\t\t\t\t\t']);
  assert.equal(panel.hidden, true);
  const memory = JSON.parse(w.localStorage.getItem('sc-import-maps'));
  assert.deepEqual(memory, { 'safety-cross': { 'bereich|datum|art|schicht': [1, -1, 2, 0, -1, -1, -1, -1, -1, -1] } });

  // The next paste of the same export is mapped by itself, with a note to change it.
  type(w, area, 'Bereich\tDatum\tArt\tSchicht\nTor 4\t02.10.2026\tfirst aid\tSpät');
  await wait(w);
  assert.equal(note.hidden, false);
  assert.match(note.textContent, /^Mapped like last time · change$/);
  assert.equal(panel.hidden, true);
  click(w, note.querySelector('button'));
  assert.equal(panel.hidden, false, '"change" opens the choices');
  assert.equal(panel.querySelectorAll('.fc-map-grid:not(.fc-map-preset) select')[1].value, '-1', 'with the remembered choice');
  click(w, doc.querySelector('[data-import]'));
  assert.deepEqual(got[1], '02.10.2026\t\tfirst aid\tTor 4\t\t\t\t\t\t');
});

test('a paste that already fits is left alone: no header, or a header in the order of the log', async () => {
  const w = bare(pasteBox(SAFETY, SAFETY_LABELS));
  await wait(w, 10);
  const { got, area, panel, note } = withPage(w);
  const rows = '2026-10-01\tEarly\tnear miss\tDock 2\tForklift reversing';
  type(w, area, rows);
  await wait(w);
  assert.equal(panel.hidden, true);
  click(w, w.document.querySelector('[data-import]'));
  assert.equal(got[0], rows);
  // The tool's own download, in its own order.
  const own = 'Date\tShift\tType\tArea\tWhat happened\tCause\tSeverity\tAction\tOwner\tDone\n2026-10-01\tEarly\tnear miss\tDock 2\t\t\t2\t\t\tno';
  type(w, area, own);
  await wait(w);
  assert.equal(panel.hidden, true);
  assert.equal(note.hidden, true);
  click(w, w.document.querySelector('[data-import]'));
  assert.equal(got[1], own);
  // A header of names nobody knows: nothing to guess, nothing changed.
  const unknown = 'Foo\tBar\n2026-10-01\tx';
  type(w, area, unknown);
  await wait(w);
  click(w, w.document.querySelector('[data-import]'));
  assert.equal(got[2], unknown);
  assert.equal(w.localStorage.getItem('sc-import-maps'), null, 'nothing remembered');
});

test('the partials declare their columns with a label for each, in every language', () => {
  const pages = {
    'defect-log': ['damageControl', 'dl-paste'], 'delay-analyzer': ['delayAnalyzer', 'da-paste'], 'safety-cross': ['safetyCross', 'sx-paste'],
    oee: ['oee', 'oe-paste'], 'hotel-kpis': ['hotelKpis', 'hk-paste'],
  };
  for (const [partial, [dataName, id]] of Object.entries(pages)) {
    for (const lang of ['en', 'de', 'sq']) {
      const ui = lang === 'en' ? {} : read(`src/_data/${lang}/ui.json`);
      const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: true });
      env.addFilter('t', (text) => ui[text] ?? text);
      env.addFilter('lc', (text) => (lang === 'de' ? String(text) : String(text).toLowerCase()));
      env.addFilter('local', (url) => url);
      env.addFilter('assetUrl', (url) => url);
      env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
      env.addFilter('inLang', (value) => value);
      const cfg = read(`src/_data/${lang === 'en' ? '' : `${lang}/`}${dataName}.json`);
      const html = env.render(`partials/${partial}.njk`, { cfg, lang: lang === 'en' ? undefined : lang });
      const { document } = new JSDOM(html).window;
      const area = document.getElementById(id);
      const keys = JSON.parse(area.dataset.columns);
      const labels = JSON.parse(area.dataset.columnLabels);
      assert.ok(keys.length >= 8, `${partial} ${lang}`);
      assert.equal(labels.length, keys.length, `${partial} ${lang}: a label per column`);
      assert.ok(labels.every((label) => typeof label === 'string' && label.trim()), `${partial} ${lang}`);
      assert.ok(html.indexOf('/js/import-map.js') > html.indexOf('/js/tool-kit.js'), `${partial}: import-map.js after tool-kit.js`);
    }
  }
});

test('a photo is kept at 1280 px on its long side at most, never made larger', () => {
  const w = bare('', { files: ['media-store'] });
  const { MediaStore } = w;
  assert.deepEqual(plain(MediaStore.fitSize(4032, 3024)), { width: 1280, height: 960 });
  assert.deepEqual(plain(MediaStore.fitSize(3024, 4032)), { width: 960, height: 1280 });
  assert.deepEqual(plain(MediaStore.fitSize(800, 600)), { width: 800, height: 600 });
  assert.deepEqual(plain(MediaStore.fitSize(1280, 1280)), { width: 1280, height: 1280 });
  assert.deepEqual(plain(MediaStore.fitSize(5000, 3)), { width: 1280, height: 1 });
  assert.deepEqual(plain(MediaStore.fitSize(0, 100)), { width: 0, height: 0 });
  assert.deepEqual(plain(MediaStore.fitSize(2000, 1000, 500)), { width: 500, height: 250 });
  assert.equal(MediaStore.MAX_SIDE, 1280);
  assert.equal(MediaStore.QUALITY, 0.7);
  assert.equal(MediaStore.DB, 'sc-media');
  assert.equal(MediaStore.STORE, 'photos');
});

// An in-memory MediaStore with the same calls, for the pages (jsdom has neither IndexedDB nor canvas).
const FAKE_STORE = `window.MediaStore = (() => {
  const rows = []; let n = 0;
  const list = async (tool, ref) => rows.filter((r) => r.tool === tool && (ref === undefined || r.ref === ref));
  return {
    rows, supported: () => true, list,
    add: async (file, { tool, ref }) => { const r = { id: 'p' + (++n), created: new Date(1e12 + n).toISOString(), tool, ref: String(ref), blob: file, width: 10, height: 10 }; rows.push(r); return r; },
    restore: async (r) => { rows.push(r); return r; },
    remove: async (id) => { const i = rows.findIndex((r) => r.id === id); if (i >= 0) rows.splice(i, 1); },
    update: async (id, { ref }) => { const r = rows.find((x) => x.id === id); if (r) r.ref = ref; return r; },
    counts: async (tool) => { const out = {}; (await list(tool)).forEach((r) => { out[r.ref] = (out[r.ref] || 0) + 1; }); return out; },
  };
})();`;
const stubUrls = (w) => { w.URL.createObjectURL = () => 'blob:https://example.test/x'; w.URL.revokeObjectURL = () => {}; };

test('Scan shows only where the browser reads codes, and a scanned value fills the field like typing', async () => {
  const html = '<div class="field"><label for="a">Area</label><select id="a" data-scan><option>Dock 1</option><option>Goods-in</option></select></div><div class="field"><label for="r">Route</label><input id="r" data-scan></div>';
  const without = bare(html, { files: ['floor-capture'] });
  await wait(without, 20);
  assert.equal(without.document.querySelectorAll('.fc-scan').length, 0, 'no BarcodeDetector, no button');

  const dom = new JSDOM(`<html lang="en"><body>${html}</body></html>`, { url: 'https://example.test/tools/delay-analyzer/', runScripts: 'outside-only' });
  const w = dom.window;
  w.eval('window.BarcodeDetector = class { static async getSupportedFormats() { return ["qr_code", "code_128"]; } async detect() { return []; } };');
  Object.defineProperty(w.navigator, 'mediaDevices', { value: { getUserMedia: async () => { throw new Error('denied'); } } });
  w.eval(script('tool-kit'));
  w.eval(script('floor-capture'));
  await wait(w, 20);
  const buttons = [...w.document.querySelectorAll('.fc-scan')];
  assert.equal(buttons.length, 2);
  assert.equal(buttons[1].getAttribute('aria-label'), 'Scan a code into Route');
  assert.equal(w.document.querySelector('#r').parentElement.className, 'fc-scan-field');
  const seen = [];
  const route = w.document.querySelector('#r');
  route.addEventListener('input', () => seen.push('input'));
  route.addEventListener('change', () => seen.push('change'));
  w.FloorCapture.setValue(route, ' R07 ');
  assert.equal(route.value, 'R07');
  assert.deepEqual(seen, ['input', 'change']);
  const select = w.document.querySelector('#a');
  w.FloorCapture.setValue(select, 'goods-in');
  assert.equal(select.value, 'Goods-in', 'a known area is chosen');
  w.FloorCapture.setValue(select, 'Dock 7');
  assert.equal(select.value, 'Dock 7', 'a new one joins the list');
  // The camera refused: the dialog says so and keeps the field as it was.
  w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  w.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new w.Event('close')); };
  click(w, buttons[1]);
  await wait(w, 20);
  assert.match(w.document.querySelector('.fc-scan-status').textContent, /could not be opened/);
  click(w, w.document.querySelector('.fc-scan-dialog .fc-close'));
  assert.equal(w.document.querySelector('.fc-scan-dialog').hasAttribute('open'), false);
});

test('the photo control adds, shows and removes photos, and says they stay on the device', async () => {
  const w = bare('<div id="box"></div>', { files: [] });
  stubUrls(w);
  w.eval(FAKE_STORE);
  w.eval(script('floor-capture'));
  const control = w.FloorCapture.attach(w.document.querySelector('#box'), { tool: 'safety-cross', ref: '2026-10-01|Forklift' });
  await wait(w, 20);
  const box = w.document.querySelector('#box');
  assert.equal(box.querySelector('.fc-photo-note').textContent, 'Photos stay on this device and are not in the saved file.');
  const input = box.querySelector('input[type="file"]');
  assert.equal(input.accept, 'image/*');
  assert.equal(input.getAttribute('capture'), 'environment');
  assert.match(box.querySelector('.fc-add').textContent, /Add photo/);
  const file = new w.File(['x'], 'p.jpg', { type: 'image/jpeg' });
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new w.Event('change'));
  await wait(w, 20);
  assert.equal(control.count(), 1);
  assert.equal(box.querySelectorAll('.fc-thumb').length, 1);
  assert.equal(box.querySelector('.fc-thumb-remove').getAttribute('aria-label'), 'Remove photo 1');
  assert.deepEqual(plain(w.MediaStore.rows.map((r) => [r.tool, r.ref])), [['safety-cross', '2026-10-01|Forklift']]);
  click(w, box.querySelector('.fc-thumb-remove'));
  await wait(w, 20);
  assert.equal(control.count(), 0);
  assert.equal(w.MediaStore.rows.length, 0);
  assert.match(box.querySelector('.fc-photo-status').textContent, /Photo removed/);
  // Without IndexedDB the control says so instead.
  const v = bare('<div id="box"></div>', { files: ['media-store', 'floor-capture'] });
  v.FloorCapture.attach(v.document.querySelector('#box'), { tool: 't', ref: 'r' });
  assert.equal(v.document.querySelector('#box').textContent, 'This browser cannot keep photos.');
});

// The Safety Cross page with its scripts, then the floor scripts.
const safetyPage = () => {
  const ui = {};
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (text) => ui[text] ?? text);
  env.addFilter('local', (url) => url);
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
  const body = env.render('partials/safety-cross.njk', { cfg: read('src/_data/safetyCross.json') });
  const dom = new JSDOM(`<html lang="en"><body>${body.replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`, { url: 'https://example.test/tools/safety-cross/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.confirm = () => true;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  stubUrls(w);
  for (const file of ['tool-kit', 'import-map', 'chart-kit', 'workplace', 'actions-store', 'safety-cross']) w.eval(script(file));
  w.eval(FAKE_STORE);
  for (const file of ['floor-capture', 'safety-cross-photos']) w.eval(script(file));
  return w;
};

test('Safety Cross: a German export imports through the mapping, and each saved entry gets its photo button', async () => {
  const w = safetyPage();
  const doc = w.document;
  const area = doc.querySelector('#sx-paste');
  type(w, area, 'Bereich\tDatum\tArt\tWas passiert ist\nDock 2\t01.10.2026\tnear miss\tForklift reversing\nGoods-in\t02.10.2026\tfirst aid\tCut on a strap');
  await wait(w);
  assert.equal(doc.querySelector('.fc-map').hidden, false);
  click(w, doc.querySelector('[data-import]'));
  w.dispatchEvent(new w.Event('pagehide'));
  const state = JSON.parse(w.localStorage.getItem('sc-safety-cross'));
  assert.deepEqual(state.rows.map((row) => [row.date, row.type, row.area, row.what]), [
    ['2026-10-01', 'near-miss', 'Dock 2', 'Forklift reversing'],
    ['2026-10-02', 'first-aid', 'Goods-in', 'Cut on a strap'],
  ]);
  await wait(w);
  const buttons = [...doc.querySelectorAll('[data-log] .fc-row-photos')];
  assert.equal(buttons.length, 2, 'one per entry');
  assert.equal(buttons[0].textContent, 'Add photo');
  // A photo of the newest entry (shown first) counts on its button after the dialog closes.
  await w.MediaStore.add('x', { tool: 'safety-cross', ref: '2026-10-02|Cut on a strap' });
  w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  w.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new w.Event('close')); };
  click(w, buttons[0]);
  await wait(w, 30);
  const dialog = doc.querySelector('.fc-gallery');
  assert.equal(dialog.querySelectorAll('.fc-thumb').length, 1);
  assert.match(dialog.textContent, /Photos stay on this device/);
  click(w, dialog.querySelector('.fc-close'));
  await wait(w, 30);
  assert.equal(doc.querySelector('[data-log] .fc-row-photos').textContent, 'Photos · 1');
  assert.equal(doc.querySelector('[data-log] td.dl-note').firstChild.nodeValue, 'Cut on a strap', 'the entry text is unchanged');
});

test('5S Audit: photos of the walk move to the saved audit, and a new audit removes those of the draft', async () => {
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
  env.addFilter('t', (text) => text);
  env.addFilter('local', (url) => url);
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
  const cfg = read('src/_data/fiveSAudit.json');
  const body = env.render('partials/five-s-audit.njk', { cfg }).replace(/<script src=[^>]*><\/script>/g, '');
  const dom = new JSDOM(`<html lang="en"><body><main>${body}</main></body></html>`, { url: 'https://example.test/tools/five-s-audit/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  const doc = w.document;
  let asked = 0;
  w.confirm = () => { asked++; return true; };
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  stubUrls(w);
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'five-s-audit']) w.eval(script(file));
  w.eval(FAKE_STORE);
  for (const file of ['floor-capture', 'five-s-audit-photos']) w.eval(script(file));
  await wait(w, 30);
  const questions = doc.querySelectorAll('[data-questions] .fs-q');
  assert.ok(questions.length > 10);
  assert.equal(doc.querySelectorAll('[data-questions] .fs-q .fc-photos').length, questions.length, 'every question has the control');
  assert.equal(doc.querySelectorAll('[data-questions] .fc-photo-note').length, 0, 'the note is said once, above the walk');
  assert.equal(doc.querySelector('.fs-photo-note').textContent, 'Photos stay on this device and are not in the saved file.');
  const template = doc.querySelector('#fs-template').value;
  // A photo of the first Sort question, taken during the walk.
  const input = doc.querySelector('[data-note="sort-0"]').closest('.fs-q').querySelector('input[type="file"]');
  Object.defineProperty(input, 'files', { value: [new w.File(['x'], 'p.jpg', { type: 'image/jpeg' })], configurable: true });
  input.dispatchEvent(new w.Event('change'));
  await wait(w, 30);
  assert.deepEqual(plain(w.MediaStore.rows.map((r) => r.ref)), [`draft|${template}|sort-0`]);

  const areaInput = doc.querySelector('#fs-area');
  type(w, areaInput, 'Packing');
  const radio = doc.querySelector('input[name="fs-sort-0"][value="1"]');
  radio.checked = true;
  radio.dispatchEvent(new w.Event('change', { bubbles: true }));
  click(w, doc.querySelector('[data-save]'));
  await wait(w, 60);
  const saved = JSON.parse(w.localStorage.getItem('sc-five-s-audit'));
  const audit = saved.rows.find((row) => row.area === 'Packing');
  assert.ok(audit);
  assert.deepEqual(plain(w.MediaStore.rows.map((r) => r.ref)), [`${audit.id}|sort-0`], 'the photo belongs to the saved audit');
  assert.equal(doc.querySelector('[data-note="sort-0"]').closest('.fs-q').querySelectorAll('.fc-thumb').length, 0, 'the fresh walk has none');
  const logButton = doc.querySelector(`[data-show="${audit.id}"]`).closest('tr').querySelector('.fc-row-photos');
  assert.equal(logButton.textContent, 'Photos · 1');

  // A draft photo without scores: a new audit asks first, then removes it.
  await w.MediaStore.add('y', { tool: 'five-s-audit', ref: `draft|${template}|set-0` });
  // The control learns of the photo when it refreshes (here: by drawing the walk again with the template select).
  const select = doc.querySelector('#fs-template');
  select.dispatchEvent(new w.Event('change', { bubbles: true }));
  await wait(w, 30);
  asked = 0;
  click(w, doc.querySelector('[data-reset]'));
  await wait(w, 30);
  assert.equal(asked, 1, 'asked because of the photo');
  assert.deepEqual(plain(w.MediaStore.rows.map((r) => r.ref)), [`${audit.id}|sort-0`], 'the draft photo is gone, the saved one stays');
});
