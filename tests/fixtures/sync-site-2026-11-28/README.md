# The team sync box as the site publishes it on 28 November 2026

`team-sync.js` = `src/js/team-sync.js` on `main` at 198b83b4 (the commit GitHub Pages published in run 938),
copied unchanged. SHA-256: `99e0aa73fdbbd203cd52b576b7da32322a9a46d64effb283314b49c34bb83abe`.

`tests/sync-compat.test.cjs` runs it against the Worker of this branch: the Worker is deployed before the site, so
the page people have open today must keep working on the new Worker. The Worker that is live today is still
`tests/fixtures/sync-v1/worker.js` (version cc107fc4, read back through the Cloudflare API on 28 November 2026 and
equal to that file).

Frozen on purpose: do not update it when the code changes. It can go with `tests/fixtures/sync-v1/` once the new
Worker and the new site have both been live for the rollback window (`docs/SYNC-WORKER-MIGRATION.md`).
