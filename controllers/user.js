const User = require('../models/user');
const constans = require('../utils/constants');

module.exports.getAllUsers = (req, res) => User.find()
  .then((userData) => res.send({ data: userData }))
  .catch(() => res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((userData) => res.status(constans.STATUS_CREATED_201).send({ data: userData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка при создании пользователя' });
        return;
      }
      res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((userData) => {
      if (userData) {
        return res.send({ data: userData });
      }
      throw new Error('Пользователь не найден');
    })
    .catch((err) => {
      console.log(err)
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

module.exports.updateUserAvatar = (req, res) => {
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
