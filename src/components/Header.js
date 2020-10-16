import React from 'react';
import { Link, useLocation } from "react-router-dom";

function Header({ loggedIn, userData, onSignOut }) {

	const location = useLocation();

	return (
			<header className="header">
				{loggedIn ?
					<>
						<p className="header__email">{userData.email}</p>
						<button className="header__button" onClick={onSignOut}>Выход</button>
					</> :
					location.pathname === '/sign-in' ?
						<Link to="/sign-up"  className="header__link" >Регистрация</Link> :
						<Link to="/sign-in"  className="header__link" >Войти</Link>
				}
			</header>
	)
}

export default Header;