// docs/DATA-FORMATS.md stays true to the code: every storage key a tool names in its data file is listed there, so are
// the keys the work file leaves out and the file formats the scripts write.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const doc = fs.readFileSync('docs/DATA-FORMATS.md', 'utf8');

test('every tool storage key of src/_data is in the document', () => {
  const keys = fs.readdirSync('src/_data').filter((file) => file.endsWith('.json')).flatMap((file) => {
    try {
      const data = JSON.parse(fs.readFileSync(`src/_data/${file}`, 'utf8'));
      return data && typeof data === 'object' && typeof data.storageKey === 'string' ? [data.storageKey] : [];
    } catch { return []; }
  });
  assert.ok(keys.length >= 50, `${keys.length} keys found`);
  const missing = keys.filter((key) => !doc.includes(`\`${key}\``));
  assert.deepEqual(missing, [], 'storage keys missing from docs/DATA-FORMATS.md');
});

test('the keys the work file skips, and the formats the scripts write, are in the document', () => {
  const backup = fs.readFileSync('src/js/work-backup.js', 'utf8');
  const skip = [...backup.match(/const SKIP = new Set\(\[([^\]]+)\]\)/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(skip.length >= 5);
  for (const key of skip) assert.ok(doc.includes(`\`${key}\``), `${key} (skipped by the work file) missing`);
  const formats = [
    ...backup.matchAll(/FORMAT = "([^"]+)"/g),
    ...fs.readFileSync('src/js/shift-handover.js', 'utf8').matchAll(/FORMAT = "([^"]+)"/g),
    ...fs.readFileSync('src/js/work-lock.js', 'utf8').matchAll(/FORMAT = "([^"]+)"/g),
    ...fs.readFileSync('src/js/team-sync.js', 'utf8').matchAll(/FORMAT = "([^"]+)"/g),
  ].map((m) => m[1]).filter((name) => name.startsWith('stiven-catalyst'));
  assert.ok(formats.length >= 5, formats.join(', '));
  for (const name of new Set(formats)) assert.ok(doc.includes(name), `${name} missing from the document`);
  for (const db of ['sc-restore', 'sc-media', 'sc-reminders', 'sc-lock']) assert.ok(doc.includes(`\`${db}\``), db);
});
