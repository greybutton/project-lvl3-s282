import 'bootstrap';
import { isURL } from 'validator';
import axios from 'axios';

import parseRSS from './parsers';
import state from './state';

import './index.scss';

const getProxedURL = url => `https://cors-anywhere.herokuapp.com/${url}`;

const handleInput = (e) => {
  const { value } = e.target;
  state.inputValue = value;

  switch (true) {
    case isURL(value) && state.channelLinks.includes(value):
      state.inputValidation = 'repeatlink';
      state.info = ['warning', 'This link is added.'];
      break;
    case isURL(value):
      state.inputValidation = 'valid';
      break;
    case value === '':
      state.inputValidation = '';
      break;
    default:
      state.inputValidation = 'invalid';
      break;
  }
};

const handlerSubmit = (e) => {
  e.preventDefault();
  const { inputValue: value } = state;
  if (value === '') {
    state.info = ['warning', 'Empty link.'];
    return;
  }
  const url = getProxedURL(value);
  state.inputStatus = 'disabled';
  state.info = ['info', 'Loading...'];
  axios
    .get(url)
    .then((response) => {
      state.info = ['success', 'Success.'];
      state.inputStatus = 'enabled';
      state.inputClear = true;
      state.inputValue = '';
      const { data } = response;
      const channel = parseRSS(data);
      state.channels = [channel, ...state.channels];
      state.channelLinks = [value, ...state.channelLinks];
    })
    .catch((error) => {
      console.log(error);
      state.info = ['warning', 'Error. Try again.'];
      state.inputStatus = 'enabled';
    });
};

const updateChannels = (channel, index) => {
  const channelNewPosts = channel.posts.filter(
    post => new Date(post.date) > new Date(state.updatedAt),
  );
  if (channelNewPosts.length === 0) {
    return;
  }
  const channelFromState = state.channels[index];
  const newChannel = channelFromState;
  newChannel.posts = [...channelNewPosts, ...channelFromState.posts];
  const start = state.channels.slice(0, index);
  const end = state.channels.slice(index + 1);
  const newChannels = [...start, newChannel, ...end];
  state.channels = newChannels;
};

const getChannel = (url, index) => axios
  .get(url)
  .then((response) => {
    const { data } = response;
    const channel = parseRSS(data);
    updateChannels(channel, index);
  })
  .catch(error => console.log(error));

const refresh = () => {
  if (state.channelLinks.length === 0) {
    window.setTimeout(refresh, 5000);
    return;
  }
  const urls = state.channelLinks.map(url => getProxedURL(url));
  const promise = urls.reduce(
    (acc, url, index) => acc.then(() => getChannel(url, index)),
    Promise.resolve(),
  );
  promise.finally(() => {
    state.updatedAt = new Date();
    window.setTimeout(refresh, 5000);
  });
};

export { refresh, handleInput, handlerSubmit };
