"""Set a translation of "Mall për Durrësin" in the book's own design, page for page.

    pip install pymupdf pillow reportlab
    python3 scripts/book-edition.py en     # the English edition
    python3 scripts/book-edition.py de     # the German edition
    python3 scripts/book-edition.py sq     # a check: the Albanian text set again, compared with the PDF
    python3 scripts/book-edition.py de --fit   # only says how much room each page has left; writes nothing

The text of each edition is scripts/book/<lang>.txt (the format is described in scripts/book/README.md). The
design is the one of the Albanian PDF, src/media/books/mall-per-durresin/mall-per-durresin.pdf, which was made with
ReportLab too: the same A5 page, the same Noto fonts, colours, margins and spacing, and the photographs taken from
that PDF as they are (the JPEG data is not encoded again). Every page of a translation is the same page of the
original, so a chapter starts on the same page in every language.

For en and de it writes src/media/books/mall-per-durresin/<lang>/<title>.pdf and then, through book-pages.py, the
page images and src/_data/books/<lang>.json. For sq it writes nothing in the site: it sets sq.txt in a temporary
folder and prints, page by page, how far the result is from the original (nothing, or a fraction of a pixel on a line),
which shows the design is copied faithfully. The Albanian PDF and its pages are never changed by this script.

The fonts are downloaded once into scripts/book/fonts/ (not kept in git).
"""
import importlib.util
import re
import sys
import tempfile
import urllib.request
import unicodedata
from io import BytesIO
from pathlib import Path
from xml.sax.saxutils import escape

import pymupdf
from PIL import Image, ImageChops
from reportlab.lib.colors import CMYKColor, Color, white
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph

SLUG = "mall-per-durresin"
ROOT = Path(__file__).resolve().parent.parent
TEXTS = ROOT / "scripts" / "book"
FONTS = TEXTS / "fonts"
MEDIA = ROOT / "src" / "media" / "books" / SLUG
ORIGINAL = MEDIA / f"{SLUG}.pdf"

# The six faces of the original, from the Noto project at fixed commits: the same metrics the original was set with,
# so the Albanian text breaks into the same lines.
NOTO = "https://raw.githubusercontent.com/notofonts/notofonts.github.io/{commit}/fonts"
# Noto Sans at its release 2.013 (later releases changed a few widths), the serifs at a later commit.
COMMITS = {"NotoSans": "edf6e37d38c619d271397b01cb464f8976fac5a8", "default": "5c3913063bb189df4edc94b766584dfb4c04a187"}
FACES = {
    "Sans": "NotoSans/hinted/ttf/NotoSans-Regular.ttf",
    "SansSemiBold": "NotoSans/hinted/ttf/NotoSans-SemiBold.ttf",
    "Serif": "NotoSerif/hinted/ttf/NotoSerif-Regular.ttf",
    "SerifItalic": "NotoSerif/hinted/ttf/NotoSerif-Italic.ttf",
    "Display": "NotoSerifDisplay/hinted/ttf/NotoSerifDisplay-SemiBold.ttf",
    "DisplayItalic": "NotoSerifDisplay/hinted/ttf/NotoSerifDisplay-Italic.ttf",
}

# The page and its colours, as in the original.
W, H = 419.5276, 595.2756  # A5
FRAME = 329.5276  # the text column: 41 pt outside, 49 pt on the inner side
WIDE = W - 82  # the cover, the title page and the back cover use the width between two 41 pt margins
NAVY = Color(0.086275, 0.207843, 0.25098)
GOLD = Color(0.603922, 0.466667, 0.298039)
GREY = Color(0.403922, 0.454902, 0.470588)
PAPER = Color(0.984314, 0.976471, 0.956863)
INK = CMYKColor(0, 0, 0, 1)

