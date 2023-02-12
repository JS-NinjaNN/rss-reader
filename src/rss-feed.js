import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import ru from './locales/ru.js';
import validate from './validator.js';
import render from './view.js';
import parse from './rssparser.js';

// https://lorem-rss.herokuapp.com/feed?unit=second&interval=10

const defaultLanguage = 'ru';

const buildUrl = (url) =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

const createFeed = (data, i18nInstance, url) => {
  const parsedData = parse(data.data.contents);
  const errorNode = parsedData.querySelector('parsererror');
  if (errorNode) throw new Error(i18nInstance.t('errors.parseError'));

  const title = parsedData.querySelector('channel > title').textContent;
  const description = parsedData.querySelector(
    'channel > description'
  ).textContent;
  const feed = { title, description, id: _.uniqueId(), url };
  const posts = [...parsedData.querySelectorAll('item')].map((item) => {
    const postLink = item.querySelector('link').textContent;
    const postTitle = item.querySelector('title').textContent;
    return {
      link: postLink,
      title: postTitle,
      postId: _.uniqueId(),
      feedId: feed.id,
    };
  });
  return [feed, posts];
};

const updatePosts = (state, i18nInstance) => {
  if (state.feeds.length === 0) {
    setTimeout(() => {
      updatePosts(state, i18nInstance);
    }, 5000);
    return;
  }
  const feeds = state.feeds.map((feed) => feed);
  const promises = feeds.map((feed) => {
    return axios
      .get(buildUrl(feed.url))
      .then((response) => {
        const parsedData = parse(response.data.contents);
        const errorNode = parsedData.querySelector('parsererror');
        if (errorNode) throw new Error(i18nInstance.t('errors.parseError'));
        return parsedData;
      })
      .then((parsedData) => {
        const posts = [...parsedData.querySelectorAll('item')].map((item) => {
          const postLink = item.querySelector('link').textContent;
          const postTitle = item.querySelector('title').textContent;
          return {
            link: postLink,
            title: postTitle,
            postId: _.uniqueId(),
            feedId: feed.id,
          };
        });
        return posts;
      });
  });
  const promise = Promise.all(promises);
  promise
    .then((posts) => {
      state.posts = _.flattenDeep(posts);
    })
    .then(() =>
      setTimeout(() => {
        updatePosts(state, i18nInstance);
      }, 5000)
    )
    .catch((e) => {
      setTimeout(() => {
        updatePosts(state, i18nInstance);
      }, 5000);
      throw e;
    });
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

    validate(url, state)
      .then((result) => axios.get(buildUrl(result)))
      .then((response) => createFeed(response, i18nInstance, url))
      .then((createdFeed) => {
        state.form.errors = [];
        state.form.valid = true;
        const [feed, posts] = createdFeed;
        state.posts = [...state.posts, ...posts];
        watchedState.feeds = [...watchedState.feeds, feed];
      })
      .catch((error) => {
        console.log(error);
        state.form.valid = false;
        watchedState.form.errors = [i18nInstance.t(error.message)];
      });
  });
  updatePosts(watchedState, i18nInstance);
};

export default app;
