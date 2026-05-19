import { getElement } from '../utils/dom.js';

export function initHeroAnimation() {
  const heroText = getElement('.hero-texto');
  const heroAvatar = getElement('.hero-avatar');
  if (!heroText || !heroAvatar) return;

  setTimeout(() => {
    heroText.classList.add('hero-visible');
    heroAvatar.classList.add('hero-visible');
  }, 100);
}
