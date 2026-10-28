const fs = require('fs'), path = require('path');
const { JSDOM } = require(path.join(process.cwd(), 'node_modules/jsdom'));
const js = fs.readFileSync('src/js/listen.js', 'utf8');
const fnSrc = js.slice(js.indexOf('const sentences = '), js.indexOf('let queue = []'));
const sentences = eval('(() => {' + fnSrc + '; return sentences; })()');
const files = require('child_process').execSync("grep -rl 'data-listen' _site --include=*.html").toString().trim().split('\n');
const bad = {}; let total = 0, pagesN = 0, longest = 0;
for (const f of files) {
  const d = new JSDOM(fs.readFileSync(f, 'utf8')).window.document;
  const art = d.querySelector('[data-article]'); if (!art) continue; pagesN++;
  const lang = d.documentElement.lang;
  art.querySelectorAll('h2, h3, p, li, blockquote').forEach((el) => {
    for (const s of sentences(el.textContent)) {
      total++; longest = Math.max(longest, s.length);
      if (/(^|\s)(z\.|B\.|d\.|h\.|u\.|a\.|Nr\.|No\.|bzw\.|ca\.|etc\.|e\.g\.|i\.e\.|vs\.|S\.|p\.sh\.|etj\.|Dr\.|Mr\.|St\.|f\.)$/.test(s) || s.length <= 4) (bad[lang] = bad[lang] || []).push(f.replace('_site', '') + ' :: ' + JSON.stringify(s));
    }
  });
}
console.log('pages', pagesN, 'utterances', total, 'longest', longest);
for (const [l, v] of Object.entries(bad)) { console.log(l, v.length); v.filter(x=>!/:: "\d+\."/.test(x)).slice(0, 12).forEach((x) => console.log('  ', x)); }
