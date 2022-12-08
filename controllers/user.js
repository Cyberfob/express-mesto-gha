const User = require('../models/user');
const { STATUS_CREATED_201, SSK, NotFoundError, BadRequestError, InternalServerError, AuthError,} = require('../utils/constants');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.getAllUsers = (req, res, next) => User.find()
  .then((userData) => {
    if (userData) {
      return res.send({ data: userData })
    }
    throw new InternalServerError ('Ошибка сервера')
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
        next(err);
      } else if (err.name === 'CastError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password, } = req.body;
  if (!validator.isEmail(email)) {
    res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка при создании пользователя' }); //Временно
    return;
  }
  const hash = bcrypt.hash(password, 10);
  User.create({ name, about, avatar, email, hash })
    .then((userData) => {
      if (err.code === 11000) {return res.status(409).send({ message: 'Ошибка при создании пользователя' });}
      res.status(constans.STATUS_CREATED_201).send({ data: userData })})
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка при создании пользователя' });
        return;
      }
      res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
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
        res.status(constans.ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      } if (err.name === 'ValidationError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
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
      throw new Error('Пользователь не найден');
    })
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        res.status(constans.ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      } if (err.name === 'CastError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.login = (req, res, next) => {
  const {email, password} = req.body;

    return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({_id: user._id}, constans.SSK, {expiresIn: '7d'})
      res.cookie(jwt, token, { maxAge: 3600000 * 24 * 7, htppOnly: true }).send(`Добро пожаловать ${user.name}`)
    })
    .catch (() => {
      res.status(401).send({message: 'Ошибка аутентификации'}) //временно
    })

}

module.exports.userInfo = (req, res) => {
  const user = req.user
  return res.send({data: user})
}