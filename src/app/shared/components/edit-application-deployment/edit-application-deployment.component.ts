import { Component, OnInit, Input, Output, resolveForwardRef } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { GeneralConstant } from '../../constants/general.constant';
import { Payload } from '../../models/payload';
import { PayloadsConstant } from '../../constants/payloads.constant';
import { ApiDataService } from '../../services/api-data.service';
import { DataUtilService } from '../../services/data-util.service';

@Component({
  selector: 'app-edit-application-deployment',
  templateUrl: './edit-application-deployment.component.html',
  styleUrls: ['./edit-application-deployment.component.scss']
})
export class EditApplicationDeploymentComponent implements OnInit {
  // Catch name from the inputs.selectedapplication-deployment in devide-list.component.ts
  @Input() dataModal: any;

  public title: string;
  public applicationDeployment: any = {
    application: '',
    applyDefaultConfiguration: false
  };
  public applications: any[];
  public deployedApplications: any[];

  constructor(
    private modalService: ModalService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) {  }

  ngOnInit() {
    this.applications = [];
    this.deployedApplications = this.dataModal;
    this.setAvailableApplications();
  }

  public setAvailableApplications() {
    let getApplicationPayload = new Payload(PayloadsConstant.application.getAll, []);
    this.apiDataService.executeQueryByServer(getApplicationPayload, 'application').subscribe(response => {
      let rawApps = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
      if (rawApps.result.Status === 'Success') {
        this.applications = this.dataUtilService.wrapObjToOneElementArray(rawApps.result.Applications.Application);
        this.applications = this.applications.filter(app => {
          return app.IsTargetSchemaApplication.$.Value !== "true" &&
            (this.deployedApplications.length ? 
              !this.deployedApplications.some(deployedApp => deployedApp.AppId === app.AppId) :
              true)
        });
      }
    }, error => {
      console.log('Loading error');
    });
  }

  public onSaveApplicationDeployment() {
    let type: string;
    type = GeneralConstant.modalDataReturnType.createApplicationDeployment;
    this.modalService.emitAndDestroy(this.applicationDeployment, type);
  }

  public close() {
    this.modalService.destroy();
  }
}