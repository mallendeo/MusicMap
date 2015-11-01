import Dexie     from 'dexie';
import * as util from './util';

export default class Database {

  constructor () {
    this.db = new Dexie('Youtify');
    this.db.version(1).stores({ config: '++id,prop,value' });
    this.db.open();

    this.getConfig('dbInitialized').then(data => {
      if (!data) {
        this.setDefaults();
        return;
      }
    });
  }

  setDefaults () {
    let props = {
      'searchGlobal': false,
      'showOnlyOnMusicVideos': true,
      'hideIfNotFound': false,
      'retrySearch': false,
      'dbInitialized': true,
      'userToken': ''
    };

    for (let prop in props) {
      if (props.hasOwnProperty(prop)) {
        this.setConfig(prop, props[prop]);
      }
    }
  }

  setConfig (prop, value) {
    return this.db.config.put({ prop, value });
  }

  getConfig (prop) {
    return this.db.config.where('prop').equalsIgnoreCase(prop).last();
  }
}
