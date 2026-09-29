/* Propuesta 8 · Servicios: pestañas en escritorio, acordeón en móvil. */
(function () {
  var root = document.querySelector('[data-svc]');
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.svc__tab'));
  var mq = window.matchMedia('(max-width: 900px)');

  function panelOf(tab) {
    return document.getElementById(tab.getAttribute('aria-controls'));
  }

  function setActive(tab, open) {
    tabs.forEach(function (t) {
      var on = t === tab && open;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-expanded', on ? 'true' : 'false');
      panelOf(t).classList.toggle('is-active', on);
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      var isOpen = tab.classList.contains('is-active');
      // En móvil (acordeón) un segundo toque cierra; en escritorio siempre hay uno activo
      if (mq.matches) setActive(tab, !isOpen);
      else setActive(tab, true);
    });
    // Flechas arriba/abajo para moverse entre servicios en escritorio
    tab.addEventListener('keydown', function (e) {
      if (mq.matches) return;
      var next = null;
      if (e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); next.focus(); setActive(next, true); }
    });
  });

  // Al volver a escritorio, garantiza que haya un servicio activo
  var onChange = function () {
    if (!mq.matches && !root.querySelector('.svc__tab.is-active')) setActive(tabs[0], true);
  };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);
})();
