import * as yup from 'yup';

yup.setLocale({
	mixed: { notOneOf: 'errors.alreadyAddedRSS' },
	string: { url: 'errors.invalidUrl' },
});

const buildSchema = (data) => yup.string().trim().required().url().notOneOf(data);

const validate = (url, data) => {
	const schema = buildSchema(data);
	return schema.validate(url);
};

export default validate;
