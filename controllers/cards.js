const Card = require('../models/card');
const constans = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find()
    .then((cardsData) => res.send({ data: cardsData }))
    .catch(() => res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((cardData) => res.status(constans.STATUS_CREATED_201).send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
        return;
      }
      res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cardData) => {
      if (cardData) {
        return res.send({ data: cardData });
      }
      throw new Error('Карточка не найдена');
    })
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        res.status(constans.ERROR_CODE_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      } if (err.name === 'CastError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
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
        res.status(constans.ERROR_CODE_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      } if (err.name === 'CastError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
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
        res.status(constans.ERROR_CODE_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      } if (err.name === 'CastError') {
        res.status(constans.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(constans.ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
