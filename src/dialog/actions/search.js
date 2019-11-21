import { contentCom } from '../../communication/content';
import { colorString } from '../tools';

export function search(text) {
  return async (dispatch, getState) => {
    const {
      opener: { url }
    } = getState();

    const refinedText = text
      .replace(/^ */, '')
      .replace(/ *$/, '')
      .replace(/ +/g, ' ');

    const pages = await contentCom.callBackground('SEARCH', {
      text: refinedText,
      excludeUrl: url
    });

    let colored;
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
