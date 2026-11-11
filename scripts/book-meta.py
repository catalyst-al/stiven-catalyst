"""Give a translation of "Mall për Durrësin" the language and the bookmarks the Albanian original has (audit P6-04):
the catalogue's /Lang, the author, and one bookmark for the book, the contents and each chapter, on the same pages
as in the original (every page of a translation is the same page of the original, scripts/book-edition.py).
Run by scripts/book-edition.py after it has written an edition, or by hand:

    pip install pymupdf
    python3 scripts/book-meta.py en de

The chapters come from src/_data/books/<lang>.json (written by scripts/book-pages.py from the PDF itself).
"""
import json
import os
import re
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
LANG_TAG = {"en": "en-GB", "de": "de-DE"}
CONTENTS = {"en": "Contents", "de": "Inhalt"}
CHAPTER = {"en": "CHAPTER", "de": "KAPITEL"}
AUTHOR = "Stiven Janaqi"


def finish(lang):
    data = json.loads((ROOT / "src" / "_data" / "books" / f"{lang}.json").read_text(encoding="utf-8"))
    path = ROOT / "src" / data["pdf"].lstrip("/")
    doc = pymupdf.open(path)
    toc = [[1, data["title"], 1], [2, CONTENTS[lang], 3]]
    for chapter in data["chapters"]:
        # A numbered chapter is named as the original names it ("KAPITULLI I"); a prologue or an epilogue by its label.
        label = f"{CHAPTER[lang]} {chapter['label']}" if re.fullmatch(r"[IVXLC]+", chapter["label"]) else chapter["label"]
        toc.append([2, f"{label} - {chapter['title']}", chapter["page"]])
    doc.set_toc([entry for entry in toc if 1 <= entry[2] <= doc.page_count])
    meta = dict(doc.metadata or {})
    meta.update({"author": AUTHOR, "title": data["title"]})
    doc.set_metadata(meta)
    doc.xref_set_key(doc.pdf_catalog(), "Lang", pymupdf.get_pdf_str(LANG_TAG[lang]))
    tmp = f"{path}.tmp"
    doc.save(tmp, garbage=1, deflate=True)
    doc.close()
    os.replace(tmp, path)
    print(f"{path.relative_to(ROOT)}: /Lang {LANG_TAG[lang]}, {len(toc)} bookmarks")


if __name__ == "__main__":
    langs = sys.argv[1:]
    if not langs or any(lang not in LANG_TAG for lang in langs):
        sys.exit(__doc__)
    for lang in langs:
        finish(lang)
