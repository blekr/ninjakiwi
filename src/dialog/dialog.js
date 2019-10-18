import { applyMiddleware, createStore } from 'redux';
import React from 'react';
import { Provider, connect } from 'react-redux';
import ReactDom from 'react-dom';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { search } from './actions/search';
import { Container } from './components/container/Container';

const store = createStore(reducers, applyMiddleware(thunk));
store.dispatch(search(''));

setTimeout(() => {
  console.log('----hi 2', document.getElementById('root'));
}, 3000)
console.log('----hi 1', document.getElementById('root'));
ReactDom.render(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.getElementById('root')
);
