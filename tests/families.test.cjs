const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

// The roles (families.json: homepage orbits, Tools page, role pages) must give every tool one home,
// as a tool or a training module, in every language.
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const families = read('src/_data/families.json');
const listed = families.flatMap((family) => [...family.tools, ...family.learn]);
const toolUrls = read('src/_data/tools.json').filter((tool) => tool.url).map((tool) => tool.url);
const slugOf = (url) => url.split('/').filter(Boolean).pop();

test('every tool has exactly one home family', () => {
  assert.deepEqual([...listed].sort(), [...toolUrls].sort());
  assert.equal(new Set(listed).size, listed.length);
});

test('every family tool exists in German and Albanian', () => {
  for (const lang of ['de', 'sq']) {
    const urls = new Set(read(`src/_data/${lang}/tools.json`).map((tool) => tool.url));
    for (const url of listed) assert.ok(urls.has(`/${lang}${url}`), `${lang}: ${url}`);
  }
});

test('borrowed tools and routine steps point at real tools', () => {
  for (const family of families) {
    for (const url of family.also) {
      assert.ok(toolUrls.includes(url), `${family.id} borrows ${url}`);
      assert.ok(!family.tools.includes(url) && !family.learn.includes(url), `${family.id} already owns ${url}`);
    }
    assert.ok(family.routine.length > 0, `${family.id} has a routine`);
    for (const step of family.routine) {
      assert.ok([...family.tools, ...family.learn, ...family.also].includes(step.tool), `${family.id}: ${step.tool} is not on this planet`);
    }
  }
});

test('the next orbit is another family, and the essays to read exist in every language', () => {
  for (const family of families) {
    if (family.next) assert.ok(families.some((other) => other.id === family.next && other.id !== family.id), `${family.id} → ${family.next}`);
    for (const slug of family.read) {
      for (const dir of ['src/content/insights', 'src/content/de/insights', 'src/content/sq/insights']) {
        assert.ok(fs.readdirSync(dir).some((file) => file.replace(/^\d{4}-\d{2}-\d{2}-/, '') === `${slug}.md`), `${dir}: ${slug}`);
      }
    }
  }
});

test('family texts are translated', () => {
  for (const lang of ['de', 'sq']) {
    const ui = read(`src/_data/${lang}/ui.json`);
    for (const family of families) {
      for (const text of [family.role, family.scope, family.line, ...family.routine.flatMap((step) => [step.when, step.do])]) {
        assert.ok(ui[text], `${lang}: ${text}`);
      }
    }
  }
});

test('families have an id, a slug, a colour and an orbit, widening outwards', () => {
  families.forEach((family, index) => {
    assert.match(family.id, /^[a-z]+$/);
    assert.match(family.slug, /^[a-z]+(-[a-z]+)*$/);
    assert.match(family.color, /^#[0-9a-f]{6}$/i);
    assert.ok(family.orbit > (index ? families[index - 1].orbit : 0), `${family.id} orbit`);
  });
});

test('the homepage, the Tools page, every tool page and every role page have a social preview in each language', () => {
  const slugs = [...listed.map(slugOf), ...families.map((family) => `role-${family.slug}`), 'tools', 'home'];
  for (const lang of ['en', 'de', 'sq']) {
    for (const slug of slugs) {
      assert.ok(fs.existsSync(`src/media/social/${lang}/${slug}.jpg`), `${lang}/${slug}.jpg: run node scripts/social-cards.mjs`);
    }
  }
});
