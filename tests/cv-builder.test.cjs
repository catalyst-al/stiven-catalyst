const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const data = JSON.parse(fs.readFileSync('src/_data/cvBuilder.json', 'utf8'));
const cvb = (() => {
  const context = { window: {}, document: { querySelector: () => null, getElementById: () => null }, URL };
  vm.runInNewContext(fs.readFileSync('src/js/cv-builder.js', 'utf8'), context);
  return context.window.CvBuilder;
})();
const plain = (value) => JSON.parse(JSON.stringify(value));

test('company websites become the bare domain, anything else is ignored', () => {
  const { domainOf } = cvb;
  assert.equal(domainOf('radissonhotels.com'), 'radissonhotels.com');
  assert.equal(domainOf('https://www.Knuspr.de/de/jobs?x=1'), 'knuspr.de');
  assert.equal(domainOf(' www.one.al '), 'one.al');
  assert.equal(domainOf('Radisson Blu Hotel'), '');
  assert.equal(domainOf('localhost'), '');
  assert.equal(domainOf('javascript:alert(1)'), '');
  assert.equal(domainOf('ftp://files.example.com'), '');
});

test('initials skip legal forms and small words', () => {
  const { initials } = cvb;
  assert.equal(initials('Radisson Hotel Group'), 'RH');
  assert.equal(initials('Arteg Sh.p.k'), 'A');
  assert.equal(initials('Großer Kern GmbH / knuspr.de'), 'GK');
  assert.equal(initials('The Lakeside Grand Hotel'), 'LG');
  assert.equal(initials(''), '');
});

test('bullet points drop typed bullet signs and keep bold labels', () => {
  const { lines, splitBold } = cvb;
  assert.deepEqual(plain(lines('- first\n\n• second\n**KPI:** third\n  ')), ['first', 'second', '**KPI:** third']);
  assert.deepEqual(plain(splitBold('**KPI:** down to 1 %')), [{ text: 'KPI:', bold: true }, { text: ' down to 1 %', bold: false }]);
});

test('pages break between blocks and headings move with the next block', () => {
  const { paginate } = cvb;
  const block = (height, space = 0, keep = false) => ({ height, space, keep });
  assert.deepEqual(plain(paginate([block(400), block(400), block(400)], 1000, 1000)), [[0, 1], [2]]);
  // The heading fits on page one, but the entry under it does not: both move.
  assert.deepEqual(plain(paginate([block(800), block(40, 20, true), block(300, 10)], 1000, 1000)), [[0], [1, 2]]);
  // A block taller than a page still gets a page of its own.
  assert.deepEqual(plain(paginate([block(100), block(1500)], 1000, 1000)), [[0], [1]]);
});

test('saved data is rebuilt to the expected shape', () => {
  const { clean } = cvb;
  const cv = clean({
    docLang: 'xx',
    theme: 'nope',
    photo: 'https://tracker.example/pixel.png',
    photoY: 500,
    person: { name: 42, headline: 'Night Manager' },
    groups: [{ title: 'Germany', entries: [{ company: 'Noctua', logo: 'javascript:1', roles: [] }, 'junk'] }],
    languages: 'German',
  }, data, 'de');
  assert.equal(cv.docLang, 'de');
  assert.equal(cv.theme, data.themes[0].id);
  assert.equal(cv.photo, '');
  assert.equal(cv.photoY, 100);
  assert.equal(cv.person.name, '');
  assert.equal(cv.person.headline, 'Night Manager');
  assert.equal(cv.groups[0].entries.length, 1);
  assert.equal(cv.groups[0].entries[0].logo, '');
  assert.equal(cv.groups[0].entries[0].roles.length, 1);
  assert.deepEqual(plain(cv.languages), []);
});

test('every example CV and CV language is complete', () => {
  const { clean } = cvb;
  const headings = Object.keys(data.docLangs.en.headings);
  for (const [code, doc] of Object.entries(data.docLangs)) {
    assert.deepEqual(Object.keys(doc.headings), headings, code);
    assert.ok(doc.page.includes('{n}') && doc.page.includes('{total}'), code);
    const cv = clean(data.examples[code], data, code);
    assert.ok(cv.person.name && cv.groups[0].entries.length >= 2, code);
  }
});
