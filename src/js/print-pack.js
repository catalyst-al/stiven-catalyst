// Print Pack: the paper a team puts on its board on Monday morning, printed in one go from what the tools already hold
// in this browser: the open actions by owner (Action Tracker), the maintenance work list of the week (Maintenance
// Planner), the 5S audits of the week (5S Audit), a card per leader (Leader Standard Work), the Safety Cross and the
// Daily Board of the month, and for a hotel the attendant sheets of Room Status and the section sheets of the
// Housekeeping Planner. The pack only reads: every sheet is worked out with the tool's own arithmetic (its script loads
// on this page and stops before its page code, leaving window.*Math), from the tool's saved state in this language,
// and no key of another tool is ever written. The arithmetic of the pack lives in window.PrintPackMath, so tests can
// call it.
(() => {
  const DOCS = ["actions", "maintenance", "fives", "lsw", "safety", "board", "rooms", "housekeeping"];
  const HOTEL = ["rooms", "housekeeping"];
  const isObj = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const str = (value) => (typeof value === "string" ? value : "");
  const list = (value) => (Array.isArray(value) ? value : []);
  const isIso = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
  const pad = (n) => String(n).padStart(2, "0");
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return iso;
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 864e5);
  const numeric = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true });
  const sum = (values) => values.reduce((s, v) => s + v, 0);
  // The example stamp of a log (ToolKit.exampleStamp): the log is still the tool's example while its rows match it.
  const stampMatches = (saved) => isObj(saved) && isObj(saved.example) && Number.isInteger(saved.example.n) && Array.isArray(saved.rows)
    && saved.rows.length === saved.example.n && (saved.rows[0]?.date ?? "") === saved.example.first && (saved.rows.at(-1)?.date ?? "") === saved.example.last;
  // The tools move their examples by whole weeks, so that the last day is not after the day and not weeks before it
  // (ToolKit.recentExample); the pack does the same against the date on the pack.
  const weeksShift = (last, day) => {
    const weeks = Math.floor(daysBetween(last, day) / 7);
    return weeks > 0 ? weeks * 7 : 0;
  };

  // ---- Open actions by owner (Action Tracker, sc-actions through ActionsStore) ----
  const OPEN = ["open", "doing"];
  const isOverdue = (action, day) => OPEN.includes(action.status) && Boolean(action.due) && action.due < day;
  // The order of the Action Tracker (ActionTrackerMath.order for open actions): overdue first, then by due date,
  // undated last, then the oldest.
  const actionOrder = (day) => (a, b) => {
    const oa = isOverdue(a, day), ob = isOverdue(b, day);
    if (oa !== ob) return oa ? -1 : 1;
    if (a.due !== b.due) return !a.due ? 1 : !b.due ? -1 : a.due.localeCompare(b.due);
    return str(a.created).localeCompare(str(b.created));
  };
  // One block per owner, named owners in alphabetical order and the actions nobody owns yet last.
  const actionsModel = (rows, day) => {
    const open = list(rows).filter((a) => isObj(a) && OPEN.includes(a.status) && str(a.title).trim());
    const groups = new Map();
    [...open].sort(actionOrder(day)).forEach((a) => {
      const owner = str(a.owner).trim();
      if (!groups.has(owner)) groups.set(owner, []);
      groups.get(owner).push({ ...a, overdue: isOverdue(a, day), late: isOverdue(a, day) ? daysBetween(a.due, day) : 0 });
    });
    const owners = [...groups].map(([owner, items]) => ({ owner, items, overdue: items.filter((item) => item.overdue).length }))
      .sort((a, b) => Number(!a.owner) - Number(!b.owner) || a.owner.localeCompare(b.owner));
    return { open: open.length, overdue: open.filter((a) => isOverdue(a, day)).length, owners };
  };
  // The tracker's example is on while every action in the list is one of the example's (action-tracker.js, exampleOn).
  const actionsExampleOn = (rows, ui) => {
    const ids = isObj(ui) && Array.isArray(ui.exampleIds) ? ui.exampleIds : [];
    return ids.length > 0 && rows.length === ids.length && rows.every((a) => ids.includes(a.id));
  };
  // The tracker's example list, its dates relative to the day (ActionTrackerMath.exampleRows), cleaned by ActionsStore.
  const exampleActions = (example, day, clean) => list(example).map((item) => clean({
    ...item, id: undefined, due: Number.isInteger(item.offset) ? addDays(day, item.offset) : "", created: Number.isInteger(item.created) ? addDays(day, item.created) : day,
    closed: Number.isInteger(item.closed) ? addDays(day, item.closed) : "",
  })).filter(Boolean);

  // ---- Maintenance work list of the week (Maintenance Planner) ----
  // Saved assets and log rows, kept in the shape the planner keeps them (its cleanAsset, cleanTask and cleanRow).
  const cleanMaintenance = (saved, MP) => {
    const s = isObj(saved) ? saved : {};
    const assets = list(s.assets).filter((a) => isObj(a) && str(a.tag).trim()).map((a, i) => ({
      id: str(a.id) || `a${i}`, tag: str(a.tag).trim(), name: str(a.name).trim(), type: str(a.type), area: str(a.area).trim(),
      crit: MP.CRITS.includes(a.crit) ? a.crit : "B", supplier: str(a.supplier).trim(),
      tasks: list(a.tasks).filter((t) => isObj(t) && str(t.text).trim()).map((t, j) => {
        const every = Math.round(Number(t.every));
        return {
          id: str(t.id) || `a${i}-t${j}`, text: str(t.text).trim(), every: every >= 1 && every <= 100000 ? every : 1, unit: MP.UNITS.includes(t.unit) ? t.unit : "months",
          hours: Math.max(0, Math.round(Number(t.hours) || 0)), who: MP.WHO.includes(t.who) ? t.who : "internal", minutes: Math.max(0, Math.round(Number(t.minutes) || 0)),
          statutory: t.statutory === true, checklist: list(t.checklist).map(str).map((item) => item.trim()).filter(Boolean).slice(0, 20),
          last: isIso(t.last) ? t.last : "", lastHours: typeof t.lastHours === "number" && Number.isFinite(t.lastHours) && t.lastHours >= 0 ? t.lastHours : null, start: isIso(t.start) ? t.start : "",
        };
      }),
    }));
    const hours = (value) => (typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.round(value * 10) / 10 : null);
    const rows = list(s.rows).filter((r) => isObj(r) && MP.KINDS.includes(r.kind) && isIso(r.date) && str(r.asset))
      .map((r) => ({ ...r, task: str(r.task), hours: hours(r.hours), until: isIso(r.until) ? r.until : "" }))
      .filter((r) => (r.kind !== "postponed" || r.until) && (r.kind !== "reading" || r.hours !== null))
      .sort((a, b) => a.date.localeCompare(b.date));
    return { assets, rows };
  };
  // What is overdue and what falls due by Sunday, exactly as the planner's work list (its analysis and workList):
  // each task's next date from MaintenancePlannerMath.nextDue, its state from statusOf, grouped by area.
  const maintenanceModel = (saved, day, MP, noArea = "") => {
    const { assets, rows } = cleanMaintenance(saved, MP);
    const due = [];
    assets.forEach((asset) => {
      const events = rows.filter((row) => row.asset === asset.id);
      const points = MP.meterPoints(events);
      asset.tasks.forEach((task) => {
        const info = MP.nextDue(task, events, points);
        const status = MP.statusOf(info.due, day);
        if (status !== "overdue" && status !== "week") return;
        due.push({ asset, task, due: info.due, status, late: status === "overdue" ? MP.daysBetween(info.due, day) : 0, postponed: info.postponed });
      });
    });
    const order = { overdue: 0, week: 1 };
    due.sort((a, b) => order[a.status] - order[b.status] || a.due.localeCompare(b.due) || numeric(a.asset.tag, b.asset.tag));
    const groups = new Map();
    due.forEach((item) => { const key = item.asset.area || noArea; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(item); });
    return {
      monday: MP.mondayOf(day), sunday: MP.weekEnd(day), assets: assets.length, tasks: sum(assets.map((a) => a.tasks.length)),
      count: due.length, overdue: due.filter((item) => item.status === "overdue").length, minutes: sum(due.map((item) => item.task.minutes)),
      groups: [...groups].sort((a, b) => a[0].localeCompare(b[0])),
    };
  };

  // ---- 5S audits of the week (5S Audit) ----
  const names = (value) => [...new Set((Array.isArray(value) ? value : String(value ?? "").split(/[,;\n]/)).map((name) => (typeof name === "string" ? name.trim().slice(0, 60) : "")).filter(Boolean))].slice(0, 12);
  // The plan as the audit keeps it (its cleanPlan) and the next seven days of it, as its "Due this week" list:
  // FiveSMath.schedule from the day, overdue audits on the day itself.
  const fivesModel = (saved, day, FS) => {
    const s = isObj(saved) ? saved : {};
    const plan = list(s.plan).filter(isObj).map((entry) => ({ area: str(entry.area).trim().slice(0, 80), cadence: FS.CADENCES.includes(entry.cadence) ? entry.cadence : FS.CADENCES[0], auditors: names(entry.auditors) })).filter((entry) => entry.area);
    const rows = list(s.rows).filter((row) => isObj(row) && isIso(row.date) && str(row.area)).map((row) => ({ date: row.date, area: str(row.area), auditor: str(row.auditor) }));
    const items = FS.schedule(plan, rows, day, 7);
    return { planned: plan.length, until: addDays(day, 6), overdue: items.filter((item) => item.overdue).length, items };
  };

  // ---- Leader Standard Work cards ----
  // The leaders as the tool keeps them (LeaderStandardWorkMath.cleanLeader), the tasks in the order of its card
  // (sortedTasks: daily and per-shift tasks by time, then the weekly ones by weekday, then the monthly ones by day).
  const lswModel = (saved, LSW, toolKeys, day) => {
    const s = isObj(saved) ? saved : {};
    const seen = new Set();
    const leaders = list(s.leaders).map((l) => LSW.cleanLeader(l, toolKeys, day)).filter((l) => l && !seen.has(l.id) && seen.add(l.id)).slice(0, 80);
    const shares = Object.fromEntries(LSW.LEVELS.map((level) => { const v = Number(s.shares?.[level]); return [level, v > 0 && v <= 1 ? v : LSW.LEVEL_SHARE[level]]; }));
    const rank = (task) => LSW.FREQS.indexOf(task.freq === "shift" ? "daily" : task.freq);
    return leaders.filter((leader) => leader.tasks.length).map((leader) => {
      const tasks = [...leader.tasks].sort((a, b) => rank(a) - rank(b) || (a.freq === "weekly" ? a.weekday - b.weekday : a.freq === "monthly" ? a.monthDay - b.monthDay : 0) || LSW.minuteOf(leader, a) - LSW.minuteOf(leader, b));
      return {
        leader, days: LSW.workdays(leader), planned: LSW.planned(leader, shares),
        daily: tasks.filter((t) => t.freq === "daily" || t.freq === "shift"), weekly: tasks.filter((t) => t.freq === "weekly"), monthly: tasks.filter((t) => t.freq === "monthly"),
      };
    });
  };

  // ---- Safety Cross of the month ----
  // The cross of the day's month with SafetyMath: a day's state from its events (dayState), the days ahead "future"
  // and so left blank, the cells after the month's last day "none".
  const safetyModel = (saved, day, SM) => {
    const rows = list(isObj(saved) ? saved.rows : []).map(SM.cleanRow).filter(Boolean);
    const ym = day.slice(0, 7);
    const month = SM.monthRows(rows, ym).sort((a, b) => a.date.localeCompare(b.date));
    const days = SM.monthDays(ym);
    const byDate = new Map();
    month.forEach((row) => byDate.set(row.date, [...(byDate.get(row.date) || []), row]));
    const cells = SM.crossLayout().map(({ day: n, col, row }) => {
      const iso = `${ym}-${pad(n)}`;
      const real = n <= days;
      const events = real ? byDate.get(iso) || [] : [];
      return { day: n, col, row, iso, state: real ? SM.dayState(events, iso, day) : "none", n: events.length };
    });
    const count = (state) => cells.filter((cell) => cell.state === state).length;
    return { ym, rows: rows.length, cells, events: month, counts: SM.counts(month), since: SM.daysSince(rows, day), red: count("danger"), amber: count("warn"), green: count("ok") };
  };

  // ---- Daily Board of the month ----
  // The logs the board reads, in this language, as it reads them (daily-board.js, logOf).
  const BOARD_LOGS = { damage: "damage-control", incomplete: "incomplete-control", audit: "night-audit", delay: "delay-analyzer", safety: "safety-cross", fives: "five-s-audit", rooms: "room-inspection", maintenance: "maintenance-planner" };
  const boardLogs = (read, suffix) => Object.fromEntries(Object.entries(BOARD_LOGS).map(([name, tool]) => {
    const saved = read(`sc-${tool}${suffix}`);
    return [name, isObj(saved) && Array.isArray(saved.rows) ? { ...saved, rows: saved.rows.filter(isObj) } : { rows: [] }];
  }));
  const logsInUse = (logs) => Object.values(isObj(logs) ? logs : {}).some((log) => list(log?.rows).length > 0);
  const boardRows = (saved, DB) => list(isObj(saved) ? saved.rows : []).filter((row) => isObj(row) && isIso(row.date) && DB.LETTERS.includes(row.letter) && DB.STATES.includes(row.state))
    .map((row) => ({ date: row.date, shift: str(row.shift).trim(), letter: row.letter, state: row.state, note: str(row.note).trim() }));
  // DailyBoardMath.board for the month of the day, with the board's targets, defaults and rules.
  const boardModel = (saved, logs, day, DB, options = {}) => {
    const model = DB.board(day.slice(0, 7), logs, boardRows(saved, DB), { today: day, targets: options.targets || {}, defaults: options.defaults || {}, extra: options.extra || {} });
    return { ...model, rows: boardRows(saved, DB).length };
  };

  // ---- Room Status attendant sheets ----
  const isStamp = (value) => /^\d{4}-\d{2}-\d{2} ([01]\d|2[0-3]):[0-5]\d$/.test(str(value));
  // The board as Room Status keeps it (its tidy), and one sheet per attendant as it prints them (attendantSheets): the
  // rooms in the queue's order (RoomStatusMath.queue), then those in progress, the dirty ones not in the queue (DND), due
  // out, and the rest; out-of-order rooms are left off, dirty rooms without an attendant go on the "unassigned" sheet.
  const roomsModel = (saved, day, RS, types = [], unassigned = "") => {
    const s = isObj(saved) ? saved : {};
    const seen = new Set();
    const rooms = RS.sortRooms(list(s.rooms).filter((r) => isObj(r) && str(r.number).trim()).map((r) => {
      const number = str(r.number).trim().slice(0, 12);
      return { number, floor: str(r.floor).trim().slice(0, 4) || RS.floorOf(number), type: types.includes(r.type) ? r.type : "double" };
    }).filter((room) => !seen.has(room.number) && seen.add(room.number))).slice(0, 3000);
    const board = {};
    rooms.forEach((room) => {
      const e = isObj(s.board) && isObj(s.board[room.number]) ? s.board[room.number] : {};
      const status = RS.STATUSES.includes(e.status) ? e.status : "vd";
      board[room.number] = { ...RS.blankEntry(status), at: isStamp(e.at) ? e.at : "", flags: RS.FLAGS.filter((f) => Array.isArray(e.flags) && e.flags.includes(f)), attendant: str(e.attendant).trim().slice(0, 60), note: str(e.note).trim().slice(0, 300), started: RS.DIRTY.includes(status) && isStamp(e.started) ? e.started : "" };
    });
    const order = new Map(RS.queue(rooms, board).map((item, i) => [item.room.number, i]));
    const rank = (room) => {
      const e = board[room.number];
      if (order.has(room.number)) return order.get(room.number);
      if (RS.DIRTY.includes(e.status) && e.started) return 10000;
      if (RS.DIRTY.includes(e.status)) return 20000;
      if (e.status === "do") return 30000;
      return 40000;
    };
    const groups = new Map();
    rooms.forEach((room) => {
      const e = board[room.number];
      if (RS.OUT.includes(e.status)) return;
      const name = e.attendant || (RS.DIRTY.includes(e.status) || e.status === "do" ? unassigned : "");
      if (!name) return;
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(room);
    });
    const sheets = [...groups.entries()].sort(([a], [b]) => numeric(a, b)).map(([name, mine]) => ({
      name,
      done: mine.filter((room) => !RS.DIRTY.includes(board[room.number].status) && board[room.number].status !== "do").length,
      rooms: [...mine].sort((a, b) => rank(a) - rank(b) || numeric(a.number, b.number)).map((room) => ({ ...room, ...board[room.number] })),
    }));
    return { day: isIso(s.day) ? s.day : "", stale: isIso(s.day) && s.day < day, rooms: rooms.length, sheets };
  };

  // ---- Housekeeping section sheets ----
  // The settings as the planner keeps them (its tidySettings): each value within its bounds, else the default.
  const tidySettings = (raw, D, TYPES, CLEANS) => {
    const s = JSON.parse(JSON.stringify(D));
    const r = isObj(raw) ? raw : {};
    const numIn = (value, min, max, fallback) => (typeof value === "number" && Number.isFinite(value) && value >= min && value <= max ? value : fallback);
    s.mode = r.mode === "credits" ? "credits" : "minutes";
    ["minutes", "credits"].forEach((table) => TYPES.forEach((type) => CLEANS.forEach((clean) => {
      s[table][type][clean] = numIn(r[table]?.[type]?.[clean], 0, table === "minutes" ? 600 : 50, D[table][type][clean]);
    })));
    s.vipMinutes = numIn(r.vipMinutes, 0, 240, D.vipMinutes);
    s.vipCredits = numIn(r.vipCredits, 0, 20, D.vipCredits);
    s.creditsPerAttendant = numIn(r.creditsPerAttendant, 1, 100, D.creditsPerAttendant);
    s.publicHours = numIn(r.publicHours, 0, 500, D.publicHours);
    s.shiftHours = numIn(r.shiftHours, 1, 14, D.shiftHours);
    s.breakMinutes = numIn(r.breakMinutes, 0, 180, D.breakMinutes);
    s.productiveShare = numIn(r.productiveShare, 0.3, 1, D.productiveShare);
    s.linenEvery = Math.round(numIn(r.linenEvery, 1, 30, D.linenEvery));
    return s;
  };
  // The plan of the day as the planner works it out (its analysis): the rooms typed as counts or read from Room
  // Status, their minutes, HousekeepingPlannerMath.plan for the number of sections and balance for the sections, and
  // the names typed (or the attendants of Room Status when the rooms come from there).
  const housekeepingModel = (saved, rsSaved, day, HP, cfg) => {
    const TYPES = list(cfg.roomTypes).map((t) => t.key);
    const r = isObj(saved) ? saved : {};
    const optional = (value, max) => (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max ? value : null);
    const s = tidySettings(r.settings, cfg.defaults, TYPES, HP.CLEANS);
    const source = r.source === "rooms" ? "rooms" : "counts";
    let items, rs = null;
    if (source === "rooms") {
      rs = HP.fromRoomStatus(isObj(rsSaved) ? rsSaved : null, { linenRooms: str(r.linenRooms).slice(0, 4000), deepRooms: str(r.deepRooms).slice(0, 2000), today: day, types: TYPES });
      items = rs.items;
    } else items = HP.itemsFromRows(list(r.rows).slice(0, 200).map((row) => HP.cleanRow(row, TYPES)));
    items = HP.withMinutes(s, items);
    const hotelRooms = optional(r.hotelRooms, 9999) ?? (rs ? rs.rooms : null);
    const p = HP.plan(items, s, { scheduled: optional(r.scheduled, 999), rate: optional(r.rate, 999), sections: optional(r.sections, 999), hotelRooms });
    const own = list(r.names).map((n) => str(n).trim().slice(0, 60)).filter(Boolean).slice(0, 200);
    const rsNames = isObj(rsSaved) ? list(rsSaved.attendants).map((a) => str(a?.name).trim()).filter(Boolean) : [];
    const people = own.length ? own : source === "rooms" ? rsNames : [];
    const sections = HP.balance(items, p.sections).map((sec, i) => ({ name: people[i] || "", index: i, floors: sec.floors, minutes: sec.minutes, items: sec.items, rooms: sec.items.filter((item) => item.clean !== "vip").length }));
    return { source, stale: Boolean(rs?.stale), productive: p.productive, needed: p.needed, cleaned: p.cleaned, sections };
  };

  // ---- What each document has, and the pack's choice ----
  // A document can be printed when its tool holds data in this browser; the tool's own example counts as data, but is
  // marked, so the pack does not tick it by default. states: what the tools keep (see readState in the page code).
  const availability = (states, day, L, src) => {
    const a = actionsModel(states.actions.rows, day);
    const m = maintenanceModel(states.maintenance, day, L.MP);
    const f = fivesModel(states.fives, day, L.FS);
    const l = lswModel(states.lsw, L.LSW, list(src.lsw.tools).map((t) => t.key), day);
    const sx = safetyModel(states.safety, day, L.SM);
    const boardSaved = states.board.saved;
    const rooms = roomsModel(states.rooms, day, L.RS, list(src.rooms.roomTypes).map((t) => t.key), src.rooms.unassigned);
    const hk = housekeepingModel(states.housekeeping.saved, states.housekeeping.rs, day, L.HP, src.housekeeping);
    return {
      actions: { has: a.open > 0, toolExample: actionsExampleOn(list(states.actions.rows), states.actions.ui) },
      maintenance: { has: m.tasks > 0, toolExample: stampMatches(states.maintenance) },
      fives: { has: f.planned > 0, toolExample: isObj(states.fives) && states.fives.planExample === true },
      lsw: { has: l.length > 0, toolExample: isObj(states.lsw) && isObj(states.lsw.example) && states.lsw.example.on === true },
      safety: { has: sx.rows > 0, toolExample: stampMatches(states.safety) },
      board: { has: boardRows(boardSaved, L.DB).length > 0 || logsInUse(states.board.logs), toolExample: stampMatches(boardSaved) && !logsInUse(states.board.logs) },
      rooms: { has: rooms.sheets.length > 0, toolExample: isObj(states.rooms) && states.rooms.example === true },
      housekeeping: { has: hk.sections.length > 0, toolExample: isObj(states.housekeeping.saved) && states.housekeeping.saved.example === true },
    };
  };
  // The pack is the team's own as soon as one document has data that is not a tool's example; until then the pack shows
  // its example. Ticked by default: in the team's pack what has its own data, in the example what is not for a hotel.
  const ownAny = (avail) => DOCS.some((key) => avail[key].has && !avail[key].toolExample);
  const defaultPick = (key, avail, example) => (example ? !HOTEL.includes(key) : avail[key].has && !avail[key].toolExample);
  const picked = (avail, choices, example) => DOCS.filter((key) => (example || avail[key].has) && (typeof choices?.[key] === "boolean" ? choices[key] : defaultPick(key, avail, example)));

  // ---- The example pack, in memory only ----
  // Each tool's own example, made for the date on the pack the way the tool makes it: the planner's and the standard
  // work's seeded examples ending on the day, the room board at mid-morning of the day, the audits, the safety events,
  // the board's typed month and the actions moved by whole weeks or dated from the day.
  const examplePack = (src, day, L, cleanAction) => {
    const mp = L.MP.exampleData(src.maintenance.example, src.maintenance.types, day);
    const audits = list(src.fives.example.audits);
    const fivesShift = audits.length ? weeksShift(audits.map((a) => a.date).sort().at(-1), day) : 0;
    const lsw = L.LSW.exampleData(src.lsw.example, src.lsw.templates, day, 0);
    const safetyLines = list(src.safety.example.rows);
    const safetyLast = safetyLines.map((row) => String(row).slice(0, 10)).filter(isIso).sort().at(-1);
    const safetyShift = safetyLast ? weeksShift(safetyLast, day) : 0;
    const moved = safetyLines.map((row) => (isIso(String(row).slice(0, 10)) ? addDays(String(row).slice(0, 10), safetyShift) + String(row).slice(10) : String(row)));
    const ex = src.board.example;
    const given = new Map(list(ex.rows).map((row) => [`${row.ago}|${row.letter}`, row]));
    const boardRowsEx = [];
    for (let ago = ex.days - 1; ago >= 0; ago--) {
      list(ex.fill).forEach((letter, i) => {
        const row = given.get(`${ago}|${letter}`);
        boardRowsEx.push(row ? { date: addDays(day, -ago), shift: row.shift, letter, state: row.state, note: row.note } : { date: addDays(day, -ago), shift: src.board.shifts[(ago + i) % src.board.shifts.length], letter, state: "green", note: "" });
      });
    }
    const rs = L.RS.exampleData(src.rooms.example, day);
    Object.entries(src.rooms.example.notes || {}).forEach(([room, note]) => { if (rs.board[room]) rs.board[room].note = note; });
    const hk = src.housekeeping.example;
    return {
      actions: { rows: exampleActions(src.actions.example, day, cleanAction), ui: {} },
      maintenance: { site: mp.site, assets: mp.assets, rows: mp.rows },
      fives: { plan: list(src.fives.example.plan), rows: audits.map((a) => ({ date: addDays(a.date, fivesShift), area: a.area, auditor: a.auditor })) },
      lsw: { leaders: lsw.leaders },
      safety: { rows: L.SM.importRows(moved.map((row) => row.replace(/\|/g, "\t")).join("\n"), src.safety).added },
      board: { saved: { rows: boardRowsEx }, logs: {} },
      rooms: { rooms: rs.rooms, board: rs.board, history: rs.history, attendants: rs.attendants, day, example: false },
      housekeeping: { saved: { source: "counts", rows: list(hk.rows), hotelRooms: hk.hotelRooms, arrivals: hk.arrivals, scheduled: hk.scheduled, rate: hk.rate, sections: null, names: list(hk.names) }, rs: null },
    };
  };

  window.PrintPackMath = { DOCS, HOTEL, BOARD_LOGS, stampMatches, weeksShift, actionsModel, actionsExampleOn, exampleActions, cleanMaintenance, maintenanceModel, fivesModel, lswModel, safetyModel, boardLogs, logsInUse, boardRows, boardModel, roomsModel, tidySettings, housekeepingModel, availability, ownAny, defaultPick, picked, examplePack };

  // ---- The page ----
  const dataEl = document.getElementById("print-pack-data");
  const sourcesEl = document.getElementById("print-pack-sources");
  const root = document.querySelector("[data-print-pack]");
  if (!dataEl || !sourcesEl || !root || !window.ToolKit) return;
  const { LANG, tx, int, pct, num, lower, showDate, read, write, loadState, el, today, parseDate, flash, stat } = window.ToolKit;
  const cfg = JSON.parse(dataEl.textContent);
  const src = JSON.parse(sourcesEl.textContent);
  const KEY = cfg.storageKey;
  const L = { MP: window.MaintenancePlannerMath, FS: window.FiveSMath, LSW: window.LeaderStandardWorkMath, SM: window.SafetyMath, RS: window.RoomStatusMath, HP: window.HousekeepingPlannerMath, DB: window.DailyBoardMath };
  if (Object.values(L).some((lib) => !lib)) return;
  const AS = window.ActionsStore;
  const Workplace = window.Workplace || null;
  const ChartKit = window.ChartKit || null;
  const docOf = Object.fromEntries(cfg.docs.map((doc) => [doc.key, doc]));
  const SUFFIX = LANG === "en" ? "" : `-${LANG}`;

  // The pack's own state: which documents were ticked or unticked (the rest follow the default) and whether its example
  // was put away. Nothing else is stored, and nothing of another tool.
  const state = loadState(KEY, { picked: {}, example: true });
  state.picked = Object.fromEntries(Object.entries(isObj(state.picked) ? state.picked : {}).filter(([key, value]) => DOCS.includes(key) && typeof value === "boolean"));
  const save = () => write(KEY, state);
  // The example asked for with its button is shown until it is put away, without being stored.
  let wantExample = false;
  let exampleChoices = {};

  const q = (selector) => root.querySelector(selector);
  const docsBox = q("[data-docs]");
  const dateInput = q("#pk-date");
  const printButton = q("[data-print]");
  const exampleButton = q("[data-example]");
  const status = q("[data-status]");
  const results = document.querySelector("[data-results]");
  document.documentElement.classList.add("pk-page");
  dateInput.value = today();
  const day = () => parseDate(dateInput.value) || today();

  // What the tools hold now, read once per drawing (read-only).
  const readKey = (key) => read(key, null);
  const readState = () => ({
    actions: { rows: AS ? AS.list() : [], ui: readKey(src.actions.uiKey) },
    maintenance: readKey(src.maintenance.key),
    fives: readKey(src.fives.key),
    lsw: readKey(src.lsw.key),
    safety: readKey(src.safety.key),
    board: { saved: readKey(src.board.key), logs: boardLogs(readKey, SUFFIX) },
    rooms: readKey(src.rooms.key),
    housekeeping: { saved: readKey(src.housekeeping.key), rs: readKey(src.housekeeping.roomStatusKey) },
  });
  const cleanAction = AS ? AS.clean : (item) => item;

  // ---- Words ----
  const toolName = (key) => docOf[key].tool;
  const site = (example) => (Workplace?.get().site || (example ? src.board.example.profile?.site || "" : ""));
  const monthName = (ym) => `${src.board.months[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
  const weekdayOf = (iso) => { const d = new Date(`${iso}T00:00:00Z`).getUTCDay(); return d === 0 ? 7 : d; };
  const shortDay = (iso) => src.lsw.weekdays.short[weekdayOf(iso) - 1];
  const overdueText = (days) => (days === 1 ? tx("1 day overdue") : tx("{n} days overdue", { n: int.format(days) }));
  const minutesText = (m) => tx("{n} min", { n: int.format(Math.round(m)) });
  const BOX = "☐";
  const SIGN = { ok: "✓", warn: "!", danger: "✕", green: "✓", amber: "!", red: "✕" };
  const th = (text, className) => { const cell = el("th", className, text); cell.scope = "col"; return cell; };
  const table = (heads, rows, className = "") => {
    const t = el("table", `pk-table${className ? ` ${className}` : ""}`);
    const head = el("tr");
    heads.forEach(([text, cls]) => head.append(th(text, cls)));
    t.append(el("thead"));
    t.tHead.append(head);
    const body = el("tbody");
    rows.forEach((cells) => {
      const tr = el("tr");
      cells.forEach((cell) => tr.append(cell instanceof window.Node ? cell : el("td", null, cell)));
      body.append(tr);
    });
    t.append(body);
    return t;
  };
  const td = (content, className) => { const cell = el("td", className); if (content instanceof window.Node) cell.append(content); else cell.textContent = content ?? ""; return cell; };

  // One A4 sheet: the site, the date and the tool above the title, the facts under it; a page break before it on paper.
  const sheet = (key, title, meta, ctx) => {
    const page = el("section", "pk-sheet");
    page.dataset.doc = key;
    const head = el("header", "pk-head");
    const top = el("p", "pk-top");
    top.append(el("span", null, [site(ctx.example), toolName(key)].filter(Boolean).join(" · ")), el("span", null, showDate(ctx.day)));
    head.append(top, el("h2", null, title));
    if (meta) head.append(el("p", "pk-meta", meta));
    page.append(head);
    return page;
  };
  const foot = (page, key, ctx, extra) => {
    if (extra) page.append(el("p", "pk-note", extra));
    page.append(el("p", "pk-foot", tx("Printed from {tool} on {date}. The tool keeps the live version.", { tool: toolName(key), date: showDate(ctx.day) })));
    return page;
  };

  // ---- The documents ----
  const actionsDoc = (states, ctx) => {
    const m = actionsModel(states.actions.rows, ctx.day);
    const page = sheet("actions", docOf.actions.name, [tx("{n} open", { n: int.format(m.open) }), tx("{n} overdue", { n: int.format(m.overdue) }), tx("{n} owners", { n: int.format(m.owners.length) })].join(" · "), ctx);
    if (ChartKit && m.owners.length > 1) {
      const chart = ChartKit.bars(m.owners.map((o) => ({ label: o.owner || tx("No owner"), value: o.items.length, overdue: o.overdue, tip: `${o.owner || tx("No owner")}: ${tx("{n} open", { n: int.format(o.items.length) })}, ${tx("{n} overdue", { n: int.format(o.overdue) })}` })),
        { title: tx("Open actions by owner"), highlight: (item) => item.overdue > 0, format: (v) => int.format(v) });
      page.append(ChartKit.figure(chart, { buttons: false, caption: tx("Open actions per owner; the dark columns are owners with an action past its date.") }));
    }
    const priority = (p) => src.actions.priorities?.[p] || p;
    const statusName = (s) => src.actions.statuses?.[s] || s;
    const sourceName = (s) => src.actions.sources?.[s || "manual"] || s || "";
    m.owners.forEach((group) => {
      page.append(el("h3", "pk-group", `${group.owner || tx("No owner")} · ${[tx("{n} open", { n: int.format(group.items.length) }), group.overdue ? tx("{n} overdue", { n: int.format(group.overdue) }) : ""].filter(Boolean).join(", ")}`));
      page.append(table([["", "pk-box"], [tx("Action")], [tx("Area")], [tx("Due")], [tx("Priority")], [tx("Status")], [tx("Done, note")]], group.items.map((a) => {
        const what = el("td");
        what.append(el("strong", null, a.title));
        if (a.detail) what.append(el("span", "pk-sub", a.detail));
        if (a.check) what.append(el("span", "pk-sub", `${tx("Check")}: ${a.check}`));
        if (a.source) what.append(el("span", "pk-sub", `${tx("From")}: ${sourceName(a.source)}`));
        return [td(BOX, "pk-box"), what, td(a.area), td(a.due ? (a.overdue ? `${showDate(a.due)} · ${overdueText(a.late)}` : showDate(a.due)) : "–", a.overdue ? "pk-strong" : ""), td(priority(a.priority)), td(statusName(a.status)), td("", "pk-write")];
      })));
    });
    if (!m.owners.length) page.append(el("p", null, tx("No open actions.")));
    return [foot(page, "actions", ctx)];
  };

  const maintenanceDoc = (states, ctx) => {
    const m = maintenanceModel(states.maintenance, ctx.day, L.MP, tx("No area"));
    const typeName = (key) => list(src.maintenance.types).find((t) => t.key === key)?.name || "";
    const assetLabel = (asset) => `${asset.tag} · ${asset.name || typeName(asset.type)}`;
    const meta = [tx("{n} tasks", { n: int.format(m.count) }), tx("{n} overdue", { n: int.format(m.overdue) }), tx("about {t} planned", { t: minutesText(m.minutes) })].join(" · ");
    const page = sheet("maintenance", tx("Work list · week of {date}", { date: showDate(m.monday) }), meta, ctx);
    m.groups.forEach(([area, items]) => {
      page.append(el("h3", "pk-group", area));
      page.append(table([["", "pk-box"], [tx("Asset")], [tx("Task")], [tx("Who")], [tx("Minutes"), "num"], [tx("Due")], [tx("Done by, date, note")]], items.map((t) => {
        const task = el("td");
        task.append(el("strong", null, t.task.text));
        if (t.task.statutory) task.append(el("span", "pk-flag", ` · § ${tx("statutory")}`));
        if (t.task.checklist.length) {
          const ul = el("ul", "pk-check");
          t.task.checklist.forEach((item) => ul.append(el("li", null, `${BOX} ${item}`)));
          task.append(ul);
        }
        const who = t.task.who === "external" ? t.asset.supplier || tx("External") : tx("Internal");
        const due = t.status === "overdue" ? `${showDate(t.due)} · ${overdueText(t.late)}` : showDate(t.due);
        return [td(BOX, "pk-box"), td(assetLabel(t.asset)), task, td(who), td(int.format(t.task.minutes), "num"), td(due, t.status === "overdue" ? "pk-strong" : ""), td("", "pk-write")];
      })));
    });
    if (!m.groups.length) page.append(el("p", null, tx("Nothing is due this week.")));
    page.append(el("p", "pk-note", src.maintenance.statutory));
    page.append(el("p", "pk-sign", `${tx("Signature")}: ____________________`));
    return [foot(page, "maintenance", ctx)];
  };

  const fivesDoc = (states, ctx) => {
    const m = fivesModel(states.fives, ctx.day, L.FS);
    const meta = [tx("{n} areas planned", { n: int.format(m.planned) }), tx("{from} to {to}", { from: showDate(ctx.day), to: showDate(m.until) }), m.overdue ? tx("{n} overdue", { n: int.format(m.overdue) }) : ""].filter(Boolean).join(" · ");
    const page = sheet("fives", docOf.fives.name, meta, ctx);
    if (m.items.length) {
      page.append(table([["", "pk-box"], [tx("Day")], [tx("Area")], [tx("Auditor")], [tx("How often")], [tx("Note")], [tx("Score, done by")]], m.items.map((item) => [
        td(BOX, "pk-box"), td(`${shortDay(item.date)} ${showDate(item.date)}`, "pk-nowrap"), td(item.area, "pk-strong-cell"), td(item.auditor || tx("No auditor named yet")), td(src.fives.cadences?.[item.cadence] || item.cadence),
        td(item.overdue ? tx("Overdue by {n} days, due {date}", { n: int.format(item.late), date: showDate(item.due) }) : "", item.overdue ? "pk-strong" : ""), td("", "pk-write"),
      ])));
    } else page.append(el("p", null, tx("Nothing due in the next seven days.")));
    return [foot(page, "fives", ctx, tx("The auditors take turns: the next name after the last audit of the area, so nobody audits the same area twice in a row."))];
  };

  const lswDoc = (states, ctx) => {
    const models = lswModel(states.lsw, L.LSW, list(src.lsw.tools).map((t) => t.key), ctx.day);
    const levelName = (key) => list(src.lsw.levels).find((l) => l.key === key)?.name || key;
    const toolLabel = (key) => list(src.lsw.tools).find((t) => t.key === key)?.name || "";
    const dayShort = (n) => src.lsw.weekdays.short[n - 1];
    const clock = L.LSW.clock;
    const timeText = (minute) => `${clock(minute)}${minute >= 1440 ? " (+1)" : ""}`;
    const hoursText = (hours) => num(hours, hours % 1 ? (hours % 0.5 ? 2 : 1) : 0);
    const shiftText = (l) => `${l.shift ? `${l.shift} ` : ""}${l.start}–${clock(L.LSW.toMinutes(l.start) + l.hours * 60)}`;
    const daysText = (l) => {
      const d = L.LSW.workdays(l);
      const run = d.length > 2 && d.every((v, i) => i === 0 || v === d[i - 1] + 1);
      return run ? `${dayShort(d[0])}–${dayShort(d.at(-1))}` : d.map(dayShort).join(", ");
    };
    // On paper the clock time is enough for a daily task; a weekly one carries its weekday, a monthly one its day.
    const whenText = (leader, task) => {
      const minute = L.LSW.minuteOf(leader, task);
      if (task.freq === "weekly") return `${src.lsw.weekdays.long[task.weekday - 1]} ${timeText(minute)}`;
      if (task.freq === "monthly") return tx("Day {n}, {time}", { n: task.monthDay, time: timeText(minute) });
      return timeText(minute);
    };
    const plannedText = (m) => {
      const p = m.planned;
      const share = p.share === null ? "–" : pct(p.share, 0);
      const guide = p.guide === null ? "–" : pct(p.guide, 0);
      const verdict = p.share === null ? "" : p.share > 1 ? tx("More standard work than the shift has.") : p.share > p.guide + 0.15 ? tx("Well above the guide: little room for the unexpected.") : p.share < p.guide - 0.15 ? tx("Well below the guide: add the routine checks of this level.") : tx("Close to the guide.");
      return `${tx("Planned: {min} min of standard work per working day, {share} of a day of {hours} hours. Guide for a {level}: about {guide}.", { min: int.format(Math.round(p.perDay)), share, hours: hoursText(m.leader.hours), level: lower(levelName(m.leader.level)), guide })} ${verdict}`.trim();
    };
    const cardTable = (leader, tasks, boxes) => table([[tx("When"), "pk-when"], [tx("Task")], [tx("min"), "num"], ...boxes.map((name) => [name, "pk-box"])], tasks.map((task) => {
      const what = el("td");
      what.append(el("strong", null, task.title));
      if (task.done) what.append(el("span", "pk-sub", `${tx("Done when")}: ${task.done}`));
      if (task.tool) what.append(el("span", "pk-sub", `${tx("Tool")}: ${toolLabel(task.tool)}`));
      return [td(whenText(leader, task), "pk-when"), what, td(int.format(task.minutes), "num"), ...boxes.map(() => td(BOX, "pk-box"))];
    }), "pk-card");
    return models.map((m) => {
      const l = m.leader;
      const page = sheet("lsw", l.name, [levelName(l.level), l.area, shiftText(l), daysText(l)].filter(Boolean).join(" · "), ctx);
      page.append(el("p", "pk-meta", plannedText(m)));
      if (m.daily.length) page.append(el("h3", "pk-group", tx("Every working day")), cardTable(l, m.daily, m.days.map(dayShort)));
      if (m.weekly.length) page.append(el("h3", "pk-group", tx("Every week")), cardTable(l, m.weekly, [tx("Week 1"), tx("Week 2"), tx("Week 3"), tx("Week 4")]));
      if (m.monthly.length) page.append(el("h3", "pk-group", tx("Every month")), cardTable(l, m.monthly, [tx("Done")]));
      page.append(el("p", "pk-note", `${tx("Missed? Write the reason")}: ${list(src.lsw.reasons).map((r) => r.name).join(" · ")}. ${tx("Day 29 to 31 falls on the last day of a shorter month; a weekly or monthly task on a day off moves to the next working day.")}`));
      page.append(el("p", "pk-sign", `${tx("Leader")}: ____________________   ${tx("Reviewed by")}: ____________________   ${tx("Date")}: __________`));
      return foot(page, "lsw", ctx);
    });
  };

  const safetyDoc = (states, ctx) => {
    const m = safetyModel(states.safety, ctx.day, L.SM);
    const since = m.since === null ? tx("No accident in the log") : m.since === 1 ? tx("1 day since the last accident") : tx("{n} days since the last accident", { n: int.format(m.since) });
    const page = sheet("safety", `${toolName("safety")} · ${monthName(m.ym)}`, [since, tx("{n} events this month", { n: int.format(m.events.length) })].join(" · "), ctx);
    const cross = el("div", "pk-cross");
    cross.setAttribute("role", "img");
    cross.setAttribute("aria-label", `${toolName("safety")} · ${monthName(m.ym)}`);
    m.cells.forEach((cell) => {
      const box = el("div", `pk-cell is-${cell.state}`);
      box.style.gridColumn = String(cell.col + 1);
      box.style.gridRow = String(cell.row + 1);
      if (cell.state !== "none") {
        box.append(el("span", "pk-cell-day", String(cell.day)));
        if (SIGN[cell.state]) box.append(el("span", "pk-cell-sign", SIGN[cell.state]));
        if (cell.n > 1) box.append(el("span", "pk-cell-n", `×${cell.n}`));
      }
      cross.append(box);
    });
    page.append(cross);
    page.append(el("p", "pk-legend", `✓ ${tx("No incident")} · ! ${tx("Near miss or unsafe condition")} · ✕ ${tx("Accident or first aid")} · ${tx("Blank: still to come, mark it at the end of each day.")}`));
    if (m.events.length) {
      const shortName = (type) => src.safety.short?.[type] || type;
      page.append(el("h3", "pk-group", tx("Events this month")));
      page.append(table([[tx("Date")], [tx("Type")], [tx("Area")], [tx("What happened")], [tx("Action")]], m.events.map((row) => [
        td(showDate(row.date), "pk-nowrap"), td(shortName(row.type), L.SM.RED.includes(row.type) ? "pk-strong" : ""), td(row.area), td(row.what), td(row.action ? `${row.action}${row.owner ? ` (${row.owner})` : ""}${row.done ? " ✓" : ""}` : ""),
      ])));
    }
    return [foot(page, "safety", ctx)];
  };

  // The board's colours as the board draws them: the targets of the workplace profile, else the board's defaults, and
  // its rules and the Room Inspection checklists for the first-time pass rate.
  const boardOptions = () => {
    const targetShare = (key) => { const value = Workplace?.target(key); return Number.isFinite(value) && value > 0 ? value / 100 : null; };
    return {
      targets: { damage: targetShare("damage"), incomplete: targetShare("incomplete"), ontime: targetShare("ontime"), fives: targetShare("fives") },
      defaults: Object.fromEntries(list(src.board.targets).filter((t) => Number.isFinite(t.default)).map((t) => [t.key, t.default / 100])),
      extra: { rooms: src.roomInspection, rules: src.board.rules },
    };
  };
  const boardDoc = (states, ctx) => {
    const m = boardModel(states.board.saved, states.board.logs, ctx.day, L.DB, boardOptions());
    const letters = list(src.board.letters);
    const meta = letters.map((letter) => { const c = m.counts[letter.key]; return `${letter.key}: ✓ ${c.green} · ! ${c.amber} · ✕ ${c.red}`; }).join("   ");
    const page = sheet("board", `${src.board.title} · ${monthName(m.month)}`, meta, ctx);
    const heads = [[tx("Day")], ...letters.map((letter) => [`${letter.key} · ${letter.name}`, "pk-letter"])];
    page.append(table(heads, m.days.map((d) => [
      td(`${shortDay(d.date)} ${showDate(d.date)}`, d.date === ctx.day ? "pk-nowrap pk-strong" : "pk-nowrap"),
      ...letters.map((letter) => { const s = d.letters[letter.key]; return td(SIGN[s.state] || "", `pk-letter is-${s.state}`); }),
    ]), "pk-board"));
    page.append(el("p", "pk-legend", `✓ ${src.board.states.green} · ! ${src.board.states.amber} · ✕ ${src.board.states.red} · ${tx("Blank: no data yet, or a day still to come; fill it at the huddle.")}`));
    return [foot(page, "board", ctx)];
  };

  const roomsDoc = (states, ctx) => {
    const m = roomsModel(states.rooms, ctx.day, L.RS, list(src.rooms.roomTypes).map((t) => t.key), src.rooms.unassigned);
    const statusOf = Object.fromEntries(list(src.rooms.statuses).map((s) => [s.key, s]));
    const flagOf = Object.fromEntries(list(src.rooms.flags).map((f) => [f.key, f]));
    const typeName = (key) => list(src.rooms.roomTypes).find((t) => t.key === key)?.name || "";
    const legend = [...list(src.rooms.statuses).map((s) => `${s.code} = ${s.name}`), ...list(src.rooms.flags).map((f) => `${f.code} = ${f.name}`)].join(" · ");
    const stale = m.stale ? tx("This board is from {date}: start today's board in Room Status before you print.", { date: showDate(m.day) }) : "";
    return m.sheets.map((s) => {
      const page = sheet("rooms", s.name, [m.day ? tx("Board of {date}", { date: showDate(m.day) }) : "", tx("{n} rooms", { n: int.format(s.rooms.length) }), tx("{n} done", { n: int.format(s.done) })].filter(Boolean).join(" · "), ctx);
      if (stale) page.append(el("p", "pk-warn", stale));
      page.append(table([[tx("Room")], [tx("Room type")], [tx("Status")], [tx("Flags")], [tx("Note")], [tx("Time in")], [tx("Time out")], [tx("Remarks")]], s.rooms.map((room) => [
        td(room.number, "pk-strong-cell"), td(typeName(room.type)), td(statusOf[room.status]?.code || room.status), td(room.flags.map((f) => flagOf[f]?.code || f).join(" ")), td(room.note), td(room.started ? room.started.slice(11) : ""), td("", "pk-write"), td("", "pk-write"),
      ])));
      page.append(el("p", "pk-legend", legend));
      return foot(page, "rooms", ctx);
    });
  };

  const housekeepingDoc = (states, ctx) => {
    const m = housekeepingModel(states.housekeeping.saved, states.housekeeping.rs, ctx.day, L.HP, src.housekeeping);
    const typeName = (key) => list(src.housekeeping.roomTypes).find((t) => t.key === key)?.name || key;
    const cleanName = (key) => list(src.housekeeping.cleanTypes).find((c) => c.key === key)?.name || key;
    const floorLabel = (floor) => (floor ? tx("Floor {n}", { n: floor }) : tx("No floor"));
    const nice = (value) => (Number.isFinite(value) ? Math.round(value).toLocaleString(window.ToolKit.LOCALE) : "–");
    const hkMin = (value) => tx("{n} min", { n: nice(value) });
    const flagText = (item) => [item.vip ? "VIP" : "", ...list(item.flags).filter((f) => f === "arrival" || f === "early" || f === "dnd").map((f) => ({ arrival: "ARR", early: "EA", dnd: "DND" }[f]))].filter(Boolean).join(" ");
    return m.sections.map((sec) => {
      const page = sheet("housekeeping", sec.name || tx("Housekeeping section {n}", { n: sec.index + 1 }), [sec.floors.map(floorLabel).join(", "), tx("{n} rooms", { n: int.format(sec.rooms) }), tx("{m} planned of {p} productive", { m: hkMin(sec.minutes), p: hkMin(m.productive) })].join(" · "), ctx);
      if (m.stale) page.append(el("p", "pk-warn", tx("The rooms come from yesterday's Room Status board: start today's board before you print.")));
      const t = table([[tx("Floor")], [tx("Room")], [tx("Room type")], [tx("Clean")], [tx("Flags")], [tx("Minutes"), "num"], [tx("Start")], [tx("Finish")], [tx("Remarks")]], sec.items.map((item) => [
        td(item.floor), td(item.room, "pk-strong-cell"), td(typeName(item.type)), td(cleanName(item.clean)), td(flagText(item)), td(nice(item.minutes), "num"), td("", "pk-write"), td("", "pk-write"), td("", "pk-write"),
      ]));
      const tfoot = el("tfoot");
      const ftr = el("tr");
      const label = el("th", null, tx("Total"));
      label.colSpan = 5;
      label.scope = "row";
      ftr.append(label, td(nice(sec.minutes), "num"), el("td"), el("td"), el("td"));
      tfoot.append(ftr);
      t.append(tfoot);
      page.append(t);
      page.append(el("p", "pk-legend", tx("VIP = VIP set-up · ARR = arrival today · EA = early arrival · DND = do not disturb. Write the time in and out of each room; the supervisor signs the sheet at the end of the shift.")));
      return foot(page, "housekeeping", ctx);
    });
  };
  const BUILD = { actions: actionsDoc, maintenance: maintenanceDoc, fives: fivesDoc, lsw: lswDoc, safety: safetyDoc, board: boardDoc, rooms: roomsDoc, housekeeping: housekeepingDoc };

  // ---- What each document holds now, in one line under its box ----
  const summaryOf = (key, states, d) => {
    if (key === "actions") { const m = actionsModel(states.actions.rows, d); return tx("{n} open actions, {m} overdue, {k} owners", { n: int.format(m.open), m: int.format(m.overdue), k: int.format(m.owners.length) }); }
    if (key === "maintenance") { const m = maintenanceModel(states.maintenance, d, L.MP); return tx("{n} tasks due by Sunday, {m} of them overdue", { n: int.format(m.count), m: int.format(m.overdue) }); }
    if (key === "fives") { const m = fivesModel(states.fives, d, L.FS); return tx("{n} audits in the next seven days", { n: int.format(m.items.length) }); }
    if (key === "lsw") { const m = lswModel(states.lsw, L.LSW, list(src.lsw.tools).map((t) => t.key), d); return tx("{n} leaders, one card each", { n: int.format(m.length) }); }
    if (key === "safety") { const m = safetyModel(states.safety, d, L.SM); return tx("{n} events this month", { n: int.format(m.events.length) }); }
    if (key === "board") { const m = boardModel(states.board.saved, states.board.logs, d, L.DB, boardOptions()); const c = Object.values(m.counts); return tx("{r} red and {a} amber days so far this month", { r: int.format(sum(c.map((x) => x.red))), a: int.format(sum(c.map((x) => x.amber))) }); }
    if (key === "rooms") { const m = roomsModel(states.rooms, d, L.RS, list(src.rooms.roomTypes).map((t) => t.key), src.rooms.unassigned); return tx("{n} attendant sheets, {m} rooms", { n: int.format(m.sheets.length), m: int.format(sum(m.sheets.map((s) => s.rooms.length))) }); }
    const m = housekeepingModel(states.housekeeping.saved, states.housekeeping.rs, d, L.HP, src.housekeeping);
    return tx("{n} section sheets, {m} rooms", { n: int.format(m.sections.length), m: int.format(sum(m.sections.map((s) => s.rooms))) });
  };

  // ---- Drawing ----
  const exampleBox = el("div", "shell dl-example-note pk-example-note");
  exampleBox.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  exampleBox.append(el("strong", null, tx("Example")), " ", el("span", null, cfg.example.note), " ", clearExample);
  exampleBox.hidden = true;
  results.before(exampleBox);

  let current = null;
  const render = () => {
    const d = day();
    const own = readState();
    const avail = availability(own, d, L, src);
    const hasOwn = ownAny(avail);
    const example = wantExample || (!hasOwn && state.example !== false);
    const states = example ? examplePack(src, d, L, cleanAction) : own;
    const choices = example ? exampleChoices : state.picked;
    const chosen = picked(avail, choices, example);
    current = { example, chosen };
    exampleBox.hidden = !example;
    exampleButton.hidden = example;

    // The list of documents: a box each, ready or not, and what it holds or which tool to fill.
    docsBox.replaceChildren(...cfg.docs.map((doc) => {
      const ready = example || avail[doc.key].has;
      const row = el("div", `pk-doc${ready ? "" : " is-empty"}`);
      const input = el("input");
      input.type = "checkbox";
      input.id = `pk-doc-${doc.key}`;
      input.value = doc.key;
      input.dataset.pick = doc.key;
      input.checked = ready && chosen.includes(doc.key);
      input.disabled = !ready;
      const label = el("label");
      label.htmlFor = input.id;
      label.append(el("strong", null, doc.name), el("span", null, doc.about));
      const note = el("p", "form-note pk-doc-note");
      if (ready) {
        note.append(summaryOf(doc.key, states, d));
        if (!example && avail[doc.key].toolExample) note.append(` · ${tx("only the tool's example is saved there")}`);
        if (doc.hotel) note.append(` · ${tx("for a hotel")}`);
      } else {
        const link = el("a", "inline-link", doc.tool);
        link.href = new URL(`../${doc.slug}/`, window.location.href).href;
        note.append(`${tx("Nothing to print yet. Fill in the tool first:")} `, link);
      }
      row.append(input, label, note);
      return row;
    }));

    // The preview: the documents ticked, as the sheets that print.
    const ctx = { day: d, example };
    const sheets = chosen.flatMap((key) => BUILD[key](states, ctx));
    results.replaceChildren();
    results.hidden = false;
    const head = el("div", "result-head");
    head.append(el("p", "kicker", [tx("Result"), site(example)].filter(Boolean).join(" · ")));
    // The date stays on one line ("2026-10-25" would break at its hyphen on a phone).
    const [before, after = ""] = tx("The pack for {date}").split("{date}");
    const title = el("h2");
    title.append(before, el("span", "pk-nowrap", showDate(d)), after);
    head.append(title);
    const stats = el("div", "dl-stats pk-stats");
    stats.append(
      stat(tx("Documents"), int.format(chosen.length), tx("of {n} ticked", { n: int.format(DOCS.length) })),
      stat(tx("Sheets"), int.format(sheets.length), tx("one A4 page each, more for a long list")),
    );
    const pack = el("div", "pk-pack");
    if (sheets.length) pack.append(...sheets);
    else pack.append(el("p", "dl-empty pk-empty", tx("Tick at least one document to see the pack.")));
    results.append(head, stats, pack);
  };

  docsBox.addEventListener("change", (event) => {
    const input = event.target.closest("[data-pick]");
    if (!input) return;
    if (current?.example) exampleChoices = { ...exampleChoices, [input.value]: input.checked };
    else {
      state.picked[input.value] = input.checked;
      save();
    }
    render();
  });
  dateInput.addEventListener("change", render);
  printButton.addEventListener("click", () => {
    if (!current?.chosen.length) { flash(status, tx("Tick at least one document to see the pack.")); return; }
    window.print();
  });
  exampleButton.addEventListener("click", () => {
    wantExample = true;
    exampleChoices = {};
    if (state.example === false) { state.example = true; save(); }
    render();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  clearExample.addEventListener("click", () => {
    wantExample = false;
    state.example = false;
    save();
    render();
  });
  // Another tab may fill a tool meanwhile: draw again when the page comes back.
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") render(); });
  render();
})();