# Body text: the original sets a page without a photograph at 10.8 pt and a page with one at 10.55 pt. A page whose
# translation does not fit takes the next, smaller setting; the last one is a fallback that is reported.
BODY = [
    {"size": 10.8, "leading": 15.3, "gap": 7.5, "dialogue": 14.6, "after_dialogue": 8.0},
    {"size": 10.55, "leading": 14.7, "gap": 6.5, "dialogue": 14.2, "after_dialogue": 7.0},
    {"size": 10.3, "leading": 14.3, "gap": 6.0, "dialogue": 13.8, "after_dialogue": 6.5},
]
BOTTOM = 540  # the lowest a line of text may reach, from the top of the page (the original reaches 537)
FLOAT_WIDTH = 116  # the narrow photograph beside the first paragraph (page 19)

KEYS = {
    "kicker", "chapter", "section", "quote", "cover-title", "subtitle", "title", "dedication", "note-heading", "note",
    "edition", "contents", "contents-note", "heading", "blurb",
}
REPEATED = {"note", "blurb"}


def fonts():
    FONTS.mkdir(parents=True, exist_ok=True)
    for name, path in FACES.items():
        file = FONTS / Path(path).name
        if not file.exists():
            print(f"downloading {file.name}")
            commit = COMMITS.get(path.split("/")[0], COMMITS["default"])
            file.write_bytes(urllib.request.urlopen(f"{NOTO.format(commit=commit)}/{path}").read())
        pdfmetrics.registerFont(TTFont(name, str(file)))


def read_text(lang):
    """scripts/book/<lang>.txt as {"meta": {...}, "pages": {number: page}}; a page is its keys and its blocks."""
    meta, pages, page = {}, {}, None
    lines = (TEXTS / f"{lang}.txt").read_text(encoding="utf8").splitlines()
    for number, line in enumerate(lines, 1):
        line = line.rstrip()
        if line.startswith("#"):
            continue
        heading = re.fullmatch(r"== (\d\d)", line)
        if heading:
            page = {"number": int(heading.group(1)), "blocks": [], "notes": [], "blurbs": []}
            pages[page["number"]] = page
            continue
        if not line:
            if page:
                page["blocks"].append(None)  # a paragraph ends
            continue
        key = re.match(r"([a-z-]+): (.*)", line)
        if page is None:
            if not key:
                raise SystemExit(f"{lang}.txt:{number}: expected 'key: value' before the first page")
            meta[key.group(1)] = key.group(2).strip()
            continue
        if key and key.group(1) in KEYS:
            name, value = key.group(1), key.group(2).strip()
            if name in REPEATED:
                page[name + "s"].append(value)
            elif name == "quote" and page["number"] != 33:
                page["blocks"].append({"kind": "quote", "text": value})
            else:
                page[name] = value
        elif line in ("[image]", "[image right]"):
            page["blocks"].append({"kind": "image", "float": line == "[image right]"})
        elif line.startswith("— "):
            last = page["blocks"][-1] if page["blocks"] else None
            if last and last["kind"] == "dialogue":
                last["lines"].append(line)
            else:
                page["blocks"].append({"kind": "dialogue", "lines": [line]})
        else:
            last = page["blocks"][-1] if page["blocks"] else None
            if last and last["kind"] == "p":
                raise SystemExit(f"{lang}.txt:{number}: a paragraph is one line; leave a blank line between two")
            page["blocks"].append({"kind": "p", "text": line})
    for page in pages.values():
        page["blocks"] = [b for b in page["blocks"] if b]
    return {"meta": meta, "pages": pages}


def check_against(text, original):
    """The translation must have the pages, headings, paragraphs and dialogue lines of the Albanian text."""
    problems = []
    for number, page in original["pages"].items():
        other = text["pages"].get(number)
        if not other:
            problems.append(f"page {number:02d} is missing")
            continue
        for key in ("kicker", "chapter", "section", "cover-title", "subtitle", "title", "dedication", "edition", "contents", "heading"):
            if (key in page) != (key in other):
                problems.append(f"page {number:02d}: '{key}' is {'missing' if key in page else 'extra'}")
        shape = lambda p: [(b["kind"], len(b.get("lines", ())), b.get("float")) for b in p["blocks"]]
        if shape(page) != shape(other):
            problems.append(f"page {number:02d}: the paragraphs, dialogue lines or photographs differ from sq.txt")
        for key in ("notes", "blurbs"):
            if len(page[key]) != len(other[key]):
                problems.append(f"page {number:02d}: {len(other[key])} {key[:-1]} lines, sq.txt has {len(page[key])}")
    extra = set(text["pages"]) - set(original["pages"])
    problems += [f"page {n:02d} is not in sq.txt" for n in sorted(extra)]
    if problems:
        raise SystemExit("\n".join(problems))


