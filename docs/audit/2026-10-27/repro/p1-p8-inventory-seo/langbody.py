import os, sys, re, json, lxml.html
SITE=sys.argv[1]
SW={'en':set('the and of to is in for with that on how when your you what it are from by not this was'.split()),
'de':set('der die das und ist nicht mit für ein eine den dem wie wenn sie zu auf im von des sich auch ich'.split()),
'sq':set('dhe të në një që është për me nga si kur nuk ka së janë ose më ky kjo'.split())}
res=[]
for root,d,fs in os.walk(SITE):
  for f in fs:
    if not f.endswith('.html'): continue
    full=os.path.join(root,f); rel=os.path.relpath(full,SITE)
    doc=lxml.html.fromstring(open(full,'rb').read())
    m=doc.xpath('//main') or doc.xpath('//body')
    b=m[0]
    for bad in b.xpath('.//script|.//style|.//nav|.//svg|.//template'): bad.drop_tree()
    # remove elements explicitly marked with another lang
    exp='de' if rel.startswith('de/') else 'sq' if rel.startswith('sq/') else 'en'
    for el in b.xpath('.//*[@lang]'):
        if el.get('lang')[:2]!=exp: el.drop_tree()
    w=re.findall(r"\w+",b.text_content().lower())
    s={k:sum(1 for x in w if x in v) for k,v in SW.items()}
    tot=sum(s.values()) or 1
    res.append((rel,exp,s,round(1-s[exp]/tot,3),len(w)))
res.sort(key=lambda r:-r[3])
json.dump(res,open('langbody.json','w'))
for r in res[:40]: print(r)
