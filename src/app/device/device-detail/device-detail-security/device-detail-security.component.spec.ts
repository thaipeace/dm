import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDetailSecurityComponent } from './device-detail-security.component';

describe('DeviceDetailSecurityComponent', () => {
  let component: DeviceDetailSecurityComponent;
  let fixture: ComponentFixture<DeviceDetailSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceDetailSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDetailSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
