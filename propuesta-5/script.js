/* Propuesta 5 · Carrusel de proyectos destacados (scroll-snap + botones). Sin dependencias. */
(function () {
  var track = document.querySelector('[data-carousel-track]');
  if (!track) return;
  var prev = document.querySelector('[data-carousel-prev]');
  var next = document.querySelector('[data-carousel-next]');
  var bar = document.querySelector('[data-carousel-bar]');

  var step = function () {
    var card = track.querySelector('.project-card');
    if (!card) return track.clientWidth;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  var update = function () {
    var max = track.scrollWidth - track.clientWidth;
    var x = track.scrollLeft;
    if (prev) prev.disabled = x <= 4;
    if (next) next.disabled = x >= max - 4;
    if (bar) {
      var ratio = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
      var w = Math.max(ratio, 0.18) * 100;
      bar.style.width = w + '%';
      var p = max > 0 ? x / max : 0;
      bar.style.transform = 'translateX(' + (p * (100 / w) * (100 - w)) + '%)';
    }
  };

  var go = function (dir) {
    track.scrollBy({ left: dir * step(), behavior: 'smooth' });
  };

  if (prev) prev.addEventListener('click', function () { go(-1); });
  if (next) next.addEventListener('click', function () { go(1); });

  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  var raf;
  track.addEventListener('scroll', function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();
