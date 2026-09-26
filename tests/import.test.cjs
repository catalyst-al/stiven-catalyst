const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('src/js/tool-kit.js', 'utf8');
const kit = (lang) => {
  const context = {
    window: {},
    document: { documentElement: { lang }, getElementById: () => null },
    Intl, Date, Number, String, Math, Set, Map, JSON, URL, Blob,
  };
  vm.runInNewContext(source, context);
  return context.window.ToolKit;
};

test('pasted CSV keeps quoted commas, quotes and newlines in their own cells', () => {
  const { parseRows } = kit('en');
  const report = 'Date,Shift,Route,Plan,Actual,Arrival,Actual,Delay,Delay,Late,Reason,Note\r\n'
    + '2026-09-25,Late,"Route, West",11:15,11:20,15:15,15:45,5,30,yes,Late loading,"Dock, 4 and ""recheck""\nsecond line"\r\n';
  const rows = parseRows(report);
  assert.equal(rows.length, 2);
  assert.equal(rows[1].length, 12);
  assert.equal(rows[1][2], 'Route, West');
  assert.equal(rows[1][11], 'Dock, 4 and "recheck"\nsecond line');
});

test('Excel tab rows and German semicolon rows keep quoted separators', () => {
  const { parseRows } = kit('de');
  assert.equal(parseRows('2026-09-25\tLate\t"Route\tWest"')[0][2], 'Route\tWest');
  assert.equal(parseRows('26.09.2026;100;2;"Kommentar; mit Semikolon"')[0][3], 'Kommentar; mit Semikolon');
});

test('dates reject impossible months and days', () => {
  const { parseDate } = kit('en');
  assert.equal(parseDate('2026-13-01'), '');
  assert.equal(parseDate('2026-02-30'), '');
  assert.equal(parseDate('2026-09-25junk'), '');
  assert.equal(parseDate('2024-02-29'), '2024-02-29');
  assert.equal(parseDate('25.09.2026'), '2026-09-25');
});

test('numbers respect locale grouping and reject non-finite input', () => {
  const en = kit('en').parseNumber;
  const de = kit('de').parseNumber;
  assert.equal(en('1,234'), 1234);
  assert.equal(en('1,234.50'), 1234.5);
  assert.equal(de('1.234'), 1234);
  assert.equal(de('1.234,50'), 1234.5);
  assert.equal(de('0,3229'), 0.3229);
  assert.ok(Number.isNaN(en('Infinity')));
});
