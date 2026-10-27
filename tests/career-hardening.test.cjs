const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');

// The PDF writer and the JSON Resume import of the ATS CV take text and files from anyone: a CV pasted from Word, a
// file from another CV tool, a backup someone sent. Neither may break the file, the page or the saved CV.
const context = {
  window: {},
  document: { querySelector: () => null, getElementById: () => null, currentScript: null },
  TextEncoder, TextDecoder, Blob, Response, DecompressionStream, URL,
};
for (const file of ['docx-kit', 'pdf-kit', 'cv-import', 'ats-cv', 'cv-builder', 'cover-letter']) {
  vm.runInNewContext(fs.readFileSync(`src/js/${file}.js`, 'utf8'), context, { importModuleDynamically: vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });
}
const { PdfKit, CvImport, AtsCv, CvBuilder, CoverLetter } = context.window;
const plain = (value) => JSON.parse(JSON.stringify(value));
const atsData = JSON.parse(fs.readFileSync('src/_data/atsCv.json', 'utf8'));
const builderData = JSON.parse(fs.readFileSync('src/_data/cvBuilder.json', 'utf8'));
const letterData = JSON.parse(fs.readFileSync('src/_data/coverLetter.json', 'utf8'));
const PDFJS = pathToFileURL(path.resolve('src/js/vendor/pdfjs/pdf.min.mjs')).href;
let pdfjs;
before(async () => {
  const log = console.log;
  console.log = () => {};
  try { pdfjs = await import(PDFJS); } finally { console.log = log; }
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('src/js/vendor/pdfjs/pdf.worker.min.mjs')).href;
});
// The text of every page as pdf.js reads it, and the drawing operations of the file.
const pdfText = async (bytes) => {
  const doc = await pdfjs.getDocument({ data: Uint8Array.from(bytes), isEvalSupported: false }).promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) pages.push((await (await doc.getPage(n)).getTextContent()).items.map((item) => item.str).join(''));
  await doc.destroy();
  return pages;
};
const latin1 = (bytes) => Buffer.from(bytes).toString('latin1');
// WinAnsi bytes as text: the few above 127 that differ from Latin-1 and that the tests use.
const WIN = { 0x80: '€', 0x85: '…', 0x91: '‘', 0x92: '’', 0x93: '“', 0x94: '”', 0x95: '•', 0x96: '–', 0x97: '—' };
const winAnsi = (bytes) => [...bytes].map((b) => WIN[b] || String.fromCharCode(b)).join('');
const texts = (bytes) => [...latin1(bytes).matchAll(/BT \/F\d+ ([\d.]+) Tf [^T]*?([\d.]+) ([\d.]+) Td <([0-9a-f]+)> Tj ET/g)]
  .map((m) => ({ size: Number(m[1]), x: Number(m[2]), y: Number(m[3]), text: winAnsi(Buffer.from(m[4], 'hex')) }));

test('text that looks like PDF syntax is written as text: the file keeps its structure and reads back as typed', async () => {
  const evil = 'Name) Tj ET BT /F1 99 Tf (x) \\ \\\\ ( ) %%EOF endstream endobj trailer << /Root 1 0 R >>\nline two\r\nthree';
  const file = PdfKit.flow([{ kind: 'text', text: evil, size: 10 }, { kind: 'row', left: evil, right: '(2020)', size: 10 }], { title: evil, author: '\\)(' });
  const raw = latin1(file.bytes);
  assert.equal((raw.match(/%%EOF/g) || []).length, 1, 'one end of file');
  assert.equal((raw.match(/\nendstream/g) || []).length, file.pages);
  // Every object starts where the table says.
  const offsets = [...raw.matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]));
  offsets.forEach((at, i) => assert.equal(raw.slice(at, at + `${i + 1} 0 obj`.length), `${i + 1} 0 obj`));
  const read = (await pdfText(file.bytes)).join(' ');
  for (const part of ['Name) Tj ET BT /F1 99 Tf (x)', '\\ \\\\ ( )', '%%EOF endstream', 'line two three']) assert.ok(read.includes(part), `${part} in ${read}`);
});

