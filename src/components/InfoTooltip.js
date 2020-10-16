import React from "react";

function InfoTooltip({isOpen, onClose, tooltipMessage}) {

	return (
		<div className={`popup info-popup ${isOpen && 'popup_active'}`}>
			<form noValidate className={`popup__container  popup__container_type_info`}
						name={'info'} >
				<div className={`popup__info ${tooltipMessage === 'Вы успешно зарегистрировались!' && 'popup__info_access'}`}/>
				<h2 className='popup__title popup__title_tooltip'>{tooltipMessage}</h2>
				<button type="button" className="popup__close" onClick={onClose}/>
			</form>
		</div>
	)
}

export default InfoTooltip;