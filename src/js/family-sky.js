// Tool pages: fits the family background to the title block, and lets the moons of a training module follow the course.
(() => {
  const sky = document.querySelector("[data-family-sky]");
  const main = document.getElementById("main");
  const hero = document.querySelector(".tool-hero");
  if (!sky || !main || !hero) return;

  const planet = sky.querySelector(".sky-planet");
  const svg = planet?.querySelector("svg");

  // The planet's visible body (disc, rings and moons, not its glow): its radius and the offset of its centre
  // from the box centre, both as a share of the box width, measured once. On a training module the sun sits at
  // the start of the moons' arc, so only its disc counts there and its ring may pass under a word.
  let bodyRatio = 0, offX = 0, offY = 0;
  // The shapes themselves, not groups: the radar sweep of Zenith is light and may cross a word.
  const parts = sky.classList.contains("sky-learn") ? ":scope > circle:not(.planet-halo):not(.planet-moon)" : "circle:not(.planet-halo), ellipse, path, polygon, rect";
  const measureBody = () => {
    if (!svg) return;
    let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
    for (const part of svg.querySelectorAll(parts)) {
      if (part.closest("defs, .zenith-radar")) continue;
      const r = part.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      left = Math.min(left, r.left); top = Math.min(top, r.top); right = Math.max(right, r.right); bottom = Math.max(bottom, r.bottom);
    }
    const box = planet.getBoundingClientRect();
    if (!(right > left) || !box.width) return;
    bodyRatio = Math.max(right - left, bottom - top) / 2 / box.width;
    offX = ((left + right) / 2 - (box.left + box.width / 2)) / box.width;
    offY = ((top + bottom) / 2 - (box.top + box.height / 2)) / box.width;
  };

  const PAD = 10;
  const hits = (cx, cy, r, rects) => rects.some((b) => {
    const dx = cx - Math.max(b.left - PAD, Math.min(cx, b.right + PAD));
    const dy = cy - Math.max(b.top - PAD, Math.min(cy, b.bottom + PAD));
    return dx * dx + dy * dy < r * r;
  });

  // Keep the planet out of the words: the title's lines, the eyebrow, the badge, and the fixed parts of the drawing.
  const keepOut = (origin) => {
    const rects = [];
    const push = (list) => { for (const r of list) if (r.width) rects.push({ left: r.left - origin.x, top: r.top - origin.y, right: r.right - origin.x, bottom: r.bottom - origin.y }); };
    // The words themselves (their line boxes), not the full-width blocks that hold them.
    const words = (node) => { if (!node) return; const range = document.createRange(); range.selectNodeContents(node); push(range.getClientRects()); };
    words(hero.querySelector("h1"));
    const titleTop = rects.length ? Math.min(...rects.map((b) => b.top)) : 0;
    words(hero.querySelector(".eyebrow"));
    for (const node of [main.querySelector(".family-badge"), ...sky.querySelectorAll(".learn-moon, .atlas-compass")]) if (node) push(node.getClientRects());
    return { rects, titleTop };
  };

  const place = () => {
    const origin = main.getBoundingClientRect();
    const heroBox = hero.getBoundingClientRect();
    sky.style.setProperty("--hero-bottom", `${Math.round(heroBox.bottom - origin.top)}px`);
    if (!planet || !svg) return;

    // Where the stylesheet puts the planet for this family, and how big.
    planet.hidden = false;
    planet.classList.remove("is-placed");
    const designed = planet.getBoundingClientRect();
    if (!bodyRatio) measureBody();
    if (!bodyRatio) return;
    const width = designed.width;
    const home = { x: designed.left + designed.width / 2 - origin.left, y: designed.top + designed.height / 2 - origin.top };
    const vw = main.clientWidth;
    const { rects, titleTop } = keepOut({ x: origin.left, y: origin.top });

    // Spots are for the body's centre. A spot is fine when the body touches no words and at least two thirds
    // of it shows on each side (the rest may hang over the right or left edge or above the top). Full size
    // first, then smaller.
    const fits = (x, y, r) => !hits(x, y, r, rects) && x <= vw - r * 0.34 && x >= r * 0.34 && y >= r * 0.34;
    const spots = [
      // 1. its own place
      ["home", (r, w) => [home.x + offX * w, home.y + offY * w]],
      // 2. beside the title, past the longest line it would touch
      ["beside", (r, w) => { const y = home.y + offY * w; const lines = rects.filter((b) => b.bottom > y - r && b.top < y + r); return lines.length ? [Math.max(...lines.map((b) => b.right)) + r + PAD + 6, y] : null; }],
      // 3. above the title, towards the right
      ["above", (r, w) => [Math.min(home.x + offX * w, vw - r * 0.8), titleTop - r - PAD - 2]],
    ];
    const narrow = vw < 900;
    const order = narrow ? [spots[0], spots[2], spots[1]] : spots;
    const trace = location.hash === "#sky-debug" ? [] : null;
    for (const scale of [1, 0.85, 0.7, 0.55]) {
      const w = width * scale, r = w * bodyRatio;
      for (const [name, spot] of order) {
        const at = spot(r, w);
        trace?.push(`${name}@${scale}: ${at ? `${Math.round(at[0])},${Math.round(at[1])} r${Math.round(r)} hit=${hits(at[0], at[1], r, rects)}` : "no spot"}`);
        if (trace) planet.dataset.trace = trace.join(" | ") + ` || home ${Math.round(home.x)},${Math.round(home.y)} off ${offX.toFixed(2)},${offY.toFixed(2)} ratio ${bodyRatio.toFixed(3)} titleTop ${Math.round(titleTop)} rects ${rects.map((b) => `${Math.round(b.left)}-${Math.round(b.right)}/${Math.round(b.top)}-${Math.round(b.bottom)}`).join(" ")}`;
        if (at && fits(at[0], at[1], r)) {
          planet.style.setProperty("--planet-x", `${Math.round(at[0] - offX * w)}px`);
          planet.style.setProperty("--planet-y", `${Math.round(at[1] - offY * w)}px`);
          planet.style.setProperty("--planet-w", `${Math.round(w)}px`);
          planet.dataset.spot = `${name} ${scale}`;
          planet.classList.add("is-placed");
          return;
        }
      }
    }
    planet.dataset.spot = "none";
    planet.hidden = true;
  };
  place();
  if ("ResizeObserver" in window) new ResizeObserver(place).observe(hero);
  window.addEventListener("resize", place);
  document.fonts?.ready.then(place);

  // A moon lights up when its DMAIC step is complete; the step being read wears a ring.
  const moons = [...sky.querySelectorAll("[data-moon]")];
  const steps = [...document.querySelectorAll("[data-step]")];
  if (!moons.length || !steps.length) return;
  const sync = () => {
    for (const moon of moons) {
      const step = steps.find((link) => link.dataset.step === moon.dataset.moon);
      moon.classList.toggle("is-lit", Boolean(step?.classList.contains("is-done")));
      moon.classList.toggle("is-current", Boolean(step?.classList.contains("is-current")));
    }
    if (!moons.some((moon) => moon.classList.contains("is-current"))) moons.find((moon) => !moon.classList.contains("is-lit"))?.classList.add("is-current");
  };
  sync();
  const watch = new MutationObserver(sync);
  for (const step of steps) watch.observe(step, { attributes: true, attributeFilter: ["class"] });
})();
