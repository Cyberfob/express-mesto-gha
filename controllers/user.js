const User = require('../models/user');
const { STATUS_CREATED_201, SSK, NotFoundError, BadRequestError, InternalServerError, ConflictError,} = require('../utils/constants');
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
        next(new NotFoundError('Пользователь не найден'))
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в теле запроса'))
      } else {
        next(err)
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
        next(new NotFoundError('Пользователь не найден'))
        return;
      } if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка в теле запроса'))
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
      throw new Error('Пользователь не найден');
    })
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        next(new NotFoundError('Пользователь не найден'))
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в теле запроса'))
      } else {
        next(err)
      }
    });
};

module.exports.login = (req, res, next) => {
  const {email, password} = req.body;
console.log('auth')
    return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({_id: user._id}, SSK, {expiresIn: '7d'})
      console.log(token)
      res.send({token})
    })
    .catch ((err) => {
      console.log('11111111111111')
      res.status(401).send({message: 'Ошибка аутентификации'}) //временно
    })

}

module.exports.userInfo = (req, res,) => {
  console.log('123')
  User.findById(req.user._id)
  .then((userData) => {
    userData = userData.toObject();
    delete userData["password"]
    res.send({data: userData})
  })
  .catch(err => {console.log(err)})
}