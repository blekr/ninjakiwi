import FlexSearch from 'flexsearch';
import _ from 'lodash';
import Heap from 'heap';
import { getAllTabs, getHostname, normalize, urlToId } from './tools';

/*
id
url
favicon
title
screenImg
*/

const RECENT_SIZE = 7;
function cmp(a, b) {
  return a.value - b.value;
}

const WEIGHTS = {
  title: [33, 30, 28, 5, 5, 5],
  tab: 20,
  recent: [25, 15, 13, 2, 2, 2],
  totalUrl: [8, 6, 4, 2, 2, 2],
  totalHost: [6, 4, 2, 1, 1, 1],
  url: [6, 4, 2, 2, 2, 2]
};

class Database {
  constructor() {
    this.pages = {};
    this.titleIndex = FlexSearch.create({
      tokenize: 'full',
      threshold: 5,
      resolution: 20
    });
    this.urlIndex = FlexSearch.create({
      tokenize: 'full',
      threshold: 5,
      resolution: 20
    });
    this.lastVisit = {};
    this.urlVisitCount = {};
    this.hostVisitCount = {};
    this.recents = [];
  }

  addPage(page) {
    const title = normalize(page.title);
    let url;
    try {
      // double calls to decode deeply encoded url embed in page.url
      url = normalize(decodeURIComponent(decodeURIComponent(page.url)));
    } catch (e) {
      url = normalize(page.url);
    }
    if (!title || !url) {
      return;
    }
    if (this.pages[page.id]) {
      this.pages[page.id] = { ...this.pages[page.id], ...page };
      this.titleIndex.update(page.id, title);
      this.urlIndex.update(page.id, url);
    } else {
      this.pages[page.id] = page;
      this.titleIndex.add(page.id, title);
      this.urlIndex.add(page.id, url);
    }
  }

  exists(id) {
    return !!this.pages[id];
  }

  hasPhoto(id) {
    if (!this.pages[id]) {
      throw new Error(`${id} not found`);
    }
    return !!this.pages[id].screenImg;
  }

  updatePhoto(id, photo) {
    if (this.pages[id]) {
      this.pages[id].screenImg = photo;
    }
  }

  setLastVisit(id, time) {
    if (this.lastVisit[id]) {
      if (time > this.lastVisit[id]) {
        this.lastVisit[id] = time;
      }
    } else {
      this.lastVisit[id] = time;
    }
    if (!_.size(this.recents) || time > this.recents[0].time) {
      const filtered = _.filter(this.recents, recent => recent.id !== id);
      filtered.splice(0, 0, { id, time });
      this.recents = filtered.slice(0, RECENT_SIZE);
    }
  }

  addUrlVisitCount(id, count) {
    if (this.urlVisitCount[id]) {
      this.urlVisitCount[id] += count;
    } else {
      this.urlVisitCount[id] = count;
    }
  }

  addHostVisitCount(id, count) {
    if (this.hostVisitCount[id]) {
      this.hostVisitCount[id] += count;
    } else {
      this.hostVisitCount[id] = count;
    }
  }

  __getTitleMatchScore(titleMatch, excludeId) {
    const map = {};
    let index = 0;
    titleMatch.forEach(id => {
      if (id === excludeId) {
        return;
      }
      const score = index >= WEIGHTS.title.length ? 0 : WEIGHTS.title[index];
      map[id] = {
        score,
        meta: {
          titleMatch: {
            index,
            score
          }
        }
      };
      index += 1;
    });
    return map;
  }

  __getUrlMatchScore(urlMatch, excludeId) {
    const map = {};
    let index = 0;
    urlMatch.forEach(id => {
      if (id === excludeId) {
        return;
      }
      const score = index >= WEIGHTS.url.length ? 0 : WEIGHTS.url[index];
      map[id] = {
        score,
        meta: {
          urlMatch: {
            index,
            score
          }
        }
      };
      index += 1;
    });
    return map;
  }

