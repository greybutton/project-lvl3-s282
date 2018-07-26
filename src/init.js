import { getInput, getForm } from './dom';
import { refresh, handleInput, handlerSubmit } from './logic';

export default () => {
  getInput().addEventListener('input', handleInput);
  getForm().addEventListener('submit', handlerSubmit);

  window.setTimeout(refresh, 5000);
};
