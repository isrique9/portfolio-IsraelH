import { getElement } from '../utils/dom.js';
import { COLOR_PALETTES, PARTICLE_COUNT, MAX_RADIUS, MIN_RADIUS, MAX_SPEED, MIN_SPEED } from '../config/constants.js';

let ctx = null;
let canvas = null;
let width = 0;
let height = 0;
let particles = [];
let animationId = null;
let currentConnectionColor = 'rgba(245, 166, 35, 0.12)';

const random = (min, max) => min + Math.random() * (max - min);

const getCurrentThemePalette = () => {
  const isLight = document.body.classList.contains('light-theme');
  return isLight ? COLOR_PALETTES.light : COLOR_PALETTES.dark;
};

const updateConnectionColor = () => {
  const isLight = document.body.classList.contains('light-theme');
  currentConnectionColor = isLight ? 'rgba(10, 89, 220, 0.12)' : 'rgba(245, 166, 35, 0.12)';
};

const initParticles = (w, h, palette) => {
  const result = [];
  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    result.push({
      x: random(0, w),
      y: random(0, h),
      radius: random(MIN_RADIUS, MAX_RADIUS),
      speedX: random(-MAX_SPEED, MAX_SPEED),
      speedY: random(-MAX_SPEED, MAX_SPEED),
      alpha: random(0.25, 0.85),
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }
  return result;
};

const updateParticleColors = () => {
  const palette = getCurrentThemePalette();
  particles.forEach((particle) => {
    particle.color = palette[Math.floor(Math.random() * palette.length)];
  });
  updateConnectionColor();
};

const updateParticles = () => {
  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < -particle.radius) particle.x = width + particle.radius;
    if (particle.x > width + particle.radius) particle.x = -particle.radius;
    if (particle.y < -particle.radius) particle.y = height + particle.radius;
    if (particle.y > height + particle.radius) particle.y = -particle.radius;
  });
};

const drawParticles = () => {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle) => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.alpha;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 245, 210, 0.7)';
    ctx.globalAlpha = particle.alpha * 0.6;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  });

  ctx.globalAlpha = 0.2;
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 95) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = currentConnectionColor;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1.0;
};

const resizeCanvas = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  particles = initParticles(width, height, getCurrentThemePalette());
  updateConnectionColor();
};

const animate = () => {
  if (!ctx) return;
  updateParticles();
  drawParticles();
  animationId = requestAnimationFrame(animate);
};

export function initCanvasBackground(canvasId = 'heroCanvas') {
  canvas = getElement(`#${canvasId}`);
  if (!canvas) {
    return {
      updateCanvasTheme: () => { }
    };
  }

  ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      updateCanvasTheme: () => { }
    };
  }

  const setup = () => {
    resizeCanvas();
    animate();
    window.addEventListener('resize', resizeCanvas);
  };

  setup();

  return {
    updateCanvasTheme: () => {
      if (!canvas || !ctx) return;
      if (!particles.length) {
        updateConnectionColor();
        return;
      }
      updateParticleColors();
    }
  };
}
