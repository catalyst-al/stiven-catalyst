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

// Academy: where the five moons sit on their arc (drop below its top), from crescent to full.
const moons = [[58, 44, -32], [67, 9, -24], [76, 0, -15], [85, 9, -7], [94, 44, 0]].map(([x, drop, shade]) => ({ x, drop, shade }));

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
};
