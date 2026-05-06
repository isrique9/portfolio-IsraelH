// --------------------------------------------------------------
// SISTEMA DE TRADUÇÃO COM JSONs EXTERNOS + TYPEWRITER
// --------------------------------------------------------------
const i18nConfig = {
  currentLang: 'pt_br',
  translations: {},
  elementsMap: [
    // Header
    { selector: '.logo', key: 'Header.Logo' },
    { selector: 'nav ul li:nth-child(1) a', key: 'Header.NavItems[0]' },
    { selector: 'nav ul li:nth-child(2) a', key: 'Header.NavItems[1]' },
    { selector: 'nav ul li:nth-child(3) a', key: 'Header.NavItems[2]' },
    { selector: 'nav ul li:nth-child(4) a', key: 'Header.NavItems[3]' },
    { selector: '.btn-cv', key: 'Header.CvButton' },
    // Hero
    { selector: '.hero-texto .badge', key: 'Welcome.Badge' },
    { selector: '.hero-texto h1', key: 'Welcome.Heading', isHtml: true },
    { selector: '.hero-texto p', key: 'Welcome.Paragraph' },
    { selector: '.hero-texto .btn-primary', key: 'Welcome.PrimaryButton' },
    { selector: '.hero-texto .btn-secondary', key: 'Welcome.SecondaryButton' },
    // About section
    { selector: '#sobre .section-title span', key: 'AboutMe.Title' },
    { selector: '#sobre .sobre-texto p', key: 'AboutMe.Description', isHtml: true },
    // Soft skills title (com ícone preservado)
    { selector: '#sobre .soft-skills h3', key: 'AboutMe.SoftSkills.Title', preserveIcon: true, iconSelector: 'i' },
    // Skills individuais (sem ícone)
    { selector: '#sobre .skill-item span', key: 'AboutMe.SoftSkills.Skills[0]', index: 0 },
    { selector: '#sobre .skill-item span', key: 'AboutMe.SoftSkills.Skills[1]', index: 1 },
    { selector: '#sobre .skill-item span', key: 'AboutMe.SoftSkills.Skills[2]', index: 2 },
    { selector: '#sobre .skill-item span', key: 'AboutMe.SoftSkills.Skills[3]', index: 3 },
    // Info itens
    { selector: '#sobre .dado-item span', key: 'AboutMe.InfoItems[0]', index: 0 },
    { selector: '#sobre .dado-item span', key: 'AboutMe.InfoItems[1]', index: 1 },
    { selector: '#sobre .dado-item span', key: 'AboutMe.InfoItems[2]', index: 2 },
    // Tech stack
    { selector: '.tech .section-title span', key: 'TechStack.Title' },
    { selector: '.tech-cat:first-child h3', key: 'TechStack.Categories[0].Name' },
    { selector: '.tech-cat:last-child h3', key: 'TechStack.Categories[1].Name' },
    // Projects
    { selector: '#projetos .section-title span', key: 'Projects.Title' },
    // Experiência
    { selector: '.experiencia .section-title span', key: 'Experience.Title' },
    { selector: '.exp-card h3', key: 'Experience.JobTitle' },
    { selector: '.exp-data', key: 'Experience.Date' },
    // Educação
    { selector: '.educacao .section-title span', key: 'Graduations.Title' },
    // Contato
    { selector: '#contato .section-title span', key: 'Contact.Title' },
    { selector: '.contato-info p:first-child', key: 'Contact.Email' },
    { selector: '.contato-info p:nth-child(2)', key: 'Contact.Phone' },
    { selector: '.contato-form input[placeholder="Seu nome"]', key: 'Contact.Form.NamePlaceholder', attr: 'placeholder' },
    { selector: '.contato-form input[placeholder="Seu e-mail"]', key: 'Contact.Form.EmailPlaceholder', attr: 'placeholder' },
    { selector: '.contato-form textarea', key: 'Contact.Form.MessagePlaceholder', attr: 'placeholder' },
    { selector: '.contato-form button', key: 'Contact.Form.SubmitButton' },
    // Footer
    { selector: 'footer p', key: 'Footer', isDynamic: true }
  ]
};

