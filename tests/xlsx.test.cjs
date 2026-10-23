// "Download Excel" under a log: the same rows as the CSV as a workbook written without a library (xlsxFile in
// src/js/tool-kit.js). The zip is read back here entry by entry: a date is a real date, a number a number, a text
// is text with its characters escaped, the header is bold, and a text that Excel would run as a formula stays text.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const load = (lang = 'en') => {
  const dom = new JSDOM(`<html lang="${lang}"><body></body></html>`, { url: `https://example.test/${lang === 'en' ? '' : `${lang}/`}tools/damage-control/`, runScripts: 'outside-only' });
  dom.window.TextEncoder = TextEncoder;
  dom.window.eval(fs.readFileSync('src/js/tool-kit.js', 'utf8'));
  return dom.window;
};
// The entries of a stored zip: name → text.
const unzip = (bytes) => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const decoder = new TextDecoder();
  const files = {};
  let at = 0;
  while (at + 30 <= bytes.length && view.getUint32(at, true) === 0x04034b50) {
    const size = view.getUint32(at + 18, true);
    const nameLength = view.getUint16(at + 26, true);
    const extra = view.getUint16(at + 28, true);
    const name = decoder.decode(bytes.subarray(at + 30, at + 30 + nameLength));
    files[name] = decoder.decode(bytes.subarray(at + 30 + nameLength + extra, at + 30 + nameLength + extra + size));
    at += 30 + nameLength + extra + size;
  }
  return files;
};
const serial = (iso) => Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.UTC(1899, 11, 30)) / 86400000);

test('the workbook holds the parts Excel needs, and the sheet keeps dates, numbers and text apart', () => {
  const { ToolKit } = load();
  const rows = [['Date', 'Stage', 'Units', 'Cost', 'Note'], ['2026-09-14', 'Loading', 7, 61.5, 'Cage 4 <top> & "wall"'], ['', 'Picking', '3', '', 'no date']];
  const files = unzip(ToolKit.xlsxFile(rows, { sheet: 'Damage', title: 'Damage log' }));
  assert.deepEqual(Object.keys(files).sort(), ['[Content_Types].xml', '_rels/.rels', 'docProps/core.xml', 'xl/_rels/workbook.xml.rels', 'xl/styles.xml', 'xl/workbook.xml', 'xl/worksheets/sheet1.xml']);
  const sheet = files['xl/worksheets/sheet1.xml'];
  assert.match(sheet, /<c r="A1" t="inlineStr" s="1"><is><t xml:space="preserve">Date<\/t><\/is><\/c>/, 'the header is bold text');
  assert.match(sheet, new RegExp(`<c r="A2" s="2"><v>${serial('2026-09-14')}</v></c>`), 'a date is a date');
  assert.equal(serial('2026-09-14'), 46279);
  assert.match(sheet, /<c r="C2"><v>7<\/v><\/c>/, 'a number is a number');
  assert.match(sheet, /<c r="D2"><v>61.5<\/v><\/c>/);
  assert.match(sheet, /<c r="E2" t="inlineStr"><is><t xml:space="preserve">Cage 4 &lt;top&gt; &amp; &quot;wall&quot;<\/t><\/is><\/c>/, 'text is escaped');
  assert.doesNotMatch(sheet, /r="A3"/, 'an empty cell is left out');
  assert.match(sheet, /<c r="C3"><v>3<\/v><\/c>/, 'a number typed as text is a number');
  assert.match(sheet, /<autoFilter ref="A1:E3"\/>/);
  assert.match(sheet, /<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"\/>/);
  assert.match(files['xl/workbook.xml'], /<sheet name="Damage" sheetId="1" r:id="rId1"\/>/);
  assert.match(files['xl/styles.xml'], /formatCode="yyyy-mm-dd"/, 'the English page shows ISO dates');
  assert.match(files['docProps/core.xml'], /<dc:title>Damage log<\/dc:title>/);
  assert.match(files['[Content_Types].xml'], /spreadsheetml\.sheet\.main\+xml/);
});

test('a German or Albanian page formats the dates its way, and a sheet name is cut to what Excel allows', () => {
  const files = unzip(load('de').ToolKit.xlsxFile([['Datum'], ['2026-01-02']], { sheet: 'x'.repeat(40) }));
  assert.match(files['xl/styles.xml'], /formatCode="dd.mm.yyyy"/);
  assert.match(files['xl/workbook.xml'], new RegExp(`<sheet name="${'x'.repeat(31)}"`));
});

test('the download writes the rows with formulas kept as text, named like the CSV', () => {
  const window = load();
  const { ToolKit } = window;
  let saved = null;
  // A blob that keeps its bytes in reach (JSDOM's cannot be read back).
  window.Blob = class { constructor(parts, options) { this.bytes = parts[0]; this.type = options.type; } };
  window.URL.createObjectURL = (blob) => { saved = blob; return 'blob:x'; };
  window.URL.revokeObjectURL = () => {};
  const clicked = [];
  window.HTMLAnchorElement.prototype.click = function () { clicked.push(this.download); };
  ToolKit.downloadXlsx('damage-log', [['Note'], ['=HYPERLINK("x")'], ['+1 cmd'], ['12']]);
  assert.equal(clicked.length, 1);
  assert.match(clicked[0], /^damage-log-\d{4}-\d{2}-\d{2}\.xlsx$/);
  assert.equal(saved.type, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  const sheet = unzip(saved.bytes)['xl/worksheets/sheet1.xml'];
  assert.match(sheet, /'=HYPERLINK\(&quot;x&quot;\)/, 'a formula stays text');
  assert.match(sheet, /'\+1 cmd/);
  assert.match(sheet, /<c r="A4"><v>12<\/v><\/c>/, 'a plain number stays a number');
});

test('every log with a CSV button offers the workbook beside it, in the three languages', () => {
  for (const file of ['defect-log', 'delay-analyzer', 'sigma-chart']) {
    const page = fs.readFileSync(`src/_includes/partials/${file}.njk`, 'utf8');
    assert.match(page, /data-csv>\{\{ "Download CSV" \| t\(lang\) \}\}<\/button>\s*<button class="button-secondary" type="button" data-xlsx>\{\{ "Download Excel" \| t\(lang\) \}\}<\/button>/, file);
  }
  for (const lang of ['de', 'sq']) assert.ok(JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'))['Download Excel'], lang);
  assert.match(fs.readFileSync('src/js/sigma-chart.js', 'utf8'), /\[data-xlsx\]/);
  assert.match(fs.readFileSync('src/js/tool-kit.js', 'utf8'), /root\.querySelector\("\[data-xlsx\]"\)\?\.addEventListener/);
});
