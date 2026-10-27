# Team sync server

`worker.js` is the Cloudflare Worker behind the "Team sync" box of the tools (`src/js/team-sync.js`). It keeps one
encrypted file per team and never sees the work in clear text: the browser encrypts it with a key derived from the team
code before sending it. See the comment at the top of `worker.js` for the API.

- Name: `stiven-catalyst-sync`, on `https://stiven-catalyst-sync.stivenjanaqi1.workers.dev`.
- Storage: one SQLite-backed Durable Object per team (`Space`, binding `SPACES`).
- Deploy (from the repository root, with a Cloudflare API token that may edit Workers scripts):

```
node workers/sync/deploy.mjs
```

The site reads the address from `src/_data/site.json` (`sync.endpoint`); leave it empty to hide the box everywhere.
A space nobody writes to for 180 days deletes itself; "Delete the team's copy" in the box deletes it at once.

Limits (see the top of `worker.js`; tests in `tests/sync-worker.test.cjs`, run by `npm test` without deploying):
a body is refused past 4 MB, with or without a Content-Length; at most 10 new spaces an hour from one address (an
IPv6 address by its /64) and 1000 a day from everyone, counted with the same Durable Object binding (no KV, nothing
paid). The Worker variables `CREATE_LIMIT_IP` and `CREATE_LIMIT_ALL` change the two numbers. Only the site's origins
may call from a browser; for a local `wrangler dev`, set `DEV_ORIGINS=http://localhost:8080` there, never in
production (`deploy.mjs` sets no variables).

Before deploying a change: `docs/SYNC-WORKER-MIGRATION.md` (the order, the checks after each step, the way back;
`tests/sync-compat.test.cjs` runs the code in production against the new).
