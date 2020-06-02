import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeneralConstant } from 'src/app/shared/constants/general.constant';
import { Payload } from 'src/app/shared/models/payload';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';
import { DataUtilService } from 'src/app/shared/services/data-util.service';
import { ApiDataService } from 'src/app/shared/services/api-data.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DatasService } from './datas.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { Subscription } from 'rxjs';
import { AttachRulesComponent } from './attach-rules/attach-rules.component';

@Component({
  selector: 'app-datas',
  templateUrl: './datas.component.html',
  styleUrls: ['./datas.component.scss']
})
export class DatasComponent implements OnInit, OnDestroy {

  public originalDataList: any[];
  public datas: any;
  public searchText: string;
  public selectedData: any;
  public selectedRules: any[];
  public listLimitCount: number;
  public listLimitCountDefault: number;
  public isShow: boolean = false;
  public fieldsValuePairs: any = [
    {
      fields: [
        {name: 'item.SyncInfo.ModelName', type: 'string'},
        {name: 'item.SyncInfo.SourceName', type: 'string'},
        {name: 'item.SyncInfo.Status', type: 'string'},
        {name: 'item.SyncInfo.LastUpdated', type: 'string'},
        {name: 'item.SyncInfo.TotalBytes', type: 'string'},
      ],
      require: false
    }
  ];

  public bulkAction: string;
  public checkAll: boolean;
  public itemsCheck: any[];
  public isAnyItemChecked: boolean;
  public modalSub: Subscription

  constructor(
    private dataUtilService: DataUtilService,
    private apiDataService: ApiDataService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private datasService: DatasService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.listLimitCount = GeneralConstant.limitPaging;
    this.listLimitCountDefault = GeneralConstant.limitPaging;
    this.originalDataList = [];
    this.getAllData();

    this.bulkAction = '';
    this.datas = [];

    this.modalSub = this.modalService.result.subscribe(result => {
      let type = result.formType;
      let resultData = result.data;
      
      if (type === GeneralConstant.modalDataReturnType.attachRules) {
        this.getAllData();
      }
    });
  }

  ngOnDestroy(): void {
    this.modalSub.unsubscribe();
  }

  getAllData() {
    let getAllDataPayload = new Payload(PayloadsConstant.data.fetchSyncInfo, []);
    this.spinnerService.showSpinner('datas-id');
    this.apiDataService.executeQueryByServer(getAllDataPayload, 'data').subscribe(
      (response: any) => {
        let rawDatas = this.dataUtilService.convertXmlToJson(response);
        if (rawDatas.Result.Result) {
          this.originalDataList = this.dataUtilService.wrapObjToOneElementArray(
            rawDatas.Result.Result
          );
          this.datas = this.datasService.getDatasByLimitCount(this.originalDataList, this.listLimitCount);
          this.bulkAction = '';
          this.setBulkSelecting();
          this.spinnerService.hideSpinner();
        }
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  loadLessMore() {
    if (this.datas.length < this.originalDataList.length) {
      this.listLimitCount += this.listLimitCount;
    } else {
      this.listLimitCount = GeneralConstant.limitPaging;
    }

    this.datas = this.datas.getDatasByLimitCount(this.originalDataList, this.listLimitCount);
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
    this.itemsCheck = this.datas.map(data => {
      return {"id": data.SyncInfo.SyncInfoId, "value": false};
    });
    this.isAnyItemChecked = this.itemsCheck.some(itemCheck => itemCheck.value);
  }

  public onSelectAction() {
    let selectedDatas = this.itemsCheck.filter(item => item.value).map(data => {
      if (data.value) {
        return this.getDataById(data.id);
      };
    });

    this.spinnerService.showSpinner();
    let idDatas = selectedDatas.map(data => `<Id>${data.SyncInfo.SyncInfoId}</Id>`);
    let updateStatusPayoad = new Payload(
      PayloadsConstant.data.updateModelsStatus, [idDatas, this.bulkAction]
    );
    this.apiDataService.executeQueryByServer(updateStatusPayoad, 'data').subscribe(response => {
      let rawRes = this.dataUtilService.convertXmlToJson(response);
      let results = this.dataUtilService.wrapObjToOneElementArray(rawRes.Response.Result);
      let dataIds = results.map(result => result.SyncInfo.SyncInfoId);
      let names = [];
      if (this.bulkAction === 'Resume') {
        names = this.originalDataList.map(data => {
          if (data.SyncInfo.Status !== 'In-Sync' && dataIds.includes(data.SyncInfo.SyncInfoId)) {
            return data.SyncInfo.ModelName;
          }
        });
      } else {
        names = this.originalDataList.map(data => {
          if (data.SyncInfo.Status === 'In-Sync' && dataIds.includes(data.SyncInfo.SyncInfoId)) {
            return data.SyncInfo.ModelName;
          }
        });
      }

      this.notificationService.addNotification(`${this.bulkAction === 'Resume' ? 'Resumed' : 'Paused'} <b>${names.filter(name => name).join(', ')}</b> successfully`, 'success');
      this.getAllData();
      this.checkAll = false;
      this.spinnerService.hideSpinner();
    }, error => {
      console.log('Loading error');
    });
  }

  private getDataById(id) {
    return this.originalDataList.find(data => data.SyncInfo.SyncInfoId === id);
  }

  showAttachRules(selectedData) {
    this.selectedRules = this.dataUtilService.wrapObjToOneElementArray(selectedData.SyncInfo.SyncRule);
    this.modalService.openDataModal(
      AttachRulesComponent,
      {
        selectedData: selectedData,
        selectedRules: this.selectedRules
      },
      GeneralConstant.modalDataReturnType.attachRules
    );
  }
}
