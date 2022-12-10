const User = require('../models/user');
const { STATUS_CREATED_201, SSK, NotFoundError, BadRequestError, InternalServerError, AuthError, ConflictError,} = require('../utils/constants');
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
  User.findById(req.user.userId)
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
  console.log("0")
  bcrypt.hash(req.body.password, 10)
  .then((hash) => {
    console.log("1")
    User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash })
    .then((user) => {
      console.log("4")
      user = user.toObject();
      delete user["password"]
      res.status(STATUS_CREATED_201).send({data: user})
    })
    .catch(err => {
      if (err.code === 11000) {
        next(new ConflictError("Неправильные почта или пароль"))
      }
    })
  })
    .catch((err)=> {
      console.log("3")
      if (err.name === 'ValidationError') {
        next(new Error("valid"))
      } else {
        console.log("7")
        next(err)
      }
    })
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
console.log('auth')
    return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({_id: user._id}, SSK, {expiresIn: '7d'})
      res.cookie(jwt, token, { maxAge: 3600000 * 24 * 7, htppOnly: true }).send(`Добро пожаловать ${user.name}`)
    })
    .catch ((err) => {
      console.log(err)
      res.status(401).send({message: 'Ошибка аутентификации1'}) //временно
    })

}

module.exports.userInfo = (req, res) => {
  const user = req.user
  return res.send({data: user})
}