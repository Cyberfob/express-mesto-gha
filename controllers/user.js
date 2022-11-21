const usersSchema = require('../models/user');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports.getAllUsers = (req, res) => {
  if (!req.params) {
    res.status(ERROR_CODE_404).send({ message: 'Ошибка в теле запроса' });
    return;
  }
  usersSchema.find({})
    .then((userData) => {
      if (userData) {
        return res.send({ data: userData });
      }
      throw new Error('Нет карточек');
    })
    .catch((err) => {
      if (err.message === 'Ошибка в теле запроса') {
        res.status(ERROR_CODE_400).send({ message: `Нет пользователей - ${err}` });
      } else {
        res.status(ERROR_CODE_500).send({ message: `Ошибка сервера - ${err}` });
      }
    });
};
module.exports.getUser = (req, res) => {
  if (!req.params.userId) {
    res.status(ERROR_CODE_404).send({ message: 'Ошибка в теле запроса' });
    return;
  }
  usersSchema.findById(req.params.userId)
    .then((userData) => {
      if (userData) {
        return res.send({ data: userData });
      }
      throw new Error('Пользователь не найден');
    })
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        res.status(ERROR_CODE_404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(ERROR_CODE_400).send({ message: `Ошибка в теле запроса ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    res.status(ERROR_CODE_400).send({ message: 'Ошибка в теле запроса' });
    return;
  }

  usersSchema.create({ name, about, avatar })
    .then((userData) => {
      if (userData) {
        return res.status(200).send({ data: userData });
      }
      throw new Error('Ошибка в теле запроса');
    })
    .catch((err) => {
      if (err.message === 'Ошибка в теле запроса') {
        res.status(ERROR_CODE_404).send({ message: 'Ошибка в теле запроса' });
        return;
      }
      res.status(ERROR_CODE_400).send({ message: `Ошибка в теле запроса ${err}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  if (!name || !about) {
    res.status(ERROR_CODE_400).send({ message: 'Ошибка в теле запроса' });
    return;
  }

  usersSchema.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((userData) => {
      if (userData) {
        return res.send({ data: userData });
      }
      throw new Error('Ошибка в теле запроса');
    })
    .catch((err) => {
      if (err.message === 'Ошибка в теле запроса') {
        res.status(ERROR_CODE_400).send({ message: 'Ошибка в теле запроса' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: `Ошибка сервера ${err}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(ERROR_CODE_404).send({ message: 'Ошибка в теле запроса' });
    return;
  }

  usersSchema.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((userData) => {
      if (userData) {
        return res.send({ data: userData });
      }
      throw new Error('Ошибка в теле запроса');
    })
    .catch((err) => {
      if (err.message === 'Ошибка в теле запроса') {
        res.status(ERROR_CODE_400).send({ message: 'Ошибка в теле запроса' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: `Ошибка сервера ${err}` });
    });
};
