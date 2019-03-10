/**
 * 
 * https://github.com/Microsoft/monaco-editor/blob/master/test/playground.generated/creating-the-diffeditor-inline-diff-example.html
 */
import environment from '../../environment.js';
const {baseUrl} = environment;

export class DiffEditor {
  constructor() {
    this.modesIds = [];
    this.selectedLanguage = null;
    this.monacoSrc = `${window.location.origin}${baseUrl}monaco-diff-editor.html`;
  }
  attached() {
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }
  detached() {
    window.removeEventListener('message', this.receiveMessage.bind(this), false);
  }
  loadDiff() {
    const original = `
export class Test {

  constructor() {

  }
  attached() {
    
  }
}
    `.trim();
    const modified = `
import {Resource} from './resource.js';

export class Test {
  static inject() {
    return [Resource];
  }
  constructor(resource) {
    this.resource = resource;
  }
}
    `.trim();
    
    let originalModel = window.monaco.editor.createModel(original, 'javascript');
    let modifiedModel = window.monaco.editor.createModel(modified, 'javascript');

    window.monacoEditor.setModel({
      original: originalModel,
      modified: modifiedModel
    });
  }
  /* Post Message */
  receiveMessage(event) {
    // console.log('messaged received: ', event);
    if (event.data === 'diff-editor-ready') {
      this.loadDiff();
    }
  }
}
