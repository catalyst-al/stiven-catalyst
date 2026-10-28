import os, sys, re
SRC='$SRC/src/content'
typ, slug = sys.argv[1], sys.argv[2]
mode = sys.argv[3] if len(sys.argv)>3 else 'inter'
def paras(pre):
    p = os.path.join(SRC, pre+typ, slug+'.md')
    lines = open(p, encoding='utf-8').read().split('\n')
    # find end of front matter
    end = [i for i,l in enumerate(lines) if l=='---'][1]
    fm = lines[:end+1]
    out=[]; cur=[]; start=None
    for i in range(end+1, len(lines)):
        l=lines[i]
        if l.strip()=='' :
            if cur: out.append((start, ' '.join(cur))); cur=[]
        else:
            if not cur: start=i+1
            cur.append(l)
    if cur: out.append((start,' '.join(cur)))
    return fm, out
langs=[('sq','sq/'),('en',''),('de','de/')]
data={l:paras(p) for l,p in langs}
for l,_ in langs:
    fm=data[l][0]
    keep=[x for x in fm if re.match(r'^(title|summary|deck|description|teaser):',x)]
    print(f'== {l} FM:', ' | '.join(keep))
n=max(len(data[l][1]) for l,_ in langs)
print('paras:', {l:len(data[l][1]) for l,_ in langs})
for i in range(n):
    for l,_ in langs:
        ps=data[l][1]
        if i<len(ps): print(f'[{l} L{ps[i][0]}] {ps[i][1]}')
    print()
