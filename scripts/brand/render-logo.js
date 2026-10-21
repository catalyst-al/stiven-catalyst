// node render.js <svg> <png> <scale>
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
(async()=>{
  const [svg,png,scale]=process.argv.slice(2); const s=parseFloat(scale);
  const src=fs.readFileSync(svg,'utf8'); const m=src.match(/viewBox="0 0 (\d+) (\d+)"/); const W=+m[1],H=+m[2];
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:s});
  await pg.setContent(`<html><body style="margin:0;background:#fff">${src.replace(/width="\d+" height="\d+"/,`width="${W}" height="${H}"`)}</body></html>`);
  await pg.screenshot({path:png,fullPage:false,omitBackground:false});
  await b.close(); console.log(png, W*s, 'x', H*s);
})();
