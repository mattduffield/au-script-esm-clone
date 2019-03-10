import {DialogController} from '../../lib/aurelia.full.esm.js';

export class ConfirmDialog {
  static inject() {
    return [DialogController];
  }
  
  constructor(controller) {
    this.controller = controller;
  }
  activate(modelOrMessage) {
    if (typeof modelOrMessage === 'string') {
      this.message = modelOrMessage;
    } else if (typeof modelOrMessage === 'object') {
      this.message = modelOrMessage && modelOrMessage.message;
    } else {
      this.message = defaultMessage;
    }
  }
  ok(value) {
    this.controller.ok(value);
  }
  cancel() {
    this.controller.cancel();
  }
}
