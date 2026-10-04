// The print pages of the guides are written only when scripts/tools-guide.mjs asks for them (GUIDE_PRINT),
// into a temporary folder; the published site carries the PDFs and the reader, not these pages.
export default {
  eleventyExcludeFromCollections: true,
  eleventyComputed: {
    permalink: (data) => (process.env.GUIDE_PRINT ? `/guide-print/${data.glang}/` : false),
  },
};
