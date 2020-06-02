import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataUtilService } from '../../shared/services/data-util.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationListService } from '../application-list/application-list.service';
import { GeneralConstant } from '../../shared/constants/general.constant';
import { ApiDataService } from '../../shared/services/api-data.service';
import { Payload } from '../../shared/models/payload';
import { PayloadsConstant } from '../../shared/constants/payloads.constant';
import { NotificationService } from '../../shared/services/notification.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ApplicationDetailService } from './application-detail.service';

@Component({
  selector: 'app-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.scss']
})
export class ApplicationDetailComponent implements OnInit {

  public id: number;
  public application: any;
  public applicationKeys: any[];
  public selectedApplication: any;
  public things: any[];
  public applicationFromDeployment: any;
  public currentView: string;

  public bulkAction: string;
  public checkAll: boolean;
  public itemsCheck: any[];
  public isAnyItemChecked: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataUtilService: DataUtilService,
    private dropdownConfig: NgbDropdownConfig,
    private applicationListService: ApplicationListService,
    private apiDataService: ApiDataService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private applicationDetailService: ApplicationDetailService
  ) {
    this.dropdownConfig.placement = 'bottom-right';
   }

  ngOnInit() {
    this.currentView = 'details';
    this.bulkAction = '';
    this.things = [];

    this.route.params.subscribe(async params => {
      this.id = params['applicationId'];
      let resApp = await this.getApplicationById(this.id);
      let rawApplication = this.dataUtilService.convertXmlToJsonParseAttributes(resApp);
      if (rawApplication.Find.Status === "Success") {
        this.application = rawApplication.Find.Result.Application;
        this.applicationKeys = Object.keys(this.application);
        this.getThingByAppId(this.application);
      }
    });
  }

  getApplicationById(id) {
    let getApplicationByIdPayload = new Payload(PayloadsConstant.application.getById, [id]);
    return this.apiDataService.executeQueryByServer(getApplicationByIdPayload, 'application').toPromise();
  }

  getThingByAppId(app) {
    let getThingByAppIdPayload = new Payload(PayloadsConstant.application.findAStacksByApp, [app.Name.Value, app.Version.Value]);
    this.apiDataService.executeQueryByServer(getThingByAppIdPayload, 'application').subscribe(
      (response: any) => {
        let rawApplication = this.dataUtilService.convertXmlToJsonParseAttributes(
          `<result>${response}</result>`
        );
        if (!rawApplication.result.AStackList) return;
        this.things = this.dataUtilService.wrapObjToOneElementArray(rawApplication.result.AStackList.AStackDetail);
        this.things = this.things.filter(thing => thing.DeployedApp.State.Value === 'Deployed');
        this.applicationFromDeployment = rawApplication.result.Application;
        this.setBulkSelecting();
        this.bulkAction = '';
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  viewContent(type: string) {
    this.currentView = type;
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
    this.itemsCheck = this.things.map(thing => {
      return {"id": thing.AStackId.Value, "value": false};
    });
    this.isAnyItemChecked = this.itemsCheck.some(itemCheck => itemCheck.value);
  }

  public onSelectAction() {
    let selectedThings = this.itemsCheck.filter(item => item.value).map(thing => {
      if (thing.value) {
        return this.getThingById(thing.id);
      };
    });

    let type = 'success';
    let message = '';
    this.spinnerService.showSpinner();
    switch (this.bulkAction) {
      case 'undeploy':
        this.applicationDetailService.undeployMultipleThings(selectedThings, this.application).subscribe(responseList => {
          if (responseList.length !== selectedThings.length) type = 'warning';
          responseList.forEach((res, index) => {
            let rawRes = this.dataUtilService.convertXmlToJson(`<result>${res}</result>`);
            if (rawRes.result.Status === "Success") {
              message += `<div>${selectedThings[index].Name.Value} was undeployed successfully</div>`;
            }
          });

          this.getThingByAppId(this.application);
          this.spinnerService.hideSpinner();
          this.notificationService.addNotification(message ? message : 'Undeploy not successful', type);
        });
        break;

      case 'default':
        return;
    }
  }

  private getThingById(id) {
    return this.things.find(thing => thing.AStackId.Value === id);
  }
}
