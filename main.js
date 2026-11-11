(() => {
  document.documentElement.classList.add("js");
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const menuLabel = document.querySelector(".nav-toggle-label");
  if (!toggle || !nav) return;
  const setMenu = (open, restoreFocus = false) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    if (menuLabel) menuLabel.textContent = open ? "Close" : "Menu";
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false, true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-inner")) setMenu(false);
  });
  document.addEventListener("focusin", (event) => {
    if (!event.target.closest(".header-inner")) setMenu(false);
  });
  window.matchMedia("(max-width: 760px)").addEventListener("change", () => setMenu(false));
})();
