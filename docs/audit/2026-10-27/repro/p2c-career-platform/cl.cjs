const { launch } = require('./pw.cjs');
(async () => { const b = await launch(); const p = await b.newPage(); p.on('dialog',d=>d.accept());
 for (const l of ['','/de','/sq']) { await p.goto(`http://localhost:8104${l}/tools/cover-letter/`); await p.locator('[data-act="example"]').first().click(); await p.waitForTimeout(800);
 console.log(l||'/en', (await p.locator('[data-check] .is-open').allInnerTexts()).join(' / ')); }
 await b.close(); })();
