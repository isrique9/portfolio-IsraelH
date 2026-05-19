import { getElement, getElements } from '../utils/dom.js';

export function initNavigation() {
  getElements('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = getElement(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const logo = getElement('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
