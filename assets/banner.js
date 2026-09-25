(function () {
  function bootCarousel(root) {
    const slides = Array.from(root.querySelectorAll("[data-slide]"));
    const copies = Array.from(document.querySelectorAll("[data-slide-copy]"));
    const dots = Array.from(root.querySelectorAll("[data-dot]"));
    const prev = root.querySelector("[data-prev]");
    const next = root.querySelector("[data-next]");
    const pauseBtn = root.querySelector("[data-pause]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0, timer = null, paused = reduce;
    function show(n) {
      if (!slides.length) return;
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
      });
    }
    function start() {
      if (reduce || paused || slides.length < 2) return;
      stop();
      timer = window.setInterval(() => show(i + 1), 7000);
    }
    function stop() { if (timer) window.clearInterval(timer); timer = null; }
    prev?.addEventListener("click", () => { show(i - 1); if (!paused) start(); });
    next?.addEventListener("click", () => { show(i + 1); if (!paused) start(); });
    pauseBtn?.addEventListener("click", () => {
      paused = !paused;
      if (pauseBtn) {
        pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
        pauseBtn.textContent = paused ? "Play" : "Pause";
      }
      if (paused) stop(); else start();
    });
    dots.forEach((dot, idx) => dot.addEventListener("click", () => { show(idx); if (!paused) start(); }));
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(i - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1); }
    });
    show(0); start();
  }
  async function initCarousel() {
    const root = document.querySelector("[data-carousel]");
    if (!root) return;
    const host = root.querySelector("[data-slide-host]");
    if (host && !host.querySelector("[data-slide]")) {
      try {
        const res = await fetch("assets/phone-slides.html", { credentials: "same-origin" });
        if (res.ok) host.innerHTML = await res.text();
      } catch (err) {}
    }
    bootCarousel(root);
  }
  const btn = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.querySelectorAll("[data-demo]").forEach((box) => {
    const out = box.querySelector("[data-demo-out]");
    const inputs = Array.from(box.querySelectorAll("input[type=checkbox]"));
    const map = { self: { inv: 124, other: 18 }, spouse: { inv: 42, other: 9 }, child: { inv: 6, other: 4 }, huf: { inv: 12, other: 11 } };
    function rupee(n) { return n >= 100 ? "\u20b9" + (n / 100).toFixed(2) + " Cr" : "\u20b9" + n + " L"; }
    function render() {
      let inv = 0, other = 0, people = 0;
      inputs.forEach((el) => {
        if (!el.checked) return;
        people += 1;
        const row = map[el.value] || { inv: 0, other: 0 };
        inv += row.inv; other += row.other;
      });
      if (out) out.innerHTML = people ? "<div><b>" + people + " in the house</b></div><div>Investments " + rupee(inv) + "</div><div>Other assets " + rupee(other) + "</div><div><strong>Net worth " + rupee(inv + other) + "</strong></div><p>Dummy data. Nothing is sent anywhere.</p>" : "<p>Tick who is in the house.</p>";
    }
    inputs.forEach((el) => el.addEventListener("change", render));
    render();
  });
  initCarousel();
})();
