import re,sys
src=sys.argv[1]
def load(l):
    t=open(f"{src}/scripts/book/{l}.txt",encoding='utf-8').read()
    parts=re.split(r'^== (\d+)\s*$',t,flags=re.M)
    head=parts[0]; pages={}
    for i in range(1,len(parts),2):
        paras=[p.strip() for p in re.split(r'\n\s*\n',parts[i+1]) if p.strip()]
        pages[parts[i]]=paras
    return head,pages
H={};P={}
for l in ('sq','en','de'): H[l],P[l]=load(l)
for l in H: print(l,'HEAD:',H[l].strip());
pg=sys.argv[2].split(',')
for p in sorted(P['sq']):
    if pg!=['all'] and p not in pg: continue
    n=max(len(P[l].get(p,[])) for l in P)
    print(f"\n######## PAGE {p}  (paras sq/en/de: {[len(P[l].get(p,[])) for l in P]})")
    for i in range(n):
        for l in ('sq','en','de'):
            a=P[l].get(p,[]); print(f"[{p}.{i+1} {l.upper()}] "+(a[i] if i<len(a) else '<<MISSING>>'))
        print()
