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
//
// Before and after (step 7). When the action is marked done, the list keeps the day (closed). That day is only a
// proposal for the day the countermeasure was really in place: the visitor confirms it or puts the right one before
// anything is compared, and the day they confirm is kept with this view (for the tab, by the action's id), never on
// the action. The view then sets two periods side by side, with the same filter: before, the stored period up to
// the day before that day; after, the same number of days from the day after it. The day itself is in neither: the
// log is kept by day, and that day is partly before the action and partly after it. While "after" has not had all
// its days, the last of them included, it is pending: the view says from which day it can be compared in full, and
// gives no change in the rate until then, whatever is already recorded for the day that is still running. For each period the view shows its dates, the damage
// and the volume that is recorded for it. A rate is given only where a volume is recorded and the damage is not
// more than it, and the two rates are compared only when both volumes were counted the same way (both the sum of the
// daily volumes: a total typed for a period is another count). No damage with a volume recorded is a zero; no damage
// and no volume is no data, and the view says which. What it shows is what was measured: it never says the action
// caused it, and it changes nothing on the action.
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

  // ---- Before and after ----
  const addDays = (iso, n) => { const day = new Date(`${iso}T00:00:00Z`); day.setUTCDate(day.getUTCDate() + n); return day.toISOString().slice(0, 10); };
  const daysOf = (range) => Math.round((new Date(`${range.to}T00:00:00Z`) - new Date(`${range.from}T00:00:00Z`)) / 86400000) + 1;
  // Which rows count: all of them for a period, the filter's for a filter, the rows of the same stage and cause for a row.
  const scopeOf = (origin) => (origin.kind === "filter" ? (row) => row[origin.filter.field] === origin.filter.value
    : origin.kind === "row" ? (row) => row.stage === origin.row.stage && row.cause === origin.row.cause : () => true);
  // One period: its damage in scope, and the volume recorded for it. typed is the total the visitor typed for a
  // period, { value, from, to }; it counts only for exactly those days.
  const measure = (range, { rows, volumes, typed, scope }) => {
    const inside = rows.filter((row) => row.date && row.date >= range.from && row.date <= range.to);
    const counted = inside.filter(scope);
    const units = counted.reduce((sum, row) => sum + row.units, 0);
    const daily = volumes.filter((item) => item.date >= range.from && item.date <= range.to && item.volume > 0);
    const withVolume = new Set(daily.map((item) => item.date));
    const missing = [...new Set(inside.map((row) => row.date))].filter((date) => !withVolume.has(date)).sort();
    const volume = typed && typed.value > 0 && typed.from === range.from && typed.to === range.to ? { value: typed.value, rule: "typed" }
      : daily.length && !missing.length ? { value: daily.reduce((sum, item) => sum + item.volume, 0), rule: "days" }
        : { value: null, rule: daily.length ? "partial" : "none", missing };
    const rate = volume.value > 0 && units <= volume.value ? units / volume.value : null;
    return { ...range, days: daysOf(range), units, entries: counted.length, rowsInPeriod: inside.length, volume, rate, hasData: inside.length > 0 || volume.value !== null };
  };
  // The two periods of an action done on `implemented` (a day), from its origin. { ok: false, reason } when there is
  // nothing to set side by side: "before-empty" (done on or before the first stored day) or "after-not-started".
  const compare = (origin, implemented, { rows, volumes, typed = null, today }) => {
    const beforeRange = { from: origin.from, to: implemented <= origin.to ? addDays(implemented, -1) : origin.to };
    if (beforeRange.from > beforeRange.to) return { ok: false, reason: "before-empty", implemented };
    const length = daysOf(beforeRange);
    const wanted = addDays(implemented, length);
    const afterRange = { from: addDays(implemented, 1), to: wanted < today ? wanted : today };
    if (afterRange.from > afterRange.to) return { ok: false, reason: "after-not-started", implemented, before: measure(beforeRange, { rows, volumes, typed, scope: scopeOf(origin) }) };
    const input = { rows, volumes, typed, scope: scopeOf(origin) };
    const before = measure(beforeRange, input);
    const after = measure(afterRange, input);
    // Pending until the last day of "after" is over: today itself is a day that is still running.
    const running = today <= wanted;
    const comparable = !running && before.rate !== null && after.rate !== null && before.volume.rule === after.volume.rule;
    return {
      ok: true, implemented, before, after,
      // The stored period was cut short, because the action was done inside it.
      cut: beforeRange.to !== origin.to,
      running,
      // The last day "after" will have, and the first day on which it can be compared whole.
      until: wanted,
      fullFrom: addDays(wanted, 1),
      sameLength: before.days === after.days,
      comparable,
      change: comparable ? after.rate - before.rate : null,
    };
  };

  const mount = (api) => {
    const { state, field, kit, t } = api;
    const { tx, el, int, plural, showDate, spanText, LANG, pct, parseNumber, today } = kit;
    const box = document.querySelector("[data-source-note]");
    const id = idOf(new URLSearchParams(window.location.search).get("source"));
    if (!box || !id) return null;

    const trackerUrl = () => new URL("../action-tracker/", window.location.href).href;
    // The comparison as the page shows it: a table of the two periods, what was measured, and what it does not say.
    // The day the visitor confirmed for an action, kept for this tab only (never on the action, which is shared).
    const DAY_KEY = "sc-source-day";
    const days = () => { try { const saved = JSON.parse(window.sessionStorage.getItem(DAY_KEY)); return isObject(saved) ? saved : {}; } catch { return {}; } };
    const confirmedDay = (actionId) => { const day = days()[actionId]; return isDate(str(day)) && day <= today() ? day : ""; };
    const keepDay = (actionId, day) => { const all = days(); if (day) all[actionId] = day; else delete all[actionId]; try { window.sessionStorage.setItem(DAY_KEY, JSON.stringify(all)); } catch { /* the choice lasts while the page is open */ } };
    let shownDay = "";
    const beforeAfter = (action, origin, rows) => {
      const done = (action.status === "done" || action.status === "verified") && isDate(str(action.closed)) ? action.closed : "";
      const out = [el("p", "kicker dw-compare-head", tx("Before and after"))];
      if (!done) { out.push(el("p", "form-note", tx("The action is not marked done on the list, so there is no day to compare from."))); return out; }
      const host = el("div", "dw-compare-host");
      out.push(host);
      shownDay = confirmedDay(action.id);
      const draw = () => {
        host.replaceChildren(...(shownDay ? compared(action, origin, rows, done, shownDay, draw) : asked(action, done, draw)));
      };
      draw();
      return out;
    };
    // Before anything is compared: the day the countermeasure was really in place, proposed and then confirmed.
    const asked = (action, done, draw) => {
      const form = el("form", "dw-compare-ask");
      form.dataset.sourceDay = "";
      form.noValidate = true;
      const label = el("label", null, tx("The day the countermeasure was really in place"));
      label.htmlFor = "dw-source-day";
      const input = el("input");
      input.type = "date";
      input.id = "dw-source-day";
      input.name = "day";
      input.max = today();
      input.value = done;
      const field = el("div", "field");
      field.append(label, input);
      const button = el("button", "button-primary", tx("Confirm the day and compare"));
      button.type = "submit";
      const status = el("p", "form-note");
      status.setAttribute("role", "status");
      const row = el("div", "tool-actions");
      row.append(button);
      form.append(
        el("p", null, tx("The list has the action marked done on {date}. That may not be the day the countermeasure was in place: confirm the day, or put the right one. Nothing is compared before you do, and the day you give is kept with this view, not on the action.", { date: showDate(done) })),
        field, row, status,
      );
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const day = str(input.value);
        if (!isDate(day) || day > today()) { status.textContent = tx("Give a day, today at the latest."); input.focus(); return; }
        shownDay = day;
        keepDay(action.id, day);
        draw();
        document.querySelector("[data-source-change-day]")?.focus();
      });
      return [form];
    };
    const compared = (action, origin, rows, done, implemented, draw) => {
      const out = [];
      // The total the visitor typed belongs to the days it was typed for, which are their own period, not this view's.
      const stamp = str(state.totalsFor && state.totalsFor.volume).split("|");
      const typedValue = parseNumber(str(state.volume));
      const typed = typedValue > 0 && stamp.length === 2 && isDate(stamp[0]) && isDate(stamp[1]) ? { value: typedValue, from: stamp[0], to: stamp[1] } : null;
      const result = compare(origin, implemented, { rows, volumes: Array.isArray(state.volumes) ? state.volumes : [], typed, today: today() });
      const box = el("div", "dw-compare");
      box.dataset.sourceCompare = result.ok ? "ok" : result.reason;
      box.dataset.sourceImplemented = implemented;
      out.push(box);
      const change = el("button", "button-secondary", tx("Change the day"));
      change.type = "button";
      change.dataset.sourceChangeDay = "";
      change.addEventListener("click", () => { shownDay = ""; keepDay(action.id, ""); draw(); document.getElementById("dw-source-day")?.focus(); });
      const first = el("p", "form-note", `${tx(implemented === done ? "Compared from {date}, the day you confirmed (the day the action was marked done)." : "Compared from {date}, the day you gave (the list has the action marked done on {done}).", { date: showDate(implemented), done: showDate(done) })} ${tx("That day is in neither period: the log is kept by day, and that day is partly before the action and partly after it.")} `);
      first.append(change);
      box.append(first);
      if (!result.ok) {
        box.append(el("p", "dl-warning", result.reason === "before-empty"
          ? tx("That day is on or before the first day of the stored period, so no day of that period is before it. There is nothing to compare.")
          : tx("No day after that day has passed yet. Come back when there are days to compare.")));
        return out;
      }
      const volumeText = (period) => (period.volume.value !== null ? int.format(period.volume.value)
        : period.volume.rule === "partial" ? tx("not for every day") : tx("not recorded"));
      // A rate is shown only when the two can be set side by side: both volumes recorded, and counted the same way.
      const rateText = (period) => (result.comparable ? pct(period.rate, 2) : "–");
      const table = el("table", "dl-table dw-compare-table");
      const head = el("tr");
      [["", ""], [tx("Period"), ""], [t.many.charAt(0).toUpperCase() + t.many.slice(1), "num"], [t.volumeLabel, "num"], [t.rateLabel, "num"]].forEach(([text, className]) => { const th = el("th", className || null, text); th.scope = "col"; head.append(th); });
      const thead = el("thead");
      thead.append(head);
      const body = el("tbody");
      [["before", tx("Before"), result.before], ["after", result.running ? `${tx("After")} · ${tx("pending")}` : tx("After"), result.after]].forEach(([name, label, period]) => {
        const tr = el("tr");
        tr.dataset.sourcePeriod = name;
        const th = el("th", null, label);
        th.scope = "row";
        tr.append(th, el("td", null, `${spanText(period)} · ${plural(period.days, tx("day"), tx("days"))}`), el("td", "num", period.hasData ? int.format(period.units) : "–"), el("td", "num", volumeText(period)), el("td", "num", rateText(period)));
        body.append(tr);
      });
      table.append(thead, body);
      const wrap = el("div", "dl-table-wrap");
      wrap.tabIndex = 0;
      wrap.append(table);
      box.append(wrap);
      // What was measured.
      const measured = el("p", "dw-measured");
      measured.dataset.sourceMeasured = result.comparable ? "rate" : result.running ? "pending" : "none";
      if (result.comparable) {
        const points = Math.abs(result.change) * 100;
        const size = kit.num ? kit.num(points, 2) : points.toFixed(2);
        measured.append(el("strong", null, tx("Measured: {rate} went from {a} to {b}.", { rate: t.rateLabel.toLowerCase(), a: pct(result.before.rate, 2), b: pct(result.after.rate, 2) })), ` ${result.change === 0 ? tx("No change.") : tx(result.change < 0 ? "That is {n} percentage points lower." : "That is {n} percentage points higher.", { n: size })}`);
      } else if (result.running) {
        measured.append(el("strong", null, tx("Pending: “after” is not complete, so no change in the rate is given yet.")));
      } else {
        measured.append(el("strong", null, tx("No measured change in the rate can be given.")));
      }
      box.append(measured);
      const notes = [];
      const noData = (period, label) => { if (!period.hasData) notes.push(tx("{period}: nothing is recorded for these days, neither damage nor volume. That is no data, not zero damage.", { period: label })); else if (!period.units && period.volume.value !== null) notes.push(tx("{period}: no damage with {volume} recorded as handled. That is a measured zero.", { period: label, volume: int.format(period.volume.value) })); else if (!period.units && period.rowsInPeriod) notes.push(tx("{period}: the log has entries in these days, and none of them is in this scope.", { period: label })); };
      noData(result.before, tx("Before"));
      noData(result.after, tx("After"));
      if (result.running) notes.push(tx("“After” runs until {until} and can be compared in full from {from}. So far it has {a} of {b} days, and the last of them is still running.", { until: showDate(result.until), from: showDate(result.fullFrom), a: int.format(result.after.days), b: int.format(result.before.days) }));
      if (!result.comparable && !result.running) {
        const [b, a] = [result.before, result.after];
        if (b.volume.value !== null && a.volume.value !== null && b.volume.rule !== a.volume.rule) notes.push(tx("The two volumes were not counted the same way: one is a total typed for its period, the other the sum of the daily volumes. Rates from them are not compared."));
        else if (b.volume.value === null || a.volume.value === null) notes.push(tx("A rate needs the volume of each period, recorded day by day (Data, volume per day). Without it only the counts are shown, and counts of periods with other volumes do not compare."));
        else if (b.rate === null || a.rate === null) notes.push(tx("A period holds more damage than its recorded volume: check the volume."));
      }
      if (result.cut) notes.push(tx("The action was done inside its stored period, so “before” ends the day before it."));
      if (!result.running && !result.sameLength) notes.push(tx("The two periods are not of the same length."));
      notes.push(tx("This is what was measured, with the same filter in both periods. It does not show that the action caused it: other things may have changed in the same days."));
      notes.forEach((text) => box.append(el("p", "form-note", text)));
      return out;
    };
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
      lines.push(...beforeAfter(found.action, origin, mine));
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
  return { mount, originOf, find, candidates, compare, measure };
})();
