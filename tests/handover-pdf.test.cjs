// Shift Handover, "Save as PDF" (src/js/shift-handover.js, window.ShiftHandoverPdf, with js/pdf-kit.js): the sheet as a
// PDF of its own, on the built page in jsdom: the blocks hold what the sheet shows (numbers as a table, the open issues
// as a table with a header, solved, heads-up, safety, the check, the takeover), the file is a valid PDF with the
// page's language, and the same in German and Albanian.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const built = (lang) => `_site/${lang === 'en' ? '' : `${lang}/`}tools/shift-handover/index.html`;
const WIN = { 0x80: '€', 0x85: '…', 0x91: '‘', 0x92: '’', 0x93: '“', 0x94: '”', 0x95: '•', 0x96: '–', 0x97: '—' };
const plain = (value) => JSON.parse(JSON.stringify(value));
const strings = (bytes) => [...Buffer.from(bytes).toString('latin1').matchAll(/<([0-9a-f]+)> Tj/g)].map((m) => [...Buffer.from(m[1], 'hex')].map((b) => WIN[b] || String.fromCharCode(b)).join(''));

const open = (lang, state) => {
  const html = fs.readFileSync(built(lang), 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const dom = new JSDOM(html, { url: `https://example.test/${lang === 'en' ? '' : `${lang}/`}tools/shift-handover/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  Object.assign(w, { CompressionStream, DecompressionStream, Blob, Response, TextEncoder, TextDecoder });
  Object.defineProperty(w, 'crypto', { value: globalThis.crypto, configurable: true });
  w.HTMLElement.prototype.scrollIntoView = () => {};
  // The translations the built page hands its scripts (js/ui-de.js, js/ui-sq.js, loaded by the page's head).
  if (lang !== 'en' && fs.existsSync(`_site/js/ui-${lang}.js`)) w.eval(fs.readFileSync(`_site/js/ui-${lang}.js`, 'utf8'));
  if (state) w.localStorage.setItem('sc-shift-handover', JSON.stringify(state));
  for (const file of ['tool-kit', 'pdf-kit', 'shift-handover']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
// Fictional: a hotel night shift.
const handover = {
  template: 'hotel', date: '2026-10-26', shift: 'Night', area: 'Front office', from: 'Besa', to: 'Dritan', ackAt: '2026-10-27T06:10:00.000Z',
  metrics: [['Arrivals', '42', ''], ['No-shows', '2', 'both prepaid'], ['Open balances', '1 250 €', 'two late check-outs']],
  issues: [
    { text: 'Room 1204 safe does not lock; guest moved to 1206', priority: 'High', owner: 'Maintenance', due: '2026-10-27', done: false, carried: 1 },
    { text: 'Lift B out of order since 23:00, technician called', priority: 'High', owner: 'Facilities', due: '08:00', done: false, carried: 0 },
    { text: 'Breakfast list printed and handed to the kitchen', priority: 'Low', owner: '', due: '', done: true, carried: 0 },
  ],
  headsUp: 'Group of 30 arrives 15:00, rooms 3rd floor.\nVIP in 701 asks for a late check-out.',
  safety: 'Wet floor by the pool entrance; sign is out.',
  checks: [true, true, false, true, true, false],
};

test('the sheet as PDF: the blocks say what the sheet shows, and the file is a valid PDF in the page\'s language', { skip: !fs.existsSync(built('en')) }, () => {
  const w = open('en', { current: handover, history: [] });
  const P = w.ShiftHandoverPdf;
  const blocks = P.sheetBlocks(handover);
  const tables = blocks.filter((b) => b.kind === 'table');
  assert.equal(tables.length, 2, 'the numbers and the open issues');
  assert.deepEqual(plain(tables[0].rows), [['Arrivals', '42', ''], ['No-shows', '2', 'both prepaid'], ['Open balances', '1 250 €', 'two late check-outs']]);
  assert.deepEqual(plain(tables[1].header), ['Priority', 'Issue', 'Owner', 'By', 'Carried']);
  assert.deepEqual(plain(tables[1].rows.map((r) => [r[0], r[2], r[3], r[4]])), [['High', 'Maintenance', '2026-10-27', '1×'], ['High', 'Facilities', '08:00', '']]);
  const texts = blocks.filter((b) => b.kind === 'text').map((b) => b.text);
  assert.ok(texts.includes('Front office'), 'the area as the title');
  assert.ok(texts.includes('OPEN ISSUES (2)') && texts.includes('SOLVED THIS SHIFT') && texts.includes('HEADS-UP') && texts.includes('SAFETY AND PEOPLE'), texts.join(' | '));
  assert.ok(texts.includes('Breakfast list printed and handed to the kitchen'));
  assert.ok(texts.some((t) => t.startsWith('Handover check: 4 of 6')));
  assert.ok(texts.some((t) => /Taken over by Dritan at/.test(t)));
  const file = P.sheetPdf(handover, new Date(2026, 9, 27, 7, 0, 0));
  const text = Buffer.from(file.bytes).toString('latin1');
  assert.ok(file.pages >= 1 && text.startsWith('%PDF-1.4') && text.endsWith('%%EOF\n'));
  assert.match(text, /\/Lang <feff0065006e>/, 'English');
  const words = strings(file.bytes);
  assert.ok(words.includes('Room 1204 safe does not lock; guest moved to 1206') || words.some((s) => s.startsWith('Room 1204 safe')), 'the issue text');
  assert.ok(words.includes('1 250 €'), 'the euro sign in WinAnsi');
  assert.ok(words.includes('Page 1 of 1') || words.includes(`Page 1 of ${file.pages}`), 'the footer');
  assert.ok(words.some((s) => s.includes('Shift handover') && s.includes('26 Oct')), 'the footer names the shift');
});

test('in German and Albanian the sheet is translated and the file carries the language', { skip: !fs.existsSync(built('de')) || !fs.existsSync(built('sq')) }, () => {
  for (const [lang, expected] of [['de', ['PRIORITÄT', 'OFFENE PUNKTE (2)', 'Seite 1 von 1', 'Schichtübergabe']], ['sq', ['PRIORITETI', 'ÇËSHTJET E HAPURA (2)', 'Faqja 1 nga 1', 'Dorëzimi i turnit']]]) {
    const w = open(lang, { current: handover, history: [] });
    const blocks = w.ShiftHandoverPdf.sheetBlocks(handover);
    const texts = blocks.flatMap((b) => (b.kind === 'text' ? [b.text] : b.kind === 'table' && b.header ? b.header.map((h) => h.toUpperCase()) : []));
    const file = w.ShiftHandoverPdf.sheetPdf(handover);
    const words = strings(file.bytes);
    for (const t of expected) assert.ok(texts.includes(t) || words.some((s) => s.includes(t) || s.toUpperCase().includes(t)), `${lang}: ${t} in ${texts.slice(0, 12).join(' | ')} / ${words.slice(-3).join(' | ')}`);
    assert.match(Buffer.from(file.bytes).toString('latin1'), new RegExp(`/Lang <feff${[...lang].map((c) => c.charCodeAt(0).toString(16).padStart(4, '0')).join('')}>`));
  }
});
