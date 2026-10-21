# Builds the STIVEN CATALYST.com logo as self-contained SVG (type outlined to paths), landscape and portrait.
# Usage: python3 scripts/brand/make-logo.py <montserrat.woff2> <archivo-black.woff2> <out dir>
# The bulb is the classic A-shape of the original mark and of the site: a black socket sitting on a pear of white
# glass, a thin brass line between them, a soft grey shadow around the glass. CATALYST is set in the site's display
# face (Archivo Black), tight as on the site, in the red-to-blue gradient with a fine brushed finish; .com is silver
# like the old COACHING line.
import sys, os, math
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

MONT, ARCHIVO, OUT = sys.argv[1:4]
FONTS = {"stiven": instantiateVariableFont(TTFont(MONT), {"wght": 800}), "display": TTFont(ARCHIVO)}

def text_paths(text, font, size, x, y, track=0.0):
    """Outline `text` with its baseline at (x, y); track = extra space between letters, in em. Returns (paths, width)."""
    f = FONTS[font]; gs = f.getGlyphSet(); cmap = f.getBestCmap(); sc = size / f["head"].unitsPerEm
    cur, paths = x, []
    for i, ch in enumerate(text):
        g = cmap[ord(ch)]; pen = SVGPathPen(gs)
        gs[g].draw(TransformPen(pen, (sc, 0, 0, -sc, cur, y)))
        if pen.getCommands(): paths.append(pen.getCommands())
        cur += gs[g].width * sc + (track * size if i < len(text) - 1 else 0)
    return paths, cur - x

def width(text, font, size, track=0.0):
    return text_paths(text, font, size, 0, 0, track)[1]

def cap_height(font, size):
    f = FONTS[font]; return f["OS/2"].sCapHeight / f["head"].unitsPerEm * size

def bulb(cx, cy, R):
    """A-shape bulb whose round body has centre (cx, cy) and radius R; the cord runs up to y = 0."""
    top = cy - 1.50*R                 # top of the glass
    n = 0.42*R                        # half width of the glass where it meets the socket
    th = math.radians(24); px, py = cx + R*math.cos(th), cy - R*math.sin(th)
    k = 0.50*R
    glass = (f"M{cx-n:.2f},{top:.2f} L{cx+n:.2f},{top:.2f} L{cx+n:.2f},{top+0.10*R:.2f} "
             f"C{cx+n:.2f},{top+0.48*R:.2f} {px-k*math.sin(th):.2f},{py-k*math.cos(th):.2f} {px:.2f},{py:.2f} "
             f"A{R:.2f},{R:.2f} 0 1,1 {2*cx-px:.2f},{py:.2f} "
             f"C{2*cx-px+k*math.sin(th):.2f},{py-k*math.cos(th):.2f} {cx-n:.2f},{top+0.48*R:.2f} {cx-n:.2f},{top+0.10*R:.2f} Z")
    sw, sh = 1.00*R, 0.96*R           # socket
    sy = top - sh                     # socket top
    cw, ch = 0.56*R, 0.16*R           # collar on top of the socket
    cord_w = 0.085*R
    return f"""
  <g id="bulb">
    <path d="{glass}" fill="#7d8088" opacity="0.38" filter="url(#bulbShadow)" transform="translate({-0.06*R:.2f} {0.10*R:.2f})"/>
    <rect x="{cx-cord_w/2:.2f}" y="0" width="{cord_w:.2f}" height="{sy-ch+1:.2f}" fill="url(#cord)"/>
    <path d="{glass}" fill="url(#glass)"/>
    <path d="{glass}" fill="none" stroke="#c9ccd1" stroke-width="{0.012*R:.2f}" opacity="0.7"/>
    <ellipse cx="{cx-0.38*R:.2f}" cy="{cy-0.36*R:.2f}" rx="{0.16*R:.2f}" ry="{0.30*R:.2f}" fill="#fff" opacity="0.85"
             transform="rotate(22 {cx-0.38*R:.2f} {cy-0.36*R:.2f})" filter="url(#bulbSoft)"/>
    <rect x="{cx-n-0.02*R:.2f}" y="{top-0.035*R:.2f}" width="{2*n+0.04*R:.2f}" height="{0.07*R:.2f}" fill="url(#brass)"/>
    <rect x="{cx-cw/2:.2f}" y="{sy-ch:.2f}" width="{cw:.2f}" height="{ch+0.05*R:.2f}" rx="{0.05*R:.2f}" fill="url(#socket)"/>
    <rect x="{cx-sw/2:.2f}" y="{sy:.2f}" width="{sw:.2f}" height="{sh:.2f}" rx="{0.10*R:.2f}" fill="url(#socket)"/>
    <rect x="{cx+sw*0.22:.2f}" y="{sy+0.10*R:.2f}" width="{0.075*R:.2f}" height="{sh-0.20*R:.2f}" rx="{0.04*R:.2f}" fill="#fff" opacity="0.55" filter="url(#bulbTiny)"/>
    <rect x="{cx-sw*0.40:.2f}" y="{sy+0.10*R:.2f}" width="{0.05*R:.2f}" height="{sh-0.20*R:.2f}" rx="{0.03*R:.2f}" fill="#fff" opacity="0.10"/>
  </g>"""

