import filter from 'lodash/filter'
import { contentCom } from '../../communication/content';
import { getCurrentTab } from '../tools';

export function search(text) {
  return async dispatch => {
    const pages = await contentCom.callBackground('SEARCH', { text });
    const currentTab = await getCurrentTab();
    const filtered = filter(pages, page => page.url !== currentTab.url)
    dispatch({
      type: 'SET_PAGES',
      data: { pages: filtered.slice(0, 6) }
    });
  };
}
