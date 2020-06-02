import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { EdgeListComponent } from './edge-list/edge-list.component';
import { EdgeDetailComponent } from './edge-detail/edge-detail.component';

const edgeRoutes: Routes = [
  { 
    path: 'edges', component: EdgeListComponent, data: { 
      breadcrumb: [
        {label: "Edges", url: ""}
      ]
    },
    canActivate: [AuthGuard]
  },
  { 
    path: 'edges/edge/:edgeId', component: EdgeDetailComponent, data: {
      breadcrumb: [
        { label: "Edges", url: "/edges" },
        { label: ":edgeId", url: "" }
      ]
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(edgeRoutes)],
  exports: [RouterModule]
})
export class EdgeRoutingModule {
}
