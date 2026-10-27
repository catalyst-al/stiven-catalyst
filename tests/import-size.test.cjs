const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { openTool, settle, keep } = require('./helpers/tool-page.cjs');

// A file the visitor picks is read whole into one string before anything looks at it, so a file of hundreds of
// megabytes holds the tab. Each JSON import checks the size the browser states (File.size) first and refuses with its
// own message, without reading the file. The limits, far above any real file:
//   ATS CV, a JSON Resume or a text CV   5 MB   (a JSON Resume is a few kilobytes; with a photo inside, under 2 MB)
//   All your work in one file           40 MB   (the work plus at most 20 MB of photos, about 27 MB in base64)
//   Coaching backup                      5 MB   (tests/coaching-import.test.cjs)
//   Template pack                        2 MB   (tests/template-pack.test.cjs; already in place)

// A picked file that remembers whether anything read it.
const bigFile = (name, size, type = '') => {
  const file = { name, size, type, read: false };
  file.text = async () => { file.read = true; return '{}'; };
  file.arrayBuffer = async () => { file.read = true; return new ArrayBuffer(2); };
  return file;
};
const choose = (w, input, file) => {
  Object.defineProperty(input, 'files', { configurable: true, value: [file] });
  input.dispatchEvent(new w.Event('change', { bubbles: true }));
};

const ATS = {
  en: 'This file is larger than 5 MB, far larger than any CV. Nothing was changed.',
  de: 'Diese Datei ist größer als 5 MB, weit größer als jeder Lebenslauf. Nichts wurde geändert.',
  sq: 'Ky skedar është më i madh se 5 MB, shumë më i madh se çdo CV. Asgjë nuk ndryshoi.',
};
for (const lang of ['en', 'de', 'sq']) {
  test(`ATS CV (${lang}): a JSON Resume or text file over 5 MB is refused unread`, async () => {
    const w = openTool('ats-cv', { lang });
    for (const file of [bigFile('resume.json', 5 * 1024 * 1024 + 1, 'application/json'), bigFile('cv.txt', 50e6, 'text/plain')]) {
      choose(w, w.document.querySelector('[data-import-file]'), file);
      await settle(w, 20);
      assert.equal(w.document.querySelector('[data-import-note]').textContent, ATS[lang], file.name);
      assert.equal(file.read, false, `${file.name} was read`);
    }
    assert.equal(keep(w)['sc-ats-cv'], undefined, 'nothing was saved');
  });
}

test('ATS CV: a JSON Resume under the limit is still imported', async () => {
  const w = openTool('ats-cv');
  const resume = JSON.stringify({ basics: { name: 'Ana Muster', email: 'ana@example.com' }, work: [{ name: 'Hotel Nord', position: 'Night Manager', startDate: '2020-01' }] });
  choose(w, w.document.querySelector('[data-import-file]'), new File([resume], 'resume.json', { type: 'application/json' }));
  await settle(w, 50);
  assert.equal(keep(w)['sc-ats-cv'].person.name, 'Ana Muster');
});

const WORK = {
  en: 'This file is larger than 40 MB; a work file from this site is never that large. Nothing was changed.',
  de: 'Diese Datei ist größer als 40 MB; eine Arbeitsdatei dieser Website ist nie so groß. Nichts wurde geändert.',
  sq: 'Ky skedar është më i madh se 40 MB; një skedar pune i kësaj faqeje nuk është kurrë kaq i madh. Asgjë nuk ndryshoi.',
};
for (const lang of ['en', 'de', 'sq']) {
  test(`All your work in one file (${lang}): a file over 40 MB is refused unread with its own message`, async () => {
    const w = openTool('pareto', { lang });
    w.eval(fs.readFileSync('src/js/work-backup.js', 'utf8'));
    const file = bigFile('work.json', 40 * 1024 * 1024 + 1, 'application/json');
    choose(w, w.document.querySelector('[data-work-open]'), file);
    await settle(w, 20);
    assert.equal(w.document.querySelector('[data-work-status]').textContent, WORK[lang]);
    assert.equal(file.read, false);
  });
}
