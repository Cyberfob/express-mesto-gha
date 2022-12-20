const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const AuthError = require('../err/AuthError');

const { regEx } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
    minlength: 2,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    maxlength: 30,
    minlength: 2,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => (regEx).test(v),
      message: () => 'Поле Аватар должно быть ссылкой',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: () => 'Поле Почта должно быть Email',
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильная почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((result) => {
          if (!result) {
            throw new AuthError('Неправильная почта или пароль');
          }
          const userData = user.toObject();
          delete userData.password;
          return userData;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
