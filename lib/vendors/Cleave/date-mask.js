import {customAttribute, bindable, DOM} from '../../aurelia.full.esm.js';

/**
 *  Name: date-mask
 *  Desc: This is an date mask custom attribute.
 *  Usage: <input date-mask>
 */
// @customAttribute('date-mask')
export class DateMask {
  static inject() {
    return [DOM.Element];
  }

  constructor(element) {
    this.element = element;

    if (element instanceof HTMLInputElement) {
      this.element = element;
    } else {
      throw new Error('The input-mask attribute can only be applied on Input elements.');
    }
  }
  bind(ctx) {
    let cleave = new Cleave(this.element, {
      date: true,
      datePattern: ['m', 'd', 'Y']
    });
  }
}
customAttribute('date-mask')(DateMask);
