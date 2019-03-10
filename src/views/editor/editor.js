/**
 * https://jsfiddle.net/robertrozas/r1b9hbhk/
 * https://www.npmjs.com/package/emmet
 * https://unpkg.com/emmet@1.6.3/
 * We are currently using this version of Emmet for Monaco:
 * https://github.com/troy351/emmet-monaco-es
 */
import {emmetHTML, emmetCSS} from '../../../lib/vendors/emmet-monaco-esm.js';
import {NProgress} from '../../../lib/thirdparty.js';
import environment from '../../environment.js';
const {baseUrl} = environment;

export class Editor {
  constructor() {
    this.modes = [];
    this.selectedLanguage = null;
    this.monacoSrc = `${window.location.origin}${baseUrl}monaco-editor.html`;
  }
  attached() {
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }
  detached() {
    window.removeEventListener('message', this.receiveMessage.bind(this), false);
  }
  loadJS() {
    const mode = 'javascript';
    const code = `
export class Test {

  constructor() {

  }
}
    `.trim();
    window.monaco.editor.setModelLanguage(window.monacoEditor.getModel(), mode);
    window.monacoEditor.setValue(code);
  }
  loadHTML() {
    const mode = 'html';
    const code = `
<template>
  <section>
    <style>
      .flex-column-1 {
        display: flex;
        flex-flow: column;
        flex: 1;
      }
      .iframe-component {
        border: none;
        position: absolute;
        top: 65px;
        /* top: 0; */
        left: 0;
        right: 0;
        bottom: 0;
        /* height: calc(100% - 50px); */
        height: 100%;
        width: 100%;
      }
    </style>
    <h3>
      <a class="nav-back" href="#home"><i class="fas fa-arrow-alt-circle-left"></i></a>
      Welcome to the Editor View!
    </h3>
    <iframe class="iframe-component"
      frameborder="0"
      scrolling="no"
      src="\${monacoSrc}">
    </iframe>
  </section>
</template>
    `.trim();
    window.monaco.editor.setModelLanguage(window.monacoEditor.getModel(), mode);
    window.monacoEditor.setValue(code);
  }
  /* Post Message */
  receiveMessage(event) {
    // console.log('messaged received: ', event);
    if (event.data === 'editor-ready') {
      let MODES = (() => {
        let modesIds = monaco.languages.getLanguages().map((lang) => { return lang.id; });
        modesIds.sort();

        return modesIds.map((modeId) => {
          return {
            modeId: modeId,
            sampleURL: 'https://microsoft.github.io/monaco-editor/index/samples/sample.' + modeId + '.txt'
          };
        });
      })();
      MODES.forEach(m => this.modes.push(m));
      this.selectedLanguage = MODES[14];
      this.languageChanged(MODES[14]);
      // this.loadJS();
      // this.loadHTML();
      const dispose = emmetHTML(
        // monaco editor instance,
        // i.e. instance created by monaco.editor.create()
        window.monacoEditor,
        // monaco-editor it self. If not provided, will use window.monaco instead.
        // This could make the plugin support both ESM and AMD loaded monaco-editor
        window.monaco
      );
    }
  }
  languageChanged(mode) {
    NProgress.start();
    window.monaco.editor.setModelLanguage(window.monacoEditor.getModel(), mode.modeId);

    const request = new Request(mode.sampleURL, {method: 'GET'});
    return fetch(request).then(async response => {
      const data = await response.text();
      const oldModel = window.monacoEditor.getModel();
      const newModel = window.monaco.editor.createModel(data, mode.modeId);
      setTimeout(() => {
        window.monacoEditor.setModel(newModel);
        if (oldModel) {
          oldModel.dispose();
        }
        NProgress.done();
      },100);
    });
  }
}
