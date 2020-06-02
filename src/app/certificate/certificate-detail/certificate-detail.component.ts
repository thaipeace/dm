import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataUtilService } from '../../shared/services/data-util.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiDataService } from '../../shared/services/api-data.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Payload } from '../../shared/models/payload';
import { PayloadsConstant } from '../../shared/constants/payloads.constant';
import { ModalService } from '../../shared/services/modal.service';
import { AttachDeviceToCertificateComponent } from '../attach-device-to-certificate/attach-device-to-certificate.component';
import { GeneralConstant } from '../../shared/constants/general.constant';
import { NotificationService } from '../../shared/services/notification.service';
import { CertificateService } from '../certificate.service';
import { Subscription } from 'rxjs';
import { AppConfigService } from '../../app-config.service';

@Component({
  selector: 'app-certificate-detail',
  templateUrl: './certificate-detail.component.html',
  styleUrls: ['./certificate-detail.component.scss']
})
export class CertificateDetailComponent implements OnInit, OnDestroy {
  
  public id: number;
  public certificate: any;
  public currentView: string;
  public baseUrl: string;
  public devices: any;
  public modalSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataUtilService: DataUtilService,
    private dropdownConfig: NgbDropdownConfig,
    private apiDataService: ApiDataService,
    private spinnerService: SpinnerService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private certificateService: CertificateService,
    private appConfigService: AppConfigService
  ) {
    this.dropdownConfig.placement = 'bottom-right';
  }

  ngOnInit() {
    this.baseUrl = `http://${this.appConfigService.settings.url}:${this.appConfigService.settings.port}/`;

    this.route.params.subscribe(params => {
      this.id = params['certificateId'];
      this.getCertificateById(this.id);
      this.getAllDeviceByCertificateId(this.id);
    });

    this.modalSub = this.modalService.result.subscribe(result => {
      let type = result.formType;
      let data = result.data;
      if (type !== GeneralConstant.modalDataReturnType.attachDevice) return;
      this.attachDeviceToCertificate(data);
    });
  }

  ngOnDestroy() {
    this.modalSub.unsubscribe();
  }

  async getCertificateById(id) {
    this.spinnerService.showSpinner('certificate-detail-body-main-content-id');
    let response = await this.certificateService.getCertificateById(id);
    let rawCertificate = this.dataUtilService.convertXmlToJson(response);
        
    if (!rawCertificate.Find.Result) return;
    this.certificate = rawCertificate.Find.Result.DeviceCertificate;
    this.viewContent('details');
    this.spinnerService.hideSpinner();
  }

  viewContent(type: string) {
    this.currentView = type;
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
    this.spinnerService.showSpinner('certificate-detail-body-main-content-id');
    this.apiDataService.executeQuery(attachDeviceToCertificatePayload).subscribe(
      (response: any) => {
        let rawResponse = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
        this.currentView = 'things';
        this.getAllDeviceByCertificateId(this.id);
        this.spinnerService.hideSpinner();
        this.notificationService.addNotification(`Certificate was attached to <b>${rawResponse.result.Device.DeviceName.$.Value}</b> device successfully`, 'success');
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  removeCertificate(id) {
    let payload = new Payload(PayloadsConstant.deleteCertificateByCertificateId, [id]);
    this.spinnerService.showSpinner('certificate-detail-body-main-content-id');
    this.apiDataService.executeQuery(payload).subscribe(
        (response: any) => {
          let rawResponse = this.dataUtilService.convertXmlToJson(response);
          this.notificationService.addNotification(`Certificate <b>${rawResponse.DeleteAll.Result.DeviceCertificate.commonName}</b> was removed successfully`, 'success');
          this.spinnerService.hideSpinner();
          this.router.navigate(['/certificates']);
        }, (error: any) => {
          console.log('Update error');
        }
      );
  }

  getAllDeviceByCertificateId(id) {
    let payload = new Payload(PayloadsConstant.findDevicesByCertificateId, [id])
    this.apiDataService.executeQuery(payload).subscribe(
      (response: any) => {
        this.devices = this.dataUtilService.wrapObjToOneElementArray(
          this.dataUtilService.convertXmlToJson(response).Find.Result
        );
      }, (error: any) => {
        console.log('Loading error');
      }
    )
  }
}
