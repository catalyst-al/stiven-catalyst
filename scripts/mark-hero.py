# Run from the repository root: python3 scripts/mark-hero.py (Pillow).
# Makes src/media/stiven-catalyst-mark-hero.jpg: the mark (the circled point) at the centre of a small system, on the
# site's night ground, for the side of every page heading and of a reflection's hero. The mark is kept inside the
# middle of the picture and everything round it thins out towards the edges, so the page can fade the picture out
# on every side and it melts into the background (--logo-fade, src/css/11-reading-and-motion.css).
#
# The ring is the one drawing of the mark, in its display weight: the same numbers as RING in src/js/cosmos.js and
# --mark-ring-display in src/css/01-foundation.css. The mark is flat (no glow, no gradient); the soft light, the
# orbits and the four families (Pulse violet, Zenith blue, Lumen gold, Atlas silver) begin outside the ring.
import math
import random
from PIL import Image, ImageDraw, ImageFilter

W, H = 1440, 1224          # the picture
S = 2                      # drawn at twice the size, then reduced
CX, CY = 0.55 * W, 0.475 * H   # where the point of the mark sits (the fade of the page is centred here)
U = 5.2                    # pixels to one unit of the mark's 100-unit box
NIGHT = (5, 8, 11)
INK = (246, 247, 244)
BLUE = (74, 181, 247)
TILT = math.radians(-9)    # the orbits lean a little, like those of the homepage


def ring():
    """The outline of the ring, in the mark's own units (a 100 box, the point at 50, 52)."""
    widths = [(0, 0.66), (0.1, 0.94), (0.42, 1), (0.75, 0.82), (0.92, 0.5), (1, 0.22)]

    def width(t):
        for (t0, w0), (t1, w1) in zip(widths, widths[1:]):
            if t0 <= t <= t1:
                return 9 * (w0 + (w1 - w0) * (1 - math.cos(math.pi * (t - t0) / (t1 - t0))) / 2)
        return 9 * 0.22

    n = 320
    rot = math.radians(8)
    centre = []
    for i in range(n + 1):
        t = i / n
        angle = math.radians(250 - 398 * t)
        grow = 1 if t < 0.64 else 1 + 0.37 * ((t - 0.64) / 0.36) ** 1.7
        x, y = 34.5 * grow * math.cos(angle), 30 * grow * math.sin(angle)
        centre.append((50 + x * math.cos(rot) - y * math.sin(rot), 52 + x * math.sin(rot) + y * math.cos(rot), width(t) / 2))
    left, right = [], []
    for i in range(n + 1):
        a, b = centre[max(i - 1, 0)], centre[min(i + 1, n)]
        d = math.hypot(b[0] - a[0], b[1] - a[1]) or 1
        nx, ny = -(b[1] - a[1]) / d, (b[0] - a[0]) / d
        x, y, w = centre[i]
        left.append((x + nx * w, y + ny * w))
        right.append((x - nx * w, y - ny * w))
    return left + right[::-1], (centre[0], centre[-1])


def px(x, y):
    """A place in the mark's units, as a pixel of the large drawing."""
    return ((CX + (x - 50) * U) * S, (CY + (y - 52) * U) * S)


def orbit(rx, ry, steps=720):
    return [((CX + rx * math.cos(a) * math.cos(TILT) - ry * math.sin(a) * math.sin(TILT)) * S,
             (CY + rx * math.cos(a) * math.sin(TILT) + ry * math.sin(a) * math.cos(TILT)) * S)
            for a in (2 * math.pi * i / steps for i in range(steps + 1))]


def on_orbit(rx, ry, degrees):
    a = math.radians(degrees)
    return ((CX + rx * math.cos(a) * math.cos(TILT) - ry * math.sin(a) * math.sin(TILT)) * S,
            (CY + rx * math.cos(a) * math.sin(TILT) + ry * math.sin(a) * math.cos(TILT)) * S)


def layer():
    return Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))


random.seed(7)
picture = Image.new("RGB", (W * S, H * S), NIGHT)

# The soft light of the system: cool, widest along the orbits, and none of it inside the ring.
light = Image.new("L", (W * S, H * S), 0)
ImageDraw.Draw(light).ellipse(((CX - 560) * S, (CY - 300) * S, (CX + 560) * S, (CY + 300) * S), fill=74)
light = light.filter(ImageFilter.GaussianBlur(150 * S))
hole = Image.new("L", (W * S, H * S), 255)
ImageDraw.Draw(hole).ellipse(((CX - 215) * S, (CY - 190) * S, (CX + 215) * S, (CY + 190) * S), fill=0)
hole = hole.filter(ImageFilter.GaussianBlur(46 * S))
light = Image.composite(light, Image.new("L", (W * S, H * S), 0), hole)
picture = Image.composite(Image.new("RGB", (W * S, H * S), (30, 104, 168)), picture, light)

