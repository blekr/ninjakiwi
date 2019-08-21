import { contentCom } from '../../communication/content';

export function search(text) {
  return async dispatch => {
    const pages = await contentCom.callBackground('SEARCH', { text });
    console.log('----page', pages);
    dispatch({
      type: 'SET_PAGES',
      data: { pages }
    });
  };
}
