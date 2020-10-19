const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
}), getUser);

usersRouter.get('/users/:id', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
}), getUserById);

usersRouter.patch('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
  }),
}), updateUser);

usersRouter.patch('/users/me/avatar', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
  body: Joi.object().keys({
    link: Joi.string().required(),
  }),
}), updateAvatar);

module.exports = usersRouter;