def defs(R, gx1, gx2, gy, cap):
    return f"""<defs>
  <linearGradient id="catalyst" gradientUnits="userSpaceOnUse" x1="{gx1:.1f}" y1="{gy:.1f}" x2="{gx2:.1f}" y2="{gy:.1f}">
    <stop offset="0" stop-color="#dc2520"/>
    <stop offset="0.38" stop-color="#d0221f"/>
    <stop offset="0.52" stop-color="#a11f23"/>
    <stop offset="0.62" stop-color="#5a1f35"/>
    <stop offset="0.68" stop-color="#262551"/>
    <stop offset="0.76" stop-color="#1446a8"/>
    <stop offset="0.86" stop-color="#0d5fd2"/>
    <stop offset="1" stop-color="#0f78ea"/>
  </linearGradient>
  <linearGradient id="silver" gradientUnits="userSpaceOnUse" x1="0" y1="{gy-cap:.1f}" x2="0" y2="{gy:.1f}">
    <stop offset="0" stop-color="#a3a4aa"/>
    <stop offset="1" stop-color="#7f8086"/>
  </linearGradient>
  <linearGradient id="shade" gradientUnits="userSpaceOnUse" x1="0" y1="{gy-cap:.1f}" x2="0" y2="{gy:.1f}">
    <stop offset="0" stop-color="#fff" stop-opacity="0.10"/>
    <stop offset="0.45" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity="0.13"/>
  </linearGradient>
  <!-- a fine brushed grain, like the print of the original mark -->
  <filter id="brushed" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="{1.6/R*20:.4f} {0.04/R*20:.4f}" numOctaves="2" seed="7" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -0.62" result="streaks"/>
    <feComposite in="streaks" in2="SourceGraphic" operator="in" result="s"/>
    <feComponentTransfer in="s" result="t"><feFuncA type="linear" slope="0.10"/></feComponentTransfer>
    <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="t"/></feMerge>
  </filter>
  <radialGradient id="glass" cx="0.42" cy="0.40" r="0.70">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset="0.6" stop-color="#fdfdfd"/>
    <stop offset="0.86" stop-color="#f1f2f4"/>
    <stop offset="1" stop-color="#dfe1e5"/>
  </radialGradient>
  <linearGradient id="socket" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#26272b"/>
    <stop offset="0.30" stop-color="#0a0a0c"/>
    <stop offset="0.62" stop-color="#121215"/>
    <stop offset="0.80" stop-color="#3a3b40"/>
    <stop offset="1" stop-color="#0d0d10"/>
  </linearGradient>
  <linearGradient id="cord" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#2a2a2e"/>
    <stop offset="0.45" stop-color="#0b0b0d"/>
    <stop offset="1" stop-color="#18181b"/>
  </linearGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#8a6a33"/>
    <stop offset="0.5" stop-color="#d9b46a"/>
    <stop offset="1" stop-color="#7d5f2c"/>
  </linearGradient>
  <filter id="bulbShadow" x="-80%" y="-60%" width="260%" height="220%"><feGaussianBlur stdDeviation="{0.20*R:.2f}"/></filter>
  <filter id="bulbSoft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="{0.07*R:.2f}"/></filter>
  <filter id="bulbTiny" x="-100%" y="-20%" width="300%" height="140%"><feGaussianBlur stdDeviation="{0.02*R:.2f}"/></filter>
</defs>"""

