import { TestBed, inject } from '@angular/core/testing';

import { QueryMessageService } from './query-message.service';

describe('QueryMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryMessageService]
    });
  });

  it('should be created', inject([QueryMessageService], (service: QueryMessageService) => {
    expect(service).toBeTruthy();
  }));
});
