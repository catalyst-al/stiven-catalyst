// The Worker in workerd, Cloudflare's own runtime, on this machine (through miniflare): real Durable Objects with
// SQLite storage kept on disk across a change of the Worker's code. It deploys nothing and calls nothing outside this
// machine; the data is made up. It answers what the tests in node (a fake of the storage) cannot: that the new code
// opens what the Worker live today stored, that the token rules hold in the real runtime, and that the Worker can be
// rolled back and forward over the same storage.
//
// miniflare is not a dependency of this repository. Install it anywhere and say where:
//   mkdir /tmp/mf && cd /tmp/mf && npm init -y && npm i miniflare@4
//   MINIFLARE_DIR=/tmp/mf node workers/sync/local-check.mjs
// Last run on 28 November 2026: 25 passed, 0 failed (workerd of miniflare 4, compatibility date 2026-08-06, the
// newest that binary knew; the Worker's own date is 2026-09-14).
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
if (!process.env.MINIFLARE_DIR) { console.error("Set MINIFLARE_DIR to a folder where miniflare is installed (see the top of this file)."); process.exit(2); }
const { Miniflare } = createRequire(path.join(process.env.MINIFLARE_DIR, "package.json"))("miniflare");
const REPO = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const LIVE = fs.readFileSync(path.join(REPO, "tests/fixtures/sync-v1/worker.js"), "utf8");      // == the Worker in production today
const NEW = fs.readFileSync(path.join(REPO, "workers/sync/worker.js"), "utf8");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sync-do-"));
const SITE = "https://stivencatalyst.com";
const start = (script) => new Miniflare({ modules: true, script, compatibilityDate: "2026-08-06", durableObjects: { SPACES: { className: "Space", useSQLite: true } }, durableObjectsPersist: dir });
const id = (n) => n.toString(16).padStart(64, "0");
const A = "a".repeat(64), B = "b".repeat(64);
let pass = 0, fail = 0;
const check = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); ok ? pass++ : fail++; console.log(ok ? "ok  " : "FAIL", name, ok ? "" : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); };
const api = (mf) => {
  const call = async (method, space, { token = A, body, origin = SITE } = {}) => { const r = await mf.dispatchFetch(`https://sync.test/v1/spaces/${space}`, { method, headers: { ...(origin ? { Origin: origin } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { "Content-Type": "application/json" } : {}), "CF-Connecting-IP": "203.0.113.9" }, body }); let json = null; try { json = await r.json(); } catch {} return { status: r.status, json, cors: r.headers.get("Access-Control-Allow-Origin") }; };
  const put = (space, rev, opts = {}) => call("PUT", space, { body: JSON.stringify({ rev, iv: "AAAAAAAAAAAAAAAA", data: opts.data || "Y2lwaGVy" }), ...opts });
  return { call, put };
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// 1. Today's Worker: a team exists (written by the Worker that is live), then the new code is deployed over it.
let mf = start(LIVE); let { call, put } = api(mf);
check("live: create", (await put(id(1), 0)).status, 200);
await wait(1100); check("live: second write", (await put(id(1), 1, { data: "b2xkLWRhdGE=" })).json?.rev, 2);
check("live: a missing space can be created by any token (the fault)", (await put(id(2), 0, { token: B })).status, 200);
await mf.dispose();

mf = start(NEW); ({ call, put } = api(mf));
const got = await call("GET", id(1), { token: null });
check("new over live: the team's copy is still there, same revision and data", [got.status, got.json?.rev, got.json?.data], [200, 2, "b2xkLWRhdGE="]);
check("new: CORS for the site", got.cors, SITE);
check("new: another origin refused", (await call("GET", id(1), { origin: "https://example.org", token: null })).status, 403);
check("new: localhost refused in production", (await call("GET", id(1), { origin: "http://localhost:8080", token: null })).status, 403);
check("new: no token", (await put(id(1), 2, { token: null })).status, 401);
check("new: wrong token (a read-only code has none) cannot write", (await put(id(1), 2, { token: B })).status, 403);
check("new: wrong token cannot delete", (await call("DELETE", id(1), { token: B })).status, 403);
await wait(1100); check("new: the team writes on, revision 3", (await put(id(1), 2)).json?.rev, 3);
check("new: stale revision", (await put(id(1), 1)).status, 409);
check("new: too fast", (await put(id(1), 3)).status, 429);
check("new: 5 MB refused", (await put(id(1), 3, { data: "A".repeat(5 * 1024 * 1024) })).status, 413);
// Deleted space protection
check("new: the team deletes its copy", (await call("DELETE", id(1))).status, 204);
check("new: the copy is gone", (await call("GET", id(1), { token: null })).status, 404);
check("new: another token cannot write where the team's copy was", (await put(id(1), 0, { token: B })).status, 403);
const again = await put(id(1), 0);
check("new: the team's own token can, and the revision goes on", [again.status, again.json?.rev], [200, 4]);
check("new: a space that never existed can be started by anyone", (await put(id(3), 0, { token: B })).status, 200);
// What is kept of a deleted space: read the Durable Object's storage itself.
await wait(1100); await call("DELETE", id(1));
check("new: after a second delete still the token's", [(await call("GET", id(1), { token: null })).status, (await put(id(1), 0, { token: B })).status], [404, 403]);
await mf.dispose();

// 2. Rollback: today's Worker again over storage the new one wrote (a live space, a closed record, limit counters).
mf = start(NEW); ({ call, put } = api(mf)); await put(id(4), 0); await mf.dispose();
mf = start(LIVE); ({ call, put } = api(mf));
check("rollback: a space written by the new Worker opens with today's", (await call("GET", id(4), { token: null })).json?.rev, 1);
check("rollback: a deleted space reads as not there", (await call("GET", id(1), { token: null })).status, 404);
check("rollback: today's Worker lets it be created again (as before the change)", (await put(id(1), 0)).status, 200);
await mf.dispose();
// 3. Forward again after the rollback.
mf = start(NEW); ({ call, put } = api(mf));
check("forward again: the space made during the rollback is there", (await call("GET", id(1), { token: null })).json?.rev, 1);
await wait(1100); check("forward again: and is written on", (await put(id(1), 1)).json?.rev, 2);
await mf.dispose();
fs.rmSync(dir, { recursive: true, force: true });
console.log(`\n${pass} passed, ${fail} failed (workerd, local)`); process.exit(fail ? 1 : 0);
