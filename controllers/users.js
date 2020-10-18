const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Такого пользователя не существует' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    password, email,
  } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  return bcrypt.hash(password, 10)
    .then((hash) => {
      Users.create({
        email,
        password: hash,
      });
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      // eslint-disable-next-line no-undef
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  return Users.findByIdAndUpdate(req.user._id, { name, about, avatar })
    .then((user) => res.send({ ata: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  return Users.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации ссылки' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
