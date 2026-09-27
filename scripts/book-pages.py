"""Turn the PDF of a book into the pages of the online book reader.

    pip install pymupdf pillow
    python3 scripts/book-pages.py path/to/book.pdf

Writes, for "Mall për Durrësin":
  src/media/books/mall-per-durresin/page-01.webp ...  one image per page
  src/media/books/mall-per-durresin/social.jpg        the preview for social media
  src/_data/book.json                                 page list, chapters and the text

Run it again whenever a new version of the PDF is ready.
"""
import json
import re
import sys
from io import BytesIO
from pathlib import Path

import pymupdf
from PIL import Image, ImageEnhance, ImageFilter

SLUG = "mall-per-durresin"
PAGE_WIDTH = 1000  # pixels; sharp on a two-page spread on a retina screen
ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "src" / "media" / "books" / SLUG
DATA = ROOT / "src" / "_data" / "book.json"

RUNNING_HEAD = 7.0  # the small "MALL PËR DURRËSIN" at the top of each page
KICKER = 8.0        # "KAPITULLI I", "PROLOG"
CHAPTER = 21.0      # chapter titles
SECTION = 15.0      # section titles inside a chapter


def render(page, width):
    zoom = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    return Image.open(BytesIO(pix.tobytes("png"))).convert("RGB")


def clean(text):
    return re.sub(r"\s+", " ", text).strip()


def text_is_upper(text):
    return text == text.upper() and any(c.isalpha() for c in text)


def blocks_of(page, number):
    """The page as headings and paragraphs, without the running head and page number."""
    out = []
    lines = []
    for block in page.get_text("dict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            spans = [s for s in line["spans"] if s["text"].strip()]
            if not spans:
                continue
            size = max(s["size"] for s in spans)
            font = spans[0]["font"]
            text = "".join(s["text"] for s in line["spans"])
            top = line["bbox"][1]
            if size < RUNNING_HEAD and top < 40:
                continue
            if re.fullmatch(r"\s*\d{1,3}\s*", text) and top > page.rect.height - 50:
                continue
            if re.fullmatch(r"\s*(?:\S ){3,}\S\s*", text):
                continue  # letter-spaced author or title, repeated on the cover pages
            lines.append({"text": text, "size": size, "font": font, "top": top})

    lines.sort(key=lambda item: item["top"])
    previous = None
    for line in lines:
        size, font = line["size"], line["font"]
        if size >= CHAPTER:
            kind = "chapter"
        elif size >= SECTION:
            kind = "section"
        elif "Sans" in font and text_is_upper(line["text"]):
            kind = "kicker"
        elif "Sans" in font:
            kind = "note"
        elif "Italic" in font:
            kind = "quote"
        else:
            kind = "p"
        starts_new = (
            previous is None
            or previous["kind"] != kind
            or line["top"] - previous["top"] > size * 1.8
            or line["text"].lstrip().startswith("—")
            or kind == "kicker"
        )
        if starts_new:
            previous = {"kind": kind, "text": line["text"], "page": number, "top": line["top"]}
            out.append(previous)
        else:
            previous["text"] += " " + line["text"]
            previous["top"] = line["top"]
    return [{"kind": b["kind"], "text": clean(b["text"]), "page": b["page"]} for b in out if clean(b["text"])]


def contents(page):
    """Chapters from the table of contents: label, title and page number."""
    words = [clean(line) for line in page.get_text().splitlines() if clean(line)]
    chapters = []
    for i in range(len(words) - 2):
        label, title, number = words[i], words[i + 1], words[i + 2]
        if re.fullmatch(r"PROLOG|EPILOG|[IVX]+", label) and re.fullmatch(r"\d{2}", number):
            chapters.append({"label": label, "title": title, "page": int(number)})
    return chapters


def join_across_pages(blocks):
    """A paragraph cut by the end of a page continues on the next one."""
    joined = []
    for block in blocks:
        last = joined[-1] if joined else None
        if (
            last and last["kind"] == "p" and block["kind"] == "p"
            and block["page"] == last["page_end"] + 1
            and not re.search(r"[.!?…:”\"»]$", last["text"])
            and not block["text"].startswith("—")
        ):
            last["text"] += " " + block["text"]
            last["page_end"] = block["page"]
        else:
            joined.append({**block, "page_end": block["page"]})
    return [{"kind": b["kind"], "text": b["text"], "page": b["page"]} for b in joined]


def social(cover):
    """1200×630: the cover, standing on a blurred, darkened copy of itself."""
    # The photo in the lower half of the cover, blurred into a background.
    canvas = cover.resize((1200, int(1200 * cover.height / cover.width))).crop((0, 1030, 1200, 1660))
    canvas = ImageEnhance.Brightness(canvas.filter(ImageFilter.GaussianBlur(30))).enhance(0.5)
    book = cover.resize((int(560 * cover.width / cover.height), 560))
    shadow = Image.new("RGBA", (book.width + 60, book.height + 60), (0, 0, 0, 0))
    shadow.paste(Image.new("RGBA", book.size, (0, 0, 0, 170)), (30, 30))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    x, y = (1200 - book.width) // 2, 35
    canvas.paste(shadow, (x - 22, y - 14), shadow)
    canvas.paste(book, (x, y))
    return canvas


def main(pdf_path):
    doc = pymupdf.open(pdf_path)
    MEDIA.mkdir(parents=True, exist_ok=True)
    for old in MEDIA.glob("page-*.webp"):
        old.unlink()

    pages, blocks = [], []
    chapters, back, subtitle = [], [], ""
    for index, page in enumerate(doc):
        number = index + 1
        image = render(page, PAGE_WIDTH)
        name = f"page-{number:02d}.webp"
        image.save(MEDIA / name, "WEBP", quality=80, method=6)
        pages.append({"number": number, "image": f"/media/books/{SLUG}/{name}", "width": image.width, "height": image.height})
        if index == 0:
            social(image).save(MEDIA / "social.jpg", "JPEG", quality=84, optimize=True, progressive=True)
        found = contents(page)
        if found:
            chapters = found
            continue  # the reader has its own table of contents
        if number == 1:
            subtitle = next((b["text"] for b in blocks_of(page, number) if b["kind"] == "quote"), "")
            continue  # the cover
        if number == len(doc):
            back = [b for b in blocks_of(page, number) if b["kind"] in ("p", "quote")]
            continue  # the back cover, shown as the book's description
        blocks += blocks_of(page, number)

    meta = doc.metadata
    # The title page repeats the title and subtitle that the book page already shows.
    repeated = {(meta.get("title") or "").lower(), subtitle.lower()}
    blocks = [b for b in blocks if b["text"].lower() not in repeated]
    DATA.write_text(json.dumps({
        "slug": SLUG,
        "title": meta.get("title") or "",
        "subtitle": subtitle,
        "author": meta.get("author") or "",
        "pageCount": len(pages),
        "pages": pages,
        "chapters": chapters,
        "blurb": [b["text"] for b in back if b["kind"] == "p"],
        "quote": " ".join(b["text"] for b in back if b["kind"] == "quote"),
        "text": join_across_pages(blocks),
    }, ensure_ascii=False, indent=1) + "\n", encoding="utf8")
    size = sum(f.stat().st_size for f in MEDIA.iterdir()) / 1e6
    print(f"{len(pages)} pages, {len(chapters)} chapters, {size:.1f} MB in {MEDIA.relative_to(ROOT)}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
