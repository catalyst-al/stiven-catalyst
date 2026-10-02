// "Save all your work": every tool keeps its work only in this browser (localStorage keys that
// start with "sc-"). This writes them all to one file, and opens such a file on another phone,
// computer or browser. Nothing is sent anywhere; the file stays with the visitor.
(() => {
  const FORMAT = "stiven-catalyst-work";
  const VERSION = 1;
  const MAX_BYTES = 20 * 1024 * 1024;
  // Settings of the page itself, not work.
  const SKIP = new Set(["sc-theme", "sc-print-guide-hidden"]);
  // Storage names that differ from the tool's address.
  const ALIAS = { "sigma-chart": "sigma-control-chart", dmaic: "six-sigma-dmaic", "cx-tower": "cx-control-tower" };

  const isWork = (key) => typeof key === "string" && key.startsWith("sc-") && !SKIP.has(key);
  // "sc-damage-control-sq-check" → "damage-control": the floor check and calculator settings
  // belong to their tool, and each language of a tool keeps its own log.
  const toolSlug = (key) => {
    const slug = key.replace(/^sc-/, "").replace(/-(check|calc)$/, "").replace(/-(de|sq)$/, "");
    return ALIAS[slug] || slug;
  };

  // A saved file, checked before anything in this browser is replaced.
  const readBackup = (text) => {
    let file;
    try { file = JSON.parse(text); } catch { return null; }
    if (!file || typeof file !== "object" || file.format !== FORMAT || file.version !== VERSION) return null;
    const items = file.items;
    if (!items || typeof items !== "object" || Array.isArray(items)) return null;
    const entries = Object.entries(items);
    if (!entries.length || entries.some(([key, value]) => !isWork(key) || typeof value !== "string")) return null;
    return { exported: typeof file.exported === "string" ? file.exported : "", items: Object.fromEntries(entries) };
  };
  const makeBackup = (storage, now = new Date()) => {
    const items = {};
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (isWork(key)) items[key] = storage.getItem(key);
    }
    return { format: FORMAT, version: VERSION, exported: now.toISOString(), items };
  };
  window.WorkBackup = { isWork, toolSlug, readBackup, makeBackup };

  const root = document.querySelector("[data-work-backup]");
  if (!root) return;
  const text = JSON.parse(root.dataset.text);
  const names = JSON.parse(document.getElementById("work-backup-names")?.textContent || "{}");
  const summary = root.querySelector("[data-work-summary]");
  const status = root.querySelector("[data-work-status]");
  const fill = (template, vars) => template.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));

  const storage = (() => {
    try {
      const probe = window.localStorage;
      probe.length;
      return probe;
    } catch {
      return null;
    }
  })();

  const toolNames = (keys) => [...new Set(keys.map((key) => {
    const slug = toolSlug(key);
    return slug === "coaching-v1" ? text.coaching : names[slug] || slug;
  }))].sort((a, b) => a.localeCompare(b));

  const showSummary = () => {
    if (!storage) {
      summary.textContent = text.blocked;
      root.querySelectorAll("button, input").forEach((node) => { node.disabled = true; });
      return;
    }
    const tools = toolNames(Object.keys(makeBackup(storage).items));
    summary.textContent = tools.length ? fill(text.inBrowser, { n: tools.length, tools: tools.join(", ") }) : text.nothing;
  };

  const say = (message) => {
    status.textContent = message;
  };

  root.querySelector("[data-work-save]").addEventListener("click", () => {
    const backup = makeBackup(storage);
    if (!Object.keys(backup.items).length) {
      say(text.nothing);
      return;
    }
    const now = new Date();
    const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify(backup)], { type: "application/json" }));
    link.download = `stiven-catalyst-${day}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    say(fill(text.saved, { file: link.download }));
  });

  const picker = root.querySelector("[data-work-open]");
  picker.addEventListener("change", async () => {
    const file = picker.files[0];
    picker.value = "";
    if (!file) return;
    if (file.size > MAX_BYTES) {
      say(text.invalid);
      return;
    }
    const backup = readBackup(await file.text());
    if (!backup) {
      say(text.invalid);
      return;
    }
    const keys = Object.keys(backup.items);
    const date = backup.exported ? new Date(backup.exported) : null;
    const pad = (n) => String(n).padStart(2, "0");
    const when = date && !Number.isNaN(date.getTime())
      ? (document.documentElement.lang === "en" ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`)
      : "?";
    if (!window.confirm(fill(text.confirm, { date: when, tools: toolNames(keys).join(", ") }))) return;
    // All or nothing: when the browser runs out of space halfway, the tools already written get
    // their old data back, so the device never holds half of one file and half of the other.
    const before = new Map(keys.map((key) => [key, storage.getItem(key)]));
    const written = [];
    let full = false;
    for (const key of keys) {
      try {
        storage.setItem(key, backup.items[key]);
        written.push(key);
      } catch {
        full = true;
        break;
      }
    }
    if (full) {
      written.forEach((key) => {
        try {
          if (before.get(key) === null) storage.removeItem(key);
          else storage.setItem(key, before.get(key));
        } catch { /* the old value was there before, so it fits again */ }
      });
      say(text.full);
      return;
    }
    say(text.opened);
    setTimeout(() => window.location.reload(), 900);
  });

  showSummary();
  // Work saved in another tab shows up here too.
  window.addEventListener("storage", showSummary);
})();
