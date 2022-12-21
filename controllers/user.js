const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { STATUS_CREATED_201 } = require('../utils/constants');

const NotFoundError = require('../err/NotFoundError');
const BadRequestError = require('../err/BadRequestError');
const ConflictError = require('../err/ConflictError');

module.exports.getAllUsers = (req, res, next) => User.find()
  .then((userData) => {
    res.send({ data: userData });
  })
  .catch(next);

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: userData });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({ ...req.body, password: hash })
        .then((user) => {
          const userData = user.toObject();
          delete userData.password;
          res.status(STATUS_CREATED_201).send({ data: userData });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Неправильные почта или пароль'));
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка в теле запроса'));
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: userData });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { JWT_SECRET } = req.app.get('config');
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.userInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};
