const usersSchema = require('../models/user');
const constans = require('../utils/constants');

module.exports.getAllUsers = (req, res) => usersSchema.find()
  .then((userData) => res.send({ data: userData }))
  .catch(() => res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));

module.exports.getUser = (req, res) => {
  usersSchema.findById(req.params.userId)
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Пользователь не найден' });
          break;
        case 'ValidationError':
          res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
          break;
        default:
          res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  usersSchema.create({ name, about, avatar })
    .then((userData) => res.status(201).send({ data: userData }))
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

  usersSchema.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Пользователь не найден' });
          break;
        case 'ValidationError':
          res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
          break;
        default:
          res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  usersSchema.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Пользователь не найден' });
          break;
        case 'ValidationError':
          res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
          break;
        default:
          res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
