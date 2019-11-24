import { getAllTabs, isSameHost, urlToId } from './tools';
import { PREFIX } from '../constants';

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
    const storageKey = `${PREFIX.SELF_TAB}.${urlToId(url)}`;
    if (!this.tabs[id]) {
      chrome.storage.sync.remove(storageKey);
    } else if (isSameHost(this.tabs[id], url)) {
      chrome.storage.sync.set({ [storageKey]: true });
    }
    this.tabs[id] = url;
  }

  async isSelfTab(url) {
    return new Promise(resolve => {
      const storageKey = `${PREFIX.SELF_TAB}.${urlToId(url)}`;
      chrome.storage.sync.get(storageKey, results => {
        return resolve(!!results[storageKey]);
      });
    });
  }
}
