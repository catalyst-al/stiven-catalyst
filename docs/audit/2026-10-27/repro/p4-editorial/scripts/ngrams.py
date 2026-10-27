import json,re,collections,itertools
W='$AUDIT_WORK/p4-editorial/'
C=json.load(open(W+'corpus.json',encoding='utf-8'))
N=json.load(open(W+'out/notes.json',encoding='utf-8'))
def toks(t):
    t=re.sub(r'\[([^\]]*)\]\([^)]*\)',r'\1',t); t=re.sub(r'\{[%{].*?[%}]\}','',t)
    return re.findall(r"[\wäöüßëçÄÖÜËÇ]+",t.lower())
def grams(ws,n): return set(tuple(ws[i:i+n]) for i in range(len(ws)-n+1))
for lang in ('en','sq','de'):
  for typ in ('reflections','insights'):
    docs={d['slug']:toks(d['body']) for d in C if d['lang']==lang and d['type']==typ}
    for n in (5,8):
        cnt=collections.Counter()
        for s,w in docs.items():
            for g in grams(w,n): cnt[g]+=1
        multi={g:c for g,c in cnt.items() if c>=3}
        print(f'\n== {lang}/{typ} n={n}: distinct {n}-grams in >=3 docs: {len(multi)}; in >=2 docs: {sum(1 for c in cnt.values() if c>=2)}')
        if n==5:
            for g,c in sorted(multi.items(),key=lambda x:-x[1])[:25]: print('  ',c,' '.join(g))
    # pairwise 8-gram shared
    pairs=[]
    sl=list(docs)
    G={s:grams(docs[s],8) for s in sl}
    for a,b in itertools.combinations(sl,2):
        k=len(G[a]&G[b])
        if k: pairs.append((k,a,b))
    pairs.sort(reverse=True)
    print(f'  pairs sharing any 8-gram: {len(pairs)}; top:',pairs[:6])
# notes verbatim in essays
for lang in ('en','sq','de'):
    ess=' '.join(' '.join(toks(d['body'])) for d in C if d['lang']==lang and d['type'] in ('insights','reflections'))
    k=0
    for v in N.values():
        t=' '.join(toks(v[lang]))
        if len(t.split())>=6 and t in ess: k+=1
    print(lang,'notes appearing verbatim inside an essay/reflection:',k,'of',len(N))
