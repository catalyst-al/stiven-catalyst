// What keeps the pages light: small copies of the images shown small (scripts/thumbnails.mjs), and the
// minifier that must never rename the names the scripts share through the global scope (lib/js-minify.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, out); else out.push(file);
  }
  return out;
};

test('every cover has its small copies, and every tool preview its 720 px copy', () => {
  const covers = ['books', 'magazine', 'guides'].flatMap((kind) => walk(path.join('src/media', kind)))
    .filter((file) => path.basename(file) === 'page-01.webp' && !/[/\\]art[/\\]/.test(file));
  assert.ok(covers.length >= 10, `found ${covers.length} covers`);
  for (const cover of covers) for (const width of [240, 480]) {
    assert.ok(fs.existsSync(cover.replace(/\.webp$/, `-${width}.webp`)), `${cover}: run node scripts/thumbnails.mjs`);
  }
  for (const lang of ['en', 'de', 'sq']) {
    const previews = fs.readdirSync(`src/media/tools/${lang}`).filter((name) => /^[a-z0-9-]+\.jpg$/.test(name));
    assert.equal(previews.length, 14, lang);
    for (const name of previews) {
      assert.ok(fs.existsSync(`src/media/tools/${lang}/${name.replace(/\.jpg$/, '-720.webp')}`), `${lang}/${name}: run node scripts/thumbnails.mjs`);
    }
  }
});

test('the minifier shortens local names but keeps the shared top-level ones', async () => {
  const { minify } = await import('terser');
  const source = 'const ToolKit = (() => { const longLocalName = 41; return { answer: () => longLocalName + 1 }; })();\nfunction shared(value) { return value * 2; }\nwindow.Answer = ToolKit.answer();';
  const lib = fs.readFileSync('lib/js-minify.js', 'utf8');
  assert.match(lib, /toplevel: false/);
  assert.match(lib, /module: false/);
  const { code } = await minify(source, { ecma: 2020, module: false, toplevel: false, compress: { passes: 2 }, mangle: true });
  assert.match(code, /ToolKit/);
  assert.match(code, /function shared/);
  assert.doesNotMatch(code, /longLocalName/);
});
