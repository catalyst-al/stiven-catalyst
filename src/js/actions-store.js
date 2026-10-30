// One list of actions for every tool (window.ActionsStore): the countermeasure of a 5 Whys, the finding of a 5S
// audit, the signal of a control chart, the open issue of a handover all become an action with an owner, a date, a
// status (open, doing, done, verified) and how it will be checked. Kept once in this browser (sc-actions, the same
// in every language) and shown by the Action Tracker (/tools/action-tracker/).
//
// A tool hands an action over through the tracker's address, the way 5 Whys hands its countermeasure to the handover:
//   ActionsStore.link({ title, detail, owner, due, source, check, area, priority })  →  …/tools/action-tracker/?action=…
// The tracker reads the address once (fromParams), adds the action if the same open one is not already there, and
// cleans the address. A page that has this script can also add directly: ActionsStore.add({...}).
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
  const clean = (item) => {
    if (!isObject(item) || !str(item.title)) return null;
    return {
      id: str(item.id) || id(),
      title: str(item.title).slice(0, 300),
      detail: str(item.detail).slice(0, 2000),
      owner: str(item.owner).slice(0, 120),
      due: isDate(str(item.due)) ? str(item.due) : "",
      source: str(item.source).replace(/[^a-z0-9-]/gi, "").slice(0, 40),
      check: str(item.check).slice(0, 500),
      area: str(item.area).slice(0, 120),
      priority: PRIORITIES.includes(item.priority) ? item.priority : "Medium",
      status: STATUSES.includes(item.status) ? item.status : "open",
      created: isDate(str(item.created)) ? str(item.created) : localIso(),
      closed: isDate(str(item.closed)) ? str(item.closed) : "",
      result: str(item.result).slice(0, 1000),
      ...(caseIdOf(item.caseId) ? { caseId: caseIdOf(item.caseId) } : {}),
      ...(refOf(item.ref) ? { ref: refOf(item.ref) } : {}),
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
  const update = (actionId, patch, { byCase = false } = {}) => {
    lastUpdate = "invalid";
    const rows = read();
    const index = rows.findIndex((row) => row.id === actionId);
    if (index < 0) return null;
    const before = rows[index];
    const next = clean({ ...before, ...patch, id: before.id, created: before.created });
    if (!next) return null;
    if (next.status === "verified" && !next.result) { lastUpdate = "needs-result"; return null; }
    if ((before.caseId || next.caseId) && (next.status === "verified") !== (before.status === "verified") && !byCase) { lastUpdate = "case-verifies"; return null; }
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
  const link = (action) => {
    const url = trackerUrl();
    if (str(action?.title)) {
      url.searchParams.set("action", str(action.title));
      PARAMS.slice(1, -1).forEach((name) => { if (str(action[name])) url.searchParams.set(name, str(action[name])); });
      if (caseIdOf(action.caseId)) url.searchParams.set("case", caseIdOf(action.caseId));
    }
    return url.href;
  };
  // An action from the page's address, added once (the same open title from the same source is not added twice), and
  // the address cleaned of what was read. Returns the action added, or null.
  const fromParams = (url = location) => {
    const params = new URLSearchParams(url.search);
    const title = str(params.get("action"));
    if (!title) return { added: null, cleaned: false };
    const incoming = { title, detail: str(params.get("detail")), owner: str(params.get("owner")), due: str(params.get("due")), source: str(params.get("source")), check: str(params.get("check")), area: str(params.get("area")), priority: str(params.get("priority")), caseId: str(params.get("case")) };
    const rows = list();
    const twin = rows.find((row) => isOpen(row) && row.title === title && row.source === clean({ title, source: incoming.source }).source && (row.caseId || "") === caseIdOf(incoming.caseId));
    const added = twin ? null : add(incoming);
    PARAMS.forEach((name) => params.delete(name));
    const rest = params.toString();
    if (typeof history !== "undefined" && history.replaceState) history.replaceState(null, "", `${url.pathname}${rest ? `?${rest}` : ""}${url.hash || ""}`);
    return { added, duplicate: Boolean(twin), cleaned: true };
  };
  // A link element that becomes a hand-over to the tracker when clicked: getAction() returns the action as it is then.
  const linkButton = (label, getAction, className = "button-secondary") => {
    const a = document.createElement("a");
    a.className = className;
    a.textContent = label;
    a.href = trackerUrl().href;
    a.addEventListener("click", () => { const action = getAction(); if (action && str(action.title)) a.href = link(action); });
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

  return { KEY, STATUSES, PRIORITIES, PARAMS, clean, list, all, add, addAll, update, remove, restore, replaceAll, isOpen, isOverdue, open, overdue, dueSoon, counts, forCase, byRef, byId, trackerUrl, link, linkButton, fromParams, ics, icsText, icsFold, get failed() { return failed; }, get lastAdd() { return lastAdd; }, get lastUpdate() { return lastUpdate; } };
})();
