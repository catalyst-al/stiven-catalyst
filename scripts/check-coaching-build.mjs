// Integration smoke check of the actual generated pages, without a remote browser.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import coaching from '../src/_data/coaching.js';

const core = fs.readFileSync('src/js/coaching-core.js', 'utf8');
const ui = fs.readFileSync('src/js/coaching-workspace.js', 'utf8');
const bridge = fs.readFileSync('src/js/coaching-bridge.js', 'utf8');
const resultUI = fs.readFileSync('src/js/coaching-results.js', 'utf8');
// The curriculum is served as one cached file (src/coaching-data.njk) instead of inside every page.
const dataFile = fs.readFileSync('_site/js/coaching-data.js', 'utf8');
let checked = 0;
for (const lang of ['en', 'de', 'sq']) {
  const prefix = lang === 'en' ? '' : `${lang}/`;
  for (const [id, role] of Object.entries(coaching.roles)) {
    const path = `${prefix}roles/${role.slug}/`;
    const html = fs.readFileSync(`_site/${path}index.html`, 'utf8');
    const dom = new JSDOM(html, { url: `https://stivencatalyst.com/${path}`, runScripts: 'outside-only' });
    dom.window.eval(dataFile); dom.window.eval(core); dom.window.eval(resultUI); dom.window.eval(ui);
    const document = dom.window.document;
    assert.equal(document.querySelector('[data-coaching]').dataset.role, id);
    assert.equal(document.querySelectorAll('.coaching-nav button').length, 5);
    assert.ok(document.querySelector('[data-form="profile"]'));
    assert.equal(document.querySelector('[data-coaching-status]').textContent, '');
    assert.ok(document.getElementById('use') && document.getElementById('routine') && document.getElementById('grow'));
    for (const script of document.querySelectorAll('script[src*="coaching-"]')) {
      assert.ok(fs.existsSync(`_site${script.getAttribute('src').split('?')[0]}`));
    }
    assert.equal(document.documentElement.lang, lang);
    dom.window.close(); checked++;
  }
  for (const slug of Object.keys(coaching.toolNames)) {
    const path = `${prefix}tools/${slug}/`;
    const dom = new JSDOM(fs.readFileSync(`_site/${path}index.html`, 'utf8'), { url: `https://stivencatalyst.com/${path}`, runScripts: 'outside-only' });
    assert.ok(!dom.window.document.getElementById('coaching-data'), `no curriculum inside ${path}`);
    dom.window.eval(dataFile); dom.window.eval(core); dom.window.eval(resultUI); dom.window.eval(bridge);
    assert.equal(dom.window.document.querySelector('[data-coaching-bridge]').hidden, true, `ordinary tool page ${path}`);
    dom.window.close(); checked++;
  }
}
// Exercise the real tool engines and bridge together in all three languages.
let journeys = 0;
for (const lang of ['en', 'de', 'sq']) for (const slug of ['pareto', 'five-whys', 'kpi-diagnostic']) {
  const path = `${lang === 'en' ? '' : `${lang}/`}tools/${slug}/`;
  const dom = new JSDOM(fs.readFileSync(`_site/${path}index.html`, 'utf8'), { url: `https://stivencatalyst.com/${path}?coaching=test-project${slug === 'five-whys' ? '&problem=Lost%20handoff' : ''}`, runScripts: 'outside-only' });
  const w = dom.window, errors = []; w.addEventListener('error', e => errors.push(e.error));
  w.HTMLElement.prototype.scrollIntoView = () => {}; w.confirm = () => true;
  w.eval(core); const C = w.CoachingCore, state = C.empty(), p = C.createProject('lumen', { title: 'Test project', goal: 'Improve handoff', measure: 'Missed / all', deadline: '2026-10-15' });
  p.id = 'test-project'; state.projects.push(p); state.active.lumen = p.id; w.localStorage.setItem(C.KEY, JSON.stringify(state));
  w.eval(fs.readFileSync('src/js/tool-kit.js', 'utf8'));
  if (slug === 'pareto') w.eval(fs.readFileSync('src/js/cv-import.js', 'utf8'));
  w.eval(fs.readFileSync(`src/js/${slug}.js`, 'utf8')); w.eval(dataFile); w.eval(resultUI); w.eval(bridge);
  const bridgeForm = w.document.querySelector('[data-coaching-bridge] form');
  assert.ok(bridgeForm); assert.ok(bridgeForm.querySelector('button').disabled);
  const input = (form, key, value) => { form.elements[key].value = value; form.elements[key].dispatchEvent(new w.Event('input', { bubbles: true })); };
  if (slug === 'pareto') {
    w.document.querySelector('[data-paste]').value = 'Cause\tCount\nHandoff\t8\nOther\t2\nInvalid\tbad';
    w.document.querySelector('[data-act="paste"]').click();
    const countColumn = w.document.querySelector('[data-map="count"]'); countColumn.value = '1'; countColumn.dispatchEvent(new w.Event('change', { bubbles: true }));
    assert.equal(w.CoachingToolResult.get().payload.total, 10);
    assert.equal(w.CoachingToolResult.get().payload.skipped, 1);
  } else if (slug === 'five-whys') {
    const form = w.document.querySelector('[data-worksheet]');
    assert.equal(new URL(w.location.href).searchParams.get('coaching'), p.id, 'incoming problem retains project context');
    input(form, 'why1', 'No acceptance'); input(form, 'cause', 'Unclear receiving owner');
    bridgeForm.elements.useHypothesis.checked = true;
  } else {
    const form = w.document.querySelector('[data-diagnostic]'); input(form, 'kpi', 'Missed requests');
    form.querySelectorAll('fieldset.statement').forEach((set, i) => { const radio = set.querySelectorAll('input')[i % 4]; radio.checked = true; radio.dispatchEvent(new w.Event('change', { bubbles: true })); });
    form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  }
  const snapshot = JSON.parse(JSON.stringify(w.CoachingToolResult.get()));
  assert.ok(C.validSnapshot(snapshot), `${lang}/${slug} has a valid typed result`);
  assert.equal(bridgeForm.querySelector('button').disabled, false);
  const toolKeys = [...Array(w.localStorage.length)].map((_, i) => w.localStorage.key(i)).filter(key => key !== C.KEY);
  const before = toolKeys.map(key => [key, w.localStorage.getItem(key)]);
  input(bridgeForm, 'summary', 'Review the handoff; causation remains unproven'); input(bridgeForm, 'source', 'Observed weekly log');
  input(bridgeForm, 'action', 'Observe the receiving owner'); input(bridgeForm, 'owner', 'Lead'); input(bridgeForm, 'due', '2026-10-02');
  // A concurrent update must survive this save.
  const latest = C.load(w.localStorage).state; latest.projects[0].actions.push({ id: C.id(), text: 'Existing action', owner: 'Lead', due: '2026-10-03', done: false }); assert.equal(C.save(w.localStorage, latest), null);
  bridgeForm.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  const saved = C.load(w.localStorage); assert.equal(saved.error, null); assert.equal(saved.state.projects[0].actions.length, 2);
  assert.equal(saved.state.projects[0].evidence.length, 1);
  const recorded = saved.state.projects[0].evidence[0].snapshot;
  assert.equal(recorded.tool, slug); assert.deepEqual(JSON.parse(JSON.stringify(recorded.payload)), snapshot.payload);
  if (slug === 'five-whys') assert.equal(saved.state.projects[0].brief.hypothesis, 'Unclear receiving owner');
  before.forEach(([key, value]) => assert.equal(w.localStorage.getItem(key), value, `${slug} log is unchanged by saving to project`));
  assert.equal(w.document.querySelector('[data-coaching-bridge-status]').textContent, coaching.labels.bridgeSaved[lang]);
  if (slug === 'kpi-diagnostic') {
    const radio = w.document.querySelector('[data-diagnostic] input[type="radio"]'); radio.checked = true; radio.dispatchEvent(new w.Event('change', { bubbles: true }));
    assert.equal(w.CoachingToolResult.get(), null); assert.equal(bridgeForm.querySelector('button').disabled, true);
  } else if (slug === 'pareto') {
    w.document.querySelector('[data-act="reset"]').click(); assert.equal(w.CoachingToolResult.get(), null); assert.equal(bridgeForm.querySelector('button').disabled, true);
  } else {
    w.document.querySelector('[data-clear]').click(); assert.equal(w.CoachingToolResult.get(), null); assert.equal(bridgeForm.querySelector('button').disabled, true);
  }
  assert.equal(errors.length, 0, errors.map(e => e?.stack).join('\n')); dom.window.close(); journeys++;
}
console.log(`Coaching integration: ${checked} generated pages and ${journeys} complete tool → project → action journeys passed.`);
