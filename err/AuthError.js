class AuthError extends Error {
  constructor(message) {
    super(message, 401);
  }
}

module.exports = AuthError;
