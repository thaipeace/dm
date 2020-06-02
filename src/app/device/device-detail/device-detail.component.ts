import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataUtilService } from '../../shared/services/data-util.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { DeviceListService } from '../device-list/device-list.service';
import { ModalService } from '../../shared/services/modal.service';
import { EditDeviceComponent } from '../edit-device/edit-device.component';
import { GeneralConstant } from '../../shared/constants/general.constant';
import { ApiDataService } from '../../shared/services/api-data.service';
import { Payload } from '../../shared/models/payload';
import { PayloadsConstant } from '../../shared/constants/payloads.constant';
import { NotificationService } from '../../shared/services/notification.service';
import { DeviceMessageService } from '../../shared/services/device-message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss']
})
export class DeviceDetailComponent implements OnInit, OnDestroy {

  public id: number;
  public device: any;
  public selectedDevice: any;
  public currentView: string;
  public subscription: Subscription;
  public modalSub: Subscription;

  public alarmCount: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataUtilService: DataUtilService,
    private dropdownConfig: NgbDropdownConfig,
    private deviceListService: DeviceListService,
    private modalService: ModalService,
    private apiDataService: ApiDataService,
    private notificationService: NotificationService,
    private deviceMessageService: DeviceMessageService
  ) {
    this.dropdownConfig.placement = 'bottom-right';
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['deviceId'];
      this.getDeviceById(this.id);
    });

    this.modalSub = this.modalService.result.subscribe(result => {
      let type = result.formType;
      if (type !== GeneralConstant.modalDataReturnType.editDevice) return;
      this.selectedDevice = result.data;
      this.upsertDevice();
    });

    this.subscription = this.deviceMessageService.messageReadingObservable.subscribe((rs) => {
      if (rs) {
        this.getDeviceById(this.id);
      }
    })
    
    this.viewContent('details');
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

  getDeviceById(id) {
    let getDeviceByIdPayload = new Payload(PayloadsConstant.findDevicesByDeviceId, [id]);
    this.apiDataService.executeQuery(getDeviceByIdPayload).subscribe(
      (response: any) => {
        let rawDevice = this.dataUtilService.convertXmlToJson(response);
        if (!rawDevice.Find.Result) return;

        this.device = rawDevice.Find.Result.Device;
        this.startAlarmCounting();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  showUpsertDeviceForm() {
    this.selectedDevice = {
      id: this.device.DeviceId,
      name: this.device.DeviceName,
      mac: this.device.MACAddress,
      DeviceProtocol: this.device.DeviceProtocol,
      DefaultHomeURL: this.device.DefaultHomeURL,
      HomeURL: this.device.HomeURL,
      Type: this.device.Type,
      Location: this.device.Location,
      CurrentState: this.device.CurrentState
    };

    this.modalService.openDataModal(
      EditDeviceComponent,
      this.selectedDevice,
      GeneralConstant.modalDataReturnType.editDevice
    );
  }

  upsertDevice() {
    let upsertDevicePayload = new Payload(
      PayloadsConstant.upsertDevice,
      [this.selectedDevice.name, this.selectedDevice.mac, this.selectedDevice.DeviceProtocol, this.selectedDevice.DefaultHomeURL,
       this.selectedDevice.HomeURL, this.selectedDevice.Type, this.selectedDevice.Location]
    );

    this.apiDataService.executeQuery(upsertDevicePayload).subscribe(
      (response: any) => {
        let rawResponse = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
        this.device = this.deviceListService.formatDevice(rawResponse.result.Device);
        this.notificationService.addNotification(`Device <b>${this.device.DeviceName}</b> was updated successfully`, 'success');
      }, (error: any) => {
        console.log('Update error');
      }
    );
  }

  viewContent(type: string) {
    this.currentView = type;
  }

  removeDevice() {
    let removeDevicePayload = new Payload(PayloadsConstant.deleteDeviceByDeviceId, [this.device.DeviceId]);
    this.apiDataService.executeQuery(removeDevicePayload).subscribe(
      (response: any) => {
        this.router.navigate(['/devices']);
        this.notificationService.addNotification(`Device <b>${this.device.DeviceName}</b> was deleted successfully`, 'success');
      }, (error: any) => {
        console.log('Update error');
      }
    );
  }
}
