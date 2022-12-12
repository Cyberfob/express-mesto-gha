const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');
const {createUser, login} = require('./controllers/user');
const auth = require('./middlewares/auth')
const { errors } = require('celebrate');
const bodyParser = require('body-parser')
const { NotFoundError } = require('./utils/constants');
const cookieParser = require('cookie-parser');
const {celebrateAuth} = require('./validators/validator')


// Настройка порта
const { PORT = 3000 } = process.env;

// Точка входа
const app = express();

// Подключение к БД

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {autoIndex: true
});

// мидлвар : Json
app.use(bodyParser.json());
app.use(cookieParser());

//Роуты без авторизации
app.post('/signin', celebrateAuth, login);
app.post('/signup', celebrateAuth, createUser);

app.use(auth); //Мидлвар авторизации

//Роуты требующие авторизации

// Роуты Users
app.use('/users', users);

// Роуты Cards
app.use('/cards', cards);


// Заглушка для запроса неуществующих адресо
app.all('/*', (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
      message: statusCode === 500
        ? `На сервере произошла ошибка${err}`
        : message
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server start on 3000 PORT');
});
