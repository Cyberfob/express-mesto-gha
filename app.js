const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');
const constants = require('./utils/constants');
const {createUser, login} = require('./controllers/user');
const auth = require('./middlewares/auth')
const { celebrate, Joi, errors, Segments } = require('celebrate');
const bodyParser = require('body-parser')

// Настройка порта
const { PORT = 3000 } = process.env;

// Точка входа
const app = express();

// Подключение к БД

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
});
// мидлвар : Json
app.use(bodyParser.json());

/*app.use((req, res, next) => {
  req.user = {
    _id: '6372a4ba464f43e9202b335c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});*/

//Роуты без авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.number().integer().min(18),
    about: Joi.string().min(2).max(30),
  })
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.number().integer().min(18),
    about: Joi.string().min(2).max(30),
  })
}), createUser);

app.use(auth); //Мидлвар авторизации

//Роуты требующие авторизации

// Роуты Users
app.use('/users', users);

// Роуты Cards
app.use('/cards', cards);


// Заглушка для запроса неуществующих адресо
app.all('*', (req, res) => {
  res.status(constants.ERROR_CODE_NOT_FOUND).send({
    message: 'Запрашиваемая страница не найдена',
  });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server start on 3000 PORT');
});
