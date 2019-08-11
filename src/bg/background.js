import { backgroundCom } from '../communication/background';
import { database } from './database';

backgroundCom.handle('SEARCH', key => database.search(key));
