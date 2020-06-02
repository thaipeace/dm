import { Component, OnInit, OnDestroy } from '@angular/core';
import {DataUtilService} from '../../shared/services/data-util.service';
import {DeviceListService} from './device-list.service';
import {GeneralConstant} from '../../shared/constants/general.constant';
import {EditDeviceComponent} from '../edit-device/edit-device.component';
import {ModalService} from '../../shared/services/modal.service';
import {ApiDataService} from '../../shared/services/api-data.service';
import {Payload} from '../../shared/models/payload';
import {PayloadsConstant} from '../../shared/constants/payloads.constant';
import {SpinnerService} from '../../shared/services/spinner.service';
import {NotificationService} from '../../shared/services/notification.service';
import {DeviceMessageService} from '../../shared/services/device-message.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, OnDestroy {
  
  private subscription: Subscription;
  public originalDeviceList: any[];
  public devices: any;
  public searchText: string;
  public selectedDevice: any;
  public listLimitCount: number;
  public listLimitCountDefault: number;
  public isShow: boolean = false;
  public modalSub: Subscription;
  public fieldsValuePairs: any = [
    {
      fields: [
        {name: 'item.Device.DeviceName', type: 'string'},
        {name: 'item.Device.Type', type: 'string'},
        {name: 'item.Device.LastSeen', type: 'datetime'},
        {name: 'item.Device.CurrentState', type: 'string'}
      ],
      require: false
    }
  ];

  public bulkAction: string;
  public checkAll: boolean;
  public itemsCheck: any[];
  public isAnyItemChecked: boolean;

  public setAlarmInterval: any;
  public isAlarm: boolean;
  public alarmCount: any;

  constructor(
    private deviceListService: DeviceListService,
    private dataUtilService: DataUtilService,
    private modalService: ModalService,
    private apiDataService: ApiDataService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private deviceMessageService: DeviceMessageService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit() {
    this.listLimitCount = GeneralConstant.limitPaging;
    this.listLimitCountDefault = GeneralConstant.limitPaging;
    this.originalDeviceList = [];
    this.getAllDevice();

    this.modalSub = this.modalService.result.subscribe(result => {
      let type = result.formType;
      let data = result.data;
      this.selectedDevice = {
        id: data.id,
        name: data.name,
        mac: data.mac,
        DeviceProtocol: data.DeviceProtocol,
        DefaultHomeURL: data.DefaultHomeURL,
        HomeURL: data.HomeURL,
        Type: data.Type,
        Location: data.Location,
        CurrentState: data.CurrentState
      }
      if (type === GeneralConstant.modalDataReturnType.createDevice) {
        this.createDevice();
      } else if (type === GeneralConstant.modalDataReturnType.editDevice) {
        this.updateDevice();
      }
    });

    this.subscription = this.deviceMessageService.messageReadingObservable.subscribe((rs) => {
      if (rs) {
        this.getAllDevice();
      }
    });

    this.bulkAction = '';
  }

  ngOnDestroy(): void {
    this.modalSub.unsubscribe();
    this.subscription.unsubscribe();
  }

  private startAlarmCounting() {
    clearTimeout(this.alarmCount);
    this.alarmCount = setTimeout(()=>{
      this.notificationService.addNotification('Alarm missing signal from device', 'danger');
    }, 120*1000);
  }

  getAllDevice() {
    let getAllDevicePayload = new Payload(PayloadsConstant.findAllDevices, []);
    this.spinnerService.showSpinner('device-list-id');
    this.apiDataService.executeQuery(getAllDevicePayload).subscribe(
      (response: any) => {
        this.originalDeviceList = this.dataUtilService.wrapObjToOneElementArray(
          this.dataUtilService.convertXmlToJson(response).Find.Result
        );

        if (!this.originalDeviceList) return;
        this.devices = this.deviceListService.getDevicesByLimitCount(this.originalDeviceList, this.listLimitCount);

        this.setBulkSelecting();
        this.bulkAction = '';
        this.startAlarmCounting();

        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  showUpsertDeviceForm(selectedDevice) {
    this.selectedDevice = {
      id: selectedDevice ? selectedDevice.Device.DeviceId : '',
      name: selectedDevice ? selectedDevice.Device.DeviceName : '',
      mac: selectedDevice ? selectedDevice.Device.MACAddress : '',
      DeviceProtocol: selectedDevice ? selectedDevice.Device.DeviceProtocol : '',
      DefaultHomeURL: selectedDevice ? selectedDevice.Device.DefaultHomeURL : '',
      HomeURL: selectedDevice ? selectedDevice.Device.HomeURL : '',
      Type: selectedDevice ? selectedDevice.Device.Type : '',
      Location: selectedDevice ? selectedDevice.Device.Location : '',
      CurrentState: selectedDevice ? selectedDevice.Device.CurrentState : ''
    };

    this.modalService.openDataModal(
      EditDeviceComponent,
      this.selectedDevice,
      selectedDevice ? GeneralConstant.modalDataReturnType.editDevice : GeneralConstant.modalDataReturnType.createDevice
    );
  }

  createDevice() {
    let upsertDevicePayload = new Payload(
      PayloadsConstant.upsertDevice,
      [this.selectedDevice.name, this.selectedDevice.mac, this.selectedDevice.DeviceProtocol, this.selectedDevice.DefaultHomeURL,
        this.selectedDevice.HomeURL, this.selectedDevice.Type, this.selectedDevice.Location]
    );
    this.spinnerService.showSpinner('device-list-id');
    this.apiDataService.executeQuery(upsertDevicePayload).subscribe(
      (response: any) => {
        this.getAllDevice();
        this.notificationService.addNotification(`Device was created successfully`, 'success');
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Update error');
      }
    );
  }

  updateDevice() {
    let upsertDevicePayload = new Payload(
      PayloadsConstant.upsertDevice,
      [this.selectedDevice.name, this.selectedDevice.mac, this.selectedDevice.DeviceProtocol, this.selectedDevice.DefaultHomeURL,
        this.selectedDevice.HomeURL, this.selectedDevice.Type, this.selectedDevice.Location]
    );
    this.spinnerService.showSpinner('device-list-id');
    this.apiDataService.executeQuery(upsertDevicePayload).subscribe(
      (response: any) => {
        let rawResponse = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
        this.devices = this.deviceListService.updateDevices(
          this.devices,
          this.deviceListService.formatDevice(rawResponse.result.Device)
        );
        this.notificationService.addNotification(`Device <b>${rawResponse.result.Device.DeviceName.$.Value}</b> was updated successfully`, 'success');
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Update error');
      }
    );
  }

  removeDevice(selectedDevice) {
    let removeDevicePayload = new Payload(PayloadsConstant.deleteDeviceByDeviceId, [selectedDevice.Device.DeviceId])
    this.spinnerService.showSpinner('device-list-id');
    this.apiDataService.executeQuery(removeDevicePayload).subscribe(
      (response: any) => {
        this.originalDeviceList = this.originalDeviceList.filter(device => device.Device.DeviceId !== selectedDevice.Device.DeviceId);
        this.devices = this.deviceListService.getDevicesByLimitCount(this.originalDeviceList, this.listLimitCount);
        this.notificationService.addNotification(`Device <b>${selectedDevice.Device.DeviceName}</b> was removed successfully`, 'success');
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Update error');
      }
    );
  }

  loadLessMore() {
    if (this.devices.length < this.originalDeviceList.length) {
      this.listLimitCount += this.listLimitCount;
    } else {
      this.listLimitCount = GeneralConstant.limitPaging;
    }

    this.devices = this.deviceListService.getDevicesByLimitCount(this.originalDeviceList, this.listLimitCount);
  }

  public onCheckAllModel(event) {
    this.isAnyItemChecked = this.checkAll;
    this.itemsCheck.forEach(itemCheck => {
      itemCheck.value = this.checkAll;
    });
  }

  public onCheckModel(event) {
    this.isAnyItemChecked = this.itemsCheck.some(itemCheck => itemCheck.value);
    this.checkAll = this.itemsCheck.every(itemCheck => itemCheck.value);
  }

  private setBulkSelecting() {
    this.itemsCheck = this.devices.map(device => {
      return {"id": device.Device.DeviceId, "value": false};
    });
    this.isAnyItemChecked = this.itemsCheck.some(itemCheck => itemCheck.value);
  }

  public onSelectAction() {
    let selectedDevices = this.itemsCheck.filter(item => item.value).map(device => {
      if (device.value) {
        return this.getDeviceById(device.id);
      };
    });

    let type = 'success';
    let message = '';
    switch (this.bulkAction) {
      case 'remove':
        this.spinnerService.showSpinner();
        this.deviceListService.removeMultipleDevice(selectedDevices).subscribe(responseList => {
          if (responseList.length !== selectedDevices.length) type = 'warning';
          responseList.forEach((res, index) => {
            message += `<div>${selectedDevices[index].Device.DeviceName} is removed successfully</div>`;
          });

          this.getAllDevice();
          this.spinnerService.hideSpinner();
          this.notificationService.addNotification(message ? message : 'Device removal not successful', type);
        });
        break;
      
      case 'deactive':
        this.spinnerService.showSpinner();
        this.deviceListService.deactivateMultipleDevice(selectedDevices).subscribe(responseList => {
          if (responseList.length !== selectedDevices.length) type = 'warning';
          responseList.forEach((res, index) => {
            message += `<div>${selectedDevices[index].Device.DeviceName} is deactivate successfully</div>`;
          });

          this.getAllDevice();
          this.spinnerService.hideSpinner();
          this.notificationService.addNotification(message ? message : 'Device deactivating not successful', type);
        });
        break;

      case 'soft-reset':
      case 'hard-reset':
        this.openResetConfirmationDialog(selectedDevices, this.bulkAction);

      case 'default':
        return;
    }
  }

  openResetConfirmationDialog(devices, resetType) {
    let deviceNames = devices.map(device => device.Device.DeviceName);
    this.confirmationDialogService.confirm(
      `Reset Device(s)`,
      `Do you really want to ${resetType === 'soft-reset' ? 'soft reset' : 'hard reset'} ${deviceNames.join(', ')} device(s) ?`
    ).then((confirmed) => {
      if (confirmed) {
        let type = 'success';
        let message = '';
        this.spinnerService.showSpinner();
        this.deviceListService.resetMultipleDevice(devices, resetType).subscribe(responseList => {
          if (responseList.length !== devices.length) type = 'warning';
          responseList.forEach((res, index) => {
            message += `<div>${devices[index].Device.DeviceName} has been reset successfully</div>`;
          });

          this.getAllDevice();
          this.spinnerService.hideSpinner();
          this.notificationService.addNotification(message ? message : 'Reset not successful', type);
        });
      } else {
        this.getAllDevice();
      }
    }).catch(() => {this.getAllDevice();});
  }

  private getDeviceById(id) {
    return this.originalDeviceList.find(device => device.Device.DeviceId === id);
  }
}
