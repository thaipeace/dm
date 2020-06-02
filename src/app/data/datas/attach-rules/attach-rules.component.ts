import { Component, OnInit, Input } from '@angular/core';
import { Payload } from 'src/app/shared/models/payload';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ApiDataService } from 'src/app/shared/services/api-data.service';
import { DataUtilService } from 'src/app/shared/services/data-util.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { GeneralConstant } from 'src/app/shared/constants/general.constant';
import { AttachRulesService } from './attach-rules.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-attach-rules',
  templateUrl: './attach-rules.component.html',
  styleUrls: ['./attach-rules.component.scss']
})
export class AttachRulesComponent implements OnInit {

  @Input() dataModal: any;
  public title: string;
  public rulesOriginal: any[];
  public rules: any[];
  public selectedRuleIds: any[];
  public selectedRuleId: string;

  constructor(
    private spinnerService: SpinnerService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private modalService: ModalService,
    private attachRulesService: AttachRulesService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.setRules();
  }

  setRules() {
    this.rules = [];
    let getApplicableRulePayload = new Payload(PayloadsConstant.data.fetchApplicableRule, []);
    this.spinnerService.showSpinner('rules-id');
    this.apiDataService.executeQueryByServer(getApplicableRulePayload, 'data').subscribe(
      (response: any) => {
        let rawRules = this.dataUtilService.convertXmlToJson(response);
        if (rawRules.Find.$.Status === "Success") {
          this.rulesOriginal = this.dataUtilService.wrapObjToOneElementArray(
            rawRules.Find.Result
          );

          this.selectedRuleIds = this.dataModal.selectedRules.map(rule => rule.RuleId);
          this.rules = this.rulesOriginal.filter(rule => !this.selectedRuleIds.includes(rule.Rule.RuleId));
        }
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  public close() {
    this.modalService.emitOutput({}, GeneralConstant.modalDataReturnType.attachRules);
    this.modalService.destroy();
  }

  public async onAttach() {
    let res = await this.attachRulesService.attachRuleToData(this.dataModal.selectedData.SyncInfo.SyncInfoId, this.selectedRuleId);
    let resRaw = this.dataUtilService.convertXmlToJson(res);
    if (resRaw.Response.Result.$.Status === "Success") {
      this.selectedRuleIds.push(this.selectedRuleId);
      this.dataModal.selectedRules = this.rulesOriginal.filter(rule => this.selectedRuleIds.includes(rule.Rule.RuleId)).map(
        rawRule => rawRule.Rule
      );
      this.rules = this.rulesOriginal.filter(rule => !this.selectedRuleIds.includes(rule.Rule.RuleId));
      this.notificationService.addNotification('Rule attachment was successful', 'success');
    } else {
      this.notificationService.addNotification('Rule attachment was not successful', 'danger');
    }
  }

  public async onRemoveRule(ruleId) {
    let res = await this.attachRulesService.deAttachRuleToData(this.dataModal.selectedData.SyncInfo.SyncInfoId, ruleId);
    let resRaw = this.dataUtilService.convertXmlToJson(res);
    if (resRaw.Response.Result.$.Status === "Success") {
      this.selectedRuleIds = this.selectedRuleIds.filter(id => id !== ruleId);
      this.dataModal.selectedRules = this.rulesOriginal.filter(rule => this.selectedRuleIds.includes(rule.Rule.RuleId)).map(
        rawRule => rawRule.Rule
      );
      this.rules = this.rulesOriginal.filter(rule => !this.selectedRuleIds.includes(rule.Rule.RuleId));
      this.notificationService.addNotification('Rule detachment was successful', 'success');
    } else {
      this.notificationService.addNotification('Rule detachment was not successful', 'danger');
    }
  }
}
