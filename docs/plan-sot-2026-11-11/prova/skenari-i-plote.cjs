const { chromium } = require('playwright');
const assert = require('assert');
(async () => {
  // Si te tests/browser/playwright.config.mjs: shfletuesi i makinës kur ekziston, përndryshe ai i Playwright.
  const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium';
  const b = await chromium.launch(require('fs').existsSync(LOCAL_CHROMIUM) ? { executablePath: LOCAL_CHROMIUM } : {});
  for (const [name,w,h] of [['desktop',1366,800],['phone',390,800]]) {
    const p = await b.newPage({ viewport:{width:w,height:h} });
    const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
    await p.goto('file://'+require('path').resolve(__dirname,'..','prototip-sot.html')+'#panel=0&scen=empty');
    const F = `.device.${name} `, nav = name==='desktop' ? F+'.top .nav ' : F+'.tabbar ';
    const t = async s => (await p.locator(s).first().innerText()).replace(/\s+/g,' ');
    const shot = async () => {};
    const log = (k,v) => console.log(`[${name}] ${k}: ${String(v).slice(0,230)}`);
    assert(!(await p.isVisible('.bench')), 'panel hidden'); assert(!(await p.isVisible(`.device.${name==='desktop'?'phone':'desktop'}`)));
    log('1 bosh', await t(F+'.card')); await shot('1-bosh');
    // 2 turni
    await p.click(F+'.card [data-v="shift"]'); await shot('2-turni'); await p.click(F+'[data-a="setshift"][data-v="Pasdite"]');
    log('2 pas turnit', await t(F+'.card'));
    // 3 regjistrim, me formë të papërfunduar gjatë navigimit
    await p.click(nav+'.plus'); await p.click(F+'.sheet [data-a="plusgo"]');
    await p.selectOption(F+'select[name=stage]','Ngarkimi'); await p.fill(F+'input[name=units]','3'); await p.fill(F+'input[name=note]','paletë e thyer');
    await p.click(nav+'[data-v="sot"]'); log('3 Vazhdo', await t(F+'.grid2 .card:nth-child(4)'));
    await p.click(F+'[data-a="go"][data-v="dmg"].link');
    const kept = [await p.inputValue(F+'select[name=stage]'), await p.inputValue(F+'input[name=units]'), await p.inputValue(F+'input[name=note]')];
    log('3 forma e ruajtur', kept.join(' | ')); assert.deepStrictEqual(kept, ['Ngarkimi','3','paletë e thyer']);
    await shot('3-forma'); await p.click(F+'form [type=submit]');
    log('3 pas shtimit', await t(F+'.formcard .kick >> nth=1')); log('3 fjalia', await t(F+'.grid2 .card:nth-child(2) p >> nth=1'));
    assert.strictEqual(await p.inputValue(F+'input[name=note]'), '');
    // 4 veprim pa filtër
    log('4 mbart', await t(F+'.carry')); await p.click(F+'.next [data-v="action"]');
    log('4 burimi te veprimi', await p.inputValue(F+'.card .field >> nth=1 >> input')); await p.fill(F+'[data-keep="a-owner"]','B. Kola'); await shot('4-veprim');
    await p.click(F+'[data-a="saveaction"]'); const from = await t(F+'.list li'); log('4 te lista', from); assert(/Nga: Kontrolli i dëmeve · pa filtër/.test(from)); assert(!/Dorëzimi i turnit/.test(from));
    // 5 kthim te burimi
    await p.click(F+'[data-a="source"]'); log('5 kthimi', await t(F+'.banner')); assert.strictEqual(await p.locator(F+'.bar[aria-pressed=true]').count(), 0); await shot('5-burimi');
    // 5b veprim nga një rresht
    await p.click(F+'[data-a="rowaction"]'); log('5b mbart', await t(F+'.banner')); await p.click(F+'[data-a="saveaction"]');
    const rowFrom = await t(F+'.list li'); log('5b te lista', rowFrom); assert(/një rresht: 11 nën, Pasdite, Ngarkimi/.test(rowFrom));
    await p.click(F+'[data-a="source"] >> nth=0'); assert.strictEqual(await p.locator(F+'tr.hl').count(), 1); log('5b rreshti i shënuar', await t(F+'tr.hl'));
    // 6 dorëzim
    await p.click(nav+'[data-v="handover"]'); log('6 mbart', await t(F+'.banner')); await p.fill(F+'[data-ho="owner"]','Turni i natës'); await p.fill(F+'[data-ho="note"]','Paleta te rampa 2');
    await p.click(nav+'[data-v="sot"]'); await p.click(F+'[data-a="phase"][data-v="end"]'); log('6 fund turni', await t(F+'.steps')); await shot('6-fund');
    // 7 mbyllje pa dorëzim të dërguar
    await p.click(F+'[data-a="sheet"][data-v="close"]'); log('7 fleta', await t(F+'.sheet')); await shot('7-fleta');
    await p.click(F+'[data-a="closenow"]'); const closed = await t(F+'.card'); log('7 mbyllur', closed); await shot('7-mbyllur');
    assert(/i shkruar, i padërguar/.test(closed)); assert(!/u dorëzua/.test(closed));
    // varianti: dërgim i demonstruar, pastaj mbyllje
    await p.click(F+'.card [data-v="shift"]'); await p.click(F+'[data-a="setshift"][data-v="Natë"]'); await p.click(nav+'[data-v="handover"]'); await p.click(F+'[data-a="hosend"]');
    await p.click(nav+'[data-v="sot"]'); await p.click(F+'[data-a="phase"][data-v="end"]'); await p.click(F+'[data-a="sheet"][data-v="close"]'); await p.click(F+'[data-a="closenow"]');
    log('7b mbyllur pas demo', await t(F+'.card'));
    await p.click(nav+'[aria-label^="Pjesa"]'); log('8 Catalyst', await t(F+'.sheet h2')); await shot('8-catalyst');
    log('hscroll', await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)); log('errors', JSON.stringify(errs));
    await p.close();
  }
  // gjendjet e tjera me panel: filtri sipas turnit, verifikimi
  const p = await b.newPage({ viewport:{width:1366,height:900} }); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+require('path').resolve(__dirname,'..','prototip-sot.html')+'#scen=analysis'); const D='.device.desktop ';
  const t = async s => (await p.locator(s).first().innerText()).replace(/\s+/g,' ');
  console.log('[filtri shkak]', await t(D+'.carry'), '||', await t(D+'.grid2 .card:nth-child(2) p >> nth=1'));
  await p.click(D+'.bar[data-f="shift"][data-v="Pasdite"]'); console.log('[filtri turn]', await t(D+'.carry'), '||', await t(D+'.grid2 .card:nth-child(2) p >> nth=1'));
  await p.click(D+'.next [data-v="handover"]'); console.log('[dorëzim me filtër]', await t(D+'.banner')); 
  await p.click('[data-seg="scen"] [data-v="close"]'); await p.click(D+'.nav [data-v="actions"]'); await p.click(D+'[data-a="source"]'); 
  console.log('[para/pas]', await t(D+'.card table')); await p.click(D+'[data-a="verified"]'); console.log('[verifikuar]', await t(D+'.list li'));
  await p.click('[data-seg="scen"] [data-v="shift"]'); console.log('[sinjalet]', await t(D+'.grid2 .card:nth-child(2)')); console.log('errors', errs);
  await b.close();
})().catch(e=>{console.error('FAIL', e.message.slice(0,600)); process.exit(1)});
