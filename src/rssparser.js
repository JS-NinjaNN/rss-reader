const parse = (data) => {
  const parser = new DOMParser();
  const result = parser.parseFromString(data, 'application/xml');
  return result;
};

export default parse;