// Função para obter valor aninhado do objeto (ex: 'Welcome.Heading')
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    const match = key.match(/(\w+)\[(\d+)\]/);
    if (match) {
      const arrKey = match[1];
      const idx = parseInt(match[2], 10);
      return current && current[arrKey] ? current[arrKey][idx] : undefined;
    }
    return current ? current[key] : undefined;
  }, obj);
}

// Aplica tradução a um elemento (preservando ícone se necessário)
function applyTranslation(el, value, map) {
  if (map.attr) {
    el.setAttribute(map.attr, value);
    return;
  }
  if (map.preserveIcon && map.iconSelector) {
    const icon = el.querySelector(map.iconSelector);
    el.innerHTML = value;
    if (icon && !el.contains(icon)) {
      el.appendChild(icon);
    }
  } else if (map.isHtml) {
    el.innerHTML = value;
  } else {
    el.textContent = value;
  }
}

// Carrega um JSON e aplica ao DOM
async function loadLanguage(lang) {
  try {
    const response = await fetch(`assets/i18n/${lang}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const translations = data.Details.Results[0].Text;
    i18nConfig.translations = translations;

    // Aplica mapeamentos padrão
    for (let map of i18nConfig.elementsMap) {
      const elements = document.querySelectorAll(map.selector);
      if (!elements.length) continue;

      let translatedValue = getNestedValue(translations, map.key);
      if (translatedValue === undefined) {
        console.warn(`Chave não encontrada: ${map.key}`);
        continue;
      }

      if (map.index !== undefined && elements[map.index]) {
        applyTranslation(elements[map.index], translatedValue, map);
      } else {
        elements.forEach(el => applyTranslation(el, translatedValue, map));
      }
    }

    // Responsabilidades (lista)
    const expListItems = document.querySelectorAll('.exp-card ul li');
    const responsibilities = translations.Experience?.Responsibilities;
    if (responsibilities && expListItems.length === responsibilities.length) {
      expListItems.forEach((li, idx) => {
        li.textContent = responsibilities[idx];
      });
    }

    // Projetos
    const projectCards = document.querySelectorAll('.card-projeto');
    const projectsList = translations.Projects?.List;
    if (projectsList && projectCards.length === projectsList.length) {
      projectCards.forEach((card, idx) => {
        const proj = projectsList[idx];
        const h3 = card.querySelector('h3');
        if (h3) {
          const iconClass = h3.querySelector('i')?.className || 'fas fa-code';
          h3.innerHTML = `<i class="${iconClass}"></i> ${proj.Name}`;
        }
        const techDiv = card.querySelector('.card-tech');
        if (techDiv) techDiv.textContent = proj.Tech;
        const descP = card.querySelector('p');
        if (descP) descP.textContent = proj.Description;
        const links = card.querySelectorAll('.card-links a');
        if (links.length === proj.Links.length) {
          links.forEach((link, linkIdx) => {
            link.childNodes[0].textContent = proj.Links[linkIdx];
          });
        }
      });
    }

    // Educação
    const eduItems = document.querySelectorAll('.edu-card-single ul li');
    const graduations = translations.Graduations?.Items;
    if (graduations && eduItems.length === graduations.length) {
      eduItems.forEach((li, idx) => {
        const grad = graduations[idx];
        li.querySelector('div').innerHTML = `
          <strong>${grad.Degree}</strong><br>
          ${grad.Institution}<br>
          <span>${grad.Period}</span>
        `;
      });
    }

    // Footer dinâmico
    const footerP = document.querySelector('footer p');
    if (footerP && translations.Footer) {
      const year = new Date().getFullYear();
      footerP.textContent = translations.Footer.replace('{year}', year);
    }

    // E-mail e telefone no contato
    const emailP = document.querySelector('.contato-info p:first-child');
    const phoneP = document.querySelector('.contato-info p:nth-child(2)');
    if (emailP) emailP.innerHTML = `<i class="fas fa-envelope"></i> ${translations.Contact.Email}`;
    if (phoneP) phoneP.innerHTML = `<i class="fas fa-phone-alt"></i> ${translations.Contact.Phone}`;

    // Links sociais do contato
    const socialLinksContato = document.querySelectorAll('.contato-info .social-links a');
    const socialNames = translations.Contact?.SocialLinks;
    if (socialLinksContato.length === socialNames?.length) {
      socialLinksContato.forEach((link, idx) => {
        const name = socialNames[idx];
        link.innerHTML = `<i class="fab fa-${name.toLowerCase()}"></i> ${name} <i class="fa-solid fa-angle-right"></i>`;
      });
    }

    // ----- TYPEWRITER: atualiza frases e reinicia animação -----
    const highlightPhrases = translations.AboutMe?.HighlightPhrase;
    if (highlightPhrases && Array.isArray(highlightPhrases) && highlightPhrases.length > 0) {
      // Chama uma função global que deve estar definida no index.js
      if (window.updateTypewriterPhrases) {
        window.updateTypewriterPhrases(highlightPhrases);
      } else {
        console.warn('window.updateTypewriterPhrases não está definida. Certifique-se de que o index.js exporta essa função.');
      }
    }

    // Salva idioma
    localStorage.setItem('preferredLang', lang);
    i18nConfig.currentLang = lang;
  } catch (error) {
    console.error('Erro ao carregar tradução:', error);
  }
}

function initLanguage() {
  const savedLang = localStorage.getItem('preferredLang') || 'pt_br';
  const select = document.getElementById('languageSwitcher');
  if (select) select.value = savedLang;
  loadLanguage(savedLang);
}

// Inicializa o seletor personalizado com bandeiras
function initCustomLanguageSwitcher() {
  const wrapper = document.querySelector('.custom-lang-switcher');
  if (!wrapper) return;

  const selectedDiv = wrapper.querySelector('.lang-selected');
  const dropdown = wrapper.querySelector('.lang-dropdown');
  const selectedFlagImg = wrapper.querySelector('.selected-flag');
  const options = wrapper.querySelectorAll('.lang-dropdown li');

  // Abrir/fechar dropdown
  selectedDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    wrapper.classList.toggle('open');
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove('open');
    }
  });

  // Selecionar idioma
  options.forEach(option => {
    option.addEventListener('click', async (e) => {
      const lang = option.getAttribute('data-lang');
      if (!lang) return;

      // Atualiza a bandeira exibida
      const flagSrc = option.querySelector('img').src;
      selectedFlagImg.src = flagSrc;

      // Carrega o idioma
      await loadLanguage(lang);

      // Fecha o dropdown
      wrapper.classList.remove('open');
    });
  });
}

// Sobrescreve a função initLanguage para usar o novo switcher
function initLanguage() {
  const savedLang = localStorage.getItem('preferredLang') || 'pt_br';
  // Atualiza a bandeira exibida de acordo com o idioma salvo
  const selectedFlagImg = document.querySelector('.selected-flag');
  if (selectedFlagImg) {
    const flagMap = {
      'pt_br': 'https://flagcdn.com/br.svg',
      'en': 'https://flagcdn.com/us.svg',
      'esp': 'https://flagcdn.com/es.svg'
    };
    selectedFlagImg.src = flagMap[savedLang] || flagMap['pt_br'];
  }
  loadLanguage(savedLang);
}

document.addEventListener('DOMContentLoaded', () => {
  initCustomLanguageSwitcher();
  initLanguage();
});

document.addEventListener('DOMContentLoaded', initLanguage);