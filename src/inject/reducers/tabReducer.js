import keyBy from 'lodash/keyBy';
import get from 'lodash/fp/get';
import map from 'lodash/map';

export default function(state = { tabs: {}, tabIds: [] }, { type, data } = {}) {
  switch (type) {
    case 'SET_TABS': {
      const { tabs } = data;
      return {
        tabs: {
          ...state.tabs,
          ...keyBy(tabs, get('id'))
        },
        tabIds: map(tabs, get('id'))
      };
    }

    default:
      return state;
  }
}
