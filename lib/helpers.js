// Define functions for various tasks.

const crypto = require('crypto');
const { secret } = require('./config');

const trimObject = objectToTrim => Object.keys(objectToTrim)
  .reduce((trimmedObject, key) => ({
    ...trimmedObject,
    [key]: typeof objectToTrim[key] === 'string' ? objectToTrim[key].trim() : objectToTrim[key],
  }), {});

const hash = stringToHash => crypto.createHmac('sha256', secret).update(stringToHash).digest('hex');

// Returns boolean.
const validatePhoneNumber = phoneNumberToValidate => phoneNumberToValidate && typeof phoneNumberToValidate === 'string' && phoneNumberToValidate.length === 12;
const validateName = nameToValidate => nameToValidate && typeof nameToValidate === 'string' && nameToValidate.length >= 2;
const validatePassword = passwordToValidate => passwordToValidate && typeof passwordToValidate === 'string' && passwordToValidate.length >= 8;

module.exports = {
  trimObject,
  hash,
  validatePhoneNumber,
  validateName,
  validatePassword,
};
