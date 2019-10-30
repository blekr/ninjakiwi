export function getCurrentTab() {
  return new Promise(resolve => {
    chrome.tabs.getCurrent(resolve);
  });
}

export function closeDialog() {
  window.parent.postMessage('WIN_EV_CLOSE', '*');
}
