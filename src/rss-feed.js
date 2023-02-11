import * as yup from 'yup';
import onChange from 'on-change';
import render from './view.js';

const app = () => {
	const elements = {
		form: document.querySelector('.rss-form'),
		feedback: document.querySelector('.feedback'),
		urlInput: document.querySelector('#url-input'),
	};
	const state = {
		form: {
			valid: true,
			errors: [],
		},
		currentFeeds: [],
	};

	elements.form.focus();

	const watchedState = onChange(state, render(state, elements));

	elements.form.addEventListener('submit', (e) => {
		e.preventDefault();
		const formData = new FormData(elements.form);
		const url = formData.get('url');
		const schema = yup
			.string()
			.trim()
			.required()
			.url('Ссылка должна быть валидным URL')
			.notOneOf(state.currentFeeds, 'RSS уже существует');

		schema
			.validate(url)
			.then((url) => {
				state.form.errors = [];
				state.form.valid = true;
				watchedState.currentFeeds = [...watchedState.currentFeeds, url];
			})
			.catch((error) => {
				state.form.valid = false;
				watchedState.form.errors = [error];
			});
	});
};

export default app;
