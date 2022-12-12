const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { STATUS_CREATED_201, SSK } = require('../utils/constants');

const HTTPError = require('../err/HTTPError');
const NotFoundError = require('../err/NotFoundError');
const BadRequestError = require('../err/BadRequestError');
const InternalServerError = require('../err/InternalServerError');
const ConflictError = require('../err/ConflictError');
const AuthError = require('../err/AuthError');

module.exports.getAllUsers = (req, res, next) => User.find()
  .then((userData) => {
    if (userData) {
      return res.send({ data: userData });
    }
    throw new InternalServerError('Ошибка сервера');
  })
  .catch(next);

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((userData) => {
      if (userData) {
        return res.send({ data: userData });
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        next(new NotFoundError('Пользователь не найден'));
      } else if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
        .then((user) => {
          const userData = user.toObject();
          delete userData.password;
          res.status(STATUS_CREATED_201).send({ data: userData });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Неправильные почта или пароль'));
          }
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((userData) => {
      if (userData) {
        return res.send({ data: userData });
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        next(new NotFoundError('Пользователь не найден'));
        return;
      } if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка в теле запроса'));
      } else {
        next();
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((userData) => {
      if (userData) {
        return res.send({ data: userData });
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        next(new NotFoundError('Пользователь не найден'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в теле запроса'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SSK, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new AuthError('Ошибка аутентификации'));
    });
};

module.exports.userInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      res.send({ data: userData });
    })
    .catch(next);
};
