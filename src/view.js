const renderError = (elements, value) => {
  const error = value[0];
  elements.urlInput.classList.add('is-invalid');
  elements.feedback.classList.add('text-danger');
  elements.feedback.replaceChildren(error);
};

const renderFeeds = (elements, state, i18nInstance) => {
  elements.urlInput.classList.remove('is-invalid');
  elements.form.reset();
  elements.feedback.replaceChildren(i18nInstance.t('success'));
  elements.feedback.classList.add('text-success');
  elements.feedback.classList.remove('text-danger');
  elements.urlInput.focus();

  const { feedsContainer } = elements;
  const { postsContainer } = elements;

  // reset
  feedsContainer.innerHTML = '';
  postsContainer.innerHTML = '';

  // feeds
  feedsContainer.innerHTML =
    '<div class="card border-0"><div class="card-body"><h2 class="card-title h4">Фиды</h2></div><ul class="list-group border-0 rounded-0"></ul></div>';
  const feedsListGroup = elements.feedsContainer.querySelector('.list-group');
  postsContainer.innerHTML =
    '<div class="card border-0"><div class="card-body"><h2 class="card-title h4">Посты</h2></div><ul class="list-group border-0 rounded-0"></ul></div>';
  const postsListGroup = elements.postsContainer.querySelector('.list-group');
  state.feeds.forEach((feed) => {
    const currentFeedId = feed.id;
    const [posts] = state.posts.filter(({ id }) => id === currentFeedId);
    posts.posts.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0'
      );
      li.innerHTML = `<a href="${post.link}" data-id="${post.postId}" class="fw-bold" target="_blank" rel="noopener noreferrer">${post.title}</a><button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
      postsListGroup.append(li);
    });

    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `<h3 class="h6 m-0">${feed.title}</h3>\n<p class="m-0 small text-black-50">${feed.description}</p>`;
    feedsListGroup.append(li);
  });
  // /feeds
};

const render = (state, elements, i18nInstance) => (path, value) => {
  switch (path) {
    case 'form.errors': {
      renderError(elements, value);
      break;
    }
    case 'feeds': {
      renderFeeds(elements, state, i18nInstance);
      break;
    }
    default:
      throw new Error('Unknown path!');
  }
};

export default render;
