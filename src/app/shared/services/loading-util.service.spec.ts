import { TestBed, inject } from '@angular/core/testing';

import { LoadingUtilService } from './loading-util.service';

describe('LoadingUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingUtilService]
    });
  });

  it('should be created', inject([LoadingUtilService], (service: LoadingUtilService) => {
    expect(service).toBeTruthy();
  }));
});
