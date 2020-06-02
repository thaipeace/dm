import { Injectable } from '@angular/core';
import { PayloadsConstant } from '../constants/payloads.constant';
import { ApiDataService } from './api-data.service';
import { Payload } from '../models/payload';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceUtilService {

  constructor(
    private apiDataService: ApiDataService
  ) { }

  getDevicesByAttribute(value, attrName): Promise<any> {
    let getDeviceByAttributeNamePayload = new Payload(PayloadsConstant.findDevicesByAttrName, [value, attrName]);
    return this.apiDataService.executeQuery(getDeviceByAttributeNamePayload).toPromise();
  }
}
