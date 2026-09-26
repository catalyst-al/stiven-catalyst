const WORDS_PER_MINUTE = 200;

export default {
  layout: "layouts/article.njk",
  lang: "sq",
  activeNav: "/sq/insights.html",
  permalink: (data) => (data.status === "soon" ? false : `/sq/insights/${data.page.fileSlug}/`),
  eleventyComputed: {
    readingTime: (data) => {
      if (data.read_time) return data.read_time;
      const text = String(data.page.rawInput || "").replace(/<[^>]+>/g, " ");
      const words = text.split(/\s+/).filter(Boolean).length;
      return words ? `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min` : "";
    },
  },
};
