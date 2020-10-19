const jwt = require('jsonwebtoken');
const RegAuthError = require('../errors/reg-auth-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new RegAuthError('Ошибка авторизации, неверный заголовок');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // eslint-disable-next-line no-undef
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
