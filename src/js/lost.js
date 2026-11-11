// The 404 page on a German or Albanian address (/de/…, /sq/…): that language first (audit ARCH-01). The page is one
// file for every missing address, so the server cannot choose; the address can. The heading and the page title change
// to that language, the page says it is in that language, its line moves first, and the English line keeps lang="en".
(() => {
  const lang = (/^\/(de|sq)(?:\/|$)/.exec(window.location.pathname) || [])[1];
  const root = document.querySelector("[data-lost]");
  if (!lang || !root) return;
  const title = root.querySelector("[data-lost-title]");
  const own = root.querySelector(`[data-lost-line="${lang}"]`);
  const english = root.querySelector('[data-lost-line="en"]');
  if (!title || !own || !english) return;
  document.documentElement.lang = lang;
  english.lang = "en";
  title.removeAttribute("lang");
  title.textContent = title.dataset[lang];
  const name = title.dataset[`title${lang[0].toUpperCase()}${lang.slice(1)}`];
  if (name) document.title = document.title.replace(/^Not found/, name);
  own.removeAttribute("lang");
  // Its own line keeps only the link, as the English one does under the English heading.
  const link = own.querySelector("a");
  if (link) own.replaceChildren(link);
  title.after(own);
})();
