// The homepage hero: the Catalyst light in the centre, the tool families on its orbits
// and a disc of light particles turning around it. Dragging turns and tilts the system,
// a tap on a planet (or on its button) opens that family's tools, a tap on the light flares it.
(() => {
  const root = document.querySelector("[data-cosmos]");
  const canvas = root?.querySelector("canvas");
  const anchor = root?.querySelector("[data-cosmos-anchor]");
  const ctx = canvas?.getContext("2d");
  if (!root || !anchor || !ctx) return;

  const chips = [...root.querySelectorAll("[data-family]")];
  const panels = [...root.querySelectorAll("[data-family-panel]")];
  const hint = root.querySelector("[data-cosmos-hint]");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const rgbOf = (hex) => {
    const n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`;
  const mix = ([r, g, b], [r2, g2, b2], t) => [r + (r2 - r) * t, g + (g2 - g) * t, b + (b2 - b) * t].map(Math.round);
  const WHITE = [255, 255, 255];
  const BLACK = [4, 6, 9];
  const SIZES = [0.034, 0.041, 0.047, 0.04, 0.032];

  // Planets: one per tool family, faster the closer they are to the light.
  const planets = panels.map((panel, i) => {
    const r = Number(panel.dataset.orbit) || 0.5 + i * 0.2;
    return {
      id: panel.dataset.familyPanel,
      name: panel.dataset.name.toUpperCase(),
      rgb: rgbOf(panel.dataset.color || "#ffffff"),
      r,
      phase: i * 2.39996,
      incl: (i % 2 ? -1 : 1) * 0.035 * (i + 1),
      speed: 0.1 / Math.pow(r, 1.5),
      size: SIZES[i % SIZES.length],
      sx: 0, sy: 0, sz: 0, sr: 0,
    };
  });

  // Particles: two spiral arms and a thin dust disc, stored flat for speed.
  const PALETTE = [[226, 238, 255], [132, 198, 247], [246, 204, 128], [255, 104, 108]];
  const pickColour = () => {
    const x = Math.random();
    return x < 0.6 ? 0 : x < 0.8 ? 1 : x < 0.95 ? 2 : 3;
  };
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  let disc = null;
  let sky = null;

  const buildParticles = (count) => {
    const list = [];
    for (let i = 0; i < count; i += 1) {
      const inArm = Math.random() < 0.68;
      const r = inArm ? 0.3 + Math.pow(Math.random(), 0.85) * 1.55 : 0.26 + Math.random() * 1.7;
      const angle = inArm ? (i % 2) * Math.PI + r * 2.4 + gauss() * 0.42 : Math.random() * Math.PI * 2;
      list.push([
        pickColour(),
        r,
        angle,
        gauss() * 0.028 * (1 + r),
        (0.13 / Math.pow(r, 1.15)) * (0.85 + Math.random() * 0.3),
        0.4 + Math.pow(Math.random(), 4) * 1.2,
        Math.random() * Math.PI * 2,
      ]);
    }
    // Sorted by colour so each colour is set once per frame.
    list.sort((a, b) => a[0] - b[0]);
    const f = (k) => Float32Array.from(list, (p) => p[k]);
    disc = { n: count, colour: Uint8Array.from(list, (p) => p[0]), r: f(1), a: f(2), y: f(3), speed: f(4), size: f(5), tw: f(6) };
    sky = Array.from({ length: Math.round(count / 5) }, () => ({
      x: Math.random(), y: Math.random(), d: 0.2 + Math.random() * 0.8, s: 0.3 + Math.random() * 0.9, tw: Math.random() * 6.28,
    }));
  };

  // View: slow drift, drag to turn and tilt, eased back to rest.
  const REST_PITCH = 0.42;
  const DRIFT = 0.045;
  const view = { yaw: 0.5, yawVel: DRIFT, pitch: REST_PITCH, hoverX: 0, hoverY: 0, aimX: 0, aimY: 0 };
  let time = 0;
  let flare = 0;
  let selected = null;
  let hovered = null;
  let dpr = 1;
  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;
  let S = 1;
  const D = 4;
  const BULB = 0.16;

  let cosY = 1, sinY = 0, cosP = 1, sinP = 0;
  const setAngles = () => {
    const yaw = view.yaw + view.hoverX * 0.22;
    const pitch = view.pitch + view.hoverY * 0.07;
    cosY = Math.cos(yaw); sinY = Math.sin(yaw);
    cosP = Math.cos(pitch); sinP = Math.sin(pitch);
  };
  // World (x, y, z) to screen; returns depth z and perspective scale k in out.
  const out = { x: 0, y: 0, z: 0, k: 1 };
  const project = (x, y, z) => {
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;
    const k = D / (D - z2);
    out.x = cx + x1 * S * k;
    out.y = cy - y2 * S * k;
    out.z = z2;
    out.k = k;
    return out;
  };
  const orbitPoint = (r, incl, angle) => {
    const x = r * Math.cos(angle);
    const z0 = r * Math.sin(angle);
    return project(x, -z0 * Math.sin(incl), z0 * Math.cos(incl));
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const box = root.getBoundingClientRect();
    const spot = anchor.getBoundingClientRect();
    width = Math.max(1, Math.round(box.width * dpr));
    height = Math.max(1, Math.round(box.height * dpr));
    canvas.width = width;
    canvas.height = height;
    cx = (spot.left - box.left + spot.width / 2) * dpr;
    cy = (spot.top - box.top + spot.height / 2) * dpr;
    S = Math.min(spot.width / 2 / (spot.width < 560 ? 1.24 : 1.32), spot.height / 2 / 0.66) * dpr;
    const count = Math.round(Math.min(2600, Math.max(900, (spot.width * spot.height) / 120)));
    if (!disc || Math.abs(disc.n - count) > 250) buildParticles(count);
    draw();
  };

  // ---- Drawing ----
  const drawSky = () => {
    ctx.fillStyle = "#dfe9f5";
    const shift = view.yaw * 14 * dpr;
    for (const star of sky) {
      const x = ((star.x * width + shift * star.d) % width + width) % width;
      ctx.globalAlpha = (0.18 + 0.4 * star.d) * (0.7 + 0.3 * Math.sin(time * 1.7 + star.tw));
      const s = star.s * dpr;
      ctx.fillRect(x, star.y * height, s, s);
    }
    ctx.globalAlpha = 1;
  };

  const drawOrbit = (planet, front) => {
    const isOn = selected === planet;
    ctx.beginPath();
    let open = false;
    for (let i = 0; i <= 128; i += 1) {
      const p = orbitPoint(planet.r, planet.incl, (i / 128) * Math.PI * 2);
      if ((p.z >= 0) === front) {
        if (open) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y);
        open = true;
      } else {
        open = false;
      }
    }
    const base = isOn ? 0.75 : hovered === planet ? 0.42 : 0.2;
    ctx.strokeStyle = rgba(planet.rgb, front ? base : base * 0.55);
    ctx.lineWidth = (isOn ? 1.6 : 1) * dpr;
    ctx.stroke();
  };

  const drawDisc = () => {
    const { n, colour, r, a, y, speed, size, tw } = disc;
    let current = -1;
    for (let i = 0; i < n; i += 1) {
      if (colour[i] !== current) {
        current = colour[i];
        ctx.fillStyle = rgba(PALETTE[current], 1);
      }
      const angle = a[i] + speed[i] * time;
      const p = project(r[i] * Math.cos(angle), y[i], r[i] * Math.sin(angle));
      if (p.x < -4 || p.y < -4 || p.x > width + 4 || p.y > height + 4) continue;
      const near = r[i] < 0.6 ? 1.35 : 1;
      const depth = 0.5 + 0.5 * Math.min(1, Math.max(0, (p.z + 1.4) / 2.8));
      ctx.globalAlpha = Math.min(1, depth * near * (0.55 + 0.45 * Math.sin(time * 2.2 + tw[i])));
      const s = size[i] * p.k * dpr;
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  };

  const drawGlow = () => {
    const breathe = 1 + 0.05 * Math.sin(time * 1.3) + flare * 0.55;
    ctx.globalCompositeOperation = "lighter";
    let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 1.25 * breathe);
    g.addColorStop(0, "rgba(255,236,200,0.30)");
    g.addColorStop(0.3, "rgba(74,181,247,0.10)");
    g.addColorStop(0.62, "rgba(223,17,25,0.035)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - S * 1.4 * breathe, cy - S * 1.4 * breathe, S * 2.8 * breathe, S * 2.8 * breathe);
    const b = S * BULB;
    g = ctx.createRadialGradient(cx, cy, 0, cx, cy, b * 3 * breathe);
    g.addColorStop(0, "rgba(255,251,238,0.95)");
    g.addColorStop(0.32, "rgba(255,226,170,0.38)");
    g.addColorStop(1, "rgba(255,200,120,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - b * 3.2 * breathe, cy - b * 3.2 * breathe, b * 6.4 * breathe, b * 6.4 * breathe);
    ctx.globalCompositeOperation = "source-over";
  };

  // The Catalyst bulb, hanging from its cable at the top of the hero.
  const drawBulb = () => {
    const b = S * BULB;
    const neck = cy - 0.52 * b;
    const capTop = neck - 0.46 * b;

    const cable = ctx.createLinearGradient(0, 0, 0, capTop);
    cable.addColorStop(0, "rgba(220,230,240,0)");
    cable.addColorStop(1, "rgba(220,230,240,0.6)");
    ctx.strokeStyle = cable;
    ctx.lineWidth = Math.max(1.2, 0.045 * b);
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, capTop);
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - 0.22 * b, neck);
    ctx.bezierCurveTo(cx - 0.24 * b, cy - 0.28 * b, cx - 0.64 * b, cy - 0.24 * b, cx - 0.64 * b, cy + 0.16 * b);
    ctx.bezierCurveTo(cx - 0.64 * b, cy + 0.6 * b, cx - 0.32 * b, cy + 0.84 * b, cx, cy + 0.84 * b);
    ctx.bezierCurveTo(cx + 0.32 * b, cy + 0.84 * b, cx + 0.64 * b, cy + 0.6 * b, cx + 0.64 * b, cy + 0.16 * b);
    ctx.bezierCurveTo(cx + 0.64 * b, cy - 0.24 * b, cx + 0.24 * b, cy - 0.28 * b, cx + 0.22 * b, neck);
    ctx.closePath();
    const glass = ctx.createRadialGradient(cx - 0.14 * b, cy + 0.05 * b, 0, cx, cy + 0.1 * b, 0.95 * b);
    glass.addColorStop(0, "#ffffff");
    glass.addColorStop(0.55, "#fffaf0");
    glass.addColorStop(1, "#ffe6bb");
    ctx.shadowColor = "rgba(255,238,205,0.95)";
    ctx.shadowBlur = (26 + flare * 30) * dpr;
    ctx.fillStyle = glass;
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = `rgba(255,160,60,${0.5 + 0.2 * Math.sin(time * 5)})`;
    ctx.lineWidth = Math.max(1, 0.035 * b);
    ctx.beginPath();
    ctx.moveTo(cx - 0.12 * b, neck + 0.05 * b);
    ctx.lineTo(cx - 0.12 * b, cy + 0.12 * b);
    for (let i = 0; i <= 6; i += 1) ctx.lineTo(cx - 0.12 * b + (i * 0.24 * b) / 6, cy + (i % 2 ? 0.2 : 0.12) * b);
    ctx.lineTo(cx + 0.12 * b, neck + 0.05 * b);
    ctx.stroke();

    const cap = ctx.createLinearGradient(cx - 0.25 * b, 0, cx + 0.25 * b, 0);
    cap.addColorStop(0, "#050607");
    cap.addColorStop(0.55, "#23272a");
    cap.addColorStop(1, "#050607");
    ctx.fillStyle = cap;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx - 0.25 * b, capTop, 0.5 * b, neck - capTop + 0.02 * b, [0.08 * b, 0.08 * b, 0.02 * b, 0.02 * b]);
    else ctx.rect(cx - 0.25 * b, capTop, 0.5 * b, neck - capTop + 0.02 * b);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(cx - 0.25 * b, capTop + 0.14 * b, 0.5 * b, Math.max(1, 0.025 * b));
    ctx.fillRect(cx - 0.25 * b, capTop + 0.26 * b, 0.5 * b, Math.max(1, 0.025 * b));
    ctx.fillStyle = "#d1a553";
    ctx.fillRect(cx - 0.25 * b, neck - 0.04 * b, 0.5 * b, Math.max(1.5, 0.06 * b));
  };

  const placePlanets = () => {
    for (const planet of planets) {
      const p = orbitPoint(planet.r, planet.incl, planet.phase + planet.speed * time);
      planet.sx = p.x;
      planet.sy = p.y;
      planet.sz = p.z;
      planet.sr = Math.max(3.5 * dpr, planet.size * S * p.k);
    }
  };

  const drawPlanet = (planet) => {
    const { sx: x, sy: y, sr: r, rgb } = planet;
    const isOn = selected === planet;
    const lit = hovered === planet || isOn;

    if (isOn) {
      const beam = ctx.createLinearGradient(cx, cy, x, y);
      beam.addColorStop(0, "rgba(255,240,210,0.5)");
      beam.addColorStop(1, rgba(rgb, 0.7));
      ctx.strokeStyle = beam;
      ctx.lineWidth = 1.2 * dpr;
      ctx.setLineDash([3 * dpr, 5 * dpr]);
      ctx.lineDashOffset = -time * 30 * dpr;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.globalCompositeOperation = "lighter";
    const halo = ctx.createRadialGradient(x, y, 0, x, y, r * (lit ? 4.2 : 3.2));
    halo.addColorStop(0, rgba(rgb, lit ? 0.5 : 0.32));
    halo.addColorStop(1, rgba(rgb, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * (lit ? 4.2 : 3.2), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Lit from the bulb's side.
    const dx = cx - x;
    const dy = cy - y;
    const len = Math.hypot(dx, dy) || 1;
    const hx = x + (dx / len) * r * 0.5;
    const hy = y + (dy / len) * r * 0.5;
    const body = ctx.createRadialGradient(hx, hy, r * 0.05, x, y, r);
    body.addColorStop(0, rgba(mix(rgb, WHITE, 0.7), 1));
    body.addColorStop(0.4, rgba(rgb, 1));
    body.addColorStop(1, rgba(mix(rgb, BLACK, 0.78), 1));
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    if (isOn) {
      ctx.strokeStyle = rgba(rgb, 0.85);
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.9 + Math.sin(time * 3) * 1.5 * dpr, 0, Math.PI * 2);
      ctx.stroke();
    }

    const front = Math.min(1, Math.max(0, (planet.sz + 1.2) / 2.4));
    const fontSize = (width / dpr < 560 ? 9.5 : 11) * dpr;
    ctx.font = `800 ${fontSize}px Inter, ui-sans-serif, -apple-system, "Segoe UI", sans-serif`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${0.16 * fontSize}px`;
    ctx.fillStyle = lit ? rgba(mix(rgb, WHITE, 0.35), 1) : `rgba(236,241,246,${0.35 + 0.5 * front})`;
    ctx.textBaseline = "middle";
    ctx.fillText(planet.name, x + r + 7 * dpr, y);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  };

  const draw = () => {
    if (!disc) return;
    ctx.clearRect(0, 0, width, height);
    setAngles();
    placePlanets();
    drawSky();
    for (const planet of planets) drawOrbit(planet, false);
    for (const planet of planets) if (planet.sz < 0) drawPlanet(planet);
    ctx.globalCompositeOperation = "lighter";
    drawDisc();
    ctx.globalCompositeOperation = "source-over";
    drawGlow();
    drawBulb();
    for (const planet of planets) drawOrbit(planet, true);
    planets.filter((planet) => planet.sz >= 0).sort((a, b) => a.sz - b.sz).forEach(drawPlanet);
  };

  // ---- Motion ----
  let dragging = null;
  let running = false;
  let visible = true;
  let last = 0;
  let frameId = 0;

  const ease = (rate, dt) => 1 - Math.exp(-rate * dt);
  const step = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    if (!dragging) {
      view.yawVel += (DRIFT - view.yawVel) * ease(1.4, dt);
      view.pitch += (REST_PITCH - view.pitch) * ease(1.8, dt);
    }
    view.yaw += view.yawVel * dt;
    view.hoverX += (view.aimX - view.hoverX) * ease(3, dt);
    view.hoverY += (view.aimY - view.hoverY) * ease(3, dt);
    flare *= Math.exp(-dt * 2.4);
    time += dt * (selected ? 0.4 : 1) * (1 + flare * 3);
    draw();
    frameId = requestAnimationFrame(step);
  };
  const start = () => {
    if (running || still || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    frameId = requestAnimationFrame(step);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(frameId);
  };
  // With reduced motion there is no loop; the scene is redrawn only when something changes.
  const refresh = () => { if (!running) requestAnimationFrame(draw); };

  // ---- Families ----
  const select = (id) => {
    selected = planets.find((planet) => planet.id === id && planet !== selected) || null;
    for (const chip of chips) chip.setAttribute("aria-expanded", String(chip.dataset.family === selected?.id));
    for (const panel of panels) panel.classList.toggle("is-open", panel.dataset.familyPanel === selected?.id);
    refresh();
  };
  for (const chip of chips) chip.addEventListener("click", () => select(chip.dataset.family));
  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && selected) {
      const chip = chips.find((c) => c.dataset.family === selected.id);
      select(null);
      chip?.focus();
    }
  });

  // ---- Pointer ----
  const local = (event) => {
    const box = canvas.getBoundingClientRect();
    return { x: (event.clientX - box.left) * dpr, y: (event.clientY - box.top) * dpr };
  };
  const planetAt = ({ x, y }) => {
    let best = null;
    let bestD = Infinity;
    for (const planet of planets) {
      const d = Math.hypot(planet.sx - x, planet.sy - y);
      if (d < Math.max(planet.sr * 2.4, 22 * dpr) && d - planet.sz * 10 < bestD) {
        best = planet;
        bestD = d - planet.sz * 10;
      }
    }
    return best;
  };
  const onBulb = ({ x, y }) => Math.hypot(x - cx, y - cy) < S * BULB * 1.1;
  const interactive = (target) => target.closest("a, button, input, .cosmos-copy, .cosmos-family");

  root.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || interactive(event.target)) return;
    dragging = { id: event.pointerId, x: event.clientX, y: event.clientY, x0: event.clientX, y0: event.clientY, t0: performance.now(), t: performance.now(), moved: false };
    view.yawVel = 0;
  });
  root.addEventListener("pointermove", (event) => {
    if (event.pointerType === "mouse" && !dragging) {
      const box = root.getBoundingClientRect();
      view.aimX = ((event.clientX - box.left) / box.width - 0.5) * 2;
      view.aimY = ((event.clientY - box.top) / box.height - 0.5) * 2;
      const over = interactive(event.target) ? null : planetAt(local(event));
      const wantPointer = Boolean(over) || onBulb(local(event));
      if (over !== hovered) { hovered = over; refresh(); }
      root.classList.toggle("is-pointing", wantPointer);
    }
    if (!dragging || event.pointerId !== dragging.id) return;
    const dx = event.clientX - dragging.x;
    const dy = event.clientY - dragging.y;
    const now = performance.now();
    if (!dragging.moved && Math.hypot(event.clientX - dragging.x0, event.clientY - dragging.y0) > 6) {
      dragging.moved = true;
      root.classList.add("is-dragging");
      try { root.setPointerCapture(event.pointerId); } catch { /* already released */ }
      hint?.classList.add("is-done");
    }
    if (!dragging.moved) return;
    view.yaw += dx * 0.006;
    view.pitch = Math.min(1.25, Math.max(0.08, view.pitch + dy * 0.004));
    view.yawVel = (dx * 0.006) / Math.max(0.008, (now - dragging.t) / 1000);
    view.yawVel = Math.max(-3, Math.min(3, view.yawVel));
    dragging.x = event.clientX;
    dragging.y = event.clientY;
    dragging.t = now;
    refresh();
  });
  const release = (event) => {
    if (!dragging || event.pointerId !== dragging.id) return;
    const wasTap = !dragging.moved && performance.now() - dragging.t0 < 500;
    if (performance.now() - dragging.t > 90) view.yawVel = 0;
    dragging = null;
    root.classList.remove("is-dragging");
    if (!wasTap || event.type === "pointercancel") return;
    const at = local(event);
    const planet = planetAt(at);
    if (planet) select(planet.id);
    else if (onBulb(at) && !still) flare = 1;
  };
  root.addEventListener("pointerup", release);
  root.addEventListener("pointercancel", release);
  root.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") return;
    view.aimX = 0;
    view.aimY = 0;
    if (hovered) { hovered = null; refresh(); }
  });

  // ---- Life cycle ----
  new ResizeObserver(resize).observe(root);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    }).observe(root);
  }
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  root.classList.add("is-live");
  resize();
  start();
})();
