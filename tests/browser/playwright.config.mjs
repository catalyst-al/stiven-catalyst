// The browser tests (npm run test:browser): five reader journeys through the built site in a real Chromium, at a
// phone, a tablet and a desktop width, in both colour themes. The light theme runs with reduced motion and the dark
// one with motion, so every width is seen both ways. They read _site, so `npm run build` comes first; `npm test`
// (node --test tests/*.test.cjs) does not see this folder.
import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

// BROWSER_TEST_PORT (or PW_PORT): another port, for a second checkout running on the same machine.
const PORT = Number(process.env.BROWSER_TEST_PORT || process.env.PW_PORT) || 4173;
// In the development container Chromium is already installed here; in CI `npx playwright install` puts it where
// Playwright looks by itself.
const LOCAL_CHROMIUM = "/opt/pw-browsers/chromium";
const launchOptions = existsSync(LOCAL_CHROMIUM) ? { executablePath: LOCAL_CHROMIUM } : {};

const widths = [390, 768, 1440];
const themes = ["dark", "light"];

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.mjs",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  // The GitHub runner has four cores of its own; locally Playwright takes half of what is there.
  workers: process.env.CI ? 4 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  outputDir: "../../test-results/browser",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    browserName: "chromium",
    launchOptions,
    trace: "retain-on-failure",
  },
  // Some specs run in one project or one width only, and the others leave them out (rather than skipping them), so a
  // run reports no skipped tests: the photo backup journey at one width, print in one project (dark theme, with
  // motion), the phone charts at the phone width, and the accessibility pages at 1440 px, once per theme (they check
  // both widths themselves).
  projects: widths.flatMap((width) => themes.map((theme) => ({
    name: `${width}px ${theme}`,
    testIgnore: [
      ...(width === 1440 && theme === "light" ? [] : [/work-backup-photos\.spec\.mjs$/, /work-backup-sealed\.spec\.mjs$/, /case-flow\.spec\.mjs$/, /room-inspection-actions\.spec\.mjs$/, /room-inspection-recheck\.spec\.mjs$/]),
      ...(width === 1440 && theme === "dark" ? [] : [/tool-pages\.spec\.mjs$/]),
      ...(width === 390 ? [] : [/chart-labels\.spec\.mjs$/]),
      ...(width === 1440 && theme === "dark" ? [] : [/print\.spec\.mjs$/]),
      ...(width === 1440 ? [] : [/a11y-pages\.spec\.mjs$/]),
    ],
    use: {
      viewport: { width, height: width < 600 ? 844 : 900 },
      theme,
      // A context option, not a test option: written directly under `use` Playwright ignores it, and every project
      // ran with motion.
      contextOptions: { reducedMotion: theme === "light" ? "reduce" : "no-preference" },
    },
  }))),
  webServer: {
    command: `node tests/browser/server.mjs ${PORT}`,
    cwd: "../..",
    url: `http://127.0.0.1:${PORT}/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 10_000,
  },
});