def els(paths, fill, extra=""):
    return "".join(f'<path d="{d}" fill="{fill}"{extra}/>' for d in paths)

STIVEN_TRACK, CAT_TRACK, COM_TRACK = 0.52, -0.045, -0.03

def wordmark(x, base, C, centred=False):
    """STIVEN above CATALYST.com, CATALYST's baseline at `base`, its font size C. Returns (svg, width, CATALYST width)."""
    S, D = C*0.30, C*0.60
    capC = cap_height("display", C); capS = cap_height("stiven", S)
    wC = width("CATALYST", "display", C, CAT_TRACK); wD = width(".com", "display", D, COM_TRACK); gap = C*0.05
    total = wC + gap + wD
    wS = width("STIVEN", "stiven", S, STIVEN_TRACK)
    sx = x + (total - wS)/2 if centred else x + C*0.02
    sbase = base - capC - capS*0.95
    pS, _ = text_paths("STIVEN", "stiven", S, sx, sbase, STIVEN_TRACK)
    pC, _ = text_paths("CATALYST", "display", C, x, base, CAT_TRACK)
    pD, _ = text_paths(".com", "display", D, x + wC + gap, base, COM_TRACK)
    svg = (f'<g fill="#111113">{els(pS, "#111113")}</g>\n'
           f'<g filter="url(#brushed)">{els(pC, "url(#catalyst)")}</g>\n<g>{els(pC, "url(#shade)")}</g>\n'
           f'<g filter="url(#brushed)">{els(pD, "url(#silver)")}</g>\n<g>{els(pD, "url(#shade)")}</g>')
    return svg, total, wC, capC

def page(W, H, R, bulb_svg, wm, x, wC, base, capC):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" width="{W:.0f}" height="{H:.0f}">\n'
            f'{defs(R, x, x + wC, base, capC)}\n<rect width="{W:.0f}" height="{H:.0f}" fill="#ffffff"/>\n{bulb_svg}\n{wm}\n</svg>\n')

def landscape():
    H, C = 1000, 300
    capC = cap_height("display", C)
    base = 640
    R = capC*0.56                                  # bulb body radius: the glass a little taller than CATALYST
    cy = base - capC*0.42                          # the glass hangs level with the wordmark
    cx = 560
    x = cx + R*2.6
    wm, total, wC, _ = wordmark(x, base, C)
    W = x + total + 420
    return page(W, H, R, bulb(cx, cy, R), wm, x, wC, base, capC)

def portrait():
    W, H, C = 2400, 3000, 272
    capC = cap_height("display", C)
    _, total, wC, _ = wordmark(0, 0, C, True)
    x = (W - total)/2; base = 2230
    wm, _, _, _ = wordmark(x, base, C, True)
    R = 245
    return page(W, H, R, bulb(W/2, 1430, R), wm, x, wC, base, capC)

os.makedirs(OUT, exist_ok=True)
open(f"{OUT}/stiven-catalyst-logo-landscape.svg", "w").write(landscape())
open(f"{OUT}/stiven-catalyst-logo-portrait.svg", "w").write(portrait())
print("ok")
