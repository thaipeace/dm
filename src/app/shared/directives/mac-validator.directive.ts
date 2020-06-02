import { Directive } from '@angular/core';
import { NG_VALIDATORS, FormControl, ValidatorFn, Validator } from '@angular/forms';
import { DeviceUtilService } from '../services/device-util.service';
import { DataUtilService } from '../services/data-util.service';

@Directive({
  selector: '[appMacValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MacValidatorDirective,
      multi: true
    }
  ]
})

export class MacValidatorDirective implements Validator{
  validator: ValidatorFn;
  macV: any;

  constructor(
    private deviceUtilService: DeviceUtilService,
    private dataUtilService: DataUtilService
  ) {
    this.validator = this.macValidator();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  macValidator(): ValidatorFn {
    return (c: FormControl) => {
      let result = this.deviceUtilService.getDevicesByAttribute(c.value, 'MACAddress');
      result.then(x => {
        let rawDevice = this.dataUtilService.convertXmlToJson(x);
        let isValid = !rawDevice.Find.Result;
        if (isValid) {
          this.macV = null;
        } else {
          this.macV = {
            macvalidator: {
              valid: false
            }
          };
        }
      })

      return this.macV
    }
  }
  

}
