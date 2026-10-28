// Untranslated English in DE/SQ tool pages after loading the example: lines in <main> containing common English words.
const fs = require('fs');
const { open, close } = require('./lib');
const TOOLS = ['a3-report', 'action-tracker', 'eight-d', 'fishbone', 'five-s-audit', 'five-whys', 'fmea', 'gemba-walk', 'heijunka', 'hoshin-kanri', 'housekeeping-planner', 'inventory-abc', 'kaizen-board', 'kaizen-event', 'kanban-sizing', 'leader-standard-work', 'lean-assessment', 'maintenance-planner', 'poka-yoke', 'process-lab', 'project-portfolio', 'risk-assessment', 'room-inspection', 'room-status', 'shift-capacity', 'six-sigma-dmaic', 'skills-matrix', 'smed', 'spaghetti-diagram', 'standard-work', 'time-study', 'value-stream-map', 'print-pack'];
const EN = /\b(the|and|with|from|per day|per week|this|that|these|which|Download|Print|Save|Clear|example|items?|rooms?|hours|minutes|shift)\b/;
const OK = /Stiven Catalyst|Kaizen|Kanban|Heijunka|Gemba|Poka|SMED|FMEA|Hoshin|DMAIC|Excel|CSV|Word|PDF|Lean|Six Sigma|A3|8D|5S|Pareto|Yamazumi|Andon/;
(async () => {
  const out = {};
  for (const lang of ['de', 'sq']) for (const t of TOOLS) {
    const { page } = await open(`/${lang}/tools/${t}/`);
    const ex = page.locator('button[data-example]:visible'); if (await ex.count()) { await ex.first().click().catch(() => {}); await page.waitForTimeout(600); }
    await page.evaluate(() => document.querySelectorAll('main details').forEach((d) => { d.open = true; }));
    const lines = await page.evaluate(() => document.querySelector('main').innerText.split('\n').map((s) => s.trim()).filter(Boolean));
    const hits = [...new Set(lines.filter((l) => EN.test(l) && l.length < 300))].filter((l) => { const words = l.split(/\s+/); const en = words.filter((w) => /^(the|and|with|from|this|that|of|to|is|are|in|on|for|a|an|per|day|week|hours|minutes|shift|rooms?|items?)$/i.test(w)).length; return en >= 2 || /^(Download|Print|Save|Clear)\b/.test(l); });
    const attrs = await page.evaluate(() => [...document.querySelectorAll('main [placeholder],main [aria-label],main [title]')].map((e) => e.getAttribute('placeholder') || e.getAttribute('aria-label') || e.getAttribute('title')).filter((s) => /\b(the|and|with|per|Remove|Delete|Move|Add|Open)\b/.test(s)));
    out[`${lang}/${t}`] = { text: hits.slice(0, 8), attrs: [...new Set(attrs)].slice(0, 6) };
    if (hits.length || attrs.length) console.log(`${lang}/${t}:`, JSON.stringify(hits.slice(0, 4)).slice(0, 500), '| attrs:', JSON.stringify([...new Set(attrs)].slice(0, 4)).slice(0, 300));
    await page.context().close();
  }
  fs.writeFileSync(__dirname + '/lang.json', JSON.stringify(out, null, 1));
  await close();
})();
