const data = require('../data');

module.exports = ({method, trimmedPath, ...dataToHandle}, callback) => {
  const supportedMethods = ['POST', 'GET', 'PUT', 'DELETE'];
  if (!supportedMethods.includes(method)) callback(new Error(`HTTP method ${method} is not supported for /${trimmedPath}!`), 405);
  [method](dataToHandle, callback);
};

const POST = (dataToHandle, callback) => {
  // data.
};

const GET = () => {};
const PUT = () => {};
const DELETE = () => {};
