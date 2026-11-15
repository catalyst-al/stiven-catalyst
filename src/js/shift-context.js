// The shift a device is working in, and the forms left unfinished in it (window.ShiftContext). No page shows either
// yet: this file keeps them, so the pages that will have one place to ask (docs/plan-sot-2026-11-11/PLANI.md, step 2;
// docs/DATA-FORMATS.md §1).
//
// The active shift is a setting of this device: localStorage "sc-shift-ui", { v: 1, date, index, of, label, list,
// set }. date is the operative date the visitor chose (ISO; a night shift keeps the date it started on). A shift is
// kept as what it was when it was chosen: index, its place in the list it was chosen from; of, the length of that
// list; label, the word it was shown as; and list, which list that was: "en", "de" or "sq" for the list built into the
// pages of that language, "profile" for the shifts of the workplace profile, the same words in every language. Nothing
// sets it but setActive(): not the clock, not a file put back, not a restore point. It is not work: it is in no saved
// file and no restore point (work-backup.js SKIP), and team sync shares no key that ends in "-ui".
//
// A place in a list says nothing by itself: the visitor may put the profile's shifts in another order, or name another
// shift in the same place. So a stored shift is never read as "whatever is in that place now". place() says where it
// is in a list as it is today: "same" when the list is of the same kind and length and has the same word in the same
// place (or when both lists are built into the pages, of two languages: the same shifts in the same order, in other
// words); otherwise "unclear", with the places where its word is found now (one, none or several). activeOn() gives
// the active shift for a page's list only when it is "same". Nothing here changes a stored shift or the profile: what
// is unclear stays as it was kept, for the visitor to settle.
//
// A draft is what was typed into a form and not yet entered: localStorage "sc-drafts-ui", { v: 1, drafts: [draft] },
// a draft being { tool, form, scope, date, index, of, label, values, updated, rev }. A draft is of one form in one
// shift, and that is its identity: tool is the storage key the form writes to (sc-damage-control-sq: the tool and the
// language, each language keeping its own log), form the form's name on that page, scope what else sets two forms of
// the page apart (an area; "" when nothing does), then the operative date and the shift, whole: index, of, label and
// list. Two forms that share a date and a shift are two drafts as long as anything else of the identity differs; one
// identity has one draft. A draft exists only while it holds something: saving empty values removes it. Because the
// word and the kind of list are part of the identity, a draft of a shift whose place now holds another shift is not
// found for that other shift: it stays in the list as the draft of the shift it was written in, and place() says where
// that shift is now, for move() to carry it when the visitor asks.
//
// Nothing moves a draft by itself. move() carries one to another identity only when asked, and refuses when the
// target has work (a draft there, or a form the caller says has work): both stay as they were.
//
// rev is a token that changes at every save. A page keeps the rev of the draft it loaded and gives it back when it
// saves (base): when the stored draft has another rev by then (a file was put back, another tab saved), the save is
// refused with "changed" and the stored draft, so an open form never writes over a draft it has not seen.
//
// The drafts are not shared by team sync (the key ends in "-ui"). They are work all the same: they go into the saved
// file and the restore points. Putting them back never sets the active shift, and never replaces a draft unasked:
// planRestore() says which drafts of the file are new here, which are the same and which differ from the one here, and
// settleRestore() gives the text to write once the visitor has chosen for those that differ (work-backup.js asks,
// before anything is changed). The drafts of this browser that the file does not have stay.
//
// Data that cannot be read never breaks the page: a damaged active shift reads as none; drafts that cannot be read
// are kept aside unchanged ("sc-drafts-unreadable-ui", once) and the list reads as empty, a record that is not a draft
// is left out of the list the same way. While the tools are locked with a PIN (work-lock.js) nothing is written.
window.ShiftContext = (() => {
  const ACTIVE_KEY = "sc-shift-ui";
  const DRAFTS_KEY = "sc-drafts-ui";
  const ASIDE_KEY = "sc-drafts-unreadable-ui";
  const VERSION = 1;
  const MAX_DRAFTS = 40;
  const MAX_FIELDS = 24;
  const MAX_TEXT = 2000;
  const MAX_SHIFTS = 24;
  // Which list a shift was chosen from: the one built into the pages of a language, or the workplace profile's.
  const BUILT_IN = ["en", "de", "sq"];
  const LISTS = [...BUILT_IN, "profile"];

  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const str = (value) => (typeof value === "string" ? value : "");
  const store = () => {
    try {
      const probe = window.localStorage;
      probe.length;
      return probe;
    } catch {
      return null;
    }
  };
  const locked = () => Boolean(window.WorkLock?.locked);
  const isDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const day = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(day.getTime()) && day.toISOString().slice(0, 10) === value;
  };
  const token = () => {
    const bytes = new Uint8Array(12);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes); else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    return Array.from(bytes, (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("");
  };
  const changed = (what) => {
    try { window.dispatchEvent(new CustomEvent("shift-context:changed", { detail: { what } })); } catch { /* no events here */ }
  };

  // A shift as it was chosen: its place in a list, the length of that list, the word it was shown as and which list
  // it was. All four, or it is not a shift: a place without its word could be read as another shift later.
  const word = (value) => str(value).trim().replace(/\s+/g, " ");
  const shiftOf = (value) => {
    if (!isObject(value) || !Number.isInteger(value.index) || !Number.isInteger(value.of)) return null;
    if (value.of < 1 || value.of > MAX_SHIFTS || value.index < 0 || value.index >= value.of) return null;
    const label = word(value.label);
    if (!label || label.length > 60 || !LISTS.includes(value.list)) return null;
    return { index: value.index, of: value.of, label, list: value.list };
  };
  // Where a stored shift (the active one, or a draft's) is in a list as it is now. shifts is the list of the page, list
  // its kind. { state: "same", index } when it is the same shift in the same place; { state: "unclear", candidates }
  // otherwise, candidates being the places that hold its word now: one when the shift moved, none when it is gone or
  // the lists cannot be compared, several when two shifts share the word. Nothing is changed.
  const place = (item, shifts, list) => {
    const shift = shiftOf(item);
    const words = Array.isArray(shifts) ? shifts.map(word) : [];
    if (!shift || !LISTS.includes(list) || !words.length) return { state: "unclear", candidates: [] };
    if (shift.list === list) {
      if (words.length === shift.of && words[shift.index] === shift.label) return { state: "same", index: shift.index, candidates: [shift.index] };
      return { state: "unclear", candidates: words.map((text, at) => (text === shift.label ? at : -1)).filter((at) => at >= 0) };
    }
    // The lists built into the pages of two languages are the same shifts in the same order, in other words. A list
    // of the profile and a built-in one have nothing that ties a place in one to a place in the other.
    if (BUILT_IN.includes(shift.list) && BUILT_IN.includes(list) && words.length === shift.of) return { state: "same", index: shift.index, candidates: [shift.index] };
    return { state: "unclear", candidates: [] };
  };

  // ---- The active shift ----
  const cleanActive = (value) => {
    if (!isObject(value) || value.v !== VERSION || !isDate(str(value.date))) return null;
    const shift = shiftOf(value);
    if (!shift) return null;
    return { v: VERSION, date: value.date, ...shift, set: Number.isFinite(value.set) && value.set >= 0 ? value.set : 0 };
  };
  const active = () => {
    const storage = store();
    if (!storage) return null;
    try { return cleanActive(JSON.parse(storage.getItem(ACTIVE_KEY))); } catch { return null; }
  };
  // The active shift for a page, given the page's list of shifts and its kind: { ok: true, active, index, label } with
  // the word of this page's list, or { ok: false, reason: "none" } when no shift is active and { ok: false, reason:
  // "shift-unclear", active, candidates } when the stored shift is not surely one of this list (place()). A page uses
  // this, never the stored place by itself.
  const activeOn = (shifts, list) => {
    const stored = active();
    if (!stored) return { ok: false, reason: "none" };
    const where = place(stored, shifts, list);
    if (where.state !== "same") return { ok: false, reason: "shift-unclear", active: stored, candidates: where.candidates };
    return { ok: true, active: stored, index: where.index, label: word(shifts[where.index]) };
  };
  // After a saved file or a restore point was put back (work-backup.js, storage-guard.js): the active shift is kept
  // only when it is proved to be the shift of the handover that is open now. The proof has three parts, and each must
  // hold: a handover is open (stored, readable, not idle) under the key of the list the shift was chosen from; it has
  // the same operative date; and its shift is the same word. Within one built-in list a word names one shift, so the
  // three together say it is the same shift. Anything less clears the active shift, and the visitor starts the shift
  // again: a file may have brought back a shift that was closed, or taken away the one that was started. The answer
  // says which part failed (reason): "idle" (no handover is open there), "other-shift" (another date or another
  // word), "unreadable" (what is stored there cannot be read), "unprovable" (below).
  //
  // A shift chosen from the profile's list cannot be proved, and the reason is not where it came from but what a
  // handover holds: a handover is always written with the shifts built into the pages of a language, and keeps its
  // shift as a word only. The profile's list is the visitor's own: it may have another number of shifts, another
  // order, or the same word for another shift ("Night" as the second of two is not surely "Night" as the third of
  // three). place() already says a profile shift and a built-in list cannot be compared; an equal word in an open
  // handover is therefore a likeness, not a proof, and an unclear shift is cleared like one that does not match.
  const HANDOVER_KEYS = { en: "sc-shift-handover", de: "sc-shift-handover-de", sq: "sc-shift-handover-sq" };
  const proveOpen = (stored) => {
    const key = HANDOVER_KEYS[stored.list];
    // No handover is written with this list: nothing stored can say this shift is the open one.
    if (!key) return "unprovable";
    let saved;
    try { saved = JSON.parse(store().getItem(key)); } catch { return "unreadable"; }
    if (saved === null) return "idle";
    if (!isObject(saved) || !isObject(saved.current)) return "unreadable";
    if (saved.idle === true) return "idle";
    if (saved.current.date !== stored.date || word(saved.current.shift) !== stored.label) return "other-shift";
    return "";
  };
  const keepActiveIfOpen = () => {
    const stored = active();
    if (!stored) return { ok: true, kept: false, reason: "none" };
    const reason = proveOpen(stored);
    if (!reason) return { ok: true, kept: true };
    return { ...clearActive(), kept: false, reason };
  };
  const setActive = (value) => {
    const next = cleanActive({ ...(isObject(value) ? value : {}), v: VERSION, set: Date.now() });
    if (!next) return { ok: false, reason: "invalid" };
    if (locked()) return { ok: false, reason: "locked" };
    const storage = store();
    try { storage.setItem(ACTIVE_KEY, JSON.stringify(next)); } catch { return { ok: false, reason: "unsaved" }; }
    changed("active");
    return { ok: true, active: next };
  };
  const clearActive = () => {
    const storage = store();
    try { storage.removeItem(ACTIVE_KEY); } catch { return { ok: false, reason: "unsaved" }; }
    changed("active");
    return { ok: true };
  };

  // ---- Drafts ----
  // The values of a form: text as it was typed, or a number, under the names of the fields.
  const cleanValues = (values) => {
    const out = {};
    if (!isObject(values)) return out;
    for (const [name, value] of Object.entries(values)) {
      if (Object.keys(out).length >= MAX_FIELDS) break;
      if (!/^[A-Za-z][A-Za-z0-9_-]{0,39}$/.test(name)) continue;
      if (typeof value === "string") out[name] = value.slice(0, MAX_TEXT);
      else if (typeof value === "number" && Number.isFinite(value)) out[name] = value;
    }
    return out;
  };
  const hasWork = (values) => Object.values(cleanValues(values)).some((value) => (typeof value === "number" ? true : value.trim() !== ""));
  const sameValues = (a, b) => {
    const flat = (values) => JSON.stringify(Object.entries(cleanValues(values)).filter(([, value]) => typeof value === "number" || value.trim() !== "").sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0)));
    return flat(a) === flat(b);
  };
  // Where a draft belongs. The tool is the storage key of the work the form writes to, never a setting's key.
  const cleanContext = (context) => {
    if (!isObject(context)) return null;
    const tool = str(context.tool);
    const form = str(context.form);
    const scope = str(context.scope).trim().replace(/\s+/g, " ");
    const shift = shiftOf(context);
    if (!/^sc-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool) || tool.length > 60 || /-ui$/.test(tool)) return null;
    if (!/^[a-z][a-z0-9-]{0,39}$/.test(form) || scope.length > 200 || !isDate(str(context.date)) || !shift) return null;
    return { tool, form, scope, date: context.date, ...shift };
  };
  const identity = (context) => JSON.stringify([context.tool, context.form, context.scope, context.date, context.index, context.of, context.list, context.label]);
  const cleanDraft = (item) => {
    const context = cleanContext(item);
    if (!context || !/^[a-z0-9]{6,32}$/.test(str(item.rev))) return null;
    const values = cleanValues(item.values);
    if (!hasWork(values)) return null;
    return { ...context, values, updated: Number.isFinite(item.updated) && item.updated >= 0 ? item.updated : 0, rev: item.rev };
  };
  // The drafts of a stored text, and whether anything in it was not as this file writes it.
  const parse = (text) => {
    if (text === null || text === undefined) return { drafts: [], damaged: false };
    let value;
    try { value = JSON.parse(text); } catch { return { drafts: [], damaged: true }; }
    if (!isObject(value) || value.v !== VERSION || !Array.isArray(value.drafts)) return { drafts: [], damaged: true };
    let damaged = false;
    const byIdentity = new Map();
    value.drafts.forEach((item) => {
      const draft = cleanDraft(item);
      if (!draft) { damaged = true; return; }
      const id = identity(draft);
      const other = byIdentity.get(id);
      // One identity, one draft: of two, the one saved last.
      if (other) damaged = true;
      if (!other || draft.updated > other.updated) byIdentity.set(id, draft);
    });
    let drafts = [...byIdentity.values()];
    if (drafts.length > MAX_DRAFTS) {
      damaged = true;
      drafts = drafts.sort((a, b) => b.updated - a.updated).slice(0, MAX_DRAFTS);
    }
    return { drafts, damaged };
  };
  const sound = (text) => typeof text === "string" && !parse(text).damaged;
  const readAll = () => {
    const storage = store();
    if (!storage) return [];
    let raw = null;
    try { raw = storage.getItem(DRAFTS_KEY); } catch { return []; }
    const { drafts, damaged } = parse(raw);
    // Kept aside as it was, once, so that nothing is lost when the list is saved again.
    if (damaged && !locked()) {
      try { if (storage.getItem(ASIDE_KEY) === null) storage.setItem(ASIDE_KEY, raw); } catch { /* no room: the text stays under its own key until the next save */ }
    }
    return drafts;
  };
  const textOf = (drafts) => JSON.stringify({ v: VERSION, drafts });
  const writeAll = (drafts) => {
    const storage = store();
    try {
      if (drafts.length) storage.setItem(DRAFTS_KEY, textOf(drafts)); else storage.removeItem(DRAFTS_KEY);
    } catch {
      return false;
    }
    changed("drafts");
    return true;
  };
  const drafts = () => readAll();
  const find = (context) => {
    const wanted = cleanContext(context);
    if (!wanted) return null;
    const id = identity(wanted);
    return readAll().find((draft) => identity(draft) === id) || null;
  };
  // Saves the values as the draft of this form in this shift; empty values remove it. base is the rev of the draft the
  // caller loaded ("" or nothing when there was none): another rev in the store refuses the save.
  const save = (context, values, { base = "" } = {}) => {
    const wanted = cleanContext(context);
    if (!wanted) return { ok: false, reason: "invalid" };
    if (locked()) return { ok: false, reason: "locked" };
    const all = readAll();
    const id = identity(wanted);
    const at = all.findIndex((draft) => identity(draft) === id);
    const stored = at < 0 ? null : all[at];
    if ((stored ? stored.rev : "") !== str(base)) return { ok: false, reason: "changed", draft: stored };
    const kept = cleanValues(values);
    if (!hasWork(kept)) {
      if (!stored) return { ok: true, draft: null };
      all.splice(at, 1);
      return writeAll(all) ? { ok: true, draft: null } : { ok: false, reason: "unsaved" };
    }
    if (!stored && all.length >= MAX_DRAFTS) return { ok: false, reason: "full" };
    const draft = { ...wanted, values: kept, updated: Date.now(), rev: token() };
    if (stored) all[at] = draft; else all.push(draft);
    return writeAll(all) ? { ok: true, draft } : { ok: false, reason: "unsaved" };
  };
  const drop = (context, options = {}) => save(context, {}, options);
  // Carries the draft of one identity to another, when asked. Refused, with nothing changed, when the target has work:
  // a draft of its own, or a form the caller says has work that is not saved yet (targetHasWork).
  const move = (from, to, { base, targetHasWork = false } = {}) => {
    const source = cleanContext(from);
    const target = cleanContext(to);
    if (!source || !target || identity(source) === identity(target)) return { ok: false, reason: "invalid" };
    if (locked()) return { ok: false, reason: "locked" };
    const all = readAll();
    const at = all.findIndex((draft) => identity(draft) === identity(source));
    if (at < 0) return { ok: false, reason: "missing" };
    if (base !== undefined && all[at].rev !== str(base)) return { ok: false, reason: "changed", draft: all[at] };
    const there = all.find((draft) => identity(draft) === identity(target)) || null;
    if (there || targetHasWork === true) return { ok: false, reason: "target-has-work", source: all[at], target: there };
    const draft = { ...target, values: all[at].values, updated: Date.now(), rev: token() };
    all[at] = draft;
    return writeAll(all) ? { ok: true, draft } : { ok: false, reason: "unsaved" };
  };

  // ---- A saved file or a restore point put back ----
  // What the drafts of a file would do here: added (not here yet), same (here with the same values), conflicts (here
  // with other values: { mine, file }), kept (here and not in the file: they stay). Nothing is written.
  const planRestore = (incomingText) => {
    if (!sound(incomingText)) return { ok: false, reason: "invalid" };
    const mine = readAll();
    const plan = { ok: true, added: [], same: [], conflicts: [], kept: [] };
    const seen = new Set();
    parse(incomingText).drafts.forEach((draft) => {
      const id = identity(draft);
      seen.add(id);
      const here = mine.find((own) => identity(own) === id);
      if (!here) plan.added.push(draft);
      else if (sameValues(here.values, draft.values)) plan.same.push(here);
      else plan.conflicts.push({ mine: here, file: draft });
    });
    plan.kept = mine.filter((own) => !seen.has(identity(own)));
    return plan;
  };
  // The text to write for the drafts once the file is put back: choice is "mine" or "file" for the drafts that differ,
  // and is needed only when some do. A draft taken from the file gets a new rev, so a form that is open on the one it
  // replaces cannot save over it; a draft that stays keeps its rev. Nothing is written here either.
  const settleRestore = (incomingText, choice = "") => {
    const plan = planRestore(incomingText);
    if (!plan.ok) return plan;
    if (plan.conflicts.length && choice !== "mine" && choice !== "file") return { ok: false, reason: "conflict", plan };
    const fresh = (draft) => ({ ...draft, rev: token() });
    const list = [
      ...plan.kept,
      ...plan.same,
      ...plan.conflicts.map((pair) => (choice === "file" ? fresh(pair.file) : pair.mine)),
      ...plan.added.map(fresh),
    ];
    if (list.length > MAX_DRAFTS) return { ok: false, reason: "full", plan };
    return { ok: true, text: textOf(list), plan };
  };

  return {
    ACTIVE_KEY, DRAFTS_KEY, ASIDE_KEY, VERSION, MAX_DRAFTS,
    active, activeOn, setActive, clearActive, keepActiveIfOpen, place,
    drafts, find, save, drop, move, hasWork, sameValues, identity: (context) => { const wanted = cleanContext(context); return wanted ? identity(wanted) : ""; },
    sound, planRestore, settleRestore,
  };
})();
