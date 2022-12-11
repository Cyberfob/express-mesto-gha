const users = require('express').Router();
//const celebrate = require('celebrate');

const { getAllUsers, getUser, updateUser, updateUserAvatar, userInfo } = require('../controllers/user');

users.get('/', getAllUsers);

users.get('/me', userInfo);

users.patch('/me', updateUser);

users.get('/:userId', getUser);

users.patch('/me/avatar', updateUserAvatar);

module.exports = users;
