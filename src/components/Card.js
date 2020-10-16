import React from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Card({card, onClick, onCardLike, onCardDelete}) {

	const currentUser = React.useContext(CurrentUserContext);
	const isOwn = card.owner._id === currentUser._id;
	const cardDeleteButtonClassName = (
		`card__del ${isOwn ? '' : 'card__del_hidden'}`
	);
	const isLiked = card.likes.some(i => i._id === currentUser._id);
	const cardLikeButtonClassName = `card__like ${isLiked ? 'card__like_pressed' : ''}`;

	function handleClick() {
		onClick(card);
	}

	function handleLikeClick() {
		onCardLike(card);
	}

	function handleDeleteClick () {
		onCardDelete(card)
	}

	return (
		<div className="card__container">
			<img alt={card.name} className="card__image" src={card.link} onClick={handleClick}/>
			<div className="card__description">
				<h2 className="card__name">{card.name}</h2>
				<div className="card__like-section">
					<button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}/>
					<span className="card__counter">{card.likes.length}</span>
				</div>
			</div>
			<button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}/>
		</div>
	)
}

export default Card;