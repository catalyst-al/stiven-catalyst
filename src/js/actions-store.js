// One list of actions for every tool (window.ActionsStore): the countermeasure of a 5 Whys, the finding of a 5S
// audit, the signal of a control chart, the open issue of a handover all become an action with an owner, a date, a
// status (open, doing, done, verified) and how it will be checked. Kept once in this browser (sc-actions, the same
// in every language) and shown by the Action Tracker (/tools/action-tracker/).
//
// A tool hands an action over through the tracker's address, the way 5 Whys hands its countermeasure to the handover:
//   ActionsStore.link({ title, detail, owner, due, source, check, area, priority })  →  …/tools/action-tracker/?action=…
// The tracker reads the address once (fromParams), adds the action if the same open one is not already there, and
// cleans the address. A page that has this script can also add directly: ActionsStore.add({...}).
window.ActionsStore = (() => {
  const KEY = "sc-actions";
  const STATUSES = ["open", "doing", "done", "verified"];
  const PRIORITIES = ["High", "Medium", "Low"];
  const PARAMS = ["action", "detail", "owner", "due", "source", "check", "area", "priority"];
  const str = (value) => (typeof value === "string" ? value.trim() : "");
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const localIso = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const id = () => `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

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
    };
  };
  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      const rows = isObject(saved) && Array.isArray(saved.rows) ? saved.rows : Array.isArray(saved) ? saved : [];
      return rows.map(clean).filter(Boolean);
    } catch { return []; }
  };
  let failed = false;
  const write = (rows) => {
    try { localStorage.setItem(KEY, JSON.stringify({ rows })); } catch { failed = true; }
    window.dispatchEvent(new CustomEvent("actions:changed", { detail: { count: rows.length } }));
    return rows;
  };
  const list = () => read();
  const add = (item) => {
    const action = clean(item);
    if (!action) return null;
    const rows = read();
    rows.push(action);
    write(rows);
    return action;
  };
  const update = (actionId, patch) => {
    const rows = read();
    const index = rows.findIndex((row) => row.id === actionId);
    if (index < 0) return null;
    const next = clean({ ...rows[index], ...patch, id: rows[index].id, created: rows[index].created });
    if (!next) return null;
    if ((next.status === "done" || next.status === "verified") && !next.closed) next.closed = localIso();
    if (next.status === "open" || next.status === "doing") next.closed = "";
    rows[index] = next;
    write(rows);
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
  const isOverdue = (action, today = localIso()) => isOpen(action) && action.due !== "" && action.due < today;
  const open = () => read().filter(isOpen);
  const overdue = (today = localIso()) => read().filter((action) => isOverdue(action, today));
  const dueSoon = (days = 3, today = localIso()) => {
    const limit = new Date(`${today}T00:00:00Z`);
    limit.setUTCDate(limit.getUTCDate() + days);
    const until = limit.toISOString().slice(0, 10);
    return read().filter((action) => isOpen(action) && action.due && action.due >= today && action.due <= until);
  };
  const counts = (today = localIso()) => {
    const rows = read();
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
      PARAMS.slice(1).forEach((name) => { if (str(action[name])) url.searchParams.set(name, str(action[name])); });
    }
    return url.href;
  };
  // An action from the page's address, added once (the same open title from the same source is not added twice), and
  // the address cleaned of what was read. Returns the action added, or null.
  const fromParams = (url = location) => {
    const params = new URLSearchParams(url.search);
    const title = str(params.get("action"));
    if (!title) return { added: null, cleaned: false };
    const incoming = { title, detail: str(params.get("detail")), owner: str(params.get("owner")), due: str(params.get("due")), source: str(params.get("source")), check: str(params.get("check")), area: str(params.get("area")), priority: str(params.get("priority")) };
    const rows = read();
    const twin = rows.find((row) => isOpen(row) && row.title === title && row.source === clean({ title, source: incoming.source }).source);
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
  // The list as an iCalendar file: every open action with a due date is an all-day event, so a phone can remind its owner.
  const ics = (rows = read(), stamp = new Date()) => {
    const esc = (text) => String(text).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
    const dt = stamp.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Stiven Catalyst//Action Tracker//EN", "CALSCALE:GREGORIAN"];
    rows.filter((a) => isOpen(a) && a.due).forEach((a) => {
      const day = a.due.replace(/-/g, "");
      const next = new Date(`${a.due}T00:00:00Z`);
      next.setUTCDate(next.getUTCDate() + 1);
      lines.push("BEGIN:VEVENT", `UID:${a.id}@stivencatalyst.com`, `DTSTAMP:${dt}`, `DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replace(/-/g, "")}`, `SUMMARY:${esc(a.title)}${a.owner ? esc(` (${a.owner})`) : ""}`);
      const description = [a.detail, a.check ? `Check: ${a.check}` : "", a.area ? `Area: ${a.area}` : "", a.source ? `From: ${a.source}` : ""].filter(Boolean).join("\n");
      if (description) lines.push(`DESCRIPTION:${esc(description)}`);
      lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    return `${lines.join("\r\n")}\r\n`;
  };

  return { KEY, STATUSES, PRIORITIES, PARAMS, clean, list, add, update, remove, restore, replaceAll, isOpen, isOverdue, open, overdue, dueSoon, counts, trackerUrl, link, linkButton, fromParams, ics, get failed() { return failed; } };
})();
