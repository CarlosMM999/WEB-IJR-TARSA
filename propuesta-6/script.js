/* Propuesta 6 · Carrusel del hero
   Autoplay lento (7 s) sincronizado con la barra de progreso dorada,
   pausa al pasar el ratón o al enfocar, flechas, pestañas numeradas,
   teclado y gesto de deslizar. Sin autoplay con prefers-reduced-motion. */
(function () {
  var root = document.querySelector('[data-slider]');
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll('[data-slide]'));
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-slider-go]'));
  var current = root.querySelector('[data-slider-current]');
  var progress = root.querySelector('[data-slider-progress]');
  var prev = root.querySelector('[data-slider-prev]');
  var next = root.querySelector('[data-slider-next]');
  var total = slides.length;
  var index = 0;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var autoplay = !reduceMotion && total > 1;

  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  function restartProgress() {
    if (!autoplay) {
      root.classList.add('is-static');
      root.style.setProperty('--p', (index + 1) / total);
      return;
    }
    root.classList.remove('is-running');
    void progress.offsetWidth; // reinicia la animación CSS
    root.classList.add('is-running');
  }

  function goTo(i) {
    index = (i + total) % total;
    slides.forEach(function (slide, n) {
      var active = n === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      if ('inert' in slide) slide.inert = !active;
    });
    tabs.forEach(function (tab, n) {
      tab.classList.toggle('is-active', n === index);
      tab.setAttribute('aria-current', n === index ? 'true' : 'false');
    });
    if (current) current.textContent = pad(index + 1);
    restartProgress();
  }

  // La propia animación de la barra marca el tiempo: al terminar, avanza.
  // Así la pausa (animation-play-state) detiene también el cambio de diapositiva.
  if (progress) {
    progress.addEventListener('animationend', function () {
      if (autoplay) goTo(index + 1);
    });
  }

  if (prev) prev.addEventListener('click', function () { goTo(index - 1); });
  if (next) next.addEventListener('click', function () { goTo(index + 1); });
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { goTo(parseInt(tab.getAttribute('data-slider-go'), 10)); });
  });

  // Pausa al pasar el ratón o con el foco dentro del carrusel
  var hover = false, focus = false;
  var syncPause = function () { root.classList.toggle('is-paused', hover || focus || document.hidden); };
  root.addEventListener('mouseenter', function () { hover = true; syncPause(); });
  root.addEventListener('mouseleave', function () { hover = false; syncPause(); });
  root.addEventListener('focusin', function (e) {
    // Solo pausa con foco de teclado (no tras un clic en las flechas)
    var kb = true;
    try { kb = e.target.matches(':focus-visible'); } catch (err) { /* navegador antiguo */ }
    focus = kb; syncPause();
  });
  root.addEventListener('focusout', function (e) {
    if (!root.contains(e.relatedTarget)) { focus = false; syncPause(); }
  });
  document.addEventListener('visibilitychange', syncPause);

  // Teclado
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { goTo(index - 1); }
    if (e.key === 'ArrowRight') { goTo(index + 1); }
  });

  // Deslizar en pantallas táctiles
  var startX = null, startY = null;
  root.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
  }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) goTo(index + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });

  goTo(0);
})();
