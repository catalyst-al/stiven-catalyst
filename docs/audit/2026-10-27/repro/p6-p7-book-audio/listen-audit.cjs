const { chromium } = require('playwright');
const BASE = 'http://localhost:8108';
const stub = (cfg) => {
  // cfg: {voices, endOnCancel: 'none'|'sync'|'async', autoplay}
  const log = window.__log = { spoken: [], cancels: 0, events: [] };
  const voices = cfg.voices;
  let current = null, timer = null;
  const describe = (el) => {
    if (!el) return null;
    const anc = []; let e = el;
    while (e && e !== document.body) { anc.push(e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '')); e = e.parentElement; }
    return anc.slice(0, 6).join(' < ');
  };
  const finishCurrent = (u) => { if (u && u.onend) u.onend({}); };
  const synth = {
    speaking: false, pending: false, paused: false,
    getVoices: () => voices,
    speak(u) {
      log.spoken.push({ text: u.text, lang: u.lang, voice: u.voice && u.voice.name, rate: u.rate });
      current = u;
      // start now, end after a short time, unless cancelled (manual mode: cfg.manual)
      setTimeout(() => { if (current !== u) return; u.onstart && u.onstart({}); const sp = document.querySelector('.is-speaking'); log.spoken[log.spoken.length - 1].block = describe(sp);
        if (!cfg.manual) timer = setTimeout(() => { if (current === u) { current = null; u.onend && u.onend({}); } }, 1); }, 0);
    },
    cancel() {
      log.cancels++; const u = current; current = null; clearTimeout(timer);
      if (!u) return;
      if (cfg.endOnCancel === 'sync') { u.onerror && u.onerror({ error: 'interrupted' }); }
      else if (cfg.endOnCancel === 'async-end') { setTimeout(() => u.onend && u.onend({}), 5); }
      else { setTimeout(() => u.onerror && u.onerror({ error: 'interrupted' }), 0); }
    },
    pause() {}, resume() {},
    addEventListener() {}, onvoiceschanged: null,
  };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
  window.__finish = () => { const u = current; current = null; u && u.onend && u.onend({}); };
};
const V = {
  en: { lang: 'en-US', name: 'LocalEN', localService: true, default: true },
  de: { lang: 'de-DE', name: 'LocalDE', localService: true, default: false },
  deOnline: { lang: 'de-DE', name: 'Google Deutsch', localService: false, default: false },
  sqOnline: { lang: 'sq-AL', name: 'Microsoft Anila Online (Natural) - Albanian (Albania)', localService: false, default: false },
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch().catch(() => chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }));
  const out = {};
  const pages = process.argv.slice(2);
  for (const path of pages) {
    for (const scen of ['full', 'noSq', 'onlineOnly']) {
      const lang = path.startsWith('/de/') ? 'de' : path.startsWith('/sq/') ? 'sq' : 'en';
      let voices = [V.en, V.de, V.deOnline];
      if (scen === 'onlineOnly') voices = [V.en, V.deOnline, V.sqOnline];
      if (scen === 'full') voices = [V.en, V.de, V.deOnline, V.sqOnline];
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.addInitScript(stub, { voices, endOnCancel: 'async' });
      await page.goto(BASE + path, { waitUntil: 'load' });
      await sleep(300);
      const st = await page.evaluate(() => {
        const box = document.querySelector('[data-listen]'); const t = box.querySelector('[data-listen-toggle]');
        return { hidden: box.hidden, disabled: t.disabled, busy: t.getAttribute('aria-busy'), note: box.querySelector('[data-listen-note]').textContent.trim() };
      });
      const key = `${path} [${scen}]`;
      out[key] = { state: st };
      if (st.disabled) { await ctx.close(); continue; }
      await page.click('[data-listen-toggle]');
      for (let i = 0; i < 400; i++) { await sleep(20); const done = await page.evaluate(() => document.querySelector('[data-listen-status]').textContent); if (/end|Ende|fund/i.test(done) && await page.evaluate(() => document.querySelector('[data-listen-toggle]').getAttribute('aria-pressed')) === 'false') break; }
      const log = await page.evaluate(() => window.__log);
      const extra = await page.evaluate(() => {
        // text-bearing elements of the article that are not read
        const art = document.querySelector('[data-article]');
        const readSel = 'h2, h3, p, li, blockquote';
        const skip = '.essay-moves, .essay-checklist, .essay-tools, .essay-notes, .essay-series, .share-row, .article-toc-fold, .visually-hidden, [data-listen]';
        const unread = [];
        art.querySelectorAll('h4,h5,td,th,figcaption,dt,dd,pre,summary,caption,label,button,span.kicker,div').forEach((el) => {
          if (el.closest(skip) || el.closest(readSel)) return;
          const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
          if (own) unread.push(el.tagName.toLowerCase() + '.' + (el.className || '') + ': ' + own.slice(0, 80));
        });
        const visibleTitle = document.querySelector('.article-hero h1')?.textContent.trim();
        const inForms = [...art.querySelectorAll('form p, form li, form h2, form h3, .essay-feedback p, .essay-feedback h2, .essay-feedback h3')].filter(e=>!e.closest('[data-listen]')).map((e) => e.textContent.trim().slice(0, 60));
        const articleContainsFooter = !!art.querySelector('footer');
        return { visibleTitle, unread: unread.slice(0, 25), unreadCount: unread.length, inForms, articleContainsFooter };
      });
      out[key].count = log.spoken.length;
      out[key].first = log.spoken.slice(0, 3); out[key].all = log.spoken.map(s => (s.block||"").split(" < ").slice(0,2).join("<") + " :: " + s.text.slice(0,70));
      out[key].last = log.spoken.slice(-6);
      out[key].voice = log.spoken[0] && { voice: log.spoken[0].voice, lang: log.spoken[0].lang };
      out[key].longest = Math.max(...log.spoken.map((s) => s.text.length));
      out[key].shortest = log.spoken.filter((s) => s.text.length < 6).map((s) => s.text).slice(0, 10);
      out[key].blocksRead = [...new Set(log.spoken.map((s) => (s.block || '').split(' < ').slice(0, 3).join(' < ')))].filter((b) => /aside|form|figure|figcaption|table|footer|nav|case|feedback|related|note|source|label/i.test(b));
      out[key].formTextRead = extra.inForms.filter((t) => log.spoken.some((s) => t.startsWith(s.text.slice(0, 30))));
      out[key].extra = extra;
      await ctx.close();
    }
  }
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
