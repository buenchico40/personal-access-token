'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidEmail } = require('../src/emailValidator');

const invalidEmails = [
  ['usuario@.com', 'el dominio empieza por un punto'],
  ['usuario@com', 'el dominio no tiene TLD'],
  ['usuario@dominio.', 'el dominio termina en un punto'],
  ['usuario@dominio..com', 'hay dos puntos seguidos en el dominio'],
  ['@dominio.com', 'falta la parte local'],
  ['usuario@', 'falta el dominio'],
  ['usuario dominio.com', 'falta la @'],
  ['usu ario@dominio.com', 'hay espacios'],
  ['.usuario@dominio.com', 'la parte local empieza por un punto'],
];

const validEmails = [
  'usuario@dominio.com',
  'nombre.apellido@sub.dominio.es',
  'usuario+etiqueta@dominio.co',
  'user_123@dominio-ejemplo.org',
];

for (const [email, reason] of invalidEmails) {
  test(`rechaza "${email}" (${reason})`, () => {
    assert.equal(isValidEmail(email), false);
  });
}

for (const email of validEmails) {
  test(`acepta "${email}"`, () => {
    assert.equal(isValidEmail(email), true);
  });
}

test('rechaza valores que no son string', () => {
  for (const value of [null, undefined, 42, {}, []]) {
    assert.equal(isValidEmail(value), false);
  }
});

test('rechaza etiquetas de dominio que empiezan o terminan en guion', () => {
  assert.equal(isValidEmail('usuario@-dominio.com'), false);
  assert.equal(isValidEmail('usuario@dominio-.com'), false);
});

test('rechaza emails que superan la longitud máxima', () => {
  const longLocalPart = 'a'.repeat(65);
  assert.equal(isValidEmail(`${longLocalPart}@dominio.com`), false);
});
