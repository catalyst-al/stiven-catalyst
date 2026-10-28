(() => {
  // ---- Sending a handover to the next shift's device, without a server ----
  // The handover travels sealed: { format, version: 2, id, sent, handover } as JSON, gzipped where the browser can,
  // encrypted with AES-GCM 256 under a key derived from a transfer code (PBKDF2-SHA-256, 310 000 rounds, a random
  // salt), with the format bound as additional data, so a changed or damaged byte opens nothing. The bytes
  // [2, salt(16), iv(12), ciphertext] go after "#h2=" in the address of this page (base64url), into a QR code (team-
  // sync.js draws it, up to 2331 bytes), or into a small file for a handover too long for a code. The transfer code
  // is told separately (in person or by phone), never in the same message as the link: the link alone, in a chat
  // history or a screenshot, is unreadable without it. The part of an address after "#" never reaches a server, but
  // it does sit in browser histories and chats, which is why nothing readable is put there any more.
  // Opened, the sealed handover asks for the code, shows what it holds, and replaces nothing unasked; a transfer
  // received once is recognised the second time. The receiver's confirmation comes back as a short code derived from
  // the transfer id and the transfer code (no server): the sender types it, and only then is the handover
  // "acknowledged" on the sender's device too. The old plain links ("#h=", gzip; "#h0=") are still read, with a note
  // that they were made without encryption; they are no longer made.
  const FORMAT = "stiven-catalyst-handover";
  const VERSION = 2;
  const LINK_FORMAT = FORMAT;
  const LINK_VERSION = 1;
  const FILE_FORMAT = "stiven-catalyst-handover-file";
  const ITERATIONS = 310000;
  const MIN_PASSCODE = 8;
  // The format and version bound into the seal (made when needed: a page without TextEncoder still loads).
  const aad = () => new TextEncoder().encode(`${FORMAT}/${VERSION}`);
  const toBase64Url = (bytes) => {
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };
  const fromBase64Url = (text) => {
    const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (text.length % 4)) % 4);
    return Uint8Array.from(atob(padded), (ch) => ch.charCodeAt(0));
  };
  const pipe = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
  const canZip = () => typeof CompressionStream === "function" && typeof DecompressionStream === "function";
  const subtle = () => (typeof crypto !== "undefined" && crypto.subtle) || null;
  const random = (n) => crypto.getRandomValues(new Uint8Array(n));
  // A link anyone can send: a fragment longer than any handover makes, or one that unpacks past MAX_UNPACKED (a few
  // kilobytes of gzip can hold gigabytes of spaces), is refused, and the unpacking stops at the cap.
  const MAX_FRAGMENT = 64 * 1024;
  const MAX_UNPACKED = 256 * 1024;
  const MAX_FILE = 1024 * 1024;
  const inflate = async (bytes) => {
    const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip")).getReader();
    const chunks = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > MAX_UNPACKED) {
        reader.cancel().catch(() => {});
        return null;
      }
      chunks.push(value);
    }
    const out = new Uint8Array(total);
    let at = 0;
    chunks.forEach((chunk) => { out.set(chunk, at); at += chunk.length; });
    return out;
  };
  const newId = () => (typeof crypto.randomUUID === "function" ? crypto.randomUUID() : [...random(16)].map((b) => b.toString(16).padStart(2, "0")).join(""));

  // ---- The transfer code ----
  // Four words of the team-code list when it is on the page (1296 words: about 41 bits), otherwise ten letters and
  // digits without the ones that look alike (about 49 bits). Typed by hand, it is read without case, and spaces or
  // hyphens between the words make no difference.
  const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
  const randomBelow = (n) => {
    const limit = Math.floor(0x100000000 / n) * n;
    for (;;) {
      const value = crypto.getRandomValues(new Uint32Array(1))[0];
      if (value < limit) return value % n;
    }
  };
  const newPasscode = (words = globalThis.TeamSyncMath?.WORDS) => (Array.isArray(words) && words.length >= 1000
    ? Array.from({ length: 4 }, () => words[randomBelow(words.length)]).join("-")
    : Array.from({ length: 10 }, () => ALPHABET[randomBelow(ALPHABET.length)]).join(""));
  const normalisePasscode = (value) => String(value ?? "").normalize("NFKC").toLowerCase().replace(/[\s\-_]+/g, " ").trim();
  const goodPasscode = (value) => normalisePasscode(value).replace(/ /g, "").length >= MIN_PASSCODE;
  const deriveTransferKey = async (passcode, salt) => {
    const base = await subtle().importKey("raw", new TextEncoder().encode(normalisePasscode(passcode)), "PBKDF2", false, ["deriveKey"]);
    return subtle().deriveKey({ name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  };

  // ---- Sealing and opening ----
  // The bytes of a sealed handover: version 2, the salt, the IV, then the ciphertext of [1 + gzip(json)] or [0 + json].
  const packHandover = async (handover, passcode, { id = newId(), now = new Date() } = {}) => {
    const json = new TextEncoder().encode(JSON.stringify({ format: FORMAT, version: VERSION, id, sent: now.toISOString(), handover }));
    let body = null;
    if (canZip()) {
      try { body = await pipe(json, new CompressionStream("gzip")); } catch { body = null; }
    }
    const plain = new Uint8Array((body || json).length + 1);
    plain[0] = body ? 1 : 0;
    plain.set(body || json, 1);
    const salt = random(16);
    const iv = random(12);
    const key = await deriveTransferKey(passcode, salt);
    const sealed = new Uint8Array(await subtle().encrypt({ name: "AES-GCM", iv, additionalData: aad() }, key, plain));
    const bytes = new Uint8Array(1 + 16 + 12 + sealed.length);
    bytes[0] = VERSION;
    bytes.set(salt, 1);
    bytes.set(iv, 17);
    bytes.set(sealed, 29);
    return { id, bytes, fragment: `h2=${toBase64Url(bytes)}` };
  };
  // { handover, id, sent } from sealed bytes and the code; { error: "invalid" } when the bytes are not a sealed
  // handover, { error: "wrong" } when the code is wrong or a byte was changed (AES-GCM cannot tell the two apart).
  const openHandover = async (bytes, passcode) => {
    if (!ArrayBuffer.isView(bytes) || bytes.BYTES_PER_ELEMENT !== 1 || bytes[0] !== VERSION || bytes.length < 1 + 16 + 12 + 16 + 1 || bytes.length > MAX_FRAGMENT) return { error: "invalid" };
    let plain;
    try {
      const key = await deriveTransferKey(passcode, bytes.subarray(1, 17));
      plain = new Uint8Array(await subtle().decrypt({ name: "AES-GCM", iv: bytes.subarray(17, 29), additionalData: aad() }, key, bytes.subarray(29)));
    } catch {
      return { error: "wrong" };
    }
    try {
      const body = plain.subarray(1);
      const json = plain[0] === 1 ? await inflate(body) : body;
      if (!json || json.length > MAX_UNPACKED) return { error: "invalid" };
      const payload = JSON.parse(new TextDecoder().decode(json));
      if (!payload || payload.format !== FORMAT || payload.version !== VERSION || typeof payload.id !== "string" || !payload.id
        || !payload.handover || typeof payload.handover !== "object" || Array.isArray(payload.handover)) return { error: "invalid" };
      return { id: payload.id, sent: typeof payload.sent === "string" ? payload.sent : "", handover: payload.handover };
    } catch {
      return { error: "invalid" };
    }
  };
  const handoverLink = async (handover, passcode, href, options) => {
    const packed = await packHandover(handover, passcode, options);
    return { ...packed, link: `${String(href).split("#")[0]}#${packed.fragment}` };
  };
  // What is in the address: a sealed handover, an old plain one, a confirmation, or nothing.
  const parseFragment = (fragment) => {
    const text = String(fragment ?? "").trim().replace(/^#/, "");
    if (text.length > MAX_FRAGMENT + 4) return null;
    let m = /^h2=([A-Za-z0-9_-]+)$/.exec(text);
    if (m) {
      try { return { kind: "sealed", bytes: fromBase64Url(m[1]) }; } catch { return null; }
    }
    if (/^h0?=[A-Za-z0-9_-]+$/.test(text)) return { kind: "plain", fragment: text };
    m = /^a=([A-Za-z0-9-]+)\.([a-z2-7]{6})(?:\.([A-Za-z0-9_-]*))?$/i.exec(text);
    if (m) {
      let by = "";
      try { by = m[3] ? new TextDecoder().decode(fromBase64Url(m[3])) : ""; } catch { by = ""; }
      return { kind: "ack", id: m[1], code: m[2].toUpperCase(), by };
    }
    return null;
  };

  // ---- A file, for a handover too long for a code, or when there is no chat to send a link ----
  const fileText = (bytes, { date = "", shift = "", sent = "" } = {}) =>
    `${JSON.stringify({ format: FILE_FORMAT, version: VERSION, date, shift, sent, data: toBase64Url(bytes) }, null, 2)}\n`;
  const bytesFromFile = (text) => {
    if (typeof text !== "string" || text.length > MAX_FILE) return null;
    try {
      const file = JSON.parse(text);
      if (!file || file.format !== FILE_FORMAT || file.version !== VERSION || typeof file.data !== "string" || !/^[A-Za-z0-9_-]+$/.test(file.data)) return null;
      const bytes = fromBase64Url(file.data);
      return bytes.length > MAX_FRAGMENT ? null : bytes;
    } catch {
      return null;
    }
  };

  // ---- The old plain link (version 1), still read ----
  const unpackHandover = async (fragment) => {
    const text = String(fragment ?? "").trim();
    if (text.length > MAX_FRAGMENT + 4) return null;
    const m = /^#?(h0?)=([A-Za-z0-9_-]+)$/.exec(text);
    if (!m) return null;
    try {
      let bytes = fromBase64Url(m[2]);
      if (m[1] === "h") {
        if (!canZip()) return null;
        bytes = await inflate(bytes);
      }
      if (!bytes || bytes.length > MAX_UNPACKED) return null;
      const payload = JSON.parse(new TextDecoder().decode(bytes));
      if (!payload || payload.format !== LINK_FORMAT || payload.version !== LINK_VERSION || !payload.handover || typeof payload.handover !== "object" || Array.isArray(payload.handover)) return null;
      return { sent: typeof payload.sent === "string" ? payload.sent : "", handover: payload.handover };
    } catch {
      return null;
    }
  };

  // ---- The confirmation code ----
  // Six characters of base32 from SHA-256("ack:" + id + ":" + code): only a device that opened the handover (so knew
  // the transfer code) can make it, and the sender, who knows both, checks it without any server. Shown as ABC-DEF.
  const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const ackCode = async (id, passcode) => {
    const digest = new Uint8Array(await subtle().digest("SHA-256", new TextEncoder().encode(`ack:${id}:${normalisePasscode(passcode)}`)));
    let bits = 0;
    let value = 0;
    let out = "";
    for (const byte of digest) {
      value = (value << 8) | byte;
      bits += 8;
      while (bits >= 5 && out.length < 6) { out += BASE32[(value >>> (bits - 5)) & 31]; bits -= 5; }
      if (out.length === 6) break;
    }
    return out;
  };
  const showAck = (code) => `${code.slice(0, 3)}-${code.slice(3)}`;
  const readAck = (value) => String(value ?? "").toUpperCase().replace(/[^A-Z2-7]/g, "");
  const ackFragment = (id, code, by = "") => `a=${id}.${readAck(code).toLowerCase()}${by ? `.${toBase64Url(new TextEncoder().encode(by))}` : ""}`;

  // ---- What a handover carries that may be personal or confidential ----
  // Names of people are a choice (left out unless asked for). The texts travel as typed; these patterns catch what a
  // pattern can catch (an email address, a phone number, a card number, an IBAN), so the sender is told before
  // sharing. A guest's name in a sentence is not something a pattern finds: the summary says so.
  const SENSITIVE = [
    ["email", /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/],
    ["iban", /\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]){11,30}\b/],
    ["card", /\b(?:\d[ -]?){13,19}\b/],
    ["phone", /(?:\+|00)?\d(?:[\d ().\/-]{7,}\d)/],
  ];
  const digitsOf = (text) => (text.match(/\d/g) || []).length;
  const sensitiveFindings = (h) => {
    const out = [];
    const look = (field, text) => {
      const value = String(text ?? "");
      if (!value.trim()) return;
      for (const [kind, pattern] of SENSITIVE) {
        const m = pattern.exec(value);
        if (!m) continue;
        if ((kind === "phone" && digitsOf(m[0]) < 9) || (kind === "card" && digitsOf(m[0]) < 13)) continue;
        out.push({ field, kind, sample: m[0].trim().slice(0, 40) });
        return;
      }
    };
    look("area", h.area);
    look("headsUp", h.headsUp);
    look("safety", h.safety);
    (h.metrics || []).forEach((row) => look("metrics", Array.isArray(row) ? row[2] : ""));
    (h.issues || []).forEach((issue) => { look("issues", issue?.text); look("issues", issue?.owner); });
    return out;
  };
  // The handover as shared: without the names of people unless asked, without what the other device decides for
  // itself (the takeover, the sharing and receiving records).
  const forTransfer = (h, { names = false } = {}) => {
    const { ackAt, shared, ack, received, ...rest } = h;
    return {
      ...rest,
      from: names ? rest.from : "",
      to: names ? rest.to : "",
      issues: (rest.issues || []).map((issue) => ({ ...issue, owner: names ? issue.owner : "" })),
    };
  };

  // ---- New issues and the ones already here ----
  const issueKey = (text) => String(text ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  // The issues of a received handover beside the open issues of this device: the incoming ones (an incoming issue
  // that is open here too keeps the higher carry count), then this device's open issues the sender did not have,
  // marked as kept, so nothing open here is lost by taking over.
  const mergeIssues = (incoming, existingOpen) => {
    const here = new Map((existingOpen || []).filter((issue) => issueKey(issue.text)).map((issue) => [issueKey(issue.text), issue]));
    const seen = new Set();
    let same = 0;
    const issues = (incoming || []).map((issue) => {
      const key = issueKey(issue.text);
      const match = key ? here.get(key) : null;
      if (key) seen.add(key);
      if (!match) return { ...issue, kept: false };
      same += 1;
      return { ...issue, carried: Math.max(issue.carried || 0, match.carried || 0), kept: false };
    });
    const kept = [...here.values()].filter((issue) => !seen.has(issueKey(issue.text))).map((issue) => ({ ...issue, kept: true }));
    return { issues: [...issues, ...kept], added: issues.length - same, same, kept: kept.length };
  };

  window.ShiftHandoverLink = {
    FORMAT, VERSION, LINK_FORMAT, LINK_VERSION, FILE_FORMAT, MAX_FRAGMENT, MAX_UNPACKED, MAX_FILE, MIN_PASSCODE, ITERATIONS,
    toBase64Url, fromBase64Url, newId, newPasscode, normalisePasscode, goodPasscode, deriveTransferKey,
    packHandover, openHandover, handoverLink, parseFragment, fileText, bytesFromFile, unpackHandover,
    ackCode, showAck, readAck, ackFragment, sensitiveFindings, forTransfer, issueKey, mergeIssues,
  };

  const form = document.querySelector("[data-handover]");
  const dataEl = document.getElementById("shift-handover-data");
  if (!form || !dataEl || !window.ToolKit) return;

  const { LOCALE, tx, dayMonth, lower, pct, plural, read, readOwn, write, isObject, str, el, today, parseDate, parseNumber, renderOnPause, partialRouteLog } = window.ToolKit;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;
  const HISTORY_MAX = 30;
  // The page says it: an issue carried three times is not a shift problem any more.
  const CARRY_LIMIT = 3;
  const PRIORITY_ORDER = Object.fromEntries(data.priorities.map((p, i) => [p, i]));
  // Priorities are listed high to low; the colour follows the position, not the word.
  const priorityClass = (p) => ["high", "medium", "low"][PRIORITY_ORDER[p]] || "medium";
  const MEDIUM = data.priorities[1];

  const metricsBox = form.querySelector("[data-metrics]");
  const issuesBox = form.querySelector("[data-issues]");
  const checklistBox = form.querySelector("[data-checklist]");
  const emptyNote = form.querySelector("[data-empty]");
  const output = document.querySelector("[data-output]");
  const outputTitle = output.querySelector("[data-output-title]");
  const sheet = output.querySelector("[data-sheet]");
  const quality = output.querySelector("[data-quality]");
  const ackText = output.querySelector("[data-ack-text]");
  const status = output.querySelector("[data-status]");
  const historySection = document.querySelector("[data-history-section]");
  const historyBox = document.querySelector("[data-history]");

  const template = (key) => data.templates[key] || data.templates[Object.keys(data.templates)[0]];

  const blank = (key, date = today(), shift = data.shifts[0]) => ({
    template: key,
    date,
    shift,
    area: "",
    from: "",
    to: "",
    metrics: template(key).metrics.map((label) => [label, "", ""]),
    issues: [],
    headsUp: "",
    safety: "",
    checks: template(key).checklist.map(() => false),
    ackAt: "",
    // Sent to another device: { id, at, mode: "link" | "qr" | "file", ack: the confirmation code expected } (last 10).
    shared: [],
    // Confirmed by the other device: { id, at, by, code }, once its code was typed or its link opened here.
    ack: null,
    // Opened here from another device: { id, at, from, ackCode: the code to give back once taken over }.
    received: null,
  });

  // Rebuild a saved handover field by field, so damaged data cannot break the page.
  const clean = (h) => {
    const key = data.templates[h.template] ? h.template : Object.keys(data.templates)[0];
    const base = blank(key, parseDate(str(h.date)) || today(), data.shifts.includes(h.shift) ? h.shift : data.shifts[0]);
    const metrics = Array.isArray(h.metrics) ? h.metrics.filter(Array.isArray).map((m) => [str(m[0]), str(m[1]), str(m[2])]) : base.metrics;
    const issues = Array.isArray(h.issues) ? h.issues.filter(isObject).map((issue) => ({
      text: str(issue.text),
      priority: data.priorities.includes(issue.priority) ? issue.priority : MEDIUM,
      owner: str(issue.owner),
      due: str(issue.due),
      done: issue.done === true,
      carried: Number.isInteger(issue.carried) && issue.carried > 0 ? issue.carried : 0,
    })) : [];
    const checks = base.checks.map((_, i) => Array.isArray(h.checks) && h.checks[i] === true);
    const MODES = ["link", "qr", "file"];
    const shared = Array.isArray(h.shared) ? h.shared.filter(isObject).map((entry) => ({ id: str(entry.id), at: str(entry.at), mode: MODES.includes(entry.mode) ? entry.mode : "link", ack: str(entry.ack) })).filter((entry) => entry.id).slice(-10) : [];
    const ack = isObject(h.ack) && str(h.ack.id) ? { id: str(h.ack.id), at: str(h.ack.at), by: str(h.ack.by), code: str(h.ack.code) } : null;
    const received = isObject(h.received) && str(h.received.id) ? { id: str(h.received.id), at: str(h.received.at), from: str(h.received.from), ackCode: str(h.received.ackCode) } : null;
    return { ...base, area: str(h.area), from: str(h.from), to: str(h.to), headsUp: str(h.headsUp), safety: str(h.safety), ackAt: str(h.ackAt), metrics, issues, checks, shared, ack, received };
  };
  const saved = read(KEY, {});
  const state = {
    current: isObject(saved) && isObject(saved.current) ? clean(saved.current) : blank(Object.keys(data.templates)[0]),
    history: isObject(saved) && Array.isArray(saved.history)
      ? saved.history.filter((entry) => isObject(entry) && isObject(entry.handover) && typeof entry.text === "string")
        .map((entry) => ({ ...entry, handover: clean(entry.handover) }))
      : [],
    received: isObject(saved) && Array.isArray(saved.received)
      ? saved.received.filter(isObject).map((entry) => ({ id: str(entry.id), at: str(entry.at) })).filter((entry) => entry.id).slice(-50)
      : [],
  };
  const save = () => write(KEY, state);
  const cur = () => state.current;

  const hasContent = (h) => Boolean(h.area || h.from || h.to || h.headsUp || h.safety
    || h.issues.length || h.metrics.some(([, value]) => value));

  const nextShift = (h) => {
    const index = data.shifts.indexOf(h.shift);
    const shift = data.shifts[(index + 1) % data.shifts.length];
    let date = h.date;
    const next = new Date(`${date}T00:00:00Z`);
    if (index === data.shifts.length - 1 && date && !Number.isNaN(next.getTime())) {
      next.setUTCDate(next.getUTCDate() + 1);
      date = next.toISOString().slice(0, 10);
    }
    return { shift, date };
  };

  // One formatter each: building them per call is slow with a long history.
  const dateFormat = dayMonth(true);
  const timeFormat = new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const longDate = (iso) => {
    const date = new Date(`${iso}T00:00:00Z`);
    return iso && !Number.isNaN(date.getTime()) ? dateFormat(date) : tx("No date");
  };
  const clock = (iso) => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? "?" : timeFormat.format(date);
  };
  const shiftLine = (h) => `${longDate(h.date)} · ${tx("{shift} shift → {next}", { shift: h.shift, next: nextShift(h).shift })}`;
  const people = (h) => tx("From {from} to {to}", { from: h.from || "?", to: h.to || "?" });
  const openIssues = (h) => h.issues.filter((issue) => !issue.done && issue.text.trim())
    .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9) || b.carried - a.carried);
  const solvedIssues = (h) => h.issues.filter((issue) => issue.done && issue.text.trim());

  // Editor --------------------------------------------------------------------
  const input = ({ ariaLabel, ...props }) => {
    const node = el("input");
    Object.assign(node, props);
    if (ariaLabel) node.setAttribute("aria-label", ariaLabel);
    node.autocomplete = "off";
    return node;
  };
  const removeButton = (label, kind, index) => {
    const button = el("button", "dl-remove", "×");
    button.type = "button";
    button.dataset.remove = kind;
    button.dataset.index = index;
    button.setAttribute("aria-label", label);
    return button;
  };

  const renderMetrics = () => {
    metricsBox.replaceChildren();
    cur().metrics.forEach(([label, value, note], i) => {
      const row = el("div", "sh-metric");
      row.append(
        input({ value: label, placeholder: tx("Number"), ariaLabel: tx("Name of number {n}", { n: i + 1 }), className: "sh-in" }),
        input({ value, placeholder: tx("Value"), ariaLabel: `${label || tx("Number")}: ${tx("value")}`, className: "sh-in" }),
        input({ value: note, placeholder: tx("Note or target"), ariaLabel: `${label || tx("Number")}: ${tx("note")}`, className: "sh-in" }),
        removeButton(tx("Remove {name}", { name: label || tx("this number") }), "metric", i),
      );
      ["label", "value", "note"].forEach((field, j) => {
        row.children[j].dataset.metric = field;
        row.children[j].dataset.index = i;
      });
      metricsBox.append(row);
    });
  };

  // One issue row. Its number lives in data-index and the labels, so rows can
  // be renumbered in place when one above them is removed.
  const numberIssue = (row, i) => {
    const issue = cur().issues[i];
    const name = tx("Issue {n}", { n: i + 1 });
    row.querySelectorAll("[data-index]").forEach((node) => { node.dataset.index = i; });
    row.querySelector('[data-issue="done"]').setAttribute("aria-label", `${tx("Solved")}: ${issue.text || tx("issue {n}", { n: i + 1 })}`);
    row.querySelector('[data-issue="text"]').setAttribute("aria-label", name);
    row.querySelector('[data-issue="priority"]').setAttribute("aria-label", `${name}: ${tx("priority")}`);
    row.querySelector('[data-issue="owner"]').setAttribute("aria-label", `${name}: ${tx("owner")}`);
    row.querySelector('[data-issue="due"]').setAttribute("aria-label", `${name}: ${tx("by when")}`);
    row.querySelector("[data-remove]").setAttribute("aria-label", tx("Remove issue {n}", { n: i + 1 }));
  };

  const issueRow = (issue, i) => {
    const row = el("div", "sh-issue");
    if (issue.done) row.classList.add("is-done");
    const done = input({ type: "checkbox", checked: issue.done });
    done.dataset.issue = "done";
    const text = input({ value: issue.text, placeholder: tx("What is open, and what is the risk?"), className: "sh-in sh-issue-text" });
    text.dataset.issue = "text";
    const priority = el("select", "sh-in");
    data.priorities.forEach((p) => {
      const option = el("option", null, p);
      option.selected = p === issue.priority;
      priority.append(option);
    });
    priority.dataset.issue = "priority";
    const owner = input({ value: issue.owner, placeholder: tx("Owner"), className: "sh-in" });
    owner.dataset.issue = "owner";
    const due = input({ value: issue.due, placeholder: tx("By when"), className: "sh-in" });
    due.dataset.issue = "due";
    [done, text, priority, owner, due].forEach((node) => { node.dataset.index = i; });
    const meta = el("div", "sh-issue-meta");
    meta.append(priority, owner, due);
    if (issue.carried >= CARRY_LIMIT) {
      // Carried this often, it is not a shift problem any more: the tag opens 5 Whys on it.
      const whys = el("a", "dl-tag is-warn", `${tx("Carried {n}×", { n: issue.carried })} · 5 Whys`);
      whys.href = fiveWhysUrl(issue.text);
      whys.title = tx("Take it to 5 Whys");
      meta.append(whys);
    } else if (issue.carried) meta.append(el("span", "dl-tag", tx("Carried {n}×", { n: issue.carried })));
    // An issue that outlives the shift belongs on the Action Tracker, with its owner and, when it is a date, its due day.
    if (issue.text.trim() && !issue.done && window.ToolKit.trackerUrl) {
      const tracker = el("a", "sh-tracker", tx("To actions"));
      tracker.href = window.ToolKit.trackerUrl({ title: issue.text, owner: issue.owner, due: /^\d{4}-\d{2}-\d{2}$/.test(issue.due) ? issue.due : "", detail: issue.due && !/^\d{4}-\d{2}-\d{2}$/.test(issue.due) ? `${tx("By when")}: ${issue.due}` : "", priority: issue.priority, source: "shift-handover" });
      tracker.title = tx("Add to actions");
      meta.append(tracker);
    }
    meta.append(removeButton("", "issue", i));
    const main = el("div", "sh-issue-main");
    main.append(text, meta);
    row.append(done, main);
    numberIssue(row, i);
    return row;
  };

  const noIssues = () => el("p", "form-note sh-help", tx("No open issues yet."));
  // The 5 Whys worksheet in this language (the link in the aside), opened on an issue.
  const fiveWhysUrl = (problem) => {
    const url = new URL(document.querySelector("a[data-five-whys]")?.getAttribute("href") || "../five-whys/", location.href);
    url.searchParams.set("problem", tx("Carried over {n} shifts: {text}", { n: CARRY_LIMIT, text: problem }));
    return url.href;
  };

  const renderIssues = () => {
    issuesBox.replaceChildren(...(cur().issues.length ? cur().issues.map(issueRow) : [noIssues()]));
  };

  const renderChecklist = () => {
    checklistBox.replaceChildren();
    template(cur().template).checklist.forEach((item, i) => {
      const li = el("li");
      const label = el("label", "dl-check-item");
      const box = input({ type: "checkbox", checked: Boolean(cur().checks[i]) });
      box.dataset.check = i;
      label.append(box, el("span", null, item));
      li.append(label);
      checklistBox.append(li);
    });
  };

  const renderFields = () => {
    ["template", "date", "shift", "area", "from", "to", "headsUp", "safety"].forEach((name) => {
      form.elements[name].value = cur()[name] ?? "";
    });
    form.elements.headsUp.placeholder = template(cur().template).headsUp;
  };

  const renderEditor = () => {
    renderFields();
    renderMetrics();
    renderIssues();
    renderChecklist();
  };

  // Numbers from the logs ------------------------------------------------------
  // Damage Control, Incomplete Control and Delay Analyzer keep their logs in this browser, one per
  // language, with the same shift names as this page. Their numbers for this handover's date and
  // shift fill the matching empty numbers of the template; anything typed stays as it is.
  const logRows = (tool) => {
    // An example the log holds fills nothing in (ToolKit readOwn).
    const saved = readOwn(KEY.replace("shift-handover", tool), {});
    return isObject(saved) && Array.isArray(saved.rows) ? { settings: saved, rows: saved.rows.filter(isObject) } : { settings: {}, rows: [] };
  };
  const clockMinutes = (time) => (/^\d{2}:\d{2}$/.test(str(time)) ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) : null);
  const late = (planned, actual) => {
    const a = clockMinutes(planned);
    const b = clockMinutes(actual);
    if (a === null || b === null) return null;
    let value = b - a;
    if (value < -720) value += 1440;
    if (value > 720) value -= 1440;
    return value;
  };
  const gracePart = (value, fallback) => {
    const number = Number(String(value ?? "").replace(",", "."));
    return Number.isFinite(number) && number >= 0 ? number : fallback;
  };
  const shiftTotals = (h) => {
    const mine = (row) => row.date === h.date && row.shift === h.shift;
    const units = (rows) => rows.reduce((sum, row) => sum + (Number(row.units) > 0 ? Math.round(Number(row.units)) : 1), 0);
    const damage = logRows("damage-control").rows.filter(mine);
    const incomplete = logRows("incomplete-control").rows.filter(mine);
    const delay = logRows("delay-analyzer");
    const depGrace = gracePart(delay.settings.departureGrace, 10);
    const arrGrace = gracePart(delay.settings.arrivalGrace, 15);
    const routes = delay.rows.filter(mine).map((row) => ({ dep: late(row.planDep, row.actDep), arr: late(row.planArr, row.actArr) })).filter((row) => row.arr !== null);
    const departed = routes.filter((row) => row.dep !== null);
    // A route log with only some routes of its period (often the late ones) gives counts, never a share.
    const partial = partialRouteLog(delay.settings);
    // The Night Audit Log: reservations logged as no-shows on this date and shift.
    const noShows = logRows("night-audit").rows.filter(mine).filter((row) => /no[- ]?show/i.test(str(row.type)));
    return {
      damage: damage.length ? units(damage) : null,
      incomplete: incomplete.length ? units(incomplete) : null,
      noShows: noShows.length ? units(noShows) : null,
      departures: departed.length ? { onTime: departed.filter((row) => row.dep <= depGrace).length, total: departed.length, partial } : null,
      arrivals: routes.length ? { onTime: routes.filter((row) => row.arr <= arrGrace).length, total: routes.length, partial } : null,
    };
  };
  const handledNumber = (h) => {
    const label = template(h.template).metrics[0];
    // "3,000" on the English page and "3.000" on the German one are both three thousand.
    const value = parseNumber(h.metrics.find(([name]) => name === label)?.[1] ?? "");
    return value > 0 ? value : null;
  };
  // What each source writes, for the metric it belongs to.
  const fillValue = (source, totals, h) => {
    const fromLog = tx("from the log");
    if (source === "noShows") return totals.noShows === null ? null : [String(totals.noShows), `${tx("Night Audit Log")} · ${fromLog}`];
    if (source === "damage" || source === "incomplete") {
      const count = totals[source];
      if (count === null) return null;
      const noun = source === "damage" ? plural(count, tx("damaged unit"), tx("damaged units")) : plural(count, tx("incomplete order"), tx("incomplete orders"));
      const handled = source === "damage" ? handledNumber(h) : null;
      // Without the units handled there is no rate: the box says what it counts, so "3" is never read as 3 %.
      return handled
        ? [pct(count / handled, 2), `${tx("{a} of {b}", { a: count, b: handled })} · ${fromLog}`]
        : [noun, [fromLog, source === "damage" ? tx("add the units handled for the rate") : tx("no order total, so this is a count")].join(" · ")];
    }
    const part = totals[source];
    if (!part) return null;
    if (part.partial) return [tx("{n} late", { n: part.total - part.onTime }), `${tx("Only some routes of the period are in the route log, so late routes are counted, not shown as a share.")} · ${fromLog}`];
    return [pct(part.onTime / part.total, 1), `${tx("{a} of {b} routes", { a: part.onTime, b: part.total })} · ${fromLog}`];
  };

  // Output --------------------------------------------------------------------
  const problems = (h) => {
    const open = openIssues(h);
    const list = [];
    const noOwner = open.filter((issue) => !issue.owner.trim()).length;
    const noTime = open.filter((issue) => !issue.due.trim()).length;
    if (noOwner) list.push(tx(noOwner === 1 ? "{n} open issue has no owner." : "{n} open issues have no owner.", { n: noOwner }));
    if (noTime) list.push(tx(noTime === 1 ? "{n} open issue has no time." : "{n} open issues have no time.", { n: noTime }));
    open.filter((issue) => issue.carried >= CARRY_LIMIT).forEach((issue) => list.push(tx("“{text}” has been carried {n} times. It is not a shift problem any more: take it through 5 Whys.", { text: issue.text, n: issue.carried })));
    if (!h.to.trim()) list.push(tx("Nobody is named to take over."));
    const unticked = h.checks.filter((c) => !c).length;
    if (unticked === h.checks.length) list.push(tx("No handover checks ticked yet."));
    else if (unticked) list.push(tx("{a} of {b} handover checks are not ticked.", { a: unticked, b: h.checks.length }));
    return list;
  };

  const asText = (h) => {
    const t = template(h.template);
    const lines = [`${tx("Shift handover")}${h.area ? ` | ${h.area}` : ""}`, shiftLine(h)];
    if (h.from || h.to) lines.push(people(h));
    const numbers = h.metrics.filter(([label, value]) => label && value);
    if (numbers.length) {
      lines.push("", tx("NUMBERS"));
      numbers.forEach(([label, value, note]) => lines.push(`- ${label}: ${value}${note ? ` (${note})` : ""}`));
    }
    const open = openIssues(h);
    lines.push("", `${tx("OPEN ISSUES")} (${open.length})`);
    if (!open.length) lines.push(`- ${tx("None")}`);
    open.forEach((issue, i) => lines.push(`${i + 1}. [${issue.priority}] ${issue.text} · ${tx("owner")}: ${issue.owner || "-"} · ${tx("by")}: ${issue.due || "-"}${issue.carried ? ` · ${tx("carried {n}×", { n: issue.carried })}` : ""}`));
    const solved = solvedIssues(h);
    if (solved.length) {
      lines.push("", tx("SOLVED THIS SHIFT"));
      solved.forEach((issue) => lines.push(`- ${issue.text}`));
    }
    const heads = h.headsUp.split("\n").map((line) => line.trim()).filter(Boolean);
    if (heads.length) {
      lines.push("", tx("HEADS-UP"));
      heads.forEach((line) => lines.push(`- ${line}`));
    }
    const safety = h.safety.split("\n").map((line) => line.trim()).filter(Boolean);
    if (safety.length) {
      lines.push("", tx("SAFETY AND PEOPLE"));
      safety.forEach((line) => lines.push(`- ${line}`));
    }
    lines.push("", `${tx("Handover check")}: ${tx("{a} of {b}", { a: h.checks.filter(Boolean).length, b: t.checklist.length })}`);
    if (h.ackAt) lines.push(tx("Taken over by {name} at {time}", { name: h.to, time: clock(h.ackAt) }));
    return lines.join("\n");
  };

  const block = (title, children) => {
    const section = el("section", "sh-block");
    section.append(el("h4", "result-label", title), ...children);
    return section;
  };
  const lines = (text) => {
    const list = el("ul", "sh-lines");
    text.split("\n").map((line) => line.trim()).filter(Boolean).forEach((line) => list.append(el("li", null, line)));
    return list;
  };

  const renderSheet = () => {
    const h = cur();
    sheet.replaceChildren();
    const head = el("header", "sh-sheet-head");
    head.append(el("p", "result-label", shiftLine(h)));
    head.append(el("h3", null, h.area || tx("Shift handover")));
    head.append(el("p", "sh-people", people(h)));
    sheet.append(head);

    const numbers = h.metrics.filter(([label, value]) => label && value);
    if (numbers.length) {
      const grid = el("dl", "sh-numbers");
      numbers.forEach(([label, value, note]) => {
        const item = el("div");
        item.append(el("dt", null, label), el("dd", null, value));
        if (note) item.append(el("dd", "sh-note", note));
        grid.append(item);
      });
      sheet.append(block(tx("Numbers"), [grid]));
    }

    const open = openIssues(h);
    const list = el("ol", "sh-open");
    if (!open.length) list.append(el("li", "sh-none", tx("No open issues.")));
    open.forEach((issue) => {
      const li = el("li");
      li.append(el("span", `sh-priority is-${priorityClass(issue.priority)}`, issue.priority));
      const body = el("div");
      body.append(el("strong", null, issue.text));
      const meta = [`${tx("Owner")}: ${issue.owner || tx("none")}`, `${tx("By")}: ${issue.due || tx("no time")}`];
      if (issue.carried) meta.push(tx("Carried {n}×", { n: issue.carried }));
      body.append(el("span", "sh-issue-info", meta.join(" · ")));
      li.append(body);
      list.append(li);
    });
    sheet.append(block(`${tx("Open issues")} (${open.length})`, [list]));

    const solved = solvedIssues(h);
    if (solved.length) sheet.append(block(tx("Solved this shift"), [lines(solved.map((issue) => issue.text).join("\n"))]));
    if (h.headsUp.trim()) sheet.append(block(tx("Heads-up"), [lines(h.headsUp)]));
    if (h.safety.trim()) sheet.append(block(tx("Safety and people"), [lines(h.safety)]));

    const foot = el("p", "sh-foot", `${tx("Handover check")}: ${tx("{a} of {b}", { a: h.checks.filter(Boolean).length, b: h.checks.length })} · ${h.ackAt ? tx("Taken over by {name} at {time}", { name: h.to, time: clock(h.ackAt) }) : tx("Not yet confirmed")}`);
    sheet.append(foot);
  };

  const renderQuality = () => {
    const list = problems(cur());
    quality.replaceChildren(el("p", "kicker", tx("Before you hand over")));
    if (!hasContent(cur())) {
      quality.append(el("p", "sh-ok", tx("Fill in the shift, the numbers and the open issues. This panel then shows what is still missing.")));
      return;
    }
    if (!list.length) {
      quality.append(el("p", "sh-ok", tx("Complete: every open issue has an owner and a time, and the checks are done.")));
      return;
    }
    const ul = el("ul", "sh-problems");
    list.forEach((text) => ul.append(el("li", null, text)));
    quality.append(ul);
  };

  // Where a handover stands. "draft" and "ready" are this device's own; "shared", "received" and "taken" are what this
  // device did; only "acknowledged" says what the other device did, because its code was typed here.
  const transferState = (h) => (!hasContent(h) ? "draft" : h.ack ? "acknowledged" : h.shared.length ? "shared" : h.ackAt ? "taken" : h.received ? "received" : "ready");
  const stateLine = output.querySelector("[data-transfer-state]");
  const ackCodeBox = output.querySelector("[data-ack-code]");
  const ackVerify = output.querySelector("[data-ack-verify]");
  const renderOutput = () => {
    const h = cur();
    const state = transferState(h);
    const last = h.shared[h.shared.length - 1];
    outputTitle.textContent = {
      draft: tx("Start with the numbers"),
      ready: problems(h).length ? tx("Almost ready") : tx("Ready to hand over"),
      shared: tx("Shared, not yet confirmed by the other device"),
      received: tx("Received{from}: read it, then confirm takeover", { from: h.received?.from ? ` ${tx("from {name}", { name: h.received.from })}` : "" }),
      taken: tx("Taken over by {name}", { name: h.to }),
      acknowledged: tx("Acknowledged by {name}: confirmed with the code", { name: h.ack?.by || h.to || "?" }),
    }[state];
    if (stateLine) {
      const lines = [];
      if (h.received) lines.push(tx("Received on this device at {time}.", { time: clock(h.received.at) }));
      if (last) lines.push(tx(last.mode === "file" ? "Shared at {time} as a file. The other device confirms with a code." : last.mode === "qr" ? "Shared at {time} as a QR code. The other device confirms with a code." : "Shared at {time} as a link. The other device confirms with a code.", { time: clock(last.at) }));
      if (h.ackAt && !h.ack) lines.push(tx("Confirmed on this device at {time}.", { time: clock(h.ackAt) }));
      if (h.ack) lines.push(tx("Confirmed on the other device: code {code} checked here at {time}.", { code: window.ShiftHandoverLink.showAck(h.ack.code), time: clock(h.ack.at) }));
      stateLine.textContent = lines.join(" ");
      stateLine.hidden = !lines.length;
    }
    ackText.textContent = h.ackAt
      ? tx("Confirmed by {name} at {time}. Close the shift to start the next handover with the open issues carried over.", { name: h.to, time: clock(h.ackAt) })
      : h.received
        ? tx("You received this handover. Confirm takeover once you have read it; a confirmation code appears for the sender.")
        : tx("The person taking over confirms they have read it and asked their questions.");
    if (ackCodeBox) {
      const show = Boolean(h.ackAt && h.received?.ackCode);
      ackCodeBox.hidden = !show;
      if (show) ackCodeBox.querySelector("[data-ack-code-text]").textContent = window.ShiftHandoverLink.showAck(h.received.ackCode);
    }
    if (ackVerify) ackVerify.hidden = !(h.shared.length && !h.ack);
    emptyNote.hidden = hasContent(h);
    renderSheet();
    renderQuality();
  };

  const renderHistory = () => {
    historyBox.replaceChildren();
    historySection.hidden = !state.history.length;
    state.history.forEach((entry, index) => {
      const h = entry.handover;
      const details = el("details", "dl-box sh-past");
      const summary = el("summary");
      summary.append(el("strong", null, `${longDate(h.date)} · ${h.shift}`), ` ${h.area ? `· ${h.area} ` : ""}· ${h.from || "?"} → ${h.to || "?"} · ${tx("{n} open", { n: openIssues(h).length })}`);
      details.append(summary);
      details.append(el("pre", "sh-pre", entry.text));
      const copyButton = el("button", "button-secondary", tx("Copy as text"));
      copyButton.type = "button";
      copyButton.dataset.copyHistory = index;
      const actions = el("div", "tool-actions");
      actions.append(copyButton);
      details.append(actions);
      historyBox.append(details);
    });
  };

  const renderAll = () => {
    renderEditor();
    renderOutput();
    renderHistory();
  };

  const note = (message) => {
    status.textContent = message;
    clearTimeout(note.timer);
    note.timer = setTimeout(() => { status.textContent = ""; }, 2600);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = el("textarea");
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
  };

  // Events --------------------------------------------------------------------
  const commit = () => {
    save();
    renderOutput();
  };
  // Typing waits for a pause when the handover is long (many issues or a full history).
  const commitSoon = renderOnPause(commit, () => cur().issues.length + state.history.length, 40);

  form.addEventListener("input", (event) => {
    const target = event.target;
    const h = cur();
    if (target.dataset.metric) {
      h.metrics[target.dataset.index][["label", "value", "note"].indexOf(target.dataset.metric)] = target.value;
    } else if (target.dataset.issue && target.type !== "checkbox") {
      h.issues[target.dataset.index][target.dataset.issue] = target.value;
    } else if (["date", "shift", "area", "from", "to", "headsUp", "safety"].includes(target.name)) {
      h[target.name] = target.value;
      if (target.name === "to") h.ackAt = "";
    } else {
      return;
    }
    commitSoon();
  });

  form.addEventListener("change", (event) => {
    const target = event.target;
    const h = cur();
    if (target.dataset.issue === "done") {
      h.issues[target.dataset.index].done = target.checked;
      target.closest(".sh-issue").classList.toggle("is-done", target.checked);
      commit();
    } else if (target.dataset.check !== undefined) {
      h.checks[target.dataset.check] = target.checked;
      commit();
    } else if (target.dataset.issue === "priority") {
      h.issues[target.dataset.index].priority = target.value;
      commit();
    } else if (target.name === "template") {
      const next = template(target.value);
      const filled = h.metrics.some(([, value]) => value);
      if (filled && !window.confirm(tx("Switch the numbers and checks to {name}? Values you typed in the numbers are cleared.", { name: next.name }))) {
        target.value = h.template;
        return;
      }
      h.template = target.value;
      h.metrics = next.metrics.map((label) => [label, "", ""]);
      h.checks = next.checklist.map(() => false);
      save();
      renderAll();
    }
  });

  form.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const index = Number(button.dataset.index);
    if (button.dataset.remove === "metric") {
      cur().metrics.splice(index, 1);
      renderMetrics();
    } else {
      // Remove the one row and renumber the rows below it; rebuilding a long
      // list on every click is slow on phones.
      cur().issues.splice(index, 1);
      const rows = [...issuesBox.querySelectorAll(".sh-issue")];
      rows[index].remove();
      rows.slice(index + 1).forEach((row, k) => numberIssue(row, index + k));
      if (!cur().issues.length) issuesBox.append(noIssues());
      (issuesBox.querySelectorAll("[data-remove]")[Math.min(index, cur().issues.length - 1)] || form.querySelector("[data-add-issue]")).focus();
    }
    save();
    renderOutput();
  });

  form.querySelector("[data-add-metric]").addEventListener("click", () => {
    cur().metrics.push(["", "", ""]);
    save();
    renderMetrics();
    metricsBox.lastElementChild.querySelector("input").focus();
  });

  const fillStatus = form.querySelector("[data-fill-status]");
  form.querySelector("[data-fill-logs]").addEventListener("click", () => {
    const h = cur();
    const sources = template(h.template).sources || [];
    const totals = shiftTotals(h);
    let filled = 0;
    let kept = 0;
    let found = 0;
    template(h.template).metrics.forEach((label, i) => {
      const source = sources[i];
      if (!source) return;
      const value = fillValue(source, totals, h);
      if (!value) return;
      found++;
      let row = h.metrics.find(([name]) => name === label);
      if (!row) {
        row = [label, "", ""];
        h.metrics.push(row);
      }
      if (row[1].trim()) {
        kept++;
        return;
      }
      row[1] = value[0];
      row[2] = value[1];
      filled++;
    });
    if (!sources.some(Boolean)) {
      flashFill(tx("This template has no numbers that the logs can fill."));
      return;
    }
    if (!found) {
      flashFill(tx("No entries in the logs for {date}, {shift} shift. Damage Control, Incomplete Control and Delay Analyzer fill these numbers when they log this shift.", { date: longDate(h.date), shift: lower(h.shift) }));
      return;
    }
    save();
    renderMetrics();
    renderOutput();
    flashFill(filled
      ? `${tx(filled === 1 ? "Filled {n} number from the logs." : "Filled {n} numbers from the logs.", { n: filled })}${kept ? ` ${tx("{n} already typed stayed as they were.", { n: kept })}` : ""}`
      : tx("These numbers are already filled in. What you typed stays as it is."));
  });
  const flashFill = (message) => {
    fillStatus.textContent = message;
    clearTimeout(flashFill.timer);
    flashFill.timer = setTimeout(() => { fillStatus.textContent = ""; }, 6000);
  };

  form.querySelector("[data-add-issue]").addEventListener("click", () => {
    const issues = cur().issues;
    issues.push({ text: "", priority: MEDIUM, owner: "", due: "", done: false, carried: 0 });
    save();
    // Add just the new row; the ones above it stay as they are.
    if (issues.length === 1) issuesBox.replaceChildren();
    const row = issueRow(issues.at(-1), issues.length - 1);
    issuesBox.append(row);
    renderOutput();
    row.querySelector(".sh-issue-text").focus();
  });

  form.querySelector("[data-example]").addEventListener("click", () => {
    const ex = data.example;
    state.current = {
      ...blank(ex.template, ex.date, ex.shift),
      area: ex.area,
      from: ex.from,
      to: ex.to,
      metrics: ex.metrics.map((row) => [...row]),
      issues: ex.issues.map((issue) => ({ ...issue })),
      headsUp: ex.headsUp,
      safety: ex.safety,
      checks: [...ex.checks],
    };
    save();
    renderAll();
    output.scrollIntoView({ behavior: "smooth", block: "start" });
    output.focus({ preventScroll: true });
  });

  output.querySelector("[data-ack]").addEventListener("click", () => {
    const h = cur();
    if (!h.to.trim()) {
      note(tx("Name who takes over first."));
      form.elements.to.focus();
      return;
    }
    h.ackAt = new Date().toISOString();
    commit();
    note(tx("Confirmed by {name}.", { name: h.to }));
  });

  output.querySelector("[data-copy]").addEventListener("click", async () => {
    await copyText(asText(cur()));
    note(tx("Copied. Paste it into your team chat or email."));
  });

  output.querySelector("[data-print]").addEventListener("click", () => window.print());

  output.querySelector("[data-close]").addEventListener("click", () => {
    const h = cur();
    if (!hasContent(h)) {
      note(tx("There is nothing to close yet."));
      return;
    }
    const open = openIssues(h);
    if (!window.confirm(tx(open.length === 1 ? "Close the {shift} shift? It moves to the history, and {n} open issue carries over to the next handover." : "Close the {shift} shift? It moves to the history, and {n} open issues carry over to the next handover.", { shift: lower(h.shift), n: open.length }))) return;
    state.history.unshift({ closedAt: new Date().toISOString(), handover: JSON.parse(JSON.stringify(h)), text: asText(h) });
    state.history = state.history.slice(0, HISTORY_MAX);
    const next = nextShift(h);
    state.current = {
      ...blank(h.template, next.date, next.shift),
      area: h.area,
      from: h.to,
      metrics: h.metrics.map(([label]) => [label, "", ""]),
      issues: open.map((issue) => ({ ...issue, carried: (issue.carried || 0) + 1 })),
    };
    save();
    renderAll();
    note(tx(open.length === 1 ? "Started the {shift} shift handover with {n} carried issue." : "Started the {shift} shift handover with {n} carried issues.", { shift: lower(next.shift), n: open.length }));
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  output.querySelector("[data-clear]").addEventListener("click", () => {
    if (!window.confirm(tx("Clear this handover? The history stays."))) return;
    state.current = blank(cur().template, cur().date, cur().shift);
    save();
    renderAll();
  });

  historyBox.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-history]");
    if (!button) return;
    await copyText(state.history[Number(button.dataset.copyHistory)].text);
    button.textContent = tx("Copied");
    setTimeout(() => { button.textContent = tx("Copy as text"); }, 1600);
  });

  document.querySelector("[data-clear-history]").addEventListener("click", () => {
    if (!window.confirm(tx("Delete all earlier handovers on this device?"))) return;
    state.history = [];
    save();
    renderHistory();
  });

  if (!cur().date) cur().date = today();
  renderAll();

  const Link = window.ShiftHandoverLink;
  const download = (name, content, type) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = el("a");
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const fileName = (h) => `handover-${h.date || "shift"}-${lower(h.shift).replace(/[^a-z0-9]+/gi, "-")}.json`;
  // What a handover holds, as lines for the sender before sharing and for the receiver before taking over.
  const summaryLines = (h, { names }) => {
    const open = openIssues(h);
    const solved = solvedIssues(h);
    const numbers = h.metrics.filter(([label, value]) => label && value).length;
    const heads = h.headsUp.split("\n").map((line) => line.trim()).filter(Boolean).length;
    const lines = [
      `${longDate(h.date)} · ${tx("{shift} shift", { shift: h.shift })}${h.area ? ` · ${h.area}` : ""}`,
      tx("{n} numbers", { n: numbers }),
      `${tx("{n} open", { n: open.length })} · ${tx("{n} solved", { n: solved.length })}`,
      tx("{n} heads-up lines", { n: heads }),
      h.safety.trim() ? tx("A safety note") : tx("No safety note"),
      tx("{a} of {b} checks done", { a: h.checks.filter(Boolean).length, b: h.checks.length }),
    ];
    lines.push(names
      ? tx("Names included: {people}", { people: [h.from, h.to].filter(Boolean).join(" → ") || tx("owners only") })
      : tx("Names left out: who hands over, who takes over and the owners of the issues"));
    return lines;
  };
  const KINDS = { email: "an email address", card: "a card number", iban: "an IBAN", phone: "a phone number" };
  const FIELDS = { area: "Area or team", headsUp: "Heads-up", safety: "Safety", metrics: "Numbers", issues: "Issues" };
  const warningLines = (h) => Link.sensitiveFindings(h).map((f) => tx("{field}: looks like {kind} ({sample}…)", { field: tx(FIELDS[f.field]), kind: tx(KINDS[f.kind]), sample: f.sample.slice(0, 6) }));
  const fillList = (list, lines, className = "") => {
    list.replaceChildren(...lines.map((line) => el("li", className || null, line)));
  };

  // "Send to the next shift": first what goes and the transfer code, then the sealed link, the QR code or a file.
  const sendDialog = output.querySelector("[data-send-dialog]");
  const sendButton = output.querySelector("[data-send]");
  if (sendDialog && sendButton && typeof HTMLDialogElement !== "undefined") {
    const steps = { prepare: sendDialog.querySelector('[data-send-step="prepare"]'), share: sendDialog.querySelector('[data-send-step="share"]') };
    const summary = sendDialog.querySelector("[data-send-summary]");
    const warnings = sendDialog.querySelector("[data-send-warnings]");
    const warningList = warnings.querySelector("ul");
    const namesBox = sendDialog.querySelector("[data-send-names]");
    const codeField = sendDialog.querySelector("[data-send-code]");
    const prepareStatus = sendDialog.querySelector("[data-send-prepare-status]");
    const sealedNote = sendDialog.querySelector("[data-send-sealed]");
    const linkBox = sendDialog.querySelector("[data-send-link]");
    const qrBox = sendDialog.querySelector("[data-send-qr]");
    const qrNote = sendDialog.querySelector("[data-send-qr-note]");
    const shareButton = sendDialog.querySelector("[data-send-share]");
    const shownButton = sendDialog.querySelector("[data-send-shown]");
    const sendStatus = sendDialog.querySelector("[data-send-status]");
    let sealed = null;
    const showStep = (name) => { Object.entries(steps).forEach(([key, node]) => { node.hidden = key !== name; }); };
    const preview = () => {
      const h = Link.forTransfer(cur(), { names: namesBox.checked });
      fillList(summary, summaryLines(h, { names: namesBox.checked }));
      const warn = warningLines(h);
      fillList(warningList, warn);
      warnings.hidden = !warn.length;
    };
    namesBox.addEventListener("change", preview);
    sendButton.addEventListener("click", () => {
      if (!hasContent(cur())) {
        note(tx("There is nothing to send yet."));
        return;
      }
      sealed = null;
      namesBox.checked = false;
      codeField.value = Link.newPasscode();
      prepareStatus.textContent = "";
      sendStatus.textContent = "";
      preview();
      showStep("prepare");
      sendDialog.showModal();
      codeField.focus();
      codeField.select();
    });
    sendDialog.querySelector("[data-send-newcode]").addEventListener("click", () => { codeField.value = Link.newPasscode(); codeField.focus(); codeField.select(); });
    sendDialog.querySelector("[data-send-make]").addEventListener("click", async () => {
      const passcode = codeField.value;
      if (!Link.goodPasscode(passcode)) {
        prepareStatus.textContent = tx("The transfer code needs at least {n} letters or digits.", { n: Link.MIN_PASSCODE });
        codeField.focus();
        return;
      }
      prepareStatus.textContent = tx("Sealing…");
      const h = Link.forTransfer(cur(), { names: namesBox.checked });
      try {
        const made = await Link.handoverLink(h, passcode, location.href);
        sealed = { ...made, passcode, ack: await Link.ackCode(made.id, passcode), date: cur().date, shift: cur().shift };
      } catch {
        prepareStatus.textContent = tx("The handover could not be sealed in this browser.");
        return;
      }
      prepareStatus.textContent = "";
      sealedNote.textContent = tx("Sealed with the code {code}. Tell the code to the next shift separately; keep it to check their confirmation.", { code: passcode });
      linkBox.value = sealed.link;
      qrBox.replaceChildren();
      const qr = window.TeamSyncMath?.qrEncode ? window.TeamSyncMath.qrEncode(sealed.link) : null;
      if (qr) {
        qrBox.innerHTML = window.TeamSyncMath.qrSvg(qr.matrix, tx("Scan the code with the next shift's phone"));
        qrNote.textContent = tx("Scan the code with the next shift's phone");
      } else {
        qrNote.textContent = window.TeamSyncMath?.qrEncode ? tx("The handover is too long for a QR code: share the link, or save it as a file.") : tx("Share the link, or save it as a file.");
      }
      qrBox.hidden = !qr;
      shownButton.hidden = !qr;
      shareButton.hidden = typeof navigator.share !== "function";
      showStep("share");
      (qr ? shownButton : sendDialog.querySelector("[data-send-copy]")).focus();
    });
    // Shared only on the visitor's own act: a copied or shared link, a saved file, a code shown to a phone.
    const markShared = (mode) => {
      if (!sealed) return;
      const h = cur();
      h.shared = [...h.shared.filter((entry) => entry.id !== sealed.id), { id: sealed.id, at: new Date().toISOString(), mode, ack: sealed.ack }].slice(-10);
      h.ack = null;
      commit();
    };
    shareButton.addEventListener("click", async () => {
      try {
        await navigator.share({ title: tx("Shift handover"), text: `${tx("Shift handover")} · ${shiftLine(cur())}`, url: sealed.link });
        markShared("link");
        sendStatus.textContent = tx("Shared. Now tell the code separately.");
      } catch { /* the visitor closed the share sheet */ }
    });
    sendDialog.querySelector("[data-send-copy]").addEventListener("click", async () => {
      await copyText(sealed.link);
      markShared("link");
      sendStatus.textContent = tx("Link copied. Now tell the code separately.");
    });
    sendDialog.querySelector("[data-send-file]").addEventListener("click", () => {
      download(fileName(cur()), Link.fileText(sealed.bytes, { date: sealed.date, shift: sealed.shift, sent: new Date().toISOString() }), "application/json");
      markShared("file");
      sendStatus.textContent = tx("File saved. The other device opens it under “Open a handover file” and needs the code.");
    });
    shownButton.addEventListener("click", () => {
      markShared("qr");
      sendStatus.textContent = tx("Marked as shared. The other device confirms with a code once it has taken over.");
    });
    sendDialog.querySelectorAll("[data-send-close]").forEach((button) => button.addEventListener("click", () => sendDialog.close()));
  }

  // A handover that arrived: sealed in the address ("#h2="), in a file, or an old plain link ("#h=", "#h0="). It
  // asks for the transfer code, shows what it holds, and replaces nothing unasked: what is here moves to the history,
  // this device's open issues the sender did not have stay, and the person taking over confirms here.
  const incomingBox = document.querySelector("[data-incoming]");
  const clearHash = () => history.replaceState(null, "", location.pathname + location.search);
  const takeOver = (h, { id = "", ackCode = "" } = {}) => {
    const merged = Link.mergeIssues(h.issues, openIssues(cur()));
    if (hasContent(cur())) {
      if (!window.confirm(tx("Take over the handover that arrived? What you have here moves to the history first; your open issues the sender did not have stay with it."))) return false;
      state.history.unshift({ closedAt: new Date().toISOString(), handover: JSON.parse(JSON.stringify(cur())), text: asText(cur()) });
      state.history = state.history.slice(0, HISTORY_MAX);
    }
    const now = new Date().toISOString();
    state.current = { ...h, issues: merged.issues.map(({ kept, ...issue }) => issue), ackAt: "", shared: [], ack: null, received: id ? { id, at: now, from: h.from, ackCode } : null };
    if (id) state.received = [...state.received.filter((entry) => entry.id !== id), { id, at: now }].slice(-50);
    save();
    renderAll();
    if (incomingBox) incomingBox.hidden = true;
    clearHash();
    note(merged.kept
      ? tx(merged.kept === 1 ? "Taken over, with {n} open issue of yours kept. Read it, then confirm takeover." : "Taken over, with {n} open issues of yours kept. Read it, then confirm takeover.", { n: merged.kept })
      : tx("Taken over. Read it, then confirm takeover."));
    output.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  };
  if (incomingBox) {
    const text = incomingBox.querySelector("[data-incoming-text]");
    const unlock = incomingBox.querySelector("[data-incoming-unlock]");
    const unlockError = incomingBox.querySelector("[data-incoming-error]");
    const previewBox = incomingBox.querySelector("[data-incoming-preview]");
    const previewSummary = incomingBox.querySelector("[data-incoming-summary]");
    const previewIssues = incomingBox.querySelector("[data-incoming-issues]");
    const previewNote = incomingBox.querySelector("[data-incoming-note]");
    const openButton = incomingBox.querySelector("[data-incoming-open]");
    const againButton = incomingBox.querySelector("[data-incoming-again]");
    let pending = null;
    const reset = () => { pending = null; unlock.hidden = true; previewBox.hidden = true; openButton.hidden = true; againButton.hidden = true; unlockError.textContent = ""; };
    // Sealed bytes from the address or a file: ask for the code.
    const offerSealed = (bytes, source) => {
      reset();
      pending = { bytes, source };
      text.textContent = source === "file" ? tx("A sealed handover file. Enter the transfer code you were told.") : tx("A sealed handover arrived. Enter the transfer code you were told.");
      unlock.hidden = false;
      incomingBox.hidden = false;
      unlock.elements.code.value = "";
      unlock.elements.code.focus();
    };
    // The handover opened: what it holds, before anything is replaced.
    const showPreview = (h, { id, legacy = false }) => {
      const merged = Link.mergeIssues(h.issues, openIssues(cur()));
      const already = id ? state.received.find((entry) => entry.id === id) : null;
      text.textContent = tx("A handover arrived{from}: {shift} shift of {date}, {open}.", {
        shift: h.shift, date: longDate(h.date), from: h.from ? ` ${tx("from {name}", { name: h.from })}` : "", open: tx("{n} open", { n: openIssues(h).length }),
      });
      fillList(previewSummary, summaryLines(h, { names: Boolean(h.from || h.to || h.issues.some((issue) => issue.owner)) }));
      previewIssues.replaceChildren(...merged.issues.map((issue) => {
        const line = el("li", issue.kept ? "is-kept" : issue.text && openIssues(cur()).some((own) => Link.issueKey(own.text) === Link.issueKey(issue.text)) ? "is-same" : "is-new");
        line.append(el("span", "sh-tag", issue.kept ? tx("kept from here") : line.className === "is-same" ? tx("already open here") : tx("new")), ` ${issue.text}${issue.done ? ` (${tx("solved")})` : ""}`);
        return line;
      }));
      const notes = [];
      if (legacy) notes.push(tx("This link was made by an older version, without encryption."));
      if (already) notes.push(tx("Already received here at {time}. Taking it over again replaces what came of it.", { time: clock(already.at) }));
      previewNote.textContent = notes.join(" ");
      previewNote.hidden = !notes.length;
      previewBox.hidden = false;
      unlock.hidden = true;
      openButton.hidden = Boolean(already);
      againButton.hidden = !already;
      incomingBox.hidden = false;
      (already ? againButton : openButton).focus();
    };
    unlock.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!pending) return;
      unlockError.textContent = tx("Opening…");
      const result = await Link.openHandover(pending.bytes, unlock.elements.code.value).catch(() => ({ error: "invalid" }));
      if (result.error === "wrong") { unlockError.textContent = tx("Wrong code, or the handover was changed on the way. Nothing was opened."); unlock.elements.code.select(); return; }
      if (result.error) { unlockError.textContent = tx("This is not a handover that this page can open."); return; }
      unlockError.textContent = "";
      const h = clean(result.handover);
      h.ackAt = "";
      h.shared = [];
      h.ack = null;
      h.received = null;
      pending = { ...pending, id: result.id, handover: h, ackCode: await Link.ackCode(result.id, unlock.elements.code.value) };
      showPreview(h, { id: result.id });
    });
    const take = () => { if (pending?.handover) takeOver(pending.handover, { id: pending.id, ackCode: pending.ackCode }); };
    openButton.addEventListener("click", take);
    againButton.addEventListener("click", take);
    incomingBox.querySelector("[data-incoming-ignore]").addEventListener("click", () => {
      reset();
      incomingBox.hidden = true;
      clearHash();
    });
    const fileInput = document.querySelector("[data-incoming-file]");
    if (fileInput) fileInput.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      if (file.size > Link.MAX_FILE) { note(tx("This file is larger than a handover file can be.")); return; }
      const bytes = Link.bytesFromFile(await file.text());
      if (!bytes) { note(tx("This is not a handover file.")); return; }
      offerSealed(bytes, "file");
      incomingBox.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // The address on arrival, and again when a link is opened in a tab that already shows this page (the browser
    // then changes only the part after "#" and loads nothing).
    const handleAddress = () => {
    const parsed = Link.parseFragment(location.hash);
    if (parsed?.kind === "sealed") offerSealed(parsed.bytes, "link");
    else if (parsed?.kind === "plain") {
      Link.unpackHandover(location.hash).then((arrived) => {
        if (!arrived) { note(tx("This link does not hold a handover.")); clearHash(); return; }
        const h = clean(arrived.handover);
        h.ackAt = "";
        h.shared = [];
        h.ack = null;
        h.received = null;
        pending = { handover: h, id: "", ackCode: "" };
        showPreview(h, { id: "", legacy: true });
      });
    } else if (parsed?.kind === "ack") {
      // The receiver's confirmation link, opened on the sender's device.
      const field = ackVerify?.elements.code;
      if (field) { field.value = Link.showAck(parsed.code); if (parsed.by) ackVerify.elements.by.value = parsed.by; ackVerify.requestSubmit(); }
      clearHash();
    } else {
      // Nothing to offer: a box left from an earlier fragment of this tab closes.
      if (/^#(h|h0|h2|a)=/.test(location.hash)) {
        note(tx("This link does not hold a handover."));
        clearHash();
      }
      if (pending?.source !== "file") { reset(); incomingBox.hidden = true; }
    }
    };
    handleAddress();
    window.addEventListener("hashchange", handleAddress);
  }

  // The sender checks the receiver's confirmation code: it matches the code expected for one of the transfers shared.
  if (ackVerify) ackVerify.addEventListener("submit", (event) => {
    event.preventDefault();
    const h = cur();
    const code = Link.readAck(ackVerify.elements.code.value);
    const match = h.shared.find((entry) => entry.ack && entry.ack === code);
    const status = ackVerify.querySelector("[data-ack-verify-status]");
    if (!match) { status.textContent = tx("This code does not match any handover shared from here."); return; }
    h.ack = { id: match.id, at: new Date().toISOString(), by: ackVerify.elements.by.value.trim(), code };
    status.textContent = "";
    commit();
    note(tx("Confirmed by the other device."));
  });
  if (ackCodeBox) {
    ackCodeBox.querySelector("[data-ack-code-copy]").addEventListener("click", async () => {
      await copyText(Link.showAck(cur().received?.ackCode || ""));
      note(tx("Code copied. Give it to the sender."));
    });
    ackCodeBox.querySelector("[data-ack-code-link]").addEventListener("click", async () => {
      const h = cur();
      await copyText(`${location.href.split("#")[0]}#${Link.ackFragment(h.received.id, h.received.ackCode, h.to)}`);
      note(tx("Confirmation link copied. The sender opens it on their device."));
    });
  }

  // 5 Whys hands its countermeasure over with ?issue=, ?owner= and ?due=: it becomes an open issue of this handover,
  // once (the same text open already is not added twice). The address is cleaned so a reload does not add it again.
  const incoming = new URLSearchParams(location.search);
  const issueText = incoming.get("issue")?.trim();
  if (issueText) {
    const open = cur().issues.find((issue) => !issue.done && issue.text.trim() === issueText);
    if (!open) {
      cur().issues.push({ text: issueText, priority: data.priorities[0], owner: incoming.get("owner")?.trim() || "", due: incoming.get("due")?.trim() || "", done: false, carried: 0 });
      save();
      renderAll();
    }
    note(open ? tx("“{text}” is already an open issue here.", { text: issueText }) : tx("Added from 5 Whys as an open issue: “{text}”.", { text: issueText }));
    ["issue", "owner", "due"].forEach((name) => incoming.delete(name));
    history.replaceState(null, "", location.pathname + (incoming.size ? `?${incoming}` : "") + location.hash);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
})();
