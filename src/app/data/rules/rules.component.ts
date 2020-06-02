import { Component, OnInit } from '@angular/core';
import { DataUtilService } from 'src/app/shared/services/data-util.service';
import { ApiDataService } from 'src/app/shared/services/api-data.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RulesService } from './rules.service';
import { GeneralConstant } from 'src/app/shared/constants/general.constant';
import { Payload } from 'src/app/shared/models/payload';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  public originalRuleList: any[];
  public rules: any;
  public searchText: string;
  public selectedRule: any;
  public listLimitCount: number;
  public listLimitCountDefault: number;
  public isShow: boolean = false;
  public fieldsValuePairs: any = [
    {
      fields: [
        {name: 'item.Rule.RuleName', type: 'string'},
        {name: 'item.Rule.RuleType', type: 'string'},
        {name: 'item.Rule.CreationTime', type: 'string'},
      ],
      require: false
    }
  ];

  public bulkAction: string;
  public checkAll: boolean;
  public itemsCheck: any[];
  public isAnyItemChecked: boolean;

  constructor(
    private dataUtilService: DataUtilService,
    private apiDataService: ApiDataService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private rulesService: RulesService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit() {
    this.listLimitCount = GeneralConstant.limitPaging;
    this.listLimitCountDefault = GeneralConstant.limitPaging;
    this.originalRuleList = [];
    this.getAllRule();

    this.bulkAction = '';
    this.rules = [];
  }

  getAllRule() {
    let getAllRulePayload = new Payload(PayloadsConstant.data.fetchRule, []);
    this.spinnerService.showSpinner('rules-id');
    this.apiDataService.executeQueryByServer(getAllRulePayload, 'data').subscribe(
      (response: any) => {
        let rawRules = this.dataUtilService.convertXmlToJson(response);
        if (rawRules.Result.$.Status !== "NoResult") {
          this.originalRuleList = this.dataUtilService.wrapObjToOneElementArray(
            rawRules.Result.Result
          );
          this.rules = this.rulesService.getRulesByLimitCount(this.originalRuleList, this.listLimitCount);
          this.bulkAction = '';
          this.setBulkSelecting();
        }
        
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  loadLessMore() {
    if (this.rules.length < this.originalRuleList.length) {
      this.listLimitCount += this.listLimitCount;
    } else {
      this.listLimitCount = GeneralConstant.limitPaging;
    }

    this.rules = this.rules.getRulesByLimitCount(this.originalRuleList, this.listLimitCount);
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
    this.itemsCheck = this.rules.map(rule => {
      return {"id": rule.Rule.RuleId, "value": false};
    });
    this.isAnyItemChecked = this.itemsCheck.some(itemCheck => itemCheck.value);
  }

  public onSelectAction() {
    let selectedRules = this.itemsCheck.filter(item => item.value).map(rule => {
      if (rule.value) {
        return this.getRuleById(rule.id);
      };
    });

    switch (this.bulkAction) {
      case 'delete':
        this.openConfirmationDialog(selectedRules);
        break;

      case 'default':
        return;
    }
  }

  private getRuleById(id) {
    return this.rules.find(rule => rule.Rule.RuleId === id);
  }

  public openConfirmationDialog(rules) {
    let ruleNames = rules.map(rule => rule.Rule.RuleName);
    this.confirmationDialogService.confirm(
      `Delete Rules(s)`,
      `Do you really want to delete ${ruleNames.join(', ')} rule(s) ?`
    ).then((confirmed) => {
      if (confirmed) {
        let type = 'success';
        let message = '';
        this.spinnerService.showSpinner();
        this.rulesService.deleteMultipleRule(rules).subscribe(responseList => {
          if (responseList.length !== rules.length) type = 'warning';
          responseList.forEach((res, index) => {
            message += `<div>${rules[index].Rule.RuleName} rule deleted successfully</div>`;
          });

          this.getAllRule();
          this.spinnerService.hideSpinner();
          this.notificationService.addNotification(message ? message : 'Delete not successful', type);
        });
      } else {
        this.getAllRule();
      }
    }).catch(() => this.getAllRule());
  }
}
