import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataRoutingModule } from './data-routing.module';
import { DatasComponent } from './datas/datas.component';
import { RulesComponent } from './rules/rules.component';
import { RuleDetailComponent } from './rule-detail/rule-detail.component';
import { SharedModule } from '../shared/shared.module';
import { DatasService } from './datas/datas.service';
import { RulesService } from './rules/rules.service';
import { AttachRulesComponent } from './datas/attach-rules/attach-rules.component';
import { AttachRulesService } from './datas/attach-rules/attach-rules.service';

@NgModule({
  imports: [
    CommonModule,
    DataRoutingModule,
    SharedModule
  ],
  providers: [
    DatasService,
    RulesService,
    AttachRulesService
  ],
  entryComponents: [AttachRulesComponent],
  declarations: [DatasComponent, RulesComponent, RuleDetailComponent, AttachRulesComponent]
})
export class DataModule { }
