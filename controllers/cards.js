const Cards = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Cards.find({}).sort({ createdAt: -1 })
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Cards.findById(cardId)
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      const { _id: cardOwnerId } = card.owner;
      if (`${cardOwnerId}` === userId) {
        Cards.findByIdAndRemove(cardId)
          .then((data) => {
            if (!data) {
              throw new NotFoundError('Такой карточки не существует');
            }
            res.send({ data });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Недостаточно прав');
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
