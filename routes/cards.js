const cards = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cards.get('/cards', getCards);

cards.post('/cards', createCard);

cards.delete('/cards/:cardId', deleteCard);

cards.put('/cards/:cardId/likes', likeCard);

cards.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cards;
