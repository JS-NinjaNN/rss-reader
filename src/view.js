/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["state", "elements"] }] */

// Блокировщик кнопки на время http запроса
const switchBlockButton = (disable = false) => {
  const submitButton = document.querySelector('[aria-label="add"]');
  submitButton.disabled = disable;
};

// Отрисовщик ошибки
const renderError = (elements, state) => {
  const [error] = state.form.error;
  elements.urlInput.classList.add('is-invalid');
  elements.feedback.classList.add('text-danger');
  elements.feedback.innerHTML = error;
};

// Отрисовщик списка отслеживаемых фидов
const renderFeeds = (elements, state, i18nInstance) => {
  // очистка формы
  elements.urlInput.classList.remove('is-invalid');
  elements.feedback.replaceChildren(i18nInstance.t('success'));
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.urlInput.focus();
  elements.form.reset();

  const { feedsContainer } = elements;
  feedsContainer.innerHTML = '';

  feedsContainer.innerHTML =
    '<div class="card border-0"><div class="card-body"><h2 class="card-title h4">Фиды</h2></div><ul class="list-group border-0 rounded-0"></ul></div>';
  const feedsListGroup = feedsContainer.querySelector('.list-group');
  state.content.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `<h3 class="h6 m-0">${feed.title}</h3>\n<p class="m-0 small text-black-50">${feed.description}</p>`;
    feedsListGroup.append(li);
  });
};

// Отрисовщик списка постов
const renderPosts = (elements, state, i18nInstance) => {
  const { postsContainer } = elements;
  postsContainer.innerHTML = '';

  postsContainer.innerHTML =
    '<div class="card border-0"><div class="card-body"><h2 class="card-title h4">Посты</h2></div><ul class="list-group border-0 rounded-0"></ul></div>';
  const postsListGroup = postsContainer.querySelector('.list-group');
  state.content.feeds.forEach((feed) => {
    const currentFeedId = feed.id;
    const posts = state.content.posts.filter(
      ({ feedId }) => feedId === currentFeedId
    );
    posts.forEach((post) => {
      const li = document.createElement('li');

      li.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0'
      );

      li.innerHTML = `<a href="${post.link}" data-id="${
        post.postId
      }" target="_blank" rel="noopener noreferrer">${
        post.title
      }</a><button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal">${i18nInstance.t(
        'elements.view'
      )}</button>`;
      const link = li.querySelector('a');
      const classesToAdd = state.uiState.modal.visitedLinks.includes(post.link)
        ? ['fw-normal', 'link-secondary']
        : ['fw-bold'];
      link.classList.add(...classesToAdd);

      postsListGroup.append(li);

      const button = li.querySelector('[data-bs-toggle="modal"]');

      button.addEventListener('click', () => {
        elements.modalTitle.textContent = post.title;
        elements.modalDescription.textContent = post.description;
        elements.modalLink.setAttribute('href', post.link);
        state.uiState.modal.visitedLinks = [
          ...state.uiState.modal.visitedLinks,
          post.link,
        ];
        state.form.process = 'renderPosts';
      });
    });
  });
};

// Рендер
const render = (state, elements, i18nInstance) => {
  switch (state.form.process) {
    case 'error': {
      switchBlockButton();
      renderError(elements, state);
      break;
    }
    case 'sending': {
      switchBlockButton(true);
      break;
    }
    case 'render': {
      switchBlockButton();
      renderFeeds(elements, state, i18nInstance);
      renderPosts(elements, state, i18nInstance);
      break;
    }
    case 'renderPosts': {
      renderPosts(elements, state, i18nInstance);
      break;
    }
    default:
      break;
  }
};

export default render;
