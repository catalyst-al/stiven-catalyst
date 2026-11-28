// The homepage hero: the mark in the centre (the point, with the ring drawn round it by hand; BRAND.md), the roles as
// planets on its orbits and a disc of light particles turning around it. Each planet has its own physics and its moons
// are its tools (the same drawings as the role cards, partials/family-planet.njk): Pulse cracks and
// beats inside a heartbeat ring, Zenith is a contour map under a radar, Lumen shines inside a ring
// of dust in five parts, Atlas is a globe with a constellation on its lit side. Dragging turns and
// tilts the system; the point never moves. A tap on a planet (or on its button) opens that role's tools, a tap on a
// moon opens that tool, a tap on the mark draws its ring again and hurries the system for a moment. A small reader sits
// by the point on the inner orbit; it runs to the planet that is opened, jumps to a moon that is tapped, and
// sleeps when left alone. When the hero first runs the room is dark and only the point is there; the ring is drawn
// round it as the light comes up, and the system turns to show the planet that is opened and comes a little closer to it.
(() => {
  const root = document.querySelector("[data-cosmos]");
  const canvas = root?.querySelector("canvas");
  const anchor = root?.querySelector("[data-cosmos-anchor]");
  const ctx = canvas?.getContext("2d");
  if (!root || !anchor || !ctx) return;

  const chips = [...root.querySelectorAll("[data-family]")];
  const panels = [...root.querySelectorAll("[data-family-panel]")];
  const hint = root.querySelector("[data-cosmos-hint]");
  // Still: the motion of the site is paused (<html data-motion="paused">: the switch "Pause the motion" at the foot of
  // the page and beside the planets, script.js; and, until the reader chooses, reduced motion). Then the scene is
  // drawn only when it changes, with the light already on.
  const page = document.documentElement;
  let still = page.dataset.motion === "paused";

  const rgbOf = (hex) => {
    const n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`;
  const mix = ([r, g, b], [r2, g2, b2], t) => [r + (r2 - r) * t, g + (g2 - g) * t, b + (b2 - b) * t].map(Math.round);
  const WHITE = [255, 255, 255];
  const BLACK = [4, 6, 9];
  const SIZES = [0.044, 0.052, 0.058, 0.05, 0.042];
  // How far a planet's ring and moons reach, in its radii; the name is written beyond it.
  const REACH = { pulse: 1.9, zenith: 1.8, lumen: 2.7, atlas: 1.8 };

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
      // The moons are the role's tools, from the panel's list: tapping one opens that tool.
      moons: [...panel.querySelectorAll("ul a")].map((a) => ({ name: a.querySelector("span")?.textContent || "", url: a.href, x: 0, y: 0, front: false, size: 0 })),
      reach: REACH[panel.dataset.familyPanel] || 1.8,
      sx: 0, sy: 0, sz: 0, sr: 0,
    };
  });

  // The planets' own shapes, in planet radii. A fixed seed keeps them the same on every visit.
  const seeded = (seed) => () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const CRACKS = (() => {
    const rnd = seeded(11);
    return Array.from({ length: 9 }, () => {
      let angle = rnd() * Math.PI * 2;
      let d = rnd() * 0.5;
      const pts = [];
      for (let k = 0; k < 7; k += 1) {
        pts.push([d * Math.cos(angle), d * Math.sin(angle)]);
        angle += (rnd() - 0.5) * 1.4;
        d += 0.13 + rnd() * 0.08;
      }
      return pts;
    });
  })();
  const RING_DUST = (() => {
    const rnd = seeded(5);
    return Array.from({ length: 150 }, () => [rnd() * Math.PI * 2, 1.55 + rnd() * 0.95, rnd()]);
  })();
  const CONTOURS = [-66, -44, -22, 0, 22, 44, 66].map((lat, i) => ({ la: (lat * Math.PI) / 180, major: i % 3 === 0 }));
  const PARALLELS = [-60, -30, 0, 30, 60].map((lat) => (lat * Math.PI) / 180);
  const CONSTELLATION = [[-0.55, 0.45], [-0.4, 0.2], [-0.22, 0.3], [-0.05, 0.02], [0.1, 0.1], [0.22, -0.2], [0.36, -0.12], [0.42, -0.42], [0.55, -0.62]];
  const GOLD_WHITE = [255, 243, 208];
  const SILVER = [200, 208, 216];
  const SILVER_HALO = [140, 170, 200];
  // The spikes of the heartbeat ring, three beats around it.
  const beatAt = (phase) => {
    if (phase > 2.3 && phase < 2.5) return -(phase - 2.3) * 3;
    if (phase >= 2.5 && phase < 2.7) return 1.3 - (phase - 2.5) * 11;
    if (phase >= 2.7 && phase < 2.9) return -0.9 + (phase - 2.7) * 4.5;
    return 0;
  };

  // Particles: two spiral arms and a thin dust disc, stored flat for speed.
  const PALETTE = [[226, 238, 255], [132, 198, 247], [246, 204, 128], [176, 156, 250]];
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
  // The light of the room, 0 (dark) to 1; with the motion paused it is simply on.
  let warmT = 0;
  let warm = still ? 1 : 0;
  // How long the ring has been drawing, in seconds: it starts with the light and again when the mark is tapped.
  let ringT = 0;
  // The camera follows the opened planet until a drag takes over; zoom brings the system closer while open.
  let follow = false;
  let zoom = 0;
  const ZOOM = 0.08;
  let selected = null;
  let hovered = null;
  let hoveredMoon = null;
  let dpr = 1;
  // Quality: a device that cannot hold the frame rate gets the canvas at a lower density and with
  // fewer particles, a step at a time (1, then 0.75, then 0.5); a device that keeps up never changes.
  let quality = 1;
  const pace = { n: 0, slow: 0 };
  let width = 0;
  // The scene is laid out on the whole hero (width x height, in canvas pixels), but drawn on three canvases: the planets'
  // band (this canvas: everything that moves around the light, with the stars behind it) and, where the hero is taller
  // than that band (on a phone the words stand above the planets and the books below them), a canvas above and one
  // below it with the stars of the rest of the sky. Each is drawn only while it is on screen or near it, and the band
  // is far smaller than the hero on a phone, so a frame costs a fraction of the whole hero; every pixel is where it was.
  let height = 0;
  let bandTop = 0;
  let bandBottom = 0;
  let cx = 0;
  let cy = 0;
  let S = 1;
  let S0 = 1;
  const D = 4;
  // The mark (BRAND.md): the point, a square that never moves, with the ring drawn round it by hand. MARK is the side
  // of the mark's own box of 100, in radii of the system; the point is at (50, 52) in that box and 16 wide. The ring
  // is the drawing of the header (--mark-ring-display, css/01-foundation.css), kept here as its centre line and its
  // width along it, so that it can be drawn only as far as the pen has come.
  const MARK = 0.4;
  const POINT = { x: 50, y: 52, side: 16 };
  const RING_TIME = 1.3;
  const RING = (() => {
    const widths = [[0, 0.66], [0.1, 0.94], [0.42, 1], [0.75, 0.82], [0.92, 0.5], [1, 0.22]];
    const widthAt = (t) => {
      for (let i = 0; i < widths.length - 1; i += 1) {
        const [t0, w0] = widths[i];
        const [t1, w1] = widths[i + 1];
        if (t >= t0 && t <= t1) return 9 * (w0 + (w1 - w0) * (1 - Math.cos((Math.PI * (t - t0)) / (t1 - t0))) / 2);
      }
      return 9 * 0.22;
    };
    const n = 320;
    const rot = (8 * Math.PI) / 180;
    const centre = [];
    for (let i = 0; i <= n; i += 1) {
      const t = i / n;
      const angle = ((250 - 398 * t) * Math.PI) / 180;
      const grow = t < 0.64 ? 1 : 1 + 0.37 * Math.pow((t - 0.64) / 0.36, 1.7);
      const x = 34.5 * grow * Math.cos(angle);
      const y = 30 * grow * Math.sin(angle);
      centre.push([POINT.x + x * Math.cos(rot) - y * Math.sin(rot), POINT.y + x * Math.sin(rot) + y * Math.cos(rot), widthAt(t) / 2]);
    }
    // The two edges of the stroke, a half width to each side of the centre line.
    const left = [];
    const right = [];
    for (let i = 0; i <= n; i += 1) {
      const a = centre[Math.max(i - 1, 0)];
      const b = centre[Math.min(i + 1, n)];
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const nx = -(b[1] - a[1]) / d;
      const ny = (b[0] - a[0]) / d;
      const [x, y, w] = centre[i];
      left.push([x + nx * w, y + ny * w]);
      right.push([x - nx * w, y - ny * w]);
    }
    return { n, centre, left, right, full: null };
  })();
  // The ring as far as it is drawn (0 to 1), in the mark's box: the body of the stroke (along one edge and back along
  // the other) and how far along the centre line the pen is; the two round ends are drawn with it (drawMark).
  const ringShape = (upto) => {
    if (upto >= 1 && RING.full) return RING.full;
    const m = Math.max(2, Math.round(Math.min(1, upto) * RING.n));
    const body = new Path2D();
    body.moveTo(RING.left[0][0], RING.left[0][1]);
    for (let i = 1; i <= m; i += 1) body.lineTo(RING.left[i][0], RING.left[i][1]);
    for (let i = m; i >= 0; i -= 1) body.lineTo(RING.right[i][0], RING.right[i][1]);
    body.closePath();
    const shape = { body, m };
    if (upto >= 1) RING.full = shape;
    return shape;
  };

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

  // The three canvases (see width and height above). Each knows the rows of the hero it shows, and whether it is near
  // the view (seen).
  const layerOf = (c, context) => ({ canvas: c, ctx: context, y0: 0, rows: 0, seen: true });
  const skyCanvas = () => {
    const c = document.createElement("canvas");
    c.className = "cosmos-canvas";
    c.setAttribute("aria-hidden", "true");
    c.style.display = "none";
    canvas.before(c);
    return layerOf(c, c.getContext("2d"));
  };
  const band = layerOf(canvas, ctx);
  const skyAbove = skyCanvas();
  const skyBelow = skyCanvas();
  const layers = [band, skyAbove, skyBelow];
  // A canvas over the rows y0 to y1 of the hero, one canvas pixel to one pixel of the screen; none where there are none.
  const place = (layer, y0, y1) => {
    const rows = Math.max(0, y1 - y0);
    layer.y0 = y0;
    layer.rows = rows;
    layer.canvas.style.display = rows ? "" : "none";
    layer.canvas.width = rows ? width : 0;
    layer.canvas.height = rows;
    layer.canvas.style.top = `${y0 / dpr}px`;
    layer.canvas.style.height = `${rows / dpr}px`;
    // Seen from here on (02-homepage.css keeps the empty, unplaced canvas out of sight).
    layer.canvas.classList.add("is-placed");
  };

  const resize = () => {
    dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2) * quality);
    const box = root.getBoundingClientRect();
    const spot = anchor.getBoundingClientRect();
    width = Math.max(1, Math.round(box.width * dpr));
    height = Math.max(1, Math.round(box.height * dpr));
    cx = (spot.left - box.left + spot.width / 2) * dpr;
    cy = (spot.top - box.top + spot.height / 2) * dpr;
    S0 = Math.min(spot.width / 2 / (spot.width < 560 ? 1.24 : 1.32), spot.height / 2 / 0.66) * dpr;
    S = S0 * (1 + ZOOM * zoom);
    // The band: as far as the farthest particle can reach, the system tilted and drawn closer as far as it goes
    // (2.26 radii of the system down, 1.9 up; the glow, 1.3 radii), with room to spare.
    const reach = 2.5 * S0 * (1 + ZOOM) + 16 * dpr;
    bandTop = Math.max(0, Math.floor(cy - reach));
    bandBottom = Math.min(height, Math.ceil(cy + reach));
    place(band, bandTop, bandBottom);
    place(skyAbove, 0, bandTop);
    place(skyBelow, bandBottom, height);
    const count = Math.round(Math.min(2600, Math.max(900, (spot.width * spot.height) / 120)) * quality);
    if (!disc || Math.abs(disc.n - count) > 250) buildParticles(count);
    draw(true);
  };

  // ---- Drawing ----
  // The stars of the sky between the rows y0 and y1 of the hero (those of a layer, with any that overlap its edge).
  const drawSky = (c, y0, y1) => {
    c.fillStyle = "#dfe9f5";
    const shift = view.yaw * 14 * dpr;
    for (const star of sky) {
      const y = star.y * height;
      const s = star.s * dpr;
      if (y + s <= y0 || y >= y1) continue;
      const x = ((star.x * width + shift * star.d) % width + width) % width;
      c.globalAlpha = (0.18 + 0.4 * star.d) * (0.7 + 0.3 * Math.sin(time * 1.7 + star.tw));
      c.fillRect(x, y, s, s);
    }
    c.globalAlpha = 1;
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
    // The inside of the ring stays clear: the point stands alone in it.
    const clear = (S * MARK * 0.45) ** 2;
    let current = -1;
    for (let i = 0; i < n; i += 1) {
      if (colour[i] !== current) {
        current = colour[i];
        ctx.fillStyle = rgba(PALETTE[current], 1);
      }
      const angle = a[i] + speed[i] * time;
      const p = project(r[i] * Math.cos(angle), y[i], r[i] * Math.sin(angle));
      if (p.x < -4 || p.y < bandTop - 4 || p.x > width + 4 || p.y > bandBottom + 4) continue;
      if ((p.x - cx) ** 2 + (p.y - cy) ** 2 < clear) continue;
      const near = r[i] < 0.6 ? 1.35 : 1;
      const depth = 0.5 + 0.5 * Math.min(1, Math.max(0, (p.z + 1.4) / 2.8));
      ctx.globalAlpha = Math.min(1, depth * near * (0.55 + 0.45 * Math.sin(time * 2.2 + tw[i])));
      const s = size[i] * p.k * dpr;
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  };

  // The light of the system: cool, soft, and none of it inside the ring. It breathes a little, and dims while the
  // reader sleeps.
  const drawGlow = () => {
    const breathe = 1 + 0.05 * Math.sin(time * 1.3) + flare * 0.55;
    const reach = S * 1.3 * breathe;
    // Before the hero has a size (WebKit draws a first frame while its anchor still measures nothing) there is no
    // glow to draw: the ring below would be 0 / 0, and a colour stop at "not a number" is an error in every browser
    // (it showed in Safari's engine on every visit of the homepage, once).
    if (!(reach > 0)) return;
    const ring = (S * MARK * 0.45) / reach;
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = warm * dim;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, reach);
    g.addColorStop(0, "rgba(214,232,255,0)");
    g.addColorStop(ring, "rgba(214,232,255,0)");
    g.addColorStop(Math.min(0.9, ring * 2.1), "rgba(214,232,255,0.11)");
    g.addColorStop(Math.min(0.95, ring * 3.8), "rgba(74,181,247,0.06)");
    g.addColorStop(1, "rgba(74,181,247,0)");
    ctx.fillStyle = g;
    // Filled as the disc of the gradient, not its square: past its radius the gradient adds nothing ("lighter" with a
    // transparent colour), so the pixels are the same and the corners cost nothing.
    circle(cx, cy, reach);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  };

  // The light that falls on the plane of the orbits, round the point.
  const drawPool = () => {
    const p = project(0, 0, 0);
    const rx = S * 0.55 * (1 + flare * 0.3);
    const ry = Math.max(rx * 0.12, rx * Math.abs(sinP));
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rx);
    g.addColorStop(0, `rgba(214,232,255,${(0.1 + flare * 0.1) * warm})`);
    g.addColorStop(0.5, `rgba(160,205,247,${0.04 * warm})`);
    g.addColorStop(1, "rgba(160,205,247,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  };

  // The mark: flat, in two colours, no glow of its own. The point is always there and never moves; the ring is drawn
  // round it once as the light comes up, and again when the mark is tapped.
  const smooth = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const drawMark = () => {
    const k = (S * MARK) / 100;
    const drawn = still ? 1 : smooth(Math.min(1, ringT / RING_TIME));
    ctx.save();
    ctx.translate(cx - POINT.x * k, cy - POINT.y * k);
    ctx.scale(k, k);
    if (drawn > 0.004) {
      const { body, m } = ringShape(drawn);
      ctx.fillStyle = "#f6f7f4";
      ctx.fill(body);
      for (const [x, y, w] of [RING.centre[0], RING.centre[m]]) {
        ctx.beginPath();
        ctx.arc(x, y, w, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = "#4ab5f7";
    ctx.fillRect(POINT.x - POINT.side / 2, POINT.y - POINT.side / 2, POINT.side, POINT.side);
    ctx.restore();
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

  // ---- The planets ----
  // All take the planet's screen position and radius; (ux, uy) points at the centre, which lights them.
  const circle = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); };
  const sphere = (x, y, r, rgb, ux, uy) => {
    const body = ctx.createRadialGradient(x + ux * r * 0.5, y + uy * r * 0.5, r * 0.05, x, y, r);
    body.addColorStop(0, rgba(mix(rgb, WHITE, 0.7), 1));
    body.addColorStop(0.42, rgba(rgb, 1));
    body.addColorStop(1, rgba(mix(rgb, BLACK, 0.68), 1));
    ctx.fillStyle = body;
    circle(x, y, r);
    ctx.fill();
  };
  const shade = (x, y, r, ux, uy, depth) => {
    const g = ctx.createRadialGradient(x + ux * r * 0.55, y + uy * r * 0.55, r * 0.3, x, y, r * 1.4);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.5, `rgba(0,0,0,${0.08 * depth})`);
    g.addColorStop(0.8, `rgba(0,0,0,${0.42 * depth})`);
    g.addColorStop(1, `rgba(0,0,0,${0.7 * depth})`);
    ctx.fillStyle = g;
    circle(x, y, r);
    ctx.fill();
  };
  const halo = (x, y, r, rgb, reach, strength) => {
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * reach);
    g.addColorStop(0, rgba(rgb, strength));
    g.addColorStop(1, rgba(rgb, 0));
    ctx.fillStyle = g;
    circle(x, y, r * reach);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  };
  // The moons go round on an ellipse; the half with sin(a) < 0 passes behind the planet. They grow
  // while their planet is open, and the one under the mouse shows the name of its tool.
  const drawMoons = (planet, front) => {
    const { sx: x, sy: y, sr: r, rgb, moons, reach } = planet;
    const rx = r * reach;
    const ry = rx * 0.3;
    const open = selected === planet || hovered === planet;
    const size = Math.max(1.6 * dpr, r * (open ? 0.16 : 0.12));
    for (let i = 0; i < moons.length; i += 1) {
      const moon = moons[i];
      const a = time * 0.4 + (i / moons.length) * Math.PI * 2 + 0.6;
      moon.front = Math.sin(a) > 0;
      moon.x = x + Math.cos(a) * rx;
      moon.y = y + Math.sin(a) * ry;
      moon.size = size;
      if (moon.front !== front) continue;
      const lit = moon === hoveredMoon;
      if (lit) {
        ctx.globalCompositeOperation = "lighter";
        const glow = ctx.createRadialGradient(moon.x, moon.y, 0, moon.x, moon.y, size * 4);
        glow.addColorStop(0, rgba(rgb, 0.6));
        glow.addColorStop(1, rgba(rgb, 0));
        ctx.fillStyle = glow;
        circle(moon.x, moon.y, size * 4);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.fillStyle = lit ? "#fff" : rgba(mix(rgb, WHITE, 0.6), front ? 1 : 0.6);
      circle(moon.x, moon.y, lit ? size * 1.5 : size);
      ctx.fill();
      if (lit) {
        const fontSize = (width / dpr < 560 ? 9.5 : 10.5) * dpr;
        ctx.font = `800 ${fontSize}px Inter, ui-sans-serif, -apple-system, "Segoe UI", sans-serif`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(4,6,9,.75)";
        ctx.fillRect(moon.x - ctx.measureText(moon.name).width / 2 - 5 * dpr, moon.y - size * 2 - fontSize * 1.25, ctx.measureText(moon.name).width + 10 * dpr, fontSize * 1.5);
        ctx.fillStyle = "#fff";
        ctx.fillText(moon.name, moon.x, moon.y - size * 2 - fontSize * 0.5);
        ctx.textAlign = "start";
      }
    }
  };

  // Pulse: cracks that light up in the rhythm of a heartbeat, inside a ring that is an ECG trace.
  const heartRing = (x, y, r, front) => {
    ctx.beginPath();
    let open = false;
    for (let i = 0; i <= 96; i += 1) {
      const a = (i / 96) * Math.PI * 2 + time * 0.3;
      if ((Math.sin(a) > 0) !== front) { open = false; continue; }
      const phase = ((a * 3) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const px = x + Math.cos(a) * r * 1.9;
      const py = y + Math.sin(a) * r * 0.57 + beatAt(phase) * r * 0.22;
      if (open) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      open = true;
    }
    ctx.stroke();
  };
  const drawPulse = (planet, ux, uy) => {
    const { sx: x, sy: y, sr: r, rgb } = planet;
    const beat = Math.pow(Math.max(0, Math.sin(time * 5.5)), 10) + Math.pow(Math.max(0, Math.sin(time * 5.5 - 0.6)), 20) * 0.5;
    halo(x, y, r, rgb, 2.8 + beat * 0.8, 0.32);
    ctx.lineWidth = Math.max(1, r * 0.06) * dpr * 0.6;
    ctx.strokeStyle = rgba(rgb, 0.45);
    heartRing(x, y, r, false);
    drawMoons(planet, false);
    sphere(x, y, r, rgb, ux, uy);
    ctx.save();
    circle(x, y, r);
    ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = rgba(mix(rgb, WHITE, 0.75), 0.4 + beat * 0.55);
    ctx.lineWidth = Math.max(1, r * 0.05);
    ctx.beginPath();
    for (const crack of CRACKS) crack.forEach(([px, py], i) => (i ? ctx.lineTo(x + px * r, y + py * r) : ctx.moveTo(x + px * r, y + py * r)));
    ctx.stroke();
    ctx.restore();
    shade(x, y, r, ux, uy, 1);
    ctx.lineWidth = Math.max(1, r * 0.06) * dpr * 0.6;
    ctx.strokeStyle = rgba(mix(rgb, WHITE, 0.3), 0.95);
    heartRing(x, y, r, true);
    drawMoons(planet, true);
  };

  // Zenith: a map seen from above, contour lines and a polar cap, with a radar sweeping it.
  const drawZenith = (planet, ux, uy) => {
    const { sx: x, sy: y, sr: r, rgb } = planet;
    halo(x, y, r, rgb, 3.2, 0.32);
    drawMoons(planet, false);
    sphere(x, y, r, mix(rgb, WHITE, 0.12), ux, uy);
    ctx.save();
    circle(x, y, r);
    ctx.clip();
    for (const { la, major } of CONTOURS) {
      const rx = Math.cos(la) * r;
      ctx.strokeStyle = major ? "rgba(255,255,255,.8)" : rgba(mix(rgb, WHITE, 0.7), 0.42);
      ctx.lineWidth = Math.max(0.8, r * (major ? 0.024 : 0.014));
      ctx.beginPath();
      ctx.ellipse(x, y + Math.sin(la) * r * 0.98, Math.max(0.5, rx), Math.max(0.3, rx * 0.22), 0, 0, Math.PI);
      ctx.stroke();
    }
    const cap = ctx.createRadialGradient(x, y - r * 0.92, 0, x, y - r * 0.92, r * 0.5);
    cap.addColorStop(0, "rgba(255,255,255,.75)");
    cap.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = cap;
    ctx.fillRect(x - r, y - r, r * 2, r);
    const sweep = time * 1.2;
    ctx.globalCompositeOperation = "lighter";
    if (ctx.createConicGradient) {
      const g = ctx.createConicGradient(sweep, x, y);
      g.addColorStop(0, rgba(rgb, 0));
      g.addColorStop(0.8, rgba(rgb, 0));
      g.addColorStop(1, "rgba(255,255,255,.5)");
      ctx.fillStyle = g;
      circle(x, y, r);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(255,255,255,.8)";
    ctx.lineWidth = Math.max(1, r * 0.02);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(sweep) * r, y + Math.sin(sweep) * r);
    ctx.stroke();
    ctx.restore();
    shade(x, y, r, ux, uy, 0.8);
    drawMoons(planet, true);
  };

  // Lumen: shines by itself, inside a ring of dust in five parts (the five steps of DMAIC).
  const dustRing = (planet, front) => {
    const { sx: x, sy: y, sr: r, rgb } = planet;
    ctx.globalCompositeOperation = "lighter";
    const q = Math.max(1, r * 0.06);
    const part = (Math.PI * 2) / 5;
    for (const [a0, d, s] of RING_DUST) {
      const a = a0 + (time * 0.25) / d;
      if ((Math.sin(a) > 0) !== front) continue;
      const turn = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      if (turn % part < 0.09) continue;
      ctx.fillStyle = rgba(Math.floor(turn / part) % 2 ? mix(rgb, WHITE, 0.4) : rgb, 0.35 + s * 0.5);
      ctx.fillRect(x + Math.cos(a) * r * d, y + Math.sin(a) * r * d * 0.32, q * (0.6 + s), q * (0.6 + s));
    }
    ctx.globalCompositeOperation = "source-over";
  };
  const drawLumen = (planet) => {
    const { sx: x, sy: y, sr: r, rgb } = planet;
    halo(x, y, r, rgb, 3.6, 0.35);
    halo(x, y, r, GOLD_WHITE, 1.9, 0.35);
    dustRing(planet, false);
    drawMoons(planet, false);
    const g = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r);
    g.addColorStop(0, "#fff");
    g.addColorStop(0.35, "#fff4d6");
    g.addColorStop(0.8, rgba(rgb, 1));
    g.addColorStop(1, rgba(mix(rgb, BLACK, 0.3), 1));
    ctx.fillStyle = g;
    circle(x, y, r);
    ctx.fill();
    dustRing(planet, true);
    drawMoons(planet, true);
  };

  // Atlas: a globe with meridians and parallels, half in the light, and the path of a career as a constellation.
  const drawAtlas = (planet, ux, uy) => {
    const { sx: x, sy: y, sr: r, rgb } = planet;
    halo(x, y, r, SILVER_HALO, 2.6, 0.3);
    drawMoons(planet, false);
    sphere(x, y, r, SILVER, ux, uy);
    ctx.save();
    circle(x, y, r);
    ctx.clip();
    ctx.strokeStyle = "rgba(255,255,255,.35)";
    ctx.lineWidth = Math.max(0.8, r * 0.015);
    ctx.beginPath();
    for (let i = 0; i < 4; i += 1) ctx.ellipse(x, y, Math.max(0.3, Math.abs(Math.cos(time * 0.35 + (i * Math.PI) / 4)) * r), r, 0, 0, Math.PI * 2);
    for (const la of PARALLELS) ctx.ellipse(x, y + Math.sin(la) * r, Math.max(0.3, Math.cos(la) * r), Math.max(0.3, Math.cos(la) * r * 0.14), 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "rgba(255,255,255,.7)";
    ctx.lineWidth = Math.max(1, r * 0.035);
    ctx.beginPath();
    CONSTELLATION.forEach(([px, py], i) => (i ? ctx.lineTo(x + px * r, y + py * r) : ctx.moveTo(x + px * r, y + py * r)));
    ctx.stroke();
    ctx.fillStyle = "#fff";
    CONSTELLATION.forEach(([px, py], i) => {
      circle(x + px * r, y + py * r, r * (i === CONSTELLATION.length - 1 ? 0.07 : 0.035));
      ctx.fill();
    });
    ctx.restore();
    const night = ctx.createLinearGradient(x + ux * r, y + uy * r, x - ux * r, y - uy * r);
    night.addColorStop(0, "rgba(5,8,11,0)");
    night.addColorStop(0.55, "rgba(5,8,11,.05)");
    night.addColorStop(0.7, "rgba(5,8,11,.8)");
    night.addColorStop(1, "rgba(5,8,11,.95)");
    ctx.fillStyle = night;
    circle(x, y, r);
    ctx.fill();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = rgba(mix(rgb, WHITE, 0.5), 0.35);
    ctx.lineWidth = Math.max(1, r * 0.03);
    ctx.beginPath();
    ctx.arc(x, y, r * 0.985, Math.atan2(uy, ux) - 1.3, Math.atan2(uy, ux) + 1.3);
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
    drawMoons(planet, true);
  };
  const DRAWERS = { pulse: drawPulse, zenith: drawZenith, lumen: drawLumen, atlas: drawAtlas };

  const drawPlanet = (planet) => {
    const { sx: x, sy: y, sr: r, rgb } = planet;
    const isOn = selected === planet;
    const lit = hovered === planet || isOn;

    if (isOn) {
      const beam = ctx.createLinearGradient(cx, cy, x, y);
      beam.addColorStop(0, "rgba(226,238,255,0.5)");
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
    if (lit) halo(x, y, r, rgb, 4.2, 0.4);

    // Lit from the centre's side.
    const dx = cx - x;
    const dy = cy - y;
    const len = Math.hypot(dx, dy) || 1;
    (DRAWERS[planet.id] || ((p, ux, uy) => { halo(x, y, r, rgb, 3.2, 0.32); sphere(x, y, r, rgb, ux, uy); }))(planet, dx / len, dy / len);

    if (isOn) {
      ctx.strokeStyle = rgba(rgb, 0.85);
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath();
      ctx.arc(x, y, r * (planet.reach + 0.4) + Math.sin(time * 3) * 1.5 * dpr, 0, Math.PI * 2);
      ctx.stroke();
    }

    const front = Math.min(1, Math.max(0, (planet.sz + 1.2) / 2.4));
    const fontSize = (width / dpr < 560 ? 9.5 : 11) * dpr;
    ctx.font = `800 ${fontSize}px Inter, ui-sans-serif, -apple-system, "Segoe UI", sans-serif`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${0.16 * fontSize}px`;
    ctx.fillStyle = lit ? rgba(mix(rgb, WHITE, 0.35), 1) : `rgba(236,241,246,${0.35 + 0.5 * front})`;
    ctx.textBaseline = "middle";
    ctx.fillText(planet.name, x + r * (planet.reach + 0.2) + 6 * dpr, y);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  };

  // ---- The reader: a small figure by the point ----
  // A pictogram, no face, sitting on two books on the inner orbit in the pool of light, reading. Now and
  // then it looks up, stretches or walks a few steps; left alone for a minute it dozes off over its book,
  // and the light dims a little. When a planet is opened it runs there along the beam and stands on it; when
  // a moon is tapped it jumps to the moon as the tool opens; when the planet is closed it comes back
  // and sits down to read. With reduced motion it only sits, or stands on the open planet.
  const reader = {
    state: "read", t: 0, next: 4 + Math.random() * 6, idle: 0,
    x: 0, y: 0, s: 1, face: 1, from: { x: 0, y: 0 }, target: null, walkDir: 1, walkOff: 0, bx: 0, by: 0, bs: 1,
  };
  let dim = 1;
  const inner = planets.reduce((a, p) => (p.r < a.r ? p : a), planets[0] || { r: 0.46, incl: 0 });
  // The seat: the front of the inner orbit, a little to the left of the mark, whatever the turn of the system.
  const seatPoint = (off = reader.walkOff) => orbitPoint(inner.r, inner.incl, Math.PI / 2 - (view.yaw + view.hoverX * 0.22) + 0.45 + off);
  const readerScale = (k) => Math.max((15 * dpr) / 34, (0.1 * S * Math.min(1.2, k)) / 34);
  const toRead = () => { reader.state = "read"; reader.t = 0; reader.next = 6 + Math.random() * 8; reader.walkOff = 0; };
  const startRun = (planet) => { reader.from = { x: reader.x, y: reader.y }; reader.target = planet; reader.state = "run"; reader.t = 0; };
  const startBack = () => { reader.from = { x: reader.x, y: reader.y }; reader.target = null; reader.state = "back"; reader.t = 0; };
  const jumpTo = (moon) => { reader.from = { x: reader.x, y: reader.y }; reader.target = { sx: moon.x, sy: moon.y, sr: moon.size }; reader.state = "jump"; reader.t = 0; };

  const updateReader = (dt) => {
    reader.t += dt;
    reader.idle += dt;
    const open = selected;
    switch (reader.state) {
      case "read":
        if (open) startRun(open);
        else if (reader.idle > 60) { reader.state = "sleep"; reader.t = 0; }
        else if (reader.t > reader.next) {
          const act = Math.random();
          reader.state = act < 0.4 ? "lookup" : act < 0.7 ? "stretch" : "walk";
          reader.walkDir = Math.random() < 0.5 ? -1 : 1;
          reader.t = 0;
        }
        break;
      case "lookup": if (open) startRun(open); else if (reader.t > 1.8) toRead(); break;
      case "stretch": if (open) startRun(open); else if (reader.t > 2) toRead(); break;
      case "walk":
        if (open) { startRun(open); break; }
        reader.walkOff += reader.walkDir * 0.3 * dt * (reader.t < 2.4 ? 1 : -1);
        if (reader.t > 4.8) toRead();
        break;
      case "sleep": if (reader.idle < 1 || open) { reader.state = "wake"; reader.t = 0; } break;
      case "wake": if (reader.t > 0.7) { if (open) startRun(open); else toRead(); } break;
      case "run":
        if (!open) startBack();
        else if (open !== reader.target) startRun(open);
        else if (reader.t > 0.7) { reader.state = "stand"; reader.t = 0; }
        break;
      case "stand": if (!open) startBack(); else if (open !== reader.target) startRun(open); break;
      case "back": if (open) startRun(open); else if (reader.t > 0.7) toRead(); break;
      default: break;
    }
    dim += ((reader.state === "sleep" ? 0.7 : 1) - dim) * ease(2, dt);
  };

  const placeReader = () => {
    if (still) { reader.state = selected ? "stand" : "read"; reader.target = selected; }
    const seat = seatPoint();
    let x = seat.x;
    let y = seat.y;
    let k = seat.k;
    const moving = reader.state === "run" || reader.state === "jump" || reader.state === "back";
    if (moving) {
      const dur = reader.state === "jump" ? 0.26 : 0.7;
      const u = smooth(Math.min(1, reader.t / dur));
      const tx = reader.state === "back" ? seat.x : reader.target.sx;
      const ty = reader.state === "back" ? seat.y : reader.target.sy - reader.target.sr;
      x = reader.from.x + (tx - reader.from.x) * u;
      y = reader.from.y + (ty - reader.from.y) * u - Math.sin(u * Math.PI) * (reader.state === "jump" ? 10 : 6) * dpr;
      if (Math.abs(tx - reader.from.x) > 1) reader.face = Math.sign(tx - reader.from.x);
    } else if (reader.state === "stand" && reader.target) {
      x = reader.target.sx;
      y = reader.target.sy - reader.target.sr;
      k = reader.target.sr / (inner.size * S) || k;
    } else if (reader.state === "walk") {
      if (Math.abs(x - reader.x) > 0.2) reader.face = Math.sign(x - reader.x);
    } else {
      // Seated, it faces the light it reads by.
      reader.face = 1;
    }
    reader.x = x;
    reader.y = y;
    reader.s = readerScale(k);
    const home = seatPoint(0);
    reader.bx = home.x;
    reader.by = home.y;
    reader.bs = readerScale(home.k);
  };

  // The reader is a pictogram in the light of the centre: one warm colour, thick rounded limbs and a head
  // apart from the body, sitting on two books with an open book in its hands. The books stay at the
  // seat while it runs to a planet.
  const FIGURE = "rgb(255,243,224)";
  const FAR = "rgba(255,232,200,0.62)";
  const drawBooks = () => {
    const { bx, by, bs } = reader;
    ctx.save();
    ctx.translate(bx, by);
    ctx.scale(bs, bs);
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(-3.5, 0.6, 9, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
    const book = (x0, y0, w, cover) => {
      ctx.fillStyle = cover;
      ctx.beginPath();
      ctx.roundRect(x0, y0, w, 4, 1);
      ctx.fill();
      ctx.fillStyle = "rgba(255,246,230,0.85)";
      ctx.fillRect(x0 + 1.6, y0 + 1.55, w - 2.4, 0.9);
    };
    book(-10, -4, 13, "rgb(196,128,72)");
    book(-9, -8, 11, "rgb(226,176,110)");
    ctx.restore();
  };

  const drawReader = () => {
    const { x, y, s, face, state, t } = reader;
    drawBooks();
    // A soft light around the figure instead of a shadow blur, which is costly every frame.
    ctx.globalCompositeOperation = "lighter";
    const aura = ctx.createRadialGradient(x, y - 16 * s, 0, x, y - 16 * s, 30 * s);
    aura.addColorStop(0, "rgba(255,236,200,0.26)");
    aura.addColorStop(1, "rgba(255,236,200,0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(x, y - 16 * s, 30 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * face, s);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const head = (hx, hy) => { ctx.fillStyle = FIGURE; ctx.beginPath(); ctx.arc(hx, hy, 3.7, 0, Math.PI * 2); ctx.fill(); };
    const limb = (w, colour, ...pts) => {
      ctx.lineWidth = w;
      ctx.strokeStyle = colour;
      ctx.beginPath();
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.stroke();
    };
    const body = (...pts) => limb(6.2, FIGURE, ...pts);
    const leg = (...pts) => limb(4.4, FIGURE, ...pts);
    const arm = (...pts) => limb(3.4, FIGURE, ...pts);
    // An open book: two pages from the spine; while a page turns it sweeps from right to left.
    const openBook = (bx, by, turn) => {
      limb(2.8, "rgb(214,150,84)", bx - 3.8, by - 4.8, bx, by, bx + 4, by - 4.4);
      limb(1.2, "rgb(255,250,240)", bx - 3.2, by - 4.6, bx, by - 0.6, bx + 3.4, by - 4.3);
      if (turn > 0 && turn < 1) {
        const a = -0.86 + (-2.21 + 0.86) * smooth(turn);
        limb(1.2, "rgb(255,250,240)", bx, by - 0.6, bx + Math.cos(a) * 5.4, by - 0.6 + Math.sin(a) * 5.4);
      }
    };
    const closedBook = (bx, by) => limb(2.4, "rgb(226,176,110)", bx - 2.6, by, bx + 2.6, by);
    const bob = Math.sin(time * 2) * 0.4;
    // Sitting: hip on the books, knee forward, foot on the ground.
    const sit = (tap = 0) => {
      leg(-3, -10.4, 6, -11.6, 7, -1.2 + tap, 9.4, -1 + tap);
    };
    if (state === "read" || state === "lookup" || state === "wake") {
      const up = state === "lookup" ? Math.min(1, t / 0.4) * (t > 1.4 ? Math.max(0, 1 - (t - 1.4) / 0.4) : 1) : 0;
      const eyes = Math.sin(time * 1.1) * 0.4;
      const page = (time % 3.4) / 3.4;
      const tap = -1.2 * Math.max(0, Math.sin(time * 2.6));
      sit(tap);
      body(-0.6, -21.6 + up * 0.4, -3, -10.4);
      head(2 + eyes - up * 1.6, -29 - up * 1.2 + bob * 0.3);
      if (state === "wake") {
        arm(-0.6, -20, -3, -26, -4, -32);
        arm(-0.6, -20, 2.5, -26, 3.5, -32);
      } else {
        const yb = -16.4 + up * 2.6;
        arm(-0.6, -20, 3.4, -14.6, 8, yb);
        openBook(8.4, yb, page / 0.22);
      }
    } else if (state === "sleep") {
      // Dozed off over the book: head on the chest, the book closed on the lap.
      const breath = Math.sin(time * 1.4);
      sit();
      body(0.2, -20.6 + breath * 0.4, -3, -10.4);
      head(5, -25.8 + breath * 0.5);
      arm(0.2, -19, 3, -13, 7.4, -12.6);
      closedBook(6.4, -13.2);
      const z = (time % 2.4) / 2.4;
      ctx.fillStyle = FIGURE;
      ctx.globalAlpha = 1 - z;
      ctx.font = "800 7px Inter, ui-sans-serif, sans-serif";
      ctx.fillText("z", 6 + z * 4, -30 - z * 10);
      ctx.font = "800 5px Inter, ui-sans-serif, sans-serif";
      ctx.fillText("z", 11 + z * 5, -36 - z * 8);
      ctx.globalAlpha = 1;
    } else if (state === "stretch") {
      // Still sitting, the book on the lap, both arms up.
      const a = Math.sin(Math.min(1, t / 0.6) * Math.PI / 2) * (t > 1.4 ? Math.max(0, 1 - (t - 1.4) / 0.6) : 1);
      sit();
      body(-1, -21.8 - a, -3, -10.4);
      head(-0.4, -29.2 - a * 1.6);
      closedBook(4, -12.6);
      arm(-1, -20.4 - a, -4.5 - a * 0.5, -24 - a * 4, -5.5, -24 - a * 10);
      arm(-1, -20.4 - a, 2.5 + a * 0.5, -24 - a * 4, 3.5, -24 - a * 10);
    } else if (state === "stand") {
      limb(4.4, FAR, 1.4, -15, 2.4, -7.5, 3, 0);
      limb(3.4, FAR, 0, -26 + bob, 4, -20.5, 5, -15);
      body(0, -27 + bob, 0, -15);
      leg(-1.4, -15, -2.4, -7.5, -3, 0);
      arm(0, -26 + bob, -4, -20.5, -5, -15);
      head(0, -34 + bob);
    } else if (state === "run" || state === "back" || state === "walk") {
      const fast = state !== "walk";
      const k = Math.sin(time * (fast ? 16 : 9)) * (fast ? 1 : 0.55);
      const lean = fast ? 3 : 1;
      const lift = (v) => Math.max(0, v) * (fast ? 3 : 1.4);
      limb(4.4, FAR, 0, -15, 3.5 - 3 * k, -8.5, 0.5 - 6 * k, -1 - lift(k));
      limb(3.4, FAR, lean - 0.5, -25.5, lean - 0.5 + 4 * k, -20.5, lean + 2 + 4 * k, -17.5);
      body(lean, -27, 0, -15);
      leg(0, -15, 3.5 + 3 * k, -8.5, 0.5 + 6 * k, -1 - lift(-k));
      arm(lean - 0.5, -25.5, lean - 0.5 - 4 * k, -20.5, lean + 2 - 4 * k, -17.5);
      head(lean + 2.2, -33.6);
    } else if (state === "jump") {
      limb(4.4, FAR, 0, -15, -2, -10.5, -4.5, -7);
      limb(3.4, FAR, 0, -25, 5, -31);
      body(0, -26, 0, -15);
      leg(0, -15, 4, -11, 1.5, -6.5);
      arm(0, -25, -5, -30.5);
      head(0.4, -32.8);
    }
    ctx.restore();
  };

  // A frame: the band and the sky above and below it, each only while it is on screen or near it, or every one of
  // them (after a resize, so none is ever left empty).
  const draw = (all = false) => {
    if (!disc) return;
    setAngles();
    placePlanets();
    placeReader();
    for (const layer of [skyAbove, skyBelow]) {
      if (!layer.rows || !(all || layer.seen)) continue;
      const c = layer.ctx;
      c.setTransform(1, 0, 0, 1, 0, -layer.y0);
      c.clearRect(0, layer.y0, width, layer.rows);
      drawSky(c, layer.y0, layer.y0 + layer.rows);
      if (warm < 1) {
        c.fillStyle = rgba(BLACK, 0.72 * (1 - warm));
        c.fillRect(0, layer.y0, width, layer.rows);
      }
    }
    if (!(all || band.seen)) return;
    ctx.setTransform(1, 0, 0, 1, 0, -bandTop);
    ctx.clearRect(0, bandTop, width, bandBottom - bandTop);
    drawSky(ctx, bandTop, bandBottom);
    drawPool();
    for (const planet of planets) drawOrbit(planet, false);
    for (const planet of planets) if (planet.sz < 0) drawPlanet(planet);
    ctx.globalCompositeOperation = "lighter";
    drawDisc();
    ctx.globalCompositeOperation = "source-over";
    drawGlow();
    drawMark();
    for (const planet of planets) drawOrbit(planet, true);
    planets.filter((planet) => planet.sz >= 0).sort((a, b) => a.sz - b.sz).forEach(drawPlanet);
    drawReader();
    if (warm < 1) {
      // The room is dark until the light is on; the mark itself sits over the dark.
      ctx.fillStyle = rgba(BLACK, 0.72 * (1 - warm));
      ctx.fillRect(0, bandTop, width, bandBottom - bandTop);
      drawMark();
    }
  };

  // ---- Motion ----
  let dragging = null;
  let running = false;
  let visible = true;
  let last = 0;
  let frameId = 0;

  const ease = (rate, dt) => 1 - Math.exp(-rate * dt);
  const step = (now) => {
    const raw = now - last;
    const dt = Math.min(0.05, raw / 1000 || 0);
    last = now;
    // Under 30 frames a second for most of a second, once the page has settled: a step down in quality.
    if (quality > 0.5 && time > 2) {
      pace.n += 1;
      if (raw > 34) pace.slow += 1;
      if (pace.n >= 60) {
        if (pace.slow >= 40) { quality -= 0.25; resize(); }
        pace.n = 0;
        pace.slow = 0;
      }
    }
    if (warm < 1) {
      warmT += dt;
      const u = Math.min(1, warmT / RING_TIME);
      warm = u * u * (3 - 2 * u);
    }
    ringT += dt;
    const following = Boolean(selected && follow);
    if (!dragging) {
      view.yawVel += ((following ? 0 : DRIFT) - view.yawVel) * ease(1.4, dt);
      view.pitch += (REST_PITCH - view.pitch) * ease(1.8, dt);
    }
    view.yaw += view.yawVel * dt;
    view.hoverX += (view.aimX - view.hoverX) * ease(3, dt);
    view.hoverY += (view.aimY - view.hoverY) * ease(3, dt);
    flare *= Math.exp(-dt * 2.4);
    time += dt * (selected ? 0.4 : 1) * (1 + flare * 3);
    if (following && !dragging) {
      // Turn until the opened planet is at the front, and keep it there as it goes round.
      const want = Math.PI / 2 - (selected.phase + selected.speed * time);
      view.yaw += Math.atan2(Math.sin(want - view.yaw), Math.cos(want - view.yaw)) * ease(2.4, dt);
    }
    zoom += ((selected ? 1 : 0) - zoom) * ease(2.4, dt);
    S = S0 * (1 + ZOOM * zoom);
    updateReader(dt);
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
    follow = Boolean(selected);
    if (still) {
      if (selected) view.yaw = Math.PI / 2 - (selected.phase + selected.speed * time);
      zoom = selected ? 1 : 0;
      S = S0 * (1 + ZOOM * zoom);
    }
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
    const box = root.getBoundingClientRect();
    return { x: (event.clientX - box.left) * dpr, y: (event.clientY - box.top) * dpr };
  };
  const planetAt = ({ x, y }) => {
    let best = null;
    let bestD = Infinity;
    for (const planet of planets) {
      const d = Math.hypot(planet.sx - x, planet.sy - y);
      if (d < Math.max(planet.sr * (planet.reach + 0.6), 22 * dpr) && d - planet.sz * 10 < bestD) {
        best = planet;
        bestD = d - planet.sz * 10;
      }
    }
    return best;
  };
  // The moon under a point, if any; a moon in front wins over one behind its planet.
  const moonAt = ({ x, y }) => {
    let best = null;
    let bestD = Infinity;
    for (const planet of planets) {
      for (const moon of planet.moons) {
        const d = Math.hypot(moon.x - x, moon.y - y);
        if (d < Math.max(moon.size * 3, 12 * dpr) && d - (moon.front ? 6 * dpr : 0) < bestD) {
          best = moon;
          bestD = d - (moon.front ? 6 * dpr : 0);
        }
      }
    }
    return best;
  };
  const onMark = ({ x, y }) => Math.hypot(x - cx, y - cy) < S * MARK * 0.45;
  const interactive = (target) => target.closest("a, button, input, .cosmos-copy, .cosmos-family");

  root.addEventListener("pointerdown", (event) => {
    reader.idle = 0;
    if (event.button !== 0 || interactive(event.target)) return;
    dragging = { id: event.pointerId, x: event.clientX, y: event.clientY, x0: event.clientX, y0: event.clientY, t0: performance.now(), t: performance.now(), moved: false };
    view.yawVel = 0;
  });
  root.addEventListener("pointermove", (event) => {
    reader.idle = 0;
    if (event.pointerType === "mouse" && !dragging) {
      const box = root.getBoundingClientRect();
      view.aimX = ((event.clientX - box.left) / box.width - 0.5) * 2;
      view.aimY = ((event.clientY - box.top) / box.height - 0.5) * 2;
      const at = local(event);
      const overMoon = interactive(event.target) ? null : moonAt(at);
      const over = interactive(event.target) ? null : planetAt(at);
      const wantPointer = Boolean(over || overMoon) || onMark(at);
      if (over !== hovered || overMoon !== hoveredMoon) { hovered = over; hoveredMoon = overMoon; refresh(); }
      root.classList.toggle("is-pointing", wantPointer);
    }
    if (!dragging || event.pointerId !== dragging.id) return;
    const dx = event.clientX - dragging.x;
    const dy = event.clientY - dragging.y;
    const now = performance.now();
    if (!dragging.moved && Math.hypot(event.clientX - dragging.x0, event.clientY - dragging.y0) > 6) {
      dragging.moved = true;
      follow = false;
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
    const moon = moonAt(at);
    const planet = planetAt(at);
    if (moon) {
      jumpTo(moon);
      refresh();
      setTimeout(() => { window.location.href = moon.url; }, still ? 0 : 260);
    }
    else if (planet) select(planet.id);
    else if (onMark(at) && !still) { flare = 1; ringT = 0; }
  };
  root.addEventListener("pointerup", release);
  root.addEventListener("pointercancel", release);
  root.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") return;
    view.aimX = 0;
    view.aimY = 0;
    if (hovered || hoveredMoon) { hovered = null; hoveredMoon = null; refresh(); }
  });

  // ---- Life cycle ----
  new ResizeObserver(resize).observe(root);
  // Each layer is drawn while it is within half a screen of the view, so it is up to date before it shows; the motion
  // runs while any of them is (and stops, as before, when the whole hero is out of view).
  if ("IntersectionObserver" in window) {
    const watch = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const layer = layers.find((l) => l.canvas === entry.target);
        if (layer) layer.seen = entry.isIntersecting;
      }
      visible = layers.some((l) => l.seen && l.rows);
      if (visible) { start(); refresh(); } else stop();
    }, { rootMargin: "50% 0px" });
    for (const layer of layers) watch.observe(layer.canvas);
  }
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  // Paused or played again, here or in another tab: the loop stops, the scene settles where it is (the light on, the
  // opened planet at the front, the ring whole), or the loop starts again from there.
  new MutationObserver(() => {
    const now = page.dataset.motion === "paused";
    if (now === still) return;
    still = now;
    if (still) {
      stop();
      warm = 1;
      zoom = selected ? 1 : 0;
      S = S0 * (1 + ZOOM * zoom);
      refresh();
    } else start();
  }).observe(page, { attributes: true, attributeFilter: ["data-motion"] });
  root.classList.add("is-live");
  resize();
  start();
})();
