import { contentCom } from '../../communication/content';

export function search(text) {
  return async dispatch => {
    const pages = await contentCom.callBackground('SEARCH', { text });
    dispatch({
      type: 'SET_PAGES',
      data: { pages }
    });
    // Get favicon for each page.
    pages.forEach(page => {
      if (page.favicon.indexOf('http') === 0) {
        dispatch({
          type: 'SET_FAVICON',
          data: {
            id: page.id,
            favicon: page.favicon
          }
        });
      }
      if (page.favicon.indexOf('chrome://favicon/') === 0) {
        (async () => {
          const dataUrl = await contentCom.callBackground('GET_FAVICON', {
            url: page.favicon
          });
          dispatch({
            type: 'SET_FAVICON',
            data: {
              id: page.id,
              favicon: dataUrl
            }
          });
        })();
      }
    });
  };
}
