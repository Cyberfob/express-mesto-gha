const Card = require('../models/card');
const { STATUS_CREATED_201 } = require('../utils/constants');
const NotFoundError = require('../err/NotFoundError');
const BadRequestError = require('../err/BadRequestError');
const ForbiddenError = require('../err/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find()
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
      } else if (cardData.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалять карточки других пользователей');
      } else {
        cardData.remove()
          .then(() => res.send({ data: cardData }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(err);
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в теле запроса'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).populate(['likes', 'owner'])
    .then((cardData) => {
      if (cardData) {
        return res.send({ data: cardData });
      }
      throw new NotFoundError('Карточка не найдена');
    })
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        next(err);
        return;
      } if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в теле запроса'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardData) => {
      if (cardData) {
        return res.send({ data: cardData });
      }
      throw new NotFoundError('Карточка не найдена');
    })
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        next(err);
        return;
      } if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в теле запроса'));
      } else {
        next(err);
      }
    });
};
