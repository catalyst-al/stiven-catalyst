// Every Markdown file has front matter that YAML can read; a stray ": " in a plain value breaks the whole build.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const markdown = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) markdown(file, out); else if (file.endsWith('.md')) out.push(file);
  }
  return out;
};

test('the front matter of every essay, reflection, note and project is valid YAML', () => {
  const files = markdown('src/content');
  assert.ok(files.length > 50, `found ${files.length}`);
  for (const file of files) {
    const head = fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
    assert.ok(head, `${file}: no front matter`);
    assert.doesNotThrow(() => yaml.load(head[1]), `${file}`);
  }
});
