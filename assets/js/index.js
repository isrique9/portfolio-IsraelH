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

// Logo leva ao topo
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// FUNDO ANIMADO COM PARTÍCULAS - VERSÃO COM SUPORTE A TEMA CLARO/ESCURO
(function initAnimatedBackground() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  let ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  let particles = [];
  let animationId = null;
  let currentConnectionColor = 'rgba(245, 166, 35, 0.12)'; // valor padrão (escuro)

  const PARTICLE_COUNT = 75;
  const MAX_RADIUS = 3.5;
  const MIN_RADIUS = 1.2;
  const MAX_SPEED = 0.45;
  const MIN_SPEED = 0.12;

  // Paletas de cores conforme o tema
  const COLOR_PALETTES = {
    dark: ['#f5a623', '#ff8744', '#f0b27a', '#e67e22', '#f39c12'],
    light: ['#0a59dc', '#3a82f7', '#5a9eff', '#0078bb', '#2c8fd9']
  };

  function getCurrentThemePalette() {
    const isLight = document.body.classList.contains('light-theme');
    return isLight ? COLOR_PALETTES.light : COLOR_PALETTES.dark;
  }

  function updateConnectionColor() {
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
      currentConnectionColor = 'rgba(10, 89, 220, 0.12)';
    } else {
      currentConnectionColor = 'rgba(245, 166, 35, 0.12)';
    }
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function initParticles(w, h, palette) {
    const newParticles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      newParticles.push({
        x: random(0, w),
        y: random(0, h),
        radius: random(MIN_RADIUS, MAX_RADIUS),
        speedX: random(-MAX_SPEED, MAX_SPEED),
        speedY: random(-MAX_SPEED, MAX_SPEED),
        alpha: random(0.25, 0.85),
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    }
    return newParticles;
  }

  // Atualiza as cores das partículas existentes conforme o tema atual
  function updateParticleColors() {
    const palette = getCurrentThemePalette();
    for (let p of particles) {
      p.color = palette[Math.floor(Math.random() * palette.length)];
    }
    updateConnectionColor();
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
          ctx.strokeStyle = currentConnectionColor;
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
    const palette = getCurrentThemePalette();
    particles = initParticles(width, height, palette);
    updateConnectionColor();
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

  // Expor função para atualizar cores quando o tema mudar
  window.updateCanvasTheme = function () {
    if (particles && particles.length) {
      updateParticleColors();
    } else {
      // Se as partículas ainda não foram inicializadas, apenas atualiza a cor da linha
      updateConnectionColor();
    }
  };

  window.addEventListener('beforeunload', () => animationId && cancelAnimationFrame(animationId));
})();

// ===================== TYPEWRITER (MODIFICADO PARA SUPORTAR TRADUÇÃO) =====================
let typewriterTimeout = null;      // Armazena o setTimeout atual
let typewriterIsActive = true;     // Controla se deve continuar animando

function startTypewriter(phrases) {
  // Limpa qualquer animação anterior
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
    typewriterTimeout = null;
  }

  const typewriterElement = document.getElementById('typewriter-text');
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
      charIndex--;
    } else {
      currentText = fullText.substring(0, charIndex + 1);
      charIndex++;
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

// Função global para ser chamada pelo i18n.js quando o idioma mudar
window.updateTypewriterPhrases = function (newPhrases) {
  if (newPhrases && Array.isArray(newPhrases) && newPhrases.length > 0) {
    startTypewriter(newPhrases);
  }
};

// ===================== FIM TYPEWRITER =====================

// Efeitos da seção Sobre (sem typewriter, já tratado acima)
document.addEventListener('DOMContentLoaded', () => {
  // INICIALIZA O TYPEWRITER COM AS FRASES PADRÃO (PORTUGUÊS)
  const defaultPhrases = [
    '"Criar é resolver problemas com propósito."',
    '"Design que conecta, código que transforma."',
    '"Ideias viram impacto quando ganham forma."',
    '"Tecnologia é poesia escrita em lógica."',
    '"Cada linha de código é um traço de futuro."',
  ];
  startTypewriter(defaultPhrases);

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

  // Animação de entrada do Hero
  function animateHeroOnLoad() {
    const heroText = document.querySelector('.hero-texto');
    const heroAvatar = document.querySelector('.hero-avatar');
    if (heroText && heroAvatar) {
      heroText.classList.add('hero-visible');
      heroAvatar.classList.add('hero-visible');
    }
  }
  setTimeout(animateHeroOnLoad, 100);
});

// Animação do card de experiência (slide + stagger)
const expCard = document.querySelector('.exp-card');
if (expCard) {
  const listItems = expCard.querySelectorAll('li');
  listItems.forEach((item, idx) => {
    item.style.setProperty('--item-order', idx);
  });
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

// Animação dos projetos
const projetosGrid = document.querySelector('.projetos-grid');
if (projetosGrid) {
  const observerProjetos = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        projetosGrid.classList.add('animated');
        observerProjetos.unobserve(projetosGrid);
      }
    });
  }, { threshold: 0.25 });
  observerProjetos.observe(projetosGrid);
}

