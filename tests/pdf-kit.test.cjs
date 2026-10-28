// pdf-kit.js: the PDF writer of the career tools. The file it writes is a valid PDF (every object where the table
// says, the pages counted), its text reads back, and the column lays text out over pages without losing a line.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { window: {}, TextEncoder, TextDecoder };
vm.runInNewContext(fs.readFileSync('src/js/pdf-kit.js', 'utf8'), context);
const { PdfKit } = context.window;
const latin1 = (bytes) => Buffer.from(bytes).toString('latin1');
// The bytes of a string as the file writes them (WinAnsi): the few characters above 127 that the tests use.
const WIN = { 0x80: '€', 0x85: '…', 0x91: '‘', 0x92: '’', 0x93: '“', 0x94: '”', 0x95: '•', 0x96: '–', 0x97: '—' };
const winAnsi = (hex) => [...Buffer.from(hex, 'hex')].map((b) => WIN[b] || String.fromCharCode(b)).join('');
// Values from the script's own context, compared through JSON (its arrays are not this file's Array).
const plain = (value) => JSON.parse(JSON.stringify(value));

// The objects of a file by number, and the offsets its cross-reference table claims.
const parse = (bytes) => {
  const text = latin1(bytes);
  assert.ok(text.startsWith('%PDF-1.4\n'), 'a PDF header');
  assert.ok(text.endsWith('%%EOF\n'), 'the end marker');
  const startxref = Number(/startxref\n(\d+)\n%%EOF\n$/.exec(text)[1]);
  assert.equal(text.slice(startxref, startxref + 4), 'xref', 'startxref points at the table');
  const [, count] = /xref\n0 (\d+)\n/.exec(text.slice(startxref));
  const rows = text.slice(startxref).split('\n').slice(2, 2 + Number(count));
  const offsets = rows.slice(1).map((row) => Number(row.slice(0, 10)));
  offsets.forEach((offset, i) => assert.ok(text.slice(offset).startsWith(`${i + 1} 0 obj\n`), `object ${i + 1} starts where the table says (${offset})`));
  const trailer = /trailer\n<< (.*?) >>/.exec(text)[1];
  return { text, offsets, trailer, pages: (text.match(/\/Type \/Page\b/g) || []).length };
};

test('widths follow the standard fonts, and WinAnsi takes the letters of English, German and Albanian', () => {
  assert.equal(PdfKit.width('Hello', 'Helvetica', 10), (722 + 556 + 222 + 222 + 556) / 100);
  assert.ok(PdfKit.width('Hello', 'Helvetica-Bold', 10) > PdfKit.width('Hello', 'Helvetica', 10));
  assert.equal(PdfKit.width('iiii', 'Courier', 10), 4 * 6);
  // ë and ç (Albanian), ä ö ü ß (German) and the euro sign are single bytes; a letter WinAnsi lacks loses its accent.
  assert.deepEqual(plain([...PdfKit.encode('ëçäöüß€•–')]), [0xeb, 0xe7, 0xe4, 0xf6, 0xfc, 0xdf, 0x80, 0x95, 0x96]);
  assert.deepEqual(plain([...PdfKit.encode('Erdős ő')]), [0x45, 0x72, 0x64, 0x6f, 0x73, 0x20, 0x6f]);
  assert.deepEqual(plain([...PdfKit.encode('日本')]), [63, 63]);
  // Accented letters are as wide as their base letter.
  assert.equal(PdfKit.width('ë', 'Helvetica', 10), PdfKit.width('e', 'Helvetica', 10));
});

test('wrap keeps words whole, breaks a word only when it is longer than the line, and keeps bold runs', () => {
  const lines = PdfKit.wrap([{ text: 'Hello wide world of PDF writing with Helvetica' }], 'helvetica', 10, 80);
  assert.deepEqual(plain(lines.map((line) => line.segments.map((seg) => seg.text).join(''))), ['Hello wide world', 'of PDF writing', 'with Helvetica']);
  lines.forEach((line) => assert.ok(line.width <= 80, `${line.width} fits 80`));
  const long = PdfKit.wrap([{ text: 'Donaudampfschifffahrtsgesellschaftskapitän' }], 'helvetica', 10, 60);
  assert.ok(long.length > 1 && long.every((line) => line.width <= 60), 'a long word is broken');
  assert.equal(long.map((line) => line.segments.map((seg) => seg.text).join('')).join(''), 'Donaudampfschifffahrtsgesellschaftskapitän');
  // A bold word is one segment of its own, with the space before it kept in the regular one, so the text copies with its spaces.
  const mixed = PdfKit.wrap([{ text: 'Front office: ', bold: true }, { text: 'check-in and night audit' }], 'helvetica', 10, 500);
  assert.deepEqual(plain(mixed[0].segments.map((seg) => [seg.text, seg.font])), [['Front office: ', 'Helvetica-Bold'], ['check-in and night audit', 'Helvetica']]);
  assert.deepEqual(PdfKit.wrap([{ text: '' }], 'helvetica', 10, 100).length, 1, 'an empty text is one empty line');
});

