import { TestBed, inject } from '@angular/core/testing';

import { ApplicationDeploymentService } from './application-deployment.service';

describe('ApplicationDeploymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationDeploymentService]
    });
  });

  it('should be created', inject([ApplicationDeploymentService], (service: ApplicationDeploymentService) => {
    expect(service).toBeTruthy();
  }));
});
