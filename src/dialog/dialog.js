import { applyMiddleware, createStore } from 'redux';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDom from 'react-dom';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { keyboard } from '../tools/keyboard';
import { moveBackward, moveForward } from './actions/manipulate';
import { contentCom } from '../communication/content';
import { Main } from './components/main/Main';
import { search } from './actions/search';
import { closeDialog } from './tools';

(async function() {
  const store = createStore(reducers, applyMiddleware(thunk));
  await store.dispatch(search(''));

  ReactDom.render(
    <Provider store={store}>
      <Main />
    </Provider>,
    document.getElementById('root')
  );

  keyboard.on('EV_FORWARD', () => {
    store.dispatch(moveForward());
  });
  keyboard.on('EV_BACKWARD', () => {
    store.dispatch(moveBackward());
  });
  keyboard.on('EV_CLOSE', () => {
    closeDialog();
  });
  keyboard.on('EV_ENTER', async () => {
    const {
      manipulate: { index },
      page: { pages, pageIds }
    } = store.getState();
    const page = pages[pageIds[index]];
    await contentCom.callBackground('OPEN_URL', { url: page.url });
    closeDialog();
  });
  window.addEventListener('message', ev => {
    if (ev.data === 'WIN_EV_FORWARD') {
      store.dispatch(moveForward());
    }
  });
  contentCom.handle('EXT_EV_FORWARD', () => {
    store.dispatch(moveForward());
  });
})();
