import { TestBed, inject } from '@angular/core/testing';

import { CertificateListService } from './certificate-list.service';

describe('CertificateListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CertificateListService]
    });
  });

  it('should be created', inject([CertificateListService], (service: CertificateListService) => {
    expect(service).toBeTruthy();
  }));
});