// --------------------------------------------------------------
// ENVIO DE E-MAIL COM EMAILJS + VALIDAÇÕES AVANÇADAS
// --------------------------------------------------------------

// Funções auxiliares
function isValidEmail(email) {
  const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  return re.test(email);
}

function sanitizeInput(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

// Rate limit (1 minuto)
function isRateLimited() {
  const lastSent = localStorage.getItem('lastContactSend');
  if (!lastSent) return false;
  const now = Date.now();
  const diff = now - parseInt(lastSent);
  return diff < 60000;
}

function setRateLimit() {
  localStorage.setItem('lastContactSend', Date.now().toString());
}

// Inicializa o EmailJS
(function initEmailJS() {
  emailjs.init({
    publicKey: "iLmTQfHcn50JpUOs4",
  });
})();

const form = document.querySelector('.contato-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // HONEYPOT
    const honeypot = form.querySelector('input[name="honeypot"]');
    if (honeypot && honeypot.value.trim() !== "") {
      Swal.fire({
        icon: 'error',
        title: 'Erro no envio',
        text: 'Mensagem não enviada. Tente novamente.',
        background: '#181d26',
        color: '#f0ede8',
        confirmButtonColor: '#f5a623'
      });
      return;
    }

    const nameInput = form.querySelector('input[placeholder="Seu nome"]');
    const emailInput = form.querySelector('input[placeholder="Seu e-mail"]');
    const msgInput = form.querySelector('textarea');

    let name = nameInput ? nameInput.value : '';
    let email = emailInput ? emailInput.value : '';
    let message = msgInput ? msgInput.value : '';

    name = sanitizeInput(name);
    email = sanitizeInput(email);
    message = sanitizeInput(message);

    if (!name || !email || !message) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, preencha todos os campos.',
        background: '#181d26',
        color: '#f0ede8',
        confirmButtonColor: '#f5a623'
      });
      return;
    }

    if (!isValidEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'E-mail inválido',
        text: 'Digite um endereço de e-mail válido (exemplo@dominio.com).',
        background: '#181d26',
        color: '#f0ede8',
        confirmButtonColor: '#f5a623'
      });
      return;
    }

    if (name.length > 100) {
      Swal.fire({
        icon: 'error',
        title: 'Nome muito longo',
        text: 'O nome deve ter no máximo 100 caracteres.',
        background: '#181d26',
        color: '#f0ede8',
        confirmButtonColor: '#f5a623'
      });
      return;
    }

    if (message.length > 2000) {
      Swal.fire({
        icon: 'error',
        title: 'Mensagem muito longa',
        text: 'A mensagem pode ter no máximo 2000 caracteres.',
        background: '#181d26',
        color: '#f0ede8',
        confirmButtonColor: '#f5a623'
      });
      return;
    }

    if (isRateLimited()) {
      Swal.fire({
        icon: 'warning',
        title: 'Aguarde um momento',
        text: 'Você já enviou uma mensagem há menos de 1 minuto. Tente novamente em alguns instantes.',
        background: '#181d26',
        color: '#f0ede8',
        confirmButtonColor: '#f5a623'
      });
      return;
    }

    const templateParams = { name, email, message };
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
      await emailjs.send("service_4v39ihm", "template_zybw4nm", templateParams);
      setRateLimit();
      Swal.fire({
        icon: 'success',
        title: 'Mensagem enviada!',
        text: 'Em breve entrarei em contato.',
        background: '#181d26',
        color: '#f0ede8',
        confirmButtonColor: '#f5a623'
      });
      form.reset();
    } catch (error) {
      console.error('Erro ao enviar:', error);

      // 🚨 TRATAMENTO ESPECÍFICO PARA ERRO 429 (COTA EXCEDIDA)
      if (error.status === 429 || (error.text && error.text.includes('Too Many Requests'))) {
        Swal.fire({
          icon: 'info',
          title: 'Limite temporário atingido',
          html: 'O serviço de e-mails atingiu seu limite mensal de mensagens.<br><br>⚠️ Isso é uma restrição do servidor, não um problema com seus dados.<br><br>O limite será renovado automaticamente no início do próximo mês. Tente novamente mais tarde.',
          background: '#181d26',
          color: '#f0ede8',
          confirmButtonColor: '#f5a623'
        });
      } else {
        // Qualquer outro erro (rede, template inválido, etc.)
        Swal.fire({
          icon: 'error',
          title: 'Falha no envio',
          text: 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.',
          background: '#181d26',
          color: '#f0ede8',
          confirmButtonColor: '#f5a623'
        });
      }
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ===================== TEMA CLARO/ESCURO =====================
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon('light');
  } else if (savedTheme === 'dark') {
    document.body.classList.remove('light-theme');
    updateThemeIcon('dark');
  } else {
    // Se nunca salvou, usa o que o navegador preferir
    if (prefersDark) {
      document.body.classList.remove('light-theme');
      updateThemeIcon('dark');
    } else {
      document.body.classList.add('light-theme');
      updateThemeIcon('light');
    }

    updateAvatarByTheme();   // <-- adicione esta linha

    if (window.updateCanvasTheme) {
      window.updateCanvasTheme();
    }

  }

  // Atualiza as cores das partículas conforme o tema inicial
  if (window.updateCanvasTheme) {
    window.updateCanvasTheme();
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  const icon = toggleBtn.querySelector('i');
  if (theme === 'light') {
    icon.className = 'fas fa-sun'; // ícone de sol para claro
  } else {
    icon.className = 'fas fa-moon'; // ícone de lua para escuro
  }
}

