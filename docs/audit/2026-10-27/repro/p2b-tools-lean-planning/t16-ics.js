// iCalendar folding: Maintenance Planner (folds every 60 UTF-16 units) and Action Tracker (no folding) vs RFC 5545 (75 octets).
const { open, close } = require('./lib');
(async () => {
  const { page } = await open('/sq/tools/maintenance-planner/');
  const r = await page.evaluate(() => {
    const ics = window.MaintenancePlannerMath.ics([{ uid: 'x1', date: '2026-11-02', summary: 'Kontrollë e përjavshme e ngrohësit në katin e dytë: çelësat, rripat, filtrat, vajrat — ëëëëëëëëëë', description: '🔧'.repeat(40) }]);
    const enc = new TextEncoder();
    const lines = ics.split('\r\n');
    return { maxOctets: Math.max(...lines.map((l) => enc.encode(l).length)), loneSurrogate: lines.some((l) => /[\uD800-\uDBFF]$|^ ?[\uDC00-\uDFFF]/.test(l)) };
  });
  console.log('Maintenance ICS:', r);
  await page.context().close(); await close();
})();
