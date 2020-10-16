import React from 'react';
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from '../contexts/CurrentUserContext';
import useFormWithValidation from "../hooks/useForm";

function EditProfilePopup({isOpen, onClose, onUpdateUser, isLoading}) {

	const {values, handleChange, errors, isValid, resetForm} = useFormWithValidation();
	const currentUser = React.useContext(CurrentUserContext);

	React.useEffect(() => {
		if (currentUser) {
			resetForm(currentUser, {}, true)
		}
	}, [currentUser, resetForm]);

	function handleSubmit(e) {
		e.preventDefault();
		onUpdateUser({values});
	}

	return (
		<PopupWithForm name={'edit'}
									 title={'Редактировать профиль'}
									 isOpen={isOpen}
									 onClose={onClose}
									 onSubmit={handleSubmit}
									 isLoading={isLoading}
									 isDisabled={!isValid}>
			<>
				<input name="name"
							 className={`popup__input popup__name ${errors.name && 'popup__input_type_error'} `}
							 type="text"
							 required
							 minLength="2"
							 maxLength="40"
							 pattern="[A-Za-zА-Яа-яЁё\s\-]*"
							 placeholder="Имя пользователя"
							 onChange={handleChange}
							 value={values.name}
				/>
				<span
					className={`popup__input-error popup__name-error ${!isValid && 'popup__input-error_active'}`}>{errors.name || ''}</span>
				<input name="about"
							 className={`popup__input  popup__specialty ${errors.about && 'popup__input_type_error'}`}
							 type="text"
							 required
							 minLength="2"
							 maxLength="200"
							 placeholder="Информация о пользователе"
							 onChange={handleChange}
							 value={values.about}
				/>
				<span
					className={`popup__input-error popup__specialty-error ${!isValid && 'popup__input-error_active'}`}>{errors.about || ''}</span>
			</>
		</PopupWithForm>
	)
}

export default EditProfilePopup;