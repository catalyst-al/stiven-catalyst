# Independent reference values for Process Lab / StatsKit with scipy/numpy.
import json, numpy as np
from scipy import stats
rng = np.random.default_rng(7)
out = {}
x = np.round(rng.normal(50, 2, 30), 2).tolist()
out['x'] = x
a = np.array(x)
mr = np.abs(np.diff(a)); sw = mr.mean() / 1.128
out['imr'] = dict(mean=a.mean(), ucl=a.mean() + 3 * sw, lcl=a.mean() - 3 * sw, mrUcl=3.267 * mr.mean())
lsl, usl = 44, 57
s = a.std(ddof=1)
out['cap'] = dict(cp=(usl - lsl) / (6 * sw), cpk=min(usl - a.mean(), a.mean() - lsl) / (3 * sw), pp=(usl - lsl) / (6 * s), ppk=min(usl - a.mean(), a.mean() - lsl) / (3 * s),
                  ppm=(stats.norm.cdf((lsl - a.mean()) / s) + stats.norm.sf((usl - a.mean()) / s)) * 1e6)
# AD statistic (unadjusted A2), mean/sd estimated
z = np.sort((a - a.mean()) / s); n = len(z); i = np.arange(1, n + 1)
A2 = -n - np.sum((2 * i - 1) * (np.log(stats.norm.cdf(z)) + np.log(stats.norm.sf(z[::-1])))) / n
out['ad'] = dict(A2=A2, scipy=stats.anderson(a).statistic)
# chi-square (no Yates)
t = [[30, 10, 5], [20, 25, 10]]
c = stats.chi2_contingency(t, correction=False)
out['chi'] = dict(table=t, chi2=c.statistic, p=c.pvalue, df=c.dof)
# Welch
b = (a[:15] + 1.0).tolist(); w = stats.ttest_ind(a[15:], b, equal_var=False)
out['welch'] = dict(a=a[15:].tolist(), b=b, t=w.statistic, p=w.pvalue)
# linear fit
xs = list(range(1, 31)); lr = stats.linregress(xs, x)
out['lin'] = dict(slope=lr.slope, intercept=lr.intercept, p=lr.pvalue, r=lr.rvalue)
# Gage R&R, 10 parts x 3 operators x 3 trials, full ANOVA (independent implementation)
p_, o_, r_ = 10, 3, 3
part_eff = rng.normal(0, 1.0, p_); op_eff = rng.normal(0, 0.2, o_)
y = np.array([[[10 + part_eff[i] + op_eff[j] + rng.normal(0, 0.15) for k in range(r_)] for j in range(o_)] for i in range(p_)])
y = np.round(y, 3)
g = y.mean(); pm = y.mean(axis=(1, 2)); om = y.mean(axis=(0, 2)); cm = y.mean(axis=2)
ssP = o_ * r_ * ((pm - g) ** 2).sum(); ssO = p_ * r_ * ((om - g) ** 2).sum()
ssI = r_ * ((cm - pm[:, None] - om[None, :] + g) ** 2).sum(); ssE = ((y - cm[:, :, None]) ** 2).sum()
dfP, dfO, dfI, dfE = p_ - 1, o_ - 1, (p_ - 1) * (o_ - 1), p_ * o_ * (r_ - 1)
msP, msO, msI, msE = ssP / dfP, ssO / dfO, ssI / dfI, ssE / dfE
pI = stats.f.sf(msI / msE, dfI, dfE)
def comps(pool):
    if pool:
        dfp = dfE + dfI; msp = (ssE + ssI) / dfp
        rep = msp; op = max(0, (msO - msp) / (p_ * r_)); inter = 0; part = max(0, (msP - msp) / (o_ * r_))
    else:
        rep = msE; op = max(0, (msO - msI) / (p_ * r_)); inter = max(0, (msI - msE) / r_); part = max(0, (msP - msI) / (o_ * r_))
    grr = rep + op + inter; tot = grr + part
    return dict(pctStudy=np.sqrt(grr / tot), ndc=int(max(1, np.floor(1.41 * np.sqrt(part) / np.sqrt(grr)))))
out['gage'] = dict(y=y.tolist(), pInt=pI, pooled005=bool(pI >= 0.05), pooled025=bool(pI >= 0.25), at005=comps(pI >= 0.05), at025=comps(pI >= 0.25))
print(json.dumps(out))
