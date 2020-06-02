import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Payload } from 'src/app/shared/models/payload';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';
import { ApiDataService } from 'src/app/shared/services/api-data.service';

@Injectable()
export class DeviceListService {

  constructor(
    private apiDataService: ApiDataService
  ) { }

  formatDevice(raw): any {
    let device = {};
    for (let key in raw) {
      device[key] = raw[key].$ ? raw[key].$.Value : raw[key];
    }

    return device;
  }

  updateDevices(devices, device): any {
    devices.forEach(item => {
      if (item.Device.DeviceId !== device.DeviceId) return;
      item.Device = device;
    });

    return devices;
  }

  getDevicesByLimitCount(originalDeviceList: any[], limit: number): any[] {
    let devices =  originalDeviceList.filter((device, index) => index < limit);
    return devices;
  }

  removeMultipleDevice(datas): Observable<any[]> {
    return forkJoin(
      datas.map(data => {
        let deleteDevicePayload = new Payload(PayloadsConstant.deleteDeviceByDeviceId, [data.Device.DeviceId]);
        return this.apiDataService.executeQuery(deleteDevicePayload);
      })
    );
  }

  deactivateMultipleDevice(datas): Observable<any[]> {
    return forkJoin(
      datas.map(data => {
        let deleteDevicePayload = new Payload(PayloadsConstant.deactivateDeviceByDeviceId, [data.Device.DeviceId]);
        return this.apiDataService.executeQuery(deleteDevicePayload);
      })
    );
  }

  resetMultipleDevice(devices, resetType) {
    return forkJoin(
      devices.map(device => {
        let resetDevicePayload = new Payload(
          resetType === 'soft-reset' ? PayloadsConstant.softResetDevice : PayloadsConstant.hardResetDevice,
          [device.Device.DeviceId]
        );
        return this.apiDataService.executeQuery(resetDevicePayload);
      })
    );
  }
}
