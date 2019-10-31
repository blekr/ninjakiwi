import { contentCom } from '../../communication/content';
import { getCurrentTab } from '../../inject/tools';

export async function closeDialog() {
  if (window.parent === window) {
    const currentTab = await getCurrentTab();
    await contentCom.callBackground('CLOSE_TAB', { tabId: currentTab.id });
  }
  window.parent.postMessage('WIN_EV_CLOSE', '*');
}

export async function activateLast() {
  if (window.parent === window) {
    await contentCom.callBackground('ACTIVATE_LAST_TAB', {});
  }
}
