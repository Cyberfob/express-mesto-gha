const cards = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  celebrateCards,
  celebrateCardsParam,
} = require('../validators/validator');

cards.get('/', getCards);

cards.post('/', celebrateCards, createCard);

cards.delete('/:cardId', celebrateCardsParam, deleteCard);

cards.put('/:cardId/likes', celebrateCardsParam, likeCard);

cards.delete('/:cardId/likes', celebrateCardsParam, dislikeCard);

module.exports = cards;
