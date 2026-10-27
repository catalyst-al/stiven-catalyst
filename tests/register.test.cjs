// The German essays and reflections address the reader with "Sie" (docs/FJALORI.md, "Regjistri"). "Du" belongs only
// in quoted speech. This test reads every German insight and reflection, removes what stands inside quotation marks
// („…“, »…«, ‚…‘ and the straight "…" of the front matter), and fails on any du, dich, dir or dein… that is left:
// that is the narrator speaking to the reader in the wrong register (audit P4-01).
//
// A few passages are speech without quotation marks: a boss's words in italics, a voice the narrator hears, words
// said to a colleague, or the author speaking to his younger self. They are listed below, each with the reason, and
// each must still be in its file, so the list cannot go stale.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const DIRS = ['src/content/de/reflections', 'src/content/de/insights'];
const DU = /\b(?:du|dich|dir|dein|deine|deinen|deinem|deiner|deines)\b/gi;

const ALLOWED = [
  { file: 'reflections/2026-10-25-one-sided-availability.md', reason: 'the boss replying, in italics (SQ "ti")',
    text: '*Es gibt Bürozeiten. Warum störst du mich zu Hause? Warum kommst du nicht zu den festgelegten Zeiten ins Büro?*' },
  { file: 'reflections/2026-10-25-the-two-day-ultimatum.md', reason: 'what the trainer said, in italics (SQ "ti")',
    text: '*Wenn du es verstehst, verstehst du es. Und wenn nicht, bist du für diese Arbeit nicht gemacht.*' },
  { file: 'reflections/2026-10-26-the-art-of-saying-no.md', reason: 'the whisper of fear, in italics (SQ "ti")',
    text: '*Mach es auch diesmal. Sei nicht schwierig. Sag Ja und bring es hinter dich.*' },
  { file: 'reflections/2026-10-26-the-obedient-notary.md', reason: 'the questions put to the employee, in italics (SQ "ti")',
    text: '*Warum beschwerst nur du dich? Warum verstehst du die Lage der Firma nicht? Weißt du, wie viel der Eigentümer für uns alle tut?*' },
  { file: 'reflections/2026-10-26-the-rulebook-facing-a-person.md', reason: 'the unspoken message of the organisation, after „Gehe kein Risiko ein. Deute nicht. Entscheide nicht.“ (SQ "ti")',
    text: 'Ist der Kunde unzufrieden, kann dir wenigstens niemand vorwerfen' },
  { file: 'insights/2026-10-02-leading-people-without-losing-the-person.md', reason: 'the words a new team leader says to a former colleague',
    text: 'Das ist jetzt dein Problem, du löst es. Ich bin da und unterstütze dich, aber die Arbeit mache ich nicht für dich.' },
  { file: 'insights/2026-10-10-when-improvement-fades.md', reason: 'the author speaking to himself on his first day',
    text: 'Wenn du ein Problem heute gelöst hast, frag dich, ob es morgen auch ohne dich gelöst würde.' },
  { file: 'insights/2026-10-10-when-improvement-fades.md', reason: 'the author speaking to himself on his first day',
    text: 'bevor du die Regeln änderst' },
];

const unquote = (text) => text
  .replace(/„[^“”\n]*[“”]/g, ' ')
  .replace(/»[^«\n]*«/g, ' ')
  .replace(/‚[^‘’\n]*[‘’]/g, ' ')
  .replace(/"[^"\n]*"/g, ' ');

const files = () => DIRS.flatMap((dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  .map((f) => ({ rel: `${path.basename(dir)}/${f}`, file: path.join(dir, f) })));

test('every allowed passage of quoted speech is still in its file', () => {
  for (const { file, text } of ALLOWED) {
    const body = fs.readFileSync(path.join('src/content/de', file), 'utf8');
    assert.ok(body.includes(text), `${file}: "${text.slice(0, 50)}…" is no longer there; update the list`);
  }
});

test('the German insights and reflections address the reader with "Sie", never "du" outside quoted speech', () => {
  const list = files();
  assert.ok(list.length >= 80, `found ${list.length} files`);
  const found = [];
  for (const { rel, file } of list) {
    let body = fs.readFileSync(file, 'utf8');
    for (const allow of ALLOWED.filter((a) => a.file === rel)) body = body.split(allow.text).join(' ');
    unquote(body).split('\n').forEach((line, i) => {
      const words = line.match(DU);
      if (words) found.push(`${rel}:${i + 1}: ${words.join(', ')}`);
    });
  }
  assert.deepEqual(found, [], `narrator "du" found:\n${found.join('\n')}`);
});

test('the check finds a narrator "du" and ignores one in quotation marks', () => {
  const line = 'Wenn du das liest, sagt er: „Du bist dran.“';
  assert.deepEqual(unquote(line).match(DU), ['du']);
  assert.equal(unquote('Er sagte: „Ich habe dir gesagt, was du tun sollst.“').match(DU), null);
});
