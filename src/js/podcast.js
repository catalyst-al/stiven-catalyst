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
    clearTimeout(timer);
    timer = setTimeout(() => { button.textContent = label; status.textContent = ""; }, 2500);
  };
  const select = () => { input.focus(); input.select(); input.setSelectionRange(0, input.value.length); };
  input.addEventListener("focus", select);
  button.addEventListener("click", () => {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(input.value).then(done, select);
    else select();
  });
})();
