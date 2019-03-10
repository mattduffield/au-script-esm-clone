import {Aurelia, FrameworkConfiguration, Loader, ViewLocator} from '../../../lib/aurelia.full.esm.js';
import {DialogService} from '../../services/dialog-service.js';
import environment from '../../environment.js';
const {baseUrl} = environment;

let loaded = false;

export class Dynamic {
  static inject() {
    return [Aurelia, DialogService];
  }
  constructor(aurelia, dlgSvc) {
    this.aurelia = aurelia;
    this.dlgSvc = dlgSvc;
    this.isVisible = false;
  } 
  activate(params) {
    if (!loaded) {
      const config = new FrameworkConfiguration(this.aurelia);
      config
        .plugin(`${baseUrl}lib/multi-select/index.js`);
      loaded = true;
      return config.apply();
    }
  }
  async showDialog() {
    const result = await this.dlgSvc.open(`${baseUrl}src/dialogs/confirm-delete.html`);
    console.log('show result: ', result);
  }
  async showModalDialog() {
    const result = await this.dlgSvc.open(`${baseUrl}src/dialogs/confirm-delete.html`, true);
    console.log('showModal result: ', result);
  }
  // showDialog() {
  //   this.isVisible = !this.isVisible;
  //   // const dlg = document.querySelector('#dlgView');
  //   // console.log(dlg);
  //   // if (dlg.hasAttribute('open')) {
  //   //   dlg.removeAttribute('open');
  //   // } else {
  //   //   dlg.setAttribute('open', '');
  //   // }
  // }
}
