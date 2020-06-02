import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataUtilService } from '../../shared/services/data-util.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { GeneralConstant } from '../../shared/constants/general.constant';
import { CertificateListService } from './certificate-list.service';
import { ModalService } from '../../shared/services/modal.service';
import { AttachDeviceToCertificateComponent } from '../attach-device-to-certificate/attach-device-to-certificate.component';
import { ApiDataService } from '../../shared/services/api-data.service';
import { Payload } from '../../shared/models/payload';
import { PayloadsConstant } from '../../shared/constants/payloads.constant';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { AppConfigService } from '../../app-config.service';
import { AddCertificateComponent } from '../add-certificate/add-certificate.component';

@Component({
  selector: 'app-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.scss']
})

export class CertificateListComponent implements OnInit, OnDestroy {

  public baseUrl: string;
  public originalCertificateList: any;
  public certificates: any;
  public devices: any;
  public certificateName: any;
  public downloadLink: string;
  public searchText: string;
  public listLimitCount: number;
  public listLimitCountDefault: number;
  public modalSub: Subscription;
  public fieldsValuePairs: any = [
    { 
      fields: [
        {name: 'item.DeviceCertificate.commonName', type: 'string'},
        {name: 'item.DeviceCertificate.certId', type: 'string'},
      ],
      require: false
    }
  ];

  constructor(
    private certificateListService: CertificateListService,
    private dataUtilService: DataUtilService,
    private dropdownConfig: NgbDropdownConfig,
    private modalService: ModalService,
    private apiDataService: ApiDataService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private appConfigService: AppConfigService
  ) {
    this.dropdownConfig.placement = 'bottom-right';
  }

  ngOnInit() {
    this.baseUrl = `http://${this.appConfigService.settings.url}:${this.appConfigService.settings.port}/`;
    this.listLimitCount = GeneralConstant.limitPaging;
    this.listLimitCountDefault = GeneralConstant.limitPaging;
    this.originalCertificateList = [];
    this.getAllCertificate();
    this.getAllDevice();

    this.modalSub = this.modalService.result.subscribe(result => {
      let type = result.formType;
      let data = result.data;
      
      if (type === GeneralConstant.modalDataReturnType.attachDevice) {
        this.attachDeviceToCertificate(data);
      }
      
      if (type === GeneralConstant.modalDataReturnType.createCertificate) {
        if (data.createNew) {
          this.certificateName = data.value;
          this.createCertificate();
        } else {
          this.downloadLink = data.value;
          this.uploadCertificate();
        }
      }
    });
  }

  ngOnDestroy() {
    this.modalSub.unsubscribe();
  }

