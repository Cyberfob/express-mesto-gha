class InternalServerError extends Error {
  constructor(message) {
    super(message, 500);
  }
}

module.exports = InternalServerError;
