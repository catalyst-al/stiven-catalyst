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
for (const file of ['docx-kit', 'pdf-kit', 'cv-import', 'ats-cv', 'cover-letter']) {
  vm.runInNewContext(fs.readFileSync(`src/js/${file}.js`, 'utf8'), context);
}
const { CvImport, AtsCv, CoverLetter } = context.window;
const plain = (value) => JSON.parse(JSON.stringify(value));
// The bytes of a string as the file writes them (WinAnsi): the few characters above 127 that the tests use.
const WIN = { 0x80: '€', 0x85: '…', 0x91: '‘', 0x92: '’', 0x93: '“', 0x94: '”', 0x95: '•', 0x96: '–', 0x97: '—' };
const winAnsi = (hex) => [...Buffer.from(hex, 'hex')].map((b) => WIN[b] || String.fromCharCode(b)).join('');
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
  // A word inside another word is not the word: the match must not tell a CV it has Excel or Lean when it does not.
  const cvText = 'Excellent guest service. Cleaning schedules. Things disappear from the store. JavaScript basics.';
  for (const term of ['excel', 'lean', 'sap', 'java']) assert.ok(!AtsCv.hasTerm(cvText, term), term);
  assert.ok(AtsCv.hasTerm('Excel, Lean and SAP; Java', 'excel') && AtsCv.hasTerm('SAP-Kenntnisse', 'sap'), 'a whole word, also before a hyphen');
  assert.ok(AtsCv.hasTerm('Night audits and leadership skills', 'night audit') && AtsCv.hasTerm('leadership skills', 'skill'), 'a plural ending may follow');
  assert.ok(!AtsCv.hasTerm('Check inventory daily', 'check-in'), 'two words end with their word');
  assert.ok(AtsCv.hasTerm('Kundenservice und Lagerlogistik', 'lagerlogistik') && AtsCv.hasTerm('Lagerlogistikerin', 'lagerlogistik'), 'a long word may run on');
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

test('a job line above its own dates is split into title, company and place, and CEFR levels are read', () => {
  const cv = plain(CvImport.parse(CvImport.textLines([
    'Jane Doe', 'Shift Lead', 'jane@example.com | +49 170 1234567 | Frankfurt',
    'EXPERIENCE',
    'Shift Lead, DHL, Frankfurt', '01.2020 – today', '- Led 25 people',
    'Team Leader | Zalando | Berlin', '03.2017 – 12.2019', '- Ran the night shift',
    'Dispatcher at Hermes, Hamburg', '2015 – 2017',
    'LANGUAGES', 'German B2, English C1, Albanian (native)',
  ].join('\n'))));
  assert.deepEqual(cv.experience.map((e) => [e.title, e.company, e.location]), [
    ['Shift Lead', 'DHL', 'Frankfurt'], ['Team Leader', 'Zalando', 'Berlin'], ['Dispatcher', 'Hermes', 'Hamburg'],
  ]);
  assert.deepEqual(cv.languages, [{ name: 'German', level: 'B2' }, { name: 'English', level: 'C1' }, { name: 'Albanian', level: 'native' }]);
});

