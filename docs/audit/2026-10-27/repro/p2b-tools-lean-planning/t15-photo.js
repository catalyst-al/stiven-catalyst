// 5S Audit photo: a 4000x3000 photo attached to the first question; what does IndexedDB keep?
const path = require('path');
const { open, close } = require('./lib');
(async () => {
  const { page, errors } = await open('/tools/five-s-audit/');
  const inputs = await page.$$('input[type=file][accept="image/*"]');
  console.log('photo inputs on page:', inputs.length);
  if (inputs.length) {
    await inputs[0].setInputFiles(path.join(__dirname, 'fixtures', 'big.jpg'));
    await page.waitForTimeout(2500);
    const recs = await page.evaluate(() => new Promise((res) => { const r = indexedDB.open('sc-media'); r.onsuccess = () => { const db = r.result; if (!db.objectStoreNames.contains('photos')) return res([]); const all = db.transaction('photos').objectStore('photos').getAll(); all.onsuccess = () => res(all.result.map((x) => ({ tool: x.tool, ref: x.ref, w: x.width, h: x.height, bytes: x.blob && x.blob.size, type: x.blob && x.blob.type }))); }; r.onerror = () => res('err'); }));
    console.log('stored:', JSON.stringify(recs));
  }
  console.log('errors', errors);
  await page.context().close(); await close();
})();
