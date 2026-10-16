# The text of *Mall për Durrësin*, page by page

- `sq.txt`: the Albanian original, as it stands in `src/media/books/mall-per-durresin/mall-per-durresin.pdf`.
- `en.txt`: *Longing for Durrës*, the English translation.
- `de.txt`: *Sehnsucht nach Durrës*, the German translation.

`python3 scripts/book-edition.py en` (or `de`) sets a translation in the design of the Albanian book: the same A5
page, Noto fonts, colours, margins, spacing and photographs, and the same cover and back cover with their text in
that language. It writes the PDF to `src/media/books/mall-per-durresin/<lang>/` and then the page images and
`src/_data/books/<lang>.json` (through `scripts/book-pages.py`); after it, `node scripts/thumbnails.mjs` makes the
small copies of the new cover. `python3 scripts/book-edition.py sq` sets the Albanian text the same way into a
temporary folder and compares it with the PDF, page by page: the proof that the design is copied faithfully. The
Albanian PDF and its pages are never touched by it.

## The format

```
language: en                      the header: the book's language, title, running head, author and year
title: Longing for Durrës
running-head: LONGING FOR DURRËS
author: STIVEN JANAQI
year: 2026

== 04                             a page, by its number in the book
kicker: PROLOGUE                  the small gold line above a title
chapter: The Second City          the title of a chapter (it goes into the contents), or
section: Two Cities, One Memory   the title of a section

[image]                           the photograph of this page, as wide as the text, or
[image right]                     the narrow photograph beside the paragraph that follows

A paragraph is one line. A blank line ends it.

— A line of dialogue starts with a dash.
— The lines of one exchange follow each other without a blank line.

quote: The closing line. | "|" breaks it into two lines.
```

The cover (`== 01`: `cover-title`, `subtitle`), the title page (`== 02`: `title`, `subtitle`, `dedication`,
`note-heading`, one `note` per paragraph, `edition`), the contents (`== 03`: `contents`, `contents-note`; the chapters
come from the pages) and the back cover (`== 33`: `heading`, one `blurb` per paragraph, `quote`) take keys only.

A translation keeps the pages, titles, paragraphs, dialogue lines and photographs of `sq.txt`, in the same order; the
script refuses one that does not. Each page has to fit its page: the script says how much room is left on each, and
when a text is too long it sets that page a little smaller (10.55 pt, as the original does on its pages with a
photograph, then 10.3 pt, which it reports) or stops and names the page.
