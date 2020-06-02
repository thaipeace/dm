import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateRoutingModule } from './certificate-routing.module';
import { CertificateService } from './certificate.service';
import { CertificateListService } from './certificate-list/certificate-list.service';
import { SharedModule } from '../shared/shared.module';
import { CertificateDetailComponent } from './certificate-detail/certificate-detail.component';
import { CertificateDetailDetailsComponent } from './certificate-detail/certificate-detail-details/certificate-detail-details.component';
import { CertificateDetailThingsComponent } from './certificate-detail/certificate-detail-things/certificate-detail-things.component';
import { AttachDeviceToCertificateComponent } from './attach-device-to-certificate/attach-device-to-certificate.component';
import { AddCertificateComponent } from './add-certificate/add-certificate.component';

@NgModule({
  imports: [
    CommonModule,
    CertificateRoutingModule,
    SharedModule
  ],
  providers: [
    CertificateService,
    CertificateListService
  ],
  entryComponents: [
    AttachDeviceToCertificateComponent,
    AddCertificateComponent
  ],
  declarations: [
    CertificateListComponent,
    CertificateDetailComponent,
    CertificateDetailDetailsComponent, 
    CertificateDetailThingsComponent,
    AttachDeviceToCertificateComponent,
    AddCertificateComponent
  ]
})
export class CertificateModule { }
