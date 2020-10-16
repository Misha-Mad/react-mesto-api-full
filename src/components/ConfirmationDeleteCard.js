import React from "react";
import PopupWithForm from "./PopupWithForm";

function ConfirmationDeleteCard({isOpen, onClose, onDelete,  isLoading, currentCard}) {

	function handleSubmit(e) {
		e.preventDefault();
		onDelete(currentCard)
	}

	return (
		<PopupWithForm name={'del'}
									 title={'Вы уверены?'}
									 isOpen={isOpen}
									 onClose={onClose}
									 onSubmit={handleSubmit}
									 textButton={'Подтвердить'}
									 isLoading={isLoading}>
		</PopupWithForm>
	)
}

export default ConfirmationDeleteCard;