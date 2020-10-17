const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/users', auth, getUsers);
usersRouter.get('/users/:id', auth, getUserById);
usersRouter.patch('/users/me', auth, updateUser);
usersRouter.patch('/users/me/avatar', auth, updateAvatar);
module.exports = usersRouter;
