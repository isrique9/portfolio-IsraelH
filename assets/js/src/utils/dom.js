export const getElement = (selector, parent = document) => parent.querySelector(selector);
export const getElements = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

export const safeQuery = (selector, parent = document) => {
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.warn(`Consulta inválida: ${selector}`, error);
    return null;
  }
};

export const onDomReady = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};
