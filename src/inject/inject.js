import React from 'react';
import { compose } from 'recompose';
import ReactDom from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { keyboard } from './keyboard';
import { Container } from './components/container/Container';

function createOverlap() {
  const overlap = document.createElement('div');
  overlap.style.position = 'fixed';
  overlap.style.left = '0';
  overlap.style.top = '0';
  overlap.style.right = '0';
  overlap.style.bottom = '0';
  overlap.style.zIndex = '100000000';
  overlap.style.display = 'flex';
  overlap.style.justifyContent = 'center';
  overlap.style.alignItems = 'center';
  return overlap;
}

const store = createStore(reducers, applyMiddleware(thunk));
let overlap = createOverlap();

// function render({ name }) {
//   return <div>hello I am ${name}</div>;
// }
// const Abc = compose(connect(() => ({ name: 'tom' })))(render);

ReactDom.render(
  <Provider store={store}>
    <Container />
  </Provider>,
  overlap
);

let opened = false;
keyboard.on('EV_FLIP', () => {
  if (!opened) {
    console.log('----open');
    document.body.appendChild(overlap);
    opened = true;
  }
});
keyboard.on('EV_CLOSE', () => {
  if (opened) {
    overlap = document.body.removeChild(overlap);
    opened = false;
  }
});
