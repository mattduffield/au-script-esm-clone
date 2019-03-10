import {customElement, bindable, ObserverLocator} from '../../../../lib/aurelia.full.esm.js';

// @customElement('list-box')
export class ListBox {
  static inject() { 
    return [Element];
  }
  // static resource () {
  //   return {
  //     name: 'list-box',
  //     containerless: false,
  //     bindables: ['options', 'displayMember', 'initialValues', 'selectedValues']
  //   };
  // }
  constructor(element) {
    this.element = element;
    this.options = [];
    this.displayMember = 'name';
    this.initialValues = [];
    this.selectedValues = [];
  }
  attached() {
    const options = this.element.querySelectorAll('option');
    this.initialValues.forEach(v => {
      Array.from(options).forEach(o => {
        if (o.model._id.$oid === v._id.$oid) {
          o.selected = true;
        }
      });
    });
  }
}
customElement('list-box')(ListBox);
bindable('options')(ListBox);
bindable('displayMember')(ListBox);
bindable('initialValues')(ListBox);
bindable('selectedValues')(ListBox);
