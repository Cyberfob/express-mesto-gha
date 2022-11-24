const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');
const constants = require('./utils/constants');

// Настройка порта
const { PORT = 3000 } = process.env;

// Точка входа
const app = express();

// Подключение к БД

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
});
/* мидлвары : Json и заглушка для _id */
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6372a4ba464f43e9202b335c1', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// Роуты Users
app.use('/users', users);

// Роуты Cards
app.use('/cards', cards);

// Заглушка для запроса неуществующих адресов
app.all('*', (req, res) => {
  res.status(constants.ERROR_CODE_NOT_FOUND).send({
    message: 'Запрашиваемая страница не найдена',
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server start on 3000 PORT');
});
