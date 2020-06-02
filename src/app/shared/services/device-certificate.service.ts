import { Injectable } from '@angular/core';
import { DataUtilService } from './data-util.service';
import { ApiDataService } from './api-data.service';
import { Payload } from '../models/payload';
import { PayloadsConstant } from '../constants/payloads.constant';

@Injectable({
  providedIn: 'root'
})
export class DeviceCertificateService {

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
  ) { }

  async createAndAttachCertificateToDevice(certificateName, MACAddress): Promise<any> {
    let createCertificatePayload = new Payload(PayloadsConstant.createCertificateByCommonName, [certificateName]);
    const rawCreateCertificateResponse = await this.apiDataService.executeQuery(createCertificatePayload).toPromise();
    let createCertificateResponse = this.dataUtilService.convertXmlToJson(rawCreateCertificateResponse);

    if (!createCertificateResponse.DeviceCertificate) return;
    let attachCertificatePayload = new Payload(
      PayloadsConstant.attachCertificateToDevice,
      [MACAddress, createCertificateResponse.DeviceCertificate.certId]
    );

    const attachCertificateResponse = await this.apiDataService.executeQuery(attachCertificatePayload).toPromise();
    return this.dataUtilService.convertXmlToJson(`<result>${attachCertificateResponse}</result>`);
  }
}
