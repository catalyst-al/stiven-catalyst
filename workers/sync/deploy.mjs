// Uploads workers/sync/worker.js as the Worker "stiven-catalyst-sync" with its Durable Object and turns on its
// workers.dev address. Needs CLOUDFLARE_ACCOUNT_ID (or the default below) and an API token in CLOUDFLARE_API_TOKEN
// (a session whose network proxy adds the token itself may leave it out). The calls go through curl, so a proxy that
// authenticates curl's traffic is honoured.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
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

// The file that goes up, by its SHA-256; with SYNC_EXPECT_SHA256 set, any other file is refused.
const source = fs.readFileSync(path.join(here, "worker.js"));
const sha = createHash("sha256").update(source).digest("hex");
if (process.env.SYNC_EXPECT_SHA256 && process.env.SYNC_EXPECT_SHA256 !== sha) {
  console.error(`worker.js is ${sha}, not the expected ${process.env.SYNC_EXPECT_SHA256}: nothing was uploaded.`);
  process.exit(1);
}

// The Durable Object class is created by a migration, which may only run once: later uploads leave it out. Whether
// the Worker exists is asked first, and the answer has to be clear: it exists (with its SPACES binding to the class
// Space), or Cloudflare says it does not (error 10007). A request that failed, or any other answer, is neither: the
// script stops without uploading, so a network fault can never be taken for a first install and send a migration to
// a Worker whose spaces exist. A first install is done only when it is asked for by name (SYNC_FIRST_INSTALL=1).
const settings = curl(`${api}/settings`);
const exists = settings?.success === true;
const missing = settings?.success === false && (settings.errors || []).some((error) => error.code === 10007);
if (!exists && !missing) {
  console.error(`The Worker's settings could not be read (${JSON.stringify(settings?.errors || "no answer")}): nothing was uploaded.`);
  process.exit(1);
}
if (exists) {
  const bindings = settings.result?.bindings || [];
  const spaces = bindings.find((binding) => binding.name === "SPACES");
  if (!spaces || spaces.type !== "durable_object_namespace" || spaces.class_name !== "Space") {
    console.error(`The Worker exists without the SPACES binding to the class Space (${JSON.stringify(bindings.map((b) => [b.type, b.name, b.class_name]))}): nothing was uploaded.`);
    process.exit(1);
  }
  const other = bindings.filter((binding) => binding.name !== "SPACES").map((binding) => binding.name);
  if (other.length) {
    console.error(`The Worker has bindings or variables this upload would remove (${other.join(", ")}): nothing was uploaded. Add them to the metadata here first.`);
    process.exit(1);
  }
}
if (missing && process.env.SYNC_FIRST_INSTALL !== "1") {
  console.error("Cloudflare says this Worker does not exist. A first install creates the Durable Object class: run again with SYNC_FIRST_INSTALL=1 if that is meant.");
  process.exit(1);
}
const first = missing;
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
console.log(`${name} deployed${first ? " (first time, Durable Object created)" : ""}: worker.js ${sha}, deployment ${upload.result?.deployment_id || upload.result?.id || "(see the dashboard)"}.`);
