const users = require('express').Router();

const {
  getAllUsers, getUser, createUser, updateUser, updateUserAvatar,
} = require('../controllers/user');

users.get('/users', getAllUsers);

users.get('/users/:userId', getUser);

users.post('/users', createUser);

users.patch('/users/me', updateUser);

users.patch('/users/me/avatar', updateUserAvatar);

module.exports = users;
