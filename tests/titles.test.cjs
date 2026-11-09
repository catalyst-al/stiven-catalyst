// Titles as their language writes them (audit P4-09): in Albanian a lower-case letter after the colon of a reflection's
// title; in German lower case after the colon when what follows is not a full sentence (Duden: "…: wenn …",
// "…: warum …", "…: die Grenze …"), a capital when it is one ("…: Verantwortung beginnt …", "…: Wer zahlt sie?").
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const titles = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  const line = text.split('\n').find((l) => l.startsWith('title:')) || '';
  return { file: f, title: line.replace(/^title:\s*/, '').replace(/^(['"])(.*)\1$/, '$2').replace(/''/g, "'") };
});

test('Albanian reflection titles: a lower-case letter after the colon', () => {
  const wrong = titles('src/content/sq/reflections').filter(({ title }) => /: [A-ZÇË]/.test(title)).map(({ file, title }) => `${file}: ${title}`);
  assert.deepEqual(wrong, []);
});

test('German reflection titles: lower case after the colon before a clause or a phrase that is no sentence', () => {
  const wrong = titles('src/content/de/reflections').filter(({ title }) => /: (Wenn|Warum|Was|Für|Die|Der|Das) /.test(title)).map(({ file, title }) => `${file}: ${title}`);
  assert.deepEqual(wrong, []);
  const all = titles('src/content/de/reflections').map(({ title }) => title);
  assert.ok(all.some((t) => /: Verantwortung beginnt/.test(t)), 'a full sentence keeps its capital');
  assert.ok(all.some((t) => /: Wer zahlt sie\?/.test(t)), 'a question keeps its capital');
});

// Audit P4-11: the Albanian reflections used straight quotes ("…") where the language writes „…“.
test('Albanian reflection bodies quote with „…“, never straight quotes', () => {
  const dir = 'src/content/sq/reflections';
  const wrong = [];
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const body = fs.readFileSync(path.join(dir, file), 'utf8').split('---\n').slice(2).join('---\n');
    if (body.includes('"')) wrong.push(`${file}: straight quote`);
    const opens = (body.match(/„/g) || []).length;
    const closes = (body.match(/“/g) || []).length;
    if (opens !== closes) wrong.push(`${file}: ${opens} „ and ${closes} “`);
    if (/„[^“]*”/.test(body)) wrong.push(`${file}: „…” mixed`);
  }
  assert.deepEqual(wrong, []);
});
