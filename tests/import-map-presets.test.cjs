// Import presets (src/js/import-map.js): the column names that hotel PMS, warehouse and route-planner exports
// typically use, recognised in English and German (and Albanian where people type it), mapped onto the columns of
// the logs; the "Recognised as" choice in the mapping panel; the dates and numbers such exports write
// (src/js/tool-kit.js); the housekeeping words of Room Status (src/js/room-status.js); and the importers that read
// a date with a time in one cell (Delay Analyzer, Lost & Found, Guest Complaints).
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
const part = read('src/_data/i18n-parts/import-presets.json');
const strings = (lang) => (lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...part[lang] });

const bare = (html = '', { lang = 'en', path = '/tools/lost-found/', files = ['import-map'] } = {}) => {
  const dom = new JSDOM(`<html lang="${lang}"><body>${html}</body></html>`, { url: `https://example.test${path}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', ...files]) w.eval(script(file));
  return w;
};

// The columns the logs declare (the keys of their partials); the labels are the English ones.
const LOGS = {
  lostFound: ['date', 'time', 'area', 'room', 'category', 'what', 'value', 'foundBy', 'place', 'tag', 'guest', 'status'],
  complaints: ['date', 'time', 'room', 'channel', 'category', 'severity', 'what', 'guest', 'takenBy', 'action', 'comp', 'value', 'resolvedDate', 'resolvedTime', 'followed', 'satisfied'],
  hotelKpis: ['date', 'available', 'sold', 'roomRev', 'otherRev', 'arrivals', 'departures', 'noShows', 'walkIns', 'ooo', 'complaints', 'covers', 'complaintCause'],
  damage: ['date', 'shift', 'stage', 'type', 'cause', 'units', 'cost', 'note'],
  delay: ['date', 'shift', 'route', 'planDep', 'actDep', 'planArr', 'actArr', 'reason', 'note'],
};
const columns = (keys) => keys.map((key) => ({ key, label: key }));
// The mapping as { field: header } for the fields that found a column, easier to read than indexes.
const mapped = (ImportMap, headers, log, preset) => {
  const mapping = plain(ImportMap.guess(headers, columns(LOGS[log]), preset));
  return Object.fromEntries(LOGS[log].map((key, j) => [key, headers[mapping[j]]]).filter(([, header]) => header !== undefined));
};

test('a hotel PMS export is recognised in English and German, and its columns land in the hotel logs', () => {
  const { ImportMap } = bare();
  // A guest list with the complaint in it: arrival, departure, rate code and balance are known PMS columns, so
  // they are not taken for a column that only looks alike.
  const en = ['Room', 'Guest name', 'Arrival', 'Departure', 'Rate code', 'Balance', 'Date', 'Time', 'Description', 'Taken by'];
  assert.equal(ImportMap.detect(en), 'hotel');
  assert.deepEqual(mapped(ImportMap, en, 'complaints', 'hotel'), { date: 'Date', time: 'Time', room: 'Room', what: 'Description', guest: 'Guest name', takenBy: 'Taken by' });
  const de = ['Zi.-Nr.', 'Gast', 'Anreise', 'Abreise', 'Ratencode', 'Saldo', 'Datum', 'Uhrzeit', 'Beschreibung', 'Erstellt von'];
  assert.equal(ImportMap.detect(de), 'hotel');
  assert.deepEqual(mapped(ImportMap, de, 'complaints', 'hotel'), { date: 'Datum', time: 'Uhrzeit', room: 'Zi.-Nr.', what: 'Beschreibung', guest: 'Gast', takenBy: 'Erstellt von' });
  // Without the preset the German time and "created by" are not known.
  assert.deepEqual(mapped(ImportMap, de, 'complaints', ''), { date: 'Datum', room: 'Zi.-Nr.', what: 'Beschreibung', guest: 'Gast' });

  // A lost-property list as housekeeping systems keep it.
  const lostEn = ['Created at', 'Room', 'Location', 'Category', 'Item', 'Found by', 'Storage location', 'Status', 'Guest'];
  assert.equal(ImportMap.detect(lostEn), 'hotel');
  assert.deepEqual(mapped(ImportMap, lostEn, 'lostFound', 'hotel'), { date: 'Created at', area: 'Location', room: 'Room', category: 'Category', what: 'Item', foundBy: 'Found by', place: 'Storage location', guest: 'Guest', status: 'Status' });
  const lostDe = ['Erstellt am', 'Zimmer', 'Bereich', 'Kategorie', 'Gegenstand', 'Gefunden von', 'Aufbewahrungsort', 'Status', 'Gast'];
  assert.equal(ImportMap.detect(lostDe), 'hotel');
  assert.deepEqual(mapped(ImportMap, lostDe, 'lostFound', 'hotel'), { date: 'Erstellt am', area: 'Bereich', room: 'Zimmer', category: 'Kategorie', what: 'Gegenstand', foundBy: 'Gefunden von', place: 'Aufbewahrungsort', guest: 'Gast', status: 'Status' });

  // The night's statistics for the Hotel KPIs.
  const kpiEn = ['Business date', 'Rooms available', 'Rooms sold', 'Room revenue', 'F&B revenue', 'Arrivals', 'Departures', 'No-shows', 'Out of order', 'Breakfast covers'];
  assert.equal(ImportMap.detect(kpiEn), 'hotel');
  assert.deepEqual(mapped(ImportMap, kpiEn, 'hotelKpis', 'hotel'), { date: 'Business date', available: 'Rooms available', sold: 'Rooms sold', roomRev: 'Room revenue', otherRev: 'F&B revenue', arrivals: 'Arrivals', departures: 'Departures', noShows: 'No-shows', ooo: 'Out of order', covers: 'Breakfast covers' });
  const kpiDe = ['Geschäftsdatum', 'Verfügbare Zimmer', 'Belegte Zimmer', 'Logisumsatz', 'Nebenumsatz', 'Anreisen', 'Abreisen', 'No-Shows', 'Außer Betrieb', 'Frühstück'];
  assert.equal(ImportMap.detect(kpiDe), 'hotel');
  assert.deepEqual(mapped(ImportMap, kpiDe, 'hotelKpis', 'hotel'), { date: 'Geschäftsdatum', available: 'Verfügbare Zimmer', sold: 'Belegte Zimmer', roomRev: 'Logisumsatz', otherRev: 'Nebenumsatz', arrivals: 'Anreisen', departures: 'Abreisen', noShows: 'No-Shows', ooo: 'Außer Betrieb', covers: 'Frühstück' });
  // "Arrival" (the day a booking arrives) is not "arrivals" (the count of a night) once the export is known.
  assert.deepEqual(mapped(ImportMap, ['Date', 'Arrival', 'Rooms sold'], 'hotelKpis', 'hotel'), { date: 'Date', sold: 'Rooms sold' });
  assert.deepEqual(mapped(ImportMap, ['Date', 'Arrival', 'Rooms sold'], 'hotelKpis', ''), { date: 'Date', sold: 'Rooms sold', arrivals: 'Arrival' }, 'without it the name alone decides, as before');
  // Albanian, as a sheet would write it without its accents.
  assert.equal(ImportMap.detect(['Data', 'Dhoma', 'Mysafiri', 'Pershkrimi']), 'hotel');
});

test('a warehouse export (SAP, WMS) is recognised and its columns land in Damage Control and Inventory ABC', () => {
  const { ImportMap } = bare('', { path: '/tools/damage-control/' });
  // A delivery list: delivery, item, material and storage bin say what it is; none of them is a column of the log.
  const en = ['Delivery', 'Item', 'Material', 'Material description', 'Delivery quantity', 'Posting date', 'Storage bin', 'Reason for movement', 'Value'];
  assert.equal(ImportMap.detect(en), 'warehouse');
  assert.deepEqual(mapped(ImportMap, en, 'damage', 'warehouse'), { date: 'Posting date', cause: 'Reason for movement', units: 'Delivery quantity', cost: 'Value' });
  const de = ['Lieferung', 'Position', 'Material', 'Materialkurztext', 'Menge', 'Buchungsdatum', 'Lagerplatz', 'Bewegungsgrund', 'Wert'];
  assert.equal(ImportMap.detect(de), 'warehouse');
  assert.deepEqual(mapped(ImportMap, de, 'damage', 'warehouse'), { date: 'Buchungsdatum', cause: 'Bewegungsgrund', units: 'Menge', cost: 'Wert' });
  // A WMS exception list.
  const wms = ['Warehouse task', 'Handling unit', 'Exception code', 'Process', 'Qty', 'Created on', 'Shift'];
  assert.equal(ImportMap.detect(wms), 'warehouse');
  assert.deepEqual(mapped(ImportMap, wms, 'damage', 'warehouse'), { date: 'Created on', shift: 'Shift', stage: 'Process', type: 'Exception code', units: 'Qty' });
  // "Delivery" (a number) is not "delivery date".
  assert.deepEqual(mapped(ImportMap, ['Delivery', 'Qty', 'Note'], 'damage', 'warehouse'), { units: 'Qty', note: 'Note' });
  // Inventory ABC reads its own columns; the preset's material and stock names join its own.
  const sap = ImportMap.PRESETS.warehouse.fields;
  for (const [field, name] of [['sku', 'materialnummer'], ['name', 'materialkurztext'], ['stock', 'frei verwendbar'], ['lt', 'planlieferzeit'], ['unitCost', 'gleitender durchschnittspreis']]) assert.ok(sap[field].includes(name), `${field}: ${name}`);
});

test('a transport or route export (TMS) is recognised and its columns land in the Delay Analyzer', () => {
  const { ImportMap } = bare('', { path: '/tools/delay-analyzer/' });
  const en = ['Route', 'Driver', 'Vehicle', 'Planned departure', 'Actual departure', 'Planned arrival', 'Actual arrival', 'Delay reason', 'Tour date'];
  assert.equal(ImportMap.detect(en), 'transport');
  assert.deepEqual(mapped(ImportMap, en, 'delay', 'transport'), { date: 'Tour date', route: 'Route', planDep: 'Planned departure', actDep: 'Actual departure', planArr: 'Planned arrival', actArr: 'Actual arrival', reason: 'Delay reason' });
  const de = ['Tour', 'Fahrer', 'Kennzeichen', 'Plan-Abfahrt', 'Ist-Abfahrt', 'Plan-Ankunft', 'Ist-Ankunft', 'Verspätungsgrund', 'Tourdatum', 'Bemerkung'];
  assert.equal(ImportMap.detect(de), 'transport');
  assert.deepEqual(mapped(ImportMap, de, 'delay', 'transport'), { date: 'Tourdatum', route: 'Tour', planDep: 'Plan-Abfahrt', actDep: 'Ist-Abfahrt', planArr: 'Plan-Ankunft', actArr: 'Ist-Ankunft', reason: 'Verspätungsgrund', note: 'Bemerkung' });
  const short = ['Tour Nr.', 'ETD', 'ATD', 'ETA', 'ATA', 'Grund'];
  assert.equal(ImportMap.detect(short), 'transport');
  assert.deepEqual(mapped(ImportMap, short, 'delay', 'transport'), { route: 'Tour Nr.', planDep: 'ETD', actDep: 'ATD', planArr: 'ETA', actArr: 'ATA', reason: 'Grund' });
});

test('a header that fits no preset, or two alike, is recognised as none', () => {
  const { ImportMap } = bare();
  assert.equal(ImportMap.detect(['Datum', 'Schicht', 'Art', 'Ursache']), '');
  assert.equal(ImportMap.detect(['Comment', 'Date']), '', 'names every preset uses say nothing');
  assert.equal(ImportMap.detect(['Room', 'Material']), '', 'one of each is a tie');
  // Each preset has a name, field lists and known columns, all folded as fold() makes them.
  for (const [key, preset] of Object.entries(ImportMap.PRESETS)) {
    assert.ok(preset.name && Object.keys(preset.fields).length && preset.known.length, key);
    for (const name of [...Object.values(preset.fields).flat(), ...preset.known]) assert.equal(ImportMap.fold(name), name, `${key}: ${name}`);
  }
});

// A paste box as the logs have it: the page's own import listens on the button and keeps what it read.
const pasteBox = (keys) => `<details class="dl-box dl-paste" open><div class="field"><label for="p">Rows</label>
  <textarea id="p" data-columns='${JSON.stringify(keys)}' data-column-labels='${JSON.stringify(keys)}'></textarea></div>
  <div class="tool-actions"><button type="button" data-import>Import rows</button></div></details>`;

test('the mapping panel says what the export was recognised as, lets the visitor switch, and the remembered mapping wins', async () => {
  const w = bare(pasteBox(LOGS.lostFound), { lang: 'de', path: '/de/tools/lost-found/' });
  await wait(w, 10);
  const doc = w.document;
  const area = doc.querySelector('#p');
  const got = [];
  doc.querySelector('[data-import]').addEventListener('click', () => { got.push(area.value); area.value = ''; });
  const panel = doc.querySelector('.fc-map');
  const text = 'Erstellt am;Zimmer;Gegenstand;Gefunden von;Aufbewahrungsort\n24.10.2026 08:15;412;Ladekabel;Housekeeping;Tresor';
  type(w, area, text);
  await wait(w);
  assert.equal(panel.hidden, false);
  const preset = panel.querySelector('.fc-map-preset select');
  assert.equal(doc.querySelector(`label[for="${preset.id}"]`).textContent, 'Erkannt als');
  assert.equal(preset.value, 'hotel');
  assert.equal(preset.selectedOptions[0].textContent, 'Hotel-PMS-Export (OPERA, protel, Mews …)');
  assert.deepEqual([...preset.options].map((o) => o.value), ['', 'hotel', 'warehouse', 'transport']);
  const note = [...panel.querySelectorAll('p.form-note')].find((p) => /Spaltennamen erkannt/.test(p.textContent));
  assert.ok(note && !note.hidden, 'the note to check the mapping');
  const selects = () => [...panel.querySelectorAll('.fc-map-grid:not(.fc-map-preset) select')].map((s) => Number(s.value));
  assert.deepEqual(selects(), [0, -1, -1, 1, -1, 2, -1, 3, 4, -1, -1, -1]);
  // Switched to no preset: only the generic names count, and the note goes.
  preset.value = '';
  preset.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.deepEqual(selects(), [-1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1]);
  assert.equal(note.hidden, true);
  // Back to the hotel preset, one column corrected by hand, then imported: that choice is remembered.
  preset.value = 'hotel';
  preset.dispatchEvent(new w.Event('change', { bubbles: true }));
  const place = panel.querySelectorAll('.fc-map-grid:not(.fc-map-preset) select')[8];
  place.value = '-1';
  place.dispatchEvent(new w.Event('change', { bubbles: true }));
  click(w, doc.querySelector('[data-import]'));
  assert.deepEqual(got, ['24.10.2026 08:15\t\t\t412\t\tLadekabel\t\tHousekeeping\t\t\t\t']);
  // The same export again: mapped like last time, whatever the preset would guess.
  type(w, area, 'Erstellt am;Zimmer;Gegenstand;Gefunden von;Aufbewahrungsort\n25.10.2026;415;Brille;Rezeption;Tresor');
  await wait(w);
  assert.equal(panel.hidden, true);
  assert.equal(doc.querySelector('.fc-map-note').hidden, false);
  click(w, doc.querySelector('[data-import]'));
  assert.equal(got[1], '25.10.2026\t\t\t415\t\tBrille\t\tRezeption\t\t\t\t');
});

test('every text of the presets has its German and Albanian translation', () => {
  const js = script('import-map');
  const keys = new Set([...js.matchAll(/\btx\(\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => JSON.parse(`"${m[1]}"`)));
  const w = bare();
  Object.values(w.ImportMap.PRESETS).forEach((preset) => keys.add(preset.name));
  keys.add('Recognised as: {name}.');
  for (const lang of ['de', 'sq']) {
    const ui = strings(lang);
    assert.deepEqual([...keys].filter((key) => !(key in ui)), [], lang);
  }
  assert.deepEqual(Object.keys(part.de).sort(), Object.keys(part.sq).sort());
});

test('dates as exports write them: day first or ISO, with or without a time', () => {
  const { ToolKit } = bare('', { files: [] });
  const { parseDate, parseDateTime } = ToolKit;
  for (const [text, iso] of [
    ['24.10.2026', '2026-10-24'], ['24.10.26', '2026-10-24'], ['24/10/2026', '2026-10-24'], ['2026-10-24', '2026-10-24'],
    ['24.10.2026 08:15', '2026-10-24'], ['24.10.2026 8:15:30', '2026-10-24'], ['24/10/2026 23:59', '2026-10-24'], ['24.10.2026, 08:15', '2026-10-24'],
    ['24.10.2026 08:15 Uhr', '2026-10-24'], ['2026-10-24 08:15', '2026-10-24'], ['2026-10-24T08:15:00', '2026-10-24'], ['1.2.2026', '2026-02-01'],
  ]) assert.equal(parseDate(text), iso, text);
  for (const text of ['31.02.2026', '24.13.2026', '24.10.2026 junk', '24.10.2026 0815x', 'Datum']) assert.equal(parseDate(text), '', text);
  assert.deepEqual(plain(parseDateTime('24.10.2026 8:05')), { date: '2026-10-24', time: '08:05' });
  assert.deepEqual(plain(parseDateTime('2026-10-24T22:40:00')), { date: '2026-10-24', time: '22:40' });
  assert.deepEqual(plain(parseDateTime('24/10/2026 06:30:15')), { date: '2026-10-24', time: '06:30' });
  assert.deepEqual(plain(parseDateTime('24.10.2026')), { date: '2026-10-24', time: '' });
  assert.deepEqual(plain(parseDateTime('08:15')), { date: '', time: '' }, 'a time alone has no date');
});

test('numbers as exports write them: German grouping, a repeated separator, the SAP minus after the number, a currency', () => {
  const en = bare('', { files: [] }).ToolKit.parseNumber;
  const de = bare('', { lang: 'de', path: '/de/tools/lost-found/', files: [] }).ToolKit.parseNumber;
  for (const parse of [en, de]) {
    assert.equal(parse('1.234,5'), 1234.5);
    assert.equal(parse('1.234.567'), 1234567);
    assert.equal(parse('1,234,567'), 1234567);
    assert.equal(parse('1.234.567,89'), 1234567.89);
    assert.equal(parse('12,5-'), -12.5, 'SAP writes the minus last');
    assert.equal(parse('1.234,50-'), -1234.5);
    assert.equal(parse('-1.234,50'), -1234.5);
    assert.equal(parse('1.234,50 EUR'), 1234.5);
    assert.equal(parse('EUR 80'), 80);
    assert.equal(parse('1 234,50 €'), 1234.5);
    assert.equal(parse('0,5'), 0.5);
    assert.ok(Number.isNaN(parse('-')));
    assert.ok(Number.isNaN(parse('12-15')));
    assert.ok(Number.isNaN(parse('EUR')));
    assert.ok(Number.isNaN(parse('Menge')));
  }
  // One separator alone follows the page: 1.234 is a thousand on a German page, one and a bit on an English one.
  assert.equal(de('1.234'), 1234);
  assert.equal(en('1.234'), 1.234);
  assert.equal(en('-1,234'), -1234);
  assert.equal(de('-1.234'), -1234);
});

test('Room Status reads the words housekeeping lists use, the status column a header names, and the front-office status', () => {
  const w = bare('', { path: '/tools/room-status/', files: [] });
  w.eval(script('room-status'));
  const M = w.RoomStatusMath;
  const statuses = read('src/_data/roomStatus.json').statuses;
  const rooms = ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112'];
  const words = '101\tDirty\n102\tClean\n103\tInspected\n104\tOut of Order\n105\tOut of Service\n106\tSauber\n107\tSchmutzig\n108\tInspiziert\n'
    + '109\tAußer Betrieb\n110 Out of order\n111;E pastër\n112\tPickup\n';
  const r = M.parseImport(words, statuses, rooms);
  assert.deepEqual(plain(r.updates.map((u) => [u.room, u.status])), [
    ['101', 'vd'], ['102', 'vc'], ['103', 'vi'], ['104', 'ooo'], ['105', 'oos'], ['106', 'vc'], ['107', 'vd'], ['108', 'vi'], ['109', 'ooo'], ['110', 'ooo'], ['111', 'vc'],
  ]);
  assert.deepEqual(plain(r.unknownCodes), [{ room: '112', code: 'Pickup' }], 'a word that is not known is listed, never guessed');
  // The words and the codes of the data file side by side.
  assert.equal(M.aliasMap(statuses).get(M.normCode('Vacant dirty')), 'vd');
  assert.equal(M.aliasMap(statuses).get(M.normCode('OC')), 'occ');
  // A housekeeping list with a header: the status is read from its column, the room type left aside, and an
  // occupied room that is dirty needs its stay-over service.
  const list = 'Zi.-Nr.;Zimmertyp;HK-Status;FO-Status\n101;DZ;Schmutzig;Frei\n102;DZ;Schmutzig;Belegt\n103;EZ;Sauber;Belegt\n104;EZ;Inspiziert;Frei\n105;DZ;OOO;Frei\n';
  const h = M.parseImport(list, statuses, rooms);
  assert.deepEqual(plain(h.updates.map((u) => [u.room, u.status])), [['101', 'vd'], ['102', 'od'], ['103', 'occ'], ['104', 'vi'], ['105', 'ooo']]);
  assert.equal(h.skipped, 1, 'the header');
  const en = 'Room\tRoom type\tHK status\tFO status\n106\tTwin\tDirty\tOccupied\n107\tTwin\tClean\tVacant\n';
  assert.deepEqual(plain(M.parseImport(en, statuses, rooms).updates.map((u) => [u.room, u.status])), [['106', 'od'], ['107', 'vc']]);
  // Without a header the first known code of the line counts, past a room type.
  assert.deepEqual(plain(M.parseImport('108;Double;VC\n109 VD DND', statuses, rooms).updates.map((u) => [u.room, u.status])), [['108', 'vc'], ['109', 'vd']]);
});

test('the importers take a date with a time in one cell: Lost & Found and Guest Complaints keep the time', () => {
  const w = bare('', { files: ['lost-found', 'guest-complaints'] });
  const lost = read('src/_data/lostFound.json');
  const found = plain(w.LostFoundMath.importRows('24.10.2026 08:15\t\tLobby\t\tPhone\tBlack phone', lost).added);
  assert.equal(found.length, 1);
  assert.equal(found[0].date, '2026-10-24');
  assert.equal(found[0].time, '08:15');
  const kept = plain(w.LostFoundMath.importRows('2026-10-24 08:15\t09:00\tLobby', lost).added);
  assert.equal(kept[0].time, '09:00', 'a time column of its own wins');
  const complaints = read('src/_data/guestComplaints.json');
  const rows = plain(w.GuestComplaintsMath.importRows('24.10.2026 21:40\t\t412\t\t\t\tNoise from the corridor\t\t\t\t\t\t25.10.2026 07:10', complaints).added);
  assert.equal(rows.length, 1);
  assert.deepEqual([rows[0].date, rows[0].time, rows[0].resolvedDate, rows[0].resolvedTime], ['2026-10-24', '21:40', '2026-10-25', '07:10']);
});

test('the Delay Analyzer reads a route export with date and time in one cell, mapped by the transport preset', async () => {
  const cfg = read('src/_data/delayAnalyzer.json');
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: true });
  env.addFilter('t', (text) => text);
  env.addFilter('lc', (text) => String(text).toLowerCase());
  env.addFilter('local', (url) => url);
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
  env.addFilter('inLang', (value) => value);
  const html = env.render('partials/delay-analyzer.njk', { cfg }).replace(/<script src=[^>]*><\/script>/g, '');
  const dom = new JSDOM(`<html lang="en"><body>${html}</body></html>`, { url: 'https://example.test/tools/delay-analyzer/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.localStorage.setItem(cfg.storageKey, JSON.stringify({ rows: [] }));
  for (const file of ['tool-kit', 'import-map', 'annotations', 'workplace', 'delay-analyzer']) w.eval(script(file));
  await wait(w, 10);
  const area = w.document.querySelector('#da-paste');
  type(w, area, 'Tour;Fahrer;Plan-Abfahrt;Ist-Abfahrt;Plan-Ankunft;Ist-Ankunft;Verspätungsgrund\n'
    + 'T-12;Meier;24.10.2026 06:00;24.10.2026 06:20;24.10.2026 09:00;24.10.2026 09:35;Late loading\n'
    + 'T-14;Kurt;2026-10-24T22:30:00;2026-10-24T22:30:00;2026-10-25T01:10:00;2026-10-25T01:05:00;');
  await wait(w);
  const preset = w.document.querySelector('.fc-map-preset select');
  assert.equal(preset.value, 'transport');
  click(w, w.document.querySelector('[data-import]'));
  w.dispatchEvent(new w.Event('pagehide'));
  const saved = JSON.parse(w.localStorage.getItem(cfg.storageKey));
  assert.deepEqual(saved.rows.map((row) => [row.date, row.route, row.planDep, row.actDep, row.planArr, row.actArr]), [
    ['2026-10-24', 'T-12', '06:00', '06:20', '09:00', '09:35'],
    ['2026-10-24', 'T-14', '22:30', '22:30', '01:10', '01:05'],
  ]);
});
