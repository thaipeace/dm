import { Injectable } from '@angular/core';
import { Payload } from '../shared/models/payload';
import { PayloadsConstant } from '../shared/constants/payloads.constant';
import { ApiDataService } from '../shared/services/api-data.service';

@Injectable()
export class CertificateService {
  constructor(
    private apiDataService: ApiDataService
  ) { }

  getCertificateById(id): Promise<any> {
    let payload = new Payload(PayloadsConstant.findCertificateByCertificateId, [id]);
    return this.apiDataService.executeQuery(payload).toPromise();
  }
}
