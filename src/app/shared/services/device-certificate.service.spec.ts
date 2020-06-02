import { TestBed, inject } from '@angular/core/testing';

import { DeviceCertificateService } from './device-certificate.service';

describe('DeviceCertificateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceCertificateService]
    });
  });

  it('should be created', inject([DeviceCertificateService], (service: DeviceCertificateService) => {
    expect(service).toBeTruthy();
  }));
});
