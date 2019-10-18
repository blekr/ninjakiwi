import keyBy from 'lodash/keyBy';
import get from 'lodash/fp/get';
import map from 'lodash/map';

export default function(
  state = { pages: {}, pageIds: [] },
  { type, data } = {}
) {
  switch (type) {
    case 'SET_PAGES': {
      const { pages } = data;
      return {
        pages: {
          ...state.pages,
          ...keyBy(pages, get('id'))
        },
        pageIds: map(pages, get('id'))
      };
    }

    default:
      return state;
  }
}
