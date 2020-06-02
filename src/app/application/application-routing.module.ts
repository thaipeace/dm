import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationDetailComponent } from './application-detail/application-detail.component';

const applicationRoutes: Routes = [
  { 
    path: 'applications', component: ApplicationListComponent, data: { 
      breadcrumb: [
        {label: "Applications", url: ""}
      ]
    },
    canActivate: [AuthGuard]
  },
  { 
    path: 'applications/application/:applicationId', component: ApplicationDetailComponent, data: {
      breadcrumb: [
        { label: "Applications", url: "/applications" },
        { label: ":applicationId", url: "" }
      ]
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(applicationRoutes)],
  exports: [RouterModule]
})
export class applicationRoutingModule {
}
