import filter from 'lodash/filter';
import { contentCom } from '../../communication/content';

export function search(text) {
  return async (dispatch, getState) => {
    const {
      opener: { url }
    } = getState();
    const pages = await contentCom.callBackground('SEARCH', { text });
    const filtered = filter(pages, page => page.url !== url);
    console.log('------', pages, url, filtered);
    dispatch({
      type: 'SET_PAGES',
      data: { pages: filtered.slice(0, 6) }
    });
  };
}
