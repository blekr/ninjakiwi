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
import { cancel, goto, setOpener } from './actions/opener';

(async function() {
  const store = createStore(reducers, applyMiddleware(thunk));

  keyboard.on('EV_FORWARD', () => {
    store.dispatch(moveForward());
  });
  keyboard.on('EV_BACKWARD', () => {
    store.dispatch(moveBackward());
  });
  keyboard.on('EV_CLOSE', async () => {
    store.dispatch(cancel());
  });
  keyboard.on('EV_ENTER', async () => {
    const {
      manipulate: { index },
      page: { pages, pageIds }
    } = store.getState();
    const page = pages[pageIds[index]];
    store.dispatch(goto(page.url));
  });
  window.addEventListener('message', ev => {
    if (ev.data === 'WIN_EV_FORWARD') {
      store.dispatch(moveForward());
    }
  });
  contentCom.handle('EXT_EV_FORWARD', () => {
    store.dispatch(moveForward());
  });
  const { searchParams } = new URL(window.location.href);
  const tabId = searchParams.get('tabId');
  const url = searchParams.get('url');
  store.dispatch(
    setOpener({
      tabId: tabId && parseInt(tabId, 10),
      url
    })
  );
  await store.dispatch(search(''));

  ReactDom.render(
    <Provider store={store}>
      <Main />
    </Provider>,
    document.getElementById('root')
  );

  // TODO debug only
  chrome.store = store;
})();
