import React from 'react';

function PopupWithForm({name, isOpen, title, children, onClose, textButton= 'Сохранить', onSubmit, isLoading, isDisabled = false}) {

	function renderLoadTextButton(textButton) {
		switch(textButton) {
			case 'Создать':
				return 'Создание...';
			case 'Сохранить' :
				return 'Сохранение...';
			case 'Подтвердить' :
				return 'Удаление...';
		}
	}

	return (
		<div className={`popup ${name}-popup ${isOpen && 'popup_active'}`}>
			<form noValidate className={`popup__container ${name === 'avatar' && 'popup__container_size_avatar'} ${name === 'del' && 'popup__container_size_delete'}`}
						name={`${name}`} onSubmit={onSubmit} >
				<h2 className="popup__title popup__title_position">{title}</h2>
				{children}
				<button disabled={isDisabled} type="submit" className={`popup__save ${isDisabled && 'popup__save_inactive'}`}>
					{isLoading ? renderLoadTextButton(textButton) : textButton}
				</button>
				<button type="button" className="popup__close" onClick={onClose}/>
			</form>
		</div>
	)
}

export default PopupWithForm;