const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;
        return v.match(regex);
      },
      message: 'Нерабочая ссылка',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(v) {
          validator.isEmail(v);
        },
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