test('a document is a valid PDF: objects where the table says, pages counted, text and metadata that read back', () => {
  const doc = PdfKit.create({ title: 'Elena – Lebenslauf', author: 'Elena Marku', lang: 'de', date: new Date(2026, 9, 26, 10, 0, 0) });
  doc.addPage();
  doc.text(54, 60, 'Hello ëç', { font: 'Helvetica-Bold', size: 12, color: '#1f3a5f' });
  doc.line(54, 70, 300, 70, { color: '#7a1f2b', width: 0.9 });
  doc.addPage();
  doc.text(54, 60, 'Second page', { font: 'Times-Roman', size: 10 });
  const { text, trailer, pages } = parse(doc.bytes());
  assert.equal(pages, 2);
  assert.match(trailer, /\/Root \d+ 0 R \/Info \d+ 0 R/);
  assert.match(text, /\/Type \/Font \/Subtype \/Type1 \/BaseFont \/Helvetica-Bold \/Encoding \/WinAnsiEncoding/);
  assert.match(text, /\/BaseFont \/Times-Roman/);
  assert.match(text, /\/Count 2/);
  assert.match(text, /\/MediaBox \[0 0 595.28 841.89\]/);
  // The text as hex in WinAnsi, the colour as RGB, the baseline measured from the top.
  assert.match(text, /BT \/F1 12 Tf 0.122 0.227 0.373 rg 54 781.89 Td <48656c6c6f20ebe7> Tj ET/);
  assert.match(text, /0.478 0.122 0.169 RG 0.9 w 54 771.89 m 300 771.89 l S/);
  // Title and author in UTF-16, so the dash reads back; the language on the catalog; the date as the PDF writes it.
  assert.match(text, /\/Title <feff0045006c0065006e0061002020130020004c006500620065006e0073006c006100750066>/);
  assert.match(text, /\/Lang <feff00640065>/);
  assert.match(text, /\/CreationDate \(D:20261026100000\)/);
  // Every stream's length is right.
  for (const m of text.matchAll(/<< \/Length (\d+) >>\nstream\n/g)) {
    const start = m.index + m[0].length;
    assert.equal(text.slice(start + Number(m[1]), start + Number(m[1]) + 10), '\nendstream');
  }
});

test('flow fills pages in order, keeps a heading with what follows, splits a long paragraph and numbers the pages', () => {
  const para = (n) => ({ kind: 'text', text: Array.from({ length: n }, (_, i) => `word${i}`).join(' '), size: 10, leading: 14, space: 6 });
  const heading = { kind: 'text', text: 'HEADING', size: 10, bold: true, color: '#1f3a5f', leading: 14, space: 18, keep: true };
  const rule = { kind: 'rule', color: '#1f3a5f', width: 1, space: 2, keep: true };
  // 53 lines of 14 pt fit the column (841.89 - 45 - 48); 51 one-line blocks leave 34.89 pt, less than the heading, its
  // rule and the first two lines of the paragraph need, so the heading cannot stay at the foot of page 1.
  const singles = Array.from({ length: 51 }, (_, i) => ({ kind: 'text', text: `line${i}`, size: 10, leading: 14, space: 0 }));
  const blocks = [...singles, heading, rule, para(80), { kind: 'row', left: 'Front Office Manager', right: '03.2022 – heute', size: 10, leading: 14, space: 8, keep: true }, para(20)];
  const out = PdfKit.flow(blocks, { footer: (n, total) => ['Elena · CV', `Page ${n} of ${total}`], margins: { top: 45, bottom: 48, left: 54, right: 54 } });
  const { text, pages } = parse(out.bytes);
  assert.equal(out.pages, pages);
  assert.equal(pages, 2);
  const streams = [...text.matchAll(/stream\n([\s\S]*?)\nendstream/g)].map((m) => m[1]);
  const words = (stream) => [...stream.matchAll(/<([0-9a-f]+)> Tj/g)].map((m) => winAnsi(m[1]));
  const first = words(streams[0]);
  const second = words(streams[1]);
  assert.equal(first[0], 'line0');
  assert.equal(first[50], 'line50');
  assert.ok(!first.includes('HEADING') && second[0] === 'HEADING', 'the heading moved to page 2 with its paragraph');
  assert.ok(second.includes('Front Office Manager') && second.includes('03.2022 – heute'), 'the row with its date');
  assert.ok(first.includes('Elena · CV') && first.includes('Page 1 of 2') && second.includes('Page 2 of 2'), 'the footer on every page');
  // Nothing is lost: the two paragraphs have 80 + 20 words, and so does the file.
  assert.equal(([...first, ...second].join(' ').match(/\bword\d+\b/g) || []).length, 100);
  // A long paragraph that starts near the foot of a page runs on to the next, split between two of its lines.
  const beta = { kind: 'text', text: Array.from({ length: 60 }, (_, i) => `beta${i}`).join(' '), size: 10, leading: 14, space: 6 };
  const split = PdfKit.flow([...singles.slice(0, 50), beta], { margins: { top: 45, bottom: 48, left: 54, right: 54 } });
  const splitStreams = [...latin1(split.bytes).matchAll(/stream\n([\s\S]*?)\nendstream/g)].map((m) => words(m[1]).join(' '));
  assert.equal(split.pages, 2);
  assert.ok(/\bbeta0\b/.test(splitStreams[0]) && /\bbeta59\b/.test(splitStreams[1]), 'the second paragraph starts on page 1 and ends on page 2');
  assert.equal(((splitStreams[0] + ' ' + splitStreams[1]).match(/\bbeta\d+\b/g) || []).length, 60);
});

