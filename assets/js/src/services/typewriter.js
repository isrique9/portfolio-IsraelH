import { getElement } from '../utils/dom.js';
import { TYPEWRITER_DEFAULT_PHRASES } from '../config/constants.js';

let typewriterTimeout = null;
let typewriterIsActive = true;

export function startTypewriter(phrases = TYPEWRITER_DEFAULT_PHRASES, elementId = 'typewriter-text') {
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
    typewriterTimeout = null;
  }

  const typewriterElement = getElement(`#${elementId}`);
  if (!typewriterElement || !phrases || phrases.length === 0) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!typewriterIsActive) return;
    const fullText = phrases[phraseIndex];
    let currentText;

    if (isDeleting) {
      currentText = fullText.substring(0, charIndex - 1);
      charIndex -= 1;
    } else {
      currentText = fullText.substring(0, charIndex + 1);
      charIndex += 1;
    }

    typewriterElement.textContent = currentText;

    if (!isDeleting && charIndex === fullText.length) {
      isDeleting = true;
      typewriterTimeout = setTimeout(typeEffect, 2000);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typewriterTimeout = setTimeout(typeEffect, 300);
      return;
    }

    const speed = isDeleting ? 50 : 100;
    typewriterTimeout = setTimeout(typeEffect, speed);
  }

  typeEffect();
}

export function updateTypewriterPhrases(newPhrases) {
  if (Array.isArray(newPhrases) && newPhrases.length > 0) {
    startTypewriter(newPhrases);
  }
}

export function stopTypewriter() {
  typewriterIsActive = false;
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
    typewriterTimeout = null;
  }
}

export function getDefaultTypewriterPhrases() {
  return TYPEWRITER_DEFAULT_PHRASES;
}
