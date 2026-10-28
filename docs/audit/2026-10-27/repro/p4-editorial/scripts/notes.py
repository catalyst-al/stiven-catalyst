import json,re,collections,random,statistics as st
W='$AUDIT_WORK/p4-editorial/'
C=json.load(open(W+'corpus.json',encoding='utf-8'))
N={}
for d in C:
    if d['type']!='notes': continue
    m=re.search(r'^quote:\s*(.*)$',d['fm'],re.M)
    q=m.group(1).strip()
    if q[:1] in '"\'' : q=q[1:-1]
    q=q.replace('\\"','"').replace("''","'")
    N.setdefault(d['slug'],{})[d['lang']]=q
json.dump(N,open(W+'out/notes.json','w'),ensure_ascii=False,indent=0)
P={'en':[r"\b(?:is|are|was|does|do)(?: not|n't)\b[^.;:]{0,80}[.;]\s+(?:It|They|That|This)(?:'s| is| are)\b", r"\bnot\b[^.;:]{1,70},? but\b", r"\bnot\b"],
   'de':[r"\b(?:ist|sind) (?:kein\w*|nicht)\b[^.;:]{0,80}[.;]\s+(?:Es|Sie|Er|Das)(?: ist| sind)\b", r"\b(?:nicht|kein\w*)\b[^.;:]{1,70},? sondern\b", r"\b(?:nicht|kein\w*)\b"],
   'sq':[r"\bnuk (?:është|janë)\b[^.;:]{0,80}[.;]\s+(?:Është|Janë|Ajo është|Ai është|Kjo është)\b", r"\bnuk\b[^.;:]{1,70},? por\b", r"\bnuk\b"]}
for lang in ('en','de','sq'):
    qs=[v[lang] for v in N.values()]
    wl=[len(q.split()) for q in qs]; sc=[len(re.findall(r'[.!?](\s|$)',q)) for q in qs]
    c=[sum(1 for q in qs if re.search(rx,q)) for rx in P[lang]]
    two=sum(1 for q in qs if len(re.findall(r'[.!?](?:\s|$)',q))==2)
    print(lang,'n',len(qs),'words mean',round(st.mean(wl),1),'median',st.median(wl),'min',min(wl),'max',max(wl),
          '| notX-itisY',c[0],'| notX-butY',c[1],'| contains negation',c[2],f'({round(100*c[2]/len(qs))}%)','| exactly 2 sentences',two)
    fw=collections.Counter(' '.join(q.split()[:2]) for q in qs).most_common(8); print('  top openings',fw)
random.seed(42); s=random.sample(sorted(N),40)
json.dump(s,open(W+'out/notes_sample.json','w'))
for k in s:
    print('\n#',k); [print(' ',l,':',N[k][l]) for l in ('sq','en','de')]
