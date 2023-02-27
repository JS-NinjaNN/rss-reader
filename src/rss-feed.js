/* eslint no-param-reassign: ["error", { "props": true,
"ignorePropertyModificationsFor": ["state", "elements", "watchedState"] }] */

import './styles.scss';
import 'bootstrap';
import { setLocale, string } from 'yup';
import { uniqueId } from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';

import ru from './locales/ru.js';
import render from './view.js';
import parse from './rssparser.js';

const timeout = 5000;

// rss для тестирования
// https://lorem-rss.herokuapp.com/feed?unit=second&interval=5

// Валидатор
const validate = (url, links) => {
  const schema = string().trim().required().url()
    .notOneOf(links);
  return schema.validate(url);
};

// Запрос
const getAxiosResponse = (url) => {
  const allOriginsLink = 'https://allorigins.hexlet.app/get';
  const preparedURL = new URL(allOriginsLink);
  preparedURL.searchParams.set('disableCache', 'true');
  preparedURL.searchParams.set('url', url);
  return axios.get(preparedURL);
};

const addFeeds = (id, feed, link, state) => {
  state.content.feeds.push({ ...feed, id, link });
};

const addPosts = (feedId, posts, state) => {
  const preparedPosts = posts.map((post) => ({ ...post, feedId, id: uniqueId() }));
  state.content.posts = [...state.content.posts, ...preparedPosts];
};

const updatePosts = (state) => {
  const update = () => {
    state.content.feeds.forEach(({ link, id }) => {
      getAxiosResponse(link)
        .then((response) => {
          const { posts } = parse(response.data.contents);
          const alreadyAddedLinks = state.content.posts.map((post) => post.link);
          const newPosts = posts.filter((post) => !alreadyAddedLinks.includes(post.link));
          if (newPosts.length > 0) {
            addPosts(id, newPosts, state);
          }
        });
    });
    setTimeout(update, timeout);
  };
  update();
};

// Приложение
const app = () => {
  const i18nInstance = i18n.createInstance();
  // Инициализация
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then((translate) => {
    // Элементы
    const elements = {
      form: document.querySelector('.rss-form'),
      feedback: document.querySelector('.feedback'),
      input: document.querySelector('#url-input'),
      btn: document.querySelector('button[type="submit"]'),
      posts: document.querySelector('.posts'),
      feeds: document.querySelector('.feeds'),
      modal: {
        modalElement: document.querySelector('.modal'),
        title: document.querySelector('.modal-title'),
        body: document.querySelector('.modal-body'),
        btn: document.querySelector('.full-article'),
      },
    };

    setLocale({
      mixed: { notOneOf: 'alreadyAddedRSS' },
      string: { url: 'invalidUrl', required: 'mustNotBeEmpty' },
    });

    // Состояние
    const initialState = {
      process: {
        state: 'filling',
        error: null,
      },
      content: {
        feeds: [],
        posts: [],
      },
      uiState: {
        visitedLinksIds: new Set(),
        modalPostId: null,
      },
    };

    const watchedState = onChange(initialState, render(initialState, elements, translate));

    updatePosts(watchedState);

    elements.form.focus();
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(elements.form);
      const url = formData.get('url');
      const addedLinks = watchedState.content.feeds.map(({ link }) => link);

      validate(url, addedLinks)
        .then((link) => {
          watchedState.process.state = 'sending';
          return getAxiosResponse(link);
        })
        .then((response) => {
          const parsedData = parse(response.data.contents);
          const feedId = uniqueId();

          // watchedState.content.feeds.push({ ...feed, id, link });
          addFeeds(feedId, parsedData.feed, url, watchedState);
          addPosts(feedId, parsedData.posts, watchedState);
          watchedState.process.state = 'finished';
        })
        .catch((error) => {
          const errorMessage = error.message ?? 'defaultError';
          watchedState.process.error = errorMessage;
          watchedState.process.state = 'error';
        });
    });

    elements.modal.modalElement.addEventListener('show.bs.modal', (e) => {
      const postId = e.relatedTarget.getAttribute('data-id');
      watchedState.uiState.visitedLinksIds.add(postId);
      watchedState.uiState.modalPostId = postId;
    });

    elements.posts.addEventListener('click', (e) => {
      const postId = e.target.dataset.id;
      if (postId) {
        watchedState.uiState.visitedLinksIds.add(postId);
      }
    });
  });
};

export default app;
