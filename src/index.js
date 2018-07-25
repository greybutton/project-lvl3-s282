import 'bootstrap';
import { isURL } from 'validator';
import axios from 'axios';

import { getInput, getForm } from './dom';
import parserRSS from './parsers';
import state from './state';

import './index.scss';

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
  const url = `https://cors-anywhere.herokuapp.com/${value}`;
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
      const channel = parserRSS(data);
      state.channels = [channel, ...state.channels];
      state.channelLinks = [value, ...state.channelLinks];
    })
    .catch((error) => {
      console.log(error);
      state.info = ['warning', 'Error. Try again.'];
      state.inputStatus = 'enabled';
    });
};

getInput().addEventListener('input', handleInput);
getForm().addEventListener('submit', handlerSubmit);