# Dust: most of it in a band along the orbits, a little everywhere, none over the mark.
dust = layer()
pen = ImageDraw.Draw(dust)
for _ in range(620):
    if random.random() < 0.72:
        r = random.uniform(240, 620)
        a = random.uniform(0, 2 * math.pi)
        x, y = on_orbit(r, r * 0.46 + random.gauss(0, 26), math.degrees(a))
    else:
        x, y = random.uniform(0, W) * S, random.uniform(0, H) * S
    if math.hypot((x / S - CX) / 215, (y / S - CY) / 190) < 1.08:
        continue
    size = random.choice((0.7, 0.9, 0.9, 1.2, 1.2, 1.7)) * S
    tone = random.choice(((226, 238, 255), (226, 238, 255), (132, 198, 247), (246, 204, 128), (176, 156, 250)))
    pen.ellipse((x - size, y - size, x + size, y + size), fill=tone + (random.randint(46, 150),))
picture.paste(dust, (0, 0), dust)

# Three orbits, thin and quiet, the nearer ones a little clearer.
lines = layer()
pen = ImageDraw.Draw(lines)
ORBITS = ((286, 132, 46), (410, 188, 36), (540, 248, 26))
for rx, ry, alpha in ORBITS:
    pen.line(orbit(rx, ry), fill=(190, 214, 236, alpha), width=round(1.3 * S), joint="curve")
picture.paste(lines, (0, 0), lines)

# The four families on their orbits: a small flat planet, a faint halo of its own colour, and for Lumen its ring.
planets = layer()
halo = layer()
pen = ImageDraw.Draw(planets)
glow = ImageDraw.Draw(halo)
FAMILIES = (
    ((176, 156, 250), ORBITS[0], 22, 11),     # Pulse
    ((132, 198, 247), ORBITS[1], 208, 13),    # Zenith
    ((246, 204, 128), ORBITS[1], 318, 15),    # Lumen
    ((214, 222, 230), ORBITS[2], 104, 12),    # Atlas
)
for colour, (rx, ry, _), degrees, radius in FAMILIES:
    x, y = on_orbit(rx, ry, degrees)
    r = radius * S
    glow.ellipse((x - r * 3.4, y - r * 3.4, x + r * 3.4, y + r * 3.4), fill=colour + (58,))
    pen.ellipse((x - r, y - r, x + r, y + r), fill=colour + (255,))
    # the lit side: a lighter cap towards the mark, so the planet reads as a sphere and not as a dot
    tx, ty = CX * S - x, CY * S - y
    d = math.hypot(tx, ty) or 1
    hx, hy = x + tx / d * r * 0.34, y + ty / d * r * 0.34
    pen.ellipse((hx - r * 0.52, hy - r * 0.52, hx + r * 0.52, hy + r * 0.52), fill=tuple(min(255, c + 34) for c in colour) + (255,))
    if colour == (246, 204, 128):
        ring_box = [(x + math.cos(a) * r * 2.25 * math.cos(-0.35) - math.sin(a) * r * 0.62 * math.sin(-0.35),
                     y + math.cos(a) * r * 2.25 * math.sin(-0.35) + math.sin(a) * r * 0.62 * math.cos(-0.35))
                    for a in (2 * math.pi * i / 120 for i in range(121))]
        pen.line(ring_box, fill=colour + (190,), width=round(1.6 * S), joint="curve")
halo = halo.filter(ImageFilter.GaussianBlur(11 * S))
picture.paste(halo, (0, 0), halo)
picture.paste(planets, (0, 0), planets)

# The mark, flat: the ring in the colour of the text, round at both ends, and the point in the accent.
outline, ends = ring()
pen = ImageDraw.Draw(picture)
pen.polygon([px(x, y) for x, y in outline], fill=INK)
for x, y, w in ends:
    cx, cy = px(x, y)
    pen.ellipse((cx - w * U * S, cy - w * U * S, cx + w * U * S, cy + w * U * S), fill=INK)
(x0, y0), (x1, y1) = px(42, 44), px(58, 60)
pen.rectangle((round(x0), round(y0), round(x1), round(y1)), fill=BLUE)

picture = picture.resize((W, H), Image.LANCZOS)
picture.save("src/media/stiven-catalyst-mark-hero.jpg", quality=90, optimize=True, subsampling=0)
print("src/media/stiven-catalyst-mark-hero.jpg", picture.size)
