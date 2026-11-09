// A page title for search results (audit SEO-08: 260 titles ran past 70 characters, which a search result cuts off;
// they are fitted to 65, which leaves room for how wide the letters are).
// The visible heading of the page and its social preview keep their full title; only <title> is fitted:
//   1. an issue or a volume ("Management Review No. 12: The ten behaviours …") drops its series prefix, keeping the
//      topic and a short number ("The ten behaviours … · No. 12");
//   2. else the longest beginning that ends at a colon, a comma or a dash and stays within the limit of 65 (and says enough
//      on its own: 12 characters or more before a colon), "Hotel KPI calculator: occupancy, ADR, RevPAR against budget";
//   3. else cut at a word, with an ellipsis.
export const MAX_TITLE = 65;
const len = (text) => [...text].length;

export const fitTitle = (title, max = MAX_TITLE) => {
  const text = String(title ?? "").replace(/\s+/g, " ").trim();
  if (len(text) <= max) return text;
  const series = /^(.*?\b(No\.|Nr\.|issue|Ausgabe|numri|Vol\.|Volume|Band|vëllimi|Vëllimi)\s*(\d+)):\s+(.+)$/i.exec(text);
  if (series) {
    const [, , mark, number, topic] = series;
    const short = `${topic} · ${mark.replace(/^issue$/i, "No.").replace(/^Ausgabe$/i, "Nr.").replace(/^v(ë|e)llimi$/i, "Vëll.")} ${number}`;
    if (len(short) <= max) return short;
    if (len(topic) <= max) return topic;
    return fitTitle(topic, max);
  }
  // A comma counts only when it closes a part that stands on its own: after a colon, 22 characters or more (so a list is
  // not cut after its first item, "…: Macht"); without a colon before it, at 30 or more.
  const standsAlone = (i, sep) => {
    if (sep === ": ") return i >= 12;
    const colon = text.lastIndexOf(": ", i);
    return colon >= 0 ? i - colon - 2 >= 22 : i >= 30;
  };
  const breaks = [...text.matchAll(/: |, | – | — /g)].filter((m) => m.index <= max && standsAlone(m.index, m[0])).map((m) => m.index);
  if (breaks.length) return text.slice(0, breaks.at(-1));
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 25 ? cut.lastIndexOf(" ") : cut.length).replace(/[,:;–—-]\s*$/, "")}…`;
};
