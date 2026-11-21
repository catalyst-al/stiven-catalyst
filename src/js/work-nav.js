// The pilot's way between its pages (docs/plan-sot-2026-11-11/PLANI.md, step 6): Today, + Log, Actions with the
// number of open ones, Handover, Catalyst, and the shift this device is working in. The bar is in the markup of the
// pilot's pages, hidden; this script shows it only where the device has the pilot on (the setting
// "sc-shift-close-ui") and the workplace profile has no shifts of its own. It only reads: it turns nothing on, starts
// no shift and moves no draft.
(() => {
  const nav = document.querySelector("[data-work-nav]");
  if (!nav) return;
  const read = (key) => { try { return JSON.parse(window.localStorage.getItem(key)); } catch { return null; } };
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const LANG = ["de", "sq"].includes(document.documentElement.lang) ? document.documentElement.lang : "en";
  let shifts = [];
  try { shifts = JSON.parse(nav.dataset.shifts || "[]"); } catch { shifts = []; }

  const pilotOn = () => { const value = read("sc-shift-close-ui"); return isObject(value) && value.v === 1 && value.on === true; };
  const profileFits = () => {
    const profile = read("sc-workplace");
    const own = isObject(profile) && Array.isArray(profile.shifts) ? profile.shifts.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean) : [];
    return !own.length || (own.length === shifts.length && own.every((word, index) => word === shifts[index]));
  };
  // The open actions of the list the browser keeps, by the rule of js/actions-store.js (isOpen), an example aside.
  const openActions = () => {
    const list = read("sc-actions");
    const rows = isObject(list) && Array.isArray(list.rows) ? list.rows : [];
    return rows.filter((item) => isObject(item) && item.example !== true && (item.status === "open" || item.status === "doing")).length;
  };
  const showDate = (iso) => (window.ToolKit && window.ToolKit.showDate ? window.ToolKit.showDate(iso) : iso);
  // The active shift in this page's words, or "" when there is none or it is not surely a shift of this page.
  const shiftText = () => {
    const Context = window.ShiftContext;
    if (!Context) return "";
    const found = Context.activeOn(shifts, LANG);
    return found.ok ? `${found.label} · ${showDate(found.active.date)}` : "";
  };
  const render = () => {
    const on = pilotOn() && profileFits();
    nav.hidden = !on;
    if (!on) return;
    const count = openActions();
    const badge = nav.querySelector("[data-wn-count]");
    badge.textContent = String(count);
    badge.hidden = !count;
    const actions = nav.querySelector('[data-wn="actions"]');
    actions.setAttribute("aria-label", `${actions.dataset.label}: ${count}`);
    const chip = nav.querySelector("[data-wn-shift]");
    const text = shiftText();
    chip.textContent = text || chip.dataset.none;
    chip.classList.toggle("is-unset", !text);
  };
  // The page the visitor is on.
  const here = window.location.pathname.replace(/\/+$/, "");
  nav.querySelectorAll("a[data-wn]").forEach((link) => {
    if (new URL(link.href).pathname.replace(/\/+$/, "") === here) link.setAttribute("aria-current", "page");
  });
  render();
  // The module of the active shift is loaded after the page's own scripts: the chip is filled once it is there.
  document.addEventListener("DOMContentLoaded", render, { once: true });
  window.addEventListener("shift-context:changed", render);
  window.addEventListener("storage", render);
  window.addEventListener("pageshow", render);
})();
