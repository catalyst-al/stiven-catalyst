// Housekeeping Planner: the executive housekeeper's staffing plan for the day and the week. The workload of the day in
// minutes (or credits) from the departures, stay-overs, linen changes, VIP rooms, deep cleans and public areas; the
// attendants it needs against those scheduled, in persons, hours and labour cost; the sections, one per attendant,
// balanced by minutes on as few floors as possible; and the week from the forecast. The rooms are typed as counts or
// read from Room Status in this browser, whose attendants the sections can set. The arithmetic lives in
// window.HousekeepingPlannerMath, so tests can call it.
(() => {
  const CLEANS = ["departure", "stayover", "linen", "deep"];
  const WORK = [...CLEANS, "vip"];
  const EPS = 1e-9;
  const numeric = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true });
  const sum = (list) => list.reduce((s, v) => s + v, 0);
  // Attendants are whole people: 11.02 shifts of work need 12. The tolerance keeps 11.000000001 (a rounding of the
  // division, not work) at 11.
  const ceilUp = (value) => (value > EPS ? Math.ceil(value - EPS) : 0);

  // ---- The workload model ----
  // Paid minutes of a shift = shift length on site − unpaid break (8.5 h × 60 − 30 = 480).
  // Productive minutes = paid minutes × productive share (480 × 85 % = 408): briefing, trolley, linen runs and travel
  // between floors take the rest, as every housekeeping workload study allows for.
  const paidMinutes = (s) => Math.max(0, s.shiftHours * 60 - s.breakMinutes);
  const productiveMinutes = (s) => paidMinutes(s) * s.productiveShare;
  // In credits a shift holds the quota (20 credits); one credit is then worth productive minutes ÷ quota (408 ÷ 20 =
  // 20.4 min), which turns credits into hours and cost and public-area hours into credits.
  const credits = (s) => s.mode === "credits";
  const minutesPerCredit = (s) => (s.creditsPerAttendant > 0 ? productiveMinutes(s) / s.creditsPerAttendant : 0);
  const capacity = (s) => (credits(s) ? s.creditsPerAttendant : productiveMinutes(s));
  const toMinutes = (s, units) => (credits(s) ? units * minutesPerCredit(s) : units);
  // The value of one clean in the unit of the plan; a room type not in the table counts as a double.
  const unitOf = (s, type, clean) => {
    if (clean === "vip") return 0;
    const table = credits(s) ? s.credits : s.minutes;
    const row = table[type] || table.double || {};
    return Number(row[clean]) || 0;
  };
  const vipUnit = (s) => (credits(s) ? s.vipCredits : s.vipMinutes);
  // An item is one room (from Room Status) or one counted clean: { room, floor, type, clean, vip, flags }.
  // Its value is its clean plus the VIP set-up when it is a VIP room.
  const valueOf = (s, item) => unitOf(s, item.type, item.clean) + (item.vip ? vipUnit(s) : 0);
  const withMinutes = (s, items) => items.map((item) => ({ ...item, units: valueOf(s, item), minutes: toMinutes(s, valueOf(s, item)) }));

  // Typed counts, one row per floor and room type, become one item per clean, so typed counts and the rooms of Room
  // Status go through the same sum and the same sections. "Linen" is the part of the stay-overs with a linen change;
  // the VIP rooms of a row are its first departures, then its stay-overs.
  const whole = (value, max = 999) => { const n = Math.round(Number(value)); return Number.isFinite(n) ? Math.max(0, Math.min(max, n)) : 0; };
  const cleanRow = (row, types) => {
    const departure = whole(row?.departure), stayover = whole(row?.stayover);
    return {
      floor: String(row?.floor ?? "").trim().slice(0, 4),
      type: types.includes(row?.type) ? row.type : "double",
      departure, stayover,
      linen: Math.min(whole(row?.linen), stayover),
      vip: Math.min(whole(row?.vip), departure + stayover),
      deep: whole(row?.deep),
    };
  };
  const itemsFromRows = (rows) => {
    const items = [];
    rows.forEach((row, r) => {
      let vip = row.vip;
      const add = (clean, n) => { for (let i = 0; i < n; i++) { items.push({ room: "", floor: row.floor, type: row.type, clean, vip: clean !== "deep" && vip > 0, row: r }); if (clean !== "deep" && vip > 0) vip--; } };
      add("departure", row.departure);
      add("linen", row.linen);
      add("stayover", row.stayover - row.linen);
      add("deep", row.deep);
    });
    return items;
  };

  // Room Status (room-status.js) keeps { rooms: [{ number, floor, type }], board: { number: { status, flags, attendant,
  // note, started, at, ooo: { reason, back } } }, arrivals: { date, n }, day, ... }. Its codes, read for the morning plan:
  // - DO (due out) and CO (departed, dirty) are today's departures; VD (vacant dirty: no guest, not cleaned) needs the
  //   same full clean, so it counts with them. Room Status's own DEPARTURE codes are VD and CO; DO is the departure
  //   still to come, already counted as a departure by its attendant list.
  // - OD (occupied, service needed) is a stay-over. OCC (occupied, no service needed now) is a stay-over already
  //   serviced or a guest who checked in today: no work, unless the board is still yesterday's (its day is before
  //   today), when "Start today's board" would turn every OCC into OD: the plan counts them as stay-overs then.
  // - VC and VI are clean: no work, except the VIP set-up of a VIP arrival or a room listed for a deep clean.
  // - OOO with the reason "deepclean" is a deep clean; any other OOO, and OOS, waits for maintenance: no work.
  // A linen change is a stay-over listed in the linen rooms (the PMS prints the rooms due for a change). A deep clean
  // listed for a departure or a vacant room replaces its clean; an occupied room is not deep-cleaned. A VIP is a room
  // with the VIP flag and a clean today, or a clean room with the VIP flag and an arrival today. The arrival and early
  // flags of yesterday's board are not today's, so they are not counted then.
  const DEPARTURES = ["do", "co", "vd"];
  const roomList = (text) => new Set(String(text ?? "").split(/[\s,;]+/).map((t) => t.trim().toLowerCase()).filter(Boolean));
  const fromRoomStatus = (rs, { linenRooms = "", deepRooms = "", today = "", types = [] } = {}) => {
    const rooms = Array.isArray(rs?.rooms) ? rs.rooms.filter((r) => r && typeof r.number === "string" && r.number.trim()) : [];
    const board = rs && typeof rs.board === "object" && rs.board ? rs.board : {};
    const stale = Boolean(rs?.day) && Boolean(today) && rs.day < today;
    const linen = roomList(linenRooms), deep = roomList(deepRooms);
    const by = { do: 0, co: 0, vd: 0, od: 0, occ: 0, oooDeep: 0, listedDeep: 0, vipSetup: 0, out: 0, clean: 0, flaggedArrivals: 0 };
    const ignored = { linen: [], deep: [] };
    const items = [];
    const sorted = [...rooms].sort((a, b) => numeric(a.floor, b.floor) || numeric(a.number, b.number));
    sorted.forEach((room) => {
      const number = room.number.trim();
      const e = board[number] && typeof board[number] === "object" ? board[number] : { status: "vd" };
      const status = String(e.status || "vd");
      const flags = Array.isArray(e.flags) ? e.flags.filter((f) => !stale || (f !== "arrival" && f !== "early" && f !== "dnd")) : [];
      const key = number.toLowerCase();
      let clean = "";
      if (DEPARTURES.includes(status)) { clean = "departure"; by[status]++; }
      else if (status === "od") { clean = "stayover"; by.od++; }
      else if (status === "occ") { by.occ++; if (stale) clean = "stayover"; }
      else if (status === "ooo" && e.ooo?.reason === "deepclean") { clean = "deep"; by.oooDeep++; }
      else if (status === "ooo" || status === "oos") by.out++;
      else by.clean++;
      if (flags.includes("arrival")) by.flaggedArrivals++;
      if (deep.has(key)) {
        if (clean === "departure" || ((status === "vc" || status === "vi") && !clean)) { if (clean === "departure") by[status]--; clean = "deep"; by.listedDeep++; }
        else if (clean !== "deep") ignored.deep.push(number);
      }
      if (linen.has(key)) {
        if (clean === "stayover") clean = "linen";
        else ignored.linen.push(number);
      }
      const vip = flags.includes("vip") && clean !== "deep" && (clean !== "" || ((status === "vc" || status === "vi") && flags.includes("arrival")));
      if (!clean && vip) { clean = "vip"; by.vipSetup++; }
      if (!clean) return;
      items.push({ room: number, floor: String(room.floor || ""), type: types.includes(room.type) ? room.type : "double", clean, vip, flags, attendant: typeof e.attendant === "string" ? e.attendant : "", status });
    });
    const typed = rs?.arrivals && rs.arrivals.date === today && Number.isInteger(rs.arrivals.n) ? rs.arrivals.n : null;
    return { items, by, ignored, stale, rooms: rooms.length, arrivals: typed !== null ? typed : stale ? null : by.flaggedArrivals, arrivalsTyped: typed !== null };
  };

  // The workload: per clean the number and the value (minutes or credits); the VIP set-ups apart, and the part of
  // them that sits on departures and on stay-overs (the week uses it). Public areas are planned in hours.
  const workload = (items, s) => {
    const by = Object.fromEntries(WORK.map((c) => [c, { n: 0, units: 0, vipUnits: 0 }]));
    items.forEach((item) => {
      const clean = WORK.includes(item.clean) ? item.clean : "stayover";
      if (clean !== "vip") { by[clean].n++; by[clean].units += unitOf(s, item.type, clean); }
      if (item.vip) { by.vip.n++; by.vip.units += vipUnit(s); by[clean].vipUnits += vipUnit(s); }
    });
    const roomUnits = sum(WORK.map((c) => by[c].units));
    const publicMinutes = Math.max(0, s.publicHours * 60);
    const mpc = minutesPerCredit(s);
    const publicUnits = credits(s) ? (mpc > 0 ? publicMinutes / mpc : 0) : publicMinutes;
    const totalUnits = roomUnits + publicUnits;
    return { by, roomUnits, publicUnits, totalUnits, roomMinutes: toMinutes(s, roomUnits), publicMinutes, totalMinutes: toMinutes(s, totalUnits), capacity: capacity(s) };
  };

  // The plan of the day.
  // Attendants needed = ⌈total workload ÷ what one attendant does in a shift⌉ (minutes: ⌈4 555 ÷ 408⌉ = 12; credits:
  // ⌈credits ÷ quota⌉). Room sections = ⌈rooms' workload ÷ the same⌉; the rest of the needed attendants is the public areas.
  // Hours needed = workload ÷ productive minutes × paid hours (the unrounded need); against those scheduled:
  // persons = scheduled − needed, hours = scheduled × paid hours − hours needed.
  // Minutes per occupied room (the housekeeping productivity KPI) = cleaning minutes of the occupied rooms (departures,
  // stay-overs, linen changes and their VIP set-ups; not deep cleans or public areas) ÷ rooms occupied last night
  // (departures + stay-overs). Rooms per attendant = rooms cleaned ÷ sections. Labour cost = persons × paid hours ×
  // hourly rate; cost per occupied room = labour cost needed ÷ rooms occupied.
  const plan = (items, s, { scheduled = null, rate = null, sections = null, hotelRooms = null } = {}) => {
    const w = workload(items, s);
    const cap = w.capacity;
    const shifts = cap > 0 ? w.totalUnits / cap : 0;
    const roomShifts = cap > 0 ? w.roomUnits / cap : 0;
    const needed = ceilUp(shifts);
    const cleaned = items.filter((item) => item.clean !== "vip").length;
    const roomSections = items.length ? Math.max(1, ceilUp(roomShifts)) : 0;
    const k = items.length ? Math.min(items.length, sections > 0 ? Math.round(sections) : roomSections) : 0;
    const paidHours = paidMinutes(s) / 60;
    const hoursNeeded = shifts * paidHours;
    const departures = w.by.departure.n, stayovers = w.by.stayover.n + w.by.linen.n;
    const occupied = departures + stayovers;
    const cleaningUnits = w.by.departure.units + w.by.stayover.units + w.by.linen.units + w.by.departure.vipUnits + w.by.stayover.vipUnits + w.by.linen.vipUnits;
    const hasScheduled = Number.isFinite(scheduled) && scheduled >= 0;
    const hasRate = Number.isFinite(rate) && rate > 0;
    return {
      ...w, shifts, roomShifts, needed, roomSections, sections: k, paidHours, hoursNeeded,
      productive: productiveMinutes(s), paid: paidMinutes(s), minutesPerCredit: minutesPerCredit(s),
      departures, stayovers, linen: w.by.linen.n, vip: w.by.vip.n, deep: w.by.deep.n, occupied, cleaned,
      occupancy: hotelRooms > 0 ? occupied / hotelRooms : null,
      cleaningMinutes: toMinutes(s, cleaningUnits),
      minutesPerOccupied: occupied ? toMinutes(s, cleaningUnits) / occupied : null,
      roomsPerAttendant: k ? cleaned / k : null,
      scheduled: hasScheduled ? scheduled : null,
      diffPersons: hasScheduled ? scheduled - needed : null,
      hoursScheduled: hasScheduled ? scheduled * paidHours : null,
      diffHours: hasScheduled ? scheduled * paidHours - hoursNeeded : null,
      rate: hasRate ? rate : null,
      costNeeded: hasRate ? needed * paidHours * rate : null,
      costScheduled: hasRate && hasScheduled ? scheduled * paidHours * rate : null,
      costPerOccupied: hasRate && occupied ? (needed * paidHours * rate) / occupied : null,
    };
  };

  // ---- Sections ----
  // One section per attendant, balanced by minutes, each on as few floors as possible:
  // 1. Greedy by floor order: the rooms in floor and room order, cut where the running total of minutes is nearest to
  //    1, 2, … k times the target (total ÷ k). Each section is a run of neighbouring rooms, so it spans one or two floors.
  // 2. Rebalance the neighbours: a room at the border of two neighbouring sections moves to the lighter one while it
  //    narrows their gap (its minutes are less than the gap). The sections stay runs.
  // 3. Rebalance the extremes: while the heaviest and the lightest section are more than one room's minutes apart (the
  //    largest room), a room of the heaviest moves to the lightest, a room on a floor the lightest already has first,
  //    then the nearest floor. Rooms on its own floors may still move afterwards, as they add no floor.
  // Every move takes a room smaller than the gap it narrows, so the sum of squares falls with each one and the method
  // ends; at the end the gap between the heaviest and the lightest section is at most the largest room's minutes.
  const balance = (items, count) => {
    const list = items.map((item, i) => ({ item, i }))
      .sort((a, b) => numeric(a.item.floor, b.item.floor) || numeric(a.item.room, b.item.room) || a.i - b.i)
      .map(({ item }) => item);
    const n = list.length;
    const k = Math.max(0, Math.min(Math.round(Number(count)) || 0, n));
    if (!k) return [];
    const total = sum(list.map((item) => item.minutes));
    const target = total / k;
    const groups = [[]];
    let prefix = 0;
    list.forEach((item, i) => {
      const j = groups.length;
      const current = groups[j - 1];
      if (j < k && current.length && (n - i <= k - j || Math.abs(prefix - j * target) <= Math.abs(prefix + item.minutes - j * target))) groups.push([]);
      groups[groups.length - 1].push(item);
      prefix += item.minutes;
    });
    const minutesOf = (group) => sum(group.map((item) => item.minutes));
    const limit = n * k + 1000;
    let moved = true;
    for (let guard = 0; moved && guard < limit; guard++) {
      moved = false;
      for (let g = 0; g < k - 1; g++) {
        const a = minutesOf(groups[g]), b = minutesOf(groups[g + 1]);
        const last = groups[g].at(-1), first = groups[g + 1][0];
        if (a > b && groups[g].length > 1 && last.minutes > EPS && last.minutes < a - b - EPS) { groups[g + 1].unshift(groups[g].pop()); moved = true; }
        else if (b > a && groups[g + 1].length > 1 && first.minutes > EPS && first.minutes < b - a - EPS) { groups[g].push(groups[g + 1].shift()); moved = true; }
      }
    }
    const largest = Math.max(...list.map((item) => item.minutes));
    const floorNo = (floor) => { const v = Number(floor); return Number.isFinite(v) ? v : 0; };
    for (let guard = 0; guard < limit; guard++) {
      const sums = groups.map(minutesOf);
      const hi = sums.indexOf(Math.max(...sums)), lo = sums.indexOf(Math.min(...sums));
      const gap = sums[hi] - sums[lo];
      if (hi === lo || groups[hi].length < 2) break;
      const floorsLo = new Set(groups[lo].map((item) => item.floor));
      const distance = (item) => (floorsLo.size ? Math.min(...[...floorsLo].map((f) => Math.abs(floorNo(f) - floorNo(item.floor)))) : 0);
      const candidates = groups[hi].filter((item) => item.minutes > EPS && item.minutes < gap - EPS && (floorsLo.has(item.floor) || gap > largest + EPS));
      if (!candidates.length) break;
      candidates.sort((a, b) => Number(!floorsLo.has(a.floor)) - Number(!floorsLo.has(b.floor)) || distance(a) - distance(b) || Math.abs(gap - 2 * a.minutes) - Math.abs(gap - 2 * b.minutes));
      const pick = candidates[0];
      groups[hi].splice(groups[hi].indexOf(pick), 1);
      groups[lo].push(pick);
    }
    return groups.map((group) => {
      const rooms = [...group].sort((a, b) => numeric(a.floor, b.floor) || numeric(a.room, b.room));
      return { items: rooms, minutes: minutesOf(rooms), units: sum(rooms.map((item) => item.units ?? item.minutes)), floors: [...new Set(rooms.map((item) => item.floor))].sort(numeric) };
    });
  };
  // Counted cleans of a section, grouped for the list: floor, room type, clean and VIP, with the count and minutes.
  const groupLines = (items) => {
    const map = new Map();
    items.forEach((item) => {
      const key = `${item.floor}|${item.type}|${item.clean}|${item.vip ? 1 : 0}`;
      if (!map.has(key)) map.set(key, { floor: item.floor, type: item.type, clean: item.clean, vip: item.vip, n: 0, minutes: 0 });
      const line = map.get(key);
      line.n++;
      line.minutes += item.minutes;
    });
    return [...map.values()];
  };

  // ---- Room Status: set the attendant of the rooms, and put the previous ones back ----
  // Only the attendant of each room changes; the rest of Room Status (statuses, flags, notes, history, rooms) is the
  // object read just before, untouched. prev keeps the attendants before, set the names written, for the undo.
  const applyAttendants = (rs, assignment) => {
    const board = rs && typeof rs.board === "object" && rs.board ? rs.board : {};
    const next = { ...rs, board: { ...board } };
    const prev = {}, set = {};
    let changed = 0;
    Object.entries(assignment).forEach(([room, name]) => {
      const entry = board[room];
      if (!entry || typeof entry !== "object") return;
      prev[room] = typeof entry.attendant === "string" ? entry.attendant : "";
      set[room] = name;
      if (prev[room] !== name) changed++;
      next.board[room] = { ...entry, attendant: name };
    });
    return { state: next, prev, set, changed };
  };
  // A room whose attendant was changed again since (in Room Status) keeps that change.
  const undoAttendants = (rs, last) => {
    const board = rs && typeof rs.board === "object" && rs.board ? rs.board : {};
    const next = { ...rs, board: { ...board } };
    const restored = [], kept = [];
    Object.entries(last?.set || {}).forEach(([room, name]) => {
      const entry = board[room];
      if (!entry || typeof entry !== "object") return;
      if (entry.attendant === name) { next.board[room] = { ...entry, attendant: last.prev?.[room] ?? "" }; restored.push(room); }
      else kept.push(room);
    });
    return { state: next, restored, kept };
  };

  // ---- The week ----
  // From the forecast of each day: rooms occupied the night before (the rooms housekeeping services that morning) and
  // departures. Stay-overs = occupied − departures. The day's workload uses today's mix: the value per departure and per
  // stay-over (with their linen changes and VIP set-ups) of today's plan, today's deep cleans and VIP set-ups of
  // arrivals as the daily programme, and the public areas. Without rooms today, a double (a linen change every N
  // nights) stands in. Attendants needed = ⌈day's workload ÷ one attendant's shift⌉.
  const weekRates = (items, s) => {
    const w = workload(items, s);
    const stay = w.by.stayover.n + w.by.linen.n;
    const fallbackStay = ((Math.max(1, s.linenEvery) - 1) * unitOf(s, "double", "stayover") + unitOf(s, "double", "linen")) / Math.max(1, s.linenEvery);
    return {
      departure: w.by.departure.n ? (w.by.departure.units + w.by.departure.vipUnits) / w.by.departure.n : unitOf(s, "double", "departure"),
      stayover: stay ? (w.by.stayover.units + w.by.linen.units + w.by.stayover.vipUnits + w.by.linen.vipUnits) / stay : fallbackStay,
      daily: w.by.deep.units + w.by.vip.units - w.by.departure.vipUnits - w.by.stayover.vipUnits - w.by.linen.vipUnits,
      publicUnits: w.publicUnits,
      fromToday: Boolean(w.by.departure.n || stay),
    };
  };
  const weekPlan = (days, rates, s) => days.map((day) => {
    const occupied = whole(day.occupied, 99999), departures = Math.min(whole(day.departures, 99999), occupied);
    const has = day.occupied !== null && day.occupied !== undefined && day.occupied !== "";
    const stayovers = occupied - departures;
    const units = has ? departures * rates.departure + stayovers * rates.stayover + rates.daily + rates.publicUnits : 0;
    const needed = has && capacity(s) > 0 ? ceilUp(units / capacity(s)) : null;
    const scheduled = Number.isFinite(day.scheduled) ? day.scheduled : null;
    return { date: day.date, has, occupied, departures, stayovers, units, minutes: toMinutes(s, units), shifts: has && capacity(s) > 0 ? units / capacity(s) : null, needed, scheduled, diff: needed !== null && scheduled !== null ? scheduled - needed : null };
  });
  // Pasted forecast: "date; occupied; departures; scheduled" per line (tab, semicolon or comma). A line without a date
  // in its first cell (a header) is skipped.
  const parseWeek = (text, parseDate) => {
    const rows = [];
    let skipped = 0;
    String(text ?? "").replace(/^﻿/, "").split(/\r?\n/).forEach((line) => {
      if (!line.trim()) return;
      const cells = line.split(/[\t;]|,(?=\s*\d)/).map((c) => c.trim());
      const date = parseDate(cells[0]);
      const n = (v) => (v === undefined || v === "" || !/^\d+$/.test(v) ? null : Number(v));
      if (!date || n(cells[1]) === null) { skipped++; return; }
      rows.push({ date, occupied: n(cells[1]), departures: n(cells[2]) ?? 0, scheduled: n(cells[3]) });
    });
    return { rows, skipped };
  };

  window.HousekeepingPlannerMath = { CLEANS, WORK, DEPARTURES, ceilUp, paidMinutes, productiveMinutes, minutesPerCredit, capacity, toMinutes, unitOf, vipUnit, valueOf, withMinutes, cleanRow, itemsFromRows, roomList, fromRoomStatus, workload, plan, balance, groupLines, applyAttendants, undoAttendants, weekRates, weekPlan, parseWeek };

  const dataEl = document.getElementById("housekeeping-planner-data");
  const root = document.querySelector("[data-housekeeping-planner]");
  if (!dataEl || !root || !window.ToolKit) return;
  const { tx, num, pct, showDate, read, write, isObject, str, el, int, euro, today, addDays, parseDate, flash, undoNote, panel, stat, copy, firstVisit, downloadCsv, downloadXlsx } = window.ToolKit;
  const ChartKit = window.ChartKit;
  const Actions = window.ActionsStore;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const RS_KEY = cfg.roomStatusKey;
  const TOOL = "housekeeping-planner";
  const TYPES = cfg.roomTypes.map((t) => t.key);
  const typeName = (key) => cfg.roomTypes.find((t) => t.key === key)?.name || key;
  const cleanOf = Object.fromEntries(cfg.cleanTypes.map((c) => [c.key, c]));
  const D = cfg.defaults;

  // Numbers as a plan shows them: whole when whole, else one or two decimals.
  const nice = (value, digits = 1) => {
    if (!Number.isFinite(value)) return "–";
    const r = Math.round(value * 10 ** digits) / 10 ** digits;
    return r.toLocaleString(window.ToolKit.LOCALE, { maximumFractionDigits: digits });
  };
  const minText = (value) => tx("{n} min", { n: nice(value, 0) });
  const hoursText = (value) => tx("{n} h", { n: nice(value, 1) });
  const floorLabel = (floor) => (floor ? tx("Floor {n}", { n: floor }) : tx("No floor"));
  // A number put back into a field, with the decimal comma of the page where it has one.
  const typed = (value) => (window.ToolKit.DECIMAL_COMMA ? String(value).replace(".", ",") : String(value));
  const signed = (value, format) => (value > 0 ? `+${format(value)}` : value < 0 ? `−${format(-value)}` : format(0));

  // ---- State: one key, so Team sync can share it. ----
  const blankSettings = () => JSON.parse(JSON.stringify(D));
  const numIn = (value, min, max, fallback) => (typeof value === "number" && Number.isFinite(value) && value >= min && value <= max ? value : fallback);
  const optional = (value, max) => (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max ? value : null);
  const tidySettings = (raw) => {
    const s = blankSettings();
    const r = isObject(raw) ? raw : {};
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
  const tidy = (raw) => {
    const r = isObject(raw) ? raw : {};
    const week = {};
    if (isObject(r.week)) Object.entries(r.week).forEach(([date, day]) => {
      if (!parseDate(date) || !isObject(day)) return;
      week[date] = { occupied: optional(day.occupied, 99999), departures: optional(day.departures, 99999), scheduled: optional(day.scheduled, 999) };
    });
    const last = isObject(r.lastApply) && isObject(r.lastApply.set) && isObject(r.lastApply.prev) ? { date: parseDate(str(r.lastApply.date)) || "", at: str(r.lastApply.at).slice(0, 5), set: Object.fromEntries(Object.entries(r.lastApply.set).filter(([, v]) => typeof v === "string")), prev: Object.fromEntries(Object.entries(r.lastApply.prev).filter(([, v]) => typeof v === "string")) } : null;
    return {
      source: r.source === "rooms" ? "rooms" : "counts",
      rows: (Array.isArray(r.rows) ? r.rows : []).slice(0, 200).map((row) => cleanRow(row, TYPES)),
      hotelRooms: optional(r.hotelRooms, 9999),
      arrivals: optional(r.arrivals, 9999),
      scheduled: optional(r.scheduled, 999),
      rate: optional(r.rate, 999),
      sections: optional(r.sections, 999),
      names: (Array.isArray(r.names) ? r.names : []).map((n) => str(n).trim().slice(0, 60)).filter(Boolean).slice(0, 200),
      linenRooms: str(r.linenRooms).slice(0, 4000),
      deepRooms: str(r.deepRooms).slice(0, 2000),
      settings: tidySettings(r.settings),
      weekStart: parseDate(str(r.weekStart)) || "",
      week,
      example: r.example === true,
      lastApply: last,
    };
  };
  const state = tidy(read(KEY, null));
  const save = () => write(KEY, state);
  const S = () => state.settings;

  // ---- Elements ----
  const q = (selector) => root.querySelector(selector);
  const results = document.querySelector("[data-results]");
  const printBox = document.querySelector("[data-print]");
  const sourceInputs = [...root.querySelectorAll("input[name='hp-source']")];
  const countsBox = q("[data-counts-box]");
  const roomsBox = q("[data-rooms-box]");
  const rowsBody = q("[data-rows]");
  const rowsFoot = q("[data-rows-total]");
  const rowsStatus = q("[data-rows-status]");
  const rsNote = q("[data-rs-note]");
  const rsSummary = q("[data-rs-summary]");
  const linenInput = q("#hp-linen-rooms");
  const deepInput = q("#hp-deep-rooms");
  const emptyNote = q("[data-empty]");
  const fields = { hotelRooms: q("#hp-hotel-rooms"), arrivals: q("#hp-arrivals"), scheduled: q("#hp-scheduled"), rate: q("#hp-rate"), sections: q("#hp-sections") };
  const namesInput = q("#hp-names");
  const settingsBox = q("[data-settings]");
  const settingsCount = q("[data-settings-count]");
  const creditBoxes = [...root.querySelectorAll("[data-credits-only]")];
  const minuteBoxes = [...root.querySelectorAll("[data-minutes-only]")];
  const weekStartInput = q("#hp-week-start");
  const weekBody = q("[data-week-rows]");
  const weekPaste = q("#hp-week-paste");
  const weekStatus = q("[data-week-status]");
  const exampleBox = el("div", "dl-example-note hp-example-note");
  exampleBox.setAttribute("role", "status");
  exampleBox.hidden = true;
  results.before(exampleBox);

  // ---- Room Status in this browser ----
  const rsRead = () => { const saved = read(RS_KEY, null); return isObject(saved) ? saved : null; };
  const rsRooms = () => { const rs = rsRead(); return rs && Array.isArray(rs.rooms) ? rs.rooms.length : 0; };
  const rsNames = () => { const rs = rsRead(); return rs && Array.isArray(rs.attendants) ? rs.attendants.map((a) => str(a?.name).trim()).filter(Boolean) : []; };

  // ---- The plan of today, from what is typed or from Room Status ----
  const analysis = () => {
    const s = S();
    let items = [], rs = null;
    if (state.source === "rooms") {
      rs = fromRoomStatus(rsRead(), { linenRooms: state.linenRooms, deepRooms: state.deepRooms, today: today(), types: TYPES });
      items = rs.items;
    } else items = itemsFromRows(state.rows);
    items = withMinutes(s, items);
    const hotelRooms = state.hotelRooms ?? (rs ? rs.rooms : null);
    const p = plan(items, s, { scheduled: state.scheduled, rate: state.rate, sections: state.sections, hotelRooms });
    const sections = balance(items, p.sections);
    const arrivals = state.arrivals !== null ? state.arrivals : rs ? rs.arrivals : null;
    return { s, items, rs, p, sections, arrivals, hotelRooms, rates: weekRates(items, s) };
  };
  const names = () => (state.names.length ? state.names : state.source === "rooms" ? rsNames() : []);
  const sectionName = (i) => names()[i] || tx("Housekeeping section {n}", { n: i + 1 });
  const unitText = (value) => (credits(S()) ? tx("{n} credits", { n: nice(value, 2) }) : minText(value));

  // ---- Today: the counts table ----
  const LABELS = () => ({ floor: tx("Floor"), type: tx("Room type"), departure: tx("Departures"), stayover: tx("Stay-overs"), linen: tx("of which linen change"), vip: tx("VIP"), deep: tx("Deep cleans") });
  const cellInput = (r, name, value, label) => {
    const td = el("td", name === "floor" || name === "type" ? null : "num");
    const id = `hp-row-${r}-${name}`;
    const lab = el("label", "visually-hidden", `${label}, ${tx("row {n}", { n: r + 1 })}`);
    lab.htmlFor = id;
    let input;
    if (name === "type") {
      input = el("select");
      cfg.roomTypes.forEach((t) => { const o = el("option", null, t.name); o.value = t.key; o.selected = t.key === value; input.append(o); });
    } else {
      input = el("input");
      input.type = name === "floor" ? "text" : "number";
      if (name !== "floor") { input.min = "0"; input.step = "1"; input.inputMode = "numeric"; } else { input.autocomplete = "off"; input.maxLength = 4; input.placeholder = cfg.text.floorPlaceholder; }
      input.value = name === "floor" ? value : String(value);
    }
    input.id = id;
    input.dataset.row = String(r);
    input.dataset.name = name;
    td.append(lab, input);
    return td;
  };
  const renderRows = () => {
    const labels = LABELS();
    rowsBody.replaceChildren(...state.rows.map((row, r) => {
      const tr = el("tr");
      ["floor", "type", "departure", "stayover", "linen", "vip", "deep"].forEach((name) => tr.append(cellInput(r, name, row[name], labels[name])));
      const td = el("td");
      const remove = el("button", "button-ghost hp-small", tx("Remove"));
      remove.type = "button";
      remove.dataset.remove = String(r);
      remove.setAttribute("aria-label", `${tx("Remove")} · ${tx("row {n}", { n: r + 1 })}`);
      td.append(remove);
      tr.append(td);
      return tr;
    }));
    renderRowsTotal();
  };
  const renderRowsTotal = () => {
    const t = (name) => int.format(sum(state.rows.map((row) => row[name])));
    const tr = el("tr");
    tr.append(el("th", null, tx("Total")), el("td"), ...["departure", "stayover", "linen", "vip", "deep"].map((name) => el("td", "num", t(name))), el("td"));
    tr.firstChild.scope = "row";
    rowsFoot.replaceChildren(tr);
    rowsFoot.hidden = !state.rows.length;
  };
  rowsBody.addEventListener("input", (event) => {
    const input = event.target;
    const r = Number(input.dataset.row);
    if (!state.rows[r]) return;
    const row = { ...state.rows[r], [input.dataset.name]: input.dataset.name === "floor" || input.dataset.name === "type" ? input.value : Number(input.value) };
    state.rows[r] = cleanRow(row, TYPES);
    dropExampleFlag();
    save();
    renderRowsTotal();
    renderResults();
  });
  rowsBody.addEventListener("change", (event) => {
    // The clipped values (linen above the stay-overs, VIP above the rooms) show once the field is left.
    const input = event.target;
    const r = Number(input.dataset.row);
    if (state.rows[r] && input.dataset.name !== "floor" && input.dataset.name !== "type") input.value = String(state.rows[r][input.dataset.name]);
  });
  rowsBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const r = Number(button.dataset.remove);
    const [removed] = state.rows.splice(r, 1);
    dropExampleFlag();
    save();
    renderAll();
    undoNote(rowsStatus, tx("Row removed."), () => { state.rows.splice(r, 0, removed); save(); renderAll(); });
  });
  q("[data-add-row]").addEventListener("click", () => {
    const last = state.rows.at(-1);
    const floor = last && /^\d+$/.test(last.floor) ? String(Number(last.floor) + 1) : "";
    state.rows.push(cleanRow({ floor, type: "double" }, TYPES));
    dropExampleFlag();
    save();
    renderAll();
    rowsBody.querySelector(`#hp-row-${state.rows.length - 1}-floor`)?.focus();
  });

  // ---- Today: source, fields, names ----
  const renderToday = () => {
    const n = rsRooms();
    sourceInputs.forEach((input) => { input.checked = input.value === state.source; });
    const roomsInput = sourceInputs.find((input) => input.value === "rooms");
    if (roomsInput) roomsInput.disabled = !n && state.source !== "rooms";
    rsNote.textContent = n ? tx("{n} rooms on the board in this browser", { n: int.format(n) }) : tx("no rooms on the board in this browser yet");
    countsBox.hidden = state.source !== "counts";
    roomsBox.hidden = state.source !== "rooms";
    Object.entries(fields).forEach(([name, input]) => { if (document.activeElement !== input) input.value = state[name] === null ? "" : typed(state[name]); });
    if (document.activeElement !== namesInput) namesInput.value = state.names.join("\n");
    namesInput.placeholder = state.source === "rooms" && rsNames().length ? rsNames().join("\n") : cfg.text.namesPlaceholder;
    if (document.activeElement !== linenInput) linenInput.value = state.linenRooms;
    if (document.activeElement !== deepInput) deepInput.value = state.deepRooms;
    if (state.source === "rooms") {
      const a = analysis();
      fields.arrivals.placeholder = a.rs.arrivals === null ? "" : tx("{n} from Room Status", { n: int.format(a.rs.arrivals) });
      fields.hotelRooms.placeholder = a.rs.rooms ? tx("{n} from Room Status", { n: int.format(a.rs.rooms) }) : "";
      const by = a.rs.by;
      const lines = [tx("Read now from Room Status: {dep} departures (DO {do}, CO {co}, VD {vd}), {stay} stay-overs (OD {od}{occ}), {deep} deep cleans, {vip} VIP set-ups of arrivals.", {
        dep: int.format(by.do + by.co + by.vd), do: int.format(by.do), co: int.format(by.co), vd: int.format(by.vd),
        stay: int.format(by.od + (a.rs.stale ? by.occ : 0)), od: int.format(by.od), occ: a.rs.stale ? `, OCC ${int.format(by.occ)}` : "",
        deep: int.format(by.oooDeep + by.listedDeep), vip: int.format(by.vipSetup),
      })];
      if (a.rs.stale) lines.push(tx("The board in Room Status is still yesterday's: its occupied rooms (OCC) count as stay-overs, and yesterday's arrival flags are left out. Start today's board there for today's flags."));
      if (a.rs.ignored.linen.length) lines.push(tx("Not a stay-over, no linen change counted: {rooms}", { rooms: a.rs.ignored.linen.join(", ") }));
      if (a.rs.ignored.deep.length) lines.push(tx("Occupied or out of order, no deep clean counted: {rooms}", { rooms: a.rs.ignored.deep.join(", ") }));
      rsSummary.replaceChildren(...lines.map((line) => el("span", "hp-line", line)));
    } else {
      fields.arrivals.placeholder = "";
      fields.hotelRooms.placeholder = "";
    }
    const empty = state.source === "counts" ? !state.rows.length : !rsRooms();
    emptyNote.hidden = !empty;
  };
  sourceInputs.forEach((input) => input.addEventListener("change", () => {
    if (!input.checked) return;
    state.source = input.value === "rooms" ? "rooms" : "counts";
    dropExampleFlag();
    save();
    renderAll();
  }));
  Object.entries(fields).forEach(([name, input]) => input.addEventListener("input", () => {
    const text = input.value.trim();
    const v = window.ToolKit.parseNumber(text);
    const max = { hotelRooms: 9999, arrivals: 9999, scheduled: 999, rate: 999, sections: 999 }[name];
    state[name] = text === "" || !Number.isFinite(v) || v < 0 || v > max ? null : name === "rate" ? v : Math.round(v);
    dropExampleFlag();
    save();
    renderResults();
  }));
  namesInput.addEventListener("input", () => {
    const seen = new Set();
    state.names = namesInput.value.split(/\r?\n/).map((n) => n.trim().slice(0, 60)).filter((n) => n && !seen.has(n.toLowerCase()) && seen.add(n.toLowerCase()));
    dropExampleFlag();
    save();
    renderResults();
  });
  [[linenInput, "linenRooms"], [deepInput, "deepRooms"]].forEach(([input, name]) => input.addEventListener("input", () => {
    state[name] = input.value;
    save();
    renderToday();
    renderResults();
  }));

  // ---- Workload standards ----
  const settingInputs = [...root.querySelectorAll("[data-set]")];
  const pathGet = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  const pathSet = (obj, path, value) => { const keys = path.split("."); const last = keys.pop(); keys.reduce((o, k) => o[k], obj)[last] = value; };
  const renderSettings = () => {
    const s = S();
    settingInputs.forEach((input) => {
      if (document.activeElement === input) return;
      const v = pathGet(s, input.dataset.set);
      input.value = typed(input.dataset.set === "productiveShare" ? Math.round(v * 1000) / 10 : v);
    });
    creditBoxes.forEach((box) => { box.hidden = !credits(s); });
    minuteBoxes.forEach((box) => { box.hidden = credits(s); });
    settingsCount.textContent = credits(s)
      ? tx("credits · {q} per attendant · shift {h} h, break {b} min", { q: nice(s.creditsPerAttendant, 2), h: nice(s.shiftHours, 2), b: int.format(s.breakMinutes) })
      : tx("minutes · {p} productive · shift {h} h, break {b} min", { p: pct(s.productiveShare, 0), h: nice(s.shiftHours, 2), b: int.format(s.breakMinutes) });
  };
  settingInputs.forEach((input) => input.addEventListener(input.tagName === "SELECT" ? "change" : "input", () => {
    const path = input.dataset.set;
    let value = input.tagName === "SELECT" ? input.value : window.ToolKit.parseNumber(input.value);
    if (input.tagName !== "SELECT") {
      if (!Number.isFinite(value)) return;
      if (path === "productiveShare") value /= 100;
    }
    const next = JSON.parse(JSON.stringify(S()));
    pathSet(next, path, value);
    state.settings = tidySettings(next);
    save();
    renderSettings();
    renderResults();
  }));
  q("[data-reset-settings]").addEventListener("click", () => {
    if (!window.confirm(tx("Put every workload standard back to the defaults?"))) return;
    state.settings = blankSettings();
    save();
    renderSettings();
    renderResults();
  });

  // ---- The week: seven days from the start date ----
  const weekDates = () => { const start = state.weekStart || today(); return Array.from({ length: 7 }, (_, i) => addDays(start, i)); };
  const weekDays = () => weekDates().map((date) => ({ date, ...(state.week[date] || { occupied: null, departures: null, scheduled: null }) }));
  const dayName = window.ToolKit.dayMonth(true);
  const renderWeek = () => {
    if (document.activeElement !== weekStartInput) weekStartInput.value = state.weekStart || today();
    weekBody.replaceChildren(...weekDays().map((day, i) => {
      const tr = el("tr");
      const th = el("th", null, dayName(new Date(`${day.date}T00:00:00Z`)));
      th.scope = "row";
      tr.append(th);
      [["occupied", tx("Rooms occupied the night before")], ["departures", tx("Departures")], ["scheduled", tx("Attendants scheduled")]].forEach(([name, label]) => {
        const td = el("td", "num");
        const id = `hp-week-${i}-${name}`;
        const lab = el("label", "visually-hidden", `${label}, ${showDate(day.date)}`);
        lab.htmlFor = id;
        const input = el("input");
        Object.assign(input, { type: "number", min: "0", step: "1", inputMode: "numeric", id });
        input.value = day[name] === null ? "" : String(day[name]);
        input.dataset.date = day.date;
        input.dataset.name = name;
        td.append(lab, input);
        tr.append(td);
      });
      return tr;
    }));
  };
  weekBody.addEventListener("input", (event) => {
    const input = event.target;
    if (!input.dataset.date) return;
    const v = input.value.trim() === "" ? null : Math.round(Number(input.value));
    const day = { ...(state.week[input.dataset.date] || { occupied: null, departures: null, scheduled: null }) };
    day[input.dataset.name] = Number.isFinite(v) && v >= 0 ? v : null;
    state.week[input.dataset.date] = day;
    trimWeek();
    dropExampleFlag();
    save();
    renderResults();
  });
  // The forecast keeps the days around the week shown: 60 days back is enough for a look at last month.
  const trimWeek = () => {
    const first = addDays(today(), -60);
    state.week = Object.fromEntries(Object.entries(state.week).filter(([date, day]) => date >= first && (day.occupied !== null || day.departures !== null || day.scheduled !== null)).sort(([a], [b]) => a.localeCompare(b)).slice(-120));
  };
  weekStartInput.addEventListener("change", () => {
    state.weekStart = parseDate(weekStartInput.value) || "";
    save();
    renderWeek();
    renderResults();
  });
  q("[data-week-import]").addEventListener("click", () => {
    const parsed = parseWeek(weekPaste.value, parseDate);
    if (!parsed.rows.length) { flash(weekStatus, tx("No forecast rows found. One day per line: date, rooms occupied, departures, attendants scheduled.")); weekPaste.focus(); return; }
    parsed.rows.forEach((row) => { state.week[row.date] = { occupied: row.occupied, departures: row.departures, scheduled: row.scheduled }; });
    state.weekStart = parsed.rows.map((row) => row.date).sort()[0];
    trimWeek();
    dropExampleFlag();
    save();
    weekPaste.value = "";
    renderWeek();
    renderResults();
    flash(weekStatus, parsed.skipped ? tx("{n} days imported, {m} lines skipped.", { n: int.format(parsed.rows.length), m: int.format(parsed.skipped) }) : tx("{n} days imported.", { n: int.format(parsed.rows.length) }));
  });

  // ---- Results ----
  const cleanName = (key) => cleanOf[key]?.name || key;
  const shortName = (key) => cleanOf[key]?.short || key;
  const flagText = (item) => [item.vip ? "VIP" : "", ...(item.flags || []).filter((f) => f === "arrival" || f === "early" || f === "dnd").map((f) => ({ arrival: "ARR", early: "EA", dnd: "DND" }[f]))].filter(Boolean).join(" ");
  // The lines of the formula, the same on the page, in the summary and in the action.
  const formulaLines = (a) => {
    const { p, s } = a;
    const c = credits(s);
    const lines = [];
    lines.push(tx("Productive minutes per attendant = ({h} h × 60 − {b} min break) × {p} = {paid} × {share} = {prod} min", { h: nice(s.shiftHours, 2), b: int.format(s.breakMinutes), p: pct(s.productiveShare, 0), paid: int.format(p.paid), share: num(s.productiveShare, 2), prod: nice(p.productive, 1) }));
    if (c) lines.push(tx("One credit = {prod} ÷ {q} credits per attendant = {m} min", { prod: nice(p.productive, 1), q: nice(s.creditsPerAttendant, 2), m: nice(p.minutesPerCredit, 2) }));
    const parts = CLEANS.filter((k) => p.by[k].n).map((k) => `${cleanName(k)} ${int.format(p.by[k].n)} → ${unitText(p.by[k].units)}`);
    if (p.by.vip.n) parts.push(`${cleanName("vip")} ${int.format(p.by.vip.n)} × ${unitText(vipUnit(s))} = ${unitText(p.by.vip.units)}`);
    parts.push(`${tx("Public areas")} ${hoursText(s.publicHours)} = ${unitText(p.publicUnits)}`);
    lines.push(`${tx("Workload")}: ${parts.join(" + ")} = ${unitText(p.totalUnits)}${c ? ` (${minText(p.totalMinutes)})` : ""}`);
    lines.push(tx("Attendants needed = ⌈{w} ÷ {cap}⌉ = ⌈{x}⌉ = {n}", { w: nice(p.totalUnits, 2), cap: nice(p.capacity, 2), x: num(p.shifts, 2), n: int.format(p.needed) }));
    if (p.roomUnits > 0) lines.push(tx("Room sections = ⌈{w} ÷ {cap}⌉ = ⌈{x}⌉ = {n}; public areas are {y} of a shift", { w: nice(p.roomUnits, 2), cap: nice(p.capacity, 2), x: num(p.roomShifts, 2), n: int.format(p.roomSections), y: num(p.publicUnits / (p.capacity || 1), 2) }));
    if (p.scheduled !== null) lines.push(tx("Scheduled {s} × {h} h = {hs} h against {hn} h needed ({x} × {h} h): {d}", { s: int.format(p.scheduled), h: nice(p.paidHours, 2), hs: nice(p.hoursScheduled, 1), hn: nice(p.hoursNeeded, 1), x: num(p.shifts, 2), d: signed(p.diffHours, (v) => hoursText(v)) }));
    return lines;
  };
  const verdict = (p) => (p.scheduled === null ? "" : p.diffPersons < 0 ? tx("{n} short", { n: int.format(-p.diffPersons) }) : p.diffPersons > 0 ? tx("{n} more than needed", { n: int.format(p.diffPersons) }) : tx("exactly staffed"));
  const shortAction = (a) => {
    const p = a.p;
    return {
      title: tx("Housekeeping short on {date}: {n} attendants needed, {m} scheduled", { date: showDate(today()), n: int.format(p.needed), m: int.format(p.scheduled) }),
      detail: [`${tx("Workload")}: ${minText(p.totalMinutes)} · ${tx("hours short")}: ${hoursText(-p.diffHours)}`, ...formulaLines(a), `${cfg.text.tool} · ${showDate(today())}`].join("\n"),
      owner: cfg.text.actionOwner, due: today(), example: state.example === true, source: TOOL, check: cfg.text.actionCheck, area: cfg.text.actionArea, priority: "High",
    };
  };

  const summaryText = (a) => {
    const { p } = a;
    const lines = [`${cfg.text.tool} · ${showDate(today())}`, ""];
    lines.push(`${tx("Attendants needed")}: ${int.format(p.needed)}${p.scheduled !== null ? ` · ${tx("scheduled")}: ${int.format(p.scheduled)} (${verdict(p)}, ${signed(p.diffHours, hoursText)})` : ""}`);
    lines.push(`${tx("Workload")}: ${minText(p.totalMinutes)} · ${tx("{a} departures, {b} stay-overs", { a: int.format(p.departures), b: int.format(p.stayovers) })} (${tx("{n} with linen change", { n: int.format(p.linen) })}) · VIP ${int.format(p.vip)} · ${tx("Deep cleans")} ${int.format(p.deep)}${a.arrivals !== null ? ` · ${tx("Arrivals")} ${int.format(a.arrivals)}` : ""}`);
    lines.push(`${tx("Minutes per occupied room")}: ${p.minutesPerOccupied === null ? "–" : nice(p.minutesPerOccupied, 1)} · ${tx("Rooms per attendant")}: ${p.roomsPerAttendant === null ? "–" : nice(p.roomsPerAttendant, 1)}${p.costNeeded !== null ? ` · ${tx("Labour cost")}: ${euro.format(p.costNeeded)} (${euro.format(p.costPerOccupied || 0)} ${tx("per occupied room")})` : ""}`);
    lines.push("", ...formulaLines(a).map((line) => `- ${line}`));
    if (a.sections.length) {
      lines.push("", `${tx("Sections")}:`);
      a.sections.forEach((sec, i) => lines.push(`- ${sectionName(i)}: ${minText(sec.minutes)} · ${sec.floors.map(floorLabel).join(", ")} · ${sectionRoomsText(sec)}`));
    }
    const week = weekPlan(weekDays(), a.rates, a.s).filter((d) => d.has);
    if (week.length) {
      lines.push("", `${tx("The week")}:`);
      week.forEach((d) => lines.push(`- ${showDate(d.date)}: ${tx("{n} needed", { n: int.format(d.needed) })}${d.scheduled !== null ? ` · ${tx("{n} scheduled", { n: int.format(d.scheduled) })} (${signed(d.diff, (v) => int.format(v))})` : ""}`));
    }
    return lines.join("\n");
  };
  const sectionRoomsText = (sec) => (state.source === "rooms"
    ? sec.items.map((item) => `${item.room} ${shortName(item.clean)}${item.vip && item.clean !== "vip" ? " VIP" : ""}`).join(", ")
    : groupLines(sec.items).map((line) => `${floorLabel(line.floor)} ${typeName(line.type)} ${int.format(line.n)} × ${shortName(line.clean)}${line.vip ? " VIP" : ""}`).join(", "));

  const COLORS = ChartKit ? { departure: ChartKit.C.blue, stayover: ChartKit.C.soft, linen: "#a78bfa", deep: ChartKit.C.warn, vip: "#f472b6" } : {};
  const sectionsChart = (a) => {
    const keys = WORK.filter((k) => a.p.by[k].n);
    const groups = a.sections.map((sec, i) => ({
      label: names()[i] || String(i + 1),
      parts: keys.map((k) => ({ key: shortName(k), value: k === "vip" ? sum(sec.items.filter((it) => it.vip).map(() => toMinutes(a.s, vipUnit(a.s)))) : sum(sec.items.filter((it) => it.clean === k).map((it) => toMinutes(a.s, unitOf(a.s, it.type, k)))) })),
    }));
    return ChartKit.figure(ChartKit.stacked(groups, { title: tx("Minutes per section"), unit: tx("min"), keys: keys.map(shortName), colors: Object.fromEntries(keys.map((k) => [shortName(k), COLORS[k]])), line: { value: a.p.productive, label: tx("Productive minutes") }, format: (v) => nice(v, 0) }), { fileName: "housekeeping-sections" });
  };
  const sectionCard = (a, sec, i) => {
    const card = el("article", "hp-section");
    const load = a.p.productive ? sec.minutes / a.p.productive : 0;
    const head = el("div", "hp-section-head");
    head.append(el("h4", null, sectionName(i)), el("span", `hp-load${load > 1.0001 ? " is-over" : ""}`, `${minText(sec.minutes)} · ${pct(load, 0)} ${tx("of a shift")}${load > 1.0001 ? ` · ${tx("over a shift")}` : ""}`));
    card.append(head);
    const cleaned = sec.items.filter((it) => it.clean !== "vip");
    const dep = cleaned.filter((it) => it.clean === "departure").length;
    card.append(el("p", "hp-section-meta", [sec.floors.map(floorLabel).join(", "), tx("{n} rooms", { n: int.format(cleaned.length) }), tx("{a} departures, {b} stay-overs", { a: int.format(dep), b: int.format(cleaned.filter((it) => it.clean === "stayover" || it.clean === "linen").length) })].join(" · ")));
    const list = el("ul", "hp-rooms");
    if (state.source === "rooms") {
      sec.items.forEach((item) => {
        const li = el("li", `hp-room is-${item.clean}`);
        li.append(el("strong", null, item.room), ` ${shortName(item.clean)} · ${nice(item.minutes, 0)}`);
        const flags = flagText(item);
        if (flags) li.append(el("span", "hp-flags", ` ${flags}`));
        list.append(li);
      });
    } else {
      groupLines(sec.items).forEach((line) => {
        const li = el("li", `hp-room is-${line.clean}`);
        li.append(el("strong", null, `${int.format(line.n)} ×`), ` ${floorLabel(line.floor)} · ${typeName(line.type)} · ${shortName(line.clean)}${line.vip ? " · VIP" : ""} · ${minText(line.minutes)}`);
        list.append(li);
      });
    }
    card.append(list);
    return card;
  };
  const sourceRows = (a) => {
    const p = a.p;
    if (state.source === "rooms") {
      const by = a.rs.by;
      return [
        [tx("Departures"), int.format(p.departures), tx("Room Status: DO {do}, CO {co}, VD {vd}{deep}", { do: int.format(by.do), co: int.format(by.co), vd: int.format(by.vd), deep: by.listedDeep ? ` · ${tx("{n} listed for a deep clean instead", { n: int.format(by.listedDeep) })}` : "" })],
        [tx("Stay-overs"), int.format(p.stayovers), a.rs.stale ? tx("Room Status: OD {od}, OCC {occ} (yesterday's board)", { od: int.format(by.od), occ: int.format(by.occ) }) : tx("Room Status: OD {od}", { od: int.format(by.od) })],
        [tx("of which linen change"), int.format(p.linen), tx("rooms listed here")],
        [tx("VIP"), int.format(p.vip), tx("Room Status: VIP flag on a room with a clean today, or on a clean room with an arrival")],
        [tx("Deep cleans"), int.format(p.deep), tx("Room Status: OOO for a deep clean {a}, listed here {b}", { a: int.format(by.oooDeep), b: int.format(by.listedDeep) })],
        [tx("Arrivals"), a.arrivals === null ? "–" : int.format(a.arrivals), state.arrivals !== null ? tx("typed") : a.rs.arrivalsTyped ? tx("Room Status: typed for today") : a.rs.stale ? tx("yesterday's board: type them") : tx("Room Status: rooms flagged arrival today")],
        [tx("No work today"), int.format(by.clean + by.out + (a.rs.stale ? 0 : by.occ)), tx("VC, VI, OCC already serviced, OOO and OOS")],
      ];
    }
    return [
      [tx("Departures"), int.format(p.departures), tx("typed")],
      [tx("Stay-overs"), int.format(p.stayovers), tx("typed")],
      [tx("of which linen change"), int.format(p.linen), tx("typed")],
      [tx("VIP"), int.format(p.vip), tx("typed")],
      [tx("Deep cleans"), int.format(p.deep), tx("typed")],
      [tx("Arrivals"), a.arrivals === null ? "–" : int.format(a.arrivals), a.arrivals === null ? tx("not typed") : tx("typed")],
    ];
  };
  const table = (head, rows, className = "") => {
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const t = el("table", `dl-table ${className}`.trim());
    const thead = el("thead");
    const tr = el("tr");
    head.forEach((text, i) => { const th = el("th", i ? "num" : null, text); th.scope = "col"; tr.append(th); });
    thead.append(tr);
    const tbody = el("tbody");
    rows.forEach((row) => {
      const r = el("tr");
      if (row.className) r.className = row.className;
      (row.cells || row).forEach((cell, i) => { const td = el(i ? "td" : "th", i ? "num" : null, cell); if (!i) td.scope = "row"; r.append(td); });
      tbody.append(r);
    });
    t.append(thead, tbody);
    wrap.append(t);
    return wrap;
  };
  const weekBlock = (a) => {
    const box = el("article", "result-card hp-week-result");
    box.append(el("p", "result-label", tx("The week")));
    const days = weekPlan(weekDays(), a.rates, a.s).map((d, i) => (d.scheduled === null && i === 0 && d.date === today() && state.scheduled !== null ? { ...d, scheduled: state.scheduled, diff: d.needed === null ? null : state.scheduled - d.needed } : d));
    const known = days.filter((d) => d.has);
    const r = a.rates;
    box.append(el("p", "form-note", tx("Workload of a day = departures × {d} + stay-overs × {s} + {x} (deep cleans and VIP set-ups) + {pub} (public areas), in {unit}; stay-overs = rooms occupied the night before − departures.", { d: nice(r.departure, 2), s: nice(r.stayover, 2), x: nice(r.daily, 2), pub: nice(r.publicUnits, 2), unit: credits(a.s) ? tx("credits") : tx("minutes") }) + (r.fromToday ? ` ${tx("The rates are today's mix of rooms.")}` : ` ${tx("No rooms today: a double stands in.")}`)));
    if (!known.length) {
      box.append(el("p", "form-note", tx("Type the forecast in the week table above, or paste it: date, rooms occupied the night before, departures, attendants scheduled.")));
      return box;
    }
    if (ChartKit) {
      const series = [
        { label: tx("Needed"), color: ChartKit.C.blue, points: days.map((d) => ({ x: dayName(new Date(`${d.date}T00:00:00Z`)), y: d.needed, state: d.diff !== null && d.diff < 0 ? "danger" : undefined, tip: d.has ? `${showDate(d.date)} · ${tx("{n} needed", { n: int.format(d.needed) })}${d.scheduled !== null ? ` · ${tx("{n} scheduled", { n: int.format(d.scheduled) })}` : ""} · ${minText(d.minutes)}` : showDate(d.date) })) },
        { label: tx("Scheduled"), color: ChartKit.C.muted, points: days.map((d) => ({ x: dayName(new Date(`${d.date}T00:00:00Z`)), y: d.scheduled === null ? NaN : d.scheduled })) },
      ];
      box.append(ChartKit.figure(ChartKit.line(series, { title: tx("Attendants needed and scheduled by day"), yMin: 0, format: (v) => nice(v, 0) }), { fileName: "housekeeping-week", caption: tx("A red point is a day with fewer attendants scheduled than needed.") }));
    }
    box.append(table([tx("Date"), tx("Rooms occupied"), tx("Departures"), tx("Stay-overs"), tx("Workload"), tx("Needed"), tx("Scheduled"), tx("Difference")], days.map((d) => ({
      className: d.diff !== null && d.diff < 0 ? "is-short" : "",
      cells: [showDate(d.date), d.has ? int.format(d.occupied) : "–", d.has ? int.format(d.departures) : "–", d.has ? int.format(d.stayovers) : "–", d.has ? minText(d.minutes) : "–", d.needed === null ? "–" : int.format(d.needed), d.scheduled === null ? "–" : int.format(d.scheduled), d.diff === null ? "–" : `${signed(d.diff, (v) => int.format(v))}${d.diff < 0 ? ` ${tx("short")}` : ""}`],
    })), "hp-week-table"));
    const actions = el("div", "tool-actions");
    const csv = el("button", "button-secondary", tx("Download CSV"));
    csv.type = "button";
    csv.addEventListener("click", () => downloadCsv(cfg.text.csvWeek, weekRows(a, days)));
    const xlsx = el("button", "button-secondary", tx("Download Excel"));
    xlsx.type = "button";
    xlsx.addEventListener("click", () => downloadXlsx(cfg.text.csvWeek, weekRows(a, days)));
    actions.append(csv, xlsx);
    const short = days.filter((d) => d.diff !== null && d.diff < 0);
    if (Actions && short.length) {
      const send = el("button", "button-secondary", tx("Add the {n} short days to actions", { n: int.format(short.length) }));
      send.type = "button";
      send.addEventListener("click", () => {
        const open = Actions.list().filter((x) => Actions.isOpen(x) && x.source === TOOL).map((x) => x.title);
        let n = 0;
        short.forEach((d) => {
          const title = tx("Housekeeping short on {date}: {n} attendants needed, {m} scheduled", { date: showDate(d.date), n: int.format(d.needed), m: int.format(d.scheduled) });
          if (open.includes(title)) return;
          if (Actions.add({ title, detail: `${tx("Workload")}: ${minText(d.minutes)} · ${tx("{a} departures, {b} stay-overs", { a: int.format(d.departures), b: int.format(d.stayovers) })} · ${cfg.text.tool}`, owner: cfg.text.actionOwner, due: addDays(d.date, -1) < today() ? today() : addDays(d.date, -1), example: state.example === true, source: TOOL, check: cfg.text.actionCheck, area: cfg.text.actionArea, priority: "High" })) n++;
        });
        trackerNote(weekNote, n ? tx("Added {n} actions.", { n: int.format(n) }) : tx("These days are already in the Action Tracker."));
      });
      actions.append(send);
    }
    const weekNote = el("p", "form-note", "");
    weekNote.setAttribute("aria-live", "polite");
    box.append(actions, weekNote);
    return box;
  };
  const trackerNote = (node, message) => {
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = Actions.trackerUrl().href;
    node.replaceChildren(`${message} `, link);
  };

  const applyNote = el("p", "form-note hp-apply-note");
  applyNote.setAttribute("aria-live", "polite");
  const renderApplyNote = () => {
    applyNote.replaceChildren();
    const last = state.lastApply;
    if (!last || last.date !== today()) return;
    const button = el("button", "dl-undo", tx("Undo"));
    button.type = "button";
    button.addEventListener("click", undoApply);
    applyNote.append(tx("Sections applied to Room Status at {time}: the attendant of {n} rooms.", { time: last.at, n: int.format(Object.keys(last.set).length) }), " ", button);
  };
  const nowTime = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
  const applySections = () => {
    const a = analysis();
    const assignment = {};
    a.sections.forEach((sec, i) => sec.items.forEach((item) => { if (item.room) assignment[item.room] = sectionName(i); }));
    const n = Object.keys(assignment).length;
    if (!n) return;
    if (!window.confirm(tx("Set the attendant of {n} rooms in Room Status to the sections of this plan? Only the attendant changes: status, flags, notes and history stay as they are.", { n: int.format(n) }))) return;
    // Read again right before writing: the board may have changed while the plan was open.
    const fresh = rsRead();
    if (!fresh) { flash(applyNote, tx("Room Status has no rooms in this browser.")); return; }
    const r = applyAttendants(fresh, assignment);
    if (!write(RS_KEY, r.state)) return;
    state.lastApply = { date: today(), at: nowTime(), prev: r.prev, set: r.set };
    save();
    renderApplyNote();
  };
  const undoApply = () => {
    const last = state.lastApply;
    const fresh = rsRead();
    if (!last || !fresh) return;
    const r = undoAttendants(fresh, last);
    if (!write(RS_KEY, r.state)) return;
    state.lastApply = null;
    save();
    renderApplyNote();
    flash(applyNote, r.kept.length
      ? tx("Previous attendants restored in {n} rooms; {m} rooms changed in Room Status since keep their attendant.", { n: int.format(r.restored.length), m: int.format(r.kept.length) })
      : tx("Previous attendants restored in {n} rooms.", { n: int.format(r.restored.length) }));
  };

  const renderResults = () => {
    results.replaceChildren();
    exampleBox.hidden = !state.example;
    const a = analysis();
    const { p } = a;
    renderPrintable(a);
    const hasWeek = weekDays().some((d) => d.occupied !== null);
    if (!a.items.length && !hasWeek) { results.hidden = true; return; }
    results.hidden = false;
    // Only a forecast so far: the week alone.
    if (!a.items.length) { results.append(weekBlock(a)); return; }
    const head = el("div", "result-head hp-head");
    head.append(el("p", "kicker", `${cfg.text.tool} · ${showDate(today())}`));
    const h2 = el("h2");
    h2.append(tx("{n} attendants needed", { n: int.format(p.needed) }));
    if (p.scheduled !== null) h2.append(el("span", p.diffPersons < 0 ? "hp-short" : null, ` · ${tx("{n} scheduled", { n: int.format(p.scheduled) })}: ${verdict(p)}`));
    head.append(h2, el("p", "hp-meta", [tx("{n} workload", { n: minText(p.totalMinutes) }), tx("{n} rooms occupied last night", { n: int.format(p.occupied) }) + (p.occupancy !== null ? ` (${pct(p.occupancy, 1)})` : ""), a.arrivals !== null ? tx("{n} arrivals", { n: int.format(a.arrivals) }) : ""].filter(Boolean).join(" · ")));

    const stats = el("div", "dl-stats hp-stats");
    stats.append(stat(tx("Workload"), minText(p.totalMinutes), credits(a.s) ? tx("{c} credits · rooms {r}, public areas {u}", { c: nice(p.totalUnits, 2), r: nice(p.roomUnits, 2), u: nice(p.publicUnits, 2) }) : tx("rooms {r} + public areas {u}", { r: minText(p.roomMinutes), u: minText(p.publicMinutes) })));
    stats.append(stat(tx("Attendants needed"), int.format(p.needed), tx("⌈{w} ÷ {cap}⌉ · {n} room sections", { w: nice(p.totalUnits, 2), cap: nice(p.capacity, 2), n: int.format(p.roomSections) })));
    stats.append(stat(tx("Scheduled"), p.scheduled === null ? "–" : int.format(p.scheduled), p.scheduled === null ? tx("type the attendants scheduled") : `${verdict(p)} · ${signed(p.diffHours, hoursText)}`));
    stats.append(stat(tx("Labour cost"), p.costNeeded === null ? "–" : euro.format(p.costNeeded), p.costNeeded === null ? tx("type an hourly rate") : tx("{c} per occupied room · {n} × {h} h × {r}", { c: euro.format(p.costPerOccupied || 0), n: int.format(p.needed), h: nice(p.paidHours, 2), r: euro.format(p.rate) })));
    stats.append(stat(tx("Minutes per occupied room"), p.minutesPerOccupied === null ? "–" : nice(p.minutesPerOccupied, 1), tx("{m} cleaning ÷ {n} rooms occupied", { m: minText(p.cleaningMinutes), n: int.format(p.occupied) })));
    stats.append(stat(tx("Rooms per attendant"), p.roomsPerAttendant === null ? "–" : nice(p.roomsPerAttendant, 1), tx("{a} rooms, {b} sections", { a: int.format(p.cleaned), b: int.format(p.sections) })));

    const focus = el("article", "result-card hp-formula");
    focus.append(el("p", "result-label", tx("How the number is worked out")));
    const ol = el("ol", "hp-formula-lines");
    formulaLines(a).forEach((line) => ol.append(el("li", null, line)));
    focus.append(ol);
    if (p.diffPersons !== null && p.diffPersons < 0) focus.append(el("p", "dl-warning", tx("Short by {n} attendants ({h}). Decide it now, not at 14:00: overtime or an extra shift, an agency attendant, stay-overs on request only where the guest chose it, deep cleans moved to a quieter day.", { n: int.format(-p.diffPersons), h: hoursText(-p.diffHours) })));
    if (p.sections && state.sections !== null && p.sections < p.roomSections) focus.append(el("p", "dl-warning", tx("{k} sections for {n} attendants' worth of rooms: some sections are longer than a shift.", { k: int.format(p.sections), n: int.format(p.roomSections) })));

    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy summary"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(summaryText(analysis()), copyButton));
    const printSheets = el("button", "button-secondary", tx("Print section sheets"));
    printSheets.type = "button";
    printSheets.disabled = !a.sections.length;
    printSheets.addEventListener("click", () => printOnly());
    const printPage = el("button", "button-secondary", tx("Print or save as PDF"));
    printPage.type = "button";
    printPage.addEventListener("click", () => window.print());
    actions.append(copyButton, printSheets, printPage);
    if (Actions && p.diffPersons !== null && p.diffPersons < 0) actions.append(Actions.linkButton(tx("Add to actions"), () => shortAction(analysis())));

    results.append(head, stats, focus, actions);

    if (a.sections.length) {
      const box = el("article", "result-card hp-sections-result");
      box.append(el("p", "result-label", tx("Sections")));
      box.append(el("p", "form-note", tx("One section per attendant, balanced by minutes, not by rooms, on as few floors as possible. Heaviest and lightest are {d} apart.", { d: minText(Math.max(...a.sections.map((x) => x.minutes)) - Math.min(...a.sections.map((x) => x.minutes))) }) + (state.source === "counts" ? ` ${tx("Typed as counts: each section lists its cleans by floor; the attendant writes the room numbers on the sheet.")}` : "")));
      if (ChartKit) box.append(sectionsChart(a));
      const grid = el("div", "hp-section-grid");
      a.sections.forEach((sec, i) => grid.append(sectionCard(a, sec, i)));
      box.append(grid);
      const sActions = el("div", "tool-actions");
      const csv = el("button", "button-secondary", tx("Download CSV"));
      csv.type = "button";
      csv.addEventListener("click", () => downloadCsv(cfg.text.csvSections, sectionRows(analysis())));
      const xlsx = el("button", "button-secondary", tx("Download Excel"));
      xlsx.type = "button";
      xlsx.addEventListener("click", () => downloadXlsx(cfg.text.csvSections, sectionRows(analysis())));
      sActions.append(csv, xlsx);
      if (state.source === "rooms") {
        const apply = el("button", "button-secondary", tx("Apply sections to Room Status"));
        apply.type = "button";
        apply.addEventListener("click", applySections);
        sActions.append(apply);
        const link = el("a", "button-ghost", tx("Open Room Status"));
        link.href = document.querySelector("a[data-room-status]")?.href || new URL("../room-status/", window.location.href).href;
        sActions.append(link);
      }
      box.append(sActions);
      renderApplyNote();
      box.append(applyNote);
      results.append(box);
    }
    results.append(weekBlock(a));

    const details = el("details", "dl-details");
    details.open = window.matchMedia ? window.matchMedia("(min-width: 761px)").matches : true;
    const summary = el("summary", "dl-details-summary");
    summary.append(el("strong", null, tx("All details")), el("span", null, [tx("Where the numbers come from"), tx("Workload standards")].join(" · ")));
    const grid = el("div", "dl-result-grid");
    const src = panel(tx("Where the numbers come from"), state.source === "rooms" ? tx("Read from Room Status in this browser just now, and the lists typed here.") : tx("The counts typed in the table."));
    src.append(table([tx("Number"), tx("Count"), tx("Source")], sourceRows(a), "hp-source-table"));
    const std = panel(tx("Workload standards"), cfg.source);
    std.append(table([tx("Room type"), ...CLEANS.map(shortName)], cfg.roomTypes.map((t) => [t.name, ...CLEANS.map((k) => (credits(a.s) ? nice(unitOf(a.s, t.key, k), 2) : nice(unitOf(a.s, t.key, k), 0)))]), "hp-standards-table"));
    std.append(el("p", "form-note", [tx("VIP set-up: {v}", { v: unitText(vipUnit(a.s)) }), tx("Public areas: {h}", { h: hoursText(a.s.publicHours) }), credits(a.s) ? tx("{q} credits per attendant", { q: nice(a.s.creditsPerAttendant, 2) }) : tx("in minutes per clean")].join(" · ")));
    grid.append(src, std);
    details.append(summary, grid);
    results.append(details);
  };

  // ---- Exports ----
  const sectionRows = (a) => {
    const c = credits(a.s);
    const rows = [[tx("Section"), tx("Room attendant"), tx("Floor"), tx("Room"), tx("Room type"), tx("Clean"), "VIP", tx("Minutes"), ...(c ? [tx("Credits")] : [])]];
    a.sections.forEach((sec, i) => sec.items.forEach((item) => rows.push([String(i + 1), names()[i] || "", item.floor, item.room, typeName(item.type), cleanName(item.clean), item.vip ? "VIP" : "", Math.round(item.minutes * 10) / 10, ...(c ? [item.units] : [])])));
    return rows;
  };
  const weekRows = (a, days) => [[tx("Date"), tx("Rooms occupied the night before"), tx("Departures"), tx("Stay-overs"), credits(a.s) ? tx("Credits") : tx("Minutes"), tx("Attendants needed"), tx("Attendants scheduled"), tx("Difference")],
    ...days.filter((d) => d.has).map((d) => [d.date, d.occupied, d.departures, d.stayovers, Math.round(d.units * 10) / 10, d.needed, d.scheduled ?? "", d.diff ?? ""])];

  // ---- Printing: one A4 sheet per attendant; the rest of the page is hidden meanwhile. ----
  const renderPrintable = (a) => {
    printBox.replaceChildren(...a.sections.map((sec, i) => {
      const page = el("section", "hp-print-person");
      page.append(el("p", "kicker", `${cfg.text.tool} · ${showDate(today())}`), el("h2", null, sectionName(i)));
      const cleaned = sec.items.filter((it) => it.clean !== "vip").length;
      page.append(el("p", "hp-print-meta", [sec.floors.map(floorLabel).join(", "), tx("{n} rooms", { n: int.format(cleaned) }), tx("{m} planned of {p} productive", { m: minText(sec.minutes), p: minText(a.p.productive) })].join(" · ")));
      const t = el("table", "hp-print-table");
      const htr = el("tr");
      [tx("Floor"), tx("Room"), tx("Room type"), tx("Clean"), tx("Flags"), tx("Minutes"), tx("Start"), tx("Finish"), tx("Remarks")].forEach((text) => { const th = el("th", null, text); th.scope = "col"; htr.append(th); });
      const thead = el("thead");
      thead.append(htr);
      const tbody = el("tbody");
      sec.items.forEach((item) => {
        const tr = el("tr");
        tr.append(el("td", null, item.floor), el("td", null, item.room), el("td", null, typeName(item.type)), el("td", null, cleanName(item.clean)), el("td", null, flagText(item)), el("td", null, nice(item.minutes, 0)), el("td"), el("td"), el("td"));
        tbody.append(tr);
      });
      const tfoot = el("tfoot");
      const ftr = el("tr");
      const label = el("th", null, tx("Total"));
      label.colSpan = 5;
      label.scope = "row";
      ftr.append(label, el("td", null, nice(sec.minutes, 0)), el("td"), el("td"), el("td"));
      tfoot.append(ftr);
      t.append(thead, tbody, tfoot);
      page.append(t);
      page.append(el("p", "hp-print-legend", tx("VIP = VIP set-up · ARR = arrival today · EA = early arrival · DND = do not disturb. Write the time in and out of each room; the supervisor signs the sheet at the end of the shift.")));
      return page;
    }));
  };
  const printOnly = () => {
    printBox.hidden = false;
    document.documentElement.classList.add("hp-printing");
    const done = () => {
      document.documentElement.classList.remove("hp-printing");
      printBox.hidden = true;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint (some phones) get the page back a moment later.
    setTimeout(done, 2000);
  };

  // ---- The example: a 180-room hotel at 82 % (148 rooms occupied last night), and its week. ----
  const exampleText = el("span");
  const clearExampleButton = el("button", "button-ghost", tx("Clear the example"));
  clearExampleButton.type = "button";
  exampleBox.append(el("strong", null, tx("Example")), " ", exampleText, " ", clearExampleButton);
  const loadExample = () => {
    const ex = cfg.example;
    const week = {};
    ex.week.forEach((d) => { week[addDays(today(), d.day)] = { occupied: d.occupied, departures: d.departures, scheduled: d.scheduled }; });
    Object.assign(state, { source: "counts", rows: ex.rows.map((row) => cleanRow(row, TYPES)), hotelRooms: ex.hotelRooms, arrivals: ex.arrivals, scheduled: ex.scheduled, rate: ex.rate, sections: null, names: [...ex.names], linenRooms: "", deepRooms: "", settings: blankSettings(), weekStart: today(), week, example: true, lastApply: null });
  };
  const dropExample = () => Object.assign(state, { rows: [], hotelRooms: null, arrivals: null, scheduled: null, rate: null, sections: null, names: [], weekStart: "", week: {}, example: false });
  // Once the visitor changes anything, the plan is theirs: the note goes, the numbers stay.
  const dropExampleFlag = () => { if (state.example) { state.example = false; exampleBox.hidden = true; } };
  clearExampleButton.addEventListener("click", () => {
    dropExample();
    write(KEY, state);
    renderAll();
  });
  q("[data-example]").addEventListener("click", () => {
    loadExample();
    renderAll();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  q("[data-clear]").addEventListener("click", () => {
    if (!window.confirm(tx("Clear today's counts, the names and the week in this browser? The workload standards stay."))) return;
    dropExample();
    state.linenRooms = "";
    state.deepRooms = "";
    write(KEY, state);
    renderAll();
  });

  const renderAll = () => {
    exampleText.textContent = tx("A 180-room hotel at 82 % occupancy (148 rooms occupied last night): 52 departures, 96 stay-overs, 58 arrivals, 10 attendants scheduled, and the forecast of the week. Type your own counts and the plan is yours.");
    renderToday();
    renderRows();
    renderSettings();
    renderWeek();
    renderResults();
  };

  // Room Status changed in another tab (or by Team sync): the rooms are read again.
  window.addEventListener("storage", (event) => {
    if (event.key === RS_KEY && state.source === "rooms") { renderToday(); renderResults(); }
    if (event.key === KEY) { Object.assign(state, tidy(read(KEY, null))); renderAll(); }
  });

  // A first visit opens on the example; nothing is written until the visitor acts. An example saved on another day
  // moves to today, so its week starts today.
  if (firstVisit(KEY)) loadExample();
  else if (state.example && state.weekStart !== today()) loadExample();
  renderAll();
})();
