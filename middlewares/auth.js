const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Ошибка авторизации' });
  }

  const token = authorization.replace('Bearer ', '');
  const { JWT_SECRET } = req.app.get('config');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(401).send({ message: 'Ошибка авторизации' });
  }

  req.user = payload;
  next();
};
