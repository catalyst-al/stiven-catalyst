// Room Inspection: the housekeeping supervisor checks a cleaned room before it is released. Each item of the checklist
// is pass, fail or n.a., weighted 1 to 3; a failed critical item fails the room on its own, otherwise the room passes at
// the pass mark (90 % by default). Failed items go back to the attendant (re-clean) or to maintenance (the Action
// Tracker). The trend per attendant, floor, room type and week shows where to coach. The arithmetic lives in
// window.RoomInspectionMath, so tests can call it.
(() => {
  const ANSWERS = ["pass", "fail", "na"];
  const FIXES = ["reclean", "maintenance"];
  // Rooms a generator may make at once: 99 floors of 99 rooms is far beyond any hotel and keeps a typo from hanging the page.
  const MAX_ROOMS = 3000;

  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return iso;
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const mondayOf = (iso) => {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return iso;
    date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
    return date.toISOString().slice(0, 10);
  };
  const weightOf = (value) => {
    const n = Math.round(Number(value));
    return n >= 1 && n <= 3 ? n : 1;
  };
  const qidOf = (zone, index) => `${zone}-${index}`;
  const zoneOfQid = (qid) => String(qid).split("-")[0];
  // The items of a checklist, zone by zone, each with its id ("bathroom-0"), weight and whether it is critical.
  // An item without text (a new line in the editor) is not asked; the others keep their position in the id.
  const itemsOf = (tpl, zones) => zones.flatMap((zone) => (Array.isArray(tpl?.questions?.[zone]) ? tpl.questions[zone] : [])
    .map((item, index) => ({
      qid: qidOf(zone, index), zone, index, text: String(typeof item === "string" ? item : item?.text ?? "").trim(),
      weight: item?.critical === true ? 3 : weightOf(item?.weight), critical: item?.critical === true,
      fix: item?.fix === "maintenance" ? "maintenance" : "reclean",
    }))
    .filter((item) => item.text));
  // The score is the share of the weight that passed, of the items that were judged (n.a. and unchecked items are left out).
  const score = (answers, items) => {
    let passW = 0, failW = 0, pass = 0, fail = 0, na = 0;
    const critical = [], failed = [];
    items.forEach((item) => {
      const answer = answers?.[item.qid];
      if (answer === "pass") { pass++; passW += item.weight; }
      else if (answer === "fail") { fail++; failW += item.weight; failed.push(item.qid); if (item.critical) critical.push(item.qid); }
      else if (answer === "na") na++;
    });
    return { pct: passW + failW ? passW / (passW + failW) : null, passW, failW, pass, fail, na, answered: pass + fail, open: items.length - pass - fail - na, total: items.length, critical, failed };
  };
  const verdict = (scored, threshold) => {
    if (!scored || scored.pct === null) return { pass: null, reason: "" };
    if (scored.critical.length) return { pass: false, reason: "critical" };
    if (scored.pct < threshold - 1e-9) return { pass: false, reason: "score" };
    return { pass: true, reason: "" };
  };
  const priorityOf = (item) => (item.critical || item.weight >= 3 ? "High" : item.weight === 2 ? "Medium" : "Low");
  const byTime = (a, b) => `${a.date} ${a.time || ""}`.localeCompare(`${b.date} ${b.time || ""}`);

  // Every inspection with its score and verdict; a room inspected again on the day it failed is a re-check, so it does
  // not count for the first-time pass rate (the rate the attendant can be coached on).
  const annotate = (rows, itemsFor, threshold) => {
    const failedRooms = new Set();
    return [...rows].sort(byTime).map((row) => {
      const s = score(row.answers, itemsFor(row));
      const v = verdict(s, threshold);
      const key = `${row.date}|${String(row.room).toLowerCase()}`;
      const recheck = failedRooms.has(key);
      if (v.pass === false) failedRooms.add(key);
      const flags = row.flags || {};
      const recleans = s.failed.filter((qid) => flags[qid] !== "maintenance").length;
      const maintenance = s.failed.filter((qid) => flags[qid] === "maintenance").length;
      return { ...row, s, pass: v.pass, reason: v.reason, recheck, recleans, maintenance };
    });
  };
  // Per group (attendant, floor, room type): inspections, first inspections, how many of those passed, the average score.
  const rateBy = (list, keyOf) => {
    const groups = new Map();
    list.forEach((row) => {
      const key = keyOf(row);
      if (key === null || key === undefined || key === "") return;
      if (!groups.has(key)) groups.set(key, { key, n: 0, first: 0, firstPass: 0, sum: 0, scored: 0 });
      const g = groups.get(key);
      g.n++;
      if (row.s.pct !== null) { g.sum += row.s.pct; g.scored++; }
      if (!row.recheck && row.pass !== null) { g.first++; if (row.pass) g.firstPass++; }
    });
    return [...groups.values()].map((g) => ({ key: g.key, n: g.n, first: g.first, firstPass: g.firstPass, rate: g.first ? g.firstPass / g.first : null, avg: g.scored ? g.sum / g.scored : null }));
  };
  const overall = (list) => rateBy(list, () => "all")[0] || { n: 0, first: 0, firstPass: 0, rate: null, avg: null };
  const weekly = (list) => rateBy(list, (row) => mondayOf(row.date)).sort((a, b) => a.key.localeCompare(b.key)).map((g) => ({ week: g.key, ...g }));
  // The failed items, most often first, with their share and the cumulative share; the vital few are the items that
  // make up the first 80 % (the item that crosses 80 % is one of them).
  const itemPareto = (list, keyOf = (row, qid) => `${row.template}|${qid}`) => {
    const counts = new Map();
    let total = 0;
    list.forEach((row) => row.s.failed.forEach((qid) => {
      const key = keyOf(row, qid);
      counts.set(key, (counts.get(key) || 0) + 1);
      total++;
    }));
    let cum = 0;
    return [...counts].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).map(([key, count]) => {
      const before = cum;
      cum += count;
      return { key, count, share: count / total, cum: cum / total, vital: before / total < 0.8 };
    });
  };
  // Floor × zone: failed answers out of judged answers.
  const heat = (list, itemsFor) => {
    const cells = {};
    const floors = new Set();
    list.forEach((row) => {
      const floor = String(row.floor || "");
      if (!floor) return;
      floors.add(floor);
      itemsFor(row).forEach((item) => {
        const answer = row.answers?.[item.qid];
        if (answer !== "pass" && answer !== "fail") return;
        const key = `${floor}|${item.zone}`;
        if (!cells[key]) cells[key] = { fail: 0, answered: 0 };
        cells[key].answered++;
        if (answer === "fail") cells[key].fail++;
      });
    });
    return { floors: [...floors].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b)), cells };
  };

  // Rooms. The floor is the number without its last two digits (412 is on floor 4, 1203 on floor 12).
  const floorOf = (number) => {
    const digits = String(number).trim().match(/^(\d+)\d{2}$/);
    return digits ? String(Number(digits[1])) : "";
  };
  const numeric = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true });
  const sortRooms = (rooms) => [...rooms].sort((a, b) => numeric(a.floor, b.floor) || numeric(a.number, b.number));
  const generateRooms = ({ floorFrom, floorTo, roomFrom, roomTo, type }) => {
    const f1 = Math.max(0, Math.min(Math.round(floorFrom), Math.round(floorTo))), f2 = Math.min(99, Math.max(Math.round(floorFrom), Math.round(floorTo)));
    const r1 = Math.max(0, Math.min(Math.round(roomFrom), Math.round(roomTo))), r2 = Math.min(99, Math.max(Math.round(roomFrom), Math.round(roomTo)));
    if (![f1, f2, r1, r2].every(Number.isFinite)) return [];
    const rooms = [];
    for (let f = f1; f <= f2; f++) for (let r = r1; r <= r2; r++) {
      if (rooms.length >= MAX_ROOMS) return rooms;
      rooms.push({ number: `${f}${String(r).padStart(2, "0")}`, floor: String(f), type });
    }
    return rooms;
  };
  // Rooms added to a list: the same number takes the new floor and type.
  const mergeRooms = (list, add) => {
    const map = new Map(list.map((room) => [room.number.toLowerCase(), room]));
    add.forEach((room) => map.set(room.number.toLowerCase(), room));
    return sortRooms([...map.values()]).slice(0, MAX_ROOMS);
  };
  // A pasted room list, one room per line: "412", "412 suite", "412; 4; Suite" or the columns of a spreadsheet. The
  // type is matched by its key or its name in any case; a line without a digit in its first cell (a header) is skipped.
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
  // Names, one per line; an attendant may name the floors of their section after a semicolon ("Marta; 1, 2").
  const parseNames = (text) => {
    const seen = new Set();
    return String(text ?? "").split(/\r?\n/).map((line) => {
      const [name, floors = ""] = line.split(/[;\t]/);
      return { name: String(name).trim().slice(0, 60), floors: [...new Set(floors.split(/[,\s]+/).map((f) => f.trim()).filter((f) => /^\d{1,2}$/.test(f)).map((f) => String(Number(f))))] };
    }).filter((item) => item.name && !seen.has(item.name.toLowerCase()) && seen.add(item.name.toLowerCase()));
  };
  const namesText = (list) => list.map((item) => (item.floors?.length ? `${item.name}; ${item.floors.join(", ")}` : item.name)).join("\n");

  // The example: a seeded random walk through two weeks of a hotel, so every visitor sees the same numbers.
  const random = (seed) => {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const exampleData = (spec, templates, zones, end, threshold) => {
    const rand = random(spec.seed);
    const pick = (list) => list[Math.floor(rand() * list.length)];
    const typed = (floor, n) => (spec.types.find((rule) => n >= rule.from && n <= rule.to && (!rule.floors || rule.floors.includes(floor))) || {}).type || spec.default;
    const rooms = [];
    for (let f = spec.floors[0]; f <= spec.floors[1]; f++) for (let r = spec.rooms[0]; r <= spec.rooms[1]; r++) rooms.push({ number: `${f}${String(r).padStart(2, "0")}`, floor: String(f), type: typed(f, r) });
    const kinds = Object.entries(spec.kinds);
    const kindOf = () => { let x = rand(); for (const [key, share] of kinds) { x -= share; if (x < 0) return key; } return kinds[0][0]; };
    const time = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    const rows = [];
    for (let d = spec.days - 1; d >= 0; d--) {
      const date = addDays(end, -d);
      const day = spec.days - 1 - d;
      const count = spec.perDay[0] + Math.floor(rand() * (spec.perDay[1] - spec.perDay[0] + 1));
      let minutes = 9 * 60 + 30;
      for (let k = 0; k < count; k++) {
        minutes += 20 + Math.floor(rand() * 26);
        const attendant = pick(spec.attendants);
        const floor = String(attendant.floors[0]);
        const room = pick(rooms.filter((r) => r.floor === floor));
        const template = room.type === "suite" ? "suite" : "standard";
        const items = itemsOf(templates[template], zones);
        // A new attendant learns: the second week is better than the first.
        const factor = attendant.factor * (attendant.learning && day >= 7 ? 0.55 : 1);
        const answers = {}, notes = {}, flags = {};
        items.forEach((item) => {
          if (item.qid === "windows-3" && room.type !== "suite") { answers[item.qid] = "na"; return; }
          const rate = spec.recurring[item.qid] ?? (item.critical ? spec.critical : spec.base);
          if (rand() < rate * factor) {
            answers[item.qid] = "fail";
            flags[item.qid] = item.fix;
            if (spec.notes[item.qid]) notes[item.qid] = spec.notes[item.qid];
          } else answers[item.qid] = "pass";
        });
        const base = { date, room: room.number, floor, roomType: room.type, attendant: attendant.name, inspector: pick(spec.inspectors), kind: kindOf(), template, sent: {} };
        rows.push({ ...base, id: `ex-${rows.length}`, time: time(minutes), answers, notes, flags });
        const v = verdict(score(answers, items), threshold);
        if (v.pass === false && rand() < spec.recheck) {
          const again = Object.fromEntries(Object.entries(answers).map(([qid, answer]) => [qid, answer === "na" ? "na" : "pass"]));
          rows.push({ ...base, id: `ex-${rows.length}`, time: time(Math.min(minutes + 35, 23 * 60)), answers: again, notes: {}, flags: {} });
        }
      }
    }
    return {
      rooms,
      attendants: spec.attendants.map((a) => ({ name: a.name, floors: a.floors.map(String) })),
      inspectors: [...spec.inspectors],
      rows: rows.sort(byTime),
    };
  };

  window.RoomInspectionMath = { ANSWERS, FIXES, addDays, mondayOf, weightOf, itemsOf, score, verdict, priorityOf, annotate, rateBy, overall, weekly, itemPareto, heat, floorOf, generateRooms, mergeRooms, parseRooms, parseNames, namesText, random, exampleData };

  const dataEl = document.getElementById("room-inspection-data");
  const root = document.querySelector("[data-room-inspection]");
  if (!dataEl || !root || !window.ToolKit) return;
  const { tx, num, pct, showDate, dayMonth, write, loadState, isObject, str, el, int, today, parseDate, flash, undoNote, panel, stat, barList, focusCard, resultActions, resultLayout, exampleNote, exampleStamp, exampleMatches, firstVisit, downloadCsv, downloadXlsx } = window.ToolKit;
  const ChartKit = window.ChartKit;
  const Actions = window.ActionsStore;
  const Capture = window.FloorCapture;
  const media = window.MediaStore;
  const photos = Boolean(Capture && media && media.supported());
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const TOOL = "room-inspection";
  const ZONES = cfg.zones.map((zone) => zone.key);
  const zoneOf = Object.fromEntries(cfg.zones.map((zone) => [zone.key, zone]));
  const TEMPLATES = Object.keys(cfg.templates);
  const TYPES = cfg.roomTypes.map((type) => type.key);
  const typeName = (key) => cfg.roomTypes.find((type) => type.key === key)?.name || "";
  const KINDS = cfg.kinds.map((kind) => kind.key);
  const kindName = (key) => cfg.kinds.find((kind) => kind.key === key)?.name || key;
  const id = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const nowTime = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
  const isTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

  // State: the rooms, the team, the pass mark, the chosen checklist and the team's own ones (custom, keyed "custom-…"),
  // the inspection in progress (draft) and the saved inspections (rows).
  const blankDraft = (keep = {}) => ({ room: "", date: parseDate(keep.date) || today(), time: nowTime(), attendant: "", auto: false, inspector: str(keep.inspector), kind: KINDS.includes(keep.kind) ? keep.kind : KINDS[0], answers: {}, notes: {}, flags: {} });
  const state = loadState(KEY, { rooms: [], attendants: [], inspectors: [], threshold: cfg.threshold, template: "", custom: {}, draft: {}, rows: [], period: "30", example: {} });
  // An own checklist (saved here or opened from a template file): items per zone with a text, a weight and a flag.
  const cleanItem = (raw) => {
    const item = typeof raw === "string" ? { text: raw } : isObject(raw) ? raw : null;
    if (!item) return null;
    const critical = item.critical === true;
    return { text: str(item.text).slice(0, 300), weight: critical ? 3 : weightOf(item.weight), ...(critical ? { critical: true } : {}), fix: item.fix === "maintenance" ? "maintenance" : "reclean" };
  };
  const cleanTemplate = (raw) => {
    if (!isObject(raw) || !isObject(raw.questions)) return null;
    const questions = Object.fromEntries(ZONES.map((zone) => [zone, (Array.isArray(raw.questions[zone]) ? raw.questions[zone] : []).map(cleanItem).filter(Boolean).slice(0, 30)]));
    if (!Object.values(questions).some((list) => list.some((item) => item.text.trim()))) return null;
    return { name: str(raw.name).trim().slice(0, 80) || tx("Own checklist"), roomTypes: (Array.isArray(raw.roomTypes) ? raw.roomTypes : []).filter((type) => TYPES.includes(type)), questions };
  };
  state.custom = Object.fromEntries(Object.entries(state.custom).filter(([key]) => key.startsWith("custom-")).map(([key, tpl]) => [key, cleanTemplate(tpl)]).filter(([, tpl]) => tpl));
  const isTemplate = (name) => TEMPLATES.includes(name) || Object.prototype.hasOwnProperty.call(state.custom, name);
  if (!isTemplate(state.template)) state.template = TEMPLATES[0];
  if (!["7", "30", "all"].includes(state.period)) state.period = "30";
  if (!(state.threshold >= 0.5 && state.threshold <= 1)) state.threshold = cfg.threshold;
  // Saved data can be damaged; keep only what has the expected shape.
  const cleanRoom = (room) => (isObject(room) && str(room.number).trim() ? { number: str(room.number).trim().slice(0, 12), floor: str(room.floor).trim().slice(0, 4), type: TYPES.includes(room.type) ? room.type : "double" } : null);
  state.rooms = sortRooms(state.rooms.map(cleanRoom).filter(Boolean)).slice(0, MAX_ROOMS);
  state.attendants = state.attendants.filter(isObject).map((a) => ({ name: str(a.name).trim().slice(0, 60), floors: (Array.isArray(a.floors) ? a.floors : []).map(String).filter((f) => /^\d{1,2}$/.test(f)) })).filter((a) => a.name);
  state.inspectors = state.inspectors.map(str).map((name) => name.trim().slice(0, 60)).filter(Boolean);
  const cleanMap = (map, valid) => Object.fromEntries(Object.entries(isObject(map) ? map : {}).filter(([qid, value]) => /^[a-z]+-\d+$/.test(qid) && valid(value)));
  const cleanAnswers = (map) => cleanMap(map, (v) => ANSWERS.includes(v));
  const cleanNotes = (map) => Object.fromEntries(Object.entries(cleanMap(map, (v) => typeof v === "string" && v.trim())).map(([k, v]) => [k, v.trim().slice(0, 300)]));
  const cleanFlags = (map) => cleanMap(map, (v) => FIXES.includes(v));
  state.rows = state.rows.filter(isObject).map((row) => ({
    id: str(row.id) || id("r"), date: parseDate(row.date) || "", time: isTime(row.time) ? row.time : "", room: str(row.room).trim().slice(0, 40), floor: str(row.floor).slice(0, 4),
    roomType: TYPES.includes(row.roomType) ? row.roomType : "", attendant: str(row.attendant).slice(0, 60), inspector: str(row.inspector).slice(0, 60),
    kind: KINDS.includes(row.kind) ? row.kind : KINDS[0], template: isTemplate(row.template) ? row.template : TEMPLATES[0],
    answers: cleanAnswers(row.answers), notes: cleanNotes(row.notes), flags: cleanFlags(row.flags), sent: cleanMap(row.sent, (v) => v === true),
  })).filter((row) => row.date && row.room).sort(byTime);
  const saved = isObject(state.draft) ? state.draft : {};
  state.draft = { ...blankDraft(saved), room: str(saved.room).slice(0, 40), time: isTime(saved.time) ? saved.time : nowTime(), attendant: str(saved.attendant).slice(0, 60), auto: saved.auto === true, answers: cleanAnswers(saved.answers), notes: cleanNotes(saved.notes), flags: cleanFlags(saved.flags) };
  const save = () => write(KEY, state);

  const templateOf = (name) => state.custom[name] || cfg.templates[name] || cfg.templates[TEMPLATES[0]];
  const itemsFor = (row) => itemsOf(templateOf(row.template), ZONES);
  const draftItems = () => itemsOf(templateOf(state.template), ZONES);
  const itemByKey = (template, qid) => itemsOf(templateOf(template), ZONES).find((item) => item.qid === qid) || null;
  const roomOf = (number) => state.rooms.find((room) => room.number.toLowerCase() === String(number).trim().toLowerCase()) || null;
  // The checklist of a room type: the team's own one first, then the built-in one, else the first.
  const templateForType = (type) => {
    const own = Object.entries(state.custom).find(([, tpl]) => tpl.roomTypes.includes(type));
    if (own) return own[0];
    return TEMPLATES.find((key) => (cfg.templates[key].roomTypes || []).includes(type)) || TEMPLATES[0];
  };
  const draftStarted = () => Object.keys(state.draft.answers).length > 0;

  // Elements.
  const q = (selector) => root.querySelector(selector);
  const setupBox = q("[data-setup]");
  const setupCount = q("[data-setup-count]");
  const roomsStatus = q("[data-rooms-status]");
  const pasteInput = q("#ri-room-paste");
  const attendantsInput = q("#ri-attendants");
  const inspectorsInput = q("#ri-inspectors");
  const thresholdInput = q("#ri-threshold");
  const roomInput = q("#ri-room");
  const dateInput = q("#ri-date");
  const timeInput = q("#ri-time");
  const attendantInput = q("#ri-attendant");
  const inspectorInput = q("#ri-inspector");
  const kindSelect = q("#ri-kind");
  const templateSelect = q("#ri-template");
  const roomNote = q("[data-room-note]");
  const live = q("[data-live]");
  const zonesBox = q("[data-zones]");
  const saveButton = q("[data-save]");
  const restButton = q("[data-rest-pass]");
  const walkStatus = q("[data-walk-status]");
  const logBody = q("[data-log]");
  const logWrap = q("[data-log-wrap]");
  const logEmpty = q("[data-log-empty]");
  const logCount = q("[data-log-count]");
  const logStatus = q("[data-log-status]");
  const periodSelect = q("#ri-period");
  const results = document.querySelector("[data-results]");
  const printBox = document.querySelector("[data-print]");
  const fillList = (list, values) => list.replaceChildren(...values.map((value) => el("option", null, value)));

  // Setup.
  const thresholdText = () => pct(state.threshold, 0);
  let packs = null;
  const renderSetup = () => {
    const floors = new Set(state.rooms.map((room) => room.floor).filter(Boolean));
    setupCount.textContent = state.rooms.length ? tx("{rooms} rooms on {floors} floors · {people} attendants", { rooms: int.format(state.rooms.length), floors: int.format(floors.size), people: int.format(state.attendants.length) }) : tx("No rooms yet");
    if (document.activeElement !== attendantsInput) attendantsInput.value = namesText(state.attendants);
    if (document.activeElement !== inspectorsInput) inspectorsInput.value = state.inspectors.join("\n");
    if (document.activeElement !== thresholdInput) thresholdInput.value = String(Math.round(state.threshold * 100));
    fillList(q("#ri-room-list"), state.rooms.slice(0, 1000).map((room) => room.number));
    fillList(q("#ri-attendant-list"), state.attendants.map((a) => a.name));
    fillList(q("#ri-inspector-list"), state.inspectors);
  };
  const renderDraftFields = () => {
    if (packs) packs.syncOptions();
    templateSelect.value = state.template;
    roomInput.value = state.draft.room;
    dateInput.value = state.draft.date;
    timeInput.value = state.draft.time;
    attendantInput.value = state.draft.attendant;
    inspectorInput.value = state.draft.inspector;
    kindSelect.value = state.draft.kind;
    renderRoomNote();
  };
  const renderRoomNote = () => {
    const room = roomOf(state.draft.room);
    const tpl = templateOf(state.template);
    if (!state.draft.room) roomNote.textContent = tx("Scan the code on the door or type the room number.");
    else if (room) roomNote.textContent = [tx("Floor {n}", { n: room.floor || "–" }), typeName(room.type), tpl.name].join(" · ");
    else roomNote.textContent = [tx("Not in the room list"), floorOf(state.draft.room) ? tx("Floor {n}", { n: floorOf(state.draft.room) }) : "", tpl.name].filter(Boolean).join(" · ");
  };

  // The checklist: one fieldset per zone, one row per item with pass, fail and n.a.; a failed item opens its note, its
  // flag (re-clean or maintenance) and its photo. The rows stay in place while the supervisor taps through the room.
  let controls = [];
  const dropControls = () => { controls.forEach((control) => control.destroy()); controls = []; };
  const answerText = { pass: () => tx("Pass"), fail: () => tx("Fail"), na: () => tx("n.a.") };
  const fixText = { reclean: () => tx("Re-clean"), maintenance: () => tx("Maintenance") };
  const zoneProgress = (zone) => {
    const items = draftItems().filter((item) => item.zone === zone);
    const s = score(state.draft.answers, items);
    const done = s.pass + s.fail + s.na;
    return `${tx("{a} of {b} checked", { a: int.format(done), b: int.format(items.length) })}${s.fail ? ` · ${s.fail === 1 ? tx("1 fault") : tx("{n} faults", { n: int.format(s.fail) })}` : ""}`;
  };
  const detailFor = (row, item) => {
    let detail = row.querySelector(".ri-detail");
    if (detail) return detail;
    detail = el("div", "ri-detail");
    const note = el("input", "ri-note");
    note.type = "text";
    note.autocomplete = "off";
    note.placeholder = cfg.text.notePlaceholder;
    note.value = state.draft.notes[item.qid] || "";
    note.dataset.note = item.qid;
    note.setAttribute("aria-label", `${tx("Note")}: ${item.text}`);
    const flags = el("div", "ri-flags");
    flags.setAttribute("role", "radiogroup");
    flags.setAttribute("aria-label", `${tx("Goes back to")}: ${item.text}`);
    FIXES.forEach((fix) => {
      const label = el("label", "ri-flag");
      const input = el("input");
      input.type = "radio";
      input.name = `ri-flag-${item.qid}`;
      input.value = fix;
      input.dataset.flag = item.qid;
      input.checked = (state.draft.flags[item.qid] || item.fix) === fix;
      label.append(input, el("span", null, fixText[fix]()));
      flags.append(label);
    });
    detail.append(note, flags);
    if (photos) controls.push(Capture.attach(detail, { tool: TOOL, ref: `draft|${item.qid}`, note: false }));
    row.append(detail);
    return detail;
  };
  const itemRow = (item) => {
    const row = el("div", "ri-item");
    row.dataset.qid = item.qid;
    const answer = state.draft.answers[item.qid];
    if (answer) row.dataset.answer = answer;
    const head = el("p", "ri-item-text");
    head.append(el("span", "ri-item-n", String(item.index + 1)), el("span", null, item.text));
    head.append(el("span", item.critical ? "ri-weight is-critical" : "ri-weight", item.critical ? tx("Critical") : tx("Weight {n}", { n: item.weight })));
    const group = el("div", "ri-answers");
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-label", item.text);
    ANSWERS.forEach((value) => {
      const label = el("label", `ri-answer is-${value}`);
      const input = el("input");
      input.type = "radio";
      input.name = `ri-${item.qid}`;
      input.value = value;
      input.checked = answer === value;
      input.dataset.answer = item.qid;
      label.append(input, el("span", null, answerText[value]()));
      group.append(label);
    });
    row.append(head, group);
    if (answer === "fail" || state.draft.notes[item.qid]) detailFor(row, item);
    return row;
  };
  const renderZones = () => {
    dropControls();
    zonesBox.replaceChildren();
    if (photos) zonesBox.append(el("p", "form-note fc-photo-note ri-photo-note", Capture.NOTE()));
    const items = draftItems();
    ZONES.forEach((zone) => {
      const list = items.filter((item) => item.zone === zone);
      if (!list.length) return;
      const set = el("fieldset", "ri-zone");
      set.dataset.zone = zone;
      const legend = el("legend", "ri-zone-head");
      legend.append(el("span", "ri-zone-name", zoneOf[zone].name), el("span", "ri-zone-progress", zoneProgress(zone)));
      set.append(legend, ...list.map(itemRow));
      zonesBox.append(set);
    });
    renderLive();
  };
  const renderLive = () => {
    const items = draftItems();
    const s = score(state.draft.answers, items);
    const v = verdict(s, state.threshold);
    live.classList.toggle("is-pass", v.pass === true);
    live.classList.toggle("is-fail", v.pass === false);
    if (v.pass === null) live.textContent = tx("{n} items to check. A failed critical item fails the room on its own.", { n: int.format(items.length) });
    else {
      const parts = [`${tx("Score")} ${pct(s.pct, 0)}`, v.pass ? `✓ ${tx("Pass")}` : `✗ ${tx("Fail")}`, tx("{a} of {b} checked", { a: int.format(s.pass + s.fail + s.na), b: int.format(items.length) })];
      if (v.reason === "critical") parts.push(tx("critical item failed: {item}", { item: items.find((item) => item.qid === s.critical[0])?.text || "" }));
      else if (v.reason === "score") parts.push(tx("below the pass mark of {p}", { p: thresholdText() }));
      live.textContent = parts.join(" · ");
    }
    saveButton.disabled = !draftStarted();
    restButton.disabled = !s.open;
  };
  const refreshZone = (zone) => {
    const head = zonesBox.querySelector(`[data-zone="${zone}"] .ri-zone-progress`);
    if (head) head.textContent = zoneProgress(zone);
  };

  // The results: the inspections of the chosen period, scored with today's checklists and pass mark.
  const shortDate = dayMonth(false);
  const label = (iso) => shortDate(new Date(`${iso}T00:00:00Z`));
  const inPeriod = (rows) => (state.period === "all" ? rows : rows.filter((row) => row.date > addDays(today(), -Number(state.period))));
  const periodText = () => (state.period === "7" ? tx("Last 7 days") : state.period === "30" ? tx("Last 30 days") : tx("All"));
  const itemText = (template, qid) => itemByKey(template, qid)?.text || qid;
  const resultText = (row) => (row.pass === null ? "–" : row.pass ? tx("Pass") : tx("Fail"));
  const typeLabel = (row) => typeName(row.roomType) || templateOf(row.template).name;
  const floorLabel = (floor) => tx("Floor {n}", { n: floor });
  // Open maintenance: the tracker's open actions from this tool, and the maintenance faults not yet sent there.
  const unsent = (list) => list.flatMap((row) => row.s.failed.filter((qid) => row.flags[qid] === "maintenance" && !row.sent[qid]).map((qid) => ({ row, qid })));
  const openInTracker = () => (Actions ? Actions.list().filter((a) => a.source === TOOL && Actions.isOpen(a)).length : 0);
  const analysis = () => {
    const all = annotate(state.rows, itemsFor, state.threshold);
    const list = inPeriod(all);
    const now = today();
    const monday = mondayOf(now);
    const pareto = itemPareto(list);
    return {
      all, list, now,
      today: all.filter((row) => row.date === now).length,
      week: all.filter((row) => row.date >= monday && row.date <= now).length,
      total: overall(list),
      recleans: list.filter((row) => row.recleans > 0).length,
      recleanItems: list.reduce((sum, row) => sum + row.recleans, 0),
      unsent: unsent(all),
      tracker: openInTracker(),
      byAttendant: rateBy(list, (row) => row.attendant).sort((a, b) => numeric(a.key, b.key)),
      byFloor: rateBy(list, (row) => row.floor).sort((a, b) => numeric(a.key, b.key)),
      byType: rateBy(list, typeLabel),
      weeks: weekly(list),
      pareto,
      heat: heat(list, itemsFor),
    };
  };
  const paretoKey = (key) => { const [template, qid] = key.split("|"); return { template, qid }; };
  const summaryText = (r) => {
    const lines = [`${cfg.text.tool} · ${periodText()} · ${showDate(r.now)}`, ""];
    lines.push(`${tx("Inspections")}: ${int.format(r.list.length)} (${tx("today")}: ${int.format(r.today)}, ${tx("this week")}: ${int.format(r.week)})`);
    lines.push(`${tx("First-time pass rate")}: ${r.total.rate === null ? "–" : pct(r.total.rate, 0)} (${tx("{a} of {b} rooms", { a: int.format(r.total.firstPass), b: int.format(r.total.first) })})`);
    lines.push(`${tx("Average score")}: ${r.total.avg === null ? "–" : pct(r.total.avg, 0)} · ${tx("pass mark {p}", { p: thresholdText() })}`);
    lines.push(`${tx("Re-cleans")}: ${int.format(r.recleans)} · ${tx("Open maintenance")}: ${int.format(r.tracker + r.unsent.length)}`);
    if (r.byAttendant.length) {
      lines.push("", `${tx("First-time pass by room attendant")}:`);
      r.byAttendant.forEach((g) => lines.push(`- ${g.key}: ${g.rate === null ? "–" : pct(g.rate, 0)} (${tx("{a} of {b} rooms", { a: int.format(g.firstPass), b: int.format(g.first) })})`));
    }
    if (r.pareto.length) {
      lines.push("", `${tx("Items that fail most")}:`);
      r.pareto.slice(0, 5).forEach((p) => { const { template, qid } = paretoKey(p.key); lines.push(`- ${itemText(template, qid)} (${zoneOf[zoneOfQid(qid)]?.name || ""}): ${int.format(p.count)} × · ${pct(p.share, 0)}`); });
    }
    return lines.join("\n");
  };
  // The faults of the chosen period for Pareto 80/20, in its housekeeping template: one row per failed item and
  // inspection (an item counts once per inspection, as in "Items that fail most"), the cause is the checklist item, and
  // its zone is the second column, which Pareto offers as the filter (the bathroom alone, say). The floor goes along.
  const paretoTable = (r) => () => ({
    source: cfg.text.tool,
    template: "housekeeping",
    headers: [tx("Date"), tx("Zone"), tx("Room"), tx("Cause"), tx("Count"), tx("Floor"), tx("Note")],
    rows: r.list.flatMap((row) => row.s.failed.map((qid) => [row.date, zoneOf[zoneOfQid(qid)]?.name || "", row.room, itemText(row.template, qid), "1", row.floor, row.notes[qid] || ""])),
    map: { category: 3, count: 4, value: -1, date: 0, filter: 1 },
    measure: "count",
  });
  const maintenanceAction = (row, qid) => {
    const item = itemByKey(row.template, qid) || { text: qid, weight: 2, critical: false };
    return {
      title: `${tx("Room {room}", { room: row.room })}: ${item.text}`,
      detail: [row.notes[qid] || "", `${cfg.text.tool} · ${showDate(row.date)}${row.time ? ` ${row.time}` : ""}${row.inspector ? ` · ${row.inspector}` : ""}`].filter(Boolean).join(" · "),
      owner: cfg.text.maintenanceOwner,
      due: addDays(row.date > today() ? row.date : today(), priorityOf(item) === "High" ? 1 : 3),
      source: TOOL, check: cfg.text.checkText,
      area: row.floor ? floorLabel(row.floor) : row.room,
      priority: priorityOf(item),
    };
  };
  const sendMaintenance = (pairs) => {
    if (!Actions) return 0;
    let n = 0;
    pairs.forEach(({ row, qid }) => {
      if (Actions.add(maintenanceAction(row, qid))) n++;
      const stored = state.rows.find((r) => r.id === row.id);
      if (stored) stored.sent[qid] = true;
    });
    return n;
  };
  const trackerNote = (node, message) => {
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = Actions.trackerUrl().href;
    node.replaceChildren(`${message} `, link);
    clearTimeout(node.timer);
    node.timer = setTimeout(() => { node.textContent = ""; }, 8000);
  };

  // Printing: the inspection sheet of a room (A4, for the clipboard) or the summary of one day; the rest of the page
  // is hidden while it prints.
  const printOnly = (build) => {
    printBox.replaceChildren(...build());
    printBox.hidden = false;
    document.documentElement.classList.add("ri-printing");
    const done = () => {
      document.documentElement.classList.remove("ri-printing");
      printBox.hidden = true;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint (some phones) get the page back a moment later.
    setTimeout(done, 2000);
  };
  const box = (on) => (on ? "☒" : "☐");
  const sheet = (row) => {
    const room = roomOf(row.room);
    const items = itemsFor(row);
    const s = score(row.answers, items);
    const v = verdict(s, state.threshold);
    const head = el("div", "ri-print-head");
    head.append(el("p", "kicker", cfg.text.tool), el("h2", null, row.room ? tx("Room {room}", { room: row.room }) : tx("Room ______")));
    const floor = row.floor || room?.floor || floorOf(row.room);
    head.append(el("p", "ri-print-meta", [floor ? floorLabel(floor) : "", typeName(row.roomType || room?.type), templateOf(row.template).name].filter(Boolean).join(" · ")));
    const fields = el("dl", "ri-print-fields");
    [[tx("Date"), row.date ? showDate(row.date) : ""], [tx("Time"), row.time || ""], [tx("Room attendant"), row.attendant], [tx("Inspector"), row.inspector], [tx("Inspection type"), row.kind ? kindName(row.kind) : ""]].forEach(([term, value]) => {
      const pair = el("div");
      pair.append(el("dt", null, term), el("dd", null, value || " "));
      fields.append(pair);
    });
    const table = el("table", "ri-print-table");
    const thead = el("thead");
    const htr = el("tr");
    [tx("Check item"), tx("Weight"), tx("Pass"), tx("Fail"), tx("n.a."), tx("Note")].forEach((text) => { const th = el("th", null, text); th.scope = "col"; htr.append(th); });
    thead.append(htr);
    table.append(thead);
    ZONES.forEach((zone) => {
      const list = items.filter((item) => item.zone === zone);
      if (!list.length) return;
      const tbody = el("tbody");
      const ztr = el("tr", "ri-print-zone");
      const zth = el("th", null, zoneOf[zone].name);
      zth.colSpan = 6;
      zth.scope = "colgroup";
      ztr.append(zth);
      tbody.append(ztr);
      list.forEach((item) => {
        const answer = row.answers[item.qid];
        const tr = el("tr");
        tr.append(el("td", null, item.text), el("td", "num", item.critical ? "C" : String(item.weight)), el("td", "ri-box", box(answer === "pass")), el("td", "ri-box", box(answer === "fail")), el("td", "ri-box", box(answer === "na")),
          el("td", "ri-print-note", [row.notes[item.qid], answer === "fail" ? fixText[row.flags[item.qid] || item.fix]() : ""].filter(Boolean).join(" · ")));
        tbody.append(tr);
      });
      table.append(tbody);
    });
    const foot = el("p", "ri-print-foot", s.pct === null
      ? tx("Score: ______ %   Pass mark {p}. C = critical: a failed critical item fails the room on its own.", { p: thresholdText() })
      : `${tx("Score")} ${pct(s.pct, 0)} · ${v.pass ? tx("Pass") : tx("Fail")} · ${tx("pass mark {p}", { p: thresholdText() })}`);
    const sign = el("p", "ri-print-sign", `${tx("Signature")}: ____________________`);
    return [head, fields, table, foot, sign];
  };
  const daySheet = (r, day) => {
    const rows = r.all.filter((row) => row.date === day);
    const t = overall(rows);
    const head = el("div", "ri-print-head");
    head.append(el("p", "kicker", cfg.text.tool), el("h2", null, tx("Daily summary · {date}", { date: showDate(day) })));
    head.append(el("p", "ri-print-meta", [tx("{n} inspections", { n: int.format(rows.length) }), `${tx("First-time pass rate")} ${t.rate === null ? "–" : pct(t.rate, 0)}`, `${tx("Average score")} ${t.avg === null ? "–" : pct(t.avg, 0)}`, `${tx("Re-cleans")} ${int.format(rows.filter((row) => row.recleans > 0).length)}`].join(" · ")));
    const table = el("table", "ri-print-table");
    const thead = el("thead");
    const htr = el("tr");
    [tx("Time"), tx("Room"), tx("Room attendant"), tx("Inspector"), tx("Type"), tx("Score"), tx("Result"), tx("Faults")].forEach((text) => { const th = el("th", null, text); th.scope = "col"; htr.append(th); });
    thead.append(htr);
    const tbody = el("tbody");
    rows.forEach((row) => {
      const tr = el("tr");
      const faults = row.s.failed.map((qid) => `${itemText(row.template, qid)} (${fixText[row.flags[qid] || "reclean"]()})`).join("; ");
      tr.append(el("td", null, row.time), el("td", null, row.room), el("td", null, row.attendant), el("td", null, row.inspector), el("td", null, `${kindName(row.kind)}${row.recheck ? ` · ${tx("re-check")}` : ""}`),
        el("td", "num", row.s.pct === null ? "–" : pct(row.s.pct, 0)), el("td", null, resultText(row)), el("td", "ri-print-note", faults));
      tbody.append(tr);
    });
    table.append(thead, tbody);
    const out = [head, table];
    const maint = rows.flatMap((row) => row.s.failed.filter((qid) => row.flags[qid] === "maintenance").map((qid) => `${tx("Room {room}", { room: row.room })}: ${itemText(row.template, qid)}${row.notes[qid] ? ` · ${row.notes[qid]}` : ""}`));
    if (maint.length) {
      out.push(el("h3", null, tx("Maintenance")));
      const ul = el("ul", "ri-print-list");
      maint.forEach((text) => ul.append(el("li", null, text)));
      out.push(ul);
    }
    return out;
  };

  let exampleUi = null;
  const rateBars = (groups, total, title, fileName, labelOf = (g) => g.key) => ChartKit.figure(ChartKit.bars(groups.filter((g) => g.rate !== null).map((g) => ({
    label: labelOf(g), value: g.rate, tip: `${labelOf(g)}: ${pct(g.rate, 0)} · ${tx("{a} of {b} rooms", { a: int.format(g.firstPass), b: int.format(g.first) })}${g.avg === null ? "" : ` · ${tx("average score {p}", { p: pct(g.avg, 0) })}`}`,
  })), { title, yMax: 1, format: (v) => pct(v, 0), target: total.rate ?? undefined, targetLabel: tx("Hotel"), highlight: () => false }), { fileName });
  const renderResults = () => {
    results.replaceChildren();
    if (exampleUi) exampleUi.sync(state);
    if (!state.rows.length) { results.hidden = true; return; }
    results.hidden = false;
    const r = analysis();
    const head = el("div", "result-head ri-head");
    head.append(el("p", "kicker", `${tx("Room inspections")} · ${periodText()}`));
    const h2 = el("h2");
    h2.append(r.total.rate === null ? "–" : pct(r.total.rate, 0), el("span", null, ` · ${tx("first-time pass rate")}`));
    head.append(h2, el("p", "ri-meta", [tx("{n} inspections", { n: int.format(r.list.length) }), tx("{n} rooms", { n: int.format(new Set(r.list.map((row) => row.room)).size) }), tx("pass mark {p}", { p: thresholdText() })].join(" · ")));

    const stats = el("div", "dl-stats ri-stats");
    stats.append(stat(tx("Inspections today"), int.format(r.today), tx("{n} this week", { n: int.format(r.week) })));
    stats.append(stat(tx("First-time pass"), r.total.rate === null ? "–" : pct(r.total.rate, 0), tx("{a} of {b} rooms passed at the first inspection", { a: int.format(r.total.firstPass), b: int.format(r.total.first) })));
    stats.append(stat(tx("Average score"), r.total.avg === null ? "–" : pct(r.total.avg, 0), tx("pass mark {p}", { p: thresholdText() })));
    stats.append(stat(tx("Re-cleans"), int.format(r.recleans), tx("{n} items cleaned again", { n: int.format(r.recleanItems) })));
    stats.append(stat(tx("Open maintenance"), int.format(r.tracker + r.unsent.length), r.unsent.length ? tx("{n} not in the Action Tracker yet", { n: int.format(r.unsent.length) }) : tx("all in the Action Tracker")));

    // Start here: the item that fails most, with the first moves of its zone.
    const top = r.pareto[0];
    let focus = null;
    let problem = cfg.text.tool;
    let topText = "";
    if (top) {
      const { template, qid } = paretoKey(top.key);
      topText = itemText(template, qid);
      const where = rateBy(r.list.filter((row) => row.s.failed.includes(qid) && row.template === template), (row) => row.floor).sort((a, b) => b.n - a.n)[0];
      focus = focusCard({
        title: topText,
        detail: tx("{n} faults", { n: int.format(top.count) }),
        lede: tx("The item that fails most ({zone}): {share} of all faults, most often on floor {floor}.", { zone: zoneOf[zoneOfQid(qid)]?.name || "", share: pct(top.share, 0), floor: where ? where.key : "–" }),
        advice: zoneOf[zoneOfQid(qid)] || null,
      });
      problem = tx("Room inspection: “{item}” fails most often ({n} ×)", { item: topText, n: int.format(top.count) });
    }
    const actions = resultActions(() => summaryText(r), problem, r.pareto.length ? paretoTable(r) : null);
    if (Actions && r.unsent.length) {
      const send = el("button", "button-secondary", tx("Send {n} maintenance items to actions", { n: int.format(r.unsent.length) }));
      send.type = "button";
      send.addEventListener("click", () => {
        const n = sendMaintenance(unsent(annotate(state.rows, itemsFor, state.threshold)));
        save();
        renderResults();
        trackerNote(logStatus, tx("Added {n} actions.", { n: int.format(n) }));
      });
      actions.append(send);
    }
    if (Actions && top) actions.append(Actions.linkButton(tx("Add to actions"), () => ({ title: tx("Standard for: {item}", { item: topText }), detail: problem, owner: "", due: addDays(today(), 7), source: TOOL, check: tx("First-time pass of this item back above {p} for two weeks.", { p: thresholdText() }), area: tx("Housekeeping"), priority: "High" })));
    const standard = el("a", "button-ghost", tx("Write the standard in Standard Work"));
    standard.href = new URL("../standard-work/", window.location.href).href;
    const daily = el("button", "button-secondary", tx("Print daily summary"));
    daily.type = "button";
    daily.addEventListener("click", () => {
      const day = r.all.some((row) => row.date === r.now) ? r.now : r.all.at(-1).date;
      printOnly(() => daySheet(r, day));
    });
    actions.append(daily, standard);

    const panels = [];
    if (ChartKit) {
      if (r.byAttendant.some((g) => g.rate !== null)) {
        const p = panel(tx("First-time pass by room attendant"), tx("For coaching, not blame: a low bar asks for a room walked through together, a clearer standard or more minutes per room. The line is the whole hotel."));
        p.classList.add("ri-panel-attendant");
        p.append(rateBars(r.byAttendant, r.total, tx("First-time pass by room attendant"), "room-inspection-attendants"));
        panels.push(p);
      }
      if (r.weeks.length) {
        const p = panel(tx("Score per week"), tx("Average score and first-time pass rate, week by week. The line is the pass mark."));
        p.classList.add("ri-panel-trend");
        const line = (key, name) => ({ label: name, points: r.weeks.map((w) => ({ x: label(w.week), y: w[key] ?? NaN, tip: `${tx("Week of {date}", { date: showDate(w.week) })} · ${name}: ${w[key] === null ? "–" : pct(w[key], 0)} · ${tx("{n} inspections", { n: int.format(w.n) })}` })) });
        p.append(ChartKit.figure(ChartKit.line([line("avg", tx("Average score")), line("rate", tx("First-time pass"))], { title: tx("Score per week"), yMin: 0, yMax: 1, target: state.threshold, format: (v) => pct(v, 0) }), { fileName: "room-inspection-trend" }));
        panels.push(p);
      }
      if (r.byFloor.length > 1) {
        const p = panel(tx("First-time pass by floor"), tx("A floor below the line: look at its trolley, its rooms and its time per room."));
        p.append(rateBars(r.byFloor, r.total, tx("First-time pass by floor"), "room-inspection-floors", (g) => floorLabel(g.key)));
        panels.push(p);
      }
      if (r.byType.length > 1) {
        const p = panel(tx("First-time pass by room type"), tx("Suites and accessible rooms have more to check; their standard time should say so."));
        p.append(rateBars(r.byType, r.total, tx("First-time pass by room type"), "room-inspection-types"));
        panels.push(p);
      }
    }
    // The items that fail most: the Pareto of the faults.
    const failPanel = panel(tx("Items that fail most"), r.pareto.length ? tx("Each failed item counts once per inspection. The marked items make up 80 % of the faults.") : tx("No item failed in this period."));
    failPanel.classList.add("ri-panel-fails");
    if (r.pareto.length) failPanel.append(barList(r.pareto.slice(0, 10).map((p) => { const { template, qid } = paretoKey(p.key); return { key: `${itemText(template, qid)} · ${zoneOf[zoneOfQid(qid)]?.name || ""}`, value: p.count, share: p.share, cum: p.cum, vital: p.vital }; }), {
      label: (item) => [int.format(item.value), ` · ${pct(item.share, 0)} · ${tx("cumulative")} ${pct(item.cum, 0)}`],
      highlight: (item) => item.vital, tag: tx("vital few"), ranked: true,
    }));
    panels.push(failPanel);
    if (ChartKit && r.heat.floors.length) {
      const zones = ZONES.filter((zone) => r.heat.floors.some((floor) => r.heat.cells[`${floor}|${zone}`]));
      const shares = Object.values(r.heat.cells).map((c) => c.fail / c.answered);
      const max = Math.max(...shares, 0) || 1;
      const p = panel(tx("Faults by floor and zone"), tx("The number is the faults; the darker the cell, the larger the share of failed checks in that zone."));
      p.classList.add("ri-panel-heat");
      // Zones as rows (their names are long), floors as columns.
      p.append(ChartKit.figure(ChartKit.heatmap(zones.map((zone) => zoneOf[zone].name), r.heat.floors.map(floorLabel), (zi, fi) => {
        const c = r.heat.cells[`${r.heat.floors[fi]}|${zones[zi]}`];
        if (!c) return null;
        const share = c.fail / c.answered;
        const opacity = c.fail ? 0.18 + 0.82 * (share / max) : 0.06;
        return { text: c.fail ? int.format(c.fail) : "", color: ChartKit.C.blue, opacity, textColor: opacity > 0.55 ? "#ffffff" : ChartKit.C.text, tip: `${floorLabel(r.heat.floors[fi])} · ${zoneOf[zones[zi]].name}: ${tx("{a} of {b} checks failed", { a: int.format(c.fail), b: int.format(c.answered) })} (${pct(share, 1)})` };
      }, { title: tx("Faults by floor and zone"), cellSize: 46, labelWidth: 170 }), { fileName: "room-inspection-heatmap" }));
      panels.push(p);
    }
    resultLayout(results, { head, stats, focus, actions, panels });
  };

  // The log of saved inspections, newest first.
  const LOG_ROWS = 30;
  const renderLog = () => {
    const list = annotate(state.rows, itemsFor, state.threshold).reverse().slice(0, LOG_ROWS);
    logBody.replaceChildren();
    list.forEach((row) => {
      const tr = el("tr");
      tr.dataset.row = row.id;
      const dateCell = el("td", null, `${showDate(row.date)}${row.time ? ` ${row.time}` : ""}`);
      const roomCell = el("td");
      roomCell.append(el("strong", null, row.room), row.floor ? ` · ${floorLabel(row.floor)}` : "");
      const scoreCell = el("td", "num", row.s.pct === null ? "–" : pct(row.s.pct, 0));
      const resultCell = el("td");
      resultCell.append(el("span", row.pass === false ? "ri-result is-fail" : row.pass ? "ri-result is-pass" : "ri-result", row.pass === false ? `✗ ${tx("Fail")}` : row.pass ? `✓ ${tx("Pass")}` : "–"));
      if (row.recheck) resultCell.append(" ", el("span", "dl-tag", tx("re-check")));
      const tools = el("td", "ri-row-tools");
      const print = el("button", "button-ghost ri-row-print", tx("Sheet"));
      print.type = "button";
      print.dataset.printRow = row.id;
      print.setAttribute("aria-label", tx("Print the sheet of room {room} on {date}", { room: row.room, date: showDate(row.date) }));
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.remove = row.id;
      remove.setAttribute("aria-label", tx("Remove the inspection of room {room} on {date}", { room: row.room, date: showDate(row.date) }));
      tools.append(print, remove);
      tr.append(dateCell, roomCell, el("td", null, row.attendant), el("td", null, row.inspector), el("td", null, kindName(row.kind)), scoreCell, resultCell, tools);
      logBody.append(tr);
    });
    logWrap.hidden = !state.rows.length;
    logEmpty.hidden = state.rows.length > 0;
    logCount.textContent = state.rows.length ? `${tx("{n} inspections", { n: int.format(state.rows.length) })}${state.rows.length > LOG_ROWS ? tx(" · newest {n} shown, CSV has all", { n: LOG_ROWS }) : ""}` : "";
    decorateLog();
  };
  // A saved inspection with photos gets a button that opens them.
  let drawing = 0;
  const decorateLog = async () => {
    if (!photos) return;
    const mine = ++drawing;
    let counts = {};
    try { counts = await media.counts(TOOL); } catch { return; }
    if (mine !== drawing) return;
    logBody.querySelectorAll("tr[data-row]").forEach((tr) => {
      tr.querySelector(".fc-row-photos")?.remove();
      const row = state.rows.find((item) => item.id === tr.dataset.row);
      if (!row) return;
      const refs = Object.keys(counts).filter((ref) => ref.startsWith(`${row.id}|`)).sort();
      const n = refs.reduce((sum, ref) => sum + counts[ref], 0);
      if (!n) return;
      const open = el("button", "fc-row-photos has-photos", tx("Photos · {n}", { n: int.format(n) }));
      open.type = "button";
      open.setAttribute("aria-label", `${open.textContent}, ${tx("Room {room}", { room: row.room })}, ${showDate(row.date)}`);
      open.addEventListener("click", () => Capture.openPhotos({
        title: `${tx("Room {room}", { room: row.room })} · ${showDate(row.date)}`, tool: TOOL,
        refs: refs.map((ref) => ({ ref, label: itemText(row.template, ref.slice(row.id.length + 1)) })),
        onClose: decorateLog,
      }));
      tr.cells[1]?.append(" ", open);
    });
  };
  const movePhotos = async (rowId) => {
    if (!photos) return;
    try {
      for (const record of (await media.list(TOOL)).filter((r) => r.ref.startsWith("draft|"))) await media.update(record.id, { ref: `${rowId}|${record.ref.slice(6)}` });
    } catch { /* the photos stay with the draft and can be added again */ }
    decorateLog();
  };
  const draftPhotoCount = async () => {
    if (!photos) return 0;
    try { return (await media.list(TOOL)).filter((r) => r.ref.startsWith("draft|")).length; } catch { return 0; }
  };
  const dropDraftPhotos = async () => {
    if (!photos) return;
    try { for (const record of (await media.list(TOOL)).filter((r) => r.ref.startsWith("draft|"))) await media.remove(record.id); } catch { /* nothing to remove */ }
  };

  const render = () => {
    renderSetup();
    if (packs) packs.render();
    renderLog();
    renderResults();
  };
  const changed = () => { save(); render(); };

  // The example: two weeks of a 180-room hotel, six attendants (one of them new), about 120 inspections, the last on today.
  const loadExample = () => {
    const ex = exampleData(cfg.example, cfg.templates, ZONES, today(), state.threshold);
    const setup = !state.rooms.length;
    if (setup) {
      state.rooms = ex.rooms;
      state.attendants = ex.attendants;
      state.inspectors = ex.inspectors;
    }
    state.rows = ex.rows.map((row) => ({ ...row, notes: { ...row.notes }, flags: { ...row.flags }, sent: {} }));
    state.example = { ...exampleStamp(state.rows), setup };
    if (!state.draft.inspector) state.draft.inspector = ex.inspectors[0];
  };
  // The example leaves as a whole; the rooms and the team it brought go too when "Clear the example" is used.
  const dropExample = (setupToo) => {
    state.rows = [];
    if (setupToo && state.example.setup) { state.rooms = []; state.attendants = []; state.inspectors = []; }
    state.example = {};
  };
  const ownWork = () => { if (exampleMatches(state)) dropExample(false); };
  exampleUi = exampleNote(results, () => { dropExample(true); changed(); renderDraftFields(); });

  // Setup events.
  const numberOf = (selector) => Number(q(selector).value);
  q("[data-generate]").addEventListener("click", () => {
    const rooms = generateRooms({ floorFrom: numberOf("#ri-floor-from"), floorTo: numberOf("#ri-floor-to"), roomFrom: numberOf("#ri-room-from"), roomTo: numberOf("#ri-room-to"), type: q("#ri-gen-type").value });
    if (!rooms.length) { flash(roomsStatus, tx("Give the floors and the rooms as numbers.")); return; }
    state.rooms = mergeRooms(state.rooms, rooms);
    changed();
    renderRoomNote();
    flash(roomsStatus, tx("{n} rooms added or updated: {first} to {last}.", { n: int.format(rooms.length), first: rooms[0].number, last: rooms.at(-1).number }));
  });
  q("[data-import-rooms]").addEventListener("click", () => {
    const { rooms, skipped } = parseRooms(pasteInput.value, cfg.roomTypes);
    if (!rooms.length) { flash(roomsStatus, tx("No room numbers found. One room per line: number, floor, type.")); pasteInput.focus(); return; }
    state.rooms = mergeRooms(state.rooms, rooms);
    pasteInput.value = "";
    changed();
    renderRoomNote();
    flash(roomsStatus, skipped ? tx("{n} rooms imported, {m} lines skipped.", { n: int.format(rooms.length), m: int.format(skipped) }) : tx("{n} rooms imported.", { n: int.format(rooms.length) }));
  });
  q("[data-clear-rooms]").addEventListener("click", () => {
    if (!state.rooms.length || !window.confirm(tx("Clear the room list? Saved inspections stay."))) return;
    state.rooms = [];
    changed();
    renderRoomNote();
  });
  attendantsInput.addEventListener("input", () => { state.attendants = parseNames(attendantsInput.value); save(); renderSetup(); });
  inspectorsInput.addEventListener("input", () => { state.inspectors = parseNames(inspectorsInput.value).map((item) => item.name); save(); renderSetup(); });
  thresholdInput.addEventListener("change", () => {
    const value = Number(thresholdInput.value);
    if (value >= 50 && value <= 100) state.threshold = value / 100;
    thresholdInput.value = String(Math.round(state.threshold * 100));
    save();
    renderLive();
    renderLog();
    renderResults();
  });

  // The checklist of the inspection, chosen by hand or by the room's type; a change keeps what was answered by item.
  const chooseTemplate = (name) => {
    if (!isTemplate(name)) return;
    state.template = name;
    templateSelect.value = name;
    renderZones();
    renderRoomNote();
    save();
  };
  templateSelect.addEventListener("change", () => chooseTemplate(templateSelect.value));
  // The team's own checklist: a copy of a built-in one to edit, saved and opened as a template file (js/template-pack.js).
  const packHost = q("[data-template-pack]");
  if (window.TemplatePack && packHost) {
    packs = window.TemplatePack.checklist(packHost, {
      tool: TOOL, kind: "room-checklist", validate: cleanTemplate,
      select: templateSelect, builtIn: cfg.templates, custom: state.custom,
      current: () => state.template, choose: chooseTemplate,
      groups: () => cfg.zones.map((zone) => ({ key: zone.key, title: zone.name })),
      fields: [{ key: "text", label: tx("Check item") }, { key: "weight", label: tx("Weight (1–3, C = critical)") }],
      toEdit: (item) => ({ text: str(item?.text), weight: item?.critical ? "C" : String(weightOf(item?.weight)) }),
      fromEdit: (values, item) => {
        const w = String(values.weight ?? "").trim();
        const critical = /^[ck]/i.test(w);
        return { text: str(values.text), weight: critical ? 3 : weightOf(w), ...(critical ? { critical: true } : {}), fix: item?.fix === "maintenance" ? "maintenance" : "reclean" };
      },
      changed: () => { renderZones(); save(); renderSetup(); renderLog(); renderResults(); },
      inUse: (name) => state.rows.some((row) => row.template === name),
    });
  }

  // The inspection's fields.
  const setDraft = (name, value) => { state.draft[name] = value; save(); };
  roomInput.addEventListener("input", () => {
    state.draft.room = roomInput.value.trim();
    const room = roomOf(state.draft.room);
    if (room) {
      const tpl = templateForType(room.type);
      // An own checklist chosen by hand stays; a built-in one follows the room type.
      if (tpl !== state.template && !Object.prototype.hasOwnProperty.call(state.custom, state.template)) chooseTemplate(tpl);
      const attendant = state.attendants.find((a) => a.floors.includes(room.floor));
      if (attendant && (!state.draft.attendant || state.draft.auto)) {
        state.draft.attendant = attendant.name;
        state.draft.auto = true;
        attendantInput.value = attendant.name;
      }
    }
    renderRoomNote();
    save();
  });
  dateInput.addEventListener("change", () => setDraft("date", parseDate(dateInput.value) || today()));
  timeInput.addEventListener("change", () => setDraft("time", isTime(timeInput.value) ? timeInput.value : nowTime()));
  attendantInput.addEventListener("input", () => { state.draft.auto = false; setDraft("attendant", attendantInput.value.trim()); });
  inspectorInput.addEventListener("input", () => setDraft("inspector", inspectorInput.value.trim()));
  kindSelect.addEventListener("change", () => setDraft("kind", kindSelect.value));

  // Answers: a fail opens the note, the flag and the photo; the flag starts at the item's usual fix.
  zonesBox.addEventListener("change", (event) => {
    const input = event.target;
    if (input.dataset.answer) {
      const qid = input.dataset.answer;
      const item = draftItems().find((i) => i.qid === qid);
      if (!item) return;
      state.draft.answers[qid] = input.value;
      const row = input.closest(".ri-item");
      row.dataset.answer = input.value;
      if (input.value === "fail") {
        if (!state.draft.flags[qid]) state.draft.flags[qid] = item.fix;
        detailFor(row, item);
      } else {
        delete state.draft.flags[qid];
        if (!state.draft.notes[qid]) { const detail = row.querySelector(".ri-detail"); if (detail && !detail.querySelector(".fc-thumb")) detail.hidden = true; }
      }
      const detail = row.querySelector(".ri-detail");
      if (detail && input.value === "fail") detail.hidden = false;
      refreshZone(item.zone);
      renderLive();
      save();
    } else if (input.dataset.flag) {
      state.draft.flags[input.dataset.flag] = input.value;
      save();
    }
  });
  zonesBox.addEventListener("input", (event) => {
    const input = event.target;
    if (input.dataset.note === undefined) return;
    const value = input.value.trim();
    if (value) state.draft.notes[input.dataset.note] = value; else delete state.draft.notes[input.dataset.note];
    save();
  });
  restButton.addEventListener("click", () => {
    const open = draftItems().filter((item) => !state.draft.answers[item.qid]);
    open.forEach((item) => { state.draft.answers[item.qid] = "pass"; });
    renderZones();
    save();
    flash(walkStatus, tx("{n} items marked as pass.", { n: int.format(open.length) }));
  });

  saveButton.addEventListener("click", async () => {
    if (!draftStarted()) return;
    if (!state.draft.room) { flash(walkStatus, tx("Name the room first.")); roomInput.focus(); return; }
    ownWork();
    const items = draftItems();
    const valid = new Set(items.map((item) => item.qid));
    const keep = (map) => Object.fromEntries(Object.entries(map).filter(([qid]) => valid.has(qid)));
    const room = roomOf(state.draft.room);
    const answers = keep(state.draft.answers);
    const row = {
      id: id("r"), date: state.draft.date || today(), time: state.draft.time || nowTime(), room: room ? room.number : state.draft.room, floor: room ? room.floor : floorOf(state.draft.room),
      roomType: room ? room.type : "", attendant: state.draft.attendant, inspector: state.draft.inspector, kind: state.draft.kind, template: state.template,
      answers, notes: keep(state.draft.notes), flags: Object.fromEntries(Object.entries(keep(state.draft.flags)).filter(([qid]) => answers[qid] === "fail")), sent: {},
    };
    state.rows.push(row);
    state.rows.sort(byTime);
    const s = score(answers, items);
    const v = verdict(s, state.threshold);
    const maintenance = s.failed.filter((qid) => row.flags[qid] === "maintenance").map((qid) => ({ row, qid }));
    const sent = sendMaintenance(maintenance);
    const open = s.open;
    state.draft = blankDraft(state.draft);
    if (state.inspectors.length === 0 && row.inspector) state.inspectors = [row.inspector];
    if (row.attendant && !state.attendants.some((a) => a.name.toLowerCase() === row.attendant.toLowerCase())) state.attendants.push({ name: row.attendant, floors: [] });
    renderDraftFields();
    renderZones();
    changed();
    const message = [tx("Saved: room {room}, {score}, {result}.", { room: row.room, score: s.pct === null ? "–" : pct(s.pct, 0), result: v.pass ? tx("Pass") : tx("Fail") }), open ? tx("{n} items were not checked.", { n: int.format(open) }) : "", sent ? tx("{n} maintenance items added to actions.", { n: int.format(sent) }) : ""].filter(Boolean).join(" ");
    if (sent && Actions) trackerNote(walkStatus, message); else flash(walkStatus, message);
    await movePhotos(row.id);
    dropControls();
    renderZones();
  });
  q("[data-reset]").addEventListener("click", async () => {
    const n = await draftPhotoCount();
    if ((draftStarted() || n) && !window.confirm(n ? tx("Start a new inspection? Its answers and {n} photos are removed.", { n }) : tx("Start a new inspection? The answers of this one are discarded."))) return;
    await dropDraftPhotos();
    state.draft = blankDraft(state.draft);
    renderDraftFields();
    renderZones();
    save();
  });
  q("[data-print-sheet]").addEventListener("click", () => printOnly(() => {
    const room = roomOf(state.draft.room);
    return sheet({ ...state.draft, room: room ? room.number : state.draft.room, floor: room ? room.floor : floorOf(state.draft.room), roomType: room ? room.type : "", template: state.template });
  }));

  // The log: print a sheet, remove one (with undo), the period, the example, the exports and clearing.
  logBody.addEventListener("click", (event) => {
    const print = event.target.closest("[data-print-row]");
    if (print) { const row = state.rows.find((item) => item.id === print.dataset.printRow); if (row) printOnly(() => sheet(row)); return; }
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const index = state.rows.findIndex((row) => row.id === button.dataset.remove);
    if (index < 0) return;
    const [removed] = state.rows.splice(index, 1);
    changed();
    undoNote(logStatus, tx("Removed the inspection of room {room} on {date}.", { room: removed.room, date: showDate(removed.date) }), () => {
      state.rows.splice(Math.min(index, state.rows.length), 0, removed);
      changed();
    });
  });
  periodSelect.value = state.period;
  periodSelect.addEventListener("change", () => { state.period = periodSelect.value; save(); renderResults(); });
  q("[data-example]").addEventListener("click", () => {
    loadExample();
    renderDraftFields();
    renderZones();
    changed();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  q("[data-clear]").addEventListener("click", () => {
    if (!state.rows.length || !window.confirm(tx("Clear every saved inspection? The rooms and the team stay."))) return;
    state.rows = [];
    state.example = {};
    changed();
  });
  const csvRows = () => {
    const rows = [[tx("Date"), tx("Time"), tx("Room"), tx("Floor"), tx("Room type"), tx("Room attendant"), tx("Inspector"), tx("Inspection type"), tx("Room checklist"), tx("Zone"), tx("No."), tx("Check item"), tx("Weight"), tx("Critical"), tx("Answer"), tx("Goes back to"), tx("Note"), tx("Score"), tx("Result"), tx("Re-check")]];
    annotate(state.rows, itemsFor, state.threshold).forEach((row) => itemsFor(row).forEach((item) => {
      const answer = row.answers[item.qid];
      rows.push([row.date, row.time, row.room, row.floor, typeName(row.roomType), row.attendant, row.inspector, kindName(row.kind), templateOf(row.template).name, zoneOf[item.zone].name, item.index + 1, item.text, item.weight,
        item.critical ? tx("yes") : tx("no"), answer ? answerText[answer]() : "", answer === "fail" ? fixText[row.flags[item.qid] || item.fix]() : "", row.notes[item.qid] || "",
        row.s.pct === null ? "" : Math.round(row.s.pct * 1000) / 10, resultText(row), row.recheck ? tx("yes") : tx("no")]);
    }));
    return rows;
  };
  q("[data-csv]").addEventListener("click", () => { if (state.rows.length) downloadCsv(cfg.text.csvName, csvRows()); });
  q("[data-xlsx]").addEventListener("click", () => { if (state.rows.length) downloadXlsx(cfg.text.csvName, csvRows()); });

  // A first visit opens on the example, so the result is visible at once; nothing is written until the visitor acts.
  if (!state.rows.length && !draftStarted() && firstVisit(KEY)) loadExample();
  setupBox.open = !state.rooms.length;
  renderDraftFields();
  renderZones();
  render();
})();
