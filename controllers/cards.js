const card = require('../models/card');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports.getCards = (req, res) => {
  card.find(req.params)
    .then((cardsData) => {
      if (cardsData) {
        return res.send({ data: cardsData });
      }
      throw new Error('Нет карточек');
    })
    .catch((err) => {
      if (err.message === 'Нет карточек') {
        res.status(ERROR_CODE_400).send({ message: `Ошибка при поиске карточек - ${err}` });
      } else {
        res.status(ERROR_CODE_500).send({ message: `Ошибка сервера - ${err}` });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  card.create({ name, link, owner: req.user._id })
    .then((cardData) => {
      if (cardData) {
        res.send({ data: cardData });
      } else {
        throw new Error('Ошибка в теле запроса');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(ERROR_CODE_500).send({ message: `Ошибка сервера - ${err}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  card.findByIdAndRemove(req.params.cardId)
    .then((cardData) => {
      if (cardData) {
        res.send({ data: cardData });
      } else {
        throw new Error('Ошибка в теле запроса');
      }
    })
    .catch((err) => {
      if (err.message === 'Ошибка в теле запроса') {
        res.status(ERROR_CODE_404).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(ERROR_CODE_400).send({ message: `Ошибка в теле запроса - ${err}` });
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
        res.send({ data: cardData });
      } else {
        throw new Error('Ошибка в теле запроса');
      }
    })
    .catch((err) => {
      if (err.message === 'Ошибка в теле запроса') {
        res.status(ERROR_CODE_404).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(ERROR_CODE_400).send({ message: `Ошибка в теле запроса - ${err}` });
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
      throw new Error('Ошибка в теле запроса');
    })
    .catch((err) => {
      if (err.message === 'Ошибка в теле запроса') {
        res.status(ERROR_CODE_404).send({ message: 'Ошибка в теле запроса' });
      } else {
        res.status(ERROR_CODE_400).send({ message: `Ошибка в теле запроса - ${err}` });
      }
    });
};
