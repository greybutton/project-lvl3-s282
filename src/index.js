import { isURL } from 'validator';
import axios from 'axios';

import { input, form, renderChannels } from './dom';
import parserRSS from './parsers';
import uiState from './ui';

import './index.scss';

const state = {
  inputValue: input.value,
  channelLinks: [],
  channels: [],
};

const handleInput = (e) => {
  const { value } = e.target;
  state.inputValue = value;

  switch (true) {
    case isURL(value) && state.channelLinks.includes(value):
      uiState.inputValidation = 'repeatlink';
      uiState.info = ['warning', 'This link is added.'];
      break;
    case isURL(value):
      uiState.inputValidation = 'valid';
      break;
    case value === '':
      uiState.inputValidation = '';
      break;
    default:
      uiState.inputValidation = 'invalid';
      break;
  }
};

const handlerSubmit = (e) => {
  e.preventDefault();
  const { inputValue: value } = state;
  if (value === '') {
    uiState.info = ['warning', 'Empty link.'];
    return;
  }
  const url = `https://cors-anywhere.herokuapp.com/${value}`;
  uiState.inputStatus = 'disabled';
  uiState.info = ['info', 'Loading...'];
  axios
    .get(url)
    .then((response) => {
      uiState.info = ['success', 'Success.'];
      uiState.inputStatus = 'enabled';
      uiState.inputClear = true;
      state.inputValue = '';
      const { data } = response;
      const { channel } = parserRSS(data);
      state.channels = [channel, ...state.channels];
      state.channelLinks = [...state.channelLinks, value];
      renderChannels(state.channels);
    })
    .catch((error) => {
      console.log(error);
      uiState.info = ['warning', 'Error. Try again.'];
      uiState.inputStatus = 'enabled';
    });
};

input.addEventListener('input', handleInput);
form.addEventListener('submit', handlerSubmit);
