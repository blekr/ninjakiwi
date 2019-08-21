import filter from 'lodash/filter';
import get from 'lodash/fp/get';
import { backgroundCom } from '../communication/background';
import { database } from './database';
import {
  defaultFavicon,
  getAllTabs,
  getAllWindows,
  getScreenshot,
  getTabById,
  urlToId
} from './tools';

backgroundCom.handle('SEARCH', text => database.search(text));
backgroundCom.handle('UPDATE_PHOTO', ({ url, photo }) => {
  console.log('----', url, photo);
  database.updatePhoto(urlToId(url), photo);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const png = await getScreenshot(tab.windowId);
  database.addPage({
    id: urlToId(tab.url),
    url: tab.url,
    favicon: tab.favIconUrl || defaultFavicon,
    title: tab.title,
    screenImg: png
  });
});

chrome.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
  console.log('-----on activated', tabId, windowId);
  const tab = await getTabById(tabId);
  const png = await getScreenshot(windowId);
  console.log('-----on activated', tab.url, png);
  database.updatePhoto(urlToId(tab.url), png);
});

async function loadAllTabs() {
  const allTabs = await getAllTabs();
  console.log('------hi', allTabs);
  allTabs.forEach(({ url, favIconUrl, title }) => {
    database.addPage({
      id: urlToId(url),
      url,
      favicon: favIconUrl || defaultFavicon,
      title
    });
  });
}

async function loadAllScreenshot() {
  const windows = await getAllWindows();
  const promises = windows.map(async ({ id, tabs }) => {
    const png = await getScreenshot(id);
    const tab = filter(tabs, get('active'))[0];
    return {
      id: urlToId(tab.url),
      png
    };
  });
  const results = await Promise.all(promises);
  results.forEach(({ id, png }) => {
    database.updatePhoto(id, png);
  });
}

async function run() {
  await loadAllTabs();
  await loadAllScreenshot();
}

run().catch();
