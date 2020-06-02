import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayTransform'
})
export class ArrayTransformPipe implements PipeTransform {

  transform(data: any): any {
		if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }
}
