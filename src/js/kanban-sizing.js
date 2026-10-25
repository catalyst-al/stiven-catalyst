// Kanban Sizing (js/kanban-sizing.js): how many kanban cards (containers) each loop of a supermarket or a two-bin
// system needs, what that means in stock and money, and the cards themselves, printed eight to an A4 sheet. Each loop
// is one part: its demand per day, the spread of that demand or a safety factor, the replenishment lead time (order
// interval + lead time), the container quantity, the unit cost and the cards in the loop now. The visitor picks one
// method for the whole tool: Toyota's formula with a safety factor α, or a statistical safety stock from the service
// level. The SKUs of ABC/XYZ Inventory (js/inventory-abc.js) can be brought in with their demand, its spread and their
// lead time; that tool's saved work is only read, never written. The arithmetic lives in window.KanbanSizingMath, so the
// tests can call it without the page.
(() => {
  const EPS = 1e-9;
  const finite = (value) => typeof value === "number" && Number.isFinite(value);
  const sum = (values) => values.reduce((total, value) => total + value, 0);
  // Whole cards and whole units are rounded up: 6.6 cards are 7. The small tolerance keeps an exact 8 (which the
  // floating point may give as 8.000000000001) at 8.
  const ceilUp = (value) => Math.max(0, Math.ceil(value - EPS));
  const fold = (text) => String(text ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();

  // Inverse of the standard normal distribution, z = Φ⁻¹(p), by Acklam's rational approximation (relative error below
  // 1.15 × 10⁻⁹), the same as js/inventory-abc.js uses: 90 % gives 1.2816, 95 % 1.6449, 97.5 % 1.9600, 98 % 2.0537,
  // 99 % 2.3263.
  const normInv = (p) => {
    if (!(p > 0 && p < 1)) return NaN;
    const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const low = 0.02425;
    const tail = (q) => (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    if (p < low) return tail(Math.sqrt(-2 * Math.log(p)));
    if (p > 1 - low) return -tail(Math.sqrt(-2 * Math.log(1 - p)));
    const q = p - 0.5;
    const r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  };
  // The service levels offered, as cycle service levels (the chance of no stock-out in one replenishment cycle).
  const SERVICE_LEVELS = [90, 95, 97.5, 98, 99];
  // z for a service level given as a share (0.95) or a percent (95).
  const zFor = (level) => {
    const p = level > 1 ? level / 100 : level;
    return normInv(p);
  };

  // Replenishment lead time L = order interval + lead time, in days: how long an empty container's card waits before
  // it is collected or ordered, plus the time until the full container is back at its place (Monden's waiting time
  // Tw plus processing and conveyance time Tp).
  const leadTime = (interval, lead) => Math.max(0, finite(interval) ? interval : 0) + Math.max(0, finite(lead) ? lead : 0);

  // Toyota's kanban formula (Monden, "Toyota Production System"): N = D × L × (1 + α) ÷ C, with D the demand per day,
  // L the replenishment lead time in days, α the safety factor and C the container quantity, rounded up to whole cards.
  const toyotaRaw = ({ demand, lead, alpha = 0, container }) => (container > 0 ? (demand * lead * (1 + alpha)) / container : NaN);
  const toyotaCards = (input) => { const raw = toyotaRaw(input); return Number.isFinite(raw) ? ceilUp(raw) : NaN; };
  // Statistical safety stock with a fixed lead time: SS = z × σd × √L (σd the standard deviation of the daily demand,
  // the days independent). Then N = ⌈(D × L + SS) ÷ C⌉.
  const safetyStock = ({ z, sd, lead }) => (finite(z) && sd >= 0 && lead >= 0 ? Math.max(0, z * sd * Math.sqrt(lead)) : 0);
  const statRaw = ({ demand, lead, sd, z, container }) => (container > 0 ? (demand * lead + safetyStock({ z, sd, lead })) / container : NaN);
  const statCards = (input) => { const raw = statRaw(input); return Number.isFinite(raw) ? ceilUp(raw) : NaN; };
  // Two-bin: the second bin has to last while the first one is refilled, so each bin holds at least the demand over
  // the lead time plus the safety stock: Q = ⌈D × L + SS⌉ units. With Toyota's factor SS = α × D × L.
  const twoBinQty = ({ demand, lead, ss = 0 }) => ceilUp(demand * lead + ss);
  // The most the loop can hold: every card with a full container, N × C units, and its value at the unit cost.
  const maxInventory = (cards, container) => (finite(cards) && finite(container) ? cards * container : 0);
  const inventoryValue = (units, unitCost) => (finite(units) && finite(unitCost) ? units * unitCost : 0);

  // The settings as numbers: the method, α as a share (10 % → 0.1), the service level as a share and its z.
  const settingsOf = (typed = {}, defaults = {}) => {
    const parse = (value) => (typeof value === "number" ? value : window.ToolKit ? window.ToolKit.parseNumber(value) : Number(String(value ?? "").replace(",", ".")));
    const fixed = [];
    const method = typed.method === "stat" || typed.method === "toyota" ? typed.method : defaults.method === "stat" ? "stat" : "toyota";
    let alpha = parse(typed.alpha);
    if (!(alpha >= 0 && alpha <= 200)) { if (String(typed.alpha ?? "").trim()) fixed.push("alpha"); alpha = Number(defaults.alpha); }
    // The service level comes from the select, always written with a point ("97.5").
    let service = Number(typed.service);
    if (!SERVICE_LEVELS.includes(service)) { if (String(typed.service ?? "").trim()) fixed.push("service"); service = Number(defaults.service); }
    return { method, alpha: alpha / 100, service: service / 100, z: zFor(service / 100), fixed };
  };

  // One loop worked out. The loop's own α wins over the default; the statistical method needs the loop's σd and
  // falls back to Toyota's formula (and says so) where it has none.
  const sizeLoop = (loop, s) => {
    const L = leadTime(loop.interval, loop.lead);
    const demand = finite(loop.demand) && loop.demand > 0 ? loop.demand : 0;
    const C = finite(loop.container) && loop.container > 0 ? loop.container : null;
    const cost = finite(loop.cost) && loop.cost >= 0 ? loop.cost : 0;
    const alpha = finite(loop.alpha) && loop.alpha >= 0 ? loop.alpha / 100 : s.alpha;
    const hasSd = finite(loop.sd) && loop.sd >= 0;
    const basis = s.method === "stat" && hasSd ? "stat" : "toyota";
    const fallback = s.method === "stat" && !hasSd;
    const ss = basis === "stat" ? safetyStock({ z: s.z, sd: loop.sd, lead: L }) : alpha * demand * L;
    const current = finite(loop.cards) && loop.cards >= 0 ? Math.round(loop.cards) : null;
    const out = { ...loop, L, demand, C, cost, alpha, basis, fallback, ss, leadDemand: demand * L, current, complete: Boolean(demand > 0 && L > 0 && C) };
    if (!out.complete) return { ...out, cards: null, raw: null, maxUnits: 0, value: 0, status: "incomplete", change: null, changeUnits: null, changeValue: null };
    let cards, raw, maxUnits, binQty = null, binUsed = null, tooSmall = false;
    if (loop.type === "twobin") {
      binQty = twoBinQty({ demand, lead: L, ss });
      tooSmall = C < binQty;
      binUsed = Math.max(C, binQty);
      cards = 2;
      raw = 2;
      maxUnits = maxInventory(2, binUsed);
    } else {
      raw = basis === "stat" ? statRaw({ demand, lead: L, sd: loop.sd, z: s.z, container: C }) : toyotaRaw({ demand, lead: L, alpha, container: C });
      cards = ceilUp(raw);
      maxUnits = maxInventory(cards, C);
    }
    const value = inventoryValue(maxUnits, cost);
    const currentUnits = current === null ? null : current * C;
    const change = current === null ? null : cards - current;
    const changeUnits = current === null ? null : maxUnits - currentUnits;
    const status = current === null ? (tooSmall ? "short" : "new")
      : current < cards || tooSmall ? "short" : current > cards ? "excess" : "ok";
    return { ...out, cards, raw, maxUnits, value, binQty, binUsed, tooSmall, change, changeUnits, changeValue: changeUnits === null ? null : changeUnits * cost, currentUnits, status };
  };

  // The whole supermarket: every loop, the totals and the loops with too few or too many cards.
  const analyse = (loops, s) => {
    const items = loops.map((loop) => sizeLoop(loop, s));
    const sized = items.filter((item) => item.complete);
    const compared = sized.filter((item) => item.current !== null);
    return {
      items, sized,
      incomplete: items.filter((item) => !item.complete),
      short: sized.filter((item) => item.status === "short"),
      excess: sized.filter((item) => item.status === "excess"),
      fresh: sized.filter((item) => item.status === "new"),
      ok: sized.filter((item) => item.status === "ok"),
      cards: sum(sized.map((item) => item.cards)),
      value: sum(sized.map((item) => item.value)),
      maxUnits: sum(sized.map((item) => item.maxUnits)),
      compared: compared.length,
      currentCards: sum(compared.map((item) => item.current)),
      change: sum(compared.map((item) => item.change)),
      changeValue: sum(compared.map((item) => item.changeValue)),
      currentValue: sum(compared.map((item) => item.currentUnits * item.cost)),
      fallback: items.filter((item) => item.complete && item.fallback),
      single: sized.filter((item) => item.type !== "twobin" && item.cards < 2),
    };
  };

  // The printed cards of the chosen loops: one card per container ("1 of 7"), two for a two-bin loop ("bin 1 of 2"),
  // laid out eight to a sheet. limit keeps a mistyped number from printing thousands of cards.
  const cardList = (items, limit = 480) => {
    const cards = [];
    items.filter((item) => item.complete && item.cards > 0).forEach((item) => {
      for (let i = 1; i <= item.cards && cards.length < limit; i++) cards.push({ item, i, n: item.cards });
    });
    return cards;
  };
  const sheets = (cards, perSheet = 8) => Array.from({ length: Math.ceil(cards.length / perSheet) }, (_, i) => cards.slice(i * perSheet, (i + 1) * perSheet));

  // The SKUs saved by ABC/XYZ Inventory as loops: demand per day d̄ = μ ÷ days of a column and σd = σ ÷ √days (the
  // same conversion as that tool), its lead time, or its default lead time. saved is that tool's state: { rows: [{ sku,
  // name, cost, lt, demand: [...] }], settings: { unit, leadTime } }. SKUs without demand are left out.
  const PERIOD_DAYS = { week: 7, month: 365 / 12 };
  const abcLoops = (saved, parse = Number) => {
    if (!saved || typeof saved !== "object" || !Array.isArray(saved.rows)) return [];
    const unit = saved.settings && saved.settings.unit === "week" ? "week" : "month";
    const days = PERIOD_DAYS[unit];
    const fallbackLead = saved.settings ? parse(saved.settings.leadTime) : NaN;
    return saved.rows.filter((row) => row && typeof row.sku === "string" && row.sku.trim() && Array.isArray(row.demand)).map((row) => {
      const demand = row.demand.map((value) => (finite(value) && value > 0 ? value : 0));
      const n = demand.length;
      const mu = n ? sum(demand) / n : 0;
      const sd = n >= 2 ? Math.sqrt(sum(demand.map((value) => (value - mu) ** 2)) / (n - 1)) : null;
      const lead = finite(row.lt) && row.lt >= 0 ? row.lt : finite(fallbackLead) && fallbackLead >= 0 ? fallbackLead : null;
      return {
        part: row.sku.trim().slice(0, 80), name: typeof row.name === "string" ? row.name.slice(0, 160) : "",
        demand: mu / days, sd: sd === null ? null : sd / Math.sqrt(days), lead, cost: finite(row.cost) && row.cost >= 0 ? row.cost : null,
        annualValue: mu * (unit === "week" ? 52 : 12) * (finite(row.cost) ? row.cost : 0),
      };
    }).filter((item) => item.demand > 0).sort((p, q) => q.annualValue - p.annualValue || p.part.localeCompare(q.part));
  };

  window.KanbanSizingMath = {
    SERVICE_LEVELS, normInv, zFor, leadTime, toyotaRaw, toyotaCards, safetyStock, statRaw, statCards, twoBinQty, maxInventory, inventoryValue,
    settingsOf, sizeLoop, analyse, cardList, sheets, abcLoops, ceilUp, fold,
  };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-kanban-sizing]");
  const dataEl = document.getElementById("kanban-sizing-data");
  if (!root || !dataEl || !window.ToolKit) return;
  const {
    LANG, LOCALE, DECIMAL_COMMA, tx, el, int, num, pct, plural, today, addDays, parseNumber, isObject, str, read, loadState, write, panel, stat, focusCard, resultActions,
    resultLayout, flash, undoNote, firstVisit, downloadCsv, downloadXlsx, showDate,
  } = window.ToolKit;
  const Chart = window.ChartKit;
  const Actions = window.ActionsStore;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const ABC_KEY = LANG === "en" ? "sc-inventory-abc" : `sc-inventory-abc-${LANG}`;
  const results = document.querySelector("[data-results]");
  const cardsBox = document.querySelector("[data-cards]");
  const $ = (selector) => root.querySelector(selector);

  // Saved work is rebuilt field by field, so damaged data cannot break the page.
  const numOrNull = (value, min = 0) => (finite(value) && value >= min ? value : null);
  const text = (value, max) => str(value).trim().slice(0, max);
  const newId = () => `l${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const cleanLoop = (item) => {
    if (!isObject(item) || !text(item.part, 80)) return null;
    return {
      id: text(item.id, 40) || newId(), part: text(item.part, 80), name: text(item.name, 160), location: text(item.location, 80), source: text(item.source, 120),
      type: item.type === "twobin" ? "twobin" : "kanban",
      demand: numOrNull(item.demand), sd: numOrNull(item.sd), alpha: numOrNull(item.alpha), interval: numOrNull(item.interval), lead: numOrNull(item.lead),
      container: numOrNull(item.container), cost: numOrNull(item.cost), cards: numOrNull(item.cards),
    };
  };
  const defaultSettings = () => ({ method: cfg.defaults.method, alpha: String(cfg.defaults.alpha), service: String(cfg.defaults.service), currency: cfg.text.currency });
  const state = loadState(KEY, { loops: [], settings: defaultSettings(), example: "", cardsFor: "all" });
  state.loops = state.loops.map(cleanLoop).filter(Boolean).slice(0, 500);
  state.settings = { ...defaultSettings(), ...Object.fromEntries(Object.entries(isObject(state.settings) ? state.settings : {}).filter(([, value]) => typeof value === "string")) };
  // The example ends the moment the visitor changes a loop or the method (see signature below).
  const save = () => {
    if (state.example && state.example !== signature()) state.example = "";
    return write(KEY, state);
  };
  const settings = () => settingsOf(state.settings, cfg.defaults);

  // Formatting -------------------------------------------------------------------------------------------------------
  const currency = () => str(state.settings.currency).trim().slice(0, 8);
  const money = (value) => `${num(value, 2)}${currency() ? ` ${currency()}` : ""}`;
  const signed = (value, format) => (value > 0 ? `+${format(value)}` : value < 0 ? `−${format(-value)}` : format(0));
  // Up to two decimals, no trailing zeros: 400, 2.5, 0.25.
  const dec = (value) => (finite(value) ? value.toLocaleString(LOCALE, { maximumFractionDigits: 2 }) : "–");
  const units = (value) => int.format(Math.round(value));
  // 95 %, but 97.5 % and 12.5 %.
  const level = (value) => pct(value, Math.abs(value * 100 - Math.round(value * 100)) > 1e-9 ? 1 : 0);
  // A number from the data file as the text a visitor of this language would type.
  const numText = (value) => (finite(value) ? (DECIMAL_COMMA ? String(value).replace(".", ",") : String(value)) : "");
  const loopText = (item) => `${item.part}${item.name ? ` · ${item.name}` : ""}`;
  const typeName = (type) => (type === "twobin" ? tx("Two-bin") : tx("Kanban loop"));
  const STATUS = {
    short: () => tx("Too few cards"), excess: () => tx("Too many cards"), ok: () => tx("Right number"), new: () => tx("New loop"), incomplete: () => tx("Figures missing"),
  };
  // The status in words, with a sign, so it never rests on colour alone.
  const statusMark = (item) => {
    const mark = { short: "▼", excess: "▲", ok: "✓", new: "+", incomplete: "…" }[item.status];
    const span = el("span", `ks-flag is-${item.status}`, `${mark} ${STATUS[item.status]()}`);
    return span;
  };
  const changeText = (item) => {
    if (item.status === "incomplete") return missingText(item);
    if (item.type === "twobin") {
      if (item.tooSmall) return tx("bin of {c} too small: needs at least {q}", { c: units(item.C), q: units(item.binQty) });
      return item.current === null ? tx("2 bins of {c}", { c: units(item.C) }) : item.current === 2 ? tx("2 bins of {c}", { c: units(item.C) }) : tx("{a} bins now, 2 needed", { a: int.format(item.current) });
    }
    if (item.current === null) return tx("print {n} cards", { n: int.format(item.cards) });
    if (!item.change) return tx("no change");
    return item.change > 0 ? tx("add {n}", { n: plural(item.change, tx("card"), tx("cards")) }) : tx("take out {n}", { n: plural(-item.change, tx("card"), tx("cards")) });
  };
  const missingText = (item) => {
    const missing = [];
    if (!(item.demand > 0)) missing.push(tx("demand per day"));
    if (!(item.L > 0)) missing.push(tx("replenishment lead time"));
    if (!item.C) missing.push(tx("container quantity"));
    return tx("missing: {list}", { list: missing.join(", ") });
  };

  // The entry form ---------------------------------------------------------------------------------------------------
  const form = $("[data-form]");
  const formStatus = $("[data-form-status]");
  const submit = $("[data-submit]");
  const cancel = $("[data-cancel]");
  let editing = null;
  const NUM_FIELDS = ["demand", "sd", "alpha", "interval", "lead", "container", "cost", "cards"];
  const typed = (name) => {
    const raw = String(form.elements[name].value ?? "").trim();
    if (!raw) return null;
    const value = parseNumber(raw);
    return Number.isFinite(value) ? value : NaN;
  };
  const fillForm = (loop) => {
    ["part", "name", "location", "source"].forEach((name) => { form.elements[name].value = loop ? loop[name] : ""; });
    form.elements.type.value = loop ? loop.type : "kanban";
    NUM_FIELDS.forEach((name) => { form.elements[name].value = loop ? numText(loop[name]) : ""; });
  };
  const readForm = () => {
    const part = form.elements.part.value.trim();
    if (!part) return { error: tx("Give the part or SKU."), field: "part" };
    const values = Object.fromEntries(NUM_FIELDS.map((name) => [name, typed(name)]));
    const bad = NUM_FIELDS.find((name) => Number.isNaN(values[name]) || (values[name] !== null && values[name] < 0));
    if (bad) return { error: tx("This field needs a number of 0 or more."), field: bad };
    if (!(values.demand > 0)) return { error: tx("Give the average demand per day (more than 0)."), field: "demand" };
    if (!(leadTime(values.interval, values.lead) > 0)) return { error: tx("Give the order interval or the lead time in days (together more than 0)."), field: "lead" };
    if (!(values.container > 0)) return { error: tx("Give the container quantity (more than 0)."), field: "container" };
    if (values.cards !== null && values.cards % 1) return { error: tx("Cards are whole numbers."), field: "cards" };
    return { loop: cleanLoop({ id: editing || newId(), part, name: form.elements.name.value, location: form.elements.location.value, source: form.elements.source.value, type: form.elements.type.value, ...values }) };
  };
  const setEditing = (id) => {
    editing = id;
    fillForm(id ? state.loops.find((loop) => loop.id === id) : null);
    submit.textContent = id ? tx("Save changes") : tx("Add the loop");
    cancel.hidden = !id;
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const { loop, error, field } = readForm();
    if (error) {
      flash(formStatus, error);
      form.elements[field]?.focus();
      return;
    }
    const at = state.loops.findIndex((item) => item.id === loop.id);
    if (at >= 0) state.loops[at] = loop; else state.loops.push(loop);
    const wasEditing = Boolean(editing);
    setEditing(null);
    save();
    render();
    flash(formStatus, wasEditing ? tx("Loop {part} saved.", { part: loop.part }) : tx("Loop {part} added.", { part: loop.part }));
    form.elements.part.focus();
  });
  cancel.addEventListener("click", () => { setEditing(null); form.elements.part.focus(); });

  // Settings ---------------------------------------------------------------------------------------------------------
  const settingInputs = [...root.querySelectorAll("[data-setting]")];
  const showSettings = () => settingInputs.forEach((input) => { input.value = state.settings[input.name] ?? ""; });
  settingInputs.forEach((input) => input.addEventListener(input.tagName === "SELECT" ? "change" : "input", () => {
    state.settings[input.name] = input.value;
    save();
    render();
  }));
  $("[data-reset-settings]").addEventListener("click", () => {
    state.settings = defaultSettings();
    showSettings();
    save();
    render();
  });

  // Bring in from ABC/XYZ Inventory (read only) ----------------------------------------------------------------------
  const abcBox = $("[data-abc]");
  const abcList = $("[data-abc-list]");
  const abcStatus = $("[data-abc-status]");
  let abcItems = [];
  const renderAbc = () => {
    abcItems = abcLoops(read(ABC_KEY, null), parseNumber).slice(0, 300);
    abcBox.hidden = !abcItems.length;
    if (!abcItems.length) return;
    const known = new Set(state.loops.map((loop) => fold(loop.part)));
    abcList.replaceChildren(...abcItems.map((item, i) => {
      const li = el("li");
      const id = `ks-abc-${i}`;
      const box = el("input");
      box.type = "checkbox";
      box.id = id;
      box.value = String(i);
      const label = el("label", null, `${loopText(item)} · ${tx("{d} per day", { d: dec(item.demand) })}${item.sd !== null ? ` · σd ${dec(item.sd)}` : ""}${item.lead !== null ? ` · ${tx("{n} days", { n: dec(item.lead) })}` : ""}${known.has(fold(item.part)) ? ` · ${tx("already a loop")}` : ""}`);
      label.htmlFor = id;
      li.append(box, label);
      return li;
    }));
    $("[data-abc-count]").textContent = plural(abcItems.length, tx("SKU with demand"), tx("SKUs with demand"));
  };
  $("[data-abc-add]").addEventListener("click", () => {
    const picked = [...abcList.querySelectorAll("input:checked")].map((box) => abcItems[Number(box.value)]).filter(Boolean);
    if (!picked.length) { flash(abcStatus, tx("Tick the SKUs to bring in first.")); return; }
    let added = 0, updated = 0;
    picked.forEach((item) => {
      const twin = state.loops.find((loop) => fold(loop.part) === fold(item.part));
      // A SKU that is already a loop gets the new demand, spread, lead time and cost; its container, cards and place stay.
      const fresh = { demand: item.demand, sd: item.sd, ...(item.lead !== null ? { lead: item.lead } : {}), ...(item.cost !== null ? { cost: item.cost } : {}) };
      if (twin) { Object.assign(twin, fresh, { name: twin.name || item.name }); updated++; return; }
      state.loops.push(cleanLoop({ part: item.part, name: item.name, type: "kanban", interval: null, ...fresh }));
      added++;
    });
    save();
    render();
    abcStatus.textContent = `${tx("{a} added, {u} updated.", { a: int.format(added), u: int.format(updated) })} ${tx("Enter the container quantity and the order interval of each new loop with Edit.")}`;
  });

  // The example ------------------------------------------------------------------------------------------------------
  // The example is remembered by its content: the moment a loop or a setting changes, it is the visitor's own work.
  // A short hash of the loops and the method (FNV-1a), so the saved state does not carry a copy of itself.
  const signature = () => {
    const textOf = JSON.stringify([state.loops.map(({ id, ...loop }) => loop), state.settings.method, state.settings.alpha, state.settings.service]);
    let hash = 0x811c9dc5;
    for (let i = 0; i < textOf.length; i++) hash = Math.imul(hash ^ textOf.charCodeAt(i), 0x01000193) >>> 0;
    return `ex-${hash.toString(36)}-${state.loops.length}`;
  };
  const loadExample = () => {
    state.loops = cfg.example.loops.map((loop, i) => cleanLoop({ ...loop, id: `ex${i + 1}` })).filter(Boolean);
    state.settings = { ...state.settings, ...Object.fromEntries(Object.entries(cfg.example.settings).map(([k, v]) => [k, String(v)])) };
    state.example = signature();
    state.cardsFor = "all";
    setEditing(null);
  };
  const exampleNote = el("div", "dl-example-note");
  exampleNote.setAttribute("role", "status");
  exampleNote.hidden = true;
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  clearExample.addEventListener("click", () => { state.loops = []; state.example = ""; setEditing(null); save(); render(); });
  exampleNote.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(exampleNote);
  root.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => {
    loadExample();
    showSettings();
    save();
    render();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  }));

  // The list of loops ------------------------------------------------------------------------------------------------
  const listBody = $("[data-list]");
  const listWrap = $("[data-list-wrap]");
  const listEmpty = $("[data-list-empty]");
  const listCount = $("[data-list-count]");
  const listStatus = $("[data-list-status]");
  const smallButton = (label, onClick, extra = "") => {
    const button = el("button", `button-ghost ks-small ${extra}`.trim(), label);
    button.type = "button";
    button.addEventListener("click", onClick);
    return button;
  };
  const renderList = (result) => {
    const items = result ? result.items : [];
    listBody.replaceChildren(...items.map((item) => {
      const tr = el("tr");
      const th = el("th", "ks-part");
      th.scope = "row";
      th.append(el("strong", null, item.part), el("span", "ks-note", [item.name, item.location].filter(Boolean).join(" · ")));
      const status = el("td", "ks-status");
      status.append(statusMark(item));
      const tools = el("td", "ks-row-tools");
      tools.append(
        smallButton(tx("Edit"), () => { setEditing(item.id); form.scrollIntoView({ behavior: "smooth", block: "start" }); form.elements.part.focus({ preventScroll: true }); }),
        smallButton(tx("Remove"), () => {
          const at = state.loops.findIndex((loop) => loop.id === item.id);
          if (at < 0) return;
          const [removed] = state.loops.splice(at, 1);
          if (editing === item.id) setEditing(null);
          save();
          render();
          undoNote(listStatus, tx("Loop {part} removed.", { part: removed.part }), () => { state.loops.splice(at, 0, removed); save(); render(); });
        }),
      );
      tools.querySelectorAll("button").forEach((button) => button.setAttribute("aria-label", `${button.textContent}: ${item.part}`));
      tr.append(
        th,
        el("td", null, typeName(item.type)),
        el("td", "num", dec(item.demand)),
        el("td", "num", item.L > 0 ? dec(item.L) : "–"),
        el("td", "num", item.C ? units(item.C) : "–"),
        el("td", "num", item.current === null ? "–" : int.format(item.current)),
        el("td", "num ks-strong", item.complete ? int.format(item.cards) : "–"),
        status,
        tools,
      );
      return tr;
    }));
    listWrap.hidden = !items.length;
    listEmpty.hidden = items.length > 0;
    listCount.textContent = items.length ? plural(items.length, tx("loop"), tx("loops")) : "";
  };

  // Exports ----------------------------------------------------------------------------------------------------------
  const r2 = (value) => (finite(value) ? Math.round(value * 100) / 100 : "");
  const csvRows = (result, s) => [[
    tx("Part / SKU"), tx("Description"), tx("Location"), tx("Supplier or source process"), tx("Type"), tx("Demand per day"), tx("σ of daily demand"), tx("Order interval (days)"), tx("Lead time (days)"),
    tx("Replenishment lead time L (days)"), tx("Container quantity"), tx("Unit cost"), tx("Method"), tx("Safety factor α (%)"), "z", tx("Safety stock (units)"), tx("Cards needed"), tx("Cards now"),
    tx("Change in cards"), tx("Bin quantity needed"), tx("Maximum inventory (units)"), tx("Value at maximum"), tx("Change in value"), tx("Status"),
  ], ...result.items.map((item) => [
    item.part, item.name, item.location, item.source, typeName(item.type), r2(item.demand), item.sd ?? "", item.interval ?? "", item.lead ?? "", r2(item.L), item.C ?? "", item.cost,
    item.basis === "stat" ? tx("Statistical") : "Toyota", item.basis === "toyota" ? r2(item.alpha * 100) : "", item.basis === "stat" ? Math.round(s.z * 10000) / 10000 : "",
    item.complete ? r2(item.ss) : "", item.complete ? item.cards : "", item.current ?? "", item.change ?? "", item.binQty ?? "", item.complete ? item.maxUnits : "", item.complete ? r2(item.value) : "",
    item.changeValue === null ? "" : r2(item.changeValue), STATUS[item.status](),
  ])];
  let current = null;
  $("[data-csv]").addEventListener("click", () => { if (current) downloadCsv(cfg.text.csvName, csvRows(current, settings())); });
  $("[data-xlsx]").addEventListener("click", () => { if (current) downloadXlsx(cfg.text.csvName, csvRows(current, settings())); });
  $("[data-clear]").addEventListener("click", () => {
    if (!state.loops.length || !window.confirm(tx("Clear all loops? The settings stay."))) return;
    state.loops = [];
    state.example = "";
    setEditing(null);
    save();
    render();
  });

  const methodLine = (s) => (s.method === "stat"
    ? tx("Statistical: N = ⌈(D × L + z × σd × √L) ÷ C⌉, z = {z} for a {service} service level.", { z: num(s.z, 4), service: level(s.service) })
    : tx("Toyota: N = ⌈D × L × (1 + α) ÷ C⌉, α = {alpha} unless a loop has its own.", { alpha: level(s.alpha) }));

  const summaryText = (result, s) => {
    const lines = [`${cfg.text.tool} · ${showDate(today())}`, `${plural(result.items.length, tx("loop"), tx("loops"))} · ${methodLine(s)}`, ""];
    lines.push(`${tx("Cards needed")}: ${int.format(result.cards)}${result.compared ? ` (${tx("now {n}", { n: int.format(result.currentCards) })}, ${signed(result.change, (v) => int.format(v))})` : ""}`);
    lines.push(`${tx("Inventory value at maximum")}: ${money(result.value)}${result.compared ? ` (${tx("value change")} ${signed(result.changeValue, money)})` : ""}`);
    lines.push("");
    result.items.forEach((item) => {
      lines.push(item.complete
        ? `- ${loopText(item)}: ${item.type === "twobin" ? tx("2 bins of {q}", { q: units(item.binUsed) }) : plural(item.cards, tx("card"), tx("cards"))} × ${units(item.C)} · ${tx("max {u} units", { u: units(item.maxUnits) })} · ${money(item.value)} · ${STATUS[item.status]()} (${changeText(item)})`
        : `- ${loopText(item)}: ${missingText(item)}`);
    });
    return lines.join("\n");
  };
  const problemText = (result) => (result.short.length
    ? tx("{n} with too few kanban cards: the supermarket can run empty before the containers come back.", { n: plural(result.short.length, tx("loop"), tx("loops")) })
    : result.excess.length
      ? tx("{n} with more kanban cards than needed: stock and space tied up.", { n: plural(result.excess.length, tx("loop"), tx("loops")) })
      : tx("The kanban loops match their calculated number of cards."));
  const shortDetail = (item) => (item.type === "twobin"
    ? `${loopText(item)}: ${tx("bin of {c} too small: needs at least {q}", { c: units(item.C), q: units(item.binQty) })}`
    : `${loopText(item)}: ${tx("{a} cards now, {b} needed ({c} each)", { a: int.format(item.current ?? 0), b: int.format(item.cards), c: units(item.C) })}`);
  const actionFor = (list) => ({
    title: list.length === 1 ? tx("Add kanban cards to {part}: too few in the loop", { part: list[0].part }) : tx("Add kanban cards to {n} loops with too few", { n: int.format(list.length) }),
    detail: list.slice(0, 20).map(shortDetail).join("\n") + (list.length > 20 ? `\n${tx("and {n} more", { n: int.format(list.length - 20) })}` : ""),
    owner: cfg.text.owner,
    due: addDays(today(), 2),
    source: "kanban-sizing",
    check: cfg.text.checkShort,
    priority: "High",
  });

  // Results ----------------------------------------------------------------------------------------------------------
  const tableOf = (heads, rows, className = "") => {
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const t = el("table", `dl-table ${className}`.trim());
    const thead = el("thead");
    const head = el("tr");
    heads.forEach(([label, numeric]) => { const th = el("th", numeric ? "num" : null, label); th.scope = "col"; head.append(th); });
    thead.append(head);
    const tbody = el("tbody");
    rows.forEach((row) => tbody.append(row));
    t.append(thead, tbody);
    wrap.append(t);
    return wrap;
  };
  const partCell = (item) => {
    const th = el("th", "ks-part");
    th.scope = "row";
    th.append(el("strong", null, item.part), el("span", "ks-note", item.name));
    return th;
  };

  const loopsPanel = (result) => {
    const box = panel(tx("Cards per loop"), tx("Cards needed, the change against the cards in the loop now, the most the loop can hold (every container full) and its value."));
    const rows = result.sized.map((item) => {
      const tr = el("tr");
      const status = el("td", "ks-status");
      status.append(statusMark(item));
      tr.append(
        partCell(item),
        el("td", "num", dec(item.leadDemand)),
        el("td", "num", units(item.ss)),
        el("td", "num ks-strong", item.type === "twobin" ? `2 × ${units(item.binUsed)}` : int.format(item.cards)),
        el("td", "num", item.current === null ? "–" : int.format(item.current)),
        el("td", null, changeText(item)),
        el("td", "num", units(item.maxUnits)),
        el("td", "num", money(item.value)),
        el("td", "num", item.changeValue === null ? "–" : signed(item.changeValue, money)),
        status,
      );
      return tr;
    });
    const total = el("tr", "ks-total");
    const th = el("th", null, tx("Total"));
    th.scope = "row";
    total.append(th, el("td"), el("td"), el("td", "num", int.format(result.cards)), el("td", "num", result.compared ? int.format(result.currentCards) : "–"), el("td", null, result.compared ? signed(result.change, (v) => plural(v, tx("card"), tx("cards"))) : ""),
      el("td", "num", units(result.maxUnits)), el("td", "num", money(result.value)), el("td", "num", result.compared ? signed(result.changeValue, money) : "–"), el("td"));
    rows.push(total);
    box.append(tableOf([[tx("Part")], [tx("Demand over L"), true], [tx("Safety stock"), true], [tx("Cards needed"), true], [tx("Cards now"), true], [tx("Change")], [tx("Maximum inventory"), true], [tx("Value at maximum"), true], [tx("Change in value"), true], [tx("Status")]], rows, "ks-table"));
    box.append(el("p", "dl-panel-note", tx("Two-bin loops show 2 × the bin quantity. The value change compares the most each loop can hold now and after the change, at the unit cost.")));
    return box;
  };

  const chartPanel = (result) => {
    const box = panel(tx("Inventory value at maximum per loop"), tx("N × C × unit cost: what the loop holds when every container is full. Here the money of the supermarket sits."));
    const items = result.sized.map((item) => ({
      label: item.part, value: Math.round(item.value * 100) / 100,
      tip: `${loopText(item)}\n${money(item.value)} · ${tx("max {u} units", { u: units(item.maxUnits) })}\n${STATUS[item.status]()}`,
    }));
    if (Chart) {
      const svg = Chart.bars(items, { title: tx("Inventory value at maximum per loop"), unit: currency(), format: (v) => int.format(Math.round(v)) });
      box.append(Chart.figure(svg, { fileName: "kanban-inventory-value" }));
    }
    return box;
  };

  const flagsPanel = (result) => {
    const box = panel(tx("Loops to correct"), tx("Too few cards: a stock-out risk, the supermarket can run empty before the containers come back. Too many: stock, money and space tied up."));
    const list = el("ul", "ks-flags");
    const add = (item, words) => {
      const li = el("li", `is-${item.status}`);
      li.append(statusMark(item), " ", el("strong", null, loopText(item)), ` · ${words}`);
      if (item.status === "short" && Actions) li.append(" ", Actions.linkButton(tx("Add to actions"), () => actionFor([item]), "button-ghost ks-small"));
      list.append(li);
    };
    result.short.forEach((item) => add(item, `${changeText(item)} · ${tx("stock-out risk")}${item.changeValue ? ` · ${signed(item.changeValue, money)}` : ""}`));
    result.excess.forEach((item) => add(item, `${changeText(item)} · ${tx("excess stock")} · ${signed(item.changeValue, money)}`));
    result.fresh.forEach((item) => add(item, changeText(item)));
    if (!list.children.length) box.append(el("p", "dl-panel-note", tx("Every loop has the number of cards it needs.")));
    else box.append(list);
    return box;
  };

  const methodPanel = (result, s) => {
    const box = panel(tx("How the numbers are worked out"));
    const list = el("ul", "ks-method");
    [
      tx("Replenishment lead time L = order interval + lead time, in days: how long a card waits before it is collected or ordered, plus the time until the full container is back."),
      tx("Toyota (Monden): N = D × L × (1 + α) ÷ C, rounded up to whole cards. α is the safety factor; the default {alpha} is a starting value, not a rule.", { alpha: level(s.alpha) }),
      tx("Statistical: safety stock SS = z × σd × √L, N = ⌈(D × L + SS) ÷ C⌉. z = {z} for a {service} cycle service level (inverse normal).", { z: num(s.z, 4), service: level(s.service) }),
      tx("Two-bin: each bin holds at least D × L + SS, rounded up; the second bin lasts while the first is refilled."),
      tx("Maximum inventory = N × C units; its value = N × C × unit cost. The change compares it with the cards in the loop now."),
      s.method === "stat" && result.fallback.length ? tx("{n} without σd use Toyota's formula with α.", { n: plural(result.fallback.length, tx("loop"), tx("loops")) }) : null,
    ].filter(Boolean).forEach((line) => list.append(el("li", null, line)));
    box.append(list);
    return box;
  };

  // The cards --------------------------------------------------------------------------------------------------------
  const cardsSelect = cardsBox ? cardsBox.querySelector("[data-cards-for]") : null;
  const cardsPreview = cardsBox ? cardsBox.querySelector("[data-cards-preview]") : null;
  const cardsNote = cardsBox ? cardsBox.querySelector("[data-cards-note]") : null;
  const cardEl = ({ item, i, n }) => {
    const card = el("article", "ks-card");
    const top = el("div", "ks-card-top");
    top.append(el("span", "ks-card-kind", item.type === "twobin" ? tx("Two-bin") : "Kanban"), el("span", "ks-card-count", item.type === "twobin" ? tx("Bin {i} of {n}", { i, n }) : tx("Card {i} of {n}", { i, n })));
    const body = el("div", "ks-card-body");
    body.append(el("p", "ks-card-part", item.part), el("p", "ks-card-name", item.name || " "));
    const facts = el("dl", "ks-card-facts");
    const fact = (label, value) => { facts.append(el("dt", null, label), el("dd", null, value || "–")); };
    fact(tx("Quantity"), units(item.type === "twobin" ? item.binUsed : item.C));
    fact(tx("Location"), item.location);
    fact(tx("From"), item.source);
    fact(tx("Loop"), `${item.part} · ${plural(item.cards, tx("card"), tx("cards"))}`);
    card.append(top, body, facts);
    return card;
  };
  const renderCards = (result) => {
    if (!cardsBox) return;
    const sized = result ? result.sized.filter((item) => item.cards > 0) : [];
    cardsBox.hidden = !sized.length;
    if (!sized.length) return;
    const all = el("option", null, tx("All loops"));
    all.value = "all";
    cardsSelect.replaceChildren(all, ...sized.map((item) => { const option = el("option", null, `${loopText(item)} · ${plural(item.cards, tx("card"), tx("cards"))}`); option.value = item.id; return option; }));
    if (state.cardsFor !== "all" && !sized.some((item) => item.id === state.cardsFor)) state.cardsFor = "all";
    cardsSelect.value = state.cardsFor;
    const chosen = state.cardsFor === "all" ? sized : sized.filter((item) => item.id === state.cardsFor);
    const cards = cardList(chosen);
    const total = sum(chosen.map((item) => item.cards));
    const pages = sheets(cards);
    cardsPreview.replaceChildren(...pages.map((page, p) => {
      const sheet = el("div", "ks-sheet");
      sheet.setAttribute("aria-label", tx("Sheet {p} of {n}", { p: p + 1, n: pages.length }));
      sheet.append(...page.map(cardEl));
      return sheet;
    }));
    cardsNote.textContent = `${plural(cards.length, tx("card"), tx("cards"))} · ${plural(pages.length, tx("A4 sheet"), tx("A4 sheets"))}, ${tx("8 to a sheet")}${cards.length < total ? ` · ${tx("only the first {n} are shown", { n: int.format(cards.length) })}` : ""}`;
  };
  if (cardsSelect) cardsSelect.addEventListener("change", () => { state.cardsFor = cardsSelect.value; save(); renderCards(current); });
  // Printing the cards: only the sheets, eight cards to an A4 page; the rest of the page is hidden meanwhile.
  const printCards = () => {
    if (!cardsBox || cardsBox.hidden) return;
    document.documentElement.classList.add("ks-printing");
    const done = () => {
      document.documentElement.classList.remove("ks-printing");
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint (some phones) get the page back a moment later.
    setTimeout(done, 2000);
  };
  cardsBox?.querySelector("[data-print-cards]")?.addEventListener("click", printCards);

  const render = () => {
    if (state.example && state.example !== signature()) state.example = "";
    exampleNote.hidden = !state.example || !state.loops.length;
    results.replaceChildren();
    renderAbc();
    if (!state.loops.length) {
      current = null;
      results.hidden = true;
      renderList(null);
      renderCards(null);
      return;
    }
    const s = settings();
    const result = analyse(state.loops, s);
    current = result;
    renderList(result);
    renderCards(result);
    results.hidden = false;

    const head = el("div", "result-head ks-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${plural(result.items.length, tx("loop"), tx("loops"))} · ${s.method === "stat" ? tx("Statistical, {service} service level", { service: level(s.service) }) : tx("Toyota, α = {alpha}", { alpha: level(s.alpha) })}`));
    const title = el("h2");
    title.append(`${tx("{n} needed", { n: plural(result.cards, tx("kanban card"), tx("kanban cards")) })} `, el("span", null, tx("{value} at maximum", { value: money(result.value) })));
    head.append(title);
    head.append(el("p", "ks-meta", problemText(result)));

    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Cards needed"), int.format(result.cards), result.compared ? tx("now {n} in {loops}", { n: int.format(result.currentCards), loops: plural(result.compared, tx("loop"), tx("loops")) }) : tx("no current cards entered")),
      stat(tx("Change in cards"), result.compared ? signed(result.change, (v) => int.format(v)) : "–", tx("loops compared with the cards now")),
      stat(tx("Too few cards"), int.format(result.short.length), tx("stock-out risk")),
      stat(tx("Too many cards"), int.format(result.excess.length), tx("excess stock")),
      stat(tx("Value at maximum"), money(result.value), tx("{u} units when every container is full", { u: units(result.maxUnits) })),
      stat(tx("Change in value"), result.compared ? signed(result.changeValue, money) : "–", result.compared ? tx("now {v}", { v: money(result.currentValue) }) : tx("no current cards entered")),
    );

    const notes = [];
    if (s.fixed.length) notes.push(el("p", "dl-warning", tx("Some settings could not be used and their defaults apply.")));
    if (result.incomplete.length) notes.push(el("p", "dl-warning", tx("{n} cannot be sized yet: {list}. Edit them to add the missing figures.", { n: plural(result.incomplete.length, tx("loop"), tx("loops")), list: result.incomplete.slice(0, 6).map((item) => `${item.part} (${missingText(item)})`).join("; ") })));
    if (result.fallback.length) notes.push(el("p", "dl-panel-note", tx("{n} without σd use Toyota's formula with α.", { n: plural(result.fallback.length, tx("loop"), tx("loops")) })));
    if (result.single.length) notes.push(el("p", "dl-panel-note", tx("{list}: one card only. While that container is being refilled the loop is empty; most plants run at least 2 cards or a two-bin.", { list: result.single.map((item) => item.part).join(", ") })));

    const key = result.short.length ? "short" : result.excess.length ? "excess" : "ok";
    const focusList = key === "short" ? result.short : key === "excess" ? result.excess : result.sized;
    const focus = focusCard({
      title: key === "short" ? tx("Add the missing cards") : key === "excess" ? tx("Take the extra cards out") : tx("Print the cards and keep the loops"),
      detail: plural(focusList.length, tx("loop"), tx("loops")),
      lede: problemText(result),
      advice: cfg.focus[key],
      extraLabel: tx("The loops"),
      extra: focusList.slice(0, 6).map((item) => `${item.part}: ${changeText(item)}`).join(" · "),
    });

    const actions = resultActions(() => summaryText(result, s), problemText(result));
    const printButton = el("button", "button-secondary", tx("Print cards"));
    printButton.type = "button";
    printButton.addEventListener("click", printCards);
    actions.append(printButton);
    if (Actions && result.short.length) actions.append(Actions.linkButton(tx("Add to actions"), () => actionFor(result.short)));

    resultLayout(results, {
      head, stats, notes, focus, actions,
      panels: [loopsPanel(result), chartPanel(result), flagsPanel(result), methodPanel(result, s)],
    });
  };

  // A first visit opens on the example, so the result is visible at once; nothing is saved until the visitor acts.
  if (!state.loops.length && firstVisit(KEY)) loadExample();
  showSettings();
  setEditing(null);
  render();
})();
