// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === "#" || href === "") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Exemplo de alerta para o formulário (sem backend real)
const form = document.querySelector('.contato-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensagem enviada (demo). Em breve responderei!');
    form.reset();
  });
}

// Logo leva ao topo da página
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- FUNDO ANIMADO COM PARTÍCULAS (CANVAS) ----------
(function initAnimatedBackground() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  let ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  let particles = [];
  let animationId = null;

  const PARTICLE_COUNT = 75;
  const COLORS = ['#f5a623', '#ff8744', '#f0b27a', '#e67e22', '#f39c12'];
  const MAX_RADIUS = 3.5;
  const MIN_RADIUS = 1.2;
  const MAX_SPEED = 0.45;
  const MIN_SPEED = 0.12;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function initParticles(w, h) {
    const newParticles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      newParticles.push({
        x: random(0, w),
        y: random(0, h),
        radius: random(MIN_RADIUS, MAX_RADIUS),
        speedX: random(-MAX_SPEED, MAX_SPEED),
        speedY: random(-MAX_SPEED, MAX_SPEED),
        alpha: random(0.25, 0.85),
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
    return newParticles;
  }

  function updateParticles(particlesArr, w, h) {
    for (let p of particlesArr) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < -p.radius) p.x = w + p.radius;
      if (p.x > w + p.radius) p.x = -p.radius;
      if (p.y < -p.radius) p.y = h + p.radius;
      if (p.y > h + p.radius) p.y = -p.radius;
    }
  }

  function drawParticles(particlesArr, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    for (let p of particlesArr) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 245, 210, 0.7)';
      ctx.globalAlpha = p.alpha * 0.6;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < particlesArr.length; i++) {
      for (let j = i + 1; j < particlesArr.length; j++) {
        const dx = particlesArr[i].x - particlesArr[j].x;
        const dy = particlesArr[i].y - particlesArr[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 95) {
          ctx.beginPath();
          ctx.moveTo(particlesArr[i].x, particlesArr[i].y);
          ctx.lineTo(particlesArr[j].x, particlesArr[j].y);
          ctx.strokeStyle = `rgba(245, 166, 35, ${0.12 * (1 - distance / 95)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1.0;
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    particles = initParticles(width, height);
  }

  function animate() {
    if (!ctx) return;
    updateParticles(particles, width, height);
    drawParticles(particles, ctx, width, height);
    animationId = requestAnimationFrame(animate);
  }

  function setup() {
    resizeCanvas();
    animate();
    window.addEventListener('resize', () => resizeCanvas());
  }
  if (canvas.getContext) setup();
  window.addEventListener('beforeunload', () => animationId && cancelAnimationFrame(animationId));
})();

// ---------- EFEITOS EXCLUSIVOS PARA SEÇÃO "SOBRE" ----------
document.addEventListener('DOMContentLoaded', () => {
  // Typewriter
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const phrases = [
      '"Criar é resolver problemas com propósito."',
      '"Design que conecta, código que transforma."',
      '"Ideias viram impacto quando ganham forma."',
      '"Tecnologia é poesia escrita em lógica."',
      '"Cada linha de código é um traço de futuro."',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function typeEffect() {
      const fullText = phrases[phraseIndex];
      if (isDeleting) {
        currentText = fullText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = fullText.substring(0, charIndex + 1);
        charIndex++;
      }
      typewriterElement.textContent = currentText;
      if (!isDeleting && charIndex === fullText.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeEffect, 300);
        return;
      }
      const speed = isDeleting ? 50 : 100;
      setTimeout(typeEffect, speed);
    }
    typeEffect();
  }

  // Contador animado para os 10 meses da Amazônia
  const counterElement = document.getElementById('amazon-counter');
  if (counterElement) {
    const observerCounter = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let count = 0;
          const target = 10;
          const step = 1;
          const interval = setInterval(() => {
            if (count >= target) {
              clearInterval(interval);
              counterElement.textContent = target;
            } else {
              count += step;
              counterElement.textContent = count;
            }
          }, 70);
          observerCounter.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observerCounter.observe(counterElement);
  }

  // Reveal on scroll e animação das barras de progresso
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const skillBars = document.querySelectorAll('.skill-progress');

  const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observerReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach(el => observerReveal.observe(el));

  const observerSkills = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        if (width) bar.style.width = width + '%';
        observerSkills.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => observerSkills.observe(bar));

  // Transição de entrada para a primeira seção (hero)
  function animateHeroOnLoad() {
    const heroText = document.querySelector('.hero-texto');
    const heroAvatar = document.querySelector('.hero-avatar');

    if (heroText && heroAvatar) {
      // Adiciona as classes que disparam a transição
      heroText.classList.add('hero-visible');
      heroAvatar.classList.add('hero-visible');
    }
  }

  // Aguarda um pequeno frame para garantir que o layout já está pronto
  setTimeout(animateHeroOnLoad, 100);

});

// ANIMAÇÃO DE SLIDE NA EXPERIÊNCIA (com stagger nos itens)
const expCard = document.querySelector('.exp-card');
if (expCard) {
  // Atribui ordem a cada item da lista para o delay progressivo
  const listItems = expCard.querySelectorAll('li');
  listItems.forEach((item, idx) => {
    item.style.setProperty('--item-order', idx);
  });

  // Observer específico para o card de experiência
  const expObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        expCard.classList.add('exp-card--visible');
        expObserver.unobserve(expCard);
      }
    });
  }, { threshold: 0.3 });

  expObserver.observe(expCard);
}

// ANIMAÇÃO DA SEÇÃO PROJETOS (fade + slide com stagger)
const projetosGrid = document.querySelector('.projetos-grid');
if (projetosGrid) {
  const observerProjetos = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        projetosGrid.classList.add('animated');
        observerProjetos.unobserve(projetosGrid); // executa só uma vez
      }
    });
  }, { threshold: 0.25 }); // ativa quando 25% da grid estiver visível

  observerProjetos.observe(projetosGrid);
}
