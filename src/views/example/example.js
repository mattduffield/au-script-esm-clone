// import {DefaultMask, DateType, InputMask} from '../../resources/attributes/input-mask/input-mask.js';
import {InputMask} from '../../services/input-mask/input-mask.js';

export class Example {

  constructor() {
    this.birth_date = '1972-05-22T07:00:00.000Z';
    // this.dob = '1972-05-22T07:00:00.000Z';
    this.ssn = '';
  }
  attached() {
    new InputMask(document.querySelectorAll('.ssn-mask'), {type: 'ssn'});
    new InputMask(document.querySelectorAll('.date-mask'), {type: 'date'});
    new InputMask(document.querySelectorAll('.phone-mask'), {type: 'phone'});    
    // new InputMask(document.querySelectorAll("#start_date"),
    // {
    //   mask: DefaultMask.Date, 
    //   placeHolder: "Date: 01/01/2019"
    // });
    // new InputMask(document.querySelectorAll("#ssn"),
    // {
    //   mask: DefaultMask.Ssn, 
    //   placeHolder: "SSN: 999-99-9999"
    // });
    // new InputMask(document.querySelectorAll("#phone"),
    // {
    //   mask: DefaultMask.Phone, 
    //   placeHolder: "Phone: (999) 999-9999"
    // });
  }
}
