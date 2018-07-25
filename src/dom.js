import $ from 'jquery';

const getForm = () => document.getElementById('rss-form');
const getInput = () => document.getElementById('rss-input');
const getSubmit = () => document.getElementById('rss-submit');
const getInfoContainer = () => document.getElementById('rss-info');
const getChannelsContainer = () => document.getElementById('rss-channels');
const getPostModalContainer = () => document.getElementById('rss-post-modal');
const getViewButtons = () => document.querySelectorAll('button[data-toggle="modal"');

const form = getForm();
const input = getInput();
const submit = getSubmit();
const infoContainer = getInfoContainer();
const channelsContainer = getChannelsContainer();
const postModalContainer = getPostModalContainer();

// Input

const renderInputUpdate = (state) => {
  switch (state) {
    case 'invalid':
      infoContainer.innerHTML = '';
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      submit.disabled = true;
      break;
    case 'valid':
      infoContainer.innerHTML = '';
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

const renderPostViewButton = (item) => {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('data-toggle', 'modal');
  button.setAttribute('data-title', item.title);
  button.setAttribute('data-description', item.description);
  button.classList.add('btn', 'btn-info');
  button.innerHTML = 'View';
  return button;
};

const renderPostModal = (item) => {
  postModalContainer.innerHTML = '';
  const modal = `
    <div class="modal fade" id="postModal" tabindex="-1" role="dialog" aria-labelledby="postModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="postModalLabel">${item.title}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ${item.description}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  postModalContainer.innerHTML = modal;
  $('#postModal').modal();
};

const renderPost = (item) => {
  const postContainer = document.createElement('li');
  const postHeader = document.createElement('div');
  const title = renderPostTitle(item);
  const description = renderPostDesctiption(item);
  const viewButton = renderPostViewButton(item);
  postContainer.classList.add('list-group-item');
  postHeader.classList.add('d-flex', 'justify-content-between');
  postHeader.append(title);
  postHeader.append(viewButton);
  postContainer.append(postHeader);
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

const addButtonsHandler = (handler) => {
  const viewButtons = getViewButtons();
  viewButtons.forEach(button => button.addEventListener('click', handler));
};

const renderChannels = (channels, handler) => {
  channelsContainer.innerHTML = '';
  channels.map(renderChannel).map(channel => channelsContainer.append(channel));
  addButtonsHandler(handler);
};

// App

const createInfo = (status, text) => {
  const div = document.createElement('div');
  div.classList.add('alert', `alert-${status}`);
  div.textContent = text;
  return div;
};

const renderAppInfo = ([status, text]) => {
  infoContainer.innerHTML = '';
  const elem = createInfo(status, text);
  infoContainer.append(elem);
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
  renderPostModal,
};
