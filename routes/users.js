const users = require('express').Router();

const { getAllUsers, getUser, updateUser, updateUserAvatar, userInfo } = require('../controllers/user');

users.get('/', getAllUsers);

users.get('/:userId', getUser);

users.get('/me', userInfo);

users.patch('/me', updateUser);

users.patch('/me/avatar', updateUserAvatar);

module.exports = users;
