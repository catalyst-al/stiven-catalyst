import os, re, json, sys
SRC = sys.argv[1]; OUT = sys.argv[2]
C = os.path.join(SRC, 'src/content')
res = []
for lang, pre in (('en',''),('de','de/'),('sq','sq/')):
    for typ in ('insights','reflections','notes','projects'):
        d = os.path.join(C, pre+typ)
        for f in sorted(os.listdir(d)):
            if not f.endswith('.md'): continue
            raw = open(os.path.join(d,f), encoding='utf-8').read()
            m = re.match(r'^---\n(.*?)\n---\n(.*)$', raw, re.S)
            fm, body = (m.group(1), m.group(2)) if m else ('', raw)
            fm_lines = fm.count('\n') + 3 if m else 0
            tm = re.search(r'^title:\s*(.*)$', fm, re.M)
            res.append(dict(lang=lang, type=typ, file=os.path.join('src/content', pre+typ, f), slug=f[:-3],
                            title=(tm.group(1).strip().strip('"\'') if tm else ''), fm=fm, body=body, body_line0=fm_lines))
json.dump(res, open(OUT,'w'), ensure_ascii=False)
print(len(res))
