import { TestBed, inject } from '@angular/core/testing';

import { AttachRulesService } from './attach-rules.service';

describe('AttachRulesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttachRulesService]
    });
  });

  it('should be created', inject([AttachRulesService], (service: AttachRulesService) => {
    expect(service).toBeTruthy();
  }));
});
