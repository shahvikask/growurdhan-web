(function () {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const copies = Array.from(document.querySelectorAll("[data-slide-copy]"));
  const dots = Array.from(root.querySelectorAll("[data-dot]"));
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const pauseBtn = root.querySelector("[data-pause]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0;
  let timer = null;
  let paused = reduce;

  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((el, idx) => {
      const on = idx === i;
      el.classList.toggle("is-on", on);
      el.setAttribute("aria-hidden", on ? "false" : "true");
    });
    copies.forEach((el, idx) => { el.hidden = idx !== i; });
    dots.forEach((el, idx) => {
      const on = idx === i;
      el.classList.toggle("is-on", on);
      el.setAttribute("aria-selected", on ? "true" : "false");
      el.tabIndex = on ? 0 : -1;
    });
    const live = root.querySelector("[data-slide-status]");
    if (live) live.textContent = "Screen " + (i + 1) + " of " + slides.length;
  }

  function start() {
    if (reduce || paused || slides.length < 2) return;
    stop();
    timer = window.setInterval(() => show(i + 1), 7000);
  }
  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }
  function setPaused(next) {
    paused = next;
    if (pauseBtn) {
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      pauseBtn.textContent = paused ? "Play" : "Pause";
    }
    if (paused) stop(); else start();
  }

  prev?.addEventListener("click", () => { show(i - 1); if (!paused) start(); });
  next?.addEventListener("click", () => { show(i + 1); if (!paused) start(); });
  pauseBtn?.addEventListener("click", () => setPaused(!paused));
  dots.forEach((dot, idx) => dot.addEventListener("click", () => { show(idx); if (!paused) start(); }));

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(i - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1); }
  });

  root.addEventListener("mouseenter", () => stop());
  root.addEventListener("mouseleave", () => { if (!paused) start(); });
  root.addEventListener("focusin", () => stop());
  root.addEventListener("focusout", () => { if (!paused) start(); });

  let x0 = null;
  root.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
  root.addEventListener("pointerup", (e) => {
    if (x0 == null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    x0 = null;
    if (!paused) start();
  });

  show(0);
  if (pauseBtn) {
    pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
    pauseBtn.textContent = paused ? "Play" : "Pause";
  }
  start();
})();

document.querySelectorAll("[data-accordion] button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", open ? "false" : "true");
    if (panel) panel.hidden = open;
  });
});
