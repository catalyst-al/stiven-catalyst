// Value Stream Map: one product or service family from the supplier to the customer, step by step, with the pieces
// waiting between the steps turned into time through the demand. Lead time, process time, PCE, takt and the
// bottleneck; the current state and a future state with its kaizen bursts. The arithmetic lives in window.VsmMath so
// the tests can call it.
(() => {
  const kit = window.ToolKit || {};
  const parseNumber = kit.parseNumber || ((value) => Number(String(value ?? "").replace(",", ".")));
  const EPS = 1e-9;
  const MAX_STEPS = 12;
  const NUMBER_FIELDS = ["operators", "ct", "co", "uptime", "batch", "fpy", "shifts", "inv"];

  // Arithmetic -------------------------------------------------------------------------------------------------------
  const numberOf = (value, fallback) => {
    const x = typeof value === "number" ? value : String(value ?? "").trim() === "" ? NaN : parseNumber(value);
    return Number.isFinite(x) ? x : fallback;
  };
  const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
  // Takt in seconds: the working seconds of a day over the demand of the same day.
  const takt = (minutes, demand) => (minutes > 0 && demand > 0 && Number.isFinite(minutes) && Number.isFinite(demand) ? (minutes * 60) / demand : null);
  // Pieces waiting are time waiting: a pile of one day's demand is one working day of lead time. In working minutes.
  const inventoryTime = (pieces, demand, minutes) => (pieces > 0 && demand > 0 && minutes > 0 ? (pieces / demand) * minutes : 0);
  // With more hands a step releases a piece every CT ÷ operators. A step without an operator (a sorter) runs at its CT.
  const effectiveCt = (ct, operators) => (operators > 1 ? ct / operators : ct);
  // A step as numbers. Blanks take the value that changes nothing: one operator, 100 % uptime and yield, batch 1.
  const stepNumbers = (step = {}) => ({
    name: typeof step.name === "string" ? step.name.trim() : "",
    operators: Math.max(0, numberOf(step.operators, 1)),
    ct: Math.max(0, numberOf(step.ct, 0)),
    co: Math.max(0, numberOf(step.co, 0)),
    uptime: clamp(numberOf(step.uptime, 100), 0, 100),
    batch: Math.max(1, numberOf(step.batch, 1)),
    fpy: clamp(numberOf(step.fpy, 100), 0, 100),
    shifts: Math.max(0, numberOf(step.shifts, 1)),
    inv: Math.max(0, numberOf(step.inv, 0)),
    va: step.va === true,
    kaizen: typeof step.kaizen === "string" ? step.kaizen.trim() : "",
  });
  const processTime = (steps) => steps.map(stepNumbers).reduce((sum, s) => sum + s.ct, 0);
  const valueAddedTime = (steps) => steps.map(stepNumbers).filter((s) => s.va).reduce((sum, s) => sum + s.ct, 0);
  // The share that passes every step right first time: the first-pass yields multiplied.
  const rolledYield = (steps) => (steps.length ? steps.map(stepNumbers).reduce((product, s) => product * (s.fpy / 100), 1) : null);
  const pce = (va, lead) => (lead > 0 ? va / lead : null);
  // Pieces per day: the working time the step is up, over the time each piece takes with its share of a changeover.
  const capacity = (step, minutes) => {
    const s = stepNumbers(step);
    const perPiece = effectiveCt(s.ct, s.operators) + (s.co * 60) / s.batch;
    return perPiece > 0 && minutes > 0 ? (minutes * 60 * (s.uptime / 100)) / perPiece : null;
  };
  // The bottleneck: the step that releases a piece most slowly. -1 while no step has a cycle time.
  const bottleneck = (steps) => {
    let best = -1, max = 0;
    steps.map(stepNumbers).forEach((s, i) => {
      const eff = effectiveCt(s.ct, s.operators);
      if (s.ct > 0 && eff > max + EPS) { best = i; max = eff; }
    });
    return best;
  };
  // Seconds above takt (positive) or under it (negative).
  const taktGap = (step, taktSeconds) => {
    const s = stepNumbers(step);
    return taktSeconds > 0 ? effectiveCt(s.ct, s.operators) - taktSeconds : null;
  };
  // Lead time in seconds: every wait (before each step and after the last) plus every cycle time.
  const leadTime = ({ steps = [], finished = 0 }, demand, minutes) => steps.map(stepNumbers).reduce((sum, s) => sum + inventoryTime(s.inv, demand, minutes) * 60 + s.ct, 0)
    + inventoryTime(Math.max(0, numberOf(finished, 0)), demand, minutes) * 60;

  // The whole map: the header numbers and one state's steps. Every number the page shows comes from here.
  const analyse = ({ demand: rawDemand, minutes: rawMinutes, steps = [], finished = 0 }) => {
    const demand = Math.max(0, numberOf(rawDemand, 0)), minutes = Math.max(0, numberOf(rawMinutes, 0));
    const t = takt(minutes, demand);
    const rows = steps.map(stepNumbers).map((s, index) => {
      const eff = effectiveCt(s.ct, s.operators);
      const cap = capacity(s, minutes);
      return {
        ...s, index, eff, wait: inventoryTime(s.inv, demand, minutes) * 60, capacity: cap,
        utilisation: cap > 0 && demand > 0 ? demand / cap : null,
        gap: t ? eff - t : null, overTakt: Boolean(t) && s.ct > 0 && eff > t + EPS,
      };
    });
    const finishedPieces = Math.max(0, numberOf(finished, 0));
    const finishedWait = inventoryTime(finishedPieces, demand, minutes) * 60;
    const wait = rows.reduce((sum, row) => sum + row.wait, 0) + finishedWait;
    const process = processTime(rows), va = valueAddedTime(rows);
    const lead = wait + process;
    const b = bottleneck(rows);
    const ladder = [...rows.flatMap((row) => [{ kind: "wait", seconds: row.wait, pieces: row.inv, step: row.index }, { kind: "process", seconds: row.ct, step: row.index }]),
      { kind: "wait", seconds: finishedWait, pieces: finishedPieces, step: rows.length }];
    const waits = ladder.filter((part) => part.kind === "wait" && part.seconds > 0);
    return {
      demand, minutes, takt: t, steps: rows, finished: finishedPieces, finishedWait, wait, process, va, lead,
      pce: pce(va, lead), yield: rolledYield(rows), bottleneck: b >= 0 ? rows[b] : null,
      leadDays: minutes > 0 ? lead / 60 / minutes : null,
      pieces: rows.reduce((sum, row) => sum + row.inv, 0) + finishedPieces,
      over: rows.filter((row) => row.overTakt),
      overloaded: rows.filter((row) => row.utilisation !== null && row.utilisation > 1 + EPS),
      ladder,
      longestWait: waits.length ? waits.reduce((best, part) => (part.seconds > best.seconds ? part : best), waits[0]) : null,
    };
  };
  // The future against the current: what changes, and the share of the lead time that goes.
  const compare = (now, next) => ({
    lead: next.lead - now.lead, leadShare: now.lead > 0 ? (now.lead - next.lead) / now.lead : null,
    process: next.process - now.process, wait: next.wait - now.wait, pieces: next.pieces - now.pieces,
    pce: (next.pce ?? 0) - (now.pce ?? 0),
  });

  // Saved and example data, rebuilt field by field so nothing damaged breaks the page. Numbers stay as typed text.
  const field = (value) => (typeof value === "number" && Number.isFinite(value) ? String(value) : typeof value === "string" ? value.slice(0, 16) : "");
  const text = (value, max) => (typeof value === "string" ? value.slice(0, max) : "");
  const cleanStep = (step) => {
    const source = step && typeof step === "object" ? step : {};
    const out = { name: text(source.name, 80) };
    NUMBER_FIELDS.forEach((name) => { out[name] = field(source[name]); });
    out.va = source.va === true;
    out.kaizen = text(source.kaizen, 240);
    return out;
  };
  const cleanMap = (map) => {
    const source = map && typeof map === "object" && !Array.isArray(map) ? map : {};
    return { steps: (Array.isArray(source.steps) ? source.steps : []).filter((s) => s && typeof s === "object").slice(0, MAX_STEPS).map(cleanStep), finished: field(source.finished) };
  };
  const fromExample = (example = {}) => {
    const header = example.header || {};
    const current = cleanMap(example.current);
    return {
      family: text(header.family, 120), demand: field(header.demand), minutes: field(header.minutes), supplier: text(header.supplier, 80), customer: text(header.customer, 80),
      current, future: example.future ? cleanMap(example.future) : cleanMap(current), hasFuture: Boolean(example.future), view: "current",
    };
  };
  const fromTemplate = (template = {}) => cleanMap({ steps: template.steps, finished: template.finished });
  // Reordering, as new lists: the inventory in front of a step travels with it.
  const moveStep = (steps, index, by) => {
    const to = index + by;
    if (index < 0 || index >= steps.length || to < 0 || to >= steps.length) return steps.slice();
    const out = steps.slice();
    const [step] = out.splice(index, 1);
    out.splice(to, 0, step);
    return out;
  };
  const insertStep = (steps, after, step = cleanStep({})) => {
    const out = steps.slice();
    out.splice(Math.min(Math.max(after + 1, 0), out.length), 0, step);
    return out;
  };

  window.VsmMath = { takt, inventoryTime, effectiveCt, stepNumbers, processTime, valueAddedTime, rolledYield, pce, capacity, bottleneck, taktGap, leadTime, analyse, compare, cleanStep, cleanMap, fromExample, fromTemplate, moveStep, insertStep };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-value-stream-map]");
  const dataEl = document.getElementById("value-stream-map-data");
  if (!root || !dataEl || !window.ToolKit) return;
  const { tx, num, pct, int, el, write, loadState, isObject, str, firstVisit, panel, stat, focusCard, resultActions, resultLayout, renderOnPause, flash, undoNote, downloadCsv, downloadXlsx } = window.ToolKit;
  const CK = window.ChartKit;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;

  const results = document.querySelector("[data-results]");
  const headerInputs = [...root.querySelectorAll("[data-header]")];
  const taktOut = root.querySelector("[data-takt]");
  const stepsBox = root.querySelector("[data-steps]");
  const emptyNote = root.querySelector("[data-empty]");
  const stepStatus = root.querySelector("[data-step-status]");
  const stepCount = root.querySelector("[data-step-count]");
  const viewButtons = [...root.querySelectorAll("[data-view]")];
  const viewNote = root.querySelector("[data-view-note]");
  const addButton = root.querySelector("[data-add]");
  const resetFuture = root.querySelector("[data-reset-future]");
  const templateSelect = root.querySelector("[data-template]");
  const templateStatus = root.querySelector("[data-template-status]");

  // State: the header, the current state, the future state (a copy of the current until it is redrawn) and the view.
  const defaults = { family: "", demand: "", minutes: "", supplier: "", customer: "", current: {}, future: {}, hasFuture: false, view: "current", example: false };
  const state = loadState(KEY, defaults);
  ["family", "supplier", "customer"].forEach((name) => { state[name] = str(state[name]).slice(0, 120); });
  ["demand", "minutes"].forEach((name) => { state[name] = field(state[name]); });
  state.current = cleanMap(state.current);
  state.future = cleanMap(state.future);
  if (!["current", "future"].includes(state.view) || !state.hasFuture) state.view = "current";
  const loadExample = () => { Object.assign(state, fromExample(data.example), { example: true }); };
  // A first visit opens on the example, so the map is visible at once; the note above it says so.
  if (!state.current.steps.length && firstVisit(KEY)) loadExample();
  const save = () => write(KEY, state);
  const own = () => { state.example = false; };
  const isFuture = () => state.view === "future" && state.hasFuture;
  const active = () => (isFuture() ? state.future : state.current);
  const clone = (value) => JSON.parse(JSON.stringify(value));

  // Formats: seconds for a cycle, minutes or hours for a wait, working days for a long lead time.
  const sec = (value) => { const r = Math.round(value * 10) / 10; return `${num(r, Number.isInteger(r) ? 0 : 1)} s`; };
  const dur = (seconds, minutesPerDay = 0) => {
    if (!Number.isFinite(seconds)) return "–";
    if (seconds < 120) return sec(seconds);
    const m = seconds / 60;
    if (m < 120) return tx("{n} min", { n: num(m, m < 10 ? 1 : 0) });
    if (minutesPerDay > 0 && m >= minutesPerDay * 3) return tx("{n} working days", { n: num(m / minutesPerDay, 1) });
    return tx("{n} h", { n: num(m / 60, 1) });
  };
  const share = (value) => (value === null || !Number.isFinite(value) ? "–" : pct(value, value < 0.1 ? 2 : 1));
  const stepName = (map, i) => map.steps[i]?.name.trim() || tx("Step {n}", { n: i + 1 });
  const viewLabel = (view) => (view === "future" ? tx("Future state") : tx("Current state"));
  const supplierName = () => state.supplier.trim() || tx("Supplier");
  const customerName = () => state.customer.trim() || tx("Customer");
  const resultOf = (map) => analyse({ demand: state.demand, minutes: state.minutes, steps: map.steps, finished: map.finished });

  // Example note above the results, with one tap to clear the example.
  const note = el("div", "dl-example-note");
  note.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  const clearAll = () => {
    Object.assign(state, defaults, { current: cleanMap({}), future: cleanMap({}) });
    save();
    renderAll();
  };
  clearExample.addEventListener("click", clearAll);
  note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(note);

  // Header and takt ----------------------------------------------------------------------------------------------------
  const renderTakt = () => {
    const t = takt(numberOf(state.minutes, 0), numberOf(state.demand, 0));
    taktOut.textContent = t ? tx("Takt {takt}: the customer takes one piece every {takt}.", { takt: sec(t) }) : tx("Enter the demand and the working minutes to see the takt.");
  };
  headerInputs.forEach((input) => input.addEventListener("input", () => {
    state[input.name] = input.value;
    own();
    save();
    renderTakt();
    renderInventories();
    renderSoon();
  }));

  // The steps of the state being drawn ----------------------------------------------------------------------------------
  const labelled = (id, label, control, className = "vs-field") => {
    const box = el("div", className);
    const tag = el("label", null, label);
    tag.htmlFor = id;
    box.append(tag, control);
    return box;
  };
  const numberInput = (id, i, name, value, step = "any") => {
    const input = el("input", "vs-in");
    Object.assign(input, { id, type: "number", min: "0", step, value });
    input.inputMode = "decimal";
    Object.assign(input.dataset, { i, field: name });
    return input;
  };
  const toolButton = (label, glyph, act, i, disabled) => {
    const button = el("button", "vs-tool", glyph);
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.title = label;
    button.disabled = Boolean(disabled);
    Object.assign(button.dataset, { act, i });
    return button;
  };
  const waitText = (pieces) => {
    const minutes = inventoryTime(numberOf(pieces, 0), numberOf(state.demand, 0), numberOf(state.minutes, 0));
    return numberOf(pieces, 0) > 0 ? (minutes > 0 ? `= ${dur(minutes * 60, numberOf(state.minutes, 0))}` : tx("add the demand to turn it into time")) : "";
  };
  const inventoryRow = (id, label, value, dataset) => {
    const row = el("div", "vs-inv");
    row.append(el("span", "vs-tri", "▲"));
    const input = el("input", "vs-in vs-inv-in");
    Object.assign(input, { id, type: "number", min: "0", step: "1", value });
    input.inputMode = "numeric";
    Object.assign(input.dataset, dataset);
    const tag = el("label", null, label);
    tag.htmlFor = id;
    const out = el("span", "vs-inv-out", waitText(value));
    out.dataset.waitFor = dataset.i ?? "finished";
    row.append(tag, input, el("span", "vs-unit", tx("pcs")), out);
    return row;
  };
  const renderInventories = () => {
    const map = active();
    stepsBox.querySelectorAll("[data-wait-for]").forEach((out) => {
      const key = out.dataset.waitFor;
      out.textContent = waitText(key === "finished" ? map.finished : map.steps[Number(key)]?.inv);
    });
  };
  const renderSteps = () => {
    const map = active();
    const future = isFuture();
    stepsBox.replaceChildren();
    map.steps.forEach((step, i) => {
      stepsBox.append(inventoryRow(`vs-${i}-inv`, i === 0 ? tx("Inventory before step 1, from {supplier}", { supplier: supplierName() }) : tx("Inventory before step {n}", { n: i + 1 }), step.inv, { i, field: "inv" }));
      const card = el("div", "vs-step");
      const head = el("div", "vs-step-head");
      const nameId = `vs-${i}-name`;
      const name = el("input", "vs-in vs-name");
      Object.assign(name, { id: nameId, value: step.name, placeholder: tx("e.g. Pack"), autocomplete: "off" });
      Object.assign(name.dataset, { i, field: "name" });
      const nameLabel = el("label", "visually-hidden", tx("Name of step {n}", { n: i + 1 }));
      nameLabel.htmlFor = nameId;
      const tools = el("div", "vs-tools");
      tools.append(
        toolButton(tx("Move step {n} up", { n: i + 1 }), "↑", "up", i, i === 0),
        toolButton(tx("Move step {n} down", { n: i + 1 }), "↓", "down", i, i === map.steps.length - 1),
        toolButton(tx("Insert a step after step {n}", { n: i + 1 }), "+", "insert", i, map.steps.length >= MAX_STEPS),
        toolButton(tx("Remove step {n}", { n: i + 1 }), "×", "remove", i),
      );
      head.append(el("span", "vs-no", String(i + 1)), nameLabel, name, tools);
      const grid = el("div", "vs-fields");
      grid.append(
        labelled(`vs-${i}-operators`, tx("Operators"), numberInput(`vs-${i}-operators`, i, "operators", step.operators, "1")),
        labelled(`vs-${i}-ct`, tx("CT (s)"), numberInput(`vs-${i}-ct`, i, "ct", step.ct)),
        labelled(`vs-${i}-co`, tx("C/O (min)"), numberInput(`vs-${i}-co`, i, "co", step.co)),
        labelled(`vs-${i}-uptime`, tx("Uptime %"), numberInput(`vs-${i}-uptime`, i, "uptime", step.uptime)),
        labelled(`vs-${i}-batch`, tx("Batch"), numberInput(`vs-${i}-batch`, i, "batch", step.batch, "1")),
        labelled(`vs-${i}-fpy`, tx("FPY %"), numberInput(`vs-${i}-fpy`, i, "fpy", step.fpy)),
        labelled(`vs-${i}-shifts`, tx("Shifts"), numberInput(`vs-${i}-shifts`, i, "shifts", step.shifts, "1")),
      );
      const vaBox = el("div", "vs-field vs-va");
      const va = el("input");
      Object.assign(va, { id: `vs-${i}-va`, type: "checkbox", checked: step.va });
      Object.assign(va.dataset, { i, field: "va" });
      const vaLabel = el("label", null, tx("Value-added"));
      vaLabel.htmlFor = va.id;
      vaBox.append(va, vaLabel);
      grid.append(vaBox);
      card.append(head, grid);
      if (future) {
        const kaizen = el("textarea", "vs-in vs-kaizen");
        Object.assign(kaizen, { id: `vs-${i}-kaizen`, rows: 2, value: step.kaizen, placeholder: tx("e.g. Pre-formed boxes at the bench") });
        Object.assign(kaizen.dataset, { i, field: "kaizen" });
        card.append(labelled(kaizen.id, tx("Kaizen burst: the change planned at this step"), kaizen, "vs-field vs-kaizen-field"));
      }
      stepsBox.append(card);
    });
    if (map.steps.length) stepsBox.append(inventoryRow("vs-finished", tx("Finished goods before {customer}", { customer: customerName() }), map.finished, { field: "finished" }));
    emptyNote.hidden = map.steps.length > 0;
    addButton.hidden = map.steps.length >= MAX_STEPS;
    stepCount.textContent = !map.steps.length ? "" : map.steps.length === 1 ? tx("{n} step", { n: 1 }) : tx("{n} steps", { n: map.steps.length });
  };
  // Typing updates the state without redrawing the list, so the cursor stays where it is.
  const onField = (event) => {
    const { field: name, i } = event.target.dataset;
    if (!name) return;
    const map = active();
    if (name === "finished") map.finished = event.target.value;
    else if (map.steps[i]) map.steps[i][name] = name === "va" ? event.target.checked : event.target.value;
    else return;
    own();
    save();
    if (name === "inv" || name === "finished") renderInventories();
    renderSoon();
  };
  stepsBox.addEventListener("input", onField);
  stepsBox.addEventListener("change", (event) => { if (event.target.type === "checkbox") onField(event); });
  const focusStep = (i, field = "name") => stepsBox.querySelector(`[data-field="${field}"][data-i="${i}"]`)?.focus();
  stepsBox.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-act]");
    if (!button) return;
    const map = active();
    const i = Number(button.dataset.i);
    const { act } = button.dataset;
    if (act === "up" || act === "down") {
      map.steps = moveStep(map.steps, i, act === "up" ? -1 : 1);
      own();
      save();
      renderSteps();
      renderSoon();
      const to = act === "up" ? i - 1 : i + 1;
      const same = stepsBox.querySelector(`[data-act="${act}"][data-i="${to}"]:not(:disabled)`);
      if (same) same.focus(); else focusStep(to);
      flash(stepStatus, tx("Moved {name} to position {n}.", { name: stepName(map, to), n: to + 1 }));
    } else if (act === "insert") {
      if (map.steps.length >= MAX_STEPS) return;
      map.steps = insertStep(map.steps, i);
      own();
      save();
      renderSteps();
      renderSoon();
      focusStep(i + 1);
    } else if (act === "remove") {
      const removed = map.steps[i];
      const label = stepName(map, i);
      map.steps.splice(i, 1);
      own();
      save();
      renderSteps();
      renderResults();
      (stepsBox.querySelector(`[data-field="name"][data-i="${Math.min(i, map.steps.length - 1)}"]`) || addButton).focus();
      undoNote(stepStatus, tx("Removed step {n}: {name}.", { n: i + 1, name: label }), () => {
        const target = active();
        target.steps.splice(Math.min(i, target.steps.length), 0, removed);
        save();
        renderSteps();
        renderResults();
      });
    }
  });
  addButton.addEventListener("click", () => {
    const map = active();
    if (map.steps.length >= MAX_STEPS) return;
    map.steps.push(cleanStep({}));
    own();
    save();
    renderSteps();
    renderSoon();
    focusStep(map.steps.length - 1);
  });

  // Current or future state: the future starts as a copy of the current one, kaizen bursts empty.
  const renderView = () => {
    viewButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === (isFuture() ? "future" : "current"))));
    resetFuture.hidden = !isFuture();
  };
  viewButtons.forEach((button) => button.addEventListener("click", () => {
    const view = button.dataset.view;
    if (view === "future" && !state.hasFuture) {
      state.future = clone(state.current);
      state.future.steps.forEach((step) => { step.kaizen = ""; });
      state.hasFuture = true;
      flash(viewNote, tx("The future state starts as a copy of the current one. Change what the improvements change, and write each one as a kaizen burst."));
    } else {
      flash(viewNote, tx("Now drawing: {state}.", { state: viewLabel(view) }));
    }
    state.view = view;
    save();
    renderAll();
  }));
  resetFuture.addEventListener("click", () => {
    if (!window.confirm(tx("Replace the future state with a copy of the current one? Its kaizen bursts go too."))) return;
    state.future = clone(state.current);
    state.future.steps.forEach((step) => { step.kaizen = ""; });
    own();
    save();
    renderAll();
  });

  // Templates and clearing -------------------------------------------------------------------------------------------------
  root.querySelector("[data-fill]").addEventListener("click", () => {
    const template = data.templates.find((item) => item.id === templateSelect.value) || data.templates[0];
    const map = active();
    if (map.steps.length && !window.confirm(tx("Replace the {n} steps of this state with the template?", { n: map.steps.length }))) return;
    const filled = fromTemplate(template);
    map.steps = filled.steps;
    map.finished = filled.finished;
    Object.entries(template.header || {}).forEach(([name, value]) => { if (name in defaults && !String(state[name]).trim()) state[name] = String(value); });
    own();
    save();
    renderAll();
    flash(templateStatus, tx("{n} steps added. Now count the pieces waiting before each one.", { n: map.steps.length }));
  });
  root.querySelector("[data-example]").addEventListener("click", () => {
    loadExample();
    save();
    renderAll();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.current.steps.length && !state.hasFuture) return;
    if (!window.confirm(tx("Clear the whole map, current and future state?"))) return;
    clearAll();
  });

  // The map ----------------------------------------------------------------------------------------------------------------
  // Supplier and customer as factories, the steps as process boxes with their data boxes, triangles for the pieces
  // waiting, push arrows between, the lead-time ladder along the bottom and the totals at the right.
  const S = (tag, attrs, content) => CK.svgEl(tag, attrs, content);
  const shorten = (value, max) => (String(value).length > max ? `${String(value).slice(0, max - 1)}…` : String(value));
  const tipOf = (node, content) => { node.setAttribute("data-tip", content); node.classList.add("ck-hit"); return node; };
  const drawMap = (result, map, { future }) => {
    const C = CK.C;
    const n = result.steps.length;
    const PAD = 16, ICON = 112, BOX = 140, GAP = 104, TOTALS = 190;
    const xStep = (i) => PAD + ICON + GAP + i * (BOX + GAP);
    const xCustomer = PAD + ICON + GAP + n * (BOX + GAP);
    const xTotals = xCustomer + ICON + 26;
    const W = xTotals + TOTALS + PAD, H = 352;
    const title = `${data.title} · ${viewLabel(future ? "future" : "current")}${state.family.trim() ? ` · ${state.family.trim()}` : ""}`;
    const svg = S("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": title, class: "ck-chart vs-map-svg", "font-family": "Inter, Segoe UI, Roboto, Arial, sans-serif" });
    svg.style.minWidth = `${Math.round(W * 0.6)}px`;
    svg.append(S("title", {}, title));
    svg.append(S("text", { x: PAD, y: 24, "font-size": 15, "font-weight": 800, fill: C.text }, shorten(`${viewLabel(future ? "future" : "current")}${state.family.trim() ? ` · ${state.family.trim()}` : ""}`, 70)));
    if (result.takt) svg.append(S("text", { x: W - PAD, y: 24, "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.target }, `${tx("Takt")} ${sec(result.takt)} · ${tx("{n} per day", { n: int.format(result.demand) })}`));

    const factory = (x, name, role, extra) => {
      const g = S("g");
      const t = ICON / 3, top = 62;
      g.append(S("path", { d: `M${x} ${top + 78} V${top} L${x + t} ${top + 20} V${top} L${x + 2 * t} ${top + 20} V${top} L${x + 3 * t} ${top + 20} V${top + 78} Z`, fill: C.paper, stroke: C.text, "stroke-width": 2, "stroke-linejoin": "round" }));
      g.append(S("text", { x: x + ICON / 2, y: top + 54, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.text }, shorten(name, 16)));
      g.append(S("text", { x: x + ICON / 2, y: top + 96, "text-anchor": "middle", "font-size": 11, "font-weight": 800, "letter-spacing": ".08em", fill: C.muted }, role.toUpperCase()));
      if (extra) g.append(S("text", { x: x + ICON / 2, y: top + 112, "text-anchor": "middle", "font-size": 11, fill: C.muted }, extra));
      svg.append(tipOf(g, `${role}: ${name}${extra ? `\n${extra}` : ""}`));
    };
    factory(PAD, supplierName(), tx("Supplier"));
    factory(xCustomer, customerName(), tx("Customer"), result.demand > 0 ? tx("{n} per day", { n: int.format(result.demand) }) : "");

    // A push arrow: the striped arrow of a step that produces whether or not the next one needs it.
    const pushArrow = (x1, x2, y) => {
      const g = S("g", { "pointer-events": "none" });
      const end = x2 - 12;
      g.append(S("rect", { x: x1, y: y - 6, width: Math.max(0, end - x1), height: 12, fill: C.paper, stroke: C.text, "stroke-width": 1.5 }));
      for (let x = x1 + 3; x + 4 < end; x += 9) g.append(S("rect", { x, y: y - 6, width: 4, height: 12, fill: C.text }));
      g.append(S("polygon", { points: `${end},${y - 12} ${x2},${y} ${end},${y + 12}`, fill: C.text }));
      svg.append(g);
    };
    // An inventory triangle in a gap, with the pieces and the time they mean.
    const triangle = (gx, pieces, wait, where) => {
      const g = S("g");
      g.append(S("polygon", { points: `${gx},${74} ${gx - 23},${114} ${gx + 23},${114}`, fill: C.paper, stroke: pieces > 0 ? C.text : C.grid, "stroke-width": 2, "stroke-linejoin": "round" }));
      g.append(S("text", { x: gx, y: 109, "text-anchor": "middle", "font-size": 15, "font-weight": 800, fill: pieces > 0 ? C.text : C.muted }, "I"));
      g.append(S("text", { x: gx, y: 132, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.text }, `${int.format(Math.round(pieces))} ${tx("pcs")}`));
      if (wait > 0) g.append(S("text", { x: gx, y: 147, "text-anchor": "middle", "font-size": 11, fill: C.muted }, dur(wait, result.minutes)));
      svg.append(tipOf(g, `${where}\n${int.format(Math.round(pieces))} ${tx("pcs")}${wait > 0 ? ` = ${dur(wait, result.minutes)}` : ""}`));
    };

    const yHigh = 272, yLow = 304;
    let path = `M${PAD + ICON} ${yHigh}`;
    const ladderHit = (x, width, y, content) => svg.append(tipOf(S("rect", { x, y: y - 12, width, height: 24, fill: "transparent" }), content));
    result.steps.forEach((step, i) => {
      const x = xStep(i), gapStart = x - GAP;
      const name = stepName(map, i);
      // The gap in front of the step: the triangle, the push arrow, the high rung of the ladder.
      triangle(gapStart + GAP / 2, step.inv, step.wait, i === 0 ? tx("Inventory before step 1, from {supplier}", { supplier: supplierName() }) : tx("Inventory before step {n}", { n: i + 1 }));
      pushArrow(gapStart + 8, x - 6, 178);
      path += ` H${x} V${yLow} H${x + BOX} V${yHigh}`;
      svg.append(S("text", { x: gapStart + GAP / 2, y: yHigh - 8, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.text }, dur(step.wait, result.minutes)));
      ladderHit(gapStart, GAP, yHigh, `${tx("Waiting before {name}", { name })}: ${dur(step.wait, result.minutes)}`);
      svg.append(S("text", { x: x + BOX / 2, y: yLow + 18, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.blue }, sec(step.ct)));
      ladderHit(x, BOX, yLow, `${tx("Processing")} · ${name}: ${sec(step.ct)}`);

      // The process box and its data box.
      const g = S("g");
      const hot = step.overTakt;
      const isBottleneck = result.bottleneck && result.bottleneck.index === i;
      g.append(S("rect", { x, y: 66, width: BOX, height: 160, fill: "transparent" }));
      g.append(S("rect", { x, y: 66, width: BOX, height: 62, rx: 3, fill: C.paper, stroke: hot ? C.top : C.text, "stroke-width": isBottleneck ? 3 : 2 }));
      g.append(S("text", { x: x + BOX / 2, y: 88, "text-anchor": "middle", "font-size": 13, "font-weight": 800, fill: C.text }, shorten(name, 18)));
      g.append(S("line", { x1: x, x2: x + BOX, y1: 98, y2: 98, stroke: C.grid }));
      // The operator: a head and shoulders, then the count.
      g.append(S("circle", { cx: x + 16, cy: 108, r: 4, fill: "none", stroke: C.text, "stroke-width": 1.5 }));
      g.append(S("path", { d: `M${x + 9} ${121} Q${x + 16} ${111} ${x + 23} ${121}`, fill: "none", stroke: C.text, "stroke-width": 1.5 }));
      g.append(S("text", { x: x + 28, y: 120, "font-size": 12, "font-weight": 700, fill: C.text }, int.format(step.operators)));
      g.append(S("text", { x: x + BOX - 8, y: 120, "text-anchor": "end", "font-size": 11, "font-weight": 800, "letter-spacing": ".06em", fill: step.va ? C.blue : C.muted }, step.va ? "VA" : "NVA"));
      g.append(S("rect", { x, y: 134, width: BOX, height: 92, fill: "none", stroke: C.grid, "stroke-width": 1.5 }));
      const lines = [
        [tx("CT"), sec(step.ct)],
        [tx("CT/op"), `${hot ? "▲ " : ""}${sec(step.eff)}`, hot],
        [tx("C/O"), tx("{n} min", { n: num(step.co, Number.isInteger(step.co) ? 0 : 1) })],
        [tx("Uptime"), `${num(step.uptime, Number.isInteger(step.uptime) ? 0 : 1)} %`],
        [tx("FPY"), `${num(step.fpy, Number.isInteger(step.fpy) ? 0 : 1)} %`],
        [tx("Batch · shifts"), `${int.format(step.batch)} · ${int.format(step.shifts)}`],
      ];
      lines.forEach(([label, value, alert], k) => {
        const y = 149 + k * 14.4;
        g.append(S("text", { x: x + 8, y, "font-size": 11, fill: C.muted }, label));
        g.append(S("text", { x: x + BOX - 8, y, "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: alert ? C.top : C.text }, value));
      });
      const tipLines = [
        `${i + 1} · ${name}${isBottleneck ? ` · ${tx("Bottleneck")}` : ""}`,
        `${tx("CT")} ${sec(step.ct)} · ${tx("operators")} ${int.format(step.operators)} · ${tx("CT/op")} ${sec(step.eff)}`,
        result.takt ? (step.gap > 0 ? tx("{t} above takt", { t: sec(step.gap) }) : tx("{t} under takt", { t: sec(-step.gap) })) : "",
        `${tx("C/O")} ${tx("{n} min", { n: num(step.co, 1) })} · ${tx("Uptime")} ${num(step.uptime, 1)} % · ${tx("FPY")} ${num(step.fpy, 1)} %`,
        step.capacity ? tx("Capacity {n} per day, {u} of it used", { n: int.format(Math.floor(step.capacity)), u: share(step.utilisation ?? 0) }) : "",
        future && step.kaizen ? `${tx("Kaizen burst")}: ${step.kaizen}` : "",
      ].filter(Boolean);
      svg.append(tipOf(g, tipLines.join("\n")));

      // The kaizen burst of the future state: a starburst on the box, the change written beside it.
      if (future && step.kaizen) {
        const k = S("g");
        const cx = x + 14, cy = 50, points = [];
        for (let p = 0; p < 24; p++) {
          const r = p % 2 ? 9 : 18, a = (Math.PI * p) / 12 - Math.PI / 2;
          points.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
        }
        k.append(S("polygon", { points: points.join(" "), fill: C.soft, stroke: C.blue, "stroke-width": 1.5, "stroke-linejoin": "round" }));
        k.append(S("text", { x: cx, y: cy + 4, "text-anchor": "middle", "font-size": 11, "font-weight": 800, fill: C.text }, "K"));
        k.append(S("text", { x: x + 36, y: 54, "font-size": 11, "font-weight": 700, fill: C.blue }, shorten(step.kaizen, 16)));
        svg.append(tipOf(k, `${tx("Kaizen burst")} · ${name}\n${step.kaizen}`));
      }
    });
    // After the last step: the finished goods, the arrow to the customer and the last rung.
    const lastGap = xCustomer - GAP;
    if (result.finished > 0) triangle(lastGap + GAP / 2, result.finished, result.finishedWait, tx("Finished goods before {customer}", { customer: customerName() }));
    pushArrow(n ? lastGap + 8 : PAD + ICON + 8, xCustomer - 6, 178);
    path += ` H${xCustomer}`;
    if (result.finishedWait > 0) {
      svg.append(S("text", { x: lastGap + GAP / 2, y: yHigh - 8, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.text }, dur(result.finishedWait, result.minutes)));
      ladderHit(lastGap, GAP, yHigh, `${tx("Waiting")} · ${tx("Finished goods before {customer}", { customer: customerName() })}: ${dur(result.finishedWait, result.minutes)}`);
    }
    svg.append(S("path", { d: path, fill: "none", stroke: C.text, "stroke-width": 2, "stroke-linejoin": "round", "pointer-events": "none" }));
    svg.append(S("text", { x: PAD, y: yHigh + 4, "font-size": 11, "font-weight": 700, fill: C.muted }, tx("Waiting")));
    svg.append(S("text", { x: PAD, y: yLow + 4, "font-size": 11, "font-weight": 700, fill: C.blue }, tx("Processing")));

    // The totals at the right of the ladder.
    const totals = S("g");
    totals.append(S("rect", { x: xTotals, y: 236, width: TOTALS, height: 100, rx: 6, fill: C.paper, stroke: C.text, "stroke-width": 1.5 }));
    [[tx("Lead time"), dur(result.lead, result.minutes)], [tx("Process time"), dur(result.process, result.minutes)], [tx("Value-added time"), dur(result.va, result.minutes)], ["PCE", share(result.pce)]].forEach(([label, value], k) => {
      const y = 258 + k * 22;
      totals.append(S("text", { x: xTotals + 10, y, "font-size": 11, fill: C.muted }, label));
      totals.append(S("text", { x: xTotals + TOTALS - 10, y, "text-anchor": "end", "font-size": k ? 12 : 14, "font-weight": 800, fill: k ? C.text : C.blue }, value));
    });
    svg.append(tipOf(totals, `${tx("Lead time")} ${dur(result.lead, result.minutes)}\n${tx("Process time")} ${dur(result.process, result.minutes)} · ${tx("Value-added time")} ${dur(result.va, result.minutes)}\nPCE ${share(result.pce)}`));
    return svg;
  };

  // Results ------------------------------------------------------------------------------------------------------------------
  const stepRows = () => {
    const header = [tx("State"), tx("Step"), tx("Name"), tx("Operators"), tx("CT (s)"), tx("CT per operator (s)"), tx("C/O (min)"), tx("Uptime %"), tx("Batch"), tx("FPY %"), tx("Shifts"), tx("Value-added"), tx("Inventory before (pcs)"), tx("Wait before (min)"), tx("Capacity per day"), tx("Utilisation %"), tx("Kaizen burst")];
    const rows = [header];
    const states = [["current", state.current], ...(state.hasFuture ? [["future", state.future]] : [])];
    states.forEach(([view, map]) => {
      const result = resultOf(map);
      result.steps.forEach((step, i) => rows.push([viewLabel(view), i + 1, stepName(map, i), step.operators, step.ct, Math.round(step.eff * 100) / 100, step.co, step.uptime, step.batch, step.fpy, step.shifts, step.va ? tx("yes") : tx("no"),
        step.inv, Math.round((step.wait / 60) * 10) / 10, step.capacity ? Math.floor(step.capacity) : "", step.utilisation !== null ? Math.round(step.utilisation * 1000) / 10 : "", view === "future" ? step.kaizen : ""]));
      rows.push([viewLabel(view), "", tx("Finished goods"), "", "", "", "", "", "", "", "", "", result.finished, Math.round((result.finishedWait / 60) * 10) / 10, "", "", ""]);
    });
    return rows;
  };
  const kaizenSteps = () => (state.hasFuture ? state.future.steps.map((step, i) => ({ i, name: stepName(state.future, i), kaizen: step.kaizen.trim() })).filter((item) => item.kaizen) : []);
  const summaryText = (now, next) => {
    const lines = [`${data.title} | Stiven Catalyst`];
    if (state.family.trim()) lines.push(state.family.trim());
    lines.push(`${supplierName()} → ${customerName()}`);
    if (now.takt) lines.push(`${tx("Takt")}: ${sec(now.takt)} (${tx("{n} per day", { n: int.format(now.demand) })}, ${tx("{n} min", { n: int.format(now.minutes) })})`);
    const block = (label, result, map) => {
      lines.push("", `${label}: ${tx("lead time")} ${dur(result.lead, result.minutes)} · ${tx("process time")} ${dur(result.process, result.minutes)} · PCE ${share(result.pce)}${result.yield !== null ? ` · ${tx("rolled yield")} ${share(result.yield)}` : ""}`);
      if (result.bottleneck) lines.push(`${tx("Bottleneck")}: ${stepName(map, result.bottleneck.index)} ${sec(result.bottleneck.eff)}${result.takt ? ` (${result.bottleneck.gap > 0 ? "+" : ""}${num(result.bottleneck.gap, 1)} s)` : ""}`);
      result.steps.forEach((step, i) => lines.push(`${step.inv > 0 ? `  ▲ ${int.format(step.inv)} ${tx("pcs")} = ${dur(step.wait, result.minutes)}\n` : ""}${i + 1}. ${stepName(map, i)} · ${tx("CT")} ${sec(step.ct)} · ${tx("operators")} ${int.format(step.operators)} · ${tx("CT/op")} ${sec(step.eff)} · ${tx("C/O")} ${tx("{n} min", { n: num(step.co, 0) })} · ${tx("Uptime")} ${num(step.uptime, 0)} % · ${tx("FPY")} ${num(step.fpy, 1)} %${step.va ? " · VA" : ""}`));
      if (result.finished > 0) lines.push(`  ▲ ${int.format(result.finished)} ${tx("pcs")} = ${dur(result.finishedWait, result.minutes)}`);
    };
    block(tx("Current state"), now, state.current);
    if (next) {
      block(tx("Future state"), next, state.future);
      const diff = compare(now, next);
      if (diff.leadShare !== null) lines.push("", tx("The future state cuts the lead time by {share}: {now} → {next}.", { share: share(diff.leadShare), now: dur(now.lead, now.minutes), next: dur(next.lead, next.minutes) }));
      const bursts = kaizenSteps();
      if (bursts.length) lines.push("", `${tx("Kaizen bursts")}:`, ...bursts.map((item) => `- ${item.name}: ${item.kaizen}`));
    }
    return lines.join("\n");
  };

  const renderResults = () => {
    const map = active();
    const future = isFuture();
    const result = resultOf(map);
    const now = resultOf(state.current);
    const next = state.hasFuture ? resultOf(state.future) : null;
    note.hidden = !state.example;
    results.replaceChildren();
    results.hidden = !map.steps.length;
    if (!map.steps.length) return;
    const t = result.takt;
    const b = result.bottleneck;
    const bName = b ? stepName(map, b.index) : "";

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${viewLabel(future ? "future" : "current")}${state.family.trim() ? ` · ${state.family.trim()}` : ""}`));
    const title = el("h2");
    if (!(result.demand > 0 && result.minutes > 0)) {
      title.append(tx("Add the demand and the working minutes to turn the inventories into time."));
    } else {
      const [before, after] = tx("A piece spends {lead} in this stream, {work} of it being worked on.", { lead: "\u0000", work: dur(result.process, result.minutes) }).split("\u0000");
      title.append(before, el("span", null, dur(result.lead, result.minutes)), after);
    }
    head.append(title);

    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Lead time"), dur(result.lead, result.minutes), result.leadDays !== null ? tx("{days} working days · {pieces} pcs waiting", { days: num(result.leadDays, 2), pieces: int.format(Math.round(result.pieces)) }) : tx("{pieces} pcs waiting", { pieces: int.format(Math.round(result.pieces)) })));
    stats.append(stat(tx("Process time"), dur(result.process, result.minutes), tx("value-added {va}", { va: dur(result.va, result.minutes) })));
    stats.append(stat("PCE", share(result.pce), tx("value-added time ÷ lead time")));
    stats.append(stat(tx("Takt"), t ? sec(t) : "–", t ? tx("{demand} per day in {minutes} min", { demand: int.format(result.demand), minutes: int.format(result.minutes) }) : tx("demand and working minutes missing")));
    if (b) stats.append(stat(tx("Bottleneck"), bName, `${sec(b.eff)} ${tx("per piece")}${t ? ` · ${b.gap > 0 ? tx("{t} above takt", { t: sec(b.gap) }) : tx("{t} under takt", { t: sec(-b.gap) })}` : ""}`));
    if (result.yield !== null) stats.append(stat(tx("Rolled yield"), share(result.yield), tx("first-pass yields of all steps multiplied")));

    // The map itself comes right after the numbers: it is the answer, not the evidence.
    const notes = [];
    if (CK) {
      const mapBox = el("div", "vs-map");
      mapBox.append(el("p", "result-label", `${tx("Map")} · ${viewLabel(future ? "future" : "current")}`));
      mapBox.append(CK.figure(drawMap(result, map, { future }), { fileName: `${data.csv}-${future ? "future" : "current"}`, caption: tx("Point at a step, a triangle or the ladder for its numbers. On the ladder the waits sit high and the processing low; the totals are at the right.") }));
      notes.push(mapBox);
    }
    if (result.steps.some((step) => step.ct <= 0)) notes.push(el("p", "dl-warning", tx("{n} steps have no cycle time yet and count as 0 s.", { n: result.steps.filter((step) => step.ct <= 0).length })));
    const loaded = result.overloaded.filter((step) => !step.overTakt);
    if (loaded.length) notes.push(el("p", "dl-warning", tx("{steps}: under takt on paper, but with uptime and changeovers they need more than the working day.", { steps: loaded.map((step) => stepName(map, step.index)).join(", ") })));
    if (!state.hasFuture) notes.push(el("p", "dl-panel-note", data.advice.noFuture));

    // Where to start: the step above takt, or the largest wait when the flow keeps up.
    let focus = null;
    if (b) {
      const longest = result.longestWait;
      const longestName = longest ? (longest.step >= result.steps.length ? tx("Finished goods before {customer}", { customer: customerName() }) : tx("Waiting before {name}", { name: stepName(map, longest.step) })) : "";
      focus = focusCard({
        title: result.over.length ? bName : longest ? longestName : bName,
        detail: result.over.length ? tx("{t} above takt", { t: sec(b.gap) }) : longest ? dur(longest.seconds, result.minutes) : sec(b.eff),
        lede: result.over.length
          ? tx("{name} releases a piece every {eff}, the customer takes one every {takt}. The steps after it starve, the pile in front of it grows.", { name: bName, eff: sec(b.eff), takt: sec(t) })
          : tx("Every step keeps up with takt. The lead time is in the piles: {waits} of waiting against {work} of work.", { waits: dur(result.wait, result.minutes), work: dur(result.process, result.minutes) }),
        advice: result.over.length ? data.advice.over : data.advice.flow,
        extraLabel: longest ? tx("Largest wait") : undefined,
        extra: longest ? tx("{where}: {pieces} pcs, {time} of the lead time ({share}).", { where: longestName, pieces: int.format(Math.round(longest.pieces)), time: dur(longest.seconds, result.minutes), share: share(result.lead > 0 ? longest.seconds / result.lead : 0) }) : undefined,
        warning: [result.pce !== null && result.pce < 0.05 ? data.advice.lowPce : "", result.yield !== null && result.yield < 0.9 ? data.advice.yield : ""].filter(Boolean).join(" "),
      });
    }

    // Actions: copy, print, 5 Whys on the bottleneck, the kaizen bursts to the Action Tracker, the steps as a file.
    const problem = b && result.over.length ? tx("{name} is above takt in the value stream: {eff} per piece against {takt}", { name: bName, eff: sec(b.eff), takt: sec(t) })
      : tx("The lead time of {family} is {lead} for {work} of work", { family: state.family.trim() || data.title, lead: dur(result.lead, result.minutes), work: dur(result.process, result.minutes) });
    const actions = resultActions(() => summaryText(now, next), problem);
    const bursts = kaizenSteps();
    if (window.ActionsStore && bursts.length) {
      const send = el("button", "button-secondary", tx("Send kaizen bursts to the Action Tracker"));
      send.type = "button";
      send.addEventListener("click", () => {
        const open = window.ActionsStore.list().filter(window.ActionsStore.isOpen);
        let added = 0, already = 0;
        const nowBottleneck = now.bottleneck ? now.bottleneck.index : -1;
        bursts.forEach((item) => {
          const title = `${item.name}: ${item.kaizen}`;
          if (open.some((action) => action.title === title && action.source === "value-stream-map")) { already++; return; }
          window.ActionsStore.add({
            title, source: "value-stream-map", area: item.name,
            priority: now.steps[item.i]?.overTakt || item.i === nowBottleneck ? "High" : "Medium",
            detail: tx("Kaizen burst on the future state of {family}. Lead time today {now}, planned {next}.", { family: state.family.trim() || data.title, now: dur(now.lead, now.minutes), next: dur(next.lead, next.minutes) }),
            check: tx("Map the stream again after the change: the lead time should move towards {next}.", { next: dur(next.lead, next.minutes) }),
          });
          added++;
        });
        const status = actions.querySelector("[data-actions-status]") || el("p", "form-note vs-actions-status");
        status.dataset.actionsStatus = "";
        status.setAttribute("role", "status");
        const link = el("a", "inline-link", tx("Open the Action Tracker"));
        link.href = window.ActionsStore.trackerUrl().href;
        status.replaceChildren(tx("Added {n} actions.", { n: added }), already ? ` ${tx("{n} were already open.", { n: already })}` : "", " ", link);
        actions.append(status);
      });
      actions.append(send);
    }
    const csv = el("button", "button-secondary", tx("Download CSV"));
    csv.type = "button";
    csv.addEventListener("click", () => downloadCsv(data.csv, stepRows()));
    const xlsx = el("button", "button-secondary", tx("Download Excel"));
    xlsx.type = "button";
    xlsx.addEventListener("click", () => downloadXlsx(data.csv, stepRows()));
    actions.append(csv, xlsx);

    // The evidence: cycle times against takt, lead time by step, the two states side by side, the step table.
    const panels = [];
    if (CK) {
      const ctPanel = panel(tx("Cycle time per step against takt"), tx("Each column is the time between two pieces leaving a step: CT ÷ operators. A column above the takt line cannot keep up with the customer."));
      ctPanel.append(CK.figure(CK.bars(result.steps.map((step, i) => ({ label: stepName(map, i), value: Math.round(step.eff * 10) / 10, tip: `${stepName(map, i)}: ${sec(step.eff)}${t ? ` · ${step.gap > 0 ? tx("{t} above takt", { t: sec(step.gap) }) : tx("{t} under takt", { t: sec(-step.gap) })}` : ""}` })), {
        title: `${data.title}: ${tx("Cycle time per step against takt")}`, unit: "s", target: t || undefined, targetLabel: tx("Takt"), format: (v) => num(v, 1),
      }), { fileName: `${data.csv}-cycle-times` }));
      panels.push(ctPanel);

      const leadPanel = panel(tx("Lead time by step"), tx("The wait in front of each step and the step's own processing, in minutes. The processing is the thin sliver at the top, if you can see it at all."));
      const waiting = tx("Waiting"), processing = tx("Processing");
      const groups = result.steps.map((step, i) => ({ label: stepName(map, i), parts: [{ key: waiting, value: Math.round((step.wait / 60) * 10) / 10 }, { key: processing, value: Math.round((step.ct / 60) * 100) / 100 }] }));
      if (result.finished > 0) groups.push({ label: tx("Finished goods"), parts: [{ key: waiting, value: Math.round((result.finishedWait / 60) * 10) / 10 }] });
      leadPanel.append(CK.figure(CK.stacked(groups, { keys: [waiting, processing], colors: { [waiting]: CK.C.muted, [processing]: CK.C.blue }, title: `${data.title}: ${tx("Lead time by step")}`, unit: "min", format: (v) => num(v, v >= 100 ? 0 : 1) }), { fileName: `${data.csv}-lead-time` }));
      panels.push(leadPanel);
    }
    if (next) {
      const diff = compare(now, next);
      const comparePanel = panel(tx("Current and future state"), diff.leadShare !== null && diff.leadShare > 0
        ? tx("The future state cuts the lead time by {share}: {now} → {next}.", { share: share(diff.leadShare), now: dur(now.lead, now.minutes), next: dur(next.lead, next.minutes) })
        : tx("The future state does not shorten the lead time yet. Lower the inventories between the steps: they are the waits."));
      const wrap = el("div", "dl-table-wrap");
      wrap.tabIndex = 0;
      const table = el("table", "dl-table vs-compare");
      const thead = el("thead");
      const hr = el("tr");
      [["", null], [tx("Current state"), "num"], [tx("Future state"), "num"], [tx("Change"), "num"]].forEach(([label, cls]) => { const th = el("th", cls, label); th.scope = "col"; hr.append(th); });
      thead.append(hr);
      const tbody = el("tbody");
      const signed = (value, format) => (Math.abs(value) < 1e-9 ? "±0" : `${value > 0 ? "+" : "−"}${format(Math.abs(value))}`);
      [
        [tx("Lead time"), dur(now.lead, now.minutes), dur(next.lead, next.minutes), signed(diff.lead, (v) => dur(v, now.minutes))],
        [tx("Process time"), dur(now.process, now.minutes), dur(next.process, next.minutes), signed(diff.process, (v) => dur(v, now.minutes))],
        ["PCE", share(now.pce), share(next.pce), signed(diff.pce * 100, (v) => `${num(v, 2)} pp`)],
        [tx("Pieces waiting"), int.format(Math.round(now.pieces)), int.format(Math.round(next.pieces)), signed(diff.pieces, (v) => int.format(Math.round(v)))],
        [tx("Bottleneck"), now.bottleneck ? `${stepName(state.current, now.bottleneck.index)} ${sec(now.bottleneck.eff)}` : "–", next.bottleneck ? `${stepName(state.future, next.bottleneck.index)} ${sec(next.bottleneck.eff)}` : "–", ""],
        [tx("Steps above takt"), int.format(now.over.length), int.format(next.over.length), signed(next.over.length - now.over.length, (v) => int.format(v))],
        [tx("Rolled yield"), share(now.yield), share(next.yield), ""],
      ].forEach(([label, a, c, d]) => {
        const tr = el("tr");
        const th = el("th", null, label);
        th.scope = "row";
        tr.append(th, el("td", "num", a), el("td", "num vs-strong", c), el("td", "num", d));
        tbody.append(tr);
      });
      table.append(thead, tbody);
      wrap.append(table);
      comparePanel.append(wrap);
      if (CK) {
        const hours = Math.max(now.lead, next.lead) >= 7200;
        const value = (seconds) => Math.round((hours ? seconds / 3600 : seconds / 60) * 10) / 10;
        comparePanel.append(CK.figure(CK.bars([
          { label: tx("Current state"), value: value(now.lead), color: CK.C.muted, tip: `${tx("Current state")}: ${dur(now.lead, now.minutes)}` },
          { label: tx("Future state"), value: value(next.lead), color: CK.C.blue, tip: `${tx("Future state")}: ${dur(next.lead, next.minutes)}` },
        ], { title: `${data.title}: ${tx("Lead time")}`, unit: hours ? "h" : "min", format: (v) => num(v, 1) }), { fileName: `${data.csv}-compare` }));
      }
      panels.push(comparePanel);
    }

    const tablePanel = panel(tx("The steps in numbers"), tx("Capacity is what a step can release in the working day with its uptime and its share of the changeovers. Over 100 % used, it cannot keep up even when its cycle time is under takt."));
    tablePanel.classList.add("vs-table-panel");
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table vs-table");
    const thead = el("thead");
    const hr = el("tr");
    [[tx("Step")], [tx("Before it"), "num"], [tx("CT"), "num"], [tx("CT/op"), "num"], [tx("C/O"), "num"], [tx("Uptime"), "num"], [tx("FPY"), "num"], [tx("Capacity per day"), "num"], [tx("Used"), "num"]].forEach(([label, cls]) => { const th = el("th", cls, label); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const tbody = el("tbody");
    result.steps.forEach((step, i) => {
      const tr = el("tr");
      if (step.overTakt) tr.classList.add("is-over");
      const nameCell = el("td");
      nameCell.append(el("strong", null, `${i + 1} · ${stepName(map, i)}`));
      if (step.va) nameCell.append(" ", el("span", "dl-tag", "VA"));
      tr.append(nameCell,
        el("td", "num", step.inv > 0 ? `${int.format(step.inv)} · ${dur(step.wait, result.minutes)}` : "–"),
        el("td", "num", sec(step.ct)),
        el("td", `num${step.overTakt ? " vs-alert" : ""}`, `${step.overTakt ? "▲ " : ""}${sec(step.eff)}`),
        el("td", "num", tx("{n} min", { n: num(step.co, Number.isInteger(step.co) ? 0 : 1) })),
        el("td", "num", `${num(step.uptime, Number.isInteger(step.uptime) ? 0 : 1)} %`),
        el("td", "num", `${num(step.fpy, Number.isInteger(step.fpy) ? 0 : 1)} %`),
        el("td", "num", step.capacity ? int.format(Math.floor(step.capacity)) : "–"),
        el("td", `num${step.utilisation > 1 ? " vs-alert" : ""}`, step.utilisation !== null ? `${step.utilisation > 1 ? "▲ " : ""}${share(step.utilisation)}` : "–"));
      tbody.append(tr);
    });
    table.append(thead, tbody);
    wrap.append(table);
    tablePanel.append(wrap);
    panels.push(tablePanel);

    resultLayout(results, { head, stats, notes, focus, actions, panels });
  };
  const renderSoon = renderOnPause(renderResults, () => 1, 0);

  const renderAll = () => {
    headerInputs.forEach((input) => { input.value = state[input.name] ?? ""; });
    renderTakt();
    renderView();
    renderSteps();
    renderResults();
  };
  renderAll();
})();
