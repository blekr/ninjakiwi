import { getAllTabs, isSameHost, urlToId } from './tools';

export class SelfTabTracker {
  constructor() {
    this.tabs = {};
  }

  async init() {
    const allTabs = await getAllTabs();
    allTabs.forEach(({ id, url }) => {
      this.tabs[id] = url;
    });

    chrome.tabs.onUpdated.addListener(async (tabId, { status }, tab) => {
      if (status === 'complete') {
        this.onUpdated(tab);
      }
    });
  }

  onUpdated({ id, url }) {
    if (!url) {
      return;
    }
    const urlId = urlToId(url);
    if (!this.tabs[id]) {
      chrome.storage.sync.remove(urlId);
      console.log('------remove', url);
    } else if (isSameHost(this.tabs[id], url)) {
      chrome.storage.sync.set({ [urlId]: true });
      console.log('------set', url);
    }
    this.tabs[id] = url;
  }

  async isSelfTab(url) {
    return new Promise(resolve => {
      const id = urlToId(url);
      chrome.storage.sync.get(id, results => resolve(!!results[id]));
    });
  }
}
