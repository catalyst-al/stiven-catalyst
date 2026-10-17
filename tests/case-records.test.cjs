// The cases behind three essays ("caseRecord" in the front matter, layouts/article.njk): each states when, the problem,
// what was known, what was done, what happened and what cannot be confirmed, in every language, and the page shows
// the limit as the last row. Built pages for the last check.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const ESSAYS = ['2026-10-02-pareto-and-5-why-in-practice', '2026-10-10-how-we-worked-with-damage', '2026-10-08-how-i-built-front-desk-control'];
const KEYS = ['when', 'problem', 'knew', 'did', 'happened', 'unconfirmed'];
const front = (file) => fs.readFileSync(file, 'utf8').split('\n---\n')[0];

test('each case essay carries its full record in English, German and Albanian', () => {
  for (const essay of ESSAYS) {
    for (const prefix of ['', 'de/', 'sq/']) {
      const fm = front(`src/content/${prefix}insights/${essay}.md`);
      assert.match(fm, /\ncaseRecord:\n/, `${prefix}${essay}`);
      for (const key of KEYS) assert.match(fm, new RegExp(`\\n  ${key}: "[^"]{10,}"`), `${prefix}${essay}: ${key}`);
    }
  }
});

test('the damage record does not present the change between the two figures as the author’s result', () => {
  const fm = front('src/content/insights/2026-10-10-how-we-worked-with-damage.md');
  assert.match(fm, /unconfirmed: "[^"]*not presented as my result/);
});

test('the page shows the record with what cannot be confirmed last', { skip: !fs.existsSync('_site/insights/how-we-worked-with-damage/index.html') }, () => {
  for (const [prefix, label] of [['', 'What cannot be confirmed'], ['de/', 'Was sich nicht belegen lässt'], ['sq/', 'Çfarë nuk mund të konfirmohet']]) {
    const html = fs.readFileSync(`_site/${prefix}insights/how-we-worked-with-damage/index.html`, 'utf8');
    const box = html.slice(html.indexOf('class="essay-case"'), html.indexOf('</section>', html.indexOf('class="essay-case"')));
    assert.ok(box.length > 100, `${prefix}: no record`);
    assert.match(box, new RegExp(`<div class="is-limit"><dt>${label}</dt><dd>[^<]+</dd></div>\\s*</dl>`), prefix || 'en');
  }
});
