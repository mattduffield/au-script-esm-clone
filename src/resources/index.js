/**
 * The following are links that discuss dealing with global resources:
 * https://github.com/aurelia/ux/pull/147
 * https://github.com/aurelia/framework/pull/858
 * 
 * https://github.com/aurelia/ux/pull/175
 * 
 * 
 */

// import environment from '../environment.js';
// const {baseUrl} = environment;
// import {ListBox} from '/au-script-esm/src/resources/elements/list-box/list-box.js';

export function configure(config) {
  // This is an example of ensuring the environment is from the config.aurelia object.
  // This becomes important for scenarios when we hare hosting on GitHub Pages and the
  // origin is not our site. This would allow `plugins` to still adjust for the correct
  // resource path regardless of where it is being hosted.
  const {baseUrl} = config.aurelia.environment ? config.aurelia.environment : {baseUrl: '/'};

  config.globalResources(
    `${baseUrl}src/dialogs/confirm-dialog.js`,
    // `${baseUrl}src/resources/attributes/input-mask/input-mask.js`,
    `${baseUrl}src/resources/elements/list-box/list-box.js`,
    `${baseUrl}src/resources/elements/dialog-box/dialog-box.js`,
    `${baseUrl}src/views/contacts/contacts.js`,
    `${baseUrl}src/resources/value-converters/date.js`
  );
  // config.globalResources(
  //   ListBox,
  // );
}
