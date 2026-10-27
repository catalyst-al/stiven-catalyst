# Team sync: migration plan, compatibility and rollback

Prepared on 27 October 2026, on the author's instruction: "Team Sync Worker: do not publish it yet. First prepare
the migration plan, the compatibility check and the way back." Nothing here has been deployed. Each step below
waits for the author's approval.

## 1. What runs today (checked on 27 October 2026)

| Part | Where | Version | How it was checked |
| --- | --- | --- | --- |
| Worker `stiven-catalyst-sync` | Cloudflare, `https://stiven-catalyst-sync.stivenjanaqi1.workers.dev` | `cc107fc4-5863-49e6-af56-c17948fac8a7`, deployed 24 Oct 2026 17:33 UTC (the one before: `a83f1476-45df-4cee-9272-7f1da6fb2abe`, 17:20 UTC) | Read back through the Cloudflare API (read only): the script equals `workers/sync/worker.js` on `main` apart from its final newline; binding `SPACES` (Durable Object class `Space`), compatibility date 2026-09-14, no variables. `GET /` answers `{"service":"stiven-catalyst-sync","version":1}` |
| The "Team sync" box | the published site (`main`) | `src/js/team-sync.js` on `main` | the file itself |

Frozen copies of both are in `tests/fixtures/sync-v1/` (with their checksum), so the tests can run the old code
against the new.

## 2. What changes

**The Worker** (`workers/sync/worker.js`, commit 697cbf95). The API is the same (`GET`, `PUT`, `DELETE
/v1/spaces/:id`, the same answers), with limits added:
- a body is refused past 4 MB before it reaches a space, with or without a Content-Length (413);
- new spaces: at most 10 an hour from one address (IPv6 by /64) and 1000 a day from everyone (429), counted with
  small objects of the same `Space` class (`limit:…`); writing to a space that exists is not counted;
- `http://localhost:8080` is no longer allowed in production (only where the variable `DEV_ORIGINS` lists it).

No new binding, no new Durable Object class, no migration: `deploy.mjs` sees that the Worker exists and uploads the
code alone.

**The box** (`src/js/team-sync.js`, commits 4e69750f, 697cbf95, 9e64b36c). It ships with the site:
- the space id and the write token come from PBKDF2 (310,000 rounds) instead of one SHA-256 of the team code; the
  encryption key is unchanged;
- a team made before is found at its old address, moved to the new one at its first sync, and the old space is
  deleted with the old token (kept to delete later when that fails);
- deletions reach every device: the copy carries tombstones for 90 days (payload version 2).

## 3. Compatibility, verified

`tests/sync-compat.test.cjs` runs both versions of both parts together (the Worker in node, with a fake of its
Durable Objects whose storage survives a change of code, as on Cloudflare). Results on 27 October 2026: 6 of 6
pass, three runs in a row.

| Combination | What happens | Test |
| --- | --- | --- |
| Today's box, new Worker | create, sync, merge, delete the copy: all as today | "step 1, the Worker first" |
| New box, today's Worker | the move, the tombstones and deleting the copy all work | "the other order is safe too" |
| New box and a tab still on the old page, same team | the new box moves the copy; the old tab's next sync finds nothing ("gone") and writes nothing, at neither address; pointed at the new copy it reads it as "unreadable" (version 2) and writes nothing; after a reload it finds the team and nothing is lost | "step 2, then the site" |
| Worker rolled back | spaces written by the new Worker open with today's; the `limit:` counters are out of reach from outside | "rollback of the Worker" |
| Site rolled back after teams moved | the old box finds no copy ("gone"), writes nothing; the work stays on the device; the new box finds the team again | "rollback of the site" |

The other sync tests stay green as well: `sync-worker`, `team-sync-keys`, `team-sync-deletions`, `team-sync`.

What the tests cannot show: the real Cloudflare runtime (its body streams and alarms), and real browsers on real
networks. Hence the checks after each step below.

