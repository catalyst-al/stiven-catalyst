const WORDS_PER_MINUTE = 200;

export default {
  layout: "layouts/article.njk",
  lang: "sq",
  kind: "Reflection",
  // Every reflection opens with the Stiven Catalyst Coaching logo beside its title, faded into the page like the
  // photo of an essay (layouts/article.njk, .article-hero-media.is-logo).
  image: "/media/stiven-catalyst-coaching-hero.jpg",
  image_alt: "Stiven Catalyst Coaching",
  image_logo: true,
  activeNav: "/sq/reflections.html",
  // Reflections marked "soon" get no page of their own yet.
  permalink: (data) => (data.status === "soon" ? false : `/sq/reflections/${data.page.fileSlug}/`),
  eleventyComputed: {
    readingTime: (data) => {
      if (data.read_time) return data.read_time;
      const text = String(data.page.rawInput || "").replace(/<[^>]+>/g, " ");
      const words = text.split(/\s+/).filter(Boolean).length;
      return words ? `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min` : "";
    },
  },
};
