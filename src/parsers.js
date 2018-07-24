const parserRSS = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const [channelNode] = doc.getElementsByTagName('channel');
  const [channelTitle] = channelNode.getElementsByTagName('title');
  const [channelDescription] = channelNode.getElementsByTagName('description');
  const posts = [...channelNode.getElementsByTagName('item')].map((post) => {
    const [postTitle] = post.getElementsByTagName('title');
    const [postLink] = post.getElementsByTagName('link');
    const [postDescription] = post.getElementsByTagName('description');
    return {
      title: postTitle.textContent,
      link: postLink.textContent,
      description: postDescription.textContent,
    };
  });
  const channel = {
    title: channelTitle.textContent,
    description: channelDescription.textContent,
    posts,
  };
  return { channel };
};

export default parserRSS;
