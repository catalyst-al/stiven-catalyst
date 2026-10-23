// The tools work offline: this registers the service worker (sw.js at the root of the site) from a tool page, and
// once it is in charge asks it to keep the other tools of the same role (the links under "More from …"), so a shift
// lead who opened one tool finds them all on the floor without a connection. The note under "All your work in one
// file" says so when it is ready. Browsers without service workers skip all of it.
(() => {
  if (!("serviceWorker" in navigator)) return;
  const script = document.currentScript;
  const root = new URL("../sw.js", script?.src || location.href);
  const note = document.querySelector("[data-offline-note]");
  const ready = () => {
    if (note) note.hidden = false;
    const links = [...document.querySelectorAll('.family-more-list a[href], .main-nav a[href$="tools.html"]')].map((a) => new URL(a.getAttribute("href"), location.href).href);
    const urls = [location.href.split("#")[0].split("?")[0], ...links].filter((href) => new URL(href).origin === location.origin);
    navigator.serviceWorker.controller?.postMessage({ type: "keep", urls });
  };
  const start = () => navigator.serviceWorker.register(root.href).then((registration) => {
    if (navigator.serviceWorker.controller) ready();
    else {
      const worker = registration.installing || registration.waiting || registration.active;
      worker?.addEventListener("statechange", () => { if (worker.state === "activated") setTimeout(ready, 0); });
      navigator.serviceWorker.addEventListener("controllerchange", ready, { once: true });
    }
  }).catch(() => { /* no offline copy; the page works as before */ });
  if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
})();