def photographs(path):
    """The photographs of the original, page by page: the JPEG data and where it sits on the page."""
    doc = pymupdf.open(path)
    found = {}
    folder = Path(tempfile.mkdtemp(prefix="book-photos-"))
    for page in doc:
        for info in page.get_image_info(xrefs=True):
            image = doc.extract_image(info["xref"])
            file = folder / f"{info['xref']}.{image['ext']}"
            file.write_bytes(image["image"])
            x0, y0, x1, y1 = info["bbox"]
            found.setdefault(page.number + 1, []).append({"file": str(file), "x": x0, "top": y0, "width": x1 - x0, "height": y1 - y0})
    return found


def style(font, size, leading, color, align=TA_LEFT):
    return ParagraphStyle(f"{font}-{size}-{align}", fontName=font, fontSize=size, leading=leading, textColor=color, alignment=align)


def paragraph(text, st):
    """A paragraph; "|" is a forced line break."""
    return Paragraph("<br/>".join(escape(part.strip()) for part in text.split("|")), st)


def place(canvas, para, x, top, width):
    """Draws a paragraph with its top edge at top (from the top of the page); returns its bottom edge."""
    _, height = para.wrap(width, H)
    para.drawOn(canvas, x, H - top - height)
    return top + height


def spaced(canvas, text, x, baseline, font, size, color, spacing, align="left"):
    """A line of capitals with letter spacing, as the running heads and the kickers."""
    canvas.saveState()
    canvas.setFillColor(color)
    text_object = canvas.beginText()
    text_object.setFont(font, size)
    text_object.setCharSpace(spacing)
    if align == "right":
        x -= pdfmetrics.stringWidth(text, font, size) + spacing * len(text)
    text_object.setTextOrigin(x, H - baseline)
    text_object.textOut(text)
    canvas.drawText(text_object)
    canvas.restoreState()


def background(canvas, color):
    canvas.setFillColor(color)
    canvas.rect(0, 0, W, H, stroke=0, fill=1)


def rule(canvas, x0, x1, y, width):
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(width)
    canvas.line(x0, H - y, x1, H - y)


def photo(canvas, image, x, top, width=None, height=None):
    width, height = width or image["width"], height or image["height"]
    canvas.drawImage(image["file"], x, H - top - height, width, height)
    return top + height


def page_number(canvas, number, x0):
    canvas.setFillColor(GREY)
    canvas.setFont("Sans", 7.4)
    if number % 2:
        canvas.drawRightString(x0 + FRAME, 24, f"{number:02d}")
    else:
        canvas.drawString(x0, 24, f"{number:02d}")


def margin(number):
    return 49 if number % 2 else 41


def fitted(text, font, size, width):
    """The size at which a line of the cover fits its width (the size of the original when it fits)."""
    return min(size, size * width / pdfmetrics.stringWidth(text, font, size))


def snug(text, font, size, width, most=0.04):
    """The size of a title or a closing line: its lines ("|") are kept whole by setting them up to 4% smaller,
    which the eye does not see; a line longer than that wraps at the original size instead."""
    smallest = min(fitted(line.strip(), font, size, width) for line in text.split("|"))
    return smallest if smallest >= size * (1 - most) else size


