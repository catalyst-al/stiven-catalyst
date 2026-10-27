import sys,re,html
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.out=[]; s.skip=0
    def handle_starttag(s,t,a):
        if t in("script","style","svg","noscript","header","nav","footer"): s.skip+=1
        if t in("p","div","li","h1","h2","h3","h4","tr","section","figcaption","br","dt","dd"): s.out.append("\n")
    def handle_endtag(s,t):
        if t in("script","style","svg","noscript","header","nav","footer"): s.skip-=1
    def handle_data(s,d):
        if s.skip<=0: s.out.append(d)
p=P(); h=open(sys.argv[1]).read()
m=re.search(r'<main.*?</main>',h,re.S)
p.feed(m.group(0) if m else h)
t=re.sub(r'[ \t]+',' ',''.join(p.out)); t=re.sub(r'\n\s*\n+','\n',t)
print(t)
