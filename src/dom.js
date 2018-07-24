const form = document.getElementById('rss-form');
const input = document.getElementById('rss-input');
const submit = document.getElementById('rss-submit');
const info = document.getElementById('rss-info');
const channelsContainer = document.getElementById('rss-channels');

// Input

const renderInputUpdate = (state) => {
  switch (state) {
    case 'invalid':
      info.innerHTML = '';
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      submit.disabled = true;
      break;
    case 'valid':
      info.innerHTML = '';
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      submit.disabled = false;
      break;
    case 'repeatlink':
    case '':
      input.classList.remove('is-invalid', 'is-valid');
      submit.disabled = true;
      break;
    default:
      break;
  }
};

const renderInputClear = () => {
  input.value = '';
  input.classList.remove('is-valid');
};

const renderInputDisable = () => {
  input.disabled = true;
  submit.disabled = true;
};

const renderInputEnable = () => {
  input.disabled = false;
  submit.disabled = false;
};

// Post

const renderPostTitle = (item) => {
  const titleContainer = document.createElement('a');
  titleContainer.setAttribute('href', item.link);
  titleContainer.setAttribute('target', '_blank');
  titleContainer.innerHTML = item.title;
  return titleContainer;
};

const renderPostDesctiption = (item) => {
  const descriptionContainer = document.createElement('div');
  descriptionContainer.innerHTML = item.description;
  return descriptionContainer;
};

const renderPost = (item) => {
  const postContainer = document.createElement('li');
  const title = renderPostTitle(item);
  const description = renderPostDesctiption(item);
  postContainer.classList.add('list-group-item');
  postContainer.append(title);
  postContainer.append(description);
  return postContainer;
};

// Channel

const renderChannelTitle = (item) => {
  const titleContainer = document.createElement('h5');
  titleContainer.classList.add('card-title');
  titleContainer.innerHTML = item.title;
  return titleContainer;
};

const renderChannelDesctiption = (item) => {
  const descriptionContainer = document.createElement('h6');
  descriptionContainer.classList.add('card-subtitle', 'mb-2', 'text-muted');
  descriptionContainer.innerHTML = item.description;
  return descriptionContainer;
};

const renderChannel = (item) => {
  const channelContainer = document.createElement('div');
  const channelHeader = document.createElement('div');
  const channelPosts = document.createElement('ul');

  const title = renderChannelTitle(item);
  const description = renderChannelDesctiption(item);
  const posts = [...item.posts].map(renderPost);
  posts.map(post => channelPosts.append(post));

  channelContainer.classList.add('card');
  channelHeader.classList.add('card-header');
  channelPosts.classList.add('list-group', 'list-group-flush');

  channelHeader.append(title);
  channelHeader.append(description);
  channelContainer.append(channelHeader);
  channelContainer.append(channelPosts);

  return channelContainer;
};

const renderChannels = (channels) => {
  channelsContainer.innerHTML = '';
  channels.map(renderChannel).map(channel => channelsContainer.append(channel));
};

// App

const createInfo = (status, text) => {
  const div = document.createElement('div');
  div.classList.add('alert', `alert-${status}`);
  div.textContent = text;
  return div;
};

const renderAppInfo = ([status, text]) => {
  info.innerHTML = '';
  const elem = createInfo(status, text);
  info.append(elem);
};

export {
  input,
  form,
  renderInputUpdate,
  renderInputClear,
  renderInputDisable,
  renderInputEnable,
  renderChannels,
  renderAppInfo,
};
