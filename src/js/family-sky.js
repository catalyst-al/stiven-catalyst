// Tool pages: fits the family background to the title block, and lets the moons of a training module follow the course.
(() => {
  const sky = document.querySelector("[data-family-sky]");
  const main = document.getElementById("main");
  const hero = document.querySelector(".tool-hero");
  if (!sky || !main || !hero) return;

  const place = () => {
    const bottom = hero.getBoundingClientRect().bottom - main.getBoundingClientRect().top;
    sky.style.setProperty("--hero-bottom", `${Math.round(bottom)}px`);
  };
  place();
  if ("ResizeObserver" in window) new ResizeObserver(place).observe(hero);
  window.addEventListener("resize", place);

  // A moon lights up when its DMAIC step is complete; the step being read wears a ring.
  const moons = [...sky.querySelectorAll("[data-moon]")];
  const steps = [...document.querySelectorAll("[data-step]")];
  if (!moons.length || !steps.length) return;
  const sync = () => {
    for (const moon of moons) {
      const step = steps.find((link) => link.dataset.step === moon.dataset.moon);
      moon.classList.toggle("is-lit", Boolean(step?.classList.contains("is-done")));
      moon.classList.toggle("is-current", Boolean(step?.classList.contains("is-current")));
    }
    if (!moons.some((moon) => moon.classList.contains("is-current"))) moons.find((moon) => !moon.classList.contains("is-lit"))?.classList.add("is-current");
  };
  sync();
  const watch = new MutationObserver(sync);
  for (const step of steps) watch.observe(step, { attributes: true, attributeFilter: ["class"] });
})();
