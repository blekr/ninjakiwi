import size from 'lodash/size';
import { backgroundCom } from '../communication/background';
import { database } from './database';
import {
  defaultFavicon,
  faviconUrl,
  getAllTabs,
  getCurrentTab,
  getHostname,
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
    chrome.tabs.update(tab.id, { active: true });
    chrome.windows.update(tab.windowId, { focused: true });

    const id = urlToId(url);
    const hostId = urlToId(getHostname(url));
    database.setLastVisit(id, new Date().getTime());
    database.addUrlVisitCount(id, 1);
    database.addHostVisitCount(hostId, 1);
  } else {
    chrome.tabs.create({ url, active: true });
  }
});

// for current tab
backgroundCom.handle('UPDATE_PHOTO', async () => {
  const tab = await getCurrentTab();
  if (!tab.url || isSensitive(tab.url)) {
    return;
  }
  const png = await getScreenshot();
  database.updatePhoto(urlToId(tab.url), png);
});

chrome.tabs.onUpdated.addListener(async (tabId, { status }, tab) => {
  console.log('on updated: ', tab.url, status);
  if (!tab.url || isSensitive(tab.url) || status !== 'complete') {
    return;
  }
  const id = urlToId(tab.url);
  const hostId = urlToId(getHostname(tab.url));
  database.addPage({
    id,
    url: tab.url,
    favicon: tab.favIconUrl || defaultFavicon,
    title: tab.title
  });
  database.setLastVisit(id, new Date().getTime());
  database.addUrlVisitCount(id, 1);
  database.addHostVisitCount(hostId, 1);

  if (!database.hasPhoto(id)) {
    const png = await getScreenshot(tab.windowId);
    database.updatePhoto(id, png);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
  const tab = await getTabById(tabId);
  console.log('on activated: ', tab.url);

  if (!tab.url) {
    return;
  }

  const id = urlToId(tab.url);
  database.setLastVisit(id, new Date().getTime());

  if (isSensitive(tab.url) || database.hasPhoto(id)) {
    return;
  }
  const png = await getScreenshot(windowId);
  database.updatePhoto(id, png);
});

async function loadAllTabs() {
  const now = new Date().getTime();
  const allTabs = await getAllTabs();
  allTabs.forEach(({ url, favIconUrl, title }) => {
    const id = urlToId(url);
    const hostId = urlToId(getHostname(url));
    database.addPage({
      id,
      url,
      favicon: favIconUrl || defaultFavicon,
      title
    });
    database.setLastVisit(id, now);
    database.addUrlVisitCount(id, 1);
    database.addHostVisitCount(hostId, 1);
  });
}

function loadAllBookmarks() {
  function saveNodes(nodes) {
    nodes.forEach(node => {
      if (node.url) {
        const id = urlToId(node.url);
        const hostId = urlToId(getHostname(node.url));
        database.addPage({
          id,
          url: node.url,
          favicon: faviconUrl(node.url),
          title: node.title
        });
        database.setLastVisit(id, node.dateAdded || 0);
        database.addUrlVisitCount(id, 1);
        database.addHostVisitCount(hostId, 1);
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
      const id = urlToId(item.url);
      const hostId = urlToId(getHostname(item.url));
      database.addPage({
        id,
        url: item.url,
        favicon: faviconUrl(item.url),
        title: item.title
      });
      database.setLastVisit(id, item.lastVisitTime || 0);
      database.addUrlVisitCount(id, item.visitCount);
      database.addHostVisitCount(hostId, item.visitCount);
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
  loadAllBookmarks();
  loadAllHistory();
  database.buildRecent();
}

run().catch();
