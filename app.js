require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT);

app.use(cors());
app.use(limiter);
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(usersRouter);
app.use(cardsRouter);
app.get('/*', (req, res) => {
  res.status(404).send(JSON.stringify({ message: 'Запрашиваемый ресурс не найден' }));
});
