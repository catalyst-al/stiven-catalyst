# Builds the STIVEN CATALYST.com logo as self-contained SVG (type outlined to paths): a lit Edison globe bulb hanging
# from a black socket, a light, widely spaced STIVEN, a bold CATALYST in a red-to-blue gradient and a dark .com.
# Two gradients ("brand": red, deep red, navy, blue as in the original mark; "vivid": red, magenta, violet, blue)
# times two orientations (landscape, portrait).
# Usage: python3 scripts/brand/make-logo.py <montserrat variable .woff2> <out dir>
import sys, os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONT, OUT = sys.argv[1:3]
W8 = {w: instantiateVariableFont(TTFont(FONT), {"wght": w}) for w in (400, 700, 800)}

GRADIENTS = {
    "brand": [(0, "#e3141c"), (0.30, "#d0161f"), (0.50, "#9b1a2c"), (0.64, "#4a1d4e"), (0.74, "#22307e"),
              (0.86, "#0f56c8"), (1, "#0a7ef0")],
    "vivid": [(0, "#ec0c1a"), (0.18, "#dc1238"), (0.36, "#b51d6f"), (0.52, "#7f2795"), (0.66, "#4e30a8"),
              (0.80, "#1f4fcc"), (1, "#0a86f2")],
}

def text_paths(text, w, size, x, y, track=0.0):
    """Outline `text` at weight w with its baseline at (x, y); track in em. Returns (paths, width)."""
    f = W8[w]; gs = f.getGlyphSet(); cmap = f.getBestCmap(); sc = size / f["head"].unitsPerEm
    cur, paths = x, []
    for i, ch in enumerate(text):
        g = cmap[ord(ch)]; pen = SVGPathPen(gs)
        gs[g].draw(TransformPen(pen, (sc, 0, 0, -sc, cur, y)))
        if pen.getCommands(): paths.append(pen.getCommands())
        cur += gs[g].width * sc + (track * size if i < len(text) - 1 else 0)
    return paths, cur - x

def width(text, w, size, track=0.0): return text_paths(text, w, size, 0, 0, track)[1]
def cap(w, size): f = W8[w]; return f["OS/2"].sCapHeight / f["head"].unitsPerEm * size

