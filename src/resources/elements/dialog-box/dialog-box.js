import {customElement, bindable, ObserverLocator} from '../../../../lib/aurelia.full.esm.js';

export class DialogBox {
  static inject() {
    return [Element];
  }
  constructor(element) {
    this.element = element;
    this.isVisible = false;
  }
  isVisibleChanged(newValue) {
    const dlg = this.element.querySelector('dialog');
    if (newValue) {
      dlg.setAttribute('open', '');
    } else {
      dlg.removeAttribute('open');
    }
  }
  open() {
    const dlg = this.element.querySelector('dialog');
    dlg.show();
    // dlg.setAttribute('open', '');
  }
  close() {
    const dlg = this.element.querySelector('dialog');
    dlg.close();
    // dlg.removeAttribute('open');
  }
}
customElement('dialog-box')(DialogBox);
bindable('isVisible')(DialogBox);
