import { getElement } from '../utils/dom.js';
import { AVATAR_IMAGES } from '../config/constants.js';

let avatarTransitionTimer = null;

export function updateThemeIcon(theme) {
  const toggleBtn = getElement('#theme-toggle');
  if (!toggleBtn) return;
  const icon = toggleBtn.querySelector('i');
  if (!icon) return;

  icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

export function updateAvatarByTheme() {
  const avatarContainer = getElement('.hero-avatar .avatar-placeholder');
  const avatarImg = avatarContainer?.querySelector('img');
  if (!avatarImg || !avatarContainer) return;

  const isLight = document.body.classList.contains('light-theme');
  const newSrc = isLight ? AVATAR_IMAGES.light : AVATAR_IMAGES.dark;
  if (avatarImg.src.includes(newSrc)) return;

  if (avatarTransitionTimer) {
    clearTimeout(avatarTransitionTimer);
    avatarTransitionTimer = null;
  }

  avatarContainer.classList.add('theme-transition');
  setTimeout(() => {
    avatarImg.src = newSrc;
    avatarTransitionTimer = setTimeout(() => {
      avatarContainer.classList.remove('theme-transition');
      avatarTransitionTimer = null;
    }, 200);
  }, 80);
}

export function smoothThemeTransition(callback) {
  const canvas = getElement('#heroCanvas');
  if (!canvas) {
    callback();
    return;
  }

  canvas.style.transition = 'opacity 0.2s ease';
  canvas.style.opacity = '0';
  setTimeout(() => {
    callback();
    setTimeout(() => {
      canvas.style.opacity = '1';
      setTimeout(() => {
        canvas.style.transition = '';
      }, 200);
    }, 50);
  }, 150);
}

export function initTheme({ onThemeChange = () => { } } = {}) {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : (prefersDark ? 'dark' : 'light');

  if (theme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }

  updateThemeIcon(theme);
  updateAvatarByTheme();
  onThemeChange();
}

export function toggleTheme(onThemeChange = () => { }) {
  smoothThemeTransition(() => {
    const isLight = document.body.classList.contains('light-theme');
    const newTheme = isLight ? 'dark' : 'light';

    if (newTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }

    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    updateAvatarByTheme();
    onThemeChange();
  });
}

export function initThemeToggle(toggleSelector = '#theme-toggle', onThemeChange = () => { }) {
  const toggleBtn = getElement(toggleSelector);
  if (!toggleBtn) return;
  toggleBtn.addEventListener('click', () => toggleTheme(onThemeChange));
}
