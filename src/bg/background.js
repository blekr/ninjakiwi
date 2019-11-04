import size from 'lodash/size';
import { backgroundCom } from '../communication/background';
import { database } from './database';
import {
  createTab,
  defaultFavicon,
  executeScript,
  faviconUrl,
  getAllTabs,
  getCurrentTab,
  getHostname,
  getScreenshot,
  getTabById,
  getTabByUrl,
  isSensitive,
  removeTab,
  updateTab,
  updateWindow,
  urlToId
} from './tools';

const DIALOG_URL = chrome.runtime.getURL('dialog.html');
const IGNORE_LIST = ['chrome://newtab/', DIALOG_URL];

function addPage({ url, favicon, title, lastVisit, visitCount }) {
  if (IGNORE_LIST.filter(item => url.indexOf(item) >= 0).length > 0) {
    console.log('---ignore', url);
    return;
  }
  const id = urlToId(url);
  const hostId = urlToId(getHostname(url));
  database.addPage({
    id,
    url,
    favicon,
    title
  });
  database.setLastVisit(id, lastVisit);
  database.addUrlVisitCount(id, visitCount);
  database.addHostVisitCount(hostId, visitCount);
}

backgroundCom.handle('SEARCH', ({ text }) => database.search(text));
backgroundCom.handle('OPEN_URL', async ({ url }) => {
  const tab = await getTabByUrl(url);
  if (tab) {
    await updateTab(tab.id, { active: true });
    await updateWindow(tab.windowId, { focused: true });

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

backgroundCom.handle('CLOSE_TAB', async ({ tabId }) => removeTab(tabId));
backgroundCom.handle('ACTIVATE_TAB', async ({ tabId }) => {
  await updateTab(tabId, { active: true });
});

chrome.tabs.onUpdated.addListener(async (tabId, { status }, tab) => {
  console.log('on updated: ', tab.url, status);
  if (!tab.url || status !== 'complete') {
    return;
  }
  addPage({
    url: tab.url,
    favicon: tab.favIconUrl || defaultFavicon,
    title: tab.title,
    lastVisit: new Date().getTime(),
    visitCount: 1
  });
  const id = urlToId(tab.url);
  if (!database.exists(id)) {
    return;
  }

  if (!database.hasPhoto(id) && !isSensitive(tab.url)) {
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
  if (!database.exists(id)) {
    return;
  }
  database.setLastVisit(id, new Date().getTime());

  if (isSensitive(tab.url) || database.hasPhoto(id)) {
    return;
  }
  const png = await getScreenshot(windowId);
  database.updatePhoto(id, png);
});

chrome.commands.onCommand.addListener(async command => {
  if (command !== 'toggleDialog1' && command !== 'toggleDialog2') {
    return;
  }
  const currentTab = await getCurrentTab();
  if (currentTab.url.indexOf(DIALOG_URL) === 0) {
    await backgroundCom.callContent('EXT_EV_FORWARD', {}, currentTab.id);
    return;
  }
  const results = await executeScript({
    file: 'open.js'
  });
  if (results) {
    return;
  }
  const png = await getScreenshot(null);
  database.updatePhoto(urlToId(currentTab.url), png);

  await createTab(
    `${DIALOG_URL}?tabId=${currentTab.id}&url=${encodeURIComponent(
      currentTab.url
    )}`
  );
});

async function loadAllTabs() {
  const now = new Date().getTime();
  const allTabs = await getAllTabs();
  allTabs.forEach(({ url, favIconUrl, title }) => {
    addPage({
      url,
      favicon: favIconUrl || defaultFavicon,
      title,
      lastVisit: now,
      visitCount: 1
    });
  });
}

function loadAllBookmarks() {
  return new Promise(resolve => {
    function saveNodes(nodes) {
      nodes.forEach(node => {
        if (node.url) {
          addPage({
            url: node.url,
            favicon: faviconUrl(node.url),
            title: node.title,
            lastVisit: node.dateAdded || 0,
            visitCount: 1
          });
        }
        if (size(node.children)) {
          saveNodes(node.children);
        }
      });
    }
    chrome.bookmarks.getTree(nodes => {
      saveNodes(nodes);
      resolve();
    });
  });
}

function loadAllHistory() {
  return new Promise(resolve => {
    chrome.history.search({ text: '', maxResults: 10000 }, items => {
      items.forEach(item => {
        addPage({
          url: item.url,
          favicon: faviconUrl(item.url),
          title: item.title,
          lastVisit: item.lastVisitTime || 0,
          visitCount: item.visitCount
        });
      });
      resolve();
    });
  });
}

async function run() {
  await loadAllTabs();
  await loadAllBookmarks();
  await loadAllHistory();
  database.buildRecent();
}

run().catch();
