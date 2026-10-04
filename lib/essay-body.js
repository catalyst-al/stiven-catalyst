// The body of an essay or reflection as the article layout shows it (layouts/article.njk):
// - every section title (h2) gets an id, so the contents beside the text can link to it;
// - a paragraph that is only a bold sentence ("**I will not ignore it…**") gets the class "essay-principle",
//   which sets it apart as a stated principle.
// The words stay exactly as written; only attributes are added.

// "1. People" → "1-people", "Ditët 1–30: Kupto…" → "ditet-1-30-kupto…".
export const slugify = (text) =>
  String(text)
    .replace(/<[^>]+>/g, "")
    .replace(/&[#\w]+;/g, " ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "section";

// The section titles of a body, in order, each with a unique id.
const sections = (html) => {
  const used = new Map();
  return [...String(html).matchAll(/<h2>([\s\S]*?)<\/h2>/g)].map((match) => {
    const base = slugify(match[1]);
    const count = (used.get(base) || 0) + 1;
    used.set(base, count);
    return { html: match[1], id: count > 1 ? `${base}-${count}` : base };
  });
};

export const essayBody = (html) => {
  const ids = sections(html).map((section) => section.id);
  let i = 0;
  return String(html)
    .replace(/<h2>/g, () => `<h2 id="${ids[i++]}">`)
    .replace(/<p><strong>((?:(?!<\/?strong>)[\s\S])*?)<\/strong><\/p>/g, '<p class="essay-principle"><strong>$1</strong></p>');
};

// The contents of a body: [{ id, html }] for each section title (html is the title as written, without tags).
export const essayContents = (html) => sections(html).map(({ id, html: title }) => ({ id, html: title.replace(/<[^>]+>/g, "") }));
