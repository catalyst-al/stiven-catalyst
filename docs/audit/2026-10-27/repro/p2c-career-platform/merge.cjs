const { launch } = require('./pw.cjs');
(async () => {
  const b = await launch(); const p = await b.newPage();
  await p.goto('http://localhost:8104/tools/action-tracker/'); await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const M = window.TeamSyncMath;
    const A = JSON.stringify({ rows: [{ id: 'r1', title: 'keep', updated: 1 }, { id: 'r2', title: 'to delete', updated: 1 }] });
    // Device A deletes r2 locally after a sync; the team copy still has r2.
    const local = { 'sc-actions': JSON.stringify({ rows: [{ id: 'r1', title: 'keep', updated: 1 }] }) };
    const remote = { 'sc-actions': A };
    const synced = M.baseOf ? { 'sc-actions': M.baseOf(A) } : {};
    const out = M.merge(local, remote, synced);
    // anno ids collision
    return { keys: Object.keys(M), merged: JSON.parse(out['sc-actions']).rows.map(r => r.id) };
  });
  console.log(JSON.stringify(r));
  await b.close();
})();
