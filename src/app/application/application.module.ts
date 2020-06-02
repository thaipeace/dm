import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationDetailComponent } from './application-detail/application-detail.component';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { SharedModule } from '../shared/shared.module';
import { ApplicationListService } from './application-list/application-list.service';
import { applicationRoutingModule } from './application-routing.module';
import { ApplicationDetailService } from './application-detail/application-detail.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    applicationRoutingModule
  ],
  entryComponents: [
    EditApplicationComponent
  ],
  providers: [
    ApplicationListService,
    ApplicationDetailService
  ],
  declarations: [ApplicationListComponent, ApplicationDetailComponent, EditApplicationComponent]
})
export class ApplicationModule { }
