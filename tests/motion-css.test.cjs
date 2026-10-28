// The stylesheet's motion, as the site-wide pause needs it (audit PM-2, PM-3): every endless animation written in
// src/css is listed in the pause of 65-motion.css, so a loop added later cannot run on while the reader has paused
// the motion. What the pause does in a browser is checked in tests/browser/motion.spec.mjs.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const load = () => import('../lib/css-split.js');
const PAUSED = ':root[data-motion="paused"] ';

// Splits a selector list at its top-level commas.
const selectors = (list) => {
  const out = [];
  let depth = 0;
  let current = '';
  for (const ch of list) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) { out.push(current.trim()); current = ''; } else current += ch;
  }
  if (current.trim()) out.push(current.trim());
  return out.map((s) => s.replace(/\s+/g, ' '));
};

// Every rule (inside @media and @supports too) whose own declarations start an endless animation.
const endless = (blocks, css) => {
  const found = [];
  const walk = (text) => {
    for (const { prelude, body } of blocks(text)) {
      if (prelude.startsWith('@keyframes')) continue;
      if (prelude.startsWith('@')) { walk(body); continue; }
      const own = body.replace(/\{[^{}]*\}/g, '');
      if (/animation(-iteration-count)?\s*:[^;]*\binfinite\b/.test(own)) found.push(...selectors(prelude));
      if (body.includes('{')) walk(body);
    }
  };
  walk(css);
  return found;
};

test('every endless animation of the stylesheet stops when the motion is paused', async () => {
  const { blocks } = await load();
  const pause = fs.readFileSync('src/css/65-motion.css', 'utf8');
  const stopped = new Set(blocks(pause).filter((b) => /animation:\s*none\s*!important/.test(b.body)).flatMap((b) => selectors(b.prelude))
    .filter((s) => s.startsWith(PAUSED)).map((s) => s.slice(PAUSED.length)));
  assert.ok(stopped.has('.family-sky *'), 'the drawing behind a tool stops whole, as with reduced motion');
  const loops = endless(blocks, fs.readFileSync('src/styles.css', 'utf8'));
  assert.ok(loops.length > 40, `${loops.length} endless animations found`);
  // The family sky's drawings (.sky-pulse, .sky-zenith, ...) are the classes of .family-sky itself.
  const missing = loops.filter((s) => !stopped.has(s) && !/^\.sky-/.test(s));
  assert.deepEqual(missing, [], 'add these to the pause in src/css/65-motion.css');
});

// Two @keyframes of the same name: the later one wins everywhere, silently (audit PM-4: Zenith's radar faded and
// popped with the chips' shine instead of turning; the podcast's steps lit in the gold of Start here).
test('no two @keyframes share a name', () => {
  const css = fs.readFileSync('src/styles.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const names = [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]);
  const twice = [...new Set(names.filter((name, i) => names.indexOf(name) !== i))];
  assert.deepEqual(twice, []);
});
