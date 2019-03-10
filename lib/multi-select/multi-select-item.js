import { customElement, bindable, inlineView } from '../aurelia.full.esm.js'; 

var MULTI_SELECT_ITEM_VIEW = "<template> <div class=multi-select-item> <span class=multi-select-item-label>${getItem(item)}</span> <span class=multi-select-item-icon click.delegate=removeOne($event)>x</span> </div> </template> ";

// @customElement('multi-select-item')
class MultiSelectItem {
  // @bindable item;
  // @bindable parent;

  constructor() {
    this.item = null;
    this.parent = null;
  }
  getItem(item) {
    return this.parent.getItem(item);
  }
  /**
   *  This function removes calls the parent viewmodel to removeOne.
   */
  removeOne(e) {
    e.stopPropagation();
    this.parent.removeOne(this.item);
  }
}
customElement('multi-select-item')(MultiSelectItem);
bindable('item')(MultiSelectItem);
bindable('parent')(MultiSelectItem);
inlineView(MULTI_SELECT_ITEM_VIEW)(MultiSelectItem);

// export {MultiSelect} from './resources/elements/multi-select/multi-select.js';

export { MultiSelectItem };
