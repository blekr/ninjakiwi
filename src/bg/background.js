import filter from 'lodash/filter';
import get from 'lodash/fp/get';
import size from 'lodash/size';
import { backgroundCom } from '../communication/background';
import { database } from './database';
import {
  blobToDataURL,
  defaultFavicon,
  faviconUrl,
  getAllTabs,
  getAllWindows,
  getScreenshot,
  getTabById,
  getTabByUrl,
  isSensitive,
  urlToId
} from './tools';

backgroundCom.handle('SEARCH', ({ text }) => database.search(text));
backgroundCom.handle('OPEN_URL', async ({ url }) => {
  const tab = await getTabByUrl(url);
  if (tab) {
    chrome.tabs.update(tab.id, { highlighted: true });
    chrome.windows.update(tab.windowId, { focused: true });
  } else {
    chrome.tabs.create({ url, active: true });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, { status }, tab) => {
  if (!tab.url || isSensitive(tab.url) || status !== 'complete') {
    return;
  }
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
  const tab = await getTabById(tabId);
  if (!tab.url || isSensitive(tab.url)) {
    return;
  }
  const png = await getScreenshot(windowId);
  database.updatePhoto(urlToId(tab.url), png);
});

async function loadAllTabs() {
  const allTabs = await getAllTabs();
  console.log('----get tabs: ', allTabs.length);
  allTabs.forEach(({ url, favIconUrl, title }) => {
    database.addPage({
      id: urlToId(url),
      url,
      favicon: favIconUrl || defaultFavicon,
      title
    });
  });
}

function loadAllBookmarks() {
  function saveNodes(nodes) {
    console.log('-----get bookmark: ', nodes.length);
    nodes.forEach(node => {
      if (node.url) {
        database.addPage({
          id: urlToId(node.url),
          url: node.url,
          favicon: faviconUrl(node.url),
          title: node.title
        });
      }
      if (size(node.children)) {
        saveNodes(node.children);
      }
    });
  }
  chrome.bookmarks.getTree(saveNodes);
}

function loadAllHistory() {
  chrome.history.search({ text: '', maxResults: 10000 }, items => {
    items.forEach(item => {
      database.addPage({
        id: urlToId(item.url),
        url: item.url,
        favicon: faviconUrl(item.url),
        title: item.title
      });
    });
  });
}

// async function loadAllScreenshot() {
//   const windows = await getAllWindows();
//   const promises = windows.map(async ({ id, tabs }) => {
//     const png = await getScreenshot(id);
//     const tab = filter(tabs, get('active'))[0];
//     return {
//       id: urlToId(tab.url),
//       png
//     };
//   });
//   const results = await Promise.all(promises);
//   results.forEach(({ id, png }) => {
//     database.updatePhoto(id, png);
//   });
// }

async function run() {
  await loadAllTabs();
  // await loadAllScreenshot();
  loadAllBookmarks();
  loadAllHistory();
}

run().catch();