  getAllCertificate() {
    let payload = new Payload(PayloadsConstant.findAllCertificates, []);
    this.spinnerService.showSpinner('certificate-list-id');
    this.apiDataService.executeQuery(payload).subscribe(
      (response: any) => {
        this.originalCertificateList = this.dataUtilService.wrapObjToOneElementArray(
          this.dataUtilService.convertXmlToJson(response).Find.Result
        );

        if (!this.originalCertificateList) return; 
        this.certificates = this.certificateListService.getCertificatesByLimitCount(this.originalCertificateList, this.listLimitCount);
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  getAllDevice() {
    let getAllDevicePayload = new Payload(PayloadsConstant.findAllDevices, []);
    this.apiDataService.executeQuery(getAllDevicePayload).subscribe(
      (response: any) => {
        this.devices = this.dataUtilService.wrapObjToOneElementArray(
          this.dataUtilService.convertXmlToJson(response).Find.Result
        );
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  getDevicesByCertificate(certificateId) {
    if (!this.devices) return;
    let result = [];
    for (let i=0; i < this.devices.length; i++) {
      if (this.devices[i].Device.certId === certificateId) {
        result.push(this.devices[i].Device.DeviceName);
      }
    }
    return result.length > 0 ? result : 0;
  }

  createCertificate() {
    let payload = new Payload(PayloadsConstant.createCertificateByCommonName, [this.certificateName]);
    this.spinnerService.showSpinner('certificate-list-id');
    this.apiDataService.executeQuery(payload).subscribe(
        (response: any) => {
          let rawResponse = this.dataUtilService.convertXmlToJson(response);
          if (rawResponse.GenerateDeviceSSLCertiFail) {
            this.notificationService.addNotification(`${rawResponse.GenerateDeviceSSLCertiFail.Message}`, 'danger');
          }else {
            // TODO refomat by devicecerti style
            let newCertificates = {
              DeviceCertificate: {
                certId: rawResponse.DeviceCertificate.certId,
                commonName: rawResponse.DeviceCertificate.commonName.$.Value,
                zipFileURL: rawResponse.DeviceCertificate.zipFileURL.$.Value
              }
            };

            this.originalCertificateList = [newCertificates, ...this.originalCertificateList];
            this.certificates = this.certificateListService.getCertificatesByLimitCount(this.originalCertificateList, this.listLimitCount);
            this.notificationService.addNotification(`Certificate <b>${rawResponse.DeviceCertificate.commonName.$.Value}</b> was created successfully`, 'success');
          }

          this.spinnerService.hideSpinner();
        }, (error: any) => {
          console.log('Update error');
        }
      );
  }

  uploadCertificate() {
    let uploadCertificatePayload = new Payload(PayloadsConstant.uploadCertificate, [this.downloadLink]);
    this.spinnerService.showSpinner('certificate-list-id');
    this.apiDataService.executeQuery(uploadCertificatePayload).subscribe(
      (response: any) => {
        let rawResponse = this.dataUtilService.convertXmlToJson(response);
        
        if (rawResponse.UploadCertificateFailed) {
          this.notificationService.addNotification(
            `${rawResponse.UploadCertificateFailed.Message}`, 'danger'
          );
        } else {
          this.notificationService.addNotification(
            `${rawResponse.UploadCertificateSuccess.Message}`, 'success'
          );
          this.getAllCertificate();
        }

        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Update error');
      }
    );
  }

  removeCertificate(id) {
    let payload = new Payload(PayloadsConstant.deleteCertificateByCertificateId, [id]);
    this.spinnerService.showSpinner('certificate-list-id');
    this.apiDataService.executeQuery(payload).subscribe(
        (response: any) => {
          this.originalCertificateList = this.originalCertificateList.filter(certificate => certificate.DeviceCertificate.certId !== id);
          this.certificates = this.certificateListService.getCertificatesByLimitCount(this.originalCertificateList, this.listLimitCount);
          this.notificationService.addNotification(`Certificate was removed successfully`, 'success');
          this.spinnerService.hideSpinner();
        }, (error: any) => {
          console.log('Update error');
        }
      );
  }

  loadLessMore() {
    if (this.certificates.length < this.originalCertificateList.length) {
      this.listLimitCount += this.listLimitCount;
    } else {
      this.listLimitCount = GeneralConstant.limitPaging;
    }
    
    this.certificates = this.certificateListService.getCertificatesByLimitCount(this.originalCertificateList, this.listLimitCount);
  }

  showAttachDeviceDialog(certificate) {
    this.modalService.openDataModal(
      AttachDeviceToCertificateComponent,
      certificate,
      GeneralConstant.modalDataReturnType.attachDevice
    )
  }

  attachDeviceToCertificate(data) {
    let attachDeviceToCertificatePayload = new Payload(
      PayloadsConstant.attachCertificateToDevice,
      [data.selectedDeviceMACAddress, data.certificateId]
    );
    this.spinnerService.showSpinner('certificate-list-id');
    this.apiDataService.executeQuery(attachDeviceToCertificatePayload).subscribe(
      (response: any) => {
        this.getAllCertificate();
        this.getAllDevice();
        this.notificationService.addNotification(`Certificate was attached successfully`, 'success');
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  showCreateCertificateModal() {
    this.modalService.openDataModal(
      AddCertificateComponent,
      {},
      GeneralConstant.modalDataReturnType.createCertificate
    );
  }
}
