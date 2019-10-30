import debounce from 'lodash/debounce';
import { keyboard } from '../tools/keyboard';
import { contentCom } from '../communication/content';

// function createOverlap() {
//   const overlap = document.createElement('iframe');
//   overlap.style.position = 'fixed';
//   overlap.style.left = '0';
//   overlap.style.top = '0';
//   overlap.style.width = '100%';
//   overlap.style.height = '100%';
//   overlap.style.zIndex = '100000000';
//   overlap.style.border = 'none';
//   overlap.setAttribute('src', chrome.extension.getURL('dialog.html'));
//   return overlap;
// }

// let opened = false;
// let overlap;

// keyboard.on('EV_FLIP', () => {
//   if (!opened) {
//     overlap = createOverlap();
//     document.body.appendChild(overlap);
//     opened = true;
//   }
// });
// contentCom.handle('CLOSE_DIALOG', () => {
//   if (opened) {
//     overlap.remove();
//     overlap = null;
//     opened = false;
//   }
// });

const updatePhoto = debounce(() => {
  if (!opened) {
    contentCom.callBackground('UPDATE_PHOTO', {});
  }
}, 500);

document.addEventListener('scroll', () => {
  updatePhoto();
});
