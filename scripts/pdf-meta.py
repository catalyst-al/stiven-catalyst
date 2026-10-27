"""Give the PDFs of a publication their author and language (run by scripts/weekly.mjs, review.mjs, treatise.mjs and
magazine.mjs after Chromium has printed them; Chromium writes the title from the page, but no author and no /Lang).

    pip install pymupdf
    python3 scripts/pdf-meta.py src/media/magazine/<slug>/<slug>-en.pdf en [<pdf> <lang> ...]

Each PDF keeps its title and its pages; it gets Author "Stiven Janaqi", Creator "Stiven Catalyst" (instead of the
browser's user agent) and the /Lang of its edition in the document catalogue, so a screen reader reads it in the
right language.
"""
import os
import sys

import pymupdf

AUTHOR = "Stiven Janaqi"
CREATOR = "Stiven Catalyst"

args = sys.argv[1:]
if not args or len(args) % 2:
    sys.exit("usage: pdf-meta.py <pdf> <lang> [<pdf> <lang> ...]")

for path, lang in zip(args[::2], args[1::2]):
    doc = pymupdf.open(path)
    meta = dict(doc.metadata or {})
    meta.update({"author": AUTHOR, "creator": CREATOR})
    doc.set_metadata(meta)
    doc.xref_set_key(doc.pdf_catalog(), "Lang", pymupdf.get_pdf_str(lang))
    tmp = f"{path}.tmp"
    doc.save(tmp, garbage=1, deflate=True)
    doc.close()
    os.replace(tmp, path)
    print(f"Metadata: {path} ({lang})")
