import { Pipe, PipeTransform } from '@angular/core';

declare var he: any;

@Pipe({
  name: 'decode'
})
export class DecodePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return he.decode(value);
  }

}
