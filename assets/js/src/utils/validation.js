const EMAIL_REGEX = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;

export const isValidEmail = (email) => EMAIL_REGEX.test(email);

export const sanitizeInput = (value) => {
  if (!value) return '';
  return value.replace(/<[^>]*>?/gm, '').trim();
};

export const isRateLimited = (storageKey = 'lastContactSend', limitMs = 60000) => {
  const lastSent = localStorage.getItem(storageKey);
  if (!lastSent) return false;
  const diff = Date.now() - parseInt(lastSent, 10);
  return diff < limitMs;
};

export const setRateLimit = (storageKey = 'lastContactSend') => {
  localStorage.setItem(storageKey, Date.now().toString());
};
