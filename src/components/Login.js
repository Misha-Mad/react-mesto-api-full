import React from 'react';
import {Link} from 'react-router-dom';

function Login({ onLogin }) {

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
		const email = userData.email;
		const password = userData.password;
		if (!email || !password) {
			return;
		}
		onLogin(email, password);
	}

	return (
		<main className="content">

			<section className="entrence">

				<form onSubmit={handleSubmit} className="entrence__form">
					<h1 className="entrence__title">Вход</h1>
					<input required minLength="2" name="email" type="email" value={userData.email} onChange={handleChangeInput} className="entrence__input"
								 placeholder="Email"/>
					<input required minLength="2" name="password" type="password" value={userData.password} onChange={handleChangeInput}
								 className="entrence__input" placeholder="Пароль"/>
					<button onSubmit={handleSubmit} className="entrence__button">Войти</button>
					<p className="entrence__question">Ещё не зарегистрированы? <Link className="entrence__link"
																																					 to="/sign-up">Регистрация</Link></p>
				</form>

			</section>

		</main>
	)

}

export default Login;