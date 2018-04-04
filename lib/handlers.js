// Implement logic for responding to HTTP requests.
const data = require('./data');
const helpers = require('./helpers');

const handlers = {
  // Use for testing whether the API is up or down.
  ping: (dataToHandle, callback) => callback(null, 200),
  // Use for letting user know their specified route was not found.
  notFound: (dataToHandle, callback) => {
    const statusCode = 404;
    const payload = { message: "That route does not exist!" };
    callback(null, statusCode, payload);
  },
  user: ({method, trimmedPath, ...dataToHandle}, callback) => {
    const supportedMethods = ['POST', 'GET', 'UPDATE', 'PUT'];
    if (!supportedMethods.includes(method)) callback(new Error(`HTTP method ${method} is not supported for /${trimmedPath}!`), 405);
    handlers.userHandlersByMethod[method](dataToHandle, callback);
  },
  userHandlersByMethod: {
    // Required payload: firstName, lastName, phone, password, isTosAgreement.
    // Optional payload: none.
    POST: ({payload}, callback) => {
      const trimmedPayload = helpers.trimObject(payload);
      const {firstName, lastName, phone, password, tosAgreement} = trimmedPayload;
      // Validate required fields.
      // @TODO: Improve this by letting the requester know which part of the body
      // is invalid by converting this into an object of validations.
      const isFirstNameValid = firstName && typeof firstName === 'string';
      const isLastnameValid = lastName && typeof lastName === 'string';
      const isPhoneValid = phone && typeof phone === 'string' && phone.length === 12;
      const isPasswordValid = password && typeof password === 'string';
      const isTosAgreementValid = tosAgreement && typeof tosAgreement === 'boolean';
      const validators = [isFirstNameValid, isLastnameValid, isPhoneValid, isPasswordValid, isTosAgreementValid];
      if (validators.some(validator => !validator)) return callback(new Error('Missing or invalid required fields!'), 400);
      // Verify for duplicate users.
      data.read('users', phone, (err, fileData) => {
        if (!err) return callback(new Error(`User with phone # ${phone} already exists!`), 400);
        // hash the password
        const hashedPassword = helpers.hash(password);
        const newUser = {
          firstName,
          lastName,
          phone,
          hashedPassword,
          tosAgreement
        };
        data.create('users', phone, newUser, err => {
          if (err) callback(new Error(`Failed to create user ${firstName} ${lastName}.`), 500);
          callback(null, 200, newUser);
        })
      })
    },
    GET: () => {},
    PUT: () => {},
    DELETE: () => {}
  },
};

module.exports = handlers;
