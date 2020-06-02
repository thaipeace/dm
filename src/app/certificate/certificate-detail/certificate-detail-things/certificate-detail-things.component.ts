import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiDataService } from '../../../shared/services/api-data.service';
import { Payload } from '../../../shared/models/payload';
import { PayloadsConstant } from '../../../shared/constants/payloads.constant';
import { DataUtilService } from '../../../shared/services/data-util.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-certificate-detail-things',
  templateUrl: './certificate-detail-things.component.html',
  styleUrls: ['./certificate-detail-things.component.scss']
})
export class CertificateDetailThingsComponent implements OnInit {
  closeResult: string;

  @Input() certificate;
  @Input() devices: any;
  @Output() updateDevices = new EventEmitter();

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.updateDevices.emit(this.certificate.certId);
   }

  unattachCertificate(deviceId) {
    let payload = new Payload(PayloadsConstant.unattachCertificateFromDevice, [deviceId]);
    this.spinnerService.showSpinner('certificate-detail-things-certi-wrapper-id');
    this.apiDataService.executeQuery(payload).subscribe(
      (response: any) => {
        let rawDevice = this.dataUtilService.convertXmlToJson(response);
        if (rawDevice.Save) {
          this.devices = this.devices.filter(device => device.Device.DeviceId !== rawDevice.Save.Device.DeviceId);
        }
        this.spinnerService.hideSpinner();
        this.notificationService.addNotification(`Certificate was detached from <b>${rawDevice.Save.Device.DeviceName.$.Value}</b> device successfully`, 'success');
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }
}
