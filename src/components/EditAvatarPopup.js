import React from "react";
import PopupWithForm from "./PopupWithForm";
import useFormWithValidation from '../hooks/useForm';

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar, isLoading}) {

	const {values, handleChange, errors, isValid, resetForm} = useFormWithValidation();

	React.useEffect(() => {
		resetForm({avatar: ''},{},false);
	}, [isOpen, resetForm]);

	function handleSubmit(e) {
		e.preventDefault();
		onUpdateAvatar(values.avatar);
	}

	return (
		<PopupWithForm name={'avatar'}
									 title={'Обновить аватар'}
									 isOpen={isOpen}
									 onClose={onClose}
									 onSubmit={handleSubmit}
									 isLoading={isLoading}
									 isDisabled={!isValid}>
			<>
				<input name="avatar" className={`popup__input popup__avatar ${errors.avatar && 'popup__input_type_error'}`}
							 type="url"
							 placeholder="Ссылка на новый аватар"
							 required
							 onChange={handleChange}
							 value={values.avatar}/>
				<span
					className={`popup__input-error popup__avatar-error ${!isValid && 'popup__input-error_active'}`}>{errors.avatar || ''}</span>
			</>
		</PopupWithForm>
	)

}

export default EditAvatarPopup;