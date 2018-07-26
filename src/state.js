import WatchJS from 'melanke-watchjs';

import {
  getInput,
  renderInputUpdate,
  renderInputClear,
  renderInputDisable,
  renderInputEnable,
  renderAppInfo,
  renderPostModal,
  renderChannels,
  addButtonsHandler,
} from './dom';

const state = {
  inputValue: getInput().value,
  channelLinks: [],
  channels: [],
  updatedAt: new Date(),
  info: ['', ''],
  inputValidation: '',
  inputStatus: null,
  inputClear: null,
  postModal: null,
};

const { watch } = WatchJS;

const handleClickViewButton = (e) => {
  const { target } = e;
  const { title, description } = target.dataset;
  const post = {
    title,
    description,
  };
  state.postModal = post;
};

watch(state, 'channels', () => {
  renderChannels(state.channels);
  addButtonsHandler(handleClickViewButton);
});

watch(state, 'info', () => {
  renderAppInfo(state.info);
});

watch(state, 'inputValidation', () => {
  renderInputUpdate(state.inputValidation);
});

watch(state, 'inputStatus', () => {
  if (state.inputStatus === 'disabled') {
    renderInputDisable();
  }
  if (state.inputStatus === 'enabled') {
    renderInputEnable();
  }
});

watch(state, 'inputClear', () => {
  renderInputClear();
  state.inputClear = false;
});

watch(state, 'postModal', () => {
  renderPostModal(state.postModal);
});

export default state;
