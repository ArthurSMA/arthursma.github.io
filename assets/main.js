const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');

const closeMenu = () => {
  if (!menu || !menuButton) return;
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
};

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

const easeInOutCubic = (progress) => (
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2
);

const scrollToSection = (target) => {
  const headerOffset = 80;
  const destination = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  const start = window.scrollY;
  const distance = destination - start;
  const duration = Math.min(850, Math.max(380, Math.abs(distance) * 0.42));

  if (reduceMotion.matches) {
    window.scrollTo(0, destination);
    return;
  }

  const startedAt = performance.now();

  const animate = (currentTime) => {
    const progress = Math.min((currentTime - startedAt) / duration, 1);
    window.scrollTo(0, Math.floor(start + distance * easeInOutCubic(progress)));
    if (progress < 1) requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};

document.querySelectorAll('[data-scroll]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    closeMenu();
    scrollToSection(target);
  });
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('show'));
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
