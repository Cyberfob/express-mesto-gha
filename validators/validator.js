const {celebrate, Joi} = require('celebrate')
const {regEx} = require('../utils/constants')

const celebrateAuth = celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(regEx)
    })
  });

const celebrateUpdateMe = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
});
const celebrateId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().min(2).max(30),
  })
});
const celebrateUserMeAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regEx),
  }),
});
const celebrateCards = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regEx),
  }),
});
const celebrateCardsParam = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24),
  }).required(),
});
module.exports = {
  celebrateAuth,
  celebrateId,
  celebrateUpdateMe,
  celebrateUserMeAvatar,
  celebrateCards,
  celebrateCardsParam,
}