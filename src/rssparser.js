const parse = (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'application/xml');

  const errorNode = parsedData.querySelector('parsererror');
  if (errorNode) throw new Error('parseError');

  const channel = parsedData.querySelector('channel');
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;
  const feed = { title, description };

  const items = Array.from(parsedData.querySelectorAll('item'));

  const posts = items.map((item) => {
    const postLink = item.querySelector('link').textContent;
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    return {
      link: postLink,
      title: postTitle,
      description: postDescription,
    };
  });

  return { feed, posts };
};

export default parse;
