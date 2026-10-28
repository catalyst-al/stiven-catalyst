import os, sys, re, json, lxml.html, itertools, collections
SITE=sys.argv[1]
T={}
for root,d,fs in os.walk(SITE):
  for f in fs:
    if not f.endswith('.html'): continue
    full=os.path.join(root,f); rel=os.path.relpath(full,SITE)
    doc=lxml.html.fromstring(open(full,'rb').read())
    m=(doc.xpath('//main') or doc.xpath('//body'))[0]
    for bad in m.xpath('.//script|.//style|.//nav|.//svg|.//template|.//footer'): bad.drop_tree()
    w=re.findall(r'\w+',m.text_content().lower())
    T[rel]=w
json.dump({k:len(v) for k,v in T.items()},open('words_main.json','w'))
def sh(w,k=6): return set(hash(' '.join(w[i:i+k])) for i in range(max(1,len(w)-k+1)))
S={k:sh(v) for k,v in T.items()}
lang=lambda r:'de' if r.startswith('de/') else 'sq' if r.startswith('sq/') else 'en'
out=[]
for L in ('en','de','sq'):
    ks=[k for k in S if lang(k)==L]
    for a,b in itertools.combinations(ks,2):
        A,B=S[a],S[b]
        if not A or not B: continue
        inter=len(A&B)
        if inter==0: continue
        j=inter/len(A|B); c=inter/min(len(A),len(B))
        if j>0.5 or c>0.8: out.append((round(j,3),round(c,3),a,b,len(T[a]),len(T[b])))
out.sort(reverse=True)
json.dump(out,open('neardup.json','w'))
print(len(out))
for o in out[:60]: print(o)
