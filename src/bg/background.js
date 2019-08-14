import { backgroundCom } from '../communication/background';
import { database } from './database';
import { getAllTabs, urlToId } from './tools';

backgroundCom.handle('SEARCH', text => database.search(text));
backgroundCom.handle('UPDATE_PHOTO', ({ url, photo }) => {
  console.log('----', url, photo)
  database.updatePhoto(urlToId(url), photo);
});

(async () => {
  const allTabs = await getAllTabs();
  allTabs.forEach(({ url, title }) => {
    database.addPage({
      id: urlToId(url),
      url,
      title
    });
  });
})();
