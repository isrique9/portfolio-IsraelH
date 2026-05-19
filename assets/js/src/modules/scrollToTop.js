import { getElement } from '../utils/dom.js';

export function initScrollToTop(buttonSelector = '#scrollToTopBtn') {
  const scrollBtn = getElement(buttonSelector);
  if (!scrollBtn) return;

  const updateVisibility = () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', updateVisibility);
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  updateVisibility();
}
