import { Injectable } from '@angular/core';
import { ApiDataService } from 'src/app/shared/services/api-data.service';
import { Observable, forkJoin } from 'rxjs';
import { Payload } from 'src/app/shared/models/payload';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';

@Injectable({
  providedIn: 'root'
})
export class DatasService {

  constructor(
    private apiDataService: ApiDataService
  ) { }

  formatData(raw): any {
    let data = {};
    for (let key in raw) {
      data[key] = raw[key].$ ? raw[key].$.Value : raw[key];
    }

    return data;
  }

  updateDatas(datas, data): any {
    datas.forEach(item => {
      if (item.data.AppId !== data.dataId) return;
      item.data = data;
    });

    return datas;
  }

  getDatasByLimitCount(originalDataList: any[], limit: number): any[] {
    let datas =  originalDataList.filter((data, index) => index < limit);
    return datas;
  }

  attachMultipleRuleToData(modelId, selectedRuleIdNames, oldSelectedRules) {
    if (oldSelectedRules.length) {
      let addRule = [];
      selectedRuleIdNames.forEach(rule => {
        if (oldSelectedRules.every(oldRule => oldRule.RuleId !== rule.id)) {
          let attachMultipleRuleToDataPayload = new Payload(
            PayloadsConstant.data.applyRuleToModel,
            [modelId, rule.id, '']
          );
          addRule.push(attachMultipleRuleToDataPayload);
        }
      });

      let removeRule = [];
      oldSelectedRules.forEach(oldRule => {
        if (selectedRuleIdNames.every(rule => rule.id !== oldRule.RuleId)) {
          let deAttachMultipleRuleToDataPayload = new Payload(
            PayloadsConstant.data.applyRuleToModel,
            [modelId, oldRule.RuleId, '<Removal>True</Removal>']
          );
          removeRule.push(deAttachMultipleRuleToDataPayload);
        }
      });
      return addRule.concat(removeRule);
    } else {
      return selectedRuleIdNames.map(rule => {
        return new Payload(
          PayloadsConstant.data.applyRuleToModel,
          [modelId, rule.id, '']
        );        
      });
    }
  }
}
