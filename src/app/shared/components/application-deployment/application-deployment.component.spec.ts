import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDeploymentComponent } from './application-deployment.component';

describe('ApplicationDeploymentComponent', () => {
  let component: ApplicationDeploymentComponent;
  let fixture: ComponentFixture<ApplicationDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDeploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
