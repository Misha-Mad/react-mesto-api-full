const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const RegAuthError = require('../errors/reg-auth-err');

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  Users.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  Users.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    password, email,
  } = req.body;
  const name = 'UserName';
  const about = 'Anonymous';
  const avatar = 'https://pm1.narvii.com/6135/7f4b2774dd8da1e299924a63fba29db5a4359be3_hq.jpg';
  if (!email || !password) {
    throw new BadRequestError('Переданы некорректные данные');
  }
  return bcrypt.hash(password, 10)
    .then((hash) => {
      Users.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          if (!user) {
            throw new BadRequestError('Ошибка валидации');
          }
          res.status(200).send({ message: 'Успешная регистрация' });
        })
        .catch(next);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new RegAuthError('Ошибка авторизации');
      }
      // eslint-disable-next-line no-undef
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    throw new BadRequestError('Переданы некорректные данные');
  }
  return Users.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new BadRequestError('Переданы некорректные данные');
  }
  return Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch(next);
};
