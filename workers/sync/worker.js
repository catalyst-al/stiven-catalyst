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
//                                first: pull, merge, push again); 403 when the token is not the space's token;
//                                413 when the body is larger than 4 MB; 429 when writes come too fast, or when too
//                                many new spaces were made (see Limits)
//   DELETE /v1/spaces/:id        Authorization: Bearer <write token> → 204, the space and everything in it are gone
// :id and the token are 64 hex characters, which the browser derives from the team code with PBKDF2 (310 000 rounds,
// src/js/team-sync.js); spaces of teams made before have SHA-256 ids, and the browser moves them. A space that nobody
// writes to for 180 days deletes itself. The ciphertext may be up to 4 MB.
//
// Storage: one SQLite-backed Durable Object per space (class Space), so writes to one space are serialised.
//
// Limits, with the one binding the Worker has (SPACES): no KV, nothing paid on top.
// - A body is read up to 4 MB (and 4 KB of JSON around it), with or without a Content-Length, and refused past that
//   before it reaches a space.
// - New spaces: at most CREATE_LIMIT_IP an hour from one address (an IPv6 address counts by its /64) and at most
//   CREATE_LIMIT_ALL a day from everyone, counted by small Space objects named "limit:..." (their own storage,
//   deleted by their alarm when the hour or the day is over; no request reaches them from outside, since a space id
//   is 64 hex characters). Writing to a space that exists is not counted. Both numbers can be set as variables of
//   the Worker.
// - Origins: the site's own. Others (http://localhost:8080 for a local "wrangler dev") only where the variable
//   DEV_ORIGINS lists them; production has no such variable.

const ORIGINS = ["https://stivencatalyst.com", "https://www.stivencatalyst.com"];
const MAX_BYTES = 4 * 1024 * 1024;
const MAX_BODY = MAX_BYTES + 4096;
const CHUNK = 1024 * 1024;
const IDLE_MS = 180 * 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const CREATE_LIMIT_IP = 10;
const CREATE_LIMIT_ALL = 1000;
const CLIENT = "X-Sync-Client";

// The origins a browser may call from: the site's, and those DEV_ORIGINS lists (comma-separated) where it is set.
const originsOf = (env) => new Set([...ORIGINS, ...String(env?.DEV_ORIGINS || "").split(",").map((o) => o.trim()).filter((o) => /^https?:\/\/[^/]+$/.test(o))]);
const cors = (request, env) => {
  const origin = request.headers.get("Origin");
  const headers = {
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && originsOf(env).has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
};
const json = (request, env, status, body) => new Response(body === null ? null : JSON.stringify(body), {
  status,
  headers: { ...cors(request, env), ...(body === null ? {} : { "Content-Type": "application/json; charset=utf-8" }), "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
});
const sha256 = async (text) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)))].map((b) => b.toString(16).padStart(2, "0")).join("");
const tokenOf = (request) => {
  const match = /^Bearer ([0-9a-f]{64})$/.exec(request.headers.get("Authorization") || "");
  return match ? match[1] : null;
};
// The body as text, or null once it passes `max` bytes (a stream without a length is counted as it comes).
const readCapped = async (request, max) => {
  if (Number(request.headers.get("Content-Length") || 0) > max) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      try { await reader.cancel(); } catch { /* already closed */ }
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let at = 0;
  chunks.forEach((chunk) => { bytes.set(chunk, at); at += chunk.byteLength; });
  return new TextDecoder().decode(bytes);
};
// Who is asking, for the limit on new spaces: the address Cloudflare saw, an IPv6 one by its /64.
const clientOf = (request) => {
  const ip = String(request.headers.get("CF-Connecting-IP") || "").trim().toLowerCase();
  if (!ip) return "unknown";
  if (!ip.includes(":")) return ip;
  const [head, tail = ""] = ip.split("::");
  const parts = head.split(":").filter(Boolean);
  const rest = tail.split(":").filter(Boolean);
  const full = [...parts, ...Array(Math.max(0, 8 - parts.length - rest.length)).fill("0"), ...rest];
  return `${full.slice(0, 4).map((part) => part.replace(/^0+(?=.)/, "")).join(":")}::/64`;
};
const limitOf = (value, fallback) => {
  const n = Number(value);
  return value !== undefined && value !== "" && Number.isInteger(n) && n >= 0 ? n : fallback;
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(request, env) });
    if (url.pathname === "/" || url.pathname === "/v1") return json(request, env, 200, { service: "stiven-catalyst-sync", version: 1 });
    const match = /^\/v1\/spaces\/([0-9a-f]{64})$/.exec(url.pathname);
    if (!match) return json(request, env, 404, { error: "not-found" });
    // A request from a browser on another site is refused outright; tools such as curl send no Origin and may read the
    // ciphertext of a space they know the id of, which tells them nothing.
    const origin = request.headers.get("Origin");
    if (origin && !originsOf(env).has(origin)) return json(request, env, 403, { error: "origin" });
    if (!["GET", "PUT", "DELETE"].includes(request.method)) return json(request, env, 405, { error: "method" });
    let body = null;
    if (request.method === "PUT") {
      body = await readCapped(request, MAX_BODY);
      if (body === null) return json(request, env, 413, { error: "too-large" });
    }
    // Only this Worker says who is asking: a header of that name from outside is replaced.
    const headers = new Headers(request.headers);
    headers.set(CLIENT, clientOf(request));
    const stub = env.SPACES.get(env.SPACES.idFromName(match[1]));
    const response = await stub.fetch(new Request(`https://space/${request.method}`, { method: "POST", headers, body }));
    const answer = response.status === 204 ? null : await response.json();
    return json(request, env, response.status, answer);
  },
};

