export function getCurrentTab() {
  return new Promise(resolve => {
    chrome.tabs.getCurrent(resolve);
  });
}
