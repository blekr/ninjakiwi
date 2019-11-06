import { contentCom } from '../../communication/content';
import { colorString } from '../tools';

export function search(text) {
  return async (dispatch, getState) => {
    const {
      opener: { url }
    } = getState();
    let colored;
    const pages = await contentCom.callBackground('SEARCH', {
      text,
      excludeUrl: url
    });
    const refinedText = text
      .replace(/^ */, '')
      .replace(/ *$/, '')
      .replace(/ +/g, ' ');
    if (refinedText) {
      const keywords = refinedText.split(' ');
      colored = pages.map(page => ({
        ...page,
        coloredTitle: colorString(page.title, keywords),
        coloredUrl: colorString(page.url, keywords)
      }));
    } else {
      colored = pages.map(page => ({
        ...page,
        coloredTitle: page.title,
        coloredUrl: page.url
      }));
    }
    dispatch({
      type: 'SET_PAGES',
      data: { pages: colored }
    });
  };
}
