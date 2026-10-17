// A tiny static server for the browser tests: serves the built site (_site) as GitHub Pages does, a folder by its
// index.html, and nothing outside _site. Started by playwright.config.mjs (webServer) on the port given as the first
// argument.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(process.cwd(), "_site");
const port = Number(process.argv[2]) || 4173;
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif",
  ".gif": "image/gif", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff", ".mp3": "audio/mpeg",
  ".pdf": "application/pdf", ".webmanifest": "application/manifest+json",
};

// The file for an address: the path itself, or its folder's index.html.
const fileFor = async (pathname) => {
  let path;
  try { path = normalize(join(root, decodeURIComponent(pathname))); } catch { return null; }
  if (path !== root && !path.startsWith(root + sep)) return null;
  try {
    const info = await stat(path);
    if (info.isFile()) return path;
    if (info.isDirectory()) { await stat(join(path, "index.html")); return join(path, "index.html"); }
  } catch { /* not found */ }
  return null;
};

createServer(async (request, response) => {
  const { pathname } = new URL(request.url, "http://localhost");
  const file = await fileFor(pathname);
  if (!file) {
    response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    response.end(await readFile(join(root, "404.html")).catch(() => "Not found"));
    return;
  }
  response.writeHead(200, { "content-type": types[extname(file).toLowerCase()] || "application/octet-stream" });
  response.end(await readFile(file));
}).listen(port, "127.0.0.1", () => console.log(`serving _site on http://127.0.0.1:${port}`));
