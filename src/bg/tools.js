import md5 from 'md5';
import get from 'lodash/get';
import filter from 'lodash/filter';

export function getAllTabs() {
  return new Promise(resolve => {
    chrome.tabs.query({}, resolve);
  });
}

export async function getTabById(tabId) {
  return new Promise(resolve => {
    chrome.tabs.get(tabId, resolve);
  });
}

export async function getTabByUrl(url) {
  return new Promise(resolve => {
    chrome.tabs.query({ url: url.replace(/#.*/, '') }, tabs => {
      const filtered = filter(tabs, tab => tab.url === url);
      resolve(get(filtered, 0));
    });
    // chrome.tabs.query({ url }, tabs => resolve(get(tabs, 0)));
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
      chrome.tabs.captureVisibleTab(windowId, {}, resolve);
    } catch (e) {
      resolve();
    }
  });
}

export function isSensitive(url) {
  return url.indexOf('chrome://') === 0;
}

export function normalize(str) {
  // Create regex using 'new RegExp()' instead of the literal /.../u,
  // because the later one will be transformed into wrong ES5 by babel
  return filter(
    str.split(new RegExp('[^\\p{Alphabetic}\\p{Number}]+', 'u')),
    item => item && item.length < 50
  ).join(' ');
}

export function faviconUrl(url) {
  return `chrome://favicon/${url}`;
}

export function getHostname(url) {
  return new URL(url).hostname;
}

export function blobToDataURL(blob) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(blob);
  });
}

export const defaultFavicon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABRklEQVR42mKgOqjq75ds7510YNL0uV9nAGqniqwKYiCIHIIjcAK22BGQLRdgBWvc3fnWk/FJhrkPO1xPgGvqPfLfJMHhT1yqurvS48bPaJhjD2efgidnVwa2yv59xecvEvi0UWCXq9t0ItfP2MMZ7nwIpkA8F1n8uLxZHM6yrBH7FIl2gFXDHYsErkn2hyKLHtcKrFntk58uVQJ+kSdQnmjhID4cwLLa8+K0BXsfNWCqBOsFdo2Yldv43DBrkxd30cjnNyYBhK0SQGkI9pG4Mu40D5b374DRCAyhHqXVfTmOwivivMkJxBz5wnHCtBfGgNFC+ChWKWRf3hsQIlyEoIv4IYEo5wkgtBLRekY9DE4Uin4Keae6hydGnljPmE8kRcCine6827AMsJ1IuW9ibnlQpXLBCR/WC875m2BP+VSu3c/0m+8V08OBngc0pxcAAAAASUVORK5CYII=';

export function getCurrentTab() {
  return new Promise(resolve => {
    chrome.tabs.query({ currentWindow: true, active: true }, result =>
      resolve(get(result, 0))
    );
  });
}

export function updateTab(tabId, props) {
  return new Promise(resolve => {
    chrome.tabs.update(tabId, props, resolve);
  });
}

export function updateWindow(windowId, props) {
  return new Promise(resolve => {
    chrome.windows.update(windowId, props, resolve);
  });
}

export function removeTab(tabId) {
  return new Promise(resolve => {
    chrome.tabs.remove(tabId, resolve);
  });
}

export function createTab(url) {
  return new Promise(resolve => {
    chrome.tabs.create({ url, active: true }, resolve);
  });
}

export function executeScript(details) {
  return new Promise(resolve => {
    chrome.tabs.executeScript(details, resolve);
  });
}

export function isSameHost(url1, url2) {
  const host1 = getHostname(url1)
  const host2 = getHostname(url2)
  return host1 === host2;
}
