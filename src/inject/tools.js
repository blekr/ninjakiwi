/* eslint-disable no-param-reassign */
import html2canvas from 'html2canvas';

export function takePhoto() {
  return new Promise(resolve => {
    html2canvas(document.body, {
      foreignObjectRendering: true
    }).then(canvas => resolve(canvas.toDataURL()));
  });
}

export function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
