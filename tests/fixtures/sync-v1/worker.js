// Team sync for the Stiven Catalyst tools: a Cloudflare Worker that keeps one encrypted file per team ("space").
//
// The browser encrypts the team's work with a key derived from the team code (AES-GCM, PBKDF2) before it leaves the
// device; this server only ever sees ciphertext, a revision number and a hash of the write token. It cannot read the work
// and cannot tell one team from another beyond the random id.
//
// API (JSON):
//   GET    /v1/spaces/:id        → 200 { rev, updated, iv, data } or 404 when the space does not exist yet
//   PUT    /v1/spaces/:id        Authorization: Bearer <write token>, body { rev, iv, data }
//                                → 200 { rev, updated }; 409 { rev } when rev is not the current one (someone saved
//                                first: pull, merge, push again); 403 when the token is not the space's token
//   DELETE /v1/spaces/:id        Authorization: Bearer <write token> → 204, the space and everything in it are gone
// :id and the token are 64 hex characters (SHA-256 values the browser derives from the team code). A space that nobody
// writes to for 180 days deletes itself. The ciphertext may be up to 4 MB.
//
// Storage: one SQLite-backed Durable Object per space (class Space), so writes to one space are serialised.

const ORIGINS = new Set(["https://stivencatalyst.com", "https://www.stivencatalyst.com", "http://localhost:8080"]);
const MAX_BYTES = 4 * 1024 * 1024;
const CHUNK = 1024 * 1024;
const IDLE_MS = 180 * 24 * 60 * 60 * 1000;
const HEX64 = /^[0-9a-f]{64}$/;

const cors = (request) => {
  const origin = request.headers.get("Origin");
  const headers = {
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && ORIGINS.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
};
const json = (request, status, body) => new Response(body === null ? null : JSON.stringify(body), {
  status,
  headers: { ...cors(request), ...(body === null ? {} : { "Content-Type": "application/json; charset=utf-8" }), "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
});
const sha256 = async (text) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)))].map((b) => b.toString(16).padStart(2, "0")).join("");
const tokenOf = (request) => {
  const match = /^Bearer ([0-9a-f]{64})$/.exec(request.headers.get("Authorization") || "");
  return match ? match[1] : null;
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(request) });
    if (url.pathname === "/" || url.pathname === "/v1") return json(request, 200, { service: "stiven-catalyst-sync", version: 1 });
    const match = /^\/v1\/spaces\/([0-9a-f]{64})$/.exec(url.pathname);
    if (!match) return json(request, 404, { error: "not-found" });
    // A request from a browser on another site is refused outright; tools such as curl send no Origin and may read the
    // ciphertext of a space they know the id of, which tells them nothing.
    const origin = request.headers.get("Origin");
    if (origin && !ORIGINS.has(origin)) return json(request, 403, { error: "origin" });
    if (!["GET", "PUT", "DELETE"].includes(request.method)) return json(request, 405, { error: "method" });
    const stub = env.SPACES.get(env.SPACES.idFromName(match[1]));
    const response = await stub.fetch(new Request(`https://space/${request.method}`, { method: "POST", headers: request.headers, body: request.method === "PUT" ? request.body : null }));
    const body = response.status === 204 ? null : await response.json();
    return json(request, response.status, body);
  },
};

export class Space {
  constructor(ctx) {
    this.ctx = ctx;
    this.storage = ctx.storage;
  }

  async fetch(request) {
    const method = new URL(request.url).pathname.slice(1);
    const reply = (status, body) => new Response(body === null ? null : JSON.stringify(body), { status });
    const meta = (await this.storage.get("meta")) || null;
    if (method === "GET") {
      if (!meta) return reply(404, { error: "empty" });
      const parts = await this.storage.get([...Array(meta.chunks).keys()].map((i) => `chunk:${i}`));
      const data = [...Array(meta.chunks).keys()].map((i) => parts.get(`chunk:${i}`) || "").join("");
      return reply(200, { rev: meta.rev, updated: meta.updated, iv: meta.iv, data });
    }
    const token = tokenOf(request);
    if (!token) return reply(401, { error: "token" });
    const tokenHash = await sha256(`write:${token}`);
    if (meta && meta.tokenHash !== tokenHash) return reply(403, { error: "token" });
    if (method === "DELETE") {
      await this.storage.deleteAll();
      await this.storage.deleteAlarm();
      return reply(204, null);
    }
    // PUT
    const length = Number(request.headers.get("Content-Length") || 0);
    if (length > MAX_BYTES + 4096) return reply(413, { error: "too-large" });
    let body;
    try { body = JSON.parse(await request.text()); } catch { return reply(400, { error: "json" }); }
    if (!body || typeof body.data !== "string" || typeof body.iv !== "string" || !/^[A-Za-z0-9+/=]{16,32}$/.test(body.iv) || !/^[A-Za-z0-9+/=]*$/.test(body.data)) return reply(400, { error: "shape" });
    if (body.data.length > MAX_BYTES) return reply(413, { error: "too-large" });
    const current = meta ? meta.rev : 0;
    if (body.rev !== current) return reply(409, { rev: current });
    // At most one write a second on average: a runaway client cannot fill the space with churn.
    const now = Date.now();
    if (meta && now - meta.updated < 1000) return reply(429, { error: "slow-down" });
    const chunks = Math.max(1, Math.ceil(body.data.length / CHUNK));
    const entries = {};
    for (let i = 0; i < chunks; i++) entries[`chunk:${i}`] = body.data.slice(i * CHUNK, (i + 1) * CHUNK);
    const next = { rev: current + 1, updated: now, iv: body.iv, chunks, tokenHash };
    await this.storage.put({ ...entries, meta: next });
    if (meta && meta.chunks > chunks) await this.storage.delete([...Array(meta.chunks - chunks).keys()].map((i) => `chunk:${chunks + i}`));
    await this.storage.setAlarm(now + IDLE_MS);
    return reply(200, { rev: next.rev, updated: next.updated });
  }

  // Nobody has written for 180 days: the space goes.
  async alarm() {
    const meta = await this.storage.get("meta");
    if (meta && Date.now() - meta.updated < IDLE_MS) { await this.storage.setAlarm(meta.updated + IDLE_MS); return; }
    await this.storage.deleteAll();
  }
}
