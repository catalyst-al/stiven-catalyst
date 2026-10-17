# Dependencies and their advisories

Last checked: 17 October 2026, with `npm audit` (npm 10, Node 22).

The site is static. Its dependencies run only on the machine that builds it (a laptop or the GitHub runner): they
read the files in `src/` and write `_site/`. No package is sent to visitors, except the few scripts the site copies
from `src/js/vendor/`, which are not npm dependencies. So an advisory in a package here concerns the build and the
development server, never a reader of the site.

All dependencies are `devDependencies`: Eleventy (the build), jsdom (the Node tests), terser (minifying the scripts),
and, since this check, `@playwright/test` and `@axe-core/playwright` (the browser tests in `tests/browser/`).

## What the audit of 17 October found

`npm audit` reported 9 packages (5 high, 4 moderate). They came from two advisories, both deep inside Eleventy 3.1.6;
the other seven packages were only flagged for depending on these two.

1. **braces, stack exhaustion through deeply nested patterns** (GHSA-vfj7-8cjw-p6xm, high, braces ≤ 3.0.3).
   Path: `@11ty/eleventy` → `chokidar@3` → `braces`; the same `chokidar@3` also through `nunjucks@3.2.4` and
   `@11ty/eleventy-dev-server@2.0.8`. chokidar is the file watcher of `npm start`. Exposure: a pattern written to
   crash the watcher would have to be put in the project's own configuration; nothing a visitor sends reaches it.
   Build-time only, none for visitors.
2. **sprintf-js, denial of service through unbounded precision specifiers** (GHSA-hp3w-g68c-fv3c, moderate,
   sprintf-js ≤ 1.1.3). Path: `@11ty/eleventy` → `gray-matter@4` → `js-yaml@3` → `argparse@1` → `sprintf-js`.
   argparse is only used by the command line of js-yaml, which Eleventy never calls; the format strings would be
   ours anyway. Build-time only, none for visitors.

Neither package had a fixed release: 3.0.3 and 1.1.3 are the latest versions, so an `overrides` entry could not pin
a safe one. The fix came from Eleventy instead.

## What was done

Eleventy was updated from 3.1.6 to **3.1.7**, a patch release (`npm install --save-dev @11ty/eleventy@^3.1.7`). It
replaces the packages above with its own maintained forks: `@11ty/chokidar-with-glob-support` (chokidar 4, which no
longer uses braces), `@11ty/nunjucks` 3.3.0 and `@11ty/gray-matter` 1.0.0 (on js-yaml 4, whose argparse 2 has no
sprintf-js), and `@11ty/eleventy-dev-server` 2.1.2. braces, sprintf-js and argparse 1 are no longer installed.
`npm audit fix --force` was not used and no `overrides` were needed.

Checked afterwards:

- `npm audit`: 0 vulnerabilities.
- The site built with 3.1.6 and with 3.1.7 is the same: `diff -r` of the two `_site` folders found no difference.
- `npm test` (all pass, none skipped), `node scripts/check-coaching-build.mjs` and the browser tests pass.

Nothing is left open.

## How to check again

```sh
npm ci
npm audit                         # what is affected; --json for the paths
npm ls <package>                  # which dependency brings a package in
npm outdated                      # newer versions within reach
```

For a finding: follow its path with `npm ls`, see whether a patch or minor release of the direct dependency (almost
always Eleventy) drops or fixes it, and if not, whether the vulnerable package itself has a fixed release that an
`overrides` entry in `package.json` can pin. Before keeping any update, build the site before and after it into two
folders and compare them with `diff -r`: a dependency update should not change a single page. Never use
`npm audit fix --force`, which may install a new major version of Eleventy without saying what it changes.
