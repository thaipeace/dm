import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataUtilService } from '../../../shared/services/data-util.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiDataService } from '../../../shared/services/api-data.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { Payload } from '../../../shared/models/payload';
import { PayloadsConstant } from '../../../shared/constants/payloads.constant';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppConfigService } from '../../../app-config.service';

@Component({
  selector: 'app-device-detail-security',
  templateUrl: './device-detail-security.component.html',
  styleUrls: ['./device-detail-security.component.scss']
})
export class DeviceDetailSecurityComponent implements OnInit {

  @Input() device: any;
  @Output() reloadDevice = new EventEmitter();
  public certificateId: string;
  public certificates: any[];
  public attachedCertificate: any;
  public downloadLinkPrefix: string;

  constructor(
    private dataUtilService: DataUtilService,
    private dropdownConfig: NgbDropdownConfig,
    private spinnerService: SpinnerService,
    private apiDataService: ApiDataService,
    private notificationService: NotificationService,
    private appConfigService: AppConfigService
  ) {
    this.dropdownConfig.placement = 'bottom-right';
   }

  ngOnInit() {
    this.downloadLinkPrefix = `http://${this.appConfigService.settings.url}:${this.appConfigService.settings.port}/`;
    this.reloadDevice.emit(this.device.DeviceId);
    this.getAllCertificate();
    this.getCertificate(this.device.certId);
  }

  attachCertificateToDevice() {
    let attachCertificatePayload = new Payload(
      PayloadsConstant.attachCertificateToDevice,
      [this.device.MACAddress, this.certificateId]
    );
    this.apiDataService.executeQuery(attachCertificatePayload).subscribe(
      (response: any) => {
        this.getCertificate(this.certificateId);
        this.notificationService.addNotification(`Device <b>${this.device.DeviceName}</b> was attached to a new certificate successfully`, 'success');
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  getAllCertificate() {
    let payload = new Payload(PayloadsConstant.findAllCertificates, []);
    this.apiDataService.executeQuery(payload).subscribe(
      (response: any) => {
        this.certificates = this.dataUtilService.wrapObjToOneElementArray(
          this.dataUtilService.convertXmlToJson(response).Find.Result
        );
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  getCertificate(certificateId) {
    let payload = new Payload(PayloadsConstant.findCertificateByCertificateId, [certificateId]);
    this.spinnerService.showSpinner('device-detail-security-certi-wrapper-id');
    this.apiDataService.executeQuery(payload).subscribe((response: any) => {
      let rawCerificate = this.dataUtilService.convertXmlToJson(response);
      if (rawCerificate.Find.Result) {
        this.attachedCertificate = rawCerificate.Find.Result;
      }
      this.spinnerService.hideSpinner();
    }, (error: any) => {
      console.log('Loading error');
    });
  }

  unattachCertificate() {
    let payload = new Payload(PayloadsConstant.unattachCertificateFromDevice, [this.device.DeviceId]);
    this.spinnerService.showSpinner('device-detail-security-certi-wrapper-id');
    this.apiDataService.executeQuery(payload).subscribe(
      (response: any) => {
        let rawDevice = this.dataUtilService.convertXmlToJson(response);
        if (rawDevice.Save) {
          this.attachedCertificate = null;
        }
        this.spinnerService.hideSpinner();
        this.notificationService.addNotification(`Device <b>${rawDevice.Save.Device.DeviceName.$.Value}</b> was detached from certificate successfully`, 'success');
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }
}
