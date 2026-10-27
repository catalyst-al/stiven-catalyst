// The browser tests (npm run test:browser): five reader journeys through the built site in a real Chromium, at a
// phone, a tablet and a desktop width, in both colour themes. The light theme runs with reduced motion and the dark
// one with motion, so every width is seen both ways. They read _site, so `npm run build` comes first; `npm test`
// (node --test tests/*.test.cjs) does not see this folder.
import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

// PW_PORT: another port for a second checkout's run on the same machine.
const PORT = Number(process.env.PW_PORT) || 4173;
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
  // The photo backup journey needs one width only, print one project only (dark theme, with motion) and the phone
  // charts the phone width only: the other projects leave them out (rather than skipping them), so a run reports no
  // skipped tests.
  projects: widths.flatMap((width) => themes.map((theme) => ({
    name: `${width}px ${theme}`,
    testIgnore: [
      ...(width === 1440 && theme === "light" ? [] : [/work-backup-photos\.spec\.mjs$/]),
      ...(width === 390 ? [] : [/chart-labels\.spec\.mjs$/]),
      ...(width === 1440 && theme === "dark" ? [] : [/print\.spec\.mjs$/]),
    ],
    use: {
      viewport: { width, height: width < 600 ? 844 : 900 },
      theme,
      reducedMotion: theme === "light" ? "reduce" : "no-preference",
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
