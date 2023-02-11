const renderError = (elements, value) => {
	const error = value[0].message;
	elements.urlInput.classList.add('is-invalid');
	elements.feedback.textContent = error;
};

const render = (state, elements) => (path, value, prevValue) => {
	switch (path) {
		case 'form.errors': {
			renderError(elements, value);
			break;
		}
		case 'currentFeeds': {
			elements.urlInput.classList.remove('is-invalid');
			elements.form.reset();
			elements.feedback.textContent = '';
			elements.urlInput.focus();
			break;
		}
	}
};

export default render;
