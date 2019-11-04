import filter from 'lodash/filter';
import { contentCom } from '../../communication/content';
import { colorString } from '../tools';

export function search(text) {
  return async (dispatch, getState) => {
    const {
      opener: { url }
    } = getState();
    let colored;
    const pages = await contentCom.callBackground('SEARCH', { text });
    const filtered = filter(pages, page => page.url !== url);
    const refinedText = text
      .replace(/^ */, '')
      .replace(/ *$/, '')
      .replace(/ +/g, ' ');
    if (refinedText) {
      const keywords = refinedText.split(' ');
      console.log('---keywords', keywords, colorString('2019年李毅教授暢談兩岸統一模式 全程高能(下集) - YouTube', ['2019']))
      colored = filtered.map(page => ({
        ...page,
        coloredTitle: colorString(page.title, keywords),
        coloredUrl: colorString(page.url, keywords)
      }));
    } else {
      colored = filtered.map(page => ({
        ...page,
        coloredTitle: page.title,
        coloredUrl: page.url
      }));
    }
    dispatch({
      type: 'SET_PAGES',
      data: { pages: colored.slice(0, 6) }
    });
  };
}
