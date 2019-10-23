import FlexSearch from 'flexsearch';
import _ from 'lodash';
import Heap from 'heap';
import { normalize, urlToId } from './tools';
import { getCurrentTab } from '../tools';

/*
id
url
favicon
title
screenImg
*/
function cmp(a, b) {
  return a.value - b.value;
}

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

  updatePhoto(id, photo) {
    if (!this.pages[id]) {
      throw new Error(`${id} not found`);
    }
    this.pages[id].screenImg = photo;
  }

  setLastVisit(id, time) {
    if (this.lastVisit[id]) {
      if (time > this.lastVisit[id]) {
        this.lastVisit[id] = time;
      }
    } else {
      this.lastVisit[id] = time;
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

  __getTitleMatchScore(titleMatch) {
    const map = {};
    titleMatch.forEach((id, index) => {
      let score = 1;
      if (index < 3) {
        score += [3, 2, 1][index];
      }
      map[id] = score;
    });
    return map;
  }

  __getUrlMatchScore(urlMatch) {
    const map = {};
    urlMatch.forEach((id, index) => {
      let score = 0;
      if (index < 2) {
        score += [2, 1][index];
      }
      map[id] = score;
    });
    return map;
  }

  __getLastVisitScore(ids) {
    const map = {};
    const lastVisits = ids.map(id => ({
      id,
      value: this.lastVisit[id]
    }));
    Heap.nlargest(lastVisits, 2, cmp).forEach((item, index) => {
      map[item.id] += [2, 1][index];
    });
    return map;
  }

  __getUrlVisitScore(ids) {
    const map = {};
    const items = ids.map(id => ({
      id,
      value: this.urlVisitCount[id]
    }));
    Heap.nlargest(items, 1, cmp).forEach((item, index) => {
      map[item.id] += [1][index];
    });
    return map;
  }

  __getHostVisitScore(ids) {
    const map = {};
    const items = ids.map(id => ({
      id,
      value: this.hostVisitCount[id]
    }));
    Heap.nlargest(items, 2, cmp).forEach((item, index) => {
      map[item.id] += [2, 1][index];
    });
    return map;
  }

  __mergeMap(maps) {
    const ret = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const map of maps) {
      _.keys(map).forEach(key => {
        if (ret[key]) {
          ret[key] += map[key];
        } else {
          ret[key] = map[key];
        }
      });
    }
    return ret;
  }

  async search(text) {
    if (!text) {
      const entries = Heap.nlargest(
        _.toPairs(this.lastVisit),
        7,
        (a, b) => a[1] - b[1]
      );
      return entries.map(entry => this.pages[entry[0]]);
    }
    const titleMatch = await this.titleIndex.search(text);
    const urlMatch = await this.urlIndex.search(text);

    const titleMatchScore = this.__getTitleMatchScore(titleMatch);
    const urlMatchScore = this.__getUrlMatchScore(urlMatch);

    const map = this.__mergeMap([titleMatchScore, urlMatchScore]);
    const lastVisitScore = this.__getLastVisitScore(_.keys(map));
    const urlVisitScore = this.__getUrlVisitScore(_.keys(map));
    const hostVisitScore = this.__getHostVisitScore(_.keys(map));
    const merged = this.__mergeMap([
      map,
      lastVisitScore,
      urlVisitScore,
      hostVisitScore
    ]);

    const entries = Heap.nlargest(_.toPairs(merged), 7, (a, b) => a[1] - b[1]);
    return entries.map(([id]) => this.pages[id]);
  }
}

export const database = new Database();

chrome.database = database;
