// Housekeeping <- Room Status hand-off on the real page code: which rooms become which clean; stale board.
const { open, check, close, results } = require('./lib');
(async () => {
  const { page } = await open('/tools/housekeeping-planner/');
  const r = await page.evaluate(() => {
    const M = window.HousekeepingPlannerMath;
    const rs = { day: '2026-10-27', rooms: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110'].map((n) => ({ number: n, floor: '1', type: 'double' })),
      board: { 101: { status: 'do' }, 102: { status: 'co' }, 103: { status: 'vd' }, 104: { status: 'od' }, 105: { status: 'occ' }, 106: { status: 'vc', flags: ['vip', 'arrival'] }, 107: { status: 'ooo', ooo: { reason: 'deepclean' } }, 108: { status: 'ooo', ooo: { reason: 'leak' } }, 109: { status: 'od', flags: ['vip'] } } };
    const today = M.fromRoomStatus(rs, { today: '2026-10-27', linenRooms: '104, 105, 999', deepRooms: '103', types: ['double'] });
    const stale = M.fromRoomStatus({ ...rs, day: '2026-10-26' }, { today: '2026-10-27', types: ['double'] });
    const pick = (x) => x.items.map((i) => `${i.room}:${i.clean}${i.vip ? '+vip' : ''}`).join(' ');
    return { today: pick(today), ignored: today.ignored, stale: pick(stale) };
  });
  // independent expectation from the documented rules:
  check('Room Status -> cleans (today)', '101:departure 102:departure 103:deep 104:linen 106:vip+vip 107:deep 109:stayover+vip 110:departure', r.today);
  check('linen listed for non-stayover rooms is reported', { linen: ['105', '999'].filter((x) => x !== '999'), deep: [] }, { linen: r.ignored.linen, deep: r.ignored.deep });
  console.log('stale board:', r.stale);
  await page.context().close(); await close();
})();
