const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser, getUserById, updateUser, updateAvatar, getUsers,
} = require('../controllers/users');

usersRouter.get('/users', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
}), getUsers);

usersRouter.get('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
}), getUser);

usersRouter.get('/users/:id', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), getUserById);

usersRouter.patch('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), updateUser);

usersRouter.patch('/users/me/avatar', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/),
  }).unknown(true),
}), updateAvatar);

module.exports = usersRouter;
