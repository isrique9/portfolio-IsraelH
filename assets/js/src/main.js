import { onDomReady } from './utils/dom.js';
import { getDefaultTypewriterPhrases } from './services/typewriter.js';
import { initCanvasBackground } from './services/canvas.js';
import { initEmailService, initContactForm } from './services/email.js';
import { startTypewriter, updateTypewriterPhrases } from './services/typewriter.js';
import { initNavigation } from './modules/navigation.js';
import { initScrollToTop } from './modules/scrollToTop.js';
import { initTheme, initThemeToggle, updateThemeIcon, updateAvatarByTheme } from './modules/themeToggle.js';
import { initScrollAnimations } from './animations/scroll.js';
import { initHeroAnimation } from './animations/hero.js';

function setup() {
  const canvasApi = initCanvasBackground();

  window.updateCanvasTheme = canvasApi.updateCanvasTheme;
  window.updateTypewriterPhrases = updateTypewriterPhrases;

  startTypewriter(getDefaultTypewriterPhrases());
  initEmailService();
  initContactForm();
  initNavigation();
  initScrollToTop();
  initScrollAnimations();
  initTheme({ onThemeChange: () => window.updateCanvasTheme?.() });
  initThemeToggle('#theme-toggle', () => window.updateCanvasTheme?.());
  initHeroAnimation();
}

onDomReady(setup);
