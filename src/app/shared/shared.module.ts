import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataUtilService } from './services/data-util.service';
import { ListBySpecificFieldsPipe } from './pipes/list-by-specific-fields.pipe';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoadingUtilService } from './services/loading-util.service';
import { DeviceCertificateService } from './services/device-certificate.service';
import { DomService } from './services/dom.service';
import { ModalService } from './services/modal.service';
import { ApiDataService } from './services/api-data.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { StarterCardComponent } from "src/app/shared/components/starter-card/starter-card.component";
import { NotificationService } from './services/notification.service';
import { DeviceMessageService } from './services/device-message.service';
import { WebsocketService } from './services/websocket.service';
import { EditApplicationDeploymentComponent } from './components/edit-application-deployment/edit-application-deployment.component';
import { ApplicationDeploymentComponent } from './components/application-deployment/application-deployment.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { MacValidatorDirective } from './directives/mac-validator.directive';
import { UrlValidatorDirective } from './directives/url-validator.directive';
import { DeviceUtilService } from './services/device-util.service';
import { ArrayTransformPipe } from './pipes/array-transform.pipe';
import { ChartModule } from 'angular-highcharts';
import { MomentModule } from 'angular2-moment';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { ListCustomFieldInObjsArrayPipe } from './pipes/list-custom-field-in-objs-array.pipe';
import { ApplicationDeploymentService } from './components/application-deployment/application-deployment.service';
import { DetailService } from './services/detail.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './components/confirmation-dialog/confirmation-dialog.service';
import { InputSearchComponent } from './components/input-search/input-search.component';
import { DecodePipe } from './pipes/decode.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ChartModule,
    MomentModule,
    NgSelectModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ListBySpecificFieldsPipe,
    ListCustomFieldInObjsArrayPipe,
    ArrayTransformPipe,
    NgbModule,
    StarterCardComponent,
    ApplicationDeploymentComponent,
    TreeViewComponent,
    TimeAgoPipe,
    UrlValidatorDirective,
    MacValidatorDirective,
    ChartModule,
    MomentModule,
    NgSelectModule,
    InputSearchComponent,
    DecodePipe
  ],
  declarations: [
    ListBySpecificFieldsPipe,
    ListCustomFieldInObjsArrayPipe,
    ArrayTransformPipe,
    StarterCardComponent,
    EditApplicationDeploymentComponent,
    ApplicationDeploymentComponent,
    TreeViewComponent,
    TimeAgoPipe,
    MacValidatorDirective,
    UrlValidatorDirective,
    ListCustomFieldInObjsArrayPipe,
    ConfirmationDialogComponent,
    InputSearchComponent,
    DecodePipe
  ],
  providers: [
    DataUtilService,
    NgbDropdownConfig,
    LoadingUtilService,
    DeviceCertificateService,
    DomService,
    ModalService,
    ApiDataService,
    SpinnerService,
    NotificationService,
    DeviceMessageService,
    WebsocketService,
    DeviceUtilService,
    ApplicationDeploymentService,
    DetailService,
    ConfirmationDialogService
  ],
  entryComponents: [
    EditApplicationDeploymentComponent,
    ConfirmationDialogComponent
  ]
})
export class SharedModule {
}
