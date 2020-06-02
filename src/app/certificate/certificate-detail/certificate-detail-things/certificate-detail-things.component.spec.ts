import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateDetailThingsComponent } from './certificate-detail-things.component';

describe('CertificateDetailThingsComponent', () => {
  let component: CertificateDetailThingsComponent;
  let fixture: ComponentFixture<CertificateDetailThingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateDetailThingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateDetailThingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
