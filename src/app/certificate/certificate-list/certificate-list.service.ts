import { Injectable } from '@angular/core';

@Injectable()
export class CertificateListService {

  constructor() { }

  formatCertificate(raw): any {
    let certificate = {};
    for (let key in raw) {
      certificate[key] = raw[key].$ ? raw[key].$.Value : raw[key];
    }

    return certificate;
  }

  updateCertificates(certificates, certificate): any {
    certificates.forEach(item => {
      if (item.Certificate.CertificateId !== certificate.CertificateId) return;
      item.Certificate = certificate;
    });

    return certificates;
  }

  getCertificatesByLimitCount(originalCertificateList: any[], limit: number): any[] {
    let certificates =  originalCertificateList.filter((certificate, index) => index < limit);
    return certificates;
  }
}
