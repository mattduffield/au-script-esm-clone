import {NProgress, Split} from '../lib/thirdparty.js';
import {AppService} from './services/app-service.js';
import {DialogService} from './services/dialog-service.js';
import environment from './environment.js';
const {baseUrl} = environment;
// 1234321
export class App {
  static inject() {
    return [AppService, DialogService];
  }
  constructor(appSvc, dlgSvc) {
    this.appSvc = appSvc;
    this.dlgSvc = dlgSvc;
  }
  async activate() {
  }
  attached() {
    console.log('NProgress', NProgress);
    console.log('Split', Split);
    NProgress.start();
    setTimeout(() => {
      NProgress.done();
    }, 5000);
  }
  
  configureRouter(config, router) {
    console.log('configuring router...');

    config.map([
      {
        route: ["", "home"],
        moduleId: `${baseUrl}src/views/home/home.js`,
        nav: true,
        title: "Home"
      },
      {
        route: "dynamic",
        moduleId: `${baseUrl}src/views/dynamic/dynamic.js`,
        nav: true,
        title: "Dynamic"
      },
      {
        route: "contacts",
        moduleId: `${baseUrl}src/views/contacts/contacts.js`,
        nav: true,
        title: "Contacts"
      },
      {
        route: "example",
        moduleId: `${baseUrl}src/views/example/example.js`,
        nav: true,
        title: "Example"
      },
      {
        route: "editor",
        moduleId: `${baseUrl}src/views/editor/editor.js`,
        nav: true,
        title: "Editor"
      },
      {
        route: "diff-editor",
        moduleId: `${baseUrl}src/views/diff-editor/diff-editor.js`,
        nav: true,
        title: "DiffEditor"
      },
      {
        route: "invoices",
        moduleId: "__component__/invoice.js",
        nav: true,
        title: "Invoices"
      }
    ]);

    this.router = router;
    // Comment the following lines out if you don't wanna use push state
    // and just use simple # base routing instead
    // config.options.pushState = true;
    // config.options.root = "/";
  }
  closeModal() {
    this.appSvc.showModal = false;
  }
}
