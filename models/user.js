const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');


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
      validator: function(data)  {
        return /[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/gi.test(data)
      },
      message: 'Поле Аватар должно быть ссылкой'
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (data) => validator.isEmail(data)
      },
      message: "Ошибка поля Email",
    },
  },
);

userSchema.static.findUserByCredentials = function (email, password) {
  return this.findOne({email}).select('+password')
    .then((user) => {
      if (!user) {
        throw new Error('Неправильная почта или пароль')
      }

      return bcrypt.compare(password, user.password)
        .then((result) => {
          if (!result) {
            throw new Error('Неправильная почта или пароль')
          }
          return user;
        })
    })
}

module.exports = mongoose.model('user', userSchema);
