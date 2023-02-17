/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["state", "elements", "watchedState"] }] */

import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import ru from './locales/ru.js';
import validate from './validator.js';
import render from './view.js';
import parse from './rssparser.js';

// https://lorem-rss.herokuapp.com/feed?unit=second&interval=5

// Строитель url
const buildUrl = (url) => {
  const newUrl = new URL(url);
  return `https://allorigins.hexlet.app/get?disableCache=true&url=
  ${encodeURIComponent(newUrl)}`;
};

// Строитель фидов и постов
const createContent = (data, url) => {
  const parsedData = parse(data.data.contents);
  const errorNode = parsedData.querySelector('parsererror');
  if (errorNode) throw new Error('errors.parseError');

  const title = parsedData.querySelector('channel > title').textContent;
  const description = parsedData.querySelector(
    'channel > description'
  ).textContent;
  const feed = { title, description, id: _.uniqueId(), url };
  const posts = [...parsedData.querySelectorAll('item')].map((item) => {
    const postLink = item.querySelector('link').textContent;
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    return {
      link: postLink,
      title: postTitle,
      description: postDescription,
      postId: _.uniqueId(),
      feedId: feed.id,
    };
  });
  return [feed, posts];
};

// Обновляем список постов каждые 5 секунд
const updatePosts = (state) => {
  if (state.content.feeds.length === 0) {
    setTimeout(() => {
      updatePosts(state);
    }, 5000);
    return;
  }

  const promises = state.content.feeds.map((feed) =>
    axios
      .get(buildUrl(feed.url))
      .then((response) => {
        const parsedData = parse(response.data.contents);
        const errorNode = parsedData.querySelector('parsererror');
        if (errorNode) throw new Error('errors.parseError');
        return parsedData;
      })
      .then((parsedData) =>
        [...parsedData.querySelectorAll('item')].map((item) => {
          const postTitle = item.querySelector('title').textContent;
          const postLink = item.querySelector('link').textContent;
          const postDescription = item.querySelector('description').textContent;
          return {
            link: postLink,
            title: postTitle,
            description: postDescription,
            postId: _.uniqueId(),
            feedId: feed.id,
          };
        })
      )
  );

  const promise = Promise.all(promises);
  promise
    .then((posts) => {
      state.content.posts = _.flattenDeep(posts);
      state.form.process = 'renderPosts';
    })
    .then(() => {
      setTimeout(() => {
        updatePosts(state);
      }, 5000);
    })
    .catch((e) => {
      setTimeout(() => {
        updatePosts(state);
      }, 5000);
      throw e;
    });
};

// Приложение
const app = (initialState = {}) => {
  // Элементы
  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    urlInput: document.querySelector('#url-input'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescription: document.querySelector('.text-break'),
    modalLink: document.querySelector('.full-article'),
  };

  // Состояние
  const state = {
    form: {
      process: '',
      error: [],
    },
    content: {
      feeds: [],
      posts: [],
    },
    uiState: {
      modal: {
        visitedLinks: [],
      },
    },
    ...initialState,
  };

  // Инициализация i18n
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  // Создание watchedState
  const watchedState = onChange(state, () => {
    render(watchedState, elements, i18nInstance);
  });

  // Обработчик на форму
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const url = formData.get('url');

    validate(url, state)
      .then((result) => {
        watchedState.form.process = 'sending';
        return result;
      })
      .then((link) => axios.get(buildUrl(link)))
      .then((response) => createContent(response, url))
      .then((createdFeed) => {
        watchedState.form.error = [];
        const [feed, posts] = createdFeed;
        const newContent = {
          posts: [...watchedState.content.posts, ...posts],
          feeds: [...watchedState.content.feeds, feed],
        };
        watchedState.content = { ...watchedState.content, ...newContent };
        watchedState.form.process = 'render';
      })
      .catch((error) => {
        const errorMessage =
          error.message === 'Network Error'
            ? 'errors.networkError'
            : error.message;
        const newForm = {
          process: 'error',
          error: [i18nInstance.t(errorMessage)],
        };
        watchedState.form = newForm;
      });
  });

  // Фокус на форме и запуск обновления списка постов
  elements.form.focus();
  updatePosts(watchedState);
};

export default app;
