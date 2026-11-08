// The tools in one line, role by role as on the Tools page ("toolNeighbours" in eleventy.config.js): every tool page
// ends with the next tool, the one before and all tools; the last tool of a role leads into the next role, and the
// very last tool back to the first.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const families = JSON.parse(fs.readFileSync('src/_data/families.json', 'utf8'));
const line = families.flatMap((family) => [...family.tools, ...family.learn]);
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const next = (html) => html.match(/<nav class="shell essay-series tool-onward"[\s\S]*?<a class="essay-series-next" href="([^"]+)"/)?.[1];

test('every tool page leads on to the next tool, across the roles and round again', { skip: !fs.existsSync('_site/sq/tools/andon/index.html') }, () => {
  for (const lang of ['', 'sq/', 'de/']) {
    line.forEach((url, i) => {
      const html = built(`${lang}${url.slice(1)}index.html`);
      assert.equal(next(html), `/${lang}${line[(i + 1) % line.length].slice(1)}`, `${lang}${url}`);
    });
  }
  const lastOfFirstRole = families[0].tools.concat(families[0].learn).at(-1);
  assert.match(built(`sq${lastOfFirstRole}index.html`), new RegExp(`Roli i radhës · ${families[1].name}`));
  assert.match(built('de/tools/andon/index.html'), /Tool \d+ von 59/);
});

test('each step of the DMAIC course leads on to the next step, and the last to the 8 wastes', { skip: !fs.existsSync('_site/sq/tools/six-sigma-dmaic/index.html') }, () => {
  const html = built('sq/tools/six-sigma-dmaic/index.html');
  const navs = html.match(/<nav class="dm-module-nav"[\s\S]*?<\/nav>/g) || [];
  assert.equal(navs.length, 5);
  const nexts = navs.map((nav) => nav.match(/<a class="button-primary" href="([^"]+)"/)[1]);
  assert.deepEqual(nexts, ['#dm-measure', '#dm-analyze', '#dm-improve', '#dm-control', '#dm-wastes']);
  assert.doesNotMatch(navs[0], /rel="prev"/);
  assert.match(navs[1], /href="#dm-define" rel="prev"/);
  assert.match(navs[1], /Hapi tjetër: A · Analizo/);
});
