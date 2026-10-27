// The statistics behind Process Lab (window.StatsKit): plain functions on arrays of numbers, no page and no library,
// so a test can call each one with a textbook value. Distributions: the normal (West's algorithm, 1e-14), its inverse
// (Acklam with one Newton step), Student's t through the regularized incomplete beta (continued fraction), chi-square
// through the regularized gamma, and the Poisson and binomial counts through the same two. Tests: Anderson–Darling for normality, two proportions, Welch's t, sample sizes,
// a straight-line fit with its t test, chi-square of a table. Charts: the I-MR limits, the subgroup constants (A2 … D4),
// Xbar-R, Xbar-S, c, u and np charts with phases, and the eight Nelson rules. Measurement systems: Fleiss' and Cohen's
// kappa, attribute agreement, Gage R&R by ANOVA. Everything that cannot be computed is null, never NaN, so a page can
// show "–" instead of breaking.
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
  // Counts. P(X ≤ k) for a Poisson count of mean `mean` (1 − P(k + 1, mean), the regularized gamma), and for a binomial
  // count of n trials with chance p (I₁₋ₚ(n − k, k + 1), the regularized beta). k is rounded down; null when the
  // arguments make no sense.
  const poissonCdf = (k, mean) => {
    if (!Number.isFinite(k) || !(mean >= 0)) return null;
    const x = Math.floor(k);
    if (x < 0) return 0;
    return mean === 0 ? 1 : 1 - gammaInc(x + 1, mean);
  };
  const binomialCdf = (k, n, p) => {
    if (!Number.isFinite(k) || !Number.isInteger(n) || n < 0 || !(p >= 0 && p <= 1)) return null;
    const x = Math.floor(k);
    if (x < 0) return 0;
    if (x >= n || p === 0) return 1;
    return p === 1 ? 0 : betaInc(n - x, x + 1, 1 - p);
  };

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


  // The constants of the subgroup charts for n = 2…25, as printed in the tables (ASTM STP 15D, Montgomery App. VI):
  // A2, A3, c4, B3, B4, d2, D3, D4. Limits use the printed values, so a chart matches the one worked by hand.
  const SPC_TABLE = [
    [1.880, 2.659, 0.7979, 0, 3.267, 1.128, 0, 3.267],
    [1.023, 1.954, 0.8862, 0, 2.568, 1.693, 0, 2.574],
    [0.729, 1.628, 0.9213, 0, 2.266, 2.059, 0, 2.282],
    [0.577, 1.427, 0.9400, 0, 2.089, 2.326, 0, 2.114],
    [0.483, 1.287, 0.9515, 0.030, 1.970, 2.534, 0, 2.004],
    [0.419, 1.182, 0.9594, 0.118, 1.882, 2.704, 0.076, 1.924],
    [0.373, 1.099, 0.9650, 0.185, 1.815, 2.847, 0.136, 1.864],
    [0.337, 1.032, 0.9693, 0.239, 1.761, 2.970, 0.184, 1.816],
    [0.308, 0.975, 0.9727, 0.284, 1.716, 3.078, 0.223, 1.777],
    [0.285, 0.927, 0.9754, 0.321, 1.679, 3.173, 0.256, 1.744],
    [0.266, 0.886, 0.9776, 0.354, 1.646, 3.258, 0.283, 1.717],
    [0.249, 0.850, 0.9794, 0.382, 1.618, 3.336, 0.307, 1.693],
    [0.235, 0.817, 0.9810, 0.406, 1.594, 3.407, 0.328, 1.672],
    [0.223, 0.789, 0.9823, 0.428, 1.572, 3.472, 0.347, 1.653],
    [0.212, 0.763, 0.9835, 0.448, 1.552, 3.532, 0.363, 1.637],
    [0.203, 0.739, 0.9845, 0.466, 1.534, 3.588, 0.378, 1.622],
    [0.194, 0.718, 0.9854, 0.482, 1.518, 3.640, 0.391, 1.608],
    [0.187, 0.698, 0.9862, 0.497, 1.503, 3.689, 0.403, 1.597],
    [0.180, 0.680, 0.9869, 0.510, 1.490, 3.735, 0.415, 1.585],
    [0.173, 0.663, 0.9876, 0.523, 1.477, 3.778, 0.425, 1.575],
    [0.167, 0.647, 0.9882, 0.534, 1.466, 3.819, 0.434, 1.566],
    [0.162, 0.633, 0.9887, 0.545, 1.455, 3.858, 0.443, 1.557],
    [0.157, 0.619, 0.9892, 0.555, 1.445, 3.895, 0.451, 1.548],
    [0.153, 0.606, 0.9896, 0.565, 1.435, 3.931, 0.459, 1.541],
  ];
  const spcConstants = (n) => {
    const row = Number.isInteger(n) ? SPC_TABLE[n - 2] : null;
    if (!row) return null;
    const [A2, A3, c4, B3, B4, d2, D3, D4] = row;
    return { n, A2, A3, c4, B3, B4, d2, D3, D4 };
  };
  // The usual spread chart for a subgroup size: the range up to eight, the standard deviation above.
  const spreadFor = (n) => (n > 8 ? "S" : "R");

  // The limits of one phase of a chart. Each point gets its own centre, limits and sigma, because a u-chart's limits
  // follow the size of each sample; the subgroup and np charts work the same way, so a short last subgroup is fine.
  const phaseLimits = (kind, rows, spread) => {
    const out = { points: [], second: null, center: null, sigma: null, secondCenter: null };
    if (kind === "imr") {
      const values = rows.map((row) => row.value);
      const chart = imr(values);
      if (!(chart.n >= 2)) return null;
      out.center = chart.mean;
      out.sigma = chart.sigmaWithin;
      out.secondCenter = chart.mrBar;
      out.points = values.map((y) => ({ y, center: chart.mean, ucl: chart.ucl, lcl: chart.lcl, sigma: chart.sigmaWithin }));
      out.second = values.map((y, i) => ({ y: i ? chart.ranges[i - 1] : null, center: chart.mrBar, ucl: chart.mrUcl, lcl: 0 }));
      return out;
    }
    if (kind === "xbar") {
      const groups = rows.map((row) => clean(row.values));
      const constants = groups.map((group) => spcConstants(group.length));
      if (!groups.length || constants.some((k) => !k)) return null;
      const total = sum(groups.map((group) => group.length));
      const grand = sum(groups.map((group) => sum(group))) / total;
      const spreads = groups.map((group) => (spread === "S" ? sd(group) : Math.max(...group) - Math.min(...group)));
      // σ within from the average spread: R̄/d2 or s̄/c4 (subgroup by subgroup when the sizes differ).
      const sigma = mean(spreads.map((value, i) => value / (spread === "S" ? constants[i].c4 : constants[i].d2)));
      out.center = grand;
      out.sigma = sigma;
      out.points = groups.map((group, i) => {
        const k = constants[i];
        // A2·R̄ and A3·s̄ written through σ, so equal subgroups give exactly the printed limits.
        const half = spread === "S" ? k.A3 * k.c4 * sigma : k.A2 * k.d2 * sigma;
        return { y: mean(group), center: grand, ucl: grand + half, lcl: grand - half, sigma: half / 3 };
      });
      out.second = spreads.map((y, i) => {
        const k = constants[i];
        const center = spread === "S" ? k.c4 * sigma : k.d2 * sigma;
        return spread === "S" ? { y, center, ucl: k.B4 * center, lcl: k.B3 * center } : { y, center, ucl: k.D4 * center, lcl: k.D3 * center };
      });
      out.secondCenter = mean(out.second.map((point) => point.center));
      return out;
    }
    if (kind === "c") {
      const counts = rows.map((row) => Number(row.count));
      const cBar = mean(counts);
      if (cBar === null) return null;
      const s = Math.sqrt(cBar);
      out.center = cBar;
      out.sigma = s;
      out.points = counts.map((y) => ({ y, center: cBar, ucl: cBar + 3 * s, lcl: Math.max(0, cBar - 3 * s), sigma: s }));
      return out;
    }
    if (kind === "u" || kind === "np") {
      const counts = rows.map((row) => Number(row.count));
      const sizes = rows.map((row) => Number(row.size));
      const units = sum(sizes);
      if (!(units > 0) || sizes.some((size) => !(size > 0))) return null;
      const rate = sum(counts) / units;
      out.center = kind === "u" ? rate : rate * units / sizes.length;
      out.points = counts.map((count, i) => {
        if (kind === "u") {
          const s = Math.sqrt(rate / sizes[i]);
          return { y: count / sizes[i], center: rate, ucl: rate + 3 * s, lcl: Math.max(0, rate - 3 * s), sigma: s };
        }
        const center = sizes[i] * rate;
        const s = Math.sqrt(center * (1 - rate));
        return { y: count, center, ucl: center + 3 * s, lcl: Math.max(0, center - 3 * s), sigma: s };
      });
      out.sigma = mean(out.points.map((point) => point.sigma));
      out.rate = rate;
      return out;
    }
    return null;
  };

  // A control chart of any kind, with phases. kind: "imr" (rows { value }), "xbar" (rows { values }), "c" (rows
  // { count }), "u" and "np" (rows { count, size }). phases are the row indices where a new phase starts ("before /
  // after the change"): each phase gets its own limits, drawn as steps. The Nelson rules run on each phase against its
  // own limits (on the standardized points, so a u-chart's varying limits count); the spread chart (R, S or MR) is
  // read for points beyond its limits. Returns null when a phase cannot be computed.
  const controlChart = (kind, rows, options = {}) => {
    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) return null;
    const sizes = kind === "xbar" ? list.map((row) => clean(row.values).length) : [];
    const typical = sizes.length ? median(sizes) : null;
    const spread = kind === "xbar" ? (options.spread === "R" || options.spread === "S" ? options.spread : spreadFor(typical)) : kind === "imr" ? "MR" : null;
    // A phase needs at least two rows; a split that would leave fewer is ignored.
    const starts = [...new Set((options.phases || []).map(Number).filter((i) => Number.isInteger(i) && i >= 2 && i <= list.length - 2))].sort((a, b) => a - b)
      .filter((start, i, all) => start - (i ? all[i - 1] : 0) >= 2);
    const bounds = [0, ...starts, list.length];
    const points = [], second = [], phases = [];
    let signals = [];
    for (let p = 0; p + 1 < bounds.length; p++) {
      const from = bounds[p], to = bounds[p + 1] - 1;
      const part = phaseLimits(kind, list.slice(from, to + 1), spread);
      if (!part) return null;
      part.points.forEach((point) => points.push({ ...point, phase: p }));
      if (part.second) part.second.forEach((point) => second.push({ ...point, phase: p }));
      const z = part.points.map((point) => (point.sigma > 0 ? (point.y - point.center) / point.sigma : 0));
      signals = signals.concat(part.sigma > 0 ? nelson(z, 0, 1) : z.map(() => []));
      phases.push({ index: p, from, to, count: to - from + 1, center: part.center, sigma: part.sigma, ucl: part.points[0].ucl, lcl: part.points[0].lcl, secondCenter: part.secondCenter, rate: part.rate ?? null });
    }
    const secondSignals = second.map((point) => (Number.isFinite(point.y) && (point.y > point.ucl + 1e-12 || (point.lcl > 0 && point.y < point.lcl - 1e-12)) ? [1] : []));
    return { kind, spread, subgroup: typical, points, second: second.length ? second : null, signals, events: nelsonEvents(signals), secondSignals, secondEvents: nelsonEvents(secondSignals), phases };
  };

  // F distribution function (d1, d2 degrees of freedom), through the incomplete beta.
  const fCdf = (f, d1, d2) => (Number.isFinite(f) && d1 > 0 && d2 > 0 ? (f <= 0 ? 0 : betaInc(d1 / 2, d2 / 2, d1 * f / (d1 * f + d2))) : null);
  // The x with betaInc(a, b, x) = p, by bisection.
  const betaInv = (p, a, b) => {
    if (!(p > 0)) return 0;
    if (!(p < 1)) return 1;
    let low = 0, high = 1;
    for (let i = 0; i < 200 && high - low > 1e-13; i++) {
      const mid = (low + high) / 2;
      if (betaInc(a, b, mid) < p) low = mid; else high = mid;
    }
    return (low + high) / 2;
  };
  // An exact (Clopper–Pearson) 95 % interval for x successes out of n, as the attribute agreement tables give it.
  const binomialCi = (x, n, level = 0.95) => {
    if (!(n > 0) || !(x >= 0) || x > n) return null;
    const a = (1 - level) / 2;
    return [x > 0 ? betaInv(a, x, n - x + 1) : 0, x < n ? betaInv(1 - a, x + 1, n - x) : 1];
  };

  // Chi-square test of independence for a table of counts (rows × columns). Rows or columns that are all zero are
  // left out (kept says which stay). Expected counts, the contribution and the standardized residual of each cell,
  // the cells expected below 5 (the test gets unreliable there) and Cramér's V for the strength.
  const chiSquare = (table) => {
    const raw = (Array.isArray(table) ? table : []).map((row) => (Array.isArray(row) ? row.map(Number) : []));
    if (raw.some((row) => row.some((value) => !(value >= 0)))) return null;
    const width = Math.max(0, ...raw.map((row) => row.length));
    const full = raw.map((row) => [...Array(width)].map((_, j) => row[j] || 0));
    const keepRows = full.map((row, i) => (sum(row) > 0 ? i : -1)).filter((i) => i >= 0);
    const keepCols = [...Array(width)].map((_, j) => (sum(full.map((row) => row[j])) > 0 ? j : -1)).filter((j) => j >= 0);
    if (keepRows.length < 2 || keepCols.length < 2) return null;
    const observed = keepRows.map((i) => keepCols.map((j) => full[i][j]));
    const rowSums = observed.map((row) => sum(row));
    const colSums = keepCols.map((_, j) => sum(observed.map((row) => row[j])));
    const total = sum(rowSums);
    const expected = rowSums.map((r) => colSums.map((c) => r * c / total));
    const contributions = observed.map((row, i) => row.map((o, j) => (o - expected[i][j]) ** 2 / expected[i][j]));
    const residuals = observed.map((row, i) => row.map((o, j) => (o - expected[i][j]) / Math.sqrt(expected[i][j])));
    const chi2 = sum(contributions.map((row) => sum(row)));
    const df = (observed.length - 1) * (keepCols.length - 1);
    const p = Math.max(0, 1 - chi2Cdf(chi2, df));
    const cells = expected.flat();
    const low = cells.filter((value) => value < 5).length;
    return {
      observed, expected, contributions, residuals, rowSums, colSums, total, chi2, df, p,
      lowCells: low, lowShare: low / cells.length, minExpected: Math.min(...cells),
      cramersV: Math.sqrt(chi2 / (total * (Math.min(observed.length, keepCols.length) - 1))),
      kept: { rows: keepRows, cols: keepCols },
    };
  };

  // The straight line with what a reader needs to trust it: the standard error of the slope, its t test and 95 %
  // interval, and the residual spread (the typical miss of the line).
  const linearFit = (xs, ys) => {
    const base = regression(xs, ys);
    if (!base || base.n < 3) return base ? { ...base, se: null, t: null, df: base.n - 2, p: null, ci95: null, residualSd: null } : null;
    const pairs = xs.map((x, i) => [Number(x), Number(ys[i])]).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
    const mx = mean(pairs.map(([x]) => x));
    const sxx = sum(pairs.map(([x]) => (x - mx) ** 2));
    const sse = sum(pairs.map(([x, y]) => (y - base.intercept - base.slope * x) ** 2));
    const df = base.n - 2;
    const residualSd = Math.sqrt(sse / df);
    const se = residualSd / Math.sqrt(sxx);
    if (!(se > 0)) return { ...base, se: 0, t: Infinity, df, p: 0, ci95: [base.slope, base.slope], residualSd: 0 };
    const t = base.slope / se;
    const margin = tInv(0.975, df) * se;
    return { ...base, se, t, df, p: 2 * (1 - tCdf(Math.abs(t), df)), ci95: [base.slope - margin, base.slope + margin], residualSd };
  };

  // Fleiss' kappa: counts[i][j] raters who put subject i in category j, the same number of raters for every subject.
  // 1 is perfect agreement, 0 is what chance alone gives.
  const fleissKappa = (counts) => {
    const rows = (Array.isArray(counts) ? counts : []).map((row) => row.map(Number));
    if (rows.length < 1) return null;
    const m = sum(rows[0]);
    if (!(m >= 2) || rows.some((row) => sum(row) !== m)) return null;
    const N = rows.length;
    const k = rows[0].length;
    const pj = [...Array(k)].map((_, j) => sum(rows.map((row) => row[j])) / (N * m));
    const Pi = rows.map((row) => (sum(row.map((n) => n * n)) - m) / (m * (m - 1)));
    const Pbar = mean(Pi);
    const Pe = sum(pj.map((p) => p * p));
    return { kappa: Pe < 1 ? (Pbar - Pe) / (1 - Pe) : Pbar === 1 ? 1 : null, Pbar, Pe, pj, subjects: N, raters: m };
  };
  // Cohen's kappa for pairs of ratings (a rating and the standard).
  const cohenKappa = (pairs, categories) => {
    const list = (Array.isArray(pairs) ? pairs : []).filter(([a, b]) => a !== null && b !== null && a !== undefined && b !== undefined);
    if (!list.length) return null;
    const cats = categories || [...new Set(list.flat())];
    const po = list.filter(([a, b]) => a === b).length / list.length;
    const pe = sum(cats.map((cat) => (list.filter(([a]) => a === cat).length / list.length) * (list.filter(([, b]) => b === cat).length / list.length)));
    return { kappa: pe < 1 ? (po - pe) / (1 - pe) : po === 1 ? 1 : null, po, pe, n: list.length };
  };

  // Attribute agreement (good / bad, or any categories): parts judged by several appraisers, each part more than
  // once, against a known standard when there is one. ratings[a][t][i] is appraiser a's judgement of part i in trial t.
  // Returns, per appraiser, the parts judged the same every time (within) and the same as the standard every time (vs
  // standard), then the same across all appraisers, each with its exact 95 % interval and kappa.
  const attributeAgreement = ({ ratings, standard = null } = {}) => {
    const appraisers = Array.isArray(ratings) ? ratings : [];
    if (!appraisers.length || appraisers.some((trials) => !Array.isArray(trials) || !trials.length)) return null;
    const parts = appraisers[0][0].length;
    if (!(parts >= 2) || appraisers.some((trials) => trials.some((trial) => !Array.isArray(trial) || trial.length !== parts))) return null;
    const hasStandard = Array.isArray(standard) && standard.length === parts && standard.every((value) => value !== null && value !== undefined && value !== "");
    const categories = [...new Set([...appraisers.flat(2), ...(hasStandard ? standard : [])])].sort();
    const share = (agree) => ({ agree, n: parts, pct: agree / parts, ci95: binomialCi(agree, parts) });
    const countsOf = (ratingsOfPart) => categories.map((cat) => ratingsOfPart.filter((value) => value === cat).length);
    const each = appraisers.map((trials) => {
      const byPart = [...Array(parts)].map((_, i) => trials.map((trial) => trial[i]));
      const within = trials.length >= 2 ? { ...share(byPart.filter((list) => list.every((value) => value === list[0])).length), kappa: fleissKappa(byPart.map(countsOf))?.kappa ?? null } : null;
      let vsStandard = null, wrong = null;
      if (hasStandard) {
        vsStandard = { ...share(byPart.filter((list, i) => list.every((value) => value === standard[i])).length), kappa: cohenKappa(byPart.flatMap((list, i) => list.map((value) => [value, standard[i]])), categories)?.kappa ?? null };
        // What the misses are: for each true category, how many judgements said something else.
        wrong = Object.fromEntries(categories.map((cat) => [cat, byPart.reduce((total, list, i) => total + (standard[i] === cat ? list.filter((value) => value !== cat).length : 0), 0)]));
        vsStandard.mixed = byPart.filter((list) => !list.every((value) => value === list[0])).length;
      }
      return { trials: trials.length, within, vsStandard, wrong };
    });
    const allOfPart = [...Array(parts)].map((_, i) => appraisers.flatMap((trials) => trials.map((trial) => trial[i])));
    const raters = allOfPart[0].length;
    const between = appraisers.length >= 2 ? { ...share(allOfPart.filter((list) => list.every((value) => value === list[0])).length), kappa: fleissKappa(allOfPart.map(countsOf))?.kappa ?? null } : null;
    const allVsStandard = hasStandard ? { ...share(allOfPart.filter((list, i) => list.every((value) => value === standard[i])).length), kappa: cohenKappa(allOfPart.flatMap((list, i) => list.map((value) => [value, standard[i]])), categories)?.kappa ?? null } : null;
    return { parts, raters, categories, hasStandard, appraisers: each, between, allVsStandard };
  };
  // Kappa read the usual way (AIAG): from 0.9 excellent, from 0.75 good, below that the judgement needs work.
  const kappaBand = (kappa) => (!Number.isFinite(kappa) ? "none" : kappa >= 0.9 ? "excellent" : kappa >= 0.75 ? "good" : "poor");

  // Gage R&R, crossed, ANOVA method (AIAG MSA 4th ed., Minitab): y[i][j][k] is part i measured by operator j in trial
  // k, the same number of trials everywhere. The part × operator interaction stays in the model when it is significant
  // (p below alpha, 0.05 by default) and is pooled into repeatability otherwise. Each component as variance, sd,
  // % study variation (sd / total sd), % contribution (variance share) and % tolerance (6 sd / tolerance) when a
  // tolerance is given; the number of distinct categories is 1.41 × part sd / R&R sd, rounded down, at least 1.
  const gageRR = (y, options = {}) => {
    const data = Array.isArray(y) ? y : [];
    const p = data.length;
    const o = p ? data[0].length : 0;
    const r = o ? data[0][0].length : 0;
    if (p < 2 || o < 1 || r < 2) return null;
    if (data.some((part) => part.length !== o || part.some((cell) => !Array.isArray(cell) || cell.length !== r || cell.some((value) => !Number.isFinite(Number(value)))))) return null;
    const alpha = Number.isFinite(options.alpha) ? options.alpha : 0.05;
    const values = data.flat(2).map(Number);
    const grand = mean(values);
    const partMeans = data.map((part) => mean(part.flat()));
    const opMeans = [...Array(o)].map((_, j) => mean(data.map((part) => part[j]).flat()));
    const cellMeans = data.map((part) => part.map((cell) => mean(cell)));
    const ssPart = o * r * sum(partMeans.map((m) => (m - grand) ** 2));
    const ssOp = p * r * sum(opMeans.map((m) => (m - grand) ** 2));
    const ssInt = r * sum(cellMeans.flatMap((row, i) => row.map((m, j) => (m - partMeans[i] - opMeans[j] + grand) ** 2)));
    const ssErr = sum(data.flatMap((part, i) => part.flatMap((cell, j) => cell.map((value) => (Number(value) - cellMeans[i][j]) ** 2))));
    const ssTotal = sum(values.map((value) => (value - grand) ** 2));
    const dfPart = p - 1, dfOp = o - 1, dfInt = (p - 1) * (o - 1), dfErr = p * o * (r - 1);
    const ms = (ss, df) => (df > 0 ? ss / df : null);
    const msPart = ms(ssPart, dfPart), msOp = ms(ssOp, dfOp), msInt = ms(ssInt, dfInt), msErr = ms(ssErr, dfErr);
    const upper = (f, d1, d2) => (Number.isFinite(f) && d1 > 0 && d2 > 0 ? Math.max(0, 1 - fCdf(f, d1, d2)) : null);
    const fInt = o > 1 && msErr > 0 ? msInt / msErr : null;
    const pInt = o > 1 ? upper(fInt, dfInt, dfErr) : null;
    const pooled = !(o > 1) || !(pInt < alpha);
    const anova = [];
    let repeat, operator, interaction, part;
    if (!pooled) {
      anova.push({ source: "part", df: dfPart, ss: ssPart, ms: msPart, f: msPart / msInt, p: upper(msPart / msInt, dfPart, dfInt) });
      anova.push({ source: "operator", df: dfOp, ss: ssOp, ms: msOp, f: msOp / msInt, p: upper(msOp / msInt, dfOp, dfInt) });
      anova.push({ source: "interaction", df: dfInt, ss: ssInt, ms: msInt, f: fInt, p: pInt });
      anova.push({ source: "repeatability", df: dfErr, ss: ssErr, ms: msErr, f: null, p: null });
      repeat = msErr;
      interaction = Math.max(0, (msInt - msErr) / r);
      operator = Math.max(0, (msOp - msInt) / (p * r));
      part = Math.max(0, (msPart - msInt) / (o * r));
    } else {
      // Without the interaction its sum of squares joins the error: the reduced model of AIAG and Minitab.
      const dfPool = dfErr + (o > 1 ? dfInt : 0);
      const msPool = (ssErr + (o > 1 ? ssInt : 0)) / dfPool;
      anova.push({ source: "part", df: dfPart, ss: ssPart, ms: msPart, f: msPart / msPool, p: upper(msPart / msPool, dfPart, dfPool) });
      if (o > 1) anova.push({ source: "operator", df: dfOp, ss: ssOp, ms: msOp, f: msOp / msPool, p: upper(msOp / msPool, dfOp, dfPool) });
      anova.push({ source: "repeatability", df: dfPool, ss: ssErr + (o > 1 ? ssInt : 0), ms: msPool, f: null, p: null });
      repeat = msPool;
      interaction = 0;
      operator = o > 1 ? Math.max(0, (msOp - msPool) / (p * r)) : 0;
      part = Math.max(0, (msPart - msPool) / (o * r));
    }
    anova.push({ source: "total", df: p * o * r - 1, ss: ssTotal, ms: null, f: null, p: null });
    const reproducibility = operator + interaction;
    const grr = repeat + reproducibility;
    const total = grr + part;
    const tolerance = Number.isFinite(options.tolerance) && options.tolerance > 0 ? options.tolerance : null;
    const component = (variance) => {
      const s = Math.sqrt(variance);
      return { variance, sd: s, studyVar: 6 * s, pctStudy: total > 0 ? s / Math.sqrt(total) : null, pctContribution: total > 0 ? variance / total : null, pctTolerance: tolerance ? 6 * s / tolerance : null };
    };
    const components = { grr: component(grr), repeatability: component(repeat), reproducibility: component(reproducibility), operator: component(operator), interaction: component(interaction), part: component(part), total: component(total) };
    const ndc = grr > 0 ? Math.max(1, Math.floor(1.41 * Math.sqrt(part) / Math.sqrt(grr))) : null;
    return { parts: p, operators: o, trials: r, grand, partMeans, opMeans, cellMeans, anova, pooled, pInteraction: pInt, components, ndc, tolerance };
  };
  // % study variation of the R&R read the AIAG way: under 10 % good, 10–30 % depends on the use, above 30 % not acceptable.
  const gageBand = (share) => (!Number.isFinite(share) ? "none" : share < 0.1 ? "good" : share <= 0.3 ? "depends" : "bad");

  return {
    mean, sd, median, quantile, normalCdf, normalPdf, normInv, lgamma, betaInc, gammaInc, tCdf, tInv, chi2Cdf, poissonCdf, binomialCdf, andersonDarling, imr, nelson, nelsonEvents, capability, twoProportion, welch, sampleSizeProportion, sampleSizeMean, regression,
    spcConstants, spreadFor, controlChart, fCdf, betaInv, binomialCi, chiSquare, linearFit, fleissKappa, cohenKappa, attributeAgreement, kappaBand, gageRR, gageBand,
  };
})();
