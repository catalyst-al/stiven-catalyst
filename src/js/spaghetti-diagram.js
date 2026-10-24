// Spaghetti Diagram: the walking paths of one job drawn over the floor plan, measured in metres, before and after a
// change. The plan is a plain grid in metres or a photo of the floor plan (kept on this device by MediaStore, never in
// the Work Backup file), with a scale set from two points and the real distance between them. Each walk is a list of
// points in the plan's own units; a point can be a stop with a name. The arithmetic lives in window.SpaghettiMath so
// the tests can call it.
(() => {
  const kit = window.ToolKit || {};
  const parseNumber = kit.parseNumber || ((value) => Number(String(value ?? "").replace(",", ".")));
  const MAX_WALKS = 12;
  const MAX_POINTS = 400;
  const SPEED = 1.2;
  const GRID = { w: 20, h: 14 };
  const EMBED_LIMIT = 1.5 * 1024 * 1024;
  const TOOL = "spaghetti-diagram";

  // Arithmetic -------------------------------------------------------------------------------------------------------
  const numberOf = (value, fallback) => {
    const x = typeof value === "number" ? value : String(value ?? "").trim() === "" ? NaN : parseNumber(value);
    return Number.isFinite(x) ? x : fallback;
  };
  const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
  const round = (value, digits = 2) => Math.round(value * 10 ** digits) / 10 ** digits;
  const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  // Metres per plan unit, from two points on the plan and the real distance between them.
  const scaleFrom = (a, b, metres) => {
    const d = a && b ? distance(a, b) : 0;
    const m = numberOf(metres, 0);
    return d > 0 && m > 0 ? m / d : null;
  };
  // The plan's size in its own units: metres for the grid, pixels for an image.
  const extent = (plan = {}) => (plan.kind === "image" && plan.imageW > 0 && plan.imageH > 0
    ? { w: plan.imageW, h: plan.imageH }
    : { w: clamp(numberOf(plan.gridW, GRID.w), 2, 500), h: clamp(numberOf(plan.gridH, GRID.h), 2, 500) });
  // The grid is drawn in metres; an image needs its scale set before a path has a length.
  const planScale = (plan = {}) => {
    if (plan.kind !== "image") return 1;
    const cal = plan.cal;
    return cal ? scaleFrom({ x: cal.ax, y: cal.ay }, { x: cal.bx, y: cal.by }, cal.metres) : null;
  };
  const pathUnits = (points = []) => points.reduce((sum, point, i) => (i ? sum + distance(points[i - 1], point) : 0), 0);
  const pathLength = (points, scale) => (scale > 0 ? pathUnits(points) * scale : null);
  const cyclesOf = (walk) => Math.max(1, Math.round(numberOf(walk?.cycles, 1)));
  const speedOf = (value) => { const v = numberOf(value, SPEED); return v > 0 ? v : SPEED; };
  const walkingSeconds = (metres, speed = SPEED) => (metres >= 0 && speed > 0 ? metres / speed : null);
  const stopKey = (label) => String(label ?? "").trim().toLowerCase();

  // Visits per stop: every point that carries a stop's name is one visit to it, the first point of a walk included.
  const visits = (walks = []) => {
    const map = new Map();
    walks.forEach((walk) => (walk.points || []).forEach((point) => {
      const key = stopKey(point.stop);
      if (!key) return;
      const item = map.get(key) || { key, label: String(point.stop).trim(), visits: 0, x: point.x, y: point.y };
      item.visits += 1;
      map.set(key, item);
    }));
    // Equal visits keep the order the stops were first walked to, in every language.
    return [...map.values()].sort((a, b) => b.visits - a.visits);
  };
  // Where the work happens: the stop most walks start from; a tie goes to the stop visited more.
  const baseStop = (walks = []) => {
    const all = visits(walks);
    const starts = new Map();
    walks.forEach((walk) => { const key = stopKey(walk.points?.[0]?.stop); if (key) starts.set(key, (starts.get(key) || 0) + 1); });
    if (!starts.size) return null;
    const seen = (key) => all.find((stop) => stop.key === key)?.visits || 0;
    const [key] = [...starts.entries()].sort((a, b) => b[1] - a[1] || seen(b[0]) - seen(a[0]))[0];
    return all.find((stop) => stop.key === key) || null;
  };
  // The legs of the walks: each walk cut at its stops. A to B and B to A are the same leg walked again; a walk without
  // stops is one leg of its own.
  const legsOf = (walks = [], scale = 1) => {
    const map = new Map();
    walks.forEach((walk, w) => {
      const points = walk.points || [];
      let from = 0;
      for (let i = 1; i < points.length; i++) {
        if (!stopKey(points[i].stop) && i < points.length - 1) continue;
        const a = points[from], b = points[i];
        const units = pathUnits(points.slice(from, i + 1));
        from = i;
        if (!(units > 0)) continue;
        const ends = [stopKey(a.stop), stopKey(b.stop)];
        const key = ends[0] || ends[1] ? [...ends].sort().join("|") : `#${w}:${i}`;
        const item = map.get(key) || { key, from: String(a.stop || "").trim(), to: String(b.stop || "").trim(), count: 0, units: 0 };
        item.count += 1;
        item.units += units;
        map.set(key, item);
      }
    });
    return [...map.values()]
      .map((leg) => ({ ...leg, metres: scale > 0 ? leg.units * scale : null, each: scale > 0 ? (leg.units * scale) / leg.count : null }))
      .sort((a, b) => b.units - a.units || b.count - a.count);
  };
  // The leg to attack first: of the legs walked more than once, the one with the most metres in all.
  const longestLeg = (legs = []) => {
    const repeated = legs.filter((leg) => leg.count >= 2);
    const leg = repeated[0] || legs[0];
    return leg ? { ...leg, repeated: leg.count >= 2 } : null;
  };

  // The size of a heat square in metres: a round number that gives about 16 to 24 squares across the plan.
  const heatCell = (widthMetres) => {
    const target = Math.max(0.01, widthMetres / 24);
    return [0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100].find((step) => step >= target) || Math.ceil(target);
  };
  // The heat grid: the plan cut into squares, each holding the metres walked inside it. Every segment is cut exactly at
  // the square borders it crosses. w, h and cell in plan units; the values in metres through scale.
  const heatGrid = (walks = [], { w, h, cell, scale = 1 } = {}) => {
    const size = cell > 0 ? cell : Math.max(w, h) / 20;
    const cols = Math.max(1, Math.ceil(w / size - 1e-9));
    const rows = Math.max(1, Math.ceil(h / size - 1e-9));
    const cells = new Array(cols * rows).fill(0);
    const index = (value, n) => clamp(Math.floor(value / size), 0, n - 1);
    walks.forEach((walk) => {
      const points = walk.points || [];
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        const length = distance(a, b);
        if (!(length > 0)) continue;
        const cuts = [0, 1];
        const cross = (from, to) => {
          if (from === to) return;
          const hi = Math.max(from, to);
          for (let k = Math.floor(Math.min(from, to) / size) + 1; k * size < hi; k++) cuts.push((k * size - from) / (to - from));
        };
        cross(a.x, b.x);
        cross(a.y, b.y);
        cuts.sort((p, q) => p - q);
        for (let c = 1; c < cuts.length; c++) {
          const t0 = cuts[c - 1], t1 = cuts[c];
          if (t1 - t0 <= 1e-12) continue;
          const t = (t0 + t1) / 2;
          cells[index(a.y + (b.y - a.y) * t, rows) * cols + index(a.x + (b.x - a.x) * t, cols)] += length * (t1 - t0) * scale;
        }
      }
    });
    const hottest = cells.map((value, i) => ({ col: i % cols, row: Math.floor(i / cols), value })).filter((item) => item.value > 0).sort((p, q) => q.value - p.value);
    return { cols, rows, cell: size, cells, max: hottest[0]?.value || 0, total: cells.reduce((sum, value) => sum + value, 0), hottest: hottest.slice(0, 5) };
  };

  // The stop to bring closer: the most visited one away from where the work happens; with equal visits, the one whose
  // legs carry more metres, since moving it saves more.
  const topStopOf = (stops, base, legs) => {
    const metresAt = (key) => legs.filter((leg) => leg.key.split("|").includes(key)).reduce((sum, leg) => sum + leg.units, 0);
    const away = stops.filter((stop) => !base || stop.key !== base.key);
    return away.sort((a, b) => b.visits - a.visits || metresAt(b.key) - metresAt(a.key))[0] || null;
  };
  // One study as numbers: per walk, per cycle and per shift, the stops and the legs.
  const analyse = (study = {}, { plan = {}, speed, shift } = {}) => {
    const scale = planScale(plan);
    const v = speedOf(speed);
    const perShiftCycles = Math.max(0, numberOf(shift, 0));
    const drawn = (study.walks || []).filter((walk) => (walk.points || []).length >= 2);
    const walks = (study.walks || []).map((walk, index) => {
      const units = pathUnits(walk.points || []);
      const metres = scale ? units * scale : null;
      const cycles = cyclesOf(walk);
      return { index, id: walk.id, name: walk.name, color: walk.color, points: (walk.points || []).length, units, metres, cycles, perCycle: metres !== null ? metres / cycles : null };
    });
    const counted = walks.filter((walk) => walk.points >= 2);
    const cycles = counted.reduce((sum, walk) => sum + walk.cycles, 0);
    const metres = scale ? counted.reduce((sum, walk) => sum + walk.metres, 0) : null;
    const perCycle = metres !== null && cycles > 0 ? metres / cycles : null;
    const perShift = perCycle !== null && perShiftCycles > 0 ? perCycle * perShiftCycles : null;
    const stops = visits(drawn).map((stop) => ({ ...stop, perCycle: cycles > 0 ? stop.visits / cycles : null }));
    const base = baseStop(drawn);
    const legs = legsOf(drawn, scale);
    return {
      scale, speed: v, shift: perShiftCycles, walks, drawn: counted.length, metres, cycles, perCycle,
      secondsPerCycle: perCycle !== null ? walkingSeconds(perCycle, v) : null,
      perShift, minutesPerShift: perShift !== null ? walkingSeconds(perShift, v) / 60 : null,
      stops, base, topStop: topStopOf(stops, base, legs), legs, longest: longestLeg(legs),
    };
  };
  // After the change against the current study: the metres and the time a cycle and a shift no longer walk.
  const compare = (now, next) => {
    if (!now || !next || now.perCycle === null || next.perCycle === null) return null;
    const perCycle = now.perCycle - next.perCycle;
    const metresPerShift = now.shift > 0 ? perCycle * now.shift : null;
    return {
      perCycle, share: now.perCycle > 0 ? perCycle / now.perCycle : null, secondsPerCycle: perCycle / now.speed,
      metresPerShift, minutesPerShift: metresPerShift !== null ? metresPerShift / now.speed / 60 : null,
    };
  };

  // Saved and example data, rebuilt field by field so nothing damaged breaks the page.
  const field = (value) => (typeof value === "number" && Number.isFinite(value) ? String(value) : typeof value === "string" ? value.slice(0, 16) : "");
  const text = (value, max) => (typeof value === "string" ? value.slice(0, max) : "");
  const coordinate = (value) => (typeof value === "number" && Number.isFinite(value) ? round(value, 3) : null);
  const cleanPoint = (point) => {
    const source = Array.isArray(point) ? { x: point[0], y: point[1], stop: point[2] } : point && typeof point === "object" ? point : {};
    const x = coordinate(source.x), y = coordinate(source.y);
    return x === null || y === null ? null : { x, y, stop: text(source.stop, 60).trim() };
  };
  let idCount = 0;
  const newId = () => `w${Date.now().toString(36)}${(idCount++).toString(36)}`;
  const cleanWalk = (walk, index = 0) => {
    const source = walk && typeof walk === "object" ? walk : {};
    return {
      id: typeof source.id === "string" && source.id ? source.id.slice(0, 40) : newId(),
      name: text(source.name, 80),
      cycles: field(source.cycles),
      color: Number.isInteger(source.color) && source.color >= 0 ? source.color % 12 : index % 12,
      points: (Array.isArray(source.points) ? source.points : []).map(cleanPoint).filter(Boolean).slice(0, MAX_POINTS),
    };
  };
  const cleanStudy = (study) => {
    const source = study && typeof study === "object" && !Array.isArray(study) ? study : {};
    return { walks: (Array.isArray(source.walks) ? source.walks : []).filter((w) => w && typeof w === "object").slice(0, MAX_WALKS).map(cleanWalk), change: text(source.change, 240) };
  };
  const cleanPlan = (plan) => {
    const source = plan && typeof plan === "object" && !Array.isArray(plan) ? plan : {};
    const image = source.kind === "image" && typeof source.imageId === "string" && source.imageId && source.imageW > 0 && source.imageH > 0;
    const cal = source.cal && typeof source.cal === "object" && ["ax", "ay", "bx", "by"].every((name) => Number.isFinite(source.cal[name]))
      ? { ax: source.cal.ax, ay: source.cal.ay, bx: source.cal.bx, by: source.cal.by, metres: field(source.cal.metres) } : null;
    return {
      kind: image ? "image" : "grid",
      gridW: field(source.gridW) || String(GRID.w), gridH: field(source.gridH) || String(GRID.h),
      imageId: image ? source.imageId.slice(0, 80) : "", imageW: image ? Number(source.imageW) : 0, imageH: image ? Number(source.imageH) : 0,
      cal: image ? cal : null,
    };
  };
  const fromExample = (example = {}) => ({
    title: text(example.title, 120), shift: field(example.shift), speed: field(example.speed),
    plan: cleanPlan({ kind: "grid", gridW: example.gridW, gridH: example.gridH }),
    current: cleanStudy({ walks: example.current }), after: cleanStudy({ walks: example.after, change: example.change }), view: "current", active: "",
  });
  // Points kept where they are on the plan when the plan changes size: each in the same share of its width and height.
  const rescale = (studies, from, to) => studies.forEach((study) => study.walks.forEach((walk) => {
    walk.points = walk.points.map((point) => ({ ...point, x: round((point.x / from.w) * to.w, 3), y: round((point.y / from.h) * to.h, 3) }));
  }));
  // The stop nearest to a point within a radius (plan units), so a tap near a stop counts as a visit to it.
  const snapStop = (walks, point, radius) => {
    let best = null;
    walks.forEach((walk) => walk.points.forEach((p) => {
      if (!stopKey(p.stop)) return;
      const d = distance(p, point);
      if (d <= radius && (!best || d < best.d)) best = { d, point: p };
    }));
    return best ? { x: best.point.x, y: best.point.y, stop: best.point.stop } : null;
  };

  window.SpaghettiMath = { SPEED, scaleFrom, extent, planScale, pathUnits, pathLength, cyclesOf, walkingSeconds, stopKey, visits, baseStop, topStopOf, legsOf, longestLeg, heatCell, heatGrid, analyse, compare, cleanPoint, cleanWalk, cleanStudy, cleanPlan, fromExample, rescale, snapStop };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-spaghetti-diagram]");
  const dataEl = document.getElementById("spaghetti-diagram-data");
  if (!root || !dataEl || !window.ToolKit || !window.ChartKit) return;
  const { tx, num, int, pct, el, write, loadState, str, firstVisit, panel, stat, focusCard, resultActions, resultLayout, renderOnPause, flash, undoNote, downloadCsv, downloadXlsx } = window.ToolKit;
  const CK = window.ChartKit;
  const media = window.MediaStore && window.MediaStore.supported() ? window.MediaStore : null;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;

  const results = document.querySelector("[data-results]");
  const settings = [...root.querySelectorAll("[data-setting]")];
  const gridFields = root.querySelector("[data-grid-fields]");
  const fileInput = root.querySelector("[data-file]");
  const useGrid = root.querySelector("[data-use-grid]");
  const planStatus = root.querySelector("[data-plan-status]");
  const scaleTools = root.querySelector("[data-scale-tools]");
  const scaleGrid = root.querySelector("[data-scale-grid]");
  const scaleStart = root.querySelector("[data-scale-start]");
  const scaleMetres = root.querySelector("[data-scale-metres]");
  const scaleSet = root.querySelector("[data-scale-set]");
  const scaleStatus = root.querySelector("[data-scale-status]");
  const studyButtons = [...root.querySelectorAll("[data-study]")];
  const studyNote = root.querySelector("[data-study-note]");
  const changeField = root.querySelector("[data-change-field]");
  const changeInput = root.querySelector("[data-change]");
  const copyCurrent = root.querySelector("[data-copy-current]");
  const canvas = root.querySelector("[data-canvas]");
  const stopInput = root.querySelector("[data-stop-label]");
  const stopList = root.querySelector("[data-stop-list]");
  const drawStatus = root.querySelector("[data-draw-status]");
  const walksBox = root.querySelector("[data-walks]");
  const emptyNote = root.querySelector("[data-empty]");
  const pointsBox = root.querySelector("[data-points]");
  const pointsTitle = root.querySelector("[data-points-title]");
  const addPoint = root.querySelector("[data-add-point]");

  const defaults = { title: "", shift: "", speed: "", plan: {}, current: {}, after: {}, view: "current", active: "", example: false };
  const state = loadState(KEY, defaults);
  state.title = str(state.title).slice(0, 120);
  state.shift = field(state.shift);
  state.speed = field(state.speed);
  state.plan = cleanPlan(state.plan);
  state.current = cleanStudy(state.current);
  state.after = cleanStudy(state.after);
  if (!["current", "after"].includes(state.view)) state.view = "current";
  const loadExample = () => { Object.assign(state, fromExample(data.example), { example: true }); };
  // A first visit opens on the example, so the diagram is visible at once; the note above it says so.
  if (!state.current.walks.length && !state.after.walks.length && firstVisit(KEY)) loadExample();
  const save = () => write(KEY, state);
  const own = () => { state.example = false; };
  const study = () => state[state.view];
  const activeWalk = () => study().walks.find((walk) => walk.id === state.active) || null;
  const scale = () => planScale(state.plan);
  const studyLabel = (view) => (view === "after" ? tx("After the change") : tx("Current"));

  // Formats: metres with one decimal under 100, whole metres above; minutes the same.
  const metres = (value) => (value === null || !Number.isFinite(value) ? "–" : `${num(value, Math.abs(value) < 100 ? 1 : 0)} m`);
  const minutes = (value) => (value === null || !Number.isFinite(value) ? "–" : tx("{n} min", { n: num(value, Math.abs(value) < 10 ? 1 : 0) }));
  const seconds = (value) => (value === null || !Number.isFinite(value) ? "–" : `${num(value, value < 10 ? 1 : 0)} s`);
  const walkName = (walk, i) => walk.name.trim() || tx("Walk {n}", { n: i + 1 });
  const colorOf = (walk) => CK.SERIES[walk.color % CK.SERIES.length];
  const legName = (leg) => `${leg.from || tx("start of the walk")} ↔ ${leg.to || tx("end of the walk")}`;
  const resultOf = (view) => analyse(state[view], { plan: state.plan, speed: state.speed, shift: state.shift });

  // The plan image: an object URL for the drawing, a data URL for the result (so the exported chart carries it).
  let planUrl = "";
  let planDataUrl = "";
  let planMissing = false;
  let planTooLarge = false;
  const readDataUrl = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
  const loadPlanImage = async () => {
    if (planUrl) URL.revokeObjectURL(planUrl);
    planUrl = "";
    planDataUrl = "";
    planMissing = false;
    planTooLarge = false;
    if (state.plan.kind !== "image") return;
    try {
      const record = media ? await media.get(state.plan.imageId) : null;
      if (!record || !record.blob) { planMissing = true; return; }
      planUrl = URL.createObjectURL(record.blob);
      if (record.blob.size < EMBED_LIMIT) planDataUrl = await readDataUrl(record.blob);
      else planTooLarge = true;
    } catch {
      planMissing = true;
    }
  };

  // Example note above the results, with one tap to clear the example.
  const note = el("div", "dl-example-note");
  note.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  const clearAll = () => {
    const keep = state.plan;
    Object.assign(state, defaults, { plan: keep.kind === "image" && !state.example ? keep : cleanPlan({}), current: cleanStudy({}), after: cleanStudy({}) });
    save();
    loadPlanImage().finally(renderAll);
  };
  clearExample.addEventListener("click", clearAll);
  note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(note);

  // Settings: the job, cycles per shift, walking speed and the size of the grid ------------------------------------------
  settings.forEach((input) => input.addEventListener("input", () => {
    if (input.name === "gridW" || input.name === "gridH") state.plan[input.name] = input.value;
    else state[input.name] = input.value;
    own();
    save();
    if (input.name === "gridW" || input.name === "gridH") renderCanvas();
    renderWalks();
    renderSoon();
  }));

  // The plan --------------------------------------------------------------------------------------------------------------
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files && fileInput.files[0];
    fileInput.value = "";
    if (!file) return;
    if (!media) { flash(planStatus, tx("This browser cannot keep a plan image. Use the plain grid.")); return; }
    planStatus.textContent = tx("Saving the plan on this device…");
    try {
      const record = await media.add(file, { tool: TOOL, ref: "plan" });
      const old = state.plan.kind === "image" ? state.plan.imageId : "";
      // The example belongs to the grid; a real plan starts a real study.
      if (state.example) Object.assign(state, { current: cleanStudy({}), after: cleanStudy({}), active: "", example: false });
      rescale([state.current, state.after], extent(state.plan), { w: record.width, h: record.height });
      Object.assign(state.plan, { kind: "image", imageId: record.id, imageW: record.width, imageH: record.height, cal: null });
      own();
      save();
      if (old && old !== record.id) media.remove(old).catch(() => {});
      await loadPlanImage();
      startScale();
      renderAll();
      planStatus.textContent = tx("Plan saved on this device. Now set the scale below.");
    } catch {
      flash(planStatus, tx("This image could not be read. Try a JPEG or PNG."));
    }
  });
  useGrid.addEventListener("click", () => {
    if (state.plan.kind !== "image") return;
    if (!window.confirm(tx("Use the plain grid instead of the plan image? The paths keep their place on the plan and the image is removed from this device."))) return;
    const old = state.plan.imageId;
    const from = extent(state.plan);
    Object.assign(state.plan, { kind: "grid", imageId: "", imageW: 0, imageH: 0, cal: null });
    rescale([state.current, state.after], from, extent(state.plan));
    own();
    save();
    if (media && old) media.remove(old).catch(() => {});
    loadPlanImage().finally(renderAll);
  });

  // The scale: two taps on the plan and the real distance between them ----------------------------------------------------
  let mode = "draw";
  let scalePick = [];
  const startScale = () => {
    mode = "scale";
    scalePick = [];
    scaleStatus.textContent = tx("Tap the first point on the plan.");
    renderScale();
  };
  scaleStart.addEventListener("click", () => {
    if (mode === "scale") { mode = "draw"; scalePick = []; scaleStatus.textContent = ""; renderScale(); renderCanvas(); return; }
    startScale();
    canvas.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  scaleSet.addEventListener("click", () => {
    const m = numberOf(scaleMetres.value, 0);
    if (scalePick.length < 2) { flash(scaleStatus, tx("Tap two points on the plan first.")); return; }
    if (!(m > 0) || !scaleFrom(scalePick[0], scalePick[1], m)) { flash(scaleStatus, tx("Type the real distance in metres, more than 0.")); scaleMetres.focus(); return; }
    state.plan.cal = { ax: scalePick[0].x, ay: scalePick[0].y, bx: scalePick[1].x, by: scalePick[1].y, metres: scaleMetres.value };
    mode = "draw";
    scalePick = [];
    own();
    save();
    renderAll();
    scaleStatus.textContent = scaleText();
  });
  const scaleText = () => {
    const s = scale();
    if (state.plan.kind !== "image") return "";
    if (!s) return tx("No scale yet: the paths have no metres until it is set.");
    const { w } = extent(state.plan);
    return tx("Scale set: the plan is {w} wide, {d} between the two points.", { w: metres(w * s), d: metres(numberOf(state.plan.cal.metres, 0)) });
  };
  const renderScale = () => {
    const image = state.plan.kind === "image";
    scaleTools.hidden = !image;
    scaleGrid.hidden = image;
    gridFields.hidden = image;
    useGrid.hidden = !image;
    scaleStart.textContent = mode === "scale" ? tx("Cancel") : tx("Tap two points for the scale");
    scaleStart.setAttribute("aria-pressed", String(mode === "scale"));
    scaleSet.disabled = scalePick.length < 2;
    if (image && state.plan.cal && !scaleMetres.value) scaleMetres.value = state.plan.cal.metres;
  };

  // Studies: the current one and the one after the change ---------------------------------------------------------------
  const renderStudy = () => {
    studyButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.study === state.view)));
    changeField.hidden = state.view !== "after";
    changeInput.value = state.after.change;
    copyCurrent.hidden = !(state.view === "after" && !state.after.walks.length && state.current.walks.length);
  };
  studyButtons.forEach((button) => button.addEventListener("click", () => {
    state.view = button.dataset.study;
    state.active = "";
    save();
    flash(studyNote, tx("Now drawing: {study}.", { study: studyLabel(state.view) }));
    renderAll();
  }));
  changeInput.addEventListener("input", () => { state.after.change = changeInput.value.slice(0, 240); own(); save(); renderSoon(); });
  copyCurrent.addEventListener("click", () => {
    state.after.walks = JSON.parse(JSON.stringify(state.current.walks)).map((walk) => ({ ...walk, id: newId() }));
    state.active = "";
    own();
    save();
    renderAll();
    flash(drawStatus, tx("The current walks are copied. Move the points the change moves, or draw the walks again."));
  });

  // Walks -------------------------------------------------------------------------------------------------------------------
  const nextColor = (walks) => {
    const used = new Set(walks.map((walk) => walk.color));
    for (let c = 0; c < 12; c++) if (!used.has(c)) return c;
    return walks.length % 12;
  };
  const newWalk = () => {
    const walks = study().walks;
    if (walks.length >= MAX_WALKS) return null;
    const walk = cleanWalk({ name: "", cycles: "1", color: nextColor(walks), points: [] }, walks.length);
    walks.push(walk);
    state.active = walk.id;
    return walk;
  };
  const walkMeta = (walk) => {
    const length = pathLength(walk.points, scale());
    const count = walk.points.length === 1 ? tx("{n} point", { n: 1 }) : tx("{n} points", { n: int.format(walk.points.length) });
    return length === null ? count : `${metres(length)} · ${count}`;
  };
  const renderWalks = () => {
    const walks = study().walks;
    walksBox.replaceChildren();
    walks.forEach((walk, i) => {
      const row = el("div", "sp2-walk");
      if (walk.id === state.active) row.classList.add("is-active");
      const swatch = el("span", "sp2-swatch", String(i + 1));
      swatch.style.background = colorOf(walk);
      swatch.setAttribute("aria-hidden", "true");
      const nameId = `sp2-walk-${i}-name`;
      const nameLabel = el("label", "visually-hidden", tx("Name of walk {n}", { n: i + 1 }));
      nameLabel.htmlFor = nameId;
      const name = el("input", "sp2-in sp2-walk-name");
      Object.assign(name, { id: nameId, value: walk.name, placeholder: data.text.walkPlaceholder, autocomplete: "off" });
      Object.assign(name.dataset, { walk: walk.id, field: "name" });
      const cyclesId = `sp2-walk-${i}-cycles`;
      const cyclesLabel = el("label", "sp2-cycles-label", tx("Cycles"));
      cyclesLabel.htmlFor = cyclesId;
      const cycles = el("input", "sp2-in sp2-walk-cycles");
      Object.assign(cycles, { id: cyclesId, type: "number", min: "1", step: "1", value: walk.cycles, placeholder: "1" });
      cycles.inputMode = "numeric";
      Object.assign(cycles.dataset, { walk: walk.id, field: "cycles" });
      const meta = el("span", "sp2-walk-meta", walkMeta(walk));
      meta.dataset.meta = walk.id;
      const draw = el("button", "button-secondary sp2-walk-draw", walk.id === state.active ? tx("Drawing") : tx("Draw"));
      draw.type = "button";
      draw.setAttribute("aria-pressed", String(walk.id === state.active));
      draw.setAttribute("aria-label", tx("Draw walk {n}", { n: i + 1 }));
      Object.assign(draw.dataset, { act: "draw", walk: walk.id });
      const remove = el("button", "sp2-tool", "×");
      remove.type = "button";
      remove.setAttribute("aria-label", tx("Remove walk {n}", { n: i + 1 }));
      remove.title = remove.getAttribute("aria-label");
      Object.assign(remove.dataset, { act: "remove", walk: walk.id });
      const head = el("div", "sp2-walk-head");
      head.append(swatch, nameLabel, name, remove);
      const foot = el("div", "sp2-walk-foot");
      foot.append(cyclesLabel, cycles, meta, draw);
      row.append(head, foot);
      walksBox.append(row);
    });
    emptyNote.hidden = walks.length > 0;
    renderStops();
  };
  const renderMeta = () => study().walks.forEach((walk) => { const meta = walksBox.querySelector(`[data-meta="${walk.id}"]`); if (meta) meta.textContent = walkMeta(walk); });
  walksBox.addEventListener("input", (event) => {
    const { walk: id, field: name } = event.target.dataset;
    const walk = study().walks.find((item) => item.id === id);
    if (!walk || !name) return;
    walk[name] = event.target.value;
    own();
    save();
    if (name === "name") renderPointsTitle();
    renderSoon();
  });
  walksBox.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-act]");
    if (!button) return;
    const walks = study().walks;
    const i = walks.findIndex((walk) => walk.id === button.dataset.walk);
    if (i < 0) return;
    if (button.dataset.act === "draw") {
      state.active = state.active === walks[i].id ? "" : walks[i].id;
      save();
      renderDrawing({ table: true });
      walksBox.querySelector(`[data-act="draw"][data-walk="${walks[i].id}"]`)?.focus();
      if (state.active) flash(drawStatus, tx("Tap the plan to add points to {name}.", { name: walkName(walks[i], i) }));
      return;
    }
    const [removed] = walks.splice(i, 1);
    const label = walkName(removed, i);
    if (state.active === removed.id) state.active = "";
    own();
    save();
    renderDrawing({ table: true });
    (walksBox.querySelector(".sp2-walk-name") || root.querySelector("[data-new-walk]")).focus();
    undoNote(drawStatus, tx("Removed {name}.", { name: label }), () => {
      const target = study().walks;
      target.splice(Math.min(i, target.length), 0, removed);
      save();
      renderDrawing({ table: true });
    });
  });

  // The stops already placed, offered as names for the next stop.
  const renderStops = () => {
    const names = new Map();
    [...visits(state.current.walks), ...visits(state.after.walks)].forEach((stop) => { if (!names.has(stop.key)) names.set(stop.key, stop.label); });
    (data.stops || []).forEach((label) => { if (!names.has(stopKey(label))) names.set(stopKey(label), label); });
    stopList.replaceChildren(...[...names.values()].map((label) => { const option = el("option"); option.value = label; return option; }));
  };

  // Drawing: each tap is a point, so each tap adds a segment to the walk being drawn ----------------------------------------
  const addAt = (point, radius) => {
    if (mode === "scale") {
      scalePick.push(point);
      if (scalePick.length > 2) scalePick = [point];
      scaleStatus.textContent = scalePick.length === 1 ? tx("Now tap the second point.") : tx("Type the real distance between the two points, then press Set the scale.");
      renderScale();
      renderCanvas();
      if (scalePick.length === 2) scaleMetres.focus();
      return;
    }
    let walk = activeWalk();
    if (!walk) {
      walk = newWalk();
      if (!walk) { flash(drawStatus, tx("A study holds up to {n} walks.", { n: MAX_WALKS })); return; }
    }
    if (walk.points.length >= MAX_POINTS) { flash(drawStatus, tx("A walk holds up to {n} points.", { n: MAX_POINTS })); return; }
    const typed = stopInput.value.trim().slice(0, 60);
    const snapped = typed ? null : snapStop(study().walks, point, radius);
    const p = snapped || { x: round(point.x, 3), y: round(point.y, 3), stop: typed };
    walk.points.push(p);
    stopInput.value = "";
    own();
    save();
    renderDrawing({ table: true, list: walk.points.length === 1 });
    const i = study().walks.indexOf(walk);
    flash(drawStatus, p.stop
      ? tx("{name}: point {n} at {stop}, {length}.", { name: walkName(walk, i), n: walk.points.length, stop: p.stop, length: walkMeta(walk) })
      : tx("{name}: point {n}, {length}.", { name: walkName(walk, i), n: walk.points.length, length: walkMeta(walk) }));
  };
  let down = null;
  canvas.addEventListener("pointerdown", (event) => { if (event.button > 0) return; down = { x: event.clientX, y: event.clientY }; });
  canvas.addEventListener("pointercancel", () => { down = null; });
  canvas.addEventListener("pointerup", (event) => {
    if (!down) return;
    const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
    down = null;
    // A drag is a scroll on a phone, not a point.
    if (moved > 10) return;
    const svg = canvas.querySelector("svg");
    const box = svg ? svg.getBoundingClientRect() : null;
    if (!box || !box.width || !box.height) return;
    const { w, h } = extent(state.plan);
    addAt({ x: clamp(((event.clientX - box.left) / box.width) * w, 0, w), y: clamp(((event.clientY - box.top) / box.height) * h, 0, h) }, (16 / box.width) * w);
  });
  root.querySelector("[data-undo]").addEventListener("click", () => {
    const walk = activeWalk() || study().walks.at(-1);
    if (!walk || !walk.points.length) { flash(drawStatus, tx("No point to undo.")); return; }
    walk.points.pop();
    state.active = walk.id;
    own();
    save();
    renderDrawing({ table: true, list: true });
    flash(drawStatus, tx("Last point removed: {length}.", { length: walkMeta(walk) }));
  });
  root.querySelector("[data-finish]").addEventListener("click", () => {
    const walk = activeWalk();
    if (!walk) { flash(drawStatus, tx("No walk is being drawn. Tap the plan to start one.")); return; }
    const i = study().walks.indexOf(walk);
    state.active = "";
    save();
    renderDrawing({ table: true, list: true });
    flash(drawStatus, tx("{name} finished: {length}. The next tap starts a new walk.", { name: walkName(walk, i), length: walkMeta(walk) }));
  });
  root.querySelector("[data-new-walk]").addEventListener("click", () => {
    const walk = newWalk();
    if (!walk) { flash(drawStatus, tx("A study holds up to {n} walks.", { n: MAX_WALKS })); return; }
    own();
    save();
    renderDrawing({ table: true, list: true });
    walksBox.querySelector(`[data-walk="${walk.id}"][data-field="name"]`)?.focus();
  });
  root.querySelector("[data-example]").addEventListener("click", () => {
    const keepImage = state.plan.kind === "image" ? state.plan.imageId : "";
    loadExample();
    if (media && keepImage) media.remove(keepImage).catch(() => {});
    save();
    loadPlanImage().finally(() => {
      renderAll();
      results.scrollIntoView({ behavior: "smooth", block: "start" });
      results.focus({ preventScroll: true });
    });
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.current.walks.length && !state.after.walks.length) return;
    if (!window.confirm(tx("Clear both studies, current and after the change? The plan stays."))) return;
    clearAll();
  });

  // The points of the walk being drawn as a table: the keyboard way to draw, and to correct a tap -------------------------
  const unit = () => (scale() ? "m" : "px");
  const toShown = (value) => { const s = scale(); return s ? round(value * s, 2) : round(value, 1); };
  const fromShown = (value) => { const s = scale(); return s ? value / s : value; };
  const renderPointsTitle = () => {
    const walk = activeWalk();
    const i = walk ? study().walks.indexOf(walk) : -1;
    pointsTitle.textContent = walk ? tx("Points of {name}", { name: walkName(walk, i) }) : tx("Choose a walk with Draw to see its points.");
  };
  const renderPoints = () => {
    const walk = activeWalk();
    renderPointsTitle();
    pointsBox.replaceChildren();
    addPoint.hidden = !walk;
    if (!walk) return;
    const wrap = el("div", "dl-table-wrap");
    const table = el("table", "dl-table sp2-points");
    const thead = el("thead");
    const hr = el("tr");
    [["#", null], [`x (${unit()})`, "num"], [`y (${unit()})`, "num"], [tx("Stop name"), null], ["", null]].forEach(([label, cls]) => { const th = el("th", cls, label); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const tbody = el("tbody");
    walk.points.forEach((point, i) => {
      const tr = el("tr");
      tr.append(el("td", "num", String(i + 1)));
      [["x", tx("x of point {n}", { n: i + 1 })], ["y", tx("y of point {n}", { n: i + 1 })]].forEach(([name, label]) => {
        const input = el("input", "sp2-in sp2-num");
        Object.assign(input, { type: "number", step: "any", value: String(toShown(point[name])) });
        input.inputMode = "decimal";
        input.setAttribute("aria-label", label);
        Object.assign(input.dataset, { i, field: name });
        const td = el("td", "num");
        td.append(input);
        tr.append(td);
      });
      const stop = el("input", "sp2-in");
      Object.assign(stop, { value: point.stop, autocomplete: "off" });
      stop.setAttribute("list", "sp2-stops");
      stop.setAttribute("aria-label", tx("Stop at point {n}", { n: i + 1 }));
      Object.assign(stop.dataset, { i, field: "stop" });
      const stopCell = el("td");
      stopCell.append(stop);
      const remove = el("button", "sp2-tool", "×");
      remove.type = "button";
      remove.setAttribute("aria-label", tx("Remove point {n}", { n: i + 1 }));
      remove.dataset.removePoint = String(i);
      const removeCell = el("td");
      removeCell.append(remove);
      tr.append(stopCell, removeCell);
      tbody.append(tr);
    });
    table.append(thead, tbody);
    wrap.append(table);
    pointsBox.append(wrap);
  };
  // Typing changes the point without redrawing the table, so the cursor stays where it is.
  pointsBox.addEventListener("input", (event) => {
    const walk = activeWalk();
    const { i, field: name } = event.target.dataset;
    const point = walk?.points[Number(i)];
    if (!point || !name) return;
    if (name === "stop") point.stop = event.target.value.slice(0, 60);
    else {
      const value = numberOf(event.target.value, NaN);
      if (!Number.isFinite(value)) return;
      const { w, h } = extent(state.plan);
      point[name] = round(clamp(fromShown(value), 0, name === "x" ? w : h), 3);
    }
    own();
    save();
    renderCanvas();
    renderMeta();
    renderSoon();
  });
  pointsBox.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-point]");
    const walk = activeWalk();
    if (!button || !walk) return;
    const i = Number(button.dataset.removePoint);
    walk.points.splice(i, 1);
    own();
    save();
    renderDrawing({ table: true });
    (pointsBox.querySelector(`[data-remove-point="${Math.min(i, walk.points.length - 1)}"]`) || addPoint).focus();
  });
  addPoint.addEventListener("click", () => {
    const walk = activeWalk();
    if (!walk || walk.points.length >= MAX_POINTS) return;
    const { w, h } = extent(state.plan);
    const last = walk.points.at(-1);
    walk.points.push(last ? { x: last.x, y: last.y, stop: "" } : { x: round(w / 2, 3), y: round(h / 2, 3), stop: "" });
    own();
    save();
    renderDrawing({ table: true, list: walk.points.length === 1 });
    pointsBox.querySelector(`[data-field="x"][data-i="${walk.points.length - 1}"]`)?.focus();
  });

  // The plan with its paths as an SVG: for the drawing on the page and for the result -------------------------------------
  const S = (tag, attrs, content) => CK.svgEl(tag, attrs, content);
  const FONT = "Inter, Segoe UI, Roboto, Arial, sans-serif";
  const VW = 800;
  const halo = { "paint-order": "stroke", stroke: CK.C.paper, "stroke-width": 4, "stroke-linejoin": "round" };
  const niceBar = (widthMetres) => [1, 2, 5, 10, 20, 50, 100, 200].find((m) => m >= widthMetres / 6) || 500;
  const drawPlan = (walks, { live = false, heat = null, title = "" } = {}) => {
    const C = CK.C;
    const { w, h } = extent(state.plan);
    const k = VW / w;
    const VH = Math.max(120, Math.round(h * k));
    const s = scale();
    const svg = S("svg", { viewBox: `0 0 ${VW} ${VH}`, role: "img", "aria-label": title, class: `ck-chart sp2-plan-svg${live ? " is-live" : ""}`, "font-family": FONT });
    svg.append(S("title", {}, title));
    // The background: the plan image, or a grid of round metres (the result of a large image uses the grid too).
    const href = live ? planUrl : planDataUrl;
    if (state.plan.kind === "image" && href) {
      svg.append(S("image", { href, x: 0, y: 0, width: VW, height: VH, preserveAspectRatio: "none" }));
    } else {
      svg.append(S("rect", { x: 0, y: 0, width: VW, height: VH, fill: C.paper }));
      const step = s ? heatCell(w * s) / s : w / 20;
      for (let x = step, n = 1; x < w - 1e-9; x += step, n++) svg.append(S("line", { x1: x * k, x2: x * k, y1: 0, y2: VH, stroke: C.grid, "stroke-width": n % 5 ? 1 : 2 }));
      for (let y = step, n = 1; y < h - 1e-9; y += step, n++) svg.append(S("line", { x1: 0, x2: VW, y1: y * k, y2: y * k, stroke: C.grid, "stroke-width": n % 5 ? 1 : 2 }));
      svg.append(S("rect", { x: 1, y: 1, width: VW - 2, height: VH - 2, fill: "none", stroke: C.muted, "stroke-width": 2 }));
      if (state.plan.kind === "image" && planMissing) svg.append(S("text", { x: VW / 2, y: VH / 2, "text-anchor": "middle", "font-size": 15, fill: C.muted }, tx("The plan image is not on this device. Upload it again or use the plain grid.")));
    }
    // The heat grid: the squares walked most are the darkest; a square with its metres on hover.
    if (heat && heat.max > 0) {
      const size = heat.cell * k;
      heat.cells.forEach((value, i) => {
        if (!(value > 0)) return;
        const col = i % heat.cols, row = Math.floor(i / heat.cols);
        const cell = S("rect", { x: col * size, y: row * size, width: Math.min(size, VW - col * size), height: Math.min(size, VH - row * size), fill: C.blue, "fill-opacity": (0.1 + 0.75 * (value / heat.max)).toFixed(2) });
        cell.setAttribute("data-tip", tx("{m} walked in this square", { m: metres(value) }));
        cell.classList.add("ck-hit");
        svg.append(cell);
      });
    }
    // The paths, one colour and one number per walk; the walk being drawn on top, the others quieter.
    const ordered = live ? [...walks.filter((walk) => walk.id !== state.active), ...walks.filter((walk) => walk.id === state.active)] : walks;
    ordered.forEach((walk) => {
      const i = walks.indexOf(walk);
      if (!walk.points.length) return;
      const color = heat ? C.muted : colorOf(walk);
      const isActive = live && walk.id === state.active;
      const quiet = (live && state.active && !isActive) || Boolean(heat);
      const points = walk.points.map((p) => `${(p.x * k).toFixed(1)},${(p.y * k).toFixed(1)}`).join(" ");
      const g = S("g");
      if (walk.points.length > 1) {
        if (!live && !heat) g.append(S("polyline", { points, fill: "none", stroke: "transparent", "stroke-width": 14 }));
        g.append(S("polyline", { points, fill: "none", stroke: color, "stroke-width": isActive ? 4 : 3, "stroke-opacity": quiet ? 0.4 : 0.85, "stroke-linejoin": "round", "stroke-linecap": "round" }));
      }
      if (!heat) {
        const first = walk.points[0];
        g.append(S("circle", { cx: first.x * k, cy: first.y * k, r: 10, fill: color, stroke: C.paper, "stroke-width": 2 }));
        g.append(S("text", { x: first.x * k, y: first.y * k + 4, "text-anchor": "middle", "font-size": 11, "font-weight": 800, fill: "#fff" }, String(i + 1)));
      }
      if (isActive) {
        walk.points.forEach((p, n) => g.append(S("circle", { cx: p.x * k, cy: p.y * k, r: n === walk.points.length - 1 ? 7 : 3.5, fill: n === walk.points.length - 1 ? "none" : color, stroke: color, "stroke-width": 2 })));
      }
      if (!live) {
        const length = pathLength(walk.points, s);
        g.setAttribute("data-tip", `${i + 1} · ${walkName(walk, i)}${length !== null ? `\n${metres(length)} · ${tx("{n} cycles", { n: cyclesOf(walk) })}` : ""}`);
        g.classList.add("ck-hit");
      }
      svg.append(g);
    });
    // The stops, with their visits.
    visits(walks).forEach((stop) => {
      const g = S("g");
      const x = stop.x * k, y = stop.y * k;
      g.append(S("rect", { x: x - 7, y: y - 7, width: 14, height: 14, rx: 2, fill: C.paper, stroke: C.text, "stroke-width": 2 }));
      const right = x < VW - 160;
      g.append(S("text", { x: right ? x + 12 : x - 12, y: y - 9, "text-anchor": right ? "start" : "end", "font-size": 13, "font-weight": 700, fill: C.text, ...halo }, `${stop.label} · ${stop.visits}×`));
      if (!live) { g.setAttribute("data-tip", `${stop.label}\n${tx("{n} visits", { n: stop.visits })}`); g.classList.add("ck-hit"); }
      svg.append(g);
    });
    // The two points of the scale, while they are being set and once set.
    const cal = live && mode === "scale" ? (scalePick.length ? { a: scalePick[0], b: scalePick[1] } : null)
      : live && state.plan.kind === "image" && state.plan.cal ? { a: { x: state.plan.cal.ax, y: state.plan.cal.ay }, b: { x: state.plan.cal.bx, y: state.plan.cal.by }, m: state.plan.cal.metres } : null;
    if (cal) {
      const g = S("g", { "pointer-events": "none" });
      if (cal.b) g.append(S("line", { x1: cal.a.x * k, y1: cal.a.y * k, x2: cal.b.x * k, y2: cal.b.y * k, stroke: C.blue, "stroke-width": 3, "stroke-dasharray": "8 6" }));
      [cal.a, cal.b].filter(Boolean).forEach((p) => g.append(S("circle", { cx: p.x * k, cy: p.y * k, r: 7, fill: C.paper, stroke: C.blue, "stroke-width": 3 })));
      if (cal.b && cal.m) g.append(S("text", { x: ((cal.a.x + cal.b.x) / 2) * k, y: ((cal.a.y + cal.b.y) / 2) * k - 10, "text-anchor": "middle", "font-size": 13, "font-weight": 800, fill: C.blue, ...halo }, `${num(numberOf(cal.m, 0), 1)} m`));
      svg.append(g);
    }
    // A scale bar at the bottom left, so a printed plan can still be measured.
    if (s) {
      const bar = niceBar(w * s);
      const px = (bar / s) * k;
      const g = S("g", { "pointer-events": "none" });
      g.append(S("rect", { x: 10, y: VH - 34, width: px + 20, height: 26, rx: 4, fill: C.paper, "fill-opacity": 0.85 }));
      g.append(S("path", { d: `M20 ${VH - 22} V${VH - 14} H${20 + px} V${VH - 22}`, fill: "none", stroke: C.text, "stroke-width": 2 }));
      g.append(S("text", { x: 20 + px / 2, y: VH - 18, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.text }, `${num(bar, 0)} m`));
      svg.append(g);
    }
    return svg;
  };
  const renderCanvas = () => {
    canvas.replaceChildren(drawPlan(study().walks, { live: true, title: `${data.title} · ${studyLabel(state.view)}` }));
    canvas.classList.toggle("is-scale", mode === "scale");
  };
  const renderDrawing = ({ table = false, list = true } = {}) => {
    renderCanvas();
    if (list) renderWalks(); else renderMeta();
    if (table) renderPoints();
    renderSoon();
  };

  // Results -------------------------------------------------------------------------------------------------------------------
  const pointRows = () => {
    const s = scale();
    const rows = [[tx("Study"), tx("Walk"), tx("Cycles"), tx("Point"), `x (${unit()})`, `y (${unit()})`, tx("Stop name"), tx("Segment (m)"), tx("Walk total (m)")]];
    ["current", "after"].forEach((view) => state[view].walks.forEach((walk, w) => {
      const total = pathLength(walk.points, s);
      walk.points.forEach((point, i) => rows.push([studyLabel(view), walkName(walk, w), cyclesOf(walk), i + 1, toShown(point.x), toShown(point.y), point.stop,
        i && s ? round(distance(walk.points[i - 1], point) * s, 2) : "", i === walk.points.length - 1 && total !== null ? round(total, 2) : ""]));
    }));
    return rows;
  };
  const summaryText = (now, next, diff) => {
    const lines = [`${data.title} | Stiven Catalyst`];
    if (state.title.trim()) lines.push(state.title.trim());
    const block = (view, result) => {
      if (!result.drawn) return;
      lines.push("", `${studyLabel(view)}: ${tx("{m} per cycle", { m: metres(result.perCycle) })} · ${tx("{n} cycles", { n: result.cycles })}${result.perShift !== null ? ` · ${tx("{m} per shift", { m: metres(result.perShift) })} · ${tx("{t} walking per shift", { t: minutes(result.minutesPerShift) })}` : ""}`);
      result.walks.filter((walk) => walk.points >= 2).forEach((walk) => lines.push(`- ${walkName(state[view].walks[walk.index], walk.index)}: ${metres(walk.metres)}${walk.cycles > 1 ? ` (${tx("{n} cycles", { n: walk.cycles })})` : ""}`));
      if (result.stops.length) lines.push(`${tx("Stops")}: ${result.stops.map((stop) => `${stop.label} ${stop.visits}×`).join(", ")}`);
      if (result.longest) lines.push(`${tx("Longest repeated leg")}: ${legName(result.longest)}, ${result.longest.count}× · ${metres(result.longest.metres)}`);
    };
    block("current", now);
    block("after", next);
    if (state.after.change.trim()) lines.push("", `${tx("The change")}: ${state.after.change.trim()}`);
    if (diff) {
      const share = diff.share !== null ? pct(diff.share, 0) : "–";
      lines.push("", diff.metresPerShift !== null
        ? tx("Saving: {m} per cycle ({share}), {shift} and {t} per shift.", { m: metres(diff.perCycle), share, shift: metres(diff.metresPerShift), t: minutes(diff.minutesPerShift) })
        : tx("Saving: {m} per cycle ({share}).", { m: metres(diff.perCycle), share }));
    }
    lines.push("", tx("Walking speed {v} m/s.", { v: num(now.speed, 1) }));
    return lines.join("\n");
  };
  const toolLink = (selector, fallback) => new URL(root.parentElement.querySelector(selector)?.getAttribute("href") || fallback, location.href).href;
  const table = (headers, rows, className = "") => {
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const t = el("table", `dl-table ${className}`.trim());
    const thead = el("thead");
    const hr = el("tr");
    headers.forEach(([label, cls]) => { const th = el("th", cls || null, label); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const tbody = el("tbody");
    rows.forEach((cells) => {
      const tr = el("tr");
      cells.forEach(([value, cls], c) => {
        const cell = el(c ? "td" : "th", cls || null, value);
        if (!c) cell.scope = "row";
        tr.append(cell);
      });
      tbody.append(tr);
    });
    t.append(thead, tbody);
    wrap.append(t);
    return wrap;
  };

  const renderResults = () => {
    const now = resultOf("current");
    const next = resultOf("after");
    // The result follows the study being drawn; an empty one shows the other.
    const view = (state.view === "after" ? next : now).drawn ? state.view : now.drawn ? "current" : next.drawn ? "after" : state.view;
    const result = view === "after" ? next : now;
    const walks = state[view].walks;
    note.hidden = !state.example;
    results.replaceChildren();
    results.hidden = !result.drawn;
    if (!result.drawn) return;
    const diff = now.drawn && next.drawn ? compare(now, next) : null;
    const s = result.scale;

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${studyLabel(view)}${state.title.trim() ? ` · ${state.title.trim()}` : ""}`));
    const title = el("h2");
    if (!s) title.append(tx("Set the scale to turn the paths into metres."));
    else if (diff && diff.perCycle > 0) {
      const sentence = diff.minutesPerShift !== null ? tx("The change takes {m} off every cycle: {t} less walking per shift.", { m: "\u0000", t: minutes(diff.minutesPerShift) }) : tx("The change takes {m} off every cycle.", { m: "\u0000" });
      const [before, after] = sentence.split("\u0000");
      title.append(before, el("span", null, metres(diff.perCycle)), after);
    } else {
      const sentence = result.minutesPerShift !== null ? tx("{m} walked per cycle, {t} of walking per shift.", { m: "\u0000", t: minutes(result.minutesPerShift) }) : tx("{m} walked per cycle.", { m: "\u0000" });
      const [before, after] = sentence.split("\u0000");
      title.append(before, el("span", null, metres(result.perCycle)), after);
    }
    head.append(title);

    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Metres per cycle"), metres(result.perCycle), tx("{m} over {n} cycles · {t} walking", { m: metres(result.metres), n: result.cycles, t: seconds(result.secondsPerCycle) })));
    stats.append(stat(tx("Metres per shift"), metres(result.perShift), result.shift > 0 ? tx("{n} cycles per shift", { n: int.format(result.shift) }) : tx("add the cycles per shift")));
    stats.append(stat(tx("Walking per shift"), minutes(result.minutesPerShift), tx("at {v} m/s", { v: num(result.speed, 1) })));
    if (result.topStop) stats.append(stat(tx("Top stop"), result.topStop.label, tx("{n} visits · {p} per cycle", { n: result.topStop.visits, p: num(result.topStop.perCycle ?? 0, 1) })));
    if (diff) stats.append(stat(tx("Saving per shift"), diff.metresPerShift !== null ? metres(diff.metresPerShift) : metres(diff.perCycle), diff.metresPerShift !== null ? tx("{t} of walking · {share} of the path", { t: minutes(diff.minutesPerShift), share: diff.share !== null ? pct(diff.share, 0) : "–" }) : tx("per cycle; add the cycles per shift")));

    const notes = [];
    const box = el("div", "sp2-result-plan");
    box.append(el("p", "result-label", `${tx("Floor plan")} · ${studyLabel(view)}`));
    box.append(CK.figure(drawPlan(walks, { title: `${data.title} · ${studyLabel(view)}${state.title.trim() ? ` · ${state.title.trim()}` : ""}` }), {
      fileName: `${data.csv}-${view}`,
      caption: tx("Point at a path or a stop for its numbers. Each colour is one walk, its number marks where it starts; the squares are the stops with their visits."),
    }));
    box.append(CK.legend(walks.map((walk, i) => ({ label: `${i + 1} · ${walkName(walk, i)}${s ? ` · ${metres(pathLength(walk.points, s))}` : ""}`, color: colorOf(walk) }))));
    notes.push(box);
    if (planTooLarge) notes.push(el("p", "dl-panel-note", tx("The plan image is too large to travel inside the exported chart, so the result shows the grid. The drawing above keeps the image.")));
    if (!s) notes.push(el("p", "dl-warning", data.advice.noScale));
    const single = walks.filter((walk) => walk.points.length === 1).length;
    if (single) notes.push(el("p", "dl-warning", tx("{n} walks have one point only and count as 0 m.", { n: single })));
    if (!next.drawn) notes.push(el("p", "dl-panel-note", data.advice.noAfter));

    // Where to start: the longest repeated leg, and the stop visited most moved next to where the work happens.
    let focus = null;
    const leg = result.longest;
    if (leg && s) {
      const top = result.topStop;
      const base = result.base;
      focus = focusCard({
        title: legName(leg),
        detail: `${leg.count}× · ${metres(leg.metres)}`,
        lede: leg.repeated
          ? tx("This leg is walked {n} times, {each} each time: {m} of the {total} in this study.", { n: leg.count, each: metres(leg.each), m: metres(leg.metres), total: metres(result.metres) })
          : tx("No leg is walked twice yet. The longest is {m}; draw more cycles to see which legs repeat.", { m: metres(leg.metres) }),
        advice: data.advice.leg,
        extraLabel: top ? tx("Visited most") : undefined,
        extra: top ? (base ? tx("{stop}: {n} visits, {p} per cycle. Move it next to {base}, where the walks start.", { stop: top.label, n: top.visits, p: num(top.perCycle ?? 0, 1), base: base.label })
          : tx("{stop}: {n} visits, {p} per cycle. Move it next to where the work happens.", { stop: top.label, n: top.visits, p: num(top.perCycle ?? 0, 1) })) : undefined,
      });
    }

    // Actions: copy, print, 5 Whys, the change to the Action Tracker, the Kaizen Board, the Time Study and the files.
    const problem = leg && s ? tx("{leg} is walked {n} times per study, {m} in all", { leg: legName(leg), n: leg.count, m: metres(leg.metres) })
      : tx("Too much walking in {job}", { job: state.title.trim() || data.title });
    const actions = resultActions(() => summaryText(now, next, diff), problem);
    if (window.ActionsStore) {
      actions.append(window.ActionsStore.linkButton(tx("Add the change to the actions"), () => {
        const top = result.topStop;
        const base = result.base;
        const change = state.after.change.trim();
        return {
          title: change || (top && base ? tx("Move {stop} next to {base}", { stop: top.label, base: base.label }) : top ? tx("Move {stop} next to where the work happens", { stop: top.label }) : tx("Shorten the walking in {job}", { job: state.title.trim() || data.title })),
          detail: [state.title.trim(), now.perCycle !== null ? tx("Today {m} per cycle, {t} of walking per shift.", { m: metres(now.perCycle), t: minutes(now.minutesPerShift) }) : "", leg && s ? `${tx("Longest repeated leg")}: ${legName(leg)} (${leg.count}×, ${metres(leg.metres)}).` : ""].filter(Boolean).join(" "),
          check: diff ? tx("Walk the job again after the change: from {now} to {next} per cycle.", { now: metres(now.perCycle), next: metres(next.perCycle) }) : tx("Walk the job again after the change and draw it as After the change."),
          source: TOOL, area: state.title.trim(), priority: "High",
        };
      }));
    }
    const kaizen = el("a", "button-secondary", tx("Take to the Kaizen Board"));
    kaizen.href = toolLink("a[data-kaizen-board]", "../kaizen-board/");
    const timeStudy = el("a", "button-secondary", tx("Time it with the Time Study"));
    timeStudy.href = toolLink("a[data-time-study]", "../time-study/");
    const csv = el("button", "button-secondary", tx("Download CSV"));
    csv.type = "button";
    csv.addEventListener("click", () => downloadCsv(data.csv, pointRows()));
    const xlsx = el("button", "button-secondary", tx("Download Excel"));
    xlsx.type = "button";
    xlsx.addEventListener("click", () => downloadXlsx(data.csv, pointRows()));
    actions.append(kaizen, timeStudy, csv, xlsx);

    // The evidence: the heat grid, metres per walk, before and after, the stops and the legs.
    const panels = [];
    if (s) {
      const { w } = extent(state.plan);
      const cellMetres = heatCell(w * s);
      const heat = heatGrid(walks.filter((walk) => walk.points.length > 1), { ...extent(state.plan), cell: cellMetres / s, scale: s });
      const heatPanel = panel(tx("Where the paths cross most"), tx("The plan in squares of {c}: the darker a square, the more metres walked inside it. The darkest squares are where a move saves the most.", { c: metres(cellMetres) }));
      heatPanel.append(CK.figure(drawPlan(walks, { heat, title: `${data.title}: ${tx("Where the paths cross most")}` }), { fileName: `${data.csv}-heat-${view}` }));
      panels.push(heatPanel);

      const walkPanel = panel(tx("Metres per walk"), tx("Each column is one walk as drawn. A walk that covers several cycles is divided by them in the metres per cycle."));
      walkPanel.append(CK.figure(CK.bars(result.walks.filter((walk) => walk.points >= 2).map((walk) => ({ label: walkName(walks[walk.index], walk.index), value: round(walk.metres, 1), color: colorOf(walks[walk.index]), tip: `${walkName(walks[walk.index], walk.index)}: ${metres(walk.metres)} · ${tx("{n} cycles", { n: walk.cycles })}` })), {
        title: `${data.title}: ${tx("Metres per walk")}`, unit: "m", format: (v) => num(v, v >= 100 ? 0 : 1),
      }), { fileName: `${data.csv}-walks-${view}` }));
      panels.push(walkPanel);
    }
    if (diff) {
      const comparePanel = panel(tx("Current and after the change"), diff.perCycle > 0
        ? tx("The change takes {m} off every cycle ({share}).", { m: metres(diff.perCycle), share: diff.share !== null ? pct(diff.share, 0) : "–" })
        : tx("After the change the path is not shorter yet. Move the stop visited most closer and walk the job again."));
      comparePanel.append(CK.figure(CK.bars([
        { label: tx("Current"), value: round(now.perCycle, 1), color: CK.C.muted, tip: `${tx("Current")}: ${tx("{m} per cycle", { m: metres(now.perCycle) })}` },
        { label: tx("After the change"), value: round(next.perCycle, 1), color: CK.C.blue, tip: `${tx("After the change")}: ${tx("{m} per cycle", { m: metres(next.perCycle) })}` },
      ], { title: `${data.title}: ${tx("Metres per cycle")}`, unit: "m", format: (v) => num(v, 1) }), { fileName: `${data.csv}-compare` }));
      // The change column reads after minus current: less walking is a minus.
      const signed = (saving, format) => (saving === null ? "–" : Math.abs(saving) < 1e-9 ? "±0" : `${saving > 0 ? "−" : "+"}${format(Math.abs(saving))}`);
      comparePanel.append(table([["", null], [tx("Current"), "num"], [tx("After the change"), "num"], [tx("Change"), "num"]], [
        [[tx("Metres per cycle")], [metres(now.perCycle), "num"], [metres(next.perCycle), "num"], [signed(diff.perCycle, metres), "num"]],
        [[tx("Walking per cycle")], [seconds(now.secondsPerCycle), "num"], [seconds(next.secondsPerCycle), "num"], [signed(diff.secondsPerCycle, seconds), "num"]],
        [[tx("Metres per shift")], [metres(now.perShift), "num"], [metres(next.perShift), "num"], [signed(diff.metresPerShift, metres), "num"]],
        [[tx("Walking per shift")], [minutes(now.minutesPerShift), "num"], [minutes(next.minutesPerShift), "num"], [signed(diff.minutesPerShift, minutes), "num"]],
        [[tx("Top stop")], [now.topStop ? `${now.topStop.label} ${now.topStop.visits}×` : "–", "num"], [next.topStop ? `${next.topStop.label} ${next.topStop.visits}×` : "–", "num"], ["", "num"]],
      ], "sp2-compare"));
      panels.push(comparePanel);
    }
    if (result.stops.length) {
      const stopPanel = panel(tx("Visits per stop"), tx("Every point named as a stop is one visit. The start of a walk counts too, so where the work happens comes out on top."));
      stopPanel.append(table([[tx("Stop name")], [tx("Visits"), "num"], [tx("Per cycle"), "num"]], result.stops.map((stop) => [[stop.label], [int.format(stop.visits), "num"], [num(stop.perCycle ?? 0, 1), "num"]])));
      panels.push(stopPanel);
    }
    if (result.legs.length && s) {
      const legPanel = panel(tx("Legs between stops"), tx("Each walk cut at its stops. There and back is the same leg walked twice; the legs with the most metres in all come first."));
      legPanel.append(table([[tx("Leg")], [tx("How often"), "num"], [tx("Each time"), "num"], [tx("In all"), "num"]], result.legs.slice(0, 10).map((item) => [[legName(item)], [int.format(item.count), "num"], [metres(item.each), "num"], [metres(item.metres), "num"]])));
      panels.push(legPanel);
    }
    resultLayout(results, { head, stats, notes, focus, actions, panels });
  };
  const renderSoon = renderOnPause(renderResults, () => 1, 0);

  const renderAll = () => {
    settings.forEach((input) => { input.value = (input.name === "gridW" || input.name === "gridH" ? state.plan[input.name] : state[input.name]) ?? ""; });
    renderScale();
    if (state.plan.kind === "image") scaleStatus.textContent = mode === "scale" ? scaleStatus.textContent : scaleText();
    renderStudy();
    renderCanvas();
    renderWalks();
    renderPoints();
    renderResults();
  };
  renderAll();
  if (state.plan.kind === "image") loadPlanImage().finally(renderAll);
})();
