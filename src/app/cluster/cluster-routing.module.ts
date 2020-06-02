import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ClusterAlarmComponent} from "./cluster-alarm/cluster-alarm.component";
import {ClusterAlertComponent} from "./cluster-alert/cluster-alert.component";
import {ClusterListComponent} from "./cluster-list/cluster-list.component";

const clusterRoutes: Routes = [
  {path: 'clusters', component: ClusterListComponent},
  {path: 'clusters/alarm', component: ClusterAlarmComponent},
  {path: 'clusters/alert', component: ClusterAlertComponent},
];

@NgModule({
  imports: [RouterModule.forChild(clusterRoutes)],
  exports: [RouterModule]
})

export class ClusterRoutingModule {
}
