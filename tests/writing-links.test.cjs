// The writing and the tools, linked (lib/writing-links.js): each essay's tools, each field note's essay and tool,
// and new field notes proposed from the principles of the essays (scripts/field-notes.mjs).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const load = () => import('../lib/writing-links.js');
const tools = JSON.parse(fs.readFileSync('src/_data/tools.json', 'utf8')).map((tool) => tool.url);

test('every tool word list names a tool that exists', async () => {
  const { TOOL_WORDS } = await load();
  for (const url of Object.keys(TOOL_WORDS)) assert.ok(tools.includes(url), url);
});

test('a note finds the tool its words name, and the essay that holds its words', async () => {
  const { toolScores, sourceEssay, writingLinks } = await load();
  assert.equal(toolScores('A handover is not just a transfer of information.')[0][0], '/tools/shift-handover/');
  assert.equal(toolScores('A KPI tells you where to look.')[0][0], '/tools/kpi-diagnostic/');
  assert.deepEqual(toolScores('Ownership begins where the sentence ends.'), []);
  const essays = [
    { slug: 'night', date: '2026-10-01', text: '---\ntitle: x\n---\nAt night you see the **traces** the activity has left behind, and nobody else does.', data: {} },
    { slug: 'kpi', date: '2026-10-02', text: 'Numbers numbers numbers numbers numbers numbers. The KPI tells you where to look for the problem.', data: { relatedTools: ['/tools/pareto/'] } },
  ];
  assert.equal(sourceEssay('At night, you see the traces the activity has left behind.', essays), 'night');
  assert.equal(sourceEssay('Something else entirely, about customers and their parcels.', essays), null);
  assert.equal(sourceEssay('Too short', essays), null, 'a note of a few words is not matched');
  const links = writingLinks({ essays, notes: [
    { slug: '01-traces', date: '2026-10-03', quote: 'At night, you see the traces the activity has left behind.' },
    { slug: '02-look', date: '2026-10-04', quote: 'The KPI tells you where to look for the problem.' },
  ] });
  assert.deepEqual(links.essayTools.kpi, ['/tools/pareto/'], 'the tools in the front matter win');
  assert.deepEqual(links.noteLinks['01-traces'], { essay: 'night', tool: null });
  assert.deepEqual(links.noteLinks['02-look'], { essay: 'kpi', tool: '/tools/kpi-diagnostic/' }, 'the note names its own tool');
  assert.deepEqual(links.toolEssays['/tools/pareto/'], ['kpi']);
  assert.deepEqual(links.essayNotes.night, ['01-traces']);
});

test('an essay without tools in its front matter gets those its text names often enough', async () => {
  const { toolsForEssay } = await load();
  assert.deepEqual(toolsForEssay('The handover. '.repeat(6) + 'A delay. '.repeat(2)), ['/tools/shift-handover/']);
  assert.deepEqual(toolsForEssay('One handover, one delay.'), []);
});

test('every published essay is linked to at least one tool, and every tool it names exists', async () => {
  const dir = 'src/content/insights';
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    if (/^status: soon$/m.test(text)) continue;
    const listed = (text.match(/^relatedTools:\n((?: {2}- .*\n)+)/m) || [])[1];
    assert.ok(listed, `${file}: no relatedTools`);
    for (const url of listed.trim().split('\n').map((line) => line.replace(/^ *- */, ''))) assert.ok(tools.includes(url), `${file}: ${url}`);
  }
});

test('a principle stands alone as a note when it is a full thought, not a step of a list', async () => {
  const { principles, standsAlone } = await load();
  assert.deepEqual(principles('---\ntitle: x\n---\nText **inline** here.\n\n**A whole bold line.**\n\n**Two** bold **parts**\n'), ['A whole bold line.']);
  assert.ok(standsAlone('Have I built an operation that works as a system, or one that depends on me?'));
  for (const line of ['4. What are the two or three priorities of the day?', 'Day 1: understand the role and its limits and more.', 'First: do not walk in to show how much you know.', '“He asked a lot of us, but he was there with us.”', 'Solve it yourself.']) {
    assert.equal(standsAlone(line), false, line);
  }
});

test('the proposals leave out what is already a note and match in the three languages', async () => {
  const { proposals, existingNotes, fileName } = await import('../scripts/field-notes.mjs');
  const notes = existingNotes();
  const { overlap } = await load();
  for (const proposal of proposals(notes)) {
    assert.ok(proposal.quotes.en && proposal.quotes.de && proposal.quotes.sq, proposal.essay);
    assert.ok(!notes.some((note) => overlap(proposal.quotes.en, note.quote) >= 0.6), proposal.quotes.en);
  }
  assert.equal(fileName('2026-10-10', 89, 'How do we solve it, why did it happen?'), '2026-10-10-89-solve-why-happen.md');
});

const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
test('the built pages carry the links in every language', { skip: !fs.existsSync('_site/sq/field-notes.html') }, () => {
  for (const lang of ['', 'de/', 'sq/']) {
    const notes = built(`${lang}field-notes.html`);
    assert.match(notes, /<p class="note-links">/, `${lang}field-notes`);
    assert.match(notes, new RegExp(`id="note-65-walk-in"[\\s\\S]*?href="/${lang}insights/the-first-30-days/"`), `${lang}: the note links to its essay`);
    assert.match(built(`${lang}insights/the-first-30-days/index.html`), /class="essay-notes"[\s\S]*?#note-34-thirty-questions/, `${lang}: the essay lists its notes`);
    assert.match(built(`${lang}tools/shift-handover/index.html`), /class="essay-notes is-tool"/, `${lang}: the tool lists its notes`);
  }
});
