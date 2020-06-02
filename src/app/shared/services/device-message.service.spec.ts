import { TestBed, inject } from '@angular/core/testing';

import { DeviceMessageService } from './device-message.service';

describe('DeviceMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceMessageService]
    });
  });

  it('should be created', inject([DeviceMessageService], (service: DeviceMessageService) => {
    expect(service).toBeTruthy();
  }));
});
