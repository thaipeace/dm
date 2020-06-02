import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDetailDetailsComponent } from './device-detail-details.component';

describe('DeviceDetailDetailsComponent', () => {
  let component: DeviceDetailDetailsComponent;
  let fixture: ComponentFixture<DeviceDetailDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceDetailDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDetailDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
