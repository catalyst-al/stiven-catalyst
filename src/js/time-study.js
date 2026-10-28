// Time Study: elements timed with a stopwatch over several cycles, the takt from demand and available time, a
// Yamazumi per station and a balancing suggestion. The arithmetic lives in window.TimeStudyMath so the tests can call it.
(() => {
  const kit = window.ToolKit || {};
  const parseNumber = kit.parseNumber || ((value) => Number(String(value ?? "").replace(",", ".")));
  const parseRows = kit.parseRows || ((text) => String(text ?? "").split(/\r?\n/).filter(Boolean).map((line) => line.split(/\t|;|,/)));
  const canon = kit.canon || ((options, value, empty) => (String(value ?? "").trim() ? options.find((o) => o.toLowerCase() === String(value).trim().toLowerCase()) || String(value).trim() : empty));
  const TYPES = ["VA", "NVA", "W"];
  const EPS = 1e-9;

  // Arithmetic -------------------------------------------------------------------------------------------------------
  // Takt in seconds: the available seconds of the period over the demand of the same period.
  const takt = (availableSeconds, demand) => (availableSeconds > 0 && demand > 0 && Number.isFinite(availableSeconds) && Number.isFinite(demand) ? availableSeconds / demand : null);
  const sorted = (values) => values.filter(Number.isFinite).sort((a, b) => a - b);
  const quantile = (s, p) => {
    const i = (s.length - 1) * p;
    const lo = Math.floor(i);
    return s[lo] + (s[Math.min(s.length - 1, lo + 1)] - s[lo]) * (i - lo);
  };
  const median = (values) => {
    const s = sorted(values);
    return s.length ? quantile(s, 0.5) : null;
  };
  // The statistics of one element: the median is the observed time (one dropped box does not move it), the spread says
  // how repeatable the work is, the outliers are the cycles more than 1.5 IQR away from the middle half.
  const stats = (values) => {
    const s = sorted(values);
    if (!s.length) return { n: 0, median: null, mean: null, min: null, max: null, spread: null, sd: null, cv: null, q1: null, q3: null, outliers: [] };
    const mean = s.reduce((a, b) => a + b, 0) / s.length;
    const sd = s.length > 1 ? Math.sqrt(s.reduce((a, v) => a + (v - mean) ** 2, 0) / (s.length - 1)) : 0;
    const q1 = quantile(s, 0.25), q3 = quantile(s, 0.75), iqr = q3 - q1;
    return {
      n: s.length, median: quantile(s, 0.5), mean, min: s[0], max: s.at(-1), spread: s.at(-1) - s[0], sd, cv: mean > 0 ? sd / mean : 0, q1, q3,
      outliers: s.filter((v) => v < q1 - 1.5 * iqr - EPS || v > q3 + 1.5 * iqr + EPS),
    };
  };
  // The standard time of an element: the observed median × the performance rating (the observed pace against a normal
  // pace, 1 = 100 %) × (1 + the allowance for personal needs, fatigue and unavoidable delay). With the defaults, 100 %
  // and 0 %, it is the observed median (audit of 27 October 2026, T-23 / P2B-09).
  const standardTime = (median, rating = 1, allowance = 0) => median * rating * (1 + allowance);
  // The next cycle to time at a station: one more than the highest cycle with a timing there.
  const nextCycle = (rows, s) => rows.filter((row) => row.s === s).reduce((max, row) => Math.max(max, row.c), 0) + 1;

  // Balancing: while a station is above takt, move one of its elements to the station with the most slack. The element
  // comes from the edge that faces the target (the last element when the target is downstream, the first when it is
  // upstream), so the order of the work stays; only when no edge element fits does the largest element that fits move.
  // stations: [{ name, elements: [{ name, median }] }]. Returns the moves in order, each with the totals after it.
  const balance = (stations, taktSeconds) => {
    const moves = [];
    if (!(taktSeconds > 0)) return moves;
    const lists = stations.map((station) => station.elements.filter((e) => Number.isFinite(e.median) && e.median > 0).map((e) => ({ ...e })));
    const totals = lists.map((list) => list.reduce((sum, e) => sum + e.median, 0));
    const moved = new Set();
    for (let step = 0; step < 24; step++) {
      let over = -1;
      totals.forEach((total, i) => { if (total > taktSeconds + EPS && (over < 0 || total > totals[over])) over = i; });
      if (over < 0) break;
      let target = -1;
      totals.forEach((total, i) => { if (i !== over && total < taktSeconds - EPS && (target < 0 || total < totals[target])) target = i; });
      if (target < 0) break;
      const slack = taktSeconds - totals[target];
      const list = lists[over];
      const fits = (e) => e && !moved.has(e) && e.median <= slack + EPS;
      const edge = target > over ? list.at(-1) : list[0];
      const pick = fits(edge) ? edge : list.filter(fits).sort((a, b) => b.median - a.median)[0];
      if (!pick) break;
      list.splice(list.indexOf(pick), 1);
      if (target > over) lists[target].unshift(pick); else lists[target].push(pick);
      moved.add(pick);
      totals[over] -= pick.median;
      totals[target] += pick.median;
      // The totals are reported clean: a few additions of tenths should not show as 29.800000000000004.
      const clean = (value) => Math.round(value * 1e6) / 1e6;
      moves.push({ from: over, to: target, element: pick.name, seconds: pick.median, inOrder: pick === edge, fromTotal: clean(totals[over]), toTotal: clean(totals[target]) });
    }
    return moves;
  };

  // The whole study: stations [{ name, elements: [{ name, type }] }], rows [{ s, e, c, t }] (station, element, cycle,
  // seconds), the takt, the rating and the allowance (shares). Each element keeps its observed median and gets its
  // standard time; the stations, the operators and the balancing work with the standard times. Every number the page
  // shows comes from here.
  const analyse = ({ stations, rows, takt: taktSeconds, rating = 1, allowance = 0 }) => {
    const byType = () => Object.fromEntries(TYPES.map((type) => [type, 0]));
    const outliers = [];
    const stationResults = stations.map((station, s) => {
      const mine = rows.filter((row) => row.s === s);
      const elements = station.elements.map((element, e) => {
        const values = mine.filter((row) => row.e === e).map((row) => row.t);
        const st = stats(values);
        st.outliers.forEach((value) => outliers.push({ station: station.name, element: element.name, value }));
        const median = st.median ?? 0;
        return { name: element.name, type: TYPES.includes(element.type) ? element.type : "VA", index: e, ...st, median, standard: standardTime(median, rating, allowance) };
      });
      const types = byType();
      elements.forEach((element) => { types[element.type] += element.standard; });
      const total = elements.reduce((sum, element) => sum + element.standard, 0);
      // Whole cycles: the sum of a cycle's elements when every element of the station was timed in it.
      const cycles = [...new Set(mine.map((row) => row.c))].sort((a, b) => a - b);
      const cycleTotals = cycles.map((c) => {
        const parts = elements.map((element) => mine.filter((row) => row.c === c && row.e === element.index).map((row) => row.t));
        return parts.every((p) => p.length) ? parts.reduce((sum, p) => sum + median(p), 0) : null;
      }).filter(Number.isFinite);
      const observed = elements.filter((element) => element.n > 0);
      return {
        name: station.name, index: s, elements, total, types, cycles: cycles.length, cycleTotals, rows: mine.length,
        minCycles: elements.length ? Math.min(...elements.map((element) => element.n)) : 0,
        maxCycles: elements.length ? Math.max(...elements.map((element) => element.n)) : 0,
        unobserved: elements.filter((element) => element.n === 0).map((element) => element.name),
        cycleStats: stats(cycleTotals),
        over: taktSeconds ? total - taktSeconds : null,
        hasData: observed.length > 0,
      };
    });
    const withData = stationResults.filter((station) => station.hasData);
    const sum = stationResults.reduce((acc, station) => acc + station.total, 0);
    const types = byType();
    stationResults.forEach((station) => TYPES.forEach((type) => { types[type] += station.types[type]; }));
    const shares = Object.fromEntries(TYPES.map((type) => [type, sum > 0 ? types[type] / sum : 0]));
    const bottleneck = withData.length ? withData.reduce((best, station) => (station.total > best.total ? station : best), withData[0]) : null;
    const efficiency = bottleneck && bottleneck.total > 0 ? sum / (withData.length * bottleneck.total) : null;
    const operators = taktSeconds && sum > 0 ? Math.ceil(sum / taktSeconds - EPS) : null;
    const over = taktSeconds ? stationResults.filter((station) => station.total > taktSeconds + EPS) : [];
    const moves = taktSeconds ? balance(stationResults.map((station) => ({ name: station.name, elements: station.elements.map((element) => ({ name: element.name, median: element.standard, type: element.type })) })), taktSeconds) : [];
    const observedElements = stationResults.flatMap((station) => station.elements).filter((element) => element.n > 0);
    return {
      stations: stationResults, sum, types, shares, bottleneck, efficiency, operators, over, moves, outliers, takt: taktSeconds, rating, allowance,
      cycles: observedElements.length ? { min: Math.min(...observedElements.map((element) => element.n)), max: Math.max(...observedElements.map((element) => element.n)) } : { min: 0, max: 0 },
      unobserved: stationResults.flatMap((station) => station.unobserved.map((name) => `${station.name} · ${name}`)),
      rows: rows.length,
    };
  };

  // Rows typed or pasted from a spreadsheet: station, element, cycle, seconds. A station or element may be its name
  // (the start of it is enough) or its number; the cycle may be blank (1); seconds take a comma or a point.
  const parseObservations = (text, stations) => {
    const added = [];
    let skipped = 0;
    const names = stations.map((station) => station.name);
    const indexOf = (options, value) => {
      const raw = String(value ?? "").trim();
      if (/^\d+$/.test(raw) && Number(raw) >= 1 && Number(raw) <= options.length) return Number(raw) - 1;
      const hit = canon(options, raw, "");
      return options.indexOf(hit);
    };
    parseRows(text).forEach((cells, index) => {
      const [station, element, cycle, seconds] = cells;
      const s = indexOf(names, station);
      const e = s >= 0 ? indexOf(stations[s].elements.map((item) => item.name), element) : -1;
      const c = String(cycle ?? "").trim() === "" ? 1 : Math.round(parseNumber(cycle));
      const t = Math.round(parseNumber(seconds) * 10) / 10;
      if (s < 0 || e < 0 || !(c >= 1) || !Number.isSafeInteger(c) || !(t > 0)) {
        if (index > 0) skipped++;
        return;
      }
      added.push({ s, e, c, t });
    });
    return { added, skipped };
  };

  // The example of the data file as a state: stations with their elements, and one row per timed cycle.
  const fromExample = (example) => {
    const rows = [];
    const stations = (example.stations || []).map((station, s) => ({
      name: station.name,
      elements: (station.elements || []).map((element, e) => {
        (element.times || []).forEach((t, c) => rows.push({ s, e, c: c + 1, t }));
        return { name: element.name, type: TYPES.includes(element.type) ? element.type : "VA" };
      }),
    }));
    return { process: String(example.process || ""), demand: String(example.demand ?? ""), available: String(example.available ?? ""), stations, rows };
  };

  window.TimeStudyMath = { TYPES, takt, median, stats, standardTime, nextCycle, balance, analyse, parseObservations, fromExample };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-time-study]");
  const dataEl = document.getElementById("time-study-data");
  if (!root || !dataEl || !window.ToolKit) return;
  const { tx, num, pct, int, el, read, write, loadState, isObject, str, firstVisit, panel, stat, focusCard, resultActions, resultLayout, renderOnPause, flash, undoNote, downloadCsv, downloadXlsx, capital } = window.ToolKit;
  const CK = window.ChartKit;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;
  const MAX_STATIONS = 8;
  const typeLabel = (type) => data.types[type]?.label || type;
  const typeColor = { VA: CK?.C.blue, NVA: CK?.C.warn, W: CK?.C.danger };
  const sec = (value) => `${num(value, 1)} s`;

  const results = document.querySelector("[data-results]");
  const stationsBox = root.querySelector("[data-stations]");
  const addStationButton = root.querySelector("[data-add-station]");
  const settings = [...root.querySelectorAll("[data-setting]")];
  const taktOut = root.querySelector("[data-takt]");
  const watch = {
    station: root.querySelector("[data-watch-station]"), cycle: root.querySelector("[data-watch-cycle]"), clock: root.querySelector("[data-clock]"),
    current: root.querySelector("[data-current]"), start: root.querySelector("[data-start]"), lap: root.querySelector("[data-lap]"), stop: root.querySelector("[data-stop]"),
    undo: root.querySelector("[data-undo-lap]"), status: root.querySelector("[data-watch-status]"),
  };
  const entry = root.querySelector("[data-entry]");
  const entryStation = entry.querySelector("[data-entry-station]");
  const entryElement = entry.querySelector("[data-entry-element]");
  const entryStatus = entry.querySelector("[data-entry-status]");
  const paste = root.querySelector("[data-paste]");
  const importStatus = root.querySelector("[data-import-status]");
  const logBody = root.querySelector("[data-log]");
  const logWrap = root.querySelector("[data-log-wrap]");
  const logEmpty = root.querySelector("[data-log-empty]");
  const logCount = root.querySelector("[data-log-count]");
  const logStatus = root.querySelector("[data-log-status]");
  const more = root.querySelector("[data-more]");

  // State: the process, the stations with their elements, one row per timed element and cycle. Saved data is rebuilt
  // field by field, so nothing damaged can break the page.
  const blankElement = () => ({ name: "", type: "VA" });
  const blankStation = () => ({ name: "", elements: [blankElement()] });
  // rating and allowance are percentages as typed; blank is 100 % and 0 % (studies saved before they existed load so).
  const defaults = { process: "", demand: "", available: "", rating: "", allowance: "", stations: [], rows: [], example: false };
  const state = loadState(KEY, defaults);
  state.stations = state.stations.filter(isObject).slice(0, MAX_STATIONS).map((station) => ({
    name: str(station.name).slice(0, 80),
    elements: (Array.isArray(station.elements) ? station.elements : []).filter(isObject).slice(0, 30).map((element) => ({ name: str(element.name).slice(0, 80), type: TYPES.includes(element.type) ? element.type : "VA" })),
  }));
  state.rows = state.rows.filter((row) => isObject(row) && Number.isInteger(row.s) && Number.isInteger(row.e) && Number.isInteger(row.c) && row.c >= 1 && Number.isFinite(row.t) && row.t > 0
    && state.stations[row.s]?.elements[row.e]).map((row) => ({ s: row.s, e: row.e, c: row.c, t: Math.round(row.t * 10) / 10 }));
  const loadExample = () => {
    Object.assign(state, fromExample(data.example), { example: true });
  };
  // A first visit opens on the example, so the result is visible at once; the note above it says so.
  if (!state.stations.length && firstVisit(KEY)) loadExample();
  if (!state.stations.length) state.stations.push(blankStation());
  const save = () => write(KEY, state);
  // The visitor's own first change ends the example: the data stays, the note goes.
  const own = () => { state.example = false; };

  const taktNow = () => takt(parseNumber(state.available) * 60, parseNumber(state.demand));
  // The rating as a share (100 % = 1; from 1 to 300 %, else 100 %) and the allowance (0 to 200 %, else 0 %).
  const ratingNow = () => { const r = parseNumber(state.rating); return String(state.rating).trim() && r >= 1 && r <= 300 ? r / 100 : 1; };
  const allowanceNow = () => { const a = parseNumber(state.allowance); return String(state.allowance).trim() && a >= 0 && a <= 200 ? a / 100 : 0; };
  const stationName = (s) => state.stations[s]?.name.trim() || tx("Station {n}", { n: s + 1 });
  const elementName = (s, e) => state.stations[s]?.elements[e]?.name.trim() || tx("Element {n}", { n: e + 1 });
  const stationTitle = (s) => `${s + 1} · ${stationName(s)}`;

  // Example note above the results, with one tap to clear the example.
  const note = el("div", "dl-example-note");
  note.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  clearExample.addEventListener("click", () => {
    Object.assign(state, defaults, { stations: [blankStation()], rows: [] });
    stopWatch();
    save();
    renderAll();
  });
  note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(note);

  // Setup: process and takt --------------------------------------------------------------------------------------------
  const showSettings = () => settings.forEach((input) => { input.value = state[input.name] ?? ""; });
  const renderTakt = () => {
    const t = taktNow();
    taktOut.textContent = t ? tx("Takt {takt}: one unit every {takt}.", { takt: sec(t) }) : tx("Enter the demand and the available minutes to see the takt.");
  };
  settings.forEach((input) => input.addEventListener("input", () => {
    state[input.name] = input.value;
    own();
    save();
    renderTakt();
    renderSoon();
  }));

  // Setup: stations and their elements -----------------------------------------------------------------------------------
  const hiddenLabel = (id, text) => {
    const label = el("label", "visually-hidden", text);
    label.htmlFor = id;
    return label;
  };
  const removeButton = (label, attrs) => {
    const button = el("button", "dl-remove", "×");
    button.type = "button";
    button.setAttribute("aria-label", label);
    Object.assign(button.dataset, attrs);
    return button;
  };
  const renderStations = () => {
    stationsBox.replaceChildren();
    state.stations.forEach((station, s) => {
      const box = el("div", "ts-station");
      const head = el("div", "ts-station-head");
      const id = `ts-s${s}-name`;
      const name = el("input", "ts-in");
      name.id = id;
      name.value = station.name;
      name.placeholder = tx("e.g. Pack");
      name.autocomplete = "off";
      Object.assign(name.dataset, { field: "station", s });
      head.append(el("span", "ts-no", String(s + 1)), hiddenLabel(id, tx("Name of station {n}", { n: s + 1 })), name);
      if (state.stations.length > 1) head.append(removeButton(tx("Remove station {n}", { n: s + 1 }), { removeStation: s }));
      box.append(head);
      const list = el("div", "ts-elements");
      station.elements.forEach((element, e) => {
        const row = el("div", "ts-element");
        const nameId = `ts-s${s}-e${e}-name`, typeId = `ts-s${s}-e${e}-type`;
        const input = el("input", "ts-in");
        input.id = nameId;
        input.value = element.name;
        input.placeholder = tx("e.g. Fetch box");
        input.autocomplete = "off";
        Object.assign(input.dataset, { field: "element", s, e });
        const select = el("select", "ts-in ts-type");
        select.id = typeId;
        TYPES.forEach((type) => {
          const option = el("option", null, `${type} · ${typeLabel(type)}`);
          option.value = type;
          option.selected = type === element.type;
          select.append(option);
        });
        Object.assign(select.dataset, { field: "type", s, e });
        row.append(el("span", "ts-no ts-no-small", `${s + 1}.${e + 1}`), hiddenLabel(nameId, tx("Element {a} of station {b}", { a: e + 1, b: s + 1 })), input, hiddenLabel(typeId, tx("Type of element {a}.{b}", { a: s + 1, b: e + 1 })), select);
        if (station.elements.length > 1) row.append(removeButton(tx("Remove element {a}.{b}", { a: s + 1, b: e + 1 }), { removeElement: e, s }));
        list.append(row);
      });
      box.append(list);
      const add = el("button", "button-ghost ts-add", tx("+ Add an element"));
      add.type = "button";
      add.dataset.addElement = s;
      box.append(add);
      stationsBox.append(box);
    });
    addStationButton.hidden = state.stations.length >= MAX_STATIONS;
  };
  // A typed name updates the state without redrawing the list, so the cursor stays where it is.
  stationsBox.addEventListener("input", (event) => {
    const { field, s, e } = event.target.dataset;
    if (!field) return;
    if (field === "station") state.stations[s].name = event.target.value;
    else if (field === "element") state.stations[s].elements[e].name = event.target.value;
    else if (field === "type") state.stations[s].elements[e].type = event.target.value;
    own();
    save();
    renderSelects();
    renderSoon();
  });
  stationsBox.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const { addElement, removeStation, removeElement, s } = button.dataset;
    if (addElement !== undefined) {
      state.stations[addElement].elements.push(blankElement());
    } else if (removeStation !== undefined) {
      const index = Number(removeStation);
      if (state.rows.some((row) => row.s === index) && !window.confirm(tx("Remove this station and its {n} timings?", { n: state.rows.filter((row) => row.s === index).length }))) return;
      state.stations.splice(index, 1);
      state.rows = state.rows.filter((row) => row.s !== index).map((row) => (row.s > index ? { ...row, s: row.s - 1 } : row));
    } else if (removeElement !== undefined) {
      const si = Number(s), ei = Number(removeElement);
      if (state.rows.some((row) => row.s === si && row.e === ei) && !window.confirm(tx("Remove this element and its {n} timings?", { n: state.rows.filter((row) => row.s === si && row.e === ei).length }))) return;
      state.stations[si].elements.splice(ei, 1);
      state.rows = state.rows.filter((row) => !(row.s === si && row.e === ei)).map((row) => (row.s === si && row.e > ei ? { ...row, e: row.e - 1 } : row));
    } else return;
    own();
    stopWatch();
    save();
    renderAll();
    if (addElement !== undefined) stationsBox.querySelector(`[data-field="element"][data-s="${addElement}"][data-e="${state.stations[addElement].elements.length - 1}"]`)?.focus();
  });
  addStationButton.addEventListener("click", () => {
    if (state.stations.length >= MAX_STATIONS) return;
    state.stations.push(blankStation());
    own();
    save();
    renderAll();
    stationsBox.querySelector(`[data-field="station"][data-s="${state.stations.length - 1}"]`)?.focus();
  });

  // The station selects of the stopwatch and the entry form.
  const fillStations = (select, current) => {
    select.replaceChildren(...state.stations.map((station, s) => {
      const option = el("option", null, stationTitle(s));
      option.value = String(s);
      option.selected = s === current;
      return option;
    }));
  };
  const fillElements = (select, s, current) => {
    select.replaceChildren(...(state.stations[s]?.elements || []).map((element, e) => {
      const option = el("option", null, `${elementName(s, e)} (${element.type})`);
      option.value = String(e);
      option.selected = e === current;
      return option;
    }));
  };
  const renderSelects = () => {
    fillStations(watch.station, clockState.s);
    fillStations(entryStation, Number(entryStation.value) || 0);
    fillElements(entryElement, Number(entryStation.value) || 0, Number(entryElement.value) || 0);
    renderCurrent();
  };
  entryStation.addEventListener("change", () => fillElements(entryElement, Number(entryStation.value), 0));

  // Stopwatch ------------------------------------------------------------------------------------------------------------
  // One lap closes the element being watched and opens the next; after the last element of the station the next cycle
  // starts. The clock itself is not saved: a reload starts a fresh watch, the laps already taken are in the log.
  const clockState = { s: 0, e: 0, c: 1, running: false, lapStart: 0, timer: null };
  const clockText = (ms) => num(Math.max(0, ms) / 1000, 1);
  const renderClock = () => { watch.clock.textContent = clockState.running ? clockText(performance.now() - clockState.lapStart) : num(0, 1); };
  const renderCurrent = () => {
    const station = state.stations[clockState.s];
    if (!station) { watch.current.textContent = ""; return; }
    if (clockState.e >= station.elements.length) clockState.e = 0;
    watch.current.replaceChildren(
      el("strong", null, elementName(clockState.s, clockState.e)),
      ` · ${tx("element {a} of {b}", { a: clockState.e + 1, b: station.elements.length })} · ${tx("cycle {n}", { n: clockState.c })}`,
    );
    watch.cycle.value = String(clockState.c);
    watch.start.hidden = clockState.running;
    watch.lap.hidden = !clockState.running;
    watch.stop.hidden = !clockState.running;
    watch.undo.hidden = !state.rows.some((row) => row.s === clockState.s);
  };
  const setWatchStation = (s) => {
    clockState.s = Math.min(Math.max(0, s), state.stations.length - 1);
    clockState.e = 0;
    clockState.c = nextCycle(state.rows, clockState.s);
    renderCurrent();
  };
  const startWatch = () => {
    if (!state.stations[clockState.s]?.elements.length) { flash(watch.status, tx("Add a station with at least one element first.")); return; }
    clockState.running = true;
    clockState.lapStart = performance.now();
    clockState.timer = setInterval(renderClock, 100);
    renderClock();
    renderCurrent();
    flash(watch.status, tx("Running. Space or Lap closes the element being watched."));
  };
  const lap = () => {
    if (!clockState.running) return;
    const now = performance.now();
    const t = Math.max(0.1, Math.round((now - clockState.lapStart) / 100) / 10);
    const station = state.stations[clockState.s];
    state.rows.push({ s: clockState.s, e: clockState.e, c: clockState.c, t });
    own();
    clockState.lapStart = now;
    clockState.e++;
    if (clockState.e >= station.elements.length) { clockState.e = 0; clockState.c++; }
    save();
    renderClock();
    renderLog();
    renderCurrent();
    renderSoon();
  };
  const stopWatch = () => {
    if (!clockState.running) return;
    clockState.running = false;
    clearInterval(clockState.timer);
    renderClock();
    renderCurrent();
  };
  watch.start.addEventListener("click", startWatch);
  watch.lap.addEventListener("click", lap);
  watch.stop.addEventListener("click", () => {
    // Stop closes the element being watched, like a lap, then holds; nothing of a timed element is lost.
    lap();
    stopWatch();
    flash(watch.status, tx("Stopped. Start again to continue with the next element."));
  });
  // The last lap can be taken back: a lap pressed twice, or one pressed while the operator was interrupted.
  watch.undo.addEventListener("click", () => {
    const index = state.rows.map((row) => row.s).lastIndexOf(clockState.s);
    if (index < 0) return;
    const [removed] = state.rows.splice(index, 1);
    clockState.e = removed.e;
    clockState.c = removed.c;
    clockState.lapStart = performance.now();
    save();
    renderClock();
    renderLog();
    renderCurrent();
    renderSoon();
    flash(watch.status, tx("Removed {element}, cycle {n}: {t}.", { element: elementName(removed.s, removed.e), n: removed.c, t: sec(removed.t) }));
  });
  watch.station.addEventListener("change", () => { stopWatch(); setWatchStation(Number(watch.station.value)); });
  watch.cycle.addEventListener("change", () => {
    const c = Math.round(parseNumber(watch.cycle.value));
    clockState.c = c >= 1 && Number.isSafeInteger(c) ? c : nextCycle(state.rows, clockState.s);
    renderCurrent();
  });
  // Space is the lap key, anywhere on the page that is not a box to type in; on a button it does what the button does.
  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space" && event.key !== " ") return;
    if (event.target.closest("input, textarea, select, button, a, [contenteditable]")) return;
    event.preventDefault();
    if (clockState.running) lap(); else startWatch();
  });

  // Typed and pasted observations --------------------------------------------------------------------------------------
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const s = Number(entryStation.value), e = Number(entryElement.value);
    const c = Math.round(parseNumber(entry.elements.cycle.value));
    const t = Math.round(parseNumber(entry.elements.seconds.value) * 10) / 10;
    if (!state.stations[s]?.elements[e] || !(c >= 1) || !(t > 0)) { flash(entryStatus, tx("Choose the station and element, a cycle from 1 and the seconds.")); return; }
    state.rows.push({ s, e, c, t });
    own();
    save();
    entry.elements.seconds.value = "";
    // The next element of the same cycle is the likely next entry; after the last, the next cycle.
    if (e + 1 < state.stations[s].elements.length) fillElements(entryElement, s, e + 1);
    else { fillElements(entryElement, s, 0); entry.elements.cycle.value = String(c + 1); }
    entry.elements.seconds.focus();
    flash(entryStatus, tx("Added {element}, cycle {n}: {t}.", { element: elementName(s, e), n: c, t: sec(t) }));
    renderLog();
    renderCurrent();
    renderSoon();
  });
  root.querySelector("[data-import]").addEventListener("click", () => {
    const { added, skipped } = parseObservations(paste.value, state.stations);
    if (!added.length) { flash(importStatus, tx("No rows found. Check that each row has a station, an element, the cycle and the seconds.")); return; }
    state.rows.push(...added);
    own();
    save();
    paste.value = "";
    flash(importStatus, `${tx("Imported {rows}", { rows: tx(added.length === 1 ? "{n} timing" : "{n} timings", { n: int.format(added.length) }) })}${skipped ? tx(", skipped {n} without a known station, element or time", { n: skipped }) : ""}.`);
    renderLog();
    renderCurrent();
    renderSoon();
  });

  // The log of timings, newest first ------------------------------------------------------------------------------------
  const FIRST_ROWS = 30;
  let shown = FIRST_ROWS;
  const renderLog = () => {
    const rows = state.rows;
    logBody.replaceChildren();
    const newest = [];
    for (let index = rows.length - 1; index >= 0 && newest.length < shown; index--) newest.push([rows[index], index]);
    newest.forEach(([row, index]) => {
      const tr = el("tr");
      const type = state.stations[row.s]?.elements[row.e]?.type || "VA";
      tr.append(el("td", null, stationName(row.s)), el("td", null, elementName(row.s, row.e)), el("td", "ts-type-cell", type), el("td", "num", int.format(row.c)), el("td", "num", num(row.t, 1)));
      const cell = el("td");
      cell.append(removeButton(tx("Remove {element}, cycle {n}: {t}", { element: elementName(row.s, row.e), n: row.c, t: sec(row.t) }), { remove: index }));
      tr.append(cell);
      logBody.append(tr);
    });
    logWrap.hidden = !rows.length;
    logEmpty.hidden = rows.length > 0;
    const hidden = rows.length - newest.length;
    const perStation = state.stations.map((station, s) => ({ name: stationName(s), cycles: nextCycle(rows, s) - 1 })).filter((item) => item.cycles > 0);
    logCount.textContent = rows.length ? `${tx(rows.length === 1 ? "{n} timing" : "{n} timings", { n: int.format(rows.length) })} · ${perStation.map((item) => `${item.name}: ${tx(item.cycles === 1 ? "{n} cycle" : "{n} cycles", { n: item.cycles })}`).join(", ")}${hidden ? tx(" · newest {n} shown, CSV has all", { n: int.format(newest.length) }) : ""}` : "";
    more.hidden = !hidden;
    more.textContent = tx("Show {n} more", { n: int.format(Math.min(100, hidden)) });
  };
  more.addEventListener("click", () => { shown = Math.min(shown + 100, state.rows.length); renderLog(); });
  logBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const index = Number(button.dataset.remove);
    const [removed] = state.rows.splice(index, 1);
    own();
    save();
    renderLog();
    renderCurrent();
    renderSoon();
    (logBody.querySelector("[data-remove]") || entry.elements.seconds).focus();
    undoNote(logStatus, tx("Removed {element}, cycle {n}: {t}.", { element: elementName(removed.s, removed.e), n: removed.c, t: sec(removed.t) }), () => {
      state.rows.splice(Math.min(index, state.rows.length), 0, removed);
      save();
      renderLog();
      renderCurrent();
      renderSoon();
    });
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
    if (!state.rows.length || !window.confirm(tx("Clear all {n} timings? The stations and elements stay.", { n: state.rows.length }))) return;
    stopWatch();
    state.rows = [];
    own();
    save();
    renderAll();
  });
  const observationRows = () => [
    [tx("Station"), tx("Element"), tx("Type"), tx("Cycle"), tx("Seconds")],
    ...state.rows.map((row) => [stationName(row.s), elementName(row.s, row.e), state.stations[row.s]?.elements[row.e]?.type || "", row.c, row.t]),
  ];
  root.querySelector("[data-csv]").addEventListener("click", () => { if (state.rows.length) downloadCsv(`${data.csv}-timings`, observationRows()); });
  root.querySelector("[data-xlsx]").addEventListener("click", () => { if (state.rows.length) downloadXlsx(`${data.csv}-timings`, observationRows()); });

  // Results --------------------------------------------------------------------------------------------------------------
  const standardRows = (result) => [
    [tx("Station"), tx("Element"), tx("Type"), "n", tx("Median (s)"), tx("Standard time (s)"), tx("Mean (s)"), tx("Min (s)"), tx("Max (s)"), tx("CV %"), tx("Outliers")],
    ...result.stations.flatMap((station) => station.elements.map((element) => [station.name || stationName(station.index), element.name || elementName(station.index, element.index), element.type, element.n,
      element.n ? Math.round(element.median * 10) / 10 : "", element.n ? Math.round(element.standard * 100) / 100 : "", element.n ? Math.round(element.mean * 100) / 100 : "", element.min ?? "", element.max ?? "", element.n ? Math.round(element.cv * 1000) / 10 : "", element.outliers.join(" ")])),
  ];
  // The first moves of the bottleneck: its waste first, then the element moves of the balancing, as plain lines.
  const moveLines = (result) => {
    const lines = [];
    const station = result.over[0] ? result.stations.find((item) => item.total === Math.max(...result.over.map((o) => o.total))) : null;
    if (station) station.elements.filter((element) => element.type === "W" && element.standard > 0).forEach((element) => lines.push({
      title: tx("Remove waste at {station}: {element} ({t})", { station: station.name || stationName(station.index), element: element.name || elementName(station.index, element.index), t: sec(element.standard) }),
      station: station.name || stationName(station.index),
    }));
    result.moves.forEach((move) => lines.push({
      title: tx("Move {element} ({t}) from {from} to {to}", { element: move.element, t: sec(move.seconds), from: stationName(move.from), to: stationName(move.to) }),
      detail: tx("After the move: {from} {a}, {to} {b}, takt {takt}.{order}", { from: stationName(move.from), a: sec(move.fromTotal), to: stationName(move.to), b: sec(move.toTotal), takt: sec(result.takt), order: move.inOrder ? "" : ` ${tx("The order of the elements changes: check that the work allows it.")}` }),
      station: stationName(move.from),
    }));
    return lines;
  };
  const problemText = (result) => (result.over.length && result.bottleneck
    ? tx("{station} is above takt: {total} against {takt}", { station: result.bottleneck.name || stationName(result.bottleneck.index), total: sec(result.bottleneck.total), takt: sec(result.takt) })
    : tx("{station} sets the pace of {process}: {total} per unit", { station: result.bottleneck?.name || stationName(result.bottleneck?.index ?? 0), process: state.process.trim() || data.title, total: sec(result.bottleneck?.total || 0) }));
  const summaryText = (result) => {
    const lines = [`${data.title} | Stiven Catalyst`, state.process.trim(), ""];
    if (result.takt) lines.push(`${tx("Takt")}: ${sec(result.takt)} (${state.demand} / ${state.available} min)`);
    lines.push(`${tx("Cycles observed")}: ${result.cycles.min === result.cycles.max ? result.cycles.min : `${result.cycles.min}–${result.cycles.max}`} · ${tx("{n} timings", { n: result.rows })}`);
    lines.push(standardText(result));
    if (result.bottleneck) lines.push(`${tx("Bottleneck")}: ${result.bottleneck.name || stationName(result.bottleneck.index)} ${sec(result.bottleneck.total)}${result.takt ? ` (${result.bottleneck.over > 0 ? "+" : ""}${num(result.bottleneck.over, 1)} s)` : ""}`);
    if (result.operators) lines.push(`${tx("Operators needed")}: ${result.operators} (${sec(result.sum)} / ${sec(result.takt)})`);
    if (result.efficiency) lines.push(`${tx("Line balance")}: ${pct(result.efficiency, 0)}`);
    lines.push(`${typeLabel("VA")} ${pct(result.shares.VA, 0)} · ${typeLabel("NVA")} ${pct(result.shares.NVA, 0)} · ${typeLabel("W")} ${pct(result.shares.W, 0)}`, "");
    result.stations.forEach((station) => {
      lines.push(`${station.name || stationName(station.index)}: ${sec(station.total)}${result.takt ? ` (${station.over > 0 ? "+" : ""}${num(station.over, 1)} s)` : ""}`);
      station.elements.forEach((element) => lines.push(`  ${element.name || elementName(station.index, element.index)} [${element.type}] ${element.n ? `${sec(element.standard)} (${tx("Median")} ${num(element.median, 1)}, n ${element.n}, ${num(element.min, 1)}–${num(element.max, 1)})` : "–"}`));
    });
    const moves = moveLines(result);
    if (moves.length) lines.push("", `${tx("First moves")}:`, ...moves.map((move) => `- ${move.title}`));
    return lines.join("\n");
  };

  // What the standard time is made of, said on the page: with 100 % and 0 % it is the observed median.
  const standardText = (result) => {
    const formula = tx("Standard time = observed median × rating {rating} × (1 + allowance {allowance}).", { rating: pct(result.rating, 0), allowance: pct(result.allowance, 0) });
    return result.rating === 1 && result.allowance === 0 ? `${formula} ${tx("At 100 % and 0 % it is the observed median: rate the pace and add the allowance in step 1 before you staff from it.")}` : formula;
  };
  const renderResults = () => {
    const result = analyse({ stations: state.stations, rows: state.rows, takt: taktNow(), rating: ratingNow(), allowance: allowanceNow() });
    note.hidden = !state.example;
    results.replaceChildren();
    results.hidden = !state.rows.length;
    if (!state.rows.length) return;
    const t = result.takt;
    const bottleneck = result.bottleneck;
    const bottleneckName = bottleneck ? bottleneck.name || stationName(bottleneck.index) : "";
    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")}${state.process.trim() ? ` · ${state.process.trim()}` : ""}`));
    const title = el("h2");
    if (!t) {
      title.append(tx("Add the demand and the available time to compare the stations with the takt."));
    } else if (result.over.length) {
      const [before, after] = tx("{station} is above takt", { station: "\u0000" }).split("\u0000");
      title.append(before, el("span", null, bottleneckName), after);
    } else {
      const [before, after] = tx("Every station is under takt; {station} sets the pace", { station: "\u0000" }).split("\u0000");
      title.append(before, el("span", null, bottleneckName), after);
    }
    head.append(title);

    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Takt"), t ? sec(t) : "–", t ? tx("{demand} units in {minutes} min", { demand: int.format(parseNumber(state.demand)), minutes: num(parseNumber(state.available), 0) }) : tx("demand and available time missing")));
    if (bottleneck) stats.append(stat(tx("Bottleneck"), bottleneckName, `${sec(bottleneck.total)}${t ? ` · ${bottleneck.over > 0 ? tx("{t} above takt", { t: sec(bottleneck.over) }) : tx("{t} under takt", { t: sec(-bottleneck.over) })}` : ""}`));
    if (result.operators) stats.append(stat(tx("Operators needed"), int.format(result.operators), tx("{work} of work per unit ÷ takt; {n} stations today", { work: sec(result.sum), n: result.stations.length })));
    if (result.efficiency) stats.append(stat(tx("Line balance"), pct(result.efficiency, 0), tx("sum of station times ÷ (stations × slowest station)")));
    stats.append(stat(tx("Cycles observed"), result.cycles.min === result.cycles.max ? int.format(result.cycles.min) : `${result.cycles.min}–${result.cycles.max}`, tx("per element · {n} timings", { n: int.format(result.rows) })));
    stats.append(stat(tx("Waste"), pct(result.shares.W, 0), tx("{t} per unit · necessary {nva}", { t: sec(result.types.W), nva: pct(result.shares.NVA, 0) })));

    const notes = [el("p", "dl-panel-note ts-standard-note", standardText(result))];
    if (result.cycles.min < 3) notes.push(el("p", "dl-warning", data.advice.fewCycles));
    if (result.unobserved.length) notes.push(el("p", "dl-warning", tx("{n} elements have no timing yet and count as 0 s: {list}.", { n: result.unobserved.length, list: result.unobserved.slice(0, 4).join(", ") + (result.unobserved.length > 4 ? "…" : "") })));
    if (result.outliers.length) notes.push(el("p", "dl-panel-note", tx("{n} timings are outliers (more than 1.5 × IQR from the middle half). They stay in the log and are flagged in the element table; the median is not moved by them.", { n: result.outliers.length })));

    // Where to start: the station above takt, or the pace-setter when every station is under it.
    const moves = moveLines(result);
    const varied = bottleneck && bottleneck.cycleStats.n >= 3 && bottleneck.cycleStats.cv > 0.15;
    let focus = null;
    if (bottleneck) {
      const overBy = t ? bottleneck.over : null;
      focus = focusCard({
        title: bottleneckName,
        detail: overBy === null ? sec(bottleneck.total) : overBy > 0 ? tx("{t} above takt", { t: sec(overBy) }) : tx("{t} under takt", { t: sec(-overBy) }),
        lede: t ? (overBy > 0
          ? tx("Standard work of {total} per unit against a takt of {takt}: this station cannot keep up with the demand of {demand} units.", { total: sec(bottleneck.total), takt: sec(t), demand: int.format(parseNumber(state.demand)) })
          : tx("The slowest station needs {total} per unit, the takt allows {takt}. The line keeps up; the work between the stations is {balance} balanced.", { total: sec(bottleneck.total), takt: sec(t), balance: pct(result.efficiency || 0, 0) }))
          : tx("The slowest station needs {total} per unit. Add the demand and the available time to see whether that keeps up.", { total: sec(bottleneck.total) }),
        advice: t && overBy > 0 ? data.advice.over : data.advice.balanced,
        warning: [result.shares.W > 0.2 ? data.advice.waste : "", varied ? data.advice.variation : ""].filter(Boolean).join(" "),
      });
      if (moves.length) {
        const label = el("p", "result-label", tx("Balance moves"));
        const list = el("ol", "moves ts-moves");
        moves.forEach((move) => {
          const item = el("li", null, move.title);
          if (move.detail) item.append(" ", el("span", "ts-move-detail", move.detail));
          list.append(item);
        });
        const question = [...focus.querySelectorAll(".result-label")].find((node) => node.nextElementSibling?.tagName === "BLOCKQUOTE");
        if (question) question.before(label, list); else focus.append(label, list);
      } else if (t && overBy > 0) {
        focus.append(el("p", "dl-warning", tx("No whole element fits into another station's slack. Split the longest element, or add a station.")));
      }
    }

    // Actions: copy, print, 5 Whys on the bottleneck, the moves to the Action Tracker, the standard times as a file.
    const actions = resultActions(() => summaryText(result), problemText(result));
    if (window.ActionsStore && moves.length) {
      const addActions = el("button", "button-secondary", tx("Add the balance moves as actions"));
      addActions.type = "button";
      addActions.addEventListener("click", () => {
        const sent = window.ActionsStore.addAll(moves.map((move) => ({ title: move.title, detail: move.detail || "", example: state.example === true, source: "time-study", area: move.station, priority: "High", check: tx("Time five cycles again after the change; the station must be under {takt}.", { takt: sec(result.takt) }) })));
        const status = actions.querySelector("[data-actions-status]") || el("p", "form-note ts-actions-status");
        status.dataset.actionsStatus = "";
        status.setAttribute("role", "status");
        const link = el("a", "inline-link", tx("Open the Action Tracker"));
        link.href = window.ActionsStore.trackerUrl().href;
        status.replaceChildren(window.ToolKit.actionsNote(sent), " ", link);
        actions.append(status);
      });
      actions.append(addActions);
    }
    const stdCsv = el("button", "button-secondary", tx("Standard times as CSV"));
    stdCsv.type = "button";
    stdCsv.addEventListener("click", () => downloadCsv(`${data.csv}-standard`, standardRows(result)));
    const stdXlsx = el("button", "button-secondary", tx("Standard times as Excel"));
    stdXlsx.type = "button";
    stdXlsx.addEventListener("click", () => downloadXlsx(`${data.csv}-standard`, standardRows(result)));
    actions.append(stdCsv, stdXlsx);

    // Charts: the Yamazumi by element and by type, and the spread of whole cycles per station.
    const panels = [];
    if (CK) {
      const names = result.stations.flatMap((station) => station.elements.map((element) => element.name || elementName(station.index, element.index)));
      const dupe = new Set(names.filter((name, i) => names.indexOf(name) !== i));
      const keyOf = (station, element) => { const name = element.name || elementName(station.index, element.index); return dupe.has(name) ? `${name} (${station.name || stationName(station.index)})` : name; };
      const colors = {};
      const groups = result.stations.map((station) => ({
        label: station.name || stationName(station.index),
        parts: station.elements.filter((element) => element.standard > 0).map((element) => { const key = keyOf(station, element); colors[key] = typeColor[element.type]; return { key, value: Math.round(element.standard * 10) / 10 }; }),
      }));
      const yamazumi = panel(tx("Yamazumi: work per station"), tx("Each column is a station, each block an element at its standard time. The dashed line is the takt: a column above it cannot keep up with the demand."));
      yamazumi.append(CK.figure(CK.stacked(groups, { keys: Object.keys(colors), colors, title: `${data.title}: Yamazumi`, unit: "s", line: t ? { value: t, label: tx("Takt") } : undefined, format: (v) => num(v, 1) }), { fileName: `${data.csv}-yamazumi` }));
      yamazumi.append(CK.legend(TYPES.map((type) => ({ label: `${type} · ${typeLabel(type)}`, color: typeColor[type] }))));
      panels.push(yamazumi);

      const byType = panel(tx("Value-added, necessary and waste"), tx("The same stations, with the elements grouped by type. Waste leaves first, necessary work is shortened later, value-added work is the last to touch."));
      byType.append(CK.figure(CK.stacked(result.stations.map((station) => ({ label: station.name || stationName(station.index), parts: TYPES.map((type) => ({ key: typeLabel(type), value: Math.round(station.types[type] * 10) / 10 })) })), {
        keys: TYPES.map(typeLabel), colors: Object.fromEntries(TYPES.map((type) => [typeLabel(type), typeColor[type]])), title: `${data.title}: ${tx("Value-added, necessary and waste")}`, unit: "s", line: t ? { value: t, label: tx("Takt") } : undefined, format: (v) => num(v, 1),
      }), { fileName: `${data.csv}-types` }));
      panels.push(byType);

      const spread = result.stations.filter((station) => station.cycleTotals.length >= 2);
      if (spread.length) {
        const variation = panel(tx("Cycle times per station"), tx("Each box is the spread of the whole cycles timed at a station: the median, the middle half, the range. A dot is an outlier. A wide box misses takt on bad cycles even when the median is fine."));
        variation.append(CK.figure(CK.box(spread.map((station) => ({ label: station.name || stationName(station.index), values: station.cycleTotals })), { title: `${data.title}: ${tx("Cycle times per station")}`, unit: "s", format: (v) => num(v, 1) }), { fileName: `${data.csv}-cycles` }));
        panels.push(variation);
      }
    }

    // The element table: the standard times and their spread, outliers flagged.
    const table = panel(tx("Standard times per element"), tx("The median is the observed time; the standard time adds the rating and the allowance. CV is the spread as a share of the mean: under 10 % is repeatable work, over 25 % is a method that changes from cycle to cycle."));
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const tbl = el("table", "dl-table ts-table");
    const thead = el("thead");
    const hr = el("tr");
    [[tx("Station")], [tx("Element")], [tx("Type")], ["n", "num"], [tx("Median"), "num"], [tx("Standard time"), "num"], [tx("Mean"), "num"], [tx("Min"), "num"], [tx("Max"), "num"], ["CV", "num"], [tx("Outliers")]].forEach(([text, cls]) => { const th = el("th", cls, text); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const tbody = el("tbody");
    result.stations.forEach((station) => station.elements.forEach((element) => {
      const tr = el("tr");
      if (element.type === "W") tr.classList.add("is-waste");
      tr.append(el("td", null, station.name || stationName(station.index)), el("td", null, element.name || elementName(station.index, element.index)));
      const typeCell = el("td");
      typeCell.append(el("span", `dl-tag ts-tag-${element.type.toLowerCase()}`, element.type));
      tr.append(typeCell, el("td", "num", int.format(element.n)));
      if (element.n) tr.append(el("td", "num", num(element.median, 1)), el("td", "num ts-strong", num(element.standard, 1)), el("td", "num", num(element.mean, 1)), el("td", "num", num(element.min, 1)), el("td", "num", num(element.max, 1)), el("td", `num${element.cv > 0.25 ? " ts-high" : ""}`, pct(element.cv, 0)));
      else tr.append(el("td", "num", "–"), el("td", "num", "–"), el("td", "num", "–"), el("td", "num", "–"), el("td", "num", "–"), el("td", "num", "–"));
      tr.append(el("td", "ts-outliers", element.outliers.length ? `${element.outliers.map((v) => num(v, 1)).join(", ")} ${tx("(outlier)")}` : ""));
      tbody.append(tr);
    }));
    const tfoot = el("tfoot");
    result.stations.forEach((station) => {
      const tr = el("tr", "ts-total");
      const td = el("td", null, `${station.name || stationName(station.index)} · ${tx("standard work")}`);
      td.colSpan = 5;
      tr.append(td, el("td", "num ts-strong", num(station.total, 1)));
      const rest = el("td", null, t ? (station.over > 0 ? tx("{t} above takt", { t: sec(station.over) }) : tx("{t} under takt", { t: sec(-station.over) })) : "");
      rest.colSpan = 5;
      tr.append(rest);
      tfoot.append(tr);
    });
    tbl.append(thead, tbody, tfoot);
    wrap.append(tbl);
    table.append(wrap);
    panels.push(table);

    resultLayout(results, { head, stats, notes, focus, actions, panels });
  };
  const renderSoon = renderOnPause(renderResults, () => 1, 0);

  const renderAll = () => {
    showSettings();
    renderTakt();
    renderStations();
    setWatchStation(Math.min(clockState.s, state.stations.length - 1));
    renderSelects();
    renderLog();
    renderResults();
  };
  renderAll();
  renderClock();
})();
