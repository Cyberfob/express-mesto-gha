const HTTPError = require('./HTTPError');

class InternalServerError extends HTTPError {
  constructor(message) {
    super(message, 500);
  }
}

module.exports = InternalServerError;
