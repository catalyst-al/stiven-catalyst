// ABC/XYZ Inventory (js/inventory-abc.js): the SKUs of a store classified by value (ABC) and by how steady their demand
// is (XYZ), and what follows from it: the policy of each of the nine cells, how often to count each class, the safety
// stock and reorder point of every SKU at a chosen service level, the SKUs below it, and which SKUs belong in the golden
// zone. The data is pasted or opened from a CSV or Excel file: SKU, description, unit cost and one demand column per week
// or month, with optional lead time, its spread, stock and picks. The arithmetic lives in window.InventoryAbcMath, so the
// tests can call it without the page.
(() => {
  const FIELDS = ["sku", "name", "cost", "lt", "ltSd", "stock", "picks"];
  // A month is a twelfth of 365 days; a week is 7 days and a year 52 of them (the usual planning convention).
  const PERIODS = { week: { days: 7, perYear: 52 }, month: { days: 365 / 12, perYear: 12 } };
  const CELLS = ["AX", "AY", "AZ", "BX", "BY", "BZ", "CX", "CY", "CZ"];
  const EPS = 1e-9;
  const finite = (value) => typeof value === "number" && Number.isFinite(value);
  const sum = (values) => values.reduce((total, value) => total + value, 0);
  const fold = (text) => String(text ?? "").toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim();

  // Statistics of the demand per period. Mean μ = Σx ÷ n.
  const mean = (values) => (values.length ? sum(values) / values.length : 0);
  // Sample standard deviation, s = √(Σ(x − μ)² ÷ (n − 1)) (Bessel's correction): the periods are a sample of the demand
  // to come, not all of it. Fewer than two periods have no spread to measure.
  const sampleSd = (values) => {
    if (values.length < 2) return 0;
    const m = mean(values);
    return Math.sqrt(sum(values.map((value) => (value - m) ** 2)) / (values.length - 1));
  };
  // Coefficient of variation CV = σ ÷ μ. A SKU without demand (μ = 0) has no CV: it is listed as "no demand", not as Z.
  const cv = (values) => {
    const m = mean(values);
    return values.length >= 2 && m > 0 ? sampleSd(values) / m : null;
  };
  // X up to the first cut-off, Y up to the second, Z above; a CV on the cut-off belongs to the steadier class.
  const xyzClass = (value, cut = { x: 0.5, y: 1 }) => (value === null || !finite(value) ? null : value <= cut.x + EPS ? "X" : value <= cut.y + EPS ? "Y" : "Z");

  // ABC by annual consumption value (annual demand × unit cost), sorted from the largest down, with the cumulative share
  // of the total. The SKU that crosses a threshold belongs to the class it starts in: with a = 80 %, a SKU that takes the
  // running share from 78 % to 83 % is still A (the Pareto rule as js/pareto.js applies it). SKUs with the same value
  // get the same class, the class of the first of them, so the order of equal rows never decides a class. Equal values
  // are listed by SKU code. items: [{ key, value }]; a and b are shares (0.8, 0.95).
  const abc = (items, { a = 0.8, b = 0.95 } = {}) => {
    const total = sum(items.map((item) => Math.max(0, item.value || 0)));
    const sorted = items.map((item, index) => ({ ...item, value: Math.max(0, item.value || 0), index }))
      .sort((p, q) => q.value - p.value || String(p.key).localeCompare(String(q.key)) || p.index - q.index);
    let running = 0;
    let previous = null;
    return sorted.map((item, i) => {
      const share = total > 0 ? item.value / total : 0;
      const before = running;
      running += share;
      let cls = total <= 0 ? "C" : before < a - EPS ? "A" : before < b - EPS ? "B" : "C";
      if (previous && Math.abs(previous.value - item.value) <= EPS * Math.max(1, item.value)) cls = previous.cls;
      const out = { ...item, rank: i + 1, share, before, cumulative: Math.min(1, running), cls };
      previous = out;
      return out;
    });
  };

  // Inverse of the standard normal distribution, z = Φ⁻¹(p), by Acklam's rational approximation (relative error below
  // 1.15 × 10⁻⁹): 90 % gives 1.2816, 95 % 1.6449, 98 % 2.0537, 99 % 2.3263.
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

  // Demand per day from the demand per period: d̄ = μ ÷ days, σ_d = σ ÷ √days. The square-root rule assumes the days
  // are independent, the same assumption that lets the spread over the lead time grow with √LT.
  const perDay = (meanPeriod, sdPeriod, days) => ({ mean: days > 0 ? meanPeriod / days : 0, sd: days > 0 ? sdPeriod / Math.sqrt(days) : 0 });
  // Safety stock for a cycle service level: SS = z × σ_d × √LT with a fixed lead time, and with a lead time that varies
  // SS = z × √(LT × σ_d² + d̄² × σ_LT²) (demand and lead time independent). LT and σ_LT in days.
  const safetyStock = ({ z, sdDay, meanDay = 0, lt, ltSd = 0 }) => {
    if (!finite(z) || !(lt >= 0)) return 0;
    return Math.max(0, z * Math.sqrt(lt * sdDay ** 2 + meanDay ** 2 * Math.max(0, ltSd || 0) ** 2));
  };
  // Reorder point: the demand expected during the lead time plus the safety stock, ROP = d̄ × LT + SS.
  const reorderPoint = ({ meanDay, lt, ss }) => meanDay * lt + ss;
  // Economic order quantity (Harris–Wilson): EOQ = √(2 × D × S ÷ H), with D the annual demand, S the cost of one order
  // and H the holding cost of one unit for a year = holding rate × unit cost. null when a figure is missing.
  const eoq = ({ annual, orderCost, unitCost, holdingRate }) => (annual > 0 && orderCost > 0 && unitCost > 0 && holdingRate > 0
    ? Math.sqrt((2 * annual * orderCost) / (holdingRate * unitCost)) : null);
  // What to order for a SKU below its reorder point: with an EOQ, the smallest multiple of it that lifts the stock above
  // the ROP (an (s, nQ) policy); without one, the gap to the ROP rounded up.
  const orderQuantity = ({ stock, rop, eoq: q }) => {
    if (!(stock < rop)) return 0;
    if (q > 0) {
      const lot = Math.max(1, Math.round(q));
      return lot * (Math.floor((rop - stock) / lot) + 1);
    }
    return Math.max(1, Math.ceil(rop - stock - EPS));
  };
  // Cycle counting: counts per year = Σ SKUs in a class × counts per year of that class; per week = per year ÷ 52.
  const cycleCounts = (counts, freq) => {
    const byClass = Object.fromEntries(["A", "B", "C"].map((cls) => [cls, (counts[cls] || 0) * (freq[cls] || 0)]));
    const perYear = sum(Object.values(byClass));
    return { byClass, perYear, perMonth: perYear / 12, perWeek: perYear / 52 };
  };

  // The settings as numbers, each typed value checked and replaced by its default when it is not usable. Percent
  // values are typed as percent (80) and returned as shares (0.8). `fixed` lists what was replaced.
  const settingsOf = (typed = {}, defaults = {}) => {
    const fixed = [];
    const parse = (value) => (typeof value === "number" ? value : window.ToolKit ? window.ToolKit.parseNumber(value) : Number(String(value ?? "").replace(",", ".")));
    const pick = (name, ok) => {
      const raw = typed[name];
      const empty = raw === undefined || raw === null || String(raw).trim() === "";
      const value = empty ? NaN : parse(raw);
      if (!empty && ok(value)) return value;
      if (!empty) fixed.push(name);
      return Number(defaults[name]);
    };
    const optional = (name, ok) => {
      const raw = typed[name];
      if (raw === undefined || raw === null || String(raw).trim() === "") return raw === undefined ? Number(defaults[name]) || 0 : 0;
      const value = parse(raw);
      if (ok(value)) return value;
      fixed.push(name);
      return Number(defaults[name]) || 0;
    };
    const unit = typed.unit === "week" || typed.unit === "month" ? typed.unit : defaults.unit === "week" ? "week" : "month";
    const a = pick("a", (v) => v > 0 && v < 100);
    let b = pick("b", (v) => v > 0 && v <= 100);
    if (!(b > a)) { fixed.push("b"); b = Number(defaults.b) > a ? Number(defaults.b) : a + (100 - a) / 2; }
    const x = pick("x", (v) => v > 0);
    let y = pick("y", (v) => v > 0);
    if (!(y > x)) { fixed.push("y"); y = Number(defaults.y) > x ? Number(defaults.y) : x * 2; }
    const service = pick("service", (v) => v >= 50 && v < 100);
    return {
      unit, days: PERIODS[unit].days, perYear: PERIODS[unit].perYear,
      a: a / 100, b: b / 100, x, y, service: service / 100, z: normInv(service / 100),
      leadTime: pick("leadTime", (v) => v >= 0),
      ltSd: optional("ltSd", (v) => v >= 0),
      orderCost: optional("orderCost", (v) => v >= 0),
      holding: optional("holding", (v) => v >= 0 && v <= 200) / 100,
      freq: { A: pick("countA", (v) => v >= 0 && v <= 365), B: pick("countB", (v) => v >= 0 && v <= 365), C: pick("countC", (v) => v >= 0 && v <= 365) },
      fixed: [...new Set(fixed)],
    };
  };

  // One SKU worked out: demand statistics, its value, the safety stock, the reorder point and the order quantity.
  const workOut = (sku, s) => {
    const demand = sku.demand.map((value) => (finite(value) && value > 0 ? value : 0));
    const mu = mean(demand);
    const sd = sampleSd(demand);
    const variation = cv(demand);
    const annual = mu * s.perYear;
    const lt = finite(sku.lt) && sku.lt >= 0 ? sku.lt : s.leadTime;
    const ltSd = finite(sku.ltSd) && sku.ltSd >= 0 ? sku.ltSd : s.ltSd;
    const day = perDay(mu, sd, s.days);
    const hasDemand = mu > 0;
    const ss = hasDemand ? safetyStock({ z: s.z, sdDay: day.sd, meanDay: day.mean, lt, ltSd }) : 0;
    const rop = hasDemand ? reorderPoint({ meanDay: day.mean, lt, ss }) : 0;
    const q = hasDemand ? eoq({ annual, orderCost: s.orderCost, unitCost: sku.cost, holdingRate: s.holding }) : null;
    const stock = finite(sku.stock) ? sku.stock : null;
    const below = hasDemand && stock !== null && stock < rop - EPS;
    return {
      ...sku, demand, mean: mu, sd, cv: variation, xyz: xyzClass(variation, s), annual, value: annual * sku.cost, hasDemand,
      lt, ltSd, ltDefault: !(finite(sku.lt) && sku.lt >= 0), meanDay: day.mean, sdDay: day.sd, ss, rop, eoq: q, stock, below,
      order: below ? orderQuantity({ stock, rop, eoq: q }) : 0,
    };
  };

  // The whole list: classes, the matrix, the cycle counts, the SKUs below their reorder point, the golden zone.
  const analyse = (skus, s) => {
    const worked = skus.map((sku) => workOut(sku, s));
    const ranked = abc(worked.map((item) => ({ ...item, key: item.sku })), s);
    const items = ranked.map((item) => ({ ...item, cell: item.xyz ? `${item.cls}${item.xyz}` : "" }));
    const total = sum(items.map((item) => item.value));
    const counts = { A: 0, B: 0, C: 0 };
    const values = { A: 0, B: 0, C: 0 };
    items.forEach((item) => { counts[item.cls]++; values[item.cls] += item.value; });
    const matrix = Object.fromEntries(CELLS.map((cell) => [cell, { n: 0, value: 0, items: [] }]));
    const noDemand = [];
    items.forEach((item) => {
      if (!item.hasDemand || !item.xyz) { noDemand.push(item); return; }
      const cell = matrix[item.cell];
      cell.n++;
      cell.value += item.value;
      cell.items.push(item);
    });
    const xyz = { X: 0, Y: 0, Z: 0 };
    items.forEach((item) => { if (item.hasDemand && item.xyz) xyz[item.xyz]++; });
    const picksKnown = items.some((item) => item.picks > 0);
    const totalPicks = sum(items.map((item) => (item.picks > 0 ? item.picks : 0)));
    const totalUnits = sum(items.map((item) => item.annual));
    // The golden zone: AX and AY SKUs, the most picked first (by annual units when no picks are known).
    const golden = items.filter((item) => item.cls === "A" && (item.xyz === "X" || item.xyz === "Y"))
      .map((item) => ({ ...item, rankBy: picksKnown ? Math.max(0, item.picks || 0) : item.annual }))
      .sort((p, q) => q.rankBy - p.rankBy || p.sku.localeCompare(q.sku));
    let runningPicks = 0;
    golden.forEach((item) => {
      item.pickShare = picksKnown ? (totalPicks ? item.rankBy / totalPicks : 0) : (totalUnits ? item.rankBy / totalUnits : 0);
      runningPicks += item.pickShare;
      item.pickCumulative = runningPicks;
    });
    const stockKnown = items.some((item) => item.stock !== null);
    const belowRop = items.filter((item) => item.below).sort((p, q) => "ABC".indexOf(p.cls) - "ABC".indexOf(q.cls) || (p.stock / p.rop) - (q.stock / q.rop) || p.sku.localeCompare(q.sku));
    const shares = Object.fromEntries(["A", "B", "C"].map((cls) => [cls, {
      n: counts[cls], skuShare: items.length ? counts[cls] / items.length : 0, value: values[cls], valueShare: total ? values[cls] / total : 0,
    }]));
    return {
      items, total, counts, shares, matrix, noDemand, xyz, golden, picksKnown, stockKnown, belowRop,
      cycle: cycleCounts(counts, s.freq),
      deadValue: sum(noDemand.map((item) => (item.stock > 0 ? item.stock * item.cost : 0))),
      periods: Math.max(0, ...skus.map((sku) => sku.demand.length)),
    };
  };

  // The Lorenz (Pareto) curve: share of SKUs against cumulative share of value, from (0, 0); at most about maxPoints
  // points, the last always kept.
  const lorenz = (items, maxPoints = 100) => {
    const n = items.length;
    if (!n) return [];
    const step = Math.max(1, Math.ceil(n / maxPoints));
    const points = [{ skuShare: 0, valueShare: 0, item: null }];
    items.forEach((item, i) => { if ((i + 1) % step === 0 || i === n - 1) points.push({ skuShare: (i + 1) / n, valueShare: item.cumulative, item }); });
    return points;
  };

  // Reading a pasted or opened table -----------------------------------------------------------------------------------
  // Letters and digits only for amounts: "12,50 €", "$12.50" and "Lek 1 200" read as numbers.
  const amount = (value, parseNumber) => {
    const text = String(value ?? "").replace(/[^\d.,+\-]/g, "");
    return text ? parseNumber(text) : NaN;
  };
  const scoreOf = (header, names, similarity) => Math.max(0, ...names.map((name) => similarity(header, name)));
  // The best header for each field, at least `threshold` alike; each header feeds one field, the surest pairs first.
  const guessColumns = (headers, aliases, similarity, threshold = 0.6) => {
    const pairs = [];
    FIELDS.forEach((field, j) => headers.forEach((header, i) => {
      const score = scoreOf(header, aliases[field] || [field], similarity);
      if (score >= threshold) pairs.push({ i, j, score });
    }));
    pairs.sort((p, q) => q.score - p.score || p.i - q.i);
    const mapping = Object.fromEntries(FIELDS.map((field) => [field, -1]));
    const used = new Set();
    pairs.forEach(({ i, j }) => {
      if (mapping[FIELDS[j]] >= 0 || used.has(i)) return;
      mapping[FIELDS[j]] = i;
      used.add(i);
    });
    return mapping;
  };
  const numericCount = (cells, parseNumber) => cells.filter((cell) => String(cell ?? "").trim() && Number.isFinite(amount(cell, parseNumber))).length;
  // A first row is a header when it names a SKU or a cost column, or has fewer numbers than the row below it.
  const isHeaderRow = (rows, aliases, similarity, parseNumber) => {
    const [first = [], second = []] = rows;
    const named = first.some((cell) => scoreOf(cell, [...(aliases.sku || []), ...(aliases.cost || [])], similarity) >= 0.75);
    return named || (rows.length > 1 && numericCount(first, parseNumber) < numericCount(second, parseNumber));
  };
  // The demand columns: the longest run of columns, not taken by a field nor named as a total, whose filled cells are
  // numbers (at least 80 % of them, at least one).
  const guessDemand = (headers, body, mapping, aliases, similarity, parseNumber) => {
    const taken = new Set(Object.values(mapping).filter((i) => i >= 0));
    const width = Math.max(headers.length, ...body.map((row) => row.length));
    const ok = Array.from({ length: width }, (_, i) => {
      if (taken.has(i)) return false;
      if (headers[i] && scoreOf(headers[i], aliases.skip || [], similarity) >= 0.75) return false;
      const filled = body.map((row) => String(row[i] ?? "").trim()).filter(Boolean);
      const numbers = filled.filter((cell) => Number.isFinite(amount(cell, parseNumber))).length;
      return numbers > 0 && numbers >= filled.length * 0.8;
    });
    let best = { from: -1, to: -1 };
    let start = -1;
    ok.concat(false).forEach((good, i) => {
      if (good && start < 0) start = i;
      if (!good && start >= 0) {
        if (i - start > best.to - best.from + 1 || best.from < 0) best = { from: start, to: i - 1 };
        start = -1;
      }
    });
    return best;
  };
  // A table (array of rows) to SKUs. layout: { header (bool), mapping, from, to }. Cells left empty in a period are a
  // demand of 0; a text or a negative number there is counted as 0 too and reported.
  const MAX_SKUS = 20000;
  const readTable = (rows, layout, parseNumber) => {
    const { mapping, from, to } = layout;
    const body = layout.header ? rows.slice(1) : rows;
    const cell = (row, i) => (i >= 0 ? String(row[i] ?? "").trim() : "");
    const skus = [];
    const seen = new Set();
    let skipped = 0, duplicates = 0, odd = 0, cut = 0;
    body.forEach((row) => {
      if (!row.some((value) => String(value ?? "").trim())) return;
      const sku = cell(row, mapping.sku).slice(0, 80);
      const cost = amount(cell(row, mapping.cost), parseNumber);
      if (!sku || !(cost >= 0)) { skipped++; return; }
      if (seen.has(fold(sku))) { duplicates++; return; }
      if (skus.length >= MAX_SKUS) { cut++; return; }
      seen.add(fold(sku));
      const demand = [];
      for (let i = from; i >= 0 && i <= to; i++) {
        if (Object.values(mapping).includes(i)) continue;
        const text = cell(row, i);
        const value = text ? amount(text, parseNumber) : 0;
        if (!Number.isFinite(value) || value < 0) odd++;
        demand.push(Number.isFinite(value) && value > 0 ? value : 0);
      }
      const optional = (field, ok) => {
        const text = cell(row, mapping[field]);
        const value = text ? amount(text, parseNumber) : NaN;
        return Number.isFinite(value) && ok(value) ? value : null;
      };
      skus.push({
        sku, name: cell(row, mapping.name).slice(0, 160), cost,
        lt: optional("lt", (v) => v >= 0), ltSd: optional("ltSd", (v) => v >= 0),
        stock: optional("stock", () => true), picks: optional("picks", (v) => v >= 0), demand,
      });
    });
    return { skus, skipped, duplicates, odd, cut };
  };
  // The labels of the period columns: the header texts, or "Period 1", "Period 2"…
  const periodLabels = (headers, layout, fallback) => {
    const labels = [];
    for (let i = layout.from; i >= 0 && i <= layout.to; i++) {
      if (Object.values(layout.mapping).includes(i)) continue;
      labels.push(String((layout.header && headers[i]) || "").trim() || fallback(labels.length + 1));
    }
    return labels;
  };

  // The classified list for Pareto 80/20: one row per SKU with value, the class as its filter, measured by value.
  const paretoTable = (items, { source, sku, cls, value, valueLabel }) => ({
    source,
    headers: [sku, cls, value],
    rows: items.filter((item) => item.value > 0).map((item) => [`${item.sku}${item.name ? ` · ${item.name}` : ""}`, item.cls, String(Math.round(item.value * 100) / 100)]),
    map: { category: 0, count: -1, value: 2, date: -1, filter: 1 },
    measure: "value",
    valueLabel,
  });

  // The example stores its demand by calendar month (January first); it is laid on the last twelve whole months before
  // today, so a winter SKU peaks in the winter months whatever the date.
  const exampleMonths = (todayIso) => {
    const [y, m] = todayIso.split("-").map(Number);
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(Date.UTC(y, m - 1 - 12 + i, 1));
      return { iso: date.toISOString().slice(0, 10), month: date.getUTCMonth() };
    });
  };
  const exampleSkus = (rows, todayIso) => {
    const months = exampleMonths(todayIso);
    return rows.map((row) => ({
      sku: row.sku, name: row.name, cost: row.cost, lt: row.lt ?? null, ltSd: row.ltSd ?? null, stock: row.stock ?? null, picks: row.picks ?? null,
      demand: months.map(({ month }) => row.demand[month]),
    }));
  };

  window.InventoryAbcMath = {
    FIELDS, PERIODS, CELLS, mean, sampleSd, cv, xyzClass, abc, normInv, perDay, safetyStock, reorderPoint, eoq, orderQuantity, cycleCounts,
    settingsOf, workOut, analyse, lorenz, amount, guessColumns, isHeaderRow, guessDemand, readTable, periodLabels, paretoTable, exampleMonths, exampleSkus, fold,
  };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-inventory-abc]");
  const dataEl = document.getElementById("inventory-abc-data");
  if (!root || !dataEl || !window.ToolKit || !window.ChartKit) return;
  const {
    tx, el, int, num, pct, plural, today, addDays, parseNumber, parseRows, isObject, str, loadState, write, panel, stat, focusCard, resultActions,
    resultLayout, flash, firstVisit, exampleStamp, exampleNote, monthYear, downloadCsv, downloadXlsx, renderOnPause, showDate, LANG,
  } = window.ToolKit;
  const Chart = window.ChartKit;
  const Actions = window.ActionsStore;
  const Map_ = window.ImportMap;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const results = document.querySelector("[data-results]");
  const $ = (selector) => root.querySelector(selector);
  const similarity = Map_?.similarity || ((a, b) => (fold(a) && fold(a) === fold(b) ? 1 : 0));

  // Saved work is rebuilt field by field, so damaged data cannot break the page.
  const numOrNull = (value) => (finite(value) ? value : null);
  const cleanSku = (item) => {
    if (!isObject(item) || !str(item.sku).trim() || !(finite(item.cost) && item.cost >= 0) || !Array.isArray(item.demand)) return null;
    return {
      sku: str(item.sku).trim().slice(0, 80), name: str(item.name).slice(0, 160), cost: item.cost,
      lt: numOrNull(item.lt) !== null && item.lt >= 0 ? item.lt : null, ltSd: numOrNull(item.ltSd) !== null && item.ltSd >= 0 ? item.ltSd : null,
      stock: numOrNull(item.stock), picks: numOrNull(item.picks) !== null && item.picks >= 0 ? item.picks : null,
      demand: item.demand.slice(0, 260).map((value) => (finite(value) && value > 0 ? value : 0)),
    };
  };
  const SETTINGS = ["a", "b", "x", "y", "service", "leadTime", "ltSd", "orderCost", "holding", "countA", "countB", "countC", "currency"];
  const defaultSettings = () => ({ unit: cfg.defaults.unit, ...Object.fromEntries(SETTINGS.map((name) => [name, String(cfg.defaults[name] ?? "")])), currency: cfg.text.currency });
  const state = loadState(KEY, { rows: [], periods: [], source: "", settings: defaultSettings(), example: {}, filter: "all" });
  state.rows = state.rows.map(cleanSku).filter(Boolean);
  state.periods = state.periods.filter((label) => typeof label === "string").slice(0, 260);
  state.settings = { ...defaultSettings(), ...Object.fromEntries(Object.entries(state.settings).filter(([, value]) => typeof value === "string")) };
  const save = () => write(KEY, state);

  const settings = () => settingsOf(state.settings, cfg.defaults);
  const currency = () => str(state.settings.currency).trim().slice(0, 8);
  const money = (value) => `${int.format(Math.round(value))}${currency() ? ` ${currency()}` : ""}`;
  const unitCost = (value) => `${num(value, value >= 100 ? 0 : 2)}${currency() ? ` ${currency()}` : ""}`;
  // Stock is kept in whole units: a safety stock or reorder point of 10.2 is 11.
  const up = (value) => Math.max(0, Math.ceil(value - EPS));
  const units = (value) => int.format(up(value));
  const share = (value) => pct(value, value > 0 && value < 0.1 ? 1 : 0);
  // 95 %, but 97.5 % and 99.9 %.
  const level = (value) => pct(value, Math.abs(value * 100 - Math.round(value * 100)) > 1e-9 ? 1 : 0);
  const periodWord = (n, unit) => (unit === "week" ? plural(n, tx("week"), tx("weeks")) : plural(n, tx("month"), tx("months")));
  const cellInfo = (cell) => cfg.cells[cell] || { name: cell, policy: "", slot: "" };
  const skuText = (item) => `${item.sku}${item.name ? ` · ${item.name}` : ""}`;

  // Import -----------------------------------------------------------------------------------------------------------
  const importStatus = $("[data-import-status]");
  const paste = $("#ia-paste");
  const mapBox = $("[data-map]");
  const mapGrid = $("[data-map-grid]");
  const mapNote = $("[data-map-note]");
  const FIELD_LABEL = {
    sku: tx("SKU code"), name: tx("Description"), cost: tx("Unit cost"), lt: tx("Lead time (days)"), ltSd: tx("Lead-time spread σ (days)"), stock: tx("Stock on hand"), picks: tx("Picks in the period"),
  };
  let table = null; // { name, rows, header, headers, layout, sig } of the last import, kept on this page only
  const IMPORT_TOOL = "inventory-abc";
  const layoutArray = (layout) => [...FIELDS.map((field) => layout.mapping[field]), layout.from, layout.to];
  const arrayLayout = (list, header) => ({ header, mapping: Object.fromEntries(FIELDS.map((field, i) => [field, list[i]])), from: list[FIELDS.length], to: list[FIELDS.length + 1] });

  const planTable = (rows) => {
    const header = isHeaderRow(rows, cfg.aliases, similarity, parseNumber);
    const headers = header ? rows[0].map((cell) => String(cell ?? "").trim()) : [];
    const width = Math.max(...rows.slice(0, 200).map((row) => row.length));
    const body = (header ? rows.slice(1) : rows).slice(0, 200);
    let layout;
    const sig = header && Map_ ? Map_.signature(headers) : "";
    const saved = sig ? Map_.remembered(IMPORT_TOOL, sig) : null;
    const validSaved = Array.isArray(saved) && saved.length === FIELDS.length + 2 && saved.every((i) => Number.isInteger(i) && i >= -1 && i < width);
    if (validSaved) layout = arrayLayout(saved, true);
    else if (header) {
      const mapping = guessColumns(headers, cfg.aliases, similarity);
      layout = { header, mapping, ...guessDemand(headers, body, mapping, cfg.aliases, similarity, parseNumber) };
    } else {
      // Without a header: SKU, description, unit cost, then one column per period.
      layout = { header, mapping: { sku: 0, name: 1, cost: 2, lt: -1, ltSd: -1, stock: -1, picks: -1 }, from: 3, to: width - 1 };
    }
    return { rows, header, headers, width, layout, sig, remembered: validSaved };
  };

  const applyTable = (name) => {
    const { skus, skipped, duplicates, odd, cut } = readTable(table.rows, table.layout, parseNumber);
    const periods = periodLabels(table.headers, table.layout, (n) => tx("Period {n}", { n }));
    if (!skus.length || periods.length < 2) {
      flash(importStatus, !skus.length ? tx("No SKUs found. Each row needs a SKU and a unit cost; check the columns below.") : tx("At least two demand periods are needed. Check the period columns below."));
      return false;
    }
    state.rows = skus;
    state.periods = periods;
    state.source = name;
    state.example = {};
    if (table.sig && Map_) Map_.remember(IMPORT_TOOL, table.sig, layoutArray(table.layout));
    save();
    render();
    const notes = [];
    if (skipped) notes.push(tx("{n} rows without a SKU or unit cost skipped", { n: int.format(skipped) }));
    if (duplicates) notes.push(tx("{n} repeated SKUs skipped (the first row kept)", { n: int.format(duplicates) }));
    if (odd) notes.push(tx("{n} demand cells were text or negative and count as 0", { n: int.format(odd) }));
    if (cut) notes.push(tx("only the first {n} SKUs are used", { n: int.format(MAX_SKUS) }));
    const unit = settings().unit;
    importStatus.textContent = `${tx("Imported {skus} with {periods}.", { skus: plural(skus.length, tx("SKU"), tx("SKUs")), periods: plural(periods.length, tx("period"), tx("periods")) })}${notes.length ? ` ${notes.join("; ")}.` : ""} ${unit === "week" ? tx("Each column counts as one week; change it under Settings if the columns are months.") : tx("Each column counts as one month; change it under Settings if the columns are weeks.")}`;
    return true;
  };

  const columnOptions = (select, value, noneLabel) => {
    const none = el("option", null, noneLabel);
    none.value = "-1";
    select.replaceChildren(none, ...Array.from({ length: table.width }, (_, i) => {
      const option = el("option", null, `${window.ToolKit.columnName(i)}${table.headers[i] ? ` · ${table.headers[i]}` : ""}`);
      option.value = String(i);
      return option;
    }));
    select.value = String(value);
  };
  const renderMap = () => {
    mapBox.hidden = !table;
    if (!table) return;
    mapGrid.replaceChildren();
    const fieldSelect = (labelText, value, onChange, id, noneLabel = tx("— none —")) => {
      const field = el("div", "field");
      const label = el("label", null, labelText);
      label.htmlFor = id;
      const select = el("select");
      select.id = id;
      columnOptions(select, value, noneLabel);
      select.addEventListener("change", () => { onChange(Number(select.value)); applyTable(table.name); renderMap(); document.getElementById(id)?.focus(); });
      field.append(label, select);
      mapGrid.append(field);
    };
    FIELDS.forEach((field) => fieldSelect(FIELD_LABEL[field], table.layout.mapping[field], (value) => {
      // A column feeds one field: taken from another one, that one is left empty.
      FIELDS.forEach((other) => { if (other !== field && table.layout.mapping[other] === value && value >= 0) table.layout.mapping[other] = -1; });
      table.layout.mapping[field] = value;
    }, `ia-map-${field}`));
    fieldSelect(tx("First period column"), table.layout.from, (value) => { table.layout.from = value; if (table.layout.to < value) table.layout.to = value; }, "ia-map-from");
    fieldSelect(tx("Last period column"), table.layout.to, (value) => { table.layout.to = value; if (table.layout.from > value || table.layout.from < 0) table.layout.from = value; }, "ia-map-to");
    const count = periodLabels(table.headers, table.layout, (n) => String(n)).length;
    mapNote.textContent = `${table.header ? tx("The first row is a header: the columns were matched by name.") : tx("No header row: SKU, description, unit cost, then one column per period.")} ${tx("Periods used: {n}.", { n: int.format(count) })}${table.remembered ? ` ${tx("Mapped like last time")}.` : ""}`;
  };

  const importRows = (rows, name) => {
    const filled = rows.filter((row) => row.some((cell) => String(cell ?? "").trim()));
    if (filled.length < (isHeaderRow(filled, cfg.aliases, similarity, parseNumber) ? 2 : 1)) {
      flash(importStatus, tx("No rows were found in this data."));
      return false;
    }
    table = { name, ...planTable(filled) };
    const done = applyTable(name);
    renderMap();
    if (done) mapBox.open = !table.remembered && table.header;
    return done;
  };

  $("[data-import]").addEventListener("click", () => {
    if (!paste.value.trim()) { flash(importStatus, tx("Paste the rows first.")); paste.focus(); return; }
    if (importRows(parseRows(paste.value), tx("Pasted rows"))) paste.value = "";
  });
  const fileInput = $("#ia-file");
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    importStatus.textContent = tx("Reading {name}…", { name: file.name });
    try {
      if (file.size > 30e6) throw new Error("size");
      let rows;
      if (/\.xlsx$/i.test(file.name)) {
        if (!window.Pareto?.readWorkbook || !window.CvImport?.unzip) throw new Error("read");
        const sheets = (await window.Pareto.readWorkbook(await file.arrayBuffer(), window.CvImport.unzip, LANG !== "en")).filter((sheet) => !sheet.hidden && sheet.rows.filter((row) => row.some(Boolean)).length >= 2);
        if (!sheets.length) throw new Error("empty");
        // The sheet with the most rows is the SKU list; a summary sheet is shorter.
        rows = sheets.reduce((best, sheet) => (sheet.rows.length > best.rows.length ? sheet : best)).rows;
      } else if (/\.xls$/i.test(file.name)) throw new Error("xls");
      else {
        const buffer = await file.arrayBuffer();
        rows = parseRows(window.Pareto?.decode ? window.Pareto.decode(buffer) : new TextDecoder().decode(buffer));
      }
      importRows(rows, file.name);
    } catch (error) {
      importStatus.textContent = error.message === "xls" ? tx("Old Excel files (.xls) cannot be read here. In Excel, choose Save as and pick .xlsx or CSV.")
        : error.message === "size" ? tx("This file is larger than 30 MB. Export only the columns and weeks you need.")
        : tx("This file could not be read. Save it as CSV or .xlsx and try again, or paste the cells.");
    }
    fileInput.value = "";
  });

  // Settings ---------------------------------------------------------------------------------------------------------
  const settingInputs = [...root.querySelectorAll("[data-setting]")];
  const showSettings = () => settingInputs.forEach((input) => { input.value = input.name === "unit" ? state.settings.unit || "month" : state.settings[input.name] ?? ""; });
  const renderSoon = renderOnPause(() => { save(); render(); }, () => state.rows.length, 3000);
  settingInputs.forEach((input) => input.addEventListener(input.tagName === "SELECT" ? "change" : "input", () => {
    state.settings[input.name] = input.value;
    renderSoon();
  }));
  $("[data-reset-settings]").addEventListener("click", () => {
    state.settings = defaultSettings();
    showSettings();
    save();
    render();
  });

  // Example ----------------------------------------------------------------------------------------------------------
  const loadExample = () => {
    const now = today();
    state.rows = exampleSkus(cfg.example.rows, now).map(cleanSku).filter(Boolean);
    state.periods = exampleMonths(now).map(({ iso }) => monthYear(new Date(`${iso}T00:00:00Z`)));
    state.source = cfg.text.exampleSource;
    state.settings = { ...state.settings, unit: cfg.example.unit };
    state.example = exampleStamp(state.rows);
    table = null;
  };
  const clearAll = () => {
    state.rows = [];
    state.periods = [];
    state.source = "";
    state.example = {};
    table = null;
  };
  const note = exampleNote(results, () => { clearAll(); save(); render(); });

  // The classified list ----------------------------------------------------------------------------------------------
  const listBody = $("[data-list]");
  const listWrap = $("[data-list-wrap]");
  const listEmpty = $("[data-list-empty]");
  const listCount = $("[data-list-count]");
  const filterSelect = $("#ia-filter");
  const more = $("[data-more]");
  const FIRST_ROWS = 50;
  let shown = FIRST_ROWS;
  const passes = (item, filter) => (filter === "all" ? true
    : filter === "below" ? item.below
    : filter === "nodemand" ? !item.hasDemand || !item.xyz
    : filter.length === 1 ? item.cls === filter || item.xyz === filter
    : item.cell === filter);
  const statusCell = (item) => {
    const td = el("td", "ia-status");
    if (!item.hasDemand) { td.append(el("span", "ia-flag is-muted", tx("No demand"))); return td; }
    if (item.stock === null) { td.textContent = "–"; return td; }
    if (item.below) td.append(el("span", "ia-flag is-danger", `▼ ${tx("Below ROP")}`));
    else td.append(el("span", "ia-flag is-ok", tx("OK")));
    return td;
  };
  const renderList = (result) => {
    const items = result ? result.items : [];
    const filter = state.filter || "all";
    filterSelect.value = filter;
    const passing = items.filter((item) => passes(item, filter));
    listBody.replaceChildren(...passing.slice(0, shown).map((item) => {
      const tr = el("tr");
      const th = el("th", "ia-sku");
      th.scope = "row";
      th.append(el("strong", null, item.sku), el("span", "ia-cell-note", item.name));
      tr.append(
        th,
        el("td", "ia-class", item.cell || `${item.cls}–`),
        el("td", "num", money(item.value)),
        el("td", "num", pct(item.cumulative, 1)),
        el("td", "num", item.cv === null ? "–" : num(item.cv, 2)),
        el("td", "num", item.hasDemand ? units(item.ss) : "–"),
        el("td", "num", item.hasDemand ? units(item.rop) : "–"),
        el("td", "num", item.stock === null ? "–" : int.format(item.stock)),
        statusCell(item),
      );
      return tr;
    }));
    listWrap.hidden = !items.length;
    listEmpty.hidden = items.length > 0;
    $("[data-list-filter]").hidden = !items.length;
    listCount.textContent = items.length ? `${filter === "all" ? plural(items.length, tx("SKU"), tx("SKUs")) : tx("{a} of {b}", { a: int.format(passing.length), b: int.format(items.length) })}${state.source ? ` · ${state.source}` : ""}` : "";
    more.hidden = passing.length <= shown;
    more.textContent = tx("Show {n} more", { n: int.format(Math.min(100, passing.length - shown)) });
  };
  filterSelect.addEventListener("change", () => { state.filter = filterSelect.value; shown = FIRST_ROWS; save(); renderList(current); });
  more.addEventListener("click", () => { shown += 100; renderList(current); });

  const CSV_HEAD = () => [tx("SKU code"), tx("Description"), tx("Unit cost"), tx("Periods"), tx("Mean demand per period"), tx("Standard deviation per period"), "CV",
    tx("Annual demand"), tx("Annual consumption value"), tx("Share of value %"), tx("Cumulative %"), "ABC", "XYZ", tx("Class"), tx("Lead time (days)"), tx("Lead-time spread σ (days)"),
    "z", tx("Safety stock"), tx("Reorder point"), "EOQ", tx("Stock on hand"), tx("Below reorder point"), tx("Order quantity"), tx("Picks in the period"), tx("Counts per year"), tx("Policy"), tx("Slotting")];
  const r2 = (value) => (finite(value) ? Math.round(value * 100) / 100 : "");
  const csvRows = (result, s) => [CSV_HEAD(), ...result.items.map((item) => {
    const info = item.cell ? cellInfo(item.cell) : cfg.noDemand;
    return [item.sku, item.name, item.cost, item.demand.length, r2(item.mean), r2(item.sd), item.cv === null ? "" : Math.round(item.cv * 1000) / 1000,
      r2(item.annual), r2(item.value), Math.round(item.share * 10000) / 100, Math.round(item.cumulative * 10000) / 100, item.cls, item.xyz || "", item.cell || tx("No demand"),
      item.lt, item.ltSd, Math.round(s.z * 10000) / 10000, item.hasDemand ? up(item.ss) : "", item.hasDemand ? up(item.rop) : "",
      item.eoq ? Math.round(item.eoq) : "", item.stock ?? "", item.stock === null || !item.hasDemand ? "" : item.below ? tx("Yes") : tx("No"), item.order || "",
      item.picks ?? "", s.freq[item.cls], info.policy, info.slot];
  })];
  $("[data-csv]").addEventListener("click", () => { if (current) downloadCsv(cfg.text.csvName, csvRows(current, settings())); });
  $("[data-xlsx]").addEventListener("click", () => { if (current) downloadXlsx(cfg.text.csvName, csvRows(current, settings())); });
  $("[data-clear]").addEventListener("click", () => {
    if (!state.rows.length || !window.confirm(tx("Clear the SKU list? The settings stay."))) return;
    clearAll();
    save();
    render();
  });
  root.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => {
    loadExample();
    showSettings();
    save();
    render();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  }));

  // Results ----------------------------------------------------------------------------------------------------------
  let current = null;
  const svgNs = "http://www.w3.org/2000/svg";
  const svgLine = (attrs) => { const node = document.createElementNS(svgNs, "line"); Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v)); return node; };
  const svgText = (attrs, text) => { const node = document.createElementNS(svgNs, "text"); Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v)); node.textContent = text; return node; };

  const problemText = (result, s) => (result.belowRop.length
    ? tx("{n} below their reorder point at a {service} service level, {a} of them class A.", { n: plural(result.belowRop.length, tx("SKU"), tx("SKUs")), service: level(s.service), a: int.format(result.belowRop.filter((item) => item.cls === "A").length) })
    : tx("{n} carry {share} of the annual consumption value.", { n: plural(result.counts.A, tx("A SKU"), tx("A SKUs")), share: pct(result.shares.A.valueShare, 0) }));

  const summaryText = (result, s) => {
    const lines = [`${cfg.text.tool} · ${showDate(today())}`, `${plural(result.items.length, tx("SKU"), tx("SKUs"))} · ${periodWord(result.periods, s.unit)}${state.source ? ` · ${state.source}` : ""}`, ""];
    lines.push(`${tx("Annual consumption value")}: ${money(result.total)}`);
    ["A", "B", "C"].forEach((cls) => lines.push(`${cls}: ${plural(result.counts[cls], tx("SKU"), tx("SKUs"))} (${share(result.shares[cls].skuShare)}) · ${share(result.shares[cls].valueShare)} ${tx("of the value")}`));
    lines.push(`X ${int.format(result.xyz.X)} · Y ${int.format(result.xyz.Y)} · Z ${int.format(result.xyz.Z)} · ${tx("No demand")} ${int.format(result.noDemand.length)}`);
    lines.push(`${tx("Matrix")}: ${CELLS.map((cell) => `${cell} ${result.matrix[cell].n}`).join(" · ")}`);
    lines.push(`${tx("Cycle counts")}: ${tx("{year} per year, {week} per week", { year: int.format(Math.round(result.cycle.perYear)), week: num(result.cycle.perWeek, 1) })}`);
    lines.push("", `${tx("Service level")} ${level(s.service)} (z = ${num(s.z, 3)})`);
    if (!result.stockKnown) lines.push(tx("No stock column: add stock on hand to see the SKUs below their reorder point."));
    else if (!result.belowRop.length) lines.push(tx("No SKU is below its reorder point."));
    else {
      lines.push(`${tx("Below reorder point")}:`);
      result.belowRop.forEach((item) => lines.push(`- ${skuText(item)} (${item.cell}): ${tx("stock {stock}, ROP {rop}, order {order}", { stock: int.format(item.stock), rop: units(item.rop), order: int.format(item.order) })}`));
    }
    if (result.golden.length) lines.push("", `${tx("Golden zone")}: ${result.golden.slice(0, 12).map((item) => item.sku).join(", ")}`);
    if (result.noDemand.length) lines.push("", `${tx("No demand")}: ${result.noDemand.map((item) => item.sku).join(", ")} · ${tx("stock value {value}", { value: money(result.deadValue) })}`);
    return lines.join("\n");
  };

  const actionFor = (list, s) => ({
    title: list.length === 1 ? tx("Reorder {sku}: below its reorder point", { sku: skuText(list[0]) }) : tx("Reorder {n} SKUs below their reorder point", { n: int.format(list.length) }),
    detail: list.slice(0, 20).map((item) => `${skuText(item)} (${item.cell}): ${tx("stock {stock}, ROP {rop}, order {order}", { stock: int.format(item.stock), rop: units(item.rop), order: int.format(item.order) })}`).join("\n")
      + (list.length > 20 ? `\n${tx("and {n} more", { n: int.format(list.length - 20) })}` : "") + `\n${tx("Service level")} ${level(s.service)}`,
    owner: cfg.text.owner,
    due: addDays(today(), list.some((item) => item.cls === "A") ? 1 : 3),
    source: "inventory-abc",
    check: cfg.text.checkReorder,
    priority: list.some((item) => item.cls === "A") ? "High" : "Medium",
  });

  // The 3 × 3 matrix as a heat map: the count of SKUs in each cell, shaded by its share of the value.
  const matrixFigure = (result) => {
    const maxShare = Math.max(...CELLS.map((cell) => (result.total ? result.matrix[cell].value / result.total : 0)), 0) || 1;
    const svg = Chart.heatmap(["A", "B", "C"], ["X", "Y", "Z"], (r, c) => {
      const cell = `${"ABC"[r]}${"XYZ"[c]}`;
      const info = result.matrix[cell];
      const valueShare = result.total ? info.value / result.total : 0;
      const strength = info.n ? 0.12 + 0.88 * (valueShare / maxShare) : 0;
      return {
        text: String(info.n), color: info.n ? Chart.C.blue : "transparent", opacity: info.n ? strength : 1,
        textColor: info.n && strength > 0.45 ? "#ffffff" : Chart.C.text,
        tip: `${cell} · ${cellInfo(cell).name}\n${plural(info.n, tx("SKU"), tx("SKUs"))} · ${share(valueShare)} ${tx("of the value")}\n${cellInfo(cell).policy}`,
      };
    }, { title: tx("ABC/XYZ matrix"), cellSize: 76, labelWidth: 40 });
    // One letter per column needs no slant: the column names stand upright over their cells.
    svg.querySelectorAll("text[transform]").forEach((label) => {
      label.removeAttribute("transform");
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "13");
      label.setAttribute("font-weight", "700");
    });
    return Chart.figure(svg, { fileName: "abc-xyz-matrix", caption: tx("SKUs per cell; the stronger the colour, the larger its share of the value. Rows: value (A high to C low). Columns: demand (X steady to Z erratic).") });
  };

  const matrixBlock = (result) => {
    const box = el("div", "ia-matrix-block");
    const left = el("div", "ia-matrix-chart");
    left.append(el("p", "result-label", tx("ABC/XYZ matrix")), matrixFigure(result));
    const right = el("div", "ia-matrix-side");
    right.append(el("p", "result-label", tx("Share of SKUs and of value")));
    const list = el("ul", "ia-class-list");
    ["A", "B", "C"].forEach((cls) => {
      const item = el("li");
      const sh = result.shares[cls];
      item.append(el("strong", "ia-class-name", cls), el("span", null, tx("{n} ({share} of SKUs) · {value} of the value", { n: plural(sh.n, tx("SKU"), tx("SKUs")), share: share(sh.skuShare), value: share(sh.valueShare) })));
      const bars = el("span", "ia-share-bars");
      bars.setAttribute("aria-hidden", "true");
      const skuBar = el("span", "ia-share-bar is-sku");
      skuBar.style.width = `${sh.skuShare * 100}%`;
      const valueBar = el("span", "ia-share-bar is-value");
      valueBar.style.width = `${sh.valueShare * 100}%`;
      bars.append(skuBar, valueBar);
      item.append(bars);
      list.append(item);
    });
    right.append(list, el("p", "form-note ia-bars-key", tx("Upper bar: share of SKUs. Lower bar: share of value.")));
    box.append(left, right);
    return box;
  };

  const paretoPanel = (result, s) => {
    const box = panel(tx("Pareto curve of the value"), tx("Cumulative share of the annual consumption value against the share of SKUs, largest value first. The dashed lines are the A and B thresholds; the diagonal is an even spread."));
    const points = lorenz(result.items);
    const svg = Chart.line([{ label: tx("Cumulative share of value"), points: points.map((p) => ({
      x: pct(p.skuShare, 0), y: p.valueShare,
      tip: p.item ? `${skuText(p.item)} (${p.item.cls})\n${tx("{skus} of the SKUs carry {value} of the value", { skus: pct(p.skuShare, 0), value: pct(p.valueShare, 1) })}` : "0",
    })) }], { title: tx("Pareto curve of the value"), yMin: 0, yMax: 1, format: (v) => pct(v, 0), dots: points.length <= 80 });
    // ChartKit.line draws on 640 × 300 with the plot from x 52 to 624 and y 28 to 256: the guides use the same frame.
    const left = 52, right = 624, top = 28, bottom = 256;
    const y = (v) => bottom - v * (bottom - top);
    svg.append(svgLine({ x1: left, y1: y(0), x2: right, y2: y(1), stroke: "var(--tr-muted)", "stroke-width": 1, "stroke-dasharray": "2 4", "pointer-events": "none" }));
    [[s.a, `A ${pct(s.a, 0)}`], [s.b, `B ${pct(s.b, 0)}`]].forEach(([value, label]) => {
      svg.append(svgLine({ x1: left, y1: y(value), x2: right, y2: y(value), stroke: "var(--tr-target)", "stroke-width": 1.25, "stroke-dasharray": "6 4", "pointer-events": "none" }));
      svg.append(svgText({ x: right - 4, y: y(value) + 14, "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: "var(--tr-target)" }, label));
    });
    box.append(Chart.figure(svg, { fileName: "abc-pareto-curve" }));
    return box;
  };

  const classPanel = (result) => {
    const box = panel(tx("Share of SKUs against share of value"), tx("Each class as a share of the SKUs (left) and of the annual consumption value (right)."));
    const colors = { A: Chart.C.blue, B: Chart.C.soft, C: Chart.C.muted };
    const svg = Chart.stacked([
      { label: tx("Share of SKUs"), parts: ["A", "B", "C"].map((cls) => ({ key: cls, value: result.shares[cls].skuShare })) },
      { label: tx("Share of value"), parts: ["A", "B", "C"].map((cls) => ({ key: cls, value: result.shares[cls].valueShare })) },
    ], { keys: ["A", "B", "C"], colors, yMax: 1, title: tx("Share of SKUs against share of value"), format: (v) => pct(v, 0) });
    box.append(Chart.figure(svg, { fileName: "abc-shares" }));
    return box;
  };

  const tableOf = (heads, rows, className = "") => {
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const t = el("table", `dl-table ${className}`.trim());
    const thead = el("thead");
    const head = el("tr");
    heads.forEach(([text, numeric]) => { const th = el("th", numeric ? "num" : null, text); th.scope = "col"; head.append(th); });
    thead.append(head);
    const tbody = el("tbody");
    rows.forEach((cells) => tbody.append(cells));
    t.append(thead, tbody);
    wrap.append(t);
    return wrap;
  };

  const policyPanel = (result) => {
    const box = panel(tx("Policy per cell"), tx("The standard way to manage each cell of the matrix, with its count and share of the value."));
    const maxShare = Math.max(...CELLS.map((cell) => (result.total ? result.matrix[cell].value / result.total : 0)), 0) || 1;
    const rows = ["A", "B", "C"].map((cls) => {
      const tr = el("tr");
      const th = el("th", null, cls);
      th.scope = "row";
      tr.append(th);
      ["X", "Y", "Z"].forEach((x) => {
        const info = result.matrix[`${cls}${x}`];
        const valueShare = result.total ? info.value / result.total : 0;
        const td = el("td", "num is-heat", `${int.format(info.n)} · ${share(valueShare)}`);
        td.style.setProperty("--heat", `${Math.round(info.n ? 6 + 40 * (valueShare / maxShare) : 0)}%`);
        tr.append(td);
      });
      return tr;
    });
    box.append(tableOf([[tx("Class")], [`X · ${tx("steady")}`, true], [`Y · ${tx("variable")}`, true], [`Z · ${tx("erratic")}`, true]], rows, "dl-matrix ia-matrix"));
    const list = el("dl", "ia-policies");
    CELLS.forEach((cell) => {
      const info = cellInfo(cell);
      const dt = el("dt");
      dt.append(el("strong", null, cell), ` ${info.name} · ${plural(result.matrix[cell].n, tx("SKU"), tx("SKUs"))}`);
      const dd = el("dd");
      dd.append(info.policy, el("span", "ia-cell-note", `${tx("Slotting")}: ${info.slot}`));
      list.append(dt, dd);
    });
    box.append(list);
    return box;
  };

  const reorderPanel = (result, s) => {
    const box = panel(tx("Below the reorder point"), tx("SKUs whose stock on hand is below ROP = demand over the lead time + safety stock, at a {service} cycle service level (z = {z}). Class A first.", { service: level(s.service), z: num(s.z, 3) }));
    if (!result.stockKnown) { box.append(el("p", "dl-panel-note", tx("No stock column: add stock on hand to see the SKUs below their reorder point."))); return box; }
    if (!result.belowRop.length) { box.append(el("p", "dl-panel-note", tx("No SKU is below its reorder point."))); return box; }
    const rows = result.belowRop.map((item) => {
      const tr = el("tr");
      const th = el("th", "ia-sku");
      th.scope = "row";
      th.append(el("strong", null, item.sku), el("span", "ia-cell-note", item.name));
      const link = Actions ? Actions.linkButton(tx("Add to actions"), () => actionFor([item], s), "button-ghost ia-small") : el("span");
      const cell = el("td");
      cell.append(link);
      tr.append(th, el("td", null, item.cell), el("td", "num", int.format(item.stock)), el("td", "num", units(item.ss)), el("td", "num", units(item.rop)),
        el("td", "num", item.eoq ? int.format(Math.round(item.eoq)) : "–"), el("td", "num ia-strong", int.format(item.order)), cell);
      return tr;
    });
    box.append(tableOf([[tx("SKU and description")], [tx("Class")], [tx("Stock"), true], [tx("Safety stock"), true], [tx("Reorder point"), true], ["EOQ", true], [tx("Order quantity"), true], [tx("Action")]], rows));
    box.append(el("p", "dl-panel-note", s.orderCost > 0 && s.holding > 0 ? tx("Order: the smallest multiple of the EOQ that lifts the stock above the reorder point.") : tx("Order: the gap to the reorder point. Enter an order cost and a holding rate to order in economic lots (EOQ).")));
    return box;
  };

  const slottingPanel = (result) => {
    const box = panel(tx("Slotting: the golden zone"), result.picksKnown
      ? tx("AX and AY SKUs, the most picked first: they belong in the golden zone, at waist height and nearest dispatch.")
      : tx("AX and AY SKUs, the most units first (no picks column): they belong in the golden zone, at waist height and nearest dispatch."));
    if (!result.golden.length) { box.append(el("p", "dl-panel-note", tx("No AX or AY SKU in this list."))); return box; }
    const rows = result.golden.map((item, i) => {
      const tr = el("tr");
      const th = el("th", "ia-sku");
      th.scope = "row";
      th.append(el("strong", null, `${i + 1}. ${item.sku}`), el("span", "ia-cell-note", item.name));
      tr.append(th, el("td", null, item.cell), el("td", "num", result.picksKnown ? int.format(item.picks || 0) : int.format(Math.round(item.annual))), el("td", "num", pct(item.pickShare, 1)), el("td", "num", pct(item.pickCumulative, 0)));
      return tr;
    });
    box.append(tableOf([[tx("SKU and description")], [tx("Class")], [result.picksKnown ? tx("Picks") : tx("Annual demand"), true], [result.picksKnown ? tx("Share of picks") : tx("Share of units"), true], [tx("Cumulative"), true]], rows));
    return box;
  };

  const countPanel = (result, s) => {
    const box = panel(tx("Cycle counting"), tx("Counts per year = SKUs in the class × counts per year of the class. A count is one SKU counted once."));
    const rows = ["A", "B", "C"].map((cls) => {
      const tr = el("tr");
      const th = el("th", null, cls);
      th.scope = "row";
      tr.append(th, el("td", "num", int.format(result.counts[cls])), el("td", "num", num(s.freq[cls], s.freq[cls] % 1 ? 1 : 0)), el("td", "num", int.format(Math.round(result.cycle.byClass[cls]))));
      return tr;
    });
    const total = el("tr", "ia-total");
    const th = el("th", null, tx("Total"));
    th.scope = "row";
    total.append(th, el("td", "num", int.format(result.items.length)), el("td"), el("td", "num", int.format(Math.round(result.cycle.perYear))));
    rows.push(total);
    box.append(tableOf([[tx("Class")], [tx("SKUs"), true], [tx("Counts per SKU and year"), true], [tx("Counts per year"), true]], rows));
    const chips = el("ul", "ck-chips");
    [tx("{n} per month", { n: num(result.cycle.perMonth, 1) }), tx("{n} per week", { n: num(result.cycle.perWeek, 1) }), tx("{n} per working day", { n: num(result.cycle.perWeek / 5, 1) })]
      .forEach((text) => chips.append(el("li", "ck-chip", text)));
    box.append(chips);
    return box;
  };

  const deadPanel = (result) => {
    const box = panel(tx("No demand"), tx("SKUs without any demand in the whole period: no CV, no class in the matrix. Check them for obsolete stock."));
    const rows = result.noDemand.map((item) => {
      const tr = el("tr");
      const th = el("th", "ia-sku");
      th.scope = "row";
      th.append(el("strong", null, item.sku), el("span", "ia-cell-note", item.name));
      tr.append(th, el("td", "num", item.stock === null ? "–" : int.format(item.stock)), el("td", "num", item.stock > 0 ? money(item.stock * item.cost) : "–"));
      return tr;
    });
    box.append(tableOf([[tx("SKU and description")], [tx("Stock"), true], [tx("Stock value"), true]], rows));
    box.append(el("p", "dl-panel-note", cfg.noDemand.policy));
    return box;
  };

  const methodPanel = (result, s) => {
    const box = panel(tx("How the numbers are worked out"));
    const list = el("ul", "ia-method");
    [
      tx("Annual demand D = mean demand per period × {n} periods per year; annual consumption value = D × unit cost.", { n: int.format(s.perYear) }),
      tx("ABC: SKUs sorted by value; A up to {a} of the cumulative value, B up to {b}, C the rest. The SKU that crosses a threshold keeps the class it starts in; equal values share a class.", { a: pct(s.a, 0), b: pct(s.b, 0) }),
      tx("XYZ: CV = σ ÷ μ of the demand per period, σ as the sample standard deviation (n − 1). X up to {x}, Y up to {y}, Z above. A period without demand counts as 0; a SKU with a mean of 0 is listed as no demand.", { x: num(s.x, 2), y: num(s.y, 2) }),
      tx("Per day: d̄ = μ ÷ {days} days, σ_d = σ ÷ √{days}.", { days: num(s.days, s.days % 1 ? 2 : 0) }),
      tx("Safety stock SS = z × √(LT × σ_d² + d̄² × σ_LT²), which is z × σ_d × √LT when the lead time is fixed; z = {z} for a {service} cycle service level (inverse normal).", { z: num(s.z, 4), service: level(s.service) }),
      tx("Reorder point ROP = d̄ × LT + SS, rounded up to whole units. A SKU is flagged when its stock is below it."),
      s.orderCost > 0 && s.holding > 0 ? tx("EOQ = √(2 × D × S ÷ H) with S = {s} per order and H = {h} of the unit cost per year.", { s: money(s.orderCost), h: pct(s.holding, 0) }) : tx("EOQ: enter an order cost and a holding rate."),
      tx("Lead time: {n} without their own lead time use {days} days.", { n: plural(result.items.filter((item) => item.ltDefault).length, tx("SKU"), tx("SKUs")), days: num(s.leadTime, s.leadTime % 1 ? 1 : 0) }),
    ].forEach((text) => list.append(el("li", null, text)));
    box.append(list);
    return box;
  };

  const render = () => {
    note.sync(state);
    results.replaceChildren();
    if (!state.rows.length) {
      current = null;
      results.hidden = true;
      renderList(null);
      return;
    }
    const s = settings();
    const result = analyse(state.rows, s);
    current = result;
    renderList(result);
    results.hidden = false;

    const head = el("div", "result-head ia-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${plural(result.items.length, tx("SKU"), tx("SKUs"))} · ${periodWord(result.periods, s.unit)}${state.source ? ` · ${state.source}` : ""}`));
    const title = el("h2");
    title.append(`${tx("{n} carry", { n: plural(result.counts.A, tx("A SKU"), tx("A SKUs")) })} `, el("span", null, tx("{share} of the value", { share: pct(result.shares.A.valueShare, 0) })));
    head.append(title);
    head.append(el("p", "ia-meta", tx("{share} of the SKUs · annual consumption value {value}", { share: share(result.shares.A.skuShare), value: money(result.total) })));

    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Annual consumption value"), money(result.total), tx("{n} with demand", { n: plural(result.items.length - result.noDemand.length, tx("SKU"), tx("SKUs")) })),
      stat(tx("Steady (X)"), int.format(result.xyz.X), tx("Y {y} · Z {z} · CV up to {x}", { y: int.format(result.xyz.Y), z: int.format(result.xyz.Z), x: num(s.x, 2) })),
      stat(tx("Below reorder point"), result.stockKnown ? int.format(result.belowRop.length) : "–", result.stockKnown ? tx("{n} of them A · service level {service}", { n: int.format(result.belowRop.filter((item) => item.cls === "A").length), service: level(s.service) }) : tx("no stock column")),
      stat(tx("Cycle counts per week"), num(result.cycle.perWeek, 1), tx("{n} per year", { n: int.format(Math.round(result.cycle.perYear)) })),
      stat(tx("No demand"), int.format(result.noDemand.length), result.deadValue > 0 ? tx("stock value {value}", { value: money(result.deadValue) }) : tx("in the whole period")),
    );

    const notes = [matrixBlock(result)];
    if (s.fixed.length) notes.push(el("p", "dl-warning", tx("Some settings could not be used and their defaults apply: {names}.", { names: s.fixed.map((name) => SETTING_LABEL[name] || name).join(", ") })));
    if (result.periods < 6) notes.push(el("p", "dl-warning", tx("Only {n}: the CV and the safety stock need at least 6, better 12 months or 26 weeks.", { n: periodWord(result.periods, s.unit) })));
    if (result.xyz.Z) notes.push(el("p", "dl-panel-note", tx("{n} with erratic demand (Z): their safety stock assumes normal demand and is only a guide. Order on demand or use min/max where you can.", { n: plural(result.xyz.Z, tx("SKU"), tx("SKUs")) })));

    const key = result.belowRop.length ? "reorder" : result.golden.length ? "slotting" : result.noDemand.length ? "dead" : "slotting";
    const focusTitle = key === "reorder" ? tx("Reorder the SKUs below their reorder point") : key === "dead" ? tx("Clear the SKUs without demand") : tx("Put the AX and AY SKUs in the golden zone");
    const focusDetail = key === "reorder" ? plural(result.belowRop.length, tx("SKU"), tx("SKUs")) : key === "dead" ? plural(result.noDemand.length, tx("SKU"), tx("SKUs")) : plural(result.golden.length, tx("SKU"), tx("SKUs"));
    const extra = key === "reorder" ? result.belowRop.slice(0, 5).map((item) => `${item.sku} (${item.cell}) ${tx("stock {stock} < ROP {rop}", { stock: int.format(item.stock), rop: units(item.rop) })}`).join(" · ")
      : key === "dead" ? result.noDemand.slice(0, 5).map((item) => item.sku).join(" · ")
      : result.golden.slice(0, 6).map((item) => item.sku).join(" · ");
    const focus = focusCard({ title: focusTitle, detail: focusDetail, lede: problemText(result, s), advice: cfg.focus[key], extraLabel: key === "reorder" ? tx("First to order") : tx("The SKUs"), extra });

    const actions = resultActions(() => summaryText(result, s), problemText(result, s), () => paretoTable(result.items, {
      source: cfg.text.tool, sku: tx("SKU and description"), cls: tx("Class"), value: tx("Annual consumption value"), valueLabel: tx("Annual consumption value"),
    }));
    if (Actions && result.belowRop.length) actions.append(Actions.linkButton(tx("Add to actions"), () => actionFor(result.belowRop, s)));

    resultLayout(results, {
      head, stats, notes, focus, actions,
      panels: [paretoPanel(result, s), classPanel(result), policyPanel(result), reorderPanel(result, s), slottingPanel(result), countPanel(result, s), result.noDemand.length ? deadPanel(result) : null, methodPanel(result, s)].filter(Boolean),
    });
  };
  const SETTING_LABEL = {
    a: tx("A up to (% of value)"), b: tx("B up to (% of value)"), x: tx("X up to (CV)"), y: tx("Y up to (CV)"), service: tx("Cycle service level (%)"), leadTime: tx("Lead time if none is given (days)"),
    ltSd: tx("Lead-time spread σ if none is given (days)"), orderCost: tx("Cost of one order"), holding: tx("Holding cost (% of unit cost per year)"), countA: tx("A counts per year"), countB: tx("B counts per year"), countC: tx("C counts per year"),
  };

  // A first visit opens on the example, so the result is visible at once; nothing is saved until the visitor acts.
  if (!state.rows.length && firstVisit(KEY)) loadExample();
  showSettings();
  render();
})();
