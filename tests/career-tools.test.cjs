const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// The import, ATS CV, cover letter and Word scripts share one page-like context.
const context = {
  window: {},
  document: { querySelector: () => null, getElementById: () => null, currentScript: null },
  TextEncoder, TextDecoder, Blob, Response, DecompressionStream, URL,
};
for (const file of ['docx-kit', 'cv-import', 'ats-cv', 'cover-letter']) {
  vm.runInNewContext(fs.readFileSync(`src/js/${file}.js`, 'utf8'), context);
}
const { CvImport, AtsCv, CoverLetter } = context.window;
const plain = (value) => JSON.parse(JSON.stringify(value));
const atsData = JSON.parse(fs.readFileSync('src/_data/atsCv.json', 'utf8'));
const builderData = JSON.parse(fs.readFileSync('src/_data/cvBuilder.json', 'utf8'));
const letterData = JSON.parse(fs.readFileSync('src/_data/coverLetter.json', 'utf8'));

const SAMPLE = `MARIA ROSSI
Customer Service Team Leader
Milan | maria.rossi@example.com | +39 333 1234567

PROFILE
Team leader with 6 years in customer care for e-commerce.

EXPERIENCE
Team Leader Customer Care, Zalando – Milan        2021 – present
- Led 12 agents; CSAT from 82% to 91%.
- Built the escalation process for returns.
Customer Service Agent, Amazon – Rome        2018 – 2021
- Handled 60+ contacts per day.

EDUCATION
Laurea in Economics, University of Bologna, 2014 – 2017

SKILLS
Zendesk, Salesforce, Excel, coaching

LANGUAGES
Italian – native; English – C1; German – B1
`;

test('pasted CV text is sorted into contact, jobs, education, skills and languages', () => {
  const cv = plain(CvImport.parse(CvImport.textLines(SAMPLE)));
  assert.equal(cv.person.name, 'Maria Rossi');
  assert.equal(cv.person.headline, 'Customer Service Team Leader');
  assert.equal(cv.person.email, 'maria.rossi@example.com');
  assert.equal(cv.person.phone, '+39 333 1234567');
  assert.equal(cv.person.location, 'Milan');
  assert.equal(cv.experience.length, 2);
  assert.deepEqual([cv.experience[0].title, cv.experience[0].company, cv.experience[0].location, cv.experience[0].from, cv.experience[0].to],
    ['Team Leader Customer Care', 'Zalando', 'Milan', '2021', '']);
  assert.equal(cv.experience[0].bullets.split('\n').length, 2);
  assert.deepEqual([cv.education[0].title, cv.education[0].school, cv.education[0].date], ['Laurea in Economics', 'University of Bologna', '2014 – 2017']);
  assert.deepEqual(cv.languages.map((l) => `${l.name}:${l.level}`), ['Italian:native', 'English:C1', 'German:B1']);
  assert.equal(cv.docLang, 'en');
});

test('a PDF page is read column by column, and job dates stay with their job', () => {
  const item = (str, x, base, w, h = 8) => ({ str, x, base, w, h });
  const lines = plain(CvImport.pageLines([
    item('Profile text on the left', 40, 100, 200),
    item('continues here.', 40, 112, 80),
    item('Box on the right', 330, 104, 150),
    item('with a second line', 330, 116, 150),
    item('Night Manager', 40, 160, 80),
    item('11.2025 – heute', 480, 160, 60),
  ])).map((line) => line.text);
  assert.deepEqual(lines, ['Profile text on the left', 'continues here.', 'Box on the right', 'with a second line', 'Night Manager  11.2025 – heute']);
});

test('headings in three languages are recognised, sentences are not', () => {
  const { sectionOf } = CvImport;
  assert.equal(sectionOf('BERUFSERFAHRUNG – DEUTSCHLAND'), 'experience');
  assert.equal(sectionOf('Përvoja e punës'), 'experience');
  assert.equal(sectionOf('Ausbildung und Zertifikate'), 'education');
  assert.equal(sectionOf('Kernkompetenzen'), 'skills');
  assert.equal(sectionOf('Volunteer – Tourism Festival Durrës'), null);
  assert.equal(sectionOf('Night Manager mit über drei Jahren Erfahrung in Hotels'), null);
});

test('the Word file of the ATS CV opens again as the same CV', async () => {
  const example = AtsCv.clean(AtsCv.fromBuilder({ ...builderData.examples.de, docLang: 'de' }, { de: 'Nebenberufliche Tätigkeiten' }), atsData, 'de');
  const bytes = AtsCv.docx(example, atsData);
  const xml = await CvImport.unzip(bytes.buffer, 'word/document.xml');
  assert.match(xml, /<w:pStyle w:val="Heading1"\/><\/w:pPr><w:r><w:t xml:space="preserve">Berufserfahrung<\/w:t>/);
  const back = plain(CvImport.parse(CvImport.docxLines(xml)));
  assert.equal(back.person.name, 'Elena Marku');
  assert.equal(back.person.email, 'elena.marku@example.com');
  assert.equal(back.experience.length, 4);
  assert.equal(back.experience[1].title, 'Night Manager');
  assert.equal(back.experience[1].company, 'Riverside City Hotel');
  assert.equal(back.education.length, 2);
  assert.equal(back.languages.length, 4);
  assert.equal(back.extras[0].title, 'Nebenberufliche Tätigkeiten');
});

