import { combineReducers } from 'redux';
import pageReducer from './pageReducer';
import manipulateReducer from './manipulate';
import faviconReducer from './favicon'

export default combineReducers({
  page: pageReducer,
  favicon: faviconReducer,
  manipulate: manipulateReducer
});
