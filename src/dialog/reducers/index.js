import { combineReducers } from 'redux';
import pageReducer from './pageReducer';
import manipulateReducer from './manipulate';
import faviconReducer from './favicon';
import openerReducer from './opener';
import inputReducer from './input';

export default combineReducers({
  page: pageReducer,
  favicon: faviconReducer,
  manipulate: manipulateReducer,
  opener: openerReducer,
  input: inputReducer
});
