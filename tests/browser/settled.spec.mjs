// The readiness wait of the journeys (untilSettled in fixtures.mjs), on fictional pages: it does not wait for a quiet
// network, which a request that never ends would hold off for ever (the cause of the homepage journey's timeouts), and
// it still refuses an element that never stops moving, so a genuine layout problem fails instead of being clicked.
import { test, expect, untilSettled } from "./fixtures.mjs";

const fictional = (body) => `<!doctype html><html lang="en"><head><title>Fictional</title></head><body>${body}</body></html>`;

test("a request that never ends holds off a quiet network, not the settled wait", async ({ page }) => {
  await page.route("**/fictional-never-answers", () => { /* never answered: the request stays open */ });
  await page.route("**/fictional-page.html", (route) => route.fulfill({ contentType: "text/html", body: fictional('<a id="go" href="#done">Go</a><script>fetch("/fictional-never-answers")</script>') }));
  await page.goto("/fictional-page.html");
  const quiet = await page.waitForLoadState("networkidle", { timeout: 2_000 }).then(() => true, () => false);
  expect(quiet, "the open request keeps the network busy").toBe(false);
  const started = Date.now();
  await untilSettled(page.locator("#go"), { timeout: 2_000 });
  expect(Date.now() - started, "settled without waiting for the network").toBeLessThan(2_000);
});

test("an element that stops moving is settled where it stops; one that never stops is refused", async ({ page }) => {
  await page.route("**/fictional-motion.html", (route) => route.fulfill({ contentType: "text/html", body: fictional(`
    <style>
      #lift { display: inline-block; transition: transform .3s; }
      #lift.up { transform: translateY(-40px); }
      @keyframes drift { from { transform: translateX(0); } to { transform: translateX(200px); } }
      #drift { display: inline-block; animation: drift 1s linear infinite; }
    </style>
    <p style="margin-top: 80px"><a id="lift" href="#a">Lifts once</a> <a id="drift" href="#b">Drifts for ever</a></p>
    <script>requestAnimationFrame(() => document.getElementById("lift").classList.add("up"))</script>`) }));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/fictional-motion.html");
  const lift = page.locator("#lift");
  // The paragraph does not move: the link's place before the lift is the paragraph's top; the lift is 40 px.
  const rest = await page.locator("p").evaluate((p) => p.getBoundingClientRect().top);
  const box = await untilSettled(lift, { timeout: 3_000 });
  expect(box.y, "settled after the lift, not before it").toBeLessThan(rest - 30);
  await expect(untilSettled(page.locator("#drift"), { timeout: 1_000 })).rejects.toThrow(/still moving after 1000 ms/);
});
