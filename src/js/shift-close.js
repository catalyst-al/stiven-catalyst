// Closing a shift and carrying its open issues to the next one (window.ShiftClose): the one mechanism, used by the
// Shift Handover page and written so that another page can use it too (docs/plan-sot-2026-11-11/PLANI.md, step 3;
// docs/DATA-FORMATS.md §1). It works on the state the handover keeps, { current, idle, history, received }, and on
// nothing else: no page, no storage. The page that calls it saves the state and sets or clears the active shift
// (js/shift-context.js).
//
// Closing moves the handover to the history as it is, with an id of the closure (closeId), the real time, and where
// the handover stood: its transfer state, whether anything was written in it, and whether it was changed after it was
// last shared. It sends nothing and marks nothing as sent. After it no shift is open (idle): nothing starts the next
// one but start().
//
// Starting a shift is the visitor's own act, with the date, the shift, the template and the area they confirm. It
// carries the open issues of the closures that are waiting, and of no others: the closures of the same workplace (the
// same template and the same area, compared without regard to case and spaces; an empty area only with an empty one)
// that this shift comes after (a later date, or the same date and a later shift in the page's list) and that no
// handover has carried yet. A shift started for another workplace, an earlier shift, or one whose date or shift cannot
// be read, carries nothing, and the closure goes on waiting. The history is only read: opening it carries nothing.
//
// What keeps an issue from arriving twice. Each closure has its closeId; the handover that carries from it names it
// (carriedFrom), and the closure names the shift that took its issues (carried). Before anything is carried, every
// handover of the state, the open one and those in the history, is asked whether it names the closure: a start
// repeated, a second click or a reload carries nothing again. And an issue is compared with the ones already carried
// by the rule of a received handover (ShiftHandoverLink.mergeIssues: the same text with an owner and a date that
// agree is one issue; when that cannot be told, it is not added and the page says so). A closure of the page as it
// was before (no closeId) carried its issues at once: it never waits. This holds on one device. It says nothing
// between devices, and it does not say the carrying happens once in time: a saved file from before the start, put
// back, has the closure waiting again and the next start carries again, into a handover that does not have the issues.
//
// This way of closing is on only where the device has it turned on (localStorage "sc-shift-close-ui", { v: 1, on: true,
// set }: a setting of the device, in no saved file, no restore point and no team copy). Where it is not on, the page
// closes as it did before: the next handover is made at once with the open issues carried, and team sync treats the
// handover as it always did. Where it is on, team sync leaves the handover and its history out (js/team-sync.js reads
// the same key): the two go together, because a handover replaced by another device's would undo what is said above.
// A missing setting is "off", never "on".
//
// A closure whose open issues still wait is never dropped by the limit of the history: the limit drops the oldest
// closures that wait for nothing, and the history is longer than the limit by the ones that wait.
window.ShiftClose = (() => {
  const PILOT_KEY = "sc-shift-close-ui";
  const str = (value) => (typeof value === "string" ? value : "");
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(str(value));
  const STATES = ["draft", "ready", "shared", "received", "taken", "acknowledged"];
  const idOf = (value) => (/^c[a-z0-9]{8,24}$/.test(str(value)) ? value : "");
  const newId = () => {
    const bytes = new Uint8Array(15);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes); else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    return `c${Array.from(bytes, (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("")}`;
  };
  const key = (text) => str(text).toLowerCase().replace(/\s+/g, " ").trim();

  // ---- Whether this way of closing is on, on this device ----
  const enabled = () => {
    try {
      const value = JSON.parse(window.localStorage.getItem(PILOT_KEY));
      return isObject(value) && value.v === 1 && value.on === true;
    } catch {
      return false;
    }
  };
  // Turned on or off by the visitor only. { ok: true, on } or { ok: false, reason: "locked" | "unsaved" }.
  const enable = (on) => {
    if (window.WorkLock && window.WorkLock.locked) return { ok: false, reason: "locked" };
    try {
      if (on === true) window.localStorage.setItem(PILOT_KEY, JSON.stringify({ v: 1, on: true, set: Date.now() }));
      else window.localStorage.removeItem(PILOT_KEY);
    } catch {
      return { ok: false, reason: "unsaved" };
    }
    return { ok: true, on: on === true };
  };

  // ---- The workplace and the order of shifts ----
  const sameWorkplace = (a, b) => isObject(a) && isObject(b) && str(a.template) !== "" && a.template === b.template && key(a.area) === key(b.area);
  // 1 when shift a comes after b, -1 when before, 0 when they are the same shift; null when that cannot be told (a
  // date that is not one, a shift the list does not have).
  const compare = (shifts, a, b) => {
    if (!Array.isArray(shifts) || !isObject(a) || !isObject(b) || !isDate(a.date) || !isDate(b.date)) return null;
    const x = shifts.indexOf(a.shift);
    const y = shifts.indexOf(b.shift);
    if (x < 0 || y < 0) return null;
    if (a.date !== b.date) return a.date > b.date ? 1 : -1;
    return x === y ? 0 : x > y ? 1 : -1;
  };

  // ---- What a handover holds, as one short text: to know whether it changed since it was shared ----
  const sum = (h) => {
    const text = JSON.stringify([h.template, h.date, h.shift, h.area, h.from, h.to, h.headsUp, h.safety, h.metrics, (h.issues || []).map((i) => [i.text, i.priority, i.owner, i.due, i.done === true, i.carried || 0]), h.checks]);
    let a = 0xdeadbeef ^ text.length;
    let b = 0x41c6ce57 ^ text.length;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      a = Math.imul(a ^ code, 2654435761);
      b = Math.imul(b ^ code, 1597334677);
    }
    a = Math.imul(a ^ (a >>> 16), 2246822507) ^ Math.imul(b ^ (b >>> 13), 3266489909);
    b = Math.imul(b ^ (b >>> 16), 2246822507) ^ Math.imul(a ^ (a >>> 13), 3266489909);
    return (4294967296 * (2097151 & b) + (a >>> 0)).toString(36);
  };
  const sumOf = (value) => (/^[a-z0-9]{1,16}$/.test(str(value)) ? value : "");
  // Changed since it was last shared: only where the share kept what the handover held (a share made by the page as it
  // was before kept nothing, and says nothing either way).
  const changedAfterShare = (h) => {
    const last = isObject(h) && Array.isArray(h.shared) ? h.shared[h.shared.length - 1] : null;
    return Boolean(last && sumOf(last.sum) && last.sum !== sum(h));
  };

  // ---- The history ----
  // What a closure keeps beside the handover and its text. A closure of the page as it was before has none of it.
  const cleanEntry = (entry) => {
    const closeId = idOf(entry.closeId);
    const carried = isObject(entry.carried) && isDate(entry.carried.date) && str(entry.carried.shift) ? { date: entry.carried.date, shift: str(entry.carried.shift).slice(0, 60), at: str(entry.carried.at).slice(0, 40) } : null;
    return {
      closedAt: str(entry.closedAt).slice(0, 40),
      ...(closeId ? { closeId, state: STATES.includes(entry.state) ? entry.state : "draft", written: entry.written !== false, changed: entry.changed === true, drafts: Number.isInteger(entry.drafts) && entry.drafts > 0 ? Math.min(entry.drafts, 999) : 0 } : {}),
      ...(closeId && carried ? { carried } : {}),
    };
  };
  const carriedFromOf = (h) => (isObject(h) && Array.isArray(h.carriedFrom) ? [...new Set(h.carriedFrom.map(idOf).filter(Boolean))].slice(0, 40) : []);
  const openOf = (h) => (isObject(h) && Array.isArray(h.issues) ? h.issues.filter((issue) => isObject(issue) && !issue.done && str(issue.text).trim()) : []);
  // Every closure some handover of the state already carried from.
  const carriedIds = (state) => {
    const ids = new Set();
    if (!state.idle) carriedFromOf(state.current).forEach((id) => ids.add(id));
    state.history.forEach((entry) => carriedFromOf(entry.handover).forEach((id) => ids.add(id)));
    return ids;
  };
  // The closure of this very shift at this workplace, when there is one: a shift that was closed is not started again.
  const closed = (state, shifts, target) => state.history.find((entry) => entry.closeId && sameWorkplace(entry.handover, target) && compare(shifts, entry.handover, target) === 0) || null;
  // The closures whose open issues wait for this shift, oldest first.
  const pending = (state, shifts, target) => {
    const taken = carriedIds(state);
    return state.history.filter((entry) => entry.closeId && !entry.carried && !taken.has(entry.closeId)
      && sameWorkplace(entry.handover, target) && compare(shifts, target, entry.handover) === 1).reverse();
  };
  // The closures whose open issues have not been carried by any handover yet, whatever their workplace: the work the
  // history still holds for a shift to come.
  const waits = (entry, taken) => Boolean(entry.closeId && !entry.carried && !taken.has(entry.closeId) && openOf(entry.handover).length);
  const waiting = (state) => {
    const taken = carriedIds(state);
    return state.history.filter((entry) => waits(entry, taken));
  };
  // Keeps the history to `max` closures by dropping the oldest ones that wait for nothing. A closure that waits stays,
  // and so does the newest one, so the history can be longer than max by the closures that wait.
  const trim = (state, max = 30) => {
    const taken = carriedIds(state);
    let over = state.history.length - max;
    for (let at = state.history.length - 1; at >= 1 && over > 0; at -= 1) {
      if (waits(state.history[at], taken)) continue;
      state.history.splice(at, 1);
      over -= 1;
    }
    return state.history;
  };
  // What the handover of a language's pages says of one shift, read from the browser's storage for a page that is not
  // the Handover page (the work view of Damage Control asks before it offers to go back to a shift): "open" when the
  // handover open now is of that date and that word, "closed" when a closure of it is in the history, "none"
  // otherwise, also when nothing readable is stored. Read only: nothing is changed.
  const HANDOVER_KEYS = { en: "sc-shift-handover", de: "sc-shift-handover-de", sq: "sc-shift-handover-sq" };
  const shiftStatus = (list, date, label) => {
    let saved = null;
    try { saved = JSON.parse(window.localStorage.getItem(HANDOVER_KEYS[list] || "")); } catch { saved = null; }
    if (!isObject(saved)) return "none";
    const is = (h) => isObject(h) && h.date === date && str(h.shift).trim() === label;
    if (saved.idle !== true && is(saved.current)) return "open";
    return Array.isArray(saved.history) && saved.history.some((entry) => isObject(entry) && is(entry.handover)) ? "closed" : "none";
  };
  // The shift the handover of a language's pages has open now, and its last closure, read from the browser's storage
  // for a page that shows them without being the Handover page (js/today.js). Read only.
  const overview = (list) => {
    let saved = null;
    try { saved = JSON.parse(window.localStorage.getItem(HANDOVER_KEYS[list] || "")); } catch { saved = null; }
    if (!isObject(saved)) return { open: null, last: null };
    const shiftOf = (h) => (isObject(h) && isDate(h.date) && str(h.shift).trim() ? { date: h.date, shift: str(h.shift).trim(), area: str(h.area) } : null);
    const entry = Array.isArray(saved.history) ? saved.history.find(isObject) : null;
    return {
      open: saved.idle === true ? null : shiftOf(saved.current),
      last: entry && shiftOf(entry.handover) ? { ...shiftOf(entry.handover), closedAt: str(entry.closedAt) } : null,
    };
  };
  // The last closure, with or without an id: what the next shift is proposed from.
  const lastClosed = (state) => state.history[0] || null;

  // ---- Closing ----
  // Moves the open handover to the history and leaves no shift open. `placeholder` is the blank handover the page
  // keeps while idle. Returns the closure.
  const close = (state, { now = new Date(), text = "", status = "draft", written = true, drafts = 0, placeholder, max = 30 } = {}) => {
    if (state.idle) return null;
    const h = state.current;
    const entry = {
      closedAt: now.toISOString(), handover: JSON.parse(JSON.stringify(h)), text: str(text),
      closeId: newId(), state: STATES.includes(status) ? status : "draft", written: written !== false, changed: changedAfterShare(h), drafts: Number.isInteger(drafts) && drafts > 0 ? drafts : 0,
    };
    state.history.unshift(entry);
    trim(state, max);
    state.current = placeholder;
    state.idle = true;
    return entry;
  };

  // ---- Starting ----
  // Opens the handover of a shift the visitor chose. make(template, date, shift) gives the blank handover of the page;
  // merge is ShiftHandoverLink.mergeIssues. Returns { ok: true, started, added, sources, unclear } or { ok: false,
  // reason }: "invalid" (a date or a shift that is not one), "open" (another handover is open: it is closed first),
  // "closed" (this shift was closed at this workplace). started is false when the handover of this very shift is
  // already open: nothing is made and nothing is carried.
  const start = (state, { shifts, date, shift, template, area = "", make, merge, priorities = [], now = new Date() }) => {
    const target = { template, date, shift, area: str(area).trim() };
    if (!isDate(date) || !Array.isArray(shifts) || !shifts.includes(shift) || !str(template)) return { ok: false, reason: "invalid" };
    if (!state.idle) {
      if (sameWorkplace(state.current, target) && compare(shifts, state.current, target) === 0) return { ok: true, started: false, added: 0, sources: 0, unclear: [] };
      return { ok: false, reason: "open" };
    }
    if (closed(state, shifts, target)) return { ok: false, reason: "closed" };
    const sources = pending(state, shifts, target);
    const handover = make(template, date, shift);
    handover.area = target.area;
    const unclear = [];
    let added = 0;
    sources.forEach((entry) => {
      const incoming = openOf(entry.handover).map((item) => ({ ...item, carried: (item.carried || 0) + 1 }));
      const merged = merge(incoming, handover.issues, priorities);
      // The incoming issues come first in the answer, in their order; the ones already carried follow, marked kept.
      const next = handover.issues.slice();
      merged.issues.forEach((item) => {
        if (item.kept) return;
        const { kept, ambiguous, conflicts, ...plainIssue } = item;
        if (ambiguous) { unclear.push(str(item.text)); return; }
        const at = next.findIndex((have) => key(have.text) === key(item.text) && (have.owner === item.owner || !have.owner || !item.owner) && (have.due === item.due || !have.due || !item.due));
        if (at >= 0) next[at] = plainIssue; else { next.push(plainIssue); added += 1; }
      });
      handover.issues = next;
      entry.carried = { date, shift, at: now.toISOString() };
    });
    if (sources.length) {
      const latest = sources[sources.length - 1].handover;
      // As the page did before: the person taking over is the one handing over next, and the numbers keep their names.
      handover.from = str(latest.to);
      if (Array.isArray(latest.metrics) && latest.template === template) handover.metrics = latest.metrics.map(([label]) => [label, "", ""]);
      handover.carriedFrom = sources.map((entry) => entry.closeId);
    }
    state.current = handover;
    state.idle = false;
    return { ok: true, started: true, added, sources: sources.length, unclear };
  };

  return { PILOT_KEY, enabled, enable, waiting, trim, shiftStatus, overview, STATES, newId, idOf, sameWorkplace, compare, sum, sumOf, changedAfterShare, cleanEntry, carriedFromOf, openOf, carriedIds, closed, pending, lastClosed, close, start };
})();
