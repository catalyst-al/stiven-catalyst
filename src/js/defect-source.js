// "Open the source" of an action, on Damage Control (window.DefectSource; docs/plan-sot-2026-11-11/PLANI.md, step 5).
// The Action Tracker links here with the id of an action and nothing else (?source=<id>). This page reads the action
// from the list the browser keeps (sc-actions), takes where it came from (origin: js/actions-store.js, originOf) and
// shows it: the period, the filter, or the row.
//
// It is a view, and only reads. The period it shows is lent to the page: the visitor's own period stays what is
// stored, is written unchanged by every save while the view is on, and comes back when the view is left. Nothing is
// written when the view opens or closes. The active shift, the unfinished forms and the pilot's setting are not
// touched: the view asks for none of them, and works the same where the pilot is off.
//
// A row is found the way the plan says. With an id: the row with that id, or, when it is not here, the period with
// the words that the row is not on this device. Without an id: the rows whose date, shift, stage, cause and units are
// the ones the action kept. One row is the source; when the action was made among several rows alike and one is
// left, it is shown as the candidate that is left; several are shown together as candidates, and none is chosen; none
// opens the period and says the row is no longer found. An example the page loaded by itself is never the source.
window.DefectSource = (() => {
  const LANGS = { en: "English", de: "Deutsch", sq: "Shqip" };
  const FIELDS = ["cause", "stage", "shift"];
  const str = (value) => (typeof value === "string" ? value : "");
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
  const idOf = (value) => (/^[A-Za-z0-9_-]{1,60}$/.test(str(value)) ? value : "");

  // Where an action came from, read as the store reads it: whole, or not at all.
  const originOf = (value) => {
    if (!isObject(value) || value.v !== 1 || value.tool !== "damage-control" || !(value.lang in LANGS)) return null;
    const { kind, from, to } = value;
    if (!["period", "filter", "row"].includes(kind) || !isDate(str(from)) || !isDate(str(to)) || from > to) return null;
    const origin = { lang: value.lang, kind, from, to };
    if (kind === "filter") {
      if (!isObject(value.filter) || !FIELDS.includes(value.filter.field) || !str(value.filter.value)) return null;
      origin.filter = { field: value.filter.field, value: value.filter.value };
    }
    if (kind === "row") {
      const row = value.row;
      if (!isObject(row) || !isDate(str(row.date)) || !Number.isInteger(row.units) || row.units < 1) return null;
      origin.row = { id: str(row.id), date: row.date, shift: str(row.shift), stage: str(row.stage), cause: str(row.cause), units: row.units, twins: Number.isInteger(row.twins) && row.twins >= 1 ? row.twins : 1 };
    }
    return origin;
  };
  // The action with this id on the list of this browser: { action, origin } (origin null when it has none that can be
  // read), or null when the list does not have it or cannot be read (locked with a PIN, cleared, another device's).
  const find = (id) => {
    let list = null;
    try { list = JSON.parse(window.localStorage.getItem("sc-actions")); } catch { list = null; }
    const rows = isObject(list) && Array.isArray(list.rows) ? list.rows : [];
    const action = rows.find((item) => isObject(item) && item.id === id && str(item.title));
    return action ? { action, origin: action.source === "damage-control" ? originOf(action.origin) : null } : null;
  };
  // The rows of a log that can be the row an action kept, and what that says.
  const candidates = (rows, row) => {
    if (row.id) {
      const found = rows.filter((item) => item.id === row.id);
      return { rows: found, state: found.length ? "found" : "missing-id" };
    }
    const found = rows.filter((item) => !item.id && item.date === row.date && item.shift === row.shift && item.stage === row.stage && item.cause === row.cause && item.units === row.units);
    return { rows: found, state: !found.length ? "gone" : found.length > 1 ? "several" : row.twins > 1 ? "left" : "found" };
  };

  const mount = (api) => {
    const { state, field, kit, t } = api;
    const { tx, el, int, plural, showDate, spanText, LANG } = kit;
    const box = document.querySelector("[data-source-note]");
    const id = idOf(new URLSearchParams(window.location.search).get("source"));
    if (!box || !id) return null;

    const trackerUrl = () => new URL("../action-tracker/", window.location.href).href;
    const own = () => state.rows.filter((row) => row.example !== true);
    let on = false;
    let rowTest = null;
    const lines = [];
    const say = (text, className = "") => lines.push(el("p", className || null, text));
    const found = find(id);
    const origin = found ? found.origin : null;
    let title = found ? str(found.action.title) : "";

    if (!found) say(tx("This action is not on the action list of this device, so its source cannot be opened here. The list may have been cleared, or the action is on another device."), "dl-warning");
    else if (!origin) say(tx("This action does not say where in the log it came from: it was made before sources were kept, or it did not come from an entry, a filter or a period of this log."), "dl-warning");
    else if (origin.lang !== LANG) {
      const link = el("a", "inline-link", tx("Open it there"));
      const path = window.location.pathname.replace(/^\/(de|sq)(?=\/)/, "");
      link.href = `${origin.lang === "en" ? path : `/${origin.lang}${path}`}?source=${id}`;
      link.hreflang = origin.lang;
      const line = el("p", "dl-warning", `${tx("The source of this action is the log in {language}: each language keeps its own log.", { language: LANGS[origin.lang] })} `);
      line.append(link);
      lines.push(line);
    } else {
      // The source is shown: its period is lent to the page, with its filter or its row.
      on = true;
      api.lend(origin.from, origin.to);
      const period = spanText({ from: origin.from, to: origin.to });
      const mine = own();
      const inPeriod = mine.filter((row) => row.date && row.date >= origin.from && row.date <= origin.to);
      const nowhere = !mine.length;
      const missing = (text) => say(`${tx("The source is not found on this device.")} ${text}`, "dl-warning");
      if (origin.kind === "period") {
        say(tx("Source: the period {period}, without a filter.", { period }));
        if (nowhere) missing(tx("The log is empty here: it was cleared, or the action came from another device."));
        else if (!inPeriod.length) missing(tx("The log has no entries for these days here."));
      } else if (origin.kind === "filter") {
        const label = field[origin.filter.field].label;
        say(tx("Source: the period {period}, with {field} = {value}.", { period, field: label, value: origin.filter.value }));
        api.pick({ field: origin.filter.field, value: origin.filter.value });
        const matching = inPeriod.filter((row) => row[origin.filter.field] === origin.filter.value);
        if (nowhere) missing(tx("The log is empty here: it was cleared, or the action came from another device."));
        else if (!inPeriod.length) missing(tx("The log has no entries for these days here."));
        else if (!matching.length) missing(tx("The period is here, but no entry in it has {field} = {value}.", { field: label, value: origin.filter.value }));
      } else {
        const row = origin.row;
        say(tx("Source: one entry, {entry}.", { entry: [showDate(row.date), row.shift, row.stage, row.cause, plural(row.units, t.one, t.many)].filter(Boolean).join(" · ") }));
        const result = candidates(mine, row);
        if (result.rows.length) rowTest = (item) => result.rows.includes(item);
        if (result.state === "found") say(tx("The entry is in the log below."));
        else if (result.state === "left") say(tx("When the action was made the log had {n} entries exactly like this one; one is left. It is shown as the candidate that is left: it may or may not be the very one.", { n: int.format(row.twins) }), "dl-warning");
        else if (result.state === "several") say(tx("{n} entries of the log are exactly like this one. All of them are shown as candidates; none is chosen as the source.", { n: int.format(result.rows.length) }), "dl-warning");
        else if (result.state === "missing-id") missing(tx("The entry is not on this device: the period it belongs to is shown instead."));
        else if (nowhere) missing(tx("The log is empty here: it was cleared, or the action came from another device."));
        else say(tx("The entry is no longer found in the log: it was changed or removed. The period it belonged to is shown instead."), "dl-warning");
      }
      if (state.rows.length && nowhere) say(tx("What the page shows below is its example, not your log."), "form-note");
      say(tx("This is a view only: your own period, the active shift and unfinished forms are as they were."), "form-note");
    }

    // Leaving the view: the visitor's own period is back, the address is clean. keep is true when the visitor chose a
    // period of their own while the view was on: that choice stands.
    const leave = (keep = false) => {
      if (on) {
        on = false;
        rowTest = null;
        if (keep) api.keep(); else { api.unlend(); api.pick(null); }
      }
      box.hidden = true;
      box.parentElement.hidden = true;
      const rest = new URLSearchParams(window.location.search);
      rest.delete("source");
      window.history.replaceState(null, "", window.location.pathname + (rest.size ? `?${rest}` : "") + window.location.hash);
      if (!keep) api.render();
    };
    const head = el("p", "kicker", tx("Opened from an action"));
    const actions = el("div", "tool-actions");
    const back = el("a", "button-secondary", tx("Back to the action list"));
    back.href = trackerUrl();
    const close = el("button", "button-secondary", on ? tx("Leave the source, show my own period") : tx("Close this note"));
    close.type = "button";
    close.dataset.sourceLeave = "";
    close.addEventListener("click", () => leave(false));
    actions.append(back, close);
    box.replaceChildren(head, ...(title ? [el("p", "dw-source-title", title)] : []), ...lines, actions);
    box.hidden = false;
    box.parentElement.hidden = false;
    // A period the visitor chooses while the view is on is their own choice: the view ends before it is applied.
    const range = document.querySelector("[data-range]");
    if (range) for (const type of ["click", "change"]) range.addEventListener(type, (event) => { if (on && event.target.closest("[data-preset], input")) leave(true); }, true);

    return {
      get on() { return on; },
      // The rows of a row source, for the log's table: only the candidates, under a chip that leaves the view.
      rowFilter: () => (on && rowTest ? { label: tx("the source of the action"), test: rowTest, clear: () => leave(false) } : null),
    };
  };
  return { mount, originOf, find, candidates };
})();
