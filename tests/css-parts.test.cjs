// The stylesheet in parts (lib/css-parts.js): src/styles.css is exactly its parts in src/css/ joined in order, so an
// edit made to styles.css alone, which the next build would undo, fails here; each part starts and ends outside any
// rule, so a part can be read and edited on its own.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const parts = fs.readdirSync('src/css').filter((name) => name.endsWith('.css')).sort();

test('styles.css is its parts joined in the order of their numbers', () => {
  assert.ok(parts.length >= 10, `${parts.length} parts`);
  for (const name of parts) assert.match(name, /^\d\d-[a-z0-9-]+\.css$/, name);
  const joined = parts.map((name) => fs.readFileSync(`src/css/${name}`, 'utf8')).join('');
  assert.ok(fs.readFileSync('src/styles.css', 'utf8') === joined, 'src/styles.css differs from src/css/: edit the parts, then build');
  assert.match(joined, /^\/\* This stylesheet is put together from the files in src\/css\//);
});

test('every part opens and closes all its braces and comments', () => {
  for (const name of parts) {
    const css = fs.readFileSync(`src/css/${name}`, 'utf8');
    let depth = 0;
    let comment = false;
    let quote = '';
    for (let i = 0; i < css.length; i += 1) {
      const ch = css[i];
      const next = css[i + 1];
      if (comment) { if (ch === '*' && next === '/') { comment = false; i += 1; } continue; }
      if (quote) { if (ch === '\\') i += 1; else if (ch === quote) quote = ''; continue; }
      if (ch === '/' && next === '*') { comment = true; i += 1; } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '{') depth += 1;
      else if (ch === '}') { depth -= 1; assert.ok(depth >= 0, `${name}: a brace closes nothing`); }
    }
    assert.equal(depth, 0, `${name}: a rule is left open`);
    assert.equal(comment, false, `${name}: a comment is left open`);
  }
});
