# Find a Gage R&R dataset whose interaction p lies between 0.05 and 0.25 and give %SV under both pooling rules.
import json, numpy as np
from scipy import stats
for seed in range(200):
    rng = np.random.default_rng(seed)
    p_, o_, r_ = 10, 3, 2
    y = np.array([[[10 + rng.normal(0, 1) * 0 + i * 0.3 + j * 0.05 + rng.normal(0, 0.1) + (rng.normal(0, 0.06) if True else 0) for k in range(r_)] for j in range(o_)] for i in range(p_)])
    inter = rng.normal(0, 0.07, (p_, o_)); y = np.round(y + inter[:, :, None], 3)
    g = y.mean(); pm = y.mean(axis=(1, 2)); om = y.mean(axis=(0, 2)); cm = y.mean(axis=2)
    ssP = o_*r_*((pm-g)**2).sum(); ssO = p_*r_*((om-g)**2).sum(); ssI = r_*((cm-pm[:,None]-om[None,:]+g)**2).sum(); ssE = ((y-cm[:,:,None])**2).sum()
    dfP, dfO, dfI, dfE = p_-1, o_-1, (p_-1)*(o_-1), p_*o_*(r_-1)
    msP, msO, msI, msE = ssP/dfP, ssO/dfO, ssI/dfI, ssE/dfE
    pI = stats.f.sf(msI/msE, dfI, dfE)
    if 0.05 < pI < 0.25:
        def comps(pool):
            if pool:
                msp = (ssE+ssI)/(dfE+dfI); rep = msp; op = max(0,(msO-msp)/(p_*r_)); inter_ = 0; part = max(0,(msP-msp)/(o_*r_))
            else:
                rep = msE; op = max(0,(msO-msI)/(p_*r_)); inter_ = max(0,(msI-msE)/r_); part = max(0,(msP-msI)/(o_*r_))
            grr = rep+op+inter_; tot = grr+part
            return dict(pctStudy=float(np.sqrt(grr/tot)), ndc=int(max(1, np.floor(1.41*np.sqrt(part)/np.sqrt(grr)))))
        print(json.dumps(dict(seed=seed, y=y.tolist(), pInt=pI, pooled_alpha005=comps(True), kept_alpha025_minitab=comps(False))))
        break
