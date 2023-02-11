import onChange from 'on-change';
import render from './view.js';
import i18n from 'i18next';
import ru from './locales/ru.js';
import validate from './validator.js';

const defaultLanguage = 'ru';

const app = (initialState = {}) => {
	const elements = {
		form: document.querySelector('.rss-form'),
		feedback: document.querySelector('.feedback'),
		urlInput: document.querySelector('#url-input'),
	};

	const state = {
		lng: defaultLanguage,
		form: {
			valid: true,
			errors: [],
		},
		currentFeeds: [],
		...initialState,
	};

	const i18nInstance = i18n.createInstance();
	i18nInstance.init({
		lng: state.lng,
		debug: false,
		resources: {
			ru,
		},
	});

	elements.form.focus();

	const watchedState = onChange(state, render(state, elements));

	elements.form.addEventListener('submit', (e) => {
		e.preventDefault();
		const formData = new FormData(elements.form);
		const url = formData.get('url');

		validate(url, state.currentFeeds)
			.then((url) => {
				state.form.errors = [];
				state.form.valid = true;
				watchedState.currentFeeds = [...watchedState.currentFeeds, url];
			})
			.catch((error) => {
				console.log(error.message);
				state.form.valid = false;
				watchedState.form.errors = [i18nInstance.t(error.message)];
			});
	});
};

export default app;
