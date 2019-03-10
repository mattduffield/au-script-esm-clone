/**
 *  Name: InputMask
 *  Desc: This is a service that allow you to target all elements you want to be 
 *        included in a given mask
 *  Usage:
 *    In your View:
 *    <input class="form-control date-mask" value.bind="currentItem.date | date & updateTrigger:'blur':'paste'">
 *    <input class="form-control phone-mask" value.bind="currentItem.phone & updateTrigger:'blur':'paste'">
 *    <input class="form-control ssn-mask" value.bind="currentItem.ssn & updateTrigger:'blur':'paste'">
 *    <input class="form-control pattern-mask" value.bind="currentItem.age & updateTrigger:'blur':'paste'" data-mask="99">
 *    In your ViewModel:
 *    new InputMask(document.querySelectorAll('.ssn-mask'), {type: 'ssn'});
 *    new InputMask(document.querySelectorAll('.date-mask'), {type: 'date'});
 *    new InputMask(document.querySelectorAll('.phone-mask'), {type: 'phone'});
 *    const dataMasks = document.querySelectorAll('.pattern-mask');
 *    Array.from(dataMasks).forEach(el => {
 *      const mask = el.getAttribute('data-mask');
 *      new InputMask([el], {mask});
 *    });
 * 
 *  Reference: 
 *  https://www.cssscript.com/lightweight-pure-javascript-input-mask/
 *  https://www.cssscript.com/demo/lightweight-pure-javascript-input-mask/
 */

const DefaultMask = {
  date: {
    mask: "99/99/9999",
    patterns: [ // Each pattern represents possible values at the given index position
      [
        /[0-1]/, // Month can only start with 0-1
      ],
      [
        /(?<=0)[1-9]/, // If month starts with 0, then second number can be 1-9
        /(?<=1)[0-2]/, // If month starts with 1, then second number can be 0-2
      ],
      [],
      [
        /[0-3]/, // Day can only start with 0-3
      ],
      [
        /(?<=0)[1-9]/, // If day starts with 0, then second number can be 1-9
        /(?<=[1-2])[0-9]/, // If day starts with 1-2, then second number can be 0-9
        /(?<=3)[0-1]/, // If day starts with 3, then second number can be 0-1
      ],
      [],
      [
        /[1-2]/
      ],
      [
        /[0-9]/
      ],
      [
        /[0-9]/
      ],
      [
        /[0-9]/
      ],
    ],
    placeholder: 'MM/DD/YYYY'
  },
  datetime: {
    mask: "99/99/9999 99:99:99",
    patterns: [],
    placeholder: "99/99/9999 99:99:99"
  },
  datetimeshort: {
    mask: "99/99/9999 99:99",
    patterns: [],
    placeholder: "99/99/9999 99:99"
  },
  time: {
    mask: "99:99:99",
    patterns: [],
    placeholder: "99:99:99"
  },
  timeshort: {
    mask: "99:99",
    patterns: [],
    placeholder: "99:99"
  },
  ssn: {
    mask: "999-99-9999",
    patterns: [],
    placeholder: "999-99-9999"
  },
  phone: {
    mask: "(999) 999-9999",
    patterns: [],
    placeholder: "(999) 999-9999"
  }
};
const DateType = {
  Date: 1,
  DateTime: 2,
  DateTimeShort: 3,
  Time: 4,
  TimeShort: 5
};
export {DefaultMask, DateType};

export class InputMask {
  type = 'date';
  mask = null;
  hasMask = false;
  forceUpper = false;
  forceLower = false;
  useEnterKey = false;
  validateDataType = false;
  dataType = null;
  placeholder = '';
  formatCharacters = ["-", "_", "(", ")", "[", "]", ":", ".", ",", "$", "%", "@", " ", "/"];
  maskCharacters = ["A", "9", "*"];
  originalValue = '';

  keys = {
    asterisk: 42,
    zero: 48,
    nine: 57,
    a: 65,
    z: 90,
    backSpace: 8,
    tab: 9,
    delete: 46,
    left: 37,
    right: 39,
    end: 35,
    home: 36,
    numberPadZero: 96,
    numberPadNine: 105,
    shift: 16,
    enter: 13,
    control: 17,
    escape: 27,
    v: 86,
    c: 67,
    x: 88
  };

