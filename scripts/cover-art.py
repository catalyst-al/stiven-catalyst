# Run from the repository root:  python3 scripts/cover-art.py          (Pillow)
#                                python3 scripts/cover-art.py --pdfs   (and PyMuPDF)
#
# Makes src/media/magazine/management-review-2026-09/art/mark.jpg: the picture on the cover and the back of every
# publication (the Management Review, the monthly issues, the Operational Treatise, From the Floor; lib/weekly/common.js,
# lib/treatise/common.js, src/_data/review.js). It is the mark (the circled point) at the centre of its small system,
# in a column of cool light on the night ground: the same drawing of the ring as RING in src/js/cosmos.js. The mark is
# flat; the light, the orbits and the four families begin outside the ring. It is drawn at twice the size the pages
# name (350 x 700), so the cover stays sharp on a large screen.
#
# With --pdfs the picture is also laid into the PDFs that are already printed (src/media/magazine/*/*.pdf), in place
# of the picture their cover holds, without printing them again: the one picture of the cover (it is used again on
# the back) is replaced and the change is added to the end of the file, so every other byte of the PDF, its text, its
# outline and its properties, stays as it was. Afterwards the covers are drawn again from the PDFs:
#   for each issue: MEDIA_ROOT=magazine DATA_FILE=magazinePages.json COVER_ONLY=1 python3 scripts/guide-pages.py <slug> en sq de
#   node scripts/thumbnails.mjs
# A publication printed after this (scripts/magazine.mjs and its siblings) takes the picture by itself.
import math, random, sys
from PIL import Image, ImageDraw, ImageFilter
W,H,S=700,1400,2
CX,CY=0.5*W,0.40*H
U=3.3
NIGHT=(5,8,11); INK=(246,247,244); BLUE=(74,181,247)
TILT=math.radians(-14)
def ring():
    widths=[(0,.66),(.1,.94),(.42,1),(.75,.82),(.92,.5),(1,.22)]
    def width(t):
        for (t0,w0),(t1,w1) in zip(widths,widths[1:]):
            if t0<=t<=t1: return 9*(w0+(w1-w0)*(1-math.cos(math.pi*(t-t0)/(t1-t0)))/2)
        return 9*.22
    n=320; rot=math.radians(8); c=[]
    for i in range(n+1):
        t=i/n; a=math.radians(250-398*t); g=1 if t<.64 else 1+.37*((t-.64)/.36)**1.7
        x,y=34.5*g*math.cos(a),30*g*math.sin(a)
        c.append((50+x*math.cos(rot)-y*math.sin(rot),52+x*math.sin(rot)+y*math.cos(rot),width(t)/2))
    L,R=[],[]
    for i in range(n+1):
        a,b=c[max(i-1,0)],c[min(i+1,n)]; d=math.hypot(b[0]-a[0],b[1]-a[1]) or 1
        nx,ny=-(b[1]-a[1])/d,(b[0]-a[0])/d; x,y,w=c[i]
        L.append((x+nx*w,y+ny*w)); R.append((x-nx*w,y-ny*w))
    return L+R[::-1],(c[0],c[-1])
px=lambda x,y:((CX+(x-50)*U)*S,(CY+(y-52)*U)*S)
def on(rx,ry,deg):
    a=math.radians(deg)
    return ((CX+rx*math.cos(a)*math.cos(TILT)-ry*math.sin(a)*math.sin(TILT))*S,(CY+rx*math.cos(a)*math.sin(TILT)+ry*math.sin(a)*math.cos(TILT))*S)
