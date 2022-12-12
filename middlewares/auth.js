const jwt = require('jsonwebtoken');
const { SSK } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Ошибка авторизации' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SSK);
  } catch (err) {
    res.status(401).send({ message: 'Ошибка авторизации' });
  }

  req.user = payload;
  next();
};
