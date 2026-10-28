// The site's own Eleventy configuration, with one change: src/media (about 600 MB of images and PDFs, the same in
// both versions and never read by the tools' scripts) is not copied into _site; build.sh links it in instead, so the
// two builds fit on a small disk. Run from the root of the version to build: the configuration is imported from the
// current directory, so the old version builds with its own configuration and its own node_modules.
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const { default: site } = await import(pathToFileURL(join(process.cwd(), "eleventy.config.js")).href);

export default function (eleventyConfig) {
  const copy = eleventyConfig.addPassthroughCopy.bind(eleventyConfig);
  eleventyConfig.addPassthroughCopy = (path, ...rest) => (path === "src/media" ? eleventyConfig : copy(path, ...rest));
  return site(eleventyConfig);
}