test('job ad keywords skip filler words and match word forms', () => {
  const stop = atsData.stopwords.split(/\s+/);
  const terms = AtsCv.keywords('Wir suchen einen Night Manager (m/w/d). Night Audit, Opera PMS und Night Audit Erfahrung. Opera PMS ist Pflicht.', stop);
  assert.ok(terms.includes('night audit'));
  assert.ok(terms.includes('opera pms'));
  assert.ok(!terms.includes('wir') && !terms.includes('pflicht'));
  assert.ok(AtsCv.hasTerm('kommunikationsstark und kommunikativ', 'kommunikation'));
  // Addresses and abbreviations are not key words.
  const ad = 'Front-Office Agent für unser Hotel, z.B. Night-Audit und Check-in. Bewerbung an jobs@hotel.de oder www.hotel.de, siehe hotel.de/jobs.';
  const found = AtsCv.keywords(ad, stop);
  assert.ok(found.includes('front-office') && found.includes('night-audit') && found.includes('check-in'));
  assert.ok(!found.some((term) => /hotel\.de|jobs@|www\.|^z\.b/.test(term)), `no addresses in ${found}`);
  // A hyphen in the ad or in the CV makes no difference.
  const text = 'Front Office Agent. Night Audit, Checkin und Check-out.';
  assert.ok(AtsCv.hasTerm(text, 'front-office') && AtsCv.hasTerm(text, 'night-audit') && AtsCv.hasTerm(text, 'check-in') && AtsCv.hasTerm(text, 'check out'));
  assert.ok(AtsCv.hasTerm('Front-Office Agent', 'front office'));
  assert.ok(!AtsCv.hasTerm('Front Office Agent', 'back-office'));
  // The stem rule applies to words only, not to addresses.
  assert.ok(!AtsCv.hasTerm('im hotel gearbeitet', 'hotel.de'));
  // Headings are not part of the matched text: an empty education section does not "have" Ausbildung.
  const cv = AtsCv.clean(AtsCv.fromBuilder(builderData.examples.en), atsData, 'de');
  cv.education = [];
  const matched = AtsCv.plainText(cv, atsData.docLangs.de, { headings: false }).toLowerCase();
  assert.ok(!matched.includes(atsData.docLangs.de.headings.education.toLowerCase()));
  assert.ok(AtsCv.plainText(cv, atsData.docLangs.de).includes(atsData.docLangs.de.headings.experience.toUpperCase()));
});

test('the plain text keeps an empty line between jobs', () => {
  const cv = AtsCv.clean(AtsCv.fromBuilder(builderData.examples.en), atsData, 'en');
  const text = AtsCv.plainText(cv, atsData.docLangs.en);
  assert.match(text, /^Elena Marku\n/);
  assert.match(text, /\n\nWORK EXPERIENCE\nFront Office Manager\n/);
  assert.match(text, /no-show billing with the finance team\.\n\nNight Manager\n/);
});

test('the cover letter greets by name and writes a draft from the answers given', () => {
  const data = { letter: letterData, themes: builderData.themes, fonts: atsData.fonts, accents: atsData.accents };
  const letter = CoverLetter.clean({ docLang: 'de', recipient: { company: 'Seaview Grand Hotel', contact: 'Anna Weber', gender: 'f' }, draft: { role: 'Hotel Managerin', years: 'acht Jahre' } }, data, 'de');
  const doc = letterData.docLangs.de;
  assert.equal(CoverLetter.salutationOf(letter, doc), 'Sehr geehrte Frau Weber,');
  assert.deepEqual(plain(CoverLetter.addressLines(letter, doc)), ['Seaview Grand Hotel', 'Frau Anna Weber']);
  assert.equal(CoverLetter.subjectOf(letter, doc), 'Bewerbung als Hotel Managerin');
  // A sentence is used only when all its answers are there; the closing always is.
  assert.equal(CoverLetter.draftBody(letter, doc), 'mit großem Interesse habe ich Ihre Stellenanzeige für die Position als Hotel Managerin gelesen.\n\n'
    + 'Über die Einladung zu einem persönlichen Gespräch freue ich mich sehr.');
  letter.recipient.gender = '';
  assert.equal(CoverLetter.salutationOf(letter, doc), 'Sehr geehrte Damen und Herren,');
  assert.match(CoverLetter.plainText(letter, data, new Date(2026, 8, 28)), /28\. September 2026/);
});

test('a career path with arrows stays one section, and a year inside a sentence is not a job', () => {
  const text = `Max Beispiel
Night Manager
max@example.com | 0170 1234567

PROFIL
Erfahrener Night Manager mit 14 Jahren in der Hotellerie.

KARRIEREPROFIL
Guest Service → Night Audit →

Senior Night Audit → Shift

Leader → Night Manager
Kontinuierliche Laufbahn im Frankfurter Hotelmarkt seit 2012, mit wachsender
Verantwortung im Nachtbetrieb.

BERUFSERFAHRUNG
Night Manager        07/2023 – 09/2026
Beispiel Hotel | Frankfurt
- Leitung des Nachtbetriebs seit 2024 mit zwei Kollegen.
`;
  const cv = plain(CvImport.parse(CvImport.textLines(text)));
  assert.equal(cv.summary, 'Erfahrener Night Manager mit 14 Jahren in der Hotellerie.');
  assert.deepEqual(cv.extras, [{
    title: 'Karriereprofil',
    text: 'Guest Service → Night Audit → Senior Night Audit → Shift Leader → Night Manager\n'
      + 'Kontinuierliche Laufbahn im Frankfurter Hotelmarkt seit 2012, mit wachsender Verantwortung im Nachtbetrieb.',
  }]);
  assert.equal(cv.experience.length, 1);
  assert.deepEqual([cv.experience[0].title, cv.experience[0].company, cv.experience[0].from, cv.experience[0].to], ['Night Manager', 'Beispiel Hotel', '07/2023', '09/2026']);
  assert.equal(cv.experience[0].bullets, 'Leitung des Nachtbetriebs seit 2024 mit zwei Kollegen.');
});