  __getLastVisitScore(ids) {
    const map = {};
    const lastVisits = ids.map(id => ({
      id,
      value: this.lastVisit[id]
    }));
    Heap.nlargest(lastVisits, WEIGHTS.recent.length, cmp).forEach(
      (item, index) => {
        const score = WEIGHTS.recent[index];
        map[item.id] = {
          score,
          meta: {
            lastVisit: {
              time: item.value,
              index,
              score
            }
          }
        };
      }
    );
    return map;
  }

  __getUrlVisitScore(ids) {
    const map = {};
    const items = ids.map(id => ({
      id,
      value: this.urlVisitCount[id]
    }));
    Heap.nlargest(items, WEIGHTS.totalUrl.length, cmp).forEach(
      (item, index) => {
        const score = WEIGHTS.totalUrl[index];
        map[item.id] = {
          score,
          meta: {
            urlVisit: {
              count: item.value,
              index,
              score
            }
          }
        };
      }
    );
    return map;
  }

  __getHostVisitScore(ids) {
    const map = {};
    const items = ids.map(id => {
      const host = getHostname(this.pages[id].url);
      return {
        id,
        host,
        value: this.hostVisitCount[urlToId(host)]
      };
    });
    Heap.nlargest(items, WEIGHTS.totalHost, cmp).forEach((item, index) => {
      const score = WEIGHTS.totalHost[index];
      map[item.id] = {
        score,
        meta: {
          hostVisit: {
            host: item.host,
            count: item.value,
            index,
            score
          }
        }
      };
    });
    return map;
  }

  async __getTabScore(ids) {
    const allTabs = await getAllTabs();
    const exists = {};
    allTabs.forEach(tab => {
      exists[urlToId(tab.url)] = true;
    });
    const map = {};
    ids.forEach(id => {
      if (exists[id]) {
        map[id] = {
          score: WEIGHTS.tab,
          meta: {
            tab: {
              score: WEIGHTS.tab
            }
          }
        };
      }
    });
    return map;
  }

  __mergeMap(maps) {
    const ret = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const map of maps) {
      Object.entries(map).forEach(([id, value]) => {
        if (ret[id]) {
          ret[id].score += value.score;
          ret[id].meta = { ...ret[id].meta, ...value.meta };
        } else {
          ret[id] = {
            score: value.score,
            meta: value.meta
          };
        }
      });
    }
    return ret;
  }

  buildRecent() {
    const entries = Heap.nlargest(
      _.toPairs(this.lastVisit),
      RECENT_SIZE,
      (a, b) => a[1] - b[1]
    );
    this.recents = entries.map(entry => ({ id: entry[0], time: entry[1] }));
  }

  async search(text, excludeUrl) {
    const excludeId = urlToId(excludeUrl);
    if (!text) {
      return this.recents
        .filter(recent => recent.id !== excludeId)
        .slice(0, 6)
        .map(recent => this.pages[recent.id]);
    }
    const titleMatch = await this.titleIndex.search(text);
    const urlMatch = await this.urlIndex.search(text);

    const titleMatchScore = this.__getTitleMatchScore(titleMatch, excludeId);
    const urlMatchScore = this.__getUrlMatchScore(urlMatch, excludeId);

    const map = this.__mergeMap([titleMatchScore, urlMatchScore]);
    const keys = _.keys(map);
    const lastVisitScore = this.__getLastVisitScore(keys);
    const urlVisitScore = this.__getUrlVisitScore(keys);
    const hostVisitScore = this.__getHostVisitScore(keys);
    const tabScore = await this.__getTabScore(keys);
    const merged = this.__mergeMap([
      map,
      lastVisitScore,
      urlVisitScore,
      hostVisitScore,
      tabScore
    ]);

    const entries = Heap.nlargest(
      _.toPairs(merged),
      6,
      (a, b) => a[1].score - b[1].score
    );
    console.log('search result: ', entries);
    return entries.map(([id]) => this.pages[id]);
  }
}

export const database = new Database();

chrome.database = database;
