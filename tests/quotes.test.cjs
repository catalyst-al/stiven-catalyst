// Quotations in the quotes of their language (quoted in lib/translations.js): “…” in English and Albanian, „…“ in
// German, and a quotation inside a quotation in the inner quotes. Used for the field notes, the pull quotes of the
// publications and the titles of their sources.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const hasSite = fs.existsSync('_site/de/field-notes.html');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');

test('each language its own quotes, and the inner ones for a quotation inside', async () => {
  const { quoted } = await import('../lib/translations.js');
  assert.equal(quoted('Ask why.', 'en'), '“Ask why.”');
  assert.equal(quoted('Pyet pse.', 'sq'), '“Pyet pse.”');
  assert.equal(quoted('Fragen Sie warum.', 'de'), '„Fragen Sie warum.“');
  assert.equal(quoted('„Ja, verstanden“ ist kein Beweis.', 'de'), '„‚Ja, verstanden‘ ist kein Beweis.“');
  assert.equal(quoted('Not “who got it wrong?” but why.', 'en'), '“Not ‘who got it wrong?’ but why.”');
  assert.equal(quoted('', 'de'), '„“');
});

test('the German pages quote the field notes and the pull quotes in German', { skip: !hasSite }, () => {
  const notes = built('de/field-notes.html');
  const quotes = [...notes.matchAll(/<blockquote>([\s\S]*?)<\/blockquote>/g)].map((m) => m[1].trim());
  assert.ok(quotes.length > 100, 'the notes are on the page');
  for (const q of quotes) assert.match(q, /^„[^„]*“$/, q);
  assert.ok(!/<blockquote>“/.test(built('de/index.html')), 'the note of the day');
  const issue = built('de/magazine/management-review-nr-01.html');
  assert.ok(!/<p class="quote">“/.test(issue), 'the pull quotes of an issue');
  assert.match(built('field-notes.html'), /<blockquote>“[^<]*”<\/blockquote>/);
  assert.match(built('sq/field-notes.html'), /<blockquote>“[^<]*”<\/blockquote>/);
});
