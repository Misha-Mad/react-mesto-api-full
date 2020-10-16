const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(limiter);
app.use((req, res, next) => {
  req.user = {
    _id: '5f671ccd51298438e092f2ef',
  };
  next();
});
app.use(express.json());
app.use(usersRouter);
app.use(cardsRouter);
app.get('/*', (req, res) => {
  res.status(404).send(JSON.stringify({ message: 'Запрашиваемый ресурс не найден' }));
});

app.listen(PORT);
