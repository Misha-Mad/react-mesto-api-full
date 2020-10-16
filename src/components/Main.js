import React from 'react';
import Card from './Card.js';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Main({onEditAvatar, onEditProfile, onAddPlace, onCardClick, cards, onCardLike, onCardDelete}) {

	const currentUser = React.useContext(CurrentUserContext);

	return (
		<main className="content">

			<section className="profile content__profile">
				<div className="profile__avatar-container" onClick={onEditAvatar}>
					<img className="profile__avatar" alt="Аватар профиля" src={currentUser.avatar}/>
				</div>
				<div className="profile__text">
					<div className="profile__name-edit">
						<h1 className="profile__name">{currentUser.name}</h1>
						<button type="button" className="profile__edit" onClick={onEditProfile}/>
					</div>
					<p className="profile__specialty">{currentUser.about}</p>
				</div>
				<button type="button" className="profile__add" onClick={onAddPlace}/>
			</section>

			<section className="photo-grid">
				{cards.map((card) => (
					<Card key={card._id} card={card} onClick={onCardClick} onCardLike={onCardLike}
								onCardDelete={onCardDelete}/>
				))}
			</section>

		</main>
	)
}

export default Main;