import React from 'react';

function ImagePopup({card, onClose}) {
	return (
		<div className={`popup view-popup ${card && 'popup_active'}`}>
			<div className="popup__position">
				<figure className="popup__view">
					<img className="popup__img" alt={card.name} src={card.link}/>
					<figcaption className="popup__description">{card.name}</figcaption>
				</figure>
				<button type="button" className="popup__close" onClick={onClose}/>
			</div>
		</div>
	)
}

export default ImagePopup;