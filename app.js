require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);
app.get('/*', (req, res) => {
  res.status(404).send(JSON.stringify({ message: 'Запрашиваемый ресурс не найден' }));
});

app.use(errorLogger);

app.use(errors());
app.use((err, req, res) => {
  let { statusCode = 500, message } = err;
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Неверные данные';
  }
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
