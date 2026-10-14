// The entries of a language's Atom feed (partials/feed.njk): its essays and reflections, and the publications, each
// with the day it went online (src/_data/online.json) and the day its text last changed, newest first. A publication
// is an issue of the Management Review, its special edition, a volume of the treatise or an issue of From the Floor;
// the Tools Guide comes in once per edition, on the day the edition came out, so a new one reaches the feed's readers.
// The podcast has its own feeds (podcast.xml). A publication not yet on main has no date and waits for one.
const day = (date) => new Date(date).toISOString().slice(0, 10);

export const feedEntries = (posts = [], lang = "en", { weekly, review, treatise, magazine, toolsGuide, online = {}, local = (url) => url } = {}, limit = 30) => {
  const of = (item) => item?.[lang] || item?.en || {};
  const W = of(weekly);
  const no = W.labels?.no || (lang === "en" ? "No." : "Nr.");
  const publication = (slug, title, summary, rank) => online[slug] && {
    title,
    summary,
    url: local(`/magazine/${slug}.html`),
    id: local(`/magazine/${slug}.html`),
    published: online[slug].published,
    updated: online[slug].modified,
    rank,
  };
  const special = review && of(review);
  const T = of(treatise);
  const floorName = magazine?.names?.[lang]?.name || magazine?.names?.en?.name;
  const guide = toolsGuide && of(toolsGuide);
  const entries = [
    ...posts.map((post) => ({
      post,
      title: post.data.title,
      summary: post.data.deck || post.data.summary,
      url: post.url,
      id: post.url,
      published: day(post.date),
      updated: day(post.date),
      rank: 1e6,
    })),
    ...(weekly?.issues || []).map((item) => publication(item.slug, `${W.name || weekly.name} ${no} ${item.no}: ${of(item).heading}`, of(item).sub, item.number)),
    ...(special ? [publication(review.slug, `${special.name}, ${special.date}: ${[special.theme].flat().join(" ")}`, special.sub, 0)] : []),
    ...(treatise?.volumes || []).map((item) => publication(item.slug, `${T.short || treatise.name} ${T.labels?.vol || "Vol."} ${item.numeral}: ${of(item).heading}`, of(item).sub, item.number)),
    ...(magazine?.issues || []).map((item) => publication(item.slug, `${floorName} ${no} ${item.no}: ${of(item).heading}`, of(item).sub, item.number)),
    ...(guide && toolsGuide.editionDate ? [{
      title: `${guide.title} · ${guide.edition}`,
      summary: guide.subtitle,
      url: local("/guides/tools-guide.html"),
      id: `${local("/guides/tools-guide.html")}#edition-${toolsGuide.edition}`,
      published: toolsGuide.editionDate,
      updated: toolsGuide.editionDate,
      rank: 1e6,
    }] : []),
  ].filter(Boolean);
  // Newest first; on the same day an essay before a publication, and a later issue before an earlier one.
  const shown = entries.sort((a, b) => b.published.localeCompare(a.published) || b.rank - a.rank).slice(0, limit);
  return { entries: shown, updated: shown.map((entry) => entry.updated).sort().at(-1) || "2026-01-01" };
};
