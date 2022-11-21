const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');

const ERROR_CODE_404 = 404;

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
    _id: '6372a4ba464f43e9202b335c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// Роуты Users
app.use('/', users);
// app.use('/users', users);
app.use('/users/:userId', users);
app.use('/users/me/avatar', users);
app.use('/users/me', users);
app.use('/users', users);

// Роуты Cards
app.use('/', cards);
app.use('/cards', cards); // (req, res) => {res.send(req.params)
app.use('/cards/:cardsId', cards);
app.use('/cards/:cardsId/likes', cards);

// Заглушка для запроса неуществующих адресов
app.all('*', (req, res) => {
  res.status(ERROR_CODE_404).send({
    message: 'Запрашиваемая страница не найдена',
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server start on 3000 PORT');
});
