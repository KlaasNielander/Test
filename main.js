'use strict';

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
(function () {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ============================================================
   STICKY "BEL DIRECT" CTA — verschijnt na de hero
   ============================================================ */
(function () {
  const ctaSticky = document.getElementById('ctaSticky');
  const hero = document.querySelector('.hero, .page-hero');
  if (!ctaSticky || !hero) return;

  const heroObserver = new IntersectionObserver(
    ([entry]) => ctaSticky.classList.toggle('visible', !entry.isIntersecting),
    { threshold: 0.1 }
  );
  heroObserver.observe(hero);
})();

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Alleen verbergen zodra we zeker weten dat JS de zichtbaarheid ook weer aanzet.
  document.documentElement.classList.add('js-reveal');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   VOOR / NA SLIDER — sleepbare vergelijking
   ============================================================ */
(function () {
  const sliders = document.querySelectorAll('.ba-slider');
  if (!sliders.length) return;

  sliders.forEach(initSlider);

  function initSlider(slider) {
    const wrap = slider.querySelector('.ba-slider__before-wrap');
    const img = wrap ? wrap.querySelector('.ba-slider__img') : null;
    const handle = slider.querySelector('.ba-slider__handle');
    if (!wrap || !img || !handle) return;

    let dragging = false;

    function syncImageWidth() {
      const rect = slider.getBoundingClientRect();
      img.style.width = rect.width + 'px';
      img.style.height = rect.height + 'px';
    }

    function setPosition(percent) {
      const clamped = Math.min(96, Math.max(4, percent));
      wrap.style.width = clamped + '%';
      handle.style.left = clamped + '%';
      slider.setAttribute('aria-valuenow', Math.round(clamped));
    }

    function percentFromClientX(clientX) {
      const rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(percentFromClientX(clientX));
    }

    function stopDragging() {
      dragging = false;
    }

    slider.addEventListener('pointerdown', e => {
      dragging = true;
      setPosition(percentFromClientX(e.clientX));
    });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDragging);

    slider.addEventListener('touchstart', e => {
      dragging = true;
      setPosition(percentFromClientX(e.touches[0].clientX));
    }, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', stopDragging);

    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.setAttribute('aria-label', 'Sleep om voor en na te vergelijken');
    slider.addEventListener('keydown', e => {
      const current = parseFloat(wrap.style.width) || 50;
      if (e.key === 'ArrowLeft') setPosition(current - 5);
      if (e.key === 'ArrowRight') setPosition(current + 5);
    });

    window.addEventListener('resize', syncImageWidth);
    syncImageWidth();
    setPosition(50);
  }
})();

/* ============================================================
   OFFERTE / CONTACT FORM
   ============================================================ */
(function () {
  const form = document.getElementById('offerteForm');
  if (!form) return;
  const formSuccess = document.getElementById('formSuccess');

  function validateField(field) {
    const valid = field.checkValidity() && field.value.trim() !== '';
    field.classList.toggle('error', !valid && field.required);
    return valid;
  }

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => { if (!validateField(field)) valid = false; });
    if (!valid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Versturen...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        window.location.href = '/bedankt/';
      } else {
        throw new Error('Formspree gaf een foutstatus terug');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.style.display = 'flex';
        formSuccess.style.background = '#fef2f2';
        formSuccess.style.borderColor = '#fecaca';
        formSuccess.querySelector('p').textContent =
          'Er ging iets mis bij het versturen. Probeer het opnieuw of bel/app ons direct.';
      }
    }
  });
})();

/* ============================================================
   COOKIE BANNER
   ============================================================ */
(function () {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  if (!localStorage.getItem('cookieChoice')) {
    setTimeout(() => banner.classList.add('show'), 1200);
  }

  window.cookieChoice = function (accepted) {
    try { localStorage.setItem('cookieChoice', accepted ? 'accepted' : 'declined'); } catch (e) {}
    banner.classList.remove('show');
  };
})();
