// The podcast page (pages/podcast.njk): the address of the feed, copied with one tap for any podcast app. Where the
// clipboard cannot be written (an old browser, a page not served over https), the address is selected instead, so
// the phone's own "Copy" is one step away.
(() => {
  const box = document.querySelector("[data-podcast-copy]");
  if (!box) return;
  const input = box.querySelector("[data-podcast-url]");
  const button = box.querySelector("[data-podcast-copy-button]");
  const status = box.querySelector("[data-podcast-status]");
  const label = button.textContent;
  let timer;
  const done = () => {
    button.textContent = box.dataset.copied;
    status.textContent = box.dataset.copied;
    // The button and the address glow while "Copied" shows (styles.css: .is-done).
    box.classList.add("is-done");
    clearTimeout(timer);
    timer = setTimeout(() => { button.textContent = label; status.textContent = ""; box.classList.remove("is-done"); }, 2500);
  };
  const select = () => { input.focus(); input.select(); input.setSelectionRange(0, input.value.length); };
  input.addEventListener("focus", select);
  button.addEventListener("click", () => {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(input.value).then(done, select);
    else select();
  });
})();

// The episodes one after another: when one ends, the next in the list starts by itself and comes into view (not
// after the last, so the page does not play on forever), and the lock screen's, the car's and the headphones'
// "next" and "previous" go from episode to episode. A browser that refuses to start it leaves the next one ready
// under its own play button.
(() => {
  const episodes = [...document.querySelectorAll(".podcast-episode")];
  if (episodes.length < 2) return;
  const mediaOf = (episode) => episode?.querySelector("[data-audio-media]");
  const start = (episode) => {
    if (!episode) return;
    episode.scrollIntoView({ block: "center", behavior: document.documentElement.dataset.motion === "paused" ? "auto" : "smooth" });
    const toggle = episode.querySelector("[data-audio-toggle]");
    // The player's own button, so the place reached and the speed are kept as when the listener presses it.
    if (toggle && !toggle.closest("[hidden]")) toggle.click();
    else mediaOf(episode)?.play()?.catch(() => {});
  };
  episodes.forEach((episode, i) => {
    const media = mediaOf(episode);
    if (!media) return;
    media.addEventListener("ended", () => { if (episodes[i + 1]) start(episodes[i + 1]); });
    media.addEventListener("play", () => {
      if (!("mediaSession" in navigator)) return;
      const on = (action, handler) => { try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* not supported */ } };
      on("nexttrack", episodes[i + 1] ? () => { media.pause(); start(episodes[i + 1]); } : null);
      on("previoustrack", episodes[i - 1] ? () => { media.pause(); start(episodes[i - 1]); } : null);
    });
  });
})();
