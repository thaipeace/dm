import { Injectable } from '@angular/core';
import { ApiDataService } from 'src/app/shared/services/api-data.service';
import { Observable, forkJoin } from 'rxjs';
import { Payload } from 'src/app/shared/models/payload';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  constructor(
    private apiDataService: ApiDataService
  ) { }

  formatRule(raw): any {
    let rule = {};
    for (let key in raw) {
      rule[key] = raw[key].$ ? raw[key].$.Value : raw[key];
    }

    return rule;
  }

  updateRules(rules, rule): any {
    rules.forEach(item => {
      if (item.rule.AppId !== rule.ruleId) return;
      item.rule = rule;
    });

    return rules;
  }

  getRulesByLimitCount(originalRuleList: any[], limit: number): any[] {
    let rules =  originalRuleList.filter((rule, index) => index < limit);
    return rules;
  }

  deleteMultipleRule(rules): Observable<any[]>  {
    return forkJoin(
      rules.map(rule => {
        let removeRulePayload = new Payload(PayloadsConstant.data.deleteRules, [rule.Rule.RuleId]);
        return this.apiDataService.executeQueryByServer(removeRulePayload, 'data');
      })
    );
  }
}
