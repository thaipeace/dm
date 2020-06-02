import { Component, OnInit, Input } from '@angular/core';
import { EditApplicationDeploymentComponent } from '../edit-application-deployment/edit-application-deployment.component';
import { ModalService } from '../../services/modal.service';
import { GeneralConstant } from '../../constants/general.constant';
import { Subscription } from 'rxjs';
import { Payload } from '../../models/payload';
import { PayloadsConstant } from '../../constants/payloads.constant';
import { ApiDataService } from '../../services/api-data.service';
import { NotificationService } from '../../services/notification.service';
import { DataUtilService } from '../../services/data-util.service';
import { SpinnerService } from '../../services/spinner.service';
import { ApplicationDeploymentService } from './application-deployment.service';

@Component({
  selector: 'app-application-deployment',
  templateUrl: './application-deployment.component.html',
  styleUrls: ['./application-deployment.component.scss']
})
export class ApplicationDeploymentComponent implements OnInit {

  @Input() thing: any;
  public deployedApplications: any[];
  public selectedApplication: any;
  public modalSub: Subscription;

  public bulkAction: string;
  public checkAll: boolean;
  public itemsCheck: any[];
  public isAnyItemChecked: boolean;
  public isEdge: boolean;
  
  constructor(
    private modalService: ModalService,
    private apiDataService: ApiDataService,
    private notificationService: NotificationService,
    private dataUtilService: DataUtilService,
    private spinnerService: SpinnerService,
    private applicationDeploymentService: ApplicationDeploymentService
  ) { }

  ngOnInit() {
    this.isEdge = this.thing.EdgeId ? true : false;
    this.getAllApplicationDeployed(this.thing);
    this.bulkAction = '';
    this.deployedApplications = [];

    this.modalSub = this.modalService.result.subscribe(result => {
      let type = result.formType;
      this.selectedApplication = result.data.application;

      if (type === GeneralConstant.modalDataReturnType.createApplicationDeployment) {
        if (this.isEdge) {
          this.createEdgeApplicationDeployment();
        } else {
          this.createDeviceApplicationDeployment();
        }
        
      }
    });

    // this.subscription = this.deviceMessageService.messageReadingObservable.subscribe((rs) => {
    //   if (rs) {
    //     this.notificationService.addNotification('New provision came', 'success');
    //     this.getAllEdge();
    //   }
    // })
  }

  ngOnDestroy(): void {
    this.modalSub.unsubscribe();
    // this.subscription.unsubscribe();
  }

