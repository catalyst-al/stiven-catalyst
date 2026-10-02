const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// The Pareto engine runs without its page: no [data-pareto] element, so only window.Pareto is set up.
const load = (lang) => {
  const context = {
    window: {},
    document: { documentElement: { lang }, querySelector: () => null, getElementById: () => null, currentScript: null },
    TextEncoder, TextDecoder, Blob, Response, DecompressionStream, URL, Intl,
  };
  for (const file of ['tool-kit', 'docx-kit', 'cv-import', 'pareto']) {
    vm.runInNewContext(fs.readFileSync(`src/js/${file}.js`, 'utf8'), context);
  }
  return context.window;
};
const { Pareto, ToolKit, CvImport, DocxKit } = load('en');
const de = load('de');
const plain = (value) => JSON.parse(JSON.stringify(value));
const data = JSON.parse(fs.readFileSync('src/_data/pareto.json', 'utf8'));
const { parseNumber, parseDate, parseRows } = ToolKit;
const run = (table, options) => Pareto.analyse(table, { measure: 'count', notStated: 'Not stated', parseNumber, parseDate, ...options });
const cols = { category: 0, count: -1, value: -1, date: -1, filter: -1 };

const events = (spec) => Object.entries(spec).flatMap(([cause, n]) => Array.from({ length: n }, () => [cause]));

