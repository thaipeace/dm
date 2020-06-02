import { Directive } from '@angular/core';
import { NG_VALIDATORS, FormControl, ValidatorFn, Validator } from '@angular/forms';

@Directive({
  selector: '[appUrlValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UrlValidatorDirective,
      multi: true
    }
  ]
})

export class UrlValidatorDirective implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = this.urlValidator();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  urlValidator(): ValidatorFn {
    return (c: FormControl) => {
      let isValid = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(c.value);
      if (isValid) {
        return null;
      } else {
        return {
          urlvalidator: {
            valid: false
          }
        };
      }
    }
  }
}