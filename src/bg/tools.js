import md5 from 'md5';

export async function getAllTabs() {
  return new Promise(resolve => {
    chrome.tabs.query({}, resolve);
  });
}

export async function getTabById(tabId) {
  return new Promise(resolve => {
    chrome.tabs.get(tabId, resolve);
  });
}

export function urlToId(url) {
  return md5(url);
}

export async function getAllWindows() {
  return new Promise(resolve => {
    chrome.windows.getAll({ populate: true }, resolve);
  });
}

export async function getScreenshot(windowId) {
  return new Promise(resolve => {
    try {
      chrome.tabs.captureVisibleTab(windowId, resolve);
    } catch (e) {
      resolve();
    }
  });
}

export const defaultFavicon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABRklEQVR42mKgOqjq75ds7510YNL0uV9nAGqniqwKYiCIHIIjcAK22BGQLRdgBWvc3fnWk/FJhrkPO1xPgGvqPfLfJMHhT1yqurvS48bPaJhjD2efgidnVwa2yv59xecvEvi0UWCXq9t0ItfP2MMZ7nwIpkA8F1n8uLxZHM6yrBH7FIl2gFXDHYsErkn2hyKLHtcKrFntk58uVQJ+kSdQnmjhID4cwLLa8+K0BXsfNWCqBOsFdo2Yldv43DBrkxd30cjnNyYBhK0SQGkI9pG4Mu40D5b374DRCAyhHqXVfTmOwivivMkJxBz5wnHCtBfGgNFC+ChWKWRf3hsQIlyEoIv4IYEo5wkgtBLRekY9DE4Uin4Keae6hydGnljPmE8kRcCine6827AMsJ1IuW9ibnlQpXLBCR/WC875m2BP+VSu3c/0m+8V08OBngc0pxcAAAAASUVORK5CYII=';
