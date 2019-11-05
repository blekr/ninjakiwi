import isNil from 'lodash/isNil';
import { getCurrentTab } from '../inject/tools';

class ContentCommunication {
  constructor() {
    this.map = {};
    chrome.runtime.onMessage.addListener((...params) => {
      this.handleRequest(...params);
      return true;
    });
  }

  handleRequest(message, sender, sendResponse) {
    if (typeof message !== 'object') {
      return;
    }
    const { type, endpoint, data } = message;
    if (type !== '__BTC' && type !== '__CTC') {
      return;
    }
    if (!this.map[endpoint]) {
      throw new Error(`endpoint ${endpoint} not found`);
    }
    this.map[endpoint](data).then(sendResponse);
  }

  callBackground(endpoint, data) {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(
        null,
        { type: '__CTB', endpoint, data },
        {},
        resolve
      );
    });
  }

  // when no tabId specified, the current tab is used
  async callContent(tabId, endpoint, data) {
    const currentTab = await getCurrentTab();
    return new Promise(resolve => {
      chrome.tabs.sendMessage(
        isNil(tabId) ? currentTab.id : tabId,
        { type: '__CTC', endpoint, data },
        {},
        resolve
      );
    });
  }

  handle(endpoint, cb) {
    if (this.map[endpoint]) {
      throw new Error(`endpoint ${endpoint} already exists`);
    }
    this.map[endpoint] = cb;
  }
}

export const contentCom = new ContentCommunication();
