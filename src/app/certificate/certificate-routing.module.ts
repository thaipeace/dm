import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateDetailComponent } from './certificate-detail/certificate-detail.component';
import { AuthGuard } from '../guard/auth.guard';

const certificateRoutes: Routes = [
  { path: 'certificates', component: CertificateListComponent, data: { 
      breadcrumb: [
        { label: "Certificates", url: "" },
      ]
    },
    canActivate: [AuthGuard]
  },
  { path: 'certificates/certificate/:certificateId', component: CertificateDetailComponent, data: {
      breadcrumb: [
        { label: "Certificate", url: "/certificates" },
        { label: ":certificateId", url: "" },
      ]
    } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(certificateRoutes)],
  exports: [RouterModule]
})
export class CertificateRoutingModule { }