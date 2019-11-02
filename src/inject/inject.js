import debounce from 'lodash/debounce';
import { contentCom } from '../communication/content';

const updatePhoto = debounce(() => {
  contentCom.callBackground('UPDATE_PHOTO', {});
}, 500);

document.addEventListener('scroll', () => {
  updatePhoto();
});
