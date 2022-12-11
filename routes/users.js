const users = require('express').Router();
const {celebrateId, celebrateUpdateMe} = require('../validators/validator')


const { getAllUsers, getUser, updateUser, updateUserAvatar, userInfo } = require('../controllers/user');

users.get('/', getAllUsers);

users.get('/me', celebrateUpdateMe, userInfo);

users.patch('/me', celebrateUpdateMe, updateUser);

users.get('/:userId', celebrateId, getUser);

users.patch('/me/avatar', updateUserAvatar);

module.exports = users;
