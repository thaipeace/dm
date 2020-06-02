import { TestBed, inject } from '@angular/core/testing';

import { ApplicationDetailService } from './application-detail.service';

describe('ApplicationDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationDetailService]
    });
  });

  it('should be created', inject([ApplicationDetailService], (service: ApplicationDetailService) => {
    expect(service).toBeTruthy();
  }));
});
