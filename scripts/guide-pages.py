"""Turn the PDFs of the Tools Guide into the pages of the online reader (run by scripts/tools-guide.mjs).

    pip install pymupdf pillow
    python3 scripts/guide-pages.py tools-guide en sq de

Writes, for each language:
  src/media/guides/tools-guide/<lang>/page-01.webp ...  one image per page
  src/media/guides/tools-guide/<lang>/social.jpg        the preview for social media
and src/_data/toolsGuidePages.json with the page list of every language.
"""
import json
import sys
from io import BytesIO
from pathlib import Path

import pymupdf
from PIL import Image

PAGE_WIDTH = 1000  # pixels; sharp on a two-page spread on a retina screen, as the book
ROOT = Path(__file__).resolve().parent.parent
SLUG, *LANGS = sys.argv[1:] or ["tools-guide", "en", "sq", "de"]
MEDIA = ROOT / "src" / "media" / "guides" / SLUG
DATA = ROOT / "src" / "_data" / "toolsGuidePages.json"


def render(page, width):
    zoom = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    return Image.open(BytesIO(pix.tobytes("png"))).convert("RGB")


def social(cover):
    """The cover on the dark paper of the site, 1200 x 630."""
    card = Image.new("RGB", (1200, 630), (6, 10, 16))
    height = 560
    width = round(cover.width * height / cover.height)
    card.paste(cover.resize((width, height), Image.LANCZOS), ((1200 - width) // 2, 35))
    return card


def main():
    out = {}
    for lang in LANGS:
        pdf = pymupdf.open(MEDIA / f"{SLUG}-{lang}.pdf")
        folder = MEDIA / lang
        folder.mkdir(parents=True, exist_ok=True)
        for old in folder.glob("page-*.webp"):
            old.unlink()
        pages = []
        for number, page in enumerate(pdf, start=1):
            image = render(page, PAGE_WIDTH)
            name = f"page-{number:02d}.webp"
            image.save(folder / name, "WEBP", quality=82, method=6)
            pages.append({
                "number": number,
                "image": f"/media/guides/{SLUG}/{lang}/{name}",
                "width": image.width,
                "height": image.height,
            })
            if number == 1:
                social(image).save(folder / "social.jpg", "JPEG", quality=86, optimize=True, progressive=True)
        out[lang] = {"pageCount": len(pages), "pages": pages}
        print(f"{lang}: {len(pages)} pages")
    DATA.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
