import { getElement } from '../utils/dom.js';
import { isValidEmail, sanitizeInput, isRateLimited, setRateLimit } from '../utils/validation.js';
import { EMAILJS_CONFIG } from '../config/constants.js';

function showAlert({ icon, title, text, html }) {
  if (typeof Swal === 'undefined') {
    alert(`${title}\n${text || ''}`);
    return;
  }

  Swal.fire({
    icon,
    title,
    text,
    html,
    background: '#181d26',
    color: '#f0ede8',
    confirmButtonColor: '#f5a623'
  });
}

export function initEmailService() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }
}

export function initContactForm(formSelector = '.contato-form') {
  const form = getElement(formSelector);
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('input[name="honeypot"]');
    if (honeypot && honeypot.value.trim() !== '') {
      showAlert({
        icon: 'error',
        title: 'Erro no envio',
        text: 'Mensagem não enviada. Tente novamente.'
      });
      return;
    }

    const nameInput = form.querySelector('input[placeholder="Seu nome"]');
    const emailInput = form.querySelector('input[placeholder="Seu e-mail"]');
    const msgInput = form.querySelector('textarea');

    let name = sanitizeInput(nameInput?.value);
    let email = sanitizeInput(emailInput?.value);
    let message = sanitizeInput(msgInput?.value);

    if (!name || !email || !message) {
      showAlert({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, preencha todos os campos.'
      });
      return;
    }

    if (!isValidEmail(email)) {
      showAlert({
        icon: 'error',
        title: 'E-mail inválido',
        text: 'Digite um endereço de e-mail válido (exemplo@dominio.com).'
      });
      return;
    }

    if (name.length > 100) {
      showAlert({
        icon: 'error',
        title: 'Nome muito longo',
        text: 'O nome deve ter no máximo 100 caracteres.'
      });
      return;
    }

    if (message.length > 2000) {
      showAlert({
        icon: 'error',
        title: 'Mensagem muito longa',
        text: 'A mensagem pode ter no máximo 2000 caracteres.'
      });
      return;
    }

    if (isRateLimited()) {
      showAlert({
        icon: 'warning',
        title: 'Aguarde um momento',
        text: 'Você já enviou uma mensagem há menos de 1 minuto. Tente novamente em alguns instantes.'
      });
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent || 'Enviando...';
    if (submitBtn) {
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
    }

    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        name,
        email,
        message
      });

      setRateLimit();
      showAlert({
        icon: 'success',
        title: 'Mensagem enviada!',
        text: 'Em breve entrarei em contato.'
      });
      form.reset();
    } catch (error) {
      console.error('Erro ao enviar:', error);

      if (error?.status === 429 || error?.text?.includes('Too Many Requests')) {
        showAlert({
          icon: 'info',
          title: 'Limite temporário atingido',
          html: 'O serviço de e-mails atingiu seu limite mensal de mensagens.<br><br>⚠️ Isso é uma restrição do servidor, não um problema com seus dados.<br><br>O limite será renovado automaticamente no início do próximo mês. Tente novamente mais tarde.'
        });
      } else {
        showAlert({
          icon: 'error',
          title: 'Falha no envio',
          text: 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.'
        });
      }
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}
