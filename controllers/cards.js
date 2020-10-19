const Cards = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => {
      const newCards = cards.reverse();
      res.send(newCards);
    })
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные');
      }
      res.send(card);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Cards.findById(cardId)
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      const cardOwnerId = card.owner._id;
      if (toString(cardOwnerId) === toString(_id)) {
        Cards.findByIdAndRemove(cardId)
          .then((data) => {
            if (!data) {
              throw new NotFoundError('Такой карточки не существует');
            }
            res.send({ data });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      res.send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      res.send(card);
    })
    .catch(next);
};
