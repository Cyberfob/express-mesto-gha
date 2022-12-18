const dotenv = require('dotenv');
require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFoundError = require('./err/NotFoundError');
const { celebrateAuth } = require('./validators/validator');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV } = process.env;

const config = dotenv.config({
  path: NODE_ENV === 'production' ? '.env' : '.env.common',
}).parsed;

// Настройка порта
const { PORT = 3000 } = process.env;

// Точка входа
const app = express();

// Подключение к БД

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { autoIndex: true });

const allowedCors = [
  'http://apetruhin.nomoredomains.club',
  'https://apetruhin.nomoredomains.club',
  'http://api.apetruhin.nomoredomains.club',
  'https://api.apetruhin.nomoredomains.club',
  'localhost:3000',
];

app.set('config', config);

app.use(cors({
  origin: allowedCors,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// мидлвар : Json
app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Роуты без авторизации
app.post('/signin', celebrateAuth, login);
app.post('/signup', celebrateAuth, createUser);

app.use(auth); // Мидлвар авторизации

// Роуты требующие авторизации

// Роуты Users
app.use('/users', users);

// Роуты Cards
app.use('/cards', cards);

app.use(errorLogger);

// Заглушка для запроса неуществующих адресо
app.all('/*', (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server start on 3000 PORT');
});
