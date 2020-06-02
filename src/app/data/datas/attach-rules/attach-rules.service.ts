import { Injectable } from '@angular/core';
import { Payload } from 'src/app/shared/models/payload';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';
import { ApiDataService } from 'src/app/shared/services/api-data.service';

@Injectable()
export class AttachRulesService {

  constructor(
    private apiDataService: ApiDataService
  ) { }

  attachRuleToData(modelId, ruleId) {
    let attachRuleToDataPayload = new Payload(
      PayloadsConstant.data.applyRuleToModel,
      [modelId, ruleId, '']
    );
    return this.apiDataService.executeQueryByServer(attachRuleToDataPayload, 'data').toPromise();
  }

  deAttachRuleToData(modelId, ruleId) {
    let deAttachRuleToDataPayload = new Payload(
      PayloadsConstant.data.applyRuleToModel,
      [modelId, ruleId, '<Removal>True</Removal>']
    );
    return this.apiDataService.executeQueryByServer(deAttachRuleToDataPayload, 'data').toPromise();
  }
}
