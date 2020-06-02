import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDetailTestComponent } from './device-detail-test.component';

describe('DeviceDetailTestComponent', () => {
  let component: DeviceDetailTestComponent;
  let fixture: ComponentFixture<DeviceDetailTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceDetailTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDetailTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
