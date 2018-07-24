import { isURL } from 'validator';
import axios from 'axios';

import {
  input,
  form,
  renderInputUpdate,
  renderInputClear,
  renderChannels,
  renderAppInfo,
} from './dom';

import './index.scss';

const state = {
  inputValue: input.value,
  inputValidation: '',
  channelLinks: [],
  channels: [],
};

const handleInput = (e) => {
  const { value } = e.target;
  state.inputValue = value;
  if (isURL(value) && state.channelLinks.includes(value)) {
    state.inputValidation = 'repeatlink';
    renderAppInfo('warning', 'This link is added.');
  } else if (isURL(value)) {
    state.inputValidation = 'valid';
  } else {
    state.inputValidation = 'invalid';
  }
  renderInputUpdate(state);
};

const handlerSubmit = (e) => {
  e.preventDefault();
  const { inputValue: value } = state;
  const url = `https://cors-anywhere.herokuapp.com/${value}`;
  renderAppInfo('info', 'Loading...');
  axios
    .get(url)
    .then((response) => {
      renderAppInfo('success', 'Success.');
      renderInputClear();
      state.inputValue = '';
      const { data } = response;
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
      state.channels = [channel, ...state.channels];
      state.channelLinks = [...state.channelLinks, value];
      renderChannels(state.channels);
    })
    .catch((error) => {
      console.log(error);
      renderAppInfo('warning', 'Error. Try again.');
    });
};

input.addEventListener('input', handleInput);
form.addEventListener('submit', handlerSubmit);
