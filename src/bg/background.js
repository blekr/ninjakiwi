import { backgroundCom } from '../communication/background';
import { database } from './database';

backgroundCom.handle('SEARCH', text => database.search(text));