export class Space {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
    this.storage = ctx.storage;
  }

  // One more new space on the counter `name`, when fewer than `max` were made in its window: true, else false.
  async allow(name, max, windowMs) {
    const stub = this.env.SPACES.get(this.env.SPACES.idFromName(`limit:${name}`));
    const response = await stub.fetch(new Request("https://space/LIMIT", { method: "POST", headers: { "X-Limit": String(max), "X-Window": String(windowMs) } }));
    return response.status === 200;
  }

  async fetch(request) {
    const method = new URL(request.url).pathname.slice(1);
    const reply = (status, body) => new Response(body === null ? null : JSON.stringify(body), { status });
    // A counter of new spaces: only another Space asks it (the Worker forwards GET, PUT and DELETE alone).
    if (method === "LIMIT") {
      const max = Number(request.headers.get("X-Limit"));
      const windowMs = Number(request.headers.get("X-Window"));
      const now = Date.now();
      let count = (await this.storage.get("limit")) || null;
      if (!count || now - count.start >= windowMs) count = { start: now, n: 0 };
      if (count.n >= max) return reply(429, { error: "limit" });
      count.n += 1;
      await this.storage.put("limit", count);
      await this.storage.setAlarm(count.start + windowMs);
      return reply(200, { n: count.n });
    }
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
    // A new space: within the limits for the address it comes from, and for everyone.
    if (!meta) {
      const client = request.headers.get(CLIENT) || "unknown";
      if (!(await this.allow(`ip:${client}`, limitOf(this.env?.CREATE_LIMIT_IP, CREATE_LIMIT_IP), HOUR))) return reply(429, { error: "too-many-spaces" });
      if (!(await this.allow("all", limitOf(this.env?.CREATE_LIMIT_ALL, CREATE_LIMIT_ALL), DAY))) return reply(429, { error: "too-many-spaces" });
    }
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

  // Nobody has written for 180 days: the space goes. A counter of new spaces (no meta) goes when its window is over.
  async alarm() {
    const meta = await this.storage.get("meta");
    if (meta && Date.now() - meta.updated < IDLE_MS) { await this.storage.setAlarm(meta.updated + IDLE_MS); return; }
    await this.storage.deleteAll();
  }
}