let avatarTransitionTimer = null;

function updateAvatarByTheme() {
  const avatarContainer = document.querySelector('.hero-avatar .avatar-placeholder');
  const avatarImg = avatarContainer?.querySelector('img');
  if (!avatarImg || !avatarContainer) return;

  const isLight = document.body.classList.contains('light-theme');
  const newSrc = isLight ? 'assets/img/Me_freeze.png' : 'assets/img/Me.jpeg';

  if (avatarImg.src.includes(newSrc)) return;

  if (avatarTransitionTimer) clearTimeout(avatarTransitionTimer);

  avatarContainer.classList.add('theme-transition');

  setTimeout(() => {
    avatarImg.src = newSrc;

    avatarTransitionTimer = setTimeout(() => {
      avatarContainer.classList.remove('theme-transition');
      avatarTransitionTimer = null;
    }, 200);
  }, 80);
}

function toggleTheme() {
  smoothThemeTransition(() => {
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      updateThemeIcon('dark');
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      updateThemeIcon('light');
    }
    updateAvatarByTheme();
    if (window.updateCanvasTheme) {
      window.updateCanvasTheme();
    }
  });
}
function smoothThemeTransition(callback) {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) {
    callback();
    return;
  }
  canvas.style.transition = 'opacity 0.2s ease';
  canvas.style.opacity = '0';
  setTimeout(() => {
    callback(); // aplica a troca de tema e atualiza as cores
    setTimeout(() => {
      canvas.style.opacity = '1';
      setTimeout(() => {
        canvas.style.transition = '';
      }, 200);
    }, 50);
  }, 150);
}

// Aguarda o DOM carregar para adicionar o evento
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
});

// Scroll to Top Button
const scrollBtn = document.getElementById('scrollToTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Checa estado inicial
  if (window.scrollY > 300) scrollBtn.classList.add('show');
}