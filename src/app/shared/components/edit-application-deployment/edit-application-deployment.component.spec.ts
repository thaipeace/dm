import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApplicationDeploymentComponent } from './edit-application-deployment.component';

describe('EditApplicationDeploymentComponent', () => {
  let component: EditApplicationDeploymentComponent;
  let fixture: ComponentFixture<EditApplicationDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditApplicationDeploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditApplicationDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
