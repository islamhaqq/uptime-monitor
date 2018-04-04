const handlers = {
  ping: (dataToHandle, callback) => callback(null, 200),
  // Let user know their specified route was not found.
  notFound: (dataToHandle, callback) => {
    const statusCode = 404;
    const payload = { message: "That route does not exist!" };
    callback(null, statusCode, payload);
  }
};

module.exports = handlers;
