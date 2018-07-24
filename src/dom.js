const form = document.getElementById('rss-form');
const input = document.getElementById('rss-input');
const submit = document.getElementById('rss-submit');
const info = document.getElementById('rss-info');
const channelsContainer = document.getElementById('rss-channels');

// Input

const renderInputUpdate = (state) => {
  switch (state.inputValidation) {
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

// Post

const renderPostTitle = (item) => {
  const titleContainer = document.createElement('a');
  titleContainer.classList.add('post__title');
  titleContainer.setAttribute('href', item.link);
  titleContainer.setAttribute('target', '_blank');
  titleContainer.innerHTML = item.title;
  return titleContainer;
};

const renderPostDesctiption = (item) => {
  const descriptionContainer = document.createElement('div');
  descriptionContainer.classList.add('post__description');
  descriptionContainer.innerHTML = item.description;
  return descriptionContainer;
};

const renderPost = (item) => {
  const postContainer = document.createElement('div');
  postContainer.classList.add('post');
  const title = renderPostTitle(item);
  const description = renderPostDesctiption(item);
  postContainer.append(title);
  postContainer.append(description);
  return postContainer;
};

// Channel

const renderChannelTitle = (item) => {
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('channel__title');
  titleContainer.innerHTML = item.title;
  return titleContainer;
};

const renderChannelDesctiption = (item) => {
  const descriptionContainer = document.createElement('div');
  descriptionContainer.classList.add('channel__description');
  descriptionContainer.innerHTML = item.description;
  return descriptionContainer;
};

const renderChannel = (item) => {
  const channelContainer = document.createElement('div');
  channelContainer.classList.add('channel');
  const title = renderChannelTitle(item);
  const description = renderChannelDesctiption(item);
  channelContainer.append(title);
  channelContainer.append(description);
  const posts = [...item.posts].map(renderPost);
  posts.map(post => channelContainer.append(post));
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

const renderAppInfo = (status, text) => {
  info.innerHTML = '';
  const elem = createInfo(status, text);
  info.append(elem);
};

export {
  input, form, renderInputUpdate, renderInputClear, renderChannels, renderAppInfo,
};
