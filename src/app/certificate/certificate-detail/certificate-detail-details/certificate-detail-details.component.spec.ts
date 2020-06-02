import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateDetailDetailsComponent } from './certificate-detail-details.component';

describe('CertificateDetailDetailsComponent', () => {
  let component: CertificateDetailDetailsComponent;
  let fixture: ComponentFixture<CertificateDetailDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateDetailDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateDetailDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
