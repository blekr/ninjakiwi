import md5 from 'md5';

export async function getAllTabs() {
  return new Promise(resolve => {
    chrome.tabs.query({}, resolve);
  });
}

export function urlToId(url) {
  return md5(url);
}
