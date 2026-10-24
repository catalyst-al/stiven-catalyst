// The statistics behind Process Lab (window.StatsKit): plain functions on arrays of numbers, no page and no library,
// so a test can call each one with a textbook value. Distributions: the normal (West's algorithm, 1e-14), its inverse
// (Acklam with one Newton step), Student's t through the regularized incomplete beta (continued fraction), chi-square
// through the regularized gamma. Tests: Anderson–Darling for normality, two proportions, Welch's t, sample sizes,
// a straight-line fit. Charts: the I-MR limits and the eight Nelson rules. Everything that cannot be computed is null,
// never NaN, so a page can show "–" instead of breaking.
window.StatsKit = (() => {
  const clean = (values) => (Array.isArray(values) ? values : []).map(Number).filter(Number.isFinite);
  const sum = (values) => values.reduce((total, value) => total + value, 0);
  const mean = (values) => {
    const list = clean(values);
    return list.length ? sum(list) / list.length : null;
  };
  // Sample standard deviation (n − 1): the spread of the process the sample came from, not of the sample alone.
  const sd = (values) => {
    const list = clean(values);
    if (list.length < 2) return null;
    const m = mean(list);
    return Math.sqrt(sum(list.map((value) => (value - m) ** 2)) / (list.length - 1));
  };
  // The value below which a share p of the sorted sample lies, interpolated between neighbours (type 7, as Excel).
  const quantile = (values, p) => {
    const list = clean(values).sort((a, b) => a - b);
    if (!list.length) return null;
    const at = (list.length - 1) * Math.min(1, Math.max(0, p));
    const low = Math.floor(at);
    return list[low] + (list[Math.min(list.length - 1, low + 1)] - list[low]) * (at - low);
  };
  const median = (values) => quantile(values, 0.5);

  // Standard normal distribution function (Graeme West, "Better approximations to cumulative normal functions").
  const normalCdf = (x) => {
    if (!Number.isFinite(x)) return x > 0 ? 1 : x < 0 ? 0 : null;
    const z = Math.abs(x);
    let p;
    if (z > 37) p = 0;
    else {
      const e = Math.exp(-z * z / 2);
      if (z < 7.07106781186547) {
        let b = 0.0352624965998911 * z + 0.700383064443688;
        b = b * z + 6.37396220353165;
        b = b * z + 33.912866078383;
        b = b * z + 112.079291497871;
        b = b * z + 221.213596169931;
        b = b * z + 220.206867912376;
        p = e * b;
        b = 0.0883883476483184 * z + 1.75566716318264;
        b = b * z + 16.064177579207;
        b = b * z + 86.7807322029461;
        b = b * z + 296.564248779674;
        b = b * z + 637.333633378831;
        b = b * z + 793.826512519948;
        b = b * z + 440.413735824752;
        p /= b;
      } else {
        let b = z + 0.65;
        b = z + 4 / b;
        b = z + 3 / b;
        b = z + 2 / b;
        b = z + 1 / b;
        p = e / b / 2.506628274631;
      }
    }
    return x > 0 ? 1 - p : p;
  };
  const normalPdf = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  // Inverse of the standard normal (Acklam, as in ToolKit), sharpened with one Newton step.
  const normInv = (p) => {
    if (!(p > 0) || !(p < 1)) return p === 0 ? -Infinity : p === 1 ? Infinity : null;
    const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const tail = (q) => (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    let x;
    if (p < 0.02425) x = tail(Math.sqrt(-2 * Math.log(p)));
    else if (p > 1 - 0.02425) x = -tail(Math.sqrt(-2 * Math.log(1 - p)));
    else {
      const q = p - 0.5;
      const r = q * q;
      x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    }
    const density = normalPdf(x);
    return density > 1e-300 ? x - (normalCdf(x) - p) / density : x;
  };

  // log Γ(x) (Lanczos), for the incomplete beta and gamma functions.
  const LANCZOS = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  const lgamma = (x) => {
    let y = x;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let series = 1.000000000190015;
    LANCZOS.forEach((coefficient) => { y += 1; series += coefficient / y; });
    return -tmp + Math.log(2.5066282746310005 * series / x);
  };
  // Continued fraction for the incomplete beta (modified Lentz).
  const betaFraction = (a, b, x) => {
    const TINY = 1e-300;
    const qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    if (Math.abs(d) < TINY) d = TINY;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= 300; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < TINY) d = TINY;
      c = 1 + aa / c;
      if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d;
      h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < TINY) d = TINY;
      c = 1 + aa / c;
      if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d;
      const delta = d * c;
      h *= delta;
      if (Math.abs(delta - 1) < 3e-14) break;
    }
    return h;
  };
  // Regularized incomplete beta I_x(a, b).
  const betaInc = (a, b, x) => {
    if (!(x > 0)) return 0;
    if (!(x < 1)) return 1;
    const front = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? front * betaFraction(a, b, x) / a : 1 - front * betaFraction(b, a, 1 - x) / b;
  };
  // Regularized lower incomplete gamma P(a, x): a series near the origin, a continued fraction beyond it.
  const gammaInc = (a, x) => {
    if (!(x > 0)) return 0;
    if (x < a + 1) {
      let term = 1 / a;
      let total = term;
      for (let n = 1; n <= 500; n++) {
        term *= x / (a + n);
        total += term;
        if (Math.abs(term) < Math.abs(total) * 1e-15) break;
      }
      return total * Math.exp(-x + a * Math.log(x) - lgamma(a));
    }
    const TINY = 1e-300;
    let b = x + 1 - a;
    let c = 1 / TINY;
    let d = 1 / b;
    let h = d;
    for (let i = 1; i <= 500; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < TINY) d = TINY;
      c = b + an / c;
      if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d;
      const delta = d * c;
      h *= delta;
      if (Math.abs(delta - 1) < 1e-15) break;
    }
    return 1 - Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
  };
  // Student's t distribution function, df degrees of freedom.
  const tCdf = (t, df) => {
    if (!Number.isFinite(t) || !(df > 0)) return null;
    const x = df / (df + t * t);
    const tail = 0.5 * betaInc(df / 2, 0.5, x);
    return t >= 0 ? 1 - tail : tail;
  };
  // The t value with tCdf(t, df) = p, found by bisection: a quantile is asked for a few times a page, never thousands.
  const tInv = (p, df) => {
    if (!(p > 0) || !(p < 1) || !(df > 0)) return p === 0 ? -Infinity : p === 1 ? Infinity : null;
    let low = -1e3, high = 1e3;
    for (let i = 0; i < 200; i++) {
      const mid = (low + high) / 2;
      if (tCdf(mid, df) < p) low = mid; else high = mid;
      if (high - low < 1e-12) break;
    }
    return (low + high) / 2;
  };
  const chi2Cdf = (x, k) => (Number.isFinite(x) && k > 0 ? (x <= 0 ? 0 : gammaInc(k / 2, x / 2)) : null);

  // Anderson–Darling test of normality, mean and sd from the sample (Stephens' correction and D'Agostino's p). Eight
  // values are the least that say anything; below that the result is given but `enough` is false.
  const andersonDarling = (values) => {
    const list = clean(values).sort((a, b) => a - b);
    const n = list.length;
    const m = mean(list), s = sd(list);
    if (n < 3 || !(s > 0)) return { n, A2: null, A2star: null, p: null, normal: null, enough: false };
    let total = 0;
    for (let i = 0; i < n; i++) {
      const clamp = (z) => Math.min(1 - 1e-12, Math.max(1e-12, z));
      const low = clamp(normalCdf((list[i] - m) / s));
      const high = clamp(normalCdf((list[n - 1 - i] - m) / s));
      total += (2 * i + 1) * (Math.log(low) + Math.log(1 - high));
    }
    const A2 = -n - total / n;
    const A2star = A2 * (1 + 0.75 / n + 2.25 / (n * n));
    let p;
    if (A2star >= 0.6) p = Math.exp(1.2937 - 5.709 * A2star + 0.0186 * A2star * A2star);
    else if (A2star >= 0.34) p = Math.exp(0.9177 - 4.279 * A2star - 1.38 * A2star * A2star);
    else if (A2star > 0.2) p = 1 - Math.exp(-8.318 + 42.796 * A2star - 59.938 * A2star * A2star);
    else p = 1 - Math.exp(-13.436 + 101.14 * A2star - 223.73 * A2star * A2star);
    p = Math.min(1, Math.max(0, p));
    return { n, A2, A2star, p, normal: p >= 0.05, enough: n >= 8 };
  };

  // Individuals and moving-range chart: the limits of single measurements from the average distance between
  // neighbours (d2 = 1.128 for two), the range limit from D4 = 3.267.
  const imr = (values) => {
    const list = clean(values);
    if (list.length < 2) return { n: list.length, mean: mean(list), mrBar: null, ucl: null, lcl: null, mrUcl: null, sigmaWithin: null, ranges: [] };
    const ranges = list.slice(1).map((value, i) => Math.abs(value - list[i]));
    const m = mean(list);
    const mrBar = mean(ranges);
    const sigmaWithin = mrBar / 1.128;
    return { n: list.length, mean: m, mrBar, ucl: m + 3 * sigmaWithin, lcl: m - 3 * sigmaWithin, mrUcl: 3.267 * mrBar, sigmaWithin, ranges };
  };

  // The eight Nelson rules on a run of points around a centre with a sigma. Returns one list of rule numbers per
  // point: a point carries every rule whose pattern it is part of (the one point beyond 3σ for rule 1, every point of
  // the run for rules 2, 3, 4, 7 and 8, the points beyond the zone for rules 5 and 6), so a chart can colour the
  // whole pattern and a list can name it from its first point to its last.
  const nelson = (points, center, sigma) => {
    const list = clean(points);
    const signals = list.map(() => []);
    if (!(sigma > 0) || !Number.isFinite(center)) return signals;
    const z = list.map((value) => (value - center) / sigma);
    const side = (value) => (value > 0 ? 1 : value < 0 ? -1 : 0);
    const flag = (index, rule) => { if (!signals[index].includes(rule)) signals[index].push(rule); };
    // Runs of consecutive points that pass a test; each run of at least `length` is handed to mark().
    const runs = (test, length, mark) => {
      let start = 0;
      for (let i = 1; i <= list.length; i++) {
        if (i < list.length && test(i - 1, i)) continue;
        if (i - start >= length) mark(start, i - 1);
        start = i;
      }
    };
    const markAll = (rule) => (from, to) => { for (let i = from; i <= to; i++) flag(i, rule); };
    // 1: one point beyond 3σ.
    z.forEach((value, i) => { if (Math.abs(value) > 3) flag(i, 1); });
    // 2: nine in a row on one side of the centre.
    runs((a, b) => side(z[a]) !== 0 && side(z[a]) === side(z[b]), 9, markAll(2));
    // 3: six in a row, each higher (or each lower) than the one before.
    const step = (a, b) => side(list[b] - list[a]);
    let start = 0;
    for (let i = 1; i <= list.length; i++) {
      const s = i < list.length ? step(i - 1, i) : 0;
      const before = i - 1 > start ? step(i - 2, i - 1) : null;
      if (s !== 0 && (before === null || before === s)) continue;
      if (i - start >= 6) markAll(3)(start, i - 1);
      start = s !== 0 ? i - 1 : i;
    }
    // 4: fourteen in a row alternating up and down.
    start = 0;
    for (let i = 1; i <= list.length; i++) {
      const s = i < list.length ? step(i - 1, i) : 0;
      const before = i - 1 > start ? step(i - 2, i - 1) : null;
      if (s !== 0 && (before === null || before === -s)) continue;
      if (i - start >= 14) markAll(4)(start, i - 1);
      start = s !== 0 ? i - 1 : i;
    }
    // 5: two of three in a row beyond 2σ on the same side. 6: four of five beyond 1σ on the same side.
    const zone = (rule, window, needed, limit) => {
      for (let i = 0; i + window <= list.length; i++) {
        [1, -1].forEach((direction) => {
          const hits = [];
          for (let j = i; j < i + window; j++) if (z[j] * direction > limit) hits.push(j);
          if (hits.length >= needed) hits.forEach((index) => flag(index, rule));
        });
      }
    };
    zone(5, 3, 2, 2);
    zone(6, 5, 4, 1);
    // 7: fifteen in a row within 1σ: too quiet for this process, a sign of mixed streams or a measurement that cannot see.
    runs((a, b) => Math.abs(z[a]) < 1 && Math.abs(z[b]) < 1, 15, markAll(7));
    // 8: eight in a row beyond 1σ, on both sides of the centre.
    for (let i = 0; i + 8 <= list.length; i++) {
      const window = z.slice(i, i + 8);
      if (window.every((value) => Math.abs(value) > 1) && window.some((value) => value > 0) && window.some((value) => value < 0)) markAll(8)(i, i + 7);
    }
    return signals;
  };
  // The signals as events: for each rule, the stretches of consecutive flagged points, first to last (0-based).
  const nelsonEvents = (signals) => {
    const events = [];
    for (let rule = 1; rule <= 8; rule++) {
      let from = -1;
      for (let i = 0; i <= signals.length; i++) {
        const hit = i < signals.length && signals[i].includes(rule);
        if (hit && from < 0) from = i;
        if (!hit && from >= 0) {
          events.push({ rule, from, to: i - 1 });
          from = -1;
        }
      }
    }
    return events.sort((a, b) => a.from - b.from || a.rule - b.rule);
  };

  // Capability against the specification: Cp and Cpk from the within-sigma of the moving ranges (what the process can
  // do when it is stable), Pp and Ppk from the overall standard deviation (what it does deliver). The shares outside
  // and the PPM are expected from the normal fit with the overall sd; the observed counts are given too. The sigma
  // level follows the convention of the sigma tables (Z bench + 1.5), as ToolKit.sigma does.
  const capability = (values, lsl, usl) => {
    const list = clean(values);
    const hasL = Number.isFinite(lsl), hasU = Number.isFinite(usl);
    const m = mean(list), s = sd(list);
    const within = imr(list).sigmaWithin;
    const none = { n: list.length, mean: m, sd: s, sigmaWithin: within, cp: null, cpk: null, pp: null, ppk: null, pBelow: null, pAbove: null, ppmTotal: null, sigmaLevel: null, zBench: null, outBelow: 0, outAbove: 0 };
    if (list.length < 2 || !(s > 0) || (!hasL && !hasU)) return none;
    const ratio = (spread) => (hasL && hasU ? (usl - lsl) / (6 * spread) : null);
    const k = (spread) => Math.min(hasU ? (usl - m) / (3 * spread) : Infinity, hasL ? (m - lsl) / (3 * spread) : Infinity);
    const pBelow = hasL ? normalCdf((lsl - m) / s) : 0;
    const pAbove = hasU ? 1 - normalCdf((usl - m) / s) : 0;
    const total = Math.min(1, pBelow + pAbove);
    const zBench = total <= 0 ? 6 : total >= 1 ? -6 : normInv(1 - total);
    return {
      ...none,
      cp: within > 0 ? ratio(within) : null,
      cpk: within > 0 ? k(within) : null,
      pp: ratio(s),
      ppk: k(s),
      pBelow, pAbove,
      ppmTotal: total * 1e6,
      zBench,
      sigmaLevel: Math.max(0, zBench + 1.5),
      outBelow: hasL ? list.filter((value) => value < lsl).length : 0,
      outAbove: hasU ? list.filter((value) => value > usl).length : 0,
    };
  };

  // Two proportions (x1 of n1 against x2 of n2): the pooled z test and a 95 % interval for the difference p2 − p1.
  const twoProportion = (x1, n1, x2, n2) => {
    if (!(n1 > 0) || !(n2 > 0) || !(x1 >= 0) || !(x2 >= 0) || x1 > n1 || x2 > n2) return null;
    const p1 = x1 / n1, p2 = x2 / n2;
    const pooled = (x1 + x2) / (n1 + n2);
    const se = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2));
    const z = se > 0 ? (p2 - p1) / se : 0;
    const p = se > 0 ? 2 * (1 - normalCdf(Math.abs(z))) : 1;
    const seDiff = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);
    const diff = p2 - p1;
    return { p1, p2, diff, z, p, ci95: [diff - 1.959964 * seDiff, diff + 1.959964 * seDiff] };
  };
  // Welch's t test for two means (unequal variances), with a 95 % interval for mean2 − mean1.
  const welch = (a, b) => {
    const x = clean(a), y = clean(b);
    if (x.length < 2 || y.length < 2) return null;
    const m1 = mean(x), m2 = mean(y), v1 = sd(x) ** 2 / x.length, v2 = sd(y) ** 2 / y.length;
    const se = Math.sqrt(v1 + v2);
    const diff = m2 - m1;
    if (!(se > 0)) return { mean1: m1, mean2: m2, diff, t: diff === 0 ? 0 : Infinity, df: x.length + y.length - 2, p: diff === 0 ? 1 : 0, ci95: [diff, diff], n1: x.length, n2: y.length };
    const df = (v1 + v2) ** 2 / (v1 * v1 / (x.length - 1) + v2 * v2 / (y.length - 1));
    const t = diff / se;
    const p = 2 * (1 - tCdf(Math.abs(t), df));
    const margin = tInv(0.975, df) * se;
    return { mean1: m1, mean2: m2, diff, t, df, p, ci95: [diff - margin, diff + margin], n1: x.length, n2: y.length };
  };
  // Measurements per group to tell p1 from p0 (two-sided alpha, the chance `power` of seeing a real change).
  const sampleSizeProportion = (p0, p1, alpha = 0.05, power = 0.8) => {
    if (!(p0 > 0 && p0 < 1 && p1 > 0 && p1 < 1) || p0 === p1 || !(alpha > 0 && alpha < 1) || !(power > 0 && power < 1)) return null;
    const za = normInv(1 - alpha / 2), zb = normInv(power);
    const pBar = (p0 + p1) / 2;
    const n = (za * Math.sqrt(2 * pBar * (1 - pBar)) + zb * Math.sqrt(p0 * (1 - p0) + p1 * (1 - p1))) ** 2 / (p1 - p0) ** 2;
    return Math.ceil(n);
  };
  // Measurements per group to see a shift of `delta` in a mean when single values spread by `sd`.
  const sampleSizeMean = (sdValue, delta, alpha = 0.05, power = 0.8) => {
    if (!(sdValue > 0) || !(Math.abs(delta) > 0) || !(alpha > 0 && alpha < 1) || !(power > 0 && power < 1)) return null;
    const za = normInv(1 - alpha / 2), zb = normInv(power);
    return Math.ceil(2 * ((za + zb) * sdValue / delta) ** 2);
  };
  // Least-squares line through (x, y) pairs, with Pearson's r.
  const regression = (xs, ys) => {
    const pairs = (Array.isArray(xs) ? xs : []).map((x, i) => [Number(x), Number(ys?.[i])]).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
    if (pairs.length < 2) return null;
    const n = pairs.length;
    const mx = sum(pairs.map(([x]) => x)) / n, my = sum(pairs.map(([, y]) => y)) / n;
    const sxx = sum(pairs.map(([x]) => (x - mx) ** 2)), syy = sum(pairs.map(([, y]) => (y - my) ** 2));
    const sxy = sum(pairs.map(([x, y]) => (x - mx) * (y - my)));
    if (!(sxx > 0)) return null;
    const slope = sxy / sxx;
    const r = syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0;
    return { slope, intercept: my - slope * mx, r, r2: r * r, n };
  };

  return { mean, sd, median, quantile, normalCdf, normalPdf, normInv, lgamma, betaInc, gammaInc, tCdf, tInv, chi2Cdf, andersonDarling, imr, nelson, nelsonEvents, capability, twoProportion, welch, sampleSizeProportion, sampleSizeMean, regression };
})();
