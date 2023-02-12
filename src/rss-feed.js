import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import ru from './locales/ru.js';
import validate from './validator.js';
import render from './view.js';
import parse from './rssparser.js';

const defaultLanguage = 'ru';

const buildUrl = (url) =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

const createFeed = (data, i18nInstance) => {
  const parsedData = parse(data.data.contents);
  const errorNode = parsedData.querySelector('parsererror');
  if (errorNode) throw new Error(i18nInstance.t('errors.parseError'));

  const title = parsedData.querySelector('channel > title').textContent;
  const description = parsedData.querySelector(
    'channel > description'
  ).textContent;
  const feed = { title, description, id: _.uniqueId() };
  const items = [...parsedData.querySelectorAll('item')].map((item) => {
    const postLink = item.querySelector('link').textContent;
    const postTitle = item.querySelector('title').textContent;
    return { link: postLink, title: postTitle, postId: _.uniqueId() };
  });
  const posts = { id: feed.id, posts: items };
  const { url } = data.data.status;
  return [feed, posts, url];
};

const app = (initialState = {}) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    urlInput: document.querySelector('#url-input'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  };

  const state = {
    lng: defaultLanguage,
    form: {
      valid: true,
      errors: [],
    },
    feedsLinks: [],
    feeds: [],
    posts: [],
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

  const watchedState = onChange(state, render(state, elements, i18nInstance));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const url = formData.get('url');

    validate(url, state.feedsLinks)
      .then((result) => axios.get(buildUrl(result)))
      .then((response) => createFeed(response, i18nInstance))
      .then((createdFeed) => {
        state.form.errors = [];
        state.form.valid = true;
        const [feed, posts, link] = createdFeed;
        state.posts = [...state.posts, posts];
        state.feedsLinks = [...state.feeds, link];
        watchedState.feeds = [...watchedState.feeds, feed];
      })
      .catch((error) => {
        state.form.valid = false;
        watchedState.form.errors = [i18nInstance.t(error.message)];
      });
  });
};

export default app;
