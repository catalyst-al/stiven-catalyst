# Builds the Stiven Catalyst .com logo as self-contained SVG (text outlined to paths) in two orientations.
import sys, os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONT = sys.argv[1]; OUT = sys.argv[2]
fonts = {w: instantiateVariableFont(TTFont(FONT), {"wght": w}) for w in (800, 900)}

def text_paths(text, size, weight, x, y, spacing_em=0.0, xs=1.0):
    """svg path d strings for text with baseline at (x, y); xs = horizontal compression. Returns (paths, width)."""
    f = fonts[weight]; gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f["head"].unitsPerEm
    sc = size / upm; cur = x; paths = []
    for i, ch in enumerate(text):
        g = cmap[ord(ch)]; pen = SVGPathPen(gs)
        gs[g].draw(TransformPen(pen, (sc*xs, 0, 0, -sc, cur, y)))
        d = pen.getCommands()
        if d: paths.append(d)
        cur += gs[g].width * sc * xs
        if i < len(text) - 1: cur += spacing_em * size
    return paths, cur - x

def text_width(text, size, weight, spacing_em=0.0, xs=1.0):
    return text_paths(text, size, weight, 0, 0, spacing_em, xs)[1]

def bulb(cx, top, s=1.0):
    """Hanging pear-shaped bulb. cx = centre x, top = top of the socket cap, s = scale. Returns (svg, bottom y)."""
    sw, sh = 58*s, 70*s                      # socket cap
    nw = 58*s                                # glass neck width
    r = 118*s                                # glass radius at its widest
    brass_h = 5*s
    y0 = top + sh + brass_h                  # glass starts here
    import math
    neck = 30*s; th = math.radians(52); cy = y0 + neck + 58*s + r      # centre of the round body
    px, py = cx + r*math.cos(th), cy - r*math.sin(th)                  # where the shoulder curve meets the body
    k1, k2 = 46*s, 70*s
    glass = (f"M{cx-nw/2:.1f},{y0:.1f} L{cx+nw/2:.1f},{y0:.1f} L{cx+nw/2:.1f},{y0+neck:.1f} "
             f"C{cx+nw/2:.1f},{y0+neck+k1:.1f} {px-k2*math.sin(th):.1f},{py-k2*math.cos(th):.1f} {px:.1f},{py:.1f} "
             f"A{r:.1f},{r:.1f} 0 1,1 {2*cx-px:.1f},{py:.1f} "
             f"C{2*cx-px+k2*math.sin(th):.1f},{py-k2*math.cos(th):.1f} {cx-nw/2:.1f},{y0+neck+k1:.1f} {cx-nw/2:.1f},{y0+neck:.1f} Z")
    return f"""
  <!-- light halo and soft shadow around the glass -->
  <path d="{glass}" fill="#c3c6cb" opacity="0.65" filter="url(#halo)"/>
  <path d="{glass}" fill="#a9adb3" opacity="0.5" filter="url(#soft)" transform="translate(0 {3*s:.1f})"/>
  <!-- cord -->
  <rect x="{cx-6*s:.1f}" y="0" width="{12*s:.1f}" height="{top+4*s:.1f}" fill="url(#cord)"/>
  <!-- glass -->
  <path d="{glass}" fill="url(#glass)"/>
  <path d="{glass}" fill="url(#glassrim)"/>
  <ellipse cx="{cx-r*0.36:.1f}" cy="{cy-r*0.30:.1f}" rx="{r*0.20:.1f}" ry="{r*0.30:.1f}" fill="#ffffff" opacity="0.9" transform="rotate(-24 {cx-r*0.36:.1f} {cy-r*0.30:.1f})" filter="url(#tiny)"/>
  <!-- socket cap -->
  <rect x="{cx-15*s:.1f}" y="{top-8*s:.1f}" width="{30*s:.1f}" height="{14*s:.1f}" rx="{4*s:.1f}" fill="#101012"/>
  <rect x="{cx-sw/2:.1f}" y="{top:.1f}" width="{sw:.1f}" height="{sh:.1f}" rx="{7*s:.1f}" fill="url(#socket)"/>
  <rect x="{cx-sw/2+6*s:.1f}" y="{top+6*s:.1f}" width="{7*s:.1f}" height="{sh-12*s:.1f}" rx="{3*s:.1f}" fill="#ffffff" opacity="0.10"/>
  <!-- brass ring between cap and glass -->
  <rect x="{cx-nw/2-2*s:.1f}" y="{top+sh-1*s:.1f}" width="{nw+4*s:.1f}" height="{brass_h+1*s:.1f}" fill="url(#brass)"/>
""", cy + r

