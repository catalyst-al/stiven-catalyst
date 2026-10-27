const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');

// A CV made by the site's own tools must come back whole when it is dropped into the ATS CV: the phone number with its
// "+", every job with its title, employer and dates in order. The files are made by the real tools: the CV Builder's
// print to PDF (tests/fixtures/career/cv-builder-*.pdf, made by make-cv-builder-pdfs.cjs there), the ATS CV's own PDF
// (pdf-kit.js), its Word file (docx-kit.js) and its JSON Resume file. They are read with the importer's real code,
// pdf.js included (the vendored legacy build runs in Node as it does in the browser).
const context = {
  window: {},
  document: { querySelector: () => null, getElementById: () => null, currentScript: null },
  TextEncoder, TextDecoder, Blob, Response, DecompressionStream, URL,
};
for (const file of ['docx-kit', 'pdf-kit', 'cv-import', 'ats-cv']) {
  vm.runInNewContext(fs.readFileSync(`src/js/${file}.js`, 'utf8'), context, { importModuleDynamically: vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });
}
const { CvImport, AtsCv } = context.window;
const plain = (value) => JSON.parse(JSON.stringify(value));
const atsData = JSON.parse(fs.readFileSync('src/_data/atsCv.json', 'utf8'));
const builderData = JSON.parse(fs.readFileSync('src/_data/cvBuilder.json', 'utf8'));
const PDFJS = pathToFileURL(path.resolve('src/js/vendor/pdfjs/pdf.min.mjs')).href;
const PDFJS_WORKER = pathToFileURL(path.resolve('src/js/vendor/pdfjs/pdf.worker.min.mjs')).href;

before(async () => {
  // pdf.js says once, on loading, that Node has no canvas; text needs none.
  const log = console.log;
  console.log = () => {};
  try { await import(PDFJS); } finally { console.log = log; }
});

const asFile = (bytes) => ({ arrayBuffer: async () => Uint8Array.from(bytes).buffer });
const readPdf = async (bytes) => plain(CvImport.parse(await CvImport.readPdf(asFile(bytes), PDFJS, PDFJS_WORKER)));
// "03.2022" or "2016" as a number that sorts: 2022.03, 2016.
const when = (date) => {
  const m = /^(?:(\d{1,2})[./])?(\d{4})$/.exec(String(date).trim());
  return m ? Number(m[2]) + (m[1] ? Number(m[1]) / 100 : 0) : NaN;
};
// A CV Builder example as the ATS CV takes it in ("From the CV Builder"), with the side headings the page passes.
const sideTitles = Object.fromEntries(Object.entries(builderData.docLangs).map(([code, doc]) => [code, doc.headings.side]));
const fromBuilder = (lang) => AtsCv.fromBuilder({ ...builderData.examples[lang], docLang: lang }, sideTitles);
const jobsOf = (lang) => fromBuilder(lang).experience;
const assertSameJobs = (cv, lang, how) => {
  const want = jobsOf(lang);
  assert.equal(cv.experience.length, want.length, `${how}: ${want.length} jobs, got ${JSON.stringify(cv.experience.map((job) => job.title))}`);
  want.forEach((job, i) => {
    const got = cv.experience[i];
    assert.equal(got.title, job.title, `${how}: title of job ${i + 1}`);
    assert.equal(got.company, job.company, `${how}: employer of job ${i + 1}`);
    assert.equal(got.from, job.from, `${how}: start of job ${i + 1}`);
    assert.equal(got.to, job.to, `${how}: end of job ${i + 1}`);
    if (got.to) assert.ok(when(got.from) <= when(got.to), `${how}: ${got.from} before ${got.to}`);
    assert.equal(got.bullets.split('\n').length, job.bullets.split('\n').filter((line) => line.trim()).length, `${how}: bullets of job ${i + 1}`);
  });
};
const PERSON = builderData.examples.en.person;

for (const lang of ['en', 'de', 'sq']) {
  test(`the CV Builder's printed PDF (${lang}) opens in the ATS CV with its phone, dashes, jobs and dates`, async () => {
    const cv = await readPdf(fs.readFileSync(`tests/fixtures/career/cv-builder-${lang}.pdf`));
    const example = builderData.examples[lang];
    assert.equal(cv.person.name, example.person.name);
    assert.equal(cv.person.phone, '+49 170 1234567', 'the "+" of the country code stays');
    assert.equal(cv.person.email, example.person.email);
    assertSameJobs(cv, lang, `cv-builder-${lang}.pdf`);
    // No job lands as raw text in a section of its own.
    assert.ok(!cv.extras.some((extra) => /Lakeside Grand Hotel|Riverside City Hotel/.test(extra.text)), JSON.stringify(cv.extras.map((extra) => extra.title)));
    // Date ranges keep their order and their dash, in the side activities and the education too.
    const all = JSON.stringify(cv);
    assert.ok(all.includes('2015 – 2017') && !/2017[^"]{0,6}2015/.test(all), 'the volunteering dates in order');
    assert.ok(cv.education.some((item) => item.date === '2012 – 2016'), JSON.stringify(cv.education.map((item) => item.date)));
    assert.ok(cv.education.some((item) => item.title === 'Opera PMS – Advanced User'), 'the dash inside a title');
  });

  test(`the ATS CV's own PDF, Word file and JSON Resume (${lang}) open again as the same CV`, async () => {
    const cv = AtsCv.clean(fromBuilder(lang), atsData, lang);
    const fromPdf = await readPdf(AtsCv.pdf(cv, atsData).bytes);
    const fromWord = plain(CvImport.parse(CvImport.docxLines(await CvImport.unzip(AtsCv.docx(cv, atsData).buffer, 'word/document.xml'))));
    const fromJson = plain(AtsCv.clean(AtsCv.fromJsonResume(JSON.parse(JSON.stringify(AtsCv.toJsonResume(cv)))), atsData, lang));
    for (const [how, back] of [['PDF', fromPdf], ['Word', fromWord], ['JSON Resume', fromJson]]) {
      assert.equal(back.person.name, PERSON.name, how);
      assert.equal(back.person.phone, '+49 170 1234567', `${how}: phone`);
      assert.equal(back.person.email, PERSON.email, `${how}: email`);
      assertSameJobs(back, lang, how);
    }
  });
}

test('a glyph a PDF holds without its letter is named by its place, or dropped', () => {
  // The way readPdf passes such a glyph on: U+FFFD, as an item of its own.
  const U = String.fromCharCode(0xfffd);
  const line = (...parts) => {
    let x = 40;
    const items = parts.map((str) => { const item = { str, x, base: 100, w: str.length * 5, h: 9 }; x += item.w; return item; });
    return plain(CvImport.pageLines(items)).map((l) => l.text).join(' / ');
  };
  assert.equal(line('Tel. ', U, '49 170 1234567'), 'Tel. +49 170 1234567');
  assert.equal(line('Tel. ', U, '0170 1234567'), 'Tel. 0170 1234567', 'no country code starts with 0: an icon');
  assert.equal(line('20', U, ' new staff'), '20+ new staff');
  assert.equal(line('2015 ', U, ' 2017'), '2015 – 2017');
  assert.equal(line('Agent ', U, 'Sommersaisons', U), 'Agent (Sommersaisons)');
  assert.equal(line('KPI', U, 'Besprechungen'), 'KPI-Besprechungen');
});
