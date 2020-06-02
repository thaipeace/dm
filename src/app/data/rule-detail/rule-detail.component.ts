import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailService } from 'src/app/shared/services/detail.service';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';
import { DataUtilService } from 'src/app/shared/services/data-util.service';
import { Payload } from 'src/app/shared/models/payload';
import { ApiDataService } from 'src/app/shared/services/api-data.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-rule-detail',
  templateUrl: './rule-detail.component.html',
  styleUrls: ['./rule-detail.component.scss']
})
export class RuleDetailComponent implements OnInit {

  public selectedRule: any;
  public originalSelectedRule: any;
  public tabType: any;
  public currentTap: string;
  public targetConnectInfoValues: any[];
  public sectionType: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private detailService: DetailService,
    private dataUtilService: DataUtilService,
    private apiDataService: ApiDataService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    this.initSelectedRule();

    this.route.params.subscribe(async params => {
      if (params['ruleId'] === 'create') {
        this.sectionType = "create";
        this.selectedRule = {};
      } else {
        this.sectionType = "update";
        this.spinnerService.showSpinner();
        let rawRes = await this.getSelectedRuleById(params['ruleId']);
        let rawRule = this.dataUtilService.convertXmlToJsonParseAttributes(rawRes);

        if (rawRule.Response.Status === "Success") {
          this.selectedRule = rawRule.Response.Result.Rule;
          this.originalSelectedRule = Object.assign({}, this.selectedRule);
          this.spinnerService.hideSpinner();
        }
      }
      
      this.initSelectedRule();
    });
  }

  initSelectedRule() {
    this.currentTap = 'destination';

    this.selectedRule = {
      RuleId: this.sectionType === 'update' ? this.selectedRule.RuleId : '',
      RuleType: this.sectionType === 'update' ? this.selectedRule.RuleType : '',
      RetentionPolicyInfo: {
        RetainFor: this.sectionType === 'update' ?
          this.selectedRule.RetentionPolicyInfo.RetainFor : false,
        Interval: {
          Unit: this.sectionType === 'update' ? this.selectedRule.RetentionPolicyInfo.Interval.Unit : '',
          Time: this.sectionType === 'update' ? this.selectedRule.RetentionPolicyInfo.Interval.Time : '',
        },
        DeleteFor: this.sectionType === 'update' ? this.selectedRule.RetentionPolicyInfo.DeleteFor : '',
      },
      TargetConnectInfo: {
        SecretKey: this.sectionType === 'update' ? this.selectedRule.TargetConnectInfo.SecretKey : '',
        Url: this.sectionType === 'update' ? this.selectedRule.TargetConnectInfo.Url : '',
        Username: this.sectionType === 'update' ? this.selectedRule.TargetConnectInfo.Username : '',
        AccessKey: this.sectionType === 'update' ? this.selectedRule.TargetConnectInfo.AccessKey : '',
        Password: this.sectionType === 'update' ? this.selectedRule.TargetConnectInfo.Password : '',
        Brokers: this.sectionType === 'update' ? this.selectedRule.TargetConnectInfo.Brokers : '',
        BucketId: this.sectionType === 'update' ? this.selectedRule.TargetConnectInfo.BucketId : ''
      },
      RuleName: this.sectionType === 'update' ? this.selectedRule.RuleName : '',
      DestinationType: this.sectionType === 'update' ? this.selectedRule.DestinationType : '',
      FrequencyInfo: {
        Interval: {
          Unit: this.sectionType === 'update' ? this.selectedRule.FrequencyInfo.Interval.Unit : '',
          Time: this.sectionType === 'update' ? this.selectedRule.FrequencyInfo.Interval.Time : '',
        },
        OnChange: this.sectionType === 'update' ? this.selectedRule.FrequencyInfo.OnChange : '',
      },
      CreationTime: this.sectionType === 'update' ? this.selectedRule.CreationTime : '',
    }

    this.tabType = {
      destination: {
       next: 'frequency',
       back: null,
       done: false
      },
      frequency: {
        next: 'retentionPeriod',
        back: 'destination',
        done: false
      },
      retentionPeriod: { 
        next: 'review',
        back: 'frequency',
        done: false
      },
      review: {
        next: null,
        back: 'retentionPeriod',
        done: false
      }
    }
  }

  onBackTap() {
    this.currentTap = this.tabType[this.currentTap].back;
    this.tabType[this.currentTap].done = false;
  }

  onNextTap() {
    this.tabType[this.currentTap].done = true;
    this.currentTap = this.tabType[this.currentTap].next;

    this.targetConnectInfoValues = [];
    Object.keys(this.selectedRule.TargetConnectInfo).forEach(target => {
      if (this.selectedRule.TargetConnectInfo[target] !== '') {
        this.targetConnectInfoValues.push(this.selectedRule.TargetConnectInfo[target]);
      }
    });
  }

  onSave() {
    let upsertPayLoad = new Payload(
      PayloadsConstant.data.upsertRule,
      [
        this.selectedRule.RuleId ? `<RuleId>${this.selectedRule.RuleId}</RuleId>` : '',
        this.selectedRule.RuleName, this.selectedRule.RuleType, this.selectedRule.DestinationType,
        this.selectedRule.TargetConnectInfo.Url, this.selectedRule.TargetConnectInfo.AccessKey,
        this.selectedRule.TargetConnectInfo.SecretKey, this.selectedRule.TargetConnectInfo.BucketId,
        this.selectedRule.TargetConnectInfo.Username, this.selectedRule.TargetConnectInfo.Password,
        this.selectedRule.TargetConnectInfo.Brokers, this.selectedRule.FrequencyInfo.OnChange,
        this.selectedRule.FrequencyInfo.Interval.Time, this.selectedRule.FrequencyInfo.Interval.Unit,
        this.selectedRule.RetentionPolicyInfo.DeleteFor, this.selectedRule.RetentionPolicyInfo.RetainFor,
        this.selectedRule.RetentionPolicyInfo.Interval.Time, this.selectedRule.RetentionPolicyInfo.Interval.Unit
      ]
    );
    
    this.spinnerService.showSpinner();
    this.apiDataService.executeQueryByServer(upsertPayLoad, 'data').subscribe(response => {
      let rawRes = this.dataUtilService.convertXmlToJson(response);
      if (rawRes.Response.$.Status === 'Success') {
        this.spinnerService.hideSpinner();
        this.notificationService.addNotification(`Successfully ${this.selectedRule ? 'updated' : 'created'} rule`, 'success');
        setTimeout(() => {
          this.router.navigate(['/rules']);
        }, 500);
      }
      console.log(rawRes);
    }, error => {
      console.log('Loading error');
    });
  }

  getSelectedRuleById(id) {
    return this.detailService.getItemByTargetValue(
      PayloadsConstant.data.fetchRuleByTarget, 'RuleId', id, 'data'
    );
  }

  onChangeDestinationType() {
    this.selectedRule.TargetConnectInfo = {
      SecretKey: this.sectionType === 'update' ? this.originalSelectedRule.TargetConnectInfo.SecretKey : '',
      Url: this.sectionType === 'update' ? this.originalSelectedRule.TargetConnectInfo.Url : '',
      Username: this.sectionType === 'update' ? this.originalSelectedRule.TargetConnectInfo.Username : '',
      AccessKey: this.sectionType === 'update' ? this.originalSelectedRule.TargetConnectInfo.AccessKey : '',
      Password: this.sectionType === 'update' ? this.originalSelectedRule.TargetConnectInfo.Password : '',
      Brokers: this.sectionType === 'update' ? this.originalSelectedRule.TargetConnectInfo.Brokers : '',
      BucketId: this.sectionType === 'update' ? this.originalSelectedRule.TargetConnectInfo.BucketId : ''
    };
  }

  canNext() {
    switch (this.currentTap) {
      case 'frequency':
        if (this.selectedRule.FrequencyInfo.OnChange === 'true') {
          return true;
        } else {
          return this.selectedRule.FrequencyInfo.Interval.Time && 
            this.selectedRule.FrequencyInfo.Interval.Time > 0;
        }
      
      case 'retentionPeriod':
        if (['Immediately', 'Never'].includes(this.selectedRule.RetentionPolicyInfo.DeleteFor)) {
          return true;
        } else {
          return this.selectedRule.RetentionPolicyInfo.Interval.Time && 
            this.selectedRule.RetentionPolicyInfo.Interval.Time > 0;
        }
        
      default:
        return true;
    }
  }
}
