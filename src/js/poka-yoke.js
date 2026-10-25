(() => {
  // Poka-Yoke Register: every mistake-proofing device of a site in one list, with the error it prevents, Shingo's
  // method (contact, fixed-value, motion-step), its function (control or warning) and its level (prevention or
  // detection), who tests it and how often. The verification log holds each test: works, failed or not tested (with
  // the reason). From the two the register works out what is due, what is overdue, what failed, how many of the due
  // tests were done on time, how often a test finds a fault, and how much each device cut its error. The state is
  // { devices: [...], checks: [{ device, date, result, by, note }], period, example, exampleDay } under one key.
  const kit = window.ToolKit;

  // The arithmetic, apart from the page, so a test can call it. Dates are YYYY-MM-DD, counted in whole days (UTC).
  const DAY = 864e5;
  const isIso = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value));
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const between = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);

  const METHODS = ["contact", "fixed", "motion"];
  const FUNCS = ["control", "warning"];
  const LEVELS = ["prevent", "detect"];
  const RESULTS = ["works", "failed", "untested"];
  // A test is a check that was done: it worked or it failed. "Not tested" is a check that did not happen.
  const isTest = (check) => check && (check.result === "works" || check.result === "failed") && isIso(check.date);

  // The tests of one device, oldest first; two on the same day keep the order they were recorded in.
  const testsOf = (id, checks) => checks.map((check, i) => ({ check, i }))
    .filter(({ check }) => check.device === id && isTest(check))
    .sort((a, b) => a.check.date.localeCompare(b.check.date) || a.i - b.i)
    .map(({ check }) => check);
  // Last verified = the latest test of the device, or the date it was last verified before it came into the register.
  const lastVerified = (device, checks) => {
    const own = isIso(device.last) ? device.last : "";
    const latest = testsOf(device.id, checks).at(-1)?.date || "";
    return latest > own ? latest : own;
  };
  // Next due = last verified + interval (in days).
  const nextDue = (last, interval) => (isIso(last) && interval > 0 ? addDays(last, interval) : "");
  // A failed test marks the device failed until a later test says it works: the latest test decides.
  const failedOn = (device, checks) => {
    const latest = testsOf(device.id, checks).at(-1);
    return latest && latest.result === "failed" ? latest.date : "";
  };
  // Status: failed first (a device that failed protects nothing, whatever its date), then overdue when today is
  // after the next due date, due today on it, ok before it; a device never verified has no date and is due now.
  const statusOf = (next, today, failed = "") => (failed ? "failed" : !isIso(next) ? "new" : today > next ? "overdue" : today === next ? "due" : "ok");
  const deviceInfo = (device, checks, interval, today) => {
    const last = lastVerified(device, checks);
    const next = nextDue(last, interval);
    const failed = failedOn(device, checks);
    const status = statusOf(next, today, failed);
    return { id: device.id, last, next, failed, status, over: next && today > next ? between(next, today) : 0, left: next && next >= today ? between(today, next) : 0 };
  };

  // The due dates of one device and whether each was met, from its anchor (the date last verified before the
  // register, else its first test) up to `until`. A test on or before a due date (and after the one before) meets it,
  // and the next date is that test + the interval. A due date that passes without a test is missed; every further
  // interval without a test is one more missed date; a late test restarts the clock without meeting anything, unless
  // it falls exactly on one of those later dates.
  const schedule = (anchor, testDates, interval, until) => {
    const slots = [];
    if (!isIso(anchor) || !(interval > 0) || !isIso(until)) return slots;
    const dates = testDates.filter((date) => isIso(date) && date > anchor).sort();
    let a = anchor;
    let d = addDays(a, interval);
    let i = 0;
    let guard = 0;
    while (d <= until && guard++ < 20000) {
      let done = "";
      while (i < dates.length && dates[i] <= d) { if (dates[i] > a) done = dates[i]; i++; }
      if (done) {
        slots.push({ due: d, done, onTime: true });
        a = done;
        d = addDays(a, interval);
        continue;
      }
      slots.push({ due: d, done: "", onTime: false });
      const late = dates[i] || "";
      let k = addDays(d, interval);
      while (k <= until && (!late || k < late) && guard++ < 20000) {
        slots.push({ due: k, done: "", onTime: false });
        k = addDays(k, interval);
      }
      if (!late) break;
      if (k === late && k <= until) slots.push({ due: k, done: late, onTime: true });
      a = late;
      i++;
      d = addDays(a, interval);
    }
    return slots;
  };
  // Verification compliance = due tests done on time ÷ due tests in the period [from, to]. A due date counts when it
  // lies in the period and before today; one due today counts only once it is met (until then it is not late yet).
  const compliance = (items, checks, from, to, today) => {
    const until = to < today ? to : today;
    let due = 0, onTime = 0;
    const per = items.map(({ device, interval }) => {
      const tests = testsOf(device.id, checks).map((check) => check.date);
      const anchor = isIso(device.last) ? device.last : tests[0] || "";
      const slots = schedule(anchor, tests, interval, until).filter((slot) => slot.due >= from && slot.due <= until && (slot.onTime || slot.due < today));
      const met = slots.filter((slot) => slot.onTime).length;
      due += slots.length;
      onTime += met;
      return { id: device.id, due: slots.length, onTime: met, rate: slots.length ? met / slots.length : null };
    });
    return { due, onTime, rate: due ? onTime / due : null, per };
  };
  // Failure rate of the tests in the period = failed ÷ (works + failed); not tested is counted apart.
  const failureRate = (checks, from, to) => {
    const inside = checks.filter((check) => isIso(check.date) && check.date >= from && check.date <= to);
    const tested = inside.filter(isTest).length;
    const failed = inside.filter((check) => isTest(check) && check.result === "failed").length;
    return { tested, failed, untested: inside.filter((check) => check.result === "untested").length, rate: tested ? failed / tested : null };
  };
  // Effectiveness = (errors per month before − after) ÷ before; only with a before above 0 and an after of 0 or more.
  const effectiveness = (before, after) => (Number.isFinite(before) && before > 0 && Number.isFinite(after) && after >= 0 ? (before - after) / before : null);
  // All devices with both figures together: (Σ before − Σ after) ÷ Σ before.
  const totalEffect = (devices) => {
    const known = devices.filter((device) => effectiveness(device.before, device.after) !== null);
    const before = known.reduce((sum, device) => sum + device.before, 0);
    const after = known.reduce((sum, device) => sum + device.after, 0);
    return { n: known.length, before, after, rate: before > 0 ? (before - after) / before : null };
  };
  // How many devices of each kind: method, function or level.
  const coverage = (devices, field, keys) => keys.map((key) => {
    const n = devices.filter((device) => device[field] === key).length;
    return { key, n, share: devices.length ? n / devices.length : 0 };
  });
  // The usual order of strength (Shingo): prevention before detection, then control before warning. 1 is strongest.
  const strength = (device) => (device.level === "prevent" ? 0 : 2) + (device.func === "control" ? 1 : 2);
  // Most urgent first: failed (the oldest failure first), overdue (the most days first), never verified, due
  // today, then the rest by their next date.
  const RANK = { failed: 0, overdue: 1, new: 2, due: 3, ok: 4 };
  const byUrgency = (a, b) => RANK[a.status] - RANK[b.status]
    || (a.status === "failed" ? a.failed.localeCompare(b.failed) : 0)
    || (a.status === "overdue" ? b.over - a.over : 0)
    || String(a.next).localeCompare(String(b.next))
    || String(a.name || "").localeCompare(String(b.name || ""));
  // The days of the checklist (the 7 days from today) on which a device is due: a failed, overdue or never verified
  // device today, the others on their next date; then every interval after.
  const checklistDays = (info, interval, today, span = 7) => {
    const end = addDays(today, span - 1);
    const out = [];
    if (!(interval > 0)) return out;
    let d = info.status === "ok" || info.status === "due" ? info.next : today;
    if (!isIso(d) || d < today) d = today;
    for (let guard = 0; d <= end && guard < 400; guard++) { out.push(d); d = addDays(d, interval); }
    return out;
  };

  // Saved devices and checks, cleaned: a device needs a name, a check a device, a date and a known result.
  const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
  const s = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const count = (v) => {
    const n = typeof v === "number" ? v : kit && typeof v === "string" && v.trim() ? kit.parseNumber(v) : NaN;
    return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
  };
  const cleanDevice = (raw, freqKeys) => {
    if (!isObject(raw) || !s(raw.name, 120)) return null;
    return {
      id: s(raw.id, 40) || `d${Math.random().toString(36).slice(2, 10)}`,
      name: s(raw.name, 120), error: s(raw.error, 200), step: s(raw.step, 160), area: s(raw.area, 80),
      method: METHODS.includes(raw.method) ? raw.method : "contact",
      func: FUNCS.includes(raw.func) ? raw.func : "warning",
      level: LEVELS.includes(raw.level) ? raw.level : "detect",
      owner: s(raw.owner, 80),
      freq: freqKeys.includes(raw.freq) ? raw.freq : freqKeys[0],
      last: isIso(raw.last) ? raw.last : "",
      test: s(raw.test, 300), fmea: s(raw.fmea, 200),
      before: count(raw.before), after: count(raw.after),
    };
  };
  const cleanCheck = (raw, ids) => {
    if (!isObject(raw) || !ids.has(raw.device) || !isIso(raw.date) || !RESULTS.includes(raw.result)) return null;
    return { id: s(raw.id, 40) || `c${Math.random().toString(36).slice(2, 10)}`, device: raw.device, date: raw.date, result: raw.result, by: s(raw.by, 80), note: s(raw.note, 300) };
  };

  // The example of the data file, dated back from today: each device was last verified `anchor` days ago and then
  // tested on every due date, except a test `late` by some days, the failures in `fails` (days ago), and no test in
  // the last `stop` days. "Not tested" entries carry their reason.
  const exampleState = (cfg, today) => {
    const daysOf = Object.fromEntries(cfg.frequencies.map((f) => [f.key, f.days]));
    const devices = [];
    const checks = [];
    cfg.example.devices.forEach((spec, n) => {
      const id = `ex${n}`;
      devices.push({ id, name: spec.name, error: spec.error, step: spec.step, area: cfg.areas[spec.area] || "", method: spec.method, func: spec.func, level: spec.level, owner: spec.owner, freq: spec.freq, last: addDays(today, -spec.anchor), test: spec.test, fmea: spec.fmea, before: spec.before, after: spec.after });
      const interval = daysOf[spec.freq];
      const notes = Object.fromEntries(spec.notes.map(([ago, text]) => [ago, text]));
      const lastDay = addDays(today, -spec.stop);
      let due = addDays(today, interval - spec.anchor);
      for (let guard = 0; due <= lastDay && guard < 400; guard++) {
        const date = addDays(due, spec.late[between(due, today)] || 0);
        if (date > lastDay) break;
        const ago = between(date, today);
        checks.push({ id: `${id}c${checks.length}`, device: id, date, result: spec.fails.includes(ago) ? "failed" : "works", by: spec.owner, note: notes[ago] || "" });
        due = addDays(date, interval);
      }
      spec.untested.forEach(([ago, reason]) => checks.push({ id: `${id}u${ago}`, device: id, date: addDays(today, -ago), result: "untested", by: spec.owner, note: reason }));
    });
    checks.sort((a, b) => a.date.localeCompare(b.date));
    return { devices, checks };
  };

  window.PokaYokeMath = {
    METHODS, FUNCS, LEVELS, RESULTS, isIso, addDays, between, isTest, testsOf, lastVerified, nextDue, failedOn, statusOf, deviceInfo,
    schedule, compliance, failureRate, effectiveness, totalEffect, coverage, strength, byUrgency, checklistDays, cleanDevice, cleanCheck, exampleState,
  };

  // The page.
  const dataEl = document.getElementById("poka-yoke-data");
  const root = document.querySelector("[data-poka-yoke]");
  if (!dataEl || !root || !kit) return;
  const Chart = window.ChartKit || null;
  const Actions = window.ActionsStore || null;
  const Workplace = window.Workplace || null;
  const { tx, int, pct, num, showDate, write, loadState, el, today, parseDate, parseNumber, panel, stat, barList, focusCard, resultLayout, flash, undoNote, downloadCsv, downloadXlsx, firstVisit, lower } = kit;
  const M = window.PokaYokeMath;
  const cfg = JSON.parse(dataEl.textContent);
  const t = cfg.text;
  const KEY = cfg.storageKey;
  const TOOL = "poka-yoke";
  const FREQS = cfg.frequencies.map((f) => f.key);
  const intervalOf = (key) => cfg.frequencies.find((f) => f.key === key)?.days || 1;
  const nameIn = (list, key, field = "name") => (list.find((item) => item.key === key) || {})[field] || key;
  const methodName = (key) => nameIn(cfg.methods, key, "short");
  const funcName = (key) => nameIn(cfg.functions, key, "short");
  const levelName = (key) => nameIn(cfg.levels, key, "short");
  const freqName = (key) => nameIn(cfg.frequencies, key);
  const resultName = (key) => nameIn(cfg.results, key);
  const id = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  const form = root.querySelector("[data-device-form]");
  const f = form.elements;
  const formLegend = form.querySelector("[data-form-legend]");
  const formStatus = root.querySelector("[data-form-status]");
  const cancelEdit = root.querySelector("[data-cancel-edit]");
  const submitDevice = root.querySelector("[data-submit-device]");
  const verifyForm = root.querySelector("[data-verify-form]");
  const v = verifyForm.elements;
  const verifyStatus = root.querySelector("[data-verify-status]");
  const handoff = root.querySelector("[data-handoff]");
  const reasonField = root.querySelector("[data-reason-field]");
  const registerBody = root.querySelector("[data-register]");
  const registerWrap = root.querySelector("[data-register-wrap]");
  const registerEmpty = root.querySelector("[data-register-empty]");
  const registerCount = root.querySelector("[data-register-count]");
  const registerStatus = root.querySelector("[data-register-status]");
  const logBody = root.querySelector("[data-checks]");
  const logWrap = root.querySelector("[data-checks-wrap]");
  const logEmpty = root.querySelector("[data-checks-empty]");
  const periodSelect = root.querySelector("[data-period]");
  const exampleNote = root.querySelector("[data-example-note]");
  const areaList = root.querySelector("#py-areas");
  const results = document.querySelector("[data-results]");
  const fmeaUrl = root.querySelector("a[data-fmea]")?.href || new URL("../fmea/", location.href).href;
  const whysBase = root.querySelector("a[data-five-whys]")?.href || new URL("../five-whys/", location.href).href;

  const state = loadState(KEY, { devices: [], checks: [], period: 30, example: false, exampleDay: "" });
  const cleanAll = () => {
    state.devices = state.devices.map((raw) => M.cleanDevice(raw, FREQS)).filter(Boolean).slice(0, 500);
    const ids = new Set(state.devices.map((device) => device.id));
    state.checks = state.checks.map((raw) => M.cleanCheck(raw, ids)).filter(Boolean).slice(-20000);
  };
  cleanAll();
  if (![7, 30, 90].includes(state.period)) state.period = 30;
  const save = () => write(KEY, state);
  let editing = "";

  const loadExample = () => {
    const ex = M.exampleState(cfg, today());
    state.devices = ex.devices;
    state.checks = ex.checks;
    state.example = true;
    state.exampleDay = today();
  };
  // A first visit opens on the example; an example left untouched since another day is dated again from today, so
  // its overdue and due devices stay what they were meant to show.
  if (firstVisit(KEY)) { loadExample(); save(); }
  else if (state.example && state.exampleDay !== today()) { loadExample(); save(); }
  // The visitor's own work ends the example: the first own device replaces it, a check on it keeps it an example.
  const leaveExample = () => {
    if (!state.example) return;
    state.devices = [];
    state.checks = [];
    state.example = false;
    state.exampleDay = "";
  };

  const areaNames = () => {
    const own = Workplace?.areas().length ? Workplace.areas().map((area) => area.name) : cfg.areas;
    return [...new Set([...own, ...state.devices.map((device) => device.area).filter(Boolean)])];
  };
  const shiftNames = () => (Workplace?.shifts().length ? Workplace.shifts() : cfg.shifts);
  const deviceById = (deviceId) => state.devices.find((device) => device.id === deviceId) || null;
  const infos = () => {
    const now = today();
    return state.devices.map((device) => ({ ...M.deviceInfo(device, state.checks, intervalOf(device.freq), now), name: device.name, device }));
  };
  const dueText = (info) => {
    if (info.status === "failed") return `✕ ${cfg.statuses.failed} · ${showDate(info.failed)}`;
    if (info.status === "overdue") return `! ${cfg.statuses.overdue} · ${info.over === 1 ? tx("1 day") : tx("{n} days", { n: int.format(info.over) })}`;
    if (info.status === "new") return `! ${cfg.statuses.new}`;
    if (info.status === "due") return `• ${cfg.statuses.due}`;
    return `✓ ${cfg.statuses.ok} · ${info.left === 1 ? tx("due tomorrow") : tx("due in {n} days", { n: int.format(info.left) })}`;
  };
  const statusTag = (info) => el("span", `py-status is-${info.status}`, dueText(info));
  const deviceCount = (n) => (n === 1 ? tx("1 poka-yoke device") : tx("{n} poka-yoke devices", { n: int.format(n) }));
  const kindText = (device) => `${methodName(device.method)} · ${funcName(device.func)} · ${levelName(device.level)}`;

  // Hand-offs: the repair to the Action Tracker (high priority), the cause to 5 Whys, the failure mode to the FMEA.
  const repairAction = (device) => () => ({
    title: tx("Repair and re-verify: {device}", { device: device.name }),
    detail: `${tx("Failed its verification on {date}.", { date: showDate(failedDate(device)) })} ${device.error ? `${tx("Error it prevents")}: ${device.error}.` : ""} ${checkNote(device)}`.trim(),
    owner: device.owner,
    due: M.addDays(today(), 1),
    source: TOOL,
    area: device.area,
    priority: "High",
    check: tx("Tested with the deliberate error again and the result “works” recorded in the register."),
  });
  const overdueAction = (device) => () => ({
    title: tx("Verify the overdue device: {device}", { device: device.name }),
    detail: `${device.error ? `${tx("Error it prevents")}: ${device.error}. ` : ""}${device.test ? `${tx("How to test it")}: ${device.test}` : ""}`.trim(),
    owner: device.owner,
    due: today(),
    source: TOOL,
    area: device.area,
    priority: "Medium",
    check: tx("A test is recorded and the device shows as OK."),
  });
  const failedDate = (device) => M.failedOn(device, state.checks);
  const checkNote = (device) => {
    const latest = M.testsOf(device.id, state.checks).at(-1);
    return latest?.note || "";
  };
  const actionLink = (getAction) => (Actions ? Actions.linkButton(tx("Add to actions"), getAction) : kit.trackerLink(tx("Add to actions"), getAction));
  const whysLink = (device) => {
    const link = el("a", "button-secondary", tx("Take it to 5 Whys"));
    const url = new URL(whysBase);
    url.searchParams.set("problem", tx("{device} failed its verification: {error}", { device: device.name, error: device.error || device.name }));
    link.href = url.href;
    return link;
  };
  const fmeaLink = (device, className = "button-secondary") => {
    const link = el("a", className, tx("Open FMEA"));
    link.href = fmeaUrl;
    link.title = `${tx("Failure mode")}: ${device.fmea}`;
    return link;
  };

  // The form's lists: areas from the workplace profile or the page, the devices of the verify form.
  const fillLists = () => {
    areaList.replaceChildren(...areaNames().map((name) => { const option = el("option"); option.value = name; return option; }));
    const keep = v.device.value;
    v.device.replaceChildren(...state.devices.map((device) => { const option = el("option", null, device.area ? `${device.name} · ${device.area}` : device.name); option.value = device.id; return option; }));
    if (deviceById(keep)) v.device.value = keep;
    verifyForm.querySelector("fieldset").disabled = !state.devices.length;
  };

  const smallButton = (label, onClick, className = "button-ghost") => {
    const button = el("button", `${className} py-small`, label);
    button.type = "button";
    button.addEventListener("click", onClick);
    return button;
  };
  const renderRegister = () => {
    const list = infos().sort(M.byUrgency);
    registerWrap.hidden = !list.length;
    registerEmpty.hidden = Boolean(list.length);
    registerCount.textContent = list.length ? deviceCount(list.length) : "";
    registerBody.replaceChildren(...list.map((info) => {
      const device = info.device;
      const tr = el("tr");
      const name = el("td");
      name.append(el("strong", null, device.name));
      if (device.error) name.append(el("span", "py-cell-note", device.error));
      const where = el("td");
      where.append(device.area || "–");
      if (device.step) where.append(el("span", "py-cell-note", device.step));
      const tools = el("td", "py-row-tools");
      tools.append(smallButton(tx("Verify now"), () => openVerify(device.id), "button-secondary"), smallButton(tx("Edit"), () => startEdit(device.id)), smallButton(tx("Remove"), () => removeDevice(device.id)));
      tools.lastChild.setAttribute("aria-label", tx("Remove {item}", { item: device.name }));
      const status = el("td");
      status.append(statusTag(info));
      tr.append(name, where, el("td", null, kindText(device)), el("td", "nowrap", freqName(device.freq)), el("td", "nowrap", info.last ? showDate(info.last) : "–"), el("td", "nowrap", info.next ? showDate(info.next) : "–"), status, tools);
      return tr;
    }));
  };
  const renderLog = () => {
    const rows = state.checks.map((check, i) => ({ check, i })).sort((a, b) => b.check.date.localeCompare(a.check.date) || b.i - a.i).slice(0, 60);
    logWrap.hidden = !rows.length;
    logEmpty.hidden = Boolean(rows.length);
    logBody.replaceChildren(...rows.map(({ check }) => {
      const tr = el("tr");
      const result = el("td");
      result.append(el("span", `py-result is-${check.result}`, `${check.result === "works" ? "✓" : check.result === "failed" ? "✕" : "–"} ${resultName(check.result)}`));
      const tools = el("td");
      const remove = smallButton(tx("Remove"), () => removeCheck(check.id));
      remove.setAttribute("aria-label", tx("Remove the check of {date}", { date: showDate(check.date) }));
      tools.append(remove);
      tr.append(el("td", "nowrap", showDate(check.date)), el("td", null, deviceById(check.device)?.name || ""), result, el("td", null, check.by), el("td", null, check.note), tools);
      return tr;
    }));
  };

  const render = () => {
    fillLists();
    renderRegister();
    renderLog();
    exampleNote.hidden = !state.example;
    periodSelect.value = String(state.period);
    renderResults();
  };

  // Device form.
  const resetForm = () => {
    editing = "";
    form.reset();
    formLegend.textContent = formLegend.dataset.add;
    submitDevice.textContent = submitDevice.dataset.add;
    cancelEdit.hidden = true;
  };
  const startEdit = (deviceId) => {
    const device = deviceById(deviceId);
    if (!device) return;
    editing = deviceId;
    ["name", "error", "step", "area", "method", "func", "level", "owner", "freq", "test", "fmea"].forEach((name) => { f[name].value = device[name]; });
    f.last.value = device.last;
    f.before.value = device.before === null ? "" : num(device.before, Number.isInteger(device.before) ? 0 : 1);
    f.after.value = device.after === null ? "" : num(device.after, Number.isInteger(device.after) ? 0 : 1);
    formLegend.textContent = formLegend.dataset.edit;
    submitDevice.textContent = submitDevice.dataset.edit;
    cancelEdit.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    f.name.focus({ preventScroll: true });
  };
  cancelEdit.addEventListener("click", () => { resetForm(); flash(formStatus, ""); });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!f.name.value.trim()) { f.name.focus(); flash(formStatus, tx("Name the device.")); return; }
    if (!f.error.value.trim()) { f.error.focus(); flash(formStatus, tx("Write the error the device prevents.")); return; }
    const last = f.last.value.trim() ? parseDate(f.last.value) : "";
    if (f.last.value.trim() && !last) { f.last.focus(); flash(formStatus, tx("Enter the date it was last verified, or leave it empty.")); return; }
    if (last && last > today()) { f.last.focus(); flash(formStatus, tx("The last verification cannot be in the future.")); return; }
    const figure = (input) => (input.value.trim() ? parseNumber(input.value) : null);
    const before = figure(f.before), after = figure(f.after);
    if ((before !== null && !(before >= 0)) || (after !== null && !(after >= 0))) { (before !== null && !(before >= 0) ? f.before : f.after).focus(); flash(formStatus, tx("Errors per month are numbers of 0 or more.")); return; }
    const raw = { name: f.name.value, error: f.error.value, step: f.step.value, area: f.area.value, method: f.method.value, func: f.func.value, level: f.level.value, owner: f.owner.value, freq: f.freq.value, last, test: f.test.value, fmea: f.fmea.value, before, after };
    if (editing && deviceById(editing)) {
      const index = state.devices.findIndex((device) => device.id === editing);
      state.devices[index] = M.cleanDevice({ ...raw, id: editing }, FREQS);
      save();
      flash(formStatus, tx("Saved: {device}.", { device: state.devices[index].name }));
    } else {
      leaveExample();
      const device = M.cleanDevice({ ...raw, id: id("d") }, FREQS);
      state.devices.push(device);
      save();
      flash(formStatus, tx("Added to the register: {device}.", { device: device.name }));
    }
    resetForm();
    render();
  });

  const removeDevice = (deviceId) => {
    const index = state.devices.findIndex((device) => device.id === deviceId);
    if (index < 0) return;
    const [device] = state.devices.splice(index, 1);
    const checks = state.checks.filter((check) => check.device === deviceId);
    state.checks = state.checks.filter((check) => check.device !== deviceId);
    if (editing === deviceId) resetForm();
    save();
    render();
    undoNote(registerStatus, tx("Removed {item}.", { item: device.name }), () => {
      state.devices.splice(Math.min(index, state.devices.length), 0, device);
      state.checks = [...state.checks, ...checks].sort((a, b) => a.date.localeCompare(b.date));
      save();
      render();
    });
  };
  const removeCheck = (checkId) => {
    const index = state.checks.findIndex((check) => check.id === checkId);
    if (index < 0) return;
    const [check] = state.checks.splice(index, 1);
    save();
    render();
    undoNote(verifyStatus, tx("Removed the check of {date}.", { date: showDate(check.date) }), () => {
      state.checks.splice(Math.min(index, state.checks.length), 0, check);
      save();
      render();
    });
  };

  // Verify form.
  const showReason = () => {
    const untested = v.result.value === "untested";
    reasonField.querySelector("label").textContent = untested ? reasonField.dataset.reason : reasonField.dataset.note;
    v.note.placeholder = untested ? t.reasonPlaceholder : t.notePlaceholder;
    v.note.required = untested;
  };
  verifyForm.querySelectorAll("input[name=result]").forEach((input) => input.addEventListener("change", showReason));
  v.device.addEventListener("change", () => { const device = deviceById(v.device.value); if (device) v.by.value = device.owner; });
  const openVerify = (deviceId) => {
    const device = deviceById(deviceId);
    if (!device) return;
    v.device.value = deviceId;
    v.by.value = device.owner;
    v.date.value = today();
    verifyForm.scrollIntoView({ behavior: "smooth", block: "start" });
    v.device.focus({ preventScroll: true });
  };
  verifyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const device = deviceById(v.device.value);
    if (!device) { flash(verifyStatus, tx("Add a device to the register first.")); return; }
    const date = parseDate(v.date.value);
    if (!date) { v.date.focus(); flash(verifyStatus, tx("Enter the date of the check.")); return; }
    if (date > today()) { v.date.focus(); flash(verifyStatus, tx("A check cannot be in the future.")); return; }
    const result = v.result.value;
    if (!M.RESULTS.includes(result)) { flash(verifyStatus, tx("Choose the result.")); return; }
    if (result === "untested" && !v.note.value.trim()) { v.note.focus(); flash(verifyStatus, tx("Write why it could not be tested.")); return; }
    const check = M.cleanCheck({ id: id("c"), device: device.id, date, result, by: v.by.value, note: v.note.value }, new Set([device.id]));
    state.checks.push(check);
    state.checks.sort((a, b) => a.date.localeCompare(b.date));
    save();
    v.note.value = "";
    handoff.replaceChildren();
    handoff.hidden = true;
    if (result === "failed") {
      handoff.append(el("p", null, `✕ ${tx("{device} failed on {date}.", { device: device.name, date: showDate(date) })} ${t.failedHandoff}`));
      const buttons = el("div", "tool-actions");
      buttons.append(actionLink(repairAction(device)), whysLink(device));
      if (device.fmea) buttons.append(fmeaLink(device));
      handoff.append(buttons);
      handoff.hidden = false;
    }
    flash(verifyStatus, result === "works" ? tx("Recorded: {device} works.", { device: device.name }) : result === "failed" ? tx("Recorded: {device} failed.", { device: device.name }) : tx("Recorded: {device} not tested, still due.", { device: device.name }));
    render();
  });

  periodSelect.addEventListener("change", () => {
    state.period = Number(periodSelect.value) || 30;
    save();
    renderResults();
  });

  // Results.
  const periodRange = () => ({ from: M.addDays(today(), 1 - state.period), to: today() });
  const analyse = () => {
    const list = infos();
    const range = periodRange();
    const comp = M.compliance(state.devices.map((device) => ({ device, interval: intervalOf(device.freq) })), state.checks, range.from, range.to, today());
    const fail = M.failureRate(state.checks, range.from, range.to);
    const effect = M.totalEffect(state.devices);
    const urgent = [...list].sort(M.byUrgency);
    const unproven = list.filter((info) => info.status === "failed" || info.status === "overdue" || info.status === "new");
    return {
      list, urgent, range, comp, fail, effect, unproven,
      failed: list.filter((info) => info.status === "failed"),
      overdue: list.filter((info) => info.status === "overdue"),
      due: list.filter((info) => info.status === "due"),
      method: M.coverage(state.devices, "method", M.METHODS),
      func: M.coverage(state.devices, "func", M.FUNCS),
      level: M.coverage(state.devices, "level", M.LEVELS),
    };
  };
  const periodText = (a) => `${showDate(a.range.from)} – ${showDate(a.range.to)}`;
  const compText = (a) => (a.comp.rate === null ? "–" : pct(a.comp.rate, 1));
  const failText = (a) => (a.fail.rate === null ? "–" : pct(a.fail.rate, 1));
  const effectText = (rate) => (rate === null ? "–" : rate >= 0 ? `−${pct(rate, 0)}` : `+${pct(-rate, 0)}`);
  const figureText = (n) => num(n, Number.isInteger(n) ? 0 : 1);
  const coverageText = (items, nameOf) => items.map((item) => `${nameOf(item.key)} ${int.format(item.n)}`).join(" · ");

  const summaryText = (a) => {
    const lines = [`${t.tool} | Stiven Catalyst`, `${tx("Date")}: ${showDate(today())}`, ""];
    lines.push(`${tx("Devices")}: ${int.format(a.list.length)} (${coverageText(a.level, levelName)}; ${coverageText(a.func, funcName)})`);
    lines.push(`${tx("Not proven to work today")}: ${int.format(a.unproven.length)} (${tx("{f} failed, {o} overdue", { f: int.format(a.failed.length), o: int.format(a.overdue.length) })})`);
    lines.push(`${tx("Verification compliance")} (${periodText(a)}): ${compText(a)} (${tx("{a} of {b} due checks on time", { a: int.format(a.comp.onTime), b: int.format(a.comp.due) })})`);
    lines.push(`${tx("Failure rate of the checks")}: ${failText(a)} (${tx("{a} failed of {b} tests", { a: int.format(a.fail.failed), b: int.format(a.fail.tested) })})`);
    if (a.effect.n) lines.push(`${tx("Errors per month, before → after")}: ${figureText(a.effect.before)} → ${figureText(a.effect.after)} (${effectText(a.effect.rate)}, ${tx("{n} devices with both figures", { n: int.format(a.effect.n) })})`);
    lines.push("", `${tx("Most urgent")}:`);
    a.urgent.filter((info) => info.status !== "ok").forEach((info) => lines.push(`- ${dueText(info)} · ${info.name}${info.device.area ? ` (${info.device.area})` : ""}${info.device.owner ? ` · ${info.device.owner}` : ""}`));
    if (!a.urgent.some((info) => info.status !== "ok")) lines.push(`- ${tx("Nothing due today.")}`);
    lines.push("", `${tx("By method")}: ${coverageText(a.method, methodName)}`, `${tx("By level")}: ${coverageText(a.level, levelName)}`, `${tx("By function")}: ${coverageText(a.func, funcName)}`);
    return lines.join("\n");
  };

  const problemOf = (a) => {
    const top = a.urgent[0];
    if (!top) return t.tool;
    if (top.status === "failed") return tx("{device} failed its verification: {error}", { device: top.name, error: top.device.error || top.name });
    if (top.status === "overdue") return tx("{device} is overdue for its verification", { device: top.name });
    return t.tool;
  };

  const focusFor = (a) => {
    const top = a.urgent[0];
    if (!top) return null;
    const device = top.device;
    const buttons = el("div", "tool-actions");
    if (top.status === "failed") {
      const card = focusCard({ title: device.name, detail: cfg.statuses.failed, lede: tx("Failed its verification on {date}. Until a later check says it works, “{error}” is not protected.", { date: showDate(top.failed), error: device.error || device.name }), advice: cfg.advice.failed });
      buttons.append(actionLink(repairAction(device)), whysLink(device));
      if (device.fmea) buttons.append(fmeaLink(device));
      buttons.append(smallButton(tx("Verify now"), () => openVerify(device.id), "button-secondary"));
      card.append(buttons);
      return card;
    }
    if (top.status === "overdue" || top.status === "new") {
      const lede = top.status === "overdue"
        ? tx("Due on {date}, {n} overdue. Nobody has proven since {last} that it stops “{error}”.", { date: showDate(top.next), n: top.over === 1 ? tx("1 day") : tx("{n} days", { n: int.format(top.over) }), last: showDate(top.last), error: device.error || device.name })
        : tx("Never verified: nobody has proven that it stops “{error}”.", { error: device.error || device.name });
      const card = focusCard({ title: device.name, detail: top.status === "overdue" ? cfg.statuses.overdue : cfg.statuses.new, lede, advice: top.status === "overdue" ? cfg.advice.overdue : cfg.advice.new });
      buttons.append(smallButton(tx("Verify now"), () => openVerify(device.id), "button-primary"), actionLink(overdueAction(device)));
      card.append(buttons);
      return card;
    }
    const weakest = [...state.devices].sort((x, y) => M.strength(y) - M.strength(x))[0];
    return focusCard({ title: tx("Every device works and is tested on time"), detail: weakest ? tx("weakest: {device}", { device: weakest.name }) : "", lede: weakest ? tx("{device} is {kind}: the strongest move now is to make that error impossible or stop the process.", { device: weakest.name, kind: lower(`${levelName(weakest.level)} + ${funcName(weakest.func)}`) }) : "", advice: cfg.advice.weak });
  };

  // The due list: every device that is not OK, most urgent first, and the next few OK ones, each with its label.
  const dueList = (a) => {
    const box = el("article", "dl-panel py-due");
    box.append(el("h3", "result-label", tx("What to verify, most urgent first")));
    const shown = [...a.urgent.filter((info) => info.status !== "ok"), ...a.urgent.filter((info) => info.status === "ok").slice(0, 3)];
    const list = el("ol", "py-due-list");
    shown.forEach((info) => {
      const item = el("li", `py-due-item is-${info.status}`);
      const main = el("div", "py-due-main");
      main.append(statusTag(info), el("strong", null, info.name));
      const meta = [info.device.area, info.device.owner, freqName(info.device.freq), info.next ? `${tx("Next due")} ${showDate(info.next)}` : ""].filter(Boolean).join(" · ");
      main.append(el("span", "py-cell-note", meta));
      const tools = el("div", "py-due-tools");
      tools.append(smallButton(tx("Verify now"), () => openVerify(info.id), "button-secondary"));
      if (info.status === "failed") tools.append(actionLink(repairAction(info.device)));
      if (info.device.fmea) tools.append(fmeaLink(info.device, "button-ghost py-small"));
      item.append(main, tools);
      list.append(item);
    });
    box.append(list);
    if (a.urgent.length > shown.length) box.append(el("p", "dl-panel-note", tx("{n} more devices are OK and not due soon; the register lists them all.", { n: int.format(a.urgent.length - shown.length) })));
    return box;
  };

  const methodPanel = (a) => {
    const box = panel(tx("Devices by method"), `${tx("Shingo's three methods, split by level.")} ${coverageText(a.method, methodName)}.`);
    if (Chart) {
      const groups = M.METHODS.map((key) => ({ label: methodName(key), parts: M.LEVELS.map((level) => ({ key: levelName(level), value: state.devices.filter((device) => device.method === key && device.level === level).length })) }));
      box.append(Chart.figure(Chart.stacked(groups, { title: tx("Devices by method"), keys: M.LEVELS.map(levelName), format: (value) => int.format(value) }), { fileName: "poka-yoke-methods" }));
    }
    return box;
  };
  const levelPanel = (a) => {
    const box = panel(tx("Devices by level and function"), t.strengthNote);
    const rows = [0, 1, 2, 3].map((rank) => {
      const level = M.LEVELS[rank < 2 ? 0 : 1];
      const func = M.FUNCS[rank % 2];
      const devices = state.devices.filter((device) => device.level === level && device.func === func);
      return { key: cfg.strengths[rank], value: devices.length, devices };
    });
    box.append(barList(rows, { ranked: true, label: (item) => [int.format(item.value), item.devices.length ? ` · ${item.devices.map((device) => device.name).join(", ")}` : ""], highlight: (item) => item === rows[0] }));
    box.append(el("p", "dl-panel-note", `${tx("By level")}: ${coverageText(a.level, levelName)} · ${tx("By function")}: ${coverageText(a.func, funcName)}`));
    return box;
  };
  const effectPanel = () => {
    const items = state.devices.map((device) => ({ device, rate: M.effectiveness(device.before, device.after) })).filter((item) => item.rate !== null).sort((x, y) => y.rate - x.rate || x.device.name.localeCompare(y.device.name));
    const box = panel(tx("Effectiveness ranking"), t.effectivenessNote);
    if (!items.length) {
      box.append(el("p", "dl-panel-note", tx("Enter the errors per month before and after for a device to see how much it cut its error.")));
      return box;
    }
    box.append(barList(items.map((item) => ({ key: item.device.name, value: Math.max(0, item.rate), item })), {
      ranked: true,
      label: (row) => [effectText(row.item.rate), ` · ${tx("{a} → {b} per month", { a: figureText(row.item.device.before), b: figureText(row.item.device.after) })}`],
      highlight: (row) => row.item === items[0],
    }));
    const missing = state.devices.length - items.length;
    if (missing) box.append(el("p", "dl-panel-note", tx("{n} devices without before and after figures are left out.", { n: int.format(missing) })));
    return box;
  };
  const compliancePanel = (a) => {
    const box = panel(tx("Compliance by device"), t.complianceNote);
    const rows = a.comp.per.filter((row) => row.due > 0).map((row) => ({ key: deviceById(row.id)?.name || "", value: row.rate, row })).sort((x, y) => x.value - y.value || x.key.localeCompare(y.key));
    box.append(barList(rows, { label: (item) => [pct(item.value, 0), ` · ${tx("{a} of {b} on time", { a: int.format(item.row.onTime), b: int.format(item.row.due) })}`], highlight: (item) => item.value < 1 }));
    return box;
  };
  const unprotectedPanel = (a) => {
    const box = panel(tx("Errors not protected today"), tx("The errors whose device failed, is overdue or was never verified: until it is tested, nobody knows that it still stops them."));
    if (!a.unproven.length) {
      box.append(el("p", "dl-panel-note", `✓ ${tx("Every error in the register has a device that was proven to work within its interval.")}`));
      return box;
    }
    const list = el("ul", "py-unprotected");
    [...a.unproven].sort(M.byUrgency).forEach((info) => {
      const item = el("li");
      item.append(el("strong", null, info.device.error || info.name), ` · ${info.name} · ${dueText(info)}`);
      list.append(item);
    });
    box.append(list);
    return box;
  };

  // The checklist of the 7 days from today, on paper: a box for each day a device is due (one per shift for the
  // each-shift devices), a column for the initials.
  const checklist = () => {
    const now = today();
    const days = Array.from({ length: 7 }, (_, i) => M.addDays(now, i));
    const label = kit.dayMonth(true);
    const shifts = shiftNames();
    const section = el("section", "py-checklist");
    const head = el("div", "py-checklist-head");
    head.append(el("h3", "result-label", `${tx("Verification checklist")} · ${showDate(days[0])} – ${showDate(days[6])}`));
    const print = el("button", "button-secondary", tx("Print the checklist"));
    print.type = "button";
    print.addEventListener("click", () => {
      document.body.classList.add("py-print-checklist");
      window.print();
    });
    head.append(print);
    section.append(head, el("p", "dl-panel-note", t.checklistNote));
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table py-checklist-table");
    const tr = el("tr");
    [tx("Device"), tx("How to test it"), ...days.map((day) => label(new Date(`${day}T00:00:00Z`))), tx("Initials")].forEach((text) => { const th = el("th", null, text); th.scope = "col"; tr.append(th); });
    const thead = el("thead");
    thead.append(tr);
    const body = el("tbody");
    infos().sort(M.byUrgency).forEach((info) => {
      const due = new Set(M.checklistDays(info, intervalOf(info.device.freq), now));
      if (!due.size) return;
      const row = el("tr");
      const name = el("th");
      name.scope = "row";
      name.append(el("strong", null, info.name));
      name.append(el("span", "py-cell-note", [info.device.area, freqName(info.device.freq), info.status === "ok" ? "" : dueText(info)].filter(Boolean).join(" · ")));
      row.append(name, el("td", "py-test-cell", info.device.test || info.device.error));
      days.forEach((day) => {
        const cell = el("td", "py-day");
        if (due.has(day)) {
          (info.device.freq === "shift" ? shifts : [""]).forEach((shift) => {
            const box = el("span", "py-box");
            box.setAttribute("aria-label", `${tx("To check")} ${showDate(day)}${shift ? ` · ${shift}` : ""}`);
            box.setAttribute("role", "img");
            box.append(el("span", "py-box-mark", "☐"));
            if (shift) box.append(el("span", "py-box-shift", shift.slice(0, 1)));
            cell.append(box);
          });
        }
        row.append(cell);
      });
      row.append(el("td", "py-initials"));
      body.append(row);
    });
    table.append(thead, body);
    wrap.append(table);
    section.append(wrap);
    if (state.devices.some((device) => device.freq === "shift")) section.append(el("p", "dl-panel-note", `${tx("Shifts")}: ${shifts.map((shift) => `${shift.slice(0, 1)} = ${shift}`).join(" · ")}`));
    return section;
  };
  window.addEventListener("afterprint", () => document.body.classList.remove("py-print-checklist"));

  const renderResults = () => {
    results.replaceChildren();
    results.hidden = !state.devices.length;
    if (!state.devices.length) return;
    const a = analyse();
    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${showDate(today())}`));
    const title = el("h2");
    title.append(el("span", null, deviceCount(a.list.length)), ` · ${a.unproven.length ? tx("{n} not proven to work today", { n: int.format(a.unproven.length) }) : tx("all proven to work")}`);
    head.append(title);

    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Devices"), int.format(a.list.length), `${coverageText(a.level, levelName)} · ${coverageText(a.func, funcName)}`));
    stats.append(stat(tx("Overdue"), int.format(a.overdue.length), a.overdue.length ? a.overdue.map((info) => info.name).join(", ") : tx("none overdue")));
    stats.append(stat(tx("Failed"), int.format(a.failed.length), a.failed.length ? a.failed.map((info) => info.name).join(", ") : tx("no device failed")));
    stats.append(stat(tx("Verification compliance"), compText(a), `${tx("{a} of {b} due checks on time", { a: int.format(a.comp.onTime), b: int.format(a.comp.due) })} · ${periodText(a)}`));
    stats.append(stat(tx("Failure rate of the checks"), failText(a), `${tx("{a} failed of {b} tests", { a: int.format(a.fail.failed), b: int.format(a.fail.tested) })}${a.fail.untested ? ` · ${tx("{n} not tested", { n: int.format(a.fail.untested) })}` : ""}`));
    if (a.effect.n) stats.append(stat(tx("Errors per month"), effectText(a.effect.rate), `${figureText(a.effect.before)} → ${figureText(a.effect.after)} · ${tx("{n} devices with both figures", { n: int.format(a.effect.n) })}`));

    const notes = [el("p", "dl-panel-note py-def", `${t.complianceNote} ${t.failureNote}`), dueList(a)];
    const focus = focusFor(a);
    const actions = kit.resultActions(() => summaryText(a), problemOf(a));
    const panels = [methodPanel(a), levelPanel(a), effectPanel(), compliancePanel(a), unprotectedPanel(a)];
    resultLayout(results, { head, stats, notes, focus, actions, panels });
    results.append(checklist());
  };

  // Exports.
  const registerRows = () => {
    const list = infos();
    return [
      [tx("Device"), tx("Error it prevents"), tx("Process step"), tx("Area"), tx("Method"), tx("Function"), tx("Level"), tx("Owner"), tx("Frequency"), tx("Interval (days)"), tx("Last verified"), tx("Next due"), tx("Status"), tx("How to test it"), tx("FMEA failure mode"), tx("Errors per month before"), tx("Errors per month after"), tx("Effectiveness")],
      ...list.map((info) => {
        const d = info.device;
        const rate = M.effectiveness(d.before, d.after);
        return [d.name, d.error, d.step, d.area, methodName(d.method), funcName(d.func), levelName(d.level), d.owner, freqName(d.freq), intervalOf(d.freq), info.last, info.next, cfg.statuses[info.status], d.test, d.fmea, d.before ?? "", d.after ?? "", rate === null ? "" : Math.round(rate * 1000) / 1000];
      }),
    ];
  };
  const logRows = () => [
    [tx("Date"), tx("Device"), tx("Area"), tx("Result"), tx("Who"), tx("Note")],
    ...state.checks.map((check) => { const d = deviceById(check.device); return [check.date, d?.name || "", d?.area || "", resultName(check.result), check.by, check.note]; }),
  ];
  root.querySelector("[data-csv]").addEventListener("click", () => downloadCsv(t.csv, registerRows()));
  root.querySelector("[data-xlsx]").addEventListener("click", () => downloadXlsx(t.csv, registerRows(), { sheet: t.tool, title: t.tool }));
  root.querySelector("[data-log-csv]").addEventListener("click", () => downloadCsv(t.logCsv, logRows()));
  root.querySelector("[data-log-xlsx]").addEventListener("click", () => downloadXlsx(t.logCsv, logRows(), { title: t.tool }));
  root.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => {
    loadExample();
    resetForm();
    save();
    render();
    results.focus({ preventScroll: true });
  }));
  root.querySelector("[data-clear-example]").addEventListener("click", () => {
    state.devices = [];
    state.checks = [];
    state.example = false;
    state.exampleDay = "";
    resetForm();
    handoff.hidden = true;
    save();
    render();
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.devices.length && !state.checks.length) return;
    if (!window.confirm(tx("Clear the whole register and its checks?"))) return;
    state.devices = [];
    state.checks = [];
    state.example = false;
    state.exampleDay = "";
    resetForm();
    handoff.hidden = true;
    save();
    render();
  });

  // Another tab (or Team sync) changed the register: take it over.
  window.addEventListener("storage", (event) => {
    if (event.key === KEY || event.key === null) {
      const fresh = loadState(KEY, { devices: [], checks: [], period: 30, example: false, exampleDay: "" });
      Object.assign(state, fresh);
      cleanAll();
      render();
    } else if (Workplace && event.key === Workplace.KEY) render();
  });
  if (Workplace) window.addEventListener("workplace:changed", render);

  resetForm();
  v.date.value = today();
  showReason();
  render();
  if (state.devices[0]) { v.device.value = state.devices[0].id; v.by.value = state.devices[0].owner; }
})();
