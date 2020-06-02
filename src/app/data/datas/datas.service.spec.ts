import { TestBed, inject } from '@angular/core/testing';

import { DatasService } from './datas.service';

describe('DatasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatasService]
    });
  });

  it('should be created', inject([DatasService], (service: DatasService) => {
    expect(service).toBeTruthy();
  }));
});
