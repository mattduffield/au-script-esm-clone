// import { Aurelia, Loader } from 'https://unpkg.com/aurelia-script@1.3.1/dist/aurelia_router.esm.min.js';
// import { MultiSelect } from '../lib/plugins.js';
import { Aurelia, Loader, ViewLocator } from '../lib/aurelia.full.esm.js';
import environment from './environment.js';
const {baseUrl} = environment;

(async () => {
  const aurelia = new Aurelia();
  aurelia.environment = environment;
  // aurelia.container.get(Loader).baseUrl = `${location.origin}${baseUrl}`;
  // aurelia.container.registerTransient(MultiSelect, MultiSelect);
  aurelia
    .use
      .standardConfiguration()
      .developmentLogging()
      .dialog(cfg => {})
      .feature(`${baseUrl}src/resources/index.js`)
      // .plugin(`${baseUrl}lib/multi-select/index.js`)
      .plugin(`${baseUrl}lib/vendors/Cleave/index.js`);

  // ViewLocator.prototype.convertOriginToViewUrlOriginal = ViewLocator.prototype.convertOriginToViewUrl;
  // ViewLocator.prototype.convertOriginToViewUrl = (origin) => {
  //   origin.moduleId = `${baseUrl}${origin.moduleId}`;
  //   return ViewLocator.prototype.convertOriginToViewUrlOriginal(origin);
  // };

  aurelia
    .start()
    .then(() => {
      aurelia.setRoot(`${baseUrl}src/app.js`, document.body);
    })
    .catch(ex => {
      document.body.textContent = `Bootstrap error: ${ex}`;
    });
})();
