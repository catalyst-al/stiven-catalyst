import json,os,sys,collections,re
sys.argv=[sys.argv[0],sys.argv[1]]
exec(open('checks.py').read().split("out = {}")[0])  # reuse resolve/internal
G={}
for p in P:
    outs=set()
    for h in p['links']:
        r=internal(h,p['url'])
        if not r: continue
        st,f=resolve(r[0])
        if f and f.endswith('.html'): outs.add(os.path.relpath(f,SITE))
    G[p['rel']]=outs
def bfs(start, nav=True):
    d={start:0}; q=collections.deque([start])
    while q:
        x=q.popleft()
        for y in G.get(x,()):
            if y not in d: d[y]=d[x]+1; q.append(y)
    return d
d=bfs('index.html')
print('reachable from EN home', len(d), 'of', len(P))
print('unreachable', sorted(set(p['rel'] for p in P)-set(d)))
def cls(r):
    s=re.sub(r'^(de|sq)/','',r); parts=s.split('/')
    if parts[0]=='magazine':
        n=parts[1]; return 'mag:'+('mr-issue' if 'nr-' in n or '2026-09' in n else 'treatise-vol' if 'vol-' in n else 'floor-issue' if 'nga-terreni' in n else n)
    return parts[0] if len(parts)>1 else 'top'
for L,start in (('en','index.html'),('de','de/index.html'),('sq','sq/index.html')):
    d=bfs(start); c=collections.defaultdict(collections.Counter)
    for r,v in d.items():
        lang='de' if r.startswith('de/') else 'sq' if r.startswith('sq/') else 'en'
        if lang==L: c[cls(r)][v]+=1
    print(L, {k:dict(sorted(v.items())) for k,v in sorted(c.items())})
    deep=[(v,r) for r,v in d.items() if v>3]
    print('  depth>3:', len(deep), sorted(deep)[:10])
# also: depth of home -> book, guide
d=bfs('index.html')
for r in ['books/mall-per-durresin.html','guides/tools-guide.html','magazine/management-review-nr-01.html','magazine/management-review-nr-80.html','reflections/the-information-monopoly/index.html','podcast.html']: print(r,d.get(r))
# inbound link counts (unique source pages) per class
inl=collections.Counter()
for s,outs in G.items():
    for t in outs:
        if t!=s: inl[t]+=1
low=[(inl[p['rel']],p['rel']) for p in P if inl[p['rel']]<=3 and 'noindex' not in p['robots']]
print('indexable pages with <=3 inlinking pages:',len(low), sorted(low)[:30])
json.dump({k:sorted(v) for k,v in G.items()},open('graph.json','w'))
