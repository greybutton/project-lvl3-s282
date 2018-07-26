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

const refresh = () => {
  if (state.channelLinks.length === 0) {
    window.setTimeout(refresh, 5000);
    return;
  }
  const channelsUrls = state.channelLinks.map(url => axios.get(getProxedURL(url)));
  axios
    .all(channelsUrls)
    .then((responses) => {
      const channels = responses.map(({ data }) => {
        const channel = parseRSS(data);
        return channel;
      });
      return channels;
    })
    .then((channels) => {
      const newChannels = channels.reduce((acc, channel, index) => {
        if (channel.posts.length > 0) {
          const { channels: channelsFromState } = state;
          const channelFromState = channelsFromState[index];
          const channelNewPosts = channel.posts.filter(
            post => new Date(post.date) > new Date(state.updatedAt),
          );
          const newChannel = channel;
          newChannel.posts = [...channelNewPosts, ...channelFromState.posts];
          const start = acc.slice(0, index);
          const end = acc.slice(index + 1);
          const newAcc = [...start, newChannel, ...end];
          return newAcc;
        }
        return acc;
      }, state.channels);
      return newChannels;
    })
    .then((newChannels) => {
      state.channels = newChannels;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      state.updatedAt = new Date();
      window.setTimeout(refresh, 5000);
    });
};

export { refresh, handleInput, handlerSubmit };
