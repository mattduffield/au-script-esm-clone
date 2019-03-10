//https://jsfiddle.net/8qmbywr1/1/
import {Split} from '../../../lib/thirdparty.js';
import environment from '../../environment.js';
const {baseUrl} = environment;

export class Contacts {
  constructor() {
    this.message = "This is Contacts route..";
  }
  attached() {
    Split(['#one', '#two'], {sizes: [46, 46]});
  }
}
