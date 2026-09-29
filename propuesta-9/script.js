/* Propuesta 9 · Carrusel de proyectos destacados
   Scroll horizontal nativo con scroll-snap; las flechas avanzan una tarjeta,
   se desactivan en los extremos y una barra fina indica la posición. */
(function () {
  var root = document.querySelector('[data-carousel]');
  if (!root) return;

  var track = root.querySelector('[data-carousel-track]');
  var bar = root.querySelector('[data-carousel-bar]');
  var prev = document.querySelector('[data-carousel-prev]');
  var next = document.querySelector('[data-carousel-next]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function step() {
    var card = track.querySelector('li');
    if (!card) return track.clientWidth;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function update() {
    var max = track.scrollWidth - track.clientWidth;
    var x = track.scrollLeft;
    if (prev) prev.disabled = x <= 2;
    if (next) next.disabled = x >= max - 2;
    if (bar) {
      var visible = track.clientWidth / track.scrollWidth;
      bar.style.width = (visible * 100) + '%';
      bar.style.transform = 'translateX(' + (max > 0 ? (x / max) * ((1 - visible) / visible) * 100 : 0) + '%)';
    }
  }

  function go(dir) {
    track.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  if (prev) prev.addEventListener('click', function () { go(-1); });
  if (next) next.addEventListener('click', function () { go(1); });

  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  var ticking = false;
  track.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();
