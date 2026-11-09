// Page titles for search results (audit SEO-08): within 65 characters, cut where the title itself pauses.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('a long title is fitted where it pauses; an issue keeps its topic and its number', async () => {
  const { fitTitle, MAX_TITLE } = await import('../lib/fit-title.js');
  assert.equal(MAX_TITLE, 65);
  assert.equal(fitTitle('OEE'), 'OEE', 'a short title stays');
  assert.equal(fitTitle('Management Review No. 102: Overtime: the number that borrows from tomorrow'), 'Overtime: the number that borrows from tomorrow · No. 102');
  assert.equal(fitTitle('Operational Treatise, Volume 7: The cost of silence: why frontline teams stop speaking up'), 'The cost of silence: why frontline teams stop speaking up', 'no room for the number: the topic alone');
  assert.equal(fitTitle('Hotel KPI calculator: occupancy, ADR, RevPAR against budget, with forecast and morning report'), 'Hotel KPI calculator: occupancy, ADR, RevPAR against budget');
  assert.equal(fitTitle('Kaizen board for improvement ideas: PDCA columns, effort and impact matrix'), 'Kaizen board for improvement ideas', 'a list is not cut after its first item');
  assert.equal(fitTitle('I gave the wrong order: responsibility begins where the excuses of authority end'), 'I gave the wrong order');
  const cut = fitTitle('Safety cross, LTIFR and TRIR calculator and near-miss log for warehouse teams in every shift');
  assert.ok([...cut].length <= 65 && cut.endsWith('…'), cut);
});

test('no page of the built site has a title over 65 characters', { skip: !fs.existsSync('_site/index.html') }, () => {
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : []));
  const decode = (t) => t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const long = [];
  for (const file of walk('_site')) {
    const html = fs.readFileSync(file, 'utf8');
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
    if (title && [...decode(title)].length > 65) long.push(`${file}: ${decode(title)}`);
  }
  assert.deepEqual(long, []);
});
