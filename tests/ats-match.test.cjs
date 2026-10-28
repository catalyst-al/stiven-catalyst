const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// The ATS CV's job ad match must reward the skills an ad asks for, not its filler. Nine ads written like real ones
// (tests/fixtures/career/job-ads.json: a warehouse team lead, a night auditor and a logistics analyst, each in English,
// German and Albanian, with the company blurb, the benefits and the legal lines) go through the real keywords() and
// match() with the site's stop words and skills file.
const context = { window: {}, document: { querySelector: () => null, getElementById: () => null, currentScript: null } };
vm.runInNewContext(fs.readFileSync('src/js/ats-cv.js', 'utf8'), context);
const { AtsCv } = context.window;
const plain = (value) => JSON.parse(JSON.stringify(value));
const skills = JSON.parse(fs.readFileSync('src/_data/atsSkills.json', 'utf8'));
const stop = JSON.parse(fs.readFileSync('src/_data/atsCv.json', 'utf8')).stopwords.split(/\s+/);
const { ads } = JSON.parse(fs.readFileSync('tests/fixtures/career/job-ads.json', 'utf8'));
const keywords = (ad) => plain(AtsCv.keywords(ad, stop, skills));
// A skill is among the key words when a key word is it (in any spelling the match accepts) or a word of its group.
const covers = (terms, skill) => terms.some((term) => AtsCv.hasTerm(skill, term) || AtsCv.hasTerm(term, skill)
  || (AtsCv.groupOf(term, skills.groups) !== null && AtsCv.groupOf(term, skills.groups) === AtsCv.groupOf(skill, skills.groups)));

for (const ad of ads) {
  test(`job ad ${ad.id}: the key words are its skills, not its filler, and a CV of filler scores low`, () => {
    const terms = keywords(ad.ad);
    const missing = ad.skills.filter((skill) => !covers(terms, skill));
    assert.deepEqual(missing, [], `skills missing from ${JSON.stringify(terms)}`);
    const filler = terms.filter((term) => ad.never.some((word) => AtsCv.fold(word) === AtsCv.fold(term)));
    assert.deepEqual(filler, [], `filler among ${JSON.stringify(terms)}`);
    const good = AtsCv.match(ad.match, terms, skills, ad.ad).score;
    const noise = AtsCv.match(ad.filler, terms, skills, ad.ad).score;
    assert.ok(good >= 0.75, `the matching CV scores ${good}`);
    assert.ok(noise <= 0.15, `the filler CV scores ${noise}`);
  });
}

test('the audit\'s logistics ad: the CV with the skills scores far above a CV of the ad\'s filler words', () => {
  const ad = 'Operations Manager – Logistics. You will lead a team of 40 associates across two shifts, own KPIs such as on-time delivery and cost per parcel, drive continuous improvement using Lean and Six Sigma, and report weekly to the site leader. Requirements: 5+ years in logistics operations, people leadership, Excel, SQL, Power BI, WMS experience (SAP EWM preferred). You will also coach team leads and ensure safety compliance.';
  const terms = keywords(ad);
  for (const skill of ['lean', 'six sigma', 'sql', 'power bi', 'wms', 'sap ewm', 'kpi', 'excel']) assert.ok(covers(terms, skill), `${skill} in ${terms}`);
  for (const word of ['using', 'ensure', 'drive', 'weekly', 'people', 'report', 'leader', 'associates', 'sigma', 'power']) assert.ok(!terms.includes(word), `${word} in ${terms}`);
  const skilled = 'Logistics operations manager with Lean Six Sigma Green Belt, SQL, Power BI, SAP EWM and WMS. Led 60 people, KPIs, safety. Cut cost per parcel 12% with Lean and Six Sigma. Built SQL and Power BI KPI dashboards. Excel, SQL, Power BI, SAP EWM, WMS.';
  const filler = 'I ensure weekly using drive people report leader associates own across two site also will.';
  const a = AtsCv.match(skilled, terms, skills, ad).score;
  const b = AtsCv.match(filler, terms, skills, ad).score;
  assert.ok(a >= 0.7 && b <= 0.1 && a - b >= 0.6, `skills ${a}, filler ${b}`);
});

test('abbreviations in capitals are key words, two letters too; a legal or application one is not; a lower-case "it" is not "IT"', () => {
  const terms = keywords('We need C#, C++, SQL, AWS, BI, QA, IT, B2B and ERP experience, KPIs, 5S and HACCP. Send your CV to HR. GDPR applies.');
  for (const term of ['c#', 'c++', 'sql', 'aws', 'bi', 'qa', 'it', 'b2b', 'erp', 'kpi', '5s', 'haccp']) assert.ok(covers(terms, term), `${term} in ${terms}`);
  for (const term of ['cv', 'hr', 'gdpr']) assert.ok(!terms.includes(term), `${term} in ${terms}`);
  const ad = 'Requirements: IT support experience and MS Office.';
  const itTerms = keywords(ad);
  assert.ok(itTerms.includes('it') && itTerms.includes('ms office'), String(itTerms));
  const it = (cv) => plain(AtsCv.match(cv, ['it'], skills, ad).items[0].found);
  assert.equal(it('I made it work and kept it running.'), false, 'the English word "it"');
  assert.equal(it('IT-Support, IT systems'), true);
  // Shown as the ad writes it.
  assert.equal(AtsCv.match('', itTerms, skills, ad).items.find((item) => item.term === 'it').label, 'IT');
});

