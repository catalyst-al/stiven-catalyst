// The search description of every page fits what a search result shows (about 155–160 characters), so the
// sentence is not cut off: the essays, the reflections and the pages, in the three languages.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const hasSite = fs.existsSync('_site/index.html');
const pages = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) return entry.name === 'media' ? [] : pages(file);
  return entry.name.endsWith('.html') ? [file] : [];
});
const decode = (text) => text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

test('no page has a search description longer than 160 characters', { skip: !hasSite }, () => {
  const long = [];
  for (const file of pages('_site')) {
    const description = fs.readFileSync(file, 'utf8').match(/<meta name="description" content="([^"]*)"/)?.[1];
    if (description && decode(description).length > 160) long.push(`${file}: ${decode(description).length}`);
  }
  assert.deepEqual(long, []);
});
