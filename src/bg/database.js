import values from 'lodash/values';
import filter from 'lodash/filter';
import FlexSearch from 'flexsearch';
import _ from 'lodash';
import { normalize } from './tools';

/*
id
url
favicon
title
screenImg
*/

const RESOLUTION = 10000;
const TITLE_WEIGHT = 30;
const URL_WEIGHT = 10;

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
  }

  addPage(page) {
    const title = normalize(page.title);
    // double calls to decode deeply encoded url embed in page.url
    const url = normalize(decodeURIComponent(decodeURIComponent(page.url)));
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

  search(text) {
    console.log('------s')
    if (!text) {
      console.log(
        '------returning: ',
        _.keys(this.pages)
          .slice(0, 6)
          .map(key => this.pages[key])
      );
      return _.keys(this.pages)
        .slice(0, 6)
        .map(key => this.pages[key]);
    }
    const titleMatch = this.titleIndex.search(text);
    const urlMatch = this.urlIndex.search(text);
    return _.uniq(titleMatch.concat(urlMatch))
      .slice(0, 6)
      .map(key => this.pages[key]);
  }
}

export const database = new Database();

chrome.database = database;
