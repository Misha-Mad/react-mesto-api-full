import {configAuthApi} from './utils';

class AuthApi {
	constructor({
								baseUrl
							}) {
		this._baseUrl = baseUrl;
	}

	register(password, email) {
		return fetch(`${this._baseUrl}/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				password: password,
				email: email
			})
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
				return Promise.reject(`Ошибка: ${res.status}`);
			})
			.then((res) => {
				return res;
			})
	};

	authorize(password, email) {
		return fetch(`${this._baseUrl}/signin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				password: password,
				email: email
			})
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
				return Promise.reject(`Ошибка: ${res.status}`);
			})
			.then((data) => {
				if (data) {
					localStorage.setItem('token', data.token);
					return data;
				}
			})
	}

	getContent() {
		return fetch(`${this._baseUrl}/users/me`, {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(res => {
				if (res.ok) {
					return res.json();
				}
				return Promise.reject(`Ошибка: ${res.status}`);
			})
	}

}

const authApi = new AuthApi(configAuthApi);
export default authApi;
