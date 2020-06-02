import { Component, OnInit, OnDestroy } from '@angular/core';
import {DataUtilService} from '../../shared/services/data-util.service';
import {ApplicationListService} from './application-list.service';
import {GeneralConstant} from '../../shared/constants/general.constant';
import {EditApplicationComponent} from '../edit-application/edit-application.component';
import {ModalService} from '../../shared/services/modal.service';
import {ApiDataService} from '../../shared/services/api-data.service';
import {Payload} from '../../shared/models/payload';
import {PayloadsConstant} from '../../shared/constants/payloads.constant';
import {SpinnerService} from '../../shared/services/spinner.service';
import {NotificationService} from '../../shared/services/notification.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {

  private subscription: Subscription;
  public originalApplicationList: any[];
  public applications: any;
  public searchText: string;
  public selectedApplication: any;
  public listLimitCount: number;
  public listLimitCountDefault: number;
  public isShow: boolean = false;
  public modalSub: Subscription;
  public fieldsValuePairs: any = [
    {
      fields: [
        {name: 'item.Name', type: 'string'},
        {name: 'item.AppDownloadURL', type: 'string'},
        {name: 'item.Version', type: 'string'},
      ],
      require: false
    }
  ];

  public bulkAction: string;
  public checkAll: boolean;
  public itemsCheck: any[];
  public isAnyItemChecked: boolean;

  constructor(
    private applicationListService: ApplicationListService,
    private dataUtilService: DataUtilService,
    private modalService: ModalService,
    private apiDataService: ApiDataService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit() {
    this.listLimitCount = GeneralConstant.limitPaging;
    this.listLimitCountDefault = GeneralConstant.limitPaging;
    this.originalApplicationList = [];
    this.getAllApplication();

    this.modalSub = this.modalService.result.subscribe(result => {
      let type = result.formType;
      let data = result.data;
      this.selectedApplication = {
        id: data.id,
        name: data.name,
        package: data.package,
        version: data.version
      }
      if (type === GeneralConstant.modalDataReturnType.createApplication) {
        this.createApplication();
      } else if (type === GeneralConstant.modalDataReturnType.editApplication) {
        this.updateApplication();
      }
    });

    this.bulkAction = '';
    this.applications = [];
  }

  ngOnDestroy(): void {
    this.modalSub.unsubscribe();
  }

  getAllApplication() {
    let getAllApplicationPayload = new Payload(PayloadsConstant.application.getAll, []);
    this.spinnerService.showSpinner('application-list-id');
    this.apiDataService.executeQueryByServer(getAllApplicationPayload, 'application').subscribe(
      (response: any) => {
        let rawApplications = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
        
        if (!rawApplications.result.Applications.Application) return;
        this.originalApplicationList = this.dataUtilService.wrapObjToOneElementArray(
          rawApplications.result.Applications.Application
        );
        this.originalApplicationList = this.originalApplicationList.filter(app => app.IsTargetSchemaApplication.$.Value !== 'true');
        this.applications = this.applicationListService.getApplicationsByLimitCount(this.originalApplicationList, this.listLimitCount);
        this.checkAll = false;
        this.bulkAction = '';
        this.setBulkSelecting();
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  showUpsertApplicationForm(selectedApplication) {
    this.selectedApplication = {
      id: selectedApplication ? selectedApplication.AppId : '',
      name: selectedApplication ? selectedApplication.Name.$.Value : '',
      package: selectedApplication ? selectedApplication.AppDownloadURL.$.Value : '',
      version: selectedApplication ? selectedApplication.Version.$.Value : '',
    };

    this.modalService.openDataModal(
      EditApplicationComponent,
      this.selectedApplication,
      selectedApplication ? GeneralConstant.modalDataReturnType.editApplication : GeneralConstant.modalDataReturnType.createApplication
    );
  }

  createApplication() {
    let upsertApplicationPayload = new Payload(
      PayloadsConstant.application.upsert,
      [this.selectedApplication.name, this.selectedApplication.version, this.selectedApplication.package]
    );
    this.spinnerService.showSpinner('application-list-id');
    this.apiDataService.executeQueryByServer(upsertApplicationPayload, 'application').subscribe(
      (response: any) => {
        let rawResponse = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
        
        if (rawResponse.result.Status === "Success") {
          this.notificationService.addNotification(`Application was created successfully`, 'success');
          this.getAllApplication();
          this.bulkAction = '';
        } else {
          this.notificationService.addNotification(`Application was not created successfully`, 'success');
        }
        
        this.spinnerService.hideSpinner()
      }, (error: any) => {
        console.log('Update error');
      }
    );
  }

  updateApplication() {
    let updateApplicationPayload = new Payload(
      PayloadsConstant.application.update,
      [this.selectedApplication.id, this.selectedApplication.package, this.selectedApplication.name, this.selectedApplication.version]
    );
    this.spinnerService.showSpinner('application-list-id');
    this.apiDataService.executeQueryByServer(updateApplicationPayload, 'application').subscribe(
      (response: any) => {
        this.getAllApplication();
        this.notificationService.addNotification(`Application was updated successfully`, 'success');
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Update error');
      }
    );
  }

  loadLessMore() {
    if (this.applications.length < this.originalApplicationList.length) {
      this.listLimitCount += this.listLimitCount;
    } else {
      this.listLimitCount = GeneralConstant.limitPaging;
    }

    this.applications = this.applicationListService.getApplicationsByLimitCount(this.originalApplicationList, this.listLimitCount);
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
    this.itemsCheck = this.applications.map(app => {
      return {"id": app.AppId, "value": false};
    });
    this.isAnyItemChecked = this.itemsCheck.some(itemCheck => itemCheck.value);
  }

  public onSelectAction() {
    let selectedApps = this.itemsCheck.filter(item => item.value).map(app => {
      if (app.value) {
        return this.getApplicationById(app.id);
      };
    });

    switch (this.bulkAction) {
      case 'delete':
        this.openDeleteConfirmationDialog(selectedApps);
        break;

      case 'undeploy':
        this.openUndeloyConfirmationDialog(selectedApps);
        break;

      case 'default':
        return;
    }
  }

  public openDeleteConfirmationDialog(apps) {
    let appNames = apps.map(app => app.Name.$.Value);
    this.confirmationDialogService.confirm(
      `Delete Application(s)`,
      `Do you really want to delete ${appNames.join(', ')} application(s) ?`
    ).then((confirmed) => {
      if (confirmed) {
        let type = 'success';
        let message = '';
        this.spinnerService.showSpinner();
        this.applicationListService.deleteMultipleApp(apps).subscribe(responseList => {
          if (responseList.length !== apps.length) type = 'warning';
          responseList.forEach((res, index) => {
            message += `<div>${apps[index].Name.$.Value} has been deleted successfully</div>`;
          });

          this.getAllApplication();
          this.spinnerService.hideSpinner();
          this.notificationService.addNotification(message ? message : 'Delete not successful', type);
        });
      } else {
        this.getAllApplication();
      }
    }).catch(() => {this.getAllApplication();});
  }

  public openUndeloyConfirmationDialog(apps) {
    this.confirmationDialogService.confirm(
      `Undeploy Application(s)`,
      `This will undeploy the application everywhere it is currently deployed. Are you sure you want to continue?`,
      `Yes`, `No`, `lg`
    ).then(async confirmed => {
      if (confirmed) {
        let message = '';
        let processList = await this.applicationListService.undeployMultipleAppFromEgdes(apps);
        let errorMessages = processList.filter(process => process.error).map(e => e.error);
        if (errorMessages.length) {
          message += `<div class="text-danger">${errorMessages.join('</div><div class="text-danger">')}</div>`;
        }

        let appNames = processList.filter(process => !process.error).map(r => r.appName);
        let queriesPayload = processList.filter(process => !process.error).map(r => r.payload);
        if (queriesPayload.length) {
          this.spinnerService.showSpinner();
          let joinPayload = queriesPayload.join('');
          let response = await this.apiDataService.executeRawQueryByServer(joinPayload, 'edge');
          response.subscribe(response => {
            let resRaw = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
            if (resRaw.result.Status === "Success") {
              message += `<div class="text-success">Applications ${appNames.join(', ')} undeployed successfull.</div>`;
            } else {
              message += `<div class="text-danger">Error: Applications ${appNames.join(', ')} were still deployed to edges</div>`;
            }
            this.getAllApplication();
            this.spinnerService.hideSpinner();
            this.notificationService.addNotification(message, 'info');
          });
        } else {
          this.notificationService.addNotification(message, 'info');
          this.getAllApplication();
        }
      } else {
        this.getAllApplication();
      }
    }).catch(() => {this.getAllApplication();});
  }

  private getApplicationById(id) {
    return this.originalApplicationList.find(app => app.AppId === id);
  }

}
