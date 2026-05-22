'use strict';

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

// Close nav when a link is clicked
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Sticky CTA — show after hero
const ctaSticky = document.getElementById('ctaSticky');
const hero = document.querySelector('.hero');

const heroObserver = new IntersectionObserver(
  ([entry]) => {
    ctaSticky.classList.toggle('visible', !entry.isIntersecting);
  },
  { threshold: 0.1 }
);
heroObserver.observe(hero);

// Form validation & submit
const form = document.getElementById('offerteForm');
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

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    if (!validateField(field)) valid = false;
  });

  if (!valid) return;

  // Simulate send (replace with real fetch/API call)
  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Versturen...';

  setTimeout(() => {
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Offerte aanvragen';
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 800);
});
