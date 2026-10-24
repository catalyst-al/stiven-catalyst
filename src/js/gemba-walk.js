// The Gemba Walk: layered process audits (LPA) and waste walks on the floor. An LPA asks the questions of one layer
// (team lead, area manager, site lead) for one checklist and answers each with yes, no or n.a.; a waste walk counts
// what the walker sees of the eight wastes plus Mura and Muri. The log keeps every walk, the schedule says which layer
// is due, and the results show compliance per week, the wastes, where the "no" answers sit and what to fix first.
// The arithmetic lives in window.GembaMath, so tests can call it.
(() => {
  const ANSWERS = ["yes", "no", "na"];
  const CADENCES = ["daily", "weekly", "monthly"];
  // The vital few: the largest wastes that together make up 80 % of the count.
  const VITAL_SHARE = 0.8;
  const MAX_WEEKS = 12;
  const MAX_QUESTION_COLS = 10;
  const COMPLIANCE_TARGET = 0.9;

  const isDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return iso;
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  // The same day next month; the 31st becomes the last day of a shorter month.
  const addMonths = (iso, months) => {
    const [y, m, d] = iso.split("-").map(Number);
    const first = new Date(Date.UTC(y, m - 1 + months, 1));
    const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    first.setUTCDate(Math.min(d, last));
    return first.toISOString().slice(0, 10);
  };
  const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 864e5);
  const mondayOf = (iso) => addDays(iso, -((new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7));
  const nextDue = (last, cadence) => {
    if (!isDate(last)) return "";
    if (cadence === "monthly") return addMonths(last, 1);
    return addDays(last, cadence === "weekly" ? 7 : 1);
  };

  // Compliance counts yes against yes + no; n.a. is left out, an unanswered question too.
  const compliance = (answers) => {
    const list = Array.isArray(answers) ? answers : [];
    const yes = list.filter((a) => a === "yes").length;
    const no = list.filter((a) => a === "no").length;
    const na = list.filter((a) => a === "na").length;
    return { yes, no, na, answered: yes + no + na, total: list.length, pct: yes + no ? yes / (yes + no) : null };
  };
  const isLpa = (row) => row.type === "lpa";
  const isWaste = (row) => row.type === "waste";
  // Compliance over many walks: every answer weighs the same, so a long walk counts more than a short one.
  const combined = (rows) => {
    let yes = 0;
    let no = 0;
    rows.filter(isLpa).forEach((row) => { const c = compliance(row.answers); yes += c.yes; no += c.no; });
    return { yes, no, pct: yes + no ? yes / (yes + no) : null };
  };
  const byDate = (a, b) => String(a.date).localeCompare(String(b.date));

  // Per layer: the last walk, the next due date from the cadence, and whether it is late.
  const schedule = (rows, layers, cadences, today) => layers.map((layer) => {
    const cadence = CADENCES.includes(cadences?.[layer]) ? cadences[layer] : "weekly";
    const last = rows.filter((row) => row.layer === layer && isDate(row.date) && row.date <= today).map((row) => row.date).sort().at(-1) || "";
    const due = nextDue(last, cadence);
    const status = !last ? "never" : due < today ? "overdue" : due === today ? "due" : "ok";
    return { layer, cadence, last, due, status, late: status === "overdue" ? daysBetween(due, today) : 0 };
  });

  // Compliance per week (weeks start on Monday) and layer, the newest weeks; a week without an LPA of a layer is null.
  const weekly = (rows, layers, maxWeeks = MAX_WEEKS) => {
    const lpa = rows.filter((row) => isLpa(row) && isDate(row.date));
    const weeks = [...new Set(lpa.map((row) => mondayOf(row.date)))].sort().slice(-maxWeeks);
    const series = {};
    layers.forEach((layer) => {
      series[layer] = weeks.map((week) => combined(lpa.filter((row) => row.layer === layer && mondayOf(row.date) === week)).pct);
    });
    return { weeks, series };
  };

  const wasteTotals = (rows, keys) => {
    const totals = Object.fromEntries(keys.map((key) => [key, 0]));
    rows.filter(isWaste).forEach((row) => keys.forEach((key) => { totals[key] += Math.max(0, Number(row.tallies?.[key]) || 0); }));
    return totals;
  };
  // Largest first; the vital few are the items up to the one that takes the running share to 80 %.
  const vitalFew = (items, share = VITAL_SHARE) => {
    const sorted = items.filter((item) => item.value > 0).sort((a, b) => b.value - a.value);
    const total = sorted.reduce((sum, item) => sum + item.value, 0);
    const few = [];
    let running = 0;
    for (const item of sorted) {
      if (total && running / total >= share) break;
      few.push(item.key);
      running += item.value;
    }
    return few;
  };
  // Area × waste counts of the waste walks.
  const areaWaste = (rows, keys) => {
    const map = {};
    rows.filter(isWaste).forEach((row) => {
      if (!map[row.area]) map[row.area] = Object.fromEntries(keys.map((key) => [key, 0]));
      keys.forEach((key) => { map[row.area][key] += Math.max(0, Number(row.tallies?.[key]) || 0); });
    });
    return map;
  };
  // A question is the same question in every walk of its checklist and layer: "warehouse|team-lead|2".
  const qKey = (row, index) => `${row.template}|${row.layer}|${index}`;
  // Every question that was asked, with its "no" count; the most failed first (then the higher rate, then the order).
  const failCounts = (rows) => {
    const map = new Map();
    rows.filter(isLpa).forEach((row) => (row.answers || []).forEach((answer, index) => {
      if (answer !== "yes" && answer !== "no") return;
      const key = qKey(row, index);
      if (!map.has(key)) map.set(key, { key, template: row.template, layer: row.layer, index, no: 0, asked: 0, areas: {} });
      const item = map.get(key);
      item.asked += 1;
      if (answer === "no") { item.no += 1; item.areas[row.area] = (item.areas[row.area] || 0) + 1; }
    }));
    return [...map.values()].sort((a, b) => b.no - a.no || b.no / b.asked - a.no / a.asked || a.key.localeCompare(b.key));
  };
  // Findings ticked for action and not yet handed to the Action Tracker.
  const openFindings = (rows) => rows.filter(isLpa).flatMap((row) => (row.answers || [])
    .map((answer, index) => ({ row, index, answer }))
    .filter(({ row: r, index, answer }) => answer === "no" && r.acts?.[index] === true && r.sent?.[index] !== true));
  const inMonth = (rows, today) => rows.filter((row) => String(row.date).slice(0, 7) === today.slice(0, 7) && row.date <= today);
  const lastDays = (rows, today, days) => { const from = addDays(today, -(days - 1)); return rows.filter((row) => row.date >= from && row.date <= today); };
  const elapsed = (timer, now) => Math.max(0, (Number(timer?.elapsed) || 0) + (timer?.started ? now - timer.started : 0));
  const clock = (ms) => { const s = Math.floor(ms / 1000); const h = Math.floor(s / 3600); const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0"); const ss = String(s % 60).padStart(2, "0"); return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`; };

  window.GembaMath = { ANSWERS, CADENCES, VITAL_SHARE, addDays, addMonths, daysBetween, mondayOf, nextDue, compliance, combined, schedule, weekly, wasteTotals, vitalFew, areaWaste, qKey, failCounts, openFindings, inMonth, lastDays, elapsed, clock };

  const dataEl = document.getElementById("gemba-walk-data");
  const root = document.querySelector("[data-gemba-walk]");
  if (!dataEl || !root || !window.ToolKit) return;
  const { tx, pct, showDate, dayMonth, write, loadState, isObject, str, el, int, today, parseDate, flash, undoNote, panel, stat, focusCard, resultActions, resultLayout, exampleNote, exampleStamp, exampleMatches, firstVisit, downloadCsv, downloadXlsx, shownNote, LOG_LIMIT } = window.ToolKit;
  const ChartKit = window.ChartKit;
  const Workplace = window.Workplace;
  const Actions = window.ActionsStore;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const TYPES = cfg.types.map((t) => t.key);
  const LAYERS = cfg.layers.map((l) => l.key);
  const TEMPLATES = Object.keys(cfg.templates);
  const WASTES = cfg.wastes.map((w) => w.key);
  const layerOf = Object.fromEntries(cfg.layers.map((l) => [l.key, l]));
  const typeOf = Object.fromEntries(cfg.types.map((t) => [t.key, t]));
  const wasteOf = Object.fromEntries(cfg.wastes.map((w) => [w.key, w]));
  const cadenceName = (key) => cfg.cadences.find((c) => c.key === key)?.name || key;
  const answerName = (key) => cfg.answers.find((a) => a.key === key)?.name || "";
  const layerName = (key) => layerOf[key]?.name || key;
  const id = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  // State: the checklist, the cadence per layer, the walk in progress (draft), the saved walks (rows).
  const defaultCadences = () => Object.fromEntries(cfg.layers.map((l) => [l.key, l.cadence]));
  const blankDraft = (keep = {}) => ({
    type: TYPES.includes(keep.type) ? keep.type : TYPES[0], layer: LAYERS.includes(keep.layer) ? keep.layer : LAYERS[0],
    area: str(keep.area), walker: str(keep.walker), date: today(), shift: str(keep.shift), minutes: "",
    answers: [], findings: {}, acts: {}, tallies: {}, notes: {}, timer: { started: 0, elapsed: 0 },
  });
  const state = loadState(KEY, { template: "", cadence: {}, rows: [], draft: {}, example: {} });
  if (!TEMPLATES.includes(state.template)) state.template = TEMPLATES[0];
  state.cadence = { ...defaultCadences(), ...Object.fromEntries(Object.entries(state.cadence).filter(([k, v]) => LAYERS.includes(k) && CADENCES.includes(v))) };
  // Saved data can be damaged; keep only what has the expected shape.
  const cleanText = (map) => Object.fromEntries(Object.entries(isObject(map) ? map : {}).filter(([, v]) => typeof v === "string" && v.trim()).map(([k, v]) => [k, v.trim()]));
  const cleanFlags = (map) => Object.fromEntries(Object.entries(isObject(map) ? map : {}).filter(([, v]) => v === true));
  const cleanTallies = (map) => Object.fromEntries(WASTES.map((key) => [key, Math.max(0, Math.round(Number(map?.[key]) || 0))]));
  const cleanAnswers = (list) => (Array.isArray(list) ? list.map((a) => (ANSWERS.includes(a) ? a : null)) : []);
  const cleanMinutes = (value) => { const n = Number(value); return Number.isFinite(n) && n > 0 ? Math.round(n) : ""; };
  const cleanRow = (row) => ({
    id: str(row.id) || id("w"), type: TYPES.includes(row.type) ? row.type : TYPES[0], layer: LAYERS.includes(row.layer) ? row.layer : LAYERS[0],
    template: TEMPLATES.includes(row.template) ? row.template : state.template, date: parseDate(row.date) || "", area: str(row.area), walker: str(row.walker),
    shift: str(row.shift), minutes: cleanMinutes(row.minutes), answers: cleanAnswers(row.answers), findings: cleanText(row.findings),
    acts: cleanFlags(row.acts), sent: cleanFlags(row.sent), tallies: cleanTallies(row.tallies), notes: cleanText(row.notes),
  });
  state.rows = state.rows.filter(isObject).map(cleanRow).filter((row) => row.date && row.area);
  const savedDraft = isObject(state.draft) ? state.draft : {};
  state.draft = {
    ...blankDraft(savedDraft), date: parseDate(savedDraft.date) || today(), minutes: cleanMinutes(savedDraft.minutes),
    answers: cleanAnswers(savedDraft.answers), findings: cleanText(savedDraft.findings), acts: cleanFlags(savedDraft.acts),
    tallies: cleanTallies(savedDraft.tallies), notes: cleanText(savedDraft.notes),
    timer: { started: Number(savedDraft.timer?.started) > 0 ? Number(savedDraft.timer.started) : 0, elapsed: Math.max(0, Number(savedDraft.timer?.elapsed) || 0) },
  };
  const save = () => write(KEY, state);

  // Elements.
  const q = (selector) => root.querySelector(selector);
  const typeButtons = [...root.querySelectorAll("[data-type-value]")];
  const layerSelect = q("#gw-layer");
  const templateSelect = q("#gw-template");
  const areaSelect = q("#gw-area-select");
  const areaInput = q("#gw-area");
  const areaList = q("#gw-area-list");
  const walkerInput = q("#gw-walker");
  const dateInput = q("#gw-date");
  const shiftSelect = q("#gw-shift");
  const minutesInput = q("#gw-minutes");
  const lpaBox = q("[data-lpa]");
  const wasteBox = q("[data-waste]");
  const questionsBox = q("[data-questions]");
  const wastesBox = q("[data-wastes]");
  const layerNote = q("[data-layer-note]");
  const progressNote = q("[data-progress]");
  const timerDisplay = q("[data-timer]");
  const timerButton = q("[data-timer-toggle]");
  const timerReset = q("[data-timer-reset]");
  const saveButton = q("[data-save]");
  const actionsButton = q("[data-add-actions]");
  const trackerLink = q("[data-tracker-link]");
  const sheetButton = q("[data-sheet-print]");
  const resetButton = q("[data-reset]");
  const walkStatus = q("[data-walk-status]");
  const logBody = q("[data-log]");
  const logWrap = q("[data-log-wrap]");
  const logEmpty = q("[data-log-empty]");
  const logCount = q("[data-log-count]");
  const logStatus = q("[data-log-status]");
  const cadenceSelects = [...root.querySelectorAll("[data-cadence]")];
  const results = document.querySelector("[data-results]");
  const sheet = document.querySelector("[data-sheet]");

  const template = (name = state.template) => cfg.templates[name] || cfg.templates[TEMPLATES[0]];
  const questionsOf = (name, layer) => template(name).questions?.[layer] || [];
  const questionOf = (row, index) => questionsOf(row.template, row.layer)[index] || null;
  const fitDraft = () => {
    const n = questionsOf(state.template, state.draft.layer).length;
    state.draft.answers = Array.from({ length: n }, (_, i) => (ANSWERS.includes(state.draft.answers[i]) ? state.draft.answers[i] : null));
  };
  fitDraft();
  const draftStarted = () => (state.draft.type === "lpa" ? state.draft.answers.some(Boolean) : WASTES.some((key) => state.draft.tallies[key] > 0));
  const draftFindings = () => state.draft.answers.map((answer, index) => ({ answer, index })).filter(({ answer, index }) => answer === "no" && state.draft.acts[index] === true);

  // Areas and shifts: the workplace profile when it has them, else the checklist's areas and what was typed before.
  const wpAreas = () => (Workplace ? Workplace.areas() : []);
  const areaOwner = (name) => wpAreas().find((area) => area.name === name)?.owner || "";
  const fillList = (list, values) => list.replaceChildren(...values.map((value) => el("option", null, value)));
  const renderSetup = () => {
    typeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.typeValue === state.draft.type)));
    layerSelect.value = state.draft.layer;
    templateSelect.value = state.template;
    const profileAreas = wpAreas().map((area) => area.name);
    const useSelect = profileAreas.length > 0;
    areaSelect.closest(".field").hidden = !useSelect;
    areaInput.closest(".field").hidden = useSelect;
    if (useSelect) {
      if (!state.draft.area) state.draft.area = profileAreas[0];
      Workplace.fillSelect(areaSelect, profileAreas, state.draft.area);
    } else {
      areaInput.value = state.draft.area;
    }
    fillList(areaList, [...new Set([...profileAreas, ...template().areas, ...state.rows.map((row) => row.area)])].filter(Boolean));
    walkerInput.value = state.draft.walker;
    dateInput.value = state.draft.date;
    const shifts = Workplace && Workplace.shifts().length ? Workplace.shifts() : cfg.shifts;
    if (!state.draft.shift) state.draft.shift = shifts[0];
    fillList(shiftSelect, [...new Set([...shifts, state.draft.shift])]);
    shiftSelect.value = state.draft.shift;
    minutesInput.value = state.draft.minutes === "" ? "" : String(state.draft.minutes);
    lpaBox.hidden = state.draft.type !== "lpa";
    wasteBox.hidden = state.draft.type !== "waste";
    layerNote.textContent = `${typeOf[state.draft.type]?.note || ""} ${layerOf[state.draft.layer]?.note || ""}`.trim();
    cadenceSelects.forEach((select) => { select.value = state.cadence[select.dataset.cadence]; });
  };

  // The LPA: one row per question with the standard it checks, yes / no / n.a., a finding and the action tick.
  const questionRow = (item, index) => {
    const row = el("div", "gw-q");
    const answer = state.draft.answers[index];
    if (answer === "no") row.classList.add("is-no");
    const head = el("p", "gw-q-text");
    head.append(el("span", "gw-q-n", String(index + 1)), item.text);
    const standard = el("p", "gw-q-standard");
    standard.append(el("span", null, `${tx("Standard")}: `), item.standard);
    const group = el("div", "gw-answers");
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-label", `${tx("Question")} ${index + 1}`);
    ANSWERS.forEach((value) => {
      const label = el("label", `gw-answer is-${value}`);
      const input = el("input");
      input.type = "radio";
      input.name = `gw-q-${index}`;
      input.value = value;
      input.checked = answer === value;
      input.dataset.index = index;
      label.append(input, el("span", null, answerName(value)));
      group.append(label);
    });
    const note = el("input", "gw-note");
    note.type = "text";
    note.placeholder = cfg.text.findingPlaceholder;
    note.autocomplete = "off";
    note.value = state.draft.findings[index] || "";
    note.setAttribute("aria-label", `${tx("Question")} ${index + 1}: ${tx("Finding")}`);
    note.dataset.finding = index;
    const act = el("label", "gw-act");
    const box = el("input");
    box.type = "checkbox";
    box.checked = state.draft.acts[index] === true;
    box.dataset.act = index;
    act.append(box, el("span", null, tx("Action")));
    const foot = el("div", "gw-q-foot");
    foot.append(note, act);
    row.append(head, standard, group, foot);
    return row;
  };
  const renderQuestions = () => questionsBox.replaceChildren(...questionsOf(state.template, state.draft.layer).map(questionRow));

  // The waste walk: one card per waste with its definition, a floor example, − and + and a note.
  const wasteCard = (waste) => {
    const card = el("div", "gw-waste");
    card.dataset.waste = waste.key;
    const head = el("div", "gw-waste-head");
    const name = el("p", "gw-waste-name", waste.name);
    const count = el("output", "gw-count", int.format(state.draft.tallies[waste.key] || 0));
    count.dataset.count = waste.key;
    count.setAttribute("aria-live", "polite");
    count.setAttribute("aria-label", `${waste.name}: ${tx("Count")}`);
    head.append(name, count);
    const def = el("p", "gw-waste-def", waste.definition);
    const example = el("p", "gw-waste-example");
    example.append(el("span", null, `${tx("On the floor")}: `), waste.example);
    const buttons = el("div", "gw-tally");
    const minus = el("button", "gw-step", "−");
    minus.type = "button";
    minus.dataset.step = "-1";
    minus.dataset.key = waste.key;
    minus.setAttribute("aria-label", tx("One less: {name}", { name: waste.name }));
    const plus = el("button", "gw-step is-plus", "+");
    plus.type = "button";
    plus.dataset.step = "1";
    plus.dataset.key = waste.key;
    plus.setAttribute("aria-label", tx("One more: {name}", { name: waste.name }));
    buttons.append(minus, plus);
    const note = el("input", "gw-note");
    note.type = "text";
    note.placeholder = cfg.text.notePlaceholder;
    note.autocomplete = "off";
    note.value = state.draft.notes[waste.key] || "";
    note.dataset.wasteNote = waste.key;
    note.setAttribute("aria-label", `${waste.name}: ${tx("Note")}`);
    card.append(head, def, example, buttons, note);
    return card;
  };
  const renderWastes = () => wastesBox.replaceChildren(...cfg.wastes.map(wasteCard));

  const renderProgress = () => {
    if (state.draft.type === "lpa") {
      const c = compliance(state.draft.answers);
      progressNote.textContent = c.answered ? `${tx("{a} of {b} questions answered", { a: int.format(c.answered), b: int.format(c.total) })} · ${tx("Compliance")} ${c.pct === null ? "–" : pct(c.pct, 0)}` : tx("Check each question on the floor, not in the office: yes, no or n.a.");
    } else {
      const total = WASTES.reduce((sum, key) => sum + (state.draft.tallies[key] || 0), 0);
      progressNote.textContent = total ? tx("{n} wastes counted on this walk", { n: int.format(total) }) : tx("Tap + each time you see a waste. Count what you see, not who caused it.");
    }
    const n = draftFindings().length;
    actionsButton.textContent = n ? tx("Add {n} findings to actions", { n: int.format(n) }) : tx("Add findings to actions");
    actionsButton.disabled = !n || !Actions;
    actionsButton.hidden = state.draft.type !== "lpa";
    saveButton.disabled = !draftStarted();
    if (trackerLink && Actions) trackerLink.href = Actions.trackerUrl().href;
  };

  // The timer of the waste walk: it keeps running across a reload because it stores when it started.
  let ticking = null;
  const renderTimer = () => {
    const ms = elapsed(state.draft.timer, Date.now());
    timerDisplay.textContent = clock(ms);
    timerButton.textContent = state.draft.timer.started ? tx("Stop") : ms ? tx("Continue") : tx("Start the timer");
    timerButton.setAttribute("aria-pressed", String(Boolean(state.draft.timer.started)));
    timerReset.hidden = !ms;
    if (state.draft.timer.started && !ticking) ticking = setInterval(() => { timerDisplay.textContent = clock(elapsed(state.draft.timer, Date.now())); }, 1000);
    if (!state.draft.timer.started && ticking) { clearInterval(ticking); ticking = null; }
  };
  const stopTimer = () => {
    const timer = state.draft.timer;
    if (!timer.started) return;
    timer.elapsed = elapsed(timer, Date.now());
    timer.started = 0;
    const minutes = Math.max(1, Math.round(timer.elapsed / 60000));
    state.draft.minutes = minutes;
    minutesInput.value = String(minutes);
  };

  // Results.
  const shortDate = dayMonth(false);
  const label = (iso) => shortDate(new Date(`${iso}T00:00:00Z`));
  const lateText = (n) => (n === 1 ? tx("Overdue by 1 day") : tx("Overdue by {n} days", { n: int.format(n) }));
  const statusChip = (item) => {
    const chip = el("span", `ck-chip is-${{ ok: "ok", due: "warn", overdue: "danger", never: "blue" }[item.status]}`);
    const text = { ok: tx("On time"), due: tx("Due today"), overdue: lateText(item.late), never: tx("No walk yet") }[item.status];
    chip.append(el("span", null, { ok: "✓", due: "•", overdue: "!", never: "○" }[item.status]), text);
    return chip;
  };
  const questionCode = (item) => `${layerOf[item.layer]?.short || ""} ${item.index + 1}`;
  const questionText = (item) => questionsOf(item.template, item.layer)[item.index]?.text || "";
  const rowResult = (row) => {
    if (isLpa(row)) {
      const c = compliance(row.answers);
      return c.pct === null ? "–" : `${pct(c.pct, 0)} · ${tx("{n} no", { n: int.format(c.no) })}`;
    }
    const total = WASTES.reduce((sum, key) => sum + row.tallies[key], 0);
    return tx("{n} wastes", { n: int.format(total) });
  };
  const handOver = (items) => {
    if (!Actions) return 0;
    const due = addDays(today(), 7);
    items.forEach(({ row, index }) => {
      const item = questionOf(row, index);
      Actions.add({
        title: item?.text || `${tx("Question")} ${index + 1}`,
        detail: [row.findings[index], item ? `${tx("Standard")}: ${item.standard}` : "", `${cfg.text.tool} · ${layerName(row.layer)} · ${row.area} · ${showDate(row.date)}`].filter(Boolean).join(" · "),
        owner: areaOwner(row.area), due, source: "gemba-walk", check: cfg.text.checkText, area: row.area, priority: "Medium",
      });
    });
    return items.length;
  };
  const addedNote = (node, n) => {
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = Actions.trackerUrl().href;
    node.replaceChildren(`${tx("Added {n} actions.", { n: int.format(n) })} `, link);
    clearTimeout(node.timer);
    node.timer = setTimeout(() => { node.textContent = ""; }, 8000);
  };

  const analysis = () => {
    const now = today();
    const rows = state.rows.filter((row) => row.date <= now);
    const totals = wasteTotals(rows, WASTES);
    const wasteItems = WASTES.map((key) => ({ key, value: totals[key] })).sort((a, b) => b.value - a.value);
    return {
      rows, now,
      month: inMonth(rows, now), last30: lastDays(rows, now, 30), last28: combined(lastDays(rows, now, 28)),
      schedule: schedule(rows, LAYERS, state.cadence, now), weeks: weekly(rows, LAYERS),
      wasteItems, vital: vitalFew(wasteItems), fails: failCounts(rows).filter((f) => f.no > 0), open: openFindings(rows),
    };
  };
  const summaryText = (r) => {
    const lines = [`${cfg.text.tool} · ${showDate(r.now)}`, ""];
    lines.push(`${tx("Walks this month")}: ${int.format(r.month.length)}`);
    lines.push(`${tx("Compliance, last 4 weeks")}: ${r.last28.pct === null ? "–" : pct(r.last28.pct, 0)}`);
    lines.push(`${tx("Open findings")}: ${int.format(r.open.length)}`);
    lines.push("", `${tx("Schedule")}:`);
    r.schedule.forEach((s) => lines.push(`- ${layerName(s.layer)} (${cadenceName(s.cadence)}): ${s.last ? `${tx("last walk")} ${showDate(s.last)}, ${tx("next due")} ${showDate(s.due)}` : tx("No walk yet")}${s.status === "overdue" ? ` · ${lateText(s.late)}` : ""}`));
    if (r.fails.length) {
      lines.push("", `${tx("Most failed questions")}:`);
      r.fails.slice(0, 5).forEach((f) => lines.push(`- ${questionText(f)} (${layerName(f.layer)}): ${tx("{n} of {m} no", { n: f.no, m: f.asked })}`));
    }
    const wasteTotal = r.wasteItems.reduce((sum, item) => sum + item.value, 0);
    if (wasteTotal) {
      lines.push("", `${tx("Wastes counted")}: ${int.format(wasteTotal)}`);
      r.wasteItems.filter((item) => item.value > 0).forEach((item) => lines.push(`- ${wasteOf[item.key].name}: ${int.format(item.value)}${r.vital.includes(item.key) ? ` · ${tx("vital few")}` : ""}`));
    }
    return lines.join("\n");
  };
  const paretoTable = (r) => () => ({
    source: cfg.text.tool,
    headers: [tx("Waste"), tx("Count")],
    rows: r.wasteItems.filter((item) => item.value > 0).map((item) => [wasteOf[item.key].name, String(item.value)]),
    map: { category: 0, count: 1, value: -1, date: -1, filter: -1 },
    measure: "count",
  });

  let exampleUi = null;
  const renderResults = () => {
    results.replaceChildren();
    if (exampleUi) exampleUi.sync(state);
    if (!state.rows.length) { results.hidden = true; return; }
    results.hidden = false;
    const r = analysis();
    const overdue = r.schedule.filter((s) => s.status === "overdue");

    const head = el("div", "result-head gw-head");
    head.append(el("p", "kicker", tx("Gemba walks")));
    const h2 = el("h2");
    h2.append(r.last28.pct === null ? "–" : pct(r.last28.pct, 0), el("span", null, ` · ${tx("LPA compliance, last 4 weeks")}`));
    head.append(h2, el("p", "gw-meta", [template().name, tx("{n} walks logged", { n: int.format(state.rows.length) }), overdue.length === 1 ? tx("1 layer overdue") : overdue.length ? tx("{n} layers overdue", { n: int.format(overdue.length) }) : tx("Every layer on time")].join(" · ")));

    const stats = el("div", "dl-stats gw-stats");
    stats.append(stat(tx("Walks this month"), int.format(r.month.length), tx("{n} in the last 30 days", { n: int.format(r.last30.length) })));
    const monthC = combined(r.month);
    stats.append(stat(tx("Compliance"), r.last28.pct === null ? "–" : pct(r.last28.pct, 0), monthC.pct === null ? tx("no LPA this month") : tx("{p} this month", { p: pct(monthC.pct, 0) })));
    stats.append(stat(tx("Open findings"), int.format(r.open.length), tx("ticked for action, not in the tracker yet")));
    stats.append(stat(tx("Overdue layers"), int.format(overdue.length), overdue.length ? overdue.map((s) => layerName(s.layer)).join(", ") : tx("every layer on time")));

    // Start here: the question that fails most often, with the first moves of its topic.
    const top = r.fails[0];
    let focus = null;
    const worst = top ? Object.entries(top.areas).sort((a, b) => b[1] - a[1])[0] : null;
    if (top) {
      const item = questionsOf(top.template, top.layer)[top.index];
      focus = focusCard({
        title: item?.text || questionCode(top),
        detail: tx("{n} of {m} no", { n: int.format(top.no), m: int.format(top.asked) }),
        lede: tx("The most failed question ({layer}). Standard: {standard}. Most often in {area}.", { layer: layerName(top.layer), standard: item ? item.standard.replace(/\.$/, "") : "–", area: worst ? worst[0] : "–" }),
        advice: cfg.topics[item?.topic] || null,
      });
    } else if (r.vital.length) {
      const waste = wasteOf[r.vital[0]];
      focus = focusCard({ title: waste.name, detail: tx("{n} counted", { n: int.format(r.wasteItems[0].value) }), lede: waste.definition, extraLabel: tx("On the floor"), extra: waste.example });
    }

    const problem = top ? tx("Gemba walk {area}: {question} ({n} × no)", { area: worst ? worst[0] : "", question: questionText(top), n: top.no })
      : r.vital.length ? tx("Waste walk: {waste} is the largest waste", { waste: wasteOf[r.vital[0]].name }) : cfg.text.tool;
    const hasWaste = r.wasteItems.some((item) => item.value > 0);
    const actions = resultActions(() => summaryText(r), problem, hasWaste ? paretoTable(r) : null);
    if (Actions && r.open.length) {
      const send = el("button", "button-secondary", tx("Add {n} open findings to actions", { n: int.format(r.open.length) }));
      send.type = "button";
      send.addEventListener("click", () => {
        const items = openFindings(state.rows);
        const n = handOver(items);
        items.forEach(({ row, index }) => { row.sent[index] = true; });
        changed();
        addedNote(walkStatus, n);
      });
      actions.append(send);
    }
    const fiveS = el("a", "button-ghost", tx("5S Audit"));
    fiveS.href = new URL("../five-s-audit/", window.location.href).href;
    const standardWork = el("a", "button-ghost", tx("Standard Work"));
    standardWork.href = new URL("../standard-work/", window.location.href).href;
    actions.append(fiveS, standardWork);

    const panels = [];
    // The schedule: each layer, its cadence, the last walk and when the next one is due.
    const schedulePanel = panel(tx("Schedule"), tx("The next walk of each layer, from its last walk and its cadence."));
    schedulePanel.classList.add("gw-panel-schedule");
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table gw-schedule");
    const thead = el("thead");
    const htr = el("tr");
    [tx("Layer"), tx("Cadence"), tx("Last walk"), tx("Next due"), tx("Status")].forEach((text) => { const th = el("th", null, text); th.scope = "col"; htr.append(th); });
    thead.append(htr);
    const tbody = el("tbody");
    r.schedule.forEach((s) => {
      const tr = el("tr");
      const chipCell = el("td");
      chipCell.append(statusChip(s));
      tr.append(el("td", null, layerName(s.layer)), el("td", null, cadenceName(s.cadence)), el("td", null, s.last ? showDate(s.last) : "–"), el("td", null, s.due ? showDate(s.due) : "–"), chipCell);
      tbody.append(tr);
    });
    table.append(thead, tbody);
    wrap.append(table);
    schedulePanel.append(wrap);
    panels.push(schedulePanel);

    if (ChartKit) {
      // Compliance per week and layer.
      const { weeks, series } = r.weeks;
      const drawn = LAYERS.filter((layer) => series[layer]?.some((v) => v !== null));
      if (weeks.length) {
        const linePanel = panel(tx("Compliance per week"), tx("Yes against yes + no, per layer and week. Target {p}.", { p: pct(COMPLIANCE_TARGET, 0) }));
        linePanel.classList.add("gw-panel-line");
        const lines = drawn.map((layer) => ({ label: layerName(layer), points: weeks.map((week, i) => ({ x: label(week), y: series[layer][i] === null ? NaN : series[layer][i], tip: series[layer][i] === null ? "" : `${layerName(layer)} · ${tx("week of {date}", { date: showDate(week) })}: ${pct(series[layer][i], 0)}`, state: series[layer][i] !== null && series[layer][i] < 0.75 ? "danger" : undefined })) }));
        linePanel.append(ChartKit.figure(ChartKit.line(lines, { title: tx("Compliance per week"), yMin: 0, yMax: 1, target: COMPLIANCE_TARGET, format: (v) => pct(v, 0) }), { fileName: "gemba-compliance" }));
        panels.push(linePanel);
      }

      // The wastes, largest first, the vital few in the alert colour.
      if (hasWaste) {
        const wastePanel = panel(tx("Wastes counted"), tx("All waste walks. Highlighted: the vital few, the largest wastes that make up 80 % of the count."));
        wastePanel.classList.add("gw-panel-wastes");
        const items = r.wasteItems.filter((item) => item.value > 0);
        wastePanel.append(ChartKit.figure(ChartKit.bars(items.map((item) => ({ key: item.key, label: wasteOf[item.key].name, value: item.value, tip: `${wasteOf[item.key].name}: ${int.format(item.value)}${r.vital.includes(item.key) ? ` · ${tx("vital few")}` : ""}` })), { title: tx("Wastes counted"), highlight: (item) => r.vital.includes(item.key), format: (v) => int.format(Math.round(v)) }), { fileName: "gemba-wastes" }));
        wastePanel.append(el("p", "dl-panel-note", `${tx("Vital few")}: ${r.vital.map((key) => wasteOf[key].name).join(", ")}`));
        panels.push(wastePanel);

        // Area × waste: where each waste was seen.
        const map = areaWaste(r.rows, WASTES);
        const areas = Object.keys(map);
        const cols = WASTES.filter((key) => areas.some((area) => map[area][key] > 0));
        const max = Math.max(1, ...areas.flatMap((area) => cols.map((key) => map[area][key])));
        const heatPanel = panel(tx("Wastes by area"), tx("Darker is more. Hover a cell for the count."));
        heatPanel.classList.add("gw-panel-heat");
        heatPanel.append(ChartKit.figure(ChartKit.heatmap(areas, cols.map((key) => wasteOf[key].name), (ri, ci) => {
          const n = map[areas[ri]][cols[ci]];
          if (!n) return null;
          const share = n / max;
          return { text: String(n), color: ChartKit.C.blue, opacity: 0.2 + 0.8 * share, textColor: share > 0.45 ? "#ffffff" : ChartKit.C.text, tip: `${areas[ri]} · ${wasteOf[cols[ci]].name}: ${int.format(n)}` };
        }, { title: tx("Wastes by area"), labelWidth: 130, cellSize: 42 }), { fileName: "gemba-waste-areas" }));
        panels.push(heatPanel);
      }

      // Area × question: where the "no" answers sit.
      if (r.fails.length) {
        const cols = r.fails.slice(0, MAX_QUESTION_COLS);
        const areas = [...new Set(cols.flatMap((f) => Object.keys(f.areas)))];
        const max = Math.max(1, ...cols.flatMap((f) => Object.values(f.areas)));
        const noPanel = panel(tx("No answers by area"), tx("The most failed questions across the areas walked. Codes below."));
        noPanel.classList.add("gw-panel-no");
        noPanel.append(ChartKit.figure(ChartKit.heatmap(areas, cols.map(questionCode), (ri, ci) => {
          const n = cols[ci].areas[areas[ri]] || 0;
          if (!n) return null;
          const share = n / max;
          return { text: String(n), color: ChartKit.C.danger, opacity: 0.25 + 0.75 * share, textColor: share > 0.45 ? "#ffffff" : ChartKit.C.text, tip: `${areas[ri]} · ${questionText(cols[ci])}: ${tx("{n} no", { n: int.format(n) })}` };
        }, { title: tx("No answers by area"), labelWidth: 130, cellSize: 42 }), { fileName: "gemba-no-areas" }));
        const codes = el("ol", "gw-codes");
        cols.forEach((f) => { const li = el("li"); li.append(el("strong", null, questionCode(f)), ` ${questionText(f)} · ${tx("{n} of {m} no", { n: f.no, m: f.asked })}`); codes.append(li); });
        noPanel.append(codes);
        panels.push(noPanel);
      }
    }

    resultLayout(results, { head, stats, focus, actions, panels });
  };

  // The log of saved walks, newest first.
  const renderLog = () => {
    const rows = [...state.rows].sort((a, b) => byDate(b, a)).slice(0, LOG_LIMIT);
    logBody.replaceChildren();
    rows.forEach((row) => {
      const tr = el("tr");
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.remove = row.id;
      remove.setAttribute("aria-label", tx("Remove the walk of {area} on {date}", { area: row.area, date: showDate(row.date) }));
      const removeCell = el("td");
      removeCell.append(remove);
      tr.append(el("td", null, showDate(row.date)), el("td", null, typeOf[row.type]?.short || row.type), el("td", null, layerName(row.layer)), el("td", null, row.area), el("td", null, row.walker), el("td", "num", rowResult(row)), removeCell);
      logBody.append(tr);
    });
    logWrap.hidden = !state.rows.length;
    logEmpty.hidden = state.rows.length > 0;
    logCount.textContent = state.rows.length ? `${tx("{n} walks", { n: int.format(state.rows.length) })}${shownNote(state.rows.length)}` : "";
  };

  // The walk sheet for A4: the questions of this layer (or the wastes), with what is filled in so far.
  const renderSheet = () => {
    sheet.replaceChildren();
    const d = state.draft;
    const isLpaWalk = d.type === "lpa";
    sheet.append(el("h2", null, `${cfg.text.sheetTitle} · ${typeOf[d.type]?.name || ""}`));
    const meta = el("dl", "gw-sheet-meta");
    [[tx("Checklist"), template().name], [tx("Layer"), layerName(d.layer)], [tx("Area"), d.area], [tx("Walker"), d.walker], [tx("Date"), showDate(d.date)], [tx("Shift"), d.shift], [tx("Minutes"), d.minutes === "" ? "" : String(d.minutes)]].forEach(([k, v]) => {
      meta.append(el("dt", null, k), el("dd", null, v || " "));
    });
    sheet.append(meta);
    const table = el("table", "gw-sheet-table");
    const htr = el("tr");
    const heads = isLpaWalk ? ["#", tx("Question"), ...ANSWERS.map(answerName), tx("Finding"), tx("Action")] : [tx("Waste"), tx("Count"), tx("Note")];
    heads.forEach((text) => { const th = el("th", null, text); th.scope = "col"; htr.append(th); });
    const thead = el("thead");
    thead.append(htr);
    const tbody = el("tbody");
    if (isLpaWalk) {
      questionsOf(state.template, d.layer).forEach((item, i) => {
        const tr = el("tr");
        const qCell = el("td");
        qCell.append(el("strong", null, item.text), el("br"), el("small", null, `${tx("Standard")}: ${item.standard}`));
        tr.append(el("td", null, String(i + 1)), qCell, ...ANSWERS.map((a) => el("td", "gw-box", d.answers[i] === a ? "✕" : "")), el("td", "gw-write", d.findings[i] || ""), el("td", "gw-box", d.acts[i] ? "✕" : ""));
        tbody.append(tr);
      });
    } else {
      cfg.wastes.forEach((w) => {
        const tr = el("tr");
        const nameCell = el("td");
        nameCell.append(el("strong", null, w.name), el("br"), el("small", null, w.definition));
        tr.append(nameCell, el("td", "gw-write", d.tallies[w.key] ? String(d.tallies[w.key]) : ""), el("td", "gw-write", d.notes[w.key] || ""));
        tbody.append(tr);
      });
    }
    table.append(thead, tbody);
    sheet.append(table);
    if (isLpaWalk) {
      const c = compliance(d.answers);
      sheet.append(el("p", "gw-sheet-foot", `${tx("Compliance")} = ${tx("yes")} / (${tx("yes")} + ${tx("no")}) = ${c.pct === null ? "____" : pct(c.pct, 0)}`));
    }
  };

  const render = () => {
    renderSetup();
    renderProgress();
    renderTimer();
    renderLog();
    renderResults();
  };
  const changed = () => {
    save();
    render();
  };

  // The example: four weeks of walks on three layers in the warehouse and two waste walks, dated back from today.
  const EXPAND = { y: "yes", n: "no", a: "na" };
  const loadExample = () => {
    const ex = cfg.example;
    const now = today();
    state.template = ex.template;
    state.rows = ex.walks.map((w, i) => cleanRow({
      id: `ex-w${i}`, type: w.type, layer: w.layer, template: ex.template, date: addDays(now, w.day), area: w.area, walker: w.walker, shift: w.shift, minutes: w.minutes,
      answers: String(w.answers || "").split("").map((c) => EXPAND[c] || null), findings: w.findings, acts: Object.fromEntries((w.acts || []).map((n) => [n, true])), tallies: w.tallies, notes: w.notes,
    })).sort(byDate);
    const last = state.rows.at(-1);
    state.draft = blankDraft({ type: "lpa", layer: last.layer, area: last.area, walker: last.walker, shift: last.shift });
    fitDraft();
    state.example = exampleStamp(state.rows);
  };
  const dropExample = () => {
    state.rows = [];
    state.example = {};
  };
  const ownWork = () => { if (exampleMatches(state)) dropExample(); };
  exampleUi = exampleNote(results, () => { dropExample(); changed(); });

  // Setup events.
  typeButtons.forEach((button) => button.addEventListener("click", () => {
    state.draft.type = button.dataset.typeValue;
    changed();
  }));
  layerSelect.addEventListener("change", () => {
    if (state.draft.answers.some(Boolean) && !window.confirm(tx("Change the layer? The answers of this walk are discarded."))) { layerSelect.value = state.draft.layer; return; }
    state.draft.layer = layerSelect.value;
    state.draft.answers = [];
    state.draft.findings = {};
    state.draft.acts = {};
    fitDraft();
    renderQuestions();
    changed();
  });
  templateSelect.addEventListener("change", () => {
    if (state.draft.answers.some(Boolean) && !window.confirm(tx("Change the checklist? The answers of this walk are discarded."))) { templateSelect.value = state.template; return; }
    state.template = templateSelect.value;
    state.draft.answers = [];
    state.draft.findings = {};
    state.draft.acts = {};
    fitDraft();
    renderQuestions();
    changed();
  });
  const setDraft = (name, value) => { state.draft[name] = value; save(); };
  areaSelect.addEventListener("change", () => setDraft("area", areaSelect.value));
  areaInput.addEventListener("input", () => setDraft("area", areaInput.value.trim()));
  walkerInput.addEventListener("input", () => setDraft("walker", walkerInput.value.trim()));
  dateInput.addEventListener("change", () => setDraft("date", parseDate(dateInput.value) || today()));
  shiftSelect.addEventListener("change", () => setDraft("shift", shiftSelect.value));
  minutesInput.addEventListener("input", () => setDraft("minutes", cleanMinutes(minutesInput.value)));
  cadenceSelects.forEach((select) => select.addEventListener("change", () => {
    state.cadence[select.dataset.cadence] = CADENCES.includes(select.value) ? select.value : "weekly";
    changed();
  }));
  window.addEventListener("workplace:changed", () => { renderSetup(); renderResults(); });

  // Answers: a "no" suggests the action tick; the rows stay in place so the focus does not jump during the walk.
  questionsBox.addEventListener("change", (event) => {
    const input = event.target;
    if (input.type === "radio" && input.dataset.index !== undefined) {
      const index = Number(input.dataset.index);
      state.draft.answers[index] = input.value;
      if (input.value === "no") state.draft.acts[index] = true; else delete state.draft.acts[index];
      const row = input.closest(".gw-q");
      row.classList.toggle("is-no", input.value === "no");
      row.querySelector("[data-act]").checked = input.value === "no";
    } else if (input.dataset.act !== undefined) {
      if (input.checked) state.draft.acts[input.dataset.act] = true; else delete state.draft.acts[input.dataset.act];
    } else return;
    renderProgress();
    save();
  });
  questionsBox.addEventListener("input", (event) => {
    const input = event.target;
    if (input.dataset.finding === undefined) return;
    const value = input.value.trim();
    if (value) state.draft.findings[input.dataset.finding] = value; else delete state.draft.findings[input.dataset.finding];
    save();
  });
  wastesBox.addEventListener("click", (event) => {
    const button = event.target.closest("[data-step]");
    if (!button) return;
    const key = button.dataset.key;
    state.draft.tallies[key] = Math.max(0, (state.draft.tallies[key] || 0) + Number(button.dataset.step));
    // The first tally starts the timer, so the duration of the walk is not forgotten.
    if (Number(button.dataset.step) > 0 && !state.draft.timer.started && !state.draft.timer.elapsed) state.draft.timer.started = Date.now();
    const count = wastesBox.querySelector(`[data-count="${key}"]`);
    if (count) count.textContent = int.format(state.draft.tallies[key]);
    renderProgress();
    renderTimer();
    save();
  });
  wastesBox.addEventListener("input", (event) => {
    const input = event.target;
    if (input.dataset.wasteNote === undefined) return;
    const value = input.value.trim();
    if (value) state.draft.notes[input.dataset.wasteNote] = value; else delete state.draft.notes[input.dataset.wasteNote];
    save();
  });
  timerButton.addEventListener("click", () => {
    if (state.draft.timer.started) stopTimer(); else state.draft.timer.started = Date.now();
    renderTimer();
    save();
  });
  timerReset.addEventListener("click", () => {
    state.draft.timer = { started: 0, elapsed: 0 };
    renderTimer();
    save();
  });

  saveButton.addEventListener("click", () => {
    if (!draftStarted()) return;
    if (!state.draft.area) {
      flash(walkStatus, tx("Name the area first."));
      (areaSelect.closest(".field").hidden ? areaInput : areaSelect).focus();
      return;
    }
    stopTimer();
    ownWork();
    const d = state.draft;
    const isLpaWalk = d.type === "lpa";
    const row = cleanRow({
      id: id("w"), type: d.type, layer: d.layer, template: state.template, date: d.date || today(), area: d.area, walker: d.walker, shift: d.shift, minutes: d.minutes,
      answers: isLpaWalk ? d.answers : [], findings: isLpaWalk ? d.findings : {}, acts: isLpaWalk ? d.acts : {}, tallies: isLpaWalk ? {} : d.tallies, notes: isLpaWalk ? {} : d.notes,
    });
    state.rows.push(row);
    const open = isLpaWalk ? draftFindings().length : 0;
    state.draft = blankDraft(d);
    fitDraft();
    renderQuestions();
    renderWastes();
    changed();
    flash(walkStatus, open ? tx("Walk saved. {n} findings are ticked for action: add them from the results.", { n: open }) : tx("Walk saved."));
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  resetButton.addEventListener("click", () => {
    if (draftStarted() && !window.confirm(tx("Start a new walk? What you entered for this one is discarded."))) return;
    state.draft = blankDraft(state.draft);
    fitDraft();
    renderQuestions();
    renderWastes();
    changed();
  });
  // Findings of the walk in progress become actions now: one per ticked "no", owned by the area's owner, due in a week.
  actionsButton.addEventListener("click", () => {
    const found = draftFindings();
    if (!found.length || !Actions) return;
    const d = state.draft;
    const n = handOver(found.map(({ index }) => ({ row: { ...d, template: state.template }, index })));
    found.forEach(({ index }) => {
      delete d.acts[index];
      const box = questionsBox.querySelector(`[data-act="${index}"]`);
      if (box) box.checked = false;
    });
    save();
    renderProgress();
    addedNote(walkStatus, n);
  });
  sheetButton.addEventListener("click", () => {
    renderSheet();
    sheet.hidden = false;
    document.documentElement.classList.add("gw-sheet-print");
    const done = () => { document.documentElement.classList.remove("gw-sheet-print"); sheet.hidden = true; window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint (some phones) get the sheet hidden a moment later.
    setTimeout(done, 2000);
  });

  // The log: remove one walk (with undo), the example, the exports and clearing.
  logBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const index = state.rows.findIndex((row) => row.id === button.dataset.remove);
    if (index < 0) return;
    const [removed] = state.rows.splice(index, 1);
    changed();
    undoNote(logStatus, tx("Removed the walk of {area} on {date}.", { area: removed.area, date: showDate(removed.date) }), () => {
      state.rows.splice(Math.min(index, state.rows.length), 0, removed);
      changed();
    });
  });
  q("[data-example]").addEventListener("click", () => {
    loadExample();
    renderQuestions();
    renderWastes();
    changed();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  q("[data-clear]").addEventListener("click", () => {
    if (!state.rows.length || !window.confirm(tx("Clear every saved walk?"))) return;
    dropExample();
    changed();
  });
  const walkRows = () => {
    const rows = [[tx("Date"), tx("Type"), tx("Layer"), tx("Checklist"), tx("Area"), tx("Walker"), tx("Shift"), tx("Minutes"), tx("Question or waste"), tx("Answer or count"), tx("Finding or note"), tx("Action")]];
    [...state.rows].sort(byDate).forEach((row) => {
      const base = [row.date, typeOf[row.type]?.short || row.type, layerName(row.layer), template(row.template).name, row.area, row.walker, row.shift, row.minutes];
      if (isLpa(row)) row.answers.forEach((answer, i) => rows.push([...base, questionOf(row, i)?.text || `${i + 1}`, answer ? answerName(answer) : "", row.findings[i] || "", row.acts[i] ? tx("yes") : ""]));
      else WASTES.forEach((key) => { if (row.tallies[key] || row.notes[key]) rows.push([...base, wasteOf[key].name, row.tallies[key], row.notes[key] || "", ""]); });
    });
    return rows;
  };
  q("[data-csv]").addEventListener("click", () => { if (state.rows.length) downloadCsv(cfg.text.csv, walkRows()); });
  q("[data-xlsx]").addEventListener("click", () => { if (state.rows.length) downloadXlsx(cfg.text.csv, walkRows()); });

  // A first visit opens on the example, so the result is visible at once; nothing is written until the visitor acts.
  if (!state.rows.length && !draftStarted() && firstVisit(KEY)) loadExample();
  renderQuestions();
  renderWastes();
  render();
})();
