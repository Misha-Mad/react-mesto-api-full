const usersRouter = require('express').Router();
// const auth = require('../middlewares/auth');
const {
  getUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/users/me', getUser);
usersRouter.get('/users/:id', getUserById);
usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', updateAvatar);
module.exports = usersRouter;
