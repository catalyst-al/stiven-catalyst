// The corrections of the Management Review come from one place each, so what the pages say cannot drift from the
// data: the issues the second check changed (common.checked.issues) and their count in every text that gives it; the
// records in docs/revista that document a change, against that list; and the register at the foot of the archive
// (weekly.register), which lists every dated correction with its issue.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const hasSite = fs.existsSync('_site/magazine/management-review.html');
const LANGS = [['en', ''], ['sq', 'sq/'], ['de', 'de/']];
const pad = (n) => String(n).padStart(2, '0');
const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

test('the count of issues the second check changed is written nowhere: every text takes it from the list', async () => {
  const { common } = await import('../lib/weekly/common.js');
  const { default: weekly } = await import('../src/_data/weekly.js');
  const count = new Set(common.checked.issues).size;
  assert.equal(count, common.checked.issues.length, 'no issue twice');
  assert.equal(weekly.checkedCount, count);
  for (const lang of ['en', 'sq', 'de']) {
    assert.match(common.checked.archive[lang], /\{count\}/, `${lang}: the archive text has the placeholder`);
    assert.doesNotMatch(common.checked.archive[lang], new RegExp(`\\b${count}\\b`), `${lang}: no count written by hand`);
    assert.ok(weekly[lang].checked.archive.includes(String(count)) && !weekly[lang].checked.archive.includes('{count}'), `${lang}: filled in`);
  }
  const page = fs.readFileSync('src/how-this-is-made.njk', 'utf8');
  assert.doesNotMatch(page, /\b64\b/, 'How this is made writes no count by hand');
  assert.match(page, /weekly\.checkedCount/);
});

test('the built archive and How this is made give the count of the list, in each language', { skip: !hasSite }, async () => {
  const { default: weekly } = await import('../src/_data/weekly.js');
  const count = String(weekly.checkedCount);
  for (const [lang, prefix] of LANGS) {
    const archive = fs.readFileSync(`_site/${prefix}magazine/management-review.html`, 'utf8');
    const checked = plain(archive.match(/<div class="book-corrections" id="checked">[\s\S]*?<\/div>/)[0]);
    assert.ok(checked.includes(` ${count} `), `${lang}: archive`);
    const made = plain(fs.readFileSync(`_site/${prefix}how-this-is-made.html`, 'utf8'));
    assert.ok(made.includes(` ${count} `), `${lang}: How this is made`);
  }
});

// A record documents a change when it says that the full text changed something in the issue.
const CHANGED = /ndryshoi këto|U ndreqën|u ndreqën|U ndreq |\*\*U (?:korrigjua|ndryshua|ndreq|saktësua|hoq|plotësua)/;
const BEFORE_ONLINE = 'kontrolli i dytë i 11 tetorit u bë para se numri të dilte online';

test('every issue whose record documents a change in the second check says so, unless the change came before it went online', async () => {
  const { common } = await import('../lib/weekly/common.js');
  const changed = new Set(common.checked.issues);
  const online = JSON.parse(fs.readFileSync('src/_data/online.json', 'utf8'));
  for (let n = 1; n <= 80; n += 1) {
    const record = fs.readFileSync(`docs/revista/management-review-nr-${pad(n)}.md`, 'utf8');
    if (!CHANGED.test(record)) continue;
    if (record.includes(BEFORE_ONLINE)) {
      // The check was made on 11 October, and the issue went online that evening (the merge of #177).
      assert.equal(online[`management-review-nr-${pad(n)}`].published, '2026-10-11', `No. ${n}: online on 11 October`);
      continue;
    }
    assert.ok(changed.has(n), `No. ${n}: its record documents a change, so it is in checked.issues`);
  }
  // Nos. 74–77 and 79: their records say why they are not in the list; 73, 78 and 80 changed again after going online.
  for (const n of [74, 75, 76, 77, 79]) assert.ok(!changed.has(n), `No. ${n}`);
  for (const n of [73, 78, 80]) assert.ok(changed.has(n), `No. ${n}`);
});

// The issues where the second check changed a printed figure, year or base (de0466bb): each names the change in a
// dated correction of 12 October, in every language.
const NAMED = [6, 8, 12, 14, 24, 25, 26, 29, 40, 59, 60];

test('where the second check changed a figure, a year or a base, the issue names the change in a dated correction', async () => {
  const { common } = await import('../lib/weekly/common.js');
  for (const n of NAMED) {
    assert.ok(common.checked.issues.includes(n), `No. ${n} is in the list`);
    const issue = (await import(`../lib/weekly/issues/${pad(n)}.js`)).default;
    const note = (issue.corrections || []).find((c) => c.date.en === '12 October 2026');
    assert.ok(note, `No. ${n}: a correction of 12 October`);
    for (const lang of ['en', 'sq', 'de']) assert.ok(note.t[lang].length > 60, `No. ${n} ${lang}`);
  }
});

test('the register at the foot of the archive lists every correction with its date and its issue, newest first', async () => {
  const { default: weekly } = await import('../src/_data/weekly.js');
  const { default: review } = await import('../src/_data/review.js');
  for (const lang of ['en', 'sq', 'de']) {
    const register = weekly.register[lang];
    const isos = register.map((entry) => entry.iso);
    assert.deepEqual(isos, [...isos].sort().reverse(), `${lang}: newest first`);
    for (const issue of weekly.issues) {
      for (const correction of issue[lang].corrections.filter((c) => !c.series)) {
        assert.ok(register.some((entry) => entry.url.endsWith(`/magazine/${issue.slug}.html`) && entry.t === correction.t), `${lang} ${issue.slug}: ${correction.date}`);
      }
    }
    for (const correction of review[lang].corrections) assert.ok(register.some((entry) => entry.t === correction.t), `${lang}: special edition ${correction.date}`);
    const second = register.find((entry) => entry.checked);
    assert.equal(second.issues.length, weekly.checkedCount, `${lang}: the second check links every issue it changed`);
  }
});

test('the built register links each corrected issue, in each language, and each such issue carries its note', { skip: !hasSite }, async () => {
  const { default: weekly } = await import('../src/_data/weekly.js');
  for (const [lang, prefix] of LANGS) {
    const archive = fs.readFileSync(`_site/${prefix}magazine/management-review.html`, 'utf8');
    const at = archive.indexOf('id="corrections"');
    assert.ok(at > 0, `${lang}: the register`);
    const register = archive.slice(at, archive.indexOf('</section>', at));
    for (const entry of weekly.register[lang]) {
      assert.ok(register.includes(`href="${entry.url}"`), `${lang}: ${entry.label}`);
      if (entry.url.startsWith('/') || entry.url.startsWith('/magazine')) {
        const page = fs.readFileSync(`_site${entry.url}`, 'utf8');
        assert.ok(plain(page).includes(plain(entry.t).slice(0, 60)), `${lang}: ${entry.url} carries the note`);
      }
    }
    assert.ok(archive.includes('id="dates"'), `${lang}: the dates note`);
  }
});
