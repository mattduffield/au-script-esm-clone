import {customAttribute, bindable, DOM} from '../../aurelia.full.esm.js';

/**
 *  Name: input-mask
 *  Desc: This is an input mask custom attribute.
 *  Usage: <input input-mask="context.bind: $this; prop: birth_date; type: date;"
 *    type="tel" 
 *    placeholder="MM/DD/YYYY">
 *  Sample patterns:
 *    /^(?!000000000)(?!111111111)(?!222222222)(?!333333333)(?!444444444)(?!555555555)(?!666666666)(?!777777777)(?!888888888)(?!999999999)((0[0-9])|(1[0-2])|(2[1-9])|(3[0-2])|(6[1-9])|(7[0-2])|80)([0-9]{7})$/
 *    '####-##-##'
 *    '(###) ###-####'
 *    '##:##'
 */
// @customAttribute('input-mask')
export class InputMask {
  static inject() {
    return [DOM.Element];
  }

  constructor(element) {
    this.element = element;
    this.type = 'date';
    this.context;
    this.pattern = ''; // '####-##-##' or '(###) ###-####' or '##:##'
    this.prop = '';

    if (element instanceof HTMLInputElement) {
      this.element = element;
    } else {
      throw new Error('The input-mask attribute can only be applied on Input elements.');
    }
  }
  bind(ctx) {
    if (this.type === 'date') {
      let cleave = new Cleave(this.element, {
        date: true,
        datePattern: ['m', 'd', 'Y']
      });
    }
    this.onFocus();
    
    this.element.addEventListener('focus', this.onFocus.bind(this));
    this.element.addEventListener('blur', this.onBlur.bind(this));
  }
  unbind() {
    this.element.removeEventListener('focus', this.onFocus.bind(this));
    this.element.removeEventListener('blur', this.onBlur.bind(this));
  }  
  onBlur(e) {
    const target = this.element;
    // const {target} = e;
    if (target.value) {
      if (this.type === 'date') {
        this.blurDate(target.value);
      }
    }
  }
  onFocus(e) {
    const target = this.element;
    // const {target} = e;
    if (this.type === 'date') {
      this.focusDate(target);
    }
  }
  pluckValue(obj = null, path = '') { 
    const paths = path.split('.'); 
    if (obj) {
      for (let p of paths) {
        if (!obj[p]) return null;
        obj = obj[p];
      }
    }
    return obj; 
  }
  setValue(obj = null, path = '', value) {
    const paths = path.split('.'); 
    const last = paths.pop();
    if (obj) {
      for (let p of paths) {
        if (!obj[p]) return null;
        obj = obj[p];
      }
    }
    obj[last] = value;
  }
  blurDate(value) {
    const {context, prop, setValue} = this;
    const date = Date.parse(value);
    if (date !== NaN) {
      if (context && prop) {
        setValue(context, prop, new Date(date).toISOString());
      }
    }
  }
  focusDate(target) {
    const {context, prop, pluckValue} = this;
    if (context && prop) {
      const value = pluckValue(context, prop);
      const date = Date.parse(value);
      if (value && date !== NaN) {
        const dt = new Date(date);
        const y = dt.getFullYear();
        const m = dt.getMonth() + 1;
        const d = dt.getDate();
        target.value = `${m.toString().padStart(2, '0')}/${d.toString().padStart(2, '0')}/${y}`;
      }
    }
  }
}
customAttribute('input-mask')(InputMask);
bindable('type')(InputMask);
bindable('context')(InputMask);
bindable('prop')(InputMask);
bindable('pattern')(InputMask);
