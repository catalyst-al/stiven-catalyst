// Moving between pages with the cross-document view transition (styles.css, @view-transition). A reader who types
// or presses a key while the next page is still arriving makes Chrome show that page at once: the transition it had
// prepared is then given up ("Transition was aborted because of invalid state. Page already revealed"), before the
// page could be handed it in pagereveal. That is the browser's right answer, the page simply appears, and it must
// not surface as an uncaught error (fixtures.mjs fails a test on any). The test asks for motion in every project,
// since the transition only exists with motion.
import { test, expect, expectTheme } from "./fixtures.mjs";

const routes = [
  ["/", '.site-header a[href="/search.html"]', /\/search\.html$/],
  ["/search.html", ".site-header a.brand", /:\d+\/$/],
  ["/insights/the-tools-you-build-yourself/", ".site-header a.brand", /:\d+\/$/],
];

test("a key pressed while the next page arrives raises no error", async ({ page, theme }) => {
  // Six page loads and six arrivals: more than one journey's worth of time on a busy runner.
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const [from, selector, to] of routes) {
    // Two rounds: the key has to land in the short moment between the new page's arrival and its first frame.
    for (let round = 0; round < 2; round++) {
      await page.goto(from);
      await expectTheme(page, theme);
      await page.locator(selector).filter({ visible: true }).first().focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(to);
      await page.keyboard.press("Shift");
      await page.waitForTimeout(150);
    }
  }
});
