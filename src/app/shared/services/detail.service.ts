import { Injectable } from '@angular/core';
import { Payload } from '../models/payload';
import { PayloadsConstant } from '../constants/payloads.constant';
import { ApiDataService } from './api-data.service';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  constructor(
    private apiDataService: ApiDataService
  ) { }

  getItemByTargetValue(payload, target, value, server?) {
    let getEventByTarget = new Payload(
      payload, [target, value]
    );

    return this.apiDataService.executeQueryByServer(getEventByTarget, server).toPromise();
  }
}
