import { Pipe, PipeTransform } from '@angular/core';
import { DataUtilService } from '../services/data-util.service';

@Pipe({
  name: 'listCustomFieldInObjsArray'
})
export class ListCustomFieldInObjsArrayPipe implements PipeTransform {

  constructor(
    private dataUtilService: DataUtilService
  ) {

  }

  transform(items: any[], wrapper: string, arg: string): any {
    items = this.dataUtilService.wrapObjToOneElementArray(items);
    return items.map(item => item[wrapper][arg]);
  }

}
