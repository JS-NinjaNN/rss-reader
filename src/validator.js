import * as yup from 'yup';

yup.setLocale({
  mixed: { notOneOf: 'errors.alreadyAddedRSS' },
  string: { url: 'errors.invalidUrl', required: 'mustNotBeEmpty' },
});

const buildSchema = (data) => {
  const links = data.content.feeds.map(({ url }) => url);
  return yup.string().trim().required().url()
    .notOneOf(links);
};
const validate = (url, data) => buildSchema(data).validate(url);

export default validate;
