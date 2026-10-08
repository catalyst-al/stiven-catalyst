"""The page images of the online readers (the book, the Tools Guide, the magazines, the Management Review),
shared by scripts/book-pages.py and scripts/guide-pages.py.

Each PDF page is drawn twice from the PDF itself: 1000 px wide (page-01.webp, for an ordinary screen) and 2000 px
wide (page-01-2000.webp, for a high-density or large screen); the reader offers both and the browser takes the one
its screen needs, so the text is never enlarged from a smaller picture. A page made of flat colour and text is kept
lossless, which leaves its letters sharp and is often the smaller file; a page with a photograph or a paper texture
is kept as a high-quality lossy WebP.
"""
from io import BytesIO
from pathlib import Path

import pymupdf
from PIL import Image

WIDTH = 1000
LARGE = 2000
LOSSY = {"quality": 90, "method": 6}


def render(page, width):
    zoom = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    return fill_edges(Image.open(BytesIO(pix.tobytes("png"))).convert("RGB"))


def fill_edges(image):
    """Chromium leaves a sliver of the PDF page unpainted at the right edge (the page is not a whole number of CSS
    pixels wide), and drawn from the PDF it shows as a white line along a dark page. The last columns or rows that
    are pure white, at most three, take the colour of the line beside them; a page that is white at its edge
    anyway stays as it is."""
    width, height = image.size

    def white(box):
        return all(low >= 248 for low, _ in image.crop(box).getextrema())

    columns = 0
    while columns < 4 and white((width - columns - 1, 0, width - columns, height)):
        columns += 1
    if 0 < columns < 4:
        image.paste(image.crop((width - columns - 1, 0, width - columns, height)).resize((columns, height)), (width - columns, 0))
    rows = 0
    while rows < 4 and white((0, height - rows - 1, width, height - rows)):
        rows += 1
    if 0 < rows < 4:
        image.paste(image.crop((0, height - rows - 1, width, height - rows)).resize((width, rows)), (0, height - rows))
    return image


def encode(image):
    """The smaller of a lossless and a lossy WebP; lossless also wins when it is a little larger."""
    lossy = BytesIO()
    image.save(lossy, "WEBP", **LOSSY)
    # A quick lossless pass tells a flat page from a photograph before the slow, smallest one: on a flat page it
    # comes out at most about a third larger than the lossy one, on a photograph two to three times larger.
    quick = BytesIO()
    image.save(quick, "WEBP", lossless=True, quality=25, method=1)
    if quick.tell() > lossy.tell() * 1.8:
        return lossy.getvalue()
    lossless = BytesIO()
    image.save(lossless, "WEBP", lossless=True, quality=100, method=6)
    return lossless.getvalue() if lossless.tell() <= lossy.tell() * 1.1 else lossy.getvalue()


def save_page(page, folder, name, url):
    """Writes <name>.webp and <name>-2000.webp into folder; returns the picture at 1000 px and the entry for the
    page list (url is the address of the folder on the site)."""
    folder = Path(folder)
    image = render(page, WIDTH)
    (folder / f"{name}.webp").write_bytes(encode(image))
    large = render(page, LARGE)
    (folder / f"{name}-{LARGE}.webp").write_bytes(encode(large))
    return image, {
        "image": f"{url}/{name}.webp",
        "width": image.width,
        "height": image.height,
        "large": f"{url}/{name}-{LARGE}.webp",
        "largeWidth": large.width,
    }
