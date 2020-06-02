import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueryListComponent } from './query-list/query-list.component';
import { AuthGuard } from '../guard/auth.guard';

const queryRoutes: Routes = [
  { 
    path: 'queries', component: QueryListComponent, data: { 
      breadcrumb: [
        {label: "Queries", url: ""}
      ]
    },
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(queryRoutes)],
  exports: [RouterModule]
})
export class QueryRoutingModule { }
