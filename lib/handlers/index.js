// Implement logic for responding to HTTP requests.
const data = require('../data');
const helpers = require('../helpers');
const user = require('./user');
const token = require('./token');

const handlers = {
  // Use for testing whether the API is up or down.
  ping: (dataToHandle, callback) => callback(null, 200),
  // Use for letting user know their specified route was not found.
  notFound: (dataToHandle, callback) => {
    const statusCode = 404;
    const payload = { message: "That route does not exist!" };
    callback(null, statusCode, payload);
  },
  user,
  token
};

module.exports = handlers;