random.seed(5)
pic=Image.new('RGB',(W*S,H*S),NIGHT)
# a column of cool light, the place the stripes of the earlier cover held
col=Image.new('L',(W*S,H*S),0); d=ImageDraw.Draw(col)
d.rectangle((0.30*W*S,0,0.98*W*S,H*S),fill=120); d.rectangle((0.52*W*S,0,0.80*W*S,H*S),fill=200)
col=col.filter(ImageFilter.GaussianBlur(70*S))
fade=Image.linear_gradient('L').resize((W*S,H*S)).point(lambda v:255-int(v*0.55))
col=Image.composite(col,Image.new('L',(W*S,H*S),0),fade)
pic=Image.composite(Image.new('RGB',(W*S,H*S),(22,92,158)),pic,col)
hole=Image.new('L',(W*S,H*S),0); ImageDraw.Draw(hole).ellipse(((CX-138)*S,(CY-122)*S,(CX+138)*S,(CY+122)*S),fill=255)
hole=hole.filter(ImageFilter.GaussianBlur(30*S)); pic=Image.composite(Image.new('RGB',(W*S,H*S),NIGHT),pic,hole.point(lambda v:int(v*.9)))
dust=Image.new('RGBA',(W*S,H*S),(0,0,0,0)); p=ImageDraw.Draw(dust)
for _ in range(420):
    x,y=random.uniform(0,W)*S,random.uniform(0,H)*S
    if math.hypot((x/S-CX)/140,(y/S-CY)/124)<1.05: continue
    s=random.choice((.7,.9,1.2,1.6))*S; p.ellipse((x-s,y-s,x+s,y+s),fill=random.choice(((226,238,255),(132,198,247),(246,204,128),(176,156,250)))+(random.randint(40,140),))
pic.paste(dust,(0,0),dust)
lines=Image.new('RGBA',(W*S,H*S),(0,0,0,0)); p=ImageDraw.Draw(lines)
ORB=((196,84,52),(292,128,40),(400,178,30))
for rx,ry,al in ORB: p.line([on(rx,ry,360*i/720) for i in range(721)],fill=(190,214,236,al),width=round(1.5*S),joint='curve')
pic.paste(lines,(0,0),lines)
pl=Image.new('RGBA',(W*S,H*S),(0,0,0,0)); hl=Image.new('RGBA',(W*S,H*S),(0,0,0,0)); p=ImageDraw.Draw(pl); g=ImageDraw.Draw(hl)
for col_,(rx,ry,_),deg,r in (((176,156,250),ORB[0],28,11),((132,198,247),ORB[1],236,13),((246,204,128),ORB[1],318,15),((214,222,230),ORB[2],98,12)):
    x,y=on(rx,ry,deg); r*=S; g.ellipse((x-r*3.2,y-r*3.2,x+r*3.2,y+r*3.2),fill=col_+(60,)); p.ellipse((x-r,y-r,x+r,y+r),fill=col_+(255,))
hl=hl.filter(ImageFilter.GaussianBlur(10*S)); pic.paste(hl,(0,0),hl); pic.paste(pl,(0,0),pl)
out,ends=ring(); p=ImageDraw.Draw(pic); p.polygon([px(x,y) for x,y in out],fill=INK)
for x,y,w in ends:
    cx,cy=px(x,y); p.ellipse((cx-w*U*S,cy-w*U*S,cx+w*U*S,cy+w*U*S),fill=INK)
(x0,y0),(x1,y1)=px(42,44),px(58,60); p.rectangle((round(x0),round(y0),round(x1),round(y1)),fill=BLUE)
pic = pic.resize((W, H), Image.LANCZOS)
ART = "src/media/magazine/management-review-2026-09/art/mark.jpg"
pic.save(ART, quality=88, optimize=True)
print(ART, pic.size)

if "--pdfs" in sys.argv:
    import glob
    import pymupdf

    done = 0
    for file in sorted(glob.glob("src/media/magazine/*/*.pdf")):
        pdf = pymupdf.open(file)
        pictures = pdf[0].get_images(full=True)
        # Only a cover that holds exactly one picture of the cover's shape (1 : 2), and only once per file.
        if len(pictures) != 1 or pictures[0][3] != 2 * pictures[0][2] or pictures[0][2] == W:
            print("left as it is:", file)
            continue
        # The picture's own data is exchanged (a JPEG, as before, in the colour space the PDF already names), so the
        # file holds one copy of it and both pages that show it follow.
        xref = pictures[0][0]
        pdf.update_stream(xref, open(ART, "rb").read(), new=True, compress=False)
        pdf.xref_set_key(xref, "Filter", "/DCTDecode")
        pdf.xref_set_key(xref, "Width", str(W))
        pdf.xref_set_key(xref, "Height", str(H))
        pdf.xref_set_key(xref, "ColorTransform", "null")
        pdf.save(file, incremental=True, encryption=pymupdf.PDF_ENCRYPT_KEEP)
        done += 1
    print(done, "PDFs carry the picture")
