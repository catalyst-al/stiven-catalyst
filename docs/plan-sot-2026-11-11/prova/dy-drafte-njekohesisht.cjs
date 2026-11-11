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
    const log = (k,v) => console.log(`[${name}] ${k}: ${String(v).slice(0,300)}`);
    const setShift = async (shift, date) => { await p.click(F+'.top [data-v="shift"]'); if (date) await p.fill(F+'[data-opdate]', date); await p.click(F+`[data-a="setshift"][data-v="${shift}"]`); };
    const toForm = async () => { await p.click(nav+'.plus'); await p.click(F+'.sheet [data-a="plusgo"]'); };
    const vals = async () => [await p.inputValue(F+'select[name=cause]'), await p.inputValue(F+'input[name=units]'), await p.inputValue(F+'input[name=note]')].join(' | ');
    // draft A te Natë 11 nën
    await setShift('Natë','2026-11-11'); await toForm(); await p.selectOption(F+'select[name=cause]','Ambalazhi'); await p.fill(F+'input[name=units]','4'); await p.fill(F+'input[name=note]','kuti e lagur');
    // draft B te Mëngjes 12 nën
    await setShift('Mëngjes','2026-11-12'); await toForm(); await p.selectOption(F+'select[name=cause]','Pajisjet'); await p.fill(F+'input[name=units]','2'); await p.fill(F+'input[name=note]','pirun i dëmtuar');
    await p.click(nav+'[data-v="sot"]'); await toForm();   // ridizajno
    log('te Mëngjes, njoftimi', await t(F+'.formcard .note-bar'));
    assert.strictEqual(await p.locator(F+'[data-a="draftmove"]').count(), 0, 'Sille duhet të mungojë'); assert.match(await t(F+'[data-blocked]'), /Nuk mund të sillet këtu: Mëngjes · 12 nën ka formën e vet/);
    assert.strictEqual(await vals(), 'Pajisjet | 2 | pirun i dëmtuar');
    // edhe thirrja e drejtpërdrejtë nuk mbishkruan
    await p.evaluate(() => { const b = document.createElement('button'); b.dataset.a='draftmove'; b.dataset.v='2026-11-11|Natë'; b.hidden = true; document.body.append(b); b.click(); b.remove(); });
    assert.strictEqual(await vals(), 'Pajisjet | 2 | pirun i dëmtuar'); log('pas përpjekjes së detyruar', await vals());
    // Sot i tregon të dy
    await p.click(nav+'[data-v="sot"]'); const cont = await t(F+'.grid2 .card:nth-child(4)'); log('Vazhdo', cont); assert.match(cont, /formë e papërfunduar/); assert.match(cont, /nga Natë · 11 nën/);
    // kthimi te Natë: drafti A i paprekur, B shfaqet si i huaj dhe i bllokuar
    await toForm(); await p.click(F+'[data-a="draftback"]'); log('te Natë', await vals()); assert.strictEqual(await vals(), 'Ambalazhi | 4 | kuti e lagur');
    assert.match(await t(F+'.formcard .note-bar'), /nga Mëngjes · 12 nën: Pranimi, Pajisjet, 2 njësi, “pirun i dëmtuar”/); assert.strictEqual(await p.locator(F+'[data-a="draftmove"]').count(), 0);
    // mbyllja e Natës me të dy draftet: paralajmëron, ruan
    await p.click(nav+'[data-v="sot"]'); await p.click(F+'[data-a="phase"][data-v="end"]'); await p.click(F+'[data-a="sheet"][data-v="close"]'); log('fleta e mbylljes', await t(F+'.sheet'));
    assert.match(await t(F+'.sheet'), /formë regjistrimi të papërfunduar për këtë turn \(Pranimi, Ambalazhi, 4 njësi/); await p.click(F+'.sheet [data-a="closesheet"] >> nth=-1');
    // pastro A, pastaj sjellja lejohet dhe B kalon i plotë
    await toForm(); await p.click(F+'[data-a="discard"]'); assert.strictEqual(await p.locator(F+'[data-a="draftmove"]').count(), 1);
    await p.click(F+'[data-a="draftmove"]'); log('pas pastrimit dhe “Sille”', await vals()); assert.strictEqual(await vals(), 'Pajisjet | 2 | pirun i dëmtuar'); assert.strictEqual(await p.locator(F+'.formcard .note-bar').count(), 0);
    await p.click(F+'form [type=submit]'); assert.match(await t(F+'table tr >> nth=1'), /11 nën Natë Pranimi Pajisjet 2/);
    log('errors', JSON.stringify(errs)); assert.strictEqual(errs.length, 0); await p.close();
  }
  await b.close();
})().catch(e=>{console.error('FAIL', e.message.slice(0,900)); process.exit(1)});
