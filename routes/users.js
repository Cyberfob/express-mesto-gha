const users = require('express').Router();

const {
  getAllUsers, getUser, createUser, updateUser, updateUserAvatar,
} = require('../controllers/user');

users.get('/', getAllUsers);

users.get('/:userId', getUser);

users.post('/', createUser);

users.patch('/me', updateUser);

users.patch('/me/avatar', updateUserAvatar);

module.exports = users;
