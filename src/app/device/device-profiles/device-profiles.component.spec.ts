import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceProfilesComponent } from './device-profiles.component';

describe('DeviceProfilesComponent', () => {
  let component: DeviceProfilesComponent;
  let fixture: ComponentFixture<DeviceProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
