import React, {useEffect} from "react";
import PopupWithForm from "./PopupWithForm";
import useFormWithValidation from '../hooks/useForm';

function AddPlacePopup({isOpen, onClose, onAddPlace, isLoading}) {

	const {values, handleChange, errors, isValid, resetForm} = useFormWithValidation()

	useEffect(() => {
		resetForm({nameplace: '', src: ''},{},false);
	}, [isOpen, resetForm])

	function handleSubmit(e) {
		e.preventDefault();
		onAddPlace(values.nameplace, values.src);
	}

	return (
		<PopupWithForm name={'add'}
									 title={'Новое место'}
									 isOpen={isOpen}
									 onClose={onClose}
									 onSubmit={handleSubmit}
									 textButton={'Создать'}
									 isLoading={isLoading}
									 isDisabled={!isValid}>
			<>
				<input name="nameplace"
							 className={`popup__input popup__name-place ${errors.nameplace && 'popup__input_type_error'}`}
							 type="text"
							 placeholder="Название"
							 required
							 minLength="1"
							 maxLength="30"
							 onChange={handleChange}
							 value={values.nameplace || ''}/>
				<span
					className={`popup__input-error popup__nameplace-error  ${!isValid && 'popup__input-error_active'}`}>
					{ errors.nameplace || '' }
				</span>
				<input name="src"
							 className={`popup__input popup__src ${errors.src && 'popup__input_type_error'}`}
							 type="url"
							 placeholder="Ссылка на картинку"
							 required
							 onChange={handleChange}
							 value={values.src || ''}/>
				<span className={`popup__input-error popup__src-error ${!isValid && 'popup__input-error_active'}`}>
					{errors.src || ''}
				</span>
			</>
		</PopupWithForm>
	)
}

export default AddPlacePopup;