test('a skill of several words is kept whole and shown as the ad writes it', () => {
  const ad = 'Your profile\n- Power BI and SAP EWM\n- Six Sigma Green Belt\n- Opera PMS, MS Office\n- Night Audit and the daily close';
  const terms = keywords(ad);
  for (const term of ['power bi', 'sap ewm', 'six sigma', 'opera pms', 'ms office', 'night audit', 'daily close']) assert.ok(terms.includes(term), `${term} in ${terms}`);
  for (const term of ['power', 'bi', 'ewm', 'sigma', 'pms', 'audit']) assert.ok(!terms.includes(term), `${term} alone in ${terms}`);
  const labels = AtsCv.match('', terms, skills, ad).items.map((item) => item.label);
  assert.ok(labels.includes('Power BI') && labels.includes('SAP EWM') && labels.includes('Opera PMS'), String(labels));
});

test('the required part of an ad still weighs double; the benefits and the application part give no key words', () => {
  const ad = ads.find((item) => item.id === 'en-warehouse-team-lead').ad;
  const terms = keywords(ad);
  const by = Object.fromEntries(AtsCv.match('', terms, skills, ad).items.map((item) => [item.term, item.weight]));
  assert.equal(by['forklift licence'], 2);
  assert.equal(by['sap ewm'], 2);
  assert.equal(by['six sigma'], 1, 'nice to have');
  const analyst = keywords(ads.find((item) => item.id === 'en-logistics-analyst').ad);
  assert.ok(!analyst.includes('budget'), 'a learning budget is a benefit, not a skill');
  const parts = AtsCv.adParts(ad, skills);
  assert.match(parts.offer, /permanent contract/);
  assert.ok(!parts.job.includes('permanent contract') && parts.job.includes('Forklift licence'));
  assert.ok(parts.other.includes('permanent contract'), 'other still holds everything that is not required or optional');
  // A heading with its first line after a colon.
  const inline = AtsCv.adParts('Requirements: SQL and Excel\nWe offer: a bonus', skills);
  assert.equal(inline.required, 'SQL and Excel');
  assert.equal(inline.offer, 'a bonus');
});

test('letters are one form and spelt either way: NFD, umlauts, ß, ë and ç match their other spellings', () => {
  const nfd = 'Führung Führung Qualität Qualität';
  const nfc = nfd.normalize('NFC');
  assert.deepEqual(plain(AtsCv.keywords(nfd, stop)), plain(AtsCv.keywords(nfc, stop)));
  assert.ok(AtsCv.keywords(nfd, stop).includes('führung') && !AtsCv.keywords(nfd, stop).includes('hrung'));
  const same = [
    ['Führung von Teams', 'Fuehrung'], ['Fuehrung von Teams', 'Führung'], ['Fuhrung von Teams', 'Führung'], ['Mitarbeiterführung', 'Mitarbeiterfuehrung'],
    ['Strasse', 'Straße'], ['STRASSE', 'straße'], ['përgjegjës për ekipin', 'pergjegjes'], ['pergjegjes', 'përgjegjës'], ['çështje', 'ceshtje'],
    ['ceshtje', 'çështje'], ['café manager', 'café'], ['café manager', 'café'], ['e-mail', 'email'], ['email', 'e-mail'],
  ];
  for (const [text, term] of same) assert.ok(AtsCv.hasTerm(text, term), `${term} in ${text}`);
  // What was right stays right.
  const apart = [['I build apps in JavaScript', 'Java'], ['MySQL, PostgreSQL', 'SQL'], ['clean code, cleaning', 'lean'], ['excellent communication', 'excel'], ['disappear', 'sap'], ['Check inventory daily', 'check-in']];
  for (const [text, term] of apart) assert.ok(!AtsCv.hasTerm(text, term), `${term} not in ${text}`);
  // The match folds the CV the same way, and shows the ad's own spelling.
  const result = AtsCv.match('Fuehrungserfahrung und Kassenfuehrung, pergjegjes turni', ['führungserfahrung', 'kassenführung', 'përgjegjës turni'], skills, 'Führungserfahrung, Kassenführung, Përgjegjës turni');
  assert.deepEqual(plain(result.items.map((item) => [item.label, item.found])), [['Führungserfahrung', true], ['Kassenführung', true], ['Përgjegjës turni', true]]);
});
