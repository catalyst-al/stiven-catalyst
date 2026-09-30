// Integration smoke check of the actual generated pages, without a remote browser.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import coaching from '../src/_data/coaching.js';

const core = fs.readFileSync('src/js/coaching-core.js', 'utf8');
const ui = fs.readFileSync('src/js/coaching-workspace.js', 'utf8');
const bridge = fs.readFileSync('src/js/coaching-bridge.js', 'utf8');
let checked = 0;
for (const lang of ['en', 'de', 'sq']) {
  const prefix = lang === 'en' ? '' : `${lang}/`;
  for (const [id, role] of Object.entries(coaching.roles)) {
    const path = `${prefix}roles/${role.slug}/`;
    const html = fs.readFileSync(`_site/${path}index.html`, 'utf8');
    const dom = new JSDOM(html, { url: `https://stivencatalyst.com/${path}`, runScripts: 'outside-only' });
    dom.window.eval(core); dom.window.eval(ui);
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
    dom.window.eval(core); dom.window.eval(bridge);
    assert.equal(dom.window.document.querySelector('[data-coaching-bridge]').hidden, true, `ordinary tool page ${path}`);
    dom.window.close(); checked++;
  }
}
console.log(`Coaching build integration: ${checked} generated pages passed (12 role pages + 39 tool pages).`);
