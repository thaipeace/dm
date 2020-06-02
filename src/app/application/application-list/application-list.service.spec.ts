import { TestBed, inject } from '@angular/core/testing';

import { ApplicationListService } from './application-list.service';

describe('ApplicationListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationListService]
    });
  });

  it('should be created', inject([ApplicationListService], (service: ApplicationListService) => {
    expect(service).toBeTruthy();
  }));
});
