import { combineReducers } from 'redux';
import pageReducer from './pageReducer';
import manipulateReducer from './manipulate';

export default combineReducers({
  page: pageReducer,
  manipulate: manipulateReducer
});
