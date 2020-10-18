const usersRouter = require('express').Router();
// const auth = require('../middlewares/auth');
const {
  getUsers, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUserById);
usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', updateAvatar);
module.exports = usersRouter;
