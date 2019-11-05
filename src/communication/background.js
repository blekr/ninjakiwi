class BackgroundCommunication {
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
    if (type !== '__CTB') {
      return;
    }
    if (!this.map[endpoint]) {
      throw new Error(`endpoint ${endpoint} not found`);
    }

    this.map[endpoint](data).then(sendResponse);
  }

  callContent(endpoint, data, tabId) {
    return new Promise(resolve => {
      chrome.tabs.sendMessage(
        tabId,
        { type: '__BTC', endpoint, data },
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

export const backgroundCom = new BackgroundCommunication();
