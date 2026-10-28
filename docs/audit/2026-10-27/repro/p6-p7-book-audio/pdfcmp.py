import re,sys,collections,unicodedata
W,SRC=sys.argv[1],sys.argv[2]
for l in ('sq','en','de'):
    t=open(f'{W}/{l}.pdf.txt',encoding='utf-8').read()
    c=collections.Counter(ch for ch in t if ord(ch)>127)
    print(l, dict(c.most_common()))
    print('  replacement chars:', t.count('�'), ' ? count:', t.count('?'))
    # compare words with source
    src=open(f'{SRC}/scripts/book/{l}.txt',encoding='utf-8').read()
    src=re.sub(r'^(#.*|[a-z-]+:)','',src,flags=re.M)
    norm=lambda s: re.findall(r"[^\W\d_]+",s.replace('­',''))
    pw=collections.Counter(w.lower() for w in norm(re.sub(r'-\n\s*','',t)))
    sw=collections.Counter(w.lower() for w in norm(src))
    missing={w:n-pw.get(w,0) for w,n in sw.items() if n>pw.get(w,0)}
    print('  words in source missing/undercounted in pdf:', len(missing), list(missing.items())[:40])