def cover(canvas, page, meta, images):
    background(canvas, NAVY)
    spaced(canvas, meta["author"], 41, 55, "SansSemiBold", 10.2, white, 1.9)
    first, second = [part.strip() for part in page["cover-title"].split("|")]
    canvas.setFillColor(white)
    canvas.setFont("Display", fitted(first, "Display", 35, W - 39 - 41))
    canvas.drawString(39, H - 135, first)
    canvas.setFont("Display", fitted(second, "Display", 49, W - 38 - 41))
    canvas.drawString(38, H - 190, second)
    rule(canvas, 41, 78, 216, 1.1)
    place(canvas, paragraph(page["subtitle"], style("SerifItalic", 12.2, 18, white)), 41, 235, WIDE)
    photo(canvas, images[0], 0, H - 292, W, 292)


def title_page(canvas, page, meta):
    background(canvas, PAPER)
    spaced(canvas, meta["author"], 41, 58, "SansSemiBold", 9.1, NAVY, 1.5)
    bottom = place(canvas, paragraph(page["title"], style("Display", snug(page["title"], "Display", 30, WIDE), 35, NAVY)), 41, 96, WIDE)
    place(canvas, paragraph(page["subtitle"], style("SerifItalic", 11.1, 16, GOLD)), 41, max(144, bottom + 13), WIDE)
    rule(canvas, 41, 71, 214, 0.65)
    place(canvas, paragraph(page["dedication"], style("SerifItalic", 11.2, 17, NAVY, TA_JUSTIFY)), 41, 236, FRAME)
    spaced(canvas, page["note-heading"], 41, H - 210, "SansSemiBold", 7.1, GOLD, 0.9)
    top = H - 196
    for note in page["notes"]:
        top = place(canvas, paragraph(note, style("Sans", 8.1, 12, GREY)), 41, top, FRAME) + 10
    edition = paragraph(page["edition"], style("Sans", 8.1, 12, GREY))
    _, height = edition.wrap(FRAME, H)
    if top - 10 > H - 50 - height - 20:
        raise SystemExit("page 02: the notes reach the edition line")
    edition.drawOn(canvas, 41, 50)
    page_number(canvas, 2, 41)


def chapters_of(pages):
    """The table of contents: each page with a chapter title, labelled by its kicker ("CHAPTER IV" gives "IV")."""
    rows = []
    for number in sorted(pages):
        page = pages[number]
        if "chapter" in page:
            kicker = page.get("kicker", "")
            roman = re.search(r"\b([IVXL]+)$", kicker)
            rows.append((roman.group(1) if roman else kicker, page["chapter"], number))
    return rows


def contents(canvas, page, meta, pages):
    x0 = margin(3)
    background(canvas, white)
    spaced(canvas, meta["running-head"], x0, 27, "SansSemiBold", 6.5, GREY, 0.75)
    place(canvas, paragraph(page["contents"], style("Display", 25, 27.8, NAVY)), x0, 65, FRAME)
    for row, (label, title, number) in enumerate(chapters_of(pages)):
        # Label, title, page number: the order of the original, which book-pages.py reads the contents in.
        spaced(canvas, label, x0, 140 + 44 * row, "SansSemiBold", 6.2, GOLD, 0.2)
        width = x0 + FRAME - 24 - (x0 + 48)
        if pdfmetrics.stringWidth(title, "Serif", 10.6) > width:
            raise SystemExit(f"page 03: the chapter title '{title}' does not fit on one line of the contents")
        place(canvas, paragraph(title, style("Serif", 10.6, 14.3, NAVY)), x0 + 48, 132 + 44 * row, width)
        canvas.setFillColor(NAVY)
        canvas.setFont("Sans", 9.5)
        canvas.drawRightString(x0 + FRAME, H - 142 - 44 * row, f"{number:02d}")
    note = paragraph(page["contents-note"], style("Sans", 8.1, 12, GREY))
    note.wrap(FRAME, H)
    note.drawOn(canvas, x0, 43)
    page_number(canvas, 3, x0)


