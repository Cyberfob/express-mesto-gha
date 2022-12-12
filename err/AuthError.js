const HTTPError = require('./HTTPError');

class AuthError extends HTTPError {
  constructor(message) {
    super(message, 401);
  }
}

module.exports = AuthError;
