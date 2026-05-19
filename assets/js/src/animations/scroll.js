import { getElements } from '../utils/dom.js';

export function initScrollAnimations() {
  const revealElements = getElements('.reveal-on-scroll');
  const skillBars = getElements('.skill-progress');
  const projetosGrid = getElements('.projetos-grid');
  const expCard = getElements('.exp-card');

  const observerReveal = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach((element) => observerReveal.observe(element));

  const observerSkills = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        if (width) bar.style.width = `${width}%`;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach((bar) => observerSkills.observe(bar));

  const observerProjetos = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        projetosGrid.forEach((grid) => grid.classList.add('animated'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  projetosGrid.forEach((grid) => observerProjetos.observe(grid));

  const expObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        expCard.forEach((card) => card.classList.add('exp-card--visible'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  expCard.forEach((card) => expObserver.observe(card));
}
