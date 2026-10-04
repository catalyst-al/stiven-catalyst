// After the build: every script the browser loads is minified in _site (the sources in src/js stay readable).
// The scripts are classic scripts that share names through the global scope (window.ToolKit, top-level
// functions), so top-level names are never renamed; only names inside functions are shortened.
// pdf.js (js/vendor) is already minified and is left as it is.
import fs from "node:fs";
import path from "node:path";
import { minify } from "terser";

const OPTIONS = {
  ecma: 2020,
  module: false,
  toplevel: false,
  compress: { passes: 2 },
  mangle: true,
  format: { comments: false },
};

const scripts = (dir) => {
  const out = [];
  const walk = (folder) => {
    if (!fs.existsSync(folder)) return;
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) { if (entry.name !== "vendor") walk(file); }
      else if (entry.name.endsWith(".js") && !entry.name.endsWith(".min.js")) out.push(file);
    }
  };
  walk(path.join(dir, "js"));
  const root = path.join(dir, "script.js");
  if (fs.existsSync(root)) out.push(root);
  return out;
};

export const minifyScripts = async (dir = "_site") => {
  let before = 0;
  let after = 0;
  for (const file of scripts(dir)) {
    const code = fs.readFileSync(file, "utf8");
    const result = await minify(code, OPTIONS);
    if (!result.code || result.code.length >= code.length) continue;
    fs.writeFileSync(file, result.code);
    before += code.length;
    after += result.code.length;
  }
  return { before, after };
};