def bulb(cx, cy, R):
    """Edison globe of radius R centred on (cx, cy); socket above it, cord up to y = 0."""
    neck_w, neck_h = 0.56*R, 0.30*R
    ntop = cy - R - neck_h + 0.08*R                      # top of the glass neck
    sw, sh = 0.64*R, 1.00*R                              # socket body
    stop = ntop - sh + 0.06*R
    capw, caph = 0.30*R, 0.16*R
    cord = 0.045*R
    # filament: a cage of thin vertical LED strips on a glass stem
    fx = [cx + d*R for d in (-0.16, -0.08, 0.0, 0.08, 0.16)]
    f_top, f_bot = cy - 0.56*R, cy + 0.46*R
    fil = "".join(f'<line x1="{x:.2f}" y1="{f_top:.2f}" x2="{x:.2f}" y2="{f_bot:.2f}"/>' for x in fx)
    cage = (f'<path d="M{fx[0]:.2f},{f_top:.2f} Q{cx:.2f},{f_top-0.10*R:.2f} {fx[-1]:.2f},{f_top:.2f} '
            f'M{fx[0]:.2f},{f_bot:.2f} Q{cx:.2f},{f_bot+0.08*R:.2f} {fx[-1]:.2f},{f_bot:.2f}"/>')
    stem = (f'<path d="M{cx-0.05*R:.2f},{ntop+0.05*R:.2f} L{cx-0.03*R:.2f},{f_top-0.06*R:.2f} '
            f'M{cx+0.05*R:.2f},{ntop+0.05*R:.2f} L{cx+0.03*R:.2f},{f_top-0.06*R:.2f}"/>')
    glass_outline = (f"M{cx-neck_w/2:.2f},{ntop:.2f} L{cx+neck_w/2:.2f},{ntop:.2f} L{cx+neck_w/2:.2f},{cy-R*0.93:.2f} "
                     f"A{R:.2f},{R:.2f} 0 1,1 {cx-neck_w/2:.2f},{cy-R*0.93:.2f} Z")
    return f"""
  <g id="bulb">
    <ellipse cx="{cx:.2f}" cy="{cy+0.10*R:.2f}" rx="{1.05*R:.2f}" ry="{1.0*R:.2f}" fill="#c9a36a" opacity="0.20" filter="url(#bShadow)"/>
    <circle cx="{cx:.2f}" cy="{cy:.2f}" r="{1.9*R:.2f}" fill="url(#halo)"/>
    <rect x="{cx-cord/2:.2f}" y="0" width="{cord:.2f}" height="{stop-caph+2:.2f}" fill="#111113"/>
    <path d="{glass_outline}" fill="url(#glass)"/>
    <circle cx="{cx:.2f}" cy="{cy:.2f}" r="{0.75*R:.2f}" fill="url(#inner)"/>
    <g stroke="#e8d2a8" stroke-width="{0.022*R:.2f}" fill="none" opacity="0.9">{stem}</g>
    <g stroke="#ffa82a" stroke-width="{0.11*R:.2f}" stroke-linecap="round" fill="none" opacity="0.85" filter="url(#fGlow)">{fil}{cage}</g>
    <g stroke="#ffc94f" stroke-width="{0.034*R:.2f}" stroke-linecap="round" fill="none">{fil}{cage}</g>
    <g stroke="#fffbec" stroke-width="{0.016*R:.2f}" stroke-linecap="round" fill="none">{fil}</g>
    <path d="{glass_outline}" fill="url(#rim)"/>
    <path d="M{cx-0.80*R:.2f},{cy-0.30*R:.2f} A{0.86*R:.2f},{0.86*R:.2f} 0 0,1 {cx-0.30*R:.2f},{cy-0.80*R:.2f}"
          stroke="#ffffff" stroke-width="{0.07*R:.2f}" stroke-linecap="round" fill="none" opacity="0.85" filter="url(#bSoft)"/>
    <ellipse cx="{cx+0.48*R:.2f}" cy="{cy-0.52*R:.2f}" rx="{0.07*R:.2f}" ry="{0.12*R:.2f}" fill="#fff" opacity="0.9" transform="rotate(40 {cx+0.48*R:.2f} {cy-0.52*R:.2f})" filter="url(#bTiny)"/>
    <path d="M{cx+0.30*R:.2f},{cy+0.84*R:.2f} A{0.90*R:.2f},{0.90*R:.2f} 0 0,0 {cx+0.84*R:.2f},{cy+0.30*R:.2f}"
          stroke="#fff3da" stroke-width="{0.04*R:.2f}" stroke-linecap="round" fill="none" opacity="0.8" filter="url(#bTiny)"/>
    <rect x="{cx-neck_w/2-0.03*R:.2f}" y="{ntop-0.06*R:.2f}" width="{neck_w+0.06*R:.2f}" height="{0.12*R:.2f}" rx="{0.03*R:.2f}" fill="url(#brass)"/>
    <ellipse cx="{cx:.2f}" cy="{ntop:.2f}" rx="{neck_w*0.55:.2f}" ry="{0.05*R:.2f}" fill="#ffc157" opacity="0.9" filter="url(#bSoft)"/>
    <rect x="{cx-capw/2:.2f}" y="{stop-caph:.2f}" width="{capw:.2f}" height="{caph+0.05*R:.2f}" rx="{0.04*R:.2f}" fill="url(#socket)"/>
    <rect x="{cx-sw/2:.2f}" y="{stop:.2f}" width="{sw:.2f}" height="{sh:.2f}" rx="{0.16*R:.2f}" fill="url(#socket)"/>
    <rect x="{cx+sw*0.20:.2f}" y="{stop+0.12*R:.2f}" width="{0.05*R:.2f}" height="{sh-0.26*R:.2f}" rx="{0.025*R:.2f}" fill="#fff" opacity="0.35" filter="url(#bTiny)"/>
  </g>"""

