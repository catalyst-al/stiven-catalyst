// Room Status: the live room board of one hotel, for housekeeping and the front office on the same screen (with Team
// sync, on every device of the team). Each room has one status, in the housekeeping codes every PMS uses (VD, VC, VI,
// OCC, OD, DO, CO, OOO, OOS), plus flags (DND, VIP, early arrival, arrival today), an attendant and a note. Every change
// is kept with its time in a history per day (30 days). From the board come the rooms ready for the arrivals, the queue
// of the attendants and the out-of-order share; from the history the turnaround times of the day. The arithmetic lives
// in window.RoomStatusMath, so tests can call it.
(() => {
  const STATUSES = ["vd", "vc", "vi", "occ", "od", "do", "co", "ooo", "oos"];
  const FLAGS = ["dnd", "vip", "early", "arrival"];
  // Rooms that need an attendant: vacant dirty, departed and stay-overs that need their service.
  const DIRTY = ["vd", "co", "od"];
  const DEPARTURE = ["vd", "co"];
  const VACANT = ["vd", "vc", "vi"];
  const CLEANED = ["vc", "vi", "occ"];
  const OUT = ["ooo", "oos"];
  const MAX_ROOMS = 3000;

  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return iso;
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const isTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value));
  const minutes = (time) => (isTime(time) ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) : NaN);
  const numeric = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true });

  // A room on the board. flags is a list in the order of FLAGS; at is "YYYY-MM-DD HH:MM" of the last status change;
  // started is when the attendant went in (cleaning in progress); ooo holds the reason and the date it is back.
  const blankEntry = (status = "vd") => ({ status, at: "", flags: [], attendant: "", note: "", started: "", ooo: null });
  const withFlag = (flags, flag, on) => FLAGS.filter((f) => (f === flag ? on : flags.includes(f)));

  // One change to one room: { status } | { flag, on } | { start: true/false } | { attendant } | { note } | { ooo: { reason, back } }.
  // Returns the room as it is after it and the events for the history ({ t, room, kind, from, to, who, flag? }); a
  // change that changes nothing gives no event. A new status brings what goes with it in practice:
  // - a clean or occupied room is no longer "in progress";
  // - a departure takes the guest's DND with it, and the guest's VIP flag unless the room has an arrival today
  //   (then the VIP is the arriving guest);
  // - a vacant room that becomes occupied is the check-in: the arrival and early-arrival flags are done;
  // - leaving OOO/OOS clears its reason and date.
  const transition = (entry, change, ctx, room = "") => {
    const before = entry || blankEntry();
    const next = { ...blankEntry(), ...before, flags: [...(before.flags || [])], ooo: before.ooo ? { ...before.ooo } : null };
    const events = [];
    const log = (kind, from, to, extra = {}) => events.push({ t: ctx.time, room, kind, from, to, who: next.attendant, ...extra });
    const setFlags = (flags) => {
      FLAGS.forEach((flag) => {
        const was = next.flags.includes(flag), now = flags.includes(flag);
        if (was !== now) log("flag", was ? "on" : "off", now ? "on" : "off", { flag });
      });
      next.flags = FLAGS.filter((f) => flags.includes(f));
    };
    if (change.status !== undefined && STATUSES.includes(change.status) && change.status !== next.status) {
      const from = next.status, to = change.status;
      log("status", from, to);
      next.status = to;
      next.at = `${ctx.date} ${ctx.time}`;
      if (!DIRTY.includes(to) && next.started) next.started = "";
      if (to === "co") setFlags(next.flags.filter((f) => f !== "dnd" && (f !== "vip" || next.flags.includes("arrival"))));
      if (to === "occ" && VACANT.includes(from)) setFlags(next.flags.filter((f) => f !== "arrival" && f !== "early"));
      next.ooo = OUT.includes(to) ? next.ooo || { reason: "", back: "", sent: false } : null;
    }
    if (change.flag !== undefined && FLAGS.includes(change.flag)) setFlags(withFlag(next.flags, change.flag, Boolean(change.on)));
    if (change.start === true && DIRTY.includes(next.status) && !next.started) {
      next.started = `${ctx.date} ${ctx.time}`;
      log("start", "", ctx.time);
    } else if (change.start === false && next.started) {
      log("start", next.started.slice(11), "");
      next.started = "";
    }
    if (typeof change.attendant === "string" && change.attendant.trim() !== next.attendant) {
      const from = next.attendant;
      next.attendant = change.attendant.trim();
      log("attendant", from, next.attendant);
    }
    if (typeof change.note === "string" && change.note.trim() !== next.note) {
      next.note = change.note.trim();
      log("note", "", next.note);
    }
    if (change.ooo && OUT.includes(next.status)) {
      const reason = typeof change.ooo.reason === "string" ? change.ooo.reason : next.ooo.reason;
      const back = typeof change.ooo.back === "string" ? change.ooo.back : next.ooo.back;
      if (reason !== next.ooo.reason || back !== next.ooo.back) {
        log("ooo", next.ooo.reason, reason, { back });
        next.ooo = { reason, back, sent: reason === next.ooo.reason ? next.ooo.sent : false };
      }
    }
    return { entry: next, events };
  };

  // The start of a new day (after the night audit): every occupied room is a stay-over that needs its service again,
  // and yesterday's arrival, early-arrival and DND flags and the "in progress" marks are gone.
  const newDay = (board, ctx) => {
    const out = {};
    const events = [];
    Object.entries(board).forEach(([room, entry]) => {
      let r = transition(entry, entry.status === "occ" ? { status: "od" } : {}, ctx, room);
      events.push(...r.events);
      ["arrival", "early", "dnd"].forEach((flag) => { const s = transition(r.entry, { flag, on: false }, ctx, room); events.push(...s.events); r = s; });
      const s = transition(r.entry, { start: false }, ctx, room);
      events.push(...s.events);
      out[room] = s.entry;
    });
    return { board: out, events };
  };

  // Turnaround of one day, from its history. Departed → clean: from a check-out (CO) to the first VC after it; a room
  // set to VD in between still counts, any other status ends the clock. Clean → inspected: from the last VC to VI; a
  // room sent back (VC → VD, a failed inspection) starts again at its next VC. Average = sum of the minutes / rooms.
  const turnaround = (events) => {
    const byRoom = new Map();
    events.filter((e) => e.kind === "status" && isTime(e.t)).forEach((e, i) => {
      if (!byRoom.has(e.room)) byRoom.set(e.room, []);
      byRoom.get(e.room).push({ ...e, i });
    });
    const clean = [], inspect = [];
    byRoom.forEach((list, room) => {
      let cleanFrom = null, inspectFrom = null;
      list.sort((a, b) => minutes(a.t) - minutes(b.t) || a.i - b.i).forEach((e) => {
        if (e.to === "co") { cleanFrom = e.t; inspectFrom = null; }
        else if (e.to === "vc") {
          if (cleanFrom !== null) { clean.push({ room, from: cleanFrom, to: e.t, minutes: minutes(e.t) - minutes(cleanFrom) }); cleanFrom = null; }
          inspectFrom = e.t;
        } else if (e.to === "vi") {
          if (inspectFrom !== null) inspect.push({ room, from: inspectFrom, to: e.t, minutes: minutes(e.t) - minutes(inspectFrom) });
          inspectFrom = null;
          cleanFrom = null;
        } else if (e.to === "vd") inspectFrom = null;
        else { cleanFrom = null; inspectFrom = null; }
      });
    });
    const sum = (pairs) => {
      const valid = pairs.filter((p) => p.minutes >= 0).sort((a, b) => minutes(a.to) - minutes(b.to) || numeric(a.room, b.room));
      const total = valid.reduce((s, p) => s + p.minutes, 0);
      return { pairs: valid, n: valid.length, sum: total, avg: valid.length ? total / valid.length : null };
    };
    return { clean: sum(clean), inspect: sum(inspect) };
  };
  // A cleaning done: a dirty room (VD, CO, OD) reported clean, inspected or serviced.
  const isCleaning = (e) => e.kind === "status" && DIRTY.includes(e.from) && CLEANED.includes(e.to);
  // The flow of the day by hour: rooms departed, cleaned and inspected, and the turnaround minutes that ended in it.
  const byHour = (events) => {
    const list = events.filter((e) => e.kind === "status" && isTime(e.t));
    if (!list.length) return [];
    const hours = list.map((e) => Number(e.t.slice(0, 2)));
    const t = turnaround(events);
    const out = [];
    for (let h = Math.min(...hours); h <= Math.max(...hours); h++) {
      const at = (e) => Number(e.t.slice(0, 2)) === h;
      const inHour = (pairs) => pairs.filter((p) => Number(p.to.slice(0, 2)) === h).map((p) => p.minutes);
      out.push({
        hour: h, label: `${String(h).padStart(2, "0")}:00`,
        departed: list.filter((e) => at(e) && e.to === "co").length,
        cleaned: list.filter((e) => at(e) && isCleaning(e)).length,
        inspected: list.filter((e) => at(e) && e.to === "vi").length,
        cleanMinutes: inHour(t.clean.pairs), inspectMinutes: inHour(t.inspect.pairs),
      });
    }
    return out;
  };

  // The numbers of the board. Arrivals: the number typed for today, else the rooms flagged "arrival today". Out of
  // order share = OOO rooms / all rooms (OOO leaves the sellable inventory; OOS stays in it).
  const counts = (rooms, board, typedArrivals = null) => {
    const by = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    let inProgress = 0, dnd = 0, flaggedArrivals = 0, readyArrivals = 0, departures = 0, stayovers = 0;
    rooms.forEach((room) => {
      const e = board[room.number] || blankEntry();
      by[e.status]++;
      const f = e.flags || [];
      if (DIRTY.includes(e.status) && e.started) inProgress++;
      if (DIRTY.includes(e.status) && f.includes("dnd")) dnd++;
      if (f.includes("arrival")) { flaggedArrivals++; if (e.status === "vi") readyArrivals++; }
      if (DEPARTURE.includes(e.status)) departures++;
      if (e.status === "od") stayovers++;
    });
    const total = rooms.length;
    const arrivals = Number.isInteger(typedArrivals) && typedArrivals >= 0 ? typedArrivals : flaggedArrivals;
    return {
      total, by, inProgress, dnd, flaggedArrivals, readyArrivals, arrivals,
      toClean: departures + stayovers, departures, stayovers, toInspect: by.vc, ready: by.vi,
      needed: Math.max(0, arrivals - by.vi), ooo: by.ooo, oos: by.oos, sellable: total - by.ooo, oooShare: total ? by.ooo / total : 0,
    };
  };

  // The queue of the attendants, rooms not started yet and without DND, in this order:
  // 0 early arrival or priority, and VIP arrivals; 1 departures with an arrival today; 2 other departures;
  // 3 VIP stay-overs; 4 stay-overs. In a tier the room that has waited longest comes first, then the room number.
  const tierOf = (entry) => {
    if (!entry || !DIRTY.includes(entry.status) || entry.started) return null;
    const f = entry.flags || [];
    if (f.includes("dnd")) return null;
    const departure = DEPARTURE.includes(entry.status);
    if (f.includes("early") || (f.includes("vip") && f.includes("arrival"))) return 0;
    if (departure) return f.includes("arrival") ? 1 : 2;
    return f.includes("vip") ? 3 : 4;
  };
  const queue = (rooms, board) => rooms.map((room) => ({ room, entry: board[room.number] || blankEntry(), tier: tierOf(board[room.number] || blankEntry()) }))
    .filter((item) => item.tier !== null)
    .map((item) => ({ ...item, rank: (item.entry.flags.includes("early") ? 2 : 0) + (item.entry.flags.includes("vip") ? 1 : 0) }))
    .sort((a, b) => a.tier - b.tier || (a.tier === 0 ? b.rank - a.rank : 0) || String(a.entry.at).localeCompare(String(b.entry.at)) || numeric(a.room.number, b.room.number));
  // Rooms to inspect (VC): arrivals first, then the room cleaned longest ago.
  const inspectQueue = (rooms, board) => rooms.filter((room) => board[room.number]?.status === "vc")
    .map((room) => ({ room, entry: board[room.number] }))
    .sort((a, b) => Number(b.entry.flags.includes("arrival")) - Number(a.entry.flags.includes("arrival")) || String(a.entry.at).localeCompare(String(b.entry.at)) || numeric(a.room.number, b.room.number));

  // Per attendant: the rooms assigned, the rooms cleaned today (a room cleaned twice counts once), in progress, and
  // the rooms still to do (dirty or due out).
  const perAttendant = (rooms, board, events) => {
    const map = new Map();
    const get = (name) => { if (!map.has(name)) map.set(name, { name, assigned: 0, departures: 0, stayovers: 0, done: new Set(), inProgress: 0, left: 0 }); return map.get(name); };
    rooms.forEach((room) => {
      const e = board[room.number];
      if (!e || !e.attendant || OUT.includes(e.status)) return;
      const g = get(e.attendant);
      g.assigned++;
      if (["od", "occ"].includes(e.status)) g.stayovers++; else g.departures++;
      if (DIRTY.includes(e.status) && e.started) g.inProgress++;
      if (DIRTY.includes(e.status) || e.status === "do") g.left++;
    });
    events.filter(isCleaning).forEach((e) => { if (e.who && map.has(e.who)) map.get(e.who).done.add(e.room); });
    return [...map.values()].map((g) => ({ ...g, done: g.done.size })).sort((a, b) => numeric(a.name, b.name));
  };

  // The PMS export pasted in: "room code" per line (tab, semicolon, comma or spaces between). The code is matched
  // case-insensitively against the aliases of each status (VD, VC, VI, OC/OCC, OD, DO, CO, OOO, OOS) and the words
  // housekeeping lists write instead (Dirty, Clean, Inspected, Out of Order, Sauber, Schmutzig, Inspiziert …); a code
  // that is not one of them, or a room not on the board, is listed and left alone, never guessed. A line without a
  // digit in its first cell (a header) is skipped; a header that names the room and status columns ("Zimmer;
  // Zimmertyp;HK-Status") says where to read them, and a front-office column next to it (Vacant / Occupied) turns
  // "Dirty" into a stay-over (OD) for an occupied room.
  const normCode = (code) => String(code).toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\s./_-]/g, "");
  // Written as a person types them; normCode folds case, accents and spaces.
  const STATUS_WORDS = {
    vd: ["Dirty", "Vacant dirty", "Vacant/Dirty", "Schmutzig", "Frei schmutzig", "Unrein", "E pistë", "E lirë e pistë"],
    vc: ["Clean", "Vacant clean", "Vacant/Clean", "Sauber", "Frei sauber", "Gereinigt", "E pastër", "E lirë e pastër"],
    vi: ["Inspected", "Vacant inspected", "Vacant/Inspected", "Inspiziert", "Frei inspiziert", "Kontrolliert", "E kontrolluar", "E lirë e kontrolluar"],
    occ: ["Occupied", "Occupied clean", "Occupied/Clean", "Belegt", "Belegt sauber", "E zënë", "E zënë e pastër"],
    od: ["Occupied dirty", "Occupied/Dirty", "Stayover", "Stay over", "Belegt schmutzig", "Bleiber", "E zënë e pistë"],
    do: ["Due out", "Expected departure"],
    co: ["Checked out", "Departed", "Abgereist", "Ausgecheckt"],
    ooo: ["Out of order", "Außer Betrieb", "Jashtë përdorimit"],
    oos: ["Out of service", "Jashtë shërbimit"],
  };
  const aliasMap = (statuses) => {
    const map = new Map();
    const known = new Set(statuses.map((s) => s.key));
    Object.entries(STATUS_WORDS).forEach(([key, words]) => { if (known.has(key)) words.forEach((word) => map.set(normCode(word), key)); });
    // The codes last: a code of the data file always wins over a word.
    statuses.forEach((s) => [s.code, ...(s.aliases || [])].forEach((alias) => map.set(normCode(alias), s.key)));
    return map;
  };
  // Header names, folded by normCode: the room column, the housekeeping status and the front-office status.
  const HEADS = {
    room: ["room", "roomno", "roomnr", "roomnumber", "rm", "zimmer", "zimmernr", "zimmernummer", "zinr", "zi", "dhoma", "nrdhome", "numriidhomes"],
    hk: ["status", "hkstatus", "housekeepingstatus", "roomstatus", "hk", "zimmerstatus", "reinigungsstatus", "hausdamenstatus", "statusi", "statusiidhomes", "gjendja"],
    fo: ["fostatus", "frontofficestatus", "fo", "rezeptionsstatus", "belegungsstatus", "statusirecepsionit"],
  };
  const OCCUPIED = new Set(["occupied", "occ", "oc", "o", "belegt", "ezene"].map(normCode));
  const headerColumns = (cells) => {
    const at = (names) => cells.findIndex((cell) => names.includes(normCode(cell)));
    const cols = { room: at(HEADS.room), hk: at(HEADS.hk), fo: at(HEADS.fo) };
    return cols.room >= 0 && cols.hk >= 0 && cols.room !== cols.hk ? cols : null;
  };
  const parseImport = (text, statuses, roomNumbers) => {
    const known = new Map(roomNumbers.map((n) => [String(n).toLowerCase(), n]));
    const codes = aliasMap(statuses);
    const updates = new Map(), unknownCodes = [], unknownRooms = [];
    let skipped = 0, cols = null;
    String(text ?? "").replace(/^\uFEFF/, "").split(/\r?\n/).forEach((line) => {
      if (!line.trim()) return;
      const spaced = !/[;\t,]/.test(line);
      const cells = (spaced ? line.trim().split(/\s+/) : line.split(/[;\t,]/)).map((c) => c.trim());
      const byHeader = cols && !spaced;
      const number = byHeader ? cells[cols.room] || "" : cells[0];
      if (!/\d/.test(number) || number.length > 12) {
        skipped++;
        if (!spaced && !updates.size && !unknownCodes.length && !unknownRooms.length) cols = headerColumns(cells) || cols;
        return;
      }
      const rest = cells.slice(1).filter(Boolean);
      // With spaces between, a word status ("Out of Order") is the rest of the line; else the first known code.
      const candidates = byHeader ? [cells[cols.hk] || ""] : spaced ? [rest.join(" "), ...rest] : rest;
      const code = candidates.find((c) => codes.has(normCode(c))) ?? candidates[0] ?? "";
      const room = known.get(number.toLowerCase());
      if (!room) { unknownRooms.push({ room: number, code }); return; }
      let key = codes.get(normCode(code));
      if (!key) { unknownCodes.push({ room, code }); return; }
      if (byHeader && cols.fo >= 0 && OCCUPIED.has(normCode(cells[cols.fo] || ""))) key = key === "vd" ? "od" : key === "vc" || key === "vi" ? "occ" : key;
      updates.set(room, { room, status: key, code });
    });
    return { updates: [...updates.values()], unknownCodes, unknownRooms, skipped };
  };

  // Rooms. The floor is the number without its last two digits (412 is on floor 4, 1203 on floor 12).
  const floorOf = (number) => {
    const digits = String(number).trim().match(/^(\d+)\d{2}$/);
    return digits ? String(Number(digits[1])) : "";
  };
  const sortRooms = (rooms) => [...rooms].sort((a, b) => numeric(a.floor, b.floor) || numeric(a.number, b.number));
  const generateRooms = ({ floorFrom, floorTo, roomFrom, roomTo, type }) => {
    const vals = [floorFrom, floorTo, roomFrom, roomTo].map((v) => Math.round(Number(v)));
    if (!vals.every(Number.isFinite)) return [];
    const f1 = Math.max(0, Math.min(vals[0], vals[1])), f2 = Math.min(99, Math.max(vals[0], vals[1]));
    const r1 = Math.max(0, Math.min(vals[2], vals[3])), r2 = Math.min(99, Math.max(vals[2], vals[3]));
    const rooms = [];
    for (let f = f1; f <= f2; f++) for (let r = r1; r <= r2; r++) {
      if (rooms.length >= MAX_ROOMS) return rooms;
      rooms.push({ number: `${f}${String(r).padStart(2, "0")}`, floor: String(f), type });
    }
    return rooms;
  };
  const mergeRooms = (list, add) => {
    const map = new Map(list.map((room) => [room.number.toLowerCase(), room]));
    add.forEach((room) => map.set(room.number.toLowerCase(), room));
    return sortRooms([...map.values()]).slice(0, MAX_ROOMS);
  };
  // A pasted room list, one room per line: "101; double; 1" (room, type, floor) in any order after the number; a cell
  // of one or two digits is the floor, a word is the type (its key or name, any case). A line whose first cell has no
  // digit (a header) is skipped; a room without a floor takes the floor of its number.
  const parseRooms = (text, types, fallback = "double") => {
    const rooms = [];
    let skipped = 0;
    const typeOf = (token) => {
      const t = token.toLowerCase();
      if (!t) return "";
      const hit = types.find((type) => type.key === t || type.name.toLowerCase() === t)
        || (t.length >= 3 && types.find((type) => type.name.toLowerCase().startsWith(t) || type.key.startsWith(t)));
      return hit ? hit.key : "";
    };
    String(text ?? "").replace(/^﻿/, "").split(/\r?\n/).forEach((line) => {
      if (!line.trim()) return;
      const cells = (/[;\t,]/.test(line) ? line.split(/[;\t,]/) : line.trim().split(/\s+/)).map((cell) => cell.trim());
      const number = cells[0];
      if (!/\d/.test(number) || number.length > 12) { skipped++; return; }
      let floor = "", type = "";
      cells.slice(1).forEach((cell) => {
        if (!floor && /^\d{1,2}$/.test(cell)) floor = String(Number(cell));
        else if (!type) type = typeOf(cell);
      });
      rooms.push({ number, floor: floor || floorOf(number), type: type || fallback });
    });
    return { rooms, skipped };
  };
  // Names, one per line; the floors of an attendant's section after a semicolon ("Marta; 1, 2").
  const parseNames = (text) => {
    const seen = new Set();
    return String(text ?? "").split(/\r?\n/).map((line) => {
      const [name, floors = ""] = line.split(/[;\t]/);
      return { name: String(name).trim().slice(0, 60), floors: [...new Set(floors.split(/[,\s]+/).map((f) => f.trim()).filter((f) => /^\d{1,2}$/.test(f)).map((f) => String(Number(f))))] };
    }).filter((item) => item.name && !seen.has(item.name.toLowerCase()) && seen.add(item.name.toLowerCase()));
  };
  const namesText = (list) => list.map((item) => (item.floors?.length ? `${item.name}; ${item.floors.join(", ")}` : item.name)).join("\n");
  const sectionOf = (attendants, floor) => attendants.find((a) => (a.floors || []).includes(String(floor)))?.name || "";

  // The history keeps the last `days` days (today included).
  const trimHistory = (history, todayIso, days = 30) => {
    const first = addDays(todayIso, -(days - 1));
    return Object.fromEntries(Object.entries(history).filter(([day]) => /^\d{4}-\d{2}-\d{2}$/.test(day) && day >= first && day <= todayIso).sort(([a], [b]) => a.localeCompare(b)));
  };

  // The example: a 40-room hotel at mid-morning. The board is the night audit's position at 07:00, then the events of
  // the morning are replayed through transition(), so the board, the history and the turnaround always agree.
  const exampleData = (spec, date) => {
    const typed = (floor, n) => (spec.types.find((rule) => n >= rule.from && n <= rule.to && (!rule.floors || rule.floors.includes(floor))) || {}).type || spec.default;
    const rooms = [];
    for (let f = spec.floors[0]; f <= spec.floors[1]; f++) for (let r = spec.rooms[0]; r <= spec.rooms[1]; r++) rooms.push({ number: `${f}${String(r).padStart(2, "0")}`, floor: String(f), type: typed(f, r) });
    const attendants = spec.attendants.map((a) => ({ name: a.name, floors: a.floors.map(String) }));
    const board = {};
    rooms.forEach((room) => {
      const [status, ...flags] = String(spec.board[room.number] || "vi").split(/\s+/);
      const work = DIRTY.includes(status) || status === "do";
      board[room.number] = { ...blankEntry(status), at: `${date} ${spec.start}`, flags: FLAGS.filter((f) => flags.includes(f)), attendant: work ? sectionOf(attendants, room.floor) : "" };
      const out = spec.ooo?.[room.number];
      if (out && OUT.includes(status)) board[room.number].ooo = { reason: out.reason, back: addDays(date, out.back), sent: false };
    });
    const events = [];
    spec.events.map((line, i) => { const [t, room, action] = line.split(" "); return { t, room, action, i }; })
      .sort((a, b) => minutes(a.t) - minutes(b.t) || a.i - b.i)
      .forEach(({ t, room, action }) => {
        const change = action === "start" ? { start: true } : /^[+-]/.test(action) ? { flag: action.slice(1), on: action[0] === "+" } : { status: action };
        const r = transition(board[room], change, { date, time: t }, room);
        board[room] = r.entry;
        events.push(...r.events);
      });
    return { rooms, attendants, board, history: { [date]: events } };
  };

  window.RoomStatusMath = { STATUSES, FLAGS, DIRTY, DEPARTURE, CLEANED, OUT, addDays, isTime, minutes, blankEntry, transition, newDay, turnaround, isCleaning, byHour, counts, tierOf, queue, inspectQueue, perAttendant, normCode, aliasMap, parseImport, floorOf, sortRooms, generateRooms, mergeRooms, parseRooms, parseNames, namesText, sectionOf, trimHistory, exampleData };

  const dataEl = document.getElementById("room-status-data");
  const root = document.querySelector("[data-room-status]");
  if (!dataEl || !root || !window.ToolKit) return;
  const { tx, num, pct, showDate, read, write, loadState, isObject, str, el, int, today, parseDate, flash, undoNote, panel, stat, barList, copy, firstVisit, downloadCsv, downloadXlsx } = window.ToolKit;
  const ChartKit = window.ChartKit;
  const Actions = window.ActionsStore;
  const Workplace = window.Workplace;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const TOOL = "room-status";
  const DAYS = cfg.historyDays || 30;
  const statusOf = Object.fromEntries(cfg.statuses.map((s) => [s.key, s]));
  const flagOf = Object.fromEntries(cfg.flags.map((f) => [f.key, f]));
  const TYPES = cfg.roomTypes.map((t) => t.key);
  const typeName = (key) => cfg.roomTypes.find((t) => t.key === key)?.name || "";
  const reasonName = (key) => cfg.oooReasons.find((r) => r.key === key)?.name || "";
  const code = (status) => statusOf[status]?.code || "";
  const nowTime = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
  const floorLabel = (floor) => tx("Floor {n}", { n: floor || "–" });
  const minText = (value) => (value === null ? "–" : tx("{n} min", { n: num(value, 0) }));

  // State: the rooms, the board (one entry per room), the history per day, the attendants, the arrivals typed for a
  // day, the filters, the day the board was started, and whether the example is shown. One key, so Team sync can share it.
  const DEFAULTS = { rooms: [], board: {}, history: {}, attendants: [], arrivals: {}, filters: {}, day: "", example: false };
  const NO_FILTERS = { status: "", floor: "", attendant: "", priority: false };
  const cleanRoom = (room) => (isObject(room) && str(room.number).trim() ? { number: str(room.number).trim().slice(0, 12), floor: str(room.floor).trim().slice(0, 4) || floorOf(room.number), type: TYPES.includes(room.type) ? room.type : "double" } : null);
  const isStamp = (value) => /^\d{4}-\d{2}-\d{2} ([01]\d|2[0-3]):[0-5]\d$/.test(str(value));
  const cleanEntry = (raw) => {
    const e = isObject(raw) ? raw : {};
    const status = STATUSES.includes(e.status) ? e.status : "vd";
    const ooo = OUT.includes(status) ? { reason: cfg.oooReasons.some((r) => r.key === e.ooo?.reason) ? e.ooo.reason : "", back: parseDate(str(e.ooo?.back)) || "", sent: e.ooo?.sent === true } : null;
    return { status, at: isStamp(e.at) ? e.at : "", flags: FLAGS.filter((f) => Array.isArray(e.flags) && e.flags.includes(f)), attendant: str(e.attendant).trim().slice(0, 60), note: str(e.note).trim().slice(0, 300), started: DIRTY.includes(status) && isStamp(e.started) ? e.started : "", ooo };
  };
  const KINDS = ["status", "flag", "start", "attendant", "note", "ooo"];
  const cleanEvent = (raw) => (isObject(raw) && isTime(raw.t) && str(raw.room) && KINDS.includes(raw.kind)
    ? { t: raw.t, room: str(raw.room).slice(0, 12), kind: raw.kind, from: str(raw.from).slice(0, 300), to: str(raw.to).slice(0, 300), who: str(raw.who).slice(0, 60), ...(FLAGS.includes(raw.flag) ? { flag: raw.flag } : {}), ...(raw.kind === "ooo" ? { back: str(raw.back).slice(0, 10) } : {}) }
    : null);
  const tidy = (s) => {
    s.rooms = sortRooms(s.rooms.map(cleanRoom).filter(Boolean)).slice(0, MAX_ROOMS);
    const board = {};
    s.rooms.forEach((room) => { board[room.number] = cleanEntry(s.board[room.number]); });
    s.board = board;
    s.history = trimHistory(Object.fromEntries(Object.entries(s.history).filter(([, list]) => Array.isArray(list)).map(([day, list]) => [day, list.map(cleanEvent).filter(Boolean)])), today(), DAYS);
    s.attendants = s.attendants.filter(isObject).map((a) => ({ name: str(a.name).trim().slice(0, 60), floors: (Array.isArray(a.floors) ? a.floors : []).map(String).filter((f) => /^\d{1,2}$/.test(f)) })).filter((a) => a.name);
    s.arrivals = parseDate(str(s.arrivals.date)) && Number.isInteger(s.arrivals.n) && s.arrivals.n >= 0 ? { date: s.arrivals.date, n: Math.min(s.arrivals.n, 9999) } : {};
    const f = isObject(s.filters) ? s.filters : {};
    s.filters = { status: ["", "dirty", ...STATUSES].includes(f.status) ? f.status : "", floor: str(f.floor).slice(0, 4), attendant: str(f.attendant).slice(0, 60), priority: f.priority === true };
    s.day = parseDate(str(s.day)) || "";
    s.example = s.example === true;
    return s;
  };
  const state = tidy(loadState(KEY, DEFAULTS));
  const save = () => write(KEY, state);
  const todayEvents = () => state.history[today()] || [];

  // Elements.
  const q = (selector) => root.querySelector(selector);
  const setupBox = q("[data-setup]");
  const setupCount = q("[data-setup-count]");
  const roomsStatus = q("[data-rooms-status]");
  const fromInspection = q("[data-from-inspection]");
  const pasteInput = q("#rs-room-paste");
  const attendantsInput = q("#rs-attendants");
  const arrivalsInput = q("#rs-arrivals");
  const boardBox = q("[data-board]");
  const boardEmpty = q("[data-board-empty]");
  const boardStatus = q("[data-board-status]");
  const boardHead = q("[data-board-head]");
  const dayNote = q("[data-day-note]");
  const filterStatus = q("#rs-filter-status");
  const filterFloor = q("#rs-filter-floor");
  const filterAttendant = q("#rs-filter-attendant");
  const filterPriority = q("#rs-filter-priority");
  const importInput = q("#rs-import");
  const importStatus = q("[data-import-status]");
  const results = document.querySelector("[data-results]");
  const printBox = document.querySelector("[data-print]");
  const sheet = document.querySelector("[data-sheet]");
  const sq = (selector) => sheet.querySelector(selector);
  const exampleBox = el("div", "dl-example-note rs-example-note");
  exampleBox.setAttribute("role", "status");
  exampleBox.hidden = true;
  results.before(exampleBox);

  // The attendants to choose from: the list in the settings, else the attendants of Room Inspection in this browser,
  // plus the teams of the workplace profile.
  const inspectionState = () => { const saved = read(cfg.inspectionKey, null); return isObject(saved) ? saved : {}; };
  const inspectionRooms = () => (Array.isArray(inspectionState().rooms) ? inspectionState().rooms.map(cleanRoom).filter(Boolean) : []);
  const team = () => {
    if (state.attendants.length) return state.attendants;
    const saved = inspectionState();
    return Array.isArray(saved.attendants) ? saved.attendants.filter(isObject).map((a) => ({ name: str(a.name).trim(), floors: (Array.isArray(a.floors) ? a.floors : []).map(String) })).filter((a) => a.name) : [];
  };
  const assignees = () => {
    const names = team().map((a) => a.name);
    const teams = Workplace ? Workplace.teams() : [];
    return [...new Set([...names, ...teams])];
  };
  const typedArrivals = () => (state.arrivals.date === today() ? state.arrivals.n : null);
  const roomOf = (number) => state.rooms.find((room) => room.number === number) || null;
  const entryOf = (number) => state.board[number] || blankEntry();
  // The example stands at its own clock (mid-morning), so a change tapped on it fits its history.
  const clockNow = () => (state.example ? cfg.example.time : nowTime());

  // ---- Changes: every change goes through transition(), into the board and today's history. ----
  const applyChange = (number, change, { undo = true, render = true } = {}) => {
    const room = roomOf(number);
    if (!room) return null;
    const before = entryOf(number);
    const ctx = { date: today(), time: clockNow() };
    const patch = { ...change };
    // A room that becomes dirty without an attendant goes to the attendant of its floor's section.
    if (patch.status && DIRTY.includes(patch.status) && !before.attendant && patch.attendant === undefined) {
      const name = sectionOf(team(), room.floor);
      if (name) patch.attendant = name;
    }
    const r = transition(before, patch, ctx, number);
    if (!r.events.length) return null;
    const day = ctx.date;
    state.history[day] = [...(state.history[day] || []), ...r.events];
    state.history = trimHistory(state.history, day, DAYS);
    state.board[number] = r.entry;
    if (!render) return r;
    save();
    renderAll();
    const statusEvent = r.events.find((e) => e.kind === "status");
    if (undo && statusEvent) {
      undoNote(boardStatus, tx("Room {room}: {from} → {to} at {time}.", { room: number, from: code(statusEvent.from), to: code(statusEvent.to), time: ctx.time }), () => {
        state.board[number] = before;
        state.history[day] = (state.history[day] || []).filter((e) => !r.events.includes(e));
        save();
        renderAll();
        if (openRoom === number) fillSheet();
      });
    }
    return r;
  };

  // ---- Setup ----
  const renderSetup = () => {
    const floors = new Set(state.rooms.map((room) => room.floor).filter(Boolean));
    setupCount.textContent = state.rooms.length ? tx("{rooms} rooms on {floors} floors · {people} attendants", { rooms: int.format(state.rooms.length), floors: int.format(floors.size), people: int.format(team().length) }) : tx("No rooms yet");
    if (document.activeElement !== attendantsInput) attendantsInput.value = namesText(state.attendants);
    if (document.activeElement !== arrivalsInput) arrivalsInput.value = typedArrivals() === null ? "" : String(typedArrivals());
    arrivalsInput.placeholder = tx("{n} from the flags", { n: int.format(counts(state.rooms, state.board).flaggedArrivals) });
    const ri = inspectionRooms();
    fromInspection.hidden = !ri.length || state.example;
    fromInspection.textContent = tx("Use the {n} rooms of Room Inspection", { n: int.format(ri.length) });
  };
  const addRooms = (rooms) => {
    if (state.example) dropExample();
    state.rooms = mergeRooms(state.rooms, rooms);
    state.rooms.forEach((room) => { if (!state.board[room.number]) state.board[room.number] = blankEntry("vd"); });
    if (!state.day) state.day = today();
    save();
    renderAll();
  };

  // ---- The board ----
  const flagCodes = (entry) => entry.flags.map((f) => flagOf[f]?.code || f);
  const matches = (room, entry) => {
    const f = state.filters;
    if (f.status === "dirty" && !DIRTY.includes(entry.status)) return false;
    if (f.status && f.status !== "dirty" && entry.status !== f.status) return false;
    if (f.floor && room.floor !== f.floor) return false;
    if (f.attendant && entry.attendant !== f.attendant) return false;
    if (f.priority && !entry.flags.some((flag) => flag === "early" || flag === "vip" || flag === "arrival")) return false;
    return true;
  };
  const tileLabel = (room, entry) => [
    tx("Room {room}", { room: room.number }), `${code(entry.status)} ${statusOf[entry.status].name}`, ...entry.flags.map((f) => flagOf[f]?.name || f),
    entry.attendant, entry.started ? tx("cleaning since {time}", { time: entry.started.slice(11) }) : "", entry.note,
  ].filter(Boolean).join(", ");
  const tile = (room, entry) => {
    const button = el("button", `rs-tile is-${entry.status}${entry.started ? " is-started" : ""}`);
    button.type = "button";
    button.dataset.room = room.number;
    button.setAttribute("aria-label", tileLabel(room, entry));
    const top = el("span", "rs-tile-top");
    top.append(el("span", "rs-tile-num", room.number), el("span", "rs-tile-code", code(entry.status)));
    button.append(top);
    const flags = flagCodes(entry);
    if (flags.length) button.append(el("span", "rs-tile-flags", flags.join(" ")));
    const who = [entry.attendant, entry.started ? `▶ ${entry.started.slice(11)}` : ""].filter(Boolean).join(" · ");
    if (who) button.append(el("span", "rs-tile-who", who));
    if (entry.note) button.append(el("span", "rs-tile-note", "✎"));
    return button;
  };
  const fillSelect = (select, options, current) => {
    select.replaceChildren(...options.map(([value, label]) => { const o = el("option", null, label); o.value = value; o.selected = value === current; return o; }));
    if (![...select.options].some((o) => o.value === current)) select.value = "";
  };
  const renderFilters = () => {
    const floors = [...new Set(state.rooms.map((r) => r.floor).filter(Boolean))].sort(numeric);
    fillSelect(filterFloor, [["", tx("All floors")], ...floors.map((f) => [f, floorLabel(f)])], state.filters.floor);
    const people = [...new Set([...assignees(), ...Object.values(state.board).map((e) => e.attendant).filter(Boolean)])].sort(numeric);
    fillSelect(filterAttendant, [["", tx("All attendants")], ...people.map((p) => [p, p])], state.filters.attendant);
    filterStatus.value = state.filters.status;
    filterPriority.checked = state.filters.priority;
  };
  const renderBoard = () => {
    boardBox.replaceChildren();
    boardEmpty.hidden = state.rooms.length > 0;
    boardHead.hidden = !state.rooms.length;
    q("[data-board-tools]").hidden = !state.rooms.length;
    if (!state.rooms.length) return;
    renderFilters();
    const c = counts(state.rooms, state.board, typedArrivals());
    boardHead.textContent = [tx("Status at {time}", { time: clockNow() }), tx("{a} ready for {b} arrivals", { a: int.format(c.ready), b: int.format(c.arrivals) }), tx("{n} to clean", { n: int.format(c.toClean) }), tx("{n} in progress", { n: int.format(c.inProgress) })].join(" · ");
    const floors = [...new Set(state.rooms.map((r) => r.floor))].sort(numeric);
    let shown = 0;
    floors.forEach((floor) => {
      const rooms = state.rooms.filter((r) => r.floor === floor);
      const visible = rooms.filter((r) => matches(r, entryOf(r.number)));
      if (!visible.length) return;
      shown += visible.length;
      const fc = counts(rooms, state.board);
      const section = el("section", "rs-floor");
      const head = el("h3", "rs-floor-head");
      head.append(el("span", "rs-floor-name", floor ? floorLabel(floor) : tx("No floor")), el("span", "rs-floor-meta", [tx("{n} rooms", { n: int.format(rooms.length) }), tx("{n} to clean", { n: int.format(fc.toClean) }), tx("{n} ready", { n: int.format(fc.ready) })].join(" · ")));
      const grid = el("div", "rs-grid");
      visible.forEach((room) => grid.append(tile(room, entryOf(room.number))));
      section.append(head, grid);
      boardBox.append(section);
    });
    if (!shown) boardBox.append(el("p", "form-note", tx("No room matches these filters.")));
    // Yesterday's board: offer to start the day.
    const stale = state.day && state.day < today() && !state.example;
    dayNote.hidden = !stale;
    if (stale) q("[data-day-text]").textContent = tx("The board was started on {date}. Start today: occupied rooms become stay-overs that need service, and the arrival, early-arrival, DND and in-progress marks of yesterday are cleared.", { date: showDate(state.day) });
  };

  // ---- The sheet of one room ----
  let openRoom = null;
  const sheetStatus = sq("[data-sheet-status]");
  const attendantSelect = sq("#rs-attendant");
  const noteInput = sq("#rs-note");
  const reasonSelect = sq("#rs-ooo-reason");
  const backInput = sq("#rs-ooo-back");
  const startButton = sq("[data-start]");
  const inspectBox = sq("[data-inspect]");
  const oooBox = sq("[data-ooo]");
  const sendButton = sq("[data-send-ooo]");
  const kindText = (e) => {
    if (e.kind === "status") return `${code(e.from)} → ${code(e.to)}`;
    if (e.kind === "flag") return `${flagOf[e.flag]?.code || e.flag} ${e.to === "on" ? tx("on") : tx("off")}`;
    if (e.kind === "start") return e.to ? tx("cleaning started") : tx("cleaning stopped");
    if (e.kind === "attendant") return `${tx("Room attendant")}: ${e.to || "–"}`;
    if (e.kind === "note") return `${tx("Note")}: ${e.to || "–"}`;
    if (e.kind === "ooo") return `${tx("Reason")}: ${reasonName(e.to) || "–"}${e.back ? ` · ${tx("back on {date}", { date: showDate(e.back) })}` : ""}`;
    return e.kind;
  };
  const fillSheet = () => {
    const room = roomOf(openRoom);
    if (!room) return;
    const e = entryOf(room.number);
    sq("[data-sheet-title]").textContent = tx("Room {room}", { room: room.number });
    sq("[data-sheet-meta]").textContent = [floorLabel(room.floor), typeName(room.type), `${code(e.status)} ${statusOf[e.status].name}`, e.at ? tx("since {time}", { time: e.at.slice(0, 10) === today() ? e.at.slice(11) : `${showDate(e.at.slice(0, 10))} ${e.at.slice(11)}` }) : ""].filter(Boolean).join(" · ");
    sheet.querySelectorAll("input[name='rs-status']").forEach((input) => { input.checked = input.value === e.status; });
    sheet.querySelectorAll("input[data-flag]").forEach((input) => { input.checked = e.flags.includes(input.value); });
    const people = [...new Set([...assignees(), ...(e.attendant ? [e.attendant] : [])])];
    fillSelect(attendantSelect, [["", cfg.text.unassigned], ...people.map((p) => [p, p])], e.attendant);
    if (document.activeElement !== noteInput) noteInput.value = e.note;
    startButton.disabled = !DIRTY.includes(e.status);
    startButton.textContent = e.started ? tx("Stop cleaning ({time})", { time: e.started.slice(11) }) : tx("Start cleaning");
    startButton.setAttribute("aria-pressed", String(Boolean(e.started)));
    inspectBox.hidden = e.status !== "vc";
    sq("[data-inspect-room]").textContent = tx("Open Room Inspection and type room {room}.", { room: room.number });
    oooBox.hidden = !OUT.includes(e.status);
    if (e.ooo) {
      reasonSelect.value = e.ooo.reason;
      backInput.value = e.ooo.back;
      sendButton.hidden = !Actions;
      sendButton.disabled = !e.ooo.reason;
      sendButton.textContent = e.ooo.sent ? tx("In the Action Tracker") : tx("Add to actions");
      if (e.ooo.sent) sendButton.disabled = true;
    }
    const list = sq("[data-sheet-history]");
    const mine = todayEvents().filter((ev) => ev.room === room.number);
    list.replaceChildren(...mine.slice(-12).reverse().map((ev) => el("li", null, `${ev.t} · ${kindText(ev)}${ev.who && ev.kind !== "attendant" ? ` · ${ev.who}` : ""}`)));
    sq("[data-sheet-history-head]").hidden = !mine.length;
  };
  const openSheet = (number) => {
    openRoom = number;
    sheetStatus.textContent = "";
    fillSheet();
    if (typeof sheet.showModal === "function") { if (!sheet.open) sheet.showModal(); } else sheet.setAttribute("open", "");
  };
  const closeSheet = () => {
    if (typeof sheet.close === "function" && sheet.open) sheet.close(); else sheet.removeAttribute("open");
  };
  sheet.addEventListener("close", () => {
    const back = [...boardBox.querySelectorAll("[data-room]")].find((button) => button.dataset.room === openRoom);
    openRoom = null;
    back?.focus();
  });
  sheet.addEventListener("click", (event) => { if (event.target === sheet) closeSheet(); });
  sq("[data-sheet-close]").addEventListener("click", closeSheet);
  sheet.addEventListener("change", (event) => {
    const input = event.target;
    if (!openRoom) return;
    if (input.name === "rs-status") applyChange(openRoom, { status: input.value });
    else if (input.dataset.flag !== undefined) applyChange(openRoom, { flag: input.value, on: input.checked }, { undo: false });
    else if (input === attendantSelect) applyChange(openRoom, { attendant: attendantSelect.value }, { undo: false });
    else if (input === noteInput) applyChange(openRoom, { note: noteInput.value }, { undo: false });
    else if (input === reasonSelect || input === backInput) applyChange(openRoom, { ooo: { reason: reasonSelect.value, back: parseDate(backInput.value) || "" } }, { undo: false });
    fillSheet();
  });
  startButton.addEventListener("click", () => {
    if (!openRoom) return;
    applyChange(openRoom, { start: !entryOf(openRoom).started }, { undo: false });
    fillSheet();
  });
  // OOO and OOS to the Action Tracker: one action per room and reason, for maintenance, with the floor as the area.
  const oooAction = (room, e) => ({
    title: `${tx("Room {room}", { room: room.number })} ${code(e.status)}: ${reasonName(e.ooo.reason)}`,
    detail: [e.note, e.ooo.back ? tx("Expected back on {date}", { date: showDate(e.ooo.back) }) : "", `${cfg.text.tool} · ${showDate(today())}`].filter(Boolean).join(" · "),
    owner: cfg.text.maintenanceOwner,
    due: e.ooo.back && e.ooo.back >= today() ? e.ooo.back : addDays(today(), 1),
    source: TOOL, check: cfg.text.checkText,
    area: floorLabel(room.floor),
    priority: e.status === "ooo" ? "High" : "Medium",
  });
  const unsent = () => state.rooms.filter((room) => { const e = entryOf(room.number); return OUT.includes(e.status) && e.ooo?.reason && !e.ooo.sent; });
  const sendOoo = (rooms) => {
    if (!Actions) return 0;
    let n = 0;
    rooms.forEach((room) => {
      const e = entryOf(room.number);
      if (!e.ooo?.reason || e.ooo.sent) return;
      if (Actions.add(oooAction(room, e))) n++;
      state.board[room.number] = { ...e, ooo: { ...e.ooo, sent: true } };
    });
    if (n) save();
    return n;
  };
  const trackerNote = (node, message) => {
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = Actions.trackerUrl().href;
    node.replaceChildren(`${message} `, link);
    clearTimeout(node.timer);
    node.timer = setTimeout(() => { node.textContent = ""; }, 8000);
  };
  sendButton.addEventListener("click", () => {
    const room = roomOf(openRoom);
    if (!room) return;
    const n = sendOoo([room]);
    renderAll();
    fillSheet();
    if (n) trackerNote(sheetStatus, tx("Added {n} actions.", { n: int.format(n) }));
  });
  boardBox.addEventListener("click", (event) => {
    const button = event.target.closest("[data-room]");
    if (button) openSheet(button.dataset.room);
  });

  // ---- Results ----
  const roomLine = (room, e, extra = "") => [`${room.number} · ${code(e.status)}`, ...e.flags.filter((f) => f !== "dnd").map((f) => flagOf[f]?.name), e.attendant, extra].filter(Boolean).join(" · ");
  const tierText = (tier) => [tx("Early arrival / priority"), tx("Departure, arrival today"), tx("Departure"), tx("VIP stay-over"), tx("Stay-over")][tier];
  // How long a departure or a clean room has waited; a stay-over has not been waiting, it is serviced in its turn.
  const sinceText = (e) => (e.status !== "od" && e.at && e.at.slice(0, 10) === today() ? tx("waiting since {time}", { time: e.at.slice(11) }) : "");
  const analysis = () => {
    const events = todayEvents();
    return {
      c: counts(state.rooms, state.board, typedArrivals()),
      t: turnaround(events),
      hours: byHour(events),
      queue: queue(state.rooms, state.board),
      inspect: inspectQueue(state.rooms, state.board),
      people: perAttendant(state.rooms, state.board, events),
      out: state.rooms.filter((room) => OUT.includes(entryOf(room.number).status)),
      progress: state.rooms.filter((room) => { const e = entryOf(room.number); return DIRTY.includes(e.status) && e.started; }),
      dnd: state.rooms.filter((room) => { const e = entryOf(room.number); return DIRTY.includes(e.status) && e.flags.includes("dnd") && !e.started; }),
      dueOut: state.rooms.filter((room) => entryOf(room.number).status === "do"),
      events,
    };
  };
  const perPerson = (r) => {
    const assigned = r.people.reduce((s, p) => s + p.assigned, 0);
    return { assigned, people: r.people.length, avg: r.people.length ? assigned / r.people.length : null };
  };
  const outText = (room) => {
    const e = entryOf(room.number);
    const overdue = e.ooo?.back && e.ooo.back < today();
    return [`${room.number} ${code(e.status)}`, reasonName(e.ooo?.reason) || tx("no reason yet"), e.ooo?.back ? `${tx("back on {date}", { date: showDate(e.ooo.back) })}${overdue ? ` (${tx("overdue")})` : ""}` : tx("no date yet"), e.note].filter(Boolean).join(" · ");
  };
  const summaryText = (r) => {
    const c = r.c;
    const pp = perPerson(r);
    const lines = [`${cfg.text.tool} · ${showDate(today())} ${clockNow()}`, ""];
    lines.push(`${tx("Rooms")}: ${int.format(c.total)} · ${tx("sellable")}: ${int.format(c.sellable)} · ${tx("out of order")}: ${int.format(c.ooo)} (${pct(c.oooShare, 1)}) · ${tx("out of service")}: ${int.format(c.oos)}`);
    lines.push(`${tx("Ready (VI)")}: ${int.format(c.ready)} · ${tx("arrivals expected")}: ${int.format(c.arrivals)} · ${tx("still needed")}: ${int.format(c.needed)}`);
    lines.push(`${tx("To clean")}: ${int.format(c.toClean)} (${tx("{a} departures, {b} stay-overs", { a: int.format(c.departures), b: int.format(c.stayovers) })}) · ${tx("in progress")}: ${int.format(c.inProgress)} · ${tx("to inspect")}: ${int.format(c.toInspect)}`);
    lines.push(`${tx("Due out")}: ${int.format(c.by.do)} · DND: ${int.format(c.dnd)}`);
    lines.push(`${tx("Departed → clean")}: ${minText(r.t.clean.avg)} (${tx("{n} rooms", { n: int.format(r.t.clean.n) })}) · ${tx("Clean → inspected")}: ${minText(r.t.inspect.avg)} (${tx("{n} rooms", { n: int.format(r.t.inspect.n) })})`);
    if (r.queue.length) lines.push("", `${tx("Next to clean")}:`, ...r.queue.slice(0, 10).map((item) => `- ${roomLine(item.room, item.entry, tierText(item.tier))}`));
    if (r.inspect.length) lines.push("", `${tx("To inspect")}:`, ...r.inspect.map((item) => `- ${roomLine(item.room, item.entry)}`));
    if (r.dnd.length) lines.push("", `DND: ${r.dnd.map((room) => room.number).join(", ")}`);
    if (r.out.length) lines.push("", `${tx("Out of order and out of service")}:`, ...r.out.map((room) => `- ${outText(room)}`));
    if (r.people.length) {
      lines.push("", `${tx("Rooms per attendant")}: ${pp.avg === null ? "–" : num(pp.avg, 1)}`);
      r.people.forEach((p) => lines.push(`- ${p.name}: ${tx("{a} of {b} rooms done", { a: int.format(p.done), b: int.format(p.assigned) })} · ${tx("{n} left", { n: int.format(p.left) })}`));
    }
    const notes = state.rooms.filter((room) => entryOf(room.number).note && !OUT.includes(entryOf(room.number).status));
    if (notes.length) lines.push("", `${tx("Notes")}:`, ...notes.map((room) => `- ${room.number}: ${entryOf(room.number).note}`));
    return lines.join("\n");
  };

  // Colours of the statuses in the chart, the same as the tiles (the code is always written on them too).
  const COLORS = ChartKit ? { vd: ChartKit.C.warn, co: "#f472b6", od: "#a78bfa", vc: ChartKit.C.soft, vi: ChartKit.C.ok, occ: ChartKit.C.muted, do: ChartKit.C.blue, ooo: ChartKit.C.danger, oos: "#94a3b8" } : {};
  const ORDER = ["vi", "vc", "vd", "co", "od", "do", "occ", "oos", "ooo"];
  const legendName = (status) => `${code(status)} ${statusOf[status].short}`;
  const queueList = (items, empty, extraOf) => {
    if (!items.length) return el("p", "form-note", empty);
    const list = el("ol", "rs-queue");
    items.forEach((item) => {
      const li = el("li");
      const button = el("button", `rs-queue-room is-${item.entry.status}`, item.room.number);
      button.type = "button";
      button.dataset.room = item.room.number;
      button.setAttribute("aria-label", tileLabel(item.room, item.entry));
      li.append(button, el("span", "rs-queue-code", code(item.entry.status)), el("span", "rs-queue-text", [extraOf(item), ...item.entry.flags.map((f) => flagOf[f]?.code), item.entry.attendant, sinceText(item.entry)].filter(Boolean).join(" · ")));
      list.append(li);
    });
    return list;
  };
  const renderResults = () => {
    results.replaceChildren();
    exampleBox.hidden = !state.example;
    exampleText.textContent = tx("A 40-room hotel at {time}: 15 arrivals, 14 departures, four attendants. Tap a room to change it; set up your own rooms and the example goes.", { time: cfg.example.time });
    if (!state.rooms.length) { results.hidden = true; return; }
    results.hidden = false;
    const r = analysis();
    const c = r.c;
    const pp = perPerson(r);
    const head = el("div", "result-head rs-head");
    head.append(el("p", "kicker", `${cfg.text.tool} · ${showDate(today())} · ${clockNow()}`));
    const h2 = el("h2");
    if (c.arrivals) h2.append(tx("{a} of {b}", { a: int.format(Math.min(c.ready, c.arrivals)), b: int.format(c.arrivals) }), el("span", null, ` · ${tx("arrivals have a ready room")}`));
    else h2.append(int.format(c.ready), el("span", null, ` · ${tx("rooms ready (VI)")}`));
    head.append(h2, el("p", "rs-meta", [tx("{n} rooms", { n: int.format(c.total) }), tx("{n} sellable", { n: int.format(c.sellable) }), c.needed ? tx("{n} more rooms needed for the arrivals", { n: int.format(c.needed) }) : tx("enough ready rooms for the arrivals")].join(" · ")));

    const stats = el("div", "dl-stats rs-stats");
    stats.append(stat(tx("Ready (VI)"), int.format(c.ready), tx("for {n} arrivals expected{typed}", { n: int.format(c.arrivals), typed: typedArrivals() === null ? "" : ` (${tx("typed")})` })));
    stats.append(stat(tx("To clean"), int.format(c.toClean), tx("{a} departures, {b} stay-overs", { a: int.format(c.departures), b: int.format(c.stayovers) }) + (c.dnd ? ` · DND ${int.format(c.dnd)}` : "")));
    stats.append(stat(tx("In progress"), int.format(c.inProgress), tx("{n} to inspect (VC)", { n: int.format(c.toInspect) })));
    stats.append(stat(tx("Out of order"), `${int.format(c.ooo)} · ${int.format(c.oos)}`, tx("OOO · OOS · {p} of the inventory out of order", { p: pct(c.oooShare, 1) })));
    stats.append(stat(tx("Departed → clean"), minText(r.t.clean.avg), tx("average today, {n} rooms", { n: int.format(r.t.clean.n) })));
    stats.append(stat(tx("Clean → inspected"), minText(r.t.inspect.avg), tx("average today, {n} rooms", { n: int.format(r.t.inspect.n) })));
    stats.append(stat(tx("Rooms per attendant"), pp.avg === null ? "–" : num(pp.avg, 1), tx("{a} rooms, {b} attendants", { a: int.format(pp.assigned), b: int.format(pp.people) })));

    // The two lists the shift works from: the next rooms to clean and the rooms waiting for the supervisor.
    const focus = el("article", "result-card rs-next");
    focus.append(el("p", "result-label", tx("Next to clean")));
    focus.append(queueList(r.queue.slice(0, 10), tx("No room waits for an attendant."), (item) => tierText(item.tier)));
    if (r.queue.length > 10) focus.append(el("p", "form-note", tx("and {n} more", { n: int.format(r.queue.length - 10) })));
    const notes = [r.progress.length ? tx("In progress: {rooms}", { rooms: r.progress.map((room) => `${room.number} (${entryOf(room.number).attendant || "–"}, ${entryOf(room.number).started.slice(11)})`).join(", ") }) : "",
      r.dnd.length ? tx("DND, not in the queue: {rooms}", { rooms: r.dnd.map((room) => room.number).join(", ") }) : "",
      r.dueOut.length ? tx("Due out, not checked out yet: {rooms}", { rooms: r.dueOut.map((room) => room.number).join(", ") }) : ""].filter(Boolean);
    notes.forEach((text) => focus.append(el("p", "rs-next-note", text)));
    focus.append(el("p", "result-label", tx("To inspect")));
    focus.append(queueList(r.inspect, tx("No room waits for inspection."), (item) => (item.entry.flags.includes("arrival") ? tx("arrival today") : "")));

    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy summary"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(summaryText(analysis()), copyButton));
    const printBoard = el("button", "button-secondary", tx("Print the board"));
    printBoard.type = "button";
    printBoard.addEventListener("click", () => printOnly(boardSheet));
    const printPeople = el("button", "button-secondary", tx("Print attendant sheets"));
    printPeople.type = "button";
    printPeople.addEventListener("click", () => printOnly(attendantSheets));
    actions.append(copyButton, printBoard, printPeople);
    const waiting = unsent();
    if (Actions && waiting.length) {
      const send = el("button", "button-secondary", tx("Send {n} OOO/OOS rooms to actions", { n: int.format(waiting.length) }));
      send.type = "button";
      send.addEventListener("click", () => {
        const n = sendOoo(unsent());
        renderAll();
        trackerNote(boardStatus, tx("Added {n} actions.", { n: int.format(n) }));
      });
      actions.append(send);
    }
    const planner = el("a", "button-ghost", tx("Open the Maintenance Planner"));
    planner.href = document.querySelector("a[data-maintenance]")?.href || new URL("../maintenance-planner/", window.location.href).href;
    actions.append(planner);

    const panels = [];
    if (ChartKit) {
      const floors = [...new Set(state.rooms.map((room) => room.floor))].sort(numeric);
      const used = ORDER.filter((s) => c.by[s] > 0);
      const p = panel(tx("Status mix by floor"), tx("Each column is a floor, each part a status; the number on top is the rooms of the floor."));
      p.classList.add("rs-panel-mix");
      p.append(ChartKit.figure(ChartKit.stacked(floors.map((floor) => ({
        label: floor ? floorLabel(floor) : "–",
        parts: used.map((s) => ({ key: legendName(s), value: state.rooms.filter((room) => room.floor === floor && entryOf(room.number).status === s).length })),
      })), { title: tx("Status mix by floor"), keys: used.map(legendName), colors: Object.fromEntries(used.map((s) => [legendName(s), COLORS[s]])) }), { fileName: "room-status-floors" }));
      panels.push(p);
      if (r.hours.length) {
        const hp = panel(tx("Turnaround by hour"), tx("Rooms checked out, cleaned and inspected in each hour of today. A gap between the lines is the backlog building up; the tip shows the average minutes of the hour."));
        hp.classList.add("rs-panel-hours");
        const avg = (list) => (list.length ? list.reduce((s, v) => s + v, 0) / list.length : null);
        const series = [
          { label: tx("Departed"), key: "departed", color: COLORS.co },
          { label: tx("Cleaned"), key: "cleaned", color: ChartKit.C.blue },
          { label: tx("Inspected"), key: "inspected", color: ChartKit.C.ok },
        ].map((s) => ({ label: s.label, color: s.color, points: r.hours.map((h) => ({ x: h.label, y: h[s.key], tip: [`${h.label} · ${s.label}: ${int.format(h[s.key])}`, s.key === "cleaned" && h.cleanMinutes.length ? `${tx("Departed → clean")} ${minText(avg(h.cleanMinutes))}` : "", s.key === "inspected" && h.inspectMinutes.length ? `${tx("Clean → inspected")} ${minText(avg(h.inspectMinutes))}` : ""].filter(Boolean).join(" · ") })) }));
        hp.append(ChartKit.figure(ChartKit.line(series, { title: tx("Turnaround by hour"), yMin: 0, format: (v) => num(v, 0) }), { fileName: "room-status-hours" }));
        panels.push(hp);
      }
    }
    if (r.people.length) {
      const p = panel(tx("Rooms per attendant"), tx("Rooms assigned and done today. A long bar with little done is the section to help first."));
      p.append(barList(r.people.map((g) => ({ key: g.name, value: g.assigned, done: g.done, left: g.left, inProgress: g.inProgress, departures: g.departures, stayovers: g.stayovers })), {
        label: (item) => [int.format(item.value), ` · ${tx("{a} departures, {b} stay-overs", { a: int.format(item.departures), b: int.format(item.stayovers) })} · ${tx("{n} done", { n: int.format(item.done) })} · ${tx("{n} left", { n: int.format(item.left) })}`],
      }));
      panels.push(p);
    }
    const op = panel(tx("Out of order and out of service"), r.out.length ? tx("OOO is out of the inventory until its date; OOS stays sellable. A date that has passed is marked overdue.") : tx("No room is out of order or out of service."));
    if (r.out.length) {
      const ul = el("ul", "rs-out");
      r.out.forEach((room) => {
        const li = el("li");
        const e = entryOf(room.number);
        if (e.ooo?.back && e.ooo.back < today()) li.classList.add("is-overdue");
        li.append(el("span", null, outText(room)));
        if (e.ooo?.sent) li.append(" ", el("span", "dl-tag", tx("in the Action Tracker")));
        ul.append(li);
      });
      op.append(ul);
    }
    panels.push(op);
    const changes = panel(tx("Today's changes"), r.events.length ? tx("The latest {n} of {m} changes today; the CSV of the history has all of the last 30 days.", { n: int.format(Math.min(15, r.events.length)), m: int.format(r.events.length) }) : tx("No change today yet."));
    if (r.events.length) {
      const ol = el("ol", "rs-changes");
      r.events.slice(-15).reverse().forEach((e) => ol.append(el("li", null, `${e.t} · ${e.room} · ${kindText(e)}${e.who && e.kind !== "attendant" ? ` · ${e.who}` : ""}`)));
      changes.append(ol);
    }
    panels.push(changes);
    window.ToolKit.resultLayout(results, { head, stats, focus, actions, panels });
  };
  results.addEventListener("click", (event) => {
    const button = event.target.closest("[data-room]");
    if (button) openSheet(button.dataset.room);
  });

  // ---- Printing: the board by floor (A4) and one sheet per attendant; the rest of the page is hidden meanwhile. ----
  const printOnly = (build) => {
    printBox.replaceChildren(...build());
    printBox.hidden = false;
    document.documentElement.classList.add("rs-printing");
    const done = () => {
      document.documentElement.classList.remove("rs-printing");
      printBox.hidden = true;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint (some phones) get the page back a moment later.
    setTimeout(done, 2000);
  };
  const boardSheet = () => {
    const c = counts(state.rooms, state.board, typedArrivals());
    const head = el("div", "rs-print-head");
    head.append(el("p", "kicker", cfg.text.tool), el("h2", null, `${showDate(today())} · ${clockNow()}`));
    head.append(el("p", "rs-print-meta", [tx("{a} ready for {b} arrivals", { a: int.format(c.ready), b: int.format(c.arrivals) }), tx("{n} to clean", { n: int.format(c.toClean) }), tx("{n} to inspect (VC)", { n: int.format(c.toInspect) }), `OOO ${int.format(c.ooo)} · OOS ${int.format(c.oos)}`].join(" · ")));
    const out = [head];
    [...new Set(state.rooms.map((room) => room.floor))].sort(numeric).forEach((floor) => {
      const section = el("section", "rs-print-floor");
      section.append(el("h3", null, floorLabel(floor)));
      const grid = el("div", "rs-print-grid");
      state.rooms.filter((room) => room.floor === floor).forEach((room) => {
        const e = entryOf(room.number);
        const cell = el("div", "rs-print-cell");
        cell.append(el("strong", null, room.number), el("span", "rs-print-code", code(e.status)), el("span", null, flagCodes(e).join(" ")), el("span", null, e.attendant));
        grid.append(cell);
      });
      section.append(grid);
      out.push(section);
    });
    out.push(el("p", "rs-print-legend", [...cfg.statuses.map((s) => `${s.code} = ${s.name}`), ...cfg.flags.map((f) => `${f.code} = ${f.name}`)].join(" · ")));
    return out;
  };
  // An attendant's sheet: the rooms in the order to do them (the queue first, then in progress, DND, due out, done),
  // with space to write the times and the remarks.
  const attendantSheets = () => {
    const order = new Map(queue(state.rooms, state.board).map((item, i) => [item.room.number, i]));
    const rank = (room) => {
      const e = entryOf(room.number);
      if (order.has(room.number)) return order.get(room.number);
      if (DIRTY.includes(e.status) && e.started) return 10000;
      if (DIRTY.includes(e.status)) return 20000;
      if (e.status === "do") return 30000;
      return 40000;
    };
    const groups = new Map();
    state.rooms.forEach((room) => {
      const e = entryOf(room.number);
      if (OUT.includes(e.status)) return;
      const name = e.attendant || (DIRTY.includes(e.status) || e.status === "do" ? cfg.text.unassigned : "");
      if (!name) return;
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(room);
    });
    return [...groups.entries()].sort(([a], [b]) => numeric(a, b)).map(([name, rooms]) => {
      const page = el("section", "rs-print-person");
      page.append(el("p", "kicker", `${cfg.text.tool} · ${showDate(today())}`), el("h2", null, name));
      const done = rooms.filter((room) => !DIRTY.includes(entryOf(room.number).status) && entryOf(room.number).status !== "do").length;
      page.append(el("p", "rs-print-meta", [tx("{n} rooms", { n: int.format(rooms.length) }), tx("{n} done", { n: int.format(done) })].join(" · ")));
      const table = el("table", "rs-print-table");
      const htr = el("tr");
      [tx("Room"), tx("Room type"), tx("Status"), tx("Flags"), tx("Note"), tx("Time in"), tx("Time out"), tx("Remarks")].forEach((text) => { const th = el("th", null, text); th.scope = "col"; htr.append(th); });
      const thead = el("thead");
      thead.append(htr);
      const tbody = el("tbody");
      [...rooms].sort((a, b) => rank(a) - rank(b) || numeric(a.number, b.number)).forEach((room) => {
        const e = entryOf(room.number);
        const tr = el("tr");
        tr.append(el("td", null, room.number), el("td", null, typeName(room.type)), el("td", null, code(e.status)), el("td", null, flagCodes(e).join(" ")), el("td", null, e.note), el("td", null, e.started ? e.started.slice(11) : ""), el("td"), el("td"));
        tbody.append(tr);
      });
      table.append(thead, tbody);
      page.append(table);
      return page;
    });
  };

  // ---- The example ----
  const exampleText = el("span");
  const clearExampleButton = el("button", "button-ghost", tx("Clear the example"));
  clearExampleButton.type = "button";
  exampleBox.append(el("strong", null, tx("Example")), " ", exampleText, " ", clearExampleButton);
  const loadExample = () => {
    const ex = exampleData(cfg.example, today());
    Object.assign(state, { rooms: ex.rooms, board: ex.board, history: ex.history, attendants: ex.attendants, arrivals: {}, filters: { ...NO_FILTERS }, day: today(), example: true });
    Object.entries(cfg.example.notes || {}).forEach(([room, note]) => { if (state.board[room]) state.board[room].note = note; });
  };
  const dropExample = () => Object.assign(state, { rooms: [], board: {}, history: {}, attendants: [], arrivals: {}, day: "", example: false });
  clearExampleButton.addEventListener("click", () => {
    dropExample();
    write(KEY, state);
    setupBox.open = true;
    renderAll();
  });

  const renderAll = () => {
    renderSetup();
    renderBoard();
    renderResults();
  };

  // ---- Events: setup ----
  const numberOf = (selector) => Number(q(selector).value);
  q("[data-generate]").addEventListener("click", () => {
    const rooms = generateRooms({ floorFrom: numberOf("#rs-floor-from"), floorTo: numberOf("#rs-floor-to"), roomFrom: numberOf("#rs-room-from"), roomTo: numberOf("#rs-room-to"), type: q("#rs-gen-type").value });
    if (!rooms.length) { flash(roomsStatus, tx("Give the floors and the rooms as numbers.")); return; }
    addRooms(rooms);
    flash(roomsStatus, tx("{n} rooms added or updated: {first} to {last}.", { n: int.format(rooms.length), first: rooms[0].number, last: rooms.at(-1).number }));
  });
  q("[data-import-rooms]").addEventListener("click", () => {
    const { rooms, skipped } = parseRooms(pasteInput.value, cfg.roomTypes);
    if (!rooms.length) { flash(roomsStatus, tx("No room numbers found. One room per line: number, type, floor.")); pasteInput.focus(); return; }
    addRooms(rooms);
    pasteInput.value = "";
    flash(roomsStatus, skipped ? tx("{n} rooms imported, {m} lines skipped.", { n: int.format(rooms.length), m: int.format(skipped) }) : tx("{n} rooms imported.", { n: int.format(rooms.length) }));
  });
  fromInspection.addEventListener("click", () => {
    const rooms = inspectionRooms();
    if (!rooms.length) return;
    const people = team();
    addRooms(rooms);
    if (!state.attendants.length && people.length) { state.attendants = people.map((a) => ({ name: a.name, floors: a.floors.filter((f) => /^\d{1,2}$/.test(f)) })); save(); renderAll(); }
    flash(roomsStatus, tx("{n} rooms imported.", { n: int.format(rooms.length) }));
  });
  q("[data-clear]").addEventListener("click", () => {
    if (!state.rooms.length || !window.confirm(tx("Clear the rooms, the board and its history in this browser? The attendants stay."))) return;
    const attendants = state.example ? [] : state.attendants;
    dropExample();
    state.attendants = attendants;
    write(KEY, state);
    setupBox.open = true;
    renderAll();
  });
  attendantsInput.addEventListener("input", () => { state.attendants = parseNames(attendantsInput.value); save(); renderSetup(); if (state.rooms.length) renderFilters(); });
  arrivalsInput.addEventListener("change", () => {
    const n = Number(arrivalsInput.value);
    state.arrivals = arrivalsInput.value.trim() !== "" && Number.isInteger(n) && n >= 0 ? { date: today(), n: Math.min(n, 9999) } : {};
    save();
    renderAll();
  });
  // Every room that has work today and no attendant goes to the attendant of its floor's section.
  q("[data-assign]").addEventListener("click", () => {
    const people = team();
    let n = 0;
    const ctx = { date: today(), time: clockNow() };
    state.rooms.forEach((room) => {
      const e = entryOf(room.number);
      if (e.attendant || !(DIRTY.includes(e.status) || e.status === "do")) return;
      const name = sectionOf(people, room.floor);
      if (!name) return;
      const r = transition(e, { attendant: name }, ctx, room.number);
      state.board[room.number] = r.entry;
      state.history[ctx.date] = [...(state.history[ctx.date] || []), ...r.events];
      n++;
    });
    if (n) { save(); renderAll(); }
    flash(roomsStatus, n ? tx("{n} rooms assigned by section.", { n: int.format(n) }) : tx("No room to assign: give the attendants their floors (Marta; 1, 2)."));
  });

  // ---- Events: board ----
  filterStatus.addEventListener("change", () => { state.filters.status = filterStatus.value; write(KEY, state); renderBoard(); });
  filterFloor.addEventListener("change", () => { state.filters.floor = filterFloor.value; write(KEY, state); renderBoard(); });
  filterAttendant.addEventListener("change", () => { state.filters.attendant = filterAttendant.value; write(KEY, state); renderBoard(); });
  filterPriority.addEventListener("change", () => { state.filters.priority = filterPriority.checked; write(KEY, state); renderBoard(); });
  q("[data-new-day]").addEventListener("click", () => {
    const ctx = { date: today(), time: clockNow() };
    const r = newDay(state.board, ctx);
    state.board = r.board;
    state.history[ctx.date] = [...(state.history[ctx.date] || []), ...r.events];
    state.history = trimHistory(state.history, ctx.date, DAYS);
    state.day = ctx.date;
    save();
    renderAll();
    flash(boardStatus, tx("Today's board is started: {n} stay-overs need service.", { n: int.format(Object.values(state.board).filter((e) => e.status === "od").length) }));
  });
  q("[data-example]").addEventListener("click", () => {
    loadExample();
    renderAll();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });

  // ---- Import from the PMS ----
  q("[data-import]").addEventListener("click", () => {
    if (!state.rooms.length) { flash(importStatus, tx("Set up the rooms first.")); return; }
    const parsed = parseImport(importInput.value, cfg.statuses, state.rooms.map((room) => room.number));
    let changed = 0;
    parsed.updates.forEach((u) => { if (applyChange(u.room, { status: u.status }, { undo: false, render: false })) changed++; });
    if (changed) { save(); renderAll(); }
    const lines = [tx("{n} rooms read, {m} changed.", { n: int.format(parsed.updates.length), m: int.format(changed) })];
    if (parsed.unknownCodes.length) lines.push(tx("Codes not known, left as they were: {list}", { list: parsed.unknownCodes.map((u) => `${u.room} “${u.code || "–"}”`).join(", ") }));
    if (parsed.unknownRooms.length) lines.push(tx("Rooms not on the board: {list}", { list: parsed.unknownRooms.map((u) => u.room).join(", ") }));
    if (parsed.skipped) lines.push(tx("{n} lines without a room number skipped.", { n: int.format(parsed.skipped) }));
    importStatus.replaceChildren(...lines.map((line) => el("span", "rs-import-line", line)));
    if (!parsed.unknownCodes.length && !parsed.unknownRooms.length) importInput.value = "";
  });

  // ---- Exports ----
  const boardRows = () => {
    const rows = [[tx("Room"), tx("Floor"), tx("Room type"), tx("Code"), tx("Status"), tx("Since"), tx("Flags"), tx("Room attendant"), tx("Cleaning started"), tx("Note"), tx("Reason"), tx("Back in order")]];
    state.rooms.forEach((room) => {
      const e = entryOf(room.number);
      rows.push([room.number, room.floor, typeName(room.type), code(e.status), statusOf[e.status].name, e.at, e.flags.map((f) => flagOf[f]?.name).join(", "), e.attendant, e.started, e.note, reasonName(e.ooo?.reason), e.ooo?.back || ""]);
    });
    return rows;
  };
  const historyRows = () => {
    const rows = [[tx("Date"), tx("Time"), tx("Room"), tx("Change"), tx("Before"), tx("After"), tx("Room attendant")]];
    Object.entries(state.history).forEach(([day, list]) => list.forEach((e) => {
      const kind = e.kind === "flag" ? flagOf[e.flag]?.name || e.flag : { status: tx("Status"), start: tx("Cleaning started"), attendant: tx("Room attendant"), note: tx("Note"), ooo: tx("Reason") }[e.kind];
      const value = (v) => (e.kind === "status" ? code(v) : e.kind === "ooo" ? reasonName(v) : e.kind === "flag" ? (v === "on" ? tx("on") : tx("off")) : v);
      rows.push([day, e.t, e.room, kind, value(e.from), `${value(e.to)}${e.back ? ` · ${e.back}` : ""}`, e.who]);
    }));
    return rows;
  };
  q("[data-csv]").addEventListener("click", () => { if (state.rooms.length) downloadCsv(cfg.text.csvName, boardRows()); });
  q("[data-xlsx]").addEventListener("click", () => { if (state.rooms.length) downloadXlsx(cfg.text.csvName, boardRows()); });
  q("[data-history-csv]").addEventListener("click", () => { if (Object.keys(state.history).length) downloadCsv(cfg.text.historyName, historyRows()); });

  // Another tab or a Team sync changed the board: read it again.
  window.addEventListener("storage", (event) => {
    if (event.key !== KEY) return;
    Object.assign(state, tidy(loadState(KEY, DEFAULTS)));
    renderAll();
    if (openRoom) fillSheet();
  });
  // The board's clock and "today" move on: the numbers are drawn again every minute while the page is visible.
  setInterval(() => { if (document.visibilityState !== "hidden" && !openRoom && !root.contains(document.activeElement)) renderAll(); }, 60000);

  // A first visit opens on the example, so the board is visible at once; nothing is written until the visitor acts.
  // An example saved on another day starts again at today's mid-morning.
  if (!state.rooms.length && firstVisit(KEY)) loadExample();
  else if (state.example && state.day !== today()) loadExample();
  setupBox.open = !state.rooms.length;
  renderAll();
})();