test('a key word of the ad counts through another word for the same skill, and the required part weighs double', () => {
  const skills = JSON.parse(fs.readFileSync('src/_data/atsSkills.json', 'utf8'));
  const stop = atsData.stopwords.split(/\s+/);
  // Every group holds at least two words, none twice across groups.
  const seen = new Map();
  for (const group of skills.groups) {
    assert.ok(group.length >= 2, group.join(', '));
    for (const word of group) {
      assert.ok(!seen.has(word.toLowerCase()), `"${word}" in two groups`);
      seen.set(word.toLowerCase(), group);
    }
  }
  assert.deepEqual(plain(AtsCv.groupOf('Staplerschein', skills.groups)), plain(AtsCv.groupOf('forklift licence', skills.groups)));
  assert.equal(AtsCv.groupOf('zebra', skills.groups), null);
  const cvText = 'Staplerschein seit 2019. Teamleitung von 12 Mitarbeitenden in der Lagerlogistik. Excel-Auswertungen.';
  assert.deepEqual(plain(AtsCv.findTerm(cvText, 'forklift', skills.groups)), { found: true, via: 'staplerschein' });
  assert.deepEqual(plain(AtsCv.findTerm(cvText, 'staplerschein', skills.groups)), { found: true, via: null }, 'the word itself first');
  assert.deepEqual(plain(AtsCv.findTerm(cvText, 'team leader', skills.groups)), { found: true, via: 'teamleiter' }, 'the first word of the group that the CV has');
  assert.deepEqual(plain(AtsCv.findTerm(cvText, 'sap', skills.groups)), { found: false, via: null });
  // The parts of an ad: a short heading line opens the required or the optional part; "Excel" in a sentence is no heading.
  const ad = 'Wir sind ein Logistiker in Frankfurt.\nIhre Aufgaben:\nKommissionierung und Verladung.\nIhr Profil\n- Staplerschein\n- SAP Kenntnisse\n- Teamleitung\nWünschenswert:\n- Englisch\nWir bieten:\nExcel Schulungen und ein nettes Team.';
  const parts = AtsCv.adParts(ad, skills);
  assert.match(parts.required, /Staplerschein[\s\S]*Teamleitung/);
  assert.ok(!parts.required.includes('Englisch') && parts.optional.includes('Englisch'));
  assert.ok(parts.other.includes('Kommissionierung') && parts.other.includes('Excel Schulungen'));
  const terms = AtsCv.keywords(ad, stop);
  const result = AtsCv.match(cvText, terms, skills, ad);
  const by = Object.fromEntries(result.items.map((item) => [item.term, item]));
  assert.equal(by.staplerschein.weight, 2);
  assert.equal(by.sap.weight, 2);
  assert.equal(by.englisch.weight, 1);
  assert.equal(by.kommissionierung.weight, 1);
  assert.ok(result.required >= 3);
  // Found 2-weight words count double in the score; without any heading every word weighs one.
  const found = result.items.filter((item) => item.found).reduce((sum, item) => sum + item.weight, 0);
  const total = result.items.reduce((sum, item) => sum + item.weight, 0);
  assert.equal(result.score, found / total);
  const flat = AtsCv.match(cvText, terms, skills, 'Staplerschein und SAP und Teamleitung');
  assert.ok(flat.items.every((item) => item.weight === 1) && flat.required === 0);
  // Without the skills file the match is the plain one.
  assert.deepEqual(plain(AtsCv.findTerm(cvText, 'forklift')), { found: false, via: null });
});

test('the ATS CV saves as a PDF of its own: the pages of the preview in points, in the standard fonts, with the text readable', () => {
  const cv = AtsCv.clean(AtsCv.fromBuilder(builderData.examples.de), atsData, 'de');
  cv.docLang = 'de';
  cv.font = 'georgia';
  cv.accent = 'navy';
  cv.summary += '\n\nZweiter Absatz mit **fett** und Umlauten äöüß, ëç, € 1.000.';
  const file = AtsCv.pdf(cv, atsData, new Date(2026, 9, 26, 9, 30, 0));
  const text = Buffer.from(file.bytes).toString('latin1');
  assert.ok(file.pages >= 1 && file.pages <= 2, `${file.pages} pages`);
  assert.equal((text.match(/\/Type \/Page\b/g) || []).length, file.pages);
  assert.match(text, /\/BaseFont \/Times-Roman/, 'Georgia becomes Times');
  assert.match(text, /\/BaseFont \/Times-Bold/);
  assert.ok(!text.includes('/BaseFont /Helvetica'), 'no second family');
  const strings = [...text.matchAll(/<([0-9a-f]+)> Tj/g)].map((m) => winAnsi(m[1]));
  assert.ok(strings.includes('Elena Marku'), 'the name');
  assert.ok(strings.includes('PROFIL'), 'the heading in capitals');
  assert.ok(strings.join(' ').includes('Umlauten äöüß, ëç, € 1.000.'), 'German and Albanian letters and the euro sign, as written');
  assert.ok(strings.includes('fett '), 'the bold word is a string of its own, with the space after it');
  assert.ok(strings.includes('03.2022 – heute'), 'the period at the right of the title');
  assert.ok(strings.includes('Elena Marku · Lebenslauf') && strings.includes(`Seite 1 von ${file.pages}`), 'the footer');
  // The accent colour draws the name and the rules; the metadata carries the name and the language.
  assert.match(text, /0.122 0.227 0.373 rg/);
  assert.match(text, /0.122 0.227 0.373 RG 0.9 w/);
  assert.match(text, /\/Lang <feff00640065>/);
  assert.match(text, /\/CreationDate \(D:20261026093000\)/);
  // Arial maps to Helvetica, and a CV of nothing but a name is one page.
  const small = AtsCv.clean({ person: { name: 'Nora' } }, atsData, 'en');
  const one = AtsCv.pdf(small, atsData);
  assert.equal(one.pages, 1);
  assert.match(Buffer.from(one.bytes).toString('latin1'), /\/BaseFont \/Helvetica\b/);
});