def defs(R, grad, gx1, gx2, gy):
    stops = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in GRADIENTS[grad])
    return f"""<defs>
  <linearGradient id="catalyst" gradientUnits="userSpaceOnUse" x1="{gx1:.1f}" y1="{gy:.1f}" x2="{gx2:.1f}" y2="{gy:.1f}">{stops}</linearGradient>
  <radialGradient id="halo"><stop offset="0" stop-color="#ffd68a" stop-opacity="0.30"/><stop offset="0.45" stop-color="#ffe2a8" stop-opacity="0.10"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <radialGradient id="glass" cx="0.5" cy="0.55" r="0.55">
    <stop offset="0" stop-color="#fffaf0"/><stop offset="0.60" stop-color="#fdf4e4"/>
    <stop offset="0.86" stop-color="#f6e4c6"/><stop offset="1" stop-color="#e2c091"/>
  </radialGradient>
  <radialGradient id="inner"><stop offset="0" stop-color="#ffdc8c" stop-opacity="0.75"/><stop offset="0.55" stop-color="#ffe7b4" stop-opacity="0.28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <radialGradient id="rim" cx="0.5" cy="0.56" r="0.52">
    <stop offset="0.84" stop-color="#b98647" stop-opacity="0"/><stop offset="0.96" stop-color="#b98647" stop-opacity="0.30"/><stop offset="1" stop-color="#8f6331" stop-opacity="0.70"/>
  </radialGradient>
  <linearGradient id="socket" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#2b2b2f"/><stop offset="0.25" stop-color="#0c0c0e"/><stop offset="0.6" stop-color="#151518"/>
    <stop offset="0.78" stop-color="#3b3c41"/><stop offset="1" stop-color="#0e0e11"/>
  </linearGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7b5a26"/><stop offset="0.5" stop-color="#e7bf6c"/><stop offset="1" stop-color="#6f5022"/></linearGradient>
  <filter id="fGlow" x="-100%" y="-30%" width="300%" height="160%"><feGaussianBlur stdDeviation="{0.06*R:.2f}"/></filter>
  <filter id="bShadow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="{0.22*R:.2f}"/></filter>
  <filter id="bSoft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="{0.03*R:.2f}"/></filter>
  <filter id="bTiny" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="{0.015*R:.2f}"/></filter>
</defs>"""

def els(paths, fill): return "".join(f'<path d="{d}" fill="{fill}"/>' for d in paths)

ST_TRACK, CAT_TRACK, COM_TRACK = 0.62, -0.035, -0.01

def wordmark(x, base, C, centred=False):
    """STIVEN above CATALYST.com; CATALYST baseline at `base`, size C. Returns (svg, total width, CATALYST width)."""
    S, D = C*0.36, C*0.44
    wC = width("CATALYST", 800, C, CAT_TRACK); wD = width(".com", 700, D, COM_TRACK); gap = C*0.02
    total = wC + gap + wD
    wS = width("STIVEN", 400, S, ST_TRACK)
    sx = x + (total - wS)/2 if centred else x + C*0.03
    sbase = base - cap(800, C) - C*0.30
    pS, _ = text_paths("STIVEN", 400, S, sx, sbase, ST_TRACK)
    pC, _ = text_paths("CATALYST", 800, C, x, base, CAT_TRACK)
    pD, _ = text_paths(".com", 700, D, x + wC + gap, base, COM_TRACK)
    return (f'<g>{els(pS, "#141416")}</g>\n<g>{els(pC, "url(#catalyst)")}</g>\n<g>{els(pD, "#141416")}</g>'), total, wC

def svg(W, H, body, d):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" width="{W:.0f}" height="{H:.0f}">\n'
            f'{d}\n<rect width="{W:.0f}" height="{H:.0f}" fill="#ffffff"/>\n{body}\n</svg>\n')

def landscape(grad):
    H, C = 1100, 320
    base = 720; capC = cap(800, C)
    R = capC*0.60
    cy = base - capC*0.50
    cx = 360
    x = cx + R*1.45
    wm, total, wC = wordmark(x, base, C)
    W = x + total + 260
    return svg(W, H, bulb(cx, cy, R) + "\n" + wm, defs(R, grad, x, x + wC, base))

def portrait(grad):
    W, H, C = 2400, 3000, 300
    _, total, wC = wordmark(0, 0, C, True)
    x = (W - total)/2; base = 2290
    wm, _, _ = wordmark(x, base, C, True)
    R = 235; cy = 1450
    return svg(W, H, bulb(W/2, cy, R) + "\n" + wm, defs(R, grad, x, x + wC, base))

os.makedirs(OUT, exist_ok=True)
for g in GRADIENTS:
    open(f"{OUT}/stiven-catalyst-logo-landscape-{g}.svg", "w").write(landscape(g))
    open(f"{OUT}/stiven-catalyst-logo-portrait-{g}.svg", "w").write(portrait(g))
print("ok")
