import WatchJS from 'melanke-watchjs';

import {
  renderInputUpdate,
  renderInputClear,
  renderInputDisable,
  renderInputEnable,
  renderAppInfo,
} from './dom';

const uiState = {
  info: ['', ''],
  inputValidation: '',
  inputStatus: null,
  inputClear: null,
};

const { watch } = WatchJS;

watch(uiState, 'info', () => {
  renderAppInfo(uiState.info);
});

watch(uiState, 'inputValidation', () => {
  renderInputUpdate(uiState.inputValidation);
});

watch(uiState, 'inputStatus', () => {
  if (uiState.inputStatus === 'disabled') {
    renderInputDisable();
  }
  if (uiState.inputStatus === 'enabled') {
    renderInputEnable();
  }
});

watch(uiState, 'inputClear', () => {
  renderInputClear();
  uiState.inputClear = false;
});

export default uiState;