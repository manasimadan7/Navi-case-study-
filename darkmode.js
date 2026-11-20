/* Dark mode from "Building user journeys" onward: a dark circle grows behind the page as that
   section scrolls in, and once it covers the screen the page switches its colours (body.is-dark).
   Scrolling back up shrinks the circle and returns to light. */
(function () {
  var trigger = document.querySelector('.f-build');
  if (!trigger) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bg = document.createElement('div');
  bg.className = 'dark-reveal';
  bg.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(bg, document.body.firstChild);

  var ticking = false;
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function update() {
    ticking = false;
    var vw = window.innerWidth, vh = window.innerHeight;
    var top = trigger.getBoundingClientRect().top;
    // 0 when the section's top is at 95% of the viewport, 1 when it reaches 25%
    var p = clamp((vh * 0.95 - top) / (vh * 0.7));
    if (reduce) p = p > 0.5 ? 1 : 0;
    var full = Math.hypot(vw, vh) / 2 + 40;                 // radius that covers the whole screen from its centre
    var eased = p * p * (3 - 2 * p);                         // smoothstep
    bg.style.clipPath = 'circle(' + (eased * full).toFixed(1) + 'px at 50% 55%)';
    document.body.classList.toggle('is-dark', p > 0.6);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
