// The drawn backgrounds of the five tool families (partials/family-stage.njk), worked out once per build.
// A fixed seed keeps every build identical.
const random = (() => {
  let seed = 20260930;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();
const between = (min, max, digits = 1) => Number((min + random() * (max - min)).toFixed(digits));
const round = (value) => Math.round(value * 10) / 10;

// Lumen: dust drifting in the beam of light.
const dust = Array.from({ length: 46 }, () => ({
  x: between(36, 98),
  y: between(22, 96),
  size: between(1, 2.8),
  drift: between(-34, 34, 0),
  time: between(9, 19),
  delay: -between(0, 19),
}));

// Pulse: a heartbeat trace, four beats on one baseline.
const ecg = (() => {
  const base = 90;
  let d = `M0 ${base}`;
  for (let beat = 0; beat < 4; beat += 1) {
    const x = beat * 400;
    d += ` L${x + 130} ${base} Q${x + 150} ${base - 12} ${x + 170} ${base}`;
    d += ` L${x + 196} ${base} L${x + 206} ${base + 12} L${x + 220} ${base - 70} L${x + 234} ${base + 26} L${x + 246} ${base}`;
    d += ` L${x + 272} ${base} Q${x + 302} ${base - 20} ${x + 332} ${base} L${x + 400} ${base}`;
  }
  return d;
})();

// Zenith: contour lines of a landscape seen from above, and what the radar finds on it.
const contours = Array.from({ length: 9 }, (_, ring) => {
  const radius = 40 + ring * 46;
  const points = Array.from({ length: 120 }, (_, i) => {
    const a = (i / 120) * Math.PI * 2;
    const r = radius * (1 + 0.09 * Math.sin(3 * a + ring * 0.45) + 0.05 * Math.sin(5 * a - ring * 0.8) + 0.03 * Math.sin(2 * a + 1.3));
    return `${round(450 + r * Math.cos(a))} ${round(450 + r * Math.sin(a))}`;
  });
  return { d: `M${points.join(" L")} Z`, major: ring % 3 === 2 };
});
const SWEEP = 6;
const blips = [[38, 0.62], [96, 0.34], [141, 0.8], [203, 0.52], [252, 0.88], [298, 0.28], [334, 0.7]].map(([angle, reach]) => {
  const a = (angle * Math.PI) / 180;
  return { x: round(50 + 50 * reach * Math.sin(a)), y: round(50 - 50 * reach * Math.cos(a)), delay: round((angle / 360) * SWEEP) };
});

// Atlas: the path of a career drawn as a constellation, rising to its brightest star.
const path = [[520, 380], [585, 312], [632, 336], [690, 252], [752, 270], [800, 190], [856, 206], [896, 128], [952, 70]];
const stars = Array.from({ length: 70 }, () => ({
  x: between(2, 98),
  y: between(4, 96),
  size: between(1, 2.2),
  time: between(3, 7),
  delay: -between(0, 7),
}));

// Training modules: where the five moons sit on their arc (drop below its top), from crescent to full.
const moons = [[58, 44, -32], [67, 9, -24], [76, 0, -15], [85, 9, -7], [94, 44, 0]].map(([x, drop, shade]) => ({ x, drop, shade }));

// ---- The planets of the role cards (partials/family-planet.njk) ----------------------------------
// Drawn in a 400 × 300 box around (200, 150) with radius 50. Each planet has its own physics, and its
// moons are its tools: Pulse cracks and beats inside a heartbeat ring, Zenith is a contour map under a
// radar, Lumen shines inside a ring of dust in five parts, Atlas is a globe with a constellation on it.
const PX = 200;
const PY = 150;
const PR = 50;

// Pulse: cracks across the surface, nine polylines from near the centre outwards.
const cracks = Array.from({ length: 9 }, () => {
  let angle = random() * Math.PI * 2;
  let distance = random() * 0.5;
  const points = [];
  for (let k = 0; k < 7; k += 1) {
    points.push(`${round(PX + Math.cos(angle) * distance * PR)},${round(PY + Math.sin(angle) * distance * PR)}`);
    angle += (random() - 0.5) * 1.4;
    distance += 0.13 + random() * 0.08;
  }
  return points.join(" ");
});

// Pulse: the heartbeat ring, an ellipse with three beats on it, split into the half behind the planet
// and the half in front. The same curve is drawn on the homepage hero (js/cosmos.js).
const beat = (phase) => {
  if (phase > 2.3 && phase < 2.5) return -(phase - 2.3) * 3;
  if (phase >= 2.5 && phase < 2.7) return 1.3 - (phase - 2.5) * 11;
  if (phase >= 2.7 && phase < 2.9) return -0.9 + (phase - 2.7) * 4.5;
  return 0;
};
const pulseRing = (() => {
  const halves = { back: "", front: "" };
  let previous = null;
  for (let i = 0; i <= 240; i += 1) {
    const a = (i / 240) * Math.PI * 2;
    const half = Math.sin(a) > 0 ? "front" : "back";
    const phase = (a * 3) % (Math.PI * 2);
    const x = round(PX + Math.cos(a) * PR * 1.9);
    const y = round(PY + Math.sin(a) * PR * 0.57 + beat(phase) * PR * 0.22);
    halves[half] += `${half === previous ? " L" : " M"}${x} ${y}`;
    previous = half;
  }
  return { back: halves.back.trim(), front: halves.front.trim() };
})();

// Zenith: contour lines, the latitudes of a map seen from above; every third is a major line.
const contourLines = [-66, -44, -22, 0, 22, 44, 66].map((lat, i) => {
  const la = (lat * Math.PI) / 180;
  const rx = round(Math.cos(la) * PR);
  return { cy: round(PY + Math.sin(la) * PR * 0.98), rx, ry: round(rx * 0.22), major: i % 3 === 0 };
});

// Atlas: the meridians and parallels of a globe, and the path of a career as a constellation on its lit side.
const meridians = [0, 36, 72, 108, 144].map((deg) => Math.max(0.5, round(Math.abs(Math.cos((deg * Math.PI) / 180)) * PR)));
const parallels = [-60, -30, 0, 30, 60].map((lat) => {
  const la = (lat * Math.PI) / 180;
  return { cy: round(PY + Math.sin(la) * PR), rx: round(Math.cos(la) * PR), ry: round(Math.cos(la) * PR * 0.14) };
});
const constellation = [[-0.55, 0.45], [-0.4, 0.2], [-0.22, 0.3], [-0.05, 0.02], [0.1, 0.1], [0.22, -0.2], [0.36, -0.12], [0.42, -0.42], [0.55, -0.62]]
  .map(([x, y]) => ({ x: round(PX + x * PR), y: round(PY + y * PR) }));

// The moons: as many as the role has tools, on an ellipse around the planet; the upper half is behind it.
const moonsOf = (count, rx, ry, offset) => Array.from({ length: count }, (_, i) => {
  const a = offset + (i / count) * Math.PI * 2;
  return { x: round(PX + Math.cos(a) * rx), y: round(PY + Math.sin(a) * ry), front: Math.sin(a) > 0 };
});
const planetMoons = {
  pulse: moonsOf(4, PR * 1.9, PR * 0.57, 0.6),
  zenith: moonsOf(3, PR * 1.8, PR * 0.7, 0.9),
  lumen: moonsOf(3, PR * 2.7, PR * 0.66, 0.4),
  atlas: moonsOf(3, PR * 1.8, PR * 0.7, 1.2),
};

export default {
  dust,
  ecg,
  contours,
  sweep: SWEEP,
  blips,
  path: path.map(([x, y]) => ({ x, y })),
  line: path.map((point) => point.join(",")).join(" "),
  stars,
  moons,
  planets: { cracks, pulseRing, contourLines, meridians, parallels, constellation, moons: planetMoons },
};
