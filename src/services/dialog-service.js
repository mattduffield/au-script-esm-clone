/**
 *  Name: dialog-service.js
 *  Desc: This uses the native HTML5 dialog element.
 * 
 *  Usage:
 * 
 *  References:
 *    https://alligator.io/html/dialog-element/
 *    https://keithjgrant.com/posts/2018/01/meet-the-new-dialog-element/
 *    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 * 
 *    https://github.com/GoogleChrome/dialog-polyfill
 */
export class DialogService {
  constructor() {
    this.view = '';
  }
  open(view, isModal = false) {
    return new Promise((resolve, reject) => {
      this.view = view;
      const dlg = document.querySelector('#dialog');
      dlg.addEventListener('click', event => {
        if (event.target === dlg) {
          dlg.close('cancelled');
        }
      });
      dlg.addEventListener('close', () => {
        const result = dlg.returnValue;
        dlg.returnValue = '';
        resolve(result);
      });
      if (isModal) {
        dlg.showModal();
      } else {
        dlg.show();
      }
    });
  }
  close(result = '') {
    const dlg = document.querySelector('#dialog');
    dlg.close(result);
    console.log('dialog close - result', result);
  }
}