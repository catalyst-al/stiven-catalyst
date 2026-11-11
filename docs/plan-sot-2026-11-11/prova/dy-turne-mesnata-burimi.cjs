const { chromium } = require('playwright');
const assert = require('assert');
const URL = 'file://'+require('path').resolve(__dirname,'..','prototip-sot.html')+'';
(async () => {
  // Si te tests/browser/playwright.config.mjs: shfletuesi i makinës kur ekziston, përndryshe ai i Playwright.
  const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium';
  const b = await chromium.launch(require('fs').existsSync(LOCAL_CHROMIUM) ? { executablePath: LOCAL_CHROMIUM } : {});
  for (const [name,w,h] of [['desktop',1366,800],['phone',390,800]]) {
    const p = await b.newPage({ viewport:{width:w,height:h} });
    const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
    await p.goto(URL+'#panel=0&scen=empty');
    const F = `.device.${name} `, nav = name==='desktop' ? F+'.top .nav ' : F+'.tabbar ';
    const t = async s => (await p.locator(s).first().innerText()).replace(/\s+/g,' ');
    const shot = async () => {};
    const log = (k,v) => console.log(`[${name}] ${k}: ${String(v).slice(0,260)}`);
    const setShift = async (shift, date) => { await p.click(F+'.top [data-v="shift"]'); if (date) await p.fill(F+'[data-opdate]', date); await p.click(F+`[data-a="setshift"][data-v="${shift}"]`); };
    const clock = v => p.evaluate(v => document.querySelector(`[data-seg="clock"] [data-v="${v}"]`).click(), v);
    const formVals = async () => [await p.inputValue(F+'select[name=stage]'), await p.inputValue(F+'input[name=units]'), await p.inputValue(F+'input[name=note]')].join(' | ');

    // ---- Turni 1: Pasdite 11 nën ----
    await setShift('Pasdite'); await p.click(nav+'.plus'); await p.click(F+'.sheet [data-a="plusgo"]');
    await p.selectOption(F+'select[name=stage]','Ngarkimi'); await p.fill(F+'input[name=units]','2'); await p.click(F+'form [type=submit]');
    await p.click(F+'.next [data-v="handover"]'); await p.click(F+'[data-a="hoissue"]');
    await p.fill(F+'[data-ho="owner"]','Turni i natës'); await p.fill(F+'[data-ho="note"]','Paleta te rampa 2');
    log('T1 gjendja pas shkrimit', await t(F+'[data-ho-state]')); assert.match(await t(F+'[data-ho-state]'), /i shkruar, i padërguar/);
    await p.click(F+'[data-a="hosend"]'); assert.match(await t(F+'[data-ho-state]'), /dërgimi u demonstrua/);
    await p.fill(F+'[data-ho="note"]','Paleta te rampa 2, e bllokuar');
    log('T1 pas ndryshimit', await t(F+'[data-ho-state]')); assert.match(await t(F+'[data-ho-state]'), /ndryshuar pas demonstrimit/); await shot('1-ndryshuar');
    await p.click(nav+'[data-v="sot"]'); await p.click(F+'[data-a="phase"][data-v="end"]'); assert.match(await t(F+'.steps'), /ndryshuar pas demonstrimit/);
    await p.click(F+'[data-a="sheet"][data-v="close"]'); log('T1 fleta e mbylljes', await t(F+'.sheet')); await p.click(F+'[data-a="closenow"]');
    await p.click(F+'.card [data-a="rec"]'); const rec1 = await t(F+'.sheet'); log('T1 dorëzimi i ruajtur', rec1); await shot('2-ruajtur');
    for (const re of [/Turni i natës/, /Paleta te rampa 2, e bllokuar/, /ndryshuar pas demonstrimit/, /2 njësi në 1 regjistrim/, /2026-11-11/, /2 dëme; më shumë te Ngarkimi/]) assert.match(rec1, re);
    await p.click(F+'.sheet [data-a="closesheet"] >> nth=-1');
    // turni i mbyllur nuk rihapet
    await p.click(F+'.top [data-v="shift"]'); await p.click(F+'[data-a="setshift"][data-v="Pasdite"]'); log('rihapja', await t(F+'.sheet .over')); assert.match(await t(F+'.sheet .over'), /është mbyllur/);
    // ---- Turni 2: Natë 11 nën ----
    await p.click(F+'[data-a="setshift"][data-v="Natë"]'); log('T2 fillim', await t(F+'.card'));
    await p.click(F+'.card [data-a="rec"]'); assert.match(await t(F+'.sheet h2'), /Pasdite · 11 nën/); await p.click(F+'.sheet [data-a="closesheet"] >> nth=-1');
    await p.click(nav+'[data-v="handover"]'); assert.strictEqual(await p.inputValue(F+'[data-ho="owner"]'), ''); assert.match(await t(F+'[data-ho-state]'), /nuk është shkruar/); log('T2 dorëzimi nis bosh', 'po');
    await p.click(nav+'.plus'); await p.click(F+'.sheet [data-a="plusgo"]');
    await p.selectOption(F+'select[name=cause]','Ambalazhi'); await p.fill(F+'input[name=units]','4'); await p.fill(F+'input[name=note]','kuti e lagur');
    // ---- mesnata ----
    await clock('mid'); log('mesnata', await t(F+'.note-bar')); log('çipi pas mesnatës', await t(F+'.top [data-v="shift"]')); assert.match(await t(F+'.top [data-v="shift"]'), /Natë 11 nën/);
    assert.strictEqual(await formVals(), 'Pranimi | 4 | kuti e lagur'); await shot('3-mesnata');
    // ---- ndryshim turni me formë të papërfunduar ----
    await setShift('Mëngjes','2026-11-12'); await p.click(nav+'.plus'); await p.click(F+'.sheet [data-a="plusgo"]');
    log('forma te turni i ri', await formVals()); assert.strictEqual(await formVals(), 'Pranimi | 1 | ');
    log('njoftimi', await t(F+'.formcard .note-bar')); assert.match(await t(F+'.formcard .note-bar'), /nga Natë · 11 nën: Pranimi, Ambalazhi, 4 njësi, “kuti e lagur”/); await shot('4-drafti');
    await p.click(F+'[data-a="draftback"]'); assert.match(await t(F+'.top [data-v="shift"]'), /Natë 11 nën/); assert.strictEqual(await formVals(), 'Pranimi | 4 | kuti e lagur'); log('kthimi te turni origjinal', await formVals());
    await p.click(F+'form [type=submit]'); log('regjistrimi pas mesnatës', await t(F+'table tr >> nth=1')); assert.match(await t(F+'table tr >> nth=1'), /11 nën Natë Pranimi Ambalazhi 4/);
    // sjellje e shprehur te turni tjetër
    await p.fill(F+'input[name=units]','5'); await setShift('Mëngjes','2026-11-12'); await p.click(nav+'.plus'); await p.click(F+'.sheet [data-a="plusgo"]');
    await p.click(F+'[data-a="draftmove"]'); log('pas “Sille”', await formVals()); assert.match(await formVals(), /\| 5 \|/); assert.strictEqual(await p.locator(F+'.formcard .note-bar').count(), 0);
    await p.click(F+'[data-a="discard"]');
    // mbyllja e turnit të natës pas mesnatës, pa dorëzim
    await setShift('Natë','2026-11-11'); await p.click(nav+'[data-v="sot"]'); await p.click(F+'[data-a="phase"][data-v="end"]'); await p.click(F+'[data-a="sheet"][data-v="close"]');
    log('T2 fleta', await t(F+'.sheet')); await p.click(F+'[data-a="closenow"]'); await shot('5-dy-turne');
    const list = await t(F+'.screen > section.card'); log('turnet e mbyllura', list);
    assert.match(list, /Pasdite · 11 nën mbyllur 11 nën, 21:40 · 2 njësi/); assert.match(list, /Natë · 11 nën mbyllur 12 nën, 00:20 · 4 njësi të dëmtuara · dorëzimi: nuk është shkruar/);
    await setShift('Mëngjes','2026-11-12'); await p.click(nav+'.plus'); await p.click(F+'.sheet [data-a="plusgo"]'); log('T3 periudha', await t(F+'.head')); assert.match(await t(F+'.head'), /6–12 nën/);
    log('hscroll', await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)); log('errors', JSON.stringify(errs)); assert.strictEqual(errs.length, 0);
    await p.close();
  }
  // ---- burimi: periudha dhe filtri i ruajtur ----
  const p = await b.newPage({ viewport:{width:1366,height:900} }); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(URL+'#scen=shift'); const D='.device.desktop ';
  const t = async s => (await p.locator(s).first().innerText()).replace(/\s+/g,' ');
  await p.click(D+'.nav [data-v="actions"]'); console.log('[burimi] lista:', await t(D+'.list li'));
  await p.click(D+'[data-a="source"]'); console.log('[burimi] banner:', await t(D+'.banner')); console.log('[burimi] koka:', await t(D+'.head')); 
  assert.match(await t(D+'.head'), /Periudha e ruajtur: 29 tet – 4 nën/); assert.match(await t(D+'.banner'), /2026-10-29 → 2026-11-04/); assert.strictEqual(await p.locator(D+'.bar[data-f="cause"][aria-pressed=true]').count(), 1);
  await p.click(D+'[data-a="curperiod"]'); assert.match(await t(D+'.head'), /5–11 nën/);
  await p.click(D+'.bar[data-f="stage"] >> nth=0'); await p.click(D+'.next [data-v="action"]'); console.log('[burimi] ruhet si:', await t(D+'code')); await p.click(D+'[data-a="saveaction"]');
  await p.click(D+'[data-a="source"] >> nth=0'); console.log('[burimi] e njëjta periudhë:', await t(D+'.banner')); assert.strictEqual(await p.locator(D+'[data-a="curperiod"]').count(), 0);
  await p.click('[data-seg="scen"] [data-v="close"]'); await p.click(D+'.nav [data-v="actions"]'); await p.click(D+'[data-a="source"]'); console.log('[para/pas]', await t(D+'.card table'));
  assert.match(await t(D+'.card table'), /Para 29 tet – 4 nën 10 3790 0,26% Pas 5–11 nën 4 3860 0,10%/);
  console.log('errors', errs); assert.strictEqual(errs.length, 0);
  await b.close();
})().catch(e=>{console.error('FAIL', e.message.slice(0,900)); process.exit(1)});
