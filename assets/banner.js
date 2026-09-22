(function () {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const copies = Array.from(document.querySelectorAll("[data-slide-copy]"));
  const dots = Array.from(root.querySelectorAll("[data-dot]"));
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0;
  let timer = null;
  let paused = false;

  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((el, idx) => el.classList.toggle("is-on", idx === i));
    copies.forEach((el, idx) => el.hidden = idx !== i);
    dots.forEach((el, idx) => {
      el.classList.toggle("is-on", idx === i);
      el.setAttribute("aria-selected", idx === i ? "true" : "false");
    });
  }

  function start() {
    if (reduce || paused || slides.length < 2) return;
    stop();
    timer = window.setInterval(() => show(i + 1), 5500);
  }
  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  prev?.addEventListener("click", () => { show(i - 1); start(); });
  next?.addEventListener("click", () => { show(i + 1); start(); });
  dots.forEach((dot, idx) => dot.addEventListener("click", () => { show(idx); start(); }));

  root.addEventListener("mouseenter", () => { paused = true; stop(); });
  root.addEventListener("mouseleave", () => { paused = false; start(); });
  root.addEventListener("focusin", () => { paused = true; stop(); });
  root.addEventListener("focusout", () => { paused = false; start(); });
  root.addEventListener("touchstart", () => { paused = true; stop(); }, { passive: true });
  root.addEventListener("touchend", () => { paused = false; start(); });

  let x0 = null;
  root.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
  root.addEventListener("pointerup", (e) => {
    if (x0 == null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    x0 = null;
    start();
  });

  show(0);
  start();
})();