  constructor(elements, options) {
    if (!elements || !options) {
      return;
    }
    if (options.type) {
      const maskMap = DefaultMask[options.type];
      this.mask = maskMap.mask;
      if (maskMap && maskMap.patterns && maskMap.patterns.length > 0) {
        this.maskPatterns = maskMap.patterns;
      }
      if (maskMap && maskMap.placeholder) {
        this.placeholder = maskMap.placeholder;
      }
      this.hasMask = true;
    }
    if (options.mask && options.mask && options.mask.length > 0) {
      this.mask = options.mask;
      this.hasMask = true;
    }
    if (options.forceUpper) {
      this.forceUpper = options.forceUpper;
    }
    if (options.forceLower) {
      this.forceLower = options.forceLower;
    }
    if (options.validateDataType) {
      this.validateDataType = options.validateDataType;
    }
    if (options.dataType) {
      this.dataType = options.dataType;
    }
    if (options.useEnterKey) {
      this.useEnterKey = options.useEnterKey;
    }
    
    Array.from(elements).forEach((element) => {
      // element.onblur = () => {
      //   if (!element.getAttribute("readonly") && this.hasMask) {
      //     return this.onLostFocus(element);
      //   }
      //   return true;
      // };
      element.onkeydown = (event) => {
        if (!element.getAttribute("readonly")) {
          return this.onKeyDown(element, event);
        }
        return true;
      };
      element.onpaste = (event) => {
        if (!element.getAttribute("readonly")) {
          return this.onPaste(element, event, null);
        }
        return true;
      }
      if (this.placeholder) {
        element.setAttribute("placeholder", this.placeholder);
      }
    });
  }
  between(x, a, b) {
    return x && a && b && x >= a && x <= b;
  }
  parseDate(value) {
    const now = new Date();
    let date = new Date(Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    ));

