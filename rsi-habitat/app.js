const root = document.documentElement;
const progress = document.querySelector('.reading-progress span');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateProgress = () => {
  const scrollable = root.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  root.style.setProperty('--reading-progress', ratio.toFixed(4));
};

updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);

const reveals = document.querySelectorAll('[data-reveal]');

if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

  reveals.forEach((element) => observer.observe(element));
}

if (progress) progress.setAttribute('aria-hidden', 'true');
