const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');

module.exports.getUser = (req, res) => {
  const userId = req.user._id;
  Users.findById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
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
  const name = 'UserName';
  const about = 'Anonymous';
  const avatar = 'https://pm1.narvii.com/6135/7f4b2774dd8da1e299924a63fba29db5a4359be3_hq.jpg';
  if (!email || !password) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
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
          res.send(user);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(400).send({ message: 'Ошибка валидации' });
          }
          return res.status(500).send({ message: 'Произошла ошибка' });
        });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      // eslint-disable-next-line no-undef
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
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
  return Users.findByIdAndUpdate(req.user._id, { name, about, avatar }, { returnNewDocument: true })
    .then((user) => res.send(user))
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
  return Users.findByIdAndUpdate(req.user._id, { avatar }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации ссылки' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
