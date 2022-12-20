const jwt = require('jsonwebtoken');
const AuthError = require('../err/AuthError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw AuthError('Ошибка авторизации');
  }

  const token = authorization.replace('Bearer ', '');
  const { JWT_SECRET } = req.app.get('config');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw AuthError('Ошибка авторизации');
  }

  req.user = payload;
  next();
};
