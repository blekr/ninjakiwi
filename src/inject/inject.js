import React from 'react';
import { compose } from 'recompose';
import ReactDom from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { keyboard } from './keyboard';

const overlap = document.createElement('div');
document.body.appendChild(overlap);

const store = createStore(reducers, applyMiddleware(thunk));

function render({ name }) {
  return <div>hello I am ${name}</div>;
}

const Abc = compose(connect(() => ({ name: 'tom' })))(render);

ReactDom.render(
  <Provider store={store}>
    <Abc />
  </Provider>,
  overlap
);