def defs(gx1, gx2, gy, cx, top, s):
    return f"""<defs>
  <linearGradient id="catalyst" gradientUnits="userSpaceOnUse" x1="{gx1:.1f}" y1="{gy:.1f}" x2="{gx2:.1f}" y2="{gy:.1f}">
    <stop offset="0" stop-color="#e21f1f"/>
    <stop offset="0.36" stop-color="#cc1c1d"/>
    <stop offset="0.50" stop-color="#951c23"/>
    <stop offset="0.59" stop-color="#3d1e3f"/>
    <stop offset="0.67" stop-color="#1a2a6e"/>
    <stop offset="0.76" stop-color="#0c56c6"/>
    <stop offset="0.88" stop-color="#1476df"/>
    <stop offset="1" stop-color="#1c8bee"/>
  </linearGradient>
  <linearGradient id="gloss" gradientUnits="userSpaceOnUse" x1="{gx1:.1f}" y1="{gy-300:.1f}" x2="{gx1+600:.1f}" y2="{gy:.1f}" spreadMethod="repeat">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="0.30" stop-color="#ffffff" stop-opacity="0.16"/>
    <stop offset="0.42" stop-color="#000000" stop-opacity="0.07"/>
    <stop offset="0.60" stop-color="#ffffff" stop-opacity="0.05"/>
    <stop offset="0.78" stop-color="#000000" stop-opacity="0.12"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="depth" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.10"/>
    <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000000" stop-opacity="0.16"/>
  </linearGradient>
  <linearGradient id="silver" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0" stop-color="#a7a8ad"/>
    <stop offset="0.5" stop-color="#8e8f95"/>
    <stop offset="1" stop-color="#77787e"/>
  </linearGradient>
  <radialGradient id="glass" cx="0.40" cy="0.38" r="0.72">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset="0.55" stop-color="#fdfdfd"/>
    <stop offset="0.82" stop-color="#eff0f2"/>
    <stop offset="1" stop-color="#d4d6da"/>
  </radialGradient>
  <linearGradient id="glassrim" x1="0" y1="0" x2="1" y2="0.4">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
    <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="1" stop-color="#9ea2a8" stop-opacity="0.22"/>
  </linearGradient>
  <linearGradient id="socket" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#2c2c30"/>
    <stop offset="0.35" stop-color="#0b0b0d"/>
    <stop offset="0.8" stop-color="#121214"/>
    <stop offset="1" stop-color="#2a2a2e"/>
  </linearGradient>
  <linearGradient id="cord" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#303033"/>
    <stop offset="0.5" stop-color="#0c0c0e"/>
    <stop offset="1" stop-color="#1c1c1f"/>
  </linearGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#9a7a3a"/>
    <stop offset="0.5" stop-color="#e2bf6a"/>
    <stop offset="1" stop-color="#8d6f33"/>
  </linearGradient>
  <filter id="halo" x="-60%" y="-40%" width="220%" height="180%"><feGaussianBlur stdDeviation="{34*s:.1f}"/></filter>
  <filter id="soft" x="-40%" y="-30%" width="180%" height="160%"><feGaussianBlur stdDeviation="{9*s:.1f}"/></filter>
  <filter id="tiny" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="{5*s:.1f}"/></filter>
</defs>"""

def paths_el(paths, fill):
    return "".join(f'<path d="{d}" fill="{fill}"/>' for d in paths)

BLACK = "#0b0b0c"
XS_C, SP_C = 0.90, -0.028      # CATALYST: compressed 10 %, tight tracking
XS_S, SP_S = 0.96, 0.40        # STIVEN

def wordmark(tx, base_c, C, align="left"):
    """STIVEN over CATALYST.com. Returns (svg, total line width)."""
    S, D = C*0.33, C*0.62
    wC = text_width("CATALYST", C, 900, SP_C, XS_C); wD = text_width(".com", D, 900, -0.01, XS_C)
    wS = text_width("STIVEN", S, 900, SP_S, XS_S); gap = C*0.06
    base_s = base_c - C*0.70 - C*0.26
    sx = tx if align == "left" else tx + (wC + gap + wD - wS)/2
    pS, _ = text_paths("STIVEN", S, 900, sx, base_s, SP_S, XS_S)
    pC, _ = text_paths("CATALYST", C, 900, tx, base_c, SP_C, XS_C)
    pD, _ = text_paths(".com", D, 900, tx + wC + gap, base_c, -0.01, XS_C)
    svg = f"""<g>{paths_el(pS, BLACK)}</g>
<g>{paths_el(pC, "url(#catalyst)")}</g>
<g>{paths_el(pC, "url(#gloss)")}</g>
<g>{paths_el(pC, "url(#depth)")}</g>
<g>{paths_el(pD, "url(#silver)")}</g>
<g>{paths_el(pD, "url(#depth)")}</g>"""
    return svg, wC + gap + wD, wC

def landscape():
    H = 900; C = 300; tx = 880; base_c = 640
    wm, line_w, wC = wordmark(tx, base_c, C)
    W = round(tx + line_w + 200)
    b, _ = bulb(500, 250, 1.2)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
{defs(tx, tx + wC, base_c, 500, 250, 1.2)}
<rect width="{W}" height="{H}" fill="#ffffff"/>
{b}
{wm}
</svg>"""

def portrait():
    W, H = 2400, 3000; C = 300
    _, line_w, wC = wordmark(0, 0, C)
    tx = (W - line_w)/2; base_c = 2310
    wm, _, _ = wordmark(tx, base_c, C, align="center")
    b, _ = bulb(W/2, 700, 1.9)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
{defs(tx, tx + wC, base_c, W/2, 700, 1.9)}
<rect width="{W}" height="{H}" fill="#ffffff"/>
{b}
{wm}
</svg>"""

os.makedirs(OUT, exist_ok=True)
open(f"{OUT}/stiven-catalyst-logo-landscape.svg", "w").write(landscape())
open(f"{OUT}/stiven-catalyst-logo-portrait.svg", "w").write(portrait())
print("ok")
