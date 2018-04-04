// Define functions for various tasks.

const crypto = require('crypto');
const { secret } = require('./config');

const trimObject = (objectToTrim) => Object.keys(objectToTrim)
  .reduce((trimmedObject, key) => ({
    ...trimmedObject,
    [key]: typeof objectToTrim[key] === 'string' ? objectToTrim[key].trim() : objectToTrim[key],
  }), {});

const hash = (stringToHash) => crypto.createHmac('sha256', secret).update(stringToHash).digest('hex');

module.exports = {
  trimObject,
  hash
};