test('letters outside WinAnsi become their nearest letter, spaces and dashes from Word stay spaces and dashes', () => {
  const enc = (text) => winAnsi(PdfKit.encode(text));
  assert.equal(enc('10 % und z. B.'), '10 % und z. B.', 'narrow and thin spaces');
  assert.equal(enc('non‑breaking ‐ hyphen, − 5, 2015‒2017, a―b'), 'non-breaking - hyphen, - 5, 2015–2017, a—b');
  assert.equal(enc('zero​width﻿'), 'zerowidth');
  assert.equal(enc('Łukasz Łódź, Đorđe, Iğdır'), 'Lukasz Lódz, Ðordje, Igdir');
  assert.equal(enc('Guest Service → Night Audit ⇒ Manager'), 'Guest Service -> Night Audit => Manager');
  assert.equal(enc('😀 ✓'), '? ?', 'what has no letter stays visible as "?"');
  // The width follows the letters written.
  assert.equal(PdfKit.width('a‑b', 'Helvetica', 10), PdfKit.width('a-b', 'Helvetica', 10));
  assert.equal(PdfKit.width('a→b', 'Helvetica', 10), PdfKit.width('a->b', 'Helvetica', 10));
});

test('a long date at the right of a title is wrapped in its own column, and a long footer is cut to fit', () => {
  const title = 'Front Office Manager and Night Audit Lead for two hotels in the airport district';
  const right = 'since March 2019 until today, part-time in the evenings';
  const file = PdfKit.flow([{ kind: 'row', left: title, right, size: 10 }], { footer: () => [`${'Elena Marku '.repeat(20)}· CV`, 'Page 1 of 1'] });
  const items = texts(file.bytes);
  const width = (item) => PdfKit.width(item.text, 'Helvetica-Bold', item.size);
  const rightItems = items.filter((item) => right.includes(item.text.trim()) && item.y > 100);
  const leftItems = items.filter((item) => title.includes(item.text.trim()) && item.y > 100);
  assert.equal(rightItems.map((item) => item.text).join(' '), right, 'all of the date');
  assert.equal(leftItems.map((item) => item.text).join(' '), title, 'all of the title');
  const leftEnd = Math.max(...leftItems.map((item) => item.x + width(item)));
  const rightStart = Math.min(...rightItems.map((item) => item.x));
  assert.ok(leftEnd < rightStart, `the title ends at ${leftEnd}, the date starts at ${rightStart}`);
  assert.ok(rightItems.every((item) => item.x + width(item) <= 595.28 - 54 + 0.01), 'the date stays inside the margin');
  const foot = items.filter((item) => item.y < 30);
  const name = foot.find((item) => item.text.startsWith('Elena'));
  const page = foot.find((item) => item.text.startsWith('Page'));
  assert.ok(name.text.endsWith('…') && name.x + PdfKit.width(name.text, 'Helvetica', name.size) < page.x, 'the name is cut before the page number');
});

test('an ATS CV with a job of 70 bullet points keeps every one in its PDF, over as many pages as it needs', async () => {
  const cv = AtsCv.clean(AtsCv.fromBuilder(builderData.examples.en), atsData, 'en');
  cv.experience[0].bullets = Array.from({ length: 70 }, (_, i) => `Bullet ${i + 1} with a result of ${i + 10}%.`).concat('FINAL-BULLET-MARKER').join('\n');
  const file = AtsCv.pdf(cv, atsData);
  const read = (await pdfText(file.bytes)).join(' ');
  for (let i = 1; i <= 70; i++) assert.ok(read.includes(`Bullet ${i} with`), `bullet ${i}`);
  assert.ok(read.includes('FINAL-BULLET-MARKER'));
  assert.ok(file.pages >= 3);
});

test('a document language that is a property of every object ("constructor", "__proto__") is not a language', () => {
  const letterSetup = { letter: letterData, themes: builderData.themes, fonts: atsData.fonts, accents: atsData.accents };
  for (const lang of ['constructor', '__proto__', 'toString', 'hasOwnProperty']) {
    const ats = AtsCv.clean({ docLang: lang }, atsData, 'de');
    assert.equal(ats.docLang, 'de', `ATS CV: ${lang}`);
    assert.doesNotThrow(() => AtsCv.plainText(ats, atsData.docLangs[ats.docLang]));
    assert.equal(CvBuilder.clean({ docLang: lang }, builderData, 'sq').docLang, 'sq', `CV Builder: ${lang}`);
    assert.equal(CoverLetter.clean({ docLang: lang }, letterSetup, 'en').docLang, 'en', `Cover letter: ${lang}`);
    // Nor through a JSON Resume file.
    const file = { basics: { name: 'Nora' }, meta: { stivenCatalyst: { docLang: lang } } };
    assert.equal(AtsCv.clean(AtsCv.fromJsonResume(file), atsData, 'en').docLang, 'en');
  }
  // The page language is a real one, else English.
  assert.equal(AtsCv.clean({}, atsData, 'constructor').docLang, 'en');
});

