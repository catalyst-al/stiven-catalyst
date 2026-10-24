// Uploads workers/sync/worker.js as the Worker "stiven-catalyst-sync" with its Durable Object and turns on its
// workers.dev address. Needs CLOUDFLARE_ACCOUNT_ID (or the default below) and an API token in CLOUDFLARE_API_TOKEN
// (a session whose network proxy adds the token itself may leave it out). The calls go through curl, so a proxy that
// authenticates curl's traffic is honoured.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const account = process.env.CLOUDFLARE_ACCOUNT_ID || "6bf56de63354f2b14587870ee30941f9";
const name = "stiven-catalyst-sync";
const api = `https://api.cloudflare.com/client/v4/accounts/${account}/workers/scripts/${name}`;
const auth = process.env.CLOUDFLARE_API_TOKEN ? ["-H", `Authorization: Bearer ${process.env.CLOUDFLARE_API_TOKEN}`] : [];
const curl = (...args) => {
  try { return JSON.parse(execFileSync("curl", ["-sS", ...auth, ...args], { encoding: "utf8" })); } catch { return null; }
};

// The Durable Object class is created by a migration, which may only run once: later uploads leave it out.
const first = !curl(`${api}/settings`)?.success;
const metadata = {
  main_module: "worker.js",
  compatibility_date: "2026-09-14",
  bindings: [{ type: "durable_object_namespace", name: "SPACES", class_name: "Space" }],
  ...(first ? { migrations: { new_tag: "v1", new_sqlite_classes: ["Space"] } } : {}),
};
const metaFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "sync-")), "metadata.json");
fs.writeFileSync(metaFile, JSON.stringify(metadata));
const upload = curl("-X", "PUT", api, "-F", `metadata=@${metaFile};type=application/json`, "-F", `worker.js=@${path.join(here, "worker.js")};type=application/javascript+module`);
if (!upload?.success) { console.error(JSON.stringify(upload?.errors || "upload failed")); process.exit(1); }
const sub = curl("-X", "POST", `${api}/subdomain`, "-H", "Content-Type: application/json", "--data", JSON.stringify({ enabled: true, previews_enabled: false }));
if (!sub?.success) { console.error(JSON.stringify(sub?.errors || "subdomain failed")); process.exit(1); }
console.log(`${name} deployed${first ? " (first time, Durable Object created)" : ""}.`);
