import { contentCom } from '../../communication/content';
import { getCurrentTab } from '../../inject/tools';

export function setOpener({ tabId, url }) {
  return {
    type: 'SET_OPENER',
    data: {
      tabId,
      url
    }
  };
}

export function cancel() {
  return async (dispatch, getState) => {
    const {
      opener: { tabId }
    } = getState();
    if (tabId) {
      await contentCom.callBackground('ACTIVATE_TAB', { tabId });
      const currentTab = await getCurrentTab();
      await contentCom.callBackground('CLOSE_TAB', { tabId: currentTab.id });
    } else {
      window.parent.postMessage('WIN_EV_CLOSE', '*');
    }
  };
}

export function goto(url) {
  return async (dispatch, getState) => {
    const {
      opener: { tabId }
    } = getState();
    await contentCom.callBackground('OPEN_URL', { url });
    if (tabId) {
      const currentTab = await getCurrentTab();
      await contentCom.callBackground('CLOSE_TAB', { tabId: currentTab.id });
    } else {
      window.parent.postMessage('WIN_EV_CLOSE', '*');
    }
  };
}