def back_cover(canvas, page, meta, images):
    background(canvas, NAVY)
    spaced(canvas, meta["running-head"], 41, 53, "SansSemiBold", 7.4, white, 1.3)
    top = place(canvas, paragraph(page["heading"], style("Display", 23, 29, white)), 41, 93, WIDE) + 21
    for blurb in page["blurbs"]:
        top = place(canvas, paragraph(blurb, style("Serif", 10.8, 16, white)), 41, top, WIDE) + 10
    image = images[0]
    if top - 10 > image["top"] - 4:
        raise SystemExit("page 33: the description reaches the photograph; it has to be shorter")
    photo(canvas, image, 0, image["top"], W, image["height"])
    place(canvas, paragraph(page["quote"], style("DisplayItalic", snug(page["quote"], "DisplayItalic", 12.6, WIDE), 18, white)), 41, H - 141, WIDE)
    spaced(canvas, f"{meta['author']}  /  {meta['year']}", 41, H - 42, "SansSemiBold", 7.7, white, 0.8)


def layout(page, images, body, x0):
    """The flowing part of a page as a list of things to draw, and the bottom it reaches."""
    drawn = []
    top = 60
    if "kicker" in page:
        drawn.append(("kicker", page["kicker"], 60))
        top = 74
    if "chapter" in page:
        heading = paragraph(page["chapter"], style("Display", 23.5, 27.8, NAVY))
        after = 15
    else:
        heading = paragraph(page["section"], style("Display", 18, 22, NAVY))
        after = 14
    _, height = heading.wrap(FRAME, H)
    drawn.append(("para", heading, x0, top, FRAME))
    top += height + after

    text = style("Serif", body["size"], body["leading"], INK, TA_JUSTIFY)
    pictures = iter(images)
    beside = None  # the bottom of a narrow photograph that the next paragraph runs beside
    previous = None
    for block in page["blocks"]:
        if previous in ("p", "dialogue", "quote") and block["kind"] != "image":
            top += body["after_dialogue"] if previous == "dialogue" else body["gap"]
        if block["kind"] == "image":
            image = next(pictures)
            if block["float"]:
                x = x0 + FRAME - FLOAT_WIDTH
                drawn.append(("photo", image, x, top, FLOAT_WIDTH, image["height"]))
                beside = top + image["height"]
            else:
                drawn.append(("photo", image, x0, top, FRAME, image["height"]))
                top += image["height"] + 16
            previous = "image"
            continue
        if block["kind"] == "quote":
            top += 18 - body["gap"]
            para = paragraph(block["text"], style("DisplayItalic", snug(block["text"], "DisplayItalic", 12.3, FRAME), 18, NAVY))
            width = FRAME
        elif block["kind"] == "dialogue":
            para = Paragraph("<br/>".join(escape(line) for line in block["lines"]), style("Serif", body["size"], body["dialogue"], INK))
            width = FRAME
        elif beside:
            para = paragraph(block["text"], style("Serif", body["size"], body["leading"], INK))
            width = FRAME - FLOAT_WIDTH - 16
        else:
            para = paragraph(block["text"], text)
            width = FRAME
        _, height = para.wrap(width, H)
        drawn.append(("para", para, x0, top, width))
        top += height
        if beside:
            top = max(top, beside + 16 - body["gap"])
            beside = None
        previous = block["kind"]
    return drawn, top


def body_page(canvas, page, meta, images, warnings):
    number = page["number"]
    x0 = margin(number)
    settings = BODY[1:] if images else BODY
    for body in settings:
        drawn, bottom = layout(page, images, body, x0)
        if bottom <= BOTTOM:
            break
    else:
        raise SystemExit(f"page {number:02d}: the text does not fit, even at {body['size']} pt; it needs to be shorter")
    if body is BODY[-1]:
        warnings.append(f"page {number:02d} is set at {body['size']} pt to fit; a shorter text would keep {settings[0]['size']} pt")
    background(canvas, white)
    spaced(canvas, meta["running-head"], x0, 27, "SansSemiBold", 6.5, GREY, 0.75)
    for item in drawn:
        if item[0] == "kicker":
            spaced(canvas, item[1], x0, item[2], "SansSemiBold", 7.3, GOLD, 0.9)
        elif item[0] == "photo":
            photo(canvas, *item[1:])
        else:
            place(canvas, *item[1:])
    page_number(canvas, number, x0)
    return body["size"], bottom


