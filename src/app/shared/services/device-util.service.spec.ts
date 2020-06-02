import { TestBed, inject } from '@angular/core/testing';

import { DeviceUtilService } from './device-util.service';

describe('DeviceUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceUtilService]
    });
  });

  it('should be created', inject([DeviceUtilService], (service: DeviceUtilService) => {
    expect(service).toBeTruthy();
  }));
});
