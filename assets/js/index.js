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