def slug(text):
    plain = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", plain.lower()).strip("-")


def build(text, out):
    meta, pages = text["meta"], text["pages"]
    images = photographs(ORIGINAL)
    canvas = Canvas(str(out), pagesize=(W, H), pageCompression=1)
    canvas.setTitle(meta["title"])
    canvas.setAuthor(meta["author"].title())
    canvas.setSubject(pages[2]["edition"])
    canvas.setCreator("scripts/book-edition.py: the design of Mall për Durrësin, 2026")
    warnings, fill = [], []
    for number in sorted(pages):
        page = pages[number]
        if number == 1:
            cover(canvas, page, meta, images[1])
        elif number == 2:
            title_page(canvas, page, meta)
        elif number == 3:
            contents(canvas, page, meta, pages)
        elif number == max(pages):
            back_cover(canvas, page, meta, images[number])
        else:
            fill.append((number, *body_page(canvas, page, meta, images.get(number, []), warnings)))
        canvas.showPage()
    canvas.save()
    return warnings, fill


def compare(made, original):
    """How far each page of made is from the same page of original: the share of pixels that differ visibly."""
    a, b = pymupdf.open(made), pymupdf.open(original)
    report = []
    for number in range(max(len(a), len(b))):
        if number >= len(a) or number >= len(b):
            report.append((number + 1, 1.0))
            continue
        pictures = []
        for doc in (a, b):
            pix = doc[number].get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
            pictures.append(Image.open(BytesIO(pix.tobytes("png"))).convert("L"))
        diff = ImageChops.difference(*pictures).point(lambda v: 255 if v > 48 else 0)
        report.append((number + 1, sum(diff.histogram()[255:]) / (diff.width * diff.height)))
    return report


def fit(text):
    """The room left on each page of a text, without writing anything (negative: it does not fit at 10.8 pt)."""
    images = photographs(ORIGINAL)
    for number in sorted(text["pages"]):
        page = text["pages"][number]
        if "chapter" not in page and "section" not in page:
            continue
        pictures = images.get(number, [])
        rows = []
        for body in BODY[1:] if pictures else BODY:
            _, bottom = layout(page, pictures, body, margin(number))
            rows.append(f"{body['size']} pt: {BOTTOM - bottom:6.1f}")
        print(f"page {number:02d}  " + "   ".join(rows))


def main(lang, only_fit=False):
    fonts()
    original = read_text("sq")
    if only_fit:
        fit(read_text(lang))
        return
    if lang == "sq":
        out = Path(tempfile.mkdtemp(prefix="book-sq-")) / f"{SLUG}.pdf"
        build(original, out)
        worst = 0
        for number, share in compare(out, ORIGINAL):
            worst = max(worst, share)
            print(f"page {number:02d}: {share * 100:.3f}% of the pixels differ")
        # A justified line can move by a fraction of a pixel (the word spacing is rounded), nothing more.
        print(f"{out}\nThe design is {'the same' if worst < 0.005 else 'NOT the same'} as the original.")
        return
    text = read_text(lang)
    check_against(text, original)
    folder = MEDIA / lang
    folder.mkdir(parents=True, exist_ok=True)
    out = folder / f"{slug(text['meta']['title'])}.pdf"
    warnings, fill = build(text, out)
    for number, size, bottom in fill:
        print(f"page {number:02d}: {size} pt, {BOTTOM - bottom:5.1f} pt to spare")
    print("\n".join(warnings) or "Every page keeps the sizes of the original.")
    spec = importlib.util.spec_from_file_location("book_pages", Path(__file__).with_name("book-pages.py"))
    book_pages = importlib.util.module_from_spec(spec)
    sys.path.insert(0, str(Path(__file__).parent))
    spec.loader.exec_module(book_pages)
    book_pages.main(str(out), lang)


if __name__ == "__main__":
    if len(sys.argv) not in (2, 3) or sys.argv[1] not in ("en", "de", "sq") or sys.argv[2:] not in ([], ["--fit"]):
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2:] == ["--fit"])
