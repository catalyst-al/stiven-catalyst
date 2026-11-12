// One list of actions for every tool (window.ActionsStore): the countermeasure of a 5 Whys, the finding of a 5S
// audit, the signal of a control chart, the open issue of a handover all become an action with an owner, a date, a
// status (open, doing, done, verified) and how it will be checked. Kept once in this browser (sc-actions, the same
// in every language) and shown by the Action Tracker (/tools/action-tracker/).
//
// A tool hands an action over through a note in this tab's sessionStorage and a token in the tracker's address
// (ToolKit.actionHandoff, js/tool-kit.js; phase 5B, privacy finding P1-02): nothing the visitor typed is in the address.
//   ActionsStore.link({ title, detail, owner, due, source, check, area, priority, caseId })  →  …/tools/action-tracker/#handoff=<token>
// The tracker reads the note once (fromParams), adds the action if the same open one is not already there, and cleans
// the address. A link of the older shape (?action=…, from before phase 5B) is still read the same way. A page that has
// this script can also add directly: ActionsStore.add({...}).
//
// Three rules keep the list trustworthy (audit of 27 October 2026, T-03 and T-19):
// - The Action Tracker's example is marked (example: true on each of its actions). list() and every count leave it
//   out, and the first action of the visitor's own, from any tool, replaces it whole instead of joining it.
// - add() refuses the same open action from the same tool (same title, same source): a second click or a reload does
//   not add it twice. lastAdd says why an add gave null: "duplicate", "unsaved" (the browser could not save) or
//   "invalid", or "example" (an example's action offered to a list that holds the visitor's own: it stays out).
// - add() returns the action only when it was saved.
// - An action may belong to a case (caseId: the id of an investigation of the CX Control Tower). The id travels in the
//   hand-off (?case=) and comes back with forCase(); the case decides "verified" from the KPI before and after.
// - "verified" needs a result: update() refuses to mark an action verified while its result is empty (lastUpdate says
//   "needs-result"). Done is a task finished; verified is a result shown. An action of a case is verified by the case
//   alone, from its KPI before and after: update() refuses to set or unset "verified" on it unless the caller says it
//   is the case (update(id, patch, { byCase: true }); lastUpdate "case-verifies"). Two cases may hold the same action
//   text: the same open title from the same tool is a duplicate only within the same case.
// - A tool may name the thing an action is about (ref: Room Inspection gives "<inspection id>|<item id>"). With a ref,
//   the same source and ref is the same action whatever its status (open, done or verified), so a defect sent again is
//   never a second action, and two defects with the same words are two actions. Without a ref the rule above holds.
//   A tool may also give the action its id (Room Inspection: "ri-<inspection id>-<item id>"), the same on every
//   device, so two devices that send the same defect make one row for team sync to merge, not two.
// - An action of Room Inspection with a ref (a defect) is verified by a re-inspection of that defect, not by hand:
//   update() refuses to set "verified" on it unless the caller is the re-inspection (update(id, patch, { byRecheck:
//   true }); lastUpdate "recheck-verifies"). The re-inspection leaves its proof on the action (proof: { recheck: the
//   re-inspection's id, date, time, qid, item, answer: pass | fail }), the record of the check that verified or
//   reopened it; only the re-inspection writes or changes it. Done is a task reported finished; verified is the
//   defect seen fixed in the room. Actions of older pages without a ref are verified by hand as before.
// - An action may say where in a log it came from (origin, docs/DATA-FORMATS.md §1): the period as two ISO dates, the
//   one filter that was on, or the one row. It is kept only whole (originOf): a damaged one is dropped and the action
//   stays. It is written when the action is made and never changed after (update() keeps the one that is there). It
//   travels in the hand-off note like the other fields, never in the address. A row that has an id names the action's
//   ref, so the same row sent again is the same action; a row without an id (a log from before rows had ids) keeps
//   only its copy of the row, and the rule without a ref holds.
window.ActionsStore = (() => {
  const KEY = "sc-actions";
  const STATUSES = ["open", "doing", "done", "verified"];
  const PRIORITIES = ["High", "Medium", "Low"];
  const PARAMS = ["action", "detail", "owner", "due", "source", "check", "area", "priority", "case"];
  const str = (value) => (typeof value === "string" ? value.trim() : "");
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const localIso = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const id = () => `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

  const caseIdOf = (value) => str(value).replace(/[^A-Za-z0-9-]/g, "").slice(0, 40);
  const refOf = (value) => str(value).replace(/[^A-Za-z0-9|_-]/g, "").slice(0, 80);
  const isTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  const isQid = (value) => /^[a-z]+-\d+$/.test(value);
  // The proof a re-inspection leaves: kept only whole (its re-inspection, item and answer), so a damaged one is not read.
  const proofOf = (value) => {
    if (!isObject(value)) return null;
    const recheck = str(value.recheck).replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40);
    const qid = str(value.qid);
    const answer = str(value.answer);
    if (!recheck || !isQid(qid) || !["pass", "fail"].includes(answer)) return null;
    return { recheck, date: isDate(str(value.date)) ? str(value.date) : "", time: isTime(str(value.time)) ? str(value.time) : "", qid, item: str(value.item).slice(0, 300), answer };
  };
  // Where in a log an action came from: { v: 1, tool, lang, kind: "period" | "filter" | "row", from, to } with, for
  // "filter", filter: { field: "cause" | "stage" | "shift", value }, and for "row", row: { id, date, shift, stage, cause,
  // units, twins }: a copy of the row, its id ("" on a row from before rows had ids) and how many rows of the log read
  // the same when the action was made. Whole or not at all: null for anything else.
  const ORIGIN_KINDS = ["period", "filter", "row"];
  const ORIGIN_FIELDS = ["cause", "stage", "shift"];
  const ORIGIN_LANGS = ["en", "de", "sq"];
  const originOf = (value) => {
    if (!isObject(value) || value.v !== 1) return null;
    const tool = str(value.tool);
    const lang = str(value.lang);
    const kind = str(value.kind);
    const from = str(value.from);
    const to = str(value.to);
    if (!/^[a-z0-9-]{1,40}$/.test(tool) || !ORIGIN_LANGS.includes(lang) || !ORIGIN_KINDS.includes(kind) || !isDate(from) || !isDate(to) || from > to) return null;
    const origin = { v: 1, tool, lang, kind, from, to };
    if (kind === "filter") {
      const filter = value.filter;
      if (!isObject(filter) || !ORIGIN_FIELDS.includes(filter.field) || !str(filter.value)) return null;
      origin.filter = { field: filter.field, value: str(filter.value).slice(0, 120) };
    }
    if (kind === "row") {
      const row = value.row;
      if (!isObject(row) || !isDate(str(row.date)) || !Number.isInteger(row.units) || row.units < 1 || row.units > 1000000) return null;
      origin.row = {
        id: str(row.id).replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40),
        date: str(row.date),
        shift: str(row.shift).slice(0, 120),
        stage: str(row.stage).slice(0, 120),
        cause: str(row.cause).slice(0, 120),
        units: row.units,
        twins: Number.isInteger(row.twins) && row.twins >= 1 ? Math.min(row.twins, 9999) : 1,
      };
    }
    return origin;
  };
  // An action a re-inspection verifies: Room Inspection's, naming its defect (ref "<inspection id>|<item id>").
  const byRecheckOnly = (action) => isObject(action) && action.source === "room-inspection" && /^[A-Za-z0-9_-]+\|[a-z]+-\d+$/.test(str(action.ref));
  const clean = (item) => {
    if (!isObject(item) || !str(item.title)) return null;
    const source = str(item.source).replace(/[^a-z0-9-]/gi, "").slice(0, 40);
    // The origin is of the tool the action came from, or it is not kept.
    const found = originOf(item.origin);
    const origin = found && found.tool === source ? found : null;
    // The row of a log names the action, when the row has an id: the same row sent again is the same action.
    const ref = refOf(item.ref) || (origin && origin.kind === "row" ? refOf(origin.row.id) : "");
    return {
      id: str(item.id) || id(),
      title: str(item.title).slice(0, 300),
      detail: str(item.detail).slice(0, 2000),
      owner: str(item.owner).slice(0, 120),
      due: isDate(str(item.due)) ? str(item.due) : "",
      source,
      check: str(item.check).slice(0, 500),
      area: str(item.area).slice(0, 120),
      priority: PRIORITIES.includes(item.priority) ? item.priority : "Medium",
      status: STATUSES.includes(item.status) ? item.status : "open",
      created: isDate(str(item.created)) ? str(item.created) : localIso(),
      closed: isDate(str(item.closed)) ? str(item.closed) : "",
      result: str(item.result).slice(0, 1000),
      ...(caseIdOf(item.caseId) ? { caseId: caseIdOf(item.caseId) } : {}),
      ...(ref ? { ref } : {}),
      ...(proofOf(item.proof) ? { proof: proofOf(item.proof) } : {}),
      ...(origin ? { origin } : {}),
      ...(item.example === true ? { example: true } : {}),
    };
  };
  // A list saved before the example was marked: the tracker remembered the example's ids beside the list
  // (sc-actions-ui, exampleIds). Those actions are marked now, even where an own action was added to them since.
  const legacyExample = (rows) => {
    let ids = [];
    try { const ui = JSON.parse(localStorage.getItem(`${KEY}-ui`)); ids = isObject(ui) && Array.isArray(ui.exampleIds) ? ui.exampleIds : []; } catch { ids = []; }
    if (!ids.length) return rows;
    return rows.map((row) => (ids.includes(row.id) ? { ...row, example: true } : row));
  };
  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      const rows = isObject(saved) && Array.isArray(saved.rows) ? saved.rows : Array.isArray(saved) ? saved : [];
      return legacyExample(rows.map(clean).filter(Boolean));
    } catch { return []; }
  };
  const ownOnly = (rows) => rows.filter((row) => row.example !== true);
  let failed = false;
  // Saves the list; false when the browser could not (storage full or blocked, or the tools locked with a PIN).
  const write = (rows) => {
    if (window.WorkLock?.locked) { failed = true; return false; }
    try {
      localStorage.setItem(KEY, JSON.stringify({ rows }));
      failed = false;
    } catch {
      failed = true;
      window.ToolKit?.warnNotSaved?.();
    }
    window.dispatchEvent(new CustomEvent("actions:changed", { detail: { count: rows.length } }));
    return !failed;
  };
  // The visitor's actions, without an example; all() with it, for the tracker that shows it.
  const list = () => ownOnly(read());
  const all = () => read();
  let lastAdd = null;
  const add = (item) => {
    lastAdd = "invalid";
    const action = clean(item);
    if (!action) return null;
    let rows = read();
    if (action.example) {
      // An example action only goes into a list that holds nothing of the visitor's.
      if (ownOnly(rows).length) { lastAdd = "example"; return null; }
    } else {
      rows = ownOnly(rows);
    }
    // The same id, or the same source and ref in any status, is the same action; without a ref, the same open title
    // from the same tool (and case) is.
    const same = rows.some((row) => row.id === action.id)
      || (action.ref ? rows.some((row) => row.source === action.source && row.ref === action.ref)
        : rows.some((row) => isOpen(row) && row.title === action.title && row.source === action.source && (row.caseId || "") === (action.caseId || "")));
    if (same) {
      lastAdd = "duplicate";
      return null;
    }
    rows.push(action);
    if (!write(rows)) { lastAdd = "unsaved"; return null; }
    lastAdd = null;
    return action;
  };
  // Several actions from one tool, as one hand-off: what was added, what was already open and what could not be saved
  // (ToolKit.actionsNote says it in the page's language).
  const addAll = (items) => {
    const result = { added: [], duplicate: 0, unsaved: 0, example: 0 };
    (Array.isArray(items) ? items : []).forEach((item) => {
      const action = add(item);
      if (action) result.added.push(action);
      else if (lastAdd === "duplicate") result.duplicate += 1;
      else if (lastAdd === "unsaved") result.unsaved += 1;
      else if (lastAdd === "example") result.example += 1;
    });
    return result;
  };
  let lastUpdate = null;
  const update = (actionId, patch, { byCase = false, byRecheck = false } = {}) => {
    lastUpdate = "invalid";
    const rows = read();
    const index = rows.findIndex((row) => row.id === actionId);
    if (index < 0) return null;
    const before = rows[index];
    // The proof is the re-inspection's to write; any other caller keeps the one that is there.
    // The origin says where the action was made: it stays as it was, like the id and the day it was created.
    const next = clean({ ...before, ...(isObject(patch) ? patch : {}), ...(byRecheck ? {} : { proof: before.proof }), id: before.id, created: before.created, origin: before.origin });
    if (!next) return null;
    if (next.status === "verified" && !next.result) { lastUpdate = "needs-result"; return null; }
    if ((before.caseId || next.caseId) && (next.status === "verified") !== (before.status === "verified") && !byCase) { lastUpdate = "case-verifies"; return null; }
    if (byRecheckOnly(before) && next.status === "verified" && before.status !== "verified" && !byRecheck) { lastUpdate = "recheck-verifies"; return null; }
    lastUpdate = null;
    if ((next.status === "done" || next.status === "verified") && !next.closed) next.closed = localIso();
    if (next.status === "open" || next.status === "doing") next.closed = "";
    rows[index] = next;
    if (!write(rows)) { lastUpdate = "unsaved"; return null; }
    return next;
  };
  const remove = (actionId) => {
    const rows = read();
    const index = rows.findIndex((row) => row.id === actionId);
    if (index < 0) return null;
    const [removed] = rows.splice(index, 1);
    write(rows);
    return { removed, index };
  };
  const restore = (action, index) => {
    const rows = read();
    rows.splice(Math.min(index, rows.length), 0, clean(action));
    write(rows);
  };
  const replaceAll = (rows) => write(rows.map(clean).filter(Boolean));
  const isOpen = (action) => action.status === "open" || action.status === "doing";
  // The actions of a case, newest last.
  const forCase = (caseId) => (caseIdOf(caseId) ? list().filter((action) => action.caseId === caseIdOf(caseId)) : []);
  // The action a tool named (source and ref), in any status; and an action by its id. Null when there is none.
  const byRef = (source, ref) => (refOf(ref) ? list().find((action) => action.source === clean({ title: "x", source }).source && action.ref === refOf(ref)) || null : null);
  const byId = (actionId) => list().find((action) => action.id === str(actionId)) || null;
  const isOverdue = (action, today = localIso()) => isOpen(action) && action.due !== "" && action.due < today;
  const open = () => list().filter(isOpen);
  const overdue = (today = localIso()) => list().filter((action) => isOverdue(action, today));
  const dueSoon = (days = 3, today = localIso()) => {
    const limit = new Date(`${today}T00:00:00Z`);
    limit.setUTCDate(limit.getUTCDate() + days);
    const until = limit.toISOString().slice(0, 10);
    return list().filter((action) => isOpen(action) && action.due && action.due >= today && action.due <= until);
  };
  const counts = (today = localIso()) => {
    const rows = list();
    return {
      total: rows.length,
      open: rows.filter(isOpen).length,
      overdue: rows.filter((a) => isOverdue(a, today)).length,
      done: rows.filter((a) => a.status === "done").length,
      verified: rows.filter((a) => a.status === "verified").length,
      bySource: rows.filter(isOpen).reduce((map, a) => { map[a.source || "manual"] = (map[a.source || "manual"] || 0) + 1; return map; }, {}),
    };
  };

  // The tracker in this page's language: /tools/action-tracker/, /de/tools/…, /sq/tools/….
  const trackerUrl = () => {
    const lang = (location.pathname.match(/^\/(de|sq)(?=\/)/) || [])[1];
    return new URL(`${lang ? `/${lang}` : ""}/tools/action-tracker/`, location.origin);
  };
  // The hand-off note and the token in the address (ToolKit.actionHandoff). Without ToolKit (never on a tool page) the
  // address says the action was not handed over rather than carrying it.
  const handoff = () => window.ToolKit?.actionHandoff || null;
  const link = (action) => {
    const url = trackerUrl();
    if (!str(action?.title)) return url.href;
    const fields = { title: str(action.title) };
    PARAMS.slice(1, -1).forEach((name) => { if (str(action[name])) fields[name] = str(action[name]); });
    if (caseIdOf(action.caseId)) fields.caseId = caseIdOf(action.caseId);
    if (originOf(action.origin)) fields.origin = originOf(action.origin);
    const h = handoff();
    return h ? h.href(url.href, fields) : `${url.href}#handoff=unsaved`;
  };
  const fieldsOf = (get) => ({ title: str(get("title")), detail: str(get("detail")), owner: str(get("owner")), due: str(get("due")), source: str(get("source")), check: str(get("check")), area: str(get("area")), priority: str(get("priority")), caseId: str(get("caseId")) });
  // An action from the page's address: the note its token names (read once and removed), or, from a link of the older
  // shape, the parameters themselves. Added once (the same open title from the same source and case is not added
  // twice), and the address cleaned of what was read. `missing` says a token arrived with no note behind it (a link
  // opened in another tab or browser, or storage the browser refused): the tracker then says so. `failed` says the
  // save was refused: the note and the address are left as they are for a reload to try again. Returns the action
  // added, or null.
  const fromParams = (url = location) => {
    const h = handoff();
    const token = h ? h.tokenOf(url) : "";
    let incoming = null;
    let missing = false;
    if (token) {
      // Read, not yet taken: the note is removed only once the action is saved or refused as a duplicate.
      const note = token === "unsaved" || !h ? null : h.read(token);
      if (note && str(note.title)) incoming = fieldsOf((name) => note[name]); else missing = true;
      // The origin comes with the note only: a link of the older shape never carried one, and nothing puts it in an address.
      if (incoming && originOf(note.origin)) incoming.origin = originOf(note.origin);
    }
    const params = new URLSearchParams(url.search);
    if (!incoming && str(params.get("action"))) incoming = fieldsOf((name) => params.get(name === "title" ? "action" : name === "caseId" ? "case" : name));
    if (!incoming && !token) return { added: null, cleaned: false };
    let added = null;
    let duplicate = false;
    let failed = "";
    if (incoming) {
      const rows = list();
      const twin = rows.find((row) => isOpen(row) && row.title === incoming.title && row.source === clean({ title: incoming.title, source: incoming.source }).source && (row.caseId || "") === caseIdOf(incoming.caseId));
      added = twin ? null : add(incoming);
      duplicate = Boolean(twin) || (!added && lastAdd === "duplicate");
      // Saved, or already there: done. Refused (storage full or blocked, the tools locked with the PIN): the note and
      // the address stay as they are, so a reload after the unlock, or once there is room, hands the action over; the
      // tracker says so. Nothing is ever put back into the address.
      failed = added || duplicate ? "" : lastAdd || "unsaved";
    }
    if (failed) return { added: null, duplicate: false, missing: false, failed, cleaned: false };
    if (token && h && token !== "unsaved") h.take(token);
    PARAMS.forEach((name) => params.delete(name));
    const rest = params.toString();
    if (typeof history !== "undefined" && history.replaceState) history.replaceState(null, "", `${url.pathname}${rest ? `?${rest}` : ""}${token ? "" : url.hash || ""}`);
    return { added, duplicate, missing, failed: "", cleaned: true };
  };
  // A link element that becomes a hand-over to the tracker when followed: getAction() returns the action as it is then
  // (mousedown covers a middle click, which fires no click).
  const linkButton = (label, getAction, className = "button-secondary") => {
    const a = document.createElement("a");
    a.className = className;
    a.textContent = label;
    a.href = trackerUrl().href;
    for (const type of ["mousedown", "click"]) a.addEventListener(type, () => { const action = getAction(); if (action && str(action.title)) a.href = link(action); });
    return a;
  };
  // iCalendar text (RFC 5545), shared by every tool that writes a calendar file (the Action Tracker, the Maintenance
  // Planner, the 5S audit plan, Leader Standard Work): icsText escapes a value, icsFold breaks a content line after 75
  // octets of UTF-8 (not characters: "ë" and "ü" take two, so a German or Albanian line counts more than it shows),
  // each continuation starting with one space, and never inside a character.
  const icsText = (value) => String(value ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const octets = (char) => { const code = char.codePointAt(0); return code < 0x80 ? 1 : code < 0x800 ? 2 : code < 0x10000 ? 3 : 4; };
  const icsFold = (line) => {
    const parts = [];
    let part = "", size = 0;
    for (const char of String(line)) {
      if (size + octets(char) > 75) { parts.push(part); part = " "; size = 1; }
      part += char;
      size += octets(char);
    }
    parts.push(part);
    return parts.join("\r\n");
  };
  // The list as an iCalendar file: every open action with a due date is an all-day event, so a phone can remind its owner.
  // The labels in the description are in the page's language (ToolKit's tx, loaded before this script on tool pages).
  const ics = (rows = list(), stamp = new Date()) => {
    const tx = window.ToolKit?.tx || ((text) => text);
    const dt = stamp.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Stiven Catalyst//Action Tracker//EN", "CALSCALE:GREGORIAN"];
    rows.filter((a) => isOpen(a) && a.due).forEach((a) => {
      const day = a.due.replace(/-/g, "");
      const next = new Date(`${a.due}T00:00:00Z`);
      next.setUTCDate(next.getUTCDate() + 1);
      lines.push("BEGIN:VEVENT", `UID:${a.id}@stivencatalyst.com`, `DTSTAMP:${dt}`, `DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replace(/-/g, "")}`, `SUMMARY:${icsText(a.title)}${a.owner ? icsText(` (${a.owner})`) : ""}`);
      const description = [a.detail, a.check ? `${tx("Check")}: ${a.check}` : "", a.area ? `${tx("Area")}: ${a.area}` : "", a.source ? `${tx("From")}: ${a.source}` : ""].filter(Boolean).join("\n");
      if (description) lines.push(`DESCRIPTION:${icsText(description)}`);
      lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    return `${lines.map(icsFold).join("\r\n")}\r\n`;
  };

  return { KEY, STATUSES, PRIORITIES, PARAMS, clean, originOf, list, all, add, addAll, update, remove, restore, replaceAll, isOpen, isOverdue, open, overdue, dueSoon, counts, forCase, byRef, byId, byRecheckOnly, trackerUrl, link, linkButton, fromParams, ics, icsText, icsFold, get failed() { return failed; }, get lastAdd() { return lastAdd; }, get lastUpdate() { return lastUpdate; } };
})();
