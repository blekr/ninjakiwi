import { combineReducers } from 'redux';
import tabReducer from './tabReducer';

export default combineReducers({
  tab: tabReducer
});
