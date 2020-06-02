import { TestBed, inject } from '@angular/core/testing';

import { DataUtilService } from './data-util.service';

describe('DataUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataUtilService]
    });
  });

  it('should be created', inject([DataUtilService], (service: DataUtilService) => {
    expect(service).toBeTruthy();
  }));
});
