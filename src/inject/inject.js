import React from 'react';
import { compose } from 'recompose';
import ReactDom from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { keyboard } from './keyboard';
import { Container } from './components/container/Container';
import { contentCom } from '../communication/content';
import { delay, takePhoto } from './tools';
import { search } from './actions/search';
import { commandMode, moveBackward, moveForward } from './actions/manipulate';

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
    console.log('-----flip');
    store.dispatch(search(''));
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
keyboard.on('EV_FORWARD', () => {
  if (!opened) {
    return;
  }
  store.dispatch(moveForward());
})
keyboard.on('EV_BACKWARD', () => {
  if (!opened) {
    return;
  }
  store.dispatch(moveBackward());
})
keyboard.on('EV_COMMAND_MODE', () => {
  if (!opened) {
    return;
  }
  store.dispatch(commandMode());
})

// (async () => {
//   await delay(3000);
//   console.log('----upload photo');
//   try {
//     const photo = await takePhoto();
//     console.log('----upload photo', photo);
//     await contentCom.callBackground('UPDATE_PHOTO', {
//       url: window.location.href,
//       photo
//     });
//   } catch (e) {
//     console.log('----error', e);
//   }
//   console.log('-----upload photo finish')
// })();

// contentCom.handle('TAKE_PHOTO', takePhoto);
