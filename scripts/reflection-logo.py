# Run from the repository root: python3 scripts/reflection-logo.py (Pillow and NumPy).
# Makes src/media/stiven-catalyst-coaching-hero.jpg: the logo on the site's dark ground, for the side of a
# reflection's hero. The white background becomes transparent, the black (STIVEN, the cord) turns light,
# the bulb is lit, the colours of CATALYST and COACHING stay as they are.
from PIL import Image, ImageFilter, ImageDraw
import numpy as np
from collections import deque
img=Image.open('src/media/stiven-catalyst-coaching.jpg').convert('RGB')
src=np.asarray(img).astype(float); h,w,_=src.shape
minc=src.min(2); lum=src.mean(2); sat=src.max(2)-src.min(2)
a=np.clip((250-minc)/(250-175),0,1)
op=(a>=1).astype(float)
def blur(x,r):
    # a box blur three times over, close to a Gaussian
    x=np.asarray(x,float); k=int(r)*2+1
    for _ in range(3):
        for ax in (0,1):
            c=np.cumsum(np.pad(x,[(k//2+1,k//2) if i==ax else (0,0) for i in (0,1)],mode='edge'),axis=ax)
            x=(np.take(c,range(k,c.shape[ax]),axis=ax)-np.take(c,range(0,c.shape[ax]-k),axis=ax))/k
    return x
# edge pixels take the colour of the solid letter next to them, not the white they were mixed with
num=np.dstack([blur(src[...,i]*op,2) for i in range(3)]); den=blur(op,2)[...,None]
edge=np.where(den>1e-3,num/np.maximum(den,1e-3),src)
col=np.where(op[...,None]>0,src,edge)
cl=col.mean(2); cs=col.max(2)-col.min(2)
blk=np.clip((95-cl)/45,0,1)*np.clip(1-cs/22,0,1)
col=col*(1-blk[...,None])+np.array([234,237,240])*blk[...,None]
# the bulb: flood the white body from its centre, inside the soft shadow ring
cx,cy=452,228
body=np.zeros((h,w),bool); q=deque([(cy,cx)]); body[cy,cx]=True
while q:
    y,x=q.popleft()
    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny,nx=y+dy,x+dx
        if 0<=ny<h and 0<=nx<w and not body[ny,nx] and lum[ny,nx]>228 and abs(nx-cx)<70 and abs(ny-cy)<70:
            body[ny,nx]=True; q.append((ny,nx))
print('bulb px',body.sum())
yy,xx=np.mgrid[0:h,0:w]
socket=(yy<184)&(abs(xx-cx)<29)&(lum<225)
ring=(((xx-cx)/85)**2+((yy-cy)/85)**2<1)&~body&~socket
a[ring]=0
bm=blur(body*255.0,1.0)/255
col=col*(1-bm[...,None])+np.array([255,247,228])*bm[...,None]
a=np.maximum(a,bm)
logo=Image.fromarray(np.dstack([col,a*255]).clip(0,255).astype('uint8'),'RGBA').crop((380,0,1010,290))
W,H=1440,1224; s=1.6
logo=logo.resize((int(logo.width*s),int(logo.height*s)),Image.LANCZOS)
x=int(W*0.375-(cx-380)*s); y=int(H*0.47-cy*s)
bg=Image.new('RGB',(W,H),(6,10,16))
bx,by=x+int((cx-380)*s),y+int(cy*s)
glow=Image.new('L',(W,H),0); ImageDraw.Draw(glow).ellipse((bx-240,by-240,bx+240,by+240),fill=105); glow=glow.filter(ImageFilter.GaussianBlur(120))
bg=Image.composite(Image.new('RGB',(W,H),(255,212,150)),bg,glow)
core=Image.new('L',(W,H),0); ImageDraw.Draw(core).ellipse((bx-70,by-60,bx+70,by+80),fill=150); core=core.filter(ImageFilter.GaussianBlur(40))
bg=Image.composite(Image.new('RGB',(W,H),(255,236,200)),bg,core)
blue=Image.new('L',(W,H),0); ImageDraw.Draw(blue).ellipse((W*0.5,-H*0.35,W*1.35,H*0.55),fill=60); blue=blue.filter(ImageFilter.GaussianBlur(170))
bg=Image.composite(Image.new('RGB',(W,H),(10,106,176)),bg,blue)
row=logo.crop((0,0,logo.width,1))
for y2 in range(y): bg.paste(row,(x,y2),row)
bg.paste(logo,(x,y),logo)
bg.save('src/media/stiven-catalyst-coaching-hero.jpg',quality=88,optimize=True)
