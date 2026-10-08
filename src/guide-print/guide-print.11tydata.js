// The print pages of the publications are written only when a build script asks for them (GUIDE_PRINT):
// scripts/tools-guide.mjs for the Tools Guide, scripts/magazine.mjs for the magazine, scripts/review.mjs for the
// Management Review of September 2026 and scripts/weekly.mjs for the weekly issues. They go into a temporary folder;
// the published site carries the PDFs and the readers, not these pages.
export default {
  eleventyExcludeFromCollections: true,
  eleventyComputed: {
    permalink: (data) => {
      if (!process.env.GUIDE_PRINT) return false;
      if (data.print) return `/guide-print/review/${data.print.lang}/`;
      if (data.weeklyPrint) return `/guide-print/weekly/${data.weeklyPrint.slug}/${data.weeklyPrint.lang}/`;
      if (data.item) return `/guide-print/magazine/${data.item.issue.slug}/${data.item.lang}/`;
      return `/guide-print/${data.glang}/`;
    },
  },
};
