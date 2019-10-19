import { applyMiddleware, createStore } from 'redux';
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

const store = createStore(reducers, applyMiddleware(thunk));
store.dispatch(search(''));

ReactDom.render(
  <Provider store={store}>
    <Container />
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
