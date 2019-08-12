import { contentCom } from '../../communication/content';

export function search(text) {
  return async dispatch => {
    // const tabs = await contentCom.callBackground('SEARCH', { text });
    dispatch({
      type: 'SET_TABS',
      data: { tabs: [] }
    });
  };
}
