import React from 'react';
import {Link} from 'react-router-dom';

function Register({ onRegistration }) {

	const [userData, setUserData] = React.useState({});

	function handleChangeInput(e) {
		const {name, value} = e.target;
		setUserData({
			...userData,
			[name]: value
		});
	}

	function handleSubmit(e) {
		e.preventDefault();
		const email = userData.email
		const password = userData.password;
		onRegistration(email, password);
	}

	return (
		<main className="content">

			<section className="entrence">
				<form onSubmit={handleSubmit} className="entrence__form">
					<h1 className="entrence__title">Регистрация</h1>
					<input  required minLength="2" name="email" type="email" value={userData.email} onChange={handleChangeInput} className="entrence__input"
								 placeholder="Email"/>
					<input required minLength="2" name="password" type="password" value={userData.password} onChange={handleChangeInput}
								 className="entrence__input" placeholder="Пароль"/>
					<button onSubmit={handleSubmit} className="entrence__button">Регистрация</button>
					<p className="entrence__question">Уже зарегистрированы? <Link className="entrence__link"
																																				to="/sign-in"> Войти</Link></p>
				</form>
			</section>

		</main>
	)
}

export default Register;