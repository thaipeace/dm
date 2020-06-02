import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachDeviceToCertificateComponent } from './attach-device-to-certificate.component';

describe('AttachDeviceToCertificateComponent', () => {
  let component: AttachDeviceToCertificateComponent;
  let fixture: ComponentFixture<AttachDeviceToCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachDeviceToCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachDeviceToCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