## 4. The order: the Worker first, the site later

1. **The Worker.** Safe with the box as it is published today (row 1 above). Nothing visible changes for teams.
2. **Watch for two days**: the Worker's logs and errors in the Cloudflare dashboard (429 and 413 should be rare; a
   burst of 429 "too-many-spaces" means the limits are too tight: raise `CREATE_LIMIT_IP` / `CREATE_LIMIT_ALL` as
   variables of the Worker, no new code).
3. **The site** (a merge to `main`, by the author). Each team moves at its first sync with the new page.

Either order is safe (rows 1 and 2); the Worker first keeps each step small and lets it be undone on its own.

### Before step 1
- `npm test`: `# fail 0`, `# skipped 0`, `sync-compat` included.
- Note the version running then (today `cc107fc4-…`); if it differs, read it back as in section 1 first.
- In the Worker's settings: no `DEV_ORIGINS` variable.

### Step 1, deploy (author's approval needed)
```
node workers/sync/deploy.mjs
```
Then, from any shell, with a made-up id (64 hex characters) that no team uses:
- `curl -s https://stiven-catalyst-sync.stivenjanaqi1.workers.dev/` → `{"service":"stiven-catalyst-sync","version":1}`
- `GET /v1/spaces/<id>` with `Origin: https://stivencatalyst.com` → 404 and `Access-Control-Allow-Origin` set
- the same with `Origin: http://localhost:8080` → 403
- a `PUT` of 5 MB → 413 (nothing is created)
- on the published site, two browsers: start a team in one, join in the other, change a row, sync both; then
  "Delete the team's copy". This makes one space and deletes it.

### Step 3, the site (author's approval needed)
After the merge and the GitHub Pages build: on the published site, a team made before the change (two browsers with
the old page synced) syncs once with the new page; the box shows it as synced, and the old address answers 404.

What the teams notice:
- **A read-only code made before stops working** once its team's copy has moved; the box says the copy is no longer
  on the server. A member makes a new read-only code from the box and passes it on.
- **A tab left open on the old page** shows "The team's copy is no longer on the server" at its next sync. Reloading
  the page is enough. Starting a new team from that old tab would make a space at the old address again; the team's
  work is not lost (it stays on the device and goes up with the next sync of the new page), but that space would sit
  unused until it expires after 180 days. A one-line note in the release news ("reload open tool pages") avoids it.

## 5. The way back

**The Worker** (minutes; nothing is lost). In the Cloudflare dashboard: Workers & Pages → `stiven-catalyst-sync` →
Deployments → the version noted before step 1 (today `cc107fc4-5863-49e6-af56-c17948fac8a7`) → Rollback. Or through
the API: `POST /accounts/<account>/workers/scripts/stiven-catalyst-sync/deployments` with
`{"strategy":"percentage","versions":[{"version_id":"cc107fc4-5863-49e6-af56-c17948fac8a7","percentage":100}]}`.
The spaces are kept by Cloudflare across versions and open with either one (row 4). The `limit:` counters are left
behind, unreachable, and are removed by their own storage when the old Worker's alarm finds them without a space
in them.

**The site** (a revert of the merge on `main`, then the Pages build). Teams that have not moved yet see no change.
Teams that have moved: the old page finds no copy and writes nothing; the work stays on every device; when the new
page comes back, it finds the team again (row 5). Tombstones written meanwhile are kept in the copy, which the old
page cannot read and so cannot overwrite. Rolling back the site is therefore safe, but it pauses sync for teams that
moved; rolling back the Worker alone is the first choice when the trouble is on the server.

**Both at once**: the Worker first, then the site; each as above.

## 6. After the change

When both have run for 90 days (the life of a tombstone) without a rollback, `tests/fixtures/sync-v1/` and
`tests/sync-compat.test.cjs` can be removed together, and the move from the old address can stay as it is (a team
not synced for 180 days has lost its old space anyway).
