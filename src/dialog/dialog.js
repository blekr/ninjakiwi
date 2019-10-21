import { applyMiddleware, createStore } from 'redux';
import get from 'lodash/get';
import React from 'react';
import { Provider, connect } from 'react-redux';
import ReactDom from 'react-dom';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { search } from './actions/search';
import { Container } from './components/container/Container';
import { keyboard } from '../tools/keyboard';
import { moveBackward, moveForward } from './actions/manipulate';
import { contentCom } from '../communication/content';
import { Main } from './components/main/Main';

const store = createStore(reducers, applyMiddleware(thunk));
store.dispatch(search(''));

ReactDom.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('root')
);

keyboard.on('EV_FLIP', () => {
  store.dispatch(moveForward());
});
keyboard.on('EV_FORWARD', () => {
  store.dispatch(moveForward());
});
keyboard.on('EV_BACKWARD', () => {
  store.dispatch(moveBackward());
});
keyboard.on('EV_CLOSE', () => {
  contentCom.callContent(null, 'CLOSE_DIALOG');
});
keyboard.on('EV_ENTER', () => {
  const {
    manipulate: { index },
    page: { pages, pageIds }
  } = store.getState();
  const page = pages[pageIds[index]];
  contentCom.callBackground('OPEN_URL', { url: page.url });
  contentCom.callContent(null, 'CLOSE_DIALOG');
});