  getAllApplicationDeployed(thing) {
    if (!thing) return;
    let findAppsByAStackIdPayload = new Payload(
      PayloadsConstant.application.findAppsByAStackId,
      [this.isEdge ? thing.EdgeId : thing.DeviceId]
    );
    this.spinnerService.showSpinner('spinner-deploy-application', GeneralConstant.smallSpinerConfig);
    this.apiDataService.executeQueryByServer(findAppsByAStackIdPayload, 'application').subscribe(
      (response) => {
        let rawResponse = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);

        if (rawResponse.result.Status === 'Success') {
          let applications = this.dataUtilService.wrapObjToOneElementArray(rawResponse.result.Applications.Application);
          this.deployedApplications = applications.filter(app => {
            return app.State === 'Deployed' && app.IsTargetSchemaApplication !== "true" && app.AppId;
          });
          this.setBulkSelecting();
          this.bulkAction = '';
        } else {
          this.notificationService.addNotification(rawResponse.result.Message, 'danger');
        }
      },
      (error) => {
        console.log('Loading error');
      }
    )
    this.spinnerService.hideSpinner();
  }

  showDeployApplicationFrom() {
    this.modalService.openDataModal(
      EditApplicationDeploymentComponent,
      this.deployedApplications,
      GeneralConstant.modalDataReturnType.createApplicationDeployment
    );
  }

  createEdgeApplicationDeployment() {
    this.spinnerService.showSpinner('spinner-deploy-application', GeneralConstant.smallSpinerConfig);
    let createApplicationDeploymentPayload = new Payload(
      PayloadsConstant.edge.deployApp,
      [this.thing.EdgeId, this.selectedApplication.AppId]
    );
    this.apiDataService.executeQueryByServer(createApplicationDeploymentPayload, 'edge').subscribe(
      (response: any) => {
        let rawResponse = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
        if (rawResponse.result.Status === 'Failed') {
          this.notificationService.addNotification(`Application ${this.selectedApplication.Name.$.Value} was not deployed on ${this.thing.EdgeName} successfully <br/> ${rawResponse.result.Message}`, 'danger');
        } else {
          this.getAllApplicationDeployed(this.thing);
          this.notificationService.addNotification(`Application ${this.selectedApplication.Name.$.Value} was deployed on ${this.thing.EdgeName} successfully`, 'success');
        }
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  createDeviceApplicationDeployment() {
    this.spinnerService.showSpinner('spinner-deploy-application', GeneralConstant.smallSpinerConfig);
    let createApplicationDeploymentPayload = new Payload(
      PayloadsConstant.deployAppOnDeviceFromHS,
      [this.thing.DeviceId, this.selectedApplication.AppId]
    );
    this.apiDataService.executeQuery(createApplicationDeploymentPayload).subscribe(
      (response: any) => {
        let rawResponse = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
        if (rawResponse.result.Status === 'Failed') {
          this.notificationService.addNotification(`Application ${this.selectedApplication.Name.$.Value} was not deployed on ${this.thing.DeviceName} successfully <br/> ${rawResponse.result.Message}`, 'danger');
        } else {
          this.getAllApplicationDeployed(this.thing);
          this.notificationService.addNotification(`Application ${this.selectedApplication.Name.$.Value} was deployed on ${this.thing.DeviceName} successfully`, 'success');
        }
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  public onCheckAllModel(event) {
    this.isAnyItemChecked = this.checkAll;
    this.itemsCheck.forEach(itemCheck => {
      itemCheck.value = this.checkAll;
    });
  }

  public onCheckModel(event) {
    this.isAnyItemChecked = this.itemsCheck.some(itemCheck => itemCheck.value);
    this.checkAll = this.itemsCheck.every(itemCheck => itemCheck.value);
  }

  private setBulkSelecting() {
    this.itemsCheck = this.deployedApplications.map(app => {
      return {"id": app.AppId, "value": false};
    });
    this.isAnyItemChecked = this.itemsCheck.some(itemCheck => itemCheck.value);
  }

  public onSelectAction() {
    let selectedApps = this.itemsCheck.filter(item => item.value).map(model => {
      if (model.value) {
        return this.getAppById(model.id);
      };
    });

    let type = 'success';
    let message = '';
    this.spinnerService.showSpinner();
    switch (this.bulkAction) {
      case 'stop':
        this.applicationDeploymentService.stopMultipleApp(selectedApps).subscribe(responseList => {
          if (responseList.length !== selectedApps.length) type = 'warning';
          responseList.forEach((res, index) => {
            message += `<div>${selectedApps[index].Name} is stopped successfully</div>`;
          });

          this.getAllApplicationDeployed(this.thing);
          this.spinnerService.hideSpinner();
          this.notificationService.addNotification(message ? message : 'Stopping failed', type);
        });
        break;

      case 'start':
        this.applicationDeploymentService.startMultipleApp(selectedApps).subscribe(responseList => {
          if (responseList.length !== selectedApps.length) type = 'warning';
          responseList.forEach((res, index) => {
            message += `<div>${selectedApps[index].Name} was started successfull</div>`;
          });

          this.getAllApplicationDeployed(this.thing);
          this.spinnerService.hideSpinner();
          this.notificationService.addNotification(message ? message : 'Starting is failed', type);
        });
        break;

      case 'restart':
        this.applicationDeploymentService.restartMultipleApp(selectedApps).subscribe(responseList => {
          if (responseList.length !== selectedApps.length) type = 'warning';
          responseList.forEach((res, index) => {
            message += `<div>${selectedApps[index].Name} was restarted successfull</div>`;
          });

          this.getAllApplicationDeployed(this.thing);
          this.spinnerService.hideSpinner();
          this.notificationService.addNotification(message ? message : 'Restarting is failed', type);
        });
        break;

      case 'redeploy':
        this.applicationDeploymentService.redeployMultipleApp(selectedApps).subscribe(responseList => {
          if (responseList.length !== selectedApps.length) type = 'warning';
          responseList.forEach((res, index) => {
            message += `<div>${selectedApps[index].Name} was redeployed successfull</div>`;
          });

          this.getAllApplicationDeployed(this.thing);
          this.spinnerService.hideSpinner();
          this.notificationService.addNotification(message ? message : 'Reploying is failed', type);
        });
        break;

      case 'undeploy':
        this.applicationDeploymentService.undeployMultipleApp(this.thing, selectedApps).subscribe(responseList => {
          if (responseList.length !== selectedApps.length) type = 'warning';
          responseList.forEach((res, index) => {
            let rawRes = this.dataUtilService.convertXmlToJson(`<result>${res}</result>`);
            if (rawRes.result.Status === 'Success') {
              message += `<div>${selectedApps[index].Name} was undeployed successfully</div>`;
            } else {
              message += `<div>${rawRes.result.Message}</div>`;
              type = 'warning';
            }
          });

          this.getAllApplicationDeployed(this.thing);
          this.spinnerService.hideSpinner();
          this.notificationService.addNotification(message ? message : 'Undeploying is failed', type);
        });
        break;

      case 'default':
        return;
    }
  }

  private getAppById(id) {
    return this.deployedApplications.find(app => app.AppId === id);
  }
}
