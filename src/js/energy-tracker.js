(() => {
  // Energy & Water: meter readings turned into use, cost and CO₂ per meter, per occupied room night or per unit, by
  // week or month, against a baseline, with a signal when a week drifts above it. The state is { meters: [{ id, name,
  // medium, tariff, calorific, zustand, kwhPerLitre }], rows: [{ date, meter (id), value (the counter as read),
  // replaced, oldFinal, note }], units: { date: occupied rooms or units }, settings }. Figures typed in boxes are kept
  // as typed (strings) and read when used, so a box shows what was typed.
  const kit = window.ToolKit;

  // The arithmetic, apart from the page, so a test can call it.
  const DAY = 864e5;
  const MEDIA = ["electricity", "gas", "water", "heat", "oil"];
  const ENERGY = new Set(["electricity", "gas", "heat", "oil"]);
  // Electricity, gas and district heat are billed per kWh (gas after its conversion from m³); oil per litre, water per m³.
  const PER_KWH = new Set(["electricity", "gas", "heat"]);
  const isIso = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const between = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  // Monday is 0: a week runs Monday to Sunday, as weekly readings on a Monday close it.
  const weekday = (iso) => (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;
  const mondayOf = (iso) => addDays(iso, -weekday(iso));
  const round6 = (n) => Math.round(n * 1e6) / 1e6;
  const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
  const numberOf = (raw) => (typeof raw === "number" ? raw : kit.parseNumber(String(raw ?? "").trim()));
  const positive = (raw, fallback) => {
    const n = numberOf(raw);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };

  // Gas: kWh = m³ × calorific value (Brennwert Hs, kWh/m³) × Zustandszahl, the conversion of German gas bills
  // (DVGW worksheet G 685). The Zustandszahl brings the metered m³ to standard conditions (temperature, pressure).
  const gasKwh = (m3, calorific, zustand) => m3 * calorific * zustand;
  // A meter with its figures read: the price and the conversion, the page's defaults where a box is empty.
  const resolveMeter = (meter, conv) => ({
    id: meter.id,
    name: meter.name,
    medium: MEDIA.includes(meter.medium) ? meter.medium : "electricity",
    tariff: positive(meter.tariff, null),
    calorific: positive(meter.calorific, conv.calorific),
    zustand: positive(meter.zustand, conv.zustand),
    kwhPerLitre: positive(meter.kwhPerLitre, conv.oilKwhPerLitre),
  });
  // The use of a meter in kWh: electricity and district heat count kWh already, gas converts m³, oil litres
  // (10 kWh per litre by default, net calorific value). Water has no kWh.
  const kwhOf = (meter, qty) => {
    if (meter.medium === "electricity" || meter.medium === "heat") return qty;
    if (meter.medium === "gas") return gasKwh(qty, meter.calorific, meter.zustand);
    if (meter.medium === "oil") return qty * meter.kwhPerLitre;
    return null;
  };
  // Cost = use × price per unit (energy price only, no fixed charges). null without a price.
  const costOf = (meter, qty) => {
    if (!(meter.tariff > 0)) return null;
    return (PER_KWH.has(meter.medium) ? kwhOf(meter, qty) : qty) * meter.tariff;
  };
  // CO₂ = kWh × factor (kg per kWh); water m³ × factor. The BAFA gas factor is per kWh on the net calorific value (Hi),
  // the bill's kWh are on the gross one (Hs): kWh(Hi) = kWh(Hs) ÷ Hs/Hi (1.11 for natural gas, DIN V 18599).
  // null when no factor is set (district heat, water by default): never 0 for something not known.
  const co2Of = (meter, qty, factors) => {
    const factor = factors[meter.medium];
    if (!(factor > 0)) return null;
    if (meter.medium === "water") return qty * factor;
    const kwh = kwhOf(meter, qty);
    return meter.medium === "gas" ? (kwh / (factors.hsHi > 0 ? factors.hsHi : 1)) * factor : kwh * factor;
  };
  // What a meter's per-unit figure and signal are measured in: kWh for energy, m³ for water.
  const measureOf = (meter, qty) => (ENERGY.has(meter.medium) ? kwhOf(meter, qty) : qty);

  // The intervals between the readings of one meter, oldest first. One reading per date (the last one entered wins).
  // Rule for a reading lower than the one before:
  //   - ticked "meter replaced": a new meter starts at this reading. With the old meter's last reading, the use up to
  //     the swap is old last reading − reading before; without it, the interval is a gap ("replaced").
  //   - not ticked: an error (a typing slip or an unrecorded swap); the interval is a gap ("lower").
  // A gap has no use: nothing is invented across it, and the page says so.
  const intervals = (readings) => {
    const byDate = new Map();
    readings.forEach((r) => { if (r && isIso(r.date) && Number.isFinite(r.value)) { byDate.delete(r.date); byDate.set(r.date, r); } });
    const list = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
    const out = [];
    for (let i = 1; i < list.length; i++) {
      const prev = list[i - 1];
      const cur = list[i];
      const days = between(prev.date, cur.date);
      let qty = null;
      let status = "ok";
      if (cur.replaced) {
        if (Number.isFinite(cur.oldFinal) && cur.oldFinal >= prev.value) {
          qty = round6(cur.oldFinal - prev.value);
          status = "swap";
        } else status = "gap-replaced";
      } else if (cur.value < prev.value) status = "gap-lower";
      else qty = round6(cur.value - prev.value);
      out.push({ from: prev.date, to: cur.date, days, qty, perDay: qty === null ? null : qty / days, status, reading: cur, previous: prev });
    }
    return out;
  };
  // Day by day: a reading closes the days before it, so an interval covers its first date up to the day before its
  // last, at the same use every day (the daily average). Days in a gap are listed apart.
  const daily = (ints) => {
    const days = new Map();
    const gaps = new Set();
    ints.forEach((iv) => {
      for (let d = 0; d < iv.days; d++) {
        const date = addDays(iv.from, d);
        if (iv.qty === null) gaps.add(date);
        else days.set(date, iv.perDay);
      }
    });
    return { days, gaps };
  };
  // The use over a period from the daily figures: only the days that have one.
  const sumRange = (dayMap, from, to) => {
    let qty = 0;
    let covered = 0;
    const span = isIso(from) && isIso(to) && to >= from ? between(from, to) + 1 : 0;
    for (let i = 0; i < span; i++) {
      const value = dayMap.get(addDays(from, i));
      if (value !== undefined) { qty += value; covered++; }
    }
    return { qty: round6(qty), covered, span };
  };
  // Weeks (Monday to Sunday) or months over a period, cut at its ends; each with the days it has a figure for.
  const buckets = (dayMap, from, to, grain = "week") => {
    if (!isIso(from) || !isIso(to) || to < from) return [];
    const out = [];
    let start = grain === "month" ? `${from.slice(0, 7)}-01` : mondayOf(from);
    while (start <= to) {
      const next = grain === "month" ? (() => { const d = new Date(`${start}T00:00:00Z`); d.setUTCMonth(d.getUTCMonth() + 1); return d.toISOString().slice(0, 10); })() : addDays(start, 7);
      const a = start < from ? from : start;
      const b = addDays(next, -1) > to ? to : addDays(next, -1);
      out.push({ key: start, from: a, to: b, ...sumRange(dayMap, a, b) });
      start = next;
    }
    return out;
  };
  // Use per unit over the days that have both a use and a unit figure: Σ use ÷ Σ units.
  const perUnit = (dayMap, units, from, to) => {
    let qty = 0;
    let n = 0;
    let days = 0;
    const span = isIso(from) && isIso(to) && to >= from ? between(from, to) + 1 : 0;
    for (let i = 0; i < span; i++) {
      const date = addDays(from, i);
      const value = dayMap.get(date);
      const u = Number(units[date]);
      if (value !== undefined && u > 0) { qty += value; n += u; days++; }
    }
    return { qty: round6(qty), units: n, days, value: n > 0 ? qty / n : null };
  };

  // Complete weeks for the baseline and the signal: every one of the 7 days has a use (and a unit figure when the
  // meter is read per unit). value is use ÷ units, or use per day without units.
  const weekSeries = (dayMap, units, usePerUnit, last) => {
    const dates = [...dayMap.keys()].sort();
    if (!dates.length) return [];
    const end = last && last < dates.at(-1) ? last : dates.at(-1);
    const weeks = [];
    for (let week = mondayOf(dates[0]); week <= end; week = addDays(week, 7)) {
      let qty = 0;
      let n = 0;
      let ok = addDays(week, 6) <= end;
      for (let d = 0; d < 7 && ok; d++) {
        const date = addDays(week, d);
        const value = dayMap.get(date);
        const u = Number(units?.[date]);
        if (value === undefined || (usePerUnit && !(u > 0))) ok = false;
        else { qty += value; n += u || 0; }
      }
      weeks.push({ week, complete: ok, qty: ok ? round6(qty) : null, units: ok ? n : null, value: ok ? (usePerUnit ? qty / n : qty / 7) : null });
    }
    return weeks;
  };
  // Baseline = Σ use ÷ Σ units (or ÷ days) over the first n complete weeks, or over the complete weeks inside a chosen
  // period (from–to). Not a mean of weekly ratios: a full week weighs more than a quiet one.
  const baseline = (weeks, n, period = null, usePerUnit = true) => {
    const complete = weeks.filter((w) => w.complete);
    const used = period && isIso(period.from) && isIso(period.to)
      ? complete.filter((w) => w.week >= period.from && addDays(w.week, 6) <= period.to)
      : complete.slice(0, n);
    if (!used.length) return null;
    const qty = used.reduce((s, w) => s + w.qty, 0);
    const units = used.reduce((s, w) => s + w.units, 0);
    return { weeks: used.map((w) => w.week), from: used[0].week, to: addDays(used.at(-1).week, 6), value: usePerUnit ? qty / units : qty / (7 * used.length), full: period ? true : used.length >= n };
  };
  // Signal: the latest complete week after the baseline against it. change = (latest − baseline) ÷ baseline; it fires
  // when the change is more than the threshold (10 % → 0.10).
  const signal = (weeks, base, threshold) => {
    if (!base || !(base.value > 0)) return null;
    const latest = [...weeks].reverse().find((w) => w.complete && w.week > base.weeks.at(-1));
    if (!latest) return null;
    const change = (latest.value - base.value) / base.value;
    return { week: latest.week, value: latest.value, base: base.value, change, fires: change > threshold + 1e-12 };
  };
  // The weekday pattern needs a figure of its own for each day: only intervals of one day (daily readings) count.
  // Weekly readings give every day of the week the same average, which says nothing about the weekday.
  const weekdayPattern = (ints, units = {}) => Array.from({ length: 7 }, (_, day) => {
    const own = ints.filter((iv) => iv.days === 1 && iv.qty !== null && weekday(iv.from) === day);
    const qty = own.reduce((s, iv) => s + iv.qty, 0);
    const withUnits = own.filter((iv) => Number(units[iv.from]) > 0);
    const n = withUnits.reduce((s, iv) => s + Number(units[iv.from]), 0);
    return { weekday: day, days: own.length, avg: own.length ? qty / own.length : null, perUnit: n > 0 ? withUnits.reduce((s, iv) => s + iv.qty, 0) / n : null };
  });

  // Rooms sold per night from the Hotel KPIs log of this browser (read only): { date: rooms sold }.
  const hotelRooms = (saved) => {
    const out = {};
    if (!isObject(saved) || !Array.isArray(saved.rows)) return out;
    saved.rows.forEach((row) => {
      const sold = Math.round(Number(row?.sold));
      if (isObject(row) && isIso(row.date) && Number.isFinite(sold) && sold >= 0) out[row.date] = sold;
    });
    return out;
  };
  // The units per day: the hotel's rooms where wanted, then the figures typed here, which win.
  const unitsOf = (manual, hotel, useHotel) => ({ ...(useHotel ? hotel : {}), ...manual });

  // A saved or pasted reading, cleaned: a date, a known meter and a counter value of 0 or more.
  const cleanRow = (row, meterIds) => {
    if (!isObject(row)) return null;
    const date = kit.parseDate(row.date);
    const value = numberOf(row.value);
    if (!date || !meterIds.includes(row.meter) || !Number.isFinite(value) || value < 0) return null;
    const replaced = row.replaced === true;
    const old = replaced ? numberOf(row.oldFinal) : NaN;
    return { date, meter: row.meter, value: round6(value), replaced, oldFinal: Number.isFinite(old) && old >= 0 ? round6(old) : null, note: typeof row.note === "string" ? row.note.trim().slice(0, 300) : "" };
  };
  const cleanRows = (rows, meterIds) => (Array.isArray(rows) ? rows.map((row) => cleanRow(row, meterIds)).filter(Boolean) : []);
  const cleanMeter = (meter, index) => {
    if (!isObject(meter)) return null;
    const s = (v, n = 20) => (typeof v === "string" ? v.trim().slice(0, n) : typeof v === "number" ? String(v) : "");
    return {
      id: s(meter.id, 40) || `m${index + 1}`,
      name: s(meter.name, 60) || `#${index + 1}`,
      medium: MEDIA.includes(meter.medium) ? meter.medium : "electricity",
      tariff: s(meter.tariff), calorific: s(meter.calorific), zustand: s(meter.zustand), kwhPerLitre: s(meter.kwhPerLitre),
    };
  };
  const cleanMeters = (list) => {
    const out = [];
    (Array.isArray(list) ? list : []).forEach((meter, i) => {
      const clean = cleanMeter(meter, i);
      if (clean && !out.some((m) => m.id === clean.id)) out.push(clean);
    });
    return out;
  };
  const cleanUnits = (map) => {
    const out = {};
    if (isObject(map)) Object.entries(map).forEach(([date, n]) => { const v = Number(n); if (isIso(date) && Number.isFinite(v) && v > 0) out[date] = v; });
    return out;
  };

  // Rows from a spreadsheet: date, meter (its name), reading, meter replaced (x, yes, ja, po, 1), the old meter's last
  // reading, note. A row whose meter is not in the list is skipped; a first row without a date is a header.
  const YES = /^(?:x|1|y|yes|true|j|ja|po|replaced|getauscht|ersetzt|zëvendësuar)$/i;
  const meterOf = (raw, meters) => {
    const text = String(raw ?? "").trim().toLowerCase();
    if (!text) return "";
    const exact = meters.find((m) => m.name.toLowerCase() === text || m.id.toLowerCase() === text);
    if (exact) return exact.id;
    const starts = text.length >= 3 ? meters.filter((m) => m.name.toLowerCase().startsWith(text)) : [];
    return starts.length === 1 ? starts[0].id : "";
  };
  const importRows = (text, meters) => {
    const ids = meters.map((m) => m.id);
    const added = [];
    let skipped = 0;
    kit.parseRows(text).forEach((cells, index) => {
      const [date, meter, value, replaced, oldFinal, note] = cells;
      const row = cleanRow({ date, meter: meterOf(meter, meters), value, replaced: YES.test(String(replaced ?? "").trim()), oldFinal, note }, ids);
      if (row) added.push(row);
      else if (index > 0 || kit.parseDate(date)) skipped++;
    });
    return { added, skipped };
  };

  // The example, moved forward by whole weeks so that its last reading is today or just before: the Monday readings
  // stay on Mondays, the busy and quiet nights on their weekdays.
  const exampleShift = (cfg, today) => {
    const last = addDays(cfg.example.start, Math.max(...cfg.example.readings.map((r) => r.day)));
    const weeks = Math.floor(between(last, today) / 7);
    return weeks > 0 ? weeks * 7 : 0;
  };
  const exampleRows = (cfg, today) => {
    const shift = exampleShift(cfg, today);
    const ex = cfg.example;
    return cleanRows(ex.readings.map((r) => ({ ...r, date: addDays(ex.start, r.day + shift), note: ex.notes[r.note] || "" })), ex.meters.map((m) => m.id));
  };
  const exampleUnits = (cfg, today) => {
    const shift = exampleShift(cfg, today);
    const out = {};
    cfg.example.occupied.forEach((n, i) => { if (n > 0) out[addDays(cfg.example.start, i + shift)] = n; });
    return out;
  };

  window.EnergyTrackerMath = {
    MEDIA, addDays, mondayOf, weekday, between, gasKwh, resolveMeter, kwhOf, costOf, co2Of, measureOf, intervals, daily, sumRange,
    buckets, perUnit, weekSeries, baseline, signal, weekdayPattern, hotelRooms, unitsOf, cleanRow, cleanRows, cleanMeters,
    cleanUnits, meterOf, importRows, exampleShift, exampleRows, exampleUnits,
  };

  // The page.
  const dataEl = document.getElementById("energy-tracker-data");
  const root = document.querySelector("[data-energy-tracker]");
  const Chart = window.ChartKit;
  if (!dataEl || !root || !kit || !Chart) return;
  const Actions = window.ActionsStore || null;
  const { LANG, tx, num, showDate, write, read, loadState, el, int, euro, pct, today, parseNumber, parseDate, logBook, resultLayout, panel, stat, focusCard, resultActions, flash, dayMonth, monthYear, rangeText, keepFocus, downloadCsv, importVolumes } = kit;
  const M = window.EnergyTrackerMath;

  const data = JSON.parse(dataEl.textContent);
  const t = data.text;
  const KEY = data.storageKey;
  const TOOL = "energy-tracker";
  // Hotel KPIs keeps its nights under the same language key as this page.
  const HOTEL_KEY = `sc-hotel-kpis${LANG === "en" ? "" : `-${LANG}`}`;
  const results = document.querySelector("[data-results]");
  const metersBox = root.querySelector("[data-meters]");
  const entry = root.querySelector("[data-entry]");
  const form = entry.elements;
  const entryStatus = root.querySelector("[data-entry-status]");
  const hint = root.querySelector("[data-reading-hint]");
  const oldBox = root.querySelector("[data-old-final]");
  const paste = root.querySelector("#et-paste");
  const denomForm = root.querySelector("[data-denom]");
  const denomStatus = root.querySelector("[data-denom-status]");
  const hotelNote = root.querySelector("[data-hotel-note]");
  const hotelBox = root.querySelector("#et-use-hotel");
  const meterFilter = root.querySelector("[data-filter=meter]");
  const metersStatus = root.querySelector("[data-meters-status]");

  const copyOf = (value) => JSON.parse(JSON.stringify(value));
  const state = loadState(KEY, {
    meters: [], rows: [], units: {}, denom: "rooms", useHotel: true, fMeter: "", grain: "", threshold: "", baselineWeeks: "", baselineFrom: "", baselineTo: "",
    co2electricity: "", co2gas: "", co2water: "", co2heat: "", co2oil: "", hsHi: "", example: {}, totalsFor: {}, from: "", to: "",
  });
  state.meters = M.cleanMeters(state.meters);
  // Without a meter there is nothing to read: the page offers its three usual ones again.
  if (!state.meters.length) state.meters = copyOf(data.meters);
  state.rows = M.cleanRows(state.rows, state.meters.map((m) => m.id));
  state.units = M.cleanUnits(state.units);
  if (!data.denominators.some((d) => d.key === state.denom)) state.denom = data.denominators[0].key;
  const save = () => write(KEY, state);

  const mediumOf = (key) => data.media.find((m) => m.key === key) || data.media[0];
  const denom = () => data.denominators.find((d) => d.key === state.denom) || data.denominators[0];
  const meterById = (id) => state.meters.find((m) => m.id === id);
  const conv = data.conversion;
  const resolved = () => state.meters.map((m) => M.resolveMeter(m, conv));
  const factors = () => {
    const out = { hsHi: positive(state.hsHi, conv.hsHi) };
    data.media.forEach((m) => {
      const typed = String(state[`co2${m.key}`] ?? "").trim();
      const n = numberOf(typed);
      out[m.key] = typed ? (Number.isFinite(n) && n >= 0 ? n : m.co2) : m.co2;
    });
    return out;
  };
  const settings = () => {
    const pick = (raw, fallback, min, max) => { const n = numberOf(String(raw ?? "").trim()); return Number.isFinite(n) && n >= min && n <= max ? n : fallback; };
    return { threshold: pick(state.threshold, data.signal.threshold, 1, 100) / 100, baselineWeeks: Math.round(pick(state.baselineWeeks, data.signal.baselineWeeks, 1, 26)) };
  };
  const hotel = () => M.hotelRooms(read(HOTEL_KEY, null));
  const units = () => M.unitsOf(state.units, state.denom === "rooms" ? hotel() : {}, state.useHotel);

  // Numbers as a meter reader writes them.
  const unitOf = (medium) => mediumOf(medium).unit;
  const qtyDigits = (medium, v) => (medium === "water" || medium === "gas" ? (Math.abs(v) < 100 ? 1 : 0) : 0);
  const qtyText = (medium, v) => `${num(v, qtyDigits(medium, v))} ${unitOf(medium)}`;
  const kwhText = (v) => `${int.format(Math.round(v))} kWh`;
  const money = (v) => euro.format(v);
  const wholeEuro = new Intl.NumberFormat(kit.LOCALE, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const co2Text = (kg) => (kg >= 1000 ? `${num(kg / 1000, 1)} t CO₂e` : `${int.format(Math.round(kg))} kg CO₂e`);
  const measureUnit = (medium) => (ENERGY.has(medium) ? "kWh" : unitOf(medium));
  const perText = (medium, v) => (ENERGY.has(medium) ? `${num(v, v < 100 ? 1 : 0)} kWh` : `${num(v, v < 1 ? 3 : 2)} ${unitOf(medium)}`);
  const changeText = (c) => `${c >= 0 ? "+" : "−"}${pct(Math.abs(c), 0)}`;
  const weekLabel = dayMonth(false);
  const dayCount = (n) => kit.plural(n, tx("day"), tx("days"));
  const readingText = (row) => num(row.value, Number.isInteger(row.value) ? 0 : 1);

  // The readings of every meter, worked out once and again only when the readings or the meters change (rows are
  // never changed in place: added, removed or the list replaced).
  let cache = null;
  const work = () => {
    const key = `${state.rows.length}|${JSON.stringify(state.meters)}`;
    if (cache && cache.rows === state.rows && cache.key === key) return cache;
    const byMeter = new Map(state.meters.map((m) => [m.id, []]));
    state.rows.forEach((row) => byMeter.get(row.meter)?.push(row));
    // info: the interval a reading closes, "first" for the first reading of a meter, null for a reading that lost to a
    // later entry of the same meter and day (not used).
    const info = new Map();
    const perMeter = resolved().map((meter) => {
      const rows = byMeter.get(meter.id) || [];
      const kept = new Map();
      rows.forEach((row) => { kept.delete(row.date); kept.set(row.date, row); });
      rows.forEach((row) => info.set(row, kept.get(row.date) === row ? "first" : null));
      const ints = M.intervals(rows);
      ints.forEach((iv) => info.set(iv.reading, iv));
      return { meter, ints, ...M.daily(ints) };
    });
    cache = { perMeter, info, rows: state.rows, key };
    return cache;
  };

  // Meters ------------------------------------------------------------------------------------------------------------
  const field = (labelText, input, id, wide = false) => {
    const box = el("div", wide ? "field dl-wide" : "field");
    const label = el("label", null, labelText);
    label.htmlFor = id;
    input.id = id;
    box.append(label, input);
    return box;
  };
  const textInput = (meter, name, placeholder, mode = "decimal") => {
    const input = el("input");
    input.name = name;
    input.value = meter[name];
    input.autocomplete = "off";
    if (mode) input.inputMode = mode;
    if (placeholder) input.placeholder = placeholder;
    input.dataset.focusKey = `${meter.id}:${name}`;
    input.addEventListener("input", () => {
      meter[name] = input.value;
      saveAndShow();
    });
    return input;
  };
  const renderMeters = () => {
    metersBox.replaceChildren(...state.meters.map((meter) => {
      const box = el("div", "et-meter");
      const grid = el("div", "dl-grid");
      const id = (name) => `et-${meter.id}-${name}`;
      grid.append(field(tx("Meter name"), textInput(meter, "name", "", ""), id("name")));
      const medium = el("select");
      data.media.forEach((m) => {
        const option = el("option", null, `${m.name} (${m.unit})`);
        option.value = m.key;
        medium.append(option);
      });
      medium.value = meter.medium;
      medium.dataset.focusKey = `${meter.id}:medium`;
      medium.addEventListener("change", () => {
        meter.medium = medium.value;
        keepFocus(renderMeters);
        saveAndShow();
      });
      grid.append(field(tx("Meter type"), medium, id("medium")));
      const tariffUnit = mediumOf(meter.medium).tariffUnit;
      grid.append(field(tx("Price (€ per {unit})", { unit: tariffUnit }), textInput(meter, "tariff", tx("e.g. {n}", { n: num(meter.medium === "water" ? 4.5 : meter.medium === "oil" ? 1.05 : meter.medium === "gas" ? 0.09 : 0.25, 2) })), id("tariff")));
      if (meter.medium === "gas") {
        grid.append(field(tx("Calorific value (kWh/m³)"), textInput(meter, "calorific", num(conv.calorific, 1)), id("calorific")));
        grid.append(field(tx("Zustandszahl"), textInput(meter, "zustand", num(conv.zustand, 2)), id("zustand")));
      }
      if (meter.medium === "oil") grid.append(field(tx("kWh per litre"), textInput(meter, "kwhPerLitre", num(conv.oilKwhPerLitre, 0)), id("oil")));
      box.append(grid);
      const remove = el("button", "button-ghost et-remove-meter", tx("Remove meter"));
      remove.type = "button";
      remove.setAttribute("aria-label", tx("Remove the meter {name}", { name: meter.name }));
      remove.addEventListener("click", () => {
        const count = state.rows.filter((row) => row.meter === meter.id).length;
        if (count && !window.confirm(tx("Remove the meter {name} and its {n} readings?", { name: meter.name, n: int.format(count) }))) return;
        state.meters = state.meters.filter((m) => m !== meter);
        state.rows = state.rows.filter((row) => row.meter !== meter.id);
        if (state.fMeter === meter.id) state.fMeter = "";
        renderMeters();
        save();
        book.render();
        flash(metersStatus, tx("Removed {name}.", { name: meter.name }));
        root.querySelector("[data-add-meter]").focus();
      });
      box.append(remove);
      return box;
    }));
    fillMeterLists();
  };
  const fillMeterLists = () => {
    const keep = form.meter.value;
    form.meter.replaceChildren(...state.meters.map((m) => { const o = el("option", null, m.name); o.value = m.id; return o; }));
    if (state.meters.some((m) => m.id === keep)) form.meter.value = keep;
    const first = meterFilter.options[0];
    meterFilter.replaceChildren(first, ...state.meters.map((m) => { const o = el("option", null, m.name); o.value = m.id; return o; }));
    if (!meterById(state.fMeter)) state.fMeter = "";
    meterFilter.value = state.fMeter;
    showHint();
  };
  const saveAndShow = () => {
    save();
    fillMeterLists();
    book.render();
  };
  root.querySelector("[data-add-meter]").addEventListener("click", () => {
    const meter = { id: `m${Date.now().toString(36)}`, name: `${t.newMeter} ${state.meters.length + 1}`, medium: "electricity", tariff: "", calorific: "", zustand: "", kwhPerLitre: "" };
    state.meters.push(meter);
    renderMeters();
    save();
    book.render();
    metersBox.querySelector(`#et-${meter.id}-name`)?.focus();
  });

  // Analysis ----------------------------------------------------------------------------------------------------------
  const analyse = () => {
    const { perMeter } = work();
    const f = factors();
    const set = settings();
    const u = units();
    // A meter with fewer than two readings has no use yet and stays out of the result.
    const shown = perMeter.filter((p) => (!state.fMeter || p.meter.id === state.fMeter) && p.ints.length);
    const allDays = shown.flatMap((p) => [...p.days.keys()]).sort();
    const from = state.from || allDays[0] || "";
    const to = state.to || allDays.at(-1) || "";
    const span = from && to && to >= from ? M.between(from, to) + 1 : 0;
    const meters = shown.map((p) => {
      const sum = M.sumRange(p.days, from, to);
      const gaps = [...p.gaps].filter((d) => d >= from && d <= to).length;
      const measure = M.measureOf(p.meter, sum.qty);
      const kwh = M.kwhOf(p.meter, sum.qty);
      const unit = M.perUnit(p.days, u, from, to);
      // A meter is followed per unit when at least one complete week has unit figures; else per day.
      // The weeks are measured as the signal reads them: kWh for energy (gas converted), m³ for water.
      const measured = new Map([...p.days].map(([date, qty]) => [date, M.measureOf(p.meter, qty)]));
      const perWeek = M.weekSeries(measured, u, true, to);
      const usePerUnit = perWeek.some((w) => w.complete);
      const weeks = usePerUnit ? perWeek : M.weekSeries(measured, u, false, to);
      const period = state.baselineFrom && state.baselineTo && state.baselineTo >= state.baselineFrom ? { from: state.baselineFrom, to: state.baselineTo } : null;
      const base = M.baseline(weeks, set.baselineWeeks, period, usePerUnit);
      const sig = M.signal(weeks, base, set.threshold);
      const lower = p.ints.filter((iv) => iv.status === "gap-lower" && iv.to > from && iv.from <= to);
      const swapGaps = p.ints.filter((iv) => iv.status === "gap-replaced" && iv.to > from && iv.from <= to);
      return {
        ...p, sum, gaps, missing: Math.max(0, sum.span - sum.covered - gaps), measure, kwh,
        cost: M.costOf(p.meter, sum.qty), co2: sum.qty > 0 ? M.co2Of(p.meter, sum.qty, f) : 0,
        unit: { ...unit, value: unit.units > 0 ? M.measureOf(p.meter, unit.qty) / unit.units : null },
        usePerUnit, weeks, base, sig, lower, swapGaps,
      };
    });
    // Energy per unit over the days where every energy meter shown has a use and there is a unit figure; water the same.
    const groupPerUnit = (list) => {
      if (!list.length) return null;
      let measure = 0;
      let n = 0;
      let days = 0;
      for (let i = 0; i < span; i++) {
        const date = M.addDays(from, i);
        const un = Number(u[date]);
        if (!(un > 0) || !list.every((m) => m.days.has(date))) continue;
        measure += list.reduce((s, m) => s + M.measureOf(m.meter, m.days.get(date)), 0);
        n += un;
        days++;
      }
      return { measure, units: n, days, value: n > 0 ? measure / n : null };
    };
    const energy = meters.filter((m) => ENERGY.has(m.meter.medium));
    const water = meters.filter((m) => m.meter.medium === "water");
    const sumOf = (list, key) => list.reduce((s, m) => s + (m[key] || 0), 0);
    const fired = meters.filter((m) => m.sig?.fires).sort((a, b) => b.sig.change - a.sig.change);
    const grain = state.grain === "week" || state.grain === "month" ? state.grain : span > 140 ? "month" : "week";
    const unitDays = Object.keys(u).filter((d) => d >= from && d <= to).length;
    return {
      from, to, span, meters, energy, water, f, set, grain, fired, unitDays,
      kwh: sumOf(energy, "kwh"),
      waterM3: sumOf(water, "measure"),
      cost: sumOf(meters, "cost"),
      noPrice: meters.filter((m) => m.cost === null && m.sum.qty > 0),
      co2: sumOf(meters, "co2"),
      noFactor: meters.filter((m) => m.co2 === null),
      anyCost: meters.some((m) => m.cost !== null && m.sum.qty > 0),
      anyCo2: meters.some((m) => m.co2 !== null && m.sum.qty > 0),
      energyUnit: groupPerUnit(energy),
      waterUnit: groupPerUnit(water),
    };
  };

  const per = () => denom().per;
  // A sum with no price or no factor behind it is not 0: it is not known, and shows as –.
  const costShown = (a) => (a.anyCost ? money(a.cost) : "–");
  const co2Shown = (a) => (a.anyCo2 ? co2Text(a.co2) : "–");
  const signalLine = (m) => tx("{meter}: {change} against the baseline ({now} {per} in the week of {date}, baseline {base}).", {
    meter: m.meter.name, change: changeText(m.sig.change), now: perText(m.meter.medium, m.sig.value), per: m.usePerUnit ? per() : tx("per day"),
    date: showDate(m.sig.week), base: perText(m.meter.medium, m.sig.base),
  });
  const problemText = (a) => (a.fired[0] ? signalLine(a.fired[0]) : "");
  const actionFor = (m) => () => ({
    title: tx("Check meter {name}: {change} vs baseline", { name: m.meter.name, change: changeText(m.sig.change) }),
    detail: `${signalLine(m)} ${(data.advice[m.meter.medium] || data.advice.default).moves[0]}`,
    source: TOOL,
    area: m.meter.name,
    priority: m.sig.change >= 0.2 ? "High" : "Medium",
    due: M.addDays(today(), 7),
    check: tx("{measure} {per} back within {r} of the baseline for two weeks running.", { measure: measureUnit(m.meter.medium), per: m.usePerUnit ? per() : tx("per day"), r: pct(settings().threshold, 0) }),
  });
  const actionButton = (getAction) => (Actions ? Actions.linkButton(tx("Add to actions"), getAction) : kit.trackerLink(tx("Add to actions"), getAction));

  const summaryText = (a) => {
    const lines = [`${t.tool} | Stiven Catalyst`, `${tx("Period")}: ${rangeText({ from: a.from, to: a.to })}${state.fMeter ? ` · ${meterById(state.fMeter)?.name}` : ""}`, ""];
    if (a.energy.length) lines.push(`${tx("Energy")}: ${kwhText(a.kwh)}`);
    if (a.water.length) lines.push(`${tx("Water")}: ${qtyText("water", a.waterM3)}`);
    lines.push(`${tx("Cost")}: ${costShown(a)}${a.noPrice.length ? ` (${tx("no price for {list}", { list: a.noPrice.map((m) => m.meter.name).join(", ") })})` : ""}`);
    lines.push(`CO₂e: ${co2Shown(a)}${a.noFactor.length ? ` (${tx("no factor for {list}", { list: a.noFactor.map((m) => m.meter.name).join(", ") })})` : ""}`);
    if (a.energyUnit?.value != null) lines.push(`${tx("Energy")} ${per()}: ${perText("electricity", a.energyUnit.value)}`);
    if (a.waterUnit?.value != null) lines.push(`${tx("Water")} ${per()}: ${perText("water", a.waterUnit.value)}`);
    lines.push("", `${tx("By meter")}:`);
    a.meters.forEach((m) => {
      const parts = [qtyText(m.meter.medium, m.sum.qty)];
      if (m.meter.medium === "gas" || m.meter.medium === "oil") parts.push(kwhText(m.kwh));
      if (m.cost !== null) parts.push(money(m.cost));
      if (m.co2 !== null) parts.push(co2Text(m.co2));
      if (m.unit.value !== null) parts.push(`${perText(m.meter.medium, m.unit.value)} ${per()}`);
      lines.push(`- ${m.meter.name}: ${parts.join(" · ")}${m.sum.covered < m.sum.span ? ` (${tx("{a} of {b} days with readings", { a: int.format(m.sum.covered), b: int.format(m.sum.span) })})` : ""}`);
    });
    lines.push("", `${tx("Signals")} (${tx("threshold {r}", { r: pct(a.set.threshold, 0) })}):`);
    if (a.fired.length) a.fired.forEach((m) => lines.push(`- ${signalLine(m)}`));
    else lines.push(`- ${tx("No meter above its baseline by more than {r}.", { r: pct(a.set.threshold, 0) })}`);
    if (a.fired[0]) {
      const advice = data.advice[a.fired[0].meter.medium] || data.advice.default;
      lines.push("", `${tx("First moves")}:`);
      advice.moves.forEach((move) => lines.push(`- ${move}`));
      lines.push(`${tx("Question for the floor")}: ${advice.question}`);
    }
    return lines.join("\n");
  };

  // Results pieces ----------------------------------------------------------------------------------------------------
  const meterTable = (a) => {
    const box = panel(tx("By meter"), tx("Use in the period from the readings, its price and CO₂, and the use {per}.", { per: per() }));
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table et-table");
    const head = el("tr");
    [tx("Meter"), tx("Consumption"), "kWh", tx("Cost"), "CO₂e", per(), tx("Days with readings")].forEach((name) => { const th = el("th", null, name); th.scope = "col"; head.append(th); });
    const thead = el("thead");
    thead.append(head);
    const body = el("tbody");
    a.meters.forEach((m) => {
      const tr = el("tr");
      tr.append(
        el("th", null, m.meter.name),
        el("td", "nowrap", qtyText(m.meter.medium, m.sum.qty)),
        el("td", "nowrap", m.kwh === null ? "–" : kwhText(m.kwh)),
        el("td", "nowrap", m.cost === null ? tx("no price") : money(m.cost)),
        el("td", "nowrap", m.co2 === null ? tx("no factor") : co2Text(m.co2)),
        el("td", "nowrap", m.unit.value === null ? "–" : perText(m.meter.medium, m.unit.value)),
        el("td", "nowrap", `${int.format(m.sum.covered)} / ${int.format(m.sum.span)}`),
      );
      tr.firstChild.scope = "row";
      body.append(tr);
    });
    table.append(thead, body);
    wrap.append(table);
    box.append(wrap);
    box.append(el("p", "dl-panel-note", `${t.tariffNote} ${tx("Fixed charges are not included.")}`));
    return box;
  };

  const bucketLabel = (a, key) => (a.grain === "month" ? monthYear(new Date(`${key}T00:00:00Z`)) : weekLabel(new Date(`${key}T00:00:00Z`)));
  const partialNote = (list) => (list.length ? ` ${tx("Not every day has a figure in: {list}. Those bars show only the days they have.", { list: list.join(", ") })}` : "");
  const energyChart = (a) => {
    const title = a.grain === "month" ? tx("Energy by month (kWh)") : tx("Energy by week (kWh)");
    const media = data.media.filter((m) => ENERGY.has(m.key) && a.energy.some((x) => x.meter.medium === m.key));
    const byMeter = a.energy.map((m) => ({ m, b: M.buckets(m.days, a.from, a.to, a.grain) }));
    const keys = byMeter[0]?.b.map((b) => b.key) || [];
    const partial = new Set();
    const groups = keys.map((key, i) => ({
      label: bucketLabel(a, key),
      parts: media.map((medium) => ({
        key: medium.name,
        value: byMeter.filter((x) => x.m.meter.medium === medium.key).reduce((s, x) => {
          if (x.b[i].covered < x.b[i].span) partial.add(bucketLabel(a, key));
          return s + M.kwhOf(x.m.meter, x.b[i].qty);
        }, 0),
      })),
    }));
    const box = panel(title, `${tx("Gas and heating oil converted into kWh, so the media add up.")}${partialNote([...partial])}`);
    box.append(Chart.figure(Chart.stacked(groups, { title, keys: media.map((m) => m.name), unit: "kWh", format: (v) => int.format(Math.round(v)) }), { fileName: "energy-by-period" }));
    return box;
  };
  const waterChart = (a) => {
    const title = a.grain === "month" ? tx("Water by month (m³)") : tx("Water by week (m³)");
    const lists = a.water.map((m) => M.buckets(m.days, a.from, a.to, a.grain));
    const partial = [];
    const items = (lists[0] || []).map((b, i) => {
      const value = lists.reduce((s, l) => s + l[i].qty, 0);
      const covered = Math.min(...lists.map((l) => l[i].covered));
      if (covered < b.span) partial.push(bucketLabel(a, b.key));
      return { label: bucketLabel(a, b.key), value, tip: `${bucketLabel(a, b.key)}: ${qtyText("water", value)} (${tx("{a} of {b} days with readings", { a: int.format(covered), b: int.format(b.span) })})` };
    });
    const box = panel(title, partialNote(partial).trim() || tx("Every bar has a figure for each of its days."));
    box.append(Chart.figure(Chart.bars(items, { title, unit: "m³", format: (v) => int.format(Math.round(v)) }), { fileName: "water-by-period" }));
    return box;
  };
  const lineChart = (a, m) => {
    const label = m.usePerUnit ? per() : tx("per day");
    const title = `${m.meter.name}: ${measureUnit(m.meter.medium)} ${label}`;
    const baseWeeks = new Set(m.base?.weeks || []);
    const points = m.weeks.map((w) => {
      const above = m.base && w.value !== null && !baseWeeks.has(w.week) && w.value > m.base.value * (1 + a.set.threshold) + 1e-12;
      return {
        x: weekLabel(new Date(`${w.week}T00:00:00Z`)),
        y: w.value === null ? NaN : w.value,
        state: w.value === null || !m.base || baseWeeks.has(w.week) ? undefined : above ? "warn" : "ok",
        tip: w.value === null
          ? `${tx("Week of {date}", { date: showDate(w.week) })}: ${tx("not every day has a figure")}`
          : `${tx("Week of {date}", { date: showDate(w.week) })}: ${perText(m.meter.medium, w.value)} ${label}${baseWeeks.has(w.week) ? ` · ${tx("baseline week")}` : m.base ? ` · ${changeText((w.value - m.base.value) / m.base.value)} ${above ? `✕ ${tx("above the threshold")}` : `✓ ${tx("within the threshold")}`}` : ""}`,
      };
    });
    const note = m.base
      ? tx("Baseline {base} {per}: {n} complete weeks from {from} to {to}{partial}. A week more than {r} above it is a signal (✕).", {
        base: perText(m.meter.medium, m.base.value), per: label, n: int.format(m.base.weeks.length), from: showDate(m.base.from), to: showDate(m.base.to),
        partial: m.base.full ? "" : ` (${tx("fewer than the {n} weeks set", { n: int.format(a.set.baselineWeeks) })})`, r: pct(a.set.threshold, 0),
      })
      : tx("No complete week yet: a week needs a figure for each of its days.");
    const box = panel(title, note);
    box.append(Chart.figure(Chart.line([{ label: title, points }], { title, center: m.base?.value, centerLabel: tx("Baseline"), yMin: 0, unit: `${measureUnit(m.meter.medium)} ${label}`, format: (v) => num(v, v < 1 ? 2 : v < 100 ? 1 : 0) }), { fileName: `energy-${m.meter.id}-baseline` }));
    if (!m.usePerUnit) box.append(el("p", "dl-panel-note", tx("No complete week with unit figures, so this meter is followed per day.")));
    if (m.meter.medium === "gas" || m.meter.medium === "heat" || m.meter.medium === "oil") box.append(el("p", "dl-panel-note", t.weatherNote));
    return box;
  };
  const weekdayPanel = (a) => {
    const u = units();
    const pick = [...a.meters].map((m) => ({ m, n: m.ints.filter((iv) => iv.days === 1 && iv.qty !== null).length })).sort((x, y) => y.n - x.n)[0];
    const box = panel(tx("Weekday pattern"), "");
    const note = box.querySelector(".dl-panel-note") || el("p", "dl-panel-note");
    if (!note.isConnected) box.append(note);
    if (!pick || pick.n < 7) {
      note.textContent = tx("With weekly readings every day of a week gets the same average, so a weekday pattern needs daily readings (for example from the smart meter portal). None of the meters shown has a week of them yet.");
      return box;
    }
    const pattern = M.weekdayPattern(pick.m.ints, u);
    const usePer = pattern.some((d) => d.perUnit !== null);
    const label = usePer ? per() : tx("per day");
    note.textContent = tx("{meter}, from its {n} daily readings: the average {per} on each weekday. Weekly readings are left out here.", { meter: pick.m.meter.name, n: int.format(pick.n), per: label });
    const items = pattern.map((d) => {
      const raw = usePer ? d.perUnit : d.avg;
      const value = raw === null ? 0 : M.measureOf(pick.m.meter, raw);
      return { label: data.weekdays[d.weekday], value, tip: `${data.weekdaysLong[d.weekday]}: ${raw === null ? "–" : `${perText(pick.m.meter.medium, value)} ${label}`} (${dayCount(d.days)})` };
    });
    box.append(Chart.figure(Chart.bars(items, { title: `${pick.m.meter.name} · ${tx("Weekday pattern")}`, unit: `${measureUnit(pick.m.meter.medium)} ${label}`, format: (v) => num(v, v < 1 ? 2 : v < 100 ? 1 : 0) }), { fileName: "energy-weekdays" }));
    return box;
  };
  const factorPanel = (a) => {
    const box = panel(tx("Factors used"), t.factorNote);
    const list = el("ul", "et-factors");
    data.media.filter((m) => a.meters.some((x) => x.meter.medium === m.key)).forEach((m) => {
      const value = a.f[m.key];
      const item = el("li");
      item.append(el("strong", null, `${m.name}: `), value > 0 ? `${num(value, 3)} kg CO₂e / ${m.co2Unit}` : tx("no factor"), ` · ${m.co2Source}`);
      list.append(item);
    });
    box.append(list);
    if (a.meters.some((m) => m.meter.medium === "gas")) box.append(el("p", "dl-panel-note", `${t.hsHiNote} ${tx("Hs/Hi used: {n}.", { n: num(a.f.hsHi, 2) })}`));
    return box;
  };

  const renderResults = () => {
    results.replaceChildren();
    fillMeterLists();
    showHotel();
    results.hidden = !state.rows.length;
    if (!state.rows.length) return;
    const a = analyse();
    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${rangeText({ from: a.from, to: a.to })}${state.fMeter ? ` · ${meterById(state.fMeter)?.name || ""}` : ""}`));
    const title = el("h2");
    head.append(title);
    if (!a.meters.some((m) => m.sum.covered)) {
      title.append(tx("No use in this period yet."));
      head.append(el("p", "form-note", tx("A meter needs two readings: the use is the difference between them. Choose another period or add a reading.")));
      results.append(head);
      return;
    }
    const parts = [];
    if (a.energy.length) parts.push(kwhText(a.kwh));
    if (a.water.length) parts.push(qtyText("water", a.waterM3));
    title.append(el("span", null, parts.join(" · ")), [a.anyCost ? money(a.cost) : "", a.anyCo2 ? co2Text(a.co2) : ""].filter(Boolean).map((part) => ` · ${part}`).join(""));

    const stats = el("div", "dl-stats");
    if (a.energy.length) stats.append(stat(tx("Energy"), kwhText(a.kwh), a.energy.map((m) => `${m.meter.name} ${kwhText(m.kwh)}`).join(" · ")));
    if (a.water.length) stats.append(stat(tx("Water"), qtyText("water", a.waterM3), a.water.map((m) => `${m.meter.name} ${qtyText("water", m.sum.qty)}`).join(" · ")));
    stats.append(stat(tx("Cost"), costShown(a), a.noPrice.length ? tx("no price for {list}", { list: a.noPrice.map((m) => m.meter.name).join(", ") }) : tx("use × price, without fixed charges")));
    stats.append(stat("CO₂e", co2Shown(a), a.noFactor.length ? tx("no factor for {list}", { list: a.noFactor.map((m) => m.meter.name).join(", ") }) : tx("from the factors below; defaults count CO₂ only")));
    const unitNote = (g) => (g?.value == null
      ? tx("Enter the figure of the day (or use Hotel KPIs) to see it {per}.", { per: per() })
      : tx("{n} days with a figure for every meter and for the day", { n: int.format(g.days) }));
    if (a.energy.length) stats.append(stat(`${tx("Energy")} ${per()}`, a.energyUnit?.value == null ? "–" : perText("electricity", a.energyUnit.value), unitNote(a.energyUnit)));
    if (a.water.length) stats.append(stat(`${tx("Water")} ${per()}`, a.waterUnit?.value == null ? "–" : perText("water", a.waterUnit.value), unitNote(a.waterUnit)));
    stats.append(stat(tx("Signal"), a.fired.length ? `✕ ${a.fired[0].meter.name} ${changeText(a.fired[0].sig.change)}` : `✓ ${tx("no signal")}`,
      a.fired.length ? signalLine(a.fired[0]) : tx("No meter above its baseline by more than {r}.", { r: pct(a.set.threshold, 0) })));

    // What the readings cannot tell: gaps, a reading lower than the one before, days without readings.
    const notes = [];
    a.meters.forEach((m) => {
      m.lower.forEach((iv) => notes.push(el("p", "dl-warning", tx("{meter}: the reading of {date} ({value}) is lower than the one of {before} ({prev}). The {n} days between them have no use. Tick “meter replaced” on that reading if the meter was changed, or correct it.", { meter: m.meter.name, date: showDate(iv.to), value: readingText(iv.reading), before: showDate(iv.from), prev: readingText(iv.previous), n: int.format(iv.days) }))));
      m.swapGaps.forEach((iv) => notes.push(el("p", "dl-warning", tx("{meter}: meter replaced on {date} without the old meter's last reading. The {n} days from {before} have no use; add that reading to count them.", { meter: m.meter.name, date: showDate(iv.to), before: showDate(iv.from), n: int.format(iv.days) }))));
      if (m.missing > 0) notes.push(el("p", "dl-panel-note", tx("{meter}: {n} days of the period are not between two readings and have no figure.", { meter: m.meter.name, n: int.format(m.missing) })));
    });

    let focus = null;
    const top = a.fired[0];
    if (top) {
      const advice = data.advice[top.meter.medium] || data.advice.default;
      focus = focusCard({ title: tx("Check meter {name}", { name: top.meter.name }), detail: changeText(top.sig.change), lede: signalLine(top), advice, warning: ENERGY.has(top.meter.medium) && top.meter.medium !== "electricity" ? t.weatherNote : "" });
      const buttons = el("div", "tool-actions");
      a.fired.forEach((m) => buttons.append(actionButton(actionFor(m))));
      if (a.fired.length > 1) buttons.querySelectorAll("a").forEach((link, i) => { link.textContent = `${tx("Add to actions")}: ${a.fired[i].meter.name}`; });
      focus.append(buttons);
    }

    const actions = resultActions(() => summaryText(a), problemText(a) || t.tool);
    const daysButton = el("button", "button-secondary", tx("Daily values as CSV"));
    daysButton.type = "button";
    daysButton.addEventListener("click", () => dailyCsv(a));
    actions.append(daysButton);
    const panels = [meterTable(a)];
    if (a.energy.length) panels.push(energyChart(a));
    if (a.water.length) panels.push(waterChart(a));
    a.meters.forEach((m) => panels.push(lineChart(a, m)));
    panels.push(weekdayPanel(a), factorPanel(a));
    resultLayout(results, { head, stats, notes, focus, actions, panels });
  };

  // Every day of the period with a figure, per meter: the use, kWh and the unit figure of the day.
  const dailyCsv = (a) => {
    const u = units();
    const rows = [[tx("Date"), tx("Meter"), tx("Meter type"), tx("Consumption"), tx("Unit"), "kWh", denom().name]];
    a.meters.forEach((m) => {
      [...m.days.keys()].filter((d) => d >= a.from && d <= a.to).sort().forEach((date) => {
        const qty = m.days.get(date);
        const kwh = M.kwhOf(m.meter, qty);
        rows.push([date, m.meter.name, mediumOf(m.meter.medium).name, Math.round(qty * 1000) / 1000, unitOf(m.meter.medium), kwh === null ? "" : Math.round(kwh * 10) / 10, u[date] ?? ""]);
      });
    });
    downloadCsv(`${t.csv}-daily`, rows);
  };

  // The log --------------------------------------------------------------------------------------------------------
  const intervalText = (row) => {
    const iv = work().info.get(row);
    const meter = meterById(row.meter);
    if (iv === "first" || iv === undefined) return tx("first reading");
    if (iv === null) return tx("not used: a later entry for the same day");
    if (iv.status === "gap-lower") return `⚠ ${tx("lower than the reading before: gap")}`;
    if (iv.status === "gap-replaced") return `⚠ ${tx("meter replaced, no old last reading: gap")}`;
    return `${qtyText(meter.medium, iv.qty)} · ${dayCount(iv.days)}${iv.status === "swap" ? ` · ${tx("meter replaced")}` : ""}`;
  };
  const book = logBook({
    root,
    key: KEY,
    state,
    save,
    results,
    paste,
    clearExample: () => {
      const ex = data.example;
      if (JSON.stringify(M.cleanMeters(state.meters)) === JSON.stringify(M.cleanMeters(ex.meters))) state.meters = copyOf(data.meters);
      const exUnits = M.exampleUnits(data, today());
      Object.entries(exUnits).forEach(([date, n]) => { if (state.units[date] === n) delete state.units[date]; });
      state.threshold = "";
      state.baselineWeeks = "";
      state.baselineFrom = "";
      state.baselineTo = "";
      state.fMeter = "";
      renderMeters();
    },
    cells: (row) => [
      el("td", "nowrap", showDate(row.date)),
      el("td", null, meterById(row.meter)?.name || row.meter),
      el("td", "nowrap", `${readingText(row)}${row.replaced ? ` · ${tx("new meter")}` : ""}`),
      el("td", null, intervalText(row)),
      el("td", null, row.note),
    ],
    removeLabel: (row) => tx("Remove the reading of {meter} of {date}", { meter: meterById(row.meter)?.name || "", date: showDate(row.date) }),
    removedText: (row) => tx("Removed the reading of {meter} of {date}.", { meter: meterById(row.meter)?.name || "", date: showDate(row.date) }),
    countText: (rows) => tx("{n} readings of {m} meters", { n: int.format(rows.length), m: int.format(new Set(rows.map((r) => r.meter)).size) }),
    importRows: (text) => M.importRows(text, state.meters),
    importText: {
      none: tx("No rows found. Check that each row has a date, a meter named as in the list and a reading."),
      done: (added, skipped) => `${tx("Imported {n} rows", { n: int.format(added) })}${skipped ? tx(", skipped {n} without a date, a known meter or a reading", { n: int.format(skipped) }) : ""}.`,
    },
    loadExample: () => {
      state.meters = copyOf(data.example.meters);
      state.rows = M.exampleRows(data, today());
      state.units = { ...state.units, ...M.exampleUnits(data, today()) };
      state.denom = data.example.settings.denom;
      state.threshold = String(data.example.settings.threshold);
      state.baselineWeeks = String(data.example.settings.baselineWeeks);
      state.baselineFrom = "";
      state.baselineTo = "";
      state.fMeter = "";
      state.grain = "";
      renderMeters();
    },
    clearText: tx("Clear all readings of {tool}?", { tool: t.tool }),
    csv: () => ({
      name: t.csv,
      rows: [
        [tx("Date"), tx("Meter"), tx("Meter type"), tx("Reading"), tx("Unit"), tx("Meter replaced"), tx("Old meter's last reading"), tx("Use since the reading before"), tx("Days"), "kWh", tx("Note")],
        ...[...state.rows].sort((x, y) => x.date.localeCompare(y.date) || x.meter.localeCompare(y.meter)).map((row) => {
          const meter = meterById(row.meter);
          const r = M.resolveMeter(meter, conv);
          const found = work().info.get(row);
          const iv = found && typeof found === "object" ? found : null;
          const kwh = iv?.qty != null ? M.kwhOf(r, iv.qty) : null;
          return [row.date, meter.name, mediumOf(meter.medium).name, row.value, unitOf(meter.medium), row.replaced ? tx("yes") : "", row.oldFinal ?? "", iv?.qty ?? "", iv ? iv.days : "", kwh === null ? "" : Math.round(kwh * 10) / 10, row.note];
        }),
      ],
    }),
    renderResults,
  });

  // The meter filter belongs to the results; every reading stays in the table and the CSV.
  meterFilter.addEventListener("change", () => {
    state.fMeter = meterFilter.value;
    save();
    renderResults();
  });

  // The reading form: the last reading of the meter and the use since then, as it is typed.
  // Declared as functions: the meter lists call them while the log is first set up.
  // While the example is shown, a reading by hand replaces it: the example's readings are not the one before.
  function lastReading(meterId, before) {
    if (kit.exampleMatches(state)) return null;
    return state.rows.filter((row) => row.meter === meterId && (!before || row.date < before)).sort((x, y) => x.date.localeCompare(y.date)).at(-1) || null;
  }
  function showHint() {
    const meter = meterById(form.meter.value);
    if (!meter) { hint.textContent = state.meters.length ? "" : tx("Add a meter first."); return; }
    const date = parseDate(form.date.value);
    const last = lastReading(meter.id, date);
    if (!last) { hint.textContent = tx("First reading of {meter}: the use starts from the next one.", { meter: meter.name }); return; }
    const value = parseNumber(form.value.value);
    let text = tx("Reading before: {value} on {date}.", { value: readingText(last), date: showDate(last.date) });
    if (Number.isFinite(value) && date) {
      const days = M.between(last.date, date);
      if (form.replaced.checked) {
        const old = parseNumber(form.oldFinal.value);
        if (Number.isFinite(old) && old >= last.value) text += ` ${tx("Use up to the swap: {qty} over {n} days.", { qty: qtyText(meter.medium, old - last.value), n: int.format(days) })}`;
      } else if (value >= last.value) text += ` ${tx("Use: {qty} over {n} days, {d} per day.", { qty: qtyText(meter.medium, value - last.value), n: int.format(days), d: qtyText(meter.medium, (value - last.value) / days) })}`;
      else text += ` ${tx("This is lower than the reading before: tick “meter replaced” if the meter was changed.")}`;
    }
    hint.textContent = text;
  }
  ["input", "change"].forEach((type) => entry.addEventListener(type, showHint));
  const syncOld = () => { oldBox.hidden = !form.replaced.checked; };
  form.replaced.addEventListener("change", syncOld);

  form.date.value = today();
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const meter = meterById(form.meter.value);
    if (!meter) { flash(entryStatus, tx("Add a meter first.")); return; }
    const date = parseDate(form.date.value);
    if (!date) { form.date.focus(); flash(entryStatus, tx("Enter the date of the reading.")); return; }
    const value = parseNumber(form.value.value);
    if (!(value >= 0)) { form.value.focus(); flash(entryStatus, tx("Enter the reading as the meter shows it.")); return; }
    const replaced = form.replaced.checked;
    const oldRaw = form.oldFinal.value.trim();
    const oldFinal = oldRaw ? parseNumber(oldRaw) : NaN;
    if (replaced && oldRaw && !(oldFinal >= 0)) { form.oldFinal.focus(); flash(entryStatus, tx("Enter the old meter's last reading as a number, or leave it empty.")); return; }
    const before = lastReading(meter.id, date);
    if (!replaced && before && value < before.value) {
      form.value.focus();
      flash(entryStatus, tx("This reading is lower than the one of {date} ({value}). Tick “meter replaced” if the meter was changed, or check the figure.", { date: showDate(before.date), value: readingText(before) }));
      return;
    }
    if (replaced && before && Number.isFinite(oldFinal) && oldFinal < before.value) {
      form.oldFinal.focus();
      flash(entryStatus, tx("The old meter's last reading is lower than its reading of {date} ({value}).", { date: showDate(before.date), value: readingText(before) }));
      return;
    }
    const row = M.cleanRow({ date, meter: meter.id, value, replaced, oldFinal: Number.isFinite(oldFinal) ? oldFinal : null, note: form.note.value }, state.meters.map((m) => m.id));
    // One reading per meter and day: a new one for the same day takes the place of the old.
    const same = !kit.exampleMatches(state) && state.rows.some((r) => r.meter === meter.id && r.date === date);
    if (same) state.rows = state.rows.filter((r) => !(r.meter === meter.id && r.date === date));
    form.value.value = "";
    form.oldFinal.value = "";
    form.note.value = "";
    form.replaced.checked = false;
    syncOld();
    book.add(row);
    flash(entryStatus, `${tx("Added: {meter}, {value} on {date}.", { meter: meter.name, value: readingText(row), date: showDate(date) })}${same ? ` ${tx("It replaces the reading of that day.")}` : ""}`);
    showHint();
    form.value.focus();
  });

  // Units of the day: typed one by one or pasted as date and number; an empty box removes the day's figure.
  const df = denomForm.elements;
  const showDenom = () => { df.units.value = state.units[df.unitsDate.value] ?? ""; };
  df.unitsDate.value = today();
  df.unitsDate.addEventListener("change", showDenom);
  denomForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = parseDate(df.unitsDate.value);
    if (!date) { df.unitsDate.focus(); flash(denomStatus, tx("Enter the date.")); return; }
    const raw = df.units.value.trim();
    const n = raw ? parseNumber(raw) : 0;
    if (raw && !(n >= 0)) { df.units.focus(); flash(denomStatus, tx("Enter a number of 0 or more.")); return; }
    if (n > 0) state.units[date] = n;
    else delete state.units[date];
    save();
    renderResults();
    flash(denomStatus, n > 0 ? tx("{n} saved for {date}.", { n: int.format(n), date: showDate(date) }) : tx("Figure removed for {date}.", { date: showDate(date) }));
  });
  root.querySelector("[data-units-import]").addEventListener("click", () => {
    const area = root.querySelector("#et-units-paste");
    const { added, skipped } = importVolumes(area.value);
    if (!added.length) { flash(denomStatus, tx("No days found. Each row needs a date and a number above 0.")); return; }
    added.forEach((item) => { state.units[item.date] = item.volume; });
    area.value = "";
    save();
    renderResults();
    flash(denomStatus, `${tx("Imported {n} days", { n: int.format(added.length) })}${skipped ? tx(", skipped {n}", { n: int.format(skipped) }) : ""}.`);
  });
  hotelBox.checked = state.useHotel !== false;
  hotelBox.addEventListener("change", () => {
    state.useHotel = hotelBox.checked;
    save();
    renderResults();
  });
  function showHotel() {
    const nights = Object.keys(hotel()).sort();
    hotelBox.closest("[data-hotel]").hidden = state.denom !== "rooms";
    hotelNote.textContent = nights.length ? t.hotelNote.replace("{n}", int.format(nights.length)).replace("{from}", showDate(nights[0])).replace("{to}", showDate(nights.at(-1))) : t.hotelNone;
  }
  // Hotel KPIs changed in another tab: read it again.
  window.addEventListener("storage", (event) => { if (event.key === HOTEL_KEY || event.key === null) renderResults(); });

  renderMeters();
  syncOld();
  book.render();
  showDenom();
})();
