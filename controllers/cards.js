const Card = require('../models/card');
const { STATUS_CREATED_201 } = require('../utils/constants');
const NotFoundError = require('../err/NotFoundError');
const BadRequestError = require('../err/BadRequestError');

module.exports.getCards = (req, res, next) => {
  Card.find().sort({ createdAt: -1 })
    .then((cardsData) => res.send({ data: cardsData }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((cardData) => res.status(STATUS_CREATED_201).send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка в теле запроса'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((cardData) => {
      if (!cardData) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        cardData.remove()
          .then(() => res.send({ data: cardData }))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cardData) => {
      if (!cardData) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: cardData });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardData) => {
      if (!cardData) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: cardData });
    })
    .catch(next);
};
