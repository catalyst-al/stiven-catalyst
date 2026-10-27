import os,sys,re,lxml.html,collections,statistics
SITE=sys.argv[1]
for L in ('', 'de/', 'sq/'):
    base=os.path.join(SITE,L,'tools'); T={}
    for t in sorted(os.listdir(base)):
        f=os.path.join(base,t,'index.html')
        if not os.path.isfile(f): continue
        doc=lxml.html.fromstring(open(f,'rb').read()); m=doc.xpath('//main')[0]
        for bad in m.xpath('.//script|.//style|.//nav|.//svg|.//template'): bad.drop_tree()
        T[t]=re.findall(r'\w+',m.text_content().lower())
    sh={t:[' '.join(w[i:i+6]) for i in range(len(w)-5)] for t,w in T.items()}
    df=collections.Counter(s for t in sh for s in set(sh[t]))
    u={t:sum(1 for s in v if df[s]<=3)/max(1,len(v)) for t,v in sh.items()}
    uw={t:round(u[t]*len(T[t])) for t in T}
    print(L or 'en', 'tools',len(T),'median words',statistics.median(len(v) for v in T.values()),'median unique-share',round(statistics.median(u.values()),2),'median unique words',statistics.median(uw.values()))
    print('   lowest:',sorted(uw.items(),key=lambda x:x[1])[:6])
