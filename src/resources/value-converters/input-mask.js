import {valueConverter} from '../../../lib/aurelia.full.esm.js';

export class InputMaskValueConverter {
  toView(isoString) {
    const date = Date.parse(isoString);
    if (isoString && date !== NaN) {
      const dt = new Date(date);
      const y = dt.getFullYear();
      const m = dt.getMonth() + 1;
      const d = dt.getDate();
      return `${m.toString().padStart(2, '0')}/${d.toString().padStart(2, '0')}/${y}`;
    }
    return isoString;
  }

  fromView(dateString) {
    if (dateString) {
      const date = Date.parse(dateString);
      if (date !== NaN) {
        return new Date(date).toISOString();
      }
    }
    return '';
  }
}
valueConverter('inputMask')(InputMaskValueConverter);
