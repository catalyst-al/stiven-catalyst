(() => {
  // The Daily Board: Safety, Quality, Delivery, Cost and People as five month calendars of green, amber and red days.
  // Safety, Quality and Delivery read the logs the other tools keep in this browser; Cost and People, and any day a
  // visitor wants to overrule, come from the manual entries kept here. The arithmetic lives in window.DailyBoardMath,
  // so tests/daily-board.test.cjs can call it without the page.
  const kit = window.ToolKit || {};
  const DAY = 864e5;
  const LETTERS = ["S", "Q", "D", "C", "P"];
  const STATES = ["green", "amber", "red"];
  const RANK = { none: 0, green: 1, amber: 2, red: 3 };
  const worse = (a, b) => (RANK[b] > RANK[a] ? b : a);
  const isIso = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""));
  const shiftDay = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  // A target typed as a per cent ("0.3", "95") as a share; nothing when the box is empty.
  const share = (value) => {
    const number = Number(String(value ?? "").replace(",", "."));
    return number > 0 ? number / 100 : null;
  };
  const clock = (time) => (/^\d{2}:\d{2}$/.test(String(time ?? "")) ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) : null);
  // Minutes after plan; a night route that crosses midnight stays inside twelve hours (as in Shift Pulse).
  const minutesLate = (planned, actual) => {
    const a = clock(planned);
    const b = clock(actual);
    if (a === null || b === null) return null;
    let value = b - a;
    if (value < -720) value += 1440;
    if (value > 720) value -= 1440;
    return value;
  };

  // A 5S audit row ({ scores: { S: [0-4, ...], ... } }) scored as the 5S Audit scores it (FiveSMath.score): each S the
  // average of its answered questions over 4, the audit the mean of the S that have an answer, each S weighing 1. A
  // question left unscored (null) is no zero. (Until 27 October 2026 the board pooled every question, so a fully
  // answered S outweighed the others: 80 % where the 5S Audit said 20 %, audit finding T-16.)
  const fivesScore = (row) => {
    const scores = row && row.scores && typeof row.scores === "object" && !Array.isArray(row.scores) ? row.scores : {};
    const shares = Object.values(scores).filter(Array.isArray).map((list) => list
      .filter((v) => v !== null && v !== "" && typeof v !== "boolean").map(Number).filter((v) => Number.isFinite(v) && v >= 0 && v <= 4))
      .filter((values) => values.length)
      .map((values) => values.reduce((sum, value) => sum + value, 0) / (4 * values.length));
    return shares.length ? shares.reduce((sum, share) => sum + share, 0) / shares.length : null;
  };


  const rowsOf = (log) => (log && Array.isArray(log.rows) ? log.rows.filter((row) => row && typeof row === "object" && isIso(row.date)) : []);
  const firstDate = (rows) => rows.reduce((min, row) => (!min || row.date < min ? row.date : min), "");
  const sumBy = (rows, of) => {
    const map = new Map();
    rows.forEach((row) => map.set(row.date, (map.get(row.date) || 0) + of(row)));
    return map;
  };
  // The usual day: the mean count over the 30 days before `date` in which the log was in use, quiet days as 0.
  // Fewer than three such days are no reference.
  const usualBefore = (byDate, start, date) => {
    if (!start || start >= date) return null;
    const earliest = shiftDay(date, -30);
    let n = 0;
    let total = 0;
    for (let day = earliest > start ? earliest : start; day < date; day = shiftDay(day, 1)) {
      n++;
      total += byDate.get(day) || 0;
    }
    return n >= 3 ? total / n : null;
  };
  // A count against the usual day, by the c-chart rule: beyond usual + 3 √usual (and at least 2) is a signal, red;
  // above the usual is amber; without a reference, entries are amber, a question for the huddle.
  const countState = (count, usual) => {
    if (!(count > 0)) return "green";
    if (usual === null) return "amber";
    return count >= 2 && count > usual + 3 * Math.sqrt(usual) ? "red" : count > usual ? "amber" : "green";
  };
  // A rate against its target: above it red, within 20 % of it amber.
  const rateState = (rate, target) => (rate > target ? "red" : rate >= target * 0.8 ? "amber" : "green");
  // On time against its target: below it red, within 5 points amber.
  const onTimeState = (onTime, target) => (onTime < target ? "red" : onTime < target + 0.05 ? "amber" : "green");

  // Room Inspection, day by day, with the tool's own arithmetic (window.RoomInspectionMath; the partial loads its
  // script): each inspection scored and judged as the tool does (a failed critical item fails the room, otherwise its
  // pass mark decides), a room inspected again on the day it failed is a re-check, and the first-time pass rate of a
  // day = first inspections passed / first inspections. saved is what the tool keeps ({ threshold, custom, rows });
  // cfg its data in this language ({ threshold, zones, templates }).
  const isObj = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const roomDays = (saved, cfg, RI = window.RoomInspectionMath) => {
    const byDate = new Map();
    const builtIn = isObj(cfg?.templates) ? cfg.templates : null;
    if (!RI || !builtIn || !Object.keys(builtIn).length) return { byDate, threshold: null };
    const firstTemplate = Object.keys(builtIn)[0];
    const custom = Object.fromEntries(Object.entries(isObj(saved?.custom) ? saved.custom : {}).filter(([key, tpl]) => key.startsWith("custom-") && isObj(tpl) && isObj(tpl.questions)));
    const templateOf = (name) => custom[name] || builtIn[name] || builtIn[firstTemplate];
    const zones = (Array.isArray(cfg.zones) ? cfg.zones : []).map((zone) => zone?.key).filter(Boolean);
    const mark = Number(saved?.threshold);
    const threshold = mark >= 0.5 && mark <= 1 ? mark : Number(cfg.threshold) || 0.9;
    const rows = rowsOf(saved).filter((row) => typeof row.room === "string" && row.room.trim())
      .map((row) => ({ ...row, room: row.room.trim(), answers: isObj(row.answers) ? row.answers : {}, flags: isObj(row.flags) ? row.flags : {} }));
    RI.annotate(rows, (row) => RI.itemsOf(templateOf(row.template), zones), threshold).forEach((row) => {
      if (row.recheck || row.pass === null) return;
      const day = byDate.get(row.date) || { first: 0, passed: 0 };
      day.first++;
      if (row.pass) day.passed++;
      byDate.set(row.date, day);
    });
    return { byDate, threshold };
  };
  // Maintenance Planner breakdowns, day by day: how many and the minutes of downtime, on assets still in the plan.
  const breakdownDays = (saved) => {
    const byDate = new Map();
    const assets = new Set((Array.isArray(saved?.assets) ? saved.assets : []).filter(isObj).map((asset) => asset.id).filter(Boolean));
    rowsOf(saved).filter((row) => row.kind === "breakdown" && assets.has(row.asset)).forEach((row) => {
      const day = byDate.get(row.date) || { n: 0, minutes: 0 };
      day.n++;
      day.minutes += Number(row.minutes) > 0 ? Number(row.minutes) : 0;
      byDate.set(row.date, day);
    });
    return byDate;
  };
  // The tasks past their date on A assets now, by the planner's own due date (MaintenancePlannerMath.nextDue and
  // statusOf: the interval after the last done or the meter, whichever comes first, moved by a postponement), the
  // longest overdue first.
  const overdueOnA = (saved, today, MP = window.MaintenancePlannerMath) => {
    if (!MP) return [];
    const assets = (Array.isArray(saved?.assets) ? saved.assets : []).filter((asset) => isObj(asset) && asset.id && asset.crit === "A");
    const rows = rowsOf(saved).filter((row) => MP.KINDS.includes(row.kind));
    return assets.flatMap((asset) => {
      const events = rows.filter((row) => row.asset === asset.id);
      const points = MP.meterPoints(events);
      return (Array.isArray(asset.tasks) ? asset.tasks : []).filter((task) => isObj(task) && task.id && String(task.text ?? "").trim()).map((task) => ({ task, due: MP.nextDue(task, events, points).due }))
        .filter(({ due }) => MP.statusOf(due, today) === "overdue")
        .map(({ task, due }) => ({ task: String(task.text).trim(), asset: [asset.tag, asset.name].map((part) => String(part ?? "").trim()).filter(Boolean).join(" · "), due, late: MP.daysBetween(due, today) }));
    }).sort((a, b) => a.due.localeCompare(b.due) || a.asset.localeCompare(b.asset));
  };

  // What the logs say, day by day. logs: { damage, incomplete, audit, delay, safety, fives, rooms, maintenance } as the
  // tools save them; targets: { damage, incomplete, ontime, fives } as shares from the workplace profile (null where
  // not set), falling back to the target each log saved, then to defaults. extra: { rooms: the Room Inspection data,
  // rules: the board's own thresholds ({ roomRed, downtimeRed }) from its data file }.
  const facts = (logs = {}, targets = {}, defaults = {}, extra = {}) => {
    const counted = (log, key) => {
      const rows = rowsOf(log);
      const volumes = kit.cleanVolumes ? kit.cleanVolumes(Array.isArray(log?.volumes) ? log.volumes : []) : [];
      return {
        key,
        start: firstDate(rows),
        byDate: sumBy(rows, (row) => (Number(row.units) > 0 ? Math.round(Number(row.units)) : 1)),
        volumes: new Map(volumes.map((item) => [item.date, item.volume])),
        target: targets[key] ?? share(log?.target) ?? defaults[key] ?? null,
      };
    };
    const delay = logs.delay || {};
    // The grace the Delay Analyzer saved (an empty box means none); 15 minutes when it never saved one.
    const grace = delay.arrivalGrace === undefined || delay.arrivalGrace === null ? NaN : Number(String(delay.arrivalGrace).replace(",", "."));
    const arrGrace = Number.isFinite(grace) && grace >= 0 ? grace : 15;
    const routes = rowsOf(delay).map((row) => ({ date: row.date, late: minutesLate(row.planArr, row.actArr) })).filter((row) => row.late !== null);
    const byDate = new Map();
    routes.forEach((row) => {
      const day = byDate.get(row.date) || { routes: 0, late: 0 };
      day.routes++;
      if (row.late > arrGrace) day.late++;
      byDate.set(row.date, day);
    });
    const safetyRows = rowsOf(logs.safety);
    const safety = new Map();
    // The Safety Cross types: an accident (with or without lost time) and first aid make a red day, a near miss or an
    // unsafe condition or act an amber one; a positive observation only shows the cross was kept that day.
    const TYPES = { "lost-time": "accident", "no-lost-time": "accident", accident: "accident", "first-aid": "firstAid", "near-miss": "nearMiss", "unsafe-condition": "unsafe", "unsafe-act": "unsafe", unsafe: "unsafe", positive: "positive" };
    safetyRows.forEach((row) => {
      const kind = TYPES[String(row.type)];
      if (!kind) return;
      const day = safety.get(row.date) || { accident: 0, nearMiss: 0, firstAid: 0, unsafe: 0, positive: 0 };
      day[kind]++;
      safety.set(row.date, day);
    });
    const fivesRows = rowsOf(logs.fives);
    const fives = new Map();
    fivesRows.forEach((row) => {
      const score = fivesScore(row);
      // The worst area of the day is the one the huddle talks about.
      if (score !== null && !(fives.get(row.date) <= score)) fives.set(row.date, score);
    });
    return {
      quality: [counted(logs.damage, "damage"), counted(logs.incomplete, "incomplete"), counted(logs.audit, "audit")],
      delivery: {
        start: firstDate(routes),
        byDate,
        lateByDate: new Map([...byDate].map(([date, day]) => [date, day.late])),
        partial: Boolean(kit.partialRouteLog?.(delay)),
        target: targets.ontime ?? share(delay.target) ?? defaults.ontime ?? null,
      },
      safety: { start: firstDate(safetyRows), byDate: safety },
      fives: { byDate: fives, target: targets.fives ?? defaults.fives ?? null },
      rooms: { ...roomDays(logs.rooms, extra.rooms), red: Number(extra.rules?.roomRed) > 0 ? Number(extra.rules.roomRed) / 100 : null },
      breakdowns: { byDate: breakdownDays(logs.maintenance), red: Number(extra.rules?.downtimeRed) > 0 ? Number(extra.rules.downtimeRed) : null },
    };
  };
  // The first-time pass rate of a day against the pass mark of Room Inspection: at or above it green, below it amber,
  // below the board's lower line (roomRed) red.
  const roomState = (rate, mark, red) => (rate >= mark - 1e-9 ? "green" : red !== null && rate < red - 1e-9 ? "red" : "amber");
  // Breakdowns of a day: any breakdown amber, more downtime than the board's line (downtimeRed minutes) red.
  const breakdownState = (n, minutes, red) => (!(n > 0) ? "none" : red !== null && minutes > red ? "red" : "amber");

  // The state of one letter on one day: "green", "amber", "red", "none" (no data) or "future", with the reasons as
  // codes the page puts into words. A manual entry for that day and letter wins over what the logs say.
  const dayState = (letter, date, f, { today = "", manual = null } = {}) => {
    if (today && date > today) return { state: "future", reasons: [], manual: false };
    if (manual) return { state: manual.state, reasons: [{ code: "manual", note: manual.note || "" }], manual: true };
    let state = "none";
    const reasons = [];
    if (letter === "S") {
      const s = f.safety;
      const day = s.byDate.get(date);
      if (s.start && date >= s.start) {
        [["accident", "red"], ["firstAid", "red"], ["nearMiss", "amber"], ["unsafe", "amber"]].forEach(([kind, level]) => {
          if (!day || !day[kind]) return;
          state = worse(state, level);
          reasons.push({ code: kind, n: day[kind] });
        });
        if (state === "none") {
          state = "green";
          reasons.push({ code: "safe" });
        }
      }
      const score = f.fives.byDate.get(date);
      if (score !== undefined) {
        const below = f.fives.target !== null && score < f.fives.target;
        state = worse(state, below ? "amber" : "green");
        reasons.push({ code: "fives", pct: score, target: f.fives.target, below });
      }
    } else if (letter === "Q") {
      f.quality.forEach((q) => {
        if (!q.start || date < q.start) return;
        const count = q.byDate.get(date) || 0;
        const volume = q.volumes.get(date);
        if (volume > 0 && count <= volume && q.target !== null) {
          const rate = count / volume;
          state = worse(state, rateState(rate, q.target));
          reasons.push({ code: "rate", key: q.key, rate, target: q.target, n: count, volume });
        } else if (count > 0) {
          const usual = usualBefore(q.byDate, q.start, date);
          state = worse(state, countState(count, usual));
          reasons.push({ code: "count", key: q.key, n: count, usual });
        } else {
          state = worse(state, "green");
          reasons.push({ code: "clean", key: q.key });
        }
      });
      const rooms = f.rooms?.byDate.get(date);
      if (rooms && rooms.first && f.rooms.threshold !== null) {
        const rate = rooms.passed / rooms.first;
        state = worse(state, roomState(rate, f.rooms.threshold, f.rooms.red));
        reasons.push({ code: "rooms", rate, mark: f.rooms.threshold, red: f.rooms.red, n: rooms.passed, first: rooms.first });
      }
    } else if (letter === "D") {
      const d = f.delivery;
      const day = d.byDate.get(date);
      if (day && day.routes) {
        if (d.partial || d.target === null) {
          const usual = usualBefore(d.lateByDate, d.start, date);
          state = worse(state, countState(day.late, usual));
          reasons.push({ code: "late", n: day.late, usual, routes: day.routes });
        } else {
          const onTime = 1 - day.late / day.routes;
          state = worse(state, onTimeState(onTime, d.target));
          reasons.push({ code: "ontime", pct: onTime, target: d.target, late: day.late, routes: day.routes });
        }
      }
      const stops = f.breakdowns?.byDate.get(date);
      if (stops && stops.n) {
        state = worse(state, breakdownState(stops.n, stops.minutes, f.breakdowns.red));
        reasons.push({ code: "breakdown", n: stops.n, minutes: stops.minutes, red: f.breakdowns.red });
      }
    }
    return { state, reasons, manual: false };
  };

  // Manual entries: the worst entry of a day and letter wins.
  const manualMap = (rows) => {
    const map = new Map();
    (rows || []).forEach((row) => {
      if (!row || !isIso(row.date) || !LETTERS.includes(row.letter) || !STATES.includes(row.state)) return;
      const key = `${row.date}|${row.letter}`;
      const current = map.get(key);
      if (!current || RANK[row.state] > RANK[current.state]) map.set(key, row);
    });
    return map;
  };
  const monthOf = (iso) => iso.slice(0, 7);
  const addMonths = (ym, n) => {
    const [year, month] = ym.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1 + n, 1)).toISOString().slice(0, 7);
  };
  const monthDays = (ym) => {
    const [year, month] = ym.split("-").map(Number);
    const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return Array.from({ length: days }, (_, i) => `${ym}-${String(i + 1).padStart(2, "0")}`);
  };
  // One month of the board: every day, every letter, and how many days of each colour a letter had.
  const board = (ym, logs, rows, options = {}) => {
    const f = options.facts || facts(logs, options.targets, options.defaults, options.extra);
    const manual = manualMap(rows);
    const days = monthDays(ym).map((date) => ({
      date,
      letters: Object.fromEntries(LETTERS.map((letter) => [letter, dayState(letter, date, f, { today: options.today, manual: manual.get(`${date}|${letter}`) || null })])),
    }));
    const counts = Object.fromEntries(LETTERS.map((letter) => {
      const count = { red: 0, amber: 0, green: 0, none: 0, future: 0 };
      days.forEach((day) => { count[day.letters[letter].state]++; });
      return [letter, count];
    }));
    return { month: ym, days, counts, facts: f };
  };
  // The safety message of the day: the list is walked one message a day, the same for everyone on that date.
  const safetyIndex = (iso, length) => (length > 0 ? Math.floor(Date.parse(`${iso}T00:00:00Z`) / DAY) % length : 0);

  window.DailyBoardMath = { LETTERS, STATES, RANK, minutesLate, fivesScore, usualBefore, countState, rateState, onTimeState, roomState, breakdownState, roomDays, breakdownDays, overdueOnA, facts, dayState, manualMap, monthOf, addMonths, monthDays, board, safetyIndex };

  const root = document.querySelector("[data-daily-board]");
  const dataEl = document.getElementById("daily-board-data");
  if (!root || !dataEl || !window.ToolKit || !window.ChartKit) return;

  const { LANG, tx, el, int, pct, read, readOwn, isObject, str, loadState, write, today, showDate, parseDate, parseRows, canon, plural, logBook, panel, copy, flash, lower } = window.ToolKit;
  const Chart = window.ChartKit;
  const Workplace = window.Workplace;
  const Actions = window.ActionsStore;
  const data = JSON.parse(dataEl.textContent);
  // The checklists and pass mark of Room Inspection in this language, for its first-time pass rate.
  const roomsEl = document.getElementById("daily-board-rooms");
  const roomCfg = roomsEl ? JSON.parse(roomsEl.textContent) : null;
  const KEY = data.storageKey;
  const SUFFIX = LANG === "en" ? "" : `-${LANG}`;
  const results = document.querySelector("[data-results]");
  const entry = root.querySelector("[data-entry]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const shiftSelect = entry.elements.shift;
  const letterOf = Object.fromEntries(data.letters.map((letter) => [letter.key, letter]));
  const stateName = (state) => data.states[state] || tx("No data");
  const CHART_STATE = { green: "ok", amber: "warn", red: "danger", none: "none", future: "future" };
  // A sign in every coloured day, so the colour is never the only signal (and a print in black and white still reads).
  const SIGN = { green: "✓", amber: "!", red: "✕" };

  // The manual entries, rebuilt field by field so damaged data cannot break the page.
  const cleanRow = (row) => {
    const date = parseDate(row.date);
    if (!date || !LETTERS.includes(row.letter) || !STATES.includes(row.state)) return null;
    return { date, shift: str(row.shift).trim(), letter: row.letter, state: row.state, note: str(row.note).trim() };
  };
  const blankProfile = () => ({ site: "", shifts: [], areas: [], teams: [], targets: {} });
  const state = loadState(KEY, { rows: [], example: {}, demoProfile: false });
  // Before 27 October 2026 the example wrote its profile into the shared one (demoProfile). Left exactly as the example
  // wrote it, it goes; changed by the visitor since, it is theirs and stays.
  if (state.demoProfile && Workplace) {
    if (JSON.stringify(Workplace.get()) === JSON.stringify(Workplace.clean(data.example.profile))) Workplace.set(blankProfile());
    state.demoProfile = false;
    write(KEY, state);
  }
  state.rows = state.rows.filter(isObject).map(cleanRow).filter(Boolean);
  const save = () => write(KEY, state);

  // Pasted rows: date, shift, letter (S or its name), state (green, amber, red or their names), note.
  const letterOptions = data.letters.map((letter) => letter.name);
  const stateOptions = STATES.map((key) => data.states[key]);
  const importRows = (text) => {
    const added = [];
    let skipped = 0;
    parseRows(text).forEach((cells, index) => {
      const [date, shift, letter, status, ...note] = cells;
      const day = parseDate(date);
      const letterText = String(letter ?? "").trim();
      const key = LETTERS.includes(letterText.toUpperCase()) ? letterText.toUpperCase() : data.letters.find((item) => item.name === canon(letterOptions, letterText, ""))?.key;
      const statusText = String(status ?? "").trim().toLowerCase();
      const stateKey = STATES.includes(statusText) ? statusText : STATES[stateOptions.indexOf(canon(stateOptions, statusText, ""))];
      if (!day || !key || !stateKey) {
        if (index > 0) skipped++;
        return;
      }
      added.push({ date: day, shift: String(shift ?? "").trim(), letter: key, state: stateKey, note: note.join(", ").trim() });
    });
    return { added, skipped };
  };

  // The workplace profile: shifts for the form, areas with their owners for the agenda, the targets for the colours.
  // While the example is shown and the visitor has no profile, the example's own profile is used on this page only: it
  // is never written to the shared profile (sc-workplace), so no other tool takes its site or its targets for the
  // visitor's (audit of 27 October 2026, T-04).
  const profile = () => {
    const own = Workplace ? Workplace.get() : blankProfile();
    return kit.exampleMatches?.(state) && (!Workplace || Workplace.isEmpty(own)) ? (Workplace ? Workplace.clean(data.example.profile) : data.example.profile) : own;
  };
  const shifts = () => (profile().shifts.length ? profile().shifts : data.shifts);
  const fillShifts = () => Workplace ? Workplace.fillSelect(shiftSelect, shifts(), shiftSelect.value) : null;
  // A target only when one is set: an empty box means no colour from that figure, never a default nobody chose.
  const targetShare = (key) => {
    const value = profile().targets[key];
    return Number.isFinite(value) && value > 0 ? value / 100 : null;
  };
  const targets = () => ({ damage: targetShare("damage"), incomplete: targetShare("incomplete"), ontime: targetShare("ontime"), fives: targetShare("fives") });
  const setupBox = root.querySelector("[data-workplace]");
  const renderSetup = () => Workplace?.renderSetup(setupBox, {
    prefix: "db",
    targets: data.targets.map(({ key, label, unit, placeholder }) => ({ key, label, unit, placeholder })),
    onChange: () => { fillShifts(); render(); },
  });

  // The logs of the other tools in this language; a tool that does not exist yet reads as empty.
  const logOf = (tool) => {
    // Read as data: an example another tool holds is left out (ToolKit readOwn).
    const saved = readOwn(`sc-${tool}${SUFFIX}`, {});
    return isObject(saved) && Array.isArray(saved.rows) ? { ...saved, rows: saved.rows.filter(isObject) } : { rows: [] };
  };
  const logs = () => ({ damage: logOf("damage-control"), incomplete: logOf("incomplete-control"), audit: logOf("night-audit"), delay: logOf("delay-analyzer"), safety: logOf("safety-cross"), fives: logOf("five-s-audit"), rooms: logOf("room-inspection"), maintenance: logOf("maintenance-planner") });
  const logsInUse = (all) => Object.values(all).some((log) => log.rows.length);
  // The open issues of the handover in progress, the carried ones first.
  const handoverIssues = () => {
    const saved = readOwn(`sc-shift-handover${SUFFIX}`, {});
    const issues = isObject(saved) && isObject(saved.current) && Array.isArray(saved.current.issues) ? saved.current.issues.filter(isObject) : [];
    return issues.filter((issue) => issue.done !== true && str(issue.text).trim())
      .map((issue) => ({ text: str(issue.text).trim(), priority: str(issue.priority), owner: str(issue.owner).trim(), due: str(issue.due).trim(), carried: Number.isInteger(issue.carried) ? issue.carried : 0 }))
      .sort((a, b) => b.carried - a.carried);
  };
  const actionsNow = () => {
    const list = Actions ? Actions.list() : [];
    const day = today();
    const open = list.filter((action) => Actions.isOpen(action));
    return {
      open,
      overdue: open.filter((action) => action.due && action.due < day).sort((a, b) => a.due.localeCompare(b.due)),
      dueToday: open.filter((action) => action.due === day),
    };
  };

  // Words for the reasons the arithmetic gives.
  const SOURCE = { damage: () => tx("Damage rate"), incomplete: () => tx("Incomplete rate"), audit: () => tx("Audit exceptions") };
  const COUNT_NOUN = { damage: () => [tx("damaged unit"), tx("damaged units")], incomplete: () => [tx("incomplete order"), tx("incomplete orders")], audit: () => [tx("exception"), tx("exceptions")] };
  const reasonText = (reason) => {
    switch (reason.code) {
      case "manual": return reason.note ? tx("By hand: {note}", { note: reason.note }) : tx("By hand");
      case "safe": return tx("No incident");
      case "accident": return plural(reason.n, tx("accident"), tx("accidents"));
      case "firstAid": return plural(reason.n, tx("first-aid case"), tx("first-aid cases"));
      case "nearMiss": return plural(reason.n, tx("near miss"), tx("near misses"));
      case "unsafe": return plural(reason.n, tx("unsafe condition"), tx("unsafe conditions"));
      case "fives": return reason.target === null ? tx("5S {pct}", { pct: pct(reason.pct, 0) }) : tx("5S {pct} (target {target})", { pct: pct(reason.pct, 0), target: pct(reason.target, 0) });
      case "rate": return tx("{what} {rate} (target {target}): {n} of {volume}", { what: SOURCE[reason.key](), rate: pct(reason.rate, 2), target: pct(reason.target, 2), n: int.format(reason.n), volume: int.format(reason.volume) });
      case "count": return reason.usual === null
        ? tx("{n}, no usual day yet", { n: plural(reason.n, ...COUNT_NOUN[reason.key]()) })
        : tx("{n} (usual {usual} a day)", { n: plural(reason.n, ...COUNT_NOUN[reason.key]()), usual: int.format(Math.round(reason.usual * 10) / 10) });
      case "clean": return tx("No {what} logged", { what: lower(COUNT_NOUN[reason.key]()[1]) });
      case "late": return reason.usual === null
        ? tx("{n} of {routes} routes late, no usual day yet", { n: reason.n, routes: reason.routes })
        : tx("{n} of {routes} routes late (usual {usual} a day)", { n: reason.n, routes: reason.routes, usual: int.format(Math.round(reason.usual * 10) / 10) });
      case "ontime": return tx("On time {pct} (target {target}): {late} of {routes} late", { pct: pct(reason.pct, 0), target: pct(reason.target, 0), late: reason.late, routes: reason.routes });
      case "rooms": return tx("First-time pass {pct} (pass mark {mark}): {a} of {b} rooms", { pct: pct(reason.rate, 0), mark: pct(reason.mark, 0), a: int.format(reason.n), b: int.format(reason.first) });
      case "breakdown": return tx("{n}, {minutes} of downtime", { n: plural(reason.n, tx("breakdown"), tx("breakdowns")), minutes: tx("{n} min", { n: int.format(reason.minutes) }) });
      default: return "";
    }
  };
  const dayText = (info) => (info.state === "future" ? "" : info.reasons.length ? info.reasons.map(reasonText).join(" · ") : tx("No data"));

  const monthName = (ym) => `${data.months[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
  const dayName = kit.dayMonth(true);
  const dayLabel = (iso) => dayName(new Date(`${iso}T00:00:00Z`));
  let view = monthOf(today());

  // The headline: one chip per letter with today's colour, in words too.
  const chips = (model, day) => {
    const list = el("ul", "ck-chips db-chips");
    LETTERS.forEach((letter) => {
      const info = model.days.find((d) => d.date === day)?.letters[letter] || { state: "none", reasons: [] };
      const item = el("li", `ck-chip db-chip is-${CHART_STATE[info.state]}`);
      item.append(el("b", "db-chip-letter", letter), ` ${letterOf[letter].name} · ${stateName(info.state)}`);
      item.title = dayText(info) || letterOf[letter].name;
      list.append(item);
    });
    return list;
  };

  // One month calendar per letter, with the counts of the month under its name.
  const calendarPanel = (model, letter) => {
    const box = el("article", "dl-panel db-cal");
    const head = el("div", "db-cal-head");
    head.append(el("b", "db-letter", letter), el("h3", "result-label", letterOf[letter].name));
    const count = model.counts[letter];
    const words = [];
    if (count.red) words.push(plural(count.red, tx("red day"), tx("red days")));
    if (count.amber) words.push(plural(count.amber, tx("amber day"), tx("amber days")));
    words.push(plural(count.green, tx("green day"), tx("green days")));
    box.append(head, el("p", "dl-panel-note", words.join(" · ")));
    const [year, month] = model.month.split("-").map(Number);
    const svg = Chart.calendar(year, month, (iso) => {
      const info = model.days.find((d) => d.date === iso).letters[letter];
      return { state: info.state === "future" ? "none" : CHART_STATE[info.state], text: `${SIGN[info.state] || ""}${info.manual ? " ✎" : ""}`, tip: `${dayLabel(iso)} · ${letterOf[letter].name}: ${info.state === "future" ? tx("Not yet") : stateName(info.state)}${dayText(info) ? `\n${dayText(info)}` : ""}` };
    }, { title: `${letterOf[letter].name}: ${monthName(model.month)}`, cellSize: 48 });
    box.append(Chart.figure(svg, { buttons: false }));
    return box;
  };

  const monthNav = () => {
    const nav = el("div", "db-month-nav");
    const back = el("button", "button-ghost", "◀");
    back.type = "button";
    back.setAttribute("aria-label", tx("Previous month"));
    back.addEventListener("click", () => { view = addMonths(view, -1); render(); });
    const forward = el("button", "button-ghost", "▶");
    forward.type = "button";
    forward.setAttribute("aria-label", tx("Next month"));
    forward.disabled = view >= monthOf(today());
    forward.addEventListener("click", () => { view = addMonths(view, 1); render(); });
    nav.append(back, el("h3", "db-month", monthName(view)), forward);
    return nav;
  };

  const legend = () => Chart.legend([
    { label: `✓ ${stateName("green")}`, state: "ok" }, { label: `! ${stateName("amber")}`, state: "warn" }, { label: `✕ ${stateName("red")}`, state: "danger" },
    { label: tx("Empty: no data"), state: "none" }, { label: tx("✎ by hand"), color: "transparent" },
  ]);

  const actionsPanel = (acts) => {
    const box = panel(tx("Open actions"), tx("From the Action Tracker: overdue first, then what is due today. Every red day needs one."));
    const stats = el("div", "db-stats");
    stats.append(el("span", "ck-chip", `${int.format(acts.open.length)} ${tx("open")}`), el("span", `ck-chip${acts.overdue.length ? " is-danger" : ""}`, `${int.format(acts.overdue.length)} ${lower(tx("Overdue"))}`), el("span", `ck-chip${acts.dueToday.length ? " is-warn" : ""}`, `${int.format(acts.dueToday.length)} ${lower(tx("Due today"))}`));
    box.append(stats);
    const list = el("ul", "db-list");
    [...acts.overdue, ...acts.dueToday].slice(0, 8).forEach((action) => {
      const item = el("li");
      item.append(el("span", `dl-tag${action.due < today() ? " is-warn" : ""}`, action.due < today() ? tx("Overdue") : tx("Due today")), ` ${action.title} `, el("small", null, `${action.owner || tx("no owner")} · ${showDate(action.due)}`));
      list.append(item);
    });
    if (!acts.overdue.length && !acts.dueToday.length) box.append(el("p", "dl-panel-note", tx("No action is overdue or due today.")));
    else box.append(list);
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = Actions ? Actions.trackerUrl().href : new URL("../action-tracker/", window.location.href).href;
    box.append(link);
    return box;
  };

  const handoverPanel = (issues) => {
    const carried = issues.filter((issue) => issue.carried > 0);
    const box = panel(tx("Carried handover issues"), tx("Open issues of the handover in progress that came from an earlier shift. Each needs an owner and a time, or 5 Whys."));
    if (carried.length) {
      const list = el("ul", "db-list");
      carried.forEach((issue) => {
        const item = el("li");
        item.append(el("span", "dl-tag", tx("Carried {n}×", { n: issue.carried })), ` ${issue.text} `, el("small", null, `${issue.owner || tx("no owner")}${issue.due ? ` · ${issue.due}` : ""}`));
        list.append(item);
      });
      box.append(list);
    } else {
      box.append(el("p", "dl-panel-note", issues.length ? tx("{n} open, none carried over.", { n: int.format(issues.length) }) : tx("Nothing carried over.")));
    }
    const link = el("a", "inline-link", tx("Open Shift Handover"));
    link.href = new URL("../shift-handover/", window.location.href).href;
    box.append(link);
    return box;
  };

  // The huddle in five steps and ten minutes: the message of the day, yesterday's board, the actions, what the
  // handover carries, and who owns what today.
  // maint: the overdue tasks on A assets (overdueOnA), read out with the actions.
  const agendaItems = (f, acts, issues, maint = []) => {
    const day = today();
    const yesterday = shiftDay(day, -1);
    const manual = manualMap(state.rows);
    const alerts = LETTERS.map((letter) => ({ letter, ...dayState(letter, yesterday, f, { today: day, manual: manual.get(`${yesterday}|${letter}`) || null }) })).filter((item) => item.state === "red" || item.state === "amber");
    const areas = profile().areas;
    const message = data.safetyMessages[safetyIndex(day, data.safetyMessages.length)];
    return {
      alerts,
      items: [
        { title: tx("Safety message of the day"), minutes: 1, lines: [message] },
        { title: tx("Yesterday's board"), minutes: 3, lines: alerts.length ? alerts.map((item) => `${item.letter} ${letterOf[item.letter].name}: ${stateName(item.state)} · ${dayText(item)}`) : [tx("No red or amber day yesterday. Say it, then move on.")] },
        { title: tx("Actions"), minutes: 3, lines: acts.overdue.length || acts.dueToday.length || maint.length ? [...acts.overdue.map((a) => `${a.title} · ${a.owner || tx("no owner")} · ${lower(tx("Overdue"))} ${showDate(a.due)}`), ...acts.dueToday.map((a) => `${a.title} · ${a.owner || tx("no owner")} · ${lower(tx("Due today"))}`), ...maint.map((t) => tx("Overdue on an A asset: {task} · {asset} · due {date}", { task: t.task, asset: t.asset, date: showDate(t.due) }))] : [tx("No action is overdue or due today.")] },
        { title: tx("Carried handover issues"), minutes: 2, lines: issues.filter((issue) => issue.carried > 0).length ? issues.filter((issue) => issue.carried > 0).map((issue) => `${issue.text} · ${issue.owner || tx("no owner")}${issue.due ? ` · ${issue.due}` : ""}`) : [tx("Nothing carried over.")] },
        { title: tx("Who owns what today"), minutes: 1, lines: areas.length ? areas.map((area) => (area.owner ? `${area.name} · ${area.owner}` : area.name)) : [tx("Add the areas and their owners in the workplace setup above.")] },
      ],
    };
  };
  const agendaText = (agenda) => {
    const site = profile().site;
    const lines = [`${data.title} | Stiven Catalyst`, `${site ? `${site} · ` : ""}${showDate(today())} · ${tx("10 minutes, standing")}`, ""];
    agenda.items.forEach((item, i) => {
      lines.push(`${i + 1}. ${item.title} (${item.minutes} min)`);
      item.lines.forEach((line) => lines.push(`   - ${line}`));
    });
    return lines.join("\n");
  };
  const agendaPanel = (agenda) => {
    const box = panel(tx("Huddle agenda"), tx("Ten minutes, standing, in this order. Read it out, do not type."));
    const list = el("ol", "db-agenda");
    agenda.items.forEach((item) => {
      const li = el("li");
      const head = el("div", "db-agenda-head");
      head.append(el("strong", null, item.title), el("span", "db-min", `${item.minutes} min`));
      const lines = el("ul");
      item.lines.forEach((line) => lines.append(el("li", null, line)));
      li.append(head, lines);
      list.append(li);
    });
    box.append(list);
    return box;
  };

  // Red days per letter, this month against the month before.
  const trendPanel = (model, previous) => {
    const box = panel(tx("Red days"), tx("Red days per letter, this month against last month. Fewer is the only trend that counts."));
    const items = LETTERS.flatMap((letter) => [
      { label: `${letter} ${monthName(model.month).slice(0, 3)}`, value: model.counts[letter].red, color: Chart.C.blue, tip: `${letterOf[letter].name} · ${monthName(model.month)}: ${plural(model.counts[letter].red, tx("red day"), tx("red days"))}` },
      { label: `${letter} ${monthName(previous.month).slice(0, 3)}`, value: previous.counts[letter].red, color: Chart.C.muted, tip: `${letterOf[letter].name} · ${monthName(previous.month)}: ${plural(previous.counts[letter].red, tx("red day"), tx("red days"))}` },
    ]);
    const svg = Chart.bars(items, { title: tx("Red days"), unit: tx("Red days"), format: (value) => int.format(value), yMax: Math.max(4, ...items.map((item) => item.value)), labels: true });
    box.append(Chart.figure(svg, { fileName: "daily-board-red-days" }));
    box.append(Chart.legend([{ label: monthName(model.month), color: Chart.C.blue }, { label: monthName(previous.month), color: Chart.C.muted }]));
    return box;
  };

  const render = () => {
    results.replaceChildren();
    const all = logs();
    const acts = actionsNow();
    const issues = handoverIssues();
    const empty = !state.rows.length && !logsInUse(all) && !acts.open.length && !issues.length;
    results.hidden = empty;
    if (empty) return;
    const options = { today: today(), targets: targets(), defaults: {}, extra: { rooms: roomCfg, rules: data.rules } };
    const f = facts(all, options.targets, options.defaults, options.extra);
    const model = board(view, all, state.rows, { ...options, facts: f });
    const previous = board(addMonths(view, -1), all, state.rows, { ...options, facts: f });
    const day = today();

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${profile().site || data.title}`));
    const title = el("h2");
    title.append(tx("The board today"), el("span", null, ` ${dayLabel(day)}`));
    head.append(title);
    const todayModel = monthOf(day) === view ? model : board(monthOf(day), all, state.rows, { ...options, facts: f });

    const calendars = el("div", "db-calendars");
    LETTERS.forEach((letter) => calendars.append(calendarPanel(model, letter)));

    const agenda = agendaItems(f, acts, issues, overdueOnA(all.maintenance, day));
    const grid = el("div", "dl-result-grid db-grid");
    grid.append(agendaPanel(agenda), actionsPanel(acts), handoverPanel(issues), trendPanel(model, previous));

    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy agenda"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(agendaText(agenda), copyButton));
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    actions.append(copyButton, printButton);
    // The first red or amber of yesterday becomes an action with an owner and a date, or a 5 Whys question.
    const first = agenda.alerts[0];
    const problem = first ? `${letterOf[first.letter].name} ${lower(stateName(first.state))} ${tx("on {date}", { date: showDate(shiftDay(day, -1)) })}: ${dayText(first)}` : "";
    if (Actions) {
      actions.append(Actions.linkButton(tx("Add to actions"), () => (first ? { title: problem.split(": ")[0], detail: dayText(first), owner: profile().areas[0]?.owner || "", due: day, source: "daily-board", priority: first.state === "red" ? "High" : "Medium", check: tx("A green day on the board for a week.") } : null)));
    }
    if (first) {
      const whys = el("a", "button-secondary", tx("Take it to 5 Whys"));
      const url = new URL(document.querySelector("a[data-five-whys]")?.href || new URL("../five-whys/", window.location.href));
      url.searchParams.set("problem", problem);
      whys.href = url.href;
      actions.append(whys);
    }

    const parts = [head];
    // While the example is shown, say what it is: typed by hand, where real logs would fill three letters.
    if (kit.exampleMatches?.(state)) parts.push(el("p", "form-note db-example", data.example.note));
    results.append(...parts, chips(todayModel, day), monthNav(), calendars, legend(), grid, actions);
  };

  // The example: a month of green days with a few amber and red ones typed by hand, dated back from today, and a
  // demo workplace profile when there is none yet (it goes with the example).
  const loadExample = () => {
    const ex = data.example;
    const day = today();
    const rows = [];
    const given = new Map(ex.rows.map((row) => [`${row.ago}|${row.letter}`, row]));
    for (let ago = ex.days - 1; ago >= 0; ago--) {
      ex.fill.forEach((letter, i) => {
        const row = given.get(`${ago}|${letter}`);
        rows.push(row ? { date: shiftDay(day, -ago), shift: row.shift, letter, state: row.state, note: row.note } : { date: shiftDay(day, -ago), shift: data.shifts[(ago + i) % data.shifts.length], letter, state: "green", note: "" });
      });
    }
    state.rows = rows;
  };
  const clearExample = () => { fillShifts(); };

  const book = logBook({
    root,
    key: KEY,
    state,
    save,
    results,
    paste: root.querySelector("#db-paste"),
    clearExample,
    cells: (row) => {
      const stateCell = el("td", `db-state is-${CHART_STATE[row.state]}`);
      stateCell.append(el("span", "db-dot"), ` ${stateName(row.state)}`);
      return [el("td", "nowrap", showDate(row.date)), el("td", null, row.shift), el("td", null, `${row.letter} · ${letterOf[row.letter].name}`), stateCell, el("td", "dl-note", row.note)];
    },
    removeLabel: (row) => tx("Remove {letter} {state} on {date}", { letter: letterOf[row.letter].name, state: lower(stateName(row.state)), date: showDate(row.date) }),
    removedText: (row) => tx("Removed {letter} {state} on {date}.", { letter: letterOf[row.letter].name, state: lower(stateName(row.state)), date: showDate(row.date) }),
    countText: (rows) => plural(rows.length, tx("entry"), tx("entries")),
    importRows,
    importText: {
      none: tx("No rows found. Check the order: date, shift, letter, state, note."),
      done: (added, skipped) => `${tx("Imported {rows}", { rows: plural(added, tx("row"), tx("rows")) })}${skipped ? tx(", skipped {n} without a date, letter or state", { n: skipped }) : ""}.`,
    },
    loadExample,
    // The visitor's own logs come first: the example opens only when no other tool holds anything yet.
    firstExample: !logsInUse(logs()),
    clearText: tx("Clear all manual entries of the board?"),
    csv: () => ({
      name: "daily-board",
      rows: [[tx("Date"), tx("Shift"), tx("Letter"), tx("State"), tx("Note")], ...state.rows.map((row) => [row.date, row.shift, `${row.letter} ${letterOf[row.letter].name}`, stateName(row.state), row.note])],
    }),
    renderResults: render,
  });

  renderSetup();
  fillShifts();
  entry.elements.date.value = today();
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = entry.elements;
    const date = parseDate(form.date.value);
    if (!date) {
      form.date.focus();
      flash(entryStatus, tx("Enter a date."));
      return;
    }
    const row = { date, shift: form.shift.value, letter: form.letter.value, state: form.state.value, note: form.note.value.trim() };
    form.note.value = "";
    book.add(row);
    flash(entryStatus, tx("Added {letter} {state} on {date}.", { letter: letterOf[row.letter].name, state: lower(stateName(row.state)), date: showDate(date) }));
    form.letter.focus();
  });
  // Another tab, or another tool, changes the actions or the profile: the board follows.
  window.addEventListener("storage", () => render());
  window.addEventListener("actions:changed", () => render());
  window.addEventListener("workplace:changed", () => render());
  book.render();
})();