test('a table: cells wrap in their columns, a row is never split, the header comes again on every page it runs on to', () => {
  const rows = Array.from({ length: 60 }, (_, i) => [`Row ${i}`, `A fairly long description of the issue number ${i} that wraps over a line or two in its column`, i % 2 ? 'Lena' : 'Maintenance', '2026-10-30']);
  const out = PdfKit.flow([
    { kind: 'text', text: 'Title', size: 14, bold: true, leading: 18 },
    { kind: 'table', columns: [{ width: 1 }, { width: 4 }, { width: 1.5 }, { width: 1.3, align: 'right' }], header: ['#', 'Issue', 'Owner', 'By'], rows, size: 9, leading: 12, space: 8 },
  ], { footer: (n, total) => ['Sheet', `Page ${n} of ${total}`] });
  const { text, pages } = parse(out.bytes);
  assert.equal(out.pages, pages);
  assert.ok(pages >= 2, 'more than a page of rows');
  const streams = [...text.matchAll(/stream\n([\s\S]*?)\nendstream/g)].map((m) => [...m[1].matchAll(/<([0-9a-f]+)> Tj/g)].map((x) => winAnsi(x[1])));
  streams.forEach((words, n) => assert.ok(words.includes('Issue') && words.includes('Owner'), `the header on page ${n + 1}`));
  assert.equal(streams.flat().filter((w) => /^Row \d+$/.test(w)).length, 60, 'every row once');
  // A row's cells stand on one page: the row number and its date are always in the same stream.
  streams.forEach((words) => assert.equal(words.filter((w) => /^Row \d+$/.test(w)).length, words.filter((w) => w === '2026-10-30').length));
  // Right-aligned cells end at the column's right edge: two dates of different widths share no left x.
  const right = [...text.matchAll(/([\d.]+) ([\d.]+) Td <(323032362d31302d3330)> Tj/g)].map((m) => Number(m[1]));
  assert.ok(right.length === 60 && right.every((x) => Math.abs(x - right[0]) < 0.01), 'the same right edge for every date');
  // Without a header: no repeat, and a one-row table on one page.
  const small = PdfKit.flow([{ kind: 'table', rows: [['a', 'b']], size: 10 }], {});
  assert.equal(small.pages, 1);
});

test('a row taller than a page goes on over the pages, every line drawn inside the page, nothing cut', () => {
  // One cell of 1 200 words: far taller than an A4 page in its column.
  const long = Array.from({ length: 1200 }, (_, i) => `word${i}`).join(' ');
  const out = PdfKit.flow([
    { kind: 'table', columns: [{ width: 1 }, { width: 4 }, { width: 1.5 }], header: ['#', 'Issue', 'Owner'], rows: [['Row 0', 'short one', 'Lena'], ['Row 1', long, 'Maintenance'], ['Row 2', 'after it', 'Lena']], size: 9, leading: 12, space: 8 },
  ], { footer: (n, total) => ['Sheet', `Page ${n} of ${total}`] });
  const { text, pages } = parse(out.bytes);
  assert.ok(pages >= 2, `${pages} pages`);
  const streams = [...text.matchAll(/stream\n([\s\S]*?)\nendstream/g)].map((m) => m[1]);
  const words = streams.flatMap((s) => [...s.matchAll(/<([0-9a-f]+)> Tj/g)].map((x) => winAnsi(x[1])));
  const drawn = words.join(' ');
  for (const i of [0, 1, 599, 1199]) assert.ok(new RegExp(`\\bword${i}\\b`).test(drawn), `word${i} is drawn`);
  assert.ok(drawn.includes('Row 0') && drawn.includes('Row 2') && drawn.includes('Maintenance'), 'the rows around it and the other cells');
  streams.forEach((s, n) => assert.ok(/<4973737565> Tj/.test(s), `the header on page ${n + 1}`));
  // Every piece of text sits inside the page (A4 is 842 pt high, PDF y runs upward): the footer at 20 pt, the rows
  // above the bottom margin of 48 pt and below the top margin of 45 pt.
  const ys = streams.flatMap((s) => [...s.matchAll(/[\d.]+ ([\d.]+) Td </g)].map((m) => Number(m[1])));
  assert.ok(ys.length > 100, `${ys.length} text runs`);
  const inside = (y) => Math.abs(y - 20) < 0.01 || (y >= 48 && y <= 842 - 45);
  assert.ok(ys.every(inside), `a line outside the page: ${ys.filter((y) => !inside(y)).slice(0, 3)}`);
});
