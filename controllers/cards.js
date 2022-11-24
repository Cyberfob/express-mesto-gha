const card = require('../models/card');
const constans = require('../utils/constants');

module.exports.getCards = (req, res) => {
  card.find()
    .then((cardsData) => res.send({ data: cardsData }))
    .catch(() => res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  card.create({ name, link, owner: req.user._id })
    .then((cardData) => res.status(201).send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
        return;
      }
      res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  card.findByIdAndRemove(req.params.cardId)
    .then((cardData) => {
      if (cardData) {
        return res.send({ data: cardData });
      }
      throw new Error('Карточка не найдена');
    })
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        res.status(constans.ERROR_CODE_NOT_FOUND).send({ message: 'Ошибка в теле запроса' });
        return;
      } if (err.name === 'CastError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
module.exports.likeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cardData) => {
      if (cardData) {
        return res.send({ data: cardData });
      }
      throw new Error('Карточка не найдена');
    })
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        res.status(constans.ERROR_CODE_NOT_FOUND).send({ message: 'Ошибка в теле запроса' });
        return;
      } if (err.name === 'CastError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardData) => {
      if (cardData) {
        return res.send({ data: cardData });
      }
      throw new Error('Карточка не найдена');
    })
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        res.status(constans.ERROR_CODE_NOT_FOUND).send({ message: 'Ошибка в теле запроса' });
        return;
      } if (err.name === 'CastError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
