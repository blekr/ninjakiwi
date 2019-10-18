import keyBy from 'lodash/keyBy';
import get from 'lodash/fp/get';
import map from 'lodash/map';

const initState = {
  mode: 'INPUT', // COMMAND
  index: 0
};

export default function(state = initState, { type, data } = {}) {
  switch (type) {
    case 'SET_MODE': {
      const { mode } = data;
      return {
        ...state,
        mode
      };
    }

    case 'SET_INDEX': {
      const { index } = data;
      return {
        ...state,
        index
      };
    }

    default:
      return state;
  }
}
