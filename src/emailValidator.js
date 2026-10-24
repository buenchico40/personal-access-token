'use strict';

const LOCAL_PART_PATTERN = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
const DOMAIN_LABEL_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/;
const TLD_PATTERN = /^[A-Za-z]{2,}$/;

const MAX_EMAIL_LENGTH = 254;
const MAX_LOCAL_PART_LENGTH = 64;
const MAX_LABEL_LENGTH = 63;

function isValidLocalPart(localPart) {
  if (localPart.length === 0 || localPart.length > MAX_LOCAL_PART_LENGTH) return false;
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  if (localPart.includes('..')) return false;
  return LOCAL_PART_PATTERN.test(localPart);
}

function isValidDomain(domain) {
  // Al partir por '.', un dominio como ".com", "dominio." o "dominio..com"
  // produce etiquetas vacías, que DOMAIN_LABEL_PATTERN rechaza.
  const labels = domain.split('.');
  if (labels.length < 2) return false;

  const allLabelsValid = labels.every(
    (label) => label.length <= MAX_LABEL_LENGTH && DOMAIN_LABEL_PATTERN.test(label)
  );
  if (!allLabelsValid) return false;

  return TLD_PATTERN.test(labels[labels.length - 1]);
}

/**
 * Indica si `email` tiene un formato de dirección de email válido.
 * Rechaza casos como "usuario@.com", "usuario@com" o "usuario@dominio..com".
 * @param {unknown} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (email.length === 0 || email.length > MAX_EMAIL_LENGTH) return false;

  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1) return false;

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  return isValidLocalPart(localPart) && isValidDomain(domain);
}

module.exports = { isValidEmail };
