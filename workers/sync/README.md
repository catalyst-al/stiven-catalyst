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
