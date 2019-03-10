// import {Aurelia} from 'https://unpkg.com/aurelia-script@1.3.1/dist/aurelia_router.esm.min.js';
import {DialogService} from '../../../lib/aurelia.full.esm.js';
import {AppService} from '../../services/app-service.js';
import {ConfirmDialog} from '../../dialogs/confirm-dialog.js';
import environment from '../../environment.js';
const {baseUrl} = environment;
// import { MultiSelect } from '../../../lib/plugins.js';

export class Home {
  static inject() {
    return [AppService];
  }
  static inject() {
    return [AppService, DialogService];
  }
  constructor(appSvc, dialogSvc) {
    this.appSvc = appSvc;
    this.dialogSvc = dialogSvc;
    this.members = [
      {name: 'matt', display: 'Matt'},
      {name: 'dean', display: 'Dean'},
      {name: 'duncan', display: 'Duncan'}
    ];
    this.initialMembers = [];
    this.selectedMembers = [];
  }
  showDialog() {
    console.log('launching dialog...');
    // this.appSvc.showModal = true;
    // setTimeout(() => {
    //   this.appSvc.showModal = false;
    // }, 2000);
    let model = {};
    this.dialogSvc.open({ viewModel: ConfirmDialog, model: model, lock: false });
  }
  async buildMap() {
    const getFiles = (rootDir, path) => {
      let paths = path.replace('/', '').split('/');
      let obj = rootDir;
      let partial = [];
      for (let p of paths) {
        partial.push(p);
        const pp = `/${partial.join('/')}`;
        obj = obj.files.find(f => f.path === pp && f.type === 'directory');
      }
      let names = obj.files.map(f => f.path);
      const left = obj.files.filter(f => f.type === 'directory');
      for (let l of left) {
        l.files.map(f => f.path).forEach(f => names.push(f));
        // const ll = l.files.map(f => f.path);
        // ll.forEach(f => names.push(f));
        // ...or...
        // names = [...names, ...ll];
      }
      return names.filter(f => f.endsWith('.js'));
    };

    return new Promise(async (resolve, reject) => {
      // read the package.json file
      const url = 'https://unpkg.com/aurelia-dialog@2.0.0-rc.5/';
      // const url = 'https://unpkg.com/aurelia-framework@1.3.1/package.json';
      const rootUris = [];
      rootUris.push(fetch(`${url}package.json`));
      rootUris.push(fetch(`${url}?meta`));

      return Promise.all(rootUris).then(async rootValues => {
        const rootPkg = await rootValues[0].json();
        const rootDir = await rootValues[1].json();
        const packageName = rootPkg.name;
        const data = rootPkg;
        const names = getFiles(rootDir, '/dist/es2015');
        const files = {url, files: names};

        // We are interested in the dependencies section.
        const uris = [];
        for (const [key, value] of Object.entries(data.dependencies)) {
          // console.log(`${key} ${value}`);
          // Load package.json e.g. https://unpkg.com/lodash@4.17.4/package.json
          // Load manifest /?jmeta e.g. https://unpkg.com/lodash@4.17.4/?meta
          const pkgUri = `https://unpkg.com/${key}@${value}/package.json`;
          uris.push(fetch(pkgUri));
          const jsonUri = `https://unpkg.com/${key}@${value}/?meta`;
          uris.push(fetch(jsonUri));
        }
        return Promise.all(uris).then(async values => {
          const map = {};
          const meta = {};

          for (let i = 0; i < values.length - 1; i += 2) {
            const pkg = await values[i].json();
            const dir = await values[i + 1].json();
            // console.log('pkg', pkg);
            // console.log('dir', dir);
            let {main, module, name, version, dependencies, peerDependencies} = pkg;
            const deps = {};
            if (dependencies && Object.keys(dependencies).length > 0) {
              Object.keys(dependencies).forEach(d => {
              // Now load the main entry e.g. https://unpkg.com/lodash@4.17.4/lodash.js
              // const valueUri = `npm:${name}@${version}/${main}`;
                deps[d] = `https://unpkg.com/${d}@${dependencies[d].replace('^', '')}/`;
              });
            } else if (peerDependencies && Object.keys(peerDependencies).length > 0) {
              Object.keys(peerDependencies).forEach(d => {
              // Now load the main entry e.g. https://unpkg.com/lodash@4.17.4/lodash.js
              // const valueUri = `npm:${name}@${version}/${main}`;
                deps[d] = `https://unpkg.com/${d}@${peerDependencies[d].replace('^', '')}/`;
              });
            }
            const depObj = {
              url: `https://unpkg.com/aurelia-script@1.3.1/dist/aurelia_router.esm.js`
              // baseUrl: `https://unpkg.com/${name}@${version}/`,
              // url: `https://unpkg.com/${name}@${version}/${module || main}`,
              // dependencies: deps
            }
            meta[name] = depObj;
          }
          console.log(JSON.stringify({packageName, files, dependencies:meta}, null, 2));
          return resolve({packageName, files, meta});
        });
      });
    });
  }
}
