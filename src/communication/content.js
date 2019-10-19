import isNil from 'lodash/isNil';
import { getCurrentTab } from '../dialog/tools';

class ContentCommunication {
  constructor() {
    this.map = {};
    chrome.runtime.onMessage.addListener((...params) =>
      this.handleRequest(...params)
    );
  }

  async handleRequest(message, sender, sendResponse) {
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
    const response = await this.map[endpoint](data);
    sendResponse(response);
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
