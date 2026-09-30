const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

// The tool families (homepage orbits and Tools page) must cover every tool once, in every language.
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const families = read('src/_data/families.json');
const listed = families.flatMap((family) => family.tools);

test('every tool belongs to exactly one family', () => {
  const urls = read('src/_data/tools.json').filter((tool) => tool.url).map((tool) => tool.url);
  assert.deepEqual([...listed].sort(), [...urls].sort());
  assert.equal(new Set(listed).size, listed.length);
});

test('every family tool exists in German and Albanian', () => {
  for (const lang of ['de', 'sq']) {
    const urls = new Set(read(`src/_data/${lang}/tools.json`).map((tool) => tool.url));
    for (const url of listed) assert.ok(urls.has(`/${lang}${url}`), `${lang}: ${url}`);
  }
});

test('family texts are translated', () => {
  for (const lang of ['de', 'sq']) {
    const ui = read(`src/_data/${lang}/ui.json`);
    for (const family of families) {
      assert.ok(ui[family.role], `${lang}: ${family.role}`);
      assert.ok(ui[family.line], `${lang}: ${family.line}`);
    }
  }
});

test('families have an id, a colour and an orbit', () => {
  for (const family of families) {
    assert.match(family.id, /^[a-z]+$/);
    assert.match(family.color, /^#[0-9a-f]{6}$/i);
    assert.ok(family.orbit > 0);
  }
});

test('every tool page and the Tools page have a social preview in each language', () => {
  for (const lang of ['en', 'de', 'sq']) {
    for (const slug of [...listed.map((url) => url.split('/').filter(Boolean).pop()), 'tools']) {
      assert.ok(fs.existsSync(`src/media/social/${lang}/${slug}.jpg`), `${lang}/${slug}.jpg: run node scripts/social-cards.mjs`);
    }
  }
});
