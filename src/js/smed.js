// SMED Changeover: one changeover studied by Shigeo Shingo's method (Single-Minute Exchange of Die). The elements are
// timed with a stopwatch (the lap approach of time-study.js), split into internal work (only with the machine stopped)
// and external work (possible while it runs), converted, streamlined and written as the changeover standard.
// The arithmetic lives in window.SmedMath so the tests can call it.
(() => {
  const kit = window.ToolKit || {};
  const parseNumber = kit.parseNumber || ((value) => Number(String(value ?? "").replace(",", ".")));
  const parseRows = kit.parseRows || ((text) => String(text ?? "").split(/\r?\n/).filter(Boolean).map((line) => line.split(/\t|;/)));
  const CATS = ["prep", "mount", "measure", "trial"];
  const TYPES = ["internal", "external"];
  const AFTER = ["internal", "external", "removed"];
  const PHASES = ["before", "after"];
  const finite = (value) => typeof value === "number" && Number.isFinite(value);
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const str = (value) => (typeof value === "string" ? value : "");
  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const newId = () => `e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const norm = (value) => str(value).trim().toLowerCase();

  // Arithmetic -------------------------------------------------------------------------------------------------------
  // Durations as typed at the machine: 4:30 (minutes and seconds), 1:02:30, 4,5 or 4.5 (minutes), 90 s, 2 min.
  // A plain number is minutes: the elements of a changeover are minutes long.
  const parseDuration = (value) => {
    const raw = String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
    if (!raw) return NaN;
    let m = raw.match(/^(\d+):([0-5]?\d)(?::([0-5]?\d))?$/);
    if (m) return m[3] !== undefined ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : Number(m[1]) * 60 + Number(m[2]);
    m = raw.match(/^([\d.,]+) ?(?:s|sec|sek|seconds?|sekunden|sekonda)\.?$/);
    if (m) { const n = parseNumber(m[1]); return n >= 0 ? Math.round(n) : NaN; }
    m = raw.match(/^([\d.,]+) ?(?:m|min|minutes?|minuten|minuta)?\.?$/);
    if (m) { const n = parseNumber(m[1]); return n >= 0 ? Math.round(n * 60) : NaN; }
    return NaN;
  };
  // Seconds as a clock: 4:05, or 1:02:30 from an hour.
  const clock = (seconds) => {
    if (!finite(seconds)) return "–";
    const s = Math.round(Math.abs(seconds));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    const out = h ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}` : `${m}:${String(r).padStart(2, "0")}`;
    return seconds < 0 && s > 0 ? `−${out}` : out;
  };
  // Laps of the stopwatch: the marks are the milliseconds since the start (the last good piece) at each lap. The marks
  // are rounded first and then subtracted, so the elements add up to the whole changeover to the second.
  const lapDurations = (marks) => {
    const ends = marks.filter(finite).map((ms) => Math.round(ms / 1000));
    return ends.map((end, i) => {
      const start = i ? ends[i - 1] : 0;
      return { start, dur: Math.max(1, end - start) };
    });
  };
  // Where the next lapped element starts: after the last element when the list has its clock times, else unknown.
  const nextStart = (elements) => {
    if (!elements.length) return 0;
    const last = elements.at(-1);
    return finite(last.start) ? last.start + last.dur : null;
  };

  // What an element is in each step. Step 2 leaves it unmarked until decided: done with the machine stopped today
  // counts as internal, done while it runs as external. Steps 3 and 4 keep the step-2 answer until changed.
  const kindOf = (e) => (TYPES.includes(e.kind) ? e.kind : e.now === "running" ? "external" : "internal");
  const afterOf = (e) => (AFTER.includes(e.after) ? e.after : kindOf(e));
  const afterDurOf = (e) => (afterOf(e) === "removed" ? 0 : finite(e.afterDur) && e.afterDur >= 0 ? e.afterDur : e.dur);
  // Internal work after the change, by person. People work in parallel, each one's elements in sequence, so the machine
  // stands as long as the longest of them. An element without a person goes to the first person named.
  const lanes = (elements) => {
    const inside = elements.filter((e) => afterOf(e) === "internal");
    const named = inside.find((e) => norm(e.who));
    const map = new Map();
    inside.forEach((e) => {
      const key = norm(e.who) || (named ? norm(named.who) : "");
      const lane = map.get(key) || { who: key ? (norm(e.who) ? e.who.trim() : named.who.trim()) : "", seconds: 0, count: 0 };
      lane.seconds += afterDurOf(e);
      lane.count += 1;
      map.set(key, lane);
    });
    return [...map.values()];
  };
  // Pareto of the machine-stopped time by category: "before" is the observed stop, "after" the planned internal work.
  const pareto = (elements, which = "before") => {
    const totals = Object.fromEntries(CATS.map((cat) => [cat, 0]));
    elements.forEach((e) => {
      const cat = CATS.includes(e.cat) ? e.cat : "prep";
      if (which === "after") { if (afterOf(e) === "internal") totals[cat] += afterDurOf(e); } else if (e.now !== "running") totals[cat] += e.dur;
    });
    const sum = CATS.reduce((s, cat) => s + totals[cat], 0);
    let cum = 0;
    return CATS.map((cat, order) => ({ cat, seconds: totals[cat], order })).filter((item) => item.seconds > 0)
      .sort((a, b) => b.seconds - a.seconds || a.order - b.order)
      .map(({ cat, seconds }) => { cum += seconds; return { cat, seconds, share: sum ? seconds / sum : 0, cum: sum ? cum / sum : 0 }; });
  };
  // Machine minutes freed by the saving: per changeover × changeovers a week × working weeks; the money at the cost of a
  // machine-minute. Missing inputs leave their figures out (null) rather than guessing them.
  const freed = (savingSeconds, perWeek, costPerMinute, weeks) => {
    if (!finite(savingSeconds) || !(perWeek > 0)) return null;
    const minutesWeek = (savingSeconds / 60) * perWeek;
    const w = weeks > 0 ? weeks : null;
    const cost = finite(costPerMinute) && costPerMinute > 0 ? costPerMinute : null;
    return {
      minutesWeek, minutesYear: w ? minutesWeek * w : null,
      euroWeek: cost !== null ? minutesWeek * cost : null, euroYear: cost !== null && w ? minutesWeek * cost * w : null,
    };
  };
  // The effect on batch size. With the same minutes a week spent changing over, the line changes before ÷ after times
  // as often, so a batch can be after ÷ before of today's. By the economic order quantity, EOQ = √(2·D·S / H), with
  // the cost of a changeover S following its minutes, the economic batch falls to √(after ÷ before) of today's.
  const batch = (beforeSeconds, afterSeconds, perWeek) => {
    if (!(beforeSeconds > 0) || !(afterSeconds >= 0) || !(afterSeconds < beforeSeconds)) return null;
    const ratio = afterSeconds / beforeSeconds;
    return { ratio, eoq: Math.sqrt(ratio), changeovers: perWeek > 0 && ratio > 0 ? perWeek / ratio : null };
  };

  // The whole study. elements: [{ cat, start, dur, now, kind, after, afterDur, who }]; every number the page shows
  // comes from here. Times in seconds.
  const analyse = (elements, { perWeek, costPerMinute, weeks, target } = {}) => {
    const sum = (list, f) => list.reduce((s, e) => s + f(e), 0);
    const stopped = elements.filter((e) => e.now !== "running");
    const work = sum(stopped, (e) => e.dur);
    // With clock times for every stopped element, the stop is the span from the first start to the last end: gaps
    // between elements (waiting nobody recorded) count, and two people working at once count once.
    const span = stopped.length && stopped.every((e) => finite(e.start))
      ? Math.max(...stopped.map((e) => e.start + e.dur)) - Math.min(...stopped.map((e) => e.start)) : null;
    const before = { downtime: span ?? work, work, external: sum(elements.filter((e) => e.now === "running"), (e) => e.dur), span, gap: span === null ? 0 : span - work, count: elements.length };
    const separated = {
      internal: sum(elements.filter((e) => kindOf(e) === "internal"), (e) => e.dur),
      external: sum(elements.filter((e) => kindOf(e) === "external"), (e) => e.dur),
    };
    const people = lanes(elements);
    const after = {
      downtime: people.length ? Math.max(...people.map((lane) => lane.seconds)) : 0,
      labour: sum(elements.filter((e) => afterOf(e) === "internal"), afterDurOf),
      external: sum(elements.filter((e) => afterOf(e) === "external"), afterDurOf),
      removed: elements.filter((e) => afterOf(e) === "removed").length,
      converted: elements.filter((e) => kindOf(e) === "internal" && afterOf(e) === "external").length,
      lanes: people,
    };
    const saving = before.downtime - after.downtime;
    const t = finite(target) && target > 0 ? target : null;
    return {
      before, separated, after, saving, savingShare: before.downtime > 0 ? saving / before.downtime : 0,
      separationSaving: before.downtime - separated.internal,
      paretoBefore: pareto(elements, "before"), paretoAfter: pareto(elements, "after"),
      freed: freed(saving, perWeek, costPerMinute, weeks), batch: batch(before.downtime, after.downtime, perWeek),
      target: t, targetMet: t !== null ? after.downtime <= t : null, singleMinute: after.downtime > 0 && after.downtime < 600,
      untimed: elements.filter((e) => !(e.dur > 0)).length,
    };
  };

  // The changeover standard: the external work before the stop, the internal work by person, the external work after
  // the restart, each in the order of the study. An external element without a phase of its own goes after the restart
  // when it was external already and comes after the last internal element (putting away); everything else, and every
  // element converted in step 3 (pre-heating, pre-staging), is done before the stop.
  const phaseOf = (elements, i) => {
    const e = elements[i];
    if (PHASES.includes(e.phase)) return e.phase;
    let last = -1;
    elements.forEach((item, j) => { if (afterOf(item) === "internal") last = j; });
    return last >= 0 && i > last && kindOf(e) === "external" ? "after" : "before";
  };
  const standard = (elements) => {
    const out = { before: [], stopped: [], after: [] };
    elements.forEach((e, i) => {
      const type = afterOf(e);
      if (type === "removed") return;
      const item = { ...e, index: i, seconds: afterDurOf(e) };
      if (type === "internal") out.stopped.push(item);
      else out[phaseOf(elements, i)].push(item);
    });
    return out;
  };

  // Saved or pasted elements are rebuilt field by field, so nothing damaged can break the page.
  const cleanElement = (raw) => {
    const e = isObject(raw) ? raw : {};
    return {
      id: str(e.id).slice(0, 40) || newId(),
      name: str(e.name).slice(0, 160),
      cat: CATS.includes(e.cat) ? e.cat : "prep",
      start: finite(e.start) && e.start >= 0 ? Math.round(e.start) : null,
      dur: finite(e.dur) && e.dur > 0 ? Math.round(e.dur) : 0,
      now: e.now === "running" ? "running" : "stopped",
      kind: TYPES.includes(e.kind) ? e.kind : "",
      after: AFTER.includes(e.after) ? e.after : "",
      afterDur: finite(e.afterDur) && e.afterDur >= 0 ? Math.round(e.afterDur) : null,
      who: str(e.who).slice(0, 80),
      convert: str(e.convert).slice(0, 40),
      streamline: str(e.streamline).slice(0, 40),
      note: str(e.note).slice(0, 300),
      owner: str(e.owner).slice(0, 120),
      due: isDate(str(e.due)) ? e.due : "",
      check: str(e.check).slice(0, 300),
      phase: PHASES.includes(e.phase) ? e.phase : "",
    };
  };
  // Rows typed or pasted from a spreadsheet: element, category, duration, and optionally internal or external. The
  // category may be its number (1 to 4), its key or the start of its name; the duration as parseDuration reads it.
  const parseElements = (text, categories = []) => {
    const added = [];
    let skipped = 0;
    const catOf = (value) => {
      const raw = norm(value);
      if (/^[1-4]$/.test(raw)) return CATS[Number(raw) - 1];
      const hit = categories.find((c) => c.key === raw || norm(c.name) === raw || norm(c.short) === raw)
        || (raw.length >= 3 ? categories.find((c) => norm(c.name).startsWith(raw) || norm(c.short).startsWith(raw)) : null);
      return hit ? hit.key : "";
    };
    const typeOf = (value) => {
      const raw = norm(value);
      if (!raw) return "";
      if (/^(i|int|internal|intern|interne?|i brendshëm|brendshëm)/.test(raw)) return "internal";
      if (/^(e|ext|external|extern|externe?|i jashtëm|jashtëm)/.test(raw)) return "external";
      return "";
    };
    parseRows(text).forEach((cells, index) => {
      const [name, cat, duration, type] = cells.map((cell) => String(cell ?? "").trim());
      const seconds = parseDuration(duration);
      const key = catOf(cat);
      // A header row is passed over without counting it as skipped.
      if (!name || !key || !(seconds > 0)) { if (index > 0) skipped += 1; return; }
      added.push(cleanElement({ name, cat: key, dur: seconds, kind: typeOf(type) }));
    });
    return { added, skipped };
  };
  // The example of the data file as a state: the dates and due dates are days relative to today, the clock times of the
  // elements follow one another as if lapped.
  const fromExample = (example, day, addDays) => {
    const at = (value) => (Number.isInteger(value) && addDays ? addDays(day, value) : isDate(str(value)) ? value : "");
    let clockAt = 0;
    const elements = (example.elements || []).map((raw) => {
      const e = cleanElement({ ...raw, start: clockAt, due: at(raw.due), now: "stopped" });
      clockAt += e.dur;
      return e;
    });
    const study = {};
    ["machine", "from", "to", "observer", "team", "target", "perWeek", "costMin", "weeks"].forEach((name) => { study[name] = String(example[name] ?? ""); });
    study.date = at(example.date);
    return { study, elements };
  };

  window.SmedMath = { CATS, TYPES, AFTER, parseDuration, clock, lapDurations, nextStart, kindOf, afterOf, afterDurOf, lanes, pareto, freed, batch, analyse, phaseOf, standard, cleanElement, parseElements, fromExample };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-smed]");
  const dataEl = document.getElementById("smed-data");
  if (!root || !dataEl || !window.ToolKit) return;
  const { tx, num, pct, int, euro, el, lower, write, loadState, firstVisit, today, addDays, showDate, panel, stat, focusCard, resultActions, resultLayout, renderOnPause, flash, undoNote, downloadCsv, downloadXlsx, copy } = window.ToolKit;
  const CK = window.ChartKit;
  const AS = window.ActionsStore;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;
  const MAX_ELEMENTS = 60;
  const STUDY = ["machine", "from", "to", "date", "observer", "team", "target", "perWeek", "costMin", "weeks"];
  const catOf = (key) => data.categories.find((c) => c.key === key) || data.categories[0];
  const measureOf = (key) => data.measures.find((m) => m.key === key);
  const catColor = CK ? { prep: CK.C.blue, mount: CK.C.soft, measure: "#a78bfa", trial: CK.C.muted } : {};
  const typeText = { internal: tx("Internal"), external: tx("External"), removed: tx("Eliminated") };
  const whenText = { stopped: tx("Machine stopped"), running: tx("Machine running") };
  const minutes = (seconds) => `${num(seconds / 60, Number.isInteger(Math.round(seconds) / 60) ? 0 : 1)} min`;

  const results = document.querySelector("[data-results]");
  const printBox = document.querySelector("[data-print]");
  const studyInputs = [...root.querySelectorAll("[data-study]")];
  const stepButtons = [...root.querySelectorAll("[data-step]")];
  const stepIntro = root.querySelector("[data-step-intro]");
  const onlyStep = [...root.querySelectorAll("[data-only-step]")];
  const list = root.querySelector("[data-elements]");
  const empty = root.querySelector("[data-empty]");
  const totalsLine = root.querySelector("[data-totals]");
  const status = root.querySelector("[data-status]");
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const standardBox = root.querySelector("[data-standard]");
  const watch = {
    name: root.querySelector("[data-watch-name]"), cat: root.querySelector("[data-watch-cat]"), clock: root.querySelector("[data-clock]"),
    current: root.querySelector("[data-current]"), start: root.querySelector("[data-start]"), lap: root.querySelector("[data-lap]"),
    stop: root.querySelector("[data-stop]"), undo: root.querySelector("[data-undo-lap]"), status: root.querySelector("[data-watch-status]"),
  };
  const entry = root.querySelector("[data-entry]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const paste = root.querySelector("[data-paste]");
  const importStatus = root.querySelector("[data-import-status]");

  // State: the study's header, the elements in the order they happen, the step the visitor is on.
  const blankStudy = () => Object.fromEntries(STUDY.map((name) => [name, name === "weeks" ? String(data.defaults?.weeks ?? "") : name === "date" ? today() : ""]));
  const defaults = { study: blankStudy(), elements: [], step: 1, example: false };
  const state = loadState(KEY, defaults);
  state.study = Object.fromEntries(STUDY.map((name) => [name, typeof state.study[name] === "string" ? state.study[name].slice(0, 160) : blankStudy()[name]]));
  const cleanMeasures = (e) => {
    if (!data.measures.some((m) => m.key === e.convert && m.step === 3)) e.convert = "";
    if (!data.measures.some((m) => m.key === e.streamline && m.step === 4)) e.streamline = "";
    return e;
  };
  state.elements = state.elements.slice(0, MAX_ELEMENTS).map((e) => cleanMeasures(cleanElement(e)));
  state.step = Number.isInteger(state.step) && state.step >= 1 && state.step <= 5 ? state.step : 1;
  const loadExample = () => {
    const ex = fromExample(data.example, today(), addDays);
    Object.assign(state, { study: ex.study, elements: ex.elements.map(cleanMeasures), step: 1, example: true });
  };
  // A first visit opens on the example, so the result is visible at once; the note above it says so.
  if (!state.elements.length && firstVisit(KEY)) loadExample();
  const save = () => write(KEY, state);
  // The visitor's own first change ends the example: the data stays, the note goes.
  const own = () => { state.example = false; };
  const n = (name) => parseNumber(state.study[name]);
  const options = () => ({ perWeek: n("perWeek"), costPerMinute: n("costMin"), weeks: n("weeks"), target: n("target") * 60 });
  const label = (i) => state.elements[i]?.name.trim() || tx("Element {n}", { n: i + 1 });

  // Example note above the results, with one tap to clear the example.
  const note = el("div", "dl-example-note");
  note.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  clearExample.addEventListener("click", () => {
    stopWatch();
    Object.assign(state, { study: blankStudy(), elements: [], step: 1, example: false });
    save();
    renderAll();
  });
  note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(note);

  // The study's header ---------------------------------------------------------------------------------------------------
  const showStudy = () => studyInputs.forEach((input) => { input.value = state.study[input.name] ?? ""; });
  studyInputs.forEach((input) => input.addEventListener("input", () => {
    state.study[input.name] = input.value;
    own();
    save();
    renderTotals();
    renderSoon();
  }));

  // The five steps ---------------------------------------------------------------------------------------------------------
  // How far each step is: decided elements of all that need a decision there.
  const progress = () => {
    const els = state.elements;
    const inside = els.filter((e) => kindOf(e) === "internal");
    const kept = els.filter((e) => afterOf(e) !== "removed");
    const stopped = kept.filter((e) => afterOf(e) === "internal");
    return [
      { done: els.length, of: els.length },
      { done: els.filter((e) => e.kind).length, of: els.length },
      { done: inside.filter((e) => e.after).length, of: inside.length },
      { done: kept.filter((e) => finite(e.afterDur)).length, of: kept.length },
      { done: stopped.filter((e) => e.check.trim()).length, of: stopped.length },
    ];
  };
  const renderSteps = () => {
    const p = progress();
    stepButtons.forEach((button) => {
      const step = Number(button.dataset.step);
      const current = step === state.step;
      if (current) button.setAttribute("aria-current", "step"); else button.removeAttribute("aria-current");
      const mark = button.querySelector("[data-step-state]");
      const { done, of } = p[step - 1];
      mark.textContent = !state.elements.length ? "" : of && done >= of ? `✓ ${tx("done")}` : of ? tx("{a} of {b}", { a: done, b: of }) : "–";
      button.classList.toggle("is-done", Boolean(state.elements.length && of && done >= of));
    });
    const step = data.steps[state.step - 1];
    stepIntro.replaceChildren(el("h2", "sm-step-title", `${state.step} · ${step.title}`), el("p", null, step.what), el("p", "form-note sm-step-tip", step.tip));
    onlyStep.forEach((node) => { node.hidden = Number(node.dataset.onlyStep) !== state.step; });
    prev.hidden = state.step === 1;
    next.hidden = state.step === 5;
  };
  const goStep = (step) => {
    state.step = Math.min(5, Math.max(1, step));
    save();
    renderSteps();
    renderElements();
    renderTotals();
  };
  stepButtons.forEach((button) => button.addEventListener("click", () => goStep(Number(button.dataset.step))));
  prev.addEventListener("click", () => { goStep(state.step - 1); stepIntro.scrollIntoView?.({ behavior: "smooth", block: "nearest" }); });
  next.addEventListener("click", () => { goStep(state.step + 1); stepIntro.scrollIntoView?.({ behavior: "smooth", block: "nearest" }); });

  // The elements, with the fields of the step ------------------------------------------------------------------------------
  const control = (tag, i, f, value, attrs = {}) => {
    const node = el(tag, "sm-in");
    node.id = `sm-${f}-${i}`;
    node.dataset.f = f;
    node.dataset.i = String(i);
    node.dataset.focusKey = `${f}:${i}`;
    Object.entries(attrs).forEach(([key, v]) => { node[key] = v; });
    if (tag !== "select") node.value = value ?? "";
    return node;
  };
  const select = (i, f, value, items) => {
    const node = control("select", i, f, value);
    items.forEach(([key, text]) => {
      const option = el("option", null, text);
      option.value = key;
      option.selected = key === value;
      node.append(option);
    });
    return node;
  };
  const field = (text, node, cls = "") => {
    const box = el("div", `field sm-field${cls ? ` ${cls}` : ""}`);
    const lab = el("label", null, text);
    lab.htmlFor = node.id;
    box.append(lab, node);
    return box;
  };
  const tool = (text, attrs, symbol) => {
    const button = el("button", "dl-remove sm-tool", symbol);
    button.type = "button";
    button.setAttribute("aria-label", text);
    button.title = text;
    Object.assign(button.dataset, attrs);
    return button;
  };
  const catItems = () => data.categories.map((c) => [c.key, c.name]);
  const measureItems = (step) => [["", tx("No countermeasure")], ...data.measures.filter((m) => m.step === step).map((m) => [m.key, m.name])];
  const tag = (text, cls = "") => el("span", `dl-tag sm-tag${cls ? ` ${cls}` : ""}`, text);
  // The head of a card: number, name, category, the time before and, from step 3 on, the plan.
  const head = (e, i) => {
    const box = el("div", "sm-el-head");
    box.append(el("span", "sm-no", String(i + 1)), el("strong", "sm-el-name", label(i)));
    const meta = el("span", "sm-el-meta");
    meta.append(tag(catOf(e.cat).short), " ", `${clock(e.dur)} · ${whenText[e.now]}`);
    if (state.step >= 2) meta.append(" · ", tag(typeText[kindOf(e)], `sm-${kindOf(e)}`));
    if (state.step >= 3) {
      const type = afterOf(e);
      meta.append(" → ", tag(typeText[type], `sm-${type}`));
      if (type !== "removed") meta.append(` ${clock(afterDurOf(e))}`);
    }
    box.append(meta);
    return box;
  };
  const actionOf = (e, i) => {
    const type = afterOf(e);
    const name = label(i);
    const what = e.note.trim() || [measureOf(e.convert)?.name, measureOf(e.streamline)?.name].filter(Boolean).join(" + ") || (type === "removed" ? tx("Eliminate the element") : tx("Find a countermeasure"));
    const t = clock(afterDurOf(e));
    const saving = (e.now !== "running" ? e.dur : 0) - (type === "internal" ? afterDurOf(e) : 0);
    return {
      title: `${what} (${name})`.slice(0, 300),
      detail: tx("SMED {machine}, {from} → {to}: {element}, {before} {beforeType} → {after} {afterType}.", {
        machine: state.study.machine.trim() || data.text.changeover, from: state.study.from.trim() || "–", to: state.study.to.trim() || "–",
        element: name, before: clock(e.dur), beforeType: typeText[kindOf(e)].toLowerCase(), after: type === "removed" ? "" : t, afterType: typeText[type].toLowerCase(),
      }).replace(/\s+\./, ".").replace(/ {2,}/g, " "),
      owner: e.owner.trim(), due: e.due, source: "smed", area: state.study.machine.trim(),
      check: type === "removed" ? tx("At the next changeover, {element} is no longer needed.", { element: name })
        : type === "external" ? tx("At the next changeover, {element} is done while the machine runs, in {t} or less.", { element: name, t })
        : tx("At the next changeover, {element} takes {t} or less with the machine stopped.", { element: name, t }),
      priority: saving >= 120 ? "High" : "Medium",
    };
  };
  const hasMeasure = (e) => Boolean(e.note.trim() || e.convert || e.streamline || afterOf(e) === "removed");
  const card = (e, i) => {
    const box = el("article", "sm-el");
    box.dataset.card = String(i);
    const grid = el("div", "sm-el-grid");
    const step = state.step;
    if (step === 1) {
      const top = el("div", "sm-el-head");
      top.append(el("span", "sm-no", String(i + 1)));
      const tools = el("span", "sm-tools");
      if (i > 0) tools.append(tool(tx("Move element {n} up", { n: i + 1 }), { move: i, by: -1 }, "↑"));
      if (i < state.elements.length - 1) tools.append(tool(tx("Move element {n} down", { n: i + 1 }), { move: i, by: 1 }, "↓"));
      tools.append(tool(tx("Remove element {n}", { n: i + 1 }), { remove: i }, "×"));
      top.append(tools);
      box.append(top);
      grid.append(
        field(tx("Element"), control("input", i, "name", e.name, { placeholder: data.text.elementPlaceholder, autocomplete: "off" }), "sm-wide"),
        field(tx("Category"), select(i, "cat", e.cat, catItems())),
        field(tx("Duration (m:ss)"), control("input", i, "dur", e.dur ? clock(e.dur) : "", { inputMode: "numeric", autocomplete: "off", placeholder: "4:30" })),
        field(tx("Starts at (m:ss)"), control("input", i, "start", finite(e.start) ? clock(e.start) : "", { inputMode: "numeric", autocomplete: "off", placeholder: tx("optional") })),
        field(tx("Done today"), select(i, "now", e.now, [["stopped", whenText.stopped], ["running", whenText.running]])),
      );
    } else if (step === 2) {
      box.append(head(e, i));
      const group = el("fieldset", "sm-choice");
      group.append(el("legend", "visually-hidden", tx("Internal or external: {element}", { element: label(i) })));
      [["internal", tx("Internal: only with the machine stopped")], ["external", tx("External: possible while the machine runs")]].forEach(([value, text]) => {
        const lab = el("label", "sm-radio");
        const input = el("input");
        input.type = "radio";
        input.name = `sm-kind-${i}`;
        input.value = value;
        input.checked = e.kind === value;
        input.dataset.f = "kind";
        input.dataset.i = String(i);
        input.dataset.focusKey = `kind:${i}:${value}`;
        lab.append(input, " ", text);
        group.append(lab);
      });
      if (!e.kind) group.append(el("span", "form-note sm-undecided", e.now === "running" ? tx("Not decided yet: counted as external, because it is done while the machine runs today.") : tx("Not decided yet: counted as internal, because it is done with the machine stopped today.")));
      grid.append(group);
    } else if (step === 3) {
      box.append(head(e, i));
      const items = [["internal", tx("Stays internal")], ["external", tx("Convert to external")], ["removed", tx("Eliminate the element")]];
      if (kindOf(e) === "external") items.splice(0, 2, ["external", tx("External: do it while the machine runs")], ["internal", tx("Keep it internal")]);
      grid.append(
        field(tx("After the change"), select(i, "after", afterOf(e), items)),
        field(tx("How (convert)"), select(i, "convert", e.convert, measureItems(3)), "sm-wide2"),
      );
    } else if (step === 4) {
      box.append(head(e, i));
      if (afterOf(e) === "removed") {
        grid.append(el("p", "form-note sm-wide", tx("Eliminated: it takes no time after the change. Say how in the countermeasure.")));
      } else {
        grid.append(field(tx("Time after (m:ss)"), control("input", i, "afterDur", finite(e.afterDur) ? clock(e.afterDur) : "", { inputMode: "numeric", autocomplete: "off", placeholder: clock(e.dur) })));
        grid.append(field(tx("How (streamline)"), select(i, "streamline", e.streamline, measureItems(4)), "sm-wide2"));
        grid.append(field(tx("Who"), control("input", i, "who", e.who, { placeholder: data.text.whoPlaceholder, autocomplete: "off" })));
      }
      grid.append(
        field(tx("Countermeasure"), control("input", i, "note", e.note, { placeholder: data.text.notePlaceholder, autocomplete: "off" }), "sm-wide2"),
        field(tx("Owner"), control("input", i, "owner", e.owner, { placeholder: data.text.ownerPlaceholder, autocomplete: "off" })),
        field(tx("Due date"), control("input", i, "due", e.due, { type: "date" })),
      );
      if (AS) {
        const link = AS.linkButton(tx("Add to actions"), () => actionOf(state.elements[i], i), "button-ghost sm-act");
        grid.append(link);
      }
    } else {
      box.append(head(e, i));
      const type = afterOf(e);
      if (type === "external") grid.append(field(tx("When"), select(i, "phase", phaseOf(state.elements, i), [["before", tx("Before the stop")], ["after", tx("After the restart")]])));
      if (type !== "removed") grid.append(field(tx("Check"), control("input", i, "check", e.check, { placeholder: data.text.checkPlaceholder, autocomplete: "off" }), "sm-wide2"));
      else grid.append(el("p", "form-note sm-wide", tx("Eliminated: not on the standard.")));
    }
    box.append(grid);
    return box;
  };
  const renderElements = () => {
    list.replaceChildren(...state.elements.map(card));
    empty.hidden = state.elements.length > 0;
    if (standardBox) {
      standardBox.hidden = state.step !== 5 || !state.elements.length;
      if (!standardBox.hidden) standardBox.replaceChildren(...standardSheet(false));
    }
  };
  const renderTotals = () => {
    if (!state.elements.length) { totalsLine.textContent = ""; return; }
    const r = analyse(state.elements, options());
    const parts = [tx("{n} elements", { n: int.format(state.elements.length) }), `${tx("Before")}: ${clock(r.before.downtime)} ${tx("machine stopped")}`];
    if (state.step >= 2) parts.push(`${tx("Separated")}: ${clock(r.separated.internal)}`);
    if (state.step >= 3) parts.push(`${tx("After")}: ${clock(r.after.downtime)} (${tx("{p} less", { p: pct(r.savingShare, 0) })})`);
    totalsLine.textContent = parts.join(" · ");
  };

  // Changes: a typed text updates the state without redrawing, so the cursor stays; a choice redraws the cards.
  const setField = (i, f, value) => {
    const e = state.elements[i];
    if (!e) return false;
    if (f === "dur" || f === "start" || f === "afterDur") {
      const seconds = parseDuration(value);
      if (f === "dur") e.dur = seconds > 0 ? seconds : 0;
      else e[f] = String(value).trim() === "" || !(seconds >= 0) ? null : seconds;
      return false;
    }
    if (f === "kind") { e.kind = TYPES.includes(value) ? value : ""; return true; }
    if (f === "after") { e.after = AFTER.includes(value) ? value : ""; return true; }
    if (f === "phase") { e.phase = PHASES.includes(value) ? value : ""; return true; }
    if (f === "cat") { e.cat = CATS.includes(value) ? value : "prep"; return true; }
    if (f === "now") { e.now = value === "running" ? "running" : "stopped"; return true; }
    if (f === "due") { e.due = isDate(value) ? value : ""; return false; }
    if (["name", "who", "note", "owner", "check", "convert", "streamline"].includes(f)) {
      e[f] = String(value).slice(0, f === "name" ? 160 : 300);
      return f === "convert" || f === "streamline";
    }
    return false;
  };
  const changed = (event, redrawAlways) => {
    const { f, i } = event.target.dataset;
    if (!f || i === undefined) return;
    const redraw = setField(Number(i), f, event.target.value);
    own();
    save();
    if (redraw || redrawAlways) window.ToolKit.keepFocus(() => { renderSteps(); renderElements(); });
    else renderSteps();
    renderTotals();
    renderSoon();
  };
  list.addEventListener("input", (event) => { if (event.target.tagName === "INPUT" && event.target.type !== "radio") changed(event, false); });
  list.addEventListener("change", (event) => {
    const target = event.target;
    if (target.tagName === "SELECT" || target.type === "radio") changed(event, true);
    // A typed time is shown as a clock once the field is left.
    else if (["dur", "start", "afterDur"].includes(target.dataset.f)) {
      const e = state.elements[Number(target.dataset.i)];
      const value = e?.[target.dataset.f];
      if (e) target.value = finite(value) && (target.dataset.f !== "dur" || value > 0) ? clock(value) : target.value;
      window.ToolKit.keepFocus(() => { renderSteps(); renderElements(); });
    }
  });
  list.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const { move, by, remove } = button.dataset;
    if (move !== undefined) {
      const from = Number(move), to = from + Number(by);
      if (to < 0 || to >= state.elements.length) return;
      const [item] = state.elements.splice(from, 1);
      state.elements.splice(to, 0, item);
      own();
      save();
      renderAll();
      list.querySelector(`[data-move="${to}"][data-by="${by}"]`)?.focus() || list.querySelector(`[data-card="${to}"] input`)?.focus();
    } else if (remove !== undefined) {
      const index = Number(remove);
      const [removed] = state.elements.splice(index, 1);
      own();
      save();
      renderAll();
      (list.querySelector(`[data-remove="${Math.min(index, state.elements.length - 1)}"]`) || entry.querySelector("input"))?.focus();
      undoNote(status, tx("Removed {element}.", { element: removed.name.trim() || tx("Element {n}", { n: index + 1 }) }), () => {
        state.elements.splice(Math.min(index, state.elements.length), 0, removed);
        save();
        renderAll();
      });
    }
  });

  // Stopwatch ------------------------------------------------------------------------------------------------------------
  // Start is the last good piece of the old product; each lap closes the element under way and opens the next; stop is
  // the first good piece of the new one. The clock is not saved: a reload starts a fresh watch, the laps are kept.
  const clockState = { running: false, t0: 0, lapStart: 0, base: 0, laps: 0, timer: null };
  const elapsed = (from) => Math.max(0, performance.now() - from);
  const renderClock = () => {
    watch.clock.textContent = clockState.running ? clock(Math.floor(elapsed(clockState.lapStart) / 1000)) : "0:00";
    watch.current.textContent = clockState.running
      ? tx("Element {n} under way · changeover so far {t}", { n: state.elements.length + 1, t: clock(Math.floor(elapsed(clockState.t0) / 1000) + (clockState.base ?? 0)) })
      : "";
  };
  const renderWatch = () => {
    watch.start.hidden = clockState.running;
    watch.lap.hidden = !clockState.running;
    watch.stop.hidden = !clockState.running;
    watch.undo.hidden = !clockState.running || !clockState.laps;
    renderClock();
  };
  const startWatch = () => {
    if (state.elements.length >= MAX_ELEMENTS) { flash(watch.status, tx("A study holds up to {n} elements.", { n: MAX_ELEMENTS })); return; }
    clockState.running = true;
    clockState.t0 = performance.now();
    clockState.lapStart = clockState.t0;
    clockState.laps = 0;
    // A second session continues the clock of the first, when its elements have clock times.
    clockState.base = nextStart(state.elements);
    clearInterval(clockState.timer);
    clockState.timer = setInterval(renderClock, 250);
    renderWatch();
    flash(watch.status, tx("Running. Space or Lap closes the element under way."));
  };
  const lap = () => {
    if (!clockState.running) return;
    const now = performance.now();
    // The same rounding as lapDurations: the marks are rounded, then subtracted.
    const startMark = Math.round((clockState.lapStart - clockState.t0) / 1000);
    const endMark = Math.round((now - clockState.t0) / 1000);
    const dur = Math.max(1, endMark - startMark);
    state.elements.push(cleanElement({
      name: watch.name.value.trim(), cat: watch.cat.value, dur, now: "stopped",
      start: clockState.base === null ? null : clockState.base + startMark,
    }));
    watch.name.value = "";
    clockState.lapStart = now;
    clockState.laps += 1;
    own();
    save();
    renderElements();
    renderSteps();
    renderTotals();
    renderSoon();
    renderWatch();
    if (state.elements.length >= MAX_ELEMENTS) stopWatch();
  };
  const stopWatch = () => {
    if (!clockState.running) return;
    clockState.running = false;
    clearInterval(clockState.timer);
    renderWatch();
  };
  watch.start.addEventListener("click", startWatch);
  watch.lap.addEventListener("click", lap);
  watch.stop.addEventListener("click", () => {
    // Stop closes the element under way, like a lap: the first good piece ends the changeover.
    lap();
    stopWatch();
    flash(watch.status, tx("Stopped. Name the elements and give each its category, then go to step 2."));
  });
  // The last lap can be taken back: a lap pressed twice, or one pressed too early.
  watch.undo.addEventListener("click", () => {
    // Only a lap of this run: its time flows back into the element under way.
    if (!clockState.laps || !state.elements.length) return;
    const removed = state.elements.pop();
    clockState.lapStart -= removed.dur * 1000;
    clockState.laps -= 1;
    save();
    renderAll();
    flash(watch.status, tx("Removed {element}.", { element: removed.name.trim() || tx("Element {n}", { n: state.elements.length + 1 }) }));
  });
  // Space is the lap key on step 1, anywhere that is not a box to type in; on a button it does what the button does.
  document.addEventListener("keydown", (event) => {
    if (state.step !== 1 || (event.code !== "Space" && event.key !== " ")) return;
    if (event.target.closest?.("input, textarea, select, button, a, [contenteditable]")) return;
    event.preventDefault();
    if (clockState.running) lap(); else startWatch();
  });

  // Typed and pasted elements ------------------------------------------------------------------------------------------------
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const f = entry.elements;
    const start = parseDuration(f.start.value), end = parseDuration(f.end.value);
    // With a start and an end the duration follows from them; else it is typed.
    const dur = start >= 0 && end > start ? end - start : parseDuration(f.duration.value);
    if (!f.name.value.trim() || !(dur > 0)) { flash(entryStatus, tx("Give the element a name and a duration, or its start and end.")); return; }
    if (state.elements.length >= MAX_ELEMENTS) { flash(entryStatus, tx("A study holds up to {n} elements.", { n: MAX_ELEMENTS })); return; }
    state.elements.push(cleanElement({ name: f.name.value.trim(), cat: f.cat.value, dur, start: start >= 0 && f.start.value.trim() ? start : null, now: f.now.value }));
    own();
    save();
    flash(entryStatus, tx("Added {element}: {t}.", { element: f.name.value.trim(), t: clock(dur) }));
    // The next element usually starts where this one ended.
    f.start.value = start >= 0 && end > start ? clock(end) : "";
    f.name.value = "";
    f.duration.value = "";
    f.end.value = "";
    f.name.focus();
    renderAll();
  });
  root.querySelector("[data-import]").addEventListener("click", () => {
    const { added, skipped } = parseElements(paste.value, data.categories);
    const room = MAX_ELEMENTS - state.elements.length;
    if (!added.length) { flash(importStatus, tx("No rows found. Check that each row has an element, a category and a duration.")); return; }
    state.elements.push(...added.slice(0, room));
    own();
    save();
    paste.value = "";
    flash(importStatus, `${tx("Imported {n} elements", { n: Math.min(added.length, room) })}${skipped ? tx(", skipped {n} without a category or a duration", { n: skipped }) : ""}.`);
    renderAll();
  });
  root.querySelector("[data-example]").addEventListener("click", () => {
    stopWatch();
    loadExample();
    save();
    renderAll();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.elements.length || !window.confirm(tx("Clear this changeover study ({n} elements)?", { n: state.elements.length }))) return;
    stopWatch();
    Object.assign(state, { study: blankStudy(), elements: [], step: 1, example: false });
    save();
    renderAll();
  });
  const tableRows = () => [
    [tx("No."), tx("Element"), tx("Category"), tx("Starts at (s)"), tx("Duration (s)"), tx("Done today"), tx("Type"), tx("After the change"), tx("Time after (s)"), tx("Who"), tx("How (convert)"), tx("How (streamline)"), tx("Countermeasure"), tx("Owner"), tx("Due date"), tx("Check")],
    ...state.elements.map((e, i) => [i + 1, label(i), catOf(e.cat).name, finite(e.start) ? e.start : "", e.dur, whenText[e.now], typeText[kindOf(e)], typeText[afterOf(e)], afterDurOf(e), e.who, measureOf(e.convert)?.name || "", measureOf(e.streamline)?.name || "", e.note, e.owner, e.due, e.check]),
  ];
  const fileName = () => `${data.csv}${state.study.machine.trim() ? `-${state.study.machine.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30)}` : ""}`;
  root.querySelector("[data-csv]").addEventListener("click", () => { if (state.elements.length) downloadCsv(fileName(), tableRows()); });
  root.querySelector("[data-xlsx]").addEventListener("click", () => { if (state.elements.length) downloadXlsx(fileName(), tableRows(), { sheet: "SMED" }); });

  // The changeover standard (step 5, the printed sheet and the Standard Work file) ---------------------------------------------
  const titleText = () => [state.study.machine.trim(), state.study.from.trim() || state.study.to.trim() ? `${state.study.from.trim() || "–"} → ${state.study.to.trim() || "–"}` : ""].filter(Boolean).join(" · ") || data.text.changeover;
  const standardSheet = (forPrint) => {
    const r = analyse(state.elements, options());
    const s = standard(state.elements);
    const out = [];
    const top = el("div", "sm-sheet-head");
    top.append(el("p", "kicker", tx("Changeover standard")), el(forPrint ? "h2" : "h3", null, titleText()));
    const meta = [
      state.study.date ? `${tx("Date")}: ${showDate(state.study.date)}` : "",
      state.study.observer.trim() ? `${tx("Prepared by")}: ${state.study.observer.trim()}` : "",
      state.study.team.trim() ? `${tx("Team")}: ${state.study.team.trim()}` : "",
      `${tx("Machine stopped")}: ${clock(r.after.downtime)}`,
      r.target ? `${tx("Target")}: ${clock(r.target)}` : "",
    ].filter(Boolean);
    top.append(el("p", "sm-sheet-meta", meta.join(" · ")));
    out.push(top);
    const section = (title, items, note) => {
      const box = el("section", "sm-sheet-part");
      const total = items.reduce((sum, e) => sum + e.seconds, 0);
      box.append(el("h4", null, `${title} · ${clock(total)}${note ? ` · ${note}` : ""}`));
      if (!items.length) { box.append(el("p", "form-note", tx("Nothing in this part."))); return box; }
      const wrap = el("div", "dl-table-wrap");
      wrap.tabIndex = 0;
      const table = el("table", "dl-table sm-sheet-table");
      const hr = el("tr");
      [["", "sm-box"], [tx("No.")], [tx("Step")], [tx("Who")], [tx("Duration"), "num"], [tx("Check")]].forEach(([text, cls]) => { const th = el("th", cls, text); th.scope = "col"; hr.append(th); });
      const thead = el("thead");
      thead.append(hr);
      const tbody = el("tbody");
      items.forEach((e) => {
        const tr = el("tr");
        const box2 = el("td", "sm-box", "☐");
        box2.setAttribute("aria-hidden", "true");
        tr.append(box2, el("td", "num", String(e.index + 1)), el("td", null, label(e.index)), el("td", null, e.who.trim() || "–"), el("td", "num", clock(e.seconds)), el("td", "sm-sheet-check", e.check.trim()));
        tbody.append(tr);
      });
      table.append(thead, tbody);
      wrap.append(table);
      box.append(wrap);
      return box;
    };
    const parallel = r.after.lanes.length > 1 ? tx("{n} people in parallel, the longest {t}", { n: r.after.lanes.length, t: clock(r.after.downtime) }) : "";
    out.push(
      section(tx("A · Before the stop (machine running)"), s.before),
      section(tx("B · Machine stopped"), s.stopped, parallel),
      section(tx("C · After the restart (machine running)"), s.after),
    );
    out.push(el("p", "form-note sm-sheet-foot", data.text.standardFoot));
    if (forPrint) out.push(el("p", "sm-sheet-sign", `${tx("Prepared")}: ____________________   ${tx("Approved")}: ____________________`));
    return out;
  };
  // Printing: the changeover standard on A4; the rest of the page is hidden meanwhile.
  const printStandard = () => {
    printBox.replaceChildren(...standardSheet(true));
    printBox.hidden = false;
    document.documentElement.classList.add("sm-printing");
    const done = () => {
      document.documentElement.classList.remove("sm-printing");
      printBox.hidden = true;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint (some phones) get the page back a moment later.
    setTimeout(done, 2000);
  };
  // The machine-stopped steps as a Standard Work file (js/template-pack.js): Standard Work opens it with "Open a
  // template file" as a new job breakdown, each step with its time and its check as a quality key point.
  const standardWorkDoc = () => {
    const r = analyse(state.elements, options());
    const s = standard(state.elements);
    return {
      title: tx("Changeover {from} → {to}", { from: state.study.from.trim() || "–", to: state.study.to.trim() || "–" }),
      process: state.study.machine.trim(), area: "", owner: state.study.observer.trim(),
      takt: String(Math.round(r.target || r.after.downtime)), ppe: "", trainedBy: "", approvedBy: "",
      version: 1, versionDate: today(), history: [], updated: today(),
      changeNote: tx("SMED: changeover from {before} to {after} with the machine stopped. Before the stop: {a}; after the restart: {c}.", {
        before: clock(r.before.downtime), after: clock(r.after.downtime),
        a: s.before.map((e) => label(e.index)).join(", ") || "–", c: s.after.map((e) => label(e.index)).join(", ") || "–",
      }).slice(0, 2000),
      steps: s.stopped.map((e) => ({
        step: `${label(e.index)}${e.who.trim() && r.after.lanes.length > 1 ? ` (${e.who.trim()})` : ""}`, time: String(e.seconds),
        points: [e.check.trim() ? { text: e.check.trim(), type: "quality", reason: "" } : null, e.note.trim() ? { text: e.note.trim(), type: "technique", reason: "" } : null].filter(Boolean),
      })),
    };
  };

  // Results ------------------------------------------------------------------------------------------------------------------
  const summaryText = (r) => {
    const lines = [`${data.title} | Stiven Catalyst`, titleText(), ""];
    if (state.study.date) lines.push(`${tx("Date")}: ${showDate(state.study.date)}`);
    lines.push(
      `${tx("Before")}: ${clock(r.before.downtime)} ${tx("machine stopped")}`,
      `${tx("After separation alone")}: ${clock(r.separated.internal)}`,
      `${tx("After")}: ${clock(r.after.downtime)} ${tx("machine stopped")} · ${clock(r.after.external)} ${tx("external")}`,
      `${tx("Saving")}: ${minutes(r.saving)} (${pct(r.savingShare, 0)})`,
    );
    if (r.target) lines.push(`${tx("Target")}: ${clock(r.target)} · ${r.targetMet ? tx("met") : tx("not met yet")}`);
    if (r.freed) {
      lines.push(`${tx("Freed per week")}: ${minutes(r.freed.minutesWeek * 60)}${r.freed.euroWeek !== null ? ` · ${euro.format(r.freed.euroWeek)}` : ""}`);
      if (r.freed.minutesYear !== null) lines.push(`${tx("Freed per year")}: ${minutes(r.freed.minutesYear * 60)}${r.freed.euroYear !== null ? ` · ${euro.format(r.freed.euroYear)}` : ""}`);
    }
    lines.push("", `${tx("Elements")}:`);
    state.elements.forEach((e, i) => {
      const type = afterOf(e);
      lines.push(`${i + 1}. ${label(i)} [${catOf(e.cat).short}] ${clock(e.dur)} ${typeText[kindOf(e)].toLowerCase()} → ${type === "removed" ? typeText.removed.toLowerCase() : `${clock(afterDurOf(e))} ${typeText[type].toLowerCase()}`}${e.note.trim() ? ` · ${e.note.trim()}` : ""}`);
    });
    return lines.join("\n");
  };

  const renderResults = () => {
    note.hidden = !state.example;
    results.replaceChildren();
    results.hidden = !state.elements.length;
    if (!state.elements.length) return;
    const r = analyse(state.elements, options());
    const machine = state.study.machine.trim();

    const top = el("div", "result-head");
    top.append(el("p", "kicker", `${tx("Result")}${machine ? ` · ${machine}` : ""}`));
    const title = el("h2");
    if (r.saving > 0) {
      const [a, b, c] = tx("From {before} to {after} with the machine stopped", { before: "\u0000", after: "\u0001" }).split(/[\u0000\u0001]/);
      title.append(a, minutes(r.before.downtime), b, el("span", null, minutes(r.after.downtime)), c ?? "");
    } else {
      title.append(tx("{t} with the machine stopped: plan the change in steps 2 to 4", { t: minutes(r.before.downtime) }));
    }
    top.append(title);

    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Before"), clock(r.before.downtime), r.before.span !== null && r.before.gap !== 0 ? tx("machine stopped, from the clock times; elements add up to {t}", { t: clock(r.before.work) }) : tx("machine stopped, {n} elements", { n: r.before.count })));
    stats.append(stat(tx("After separation alone"), clock(r.separated.internal), tx("step 2: the external work moves out of the stop")));
    stats.append(stat(tx("After"), clock(r.after.downtime), r.after.lanes.length > 1 ? tx("{n} people in parallel, {t} of work", { n: r.after.lanes.length, t: clock(r.after.labour) }) : tx("machine stopped, as planned in steps 3 and 4")));
    stats.append(stat(tx("Saving"), pct(r.savingShare, 0), tx("{t} less per changeover", { t: minutes(r.saving) })));
    stats.append(stat(tx("External"), clock(r.after.external), tx("done while the machine runs")));
    if (r.freed) stats.append(stat(tx("Freed per week"), minutes(r.freed.minutesWeek * 60), r.freed.euroWeek !== null ? tx("{e} at {c} per machine-minute", { e: euro.format(r.freed.euroWeek), c: euro.format(n("costMin")) }) : tx("{n} changeovers a week", { n: num(n("perWeek"), Number.isInteger(n("perWeek")) ? 0 : 1) })));

    const notes = [];
    if (r.untimed) notes.push(el("p", "dl-warning", tx("{n} elements have no time yet and count as 0:00.", { n: r.untimed })));
    if (r.before.gap > 0) notes.push(el("p", "dl-warning", tx("{t} of the stop lies between the recorded elements (waiting, searching). The saving counts it as gone: record it as an element and plan it.", { t: clock(r.before.gap) })));
    if (r.singleMinute) notes.push(el("p", "dl-panel-note", data.text.singleMinute));
    if (r.target && !r.targetMet && r.saving > 0) notes.push(el("p", "dl-panel-note", tx("The plan is {t} above the target of {target}. Look again at the largest internal category below.", { t: clock(r.after.downtime - r.target), target: clock(r.target) })));
    const undecided = state.elements.filter((e) => !e.kind).length;
    if (undecided) notes.push(el("p", "dl-panel-note", tx("{n} elements are not marked internal or external yet (step 2).", { n: undecided })));

    // Where to start the next round: the category with the most machine-stopped time left after the plan.
    const topCat = r.paretoAfter[0] || r.paretoBefore[0];
    let focus = null;
    if (topCat) {
      const c = catOf(topCat.cat);
      const largest = state.elements.map((e, i) => ({ e, i, s: afterOf(e) === "internal" ? afterDurOf(e) : 0 })).filter((x) => x.e.cat === topCat.cat).sort((a, b) => b.s - a.s)[0];
      focus = focusCard({
        title: c.name,
        detail: tx("{t} of {total} with the machine stopped", { t: clock(topCat.seconds), total: clock(r.paretoAfter.length ? r.after.labour : r.before.work) }),
        lede: tx("After the plan, {share} of the internal work is {category}. Shingo's typical share in a traditional changeover is {typical}. The largest element left: {element} ({t}).", {
          share: pct(topCat.share, 0), category: lower(c.short), typical: pct(c.typical, 0), element: largest ? label(largest.i) : "–", t: largest ? clock(largest.s) : "–",
        }),
        advice: data.advice[topCat.cat],
      });
    }

    // Actions: copy, print, 5 Whys on the longest element, the countermeasures to the tracker, the standard.
    const longest = state.elements.map((e, i) => ({ e, i })).filter(({ e }) => e.now !== "running").sort((a, b) => b.e.dur - a.e.dur)[0];
    const problem = longest ? tx("{element} keeps {machine} stopped for {t} at every changeover", { element: label(longest.i), machine: machine || tx("the machine"), t: clock(longest.e.dur) }) : titleText();
    const actions = resultActions(() => summaryText(r), problem);
    const measures = state.elements.map((e, i) => (hasMeasure(e) ? actionOf(e, i) : null)).filter(Boolean);
    if (AS && measures.length) {
      const add = el("button", "button-secondary", tx("Add the {n} countermeasures to actions", { n: measures.length }));
      add.type = "button";
      add.addEventListener("click", () => {
        measures.forEach((action) => AS.add(action));
        const line = actions.querySelector("[data-actions-status]") || el("p", "form-note sm-actions-status");
        line.dataset.actionsStatus = "";
        line.setAttribute("role", "status");
        const link = el("a", "inline-link", tx("Open the Action Tracker"));
        link.href = AS.trackerUrl().href;
        line.replaceChildren(tx("Added {n} actions.", { n: measures.length }), " ", link);
        actions.append(line);
        add.disabled = true;
      });
      actions.append(add);
    }
    const printButton = el("button", "button-secondary", tx("Print the changeover standard"));
    printButton.type = "button";
    printButton.addEventListener("click", printStandard);
    actions.append(printButton);
    if (window.TemplatePack && state.elements.some((e) => afterOf(e) === "internal")) {
      const swButton = el("button", "button-secondary", tx("Save for Standard Work"));
      swButton.type = "button";
      const swLine = el("p", "form-note sm-actions-status");
      swLine.setAttribute("aria-live", "polite");
      swButton.addEventListener("click", () => {
        const packed = window.TemplatePack.save({ tool: "standard-work", kind: "standard", name: standardWorkDoc().title, data: standardWorkDoc() });
        const link = el("a", "inline-link", tx("Open Standard Work"));
        link.href = new URL("../standard-work/", window.location.href).href;
        swLine.replaceChildren(tx("Saved as {file}. Open it in Standard Work with “Open a template file”.", { file: packed.fileName }), " ", link);
      });
      actions.append(swButton, swLine);
    }
    const copyStandard = el("button", "button-secondary", tx("Copy the standard"));
    copyStandard.type = "button";
    copyStandard.addEventListener("click", () => {
      const s = standard(state.elements);
      const part = (title, items) => [title, ...items.map((e) => `☐ ${e.index + 1}. ${label(e.index)} · ${e.who.trim() || "–"} · ${clock(e.seconds)}${e.check.trim() ? ` · ${tx("Check")}: ${e.check.trim()}` : ""}`), ""];
      copy([`${tx("Changeover standard")}: ${titleText()}`, "", ...part(tx("A · Before the stop (machine running)"), s.before), ...part(tx("B · Machine stopped"), s.stopped), ...part(tx("C · After the restart (machine running)"), s.after), data.text.standardFoot].join("\n"), copyStandard);
    });
    actions.append(copyStandard);

    const panels = [];
    if (CK) {
      // Each column a stack of elements: before and after, with the machine stopped and while it runs. With people in
      // parallel each one has a column: the machine stands as long as the tallest.
      const keyOf = (i) => `${i + 1} · ${label(i)}`;
      const colors = {};
      state.elements.forEach((e, i) => { colors[keyOf(i)] = catColor[e.cat]; });
      const part = (e, i, seconds) => ({ key: keyOf(i), value: Math.round((seconds / 60) * 100) / 100 });
      const groups = [{ label: tx("Before · stopped"), parts: state.elements.map((e, i) => (e.now !== "running" ? part(e, i, e.dur) : null)).filter(Boolean) }];
      if (r.before.external > 0) groups.push({ label: tx("Before · running"), parts: state.elements.map((e, i) => (e.now === "running" ? part(e, i, e.dur) : null)).filter(Boolean) });
      const laneKey = (e) => {
        const first = r.after.lanes[0]?.who || "";
        return norm(e.who) || norm(first);
      };
      if (r.after.lanes.length > 1) {
        r.after.lanes.forEach((lane) => groups.push({ label: `${tx("After · stopped")} · ${lane.who}`, parts: state.elements.map((e, i) => (afterOf(e) === "internal" && laneKey(e) === norm(lane.who) ? part(e, i, afterDurOf(e)) : null)).filter(Boolean) }));
      } else {
        groups.push({ label: tx("After · stopped"), parts: state.elements.map((e, i) => (afterOf(e) === "internal" ? part(e, i, afterDurOf(e)) : null)).filter(Boolean) });
      }
      groups.push({ label: tx("After · running"), parts: state.elements.map((e, i) => (afterOf(e) === "external" ? part(e, i, afterDurOf(e)) : null)).filter(Boolean) });
      const byElement = panel(tx("Before and after, element by element"), tx("Each block is an element, coloured by its category. The stopped columns are the changeover time; the running columns are external work, done while the machine produces."));
      byElement.append(CK.figure(CK.stacked(groups, { keys: Object.keys(colors), colors, title: `${data.title}: ${tx("Before and after, element by element")}`, unit: "min", line: r.target ? { value: r.target / 60, label: tx("Target") } : undefined, format: (v) => num(v, 1) }), { fileName: `${data.csv}-elements` }));
      byElement.append(CK.legend(data.categories.map((c) => ({ label: c.name, color: catColor[c.key] }))));
      panels.push(byElement);

      // The saving step by step: as observed, after separating (step 2), after converting and streamlining (3 and 4).
      const kInt = tx("Internal (machine stopped)"), kExt = tx("External (machine running)");
      const steps = panel(tx("The saving, step by step"), tx("Separating moves the external work out of the stop; converting and streamlining shorten what is left. The internal part is the changeover time."));
      steps.append(CK.figure(CK.stacked([
        { label: tx("Observed"), parts: [{ key: kInt, value: r.before.downtime / 60 }, { key: kExt, value: r.before.external / 60 }] },
        { label: tx("Separated"), parts: [{ key: kInt, value: r.separated.internal / 60 }, { key: kExt, value: r.separated.external / 60 }] },
        { label: tx("Converted and streamlined"), parts: [{ key: kInt, value: r.after.downtime / 60 }, { key: kExt, value: r.after.external / 60 }] },
      ], { keys: [kInt, kExt], colors: { [kInt]: CK.C.blue, [kExt]: CK.C.soft }, title: `${data.title}: ${tx("The saving, step by step")}`, unit: "min", line: r.target ? { value: r.target / 60, label: tx("Target") } : undefined, format: (v) => num(v, 1) }), { fileName: `${data.csv}-steps` }));
      panels.push(steps);

      // Pareto of the stop by category, against Shingo's typical shares.
      const paretoPanel = panel(tx("Internal time by category"), tx("The observed stop by category, largest first, with the cumulative share. In a traditional changeover trial runs and adjustments are about half (Shingo); setting comes next."));
      paretoPanel.append(CK.figure(CK.bars(r.paretoBefore.map((item) => ({ label: catOf(item.cat).short, value: Math.round((item.seconds / 60) * 10) / 10, color: catColor[item.cat], tip: `${catOf(item.cat).name}: ${clock(item.seconds)} · ${pct(item.share, 0)} · ${tx("cumulative")} ${pct(item.cum, 0)}` })), { title: `${data.title}: ${tx("Internal time by category")}`, unit: "min", format: (v) => num(v, 1) }), { fileName: `${data.csv}-pareto` }));
      const wrap = el("div", "dl-table-wrap");
      wrap.tabIndex = 0;
      const table = el("table", "dl-table sm-pareto");
      const hr = el("tr");
      [[tx("Category")], [tx("Before"), "num"], [tx("Share of the stop"), "num"], [tx("Cumulative"), "num"], [tx("Typical"), "num"], [tx("After"), "num"]].forEach(([text, cls]) => { const th = el("th", cls, text); th.scope = "col"; hr.append(th); });
      const thead = el("thead");
      thead.append(hr);
      const tbody = el("tbody");
      const afterBy = Object.fromEntries(r.paretoAfter.map((item) => [item.cat, item.seconds]));
      r.paretoBefore.forEach((item) => {
        const tr = el("tr");
        tr.append(el("td", null, catOf(item.cat).name), el("td", "num", clock(item.seconds)), el("td", "num", pct(item.share, 0)), el("td", "num", pct(item.cum, 0)), el("td", "num", pct(catOf(item.cat).typical, 0)), el("td", "num", clock(afterBy[item.cat] || 0)));
        tbody.append(tr);
      });
      table.append(thead, tbody);
      wrap.append(table);
      paretoPanel.append(wrap, el("p", "dl-panel-note", data.text.typicalSource));
      panels.push(paretoPanel);
    }

    // The element table: before and after, the saving of machine-stopped time, the countermeasure.
    const elementsPanel = panel(tx("Elements before and after"), tx("Time saved is the machine-stopped time each element gives back: its stop before minus its internal time after."));
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table sm-table");
    const hr = el("tr");
    [[tx("No."), "num"], [tx("Element")], [tx("Before"), "num"], [tx("After"), "num"], [tx("Time saved"), "num"], [tx("Countermeasure")]].forEach(([text, cls]) => { const th = el("th", cls, text); th.scope = "col"; hr.append(th); });
    const thead = el("thead");
    thead.append(hr);
    const tbody = el("tbody");
    state.elements.forEach((e, i) => {
      const type = afterOf(e);
      const saved = (e.now !== "running" ? e.dur : 0) - (type === "internal" ? afterDurOf(e) : 0);
      const tr = el("tr");
      const name = el("td");
      name.append(el("strong", null, label(i)), el("span", "sm-sub", catOf(e.cat).short));
      const before = el("td", "num");
      before.append(clock(e.dur), el("span", "sm-sub", typeText[kindOf(e)]));
      const after = el("td", "num");
      after.append(type === "removed" ? "–" : clock(afterDurOf(e)), el("span", "sm-sub", typeText[type]));
      tr.append(el("td", "num", String(i + 1)), name, before, after, el("td", "num sm-strong", saved ? clock(saved) : "0:00"), el("td", "sm-measure", e.note.trim() || [measureOf(e.convert)?.name, measureOf(e.streamline)?.name].filter(Boolean).join(" · ")));
      tbody.append(tr);
    });
    const tfoot = el("tfoot");
    const tr = el("tr", "sm-total");
    const td = el("td", null, tx("Machine stopped"));
    td.colSpan = 2;
    tr.append(td, el("td", "num sm-strong", clock(r.before.downtime)), el("td", "num sm-strong", clock(r.after.downtime)), el("td", "num sm-strong", clock(r.saving)), el("td", null, r.after.lanes.length > 1 ? tx("{n} people in parallel, {t} of work", { n: r.after.lanes.length, t: clock(r.after.labour) }) : ""));
    tfoot.append(tr);
    table.append(thead, tbody, tfoot);
    wrap.append(table);
    elementsPanel.append(wrap);
    panels.push(elementsPanel);

    // What the minutes are worth, and what shorter changeovers allow.
    const worth = panel(tx("What the saving is worth"), r.freed ? "" : tx("Enter the changeovers per week (and the cost of a machine-minute) to see the time and money freed."));
    if (r.freed) {
      const rows = el("div", "dl-stats sm-worth");
      rows.append(stat(tx("Freed per week"), minutes(r.freed.minutesWeek * 60), r.freed.euroWeek !== null ? euro.format(r.freed.euroWeek) : tx("cost per machine-minute missing")));
      if (r.freed.minutesYear !== null) rows.append(stat(tx("Freed per year"), `${num(r.freed.minutesYear / 60, 0)} h`, `${minutes(r.freed.minutesYear * 60)}${r.freed.euroYear !== null ? ` · ${euro.format(r.freed.euroYear)}` : ""} · ${tx("{n} working weeks", { n: num(n("weeks"), 0) })}`));
      worth.append(rows, el("p", "dl-panel-note", data.text.freedNote));
    }
    if (r.batch) {
      const lines = el("ul", "sm-batch");
      if (r.batch.changeovers !== null) lines.append(el("li", null, tx("With the same {t} a week spent changing over, the line could change over {m} times instead of {n}: batches of {share} of today's size.", { t: minutes(r.before.downtime * n("perWeek")), m: num(r.batch.changeovers, 1), n: num(n("perWeek"), Number.isInteger(n("perWeek")) ? 0 : 1), share: pct(r.batch.ratio, 0) })));
      lines.append(el("li", null, tx("By the economic batch size (EOQ = √(2 · demand · cost per changeover ÷ holding cost)), if the cost of a changeover follows its minutes, the economic batch falls to √({after} ÷ {before}) = {share} of today's, and the stock waiting between changeovers with it.", { after: clock(r.after.downtime), before: clock(r.before.downtime), share: pct(r.batch.eoq, 0) })));
      worth.append(lines);
    }
    const oee = el("p", "dl-panel-note");
    const oeeLink = el("a", "inline-link", tx("Open OEE"));
    oeeLink.href = new URL("../oee/", window.location.href).href;
    oee.append(data.text.oee, " ", oeeLink);
    worth.append(oee);
    panels.push(worth);

    resultLayout(results, { head: top, stats, notes, focus, actions, panels });
  };
  const renderSoon = renderOnPause(renderResults, () => state.elements.length, 40);

  const renderAll = () => {
    showStudy();
    renderSteps();
    renderElements();
    renderTotals();
    renderResults();
    renderWatch();
  };
  renderAll();
})();
