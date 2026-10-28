// The Tools Guide says what the tools do now (audit of 27 October 2026, phase 2). Phase 1 changed what the Time
// Study, the KPI Diagnostic and the ATS CV give; edition 8 of the guide says it in English, German and Albanian, and
// these tests hold the guide to the code, so the next change of a tool shows up here too.
const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const LANGS = ['en', 'de', 'sq'];
let guide;
before(async () => { guide = (await import('../src/_data/toolsGuide.js')).default; });
const entry = (lang, tool) => guide[lang].tools[`/tools/${tool}/`];
const text = (lang, tool) => JSON.stringify(entry(lang, tool));

test('every button or field the guide names is a text of the tool pages in each language', () => {
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    const labels = new Set([...JSON.stringify(guide[lang]).matchAll(/\[\[(.+?)\]\]/g)].map((match) => match[1]));
    assert.deepEqual([...labels].filter((label) => !(label in ui)), [], `${lang}: labels the guide would print in English`);
  }
});

test('Time Study: the guide gives the standard time as the median × the rating × (1 + the allowance), with both fields', () => {
  const page = fs.readFileSync('src/_includes/partials/time-study.njk', 'utf8');
  const code = fs.readFileSync('src/js/time-study.js', 'utf8');
  assert.match(code, /const standardTime = \(median, rating = 1, allowance = 0\) => median \* rating \* \(1 \+ allowance\);/);
  for (const field of ['Performance rating (%)', 'Allowance (%)']) assert.ok(page.includes(`"${field}" | t(lang)`), `the tool has the field ${field}`);
  for (const lang of LANGS) {
    const t = text(lang, 'time-study');
    assert.ok(t.includes('[[Performance rating (%)]]') && t.includes('[[Allowance (%)]]'), `${lang}: both fields`);
    assert.match(t, /× \(1 \+ /, `${lang}: the formula`);
    assert.match(t, /100\u00a0% (and|und|dhe) 0\u00a0%/, `${lang}: what the defaults give, with no line break before the per cent sign`);
  }
});

test('KPI Diagnostic: a leading hypothesis to check, named at the thresholds the code uses, never "the cause that fits best"', () => {
  const data = JSON.parse(fs.readFileSync('src/_data/kpiDiagnostic.json', 'utf8'));
  const code = fs.readFileSync('src/js/kpi-diagnostic.js', 'utf8');
  // The code: more than half of the maximum, and causes one point apart are near-ties.
  assert.match(code, /if \(best <= maxPerCause \/ 2\) return \[\];/);
  assert.match(code, /ranked\[k - 1\]\[1\] - ranked\[k\]\[1\] <= 1/);
  const max = (data.scale.length - 1) * 2;
  const least = Math.floor(max / 2) + 1;
  const words = {
    en: [`${least} of ${max}`, 'leading hypothesis', /fits best/],
    de: [`${least} von ${max}`, 'führende hypothese', /am besten passt/],
    sq: [`${least} nga ${max}`, 'hipotezë kryesore', /përputhet më mirë/],
  };
  for (const lang of LANGS) {
    const t = text(lang, 'kpi-diagnostic').toLowerCase();
    const [threshold, name, old] = words[lang];
    assert.ok(t.includes(threshold), `${lang}: ${threshold}`);
    assert.ok(t.includes(name), `${lang}: ${name}`);
    assert.doesNotMatch(t, old, `${lang}: the old wording`);
  }
  // The tool's page and card do not promise more than a hypothesis.
  for (const file of ['src/tools/kpi-diagnostic.njk', 'src/de/tools/kpi-diagnostic.njk', 'src/sq/tools/kpi-diagnostic.njk']) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /first became unstable|zuerst instabil|u lëkund së pari/, file);
  }
  for (const file of ['src/_data/tools.json', 'src/_data/de/tools.json', 'src/_data/sq/tools.json']) {
    const card = JSON.parse(fs.readFileSync(file, 'utf8')).find((tool) => tool.url.endsWith('/kpi-diagnostic/'));
    assert.match(card.summary, /hypothesis|Hypothese|hipotezë/, file);
  }
});

test('ATS CV: the guide names JSON Resume and the skill-aware match, and gives no pass mark', () => {
  const code = fs.readFileSync('src/js/ats-cv.js', 'utf8');
  assert.ok(code.includes('not a prediction of what application software or a recruiter will decide'));
  for (const lang of LANGS) {
    const t = text(lang, 'ats-cv');
    assert.ok(t.includes('JSON Resume'), `${lang}: JSON Resume`);
    assert.ok(t.includes('≈'), `${lang}: a skill found under another word`);
    assert.doesNotMatch(t, /60|pass mark|bestanden|kalon/i, `${lang}: no pass mark`);
  }
});

test('Room Inspection: the guide says what the code does with open items, a failed critical item included', () => {
  const code = fs.readFileSync('src/js/room-inspection.js', 'utf8');
  // The author's rule of 27 October 2026: open items are never a pass; a failed critical item fails at once.
  assert.match(code, /if \(scored\.critical\.length\) return \{ pass: false, reason: "critical" \};\s*if \(scored\.open > 0\) return \{ pass: null, reason: "incomplete" \};/);
  const said = { en: /never a pass.*critical item failed, which fails the room at once/, de: /besteht nie.*kritischer Mangel lässt das Zimmer sofort durchfallen/, sq: /nuk kalon kurrë.*pikë kritike, që e rrëzon dhomën menjëherë/ };
  for (const lang of LANGS) assert.match(text(lang, 'room-inspection'), said[lang], lang);
});
