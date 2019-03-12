import { customElement, bindable, inlineView } from './aurelia.full.esm.js';

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

var MULTI_SELECT_VIEW = "<template> <require from=./multi-select.css></require> <require from=./multi-select-item></require> <div class=\"multi-select is-multi is-searchable has-value\"> <div class=multi-select-control> <multi-select-item repeat.for=\"item of selectedOptions\" item.bind=item parent.bind=$parent> </multi-select-item> <input ref=dynamicOption spellcheck=false placeholder.bind=placeholder keydown.delegate=processKeydown($event) autocomplete=on class=multi-select-input list=multi-datalist> <datalist id=multi-datalist> <option repeat.for=\"word of options\">${word}</option> </datalist> <span class=multi-select-clear title=\"Clear all\" aria-label=\"Clear all\" click.delegate=removeAll($event)>x</span> </div> </div> </template>";

// @customElement('multi-select')
class MultiSelect {
  static inject() {
    return [Element];
  }
  constructor(element) {
    this.element = element;
    this.displayMember = '';
    this.valueMember = '';
    this.instanceOptions = [];
    this.selectedOptions = [];
    this.options = [];
    this.placeholder = '';
    // this.ms = ms;
  }
  attached() {
    // Need to remove existing selections
    this.selectedOptions.forEach(item => {
      if (this.valueMember) {
        const found = this.instanceOptions.find(f => this.pluckValue(f, this.valueMember) === item);
        this.removeFromOptions(found.name);
      } else {
        this.removeFromOptions(item);
      }
    });
  }
  /**
   *  The following is necessary to ensure that we have a unique copy for every instance
   *  of our control.
   */
  instanceOptionsChanged(newValue, oldValue) {
    if (this.instanceOptions) {
      this.options = [];
      if (this.displayMember) {
        const displayMembers = this.instanceOptions.map(m => m[this.displayMember]);
        this.options = [...displayMembers];
      } else {
        this.options = [...this.instanceOptions];
      }
    }
  }
  /**
   *  This function performs the selection of an item.
   */
  select(item) {
    if (this.valueMember) {
      const found = this.instanceOptions.find(f => f.name === item);
      this.selectedOptions.push(this.pluckValue(found, this.valueMember));
    } else {
      this.selectedOptions.push(item);
    }
    this.removeFromOptions(item);
    // this.hide();
  }
  /**
   *  This function removes a single item from the selectedOptions array.
   */
  removeOne(item) {
    // console.log('multi-selector:removeOne', item, this.selectedOptions);
    let index = this.selectedOptions.indexOf(item);
    this.selectedOptions.splice(index,1);
    if (this.valueMember) {
      const found = this.instanceOptions.find(f => this.pluckValue(f, this.valueMember) === item);
      this.addToOptions(found[this.displayMember]);
    } else {
      this.addToOptions(item);
    }
  }
  /**
   *  This function removes all items from the selectedOptions array.
   */
  removeAll(e) {
    e.stopPropagation();
    for (let i = this.selectedOptions.length - 1; i >= 0; i--) {
      let item = this.selectedOptions[i];
      this.removeOne(item);
    }
  }
  /**
   *  This function adds an item to the options array.
   */
  addToOptions(item) {
    let index = this.options.indexOf(item);
    if (index === -1) {
      this.options.push(item);
    }
  }  
  /**
   *  This function removes an item from the options array.
   */  
  removeFromOptions(item) {
    // console.log('multi-selector:removeFromOptions', item, this.options);
    let index = this.options.indexOf(item);
    if (index > -1) {
      this.options.splice(index,1);
    }
  }
  /**
   *  This function handles the keydown event. It checks for the 'enter'
   *  key and process the value; otherwise, it simply returns true.
   */
  processKeydown(e) {
    e.stopPropagation();
    if (e.key && e.key.toLowerCase() == 'enter' &&
      this.dynamicOption.value.length > 0) {
      this.select(this.dynamicOption.value);
      // this.selectedOptions.push(this.dynamicOption.value);
      this.dynamicOption.value = '';
      e.preventDefault();
    }
    return true;
  }
  getItem(item) {
    if (this.valueMember) {
      const found = this.instanceOptions.find(f => this.pluckValue(f, this.valueMember) === item);
      return found[this.displayMember];
    }
    return item;
  }
  pluckValue(obj = null, path = '') {
    const paths = path.split('.');
    if (obj) {
      for (let p of paths) {
        obj = obj[p];
      }
    }
    return obj; 
  }
}
customElement('multi-select')(MultiSelect);
bindable('displayMember')(MultiSelect);
bindable('valueMember')(MultiSelect);
bindable('instanceOptions')(MultiSelect);
bindable('selectedOptions')(MultiSelect);
bindable('placeholder')(MultiSelect);
inlineView(MULTI_SELECT_VIEW)(MultiSelect);

// import ms from './resources/elements/multi-select/multi-select.html';
// const MultiSelectHtml = ms;
// const MultiSelectItemHtml = msi;
// export {MultiSelectHtml};
// export {MultiSelectItemHtml};

export { MultiSelect };

// export function configure(config) {
//   // This is an example of ensuring the environment is from the config.aurelia object.
//   // This becomes important for scenarios when we hare hosting on GitHub Pages and the
//   // origin is not our site. This would allow `plugins` to still adjust for the correct
//   // resource path regardless of where it is being hosted.
//   const {baseUrl} = config.aurelia.environment ? config.aurelia.environment : {baseUrl: '/'};

//   config.globalResources(
//     `${baseUrl}lib/plugins.js`
//   );
// }
