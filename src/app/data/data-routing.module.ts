import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatasComponent } from './datas/datas.component';
import { AuthGuard } from '../guard/auth.guard';
import { RulesComponent } from './rules/rules.component';
import { RuleDetailComponent } from './rule-detail/rule-detail.component';

const routes: Routes = [
  { 
    path: 'datas', component: DatasComponent, data: { 
      breadcrumb: [
        {label: "Data", url: ""}
      ]
    },
    canActivate: [AuthGuard]
  },
  { 
    path: 'rules', component: RulesComponent, data: { 
      breadcrumb: [
        {label: "Data", url: "/datas"},
        {label: "Rules", url: ""}
      ]
    },
    canActivate: [AuthGuard]
  },
  { 
    path: 'rules/:ruleId', component: RuleDetailComponent, data: {
      breadcrumb: [
        {label: "Data", url: "/datas"},
        {label: "Rules", url: "/rules"},
        {label: ":ruleId", url: ""},
      ]
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }
