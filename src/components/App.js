import React, {useCallback} from 'react';
import {Route, Switch, Redirect, useHistory} from 'react-router-dom';
import api from '../utils/api';
import authApi from '../utils/authApi';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationDeleteCard from './ConfirmationDeleteCard';
import InfoTooltip from './InfoTooltip';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectefRoute';

function App() {

	const history = useHistory();

	const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
	const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
	const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
	const [isConfirmationDeleteCard, setIsConfirmationDeleteCard] = React.useState(false);
	const [isInfoTooltip, setInfoTooltip] = React.useState(false);

	const [selectedCard, setSelectedCard] = React.useState('');
	const [currentUser, setCurrentUser] = React.useState({});
	const [cards, setCards] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [currentCard, setCurrentCard] = React.useState(false);

	const [loggedIn, setloggedIn] = React.useState(false);
	const [userData, setUserData] = React.useState({});
	const [tooltipMessage, setTooltipMessage] = React.useState('');

	React.useEffect(() => {
		Promise.all([api.getInfo(), api.getInitialCards()])
			.then(([currentUser, cards]) => {
				setCurrentUser(currentUser);
				setCards(cards);
			})
			.catch((err) => {
				console.log(err);
			})
	}, []);

	React.useEffect(() => {
		api.getInfo()
			.then(currentUser => {
				setCurrentUser(currentUser);
			})
	}, [isEditProfilePopupOpen])

	React.useEffect(() => {

		function handleEscClose(event) {
			if (event.key === "Escape") {
				closeAllPopups();
			}
		}

		function closeByOverlay(event) {
			if (event.target.classList.contains('popup_active')) {
				closeAllPopups();
			}
		}

		document.addEventListener('mousedown', closeByOverlay);
		document.addEventListener('keydown', handleEscClose);
		return () => {
			document.removeEventListener('keydown', handleEscClose);
			document.removeEventListener('mousedown', closeByOverlay);
		}
	})

	function handleAuthorization( email, password) {
		authApi.authorize(password, email)
			.then((res) => {
				if (res) {
					setUserData({});
					handleLogin();
					setUserData({
						email: email
					})
					history.push('/');
				} else {
					setTooltipMessage('Такого пользователя не существует. Попробуйте снова.')
					setInfoTooltip(true);
				}
			})
			.catch((err) => {
					console.log(err);
				}
			)
	}

	function handleRegistration( email, password) {
		authApi.register(password, email)
			.then((res) => {
				if (res.data) {
					setTooltipMessage('Вы успешно зарегистрировались!');
					setInfoTooltip(true);
					history.push("/sign-in");
				} else {
					setTooltipMessage('Что-то пошло не так! Попробуйте ещё раз.');
					setInfoTooltip(true);
				}
			})
			.catch((err) => {
					console.log(err);
				}
			)
	}

	const tokenCheck = useCallback(() => {
		const jwt = localStorage.getItem('token');
		if (jwt) {
			authApi.getContent(jwt)
				.then((res) => {
					if (res) {
						setloggedIn(true);
						setUserData({
							email: res.data.email
						})
						history.push('/');
					}
				})
				.catch((err) => {
					setloggedIn(false);
					history.push('/sign-in');
					console.log(err);
				});
		}
	}, [history])


	React.useEffect(() => {
		tokenCheck();
	}, [tokenCheck])


	function handleLogin(e) {
		setloggedIn(true);
	}

	function handleCardClick(card) {
		setSelectedCard(card);
	}

	function handleDeleteClick(card) {
		setIsConfirmationDeleteCard(true);
		setCurrentCard(card);
	}

	function handleEditAvatarClick() {
		setIsEditAvatarPopupOpen(true);
	}

	function handleEditProfileClick() {
		setIsEditProfilePopupOpen(true);
	}

	function handleAddPlaceClick() {
		setIsAddPlacePopupOpen(true);
	}

	function closeAllPopups() {
		setIsEditProfilePopupOpen(false);
		setIsEditAvatarPopupOpen(false);
		setIsAddPlacePopupOpen(false);
		setIsConfirmationDeleteCard(false);
		setInfoTooltip(false);
		setSelectedCard('');
		setIsLoading(false);
	}

	function handleUpdateUser(inputObj) {
		setIsLoading(true);
		api.setInfo(inputObj.values)
			.then(newUserInfo => {
					setCurrentUser(newUserInfo);
					closeAllPopups();
				}
			)
	}

	function handleUpdateAvatar(link) {
		setIsLoading(true);
		api.setNewAvatar(link)
			.then(newUserInfo => {
					setCurrentUser(newUserInfo);
					closeAllPopups();
				}
			)
	}

	function handleCardLike(card) {
		const isLiked = card.likes.some(i => i._id === currentUser._id);
		api.changeLikeCardStatus(card._id, isLiked)
			.then((newCard) => {
				const newCards = cards.map((c) => c._id === card._id ? newCard : c);
				setCards(newCards);
			});
	}

	function handleDeleteCard(card) {
		setIsLoading(true);
		api.deleteCard(card._id)
			.then(() => {
				const newCards = cards.filter((c) => card._id !== c._id);
				setCards(newCards);
				closeAllPopups();
			});
	}

	function handleAddPlaceSubmit(namePlace, src) {
		setIsLoading(true);
		api.addNewCard(namePlace, src)
			.then(newCard => {
				if (newCard !== undefined) {
					setCards([newCard, ...cards]);
				}
				closeAllPopups();
			})
	}

	function signOut() {
		localStorage.removeItem('token');
		setloggedIn(false);
		setUserData({});
		history.push('/sign-in');
	}

	return (

		<CurrentUserContext.Provider value={currentUser}>
			<div className="root">


				<Header loggedIn={loggedIn} userData={userData} onSignOut={signOut}/>
				<Switch>
					<ProtectedRoute exact path="/"
													loggedIn={loggedIn}
													component={Main}
													onEditProfile={handleEditProfileClick}
													onAddPlace={handleAddPlaceClick}
													onEditAvatar={handleEditAvatarClick}
													onCardClick={handleCardClick}
													cards={cards}
													onCardLike={handleCardLike}
													onCardDelete={handleDeleteClick}
					/>
					<Route path="/sign-up">
						<Register onRegistration={handleRegistration} />
					</Route>
					<Route path="/sign-in">
						<Login onLogin={handleAuthorization} />
					</Route>
					<Route path="/">
						{loggedIn ? <Redirect to="/"/> : <Redirect to="/sign-in"/>}
					</Route>
				</Switch>
				< Footer/>


				<EditProfilePopup isOpen={isEditProfilePopupOpen}
													onClose={closeAllPopups}
													onUpdateUser={handleUpdateUser}
													isLoading={isLoading}
				/>

				<EditAvatarPopup isOpen={isEditAvatarPopupOpen}
												 onClose={closeAllPopups}
												 onUpdateAvatar={handleUpdateAvatar}
												 isLoading={isLoading}
				/>

				<AddPlacePopup isOpen={isAddPlacePopupOpen}
											 onClose={closeAllPopups}
											 onAddPlace={handleAddPlaceSubmit}
											 isLoading={isLoading}
				/>

				<ConfirmationDeleteCard isOpen={isConfirmationDeleteCard}
																onClose={closeAllPopups}
																onDelete={handleDeleteCard}
																isLoading={isLoading}
																currentCard={currentCard}
				/>

				<InfoTooltip isOpen={isInfoTooltip} onClose={closeAllPopups} tooltipMessage={tooltipMessage}/>

				<ImagePopup card={selectedCard}
										onClose={closeAllPopups}
				/>

			</div>
		</CurrentUserContext.Provider>
	)
}

export default App;