class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddNotFoundErrorenError';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