test('counts, shares, cumulative line and ABC classes add up', () => {
  const table = { hasHeader: false, rows: events({ A: 50, B: 25, C: 10, D: 6, E: 4, F: 3, G: 2 }) };
  const result = run(table, { map: cols });
  assert.equal(result.total, 100);
  assert.equal(result.read, 100);
  assert.equal(result.used, 100);
  assert.deepEqual(plain(result.items.map((item) => item.key)), ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  assert.deepEqual(plain(result.items.map((item) => item.cls)), ['A', 'A', 'A', 'B', 'B', 'C', 'C']);
  assert.equal(Math.round(result.items.at(-1).cumulative * 1000), 1000);
  assert.equal(result.items.reduce((sum, item) => sum + item.amount, 0), result.total);
  assert.equal(result.vital.length, 3);
  assert.equal(Math.round(result.vitalShare * 100), 85);
  assert.equal(result.shape, 'strong');
});

test('the cause that crosses 80% is class A; one exactly at 80% closes it', () => {
  const exact = run({ rows: events({ A: 50, B: 30, C: 10, D: 5, E: 5 }) }, { map: cols });
  assert.deepEqual(plain(exact.items.map((item) => item.cls)), ['A', 'A', 'B', 'B', 'C']);
  const flat = run({ rows: events({ A: 10, B: 10, C: 10, D: 10, E: 10, F: 10, G: 10, H: 10, I: 10, J: 10 }) }, { map: cols });
  assert.equal(flat.shape, 'flat');
  assert.equal(run({ rows: events({ A: 5, B: 1 }) }, { map: cols }).shape, 'few');
});

test('a summary table counts with its number column and ranks by value when asked', () => {
  const table = { hasHeader: true, headers: ['Grund', 'Anzahl', 'Minuten'], rows: [['Stau', '12', '240'], ['Späte Beladung', '5', '600'], ['Adresse falsch', '3', '45']] };
  const map = Pareto.suggestColumns(table, parseNumber, parseDate);
  assert.deepEqual(plain(map), { category: 0, count: 1, value: 2, date: -1, filter: -1 });
  assert.equal(run(table, { map }).items[0].key, 'Stau');
  const byValue = run(table, { map, measure: 'value' });
  assert.equal(byValue.items[0].key, 'Späte Beladung');
  assert.equal(byValue.total, 885);
});

test('"Other" and "not stated" sort last, even when large', () => {
  const rows = [...events({ Sonstige: 40, Traffic: 30, Parking: 20 }), ['', 'no cause written'], ['', 'no cause written']];
  const result = run({ rows }, { map: cols });
  assert.deepEqual(plain(result.items.map((item) => item.key)), ['Traffic', 'Parking', 'Sonstige', 'Not stated']);
  assert.ok(result.otherShare > 0.4);
  assert.ok(result.vital.every((item) => !Pareto.isOther(item.key)));
});

test('spellings that differ only in case, spaces or accents are one cause; similar ones are only offered', () => {
  const rows = [['Late loading'], ['late  loading'], ['LATE LOADING'], ['Verspätung'], ['Verspatung'], ['Wrong adress'], ['Wrong address'], ['Wrong address']];
  const result = run({ rows }, { map: cols });
  const late = result.items.find((item) => item.key === 'Late loading');
  assert.equal(late.count, 3);
  assert.equal(result.items.find((item) => item.spellings.includes('Verspätung')).count, 2);
  assert.equal(result.merged.length, 2);
  assert.deepEqual(plain(result.suggestions), [['Wrong address', 'Wrong adress']]);
  const merged = run({ rows }, { map: cols, merges: [['Wrong adress', 'Wrong address']] });
  assert.equal(merged.items.find((item) => item.key === 'Wrong address').count, 3);
  assert.equal(merged.items.length, 3);
});

test('rows that cannot be counted are listed with their line and reason, never lost', () => {
  const table = { hasHeader: true, headers: ['Date', 'Cause', 'Qty', 'Minutes'], rows: [
    ['2026-09-01', 'Traffic', '2', '30'],
    ['2026-09-02', 'Traffic', 'two', '10'],
    ['yesterday', 'Parking', '1', '5'],
    ['', '', '', ''],
    ['2026-09-03', 'Parking', '1', 'long'],
    ['2026-09-04', 'Parking', '-1', '5'],
  ] };
  const map = { category: 1, count: 2, value: 3, date: 0, filter: -1 };
  const byCount = run(table, { map });
  assert.equal(byCount.read, 5);
  assert.equal(byCount.used, 3);
  assert.deepEqual(plain(byCount.skipped).map((s) => [s.line, s.reason]), [[3, 'count'], [7, 'count']]);
  assert.equal(byCount.total, 4);
  const byValue = run(table, { map, measure: 'value' });
  assert.deepEqual(plain(byValue.skipped).map((s) => [s.line, s.reason]), [[3, 'count'], [6, 'value'], [7, 'count']]);
  const ranged = run(table, { map, from: '2026-09-02', to: '2026-09-30' });
  assert.deepEqual(plain(ranged.skipped).map((s) => [s.line, s.reason]), [[3, 'count'], [4, 'date'], [7, 'count']]);
  assert.equal(ranged.used, 1);
  assert.equal(byCount.read, byCount.used + byCount.skipped.length);
});

test('the filter keeps one station, zone or department', () => {
  const table = { rows: [['A', 'DBE1'], ['B', 'dbe1'], ['A', 'DMU2'], ['C', 'DMU2']] };
  const result = run(table, { map: { ...cols, filter: 1 }, filterValue: 'DBE1' });
  assert.equal(result.used, 2);
  assert.equal(result.read, 4);
  assert.deepEqual(plain(result.items.map((item) => item.key)).sort(), ['A', 'B']);
});

test('headers in English, German and Albanian are recognised', () => {
  const cases = [
    [['Date', 'Station', 'Route', 'Cause', 'Count', 'Delay minutes', 'Note'], { category: 3, count: 4, value: 5, date: 0, filter: 1 }],
    [['Datum', 'Schicht', 'Tour', 'Ursache', 'Anzahl', 'Kosten €', 'Notiz'], { category: 3, count: 4, value: 5, date: 0, filter: 1 }],
    [['Data', 'Zona', 'ID', 'Shkaku', 'Sasia', 'Minuta vonese', 'Shënim'], { category: 3, count: 4, value: 5, date: 0, filter: 1 }],
  ];
  for (const [headers, expected] of cases) {
    const rows = [['27.09.2026', 'A', 'R-1', 'Stau', '2', '35', ''], ['26.09.2026', 'B', 'R-2', 'Panne', '1', '12,5', 'x']];
    assert.equal(Pareto.detectHeader([headers, ...rows], parseNumber, parseDate), true, headers.join());
    assert.deepEqual(plain(Pareto.suggestColumns({ headers, rows }, parseNumber, parseDate)), expected, headers.join());
  }
  // No header row: guessed from the types, the repeating text column is the cause.
  const bare = [['2026-09-01', 'Traffic', '12'], ['2026-09-02', 'Parking', '4'], ['2026-09-03', 'Traffic', '7']];
  assert.equal(Pareto.detectHeader(bare, parseNumber, parseDate), false);
  const map = Pareto.suggestColumns({ headers: ['', '', ''], rows: bare }, parseNumber, parseDate);
  assert.equal(map.category, 1);
  assert.equal(map.date, 0);
});

test('German Excel CSV: Windows-1252, semicolons and decimal commas', () => {
  const text = 'Datum;Ursache;Anzahl;Kosten (€)\r\n01.09.2026;Verpackung beschädigt;2;12,50\r\n02.09.2026;Stapler;1;1.234,00\r\n';
  const bytes = new Uint8Array([...text].map((ch) => ({ '€': 0x80, 'ä': 0xe4 }[ch] ?? ch.charCodeAt(0))));
  const decoded = Pareto.decode(bytes);
  assert.equal(decoded, text);
  assert.equal(Pareto.decode(new TextEncoder().encode(`﻿${text}`)), text);
  // Excel's "Unicode Text" is UTF-16 with a byte order mark, little or big endian, or without one.
  const wide = (le, bom) => { const codes = [...(bom ? '﻿' : '') + text].map((ch) => ch.charCodeAt(0)); const out = new Uint8Array(codes.length * 2); codes.forEach((code, i) => { out[i * 2] = le ? code & 0xff : code >> 8; out[i * 2 + 1] = le ? code >> 8 : code & 0xff; }); return out; };
  assert.equal(Pareto.decode(wide(true, true)), text);
  assert.equal(Pareto.decode(wide(false, true)), text);
  assert.equal(Pareto.decode(wide(true, false)), text);
  assert.equal(Pareto.decode(wide(false, false)), text);
  const rows = parseRows(decoded);
  const table = { hasHeader: true, headers: rows[0], rows: rows.slice(1) };
  const map = Pareto.suggestColumns(table, de.ToolKit.parseNumber, de.ToolKit.parseDate);
  const result = de.Pareto.analyse(table, { map, measure: 'value', notStated: '-', parseNumber: de.ToolKit.parseNumber, parseDate: de.ToolKit.parseDate });
  assert.equal(result.total, 1246.5);
  assert.equal(result.items[0].key, 'Stapler');
});

test('an .xlsx file is read from its first sheet, with shared and inline strings and serial dates', async () => {
  const bytes = DocxKit.zip([
    { name: 'xl/workbook.xml', text: '<workbook><sheets><sheet name="Log" sheetId="1" r:id="rId3"/></sheets></workbook>' },
    { name: 'xl/_rels/workbook.xml.rels', text: '<Relationships><Relationship Id="rId3" Type="worksheet" Target="worksheets/log.xml"/></Relationships>' },
    { name: 'xl/sharedStrings.xml', text: '<sst><si><t>Cause</t></si><si><r><t>Late </t></r><r><t>loading</t></r></si><si><t>Minutes</t></si><si><t>Date</t></si></sst>' },
    { name: 'xl/worksheets/log.xml', text: '<worksheet><sheetData>'
      + '<row r="1"><c r="A1" t="s"><v>3</v></c><c r="B1" t="s"><v>0</v></c><c r="D1" t="s"><v>2</v></c></row>'
      + '<row r="2"><c r="A2"><v>46292</v></c><c r="B2" t="s"><v>1</v></c><c r="D2"><v>3.125</v></c></row>'
      + '<row r="3"><c r="A3"><v>46293.5</v></c><c r="B3" t="inlineStr"><is><t>Traffic &amp; roadworks</t></is></c><c r="D3"><v>1E-2</v></c></row>'
      + '</sheetData></worksheet>' },
  ]);
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const rows = await Pareto.readXlsx(buffer, CvImport.unzip);
  assert.deepEqual(plain(rows), [['Date', 'Cause', '', 'Minutes'], ['46292', 'Late loading', '', '3.125'], ['46293.5', 'Traffic & roadworks', '', '0.01']]);
  assert.equal(parseDate(rows[1][0]), '2026-09-27');
  assert.equal(parseDate(rows[2][0]), '2026-09-28');
  const german = await de.Pareto.readXlsx(buffer, CvImport.unzip, true);
  assert.equal(german[1][3], '3,125');
  assert.equal(de.ToolKit.parseNumber(german[1][3]), 3.125);
});

test('every template has three languages, seven columns and an example that is the same each time', () => {
  assert.equal(data.templates.length, 12);
  for (const template of data.templates) {
    for (const lang of ['en', 'de', 'sq']) {
      assert.ok(template.name[lang] && template.what[lang] && template.unit[lang], `${template.id} ${lang}`);
      assert.equal(template.columns[lang].length, 7, `${template.id} ${lang}`);
      assert.ok(template.causes.every((cause) => cause[lang]), `${template.id} ${lang}`);
      assert.ok(data.groups[template.group][lang]);
    }
    const one = Pareto.example(template, 'de', data.exampleEnd);
    assert.deepEqual(plain(one), plain(Pareto.example(template, 'de', data.exampleEnd)));
    assert.equal(one.rows.length, 160);
    const map = Pareto.suggestColumns(one, parseNumber, parseDate);
    assert.deepEqual([map.date, map.category, map.count, map.value], [0, 3, 4, 5], template.id);
    const result = run({ hasHeader: true, rows: one.rows }, { map, measure: template.measure });
    assert.equal(result.used, 160, template.id);
    assert.equal(result.skipped.length, 0, template.id);
    assert.ok(result.vital.length >= 1 && result.shape !== 'few', template.id);
    assert.ok(one.rows.every((row) => row[0] <= data.exampleEnd));
  }
});

test('before and after: shares per period, split on the given date', () => {
  const rows = [['2026-09-01', 'A'], ['2026-09-02', 'A'], ['2026-09-03', 'B'], ['2026-09-10', 'B'], ['2026-09-11', 'B'], ['2026-09-12', 'A']];
  const result = Pareto.compare({ rows }, { map: { ...cols, category: 1, date: 0 }, measure: 'count', notStated: '-', parseNumber, parseDate }, '2026-09-10');
  assert.equal(result.before.used, 3);
  assert.equal(result.after.used, 3);
  const a = result.rows.find((row) => row.key === 'A');
  assert.equal(Math.round(a.beforeShare * 100), 67);
  assert.equal(Math.round(a.afterShare * 100), 33);
});