test('a JSON Resume file cannot pollute objects, and its HTML stays text in the CV, the Word file and the PDF', async () => {
  const json = `{"__proto__": {"polluted": "yes"}, "constructor": {"prototype": {"polluted": "yes"}},
    "basics": {"name": "<img src=x onerror=alert(1)>", "__proto__": {"polluted": "yes"}, "label": "<script>alert(1)</script> & co",
      "location": {"city": "Tirana", "__proto__": {"polluted": "yes"}}},
    "work": [{"name": "A & B <GmbH>", "position": "Lead \\"Ops\\"", "startDate": "2020-01", "highlights": ["</w:t><w:t>injected", 5, {"x": 1}, null]}],
    "meta": {"stivenCatalyst": {"headings": {"__proto__": {"polluted": "yes"}, "summary": "<b>Me</b>", "x": "y"}, "extras": [{"title": "T", "text": "x", "__proto__": {"polluted": "yes"}}, "s", null]}}}`;
  const cv = plain(AtsCv.clean(AtsCv.fromJsonResume(JSON.parse(json)), atsData, 'en'));
  assert.equal(({}).polluted, undefined);
  assert.equal(Object.prototype.polluted, undefined);
  assert.deepEqual(Object.keys(cv).sort(), Object.keys(AtsCv.SHAPE).sort());
  assert.deepEqual(Object.keys(cv.headings).sort(), Object.keys(AtsCv.SHAPE.headings).sort());
  assert.equal(cv.person.name, '<img src=x onerror=alert(1)>');
  assert.equal(cv.headings.summary, '<b>Me</b>');
  assert.deepEqual(cv.experience[0], { title: 'Lead "Ops"', company: 'A & B <GmbH>', location: '', from: '01.2020', to: '', bullets: '</w:t><w:t>injected\n5' });
  assert.deepEqual(cv.extras, [{ title: 'T', text: 'x' }]);
  // The Word file is still valid XML and reads back the same text.
  const xml = await CvImport.unzip(AtsCv.docx(AtsCv.clean(cv, atsData, 'en'), atsData).buffer, 'word/document.xml');
  assert.ok(!xml.includes('<w:t>injected') && xml.includes('&lt;/w:t&gt;&lt;w:t&gt;injected'));
  const back = plain(CvImport.parse(CvImport.docxLines(xml)));
  assert.equal(back.person.name, '<img src=x onerror=alert(1)>');
  assert.equal(back.experience[0].company, 'A & B <GmbH>');
  const read = (await pdfText(AtsCv.pdf(AtsCv.clean(cv, atsData, 'en'), atsData).bytes)).join(' ');
  assert.ok(read.includes('<img src=x onerror=alert(1)>') && read.includes('A & B <GmbH>'));
});

test('a JSON Resume round trip keeps a date range with more in it, and an empty or odd file is no CV', () => {
  const cv = AtsCv.clean({
    education: [
      { title: 'BA Tourism', school: 'University of Tirana', date: '09.2012 – 06.2016 (part-time)', detail: '' },
      { title: 'ADR', school: 'DEKRA', date: '2019-2021', detail: '' },
      { title: 'Course', school: 'IHK', date: 'since 2023', detail: '' },
    ],
  }, atsData, 'en');
  const back = AtsCv.clean(AtsCv.fromJsonResume(JSON.parse(JSON.stringify(AtsCv.toJsonResume(cv)))), atsData, 'en');
  assert.deepEqual(plain(back.education.map((item) => item.date)), ['09.2012 – 06.2016 (part-time)', '2019 – 2021', 'since 2023']);
  for (const odd of [null, 1, 'x', [], {}, { basics: 'x' }, { work: {} }]) assert.equal(AtsCv.fromJsonResume(odd), null, JSON.stringify(odd));
});