    if (value) {
      if (this.between(this.dataType, 1, 3)) {
        const tempDate = new Date(value);

        if (!isNaN(tempDate.getTime())) {
          date = new Date(Date.UTC(
            tempDate.getFullYear(),
            tempDate.getMonth(),
            tempDate.getDate(),
            tempDate.getHours(),
            tempDate.getMinutes(),
            tempDate.getSeconds()
          ));
        }
      } else {
        const timeSegments = value.split(":");
        const utcHours = timeSegments.length > 0 ? timeSegments[0] : 0;
        const utcMinutes = timeSegments.length > 1 ? timeSegments[1] : 0;
        const utcSeconds = timeSegments.length > 2 ? timeSegments[2] : 0;

        date.setUTCHours(utcHours, utcMinutes, utcSeconds);
      }
    }
    return date;
  }
  getFormattedDateTime(value) {
    const date = this.parseDate(value);

    const day = date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate();
    const month = (date.getUTCMonth() + 1) < 10 ? "0" + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1);
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours();
    const minutes = date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes();
    const seconds = date.getUTCSeconds() < 10 ? "0" + date.getUTCSeconds() : date.getUTCSeconds();

    switch (this.dataType) {
    case 1:
      return month + "/" + day + "/" + year;
    case 2:
      return month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
    case 3:
      return month + "/" + day + "/" + year + " " + hours + ":" + minutes;
    case 4:
      return hours + ":" + minutes + ":" + seconds;
    case 5:
      return hours + ":" + minutes;
    default:
      return "";
    }
  }
  getCursorPosition(element) {
    let position = 0;

    if (document.selection) {
      element.focus();
      const selectRange = document.selection.createRange();
      selectRange.moveStart("character", -element.value.length);
      position = selectRange.text.length;
    } else if (element.selectionStart || element.selectionStart === "0") {
      position = element.selectionStart;
    }
    return position;
  }
  isValidCharacter(keyCode, maskCharacter) {
    const maskCharacterCode = maskCharacter.charCodeAt(0);

    if (maskCharacterCode === this.keys.asterisk) {
      return true;
    }
    const isNumber = (keyCode >= this.keys.zero && keyCode <= this.keys.nine) ||
    (keyCode >= this.keys.numberPadZero && keyCode <= this.keys.numberPadNine);

    if (maskCharacterCode === this.keys.nine && isNumber) {
      return true;
    }
    if (maskCharacterCode === this.keys.a && keyCode >= this.keys.a && keyCode <= this.keys.z) {
      return true;
    }
    return false;
  }
  doesCharacterMatchRegex(element, event) {
    let result = false;
    const pos = this.getCursorPosition(element);
    let value = '';
    if (pos === 0) {
      value = `${event.key}`;
    } else {
      value = `${element.value[pos - 1]}${event.key}`;
    }
    if (this.maskPatterns) {
      const pattern = this.maskPatterns[pos];
      if (Array.isArray(pattern)) {
        pattern.forEach(p => {
          let regex = new RegExp(p);
          result = result || regex.test(value);
        });
      }
    }
    return result;
  }
  setCursorPosition(element, index) {
    if (element != null) {
      if (element.createTextRange) {
        const range = element.createTextRange();
        range.move("character", index);
        range.select();
      } else {
        if (element.selectionStart) {
          element.focus();
          element.setSelectionRange(index, index);
        } else {
          element.focus();
        }
      }
    }
  }
  removeCharacterAtIndex(element, index) {
    if (element.value.length > 0) {
      const newElementValue = element.value.slice(0, index) + element.value.slice(index + 1);
      element.value = newElementValue;

      if (element.value.length > 0) {
        this.setCursorPosition(element, index);
      } else {
        element.focus();
      }
    }
  }
  insertCharacterAtIndex(element, index, character) {
    const newElementValue = element.value.slice(0, index) + character + element.value.slice(index);
    element.value = newElementValue;

    if (element.value.length > 0) {
      this.setCursorPosition(element, index + 1);
    } else {
      element.focus();
    }
  }
  checkAndInsertMaskCharacters(element, index) {
    while (true) {
      const isMaskCharacter = this.formatCharacters.indexOf(this.mask[index]) > -1;
      const maskAlreadyThere = element.value.charAt(index) === this.mask[index];

      if (isMaskCharacter && !maskAlreadyThere) {
        this.insertCharacterAtIndex(element, index, this.mask[index]);
      } else {
        return;
      }
      index += 1;
    }
  }
  checkAndRemoveMaskCharacters(element, index, keyCode) {
    if (element.value.length > 0) {
      while (true) {
        const character = element.value.charAt(index);
        const isMaskCharacter = this.formatCharacters.indexOf(character) > -1;

        if (!isMaskCharacter || index === 0 || index === element.value.length) {
          return;
        }
        this.removeCharacterAtIndex(element, index);
        if (keyCode === this.keys.backSpace) {
          index -= 1;
        }
        if (keyCode === this.keys.delete) {
          index += 1;
        }
      }
    }
  }
  validateDataEqualsDataType(element) {
    if (element == null || element.value === "") {
      return;
    }
    const date = this.parseDate(element.value);
    if (this.between(this.dataType, 1, 3)) {
      if (isNaN(date.getDate()) || date.getFullYear() <= 1000) {
        element.value = "";
        return;
      }
    }
    if (this.dataType > 1) {
      if (isNaN(date.getTime())) {
        element.value = "";
        return;
      }
    }
  }
  onLostFocus(element) {
    if (element.value.length > 0) {
      if (element.value.length !== this.mask.length) {
        // element.value = ""; // Not sure if we want this....
        return;
      }
      for (var i = 0; i < element.value.length; i++) {
        const elementCharacter = element.value.charAt(i);
        const maskCharacter = this.mask[i];

        if (this.maskCharacters.indexOf(maskCharacter) > -1) {
          if (elementCharacter === maskCharacter || maskCharacter.charCodeAt(0) === this.keys.asterisk) {
            continue;
          } else {
            element.value = "";
            return;
          }
        } else {
          if (maskCharacter.charCodeAt(0) === this.keys.a) {
            if (elementCharacter.charCodeAt(0) <= this.keys.a || elementCharacter >= this.keys.z) {
              element.value = "";
              return;
            }
          } else if (maskCharacter.charCodeAt(0) === this.keys.nine) {
            if (elementCharacter.charCodeAt(0) <= this.keys.zero || elementCharacter >= this.keys.nine) {
              element.value = "";
              return;
            }
          }
        }
      }
      if (this.validateDataType && this.dataType) {
        this.validateDataEqualsDataType(element);
      }
    }
  }
  onKeyDown(element, event) {
    let key = event.which;
    const copyCutPasteKeys = [this.keys.v, this.keys.c, this.keys.x].indexOf(key) > -1 && event.ctrlKey;
    const movementKeys = [this.keys.left, this.keys.right, this.keys.tab].indexOf(key) > -1;
    const modifierKeys = event.ctrlKey || event.shiftKey;

    if (copyCutPasteKeys || movementKeys || modifierKeys) {
      return true;
    }
    if (element.selectionStart === 0 && element.selectionEnd === element.value.length) {
      this.originalValue = element.value;
      element.value = "";
    }
    if (key === this.keys.escape) {
      if (this.originalValue !== "") {
        element.value = this.originalValue;
      }
      return true;
    }
    if (key === this.keys.backSpace || key === this.keys.delete) {
      if (key === this.keys.backSpace) {
        this.checkAndRemoveMaskCharacters(element, this.getCursorPosition(element) - 1, key);
        this.removeCharacterAtIndex(element, this.getCursorPosition(element) - 1);
      }
      if (key === this.keys.delete) {
        this.checkAndRemoveMaskCharacters(element, this.getCursorPosition(element), key);
        this.removeCharacterAtIndex(element, this.getCursorPosition(element));
      }
      event.preventDefault();
      return false;
    }
    if (this.dataType && this.useEnterKey && key === this.keys.enter) {
      if (this.dataType >= 1 && this.dataType <= 5) {
        element.value = this.getFormattedDateTime();
      }
      event.preventDefault();
      return false;
    }
    if (this.useEnterKey && key === this.keys.enter) {
      element.blur();
      event.preventDefault();
      return false;
    }
    if (element.value.length === this.mask.length) {
      event.preventDefault();
      return false;
    }
    if (this.hasMask) {
      this.checkAndInsertMaskCharacters(element, this.getCursorPosition(element));
    }
    if (this.isValidCharacter(key, this.mask[this.getCursorPosition(element)])) {
      if (key >= this.keys.numberPadZero && key <= this.keys.numberPadNine) {
        key = key - 48;
      }
      let character = event.shiftKey
        ? String.fromCharCode(key).toUpperCase()
        : String.fromCharCode(key).toLowerCase();
      if (this.forceUpper) {
        character = character.toUpperCase();
      }
      if (this.forceLower) {
        character = character.toLowerCase();
      }
      if (this.maskPatterns && this.maskPatterns[this.getCursorPosition(element)]) {
        if (this.doesCharacterMatchRegex(element, event)) {
          this.insertCharacterAtIndex(element, this.getCursorPosition(element), character);
          if (this.hasMask) {
            this.checkAndInsertMaskCharacters(element, this.getCursorPosition(element));
          }
        }
      } else {
        this.insertCharacterAtIndex(element, this.getCursorPosition(element), character);
        if (this.hasMask) {
          this.checkAndInsertMaskCharacters(element, this.getCursorPosition(element));
        }
      }
    }
    event.preventDefault();
    return false;
  }
  onPaste(element, event, data) {
    let pastedText = "";

    if (data != null && data !== "") {
      pastedText = data;
    } else if (event != null && window.clipboardData && window.clipboardData.getData) {
      pastedText = window.clipboardData.getData("text");
    } else if (event != null && event.clipboardData && event.clipboardData.getData) {
      pastedText = event.clipboardData.getData("text/plain");
    }
    if (pastedText != null && pastedText !== "") {
      for (var j = 0; j < this.formatCharacters.length; j++) {
        pastedText.replace(this.formatCharacters[j], "");
      }
      for (var i = 0; i < pastedText.length; i++) {
        if (this.formatCharacters.indexOf(pastedText[i]) > -1) {
          continue;
        }
        const keyDownEvent = document.createEventObject ? document.createEventObject() : document.createEvent("Events");
        if (keyDownEvent.initEvent) {
          keyDownEvent.initEvent("keydown", true, true);
        }
        keyDownEvent.keyCode = keyDownEvent.which = pastedText[i].charCodeAt(0);
        this.onKeyDown(element, keyDownEvent);
      }
    }
    return false;
  }
  formatWithMask(element) {
    let value = element.value;

    if (this.between(this.dataType, 1, 5)) {
      value = this.getFormattedDateTime(element.value);
    }
    element.value = "";
    if (value != null && value !== "") {
      this.onPaste(element, null, value);
    }
  }
}
