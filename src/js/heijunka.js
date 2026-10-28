// Heijunka (production levelling): a batched schedule turned into a levelled mix for one line, pick area or packing
// station. The day's available time and the demand give the takt; the pack-out gives the pitch; the cycle times give
// the load; the changeovers give the EPEI; and the day's sequence of runs, interleaved by their ideal position, fills
// the heijunka box. The batch and the levelled day are compared by changeovers, finished stock and load per hour.
// Sources: Mike Rother and John Shook, Learning to See (1999): takt, pitch, EPEI; Art Smalley, Creating Level Pull
// (2004): the heijunka box, pitch per pack-out, the trade between changeovers and finished stock.
// The arithmetic lives in window.HeijunkaMath so the tests can call it.
(() => {
  const kit = window.ToolKit || {};
  const parseNumber = kit.parseNumber || ((value) => Number(String(value ?? "").replace(",", ".")));
  const EPS = 1e-9;
  const MAX_PRODUCTS = 12;
  // The most containers a day the plan takes, all products together, and the most minutes a day can have. Beyond them the
  // box and the sequence would be hundreds of thousands of cards (or a tab that hangs), so the page asks for a larger
  // pack-out or a real day instead: 10,000 cards is a unit-level plan of 50,000 units a week on five days.
  const MAX_CONTAINERS = 10000;
  const MAX_DAY = 1440;
  const finite = (value) => typeof value === "number" && Number.isFinite(value);
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const str = (value) => (typeof value === "string" ? value : "");
  const newId = () => `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  // Arithmetic -------------------------------------------------------------------------------------------------------
  // Available time per day in minutes: shifts × (shift length − planned breaks) (Rother & Shook).
  const available = (shifts, shiftMin, breakMin) => {
    if (!(shifts > 0) || !(shiftMin > 0)) return 0;
    return Math.max(0, shifts * (shiftMin - Math.max(0, breakMin || 0)));
  };
  // Daily demand = demand in the period ÷ working days in the period.
  const daily = (demand, days) => (demand > 0 && days > 0 ? demand / days : 0);
  // Takt time = available time per day ÷ customer demand per day, here in seconds.
  const takt = (availableSec, totalDaily) => (availableSec > 0 && totalDaily > 0 ? availableSec / totalDaily : null);
  // Pitch = takt × pack-out quantity: the time one container of the product represents (Rother & Shook, Smalley).
  const pitch = (taktSec, packout) => (finite(taktSec) && packout > 0 ? taktSec * packout : null);
  // Load: Σ (daily demand × cycle time) against the available time. Above 100 % the line cannot make the day's demand;
  // above about 85 % it is tight, with little room left for changeovers and losses.
  const utilisation = (items, availableSec) => {
    const runSec = items.reduce((s, p) => s + (p.daily > 0 && p.cycle > 0 ? p.daily * p.cycle : 0), 0);
    const share = availableSec > 0 ? runSec / availableSec : null;
    return { runSec, share, state: share === null ? "none" : share > 1 + EPS ? "over" : share > 0.85 + EPS ? "tight" : "ok" };
  };
  // EPEI (every part every interval) = Σ changeover times ÷ (available time − run time), in days (Rother & Shook): the
  // shortest cycle in which every product can be made once, with the free time spent on changeovers only. When the run
  // time takes all the available time, there is no time for changeovers and no EPEI (null).
  const epei = (changeoverMin, availableMin, runMin) => {
    const free = availableMin - runMin;
    if (!(free > EPS)) return null;
    return Math.max(0, changeoverMin) / free;
  };
  // The day's containers of one product: full ones, the last one carrying what is left of the demand. containerCount
  // is their number, without making them.
  const containerCount = (dailyQty, packout) => (dailyQty > EPS && packout > 0 ? Math.ceil(dailyQty / packout - EPS) : 0);
  const containerSize = (dailyQty, packout, n, i) => (i < n - 1 ? packout : dailyQty - (n - 1) * packout);
  const containers = (dailyQty, packout) => {
    const n = containerCount(dailyQty, packout);
    return Array.from({ length: n }, (_, i) => containerSize(dailyQty, packout, n, i));
  };
  // n containers in r runs as evenly as possible: the first runs take the one left over (largest remainder).
  const splitRuns = (n, r) => {
    const runs = Math.max(1, Math.min(n, r));
    if (!n) return [];
    const base = Math.floor(n / runs), extra = n % runs;
    return Array.from({ length: runs }, (_, i) => base + (i < extra ? 1 : 0));
  };
  // The day's sequence. Each product runs `runsPerDay` times (or once per container when it has fewer). The runs are
  // put in the order of their ideal position in the day: run k of a product with r runs belongs at (k + ½) ÷ r of the
  // day. Sorting by that position is the largest-remainder (Webster) way of spreading each product evenly. Runs with
  // the same position are ordered by Toyota's goal chasing on the work content (Monden, Toyota Production System,
  // 1983): next comes the run that keeps the work done so far closest to the day's average rate (run time ÷ time),
  // so long and short cycle times alternate; a tie there goes to the product listed first. The order is fixed.
  // Every container lasts its pitch (units × takt), so the day adds up to the available time. Times in productive
  // minutes from the start of the first shift. order() is the same day without its containers, for maxRuns.
  const order = (items, runsPerDay, taktSec) => {
    const lists = items.map((p, index) => {
      const n = containerCount(p.daily, p.packout);
      const sizes = splitRuns(n, Math.max(1, Math.floor(runsPerDay) || 1));
      let at = 0;
      return sizes.map((size, k) => {
        let units = 0;
        for (let c = at; c < at + size; c += 1) units += containerSize(p.daily, p.packout, n, c);
        at += size;
        return { index, k, of: sizes.length, pos: (k + 0.5) / sizes.length, from: at - size, count: size, units, minutes: (units * taktSec) / 60, work: (units * (p.cycle || 0)) / 60 };
      });
    });
    // Each product's runs are already in the order of their position, so merging the lists gives the day sorted by
    // position, then product, then run, without sorting it (maxRuns builds many days).
    const runs = [];
    const next = lists.map(() => 0);
    for (let left = lists.reduce((s, list) => s + list.length, 0); left > 0; left -= 1) {
      let pick = -1;
      lists.forEach((list, i) => { if (next[i] < list.length && (pick < 0 || list[next[i]].pos < lists[pick][next[pick]].pos)) pick = i; });
      runs.push(lists[pick][next[pick]]);
      next[pick] += 1;
    }
    const time = runs.reduce((s, run) => s + run.minutes, 0);
    const rate = time > 0 ? runs.reduce((s, run) => s + run.work, 0) / time : 0;
    const ordered = [];
    let balance = 0;
    for (let i = 0; i < runs.length;) {
      let j = i;
      while (j < runs.length && Math.abs(runs[j].pos - runs[i].pos) < EPS) j += 1;
      const group = runs.slice(i, j);
      while (group.length) {
        let best = 0;
        group.forEach((run, g) => {
          const off = Math.abs(balance + run.work - rate * run.minutes), was = Math.abs(balance + group[best].work - rate * group[best].minutes);
          if (off < was - EPS) best = g;
        });
        const [run] = group.splice(best, 1);
        balance += run.work - rate * run.minutes;
        ordered.push(run);
      }
      i = j;
    }
    return ordered;
  };
  const sequence = (items, runsPerDay, taktSec) => {
    if (!finite(taktSec)) return [];
    let t = 0;
    return order(items, runsPerDay, taktSec).map((run, i) => {
      const p = items[run.index];
      const n = containerCount(p.daily, p.packout);
      const boxes = Array.from({ length: run.count }, (_, j) => containerSize(p.daily, p.packout, n, run.from + j));
      const start = t;
      const minutes = (run.units * taktSec) / 60;
      t += minutes;
      return { no: i + 1, index: run.index, k: run.k, of: run.of, containers: boxes.length, boxes, units: run.units, start, end: t, minutes };
    });
  };
  // Changeovers of a day: every switch from one product to another, the last run of the day to the first of the next
  // included (the day repeats). Minutes = Σ the changeover time to the product that follows.
  const changeovers = (seq, items) => {
    if (seq.length < 2) return { count: 0, minutes: 0, at: [] };
    const at = [];
    seq.forEach((run, i) => {
      const before = seq[(i - 1 + seq.length) % seq.length];
      if (before.index !== run.index) at.push(i);
    });
    return { count: at.length, minutes: at.reduce((s, i) => s + Math.max(0, items[seq[i].index].changeover || 0), 0), at };
  };
  // The changeover minutes of the day sequence() builds with `runsPerDay` runs, worked out the same way step by step,
  // in flat arrays and without the containers: maxRuns asks it for many days, and the tests hold it to sequence().
  // (Math is read once: a page script in a test's virtual machine pays for every look-up of a global.)
  const { abs, floor, max, min } = Math;
  const INF = Number.POSITIVE_INFINITY;
  const dayChangeovers = (items, runsPerDay, taktSec) => {
    const want = max(1, floor(runsPerDay) || 1);
    const n = items.map((p) => containerCount(p.daily, p.packout));
    const r = n.map((count) => (count ? min(count, want) : 0));
    const total = r.reduce((s, x) => s + x, 0);
    if (total < 2) return 0;
    const idx = new Int32Array(total), pos = new Float64Array(total), minutes = new Float64Array(total), work = new Float64Array(total);
    const next = new Int32Array(items.length), from = new Int32Array(items.length);
    let time = 0, done = 0;
    for (let at = 0; at < total; at += 1) {
      let pick = -1, best = INF;
      for (let i = 0; i < items.length; i += 1) {
        if (next[i] < r[i] && (next[i] + 0.5) / r[i] < best) { best = (next[i] + 0.5) / r[i]; pick = i; }
      }
      const p = items[pick], k = next[pick];
      const size = floor(n[pick] / r[pick]) + (k < n[pick] % r[pick] ? 1 : 0);
      let units = 0;
      for (let c = from[pick]; c < from[pick] + size; c += 1) units += containerSize(p.daily, p.packout, n[pick], c);
      from[pick] += size;
      next[pick] += 1;
      idx[at] = pick; pos[at] = best; minutes[at] = (units * taktSec) / 60; work[at] = (units * (p.cycle || 0)) / 60;
      time += minutes[at];
      done += work[at];
    }
    const rate = time > 0 ? done / time : 0;
    const ordered = new Int32Array(total);
    let balance = 0, o = 0;
    for (let i = 0; i < total;) {
      let j = i;
      while (j < total && abs(pos[j] - pos[i]) < EPS) j += 1;
      const group = [];
      for (let g = i; g < j; g += 1) group.push(g);
      while (group.length) {
        let pickAt = 0;
        for (let g = 0; g < group.length; g += 1) {
          const a = group[g], b = group[pickAt];
          if (abs(balance + work[a] - rate * minutes[a]) < abs(balance + work[b] - rate * minutes[b]) - EPS) pickAt = g;
        }
        const [run] = group.splice(pickAt, 1);
        balance += work[run] - rate * minutes[run];
        ordered[o] = idx[run];
        o += 1;
      }
      i = j;
    }
    let sum = 0;
    for (let i = 0; i < total; i += 1) if (ordered[(i - 1 + total) % total] !== ordered[i]) sum += max(0, items[ordered[i]].changeover || 0);
    return sum;
  };
  // The most runs per day whose changeovers still fit the time the run leaves free; 0 when not even one run fits. More
  // runs do not always mean more changeovers (the order of the day can join two runs of a product), so every count is
  // tried, from the most down, but without working out its day where two bounds already decide: a product with r runs
  // has at most r changeovers into it and, beside a product with as many runs, at least ⌈r ÷ 2⌉ (of any three of its
  // runs in a row, one is apart); the product with the most runs, alone at the top, has at least as many as the next.
  // Building every day in full took seconds at a pack-out of 1 (audit 27 Oct 2026, P2B-04).
  const maxRuns = (items, taktSec, availableMin, runMin) => {
    const live = items.map((p) => ({ n: containerCount(p.daily, p.packout), c: Math.max(0, p.changeover || 0) })).filter((p) => p.n > 0);
    const most = Math.max(0, ...live.map((p) => p.n));
    const fits = (minutes) => runMin + minutes <= availableMin + EPS;
    if (!fits(0)) return 0;
    if (live.length < 2) return most;
    for (let m = most; m >= 1; m -= 1) {
      const r = live.map((p) => Math.min(m, p.n));
      const top = Math.max(...r);
      const atTop = r.filter((x) => x === top).length;
      const next = Math.max(0, ...r.filter((x) => x < top));
      let upper = 0, lower = 0;
      live.forEach((p, i) => {
        upper += r[i] * p.c;
        lower += (r[i] === top && atTop === 1 ? Math.max(1, next) : Math.ceil(r[i] / 2)) * p.c;
      });
      // A margin far above rounding keeps the bounds on the safe side; between them the day is worked out.
      if (fits(upper + 1e-6)) return m;
      if (!fits(lower - 1e-6) && lower > 0) continue;
      if (fits(dayChangeovers(items, m, taktSec))) return m;
    }
    return 0;
  };
  // Finished stock to cover the cycle. In batches each product is made once per batch interval, so its run must cover
  // that many days of demand: about daily demand × interval (what is used during the run is left out). Levelled, a run
  // has to cover only until the next run of the same product: its largest run, one container (one pitch) when the mix
  // is fully levelled.
  const inventory = (items, batchDays, seq) => items.map((p, index) => {
    const batch = batchDays > 0 ? p.daily * batchDays : null;
    const levelled = seq.filter((run) => run.index === index).reduce((m, run) => Math.max(m, run.units), 0);
    return { index, batch, levelled, container: Math.min(p.packout || 0, p.daily || 0) };
  });
  // The clock time of a moment in productive minutes, from the start of the first shift (minutes after midnight). Shifts
  // follow each other; each shift's planned breaks are taken in one block in its middle. A run that ends at the start
  // of a break ends before it (end = true); one that starts there starts after it.
  const clockAt = (productive, { start = 0, shiftMin, breakMin = 0, shifts = 1 } = {}, end = false) => {
    const net = shiftMin - breakMin;
    if (!(net > 0)) return start + productive;
    const s = Math.min(shifts - 1, Math.max(0, Math.floor((productive + (end ? -EPS : EPS)) / net)));
    const within = productive - s * net;
    const half = net / 2;
    const afterBreak = breakMin > 0 && (end ? within > half + EPS : within >= half - EPS);
    return start + s * shiftMin + within + (afterBreak ? breakMin : 0);
  };
  // Minutes after midnight as 06:00; a night shift past midnight starts the clock again.
  const hhmm = (minutes) => {
    if (!finite(minutes)) return "–";
    const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  };
  const parseClock = (value) => {
    const m = String(value ?? "").trim().match(/^(\d{1,2})(?::|\.|h)?(\d{2})?$/);
    if (!m || Number(m[1]) > 23 || Number(m[2] || 0) > 59) return null;
    return Number(m[1]) * 60 + Number(m[2] || 0);
  };
  // The work asked of the line per hour of productive time, as a share of the hour: each run spreads its work content
  // (units × cycle time) evenly over its pitch time, and each changeover adds its minutes from the start of its run.
  // Above 100 % the line falls behind in that hour and must catch up later.
  const hourlyLoad = (seq, items, availableMin, switches = null, bucket = 60) => {
    const n = Math.ceil(availableMin / bucket - EPS);
    const work = Array.from({ length: Math.max(0, n) }, () => 0);
    const spread = (from, to, rate) => {
      for (let h = Math.max(0, Math.floor(from / bucket)); h < n && h * bucket < to; h += 1) {
        const overlap = Math.min(to, (h + 1) * bucket) - Math.max(from, h * bucket);
        if (overlap > 0) work[h] += overlap * rate;
      }
    };
    seq.forEach((run) => {
      const p = items[run.index];
      if (run.minutes > 0) spread(run.start, run.end, (p.cycle || 0) * run.units / 60 / run.minutes);
    });
    (switches || changeovers(seq, items)).at.forEach((i) => {
      const c = Math.max(0, items[seq[i].index].changeover || 0);
      if (c > 0) spread(seq[i].start, seq[i].start + c, 1);
    });
    return work.map((w, h) => {
      const length = Math.min(bucket, availableMin - h * bucket);
      return { h, from: h * bucket, length, work: w, share: length > 0 ? w / length : 0 };
    });
  };
  // The largest backlog the hours build up: the work above the hour's minutes carries into the next hour.
  const backlog = (hours) => {
    let carry = 0, most = 0;
    hours.forEach((h) => { carry = Math.max(0, carry + h.work - h.length); most = Math.max(most, carry); });
    return most;
  };
  // The heijunka box: rows the products, columns pitch intervals across the day. The interval is the pitch of the
  // product with the most demand (the first one on a tie); each container's card goes in the column where it starts,
  // so a product with a shorter pitch can have two cards in one interval, as in a real box.
  const box = (seq, items, taktSec, availableMin) => {
    const lead = items.reduce((best, p, i) => (p.daily > (items[best]?.daily ?? -1) + EPS ? i : best), 0);
    const interval = (pitch(taktSec, items[lead]?.packout) || 0) / 60;
    if (!(interval > 0)) return { interval: 0, columns: 0, cells: [] };
    const columns = Math.ceil(availableMin / interval - EPS);
    const cells = items.map(() => Array.from({ length: columns }, () => []));
    seq.forEach((run) => {
      let t = run.start;
      run.boxes.forEach((qty) => {
        const col = Math.min(columns - 1, Math.floor(t / interval + EPS));
        cells[run.index][col].push({ qty, run: run.no, start: t });
        t += (qty * taktSec) / 60;
      });
    });
    return { lead, interval, columns, cells };
  };

  // The whole plan. line: { shifts, shiftMin, breakMin, start, days, runs, batchDays } as numbers (NaN when empty);
  // products: [{ name, demand, cycle, packout, changeover }] as numbers. Every number the page shows comes from here.
  const analyse = (line, products) => {
    const shifts = line.shifts > 0 ? Math.floor(line.shifts) : 0;
    const availableMin = available(shifts, line.shiftMin, line.breakMin);
    const availableSec = availableMin * 60;
    const items = products.map((p) => ({
      name: p.name, demand: p.demand > 0 ? p.demand : 0, daily: daily(p.demand, line.days),
      cycle: p.cycle > 0 ? p.cycle : 0, packout: p.packout > 0 ? p.packout : 0, changeover: p.changeover > 0 ? p.changeover : 0,
    }));
    // Every product with demand takes its share of the takt, the load and the changeovers; only those with a pack-out
    // have containers, so only they are sequenced and get cards in the box (`unpacked` names the others for the page).
    const demanded = items.map((p, i) => ({ ...p, i })).filter((p) => p.daily > 0);
    const active = demanded.filter((p) => p.packout > 0);
    const unpacked = demanded.filter((p) => !(p.packout > 0));
    const totalDaily = demanded.reduce((s, p) => s + p.daily, 0);
    const t = takt(availableSec, totalDaily);
    const load = utilisation(demanded, availableSec);
    const runMin = load.runSec / 60;
    const changeoverSum = demanded.reduce((s, p) => s + p.changeover, 0);
    const e = demanded.length ? epei(changeoverSum, availableMin, runMin) : null;
    const counts = active.map((p) => containerCount(p.daily, p.packout));
    const most = Math.max(0, ...counts);
    // A day longer than 24 hours or more cards than the plan holds: the takt and the load are still worked out, the
    // sequence and the box are not (a demand of a billion would hang the page).
    const cards = counts.reduce((s, n) => s + n, 0);
    const too = availableMin > MAX_DAY ? { what: "day", value: availableMin, max: MAX_DAY } : cards > MAX_CONTAINERS ? { what: "containers", value: cards, max: MAX_CONTAINERS } : null;
    const planned = finite(t) && !too;
    const fits = planned ? maxRuns(active, t, availableMin, runMin) : 0;
    const asked = line.runs > 0 ? Math.floor(line.runs) : null;
    const runs = Math.max(1, Math.min(most || 1, asked ?? (fits || 1)));
    const seq = planned ? sequence(active, runs, t) : [];
    const switches = changeovers(seq, active);
    const blocks = planned ? sequence(active, 1, t) : [];
    const blockSwitches = changeovers(blocks, active);
    // The batch interval of today's schedule; when it is not known, the EPEI rounded up to whole days.
    const batchDays = line.batchDays > 0 ? line.batchDays : e !== null ? Math.max(1, Math.ceil(e - EPS)) : null;
    const stock = inventory(active, batchDays, seq);
    const batchStock = batchDays ? stock.reduce((s, x) => s + x.batch, 0) : null;
    const levelStock = stock.reduce((s, x) => s + x.levelled, 0);
    const levelMin = runMin + switches.minutes;
    return {
      availableMin, availableSec, totalDaily, takt: t, items, active, unpacked, too,
      pitches: active.map((p) => pitch(t, p.packout)),
      load, runMin, freeMin: availableMin - runMin, changeoverSum,
      epei: e, epeiShifts: e !== null ? e * shifts : null, epeiMinutes: e !== null ? e * availableMin : null,
      runs, asked, fits, most, seq, switches, levelMin, levelShare: availableMin > 0 ? levelMin / availableMin : null,
      levelFits: levelMin <= availableMin + EPS,
      batch: batchDays ? { days: batchDays, assumed: !(line.batchDays > 0), perDay: active.length > 1 ? active.length / batchDays : 0, minutesPerDay: active.length > 1 ? changeoverSum / batchDays : 0 } : null,
      stock, batchStock, levelStock, stockCut: batchStock > 0 ? 1 - levelStock / batchStock : null,
      blocks, blockSwitches,
      hourly: planned ? { levelled: hourlyLoad(seq, active, availableMin, switches), blocks: hourlyLoad(blocks, active, availableMin, blockSwitches) } : { levelled: [], blocks: [] },
      box: planned ? box(seq, active, t, availableMin) : { interval: 0, columns: 0, cells: [] },
    };
  };

  // Saved or typed products are rebuilt field by field, so nothing damaged can break the page. Fields stay text, as typed.
  const FIELDS = ["name", "demand", "cycle", "packout", "changeover"];
  const cleanProduct = (raw) => {
    const p = isObject(raw) ? raw : {};
    const out = { id: str(p.id).slice(0, 40) || newId() };
    FIELDS.forEach((f) => { out[f] = (typeof p[f] === "number" ? String(p[f]) : str(p[f])).slice(0, f === "name" ? 80 : 20); });
    return out;
  };
  const LINE = ["name", "shifts", "shiftMin", "breakMin", "start", "days", "runs", "batchDays"];
  const cleanLine = (raw, fallback = {}) => Object.fromEntries(LINE.map((f) => {
    const v = isObject(raw) ? raw[f] : undefined;
    return [f, typeof v === "string" ? v.slice(0, 80) : typeof v === "number" ? String(v) : String(fallback[f] ?? "")];
  }));
  // The text of the form as numbers for analyse().
  const numbers = (line, products) => ({
    line: { shifts: parseNumber(line.shifts), shiftMin: parseNumber(line.shiftMin), breakMin: parseNumber(line.breakMin) || 0, start: parseClock(line.start) ?? 0, days: parseNumber(line.days), runs: parseNumber(line.runs), batchDays: parseNumber(line.batchDays) },
    products: products.map((p) => ({ name: p.name, demand: parseNumber(p.demand), cycle: parseNumber(p.cycle), packout: parseNumber(p.packout), changeover: parseNumber(p.changeover) })),
  });

  window.HeijunkaMath = { MAX_PRODUCTS, MAX_CONTAINERS, MAX_DAY, available, daily, takt, pitch, utilisation, epei, containers, splitRuns, sequence, changeovers, dayChangeovers, maxRuns, inventory, clockAt, hhmm, parseClock, hourlyLoad, backlog, box, analyse, cleanProduct, cleanLine, numbers };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-heijunka]");
  const dataEl = document.getElementById("heijunka-data");
  if (!root || !dataEl || !window.ToolKit) return;
  const { tx, num, pct, int, el, write, loadState, firstVisit, panel, stat, focusCard, resultActions, resultLayout, flash, undoNote, downloadCsv, downloadXlsx, copy } = window.ToolKit;
  const CK = window.ChartKit;
  const AS = window.ActionsStore;
  // On screen and on paper the box shows at most this many pitch columns, and the sequence this many runs: a unit-level
  // plan has thousands of each, which no one reads and which took a second to draw per keystroke. The CSV has them all.
  const SCREEN_COLUMNS = 300;
  const SCREEN_RUNS = 300;
  const boxFits = (r) => r.box.columns <= SCREEN_COLUMNS;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;

  const results = document.querySelector("[data-results]");
  const printBox = document.querySelector("[data-print]");
  const lineInputs = [...root.querySelectorAll("[data-line]")];
  const tbody = root.querySelector("[data-products]");
  const empty = root.querySelector("[data-empty]");
  const status = root.querySelector("[data-status]");
  const derived = root.querySelector("[data-derived]");
  const addButton = root.querySelector("[data-add]");

  // State: the line as typed and the products as typed; every number is worked out from the text on each render.
  const blankLine = () => cleanLine({}, data.defaults);
  const defaults = { line: blankLine(), products: [], example: false };
  const state = loadState(KEY, defaults);
  state.line = cleanLine(state.line, data.defaults);
  state.products = state.products.slice(0, MAX_PRODUCTS).map(cleanProduct);
  const loadExample = () => {
    Object.assign(state, { line: cleanLine(data.example.line, data.defaults), products: data.example.products.map(cleanProduct), example: true });
  };
  // A first visit opens on the example, so the result is visible at once; the note above it says so.
  if (!state.products.length && firstVisit(KEY)) loadExample();
  const save = () => write(KEY, state);
  // The visitor's own first change ends the example: the data stays, the note goes.
  const own = () => { state.example = false; };
  // One analysis per change of the text: the line and the result both ask for it on every keystroke.
  let planned = { key: null, value: null };
  const plan = () => {
    const key = JSON.stringify([state.line, state.products]);
    if (planned.key !== key) { const n = numbers(state.line, state.products); planned = { key, value: { n, r: analyse(n.line, n.products) } }; }
    return planned.value;
  };
  const nameOf = (p, i) => p?.name?.trim() || tx("Product {n}", { n: i + 1 });
  const shiftOf = (n) => ({ start: n.line.start, shiftMin: n.line.shiftMin, breakMin: n.line.breakMin || 0, shifts: n.line.shifts > 0 ? Math.floor(n.line.shifts) : 1 });
  const minutes = (value) => `${num(value, Math.abs(value - Math.round(value)) < 0.05 ? 0 : 1)} min`;
  const units = (value) => num(value, Math.abs(value - Math.round(value)) < 0.05 ? 0 : 1);
  const days = (value) => `${num(value, Math.abs(value - Math.round(value)) < 0.005 ? 0 : value >= 10 ? 1 : 2)} ${tx("days")}`;
  const seconds = (value) => `${num(value, Math.abs(value - Math.round(value)) < 0.05 ? 0 : 1)} s`;

  // Example note above the results, with one tap to clear the example.
  const note = el("div", "dl-example-note");
  note.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  clearExample.addEventListener("click", () => {
    Object.assign(state, { line: blankLine(), products: [], example: false });
    save();
    renderAll();
  });
  note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(note);

  // The line ---------------------------------------------------------------------------------------------------------------
  const showLine = () => lineInputs.forEach((input) => { input.value = state.line[input.name] ?? ""; });
  lineInputs.forEach((input) => input.addEventListener("input", () => {
    state.line[input.name] = input.value.slice(0, 80);
    own();
    save();
    renderDerived();
    renderResults();
  }));

  // The products ---------------------------------------------------------------------------------------------------------------
  const COLS = [
    ["name", "Product or family", "text", "hj-text"],
    ["demand", "Demand in the period", "decimal", "hj-num"],
    ["cycle", "Cycle time (s)", "decimal", "hj-num"],
    ["packout", "Pack-out (units)", "decimal", "hj-num"],
    ["changeover", "Changeover to it (min)", "decimal", "hj-num"],
  ];
  const row = (p, i) => {
    const tr = el("tr");
    tr.dataset.row = String(i);
    COLS.forEach(([f, label, mode, cls]) => {
      const td = el("td", f === "name" ? null : "num");
      const input = el("input", cls);
      input.id = `hj-${f}-${i}`;
      input.value = p[f];
      input.dataset.f = f;
      input.dataset.i = String(i);
      input.autocomplete = "off";
      if (mode === "decimal") input.inputMode = "decimal";
      if (f === "name") input.placeholder = data.text.productPlaceholder;
      input.setAttribute("aria-label", `${tx(label)} · ${nameOf(p, i)}`);
      td.append(input);
      tr.append(td);
    });
    const info = el("td", "hj-info");
    info.dataset.info = String(i);
    const rm = el("td");
    const button = el("button", "dl-remove", "×");
    button.type = "button";
    button.dataset.remove = String(i);
    button.setAttribute("aria-label", tx("Remove {product}", { product: nameOf(p, i) }));
    button.title = button.getAttribute("aria-label");
    rm.append(button);
    tr.append(info, rm);
    return tr;
  };
  const renderProducts = () => {
    tbody.replaceChildren(...state.products.map(row));
    empty.hidden = state.products.length > 0;
    tbody.closest("[data-products-wrap]").hidden = !state.products.length;
    addButton.disabled = state.products.length >= MAX_PRODUCTS;
    renderDerived();
  };
  // Per product, beside its row: the day's demand and its pitch; under the line, the available time and the takt.
  const renderDerived = () => {
    const { n, r } = plan();
    state.products.forEach((p, i) => {
      const cell = tbody.querySelector(`[data-info="${i}"]`);
      if (!cell) return;
      const item = r.items[i];
      const pi = r.active.findIndex((a) => a.i === i);
      cell.textContent = item && item.daily > 0
        ? `${tx("{n} a day", { n: units(item.daily) })}${pi >= 0 && r.pitches[pi] ? ` · ${tx("pitch {t}", { t: minutes(r.pitches[pi] / 60) })}` : ""}`
        : "–";
    });
    derived.textContent = r.availableMin > 0
      ? `${tx("Available per day")}: ${tx("{shifts} × ({length} − {breaks}) = {t}", { shifts: int.format(Math.floor(n.line.shifts)), length: int.format(n.line.shiftMin), breaks: int.format(n.line.breakMin || 0), t: minutes(r.availableMin) })}${r.takt ? ` · ${tx("Takt time")}: ${seconds(r.takt)}` : ""}`
      : tx("Enter the shifts per day and the shift length to see the available time.");
  };
  tbody.addEventListener("input", (event) => {
    const { f, i } = event.target.dataset;
    if (!f || i === undefined || !state.products[Number(i)]) return;
    state.products[Number(i)][f] = event.target.value.slice(0, f === "name" ? 80 : 20);
    own();
    save();
    renderDerived();
    renderResults();
  });
  tbody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const index = Number(button.dataset.remove);
    const [removed] = state.products.splice(index, 1);
    own();
    save();
    renderProducts();
    renderResults();
    (tbody.querySelector(`[data-remove="${Math.min(index, state.products.length - 1)}"]`) || addButton).focus();
    undoNote(status, tx("Removed {product}.", { product: nameOf(removed, index) }), () => {
      state.products.splice(Math.min(index, state.products.length), 0, removed);
      save();
      renderProducts();
      renderResults();
    });
  });
  addButton.addEventListener("click", () => {
    if (state.products.length >= MAX_PRODUCTS) { flash(status, tx("A plan holds up to {n} products.", { n: MAX_PRODUCTS })); return; }
    state.products.push(cleanProduct({}));
    own();
    save();
    renderProducts();
    tbody.querySelector(`#hj-name-${state.products.length - 1}`)?.focus();
  });
  root.querySelector("[data-example]").addEventListener("click", () => {
    loadExample();
    save();
    renderAll();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.products.length || !window.confirm(tx("Clear this plan ({n} products)?", { n: state.products.length }))) return;
    Object.assign(state, { line: blankLine(), products: [], example: false });
    save();
    renderAll();
  });

  // Exports ------------------------------------------------------------------------------------------------------------------
  const lineName = () => state.line.name.trim();
  const fileName = () => `${data.csv}${lineName() ? `-${lineName().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30)}` : ""}`;
  // The sequence container by container: the order to load the heijunka box, and the times to pull each card.
  const sequenceRows = (n, r) => {
    const shift = shiftOf(n);
    const rows = [[tx("No."), tx("Run"), tx("Product"), tx("Units"), tx("Pitch (min)"), tx("From"), tx("To"), tx("Changeover before (min)")]];
    const switchAt = new Set(r.switches.at);
    let no = 0;
    r.seq.forEach((run, ri) => {
      const p = r.active[run.index];
      let t = run.start;
      run.boxes.forEach((qty, j) => {
        const span = (qty * r.takt) / 60;
        no += 1;
        rows.push([no, run.no, nameOf(p, p.i), Math.round(qty * 100) / 100, Math.round(span * 100) / 100, hhmm(clockAt(t, shift)), hhmm(clockAt(t + span, shift, true)), j === 0 && switchAt.has(ri) ? p.changeover : 0]);
        t += span;
      });
    });
    return rows;
  };

  // The heijunka box ---------------------------------------------------------------------------------------------------------
  const boxTable = (n, r, forPrint) => {
    const shift = shiftOf(n);
    const b = r.box;
    const wrap = el("div", "dl-table-wrap hj-box-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "hj-box");
    table.append(el("caption", "visually-hidden", tx("Heijunka box: one row per product, one column per pitch interval from {t}", { t: hhmm(n.line.start) })));
    const head = el("tr");
    const corner = el("th", "hj-box-name", tx("Product"));
    corner.scope = "col";
    head.append(corner);
    for (let c = 0; c < b.columns; c += 1) {
      const th = el("th", "hj-box-time");
      th.scope = "col";
      th.append(el("span", null, hhmm(clockAt(c * b.interval, shift))));
      head.append(th);
    }
    const thead = el("thead");
    thead.append(head);
    const body = el("tbody");
    r.active.forEach((p, pi) => {
      const tr = el("tr");
      const th = el("th", "hj-box-name", nameOf(p, p.i));
      th.scope = "row";
      tr.append(th);
      const starts = new Set(r.seq.filter((run) => run.index === pi).map((run) => Math.min(b.columns - 1, Math.floor(run.start / b.interval + 1e-9))));
      b.cells[pi].forEach((cards, c) => {
        const td = el("td", starts.has(c) ? "hj-cell is-start" : "hj-cell");
        if (cards.length) {
          td.classList.add("has-card");
          const text = cards.map((card) => `${units(card.qty)}`).join(" + ");
          const count = cards.length === 1 ? tx("1 card") : tx("{n} cards", { n: cards.length });
          td.title = `${nameOf(p, p.i)} · ${hhmm(clockAt(cards[0].start, shift))} · ${count} · ${text} ${tx("units")}`;
          td.append(el("span", "hj-card", "■".repeat(Math.min(cards.length, 3))), el("span", "visually-hidden", `${count}, ${text} ${tx("units")}`));
        }
        tr.append(td);
      });
      body.append(tr);
    });
    table.append(thead, body);
    wrap.append(table);
    const out = [wrap, el("p", "dl-panel-note hj-box-key", tx("■ one card = one container of the pack-out, released at its pitch. A column is {i} min ({product}'s pitch). A strong left edge marks the start of a run, where the changeover happens.", { i: num(b.interval, Number.isInteger(b.interval) ? 0 : 1), product: nameOf(r.active[b.lead], r.active[b.lead].i) }))];
    if (forPrint) out.unshift(el("h2", null, `${tx("Heijunka box")}${lineName() ? ` · ${lineName()}` : ""}`), el("p", "hj-print-meta", printMeta(r)));
    return out;
  };
  const printMeta = (r) => [
    `${tx("Takt time")}: ${seconds(r.takt)}`,
    `${tx("Runs of each product per day")}: ${r.runs}`,
    `${tx("Changeovers per day")}: ${r.switches.count} (${minutes(r.switches.minutes)})`,
    `${tx("Utilisation")}: ${pct(r.load.share, 1)}`,
    r.epei !== null ? `EPEI: ${days(r.epei)}` : "",
  ].filter(Boolean).join(" · ");
  const printTheBox = () => {
    const { n, r } = plan();
    if (!r.seq.length || !boxFits(r)) return;
    printBox.replaceChildren(...boxTable(n, r, true), el("p", "hj-print-sign", `${tx("Prepared")}: ____________________   ${tx("Approved")}: ____________________`));
    printBox.hidden = false;
    document.documentElement.classList.add("hj-printing");
    const done = () => {
      document.documentElement.classList.remove("hj-printing");
      printBox.hidden = true;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint (some phones) get the page back a moment later.
    setTimeout(done, 2000);
  };

  // Results ------------------------------------------------------------------------------------------------------------------
  const stateOf = (r) => (r.load.state === "over" || r.epei === null ? "over" : r.epei > 1 + 1e-9 ? "epei" : !r.levelFits ? "nofit" : r.load.state === "tight" ? "tight" : "ok");
  const longestChangeover = (r) => r.active.reduce((best, p) => (p.changeover > (best?.changeover ?? -1) ? p : best), null);
  const actionFor = (r) => {
    const p = longestChangeover(r);
    if (!p) return null;
    const name = nameOf(p, p.i);
    return {
      title: tx("Reduce the changeover to {product} ({t} min) with SMED", { product: name, t: units(p.changeover) }),
      detail: tx("Heijunka {line}: EPEI {epei}, {free} free per day for {sum} of changeovers. Shorter changeovers allow more runs a day and less finished stock.", {
        line: lineName() || data.text.line, epei: r.epei !== null ? days(r.epei) : tx("not possible"), free: minutes(Math.max(0, r.freeMin)), sum: minutes(r.changeoverSum),
      }),
      source: "heijunka", area: lineName(), priority: r.epei === null || r.epei > 1 ? "High" : "Medium",
      check: tx("EPEI at or below one day: every product can be made every day.", {}),
    };
  };
  const summaryText = (n, r) => {
    const lines = [`${data.title} | Stiven Catalyst`, lineName() || data.text.line, ""];
    lines.push(
      `${tx("Available per day")}: ${minutes(r.availableMin)} · ${tx("Demand per day")}: ${units(r.totalDaily)} ${tx("units")}`,
      `${tx("Takt time")}: ${seconds(r.takt)}`,
      `${tx("Utilisation")}: ${pct(r.load.share, 1)} (${minutes(r.runMin)} ${tx("run time")})`,
      `EPEI: ${r.epei !== null ? `${days(r.epei)} · ${num(r.epeiShifts, 2)} ${tx("shifts")}` : tx("not possible: no time left for changeovers")}`,
      `${tx("Runs of each product per day")}: ${r.runs} (${tx("at most {n} fit", { n: r.fits })})`,
      `${tx("Changeovers per day")}: ${r.switches.count} ${tx("levelled")} (${minutes(r.switches.minutes)})${r.batch ? ` · ${num(r.batch.perDay, 1)} ${tx("in batches")} (${minutes(r.batch.minutesPerDay)})` : ""}`,
    );
    if (r.batchStock !== null) lines.push(`${tx("Finished stock")}: ${units(r.levelStock)} ${tx("levelled")} · ${units(r.batchStock)} ${tx("in batches every {d}", { d: days(r.batch.days) })} (${pct(r.stockCut, 0)} ${tx("less")})`);
    lines.push("", `${tx("Products")}:`);
    r.active.forEach((p, pi) => {
      lines.push(`- ${nameOf(p, p.i)}: ${units(p.daily)} ${tx("a day")} · ${tx("pitch {t}", { t: minutes(r.pitches[pi] / 60) })} · ${tx("cycle {c} s", { c: num(p.cycle, Number.isInteger(p.cycle) ? 0 : 1) })} · ${tx("changeover {t}", { t: minutes(p.changeover) })}`);
    });
    lines.push("", `${tx("Sequence")}:`);
    const shift = shiftOf(n);
    r.seq.forEach((run) => {
      const p = r.active[run.index];
      lines.push(`${run.no}. ${hhmm(clockAt(run.start, shift))}–${hhmm(clockAt(run.end, shift, true))} ${nameOf(p, p.i)} · ${tx("{n} containers", { n: run.containers })} · ${units(run.units)} ${tx("units")}`);
    });
    return lines.join("\n");
  };

  const renderResults = () => {
    note.hidden = !state.example;
    results.replaceChildren();
    const { n, r } = plan();
    if (r.too && r.active.length) {
      results.hidden = false;
      results.append(el("p", "dl-warning", r.too.what === "day"
        ? tx("{t} of available time a day is more than the plan can hold: a day has {max} minutes. Check the shifts per day and the shift length.", { t: minutes(r.too.value), max: int.format(r.too.max) })
        : tx("{n} containers a day is more than the plan can hold (at most {max}). Use a larger pack-out, a box, a tote or a pallet, so that one card stands for more units.", { n: int.format(r.too.value), max: int.format(r.too.max) })));
      return;
    }
    const ready = r.availableMin > 0 && r.active.length > 0 && r.takt;
    results.hidden = !ready;
    if (!ready) return;
    const shift = shiftOf(n);
    const situation = stateOf(r);

    const top = el("div", "result-head");
    top.append(el("p", "kicker", `${tx("Result")}${lineName() ? ` · ${lineName()}` : ""}`));
    top.append(el("h2", null, situation === "over"
      ? tx("The day's demand needs {t} of {a}: the line cannot make it", { t: minutes(r.runMin), a: minutes(r.availableMin) })
      : r.stockCut !== null && r.stockCut > 0
        ? (r.runs === 1 ? tx("One run of each product a day: {n} changeovers, {p} less finished stock", { n: r.switches.count, p: pct(r.stockCut, 0) }) : tx("{runs} runs of each product a day: {n} changeovers, {p} less finished stock", { runs: r.runs, n: r.switches.count, p: pct(r.stockCut, 0) }))
        : r.runs === 1 ? tx("One run of each product a day: {n} changeovers", { n: r.switches.count }) : tx("{runs} runs of each product a day: {n} changeovers", { runs: r.runs, n: r.switches.count })));

    const pitchMin = r.pitches.map((s) => s / 60);
    const lo = Math.min(...pitchMin), hi = Math.max(...pitchMin);
    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Takt time"), seconds(r.takt), tx("{a} available ÷ {d} units a day", { a: minutes(r.availableMin), d: units(r.totalDaily) })));
    stats.append(stat(tx("Pitch"), Math.abs(hi - lo) < 1e-9 ? minutes(lo) : `${num(lo, 1)}–${minutes(hi)}`, tx("takt × pack-out: one container")));
    stats.append(stat(tx("Utilisation"), pct(r.load.share, 1), `${minutes(r.runMin)} ${tx("run time")} · ${r.load.state === "over" ? tx("overloaded") : r.load.state === "tight" ? tx("tight") : tx("room for changeovers")}`));
    stats.append(stat("EPEI", r.epei !== null ? days(r.epei) : tx("not possible"), r.epei !== null ? tx("{s} shifts · every product every {t} of production", { s: num(r.epeiShifts, 2), t: minutes(r.epeiMinutes) }) : tx("no time left for changeovers")));
    stats.append(stat(tx("Changeovers per day"), String(r.switches.count), r.batch ? tx("levelled, {m}; in batches {b} a day", { m: minutes(r.switches.minutes), b: num(r.batch.perDay, 1) }) : tx("levelled, {m}", { m: minutes(r.switches.minutes) })));
    if (r.batchStock !== null) stats.append(stat(tx("Finished stock"), units(r.levelStock), tx("units levelled; {b} in batches every {d}", { b: units(r.batchStock), d: days(r.batch.days) })));

    const notes = [];
    if (r.load.state === "over") notes.push(el("p", "dl-warning", tx("Overloaded: the run time is {p} of the available time. Add time (a shift, overtime) or cut the cycle times before levelling.", { p: pct(r.load.share, 1) })));
    else if (r.load.state === "tight") notes.push(el("p", "dl-warning", tx("Tight: the run time is {p} of the available time, above about 85 %. Little is left for changeovers, breakdowns and quality losses.", { p: pct(r.load.share, 1) })));
    if (r.epei === null && r.load.state !== "over") notes.push(el("p", "dl-warning", tx("EPEI is not possible: the run time takes all the available time, so no changeover fits.")));
    else if (r.epei !== null && r.epei > 1 + 1e-9) notes.push(el("p", "dl-warning", tx("EPEI is {e}: not every product can be made every day. Cut the changeovers with SMED first.", { e: days(r.epei) })));
    if (!r.levelFits && r.epei !== null) notes.push(el("p", "dl-warning", r.fits ? tx("{runs} runs a day need {m} of changeovers, but only {free} are free. The most that fit: {fits} a day.", { runs: r.runs, m: minutes(r.switches.minutes), free: minutes(Math.max(0, r.freeMin)), fits: r.fits }) : tx("Even one run a day needs {m} of changeovers, but only {free} are free: not every product can be made every day.", { m: minutes(r.switches.minutes), free: minutes(Math.max(0, r.freeMin)) })));
    if (r.asked && r.asked > r.most) notes.push(el("p", "dl-panel-note", tx("No product has more than {n} containers a day, so {n} runs a day is the most: one container per run, the mix fully levelled.", { n: r.most })));
    if (!r.asked) notes.push(el("p", "dl-panel-note", tx("Runs per day left empty: the plan uses the most that fit, {n}.", { n: r.runs })));
    if (r.batch?.assumed) notes.push(el("p", "dl-panel-note", tx("Batch interval left empty: the comparison assumes {d}, the EPEI rounded up to whole days.", { d: days(r.batch.days) })));
    const noCycle = r.active.filter((p) => !(p.cycle > 0));
    if (noCycle.length) notes.push(el("p", "dl-warning", tx("{n} products have no cycle time yet and count as no work.", { n: noCycle.length })));
    if (r.unpacked.length) notes.push(el("p", "dl-warning", tx("{names}: no pack-out yet. The demand counts in the takt and the load, but without a pack-out there are no cards in the box and no runs in the sequence.", { names: r.unpacked.map((p) => nameOf(p, p.i)).join(", ") })));
    const skipped = r.items.length - r.active.length - r.unpacked.length;
    if (skipped) notes.push(el("p", "dl-panel-note", tx("{n} products without demand are left out.", { n: skipped })));

    const advice = data.advice[situation];
    const lp = longestChangeover(r);
    const focus = focusCard({
      title: advice.title,
      detail: situation === "over" ? pct(r.load.share, 1) : r.epei !== null ? `EPEI ${days(r.epei)}` : "",
      lede: tx("The line has {free} a day beyond the run time; the changeovers of one round of all products take {sum}. The longest is {product} ({t}).", { free: minutes(Math.max(0, r.freeMin)), sum: minutes(r.changeoverSum), product: lp ? nameOf(lp, lp.i) : "–", t: lp ? minutes(lp.changeover) : "–" }),
      advice,
    });

    // Actions: copy, print, 5 Whys, the box to print, the sequence as a file, a SMED action to the tracker.
    const problem = situation === "over"
      ? tx("{line} needs {p} of its available time for the day's demand", { line: lineName() || data.text.line, p: pct(r.load.share, 0) })
      : tx("{line} can only make every product every {e}", { line: lineName() || data.text.line, e: r.epei !== null ? days(r.epei) : "–" });
    const actions = resultActions(() => summaryText(n, r), problem);
    const printButton = el("button", "button-secondary", tx("Print the heijunka box"));
    printButton.type = "button";
    printButton.addEventListener("click", printTheBox);
    printButton.disabled = !boxFits(r);
    const csv = el("button", "button-secondary", tx("Download CSV"));
    csv.type = "button";
    csv.addEventListener("click", () => downloadCsv(fileName(), sequenceRows(n, r)));
    const xlsx = el("button", "button-secondary", tx("Download Excel"));
    xlsx.type = "button";
    xlsx.addEventListener("click", () => downloadXlsx(fileName(), sequenceRows(n, r), { sheet: "Heijunka" }));
    actions.append(printButton, csv, xlsx);
    if (AS && lp && lp.changeover > 0 && (situation === "over" || situation === "epei" || situation === "nofit")) {
      actions.append(AS.linkButton(tx("Reduce changeover on {product}: add to actions", { product: nameOf(lp, lp.i) }), () => actionFor(plan().r)));
    }
    const smed = el("a", "button-secondary", tx("Open SMED"));
    smed.href = new URL("../smed/", window.location.href).href;
    actions.append(smed);

    const panels = [];
    // 1. The box.
    const boxPanel = panel(tx("Heijunka box"), tx("Load the cards in this order and pull one column at each pitch: the line makes what the card says, in the order the customer takes it."));
    boxPanel.classList.add("hj-box-panel");
    if (boxFits(r)) boxPanel.append(...boxTable(n, r, false));
    else boxPanel.append(el("p", "dl-warning", tx("{n} pitch columns a day ({t} each) are too many for a box to read or print. Use a larger pack-out, so that one card stands for more units; the sequence and the CSV hold every container.", { n: int.format(r.box.columns), t: minutes(r.box.interval) })));
    panels.push(boxPanel);

    // 2. The load per hour, levelled against one block per product.
    const hours = r.hourly;
    const loadPanel = panel(tx("Load per hour"), tx("The work asked of the line in each productive hour (run time and changeovers), as a share of the hour: levelled with {n} runs a day, against one block of each product. Above 100 % it falls behind and has to catch up later.", { n: r.runs }));
    const levelBack = backlog(hours.levelled), blockBack = backlog(hours.blocks);
    if (CK) {
      const point = (h, label) => ({ x: hhmm(clockAt(h.from, shift)), y: Math.round(h.share * 1000) / 10, state: h.share > 1 + 1e-9 ? "danger" : undefined, tip: `${hhmm(clockAt(h.from, shift))} · ${label}: ${pct(h.share, 0)}` });
      const kLevel = tx("Levelled"), kBlock = tx("In batches");
      loadPanel.append(CK.figure(CK.line([
        { label: kLevel, color: CK.C.blue, points: hours.levelled.map((h) => point(h, kLevel)) },
        { label: kBlock, color: CK.C.muted, points: hours.blocks.map((h) => point(h, kBlock)) },
      ], { title: `${data.title}: ${tx("Load per hour")}`, unit: "%", center: 100, centerLabel: tx("Capacity"), yMin: 0, format: (v) => num(v, 0) }), { fileName: `${data.csv}-load` }));
    }
    const peaks = el("ul", "hj-facts");
    const peak = (list) => Math.max(...list.map((h) => h.share));
    peaks.append(
      el("li", null, tx("Levelled: highest hour {p}, largest backlog {t}.", { p: pct(peak(hours.levelled), 0), t: minutes(levelBack) })),
      el("li", null, tx("In batches: highest hour {p}, largest backlog {t}.", { p: pct(peak(hours.blocks), 0), t: minutes(blockBack) })),
    );
    loadPanel.append(peaks, el("p", "dl-panel-note", data.text.loadNote));
    panels.push(loadPanel);

    // 3. Batch against levelled, product by product.
    const compare = panel(tx("Batches against the levelled mix"), r.batch ? tx("In batches each product runs once every {d}, so its run must cover that many days of demand. Levelled, a run covers only until the next run of the product.", { d: days(r.batch.days) }) : "");
    if (CK && r.batchStock !== null) {
      const keys = r.active.map((p) => nameOf(p, p.i));
      const colors = Object.fromEntries(keys.map((key, i) => [key, CK.SERIES[i % CK.SERIES.length]]));
      compare.append(CK.figure(CK.stacked([
        { label: tx("In batches"), parts: r.stock.map((s) => ({ key: keys[s.index], value: Math.round(s.batch * 10) / 10 })) },
        { label: tx("Levelled"), parts: r.stock.map((s) => ({ key: keys[s.index], value: Math.round(s.levelled * 10) / 10 })) },
      ], { keys, colors, title: `${data.title}: ${tx("Finished stock")}`, unit: tx("units"), format: (v) => num(v, 0) }), { fileName: `${data.csv}-stock` }));
    }
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table hj-compare");
    const hr = el("tr");
    [[tx("Product")], [tx("Per day"), "num"], [tx("Pitch"), "num"], [tx("Containers a day"), "num"], [tx("Runs a day"), "num"], [tx("Run time a day"), "num"], [tx("Stock in batches"), "num"], [tx("Stock levelled"), "num"]].forEach(([text, cls]) => { const th = el("th", cls, text); th.scope = "col"; hr.append(th); });
    const thead = el("thead");
    thead.append(hr);
    const body = el("tbody");
    r.active.forEach((p, pi) => {
      const tr = el("tr");
      const s = r.stock[pi];
      tr.append(el("td", null, nameOf(p, p.i)), el("td", "num", units(p.daily)), el("td", "num", minutes(r.pitches[pi] / 60)), el("td", "num", int.format(containers(p.daily, p.packout).length)),
        el("td", "num", int.format(r.seq.filter((run) => run.index === pi).length)), el("td", "num", minutes((p.daily * p.cycle) / 60)), el("td", "num", s.batch !== null ? units(s.batch) : "–"), el("td", "num", units(s.levelled)));
      body.append(tr);
    });
    const tfoot = el("tfoot");
    const total = el("tr");
    total.append(el("td", null, tx("Total")), el("td", "num", units(r.totalDaily)), el("td"), el("td", "num", int.format(r.seq.reduce((s, run) => s + run.containers, 0))), el("td", "num", int.format(r.seq.length)), el("td", "num", minutes(r.runMin)), el("td", "num", r.batchStock !== null ? units(r.batchStock) : "–"), el("td", "num", units(r.levelStock)));
    const co = el("tr");
    const coLabel = el("td", null, tx("Changeovers per day"));
    coLabel.colSpan = 6;
    co.append(coLabel, el("td", "num", r.batch ? `${num(r.batch.perDay, 1)} · ${minutes(r.batch.minutesPerDay)}` : "–"), el("td", "num", `${r.switches.count} · ${minutes(r.switches.minutes)}`));
    tfoot.append(total, co);
    table.append(thead, body, tfoot);
    wrap.append(table);
    compare.append(wrap, el("p", "dl-panel-note", data.text.stockNote));
    panels.push(compare);

    // 4. The runs of the day, with clock times.
    const seqPanel = panel(tx("The day's sequence"), tx("Each run with its containers and clock times from the shift start; breaks are taken in the middle of each shift."));
    const swrap = el("div", "dl-table-wrap");
    swrap.tabIndex = 0;
    const stable = el("table", "dl-table hj-seq");
    const shr = el("tr");
    [[tx("No."), "num"], [tx("From")], [tx("To")], [tx("Product")], [tx("Containers"), "num"], [tx("Units"), "num"], [tx("Changeover before"), "num"]].forEach(([text, cls]) => { const th = el("th", cls, text); th.scope = "col"; shr.append(th); });
    const sthead = el("thead");
    sthead.append(shr);
    const sbody = el("tbody");
    const switchAt = new Set(r.switches.at);
    r.seq.slice(0, SCREEN_RUNS).forEach((run, ri) => {
      const p = r.active[run.index];
      const tr = el("tr");
      tr.append(el("td", "num", String(run.no)), el("td", null, hhmm(clockAt(run.start, shift))), el("td", null, hhmm(clockAt(run.end, shift, true))), el("td", null, nameOf(p, p.i)), el("td", "num", int.format(run.containers)), el("td", "num", units(run.units)), el("td", "num", switchAt.has(ri) ? minutes(p.changeover) : "–"));
      sbody.append(tr);
    });
    stable.append(sthead, sbody);
    swrap.append(stable);
    seqPanel.append(swrap);
    if (r.seq.length > SCREEN_RUNS) seqPanel.append(el("p", "dl-panel-note", tx("The first {n} of {total} runs. The CSV and the Excel file hold every run and container.", { n: int.format(SCREEN_RUNS), total: int.format(r.seq.length) })));
    panels.push(seqPanel);

    // 5. How the numbers are worked out, and where to go next.
    const how = panel(tx("How it is calculated"));
    const formulas = el("ul", "hj-formulas");
    [
      tx("Available time per day = shifts × (shift length − planned breaks) = {t}.", { t: minutes(r.availableMin) }),
      tx("Takt time = available time ÷ demand per day = {a} s ÷ {d} = {t} s.", { a: int.format(Math.round(r.availableSec)), d: units(r.totalDaily), t: num(r.takt, 2) }),
      tx("Pitch = takt time × pack-out quantity: the time one container represents."),
      tx("Utilisation = Σ (demand per day × cycle time) ÷ available time = {r} ÷ {a} = {p}.", { r: minutes(r.runMin), a: minutes(r.availableMin), p: pct(r.load.share, 1) }),
      r.epei !== null ? tx("EPEI = Σ changeover times ÷ (available time − run time) = {c} ÷ {f} = {e}.", { c: minutes(r.changeoverSum), f: minutes(r.freeMin), e: days(r.epei) }) : tx("EPEI = Σ changeover times ÷ (available time − run time): not possible while the run time takes all the available time."),
      tx("Sequence: each run belongs at (k + ½) ÷ runs of the day; sorting the runs by that position (largest remainder) spreads every product evenly. Runs at the same position follow goal chasing on the work content: next comes the run that keeps the work closest to the day's average rate, so long and short cycle times alternate."),
    ].forEach((line) => formulas.append(el("li", null, line)));
    how.append(formulas, el("p", "dl-panel-note", data.text.sources));
    const next = el("p", "dl-panel-note hj-next");
    const link = (href, text) => { const a = el("a", "inline-link", text); a.href = new URL(href, window.location.href).href; return a; };
    next.append(tx("Next:"), " ", link("../smed/", tx("SMED Changeover")), ` ${tx("to cut the changeovers")} · `, link("../shift-capacity/", tx("Shift Capacity")), ` ${tx("to staff the shifts for this load")} · `, link("../standard-work/", tx("Standard Work")), ` ${tx("to fix the work at takt")}.`);
    how.append(next);
    panels.push(how);

    resultLayout(results, { head: top, stats, notes, focus, actions, panels });
  };

  const renderAll = () => {
    showLine();
    renderProducts();
    renderResults();
  };
  renderAll();
})();
